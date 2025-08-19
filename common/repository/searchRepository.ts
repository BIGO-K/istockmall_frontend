import { BackendMapper } from '$/dataMapper/backendMapper';
import { JsonMapper } from '$/dataMapper/jsonMapper'
import BaseRepository from '$/repository/baseRepository'
import { typeCastNumber } from '$/filters';
import { PaginatorResponse } from '$/@type';
import { ResponseGoods} from '$/@type/goods';
import { CommonGoodsFilter,  FilterBrandResponse, FilterCategoryResponse, FilterColor, FilterFit, FilterShoesSize } from '$/@type/searchFilter';
import { AutoCompleteKeyword, HotKeyword, SearchResult } from '$/@type/front';


interface BaseSearchWords {
    text: string,
    customLink: string
}
class SearchRepository extends BaseRepository {

    basicSearchKeywords: BaseSearchWords[]

    isEmptyBasicSearchKeywords: boolean
    /**
     * 기본 검색어 조회 
     * @returns
     */
    async getBasicSearchKeywords() 
    {        
        if (!this.basicSearchKeywords) {
            await this.fetchBasicSearchKeywords();
        }
        return this.basicSearchKeywords[Math.floor(Math.random()* this.basicSearchKeywords.length)];
    }

    async fetchBasicSearchKeywords()
    {
        const response = await this.dataSource.execute<{ 
            basic_search_words : [
            {
                keyword: string,
                link_url: string
            }
            ]
        }> (
            'FETCH_BASE_SEARCH_WORDS',
            {},
            {}
        )
        
        this.basicSearchKeywords = response.basic_search_words.map(function (baseSearch) {
            return {
                text: baseSearch.keyword,
                customLink: baseSearch.link_url
            }            
        });

        this.isEmptyBasicSearchKeywords = response.basic_search_words.length > 0 ? false : true;
        return response.basic_search_words.map(function (baseSearch) {
            return {
                text: baseSearch.keyword,
                customLink: baseSearch.link_url
            }            
        });
    }

    /**
     * 검색 > 상품검색
     * @param {string} keyword : 검색어
     * @param {CommonGoodsFilter} filter : 필터조건
     * @returns 
     */
    async searchKeyword(keyword: string, filter: CommonGoodsFilter, doNotCorrect= false): Promise<SearchResult> {

        const { paginator, filters, best_goods, is_corrected, origin_keyword, related_keywords, corrected_keyword, brand } = await this.dataSource.execute<PaginatorResponse<ResponseGoods>& {
            filters: {
                categories: FilterCategoryResponse[],
                brands: FilterBrandResponse[],
                fit_sizes: FilterFit[],
                shoes_sizes: FilterShoesSize[],
                colors: FilterColor[]
            },
            best_goods: {
                id: number;
                base_discounted_price: number;
                price: number;
                name: string;
                is_only_adult: boolean;
                thumbnail_url: string;
                is_soldout: boolean;
                brand_name: string;
                stock: number;
                sale_rate: number;
            }[],
            is_corrected: boolean,
            origin_keyword: string,
            related_keywords: string[],
            corrected_keyword: string,
            brand: {
                id: number,
                name: string,
                kor_name: string,
                eng_name: string
            } | null
        }>(
            'SEARCH_ENGINE_SEARCH',
            {
                keyword: keyword,
                category_codes: filter.categoryCodes,
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
                page_size: filter.perPage,
                do_not_correct: doNotCorrect
            },
            {}
        )
        return {
            paginator: {
                currentPage: typeCastNumber(paginator.current_page),
                total: typeCastNumber(paginator.total),
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
                        }                    
                    }
                })
            },
            filters: {
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
            },
            goodsIds: paginator.data.map((goods) => {
                return goods.id
            }),        
            bestGoods: best_goods.map((goods) => {
                return {
                    id: goods.id,
                    baseDiscountedPrice: goods.base_discounted_price,
                    name: goods.name,
                    stock: goods.stock,
                    price: goods.price,
                    sellPrice: goods.base_discounted_price,
                    isOnlyAdult: goods.is_only_adult,
                    thumbnailUrl: goods.thumbnail_url,
                    isSoldout: goods.is_soldout,
                    saleRate: goods.sale_rate,
                    brandName: goods.brand_name,
                }
            }),
            isCorrected: is_corrected,
            originKeyword: origin_keyword,
            relatedKeywords: related_keywords.map((keyword) => {
                return keyword
            }),
            correctedKeyword: corrected_keyword,
            brand: brand === null ? null : {
                id : brand.id,
                name: brand.name,
                korName: brand.kor_name,
                engName: brand.eng_name
            }
        }  
    }

    /**
     * 인기검색어 조회
     */
    async getHotKeywords(): Promise<{
        indexedAt: string;
        hotKeywords: HotKeyword[]
    }> {
        const response = await this.dataSource.execute<{
            indexed_at: string;
            hot_search_words: {
                rank: number;
                previous_rank: number;
                keyword: string;
                change_type: string;
                change_rank: number
            }[]
        }>(
            'SEARCH_ENGINE_HOT_SEARCHES',
            {},
            {}
        );

        return {
            indexedAt: response.indexed_at,
            hotKeywords: response.hot_search_words.map((hotKeyword) => {
                return {
                    rank: hotKeyword.rank,
                    changeRank: hotKeyword.change_rank,
                    previousRank: hotKeyword.previous_rank,
                    changeType: hotKeyword.change_type,
                    keyword: hotKeyword.keyword
                }
            })
        }
    }   

    /**
     * 자동완성
     * @param keyword 
     */
    async getAutoComplete(keyword: string): Promise<AutoCompleteKeyword> {
        const { auto_completed } = await this.dataSource.execute<{
            auto_completed: {
                from: string;
                categories: {
                    code: string;
                    full_path: string;
                    depth: number;
                    name: string;
                }[],
                brands: {
                    id: number;
                    kor_name: string;
                    eng_name: string;
                    logo_image_url: string;
                }[]
                keywords: string[]
            }
        }>(
            'SEARCH_ENGINE_AUTO_COMPLETE',
            {
                keyword: keyword
            },
            {}
        );
        
        return {
            // from: response.from,
            categories: (auto_completed.categories || []).map((category) => {
                return {
                    code: category.code,
                    name: category.name,
                    depth: category.depth,
                    fullPath: category.full_path
                }
            }),
            brands: (auto_completed.brands || []).map((brand) => {
                return {
                    id: brand.id,
                    korName: brand.kor_name,
                    engName: brand.eng_name,
                    logoImageUrl: brand.logo_image_url,
                }
            }),
            keywords: auto_completed.keywords
        };
    }
    
    /**
     * 검색엔진 피드백 처리 
     * @param {string} keyword : 검색어
     * @param {number} goodsId : 상품 ID
     */
    async sendFeedBack(keyword: string, goodsId: number): Promise<void> {
        await this.dataSource.execute(
            'SEARCH_ENGINE_FEEDBACK',
            {},
            {
                keyword: keyword,
                goods_id: goodsId
            }
        );
    }
}

const searchRepository = new SearchRepository(
    // new BackendMapper
    new BackendMapper
)

export {
    searchRepository
}