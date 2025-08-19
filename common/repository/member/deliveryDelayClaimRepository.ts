import { typeCastNumber, typeCastBoolean } from '$/filters';
import { Paginator, PaginatorResponse } from '$/@type';
import { 
    ClaimReportableOrder, 
    ClaimReportableOrderItem, 
    ClaimReportableOrderResponse, 
    ClaimReportedOrder, 
    ClaimReportedOrderItem,
    ClaimReportedOrderResponse,
    ClaimRewardPolicy, 
} from '$/@type/member/claimReport';
import { BackendMapper } from '$/dataMapper/backendMapper';
import { JsonMapper } from '$/dataMapper/jsonMapper';
import BaseRepository from '$/repository/baseRepository';

class DeliveryDelayClaimRepository extends BaseRepository
{
    /**
     * 신고가능 주문 조회
     * @param  {number} page
     * @param  {number} perPage
     * @returns Promise
     */
    async getReportableOrders(page: number, perPage: number): Promise<Paginator<ClaimReportableOrder>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<ClaimReportableOrderResponse>>(
            'MEMBER_CLAIM_DELIVERY_DELAY_REPORTABLE_ORDER_ITEMS',
            {
                page: page,
                page_size: perPage,
            },
            {}
        );

        const orderList: ClaimReportableOrder[] = paginator.data.map(order => {
            // 포장단위
            const packs: ClaimReportableOrder['packs'] = order.packs.map(pack => {
                const sellers: ClaimReportableOrder['packs'][0]['sellers'] = pack.sellers.map(seller => {
                    const orderItems: ClaimReportableOrderItem[] = seller.order_items.map(orderItem => {
                        return {
                            id: orderItem.id,
                            orderStatusLabel: orderItem.order_status_label,
                            paidPrice: orderItem.paid_price,
                            pointUsed: typeCastNumber(orderItem.point_used),
                            goods: {
                                id: orderItem.goods.id,
                                name: orderItem.goods.name,
                                brandName: orderItem.goods.brand_name,
                                thumbnailUrl: orderItem.goods.thumbnail_url,
                                optionName: orderItem.goods.option_name.replace(/\/|(\@\^\@)|(\^\@\^)/gi, ' '),
                                ea: 1,
                                optionId: orderItem.goods.option_id,
                                isSoldout: typeCastBoolean(orderItem.goods.is_soldout),
                            }
                        }
                    });

                    return {
                        id: seller.id,
                        name: seller.name,
                        orderItems: orderItems
                    }
                })

                return {
                    paidShippingPrice: pack.paid_shipping_price,
                    shippingRuleId: pack.shipping_rule_id,
                    sellers: sellers
                }
            });

            return {
                orderId: order.order_id,
                paidAt: order.paid_at,
                paymentMethodLabel: order.payment_method_label,
                packs: packs
            }
        })

        return {
            total: paginator.total,
            currentPage: paginator.current_page,
            perPage: paginator.per_page,
            data: orderList,
        }
    }

    /**
     * 배송지연 신고
     * @param  {number[]} orderItemIds
     * @returns Promise
     */
    async reportOrderItems(orderItemId: number): Promise<void> {
        await this.dataSource.execute<void>(
            'MEMBER_CLAIM_REPORT_DELIVERY_DELAY_ORDER_ITEMS',
            {
                order_item_id: orderItemId,
            },
            {}
        );
    }

    /**
     * 배송지연 신고 주문 조회
     * @param  {number} page
     * @param  {number} perPage
     * @returns Promise
     */
    async getReportedOrders(page: number, perPage: number): Promise<Paginator<ClaimReportedOrder>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<ClaimReportedOrderResponse>>(
            "MEMBER_CLAIM_DELIVERY_DELAY_REPORTED_ORDER_ITEMS",
            {
                page: page,
                page_size: perPage,
            },
            {}
        );

        const orderList: ClaimReportedOrder[] = paginator.data.map(order => {
            // 포장단위
            const packs: ClaimReportedOrder['packs'] = order.packs.map(pack => {
                const sellers: ClaimReportedOrder['packs'][0]['sellers'] = pack.sellers.map(seller => {
                    const orderItems: ClaimReportedOrderItem[] = seller.order_items.map(orderItem => {
                        return {
                            id: orderItem.id,
                            orderStatusLabel: orderItem.order_status_label,
                            paidPrice: orderItem.paid_price,
                            pointUsed: typeCastNumber(orderItem.point_used),
                            processStatusLabel: orderItem.process_status_label,
                            reportedAt: orderItem.reported_at,
                            processedAt: orderItem.processed_at,
                            isComplete: orderItem.is_complete,
                            isUnableToComplete: orderItem.is_unable_to_complete,
                            goods: {
                                id: orderItem.goods.id,
                                name: orderItem.goods.name,
                                brandName: orderItem.goods.brand_name,
                                thumbnailUrl: orderItem.goods.thumbnail_url,
                                optionName: orderItem.goods.option_name.replace(/\/|(\@\^\@)|(\^\@\^)/gi, ' '),
                                ea: 1,
                                optionId: orderItem.goods.option_id,
                                isSoldout: typeCastBoolean(orderItem.goods.is_soldout),
                            }
                        }
                    });

                    return {
                        id: seller.id,
                        name: seller.name,
                        orderItems: orderItems,
                    }
                })

                return {
                    paidShippingPrice: pack.paid_shipping_price,
                    shippingRuleId: pack.shipping_rule_id,
                    sellers: sellers
                }
            });

            return {
                orderId: order.order_id,
                paidAt: order.paid_at,
                paymentMethodLabel: order.payment_method_label,
                packs: packs
            }
        });

        return {
            total: paginator.total,
            currentPage: paginator.current_page,
            perPage: paginator.per_page,
            data: orderList,
        }
    }
}

const deliveryDelayClaimRepository = new DeliveryDelayClaimRepository(
    new BackendMapper
)

export { deliveryDelayClaimRepository }