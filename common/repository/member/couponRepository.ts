import { Paginator, PaginatorResponse } from "$/@type";
import {
    CouponRegist,
    RegistedCoupon,
    CouponRegistResponse,
    CouponUsableGoods,
    CouponUsableBrands,
    CouponUsableBrandsResponse,
    CouponUsableGoodsResponse,
    RegistedCouponResponse,
} from "$/@type/member/coupon";
import { BackendMapper } from "$/dataMapper/backendMapper";
import { JsonMapper } from "$/dataMapper/jsonMapper";
import BaseRepository from "$/repository/baseRepository";
import { formatNumber, typeCastNumber } from '$/filters';

class CouponRepository extends BaseRepository
{
    /**
     * 발급받은 쿠폰 내역 조회
     *
     * @param  {number} page
     * @param  {number=20} perPage
     * @returns Promise<Paginator<CouponRegist>>
     */
    async getCoupons(page: number, perPage: number = 20): Promise<Paginator<CouponRegist>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<CouponRegistResponse>>(
            'MEMBER_COUPON_REGIST_LIST',
            {
                page: page,
                page_size: perPage,
            },
            {}
        );

        return {
            total: typeCastNumber(paginator.total),
            currentPage: typeCastNumber(paginator.current_page),
            perPage: typeCastNumber(paginator.per_page),
            data: paginator.data.map((couponRegist) => {
                let applyRangeDesc: string = '';
                switch(couponRegist.coupon.apply_range_type) {
                    case 'all':
                        applyRangeDesc = '모든 상품'
                        break;
                    case 'seller':
                        applyRangeDesc = '특정 판매자 상품'
                        break;
                    case 'goods':
                        applyRangeDesc = '특정 상품'
                        break;
                    case 'category':
                        applyRangeDesc = '특정 카테고리 상품 '
                        break;
                    case 'brand':
                        applyRangeDesc = '특정 브랜드 상품'
                        break;
                    default:
                        applyRangeDesc = '사용불가'
                        break;
                }

                if (couponRegist.coupon.min_sell_price > 0) {
                    applyRangeDesc += ` ${formatNumber(couponRegist.coupon.min_sell_price)}원 이상`
                }

                const coupon: RegistedCoupon = {
                    id: couponRegist.coupon.id,
                    title: couponRegist.coupon.title,
                    dcAmount: couponRegist.coupon.discount_amount,
                    dcType: couponRegist.coupon.discount_type,
                    applyRangeType: couponRegist.coupon.apply_range_type,
                    maximumDiscountAmount: couponRegist.coupon.maximum_discount_amount,
                    minSellPrice: couponRegist.coupon.min_sell_price,
                    usableDeviceLabels: couponRegist.coupon.usable_device_labels,
                    applyRangeDescription: applyRangeDesc,
                    isUnlimited: couponRegist.coupon.is_unlimited,
                    typeLabel: couponRegist.coupon.type_label,
                };

                return {
                    id: couponRegist.id,
                    isUsable: couponRegist.is_usable,
                    expireAt: couponRegist.expire_at,
                    useStartAt: couponRegist.use_start_at,
                    registedAt: couponRegist.registed_at,
                    coupon: coupon,
                }
            })
        }
    }

    /**
     * 단일 발급쿠폰 조회
     *
     * @param  {number} id
     * @returns Promise<RegistedCoupon>
     */
    async getCoupon(id: number): Promise<RegistedCoupon> {
        const response = await this.dataSource.execute<RegistedCouponResponse>(
            'MEMBER_COUPON_REGIST',
            {
                coupon_id: id,
            },
            {}
        );

        const registedCoupon: RegistedCoupon = {
            id: response.id,
            title: response.title,
            dcType: response.discount_type,
            dcAmount: response.discount_amount,
            applyRangeDescription: '',
            isUnlimited: response.is_unlimited,
            minSellPrice: response.min_sell_price,
            applyRangeType: response.apply_range_type,
            usableDeviceLabels: response.usable_device_labels,
            maximumDiscountAmount: response.maximum_discount_amount,
        };

        return registedCoupon;
    }

    /**
     * 쿠폰 사용가능 상품 조회
     *
     * @param  {number} couponId
     * @param  {string} useRangeType
     * @param  {number} page
     * @param  {number=5} perPage
     * @returns Promise
     */
    async getCouponUsableGoods(couponId: number, page: number, perPage: number = 5): Promise<Paginator<CouponUsableGoods>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<CouponUsableGoodsResponse>>(
            'MEMBER_COUPON_USABLE_GOODS',
            {
                coupon_id: couponId,
                page: page,
                page_size: perPage,
            },
            {}
        );

        return {
            total: typeCastNumber(paginator.total, 0),
            currentPage: typeCastNumber(paginator.current_page, 1),
            perPage: typeCastNumber(paginator.per_page, 5),
            data: paginator.data.map((usable) => {
                return {
                    id: usable.id,
                    name: usable.name,
                    brandName: usable.brand_name,
                    thumbnailUrl: usable.thumbnail_url,
                }
            })
        }
    }

    /**
     * 쿠폰 사용가능 상품 조회
     *
     * @param  {number} couponId
     * @param  {string} useRangeType
     * @param  {number} page
     * @param  {number=5} perPage
     * @returns Promise
     */
    async getCouponUsableBrands(couponId: number, page: number, perPage: number = 5): Promise<Paginator<CouponUsableBrands>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<CouponUsableBrandsResponse>>(
            'MEMBER_COUPON_USABLE_BRANDS',
            {
                coupon_id: couponId,
                page: page,
                page_size: perPage,
            },
            {
            }
        );

        return {
            total: typeCastNumber(paginator.total, 0),
            currentPage: typeCastNumber(paginator.current_page, 1),
            perPage: typeCastNumber(paginator.per_page, 5),
            data: paginator.data.map((usable) => {
                return {
                    id: usable.id,
                    name: usable.name,
                }
            })
        }
    }


    /**
     * 쿠폰 인증번호로 쿠폰 등록
     *
     * @param  {string} publishCode
     * @returns Promise
     */
    async registCoupon(publishCode: string): Promise<void> {
        await this.dataSource.execute<void>(
            'MEMBER_REGIST_COUPON',
            {},
            {
                publish_code: publishCode,
            }
        );
    }
}

const couponRepository = new CouponRepository(
    new BackendMapper
)

export { couponRepository }