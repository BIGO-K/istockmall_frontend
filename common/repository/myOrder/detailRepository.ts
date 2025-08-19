import { GiveAway } from '$/@type/goods';
import BaseRepository from '$/repository/baseRepository';
import { BackendMapper } from '$/dataMapper/backendMapper';
import { CancelDetail, 
    CancelDetailResponse, 
    ClaimDetailOrderItem, 
    ExchangeDetail, 
    ExchangeDetailResponse, 
    MyOrderDetail, 
    MyOrderDetailResponse, 
    ReturnDetail, 
    ReturnDetailResponse 
} from '$/@type/myOrder/detail';
import { JsonMapper } from '$/dataMapper/jsonMapper';
import { typeCastBoolean, typeCastNumber } from '$/filters';

class DetailRepository extends BaseRepository
{
    /**
     * 주문상세 조회
     * @param  {string} orderId
     * @returns Promise
     */
    async get(orderId: string): Promise<MyOrderDetail> {
        const { order, cancel_ids, return_ids, exchange_ids } = await this.dataSource.execute<{
            order: MyOrderDetailResponse
            cancel_ids: [],
            return_ids: [],
            exchange_ids: [],
        }>(
            "ORDER_DETAIL",
            {
                order_id: orderId,
            },
            {}
        );

        const giveaways: GiveAway[] = (order.giveaways || []).map(giveaway => {
            return {
                id: giveaway.id,
                name: giveaway.name,
                conditionLabel: giveaway.condition_label,
                imageUrl: giveaway.image_url
            }
        })

        return {
            orderId: order.order_id,
            cancelIds: cancel_ids,
            returnIds: return_ids,
            exchangeIds: exchange_ids,
            orderedAt: order.ordered_at,
            originalOrderId: order.original_order_id,
            shippingAddressChangeable: order.shipping_address_changeable,
            receiptViewable: order.receipt_viewable,
            shippingAddress: {
                name: order.shipping_address.name,
                tel: order.shipping_address.tel,
                zipCode: order.shipping_address.zip_code,
                baseAddress: order.shipping_address.base_address,
                detailAddress: order.shipping_address.detail_address,
                message: order.shipping_address.message
            },
            ordererInfo: {
                name: order.orderer_info.name,
                tel: order.orderer_info.tel,
                email: order.orderer_info.email,
                personalClearanceCode: order.orderer_info.personal_clearance_code
            },
            paymentInfo: {
                label: order.payment_info.label,
                buyPoint: order.payment_info.buy_point,
                card: order.payment_info.card ? {
                    label: order.payment_info.card.label,
                    maskingNumber: order.payment_info.card.masking_number,
                    approvedAt: order.payment_info.card.approved_at,
                } : undefined,
                bankAccount: order.payment_info.bank_account ? {
                    accountNumber: order.payment_info.bank_account.account_number,
                    bankName: order.payment_info.bank_account.bank_name,
                    inputExpireAt: order.payment_info.bank_account.input_expire_at,
                } : undefined,
                mobileApproveAt: order.payment_info.mobile?.approved_at || '',
                exceptBuyPoint: typeCastNumber(order.payment_info.except_buy_point)
            },
            paymentSummary: {
                totalGoodsPrice: order.payment_summary.total_goods_price,
                totalShippingPrice: order.payment_summary.total_shipping_price,
                discounts: {
                    member: order.payment_summary.discounts.member,
                    nightSale: order.payment_summary.discounts.night_sale,
                    immediatelySale: order.payment_summary.discounts.immediately_sale,
                },
                usedCouponAmount: order.payment_summary.used_coupon_amount,
                usedPoints: order.payment_summary.used_points,
                totalPrice: order.payment_summary.total_price
            },
            packs: order.packs.map(pack => {
                const sellers: MyOrderDetail['packs'][0]['sellers'] = pack.sellers.map(seller => {
                    const orderItems: MyOrderDetail['packs'][0]['sellers'][0]['orderItems'] = seller.order_items.map(item => {
                        return {
                            id: item.id,
                            cancelId: item.cancel_id || '',
                            returnId: item.return_id || '',
                            exchangeId: item.exchange_id || '',
                            returnTargetId: typeCastNumber(item.return_target_id),
                            exchangeTargetId: typeCastNumber(item.exchange_target_id),
                            orderStatusLabel: item.order_status_label,
                            refundStatusLabel: item.refund_status_label,
                            earnablePoint: item.earnable_point,
                            pointUsed: typeCastNumber(item.point_used),
                            paidPrice: item.paid_price,
                            cancelable: item.cancelable,
                            deliveryTrackable: item.delivery_trackable,
                            deliveryTrackingUrl: item.delivery_tracking_url,
                            receiptConfirmable: item.receipt_confirmable,
                            returnable: item.returnable,
                            exchangeable: item.exchangeable,
                            purchaseConfirmable: item.purchase_confirmable,
                            reviewWritable: item.review_writable,
                            returnCancelable: item.return_cancelable,
                            returnDeliveryTrackable: item.return_delivery_trackable,
                            returnDeliveryTrackingUrl: item.return_delivery_tracking_url,
                            exchangedOptionName: item.exchanged_option_name,
                            exchangeCancelable: item.exchange_cancelable,
                            toReturnSwitchable: item.to_return_switchable,
                            goods: {
                                id: item.goods.id,
                                name: item.goods.name,
                                brandName: item.goods.brand_name,
                                thumbnailUrl: item.goods.thumbnail_url,
                                optionName: item.goods.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                                optionId: item.goods.option_id,
                                isSoldout: item.goods.is_soldout,
                                ea: 1
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
            }),
            giveaways: giveaways
        }
    }

    /**
     * @param  {string} cancelId
     * @returns Promise
     */
    async getCancelDetail(cancelId: string): Promise<CancelDetail> {
        const { cancel_detail } = await this.dataSource.execute<{
            cancel_detail: CancelDetailResponse
        }>(
            "ORDER_CANCEL_DETAIL",
            {
                cancel_id: cancelId
            },
            {}
        );
        
        const refundAccount: CancelDetail["refundAccount"] = cancel_detail.refund_account ? {
            ownerName: cancel_detail.refund_account.owner_name,
            accountNumber: cancel_detail.refund_account.account_number,
            bankCode: cancel_detail.refund_account.bank_code,
            bankName: cancel_detail.refund_account.bank_name,
        } : undefined

        return {
            isCancelBeforePaid: typeCastBoolean(cancel_detail.is_cancel_before_paid),
            isContainApplyStatus: typeCastBoolean(cancel_detail.is_contain_apply_status),
            packs: cancel_detail.packs.map(pack => {
                const orderItems:ClaimDetailOrderItem[] = pack.order_items.map(item => {
                    return {
                        id: item.id,
                        pointUsed: typeCastNumber(item.point_used),
                        paidPrice: item.paid_price,
                        sellerName: item.seller_name,
                        goods: {
                            id: item.goods.id,
                            name: item.goods.name,
                            brandName: item.goods.brand_name,
                            thumbnailUrl: item.goods.thumbnail_url,
                            optionName: item.goods.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                            optionId: item.goods.option_id,
                            isSoldout: item.goods.is_soldout,
                            ea: 1
                        }
                    }
                })
                return {
                    shippingRuleId: pack.shipping_rule_id,
                    paidShippingPrice: pack.paid_shipping_price,
                    orderItems: orderItems
                }
            }),
            reason: {
                label: cancel_detail.reason.label,
                detail: cancel_detail.reason.detail || ''
            },
            refundAccount: refundAccount,
            refundInfo: {
                totalPaidPrice: cancel_detail.refund_info.total_paid_price,
                refundPrice: cancel_detail.refund_info.refund_price,
                refundPoint: cancel_detail.refund_info.refund_point,
                calculateDetails: cancel_detail.refund_info.calculate_details.map(detail => {
                    return {
                        label: detail.label,
                        amount: detail.amount,
                        isSubtracted: detail.is_substracted,
                    }
                })
            }
        }
    }

    /**
     * @param  {string} returnId
     * @returns Promise
     */
    async getReturnDetail(returnId: string): Promise<ReturnDetail> {
        const { return_detail } = await this.dataSource.execute<{
            return_detail: ReturnDetailResponse
        }>(
            "ORDER_RETURN_DETAIL",
            {
                return_id: returnId
            },
            {}
        );
        
        // 반품송장정보
        const retrieveInvoice: ReturnDetail["retrieveInvoice"]|undefined = return_detail.retrieve_invoice ? {
            deliveryCompanyName: return_detail.retrieve_invoice.delivery_company_name,
            deliveryCompanyCode: return_detail.retrieve_invoice.delivery_company_code,
            invoiceNumber: return_detail.retrieve_invoice.invoice_number,
        } : undefined;

        // 반품수거지
        const retrieveAddress: ReturnDetail["retrieveAddress"]|undefined = return_detail.retrieve_address && return_detail.retrieve_address.base_address ? {
            name: return_detail.retrieve_address.name,
            tel: return_detail.retrieve_address.tel,
            zipCode: return_detail.retrieve_address.zip_code,
            baseAddress: return_detail.retrieve_address.base_address,
            detailAddress: return_detail.retrieve_address.detail_address,
        } : undefined

        // 환불계좌
        const refundAccount: ReturnDetail["refundAccount"]|undefined = return_detail.refund_account ? {
            ownerName: return_detail.refund_account.owner_name,
            accountNumber: return_detail.refund_account.account_number,
            bankCode: return_detail.refund_account.bank_code,
            bankName: return_detail.refund_account.bank_name,
        } : undefined

        return {
            pack: {
                shippingRuleId: return_detail.pack.shipping_rule_id,
                paidShippingPrice: return_detail.pack.paid_shipping_price,
                orderItems: return_detail.pack.order_items.map(item => {
                    return {
                        id: item.id,
                        pointUsed: typeCastNumber(item.point_used),
                        paidPrice: item.paid_price,
                        sellerName: item.seller_name,
                        goods: {
                            id: item.goods.id,
                            name: item.goods.name,
                            brandName: item.goods.brand_name,
                            thumbnailUrl: item.goods.thumbnail_url,
                            optionName: item.goods.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                            optionId: item.goods.option_id,
                            isSoldout: item.goods.is_soldout,
                            ea: 1
                        }
                    }
                })
            },
            retrieveInvoice: retrieveInvoice,
            reason: {
                label: return_detail.reason.label,
                detail: return_detail.reason.detail || ''
            },
            retrieveAddress: retrieveAddress,
            refundAccount: refundAccount,
            refundInfo: {
                totalPaidPrice: return_detail.refund_info.total_paid_price,
                refundPrice: return_detail.refund_info.refund_price,
                refundPoint: return_detail.refund_info.refund_point,
                calculateDetails: return_detail.refund_info.calculate_details.map(detail => {
                    return {
                        label: detail.label,
                        amount: detail.amount,
                        isSubtracted: detail.is_substracted,
                    }
                })
            }
        }
    }

    /**
     * @param  {string} exchangeId
     * @returns Promise
     */
    async getExchangeDetail(exchangeId: string): Promise<ExchangeDetail> {
        const { exchange_detail } = await this.dataSource.execute<{
            exchange_detail: ExchangeDetailResponse
        }>(
            "ORDER_EXCHANGE_DETAIL",
            {
                exchange_id: exchangeId
            },
            {}
        );
        
        const retrieveInvoice: ExchangeDetail["retrieveInvoice"] = exchange_detail.retrieve_invoice ? {
            deliveryCompanyName: exchange_detail.retrieve_invoice.delivery_company_name,
            deliveryCompanyCode: exchange_detail.retrieve_invoice.delivery_company_code,
            invoiceNumber: exchange_detail.retrieve_invoice.invoice_number,
        } : undefined;

        const retrieveAddress: ExchangeDetail["retrieveAddress"] = exchange_detail.retrieve_address && exchange_detail.retrieve_address.base_address ? {
            name: exchange_detail.retrieve_address.name,
            tel: exchange_detail.retrieve_address.tel,
            zipCode: exchange_detail.retrieve_address.zip_code,
            baseAddress: exchange_detail.retrieve_address.base_address,
            detailAddress: exchange_detail.retrieve_address.detail_address,
        } : undefined;

        const paymentInfo: ExchangeDetail["paymentInfo"] = exchange_detail.payment_info ? {
            label: exchange_detail.payment_info.label,
            card: {
                label: exchange_detail.payment_info.card.label,
                maskingNumber: exchange_detail.payment_info.card.masking_number,
                approvedAt: exchange_detail.payment_info.card.approved_at,
            }
        } : undefined
        return {
            pack: {
                shippingRuleId: exchange_detail.pack.shipping_rule_id,
                paidShippingPrice: exchange_detail.pack.paid_shipping_price,
                orderItems: exchange_detail.pack.order_items.map(item => {
                    return {
                        id: item.id,
                        pointUsed: typeCastNumber(item.point_used),
                        paidPrice: item.paid_price,
                        exchangedOptionName: item.exchanged_option_name.replace('/', ' '),
                        sellerName: item.seller_name,
                        goods: {
                            id: item.goods.id,
                            name: item.goods.name,
                            brandName: item.goods.brand_name,
                            thumbnailUrl: item.goods.thumbnail_url,
                            optionName: item.goods.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                            optionId: item.goods.option_id,
                            isSoldout: item.goods.is_soldout,
                            ea: 1
                        }
                    }
                })
            },
            retrieveInvoice: retrieveInvoice,
            reason: {
                label: exchange_detail.reason.label,
                detail: exchange_detail.reason.detail || ''
            },
            retrieveAddress: retrieveAddress,
            exchangeAddress: {
                name: exchange_detail.exchange_address.name,
                tel: exchange_detail.exchange_address.tel,
                zipCode: exchange_detail.exchange_address.zip_code,
                baseAddress: exchange_detail.exchange_address.base_address,
                detailAddress: exchange_detail.exchange_address.detail_address,
            },
            additionalPaymentPrice: {
                payTypeLabel:exchange_detail.additional_payment_price.pay_type_label,
                totalPrice: exchange_detail.additional_payment_price.total_price,
                calculateDetails: exchange_detail.additional_payment_price.calculate_details.map(detail => {
                    return {
                        label: detail.label,
                        amount: detail.amount
                    }
                })
            },
            paymentInfo: paymentInfo
        }
    }
}

const orderDetailRepository = new DetailRepository(
    new BackendMapper
);

export {
    orderDetailRepository
}