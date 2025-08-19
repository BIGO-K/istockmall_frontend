import { GiveAway } from '$/@type/goods';
import {
    ExchangeAdditionalPaymentPrice,
    ExchangeAdditionalPaymentPriceResponse,
    MyOrderAddress,
    MyOrderAddressResponse,
    PaymentInfo,
    PaymentInfoResponse,
    RefundInfo,
    RefundInfoResponse,
} from "$/@type/myOrder/index";
import {
    RefundAccount,
    RefundAccountResponse,
} from "$/@type/member/refundAccount";
import { ShippingAddress, ShippingAddressResponse } from "$/@type/order/order";
import {
    ChosenClaimReason,
    ChosenClaimReasonResponse,
} from "$/@type/myOrder/claimReason";
import {
    OrderItem,
    OrderItemResponse,
} from "$/@type/myOrder/item";
import { MyOrder, MyOrderResponse } from "$/@type/myOrder/order";
import { Pack, PackResponse } from "$/@type/myOrder/pack";
import { WithRequiredProperty } from '$/@type';

/**
 * 주문 상세
 */
interface MyOrderDetail extends MyOrder<Required<Omit<OrderItem,'sellerName'>>> {
    cancelIds: string[];
    returnIds: string[];
    exchangeIds: string[];
    originalOrderId?: string; // 원주문 ID (교환 > 새로 생성된 주문인 경우 존재)
    shippingAddressChangeable: boolean;
    receiptViewable: boolean;
    ordererInfo: {
        name: string;
        tel: string;
        email: string;
        personalClearanceCode?: string; // 개인통관고유부호
    };
    shippingAddress: Pick<ShippingAddress, "name" | "tel" | "zipCode" | "baseAddress" | "detailAddress"> & { message: string };
    paymentInfo: PaymentInfo;
    paymentSummary: {
        totalGoodsPrice: number;
        totalShippingPrice: number;
        discounts: {
            member: number;
            nightSale: number;
            immediatelySale: number;
        };
        usedCouponAmount: number;
        usedPoints: number;
        totalPrice: number;
    };
    giveaways?: GiveAway[]
}

interface MyOrderDetailResponse extends MyOrderResponse<Required<Omit<OrderItemResponse,'seller_name'>>> {
    cancel_ids: string[]; // 주문에 포함된 취소주문 ID 리스트
    return_ids: string[]; // 주문에 포함된 반품주문 ID 리스트
    exchange_ids: string[]; // 주문에 포함된 교환주문 ID 리스트
    original_order_id?: string;
    shipping_address_changeable: boolean;
    receipt_viewable: boolean;
    shipping_address: Pick<ShippingAddressResponse, "name" | "tel" | "zip_code" | "base_address" | "detail_address"> & { message: string };
    orderer_info: {
        name: string;
        tel: string;
        email: string;
        personal_clearance_code: string; // 개인통관고유부호
    };
    payment_info: PaymentInfoResponse;
    payment_summary: {
        total_goods_price: number;
        total_shipping_price: number;
        discounts: {
            member: number;
            night_sale: number;
            immediately_sale: number;
        };
        used_coupon_amount: number;
        used_points: number;
        total_price: number;
    };
    giveaways?: {
        id: number;
        name: string;
        condition_label: string;
        image_url: string;  
    }[];
}

/**
 * 취소/반품/교환 상세에 쓰이는 주문상품 인터페이스
 */
type ClaimDetailOrderItem = WithRequiredProperty<OrderItem, "id" | "pointUsed" | "paidPrice" | "goods">;
type ClaimDetailOrderItemResponse = WithRequiredProperty<OrderItemResponse, "id" | "point_used" | "paid_price" | "goods">;

/**
 * 취소상세
 */
interface CancelDetail {
    isCancelBeforePaid: boolean
    isContainApplyStatus: boolean
    packs: Pack<ClaimDetailOrderItem>[];
    reason: Pick<ChosenClaimReason, "label" | "detail">;
    // 품절취소의 경우 환불계좌정보 존재하지 않을 수 있음(카드/간편결제는 원주문결제수단으로 환불되기때문)
    refundAccount?: Required<RefundAccount>;
    refundInfo: RefundInfo;
}

interface CancelDetailResponse {
    is_cancel_before_paid: boolean
    is_contain_apply_status: boolean
    packs: PackResponse<ClaimDetailOrderItemResponse>[];
    reason: Pick<ChosenClaimReasonResponse, "label" | "detail">;
    refund_account: Required<RefundAccountResponse>;
    refund_info: RefundInfoResponse;
}

/**
 * 반품상세
 */
interface ReturnDetail {
    pack: Pack<ClaimDetailOrderItem>;
    reason: Pick<ChosenClaimReason, "label" | "detail">;
    retrieveInvoice?: {
        deliveryCompanyName: string;
        deliveryCompanyCode: string;
        invoiceNumber: string;
    };
    retrieveAddress?: MyOrderAddress;
    refundAccount?: Required<RefundAccount>;
    refundInfo: RefundInfo;
}

interface ReturnDetailResponse {
    pack: PackResponse<ClaimDetailOrderItemResponse>;
    reason: Pick<ChosenClaimReasonResponse, "label" | "detail">;
    retrieve_invoice?: {
        delivery_company_name: string;
        delivery_company_code: string;
        invoice_number: string;
    };
    retrieve_address?: MyOrderAddressResponse;
    refund_account: Required<RefundAccountResponse>;
    refund_info: RefundInfoResponse;
}

/**
 * 교환상세
 */
interface ExchangeDetail {
    pack: Pack<WithRequiredProperty<ClaimDetailOrderItem, 'exchangedOptionName'>>;
    reason: Pick<ChosenClaimReason, "label" | "detail">;
    exchangeAddress: MyOrderAddress;
    retrieveAddress?: MyOrderAddress;
    retrieveInvoice?: {
        deliveryCompanyName: string;
        deliveryCompanyCode: string;
        invoiceNumber: string;
    };
    additionalPaymentPrice: ExchangeAdditionalPaymentPrice;
    paymentInfo: Pick<Required<PaymentInfo>, "label" | "card">; // 교환 추가결제는 카드결제
}

interface ExchangeDetailResponse {
    pack: PackResponse<WithRequiredProperty<ClaimDetailOrderItemResponse, 'exchanged_option_name'>>;
    reason: Pick<ChosenClaimReasonResponse, "label" | "detail">;
    exchange_address: MyOrderAddressResponse;
    retrieve_address: MyOrderAddressResponse;
    retrieve_invoice?: {
        delivery_company_name: string;
        delivery_company_code: string;
        invoice_number: string;
    };
    additional_payment_price: ExchangeAdditionalPaymentPriceResponse;
    payment_info: Pick<Required<PaymentInfoResponse>, "label" | "card">; // 교환 추가결제는 카드결제
}

export {
    MyOrderDetail,
    MyOrderDetailResponse,
    CancelDetail,
    CancelDetailResponse,
    ReturnDetail,
    ReturnDetailResponse,
    ExchangeDetail,
    ExchangeDetailResponse,
    ClaimDetailOrderItem,
    ClaimDetailOrderItemResponse,
};
