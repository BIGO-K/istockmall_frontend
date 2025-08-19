import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository';
import { Paginator, PaginatorResponse } from '$/@type';
import { Showcase, 
        ShowcaseResponse, 
        ShowcaseSort, 
        ShowcaseSortResponse, 
        ShowcaseDetail, 
        ShowcaseDetailResponse, 
        ShowcaseGoods,
        AnotherShowcase,
        AnotherShowcaseResponse } from '$/@type/showcase';
import { Ref } from 'vue';

/**
 * GNB > (유료)쇼케이스 관련 레파지토리
 */
class ShowcaseRepository extends BaseRepository
{
    /**
     * GNB > 쇼케이스 구분 리스트
     */
    async getSorts(): Promise<ShowcaseSort[]> {
        const { sort_list } = await this.dataSource.execute<{ sort_list: ShowcaseSortResponse[] }>(
            'SHOWCASE_SORT_LIST',
            {},
            {}
        );
        
        return sort_list.map((sort) => {
            return {
                id: sort.id,
                name: sort.name,
            }
        });
    }

    /**
     * GNB > 쇼케이스 리스트
     * 
     * @param { number = 1 } page
     * @param { number = 0 } sortId
     * @param { number = 12 } perPage
     * @returns Promise<Paginator<Showcase>>
     */
    async getShowcases(page: number = 1, sortId: Ref<number> | number | null = 0, perPage: number = 12): Promise<Paginator<Showcase>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<ShowcaseResponse>>(
            'SHOWCASE_LIST',
            {
                page: page,
                page_size: perPage,
                sort_id: sortId,
            },
            {}
        );

        return {
            currentPage: paginator.current_page,
            total: paginator.total,
            perPage: paginator.per_page,
            data: paginator.data.map((showcase) => {
                return {
                    id: showcase.id,
                    firstWords: showcase.first_words,
                    secondWords: showcase.second_words,
                    thumbnailUrl: showcase.thumbnail_url,
                    title: showcase.title,
                    brandId: showcase.brand_id,
                    brandName: showcase.brand_name,
                    sortId: showcase.sort_id,
                    sortName: showcase.sort_name,
                }
            })
        }
    }

    /**
     * GNB > 쇼케이스 상세
     * 
     * @param { number } showcaseId
     * @returns Promise
     */
    async getShowcaseDetails(showcaseId: number): Promise<ShowcaseDetail> {
        const { showcase_information } = await this.dataSource.execute<ShowcaseDetailResponse>(
            'SHOWCASE_DETAIL',
            {
                showcase_id: showcaseId
            },
            {}
        );
        
        return {
            id: showcase_information.id,
            title: showcase_information.title,
            firstWords: showcase_information.first_words,
            secondWords: showcase_information.second_words,
            brandId: showcase_information.brand_id,
            brandName: showcase_information.brand_name,
            createdAt: showcase_information.created_at,
            mobileBannerUrl: showcase_information.mobile_banner_url,
            mobileBannerAlt: showcase_information.mobile_banner_alt,
            pcBannerUrl: showcase_information.pc_banner_url,
            pcBannerAlt: showcase_information.pc_banner_alt,
            subTitle: showcase_information.sub_title,
            details: showcase_information.details,
            isVideo: showcase_information.is_video,
            videoUrl: showcase_information?.video_url,
            logoImageUrl: showcase_information.logo_image_url,
            groups: showcase_information.groups.map((group) => {
                // 상품 리스트
                const goodsList: ShowcaseGoods[] = group.goods_list.map((goods) => {
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
                        icon: goods.icon ? {
                            backgroundColor: goods.icon.background_color_code,
                            textColor: goods.icon.font_color_code,
                            label: goods.icon.label
                        } : null,
                        badges: goods.badges || [],
                        wishCount: goods.wish_count,
                        reviewCount: goods.review_count,
                        reviewScoreAverage: goods.review_score_average,
                        // liked: false,
                    }
                });

                return {
                    id: group.id,
                    mobileImageUrl: group.mobile_image_url,
                    mobileImageAlt: group.mobile_image_alt,
                    pcImageUrl: group.pc_image_url,
                    pcImageAlt: group.pc_image_alt,
                    goodsList: goodsList
                }
            })
        };
    }

    /**
     * GNB > 다른 쇼케이스 리스트 조회
     * 
     * @param { number } showcaseId
     * @returns Promise
     */
    async getAnotherShowcaseList(showcaseId: number): Promise<AnotherShowcase[]> {
        const { list_by_sort } = await this.dataSource.execute<{ list_by_sort: AnotherShowcaseResponse[] }>(
            'ANOTHER_SHOWCASE_LIST',
            {
                showcase_id: showcaseId
            },
            {}
        );

        return list_by_sort.map((showcase) => {
            return {
                id: showcase.id,
                title: showcase.title,
                thumbnailUrl: showcase.thumbnail_url,
                sortId: showcase.sort_id,
                sortName: showcase.sort_name
            }
        })
    }
}

const showcaseRepository = new ShowcaseRepository(
    new BackendMapper
)

export { showcaseRepository }