import { WithRequiredProperty } from "$/@type"
import { Option, SimpleGoods, SimpleGoodsResponse } from "$/@type/goods"

interface BaseOrderItem {
    id: number
    orderStatusLabel?: string                // 주문상태 라벨
    goods: Required<SimpleGoods>
    sellerName?: string
}

interface BaseOrderItemResponse {
    id: number
    order_status_label?: string
    goods: Required<SimpleGoodsResponse>
    seller_name?: string
}

/**
 * 주문아이템
 */
interface OrderItem extends BaseOrderItem {
    cancelId?: string
    returnId?: string
    exchangeId?: string
    returnTargetId?: number
    exchangeTargetId?: number
    refundStatusLabel?: string               // [취소주문] 환불상태 라벨
    earnablePoint?: number                   // [일반주문]구매확정시 적립가능한 적립금
    pointUsed?: number                       // 해당 상품에 분배된 적립금 (회원일 경우존재)
    paidPrice?: number                       // 실결제가 (포인트,쿠폰,심야,즉시 할인 적용)
    cancelable?: boolean                     // [일반주문]취소가능
    deliveryTrackable?: boolean              // [일반주문]배송조회 가능
    receiptConfirmable?: boolean             // [일반주문]수취확인 가능
    returnable?: boolean                     // [일반주문]반품신청 가능 (배송완료후 7일)
    exchangeable?: boolean                   // [일반주문]교환신청 가능 (배송완료후 7일)
    purchaseConfirmable?: boolean            // [일반주문]구매확정 가능 (자동확정 전)
    reviewWritable?: boolean                 // [일반주문]리뷰 작성 가능 (구매확정후 30일)
    deliveryTrackingUrl?: string             // [일반주문]배송조회 url (배송가능시 존재)
    returnCancelable?: boolean               // [반품주문]반품철회 가능
    returnDeliveryTrackable?: boolean        // [반품주문|교환주문]반송조회 가능
    returnDeliveryTrackingUrl?: string       // [반품주문|교환주문]반송조회 url
    exchangedOptionName?: string             // [교환주문]교환된 옵션명
    exchangeCancelable?: boolean             // [교환주문]교환철회 가능
    toReturnSwitchable?: boolean             // [교환주문]반품전환 가능
}

interface OrderItemResponse extends BaseOrderItemResponse {
    cancel_id?: string
    return_id?: string
    exchange_id?: string
    return_target_id?: number
    exchange_target_id?: number
    refund_status_label: string
    earnable_point: number
    point_used?: number
    paid_price?: number
    cancelable?: boolean
    delivery_trackable?: boolean
    receipt_confirmable?: boolean
    returnable?: boolean
    exchangeable?: boolean
    purchase_confirmable?: boolean
    review_writable?: boolean
    delivery_tracking_url?: string
    return_cancelable?: boolean
    return_delivery_trackable?: boolean
    return_delivery_tracking_url?: string
    exchanged_option_name?: string 
    exchange_cancelable?: boolean
    to_return_switchable?: boolean
}

/**
 * 정상 주문 아이템
 */
type NormalOrderItem = WithRequiredProperty<OrderItem, 
    'orderStatusLabel'|
    'earnablePoint'|
    'pointUsed'|
    'paidPrice'|
    'cancelable'|
    'deliveryTrackable'|
    'receiptConfirmable'|
    'returnable'|
    'exchangeable'|
    'purchaseConfirmable'|
    'reviewWritable'|
    'deliveryTrackingUrl'
>

type NormalOrderItemResponse = WithRequiredProperty<OrderItemResponse,
    "order_status_label"|
    "earnable_point"|
    "point_used"|
    "paid_price"|
    "cancelable"|
    "delivery_trackable"|
    "receipt_confirmable"|
    "returnable"|
    "exchangeable"|
    "purchase_confirmable"|
    "review_writable"|
    "delivery_tracking_url"
>

/**
 * 취소주문
 */
type CancelOrderItem = WithRequiredProperty<OrderItem, 
    "orderStatusLabel"|
    "refundStatusLabel"|
    "paidPrice"|
    "pointUsed"
>
type CancelOrderItemResponse = WithRequiredProperty<OrderItemResponse,
    "order_status_label"|
    "refund_status_label"|
    "paid_price"|
    "point_used"
>

/**
 * 반품주문상품
 */
type ReturnOrderItem = WithRequiredProperty<OrderItem,
    "orderStatusLabel"|
    "paidPrice"|
    "pointUsed"|
    "returnCancelable"|
    "returnDeliveryTrackable"|
    "returnDeliveryTrackingUrl"|
    "returnTargetId"
>
type ReturnOrderItemResponse = WithRequiredProperty<OrderItemResponse,
    "order_status_label"|
    "paid_price"|
    "point_used"|
    "return_cancelable"|
    "return_delivery_trackable"|
    "return_delivery_tracking_url"|
    "return_target_id"
>

/**
 * 교환주문
 */
type ExchangeOrderItem = WithRequiredProperty<OrderItem,
    "orderStatusLabel"|
    "paidPrice"|
    "pointUsed"|
    "exchangedOptionName"|
    "exchangeCancelable"|
    "toReturnSwitchable"|
    "returnDeliveryTrackable"|
    "returnDeliveryTrackingUrl"|
    "exchangeTargetId"
>

type ExchangeOrderItemResponse = WithRequiredProperty<OrderItemResponse,
    "exchange_target_id"|
    "order_status_label"|
    "paid_price"|
    "point_used"|
    "exchanged_option_name"|
    "exchange_cancelable"|
    "to_return_switchable"|
    "return_delivery_trackable"|
    "return_delivery_tracking_url"|
    "exchange_target_id"
>


/**
 * 주문아이템 묶음(동일 배송상태, 동일상품, 동일옵션 기준)
 * 리스폰스는 이 형태로 받지 않고 orderItem 형태로 받아 repository에서 그룹핑
 * 취소/반품/교환 요청시에만 묶음처리 (추후 일반 주문상품도 묶어야한다면 해당 interface에 orderStatusCode 추가)
 */
interface OrderItemSet<T extends ClaimableOrderItem> extends WithRequiredProperty<BaseOrderItem, 'sellerName'> {
    orderStatusCode: number
    totalPointUsed: NonNullable<OrderItem['pointUsed']>
    totalPaidPrice: NonNullable<OrderItem['paidPrice']>
    items: T[]
}


/**
 * 취소/반품/교환 가능 주문아이템 공통 interface
 * 상품정보는 주문아이템묶음(ClaimOrderItemSet) 에 포함
 */
interface ClaimableOrderItem extends BaseOrderItem {
    orderStatusCode: number
    paidPrice: NonNullable<OrderItem['paidPrice']>   // 실결제가 (포인트,쿠폰,심야,즉시 할인 적용)
    pointUsed: NonNullable<OrderItem['pointUsed']>
    
    usedCouponTitle?: string
    exchangeTargetId?: OrderItem['exchangeTargetId']
    exchangeableOptions?: Option[]       // 교환가능 옵션 리스트
    exchangeOption?: Option|undefined    // 선택된 교환옵션
}

type CancelableOrderItem = ClaimableOrderItem
type ReturnableOrderItem = ClaimableOrderItem
type ExchangeableOrderItem = WithRequiredProperty<ClaimableOrderItem, 'exchangeableOptions'>
type ExchangeToReturnableOrderItem = WithRequiredProperty<ClaimableOrderItem, 'exchangeTargetId'>


interface  ClaimableOrderItemResponse extends BaseOrderItemResponse {
    order_status_label: string
    order_status_code: number
    paid_price: number
    point_used: number
    used_coupon_title: string
    exchangeable_options?: Option[]
    exchange_target_id?: number
}

type CancelableOrderItemResponse = ClaimableOrderItemResponse
type ReturnableOrderItemResponse = ClaimableOrderItemResponse
type ExchangeableOrderItemResponse = WithRequiredProperty<ClaimableOrderItemResponse, 'exchangeable_options'>
type ExchangeToReturnableOrderItemResponse = WithRequiredProperty<ClaimableOrderItemResponse, 'exchange_target_id'>


export type {
    BaseOrderItem,
    BaseOrderItemResponse,
    OrderItem,
    OrderItemResponse,
    NormalOrderItem, 
    NormalOrderItemResponse,
    CancelOrderItem,
    CancelOrderItemResponse,
    ReturnOrderItem,
    ReturnOrderItemResponse,
    ExchangeOrderItem,
    ExchangeOrderItemResponse,
    OrderItemSet,
    ClaimableOrderItem,
    ClaimableOrderItemResponse,
    CancelableOrderItem,
    CancelableOrderItemResponse,
    ReturnableOrderItem,
    ReturnableOrderItemResponse,
    ExchangeableOrderItem,
    ExchangeableOrderItemResponse,
    ExchangeToReturnableOrderItem,
    ExchangeToReturnableOrderItemResponse,
}