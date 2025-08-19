import { Paginator, PaginatorResponse } from '$/@type';
import { 
    SellerQna, 
    SellerQnaResponse, 
    SellerQnaType, 
    SellerQnaTypeResponse,
    SellerQnaForm,
    SellerQnaDetail,
    EditableSellerQnaForm
} from '$/@type/cs/inquiry/sellerQna';
import { BackendMapper } from '$/dataMapper/backendMapper';
import { JsonMapper } from '$/dataMapper/jsonMapper';
import BaseRepository from '$/repository/baseRepository';
import { typeCastNumber } from '$/filters';
import { QnaOrderItem } from '$/@type/cs/inquiry/qna';
class SellerQnaRepository extends BaseRepository
{
    /**
     * 판매자 문의 유형 조회
     * @param  {boolean} onlyGoodsQnaType
     * @returns Promise<QnaType[]>
     */
    async getTypes(onlyGoodsQnaType: boolean = false) : Promise<SellerQnaType[]> {
        const { seller_qna_types } = await this.dataSource.execute<SellerQnaTypeResponse>(
            'CS_SELLER_QNA_TYPES',
            {
                is_goods_qna: onlyGoodsQnaType
            },
            {}
        );
        
        const types = seller_qna_types.map(qnaType => {
            return {
                code : qnaType.code,
                label : qnaType.label
            }
        });      
        
        return types
    }

    /**
     * 판매자문의 조회
     * 
     * @param  {number} page
     * @param  {number} perPage
     * @returns Promise
     */
    async getList(page: number, perPage: number = 20): Promise<Paginator<SellerQna>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<SellerQnaResponse>>(
            "MEMBER_SELLER_QNA_LIST",
            {
                page: page,
                page_size: perPage
            },
            {}
        )

        return {
            total: typeCastNumber(paginator.total),
            perPage: typeCastNumber(paginator.per_page),
            currentPage: typeCastNumber(paginator.current_page),
            data: paginator.data.map(qna => {
                return {
                    id: qna.id,
                    title: qna.title,
                    contents: qna.contents,
                    isPrivate: qna.is_private,
                    goodsCount: typeCastNumber(qna.goods_count),
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
            "MEMBER_DELETE_SELLER_QNA",
            {
                id: qnaId
            },
            {}
        );
    }

    /**
     * 동일주문, 동일셀러 주문상품 중 판매자문의 가능한 주문상품 리스트 조회 
     * 
     * @param  {string} orderId
     * @param  {number} sellerId
     * @returns Promise
     */
    async getWritableOrderItems(orderId: string, sellerId: number): Promise<QnaOrderItem[]>{
        const { order_items } = await this.dataSource.execute<{
            order_items: {
                id: number
                goods_name: string
                option_name: string
                thumbnail_url: string
            }[]
        }>(
            "MEMBER_SELLER_QNA_WRITABLE_ORDER_ITEMS",
            {
                order_id: orderId,
                seller_id: sellerId
            },
            {}
        );
        
        return order_items.map(orderItem => {
            return {
                id: orderItem.id,
                goodsName: orderItem.goods_name,
                optionName: orderItem.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                thumbnailUrl: orderItem.thumbnail_url
            }
        })
    }

    /**
     * 판매자문의 등록
     * @param  {SellerQnaForm} sellerQna
     * @returns Promise
     */
    async store(sellerQna: SellerQnaForm): Promise<void> {
        await this.dataSource.execute<void>(
            "MEMBER_STORE_SELLER_QNA",
            {},
            {
                order_id: sellerQna.orderId,
                order_item_ids: sellerQna.orderItemIds,
                type: sellerQna.type,
                title: sellerQna.title,
                contents: sellerQna.contents,
                is_private: sellerQna.isPrivate,
            }
        )
    }

    /**
     * 수정용 단일 판매자문의 조회
     * @param  {number} qnaId
     * @returns Promise
     */
    async get(qnaId: number): Promise<SellerQnaDetail> {
        const { seller_qna } = await this.dataSource.execute<{
            seller_qna: {
                id: number
                type_label: string
                title: string
                contents: string
                is_private: boolean
                seller: {
                    name: string
                    tel: string
                }
                goods_list?: {
                    id: number;
                    name: string;
                    option_name: string;
                    thumbnail_url: string;
                }[]
            }
        }>(
            "MEMBER_SELLER_QNA",
            {
                id: qnaId
            },
            {}
        );

        return {
            id: seller_qna.id,
            typeLabel: seller_qna.type_label,
            title: seller_qna.title,
            contents: seller_qna.contents,
            isPrivate: seller_qna.is_private,
            seller: {
                name: seller_qna.seller.name,
                tel: seller_qna.seller.tel,
            },
            goodsList: (seller_qna.goods_list || []).map(goods => {
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
     * 수정처리
     * @param  {EditableSellerQnaForm} sellerQnaEditForm
     * @returns Promise
     */
    async update(sellerQnaEditForm: EditableSellerQnaForm): Promise<void>{
        await this.dataSource.execute<void>(
            "MEMBER_UPDATE_SELLER_QNA",
            {
                id: sellerQnaEditForm.id,
            },
            {
                title: sellerQnaEditForm.title,
                contents: sellerQnaEditForm.contents,
                is_private: sellerQnaEditForm.isPrivate,
            }
        );
    }
}

const sellerQnaRepository = new SellerQnaRepository(
    new BackendMapper
)

export { sellerQnaRepository }