import { 
    Banner, 
    BannerResponse, 
    MainPopup, 
    MainPopupResponse,
    CardBenefitResponse,
    CardInstallMentInfo,
    TopBanner,
    WingBanner,
    ExhibitCategoryResponse,
    ExhibitCategory,
} from '$/@type/exhibit';
import { BackendMapper } from '$/dataMapper/backendMapper';
import { JsonMapper } from '$/dataMapper/jsonMapper'
import BaseRepository from '$/repository/baseRepository'
import { typeCastBoolean, typeCastNumber } from '$/filters';

class ExhibitRepository extends BaseRepository {
    /**
     * 메인 배너 리스트 조회
     * @returns
     */
    async getMainBannerList(): Promise<Banner[]> {
        const response = await this.dataSource.execute<BannerResponse[]>(
            'FETCH_MAIN_BANNERS',
            {},
            {}
        );

        return response.map((bannerData) => {
            return {
                id: typeCastNumber(bannerData.idx),
                mobileTextUse: typeCastBoolean(bannerData.mobile_text_use),
                mobileImageUrl: bannerData.mobile_image,
                mobileMainText1: bannerData.mobile_main_text_1,
                mobileMainText2: bannerData.mobile_main_text_2,
                mobileSubText1: bannerData.mobile_sub_text_1,
                mobileSubText2: bannerData.mobile_sub_text_2,
                mobileTextColor: bannerData.mobile_text_color,
                displayMobileDeviceType: bannerData.mobile_device_type,
                pcTextUse: bannerData.pc_text_use,
                pcImageUrl: bannerData.pc_image,
                pcMainText1: bannerData.pc_main_text_1,
                pcMainText2: bannerData.pc_main_text_2,
                pcSubText1: bannerData.pc_sub_text_1,
                pcSubText2: bannerData.pc_sub_text_2,
                pcTextColor: bannerData.pc_text_color,
                linkUrl: bannerData.url
            }
        })
    }
    
    /**
     * 메인 팝업 조회
     * @param {string} displayDeviceType: 'P' : pc , 'M' : mobile
     * @returns 
     */
    async getMainPopups(displayDeviceType: string): Promise<MainPopup[]> {
        const response = await this.dataSource.execute<{ main_popups : MainPopupResponse[]}>(
            'FETCH_MAIN_POPUPS',
            {
                display_device_type: displayDeviceType
            },
            {}
        );

        const mainPoups: MainPopup[] = response.main_popups.map(function(popup) {
            const popupData: MainPopup = {
                imageUrl: popup.image_url,
                imageAlt: popup.image_alt,
                link: popup.link
            }

            return popupData;
        })

        return mainPoups;
    }

    /**
     * 카드 할부 정보 조회 
     */
    async cardBenefit(): Promise<CardInstallMentInfo|null> {
        const response = await this.dataSource.execute<{
            interest_info : {
                title: string,
                interest_free_list: CardBenefitResponse[]
                partial_interest_list: CardBenefitResponse[]
                display_start_at: string,
                display_end_at: string
            }
        }> (
            'CARD_INSTALLMENT',
            {},
            {}
        );

        if(response.interest_info === null) {
            return null;
        }

        return {
            title: response.interest_info.title,
            interestFreeList: response.interest_info.interest_free_list.map(function (benefit) {
                return {
                    imageUrl: benefit.image_url,
                    imageAlt: benefit.image_alt,
                    info: benefit.info
                }
            }),
            partialInterestList: response.interest_info.partial_interest_list.map(function (partial) {
                return {
                    imageUrl: partial.image_url,
                    imageAlt: partial.image_alt,
                    info: partial.info
                }
            }),
            startAt: response.interest_info.display_start_at,
            endAt: response.interest_info.display_end_at
        }
    }

    /**
     * 메인 탑배너 조회
     */
    async getTopBanner(): Promise<TopBanner|null> {
        const { top_banner } = await this.dataSource.execute<{ 
            top_banner: {
                title: string
                image_url: string
                alt: string
                link: string
                curtain_banner_image_url?: string
                curtain_banner_alt?: string
            } 
        }>(
            'MAIN_TOP_BANNERS',
            {},
            {}
        );
        
        return top_banner ? {
            title: top_banner.title,
            imageUrl: top_banner.image_url,
            alt: top_banner.alt,
            link: (!top_banner.link || top_banner.link.startsWith('/')) ? top_banner.link : `/${top_banner.link}`,
            curtainBannerImageUrl: top_banner.curtain_banner_image_url || '',
            curtainBannerAlt: top_banner.curtain_banner_alt || '',
        } : null
    }

    /**
     * 메인 날개배너 조회
     */
    async getWingBanners(): Promise<WingBanner[]> {
        const { wing_banners } = await this.dataSource.execute<{ 
            wing_banners: {
                title: string
                image_url: string
                alt: string
                link: string
                big_image_url: string
                big_image_alt: string
            }[]
        }>(
            'MAIN_WING_BANNERS',
            {},
            {}
        );
        
        return wing_banners.map((wingBanner) => {
            return {
                title: wingBanner.title,
                imageUrl: wingBanner.image_url,
                alt: wingBanner.alt,
                link: (!wingBanner.link || wingBanner.link.startsWith('/')) ? wingBanner.link : `/${wingBanner.link}`,
                bigImageUrl: wingBanner.big_image_url,
                bigImageAlt: wingBanner.big_image_alt,
            }
        })
    }

    /**
     * 1depth 카테고리 전시페이지 조회
     */
    async get1DepthCategory(categoryCode: string): Promise<ExhibitCategory|null> {
        const { category_page } = await this.dataSource.execute<{
            category_page: ExhibitCategoryResponse
        }>(
            'EXHIBIT_CATEGORY',
            {
                category_code: categoryCode
            },
            {}
        );


        if (category_page == null) {
            return null;
        }

        return {
            name: category_page.name,
            children: category_page.children.map((child) => {
                return {
                    code: child.code,
                    name: child.name,
                }
            }),
            mainBanners: (category_page.main_banners || []).map((banner) => {
                return {
                    id: banner.id,
                    imageUrl: banner.image_url,
                    alt: banner.alt,
                    link: banner.link?.startsWith('/') ? banner.link : `/${banner.link || ''}`,
                    text1: banner.text_1,
                    text2: banner.text_2,
                    text3: banner.text_3,
                    colorCode: banner.text_color,
                }
            }),
            brandBannerGroup: category_page.brand_banner_group ? {
                title: category_page.brand_banner_group.title || '',
                banners: (category_page.brand_banner_group.banners || []).map((banner) => {
                    return {
                        id: banner.id,
                        imageUrl: banner.image_url,
                        alt: banner.alt,
                        link: banner.link?.startsWith('/') ? banner.link : `/${banner.link || ''}`,
                        text1: banner.text_1,
                        text2: banner.text_2,
                        colorCode: banner.text_color,
                    }
                })
            } : null,
            brandGroup: category_page.brand_group ? {
                title: category_page.brand_group.title || '',
                brands: (category_page.brand_group.brands || []).map(brand => {
                    return {
                        id: brand.id,
                        name: brand.name
                    }
                })
            } : null,
            goodsGroup: category_page.goods_group ? {
                title: category_page.goods_group.title || '',
                goodsList: (category_page.goods_group.goods_list || []).map(goods => {
                    return {
                        id: goods.id,
                        name: goods.name,
                        brandName: goods.brand_name || '',
                        thumbnailUrl: goods.thumbnail_url,
                        isOnlyAdult: typeCastBoolean(goods.is_only_adult),
                        isUseStockNotify: typeCastBoolean(goods.is_use_stock_notify),
                        price: goods.price,
                        sellPrice: goods.sell_price,
                        baseDiscountedPrice: goods.base_discounted_price,
                        saleRate: goods.sale_rate,
                        stock: typeCastNumber(goods.stock),
                        isSoldout: typeCastBoolean(goods.is_soldout),
                        mouseOverImageUrl: goods.mouse_over_image_url || "",
                        icon: !goods.icon
                            ? undefined
                            : {
                                backgroundColor: goods.icon.background_color_code || '',
                                textColor: goods.icon.font_color_code || '',
                                label: goods.icon.label || '',
                            },
                        badges: goods.badges || [],
                        headline: goods.headline,
                        wishCount: typeCastNumber(goods.wish_count),
                        reviewCount: typeCastNumber(goods.review_count),
                        reviewScoreAverage: typeCastNumber(goods.review_score_average),
                    }
                }),
            } : null,
        }
    }
}

const exhibitRepository = new ExhibitRepository(
    new BackendMapper
)

export {
    exhibitRepository
}