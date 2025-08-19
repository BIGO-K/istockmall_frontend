import { JointPurchase, JointPurchaseDetail, JointPurchaseResponse } from "$/@type/jointPurchase";
import { Paginator, PaginatorResponse } from "$/@type";
import { BackendMapper } from "$/dataMapper/backendMapper";
import BaseRepository from "$/repository/baseRepository";
import moment from 'moment'

/**
 * GNB > (유료)공동 구매 관련 레파지토리
 */
class JointPurchaseRepository extends BaseRepository {
    /**
     * GNB > 공동 구매 리스트
     * 리스트 조회 - isEnd: 진행 중(false), 종료된(true)
     * 
     * @param {number} page
     * @param {number=6} perPage
     * @returns Promise<Paginator<JointPurchase>>
     */
    async getJointPurchases(page: number, perPage: number = 6, isEnd: boolean = false): Promise<Paginator<JointPurchase>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<JointPurchaseResponse>>(
            'JOINT_PURCHASE_LIST',
            {
                page: page,
                page_size: perPage,
                is_end: isEnd,
            },
            {}
        );

        return {
            currentPage: paginator.current_page,
            perPage: paginator.per_page,
            total: paginator.total,
            data: paginator.data.map((jointPurchase) => {
                return {
                    id: jointPurchase.id,
                    goodsId: jointPurchase.goods_id,
                    goodsName: jointPurchase.goods_name,
                    thumbnailUrl: jointPurchase.thumbnail_url,
                    brandId: jointPurchase.brand_id,
                    brandName: jointPurchase.brand_name,
                    logoImageUrl: jointPurchase.logo_image_url,
                    isOnlyAdult: jointPurchase.is_only_adult,
                    price: jointPurchase.price,
                    jointPurchasePrice: jointPurchase.joint_purchase_price,
                    participantCount: jointPurchase.participant_count,
                    targetCount: jointPurchase.target_count,
                    isTargetAchieve: jointPurchase.is_target_achieve,
                    targetAt: jointPurchase.target_at,
                    targetAchieveRate: jointPurchase.target_achieve_rate,
                }
            })
        }
    }

    /**
     * 공동구매 상세정보 조회
     * @param {number} id : 공동구매 ID
     * @returns {Promise<JointPurchaseDetail>} 
     */
    async getDetail(id: number): Promise<JointPurchaseDetail> {
        const response = await this.dataSource.execute<{
            goods_id: number;
            expiration_date_message: string;
            target_count: number;           // 목표 인원
            participant_count: number;      // 신청 인원
            start_at: string;              // 목표 일시
            end_at: string;
            target_achieve_rate: number;    // 목표 
            joint_purchase_amount: number;
            joint_purchase_sale_rate: number; // 공동구매 할인율 
            is_purchasable: boolean;
        }>(
            'JOINT_PURCHASE_DETAIL',
            {
                jointPurchaseId: id
            },
            {}
        );

        return {
            id: id,
            goodsId: response.goods_id,
            couponExpirationDateMessage: response.expiration_date_message,
            targetAchieveRate: response.target_achieve_rate,
            participantCount: response.participant_count,
            targetCount: response.target_count,
            startAt: response.start_at,
            endAt: response.end_at,
            isEnd: moment().diff(response.end_at, 'seconds') > 0,
            discountedPrice: response.joint_purchase_amount,
            saleRate: response.joint_purchase_sale_rate,
            isPurchasable: response.is_purchasable,
        }
    }

    /**
     * 공동구매 신청 처리 
     */
    async apply(
        id: number,
        optionId: number
    ) {

        await this.dataSource.execute(
            'JOINT_PURCHASE_APPLY',
            {
                jointPurchaseId: id
            },
            {
                joint_purchase_id: id,
                option_id: optionId,
                ea: 1
            }
        )
    }
}

const jointPurchaseRepository = new JointPurchaseRepository(
    new BackendMapper
)

export { jointPurchaseRepository }