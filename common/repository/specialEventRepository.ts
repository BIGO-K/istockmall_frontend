import {
    SimpleSpecialEvent,
    SimpleSpecialEventResponse,
    SpecialEvent,
    SpecialEventResponse,
    SpecialEventGoods,
    SpecialEventGoodsResponse,
    Comment,
    CommentResponse,
    WritableComment,
    EditableComment
} from '$/@type/specialEvent';
import { BackendMapper } from '$/dataMapper/backendMapper';
import { Paginator, PaginatorResponse } from '$/@type';
import BaseRepository from '$/repository/baseRepository'
import { typeCastNumber } from '$/filters';

class SpecialEventRepository extends BaseRepository {

    /**
     * 메인>이벤트 목록 조회
     *
     * @param periodType: string
     * @param page: number = 1
     * @param perPage: number = 15
     *
     * @return Promise<Paginator<SimpleSpecialEvent>>
     */
    async getSimpleSpecialEventPaginator(
        tabCode: string,
        page: number = 1,
        perPage: number = 15,
    ): Promise<Paginator<SimpleSpecialEvent>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<SimpleSpecialEventResponse>>(
            'MAIN_SPECIAL_EVENTS',
            {
                period_type: tabCode,
                page: page,
                page_size: perPage
            },
            {}
        );

        return {
            total: paginator.total,
            currentPage: paginator.current_page,
            perPage: paginator.per_page,
            data: paginator.data.map((simpleSpecialEvent) => {
                return {
                    id: simpleSpecialEvent.id,
                    title: simpleSpecialEvent.title,
                    description: simpleSpecialEvent.description,
                    startAt: simpleSpecialEvent.start_at,
                    endAt: simpleSpecialEvent.end_at,
                    imageUrl: simpleSpecialEvent.image_url,
                    detailUrl: simpleSpecialEvent.detail_url,
                    isUseDetailUrl: simpleSpecialEvent.is_use_detail_url
                }
            })
        };
    }

    /**
     * 메인>이벤트 상세 조회
     *
     * @param  id: number
     *
     * @return Promise<SpecialEvent>
     */
    async getSpecialEvent(id: number): Promise<SpecialEvent> {
        const special_event = await this.dataSource.execute<SpecialEventResponse>(
            'SPECIAL_EVENT_DETAIL',
            {
                event_id: id
            },
            {}
        );

        return {
            id: special_event.id,
            title: special_event.title,
            description: special_event.description,
            // 노출 기간
            startAt: special_event.start_at,
            endAt: special_event.end_at,
            // 리스트 이미지
            imageUrl: special_event.image_url,
            alt: special_event.alt,
            contentsType: special_event.contents_type, // html, image(에디터로 등록 -> html, 이미지로 등록 -> image)
            // html
            contentsHtml: special_event.contents_html,
            // image
            contentsImageUrl: special_event.contents_image_url,
            contentsImageAlt: special_event.contents_image_alt,
            // 댓글 사용 여부
            isCommentable: special_event.is_commentable,
            // 상품 그룹 정보
            goodsGroups: special_event.goods_groups.map(group => {
                return {
                    id: group.id,
                    title: group.title,
                    goodsList: [],
                    goodsLikeRelations: [],
                }
            })
        }
    }

    /**
     * 이벤트 > 상품그룹 > 상품 목록 조회
     *
     * @param   eventId: number
     * @param   goodsGroupId: number
     *
     * @returns Promise<SpecialEventGoods[]>
     */
    async getGroupGoods(eventId: number, goodsGroupId: number): Promise<SpecialEventGoods[]> {
        const { group_goods } = await this.dataSource.execute<{ group_goods: SpecialEventGoodsResponse[] }>(
            'SPECIAL_EVENT_GROUP_GOODS',
            {
                event_id: eventId,
                group_id: goodsGroupId
            },
            {}
        );

        return group_goods.map((goods) => {
            return {
                id: goods.id,
                name: goods.name,
                brandName: goods.brand_name,
                thumbnailUrl: goods.thumbnail_url,
                price: goods.price,
                sellPrice: goods.price,
                baseDiscountedPrice: goods.base_discounted_price,
                saleRate: goods.sale_rate,
                stock: goods.stock,
                isSoldout: goods.is_soldout,
                isOnlyAdult: goods.is_only_adult,
                badges: goods.badges || [],
                wishCount: goods.wish_count,
                reviewCount: goods.review_count,
                reviewScoreAverage: goods.review_score_average,
            };
        });
    };

    /**
     * 이벤트 댓글 페이지네이터 조회
     *
     * @param  {number} id
     * @param  {number} page
     * @param  {number} perPage
     *
     * @returns Promise<Paginator<Comment>>
     */
    async getComments(
        id: number,
        page: number,
        perPage: number
    ): Promise<Paginator<Comment>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<CommentResponse>>(
            'SPECIAL_EVENT_COMMENTS',
            {
                event_id: id,
                page: page,
                page_size: perPage,
            },
            {}
        );

        return {
            currentPage: typeCastNumber(paginator.current_page),
            total: typeCastNumber(paginator.total),
            perPage: typeCastNumber(paginator.per_page),
            data: paginator.data.map((comment) => {
                return {
                    id: comment.id,
                    contents: comment.contents,
                    isPrivate: comment.is_private,
                    isEditable: comment.is_editable,
                    isEditing: false,
                    writerGradeLevel: comment.writer_grade_level,
                    writerGradeImageUrl: comment.writer_grade_image_url,
                    writerMaskingLoginId: comment.writer_masking_login_id,
                    createdAt: comment.created_at,
                };
            })
        };
    };

    /**
     * 이벤트 댓글 작성
     *
     * @param id: number,
     * @param comment: WritableComment
     *
     * @returns Promise<void>
     */
    async writeComment(
        id: number,
        comment: WritableComment
    ): Promise<void> {
        await this.dataSource.execute<void>(
            'CREATE_SPECIAL_EVENT_COMMENT',
            {
                event_id: id,
            },
            {
                contents: comment.contents,
                is_private: comment.isPrivate
            }
        )
    };

    /**
     * 이벤트 댓글 삭제
     *
     * @param  id: number
     * @param  commentId: number
     *
     * @returns Promise<void>
     */
    async deleteComment(id: number, commentId: number): Promise<void> {
        await this.dataSource.execute<void>(
            'DELETE_SPECIAL_EVENT_COMMENT',
            {
                event_id: id,
                comment_id: commentId,
            },
            {}
        )
    }

    /**
     * 이벤트 댓글 수정
     *
     * @param  id: number
     * @param  comment: EditableComment
     * @returns Promise<void>
     */
    async updateComment(id: number, comment: EditableComment): Promise<void> {

        await this.dataSource.execute<void>(
            'UPDATE_SPECIAL_EVENT_REVIEW_COMMENT',
            {
                event_id: id,
                comment_id: comment.id,
            },
            {
                contents: comment.contents,
                is_private: comment.isPrivate
            }
        );
    };
}

const specialEventRepository = new SpecialEventRepository(
    new BackendMapper
)

export {
    specialEventRepository
}

