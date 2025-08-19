import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository';
import { Planning, PlanningResponse, PlanningGoods, PlanningComment, PlanningCommentResponse, EditablePlanningComment, WritablePlanningComment, PlanningGoodsResponse } from "$/@type/planning";
import { JsonMapper } from '$/dataMapper/jsonMapper';
import { Paginator, PaginatorResponse } from '$/@type';
import { typeCastNumber } from '$/filters';

class PlanningRepository extends BaseRepository
{
    /**
     * 기획전 상세 조회
     * @param  {number} planningId
     * @returns Promise
     */
    async get(planningId: number): Promise<Planning> {
        const { planning } = await this.dataSource.execute<PlanningResponse>(
            "EXH_PLANNING_DETAIL",
            {
                id: planningId
            },
            {}
        );
		
        return {
            id: planning.id,
            title: planning.title,
            isUseComment: planning.is_use_comment,
            sections: planning.sections.map(section => {
                // 상품리스트
                const goodsList: PlanningGoods[] = (section.goods_list || []).map(goods => {
                    // 상품 아이콘
                    const icon:PlanningGoods["icon"] = !goods.icon ? null : {
                        backgroundColor: goods.icon.background_color_code,
                        textColor: goods.icon.font_color_code,
                        label: goods.icon.label
                    }

                    //상품
                    return {
                        id: goods.id,
                        name: goods.name,
                        brandName: goods.brand_name,
                        headline: goods.headline,
                        thumbnailUrl: goods.thumbnail_url,
                        price: goods.price,
                        sellPrice: goods.price,
                        baseDiscountedPrice: goods.base_discounted_price,
                        saleRate: goods.sale_rate,
                        stock: goods.stock,
                        isSoldout: goods.is_soldout,
                        isOnlyAdult: goods.is_only_adult,
                        icon: icon,
                        badges: goods.badges || [],
                        wishCount: goods.wish_count,
                        reviewCount: goods.review_count,
                        reviewScoreAverage: goods.review_score_average,
                    }
                });
                
                // 기획전 상세컨텐츠
                return {
                    id: section.id,
                    pcHtml: section.pc_html,
                    mobileHtml: section.mobile_html,
                    goodsList: goodsList
                }
            }),
            groups: (planning.groups || []).map(group => {
                return {
                    id: group.id,
                    title: group.title,
                    hasPcImage: group.has_pc_image,
                    pcLink: (!group.pc_link || group.pc_link.startsWith('/')) ? group.pc_link : `/${group.pc_link}`,
                    pcImageUrl: group.pc_image_url,
                    pcAlt: group.pc_alt,
                    hasMobileImage: group.has_mobile_image,
                    mobileLink: (!group.mobile_link || group.mobile_link.startsWith('/')) ? group.mobile_link : `/${group.mobile_link}`,
                    mobileImageUrl: group.mobile_image_url,
                    mobileAlt: group.mobile_alt,
                    goodsList: [],
                }
            })
        }
    }

    /**
     * @param  {number} groupId
     * @returns Promise
     */
    async getGroupGoods(groupId: number, planningId): Promise<PlanningGoods[]> {
        const { planning_group_goods } = await this.dataSource.execute<{
            planning_group_goods: PlanningGoodsResponse[]
        }>(
            "EXH_PLANNING_GROUP_GOODS",
            {
                group_id: groupId,
                planning_id: planningId,
            },
            {}
        );
        
        return planning_group_goods.map((goods) => {
            // 상품 아이콘
            const icon:PlanningGoods["icon"] = !goods.icon ? null : {
                backgroundColor: goods.icon.background_color_code,
                textColor: goods.icon.font_color_code,
                label: goods.icon.label
            }
            
            return {
                id: goods.id,
                name: goods.name,
                brandName: goods.brand_name,
                headline: goods.headline,
                thumbnailUrl: goods.thumbnail_url,
                price: goods.price,
                sellPrice: goods.price,
                baseDiscountedPrice: goods.base_discounted_price,
                saleRate: goods.sale_rate,
                stock: goods.stock,
                isSoldout: goods.is_soldout,
                isOnlyAdult: goods.is_only_adult,
                icon: icon,
                badges: goods.badges || [],
                wishCount: goods.wish_count,
                reviewCount: goods.review_count,
                reviewScoreAverage: goods.review_score_average,
            }
        })
    }
    
    /**
     * 기획전 댓글 페이지네이터 조회
     *
     * @param {number} planningId
     * @param {number} page
     * @param {number} perPage
     * @return Promise<Paginator<PlanningComment>>
     */
    async getComments(planningId: number, page: number, perPage: number): Promise<Paginator<PlanningComment>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<PlanningCommentResponse>>(
            "EXH_PLANNING_COMMENTS",
            {
                planning_id: planningId,
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
                    writerGradeImageUrl: comment.writer_grade_image_url,
                    writerMaskingLoginId: comment.writer_masking_login_id,
                    writerGradeLevel: comment.writer_grade_level,
                    createdAt: comment.created_at,
                }
            })
        }
    }

    /**
     * 기획전 댓글 작성
     * 
     * @param  {number} planningId
     * @param  {WritablePlanningComment} comment
     * @returns Promise
     */
    async writeComment(planningId: number, comment: WritablePlanningComment): Promise<void> {
        await this.dataSource.execute<void>(
            "CREATE_EXH_PLANNING_COMMENT",
            {
                planning_id: planningId,
            },
            {
                contents: comment.contents,
                is_private: comment.isPrivate
            }
        )
    }

    /**
     * 기획전 댓글 수정
     * 
     * @param  {EditablePlanningComment} comment
     * @returns Promise
     */
    async updateComment(planningId: number, comment: EditablePlanningComment): Promise<void> {
        await this.dataSource.execute<void>(
            "UPDATE_EXH_PLANNING_COMMENT",
            {
                planning_id: planningId,
                id: comment.id,
            },
            {
                contents: comment.contents,
                is_private: comment.isPrivate
            }
        )
    }

    /**
     * 기획전 댓글 삭제
     * 
     * @param  {number} commentId
     * @returns Promise
     */
    async deleteComment(planningId: number, commentId: number): Promise<void> {
        await this.dataSource.execute<void>(
            "DELETE_EXH_PLANNING_COMMENT",
            {
                planning_id: planningId,
                id: commentId,
            },
            {}
        )
    }
}

const planningRepository = new PlanningRepository(
    new BackendMapper
   
)

export { planningRepository }