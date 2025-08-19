import { BaseCoupon, BaseCouponResponse } from "$/@type/coupon";
import { BaseGoods, BaseResponseGoods } from "$/@type/goods";

/**
 * 회원이 발급받은 쿠폰
 */
interface RegistedCoupon extends BaseCoupon {
    title: string; // 쿠폰명
    applyRangeType: string; // 적용범위 타입: all|seller|goods|category|brand
    minSellPrice: number; // 최저금액(판매가)조건
    isUnlimited: boolean; // 무제한 쿠폰(등급쿠폰) 여부
    applyRangeDescription: string; // 적용범위 설명
    maximumDiscountAmount: number; //최대할인금액
    usableDeviceLabels: string[]; // 사용가능 디바이스 라벨 목록
    typeLabel: string; //등급할인쿠폰|일반상품쿠폰|타임딜전용쿠폰|공동구매전용쿠폰|EP쿠폰|자동발행쿠폰
}

/**
 * 쿠폰 발급 이력 (사용완료쿠폰 노출 x, 사용가능/사용불가 상태 쿠폰)
 */
interface CouponRegist {
    id: number; // 발급 ID
    coupon: RegistedCoupon; // 발급된 쿠폰 정보,
    isUsable: boolean; // 사용 가능 여부
    expireAt: string; // 쿠폰 만료일시
    useStartAt: string; // 사용기간 - 시작일
    registedAt: string; // 발급일시
}

/**
 * 쿠폰 사용가능 대상(상품)
 */
type CouponUsableGoods = Pick<BaseGoods, "id" | "name" | "brandName" | "thumbnailUrl">;

/**
 * 쿠폰 사용가능 대상(브랜드)
 */
interface CouponUsableBrands {
    id: number;
    name: string;
}

/**
 * api 응답 리스폰스
 */
interface RegistedCouponResponse extends BaseCouponResponse {
    title: string;
    apply_range_type: string;
    min_sell_price: number;
    is_unlimited: boolean;
    maximum_discount_amount: number;
    usable_device_labels: string[];
    type_label: string;
}

interface CouponRegistResponse {
    id: number;
    coupon: RegistedCouponResponse;
    is_usable: boolean;
    expire_at: string;
    use_start_at: string;
    registed_at: string;
}

type CouponUsableGoodsResponse = Pick<BaseResponseGoods, "id" | "name" | "brand_name" | "thumbnail_url">;

interface CouponUsableBrandsResponse {
    id: number;
    name: string;
}

export type {
    CouponRegist,
    RegistedCoupon,
    RegistedCouponResponse,
    CouponUsableGoods,
    CouponUsableBrands,
    CouponRegistResponse,
    CouponUsableGoodsResponse,
    CouponUsableBrandsResponse,
};
