import { typeCastBoolean, typeCastNumber } from '$/filters';
import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository';
import { Moment } from 'moment';
import { MyOrder, MyOrderResponse } from '$/@type/myOrder/order';
import { OrderStatus } from '$/@type/myOrder';
import { NormalOrderItem, NormalOrderItemResponse } from '$/@type/myOrder/item';
import { ShippingAddress } from '$/@type/order/order';
import { ApprovedReceiptDetail, CanceledReceiptDetail, EntireReceiptDetail, Receipt, ReceiptResponse } from '$/@type/myOrder/receipt';
import { JsonMapper } from '$/dataMapper/jsonMapper';
class MyOrderRepository extends BaseRepository 
{
    /**
     * 정상주문 상태 코드 리스트
     */
    normalOrderStatusCodes: OrderStatus[] = []; 

    /**
     * 주문 리스트 조회
     * @param  {Moment} startDate
     * @param  {Moment} endDate
     * @param  {number} statusCode
     * @returns Promise
     */
    async getList(
        startDate: Moment, 
        endDate: Moment, 
        statusCode:number
    ): Promise<MyOrder<NormalOrderItem>[]>{
        const { orders } = await this.dataSource.execute<{
            orders: MyOrderResponse<NormalOrderItemResponse>[]
        }>(
            "MEMBER_ORDER_LIST",
            {
                status_code: statusCode || "",
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD'),
            },
            {}
        );

        return orders.map(order => {
            // 포장단위
            const packs: MyOrder<NormalOrderItem>['packs'] = order.packs.map(pack => {
                const sellers: MyOrder<NormalOrderItem>['packs'][0]['sellers'] = pack.sellers.map(seller => {
                    const orderItems: NormalOrderItem[] = seller.order_items.map(orderItem => {
                        return {
                            id: orderItem.id,
                            orderStatusLabel: orderItem.order_status_label,
                            cancelable: orderItem.cancelable,                                   // 취소가능
                            deliveryTrackable: orderItem.delivery_trackable,                    // 배송조회 가능
                            receiptConfirmable: orderItem.receipt_confirmable,                  // 수취확인 가능
                            returnable: orderItem.returnable,                                   // 반품신청 가능
                            exchangeable: orderItem.exchangeable,                               // 교환신청 가능
                            purchaseConfirmable: orderItem.purchase_confirmable,                // 구매확정 가능
                            reviewWritable: orderItem.review_writable,                          // 리뷰작성 가능
                            deliveryTrackingUrl: orderItem.delivery_tracking_url,               // 배송조회 url
                            paidPrice: orderItem.paid_price,                                   // 실결제액(배송비제외)
                            pointUsed: typeCastNumber(orderItem.point_used),                    // 주문상품에 분배된 사용포인트
                            earnablePoint: orderItem.earnable_point,
                            goods: {
                                id: orderItem.goods.id,
                                name: orderItem.goods.name,
                                brandName: orderItem.goods.brand_name,
                                thumbnailUrl: orderItem.goods.thumbnail_url,
                                optionName: orderItem.goods.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                                optionId: orderItem.goods.option_id,
                                ea: 1,
                                isSoldout: typeCastBoolean(orderItem.goods.is_soldout),
                            }
                        }
                    })
                    return {
                        id: seller.id,
                        name: seller.name,
                        tel: seller.tel,
                        orderItems: orderItems,
                    }
                })
                return {
                    shippingRuleId: pack.shipping_rule_id,
                    paidShippingPrice: pack.paid_shipping_price,
                    sellers: sellers,
                }
            });

            // 주문 리스트
            return {
                orderId: order.order_id,
                orderedAt: order.ordered_at,
                packs: packs
            }
        });
    }
    
    /**
     * 정상주문 주문상태 코드,라벨 리스트 SETTER 
     * @returns Promise
     */
    async setNormalOrderStatusCodes(): Promise<void>{
        const { order_status_codes } =  await this.dataSource.execute<{
            order_status_codes: {
                code: number;
                label: string;
                need_review_guide: boolean;
            }[]
        }>(
            "MEMBER_ORDER_STATUS_CODES",
            {},
            {}
        );

        this.normalOrderStatusCodes = order_status_codes.map(status => {
            return {
                code: status.code,
                label: status.label,
                needReviewGuide: typeCastBoolean(status.need_review_guide),
            }
        })
    }

    /**
     * 정상주문 주문상태 코드,라벨 리스트 GETTER 
     * @returns Promise
     */
    async getNormalOrderStatusCodes(): Promise<OrderStatus[]>{
        if (!this.normalOrderStatusCodes.length) {
            await this.setNormalOrderStatusCodes();
        }

        return this.normalOrderStatusCodes;
    }

    /**
     * 구매확정처리
     * @param  {number} orderItemId
     * @returns Promise
     */
    async confirmPurchase(orderItemId: number): Promise<void>{
        await this.dataSource.execute<void>(
            "ORDER_CONFIRM_PURCHASE",
            {
                order_item_id: orderItemId,
            },
            {}
        );
    }
    
    /**
     * 수취 확인 처리
     * @param  {number} orderItemId
     * @returns Promise
     */
    async confirmReceipt(orderItemId: number): Promise<void>{
        await this.dataSource.execute<void>(
            "ORDER_CONFIRM_RECEIPT",
            {
                order_item_id: orderItemId,
            },
            {}
        );
    }

    /**
     * 배송지 변경 > 내 배송지에 등록된 배송지 ID를 통해 변경
     * @param  {string} orderId
     * @param  {number} shippingAddressId
     */
    async updateDeliveryAddressId(orderId: string, deliveryAddressId: number) {
        await this.dataSource.execute<void>(
            "ORDER_UPDATE_DELIVERY_ADDRESS_ID",
            {
                order_id: orderId,
                delivery_address_id: deliveryAddressId
            },
            {}
        );
    }

    /**
     * 배송지 변경 > 배송지 주소 정보 입력 통해 변경
     * @param  {string} orderId
     */
    async updateDeliveryAddressInfo(orderId: string, shippingAddress: Pick<ShippingAddress, "name"|"tel"|"zipCode"|"baseAddress"|"detailAddress">) {
        await this.dataSource.execute<void>(
            'ORDER_UPDATE_DELIVERY_ADDRESS_INFO',            
            {},
            {
                order_id: orderId,
                receiver_name: shippingAddress.name,
                receiver_tel: shippingAddress.tel,
                zip_code: shippingAddress.zipCode,
                base_address: shippingAddress.baseAddress,
                detail_address: shippingAddress.detailAddress,
            },
        );
    }

    /**
     * 영수증 조회
     * @param orderId 
     * @returns 
     */
    async getReceipt(orderId: string): Promise<Receipt> {
        const { receipt } = await this.dataSource.execute<{
            receipt: ReceiptResponse
        }>(
            "ORDER_RECEIPT",
            {
                order_id: orderId
            },
            {}
        );
        
        // 전체
        const allDetailCard: EntireReceiptDetail["card"] = receipt.all.card ? {
            name: receipt.all.card.name,
            maskedNumber: receipt.all.card.masked_number,
            installment: receipt.all.card.installment,
            tid: receipt.all.card.tid
        } : undefined;
        const allDetailVbank: EntireReceiptDetail["virtualBank"] = receipt.all.virtual_bank ? {
            bankName: receipt.all.virtual_bank.bank_name,
            virtualAccountNumber: receipt.all.virtual_bank.virtual_account_number,
        } : undefined
        const allCashReceipt: EntireReceiptDetail["cashReceipt"] = receipt.all.cash_receipt ? {
            status: receipt.all.cash_receipt.status,
            useType: receipt.all.cash_receipt.use_type,
            maskedRequestNumber: receipt.all.cash_receipt.masked_request_number,
            authCode: receipt.all.cash_receipt.auth_code,
        } : undefined
        const allDetail: EntireReceiptDetail = {
            payMethodName: receipt.all.pay_method_name,
            status: receipt.all.status,
            paidAt: receipt.all.paid_at,
            canceledAt: receipt.all.canceled_at || '',
            card: allDetailCard,
            virtualBank: allDetailVbank,
            cashReceipt: allCashReceipt,
            paymentPrice: receipt.all.payment_price,
            canceledPrice: receipt.all.canceled_price,
            balancePrice: receipt.all.balance_price,
        }
        // 승인
        const approveDetailCard: ApprovedReceiptDetail["card"] = receipt.approve.card ? {
            name: receipt.approve.card.name,
            maskedNumber: receipt.approve.card.masked_number,
            installment: receipt.approve.card.installment,
            tid: receipt.approve.card.tid
        } : undefined;
        const approveDetailVbank: ApprovedReceiptDetail["virtualBank"] = receipt.approve.virtual_bank ? {
            bankName: receipt.approve.virtual_bank.bank_name,
            virtualAccountNumber: receipt.approve.virtual_bank.virtual_account_number,
        } : undefined
        const approveCashReceipt: ApprovedReceiptDetail["cashReceipt"] = receipt.approve.cash_receipt ? {
            status: receipt.approve.cash_receipt.status,
            useType: receipt.approve.cash_receipt.use_type,
            maskedRequestNumber: receipt.approve.cash_receipt.masked_request_number,
            authCode: receipt.approve.cash_receipt.auth_code,
        } : undefined
        const approveDetail: ApprovedReceiptDetail = {
            payMethodName: receipt.approve.pay_method_name,
            status: receipt.approve.status,
            paidAt: receipt.approve.paid_at,
            canceledAt: receipt.approve.canceled_at || '',
            card: approveDetailCard,
            virtualBank: approveDetailVbank,
            cashReceipt: approveCashReceipt,
            paymentPrice: receipt.approve.payment_price,
            taxPrice: receipt.approve.tax_price,
            surtaxPrice: receipt.approve.surtax_price,
            taxFreePrice: receipt.approve.tax_free_price,
        }
        // 취소(부분취소)
        const cancelDetails: CanceledReceiptDetail[] = (receipt.cancels || []).map(cancelDetail => {
            const cancelDetailCard: CanceledReceiptDetail["card"] = cancelDetail.card ? {
                name: cancelDetail.card.name,
                maskedNumber: cancelDetail.card.masked_number,
                installment: cancelDetail.card.installment,
                tid: cancelDetail.card.tid
            } : undefined;
            const cancelDetailVbank: CanceledReceiptDetail["virtualBank"] = cancelDetail.virtual_bank ? {
                bankName: cancelDetail.virtual_bank.bank_name,
                virtualAccountNumber: cancelDetail.virtual_bank.virtual_account_number,
            } : undefined
            const cancelCashReceipt: CanceledReceiptDetail["cashReceipt"] = cancelDetail.cash_receipt ? {
                status: cancelDetail.cash_receipt.status,
                useType: cancelDetail.cash_receipt.use_type,
                maskedRequestNumber: cancelDetail.cash_receipt.masked_request_number,
                authCode: cancelDetail.cash_receipt.auth_code,
            } : undefined
            return {
                payMethodName: cancelDetail.pay_method_name,
                status: cancelDetail.status,
                paidAt: cancelDetail.paid_at,
                canceledAt: cancelDetail.canceled_at || '',
                card: cancelDetailCard,
                virtualBank: cancelDetailVbank,
                cashReceipt: cancelCashReceipt,
                paymentPrice: cancelDetail.payment_price,
                taxPrice: cancelDetail.tax_price,
                surtaxPrice: cancelDetail.surtax_price,
                taxFreePrice: cancelDetail.tax_free_price,
                canceledPrice: cancelDetail.canceled_price,
                balancePrice: cancelDetail.balance_price,
                cancelPrice: cancelDetail.cancel_price,
                refundId: cancelDetail.refund_id,
            }
        })

        return {
            all: allDetail,
            approve: approveDetail,
            cancels: cancelDetails,
            paymentCompanyInfo: {
                name: receipt.payment_company_info.name,
                businessNumber: receipt.payment_company_info.business_number,
                ceo: receipt.payment_company_info.ceo,
                phone: receipt.payment_company_info.phone,
                address: receipt.payment_company_info.address,
                homepageUrl: receipt.payment_company_info.homepage_url,
            }
        }
    }

    
    /**
     * 영수증 이메일 전송
     * @param  {string} orderId
     * @param  {string} email
     * @param  {'all'|'approve'|'cancel'='all'} type
     * @param  {string} refund_id?
     */
    async sendReceiptToEmail(orderId: string, email: string, type: 'all'|'approve'|'cancel' = 'all', refundId?: string) {
        await this.dataSource.execute<void>(
            "ORDER_SEND_RECEIPT_TO_EMAIL",
            {
                order_id: orderId,
                email: email,
                type: type,
                refund_id: refundId
            },
            {}
        )
    }
}


const myOrderRepository = new MyOrderRepository(
    new BackendMapper
)

export {
    myOrderRepository
}