import { typeCastBoolean, typeCastNumber } from '$/filters';
import { CancelableOrderItem, CancelableOrderItemResponse } from '$/@type/myOrder/item';
import { CancelableOrder, CancelOrder, CancelOrderResponse, CancelableOrderResponse } from '$/@type/myOrder/order';
import { RefundInfo, RefundInfoResponse, CancelForm } from '$/@type/myOrder';
import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository';
import { Moment } from 'moment';
import { CancelReason, CancelReasonResponse } from '$/@type/myOrder/claimReason';
import { useOrderItemSet } from '$/composables/mypage/order/myOrderComposable';
import { JsonMapper } from '$/dataMapper/jsonMapper';
class CancelRepository extends BaseRepository
{
    /**
     * 취소주문 리스트 조회
     * @param  {Moment} startDate
     * @param  {Moment} endDate
     */
    async getList(startDate: Moment, endDate: Moment): Promise<CancelOrder[]> {
        const { cancel_orders } = await this.dataSource.execute<{
            cancel_orders: CancelOrderResponse[]
        }>(
            "ORDER_CANCEL_LIST",
            {
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD'),
            },
            {}
        );

        return cancel_orders.map(order => {
            // 동일 셀러/배송정책 묶음 리스트
            const packs: CancelOrder['packs'] = order.packs.map(pack => {
                const seller: CancelOrder['packs'][0]['sellers'] = pack.sellers.map((seller) => {
                    return {
                        id: seller.id,
                        name: seller.name,
                        tel: seller.tel,
                        orderItems: seller.order_items.map(orderItem => {
                            return {
                                id: orderItem.id,
                                orderStatusLabel: orderItem.order_status_label,
                                refundStatusLabel: orderItem.refund_status_label,
                                paidPrice: orderItem.paid_price,
                                pointUsed: typeCastNumber(orderItem.point_used),
                                goods: {
                                    id: orderItem.goods.id,
                                    name: orderItem.goods.name,
                                    brandName: orderItem.goods.brand_name,
                                    thumbnailUrl: orderItem.goods.thumbnail_url,
                                    optionName: orderItem.goods.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                                    optionId: orderItem.goods.option_id,
                                    ea: 1,
                                    isSoldout: orderItem.goods.is_soldout,
                                }
                            }
                        })
                    }
                })
                return {
                    paidShippingPrice: pack.paid_shipping_price,
                    shippingRuleId: pack.shipping_rule_id,
                    sellers: seller
                }
            });
            
            // 주문 리스트
            return {
                orderId: order.order_id,
                orderedAt: order.ordered_at,
                packs: packs
            }
        })
    }
    
    /**
     * 주문과 주문내 취소가능 주문상품 조회
     * @param  {string} orderId
     * @returns Promise
     */
    async getCancelables(orderId: string): Promise<CancelableOrder> {
        const { cancelable_order } = await this.dataSource.execute<{
            cancelable_order: CancelableOrderResponse
        }>(
            "ORDER_CANCEL_CANCELABLES",
            {
                order_id: orderId
            },
            {}
        );

        const { groupByOrderItemSet } = useOrderItemSet();
        
        return {
            orderId: cancelable_order.order_id,
            orderedAt: cancelable_order.ordered_at,
            isPaid: typeCastBoolean(cancelable_order.is_paid),
            requireRefundAccount: typeCastBoolean(cancelable_order.require_refund_account),
            paymentMethodLabel: cancelable_order.payment_method_label,
            packs: cancelable_order.packs.map((pack) => {
                const items:CancelableOrderItem[] = pack.order_items.map(item => {
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
                        },
                    }
                });

                return {
                    shippingRuleId: pack.shipping_rule_id,
                    paidShippingPrice: typeCastNumber(pack.paid_shipping_price),
                    orderItemSets: groupByOrderItemSet(items)
                }
            })
        }
    }

    /**
     * 취소사유 리스트 조회
     * @returns Promise
     */
    async getCancelReasons(): Promise<CancelReason[]> {
        const { cancel_reasons } = await this.dataSource.execute<{
            cancel_reasons: CancelReasonResponse[]
        }>(
            "CONF_CANCEL_REASONS",
            {},
            {}
        );
        
        return cancel_reasons.map(reason => {
            return {
                code: reason.code,
                label: reason.label,
                engLabel: '',
                requireDetail: reason.require_detail,
            }
        })
    }

    /**
     * 환불금액 정보 조회
     * @param  {number[]} orderItemIds
     * @param  {number} cancelReasonCode
     * @returns Promise
     */
    async getRefundInfo(orderId: string, orderItemIds: number[], cancelReasonCode: number): Promise<RefundInfo> {
        const { refund_info } = await this.dataSource.execute<{
            refund_info: RefundInfoResponse
        }>(
            "ORDER_CANCEL_REFUND_INFO",
            {
                order_id: orderId,
                order_item_ids: orderItemIds,
                cancel_reason_code: cancelReasonCode,
            },
            {
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
     * 취소 처리
     * @param  {number[]} orderItemIds
     * @param  {number} cancelReasonCode
     * @param  {string} cancelReasonDetail
     * @param  {RefundAccount} refundAccount
     * @returns Promise
     */
    async cancel(orderId: string, cancelForm: CancelForm): Promise<string[]> {
        const { cancel_ids } = await this.dataSource.execute<{ cancel_ids: string[] }>(
            "ORDER_CANCEL",
            {},
            {
                order_id: orderId,
                order_item_ids: cancelForm.orderItemIds,
                cancel_reason_code: cancelForm.reason,
                cancel_reason_detail: cancelForm.reasonDetail,
                refund_account_owner_name: cancelForm.refundAccount.ownerName,
                refund_bank_code: cancelForm.refundAccount.bankCode,
                refund_account_number: cancelForm.refundAccount.accountNumber,
            }
        );

        return cancel_ids || []
    }
}

const cancelRepository = new CancelRepository(
    new BackendMapper
)

export {
    cancelRepository
}