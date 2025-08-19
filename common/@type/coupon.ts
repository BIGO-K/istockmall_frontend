interface BaseCoupon {
    id: number;
    dcAmount: number;
    dcType:  string & 'rate'  | 'KRW'; // 할인율rate|KRW
}

interface Coupon extends BaseCoupon {
    title: string;
    maximumDiscountAmount: number;
    expireAt?: string;
}

interface UsableCoupon extends BaseCoupon {
    registId: number;
    coupon: Coupon;
}

/**
 * EP Coupon 객체
 */
interface EpCoupon {
    id: number;
    discountedAmount: number;
    discountedPrice: number;
    discountedType: string;
    durationDayCount: number;
    siteCode: string;
    siteLabel: string;
}

interface EpCouponResponse {
    id: number;
    discounted_amount: number;
    discounted_price: number;
    discounted_type: string;
    duration_day_count: number;
    site_code: string;
    site_label: string;
}

interface DownLoadCoupon {
    id: number;
    name: string;
    expirationDateMessage: string;
    isDownloaded: boolean;
    usableDeviceLabels: string[];
}

/**
 * api 응답 리스폰스
 */
interface BaseCouponResponse {
    id: number;
    discount_amount: number;
    discount_type: string;
}

export type {
    Coupon,
    BaseCoupon,
    UsableCoupon,
    BaseCouponResponse,
    DownLoadCoupon,
    EpCoupon,
    EpCouponResponse,
};
