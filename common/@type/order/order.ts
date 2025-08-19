import { Coupon } from "$/@type/coupon";
import { GiveAway } from "$/@type/goods";
import { ComputedRef } from "vue";

/**
 * 배송지 인터페이스
 */
interface ShippingAddress {
    id: number;
    shippingName: string;
    name: string;
    tel: string;
    zipCode: string;
    baseAddress: string;
    detailAddress: string;
    isRecent?: boolean;
    isExtraArea?: boolean;
}

interface ShippingAddressResponse {
    id: number;
    shipping_name: string;
    shipping_memo?: string;
    shipping_etc?: string;
    name: string;
    tel: string;
    zip_code: string;
    base_address: string;
    detail_address: string;
    is_recent?: boolean;
}

interface PayMethod {
    code: number;
    label: string;
    engLabel: string;
    childMethods?: {
        code: number;
        label: string;
    }[];
}

type MyPayMethod = {
    code: number;
    engLabel: string;
    label: string;
}

interface PayMethodResponse {
    code: number;
    label: string;
    eng_label: string;
    child_methods?: {
        code: number;
        label: string;
    }[];
}

interface OrderGoods {
    sequence: number;
    uuid: string;
    appliableImmediatelySale?: Coupon;
    brandId: number;
    brandName: string;
    goodsId: number;
    goodsName: string;
    goodsHeadline?: string;
    goodsListPrice: number;
    goodsSellPrice: number;
    goodsBaseDiscountedPrice: number;
    registCouponId: number;
    appliedCouponAmount: number;
    tempCouponId: number;
    tempCouponAmount: number;
    immediatelySaleId?: number;
    nightSaleId?: number;
    nightSaleAmount: number;
    goodsType: string;
    goodsThumbnailUrl: string;
    optionExtraAmount: number;
    optionId: number;
    optionName: string;
    sellerId: number;
    sellerName: string;
    usableCouponRegists: UsableCoupon[];
    immediatelySaleAmount: number;
    
}

interface GroupOrders extends OrderGoods {
    couponCount: number;
    appliedAllDiscountPrice: number;
    packGoodsSellPrice: number;
    items: OrderGoods[];
}

type UsableCoupon = {
    coupon: Coupon;
    registId: number;
};

interface GiveawayGroup {
    giveaway: {
        selectAble: boolean;
        id: number;
        name: string;
        label: string;
        imageUrl: string;
        imageAlt: string;
    }[],
    goodsId: number;
}

interface OrderGoodsResponse {
    appliable_immediately_sale?: {
        id: number;
        title: string;
        discount_amount: number;
        discount_type: string;
        maximum_discount_amount: number;
    };
    brand_id: number;
    brand_name: string;
    goods_base_discounted_price: number;
    goods_id: number;
    goods_list_price: number;
    goods_name: string;
    goods_sell_price: number;
    goods_thumbnail_url: string;
    goods_type: string;
    night_sale_amount: number;
    night_sale_id: number;
    option_extra_amount: number;
    option_id: number;
    option_name: string;
    seller_id: number;
    seller_name: string;
    goods_headline?: string;
    usable_coupon_regists?: {
        regist_id: number;
        coupon: {
            id: number;
            title: string;
            discount_amount: number;
            discount_type: string;
            expire_at: string;
            maximum_discount_amount: number;
        };
    }[];
}

interface OrdererInfo {
    email: string;
    phone: string;
    personalClearanceCode: string;
    latestCashReceiptApplyKey: string;
    latestCashReceiptApplyType: number;
    latestPaymentBankCode: number;
    latestPaymentCardCode: number;
    latestPaymentDepositorName: string;
    latestPaymentMethodCode: number;
    latestShippingMessage: string;
    pointBalance: number;
}

interface OrdererInfoResponse {
    email: string;
    phone: string;
    latest_cash_receipt_apply_key: string;
    latest_cash_receipt_apply_type: number;
    latest_payment_bank_code: number;
    latest_payment_card_code: number;
    latest_payment_depositor_name: string;
    latest_payment_method_code: number;
    latest_shipping_message: string;
    personal_clearance_code: string;
    point_balance: number;
}

interface Pack {
    shippingRuleTitle: string;
    shippingRuleId: number;
    shippingType: number;
    shippingPricePaymentType: number;
    shippingPricePolicy: number;
    shippingPrice: number;
    extraShippingPrice: number;
    chargedShippingPrice: number;
    conditionalFreeFrom: number;
    conditionAmount: number;
    orderGoods: OrderGoods[];
    groupOrders: GroupOrders[];
}

interface PackResponse {
    shipping_rule_title: string;
    shipping_rule_id: number;
    shipping_type: number;
    shipping_price_payment_type: number;
    shipping_price_policy: number;
    shipping_price: number;
    extra_shipping_price: number;
    charged_shipping_price: number;
    conditional_free_from: number;
    condition_amount: number;
    items: OrderGoodsResponse[];
}

interface OrderPrePareForm {
    orderer_info: {
        email: string;
        personal_clearance_code: string;
        is_remember_personal_clearance_code: boolean;
        name: string;
        phone: string;
    };
    receive_address: {
        id?: number;
        name: string;
        shipping_name: string;
        phone: string;
        zip_code: string;
        base_address: string;
        detail_address: string;
        is_extra_area: boolean;
        message: string;
    };
    payment_info: {
        method: number;
        card_code?: number;
        interest_month?: number;
        is_interest_free: boolean;
        is_partial_interest: boolean;
        bank_code?: number;
        depositor_name: string;
        cash_receipt_apply_type: number;
        cash_receipt_apply_key: string;
        using_point: number;
        for_payment_price: number;        
    };
    packs: OrderPreParePack[];
    refund_account: null|{
        owner_name: string;
        bank_code: string;
        account_number: string;
    };
    giveaways: {
        goods_id: number;
        giveaway_id: number|null;
    }[],
    my_pay_virtual_id: string|null;
}

interface OrderPreParePack {
    charged_shipping_price: number;
    extra_shipping_price: number;
    shipping_rule_id: number;
    items: {
        brand_id: number;
        goods_id: number;
        goods_base_discounted_price: number;
        option_id: number;
        option_extra_amount: number;
        night_sale_id?: number | null;
        night_sale_amount: number;
        regsit_coupon_id?: number | null | undefined;
        regist_coupon_amount: number;
        immediately_sale_id?: number | null;
        immediately_sale_amount: number;
        goods_applied_all_discounted_price: number;
    }[];
}

type PackItem = {
    sellerName: string;
    brandName: string;
    goodsId: number;
    goodsName: string;
    goodsThumbnailUrl: string;
    optionId: number;
    optionName: string;
    optionExtraAmount: number;
    goodsListPrice: number;
    goodsSellPrice: number;
    goodsBaseDiscountedPrice: number;
    nightSaleAmount: number;
    registCouponAmount: number;
    immediatelySaleAmount: number;
    usedPointAmount: number;
};

type GroupPack = PackItem & { items: PackItem[] };

interface OrderResult {
    packs: {
        shippingPrice: number;
        items: PackItem[];
        groupItems: GroupPack[];
    }[];
    receiveAddress: ShippingAddress & {
        message: string;
    };
    paymentInfo: {
        label: string;
        engLabel: string;
        cardLabel: string;
        cardMaskingNumber: string;
        approveAt: string;
        bankLabel: string;
        bankAccountNumber: string;
        bankInputExpireDate: string;
        buyPoint: number;
        bankDepositorName: string;
    };
    giveaways: GiveAway[]
}

interface CreditCardInstallMents {
    cardCode: number;
    interestFreeMonths: number[];
    partialInterestFreeMonths: number[];
}

interface InstallMentInfo {
    value: number;
    label: string;
    isInterestFree: boolean;
    isPartialInterestFree: boolean;
    disabled: boolean;
}

interface SummaryPrice {
    totalGoodsPrice: number;
    memberDiscountedPrice: number;
    nightSaleAmount: number;
    registCouponAmount: number;
    immediatelySaleAmount: number;
    usedPointAmount: number;
    shippingPrice: number;
    paymentPrice: number;
}

interface AppliedSalePacks {
    chargedShippingPrice: number;
    extraShippingPrice: number;
    shippingRuleId: number;
    items: {
        brandId: number;
        goodsId: number;
        optionId: number;
        optionExtraAmount: number;
        nightSaleId: number | undefined;
        goodsListPrice: number;
        goodsSellPrice: number;
        goodsBaseDiscountedPrice: number;
        nightSaleAmount: number;
        immediatelySaleId: number | undefined;
        appliedCouponAmount: number;
        registCouponId: number;
        immediatelySaleAmount: number;
    }[];
    group: {
        couponCount: ComputedRef<number>;
        appliedAllDiscountPrice: ComputedRef<number>;
    }[];
}

interface MyPayment {
    method: number;
    name: string;
    imageUrl: string;
    maskingCode: string;
    nickName: string;
    virtualId: string;
}

interface MyPaymentCard {
    method: number;
    name: string;
    imageUrl: string;
    maskingCode: string;
    nickName: string;
    virtualId: string;
    cardCode: number;
}

interface MyPaymentBank {
    method: number;
    name: string;
    imageUrl: string;
    maskingCode: string;
    nickName: string;
    virtualId: string;
    bankCode: number;
}

type PaymentForm = {
    payMethod: number;
    payMethodEngLabel: string;
    cardCode?: number;
    installMentMonth: number;
    bankCode?: number;
    cashReceiptApplyPhone: string;
    cashReceiptApplyBusinessNumber: string;
    cashReceiptApplyType: number;
    depositorName: string;
    usingPoint: number;
    isDirectPay: boolean;
    myPayVirtualId: string|null;
}

type OrderSheetAppliedCouponRegist = Record<string, UsableCoupon | undefined>

export type {
    OrdererInfo,
    OrdererInfoResponse,
    ShippingAddress,
    OrderGoods,
    OrderGoodsResponse,
    ShippingAddressResponse,
    Pack,
    UsableCoupon,
    PackResponse,
    PayMethod,
    PayMethodResponse,
    GroupOrders,
    OrderPrePareForm,
    OrderPreParePack,
    OrderResult,
    GroupPack,
    CreditCardInstallMents,
    InstallMentInfo,
    SummaryPrice,
    AppliedSalePacks,
    GiveawayGroup,
    MyPayment,
    MyPaymentCard,
    MyPaymentBank,
    PaymentForm,
    MyPayMethod,
    OrderSheetAppliedCouponRegist
};
