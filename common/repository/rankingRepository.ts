import {
    RankingMain,
    RankingItem,
    RankingGoods,
    RankingBrand,
    RankingBrandGoods,
    RankingItemResponse,
    RankingBrandResponse,
    RankingBrandList,
} from '$/@type/Ranking';
import { Category, CategoryResponseList } from '$/@type/category'
import BaseRepository from '$/repository/baseRepository'
import { JsonMapper } from '$/dataMapper/jsonMapper';
import { BackendMapper } from '$/dataMapper/backendMapper';
import moment from 'moment';
import { formatDate, typeCastBoolean, typeCastNumber } from '$/filters';

class RankingRepository extends BaseRepository {

    /**
     * 랭킹 메인 조회
     * @returns Promise
     */
    async getRankingMain(): Promise<{
        rankingMain: RankingMain;
        goodsIds: number[];
    }> {

        // range_type에 따른 산정기간 노출
        const rankRange = 'D';
        const targetDate = moment().format("YYYY.MM.DD");        

        // 아이템 랭킹
        const [item, brand, view, like] = await Promise.all([
            this.getRankingItem('goods-order', rankRange, '', 10),
            this.getRankingBrand(rankRange, 10),
            this.getRankingItem('goods-view', rankRange, '', 10),
            this.getRankingItem('goods-wish', rankRange, '', 10),
        ])

        // 랭킹 조합
        const rankingMain = {
            rankingItem: item,
            rankingBrand: brand,
            rankingView: view,
            rankingLike: like
        }

        // 찜한 상품 id
        let goodsIds:number[] = [];
        goodsIds = goodsIds.concat(item.goodsIds);
        goodsIds = goodsIds.concat(view.goodsIds);
        goodsIds = goodsIds.concat(like.goodsIds);

        // 각 랭킹에 있는 상품 id 하나의 배열로 합침
        goodsIds = goodsIds.filter((item,index)=>{
            return (goodsIds.indexOf(item) == index)
        });

        // 랭킹 정보 리턴
        return {
            rankingMain: rankingMain,
            goodsIds: goodsIds
        };
    }

    /**
     * 랭킹 조회 (아이템, 뷰, 찜)
     */
    async getRankingItem(
        rankingType: string, 
        rankRange: string, 
        categoryCode: string, 
        listLimit: number
    ): Promise<RankingItem> {

        const response = await this.dataSource.execute<RankingItemResponse>(
            'RANKING_ITEM',
            {
                ranking_type: rankingType,
                rank_range: rankRange,
                category_code: categoryCode ?? null,
                list_limit: listLimit ?? 200
            },
            {}
        );

        // range_type에 따른 산정기간 노출
        const rankPeriod = await this.getRankPeriod(rankRange, response.target_date);
        const targetDate = formatDate(response.target_date, 'YYYY.MM.DD');

        const goodsIds: number[] = [];
        const goodsList:RankingItem['goodsList'] = (response.goods_list || []).map(function (goods) {
            goodsIds.push(goods.id);
            const rankingGoods:RankingGoods = {
                rank: goods.rank,
                changeType: goods.change_type || '',
                changeValue: goods.change_value,
                alt: goods.alt,
                id: goods.id,
                name: goods.name,
                brandName: goods.brand_name || '',
                thumbnailUrl: goods.thumbnail_url,
                price: goods.price,
                sellPrice: goods.sell_price,
                baseDiscountedPrice: goods.base_discounted_price,
                stock: goods.stock,
                saleRate: goods.sale_rate,
                isSoldout: typeCastBoolean(goods.is_soldout),
                isOnlyAdult: goods.is_only_adult,
                mouseOverImageUrl: goods.mouse_over_image_url,
                headline: goods.headline,
                icon: goods.icon == null ? undefined : {
                    backgroundColor: goods.icon.background_color_code,
                    textColor: goods.icon.font_color_code,
                    label: goods.icon.label
                },
                wishCount: typeCastNumber(goods.wish_count)
            };

            return rankingGoods;
        });
        
        // 랭킹 상품 정보
        return {
            hasRankRange: response.has_rank_range,
            targetDate: targetDate,
            rankPeriod: rankPeriod,
            goodsIds: goodsIds,
            goodsList: goodsList
        };
    }

    /**
     * BRAND 랭킹 조회
     * PC > 메인 노출 12개, 상세 100개
     * Mobile > 메인 노출 10개, 상세 100개
     */
    async getRankingBrand(
        rankRange: string, 
        listLimit: number
    ): Promise<RankingBrand> {

        const response = await this.dataSource.execute<RankingBrandResponse>(
            'RANKING_BRAND',
            {
                rank_range: rankRange,
                list_limit: listLimit ?? 100
            },
            {}
        );

        // range_type에 따른 산정기간 노출
        const rankPeriod = await this.getRankPeriod(rankRange, response.target_date);
        const baseDate = formatDate(response.target_date, 'YYYY.MM.DD');

        // 랭킹 브랜드 정보
        const brandList: RankingBrandList[] = response.brand_list.map(brand => {
            return {
                rank: brand.rank,
                changeType: brand.change_type,
                changeValue: brand.change_value,
                id: brand.id,
                name: brand.name,
                goodsList: (brand.goods_list || []).map(goods => {
                    return {
                        id: goods.id,
                        name: goods.name || '테스트 상품명',
                        brandName: brand.name,
                        saleRate: goods.sale_rate || 30,
                        thumbnailUrl: goods.thumbnail_url,
                        alt: goods.alt,
                        baseDiscountedPrice: goods.base_discounted_price,
                        stock: goods.stock,
                        mouseOverImageUrl: goods.mouse_over_image_url,
                        icon: goods.icon == null ? undefined : {
                            backgroundColor: goods.icon.background_color_code,
                            textColor: goods.icon.font_color_code,
                            label: goods.icon.label
                        },
                        isOnlyAdult: typeCastBoolean(goods.is_only_adult),
                    }
                })
            }
        });

        return {
            hasRankRange: response.has_rank_range,
            targetDate: baseDate,
            rankPeriod: rankPeriod,
            brandList: brandList
        }
    }

    /**
     * 랭킹 산정기간 데이터 세팅
     * @returns string
     */
    async getRankPeriod(rankRange:string, targetDate: string): Promise<string> {

        let rankPeriod = "";

        if (rankRange === 'W') {
            rankPeriod = moment(targetDate).subtract("7","d").format("YYYY.MM.DD. 00:00") + '~' + moment(targetDate).format("YYYY.MM.DD. 23:59");
        } else if (rankRange === 'M') {
            rankPeriod = moment(targetDate).subtract("1","M").format("YYYY.MM.DD. 00:00") + '~' + moment(targetDate).format("YYYY.MM.DD. 23:59");
        } else {
            rankPeriod = moment(targetDate).format("YYYY.MM.DD. 00:00~23:59");
        }

        return rankPeriod;
    }

    /**
     * 카테고리 1뎁스 조회
     * @returns Promise<Category[]>
     */
    async fetchCategoryList(): Promise<Category[]> {
        const response = await this.dataSource.execute<CategoryResponseList>(
            'GOODS_DISPLAY_ALL_CATEGORIES',
            {},
            {}
        )
        
        const allCategoryList: Category[] = response.category_list.map(function(category) {
            const dpeth1Category: Category = {
                code : category.code,
                name: category.name,
                imageUrl : category.image_url,
            }
            
            return dpeth1Category;
        })
                
        return allCategoryList;
    }

}

// BackendMapper/JsonMapper
const rankingRepository = new RankingRepository(
    new BackendMapper
)

export { 
    rankingRepository 
}