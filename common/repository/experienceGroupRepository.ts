import { ExperienceGroup, ExperienceGroupDetail, ExperienceGroupDetailResponse, ExperienceGroupResponse, Recommendation, ReviewableItemResponse, ReviewableItem } from '$/@type/experienceGroup';
import { Paginator, PaginatorResponse } from '$/@type';
import { typeCastBoolean } from '$/filters';
import { BackendMapper } from "$/dataMapper/backendMapper";
import BaseRepository from "$/repository/baseRepository";
import { useUserState } from '$/composables/auth/userComposable';

/**
 * GNB > (유료)이벤트 > 체험단 후기 관련 레파지토리
 */
class ExperienceGroupRepository extends BaseRepository
{
    /**
     * 이벤트 > 체험단 후기 리스트
     * 
     * @param { number } page
     * @param { nubmer = 20 } perPage
     * @returns Promise<Paginator<ExperienceGroup>>
     */
    async getExperienceGroups(page: number, perPage: number = 20): Promise<Paginator<ExperienceGroup>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<ExperienceGroupResponse>>(
            'EXPERIENCEGROUP_REVIEW_LIST',
            {
                page: page,
                page_size: perPage,
            },
            {}
        );

        return {
            currentPage: paginator.current_page,
            perPage: paginator.per_page,
            total: paginator.total,
            data: paginator.data.map((review) => {
                return {
                    id: review.id,
                    title: review.title,
                    thumbnailUrl: review.thumbnail_url,
                    grade: review.grade,
                    writer: review.writer,
                    recommendationCount: review.recommendation_count,
                    viewCount: review.view_count,
                    createdAt: review.created_at,
                }
            })
        }
    }

    /**
     * 리뷰 작성 처리
     * 
     * @param { FormData } formData
     * @returns Promise
     */
    async create(formData: FormData): Promise<void> {
        await this.dataSource.execute<void>(
            'EXPERIENCEGROUP_REVIEW_STORE',
            {},
            formData
        )
    }

    /**
     * 이벤트 > 체험단 후기 리스트 > 체험단 후기 상세
     * 
     * @param { number } reviewId
     * @returns Promise
     */
    async getExperienceGroupDetails(reviewId: number): Promise<ExperienceGroupDetail> {
        const { detail } = await this.dataSource.execute<ExperienceGroupDetailResponse>(
            'EXPERIENCEGROUP_REVIEW_DETAILS',
            {
                review_id: reviewId
            },
            {}
        );

        return {
            id: detail.id,
            title: detail.title,
            writer: detail.writer,
            createdAt: detail.created_at,
            viewCount: detail.view_count,
            goodsId: detail.goods_id,
            goodsName: detail.goods_name,
            goodsThumbnailUrl: detail.goods_thumbnail_url,
            baseDiscountedPrice: detail.base_discounted_price,
            brandName: detail.brand_name,
            grade: detail.grade,
            height: detail?.height,
            weight: detail?.weight,
            shoesSize: detail?.shoes_size,
            contents: detail.contents,
            templates: detail.templates.map((template) => {
                return {
                    id: template.id,
                    title: template.title,
                    selectedLabel: template.selected_label,
                }
            }),
            recommendationCount: detail.recommendation_count,
            imageUrlList: detail.image_url_list,
        }
    }

    /**
     * 체험단 후기 ID 배열로 추천 여부 조회
     * 
     * @param { number[] } reviewIds
     * @return Promise
     */
    async getRelationRecommendation(reviewIds: number[]): Promise<Recommendation[]> {
        if (reviewIds.length < 1) {
            return [];
        }      
        const { isUser } = useUserState();

        if (!isUser.value) {
            return reviewIds.map((id) => {
                return {
                    reviewId: id,
                    isRecommendation: false
                }
            });
        }
        

        const response = await this.dataSource.execute<{
            recommendation_relation_reviews: [
                {
                    review_id: number,
                    is_recommendation: boolean
                }
            ]
        }> (
            'EXPERIENCEGROUP_REVIEW_RECOMMENDATION',
            {},
            {
                review_ids: reviewIds
            }
        );

        const result: Recommendation[] = response.recommendation_relation_reviews.map((recommendationInfo) => {
            const recommendationReview: Recommendation = {
                reviewId: recommendationInfo.review_id,
                isRecommendation: typeCastBoolean(recommendationInfo.is_recommendation)
            }
            
            return recommendationReview;
        });

        return result;
    }

    /**
     * 체험단 후기 추천하기
     * 
     * @param { number } reviewId
     * @returns Promise 
     */
    async addRecommendation(reviewId: number): Promise<void> {
        await this.dataSource.execute<void>(
            'EXPERIENCEGROUP_REVIEW_RECOMMENDATION_ADD',
            {},
            {
                review_id: reviewId,
            }
        );
    }

    /**
     * 체험단 후기 추천 취소하기
     * 
     * @param { number } reviewId
     * @returns Promise 
     */
    async cancelRecommendation(reviewId: number): Promise<void> {
        await this.dataSource.execute<void>(
            'EXPERIENCEGROUP_REVIEW_RECOMMENDATION_CANCEL',
            {},
            {
                review_id: reviewId,
            }
        );
    }

    /**
     * 체험단 후기 작성 가능한 상품
     * 
     * @return Promise
     */
    async reviewableItems(): Promise<ReviewableItem[]> {
        const { goods_list } = await this.dataSource.execute<ReviewableItemResponse>(
            'EXPERIENCEGROUP_REVIEWABLE_GOODS',
            {},
            {}
        );

        return goods_list.map(item => {
            return {
                id: item.id,
                name: item.name,
                brandName: item.brand_name,
                thumbnailUrl: item.thumbnail_url,
                optionList: item.option_list.map(option => {
                    return {
                        id: option.id,
                        name: option.name
                    }
                })
            }
        });
    }
}

const experienceGroupRepository = new ExperienceGroupRepository(
    new BackendMapper
)

export { experienceGroupRepository }