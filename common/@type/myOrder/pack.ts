import { Seller, SellerResponse } from "$/@type/goods";
import { BaseOrderItem, BaseOrderItemResponse, ClaimableOrderItem, OrderItemSet } from "$/@type/myOrder/item";

interface BasePack {
    shippingRuleId: number
    paidShippingPrice: number  // 도서산간비 포함
}

interface BasePackResponse {
    shipping_rule_id: number
    paid_shipping_price: number
}

/**
 * 포장단위
 */
interface Pack<T extends BaseOrderItem> extends BasePack {
    orderItems: T[],
}

interface PackResponse<T extends BaseOrderItemResponse> extends BasePackResponse {
    order_items: T[]
}

/**
 * seller 별로 묶인 주문상품 리스트를 가지는 PACK
 */
interface PackWithSeller<T extends BaseOrderItem> extends BasePack {
    sellers: (Seller & {
        orderItems: T[]
    })[]
}

interface PackWithSellerResponse<T extends BaseOrderItemResponse> extends BasePackResponse {
    sellers: (SellerResponse & {
        order_items: T[]
    })[]
}

/**
 * 동일 주문상태/상품/옵션으로 그룹핑된 주문상품 리스트를 가지는 Pack
 * API에서는 orderItem 형태로 조회하여 repository에서 orderItemSet 형태로 그룹핑 하므로 response 인터페이스는 필요하지 않음
 */
interface PackWithItemSets<T extends ClaimableOrderItem> extends BasePack {
    orderItemSets: OrderItemSet<T>[],
}

export type { 
    Pack,
    PackResponse,
    PackWithSeller,
    PackWithSellerResponse,
    PackWithItemSets,
}