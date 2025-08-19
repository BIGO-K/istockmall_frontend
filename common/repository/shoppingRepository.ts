import moment from 'moment'
import { GiveAway, GiveAwayGoods, BaseGoods } from '$/@type/goods';
import { RecentViewGoodsResponse, RecentViewPlanning, RecentViewPlanningsResponse } from "$/@type/member/recentViews";
import 
{ 
    Cart, 
    CartOptions, 
    CartPackResponse, 
    LikedGoods
} from '$/@type/shopping';
import { BackendMapper } from "$/dataMapper/backendMapper";
import { JsonMapper } from "$/dataMapper/jsonMapper";
import BaseRepository from "$/repository/baseRepository";
import { Paginator } from '$/@type';
import { useLikeStore } from '$/store/like';
import { useUserState } from '$/composables/auth/userComposable';
import { useShoppingStore } from '$/store/shopping';
import { typeCastBoolean } from '$/filters';



class ShoppingRepository extends BaseRepository
{
    /**
     * 상품 ID 배열로 좋아요한 상품 조회하여 store에 저장
     * @param  {number[]} goodsIds 상품 id 배열
     * @param  {boolean} refresh 기존 store 데이터 reset 여부
     * @returns Promise
     */
    async getRelationLikedGoods(goodsIds: number[], refresh: boolean = true): Promise<void> {
        const likeStore = useLikeStore();
        const { isUser } = useUserState();

        // 데이터 유지 필요없는 경우 리셋 처리 
        if (refresh) {
            likeStore.$reset();
        }

        if (goodsIds.length < 1 || !isUser.value) {
            return;
        }

        const response = await this.dataSource.execute<{ 
            liked_relation_goods: [
                {
                    goods_id: number,
                    liked: boolean
                }
            ]
        }> (
            'SHOPPING_FETCH_LIKED_GOODS',
            {},
            {
                goods_ids: goodsIds
            }
        );
        
        const result: LikedGoods[] = response.liked_relation_goods.map(function(likedInfo) {
            const likedGoods : LikedGoods = {
                goodsId: likedInfo.goods_id,
                liked: typeCastBoolean(likedInfo.liked)
            }
            return likedGoods;
        });
        
        likeStore.addLikedGoodsFromGoodsRelation(result);
    }
        
    /**
     * 장바구니에 상품 추가 
     * @param {CartOptions[]}optionList 상품 옵션리스트 
     * ex ) optionList: [{option_id : "545", ea: "1"}]
     * @returns 
     */
    async addCart(optionList: CartOptions[]): Promise<void> {
        const shoppingStore = useShoppingStore();
        if (!optionList) {
            return;
        }
        // 장바구니에 상품 넣어준다 
        const response = await this.dataSource.execute<{
            cart_count: number 
        }> (
            'SHOPPING_ADD_CART_GOODS',
            {},
            {
                goods_options:  optionList
            }
        );

        shoppingStore.changeCartCount(response.cart_count);
        
    }

    /**
     * 카트 카운트 동기화 처리 
     */
    async cartCountSync(): Promise<void> {
        const shoppingStore = useShoppingStore();
        const response = await this.dataSource.execute<{
            cart_count: number
        }>(
            'SHOPPING_CART_COUNT',
            {},
            {}
        );
        
        shoppingStore.changeCartCount(response.cart_count);
    }
    
    /**
     * 최근본 상품 리스트 최근순 조회
     * 
     * @param  {number=50} limit
     * @param  {string} fromDate?
     * @param  {string} toDate?
     */
    async getRecentViewGoods(limit: number=50, fromDate?: string, toDate?: string): Promise<BaseGoods[]> {
        const { recent_view_goods } = await this.dataSource.execute<RecentViewGoodsResponse>(
            'MEMBER_RECENT_VIEW_GOODS',
            {
                limit: limit,
                from_date: fromDate || moment().subtract(2, 'weeks').format('YYYY-MM-DD'),
                to_date: toDate || moment().format('YYYY-MM-DD'),
            },
            {}
        );

        const recentViewGoods = recent_view_goods.map(goods => {
            return {
                id: goods.id,
                name: goods.name,
                brandName: goods.brand_name,
                thumbnailUrl: goods.thumbnail_url,
                baseDiscountedPrice: goods.base_discounted_price,
                sellPrice: goods.base_discounted_price,
                saleRate: goods.sale_rate,
                isSoldout: goods.is_soldout,
                price: goods.base_discounted_price,
            }
        })
        
        return recentViewGoods;
    }

    /**
     * 최근 본 기획전 추가
     * 최대 30개 기획전 노출되고 30개 초과 시 오래 된 기획전부터 삭제 됨
     * 최근 본 기획전에 노출된 지 2주(14일)가 지났을 시, 기획전 자동 삭제
     * @param  {number} planningId
     * @returns Promise
     */
    async addRecentViewPlanning(planningId: number): Promise<void> {
        if (planningId == 0) {
            return;
        }
        await this.dataSource.execute(
            'MEMBER_ADD_RECENT_VIEW_PLANNING',
            {
                planning_id: planningId
            },
            {},
        )
    }

    /**
     * 최근본 기획전 리스트 최근순 조회
     * 
     * @param  {number=50} limit
     * @param  {string} fromDate?
     * @param  {string} toDate?
     * @returns Promise
     */
    async getRecentViewPlannings(limit: number=30, fromDate?: string, toDate?: string): Promise<RecentViewPlanning[]> {
        const { recent_view_plannings } = await this.dataSource.execute<RecentViewPlanningsResponse>(
            'MEMBER_RECENT_VIEW_PLANNINGS',
            {
                limit: limit,
                from_date: fromDate || moment().subtract(2, 'weeks').format('YYYY-MM-DD'),
                to_date: toDate || moment().format('YYYY-MM-DD'),
            },
            {}
        )
        
        return (recent_view_plannings || []).map(planning => {
            return {
                id: planning.id,
                title: planning.title,
                isEnded: planning.is_ended,
            }
        })
    }

    /**
     * 장바구니 상품 조회
     */
    async getCartList(): Promise<{ 
            cartList : Cart[],
            fetchLikedGoodsIdList: number[] 
    }> {
        const response = await this.dataSource.execute<{
            packs: CartPackResponse[]
        }> (
            'SHOPPING_CART_ITEMS',
            {},
            {}
        )

        let likedGoodsIds: number[] = [];
        let relationIndex  = 0;
        const cartList: Cart[] = response.packs.map((pack) => {
            const items = pack.items.map((item) => {
                likedGoodsIds.push(item.goods_id);
                return {                    
                    brandId: item.brand_id,
                    brandName: item.brand_name,
                    cartId: item.cart_id,                    
                    ea: item.ea,
                    optionId: item.option_id,
                    optionStock: item.option_stock,
                    optionName: item.option_name,
                    optionExtraAmount: item.option_extra_amount,
                    goodsId: item.goods_id,
                    goodsName: item.goods_name,
                    goodsHeadline: item.goods_headline,
                    goodsThumbnailUrl: item.goods_thumbnail_url,
                    goodsSellPrice: item.goods_sell_price,
                    goodsBaseDiscountedPrice: item.goods_base_discounted_price,
                    goodsStock: item.goods_stock,
                    goodsType: item.goods_type,
                    isSoldout: item.is_soldout,
                    sellerId: item.seller_id,
                    sellerName: item.seller_name,
                    likedRelationIndex: relationIndex++,
                }
            });
            
            return {
                isChargeOnEach: pack.is_charge_on_each,
                conditionalFreeFrom: pack.conditional_free_from,
                extraShippingPrice: pack.extra_shipping_price,
                shippingPrice: pack.shipping_price,
                shippingPricePolicy: pack.shipping_price_policy,
                items             
            }
        })
        
        return {
            cartList,
            fetchLikedGoodsIdList: likedGoodsIds
        };
    }
    
    /**
     * 장바구니 옵션 업데이트 
     * @param {number} cartId: 장바구니 ID
     * @param {number} optionId : 옵션 ID
     * @param {number} ea : 수량
     */
    async updateCartGoodsOption(cartId: number, optionId: number, ea: number): Promise<void> {
        const response = await this.dataSource.execute<void>(
            'SHOPPING_CART_ITEM_OPTION_AND_STOCK_UPDATE',
            {},
            {
                cart_id: cartId,
                option_id: optionId,
                ea: ea
            },
        );
    }

    /**
     * 장바구니 삭제처리 
     * @param {Array<Number>} cartIds: 장바구니 ID 배열
     */
    async removeCartItems(cartIds: number[]): Promise<void> {
        if (cartIds.length < 1) {
            throw('삭제할 항목이 없습니다.');
        }
        const shoppingStore = useShoppingStore();
        const response = await this.dataSource.execute<{ 
            cart_count: number
        }> (
            'SHOPPING_CART_ITEMS_REMOVE',            
            {},
            {
                cart_ids: cartIds,
            }
        )

        shoppingStore.changeCartCount(response.cart_count);
    }

    /**
     * 쇼핑몰 고유 식별자 ID
     */
    async shopperUuid(): Promise<string> {

        const response = await this.dataSource.execute<{uuid : string}>(
            'SHOPPER_UUID',
            {},
            {}
        )
        return response.uuid;       
    }


    /**
     * 최근본 상품 추가 
     * @param goodsIds  {number[]|number}  : 상품 ID 
     * @param thumbnailUrl  : 상품 썸네일 이미지
     * @param isUser : 회원여부 
     * @example
     *  * ```javascript
     * addRecentViewGood(4143, https://img.nstationmall.com/mall//goods/000/000/004/143/1.jpg?resizewb=800x800&updated_at=20220404134608, false )
     * ```
     */
    // /**
    //  * 회원 최근본 상품 추가
    //  * 최대 50개 상품 노출되고 50개 초과 시 오래 된 상품부터 삭제 됨
    //  * 최근 본 상품에 노출된 지 2주(14일)가 지났을 시, 상품 자동 삭제
    //  * @param  {number[]} goodsIdList
    //  * @returns Promise
    // */
    async addRecentViewGood(goods: BaseGoods, isUser: boolean): Promise<void> { 
        const store = useShoppingStore();
        store.addRecentViewGoodsRecord(goods)

        //회원인 경우 저장 처리 
        if (isUser) {
            await this.dataSource.execute(
                'MEMBER_ADD_RECENT_VIEW_GOODS',
                {},            
                {
                    goods_ids: [goods.id]
                },
            )
        }      
    }

    /**
     * 사이즈 가이드 이미지 조회
     * @param sellerId 
     */
    async sizeGuidImages(sellerId: number):Promise<string[]> {

        const response = await this.dataSource.execute<{
            size_chart_images: string[]
        }> (
            'GOODS_SIZE_GUIDE',
            {
                sellerId: sellerId
            },
            {}
        )

        return response.size_chart_images;
    }

    /**
     * 사은품 상세 조회
     * @param {number} id : 사은품 ID
     * @returns 
     */
    async getGiveawayDetail(id: number):Promise<GiveAway> {
        const response = await this.dataSource.execute<{            
            name: string,
            condition_label: string;
            image_url: string;
            image_alt: string;
            start_at: Date;
            end_at: Date;
        }>(
            'SHOPPING_GIVEAWAY_DETAIL',
            {
                id: id
            },
            {}
        );

        return {
            id: id,
            name: response.name,
            conditionLabel: response.condition_label,
            imageUrl: response.image_url,
            startAt: response.start_at,
            endAt: response.end_at
        }
    }

    /**
     * 사은품 상세 
     * @param {number} id : 사은품 ID
     * @param {number} page : 페이지
     * @param {number} perPage : 페이지당 노출 수 
     * @returns 
     */
    async getGiveawayOnGoods(id: number, page: number, perPage: number): Promise<Paginator<GiveAwayGoods>> {
        const { paginator } = await this.dataSource.execute<{
            paginator: {
                total: number;
                current_page: number;
                per_page: number;
                data: {
                    id: number;
                    name: string;
                    headline: string;
                    brand_name: string;
                    thumbnail_url: string;
                }[]
            }
        }>(
            'SHOPPING_GIVEAWAY_DETAIL_TARGET_GOODS',
            {
                id: id,
                page: page,
                page_size: perPage
            },
            {}
        );

        return {
            currentPage: paginator.current_page,
            total: paginator.total,
            perPage: paginator.per_page,
            data: paginator.data.map((goods) => {
                return {
                    id: goods.id,
                    name: goods.name,
                    brandName: goods.brand_name,
                    thumbnailUrl: goods.thumbnail_url,
                    headline: goods.headline                                        
                };
            }),
        }
    }
}


const shoppingRepository = new ShoppingRepository(
    new BackendMapper
)

export { shoppingRepository }
