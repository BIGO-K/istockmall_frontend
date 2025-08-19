import { BaseCoupon, BaseCouponResponse } from "$/@type/coupon";

/**
 * 등급
 */
interface Grade {
    id: number;
    name: string;
    imageUrl: string;
}

/**
 * 등급혜택
 */
interface GradeBenefit extends Grade {
    order: number; //등급 순서
    isDefault: boolean;
    purchaseBenefitRate: number; // 등급 적립율
    gradeUpSellPriceCondition: number;
    gradeUpSellAmountCondition: number;
    coupons: GradeCoupon[];
    textReviewReward: number;
    photoReviewReward: number;
}
interface GradeBenefitListResponse {
    grades: {
        id: number;
        name: string;
        image_url: string;
        is_default: boolean;
        order_seq: number;
        grade_up_sell_price_condition: number;
        grade_up_sell_amount_condition: number;
        purchase_benefit_rate: number;
        coupons: GradeCouponResponse[];
        text_review_reward: number;
        photo_review_reward: number;
    }[];
}

/**
 * 등급쿠폰
 */
interface GradeCoupon extends BaseCoupon {
    isUnlimited: boolean;
    downloadLimit: number;
}

interface GradeCouponResponse extends BaseCouponResponse {
    is_unlimited: boolean;
    download_limit: number;
}

/**
 * 회원 승급조건 달성정보
 */
interface GradeUpCondition {
    orderAmount: number;
    orderCount: number;
    gradeUpOrderAmountCondition: number;
    gradeUpOrderCountCondition: number;
    nextGradeName: string;
    isTopLevel: boolean;
    gradeUpCalculationPeriodMonth: number; // 등급업 산출 기간(월 단위)
}

interface GradeUpConditionResponse {
    grade_up_condition: {
        order_amount: number;
        order_count: number;
        grade_up_order_amount_condition: number;
        grade_up_order_count_condition: 10;
        next_grade_name: string;
        is_top_level: boolean;
        grade_up_calculation_period_month: number; // 등급업 산출 기간(월 단위)
    };
}

/**
 * 회원 (금월)등급쿠폰 발급 집계
 */
interface GradeCouponRegistCount {
    gradeCouponId: number;
    couponRegistCount: number;
}
interface GradeCouponRegistCountsResponse {
    grade_coupon_registed_counts: {
        grade_coupon_id: number;
        coupon_regist_count: number;
    }[];
}

export type {
    Grade,
    GradeBenefit,
    GradeBenefitListResponse,
    GradeCoupon,
    GradeCouponResponse,
    GradeUpCondition,
    GradeUpConditionResponse,
    GradeCouponRegistCount,
    GradeCouponRegistCountsResponse,
};
