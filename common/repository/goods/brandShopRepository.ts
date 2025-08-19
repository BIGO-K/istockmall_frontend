import { JsonMapper } from '$/dataMapper/jsonMapper';
import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository'
import { Brand, BrandCategories, BrandShopInfo } from '$/@type/brand';
import { Goods, ResponseGoods } from '$/@type/goods';
import { CommonFilter, CommonGoodsFilter, FilterCategoryResponse, FilterColor, FilterFit, FilterShoesSize } from '$/@type/searchFilter';
import { SimplePaginator, PaginatorResponse } from '$/@type';
import { FilterCategory } from '$/@type/searchFilter';
import { typeCastNumber } from '$/filters';

/**
 * 브랜드샵 관련 레파지토리 
 */
class BrandShopRepository extends BaseRepository
{       
    /**
     * 브랜드샵 정보 조회  + 큐레이션 조회
     * @param brandId 브랜드 ID
     */
    async brandInfo(brandId: number): Promise<BrandShopInfo> {
        const response = await this.dataSource.execute<{
            brand_name: string,
            main_text: string,
            sub_text: string,
            top_mobile_image_url: string,
            top_pc_image_url: string,
            is_use_recommended_goods: boolean,
            curations: ResponseGoods[],
            brand_contents: {
                id: number,
                title: string,
                image_url: string,
                image_alt: string,
                main_text_1: string,
                main_text_2: string
            }[]
        }>(
            'GOODS_BRAND_SHOP_INFO_WITH_CURATION',
            {
                brandId
            },
            {}
        )

        return {
            id: brandId,
            name: response.brand_name,
            mainText: response.main_text,
            subText: response.sub_text,
            topMobileImageUrl: response.top_mobile_image_url,
            topPcImageUrl: response.top_pc_image_url,
            isUseRecommendedGoods: response.is_use_recommended_goods,
            curations: response.curations.map((curationGoods) => {
                return {
                    id: curationGoods.id,
                    name: curationGoods.name,
                    brandName: curationGoods.brand_name,
                    sellPrice: curationGoods.base_discounted_price,
                    thumbnailUrl: curationGoods.thumbnail_url,
                    price: curationGoods.price,
                    baseDiscountedPrice: curationGoods.base_discounted_price,
                    saleRate: curationGoods.sale_rate,
                    stock: curationGoods.stock,
                    isSoldout: curationGoods.is_soldout,
                    isOnlyAdult: curationGoods.is_only_adult,
                    badges: curationGoods.badges,
                    reviewCount: curationGoods.review_count,
                    reviewScoreAverage: curationGoods.review_score_average,
                    wishCount: curationGoods.wish_count,
                    headline: curationGoods.headline,
                    mouseOverImageUrl: curationGoods.mouse_over_image_url,
                    icon: curationGoods.icon === null ? null : {
                        backgroundColor: curationGoods.icon.background_color_code,
                        textColor: curationGoods.icon.font_color_code,
                        label: curationGoods.icon.label
                    }               
                }
            }),
            brandContents: response.brand_contents.map((brandContent) => {
                return {
                    id: brandContent.id,
                    title: brandContent.title,
                    imageUrl: brandContent.image_url,
                    imageAlt: brandContent.image_alt,
                    mainText1: brandContent.main_text_1,
                    mainText2: brandContent.main_text_2
                }
            })
        }
    }

    /**
     * 브랜드샵 필터 조회
     * @param {number} brandId: 브랜드 ID 
     */
    async commonFilter(brandId: number):  Promise<CommonFilter> {
        const { filters } = await this.dataSource.execute<{
            filters: {
                categories: FilterCategoryResponse[],
                fit_sizes: FilterFit[],
                shoes_sizes: FilterShoesSize[],
                colors: FilterColor[]
            },      
        }> (
            'GOODS_BRAND_SHOP_FILTER',
            {
                brandId: brandId,
            },
            {}
        );
        
        return {
            brands: [],
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
     * 브랜드샵 상품 조회
     * @param brandId 
     */
    async brandShopGoods(brandId: number, filter: CommonGoodsFilter): Promise<{
        paginator: SimplePaginator<Goods>,
        goodsIds: number[]
    }> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<ResponseGoods>> (            
            'GOODS_BRAND_SHOP_FILTERED_GOODS',
            {
                brandId: brandId,
                category_codes: filter.categoryCodes,
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
                page_size: filter.perPage || 100
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

    /**
     * 브랜드샵 상품 카운트
     * @param brandId : 브랜드 ID
     * @param filter : 필터정보
     * @returns 
     */
    async filteredGoodsTotalCount(brandId: number, filter: CommonGoodsFilter): Promise<number> {
        const response = await this.dataSource.execute<{ total_count: number }>(
            'GOODS_BRAND_SHOP_COUNT',
            {
                brandId: brandId,
                category_codes: filter.categoryCodes,
                // price_ranges: filter.priceRanges,
                max_price: filter.maxPrice,
                min_price: filter.minPrice,
                review_stars: filter.reviewRates,
                fit_sizes: filter.fitIds,
                shoes_sizes: filter.shoesSizeIds,
                colors: filter.colorIds,
                only_free_delivery: filter.onlyFreeDelivery,
                only_sale: filter.onlySale,
                except_soldout: filter.exceptSoldout,              
            },
            {}
        );

        return response.total_count;
    }

    /**
     * 브랜드맵 구분값 조회
     * @returns
     */
    async brandCategories(): Promise<BrandCategories[]> {
        const response = await this.dataSource.execute<{
            brand_categories: {
                id: number,
                name: string
            }[]
        }>(
            'BRAND_CATEGORIES',
            {},
            {}
        )

        return response.brand_categories.map((brandCategory) => {
            return {
                id: brandCategory.id,
                name: brandCategory.name
            }
        })        
    }

    /**
     * 전체 진열 브랜드 조회
     * @returns Brand[]
     */
    async allBrands(): Promise<Brand[]> {
        const { brands } = await this.dataSource.execute<{
            brands: {
                id: number,
                eng_name: string,
                kor_name: string,
                brand_category_ids: number[]
            }[]
        }>(
            'ALL_DISPLAY_BRANDS',
            {},
            {}
        )

        return brands.map((brand) => {
            return {
                id: brand.id,
                korName: brand.kor_name,
                engName: brand.eng_name,
                brandCategoryIds: brand.brand_category_ids
            }
        })
    }
}

const brandShopRepository = new BrandShopRepository(
    new BackendMapper
)

export { brandShopRepository }
