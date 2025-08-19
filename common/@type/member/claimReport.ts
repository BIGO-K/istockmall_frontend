;import { MyOrder, MyOrderResponse } from '$/@type/myOrder/order';
import { OrderItem, OrderItemResponse } from '$/@type/myOrder/item';
import { WithRequiredProperty } from '$/@type';


type BaseClaimOrderReportOrder<T extends OrderItem> = WithRequiredProperty<Partial<MyOrder<T>>, 'orderId'|'packs'>
type BaseClaimOrderReportOrderResponse<T extends OrderItemResponse> = WithRequiredProperty<Partial<MyOrderResponse<T>>, 'order_id'|'packs'>

// 신고가능주문
interface ClaimReportableOrder extends BaseClaimOrderReportOrder<ClaimReportableOrderItem> {
    paidAt: string // 결제완료일자
    paymentMethodLabel: string
}
interface ClaimReportableOrderResponse extends BaseClaimOrderReportOrderResponse<ClaimReportableOrderItemResponse> {
    paid_at: string
    payment_method_label: string
}

// 신고가능 주문 아이템
type ClaimReportableOrderItem = WithRequiredProperty<OrderItem, "paidPrice"|"pointUsed">
type ClaimReportableOrderItemResponse = WithRequiredProperty<OrderItemResponse, "paid_price"|"point_used">


// 신고주문
interface ClaimReportedOrder extends BaseClaimOrderReportOrder<ClaimReportedOrderItem> {
    paidAt: string // 결제완료일자
    paymentMethodLabel: string // 결제수단 라벨
}
interface ClaimReportedOrderResponse extends BaseClaimOrderReportOrderResponse<ClaimReportedOrderItemResponse> {
    paid_at: string
    payment_method_label: string
}


// 신고주문아이템
interface ClaimReportedOrderItem extends ClaimReportableOrderItem {
    processStatusLabel: string; // '신고접수'|'처리완료'|'처리불가'
    reportedAt: string; // 신고일시
    processedAt: string; // 처리일시
    isComplete: boolean; // 완료여부
    isUnableToComplete: boolean // 처리불가 여부
}

interface ClaimReportedOrderItemResponse extends ClaimReportableOrderItemResponse {
    process_status_label: string;
    reported_at: string;
    processed_at: string;
    is_complete: boolean; // 완료여부
    is_unable_to_complete: boolean // 처리불가 여부
}

// 보상정책 정보
interface ClaimRewardPolicy {
    day: number
    rewardRate: number
}

interface ClaimRewardInfo {
    useDeliveryDelay: boolean;
    useSoldoutCancel: boolean;
    deliveryDelayRewardPolicies: ClaimRewardPolicy[],
    soldoutCancelRewardPolicies: ClaimRewardPolicy[],
    maximumRewardPrice: number
}

export type {
    ClaimReportableOrder,
    ClaimReportableOrderItem,
    ClaimReportedOrder,
    ClaimReportedOrderItem,
    ClaimReportableOrderResponse,
    ClaimReportableOrderItemResponse,
    ClaimReportedOrderResponse,
    ClaimReportedOrderItemResponse,
    ClaimRewardPolicy,
    ClaimRewardInfo
};
