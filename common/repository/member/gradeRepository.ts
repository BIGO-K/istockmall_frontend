import BaseRepository from '$/repository/baseRepository'
import { JsonMapper } from '$/dataMapper/jsonMapper'
import { BackendMapper } from '$/dataMapper/backendMapper';
import { 
    GradeBenefit, 
    GradeBenefitListResponse, 
    GradeCouponRegistCount,
    GradeCouponRegistCountsResponse
} from '$/@type/member/grade';
import { GradeCoupon } from '$/@type/member/grade';
import { typeCastNumber } from '$/filters';

/**
 * 등급 레파지토리
 */
class GradeRepository extends BaseRepository
{
    /**
     * 등급 및 혜택 조회
     * 
     * @returns Promise<Grade[]>
     */
    async getBenefitInfo(): Promise<GradeBenefit[]>
    {
        const { grades } = await this.dataSource.execute<GradeBenefitListResponse>(
            'CS_GRADE_BENEFIT_INFO',
            {},
            {}
        );
        
        const gradeList: GradeBenefit[] = (grades || [])?.map(grade => {
            const gradeCoupons: GradeCoupon[] = (grade.coupons || []).map(coupon => {
                return {
                    id: coupon.id,
                    dcAmount: coupon.discount_amount,
                    dcType: coupon.discount_type,
                    isUnlimited: coupon.is_unlimited,
                    downloadLimit: coupon.download_limit,
                }
            });

            return {
                id: grade.id,
                name: grade.name,
                imageUrl: grade.image_url,
                order: grade.order_seq,
                gradeUpSellAmountCondition: typeCastNumber(grade.grade_up_sell_amount_condition),
                gradeUpSellPriceCondition: typeCastNumber(grade.grade_up_sell_price_condition),
                textReviewReward: typeCastNumber(grade.text_review_reward),
                photoReviewReward: typeCastNumber(grade.photo_review_reward),
                isDefault: grade.is_default,
                purchaseBenefitRate: grade.purchase_benefit_rate,
                coupons: gradeCoupons
            }
        });
        
        return gradeList.reverse()
    }

    /**
     * 금월 등급쿠폰별 발급횟수 조회
     * @returns Promise
     */
    async gerGradeCouponRegistCount(): Promise<GradeCouponRegistCount[]> {
        const { grade_coupon_registed_counts } = await this.dataSource.execute<GradeCouponRegistCountsResponse>(
            "MEMBER_GRADE_COUPON_REGIST_COUNT",
            {},
            {},
        );

        return grade_coupon_registed_counts.map((couponRegistCount) => {
            return {
                gradeCouponId: couponRegistCount.grade_coupon_id,
                couponRegistCount: couponRegistCount.coupon_regist_count,
            }
        })
    }
    
    /**
     * 등급쿠폰 다운로드
     * 
     * @param  {number} couponId
     * @returns Promise
     */
    async downloadGradeCoupon(couponId: number): Promise<void> {
        await this.dataSource.execute<void>(
            "MEMBER_DOWNLOAD_GRADE_COUPON",
            {
                coupon_id: couponId,
            },
            {}
        );
    }
}

const gradeRepository = new GradeRepository(
    new BackendMapper
)

export { gradeRepository }