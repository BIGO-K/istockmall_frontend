import { ComputedRef } from "vue";
import { RefundAccount } from "$/@type/member/refundAccount";
import { ShippingAddress, ShippingAddressResponse } from "$/@type/order/order";

/**
 * 주문상태 코드,라벨
 */
interface OrderStatus {
    code: number;
    label: string;
    needReviewGuide: boolean;
}

type AddressForm = Pick<ShippingAddress, "zipCode" | "baseAddress" | "detailAddress">;

/**
 * 내 주문 > 주소정보
 */
type MyOrderAddress = Pick<ShippingAddress, "name" | "tel" | "zipCode" | "baseAddress" | "detailAddress">;
type MyOrderAddressResponse = Pick<ShippingAddressResponse, "name" | "tel" | "zip_code" | "base_address" | "detail_address">;

/**
 * 내주문 > 결제정보
 */
interface PaymentInfo {
    label: string; // 결제수단
    buyPoint: number; // 구매적립금액
    // 카드결제(간편결제 > 카드결제 포함)인 경우 존재하는 프로퍼티
    card?: {
        label: string; // 카드사명
        maskingNumber: string; // 마스킹된 카드번호
        approvedAt: string; // 결제 승인일시
    };
    // 무통장입금, 에스크로 결제인 경우 존재하는 프로퍼티
    bankAccount?: {
        accountNumber: string;
        bankName: string;
        inputExpireAt: string;
    };
    // 휴대폰 결제인 경우 존재하는 프로퍼티
    mobileApproveAt?: string; // 결제승인일시
    exceptBuyPoint: number; // 취소완료/반품완료 제외 구매적립금액 (존재하지 않을시 0원)
}

interface PaymentInfoResponse {
    label: string;
    buy_point: number;
    card?: {
        label: string;
        masking_number: string;
        approved_at: string;
    };
    bank_account?: {
        account_number: string;
        bank_name: string;
        input_expire_at: string;
    };
    mobile?: {
        approved_at?: string;
    },
    except_buy_point: number;
}

/**
 * 반품회수방법
 */
interface RetrieveMethod {
    code: number;
    label: string;
    isRetrieveByOrderer: boolean; // 고객직접회수여부
    isAutoRetrieve: boolean; // 자동회수 여부
}

interface RetrieveMethodResponse {
    code: number;
    label: string;
    is_retrieve_by_orderer: boolean;
    is_auto_retrieve: boolean;
}

/**
 * 환불정보
 */
interface RefundInfo {
    totalPaidPrice: number; // 상품 주문금액
    refundPrice: number; // 환불금액
    refundPoint: number; // 환불 적립금
    // 계산내역
    calculateDetails: {
        label: string;
        amount: number;
        isSubtracted: boolean; // 차감계산 여부
    }[];
}
interface RefundInfoResponse {
    total_paid_price: number;
    refund_price: number;
    refund_point: number;
    calculate_details: {
        label: string;
        amount: number;
        is_substracted: boolean;
    }[];
}

interface CancelForm {
    orderItemIds: number[];
    reason: string | number;
    reasonDetail: string;
    refundAccount: RefundAccount;
}

/**
 * 반품 요청 form
 */
interface ReturnForm {
    orderItemIds: number[] | ComputedRef<number[]>;
    returnReason: string | number;
    returnReasonDetail: string;
    retrieveMethod: string | number;
    retrievedShippingInfo: {
        deliveryCompany: string;
        invoiceNumber: string;
    };
    retrieveAddress: Omit<ShippingAddress, "id" | "shippingName">;
    refundAccount: RefundAccount
}

/**
 * 교환 > 반품 전환 요청 form
 */
type ExchangeToReturnForm = {
    exchangeTargetIds: number[] | ComputedRef<number[]>;
    refundAccount: RefundAccount
};

/**
 * 교환 요청 form
 */
interface ExchangeForm {
    exchangeOptionPairs:
        | ComputedRef<ExchangeOptionPair[]>
        | ExchangeOptionPair[];
    reason: string | number;
    reasonDetail: string;
    retrieveMethod: string | number;
    retrievedShippingInfo: {
        deliveryCompanyCode: string;
        invoiceNumber: string;
    };
    retrieveAddress: Omit<ShippingAddress, "id" | "shippingName">;
    exchangeAddress: Omit<ShippingAddress, "id" | "shippingName">;
    isAdditionalPaymentPaid: boolean;
    paymentToken: string;
}

interface ExchangeOptionPair {
    orderItemId: number;
    optionId: number;
}

// 교환상품 선택 form
interface ExchangeOrderItemSelectForm {
    orderItemSetIds: number[];
    exchangeEas: { [orderItemSetId: number]: number | string };
    step1Completed: boolean;
}

// 교환 추가결제 요청 form
interface ExchangePaymentForm {
    cardCode: number | string;
    interestMonth: number;
    isInterestFree: boolean;
    isPartialInterest: boolean;
    paymentPrice: number;
}

/**
 * 추가결제정보
 */
interface ExchangeAdditionalPaymentPrice {
    payTypeLabel?: string;  // 지불 타입 (즉시결제 | 판매자와 협의 후 결제)
    totalPrice: number;
    calculateDetails: {
        label: string;
        amount: number;
    }[];
}

interface ExchangeAdditionalPaymentPriceResponse {
    pay_type_label: string;
    total_price: number;
    calculate_details: {
        label: string;
        amount: number;
    }[];
}

export type {
    AddressForm,
    MyOrderAddress,
    MyOrderAddressResponse,
    OrderStatus,
    CancelForm,
    ReturnForm,
    PaymentInfo,
    PaymentInfoResponse,
    RefundInfo,
    RefundInfoResponse,
    RetrieveMethod,
    RetrieveMethodResponse,
    ExchangeForm,
    ExchangePaymentForm,
    ExchangeOrderItemSelectForm,
    ExchangeOptionPair,
    ExchangeToReturnForm,
    ExchangeAdditionalPaymentPrice,
    ExchangeAdditionalPaymentPriceResponse,
};
