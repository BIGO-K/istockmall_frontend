import { JsonMapper } from '$/dataMapper/jsonMapper'
import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository'
import { typeCastBoolean, typeCastNumber } from '$/filters';
import { 
    Review,
    ReviewResponse,
    ReviewableOrderItem, 
    ReviewableOrderItemResponse,
    ReviewTemplate,
    ReviewTemplateResponse,
    EditableReview,
    EditableReviewResponse,
    ReviewAggregates,
    ReviewAggregatesResponse
} from '$/@type/member/review';
import { Paginator, PaginatorResponse } from '$/@type';

class ReviewRepository extends BaseRepository
{
    /**
     * 리뷰 집계
     */
    aggregates: ReviewAggregates = {
        writables: 0,
        written: 0,
    }

    /**
     * 작성가능리뷰 조회
     * 
     * @param  {number} page
     * @param  {number=20} perPage
     * @returns Promise
     */
    async getWritables(page: number, perPage: number=20): Promise<Paginator<ReviewableOrderItem>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<ReviewableOrderItemResponse>>(
            "MEMBER_REVIEW_WRITABLES",
            {
                page: page,
                page_size: perPage
            },
            {}
        )

        return {
            currentPage: typeCastNumber(paginator.current_page),
            total: typeCastNumber(paginator.total),
            perPage: typeCastNumber(paginator.per_page),
            data: paginator.data.map((orderItem) => {
                return {
                    orderId: orderItem.order_id,
                    optionId: orderItem.option_id,
                    goods: {
                        id: orderItem.goods.id,
                        name: orderItem.goods.name,
                        brandName: orderItem.goods.brand_name,
                        thumbnailUrl: orderItem.goods.thumbnail_url,
                        optionName: orderItem.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                        ea: orderItem.ea,
                    },
                    orderedAt: orderItem.ordered_at,
                }
            })
        }
    }

    /**
     * 선택가능한 리뷰 항목템플릿 조회
     * @param  {number} goodsId
     * @returns Promise
     */
    async getReviewTemplates(goodsId: number): Promise<ReviewTemplate[]> {
        const { review_templates } = await this.dataSource.execute<ReviewTemplateResponse>(
            "MEMBER_REVIEW_TEMPLATES",
            {
                goods_id: goodsId
            },
            {}
        )

        return review_templates.map(template => {
            return {
                id: template.id,
                title: template.title,
                details: template.details.map(detail => {
                    return {
                        id: detail.id,
                        label: detail.label
                    }
                })
            }
        });
    }

    /**
     * 리뷰 작성처리 
     * @param  {FormData} formData
     * @returns Promise
     */
    async create(formData: FormData): Promise<void> {
        await this.dataSource.execute<void>(
            "MEMBER_STORE_REVIEW",
            {},
            formData
        )
    }

    /**
     * 작성한 리뷰 조회
     * @param  {number} page
     * @param  {number=20} perPage
     * @returns Promise
     */
    async getList(page: number, perPage: number=20): Promise<Paginator<Review>> {
        const { paginator } =  await this.dataSource.execute<PaginatorResponse<ReviewResponse>>(
            "MEMBER_REVIEWS",
            {
                page: page,
                page_size: perPage
            },
            {}
        );
        
        return {
            total: typeCastNumber(paginator.total),
            currentPage: typeCastNumber(paginator.current_page),
            perPage: typeCastNumber(paginator.per_page),
            data: paginator.data.map(review => {
                return {
                    id: review.id,
                    contents: review.contents,
                    rate: review.rate,
                    isPhotoReview: review.is_photo_review,
                    imageUrls: review.image_urls,
                    orderItem: {
                        orderId: review.order_item.order_id,                       
                        goods: {
                            id: review.order_item.goods.id,
                            name: review.order_item.goods.name,
                            brandName: review.order_item.goods.brand_name || '',
                            thumbnailUrl: review.order_item.goods.thumbnail_url,
                            optionId: review.order_item.option_id,
                            ea: review.order_item.ea,
                            optionName: review.order_item.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                        }
                    },
                    createdAt: review.created_at,
                    templates: review.templates.map(template => {
                        return {
                            id: template.id,
                            title: template.title,
                            selectedLabel: template.selected_label,
                        }
                    }),
                    isEditable: typeCastBoolean(review.is_editable, true),
                }
            })
        }
    }

    /**
     * 리뷰 수정페이지 > 리뷰 조회
     * @param  {number} reviewId
     * @returns Promise
     */
    async get(reviewId: number): Promise<EditableReview> {
        const { review } = await this.dataSource.execute<EditableReviewResponse>(
            "MEMBER_REVIEW",
            {
                id: reviewId
            },
            {}
        );

        return {
            id: review.id,
            contents: review.contents,
            imageUrls: review.image_urls,
            rate: review.rate,
            templates: review.templates,
            selectedTemplates: review.selected_templates.map(selected => {
                return {
                    templateId: selected.template_id,
                    detailId: selected.detail_id,
                }
            }),
            height: review.height,
            weight: review.weight,
            shoesSize: review.shoes_size
        }
    }

    /**
     * 리뷰 수정처리
     * 
     * @param  {number} reviewId
     * @param  {FormData} formData
     * @returns Promise
     */
    async update(reviewId: number, formData: FormData): Promise<void> {
        await this.dataSource.execute<void>(
            "MEMBER_UPDATE_REVIEW",
            {
                id: reviewId,
            },
            formData
        )
    }
    /**
     * 리뷰 집계 조회
     */
    async getAggregates(): Promise<ReviewAggregates> {
        const { reviews } = await this.dataSource.execute<ReviewAggregatesResponse>(
            "MEMBER_AGGREGATES_REVIEW",
            {},
            {}
        );

        return {
            writables: reviews.writables,
            written: reviews.written
        }
    }

    /**
     * 포토 리뷰 이미지 조회
     * @param reviewId : 리뷰 ID
     * @returns 
     */
    async reviewImageZoom(reviewId: number): Promise<string[]> {
        const response = await this.dataSource.execute<{
            image_urls: string[]
        }>(
            'GOODS_REVIEW_ZOOM_IMAGES',
            {
                reviewId: reviewId
            },
            {}
        )

        return response.image_urls;
    }
}

const reviewRepository = new ReviewRepository(
    new BackendMapper
)

export { reviewRepository }