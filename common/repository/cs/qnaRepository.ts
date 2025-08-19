import { Paginator, PaginatorResponse } from "$/@type";
import { 
    QnaType, 
    QnaTypesResponse, 
    QnaOrder, 
    Qna, 
    QnaResponse,
    QnaDetail,
    EditableQnaForm,
    QnaForm,
} from "$/@type/cs/inquiry/qna";
import { BackendMapper } from "$/dataMapper/backendMapper";
import BaseRepository from "$/repository/baseRepository";
import { typeCastNumber } from '$/filters';
import { JsonMapper } from "$/dataMapper/jsonMapper";


/**
 * 1:1 문의 관련 레파지토리
 */
class QnaRepository extends BaseRepository
{
    /**
     * 1:1 문의 유형 조회
     * 
     * @returns Promise<QnaType[]>
     */
    async getTypes() : Promise<QnaType[]> {
        const { qna_types } = await this.dataSource.execute<QnaTypesResponse>(
            'CS_QNA_TYPES',
            {},
            {}
        );
        
        return qna_types.map(qnaType => {
            return {
                code : qnaType.code,
                label : qnaType.label,
                isWithOrder : qnaType.is_with_order,
                children : qnaType.children?.map(subType => {
                    return {
                        code : subType.code,
                        label : subType.label,
                    }
                })
            }
        });
    }
    
    /**
     * (회원) 문의가능 주문 리스트 조회
     * 
     * @returns Promise<InquiryOrder[]>
     */
    async getOrders() : Promise<QnaOrder[]> {
        const { orders } = await this.dataSource.execute<{
            orders: {
                order_id: string;
                ordered_at: string;
                items: {
                    id: number;
                    goods_name: string;
                    option_name: string;
                    thumbnail_url: string;
                }[];
            }[];
        }>(
            'MEMBER_QNA_ORDERS',
            {},
            {}
        );
        
        return orders.map(order => {
            return {
                orderId: order.order_id,
                orderedAt: order.ordered_at,
                items: order.items?.map((item) => {
                    return {
                        id: item.id,
                        goodsName: item.goods_name,
                        optionName: item.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                        thumbnailUrl: item.thumbnail_url
                    }
                })
            }
        })
    }

    /**
     * 문의 등록
     * 
     * @param  {QnaForm} qna
     * @returns Promise
     */
    async store(qna: QnaForm) : Promise<void> {
        await this.dataSource.execute<void>(
            'MEMBER_STORE_QNA',
            {},
            {
                title: qna.title,
                contents: qna.contents,
                type: qna.type,
                sub_type: qna.subType,
                order_id: qna.orderId,
                order_item_ids: qna.orderItemIds,
            },
        )
    }

    /**
     * 작성한 1:1문의 목록 조회
     * 
     * @param  {number=1} page
     * @param  {number=20} perPage
     * @returns  Promise<Paginator<Qna>>
     */
    async getList(page: number = 1, perPage: number = 20) : Promise<Paginator<Qna>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<QnaResponse>>(
            'MEMBER_QNA_LIST',
            {
                page: page,
                page_size: perPage
            },
            {}
        );
        
        return {
            total: typeCastNumber(paginator.total),
            perPage: typeCastNumber(paginator.per_page),
            currentPage: typeCastNumber(paginator.current_page),
            data: paginator.data.map(qna => {
                return {
                    id: qna.id,
                    title: qna.title,
                    contents: qna.contents,
                    goodsCount: qna.goods_count || 0,
                    topGoods: qna.top_goods ? {
                        id: qna.top_goods.id,
                        name: qna.top_goods.name,
                        brandName: qna.top_goods.brand_name || '',
                        thumbnailUrl: qna.top_goods.thumbnail_url,
                        optionName: qna.top_goods.option_name?.replace(/\/|(\@\^\@)/gi, ' ')
                    } : undefined,
                    answer: qna.answer ? {
                        contents: qna.answer.contents,
                        createdAt: qna.answer.created_at,
                    } : undefined,
                    createdAt: qna.created_at,
                }
            })
        }
    }

    /**
     * qna 삭제
     * @param  {number} qnaId
     * @returns Promise
     */
    async delete(qnaId: number): Promise<void> {
        await this.dataSource.execute<Promise<void>>(
            "MEMBER_DELETE_QNA",
            {
                id: qnaId
            },
            {}
        );
    }

    /**
     * 수정용 1:1 문의 조회
     * @param  {number} qnaId
     * @returns Promise
     */
    async get(qnaId: number): Promise<QnaDetail> {
        const { qna } = await this.dataSource.execute<{
            qna: {
                id: number;
                title: string;
                contents: string;
                type_label: string;
                sub_type_label: string;
                order_id?: string;
                ordered_at?: string;
                goods_list?: {
                    id: number;
                    name: string;
                    option_name: string;
                    thumbnail_url: string;
                }[]
            }
        }>(
            "MEMBER_QNA",
            {
                id: qnaId,
            },
            {},
        );
        
        return {
            id: qna.id,
            title: qna.title,
            contents: qna.contents,
            typeLabel: qna.type_label,
            subTypeLabel: qna.sub_type_label,
            orderId: qna.order_id,
            orderedAt: qna.ordered_at,
            goodsList: (qna.goods_list || []).map(goods => {
                return {
                    id: goods.id,
                    name: goods.name,
                    optionName: goods.option_name,
                    thumbnailUrl: goods.thumbnail_url,
                }
            })
        }
    }
    
    /**
     * 문의 수정처리
     * @param qnaId 1:1 문의 ID
     * @param qnaEditForm 1:1문의 수정내역
     */
    async update(qnaEditForm: EditableQnaForm): Promise<void> {
        await this.dataSource.execute<void>(
            "MEMBER_UPDATE_QNA",
            {
                id: qnaEditForm.id,
            },
            {
                title: qnaEditForm.title,
                contents: qnaEditForm.contents,
            }
        )
    }
}


const qnaRepository = new QnaRepository(
    new BackendMapper
)

export { qnaRepository }