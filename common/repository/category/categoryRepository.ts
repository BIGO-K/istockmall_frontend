import { JsonMapper } from '$/dataMapper/jsonMapper';
import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository'
import { Category, CategoryResponseList } from '$/@type/category'
import { PaginatorResponse, SimplePaginator } from '$/@type';
import { Goods, ResponseGoods } from '$/@type/goods';
import { typeCastNumber } from '$/filters';
import { 
    FilterBrandResponse, 
    CommonGoodsFilter, 
    CommonFilter, 
    FilterFit, 
    FilterShoesSize, 
    FilterColor 
} from '$/@type/searchFilter';

class CategoryRepository extends BaseRepository
{   
    categoryList: Category[] = [];

    async fetchCategoryList(): Promise<Category[]> {
        const response = await this.dataSource.execute<CategoryResponseList>(
            'GOODS_DISPLAY_ALL_CATEGORIES',
            {},
            {}
        )
        
        const allCategoryList: Category[] = response.category_list.map(function(category) {
            const depth2CategoryList: Category[] = category.children?.map(function (depth2Category) {
                const depth3CategoryList = depth2Category.children?.map(function(depth3Category) {
                    const depth3: Category = {
                        code: depth3Category.code,
                        name: depth3Category.name,
                        pcBannerImageUrl: depth3Category.pc_top_image_url,
                        pcBannerAlt: depth3Category.pc_top_alt,
                        mobileBannerImageUrl: depth3Category.mobile_top_image_url,
                        mobileBannerAlt: depth3Category.mobile_top_alt,         
                        fullPath: depth3Category.full_path                                
                    }
                    return depth3;                
                })
                
                const depth2: Category = {
                    code: depth2Category.code,
                    name: depth2Category.name,
                    childCategoryList: depth3CategoryList,
                    pcBannerImageUrl: depth2Category.pc_top_image_url,
                    pcBannerAlt: depth2Category.pc_top_alt,
                    mobileBannerImageUrl: depth2Category.mobile_top_image_url,
                    mobileBannerAlt: depth2Category.mobile_top_alt,
                    fullPath: depth2Category.full_path                                          
                }
                return depth2;                
            })

            const depth1Category: Category = {
                code : category.code,
                name: category.name,
                imageUrl : category.image_url,
                pcBannerImageUrl: category.pc_top_image_url,
                pcBannerAlt: category.pc_top_alt,
                mobileBannerImageUrl: category.mobile_top_image_url,
                mobileBannerAlt: category.mobile_top_alt,
                fullPath: category.full_path,                                          
                childCategoryList : depth2CategoryList
            }
            
            return depth1Category;
        })
                
        return allCategoryList;
    }
    /**
     * 현재 노출중인 카테고리 리스트조회(1->2->3 DEPTH 전체 조회)
     * @returns Promise<Category[]> 
     */
    async getAllCategoryList() : Promise<Category[]> 
    {
        if (this.categoryList.length < 1) {
            this.categoryList = await this.fetchCategoryList();
        }

        return this.categoryList;
    }    

    /**
     * 카테고리 상품 
     */
     // categoryGoodsFilter
    async filteredGoods(categoryCode: string, filter: CommonGoodsFilter): Promise<{
        paginator: SimplePaginator<Goods>
    }> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<ResponseGoods>> (
            'GOODS_CATEGORIES_COMMON',
            {
                category_code: categoryCode,
                brand_ids: filter.brandIds,
                fit_sizes: filter.fitIds,
                shoes_sizes: filter.shoesSizeIds,
                colors: filter.colorIds,                
                max_price: filter.maxPrice,
                min_price: filter.minPrice,
                review_stars: filter.reviewRates,
                only_free_delivery: filter.onlyFreeDelivery,
                only_sale: filter.onlySale,
                except_soldout: filter.exceptSoldout,
                sorting: filter.sorting,
                page: filter.page,
                page_size: filter.perPage                
            },
            {}
        );

        return {
            paginator: {
                currentPage: typeCastNumber(paginator.current_page === null ? filter.page : paginator.current_page),
                perPage: typeCastNumber(paginator.per_page === null ? filter.perPage : paginator.per_page),
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
                        }
                    }
                })
            }
        }
    }

    /**
     * 카테고리샵 필터 조회
     * @param {string} categoryCode: 카테고리 코드 
     */
    async commonFilter(categoryCode: string): Promise<CommonFilter> {
        const { filters } = await this.dataSource.execute<{
            filters: {
                brands: FilterBrandResponse[],
                fit_sizes: FilterFit[],
                shoes_sizes: FilterShoesSize[],
                colors: FilterColor[]
            }         
        }> (
            'GOODS_CATEGORIES_FILTER',
            {
                category_code: categoryCode,
            },
            {}
        );
        
        return {
            categories: [],
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
     * 필터 항목에 맞는 상품 전체 카운트 반환
     * @param categoryCode 
     * @param filter 
     * @returns 
     */
    async filteredGoodsTotalCount(categoryCode: string, filter: CommonGoodsFilter): Promise<number> {
        const response = await this.dataSource.execute<{ total_count: number }>(
            'GOODS_CATEGORIES_COMMON_COUNT',
            {
                category_code: categoryCode,
                brand_ids: filter.brandIds,
                fit_sizes: filter.fitIds,
                shoes_sizes: filter.shoesSizeIds,
                colors: filter.colorIds,
                max_price: filter.maxPrice,
                min_price: filter.minPrice,
                review_stars: filter.reviewRates,
                only_free_delivery: filter.onlyFreeDelivery,
                only_sale: filter.onlySale,
                except_soldout: filter.exceptSoldout                
            },
            {}
        );

        return response.total_count;
    }

    /**
     * 카테고리 정보 조회
     * @param categoryCode 
     * @returns 
     */
    async categoryInfo(categoryCode: string): Promise<{
        name: string,
        depth: number,
        depth1CategoryCode: string,
        depth2CategoryCode: string,
        depth3CategoryCode: string
    }> {
        const { category_info } = await this.dataSource.execute<{
            category_info: {
                depth: number,
                depth1_category_code: string,
                depth2_category_code: string,
                depth3_category_code: string,
                name: string
            }
        }> (
            'GOODS_CATEGORIES_COMMON_INFO',
            {
                category_code: categoryCode
            },
            {}
        )
        
        if (category_info === null) {
            return null
        }

        return  {
            depth: category_info.depth,
            depth1CategoryCode: category_info.depth1_category_code === null ? '' : category_info.depth1_category_code,
            depth2CategoryCode: category_info.depth2_category_code === null ? '' : category_info.depth2_category_code,
            depth3CategoryCode: category_info.depth3_category_code === null ? '' : category_info.depth3_category_code,
            name: category_info.name            
        }
    }
    
    /**
     * 카테고리에 속한 상품 조회 
     * @param categoryCodes : 카테고리코드 배열
     */
    async categoriesGoodsCount(categoryCodes: string[]): Promise<number[]> {

        if (categoryCodes.length < 1) {
            return [];
        }

        const response = await this.dataSource.execute<{
            category_goods_count : {
                category_code : string,
                goods_count: number
            }[]}>(
            'GOODS_CATEGORIES_INCLUDE_COUNT',
            {},
            {
                category_codes: categoryCodes
            }
        )

        return response.category_goods_count.map((categoryGoods) => {
            return categoryGoods.goods_count
        });
    }
}

const categoryRepository = new CategoryRepository(
    new BackendMapper
)

export { categoryRepository } 