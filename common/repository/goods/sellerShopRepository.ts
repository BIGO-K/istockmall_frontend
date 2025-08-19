import { JsonMapper } from '$/dataMapper/jsonMapper';
import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository'
import { Goods, ResponseGoods } from '$/@type/goods';
import { CommonGoodsFilter, FilterCategoryResponse, FilterBrandResponse, FilterShoesSize, FilterFit, FilterColor, CommonFilter } from '$/@type/searchFilter';
import { SimplePaginator, PaginatorResponse } from '$/@type';
import { typeCastNumber } from '$/filters';
import { SellerShopCuration } from '$/@type/seller';

/**
 * 판매자샵 관련 레파지토리 
 */
class SellerShopRepository extends BaseRepository
{       
    /**
     * 판매자샵 정보 조회 
     * @param sellerId 판매자 ID
     */
    async sellerInfo(sellerId: number): Promise<{name : string}> {
        const response = await this.dataSource.execute<{
            name: string
        }>(
            'GOODS_SELLER_SHOP_INFO',
            {
                seller_id: sellerId
            },
            {}
        )

        return {
            name: response.name
        }
    }

    /**
     * 판매자샵 NEW, BEST 조회
     * @param sellerId 
     */
    async getCurations(sellerId: number): Promise<SellerShopCuration> {
        const response = await this.dataSource.execute<{
            best_goods: ResponseGoods[],
            new_goods:  ResponseGoods[]
        }> (
            'GOODS_SELLER_SHOP_CURATION',
            {
                seller_id: sellerId
            },
            {}
        );        
        
        return {
            bestGoods: response.best_goods.map((goods) => {
                return {
                    id: goods.id,
                    name: goods.name,
                    brandName: goods.brand_name,
                    sellPrice: goods.base_discounted_price,
                    thumbnailUrl: goods.thumbnail_url,
                    price: goods.price,
                    baseDiscountedPrice: goods.base_discounted_price,
                    saleRate: goods.sale_rate,
                    stock: goods.stock,                    
                    isSoldout: goods.is_soldout,
                    isOnlyAdult: goods.is_only_adult,
                    headline: goods.headline,
                    mouseOverImageUrl: goods.mouse_over_image_url,
                    icon: goods.icon === null ? null : {
                        backgroundColor: goods.icon.background_color_code,
                        textColor: goods.icon.font_color_code,
                        label: goods.icon.label
                    }
                }
            }), 
            newGoods: response.new_goods.map((goods) => {
                return {
                    id: goods.id,
                    name: goods.name,
                    brandName: goods.brand_name,
                    sellPrice: goods.base_discounted_price,
                    thumbnailUrl: goods.thumbnail_url,
                    price: goods.price,
                    baseDiscountedPrice: goods.base_discounted_price,
                    saleRate: goods.sale_rate,
                    stock: goods.stock,
                    isSoldout: goods.is_soldout,
                    isOnlyAdult: goods.is_only_adult,
                }
            })
        }
    }
    
    /**
     * 판매자샵 필터 조회
     * @param {number} sellerId: 브랜드 ID 
     */
    async commonFilter(sellerId: number): Promise<CommonFilter> {
        const { filters } = await this.dataSource.execute<{
            filters: {
                categories: FilterCategoryResponse[],
                brands: FilterBrandResponse[],
                fit_sizes: FilterFit[],
                shoes_sizes: FilterShoesSize[],
                colors: FilterColor[]
            },      
        }> (
            'GOODS_SELLER_SHOP_FILTER',
            {
                seller_id: sellerId,
            },
            {}
        );
        
        return {
            categories: filters.categories.map((category) => {
                return {
                    code: category.code,
                    name: category.name,
                    goodsCount: category.goods_count,
                    childCategoryList: category.child_categories.map((depth2) => {
                        return {
                            code: depth2.code,
                            name: depth2.name,
                            fullPath: `${category.name} > ${depth2.name}`,
                            parentCode: category.code,
                            goodsCount: depth2.goods_count,
                            childCategoryList: depth2.child_categories.map((depth3) => {
                                return {
                                    code: depth3.code,
                                    parentCode: depth2.code,
                                    name: depth3.name,
                                    goodsCount: depth3.goods_count,
                                    fullPath: depth3.full_label,
                                }
                            })
                        }
                    })
                }
            }),
            brands: filters.brands.map((brand) => {
                return {
                    id: brand.id,
                    name: brand.name,
                    goodsCount: brand.goods_count
                }
            }),
            fitSizes: filters.fit_sizes.map((fit) => {
                return {
                    id: fit.id,
                    label: fit.label
                }
            }),
            shoesSizes: filters.shoes_sizes.map((shoes) => {
                return {
                    id: shoes.id,
                    label: shoes.label
                }
            }),
            colors: filters.colors.map((color) => {
                return {
                    id: color.id,
                    label: color.label,
                    code: color.code
                }
            })
        }
    }

    /**
     * 판매자샵 상품 카운트
     * @param sellerId : 판매자 ID
     * @param filter : 필터정보
     * @returns 
     */
    async filteredGoodsTotalCount(sellerId: number, filter: CommonGoodsFilter): Promise<number> {
        const response = await this.dataSource.execute<{ total_count: number }>(
            'GOODS_SELLER_SHOP_GOODS_COUNT',
            {
                seller_id: sellerId,
                category_codes: filter.categoryCodes,
                brand_ids: filter.brandIds,
                fit_sizes: filter.fitIds,
                shoes_sizes: filter.shoesSizeIds,
                colors: filter.colorIds,
                // price_ranges: filter.priceRanges,
                max_price: filter.maxPrice,
                min_price: filter.minPrice,
                review_stars: filter.reviewRates,
                only_free_delivery: filter.onlyFreeDelivery,
                only_sale: filter.onlySale,
                except_soldout: filter.exceptSoldout,   
                gender: filter.gender            
            },
            {}
        );

        return response.total_count;
    }

    /**
     * 판매자샵 상품 조회
     * @param brandId 
     */
    async filteringGoods(sellerId: number, filter: CommonGoodsFilter): Promise<{
        paginator: SimplePaginator<Goods>,
        goodsIds: number[]
    }> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<ResponseGoods>> (            
            'GOODS_SELLER_SHOP_FILTERED_GOODS',
            {
                seller_id: sellerId,
                category_codes: filter.categoryCodes,
                brand_ids: filter.brandIds,
                fit_sizes: filter.fitIds,
                shoes_sizes: filter.shoesSizeIds,
                colors: filter.colorIds,
                // price_ranges: filter.priceRanges,
                max_price: filter.maxPrice,
                min_price: filter.minPrice,
                review_stars: filter.reviewRates,
                only_free_delivery: filter.onlyFreeDelivery,
                only_sale: filter.onlySale,
                except_soldout: filter.exceptSoldout,
                sorting: filter.sorting,
                page: filter.page,
                page_size: filter.perPage || 100,
                gender: filter.gender    
            },
            {}
        );

        return {
            paginator: {
                currentPage: typeCastNumber(paginator.current_page),
                perPage: typeCastNumber(paginator.per_page),
                data: paginator.data.map((goods) => {
                    return {
                        id: goods.id,
                        brandName: goods.brand_name,
                        sellPrice: goods.base_discounted_price,
                        name: goods.name, 
                        thumbnailUrl: goods.thumbnail_url,
                        price: goods.price,
                        baseDiscountedPrice: goods.base_discounted_price,
                        saleRate: goods.sale_rate,
                        stock: goods.stock,
                        isSoldout: goods.is_soldout,
                        isOnlyAdult: goods.is_only_adult,
                        reviewCount: goods.review_count,
                        reviewScoreAverage: goods.review_score_average,
                        wishCount: goods.wish_count,
                        badges: goods.badges,
                        mouseOverImageUrl: goods.mouse_over_image_url,
                        headline: goods.headline,
                        icon: goods.icon === null ? null : {
                            backgroundColor: goods.icon.background_color_code,
                            textColor: goods.icon.font_color_code,
                            label: goods.icon.label
                        },
                        isUseStockNotify: goods.is_use_stock_notify          
                    }
                })
            },
            goodsIds: paginator.data.map((goods) => {
                return goods.id
            })
        }
    }

    
    
}

const sellerShopRepository = new SellerShopRepository(
    new BackendMapper
)

export { sellerShopRepository }
