import { 
    ReturnableOrderItem, 
    ReturnOrderItem,
} from '$/@type/myOrder/item';
import {
    ReturnableOrderResponse,
    ReturnableOrder,
    ReturnOrder,
    ReturnOrderResponse,
} from '$/@type/myOrder/order';
import { RefundInfo, RefundInfoResponse, ReturnForm } from '$/@type/myOrder';
import { AddressForm,  RetrieveMethod, RetrieveMethodResponse } from '$/@type/myOrder';
import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository';
import {CLAIM_REASON_ICON_CLASS} from '$/constants';
import { Moment } from 'moment';
import { ReturnReason, ReturnReasonResponse } from '$/@type/myOrder/claimReason';
import { typeCastNumber } from '$/filters';
import { useOrderItemSet } from '$/composables/mypage/order/myOrderComposable';
import { JsonMapper } from '$/dataMapper/jsonMapper';
class ReturnRepository extends BaseRepository {
    
    reasons: ReturnReason[] = [];

    /**
     * 반품주문 리스트 조회
     * @param  {Moment} startDate
     * @param  {Moment} endDate
     */
    async getList(startDate: Moment, endDate: Moment): Promise<ReturnOrder[]> {
        const { return_orders } = await this.dataSource.execute<{
            return_orders: ReturnOrderResponse[]
        }>(
            "ORDER_RETURN_LIST",
            {
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD'),
            },
            {}
        );

        return return_orders.map(order => {
            // 포장단위
            const packs: ReturnOrder['packs'] = order.packs.map(pack => {
                const sellers: ReturnOrder['packs'][0]['sellers'] = pack.sellers.map(seller => {
                    const orderItems: ReturnOrderItem[] = seller.order_items.map(orderItem => {
                        return {
                            id: orderItem.id,
                            returnTargetId: orderItem.return_target_id,
                            orderStatusLabel: orderItem.order_status_label,
                            returnCancelable: orderItem.return_cancelable,
                            returnDeliveryTrackable: orderItem.return_delivery_trackable,
                            returnDeliveryTrackingUrl: orderItem.return_delivery_tracking_url,
                            paidPrice: orderItem.paid_price,
                            pointUsed: typeCastNumber(orderItem.point_used),
                            goods: {
                                id: orderItem.goods.id,
                                name: orderItem.goods.name,
                                brandName: orderItem.goods.brand_name,
                                thumbnailUrl: orderItem.goods.thumbnail_url,
                                optionName: orderItem.goods.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                                optionId: orderItem.goods.option_id,
                                isSoldout: orderItem.goods.is_soldout,
                                ea: 1,
                            }
                        }
                    })
                    return {
                        id: seller.id,
                        name: seller.name,
                        tel: seller.tel,
                        orderItems: orderItems
                    }
                })
                return {
                    paidShippingPrice: pack.paid_shipping_price,
                    shippingRuleId: pack.shipping_rule_id,
                    sellers: sellers,
                }
            });
            
            // 주문 리스트
            return {
                orderId: order.order_id,
                returnId: order.return_id,
                orderedAt: order.ordered_at,
                packs: packs
            }
        })
    }

    /**
     * 주문및 선택한주문상품과 묶음반품가능 주문상품 조회
     * @param  {string} orderId
     * @returns Promise
     */
    async getReturnable(orderId: string, orderItemId: number): Promise<{
        order: ReturnableOrder
        availableRetrieveMethods: RetrieveMethod[]
    }> {
        const { returnable_order, available_retrieve_methods } = await this.dataSource.execute<{
            returnable_order: ReturnableOrderResponse
            available_retrieve_methods: RetrieveMethodResponse[]
        }>(
            "ORDER_RETURN_RETURNABLE",
            {
                order_id: orderId,
                order_item_id: orderItemId
            },
            {}
        );

        const { groupByOrderItemSet } = useOrderItemSet()
        
        return {
            order: {
                orderId: returnable_order.order_id,
                orderedAt: returnable_order.ordered_at,
                paymentMethodLabel: returnable_order.payment_method_label || '',
                shippingAddress: {
                    name: returnable_order.shipping_address.name,
                    tel: returnable_order.shipping_address.tel,
                    zipCode: returnable_order.shipping_address.zip_code,
                    baseAddress: returnable_order.shipping_address.base_address,
                    detailAddress: returnable_order.shipping_address.detail_address,
                },
                packs: returnable_order.packs.map((pack) => {
                    const items:ReturnableOrderItem[] = pack.order_items.map(item => {
                        return {
                            id: item.id,
                            orderStatusLabel: item.order_status_label,
                            orderStatusCode: item.order_status_code,
                            paidPrice: item.paid_price,
                            pointUsed: typeCastNumber(item.point_used),
                            usedCouponTitle: item.used_coupon_title,
                            sellerName: item.seller_name,
                            goods: {
                                id: item.goods.id,
                                name: item.goods.name,
                                brandName: item.goods.brand_name,
                                thumbnailUrl: item.goods.thumbnail_url,
                                optionName: item.goods.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                                ea: 1,
                                isSoldout: item.goods.is_soldout,
                                optionId: item.goods.option_id,
                            }
                        }
                    });

                    return {
                        shippingRuleId: pack.shipping_rule_id,
                        paidShippingPrice: pack.paid_shipping_price,
                        orderItemSets: groupByOrderItemSet(items)
                    }
                })
            },
            availableRetrieveMethods: available_retrieve_methods.map(method => {
                return {
                    code: method.code,
                    label: method.label,
                    isRetrieveByOrderer: method.is_retrieve_by_orderer,
                    isAutoRetrieve: method.is_auto_retrieve,
                }
            })
        }
    }
    
    /**
     * 반품사유 조회 SETTER
     */
    async setReturnReasons(): Promise<void> {
        const { return_reasons } = await this.dataSource.execute<{
            return_reasons: ReturnReasonResponse[]
        }>(
            "CONF_RETURN_REASONS",
            {},
            {}
        );
        
        this.reasons = return_reasons.map(reason => {
            return {
                code: reason.code,
                label: reason.label,
                engLabel: reason.eng_label,
                iconClassName: CLAIM_REASON_ICON_CLASS[reason.eng_label.toUpperCase()] || '',
                requireDetail: reason.require_detail,
                censure: reason.censure
            }
        });
    }

    /**
     * 반품사유 조회 GETTER
     */
    async getReturnReasons(): Promise<ReturnReason[]> {
        if (this.reasons.length < 1) {
            await this.setReturnReasons();
        }
        
        return this.reasons;
    }

    /**
     * 환불금액 정보 조회
     * @param  {string} orderId
     * @param  {number[]} orderItemIds
     * @param  {number} reasonCode
     * @param  {number} retrieveMethod
     * @param  {AddressForm} retrieveAddress
     * @returns Promise
     */
    async getRefundInfo(
        orderId: string, 
        orderItemIds: number[], 
        reasonCode: number, 
        retrieveMethod:number, 
        retrieveAddress: AddressForm
    ): Promise<RefundInfo> {
        const { refund_info } = await this.dataSource.execute<{
            refund_info: RefundInfoResponse
        }>(
            "ORDER_RETURN_REFUND_INFO",
            {
                order_id: orderId,
            },
            {
                order_item_ids: orderItemIds,
                return_reason_code: reasonCode,
                retrieve_method: retrieveMethod,
                retrieve_zip_code: retrieveAddress.zipCode,
                retrieve_base_address: retrieveAddress.baseAddress,
                retrieve_detail_address: retrieveAddress.detailAddress,
            }
        );

        return {
            totalPaidPrice: refund_info.total_paid_price,
            refundPrice: refund_info.refund_price,
            refundPoint: refund_info.refund_point,
            calculateDetails: refund_info.calculate_details.map(detail => {
                return {
                    label: detail.label,
                    amount: detail.amount,
                    isSubtracted: detail.is_substracted,
                }
            })
        }
    }
    
    /**
     * 반품 신청
     * @param  {string} orderId         주문번호
     * @param  {ReturnForm} returnForm  반품 신청 form
     */
    async applyReturn(orderId: string, returnForm: ReturnForm): Promise<string[]> {
        const { return_ids } = await this.dataSource.execute<{
            return_ids: string[]
        }>(
            "ORDER_RETURN",
            {},
            {
                order_id: orderId,
                order_item_ids: returnForm.orderItemIds,
                return_reason_code: returnForm.returnReason,
                return_reason_detail: returnForm.returnReasonDetail,
                retrieve_method_code: returnForm.retrieveMethod,
                // 반품송장정보
                retrieve_invoice: {
                    delivery_company: returnForm.retrievedShippingInfo.deliveryCompany || '',
                    invoice_number: returnForm.retrievedShippingInfo.invoiceNumber || '',
                },
                // 반품 수거지 정보
                retrieve_from: {
                    name: returnForm.retrieveAddress.name || '',
                    tel: returnForm.retrieveAddress.tel || '',
                    zip_code: returnForm.retrieveAddress.zipCode || '',
                    base_address: returnForm.retrieveAddress.baseAddress || '',
                    detail_address: returnForm.retrieveAddress.detailAddress || '',
                },
                //환불계좌 정보
                refund_account: {
                    owner_name: returnForm.refundAccount.ownerName,
                    bank_code: returnForm.refundAccount.bankCode,
                    account_number: returnForm.refundAccount.accountNumber,
                }
            }
        );
        return return_ids || []
    }

    /**
     * 반품 철회 처리
     * @param  {string} returnId
     * @param  {number} returnTargetId
     * @returns Promise
     */
    async cancelReturn(returnId: string, returnTargetId: number): Promise<void>{
        await this.dataSource.execute<void>(
            "ORDER_RETURN_CANCEL",
            {
                return_id: returnId,
                return_target_id: returnTargetId
            },
            {}
        );
    }

    /**
     * 반품 > 반품송장정보 수정
     * @param  {string} returnId
     * @param  {string} deliveryCompanyCode
     * @param  {string} invoiceNumber
     */
    async updateRetrieveInvoice(returnId: string, deliveryCompanyCode: string, invoiceNumber: string) {
        await this.dataSource.execute<void>(
            "ORDER_RETURN_UPDATE_RETRIEVE_INVOICE",
            {
                return_id: returnId,
                delivery_company_code: deliveryCompanyCode,
                invoice_no: invoiceNumber
            },
            {}
        );
    }

    /**
     * 반품 > 반품송장번호 유효성 검사
     * @param  {string} deliveryCompany
     * @param  {string} invoiceNumber
     */
    async validateInvoice(deliveryCompany: string, invoiceNumber: string) {
        await this.dataSource.execute<void>(
            "ORDER_RETURN_VALIDATE_INVOICE",
            {
                delivery_company: deliveryCompany,
                invoice_number: invoiceNumber,
            },
            {}
        );
    }
}

const returnRepository = new ReturnRepository(
    new BackendMapper
)

export {
    returnRepository
}