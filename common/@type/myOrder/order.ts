import { ShippingAddress, ShippingAddressResponse } from "$/@type/order/order"
import { 
    BaseOrderItem, 
    BaseOrderItemResponse, 
    ExchangeableOrderItem, 
    ExchangeOrderItem, 
    ExchangeOrderItemResponse, 
    ExchangeToReturnableOrderItem,
    ReturnOrderItemResponse, 
    ReturnOrderItem, 
    ClaimableOrderItem, 
    CancelableOrderItem, 
    ReturnableOrderItem, 
    ClaimableOrderItemResponse,    
    CancelOrderItemResponse,
    CancelOrderItem,
    CancelableOrderItemResponse,
    ReturnableOrderItemResponse,
    ExchangeToReturnableOrderItemResponse,
    ExchangeableOrderItemResponse
} from "$/@type/myOrder/item"
import { PackResponse, PackWithItemSets, PackWithSeller, PackWithSellerResponse } from "$/@type/myOrder/pack"

/**
 * 마이페이지(회원/비회원) 주문
 */
interface MyOrder<T extends BaseOrderItem> {
    orderId: string             // 주문 ID
    orderedAt: string
    packs: PackWithSeller<T>[]
}


interface MyOrderResponse<T extends BaseOrderItemResponse> {
    order_id: string
    cancel_ids?: string[]
    return_ids?: string[]
    exchange_ids?: string[]
    origin_order_id?: string
    ordered_at: string
    packs: PackWithSellerResponse<T>[]
}

/**
 * 취소주문 
 */

interface CancelOrder extends MyOrder<CancelOrderItem> {}
interface CancelOrderResponse extends MyOrderResponse<CancelOrderItemResponse> {}

/**
 * 반품 주문
 */
interface ReturnOrder extends MyOrder<ReturnOrderItem> { returnId: string }
interface ReturnOrderResponse extends MyOrderResponse<ReturnOrderItemResponse> { return_id: string }

/**
 * 교환 주문
 */
interface ExchangeOrder extends MyOrder<ExchangeOrderItem> { exchangeId: string }
interface ExchangeOrderResponse extends MyOrderResponse<ExchangeOrderItemResponse> { exchange_id: string }


/**
 * 마이페이지(회원/비회원) 주문
 * 동일 주문상태/상품/옵션으로 그룹핑된 주문상품 리스트를 가지는 주문
 * API에서는 orderItem 형태로 조회하여 repository에서 orderItemSet 형태로 그룹핑 하므로 response 인터페이스는 필요하지 않음
 */
interface MyOrderWithItemSets<T extends ClaimableOrderItem> {
    orderId: string
    orderedAt: string
    packs: PackWithItemSets<T>[]
    paymentMethodLabel: string
}

/**
 * 취소/반품/교환/반품전환 가능 주문
 */
interface CancelableOrder extends MyOrderWithItemSets<CancelableOrderItem> { 
    isPaid: boolean 
    requireRefundAccount: boolean
}
interface ReturnableOrder extends MyOrderWithItemSets<ReturnableOrderItem> {
    shippingAddress: Omit<ShippingAddress, "id"|"shippingName">
}
interface ExchangeableOrder extends MyOrderWithItemSets<ExchangeableOrderItem> {
    shippingAddress: Omit<ShippingAddress, "id"|"shippingName">
}
interface ExchangeToReturnableOrder extends MyOrderWithItemSets<ExchangeToReturnableOrderItem> {
    shippingAddress: Omit<ShippingAddress, "id"|"shippingName">
}

// 취소/반품/교환/반품전환 가능 주문 response
interface ClaimableOrderResponse<T extends ClaimableOrderItemResponse> {
    order_id: string
    ordered_at: string
    packs: PackResponse<T>[]
    is_paid?: boolean
    payment_method_label: string
    shipping_address?: ShippingAddressResponse
    require_refund_account?: boolean
}

interface CancelableOrderResponse extends ClaimableOrderResponse<CancelableOrderItemResponse> {
    is_paid: boolean
    require_refund_account: boolean
}

interface ReturnableOrderResponse extends ClaimableOrderResponse<ReturnableOrderItemResponse> {
    shipping_address: ShippingAddressResponse
}

interface ExchangeableOrderResponse extends ClaimableOrderResponse<ExchangeableOrderItemResponse> {
    shipping_address: ShippingAddressResponse
}

interface ExchangeToReturnableOrderResponse extends ClaimableOrderResponse<ExchangeToReturnableOrderItemResponse> {
    shipping_address: ShippingAddressResponse
}



export type { 
    MyOrder, 
    MyOrderResponse,
    CancelableOrder,
    ReturnableOrder,
    CancelOrder,
    CancelOrderResponse,
    ReturnOrder,
    ReturnOrderResponse,
    ExchangeableOrder,
    ExchangeOrder,
    ExchangeOrderResponse,
    ExchangeToReturnableOrder,
    CancelableOrderResponse,
    ReturnableOrderResponse,
    ExchangeableOrderResponse,
    ExchangeToReturnableOrderResponse
}