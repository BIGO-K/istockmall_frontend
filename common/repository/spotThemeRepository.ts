import { Template, TemplateResponse } from '$/@type/spotTheme'
import BaseRepository from '$/repository/baseRepository'
import { BackendMapper } from '$/dataMapper/backendMapper';
import { JsonMapper } from '$/dataMapper/jsonMapper';

class SpotThemeRepository extends BaseRepository {

    /**
     * 스팟성 테마관 상세 조회
     */
    async getSpotTheme(spotThemeId: number): Promise<Template[]> {
        const { template_list } = await this.dataSource.execute<{ template_list: TemplateResponse[] }>(
            'SPOT_THEME_TEMPLATE_LIST',
            {
                spotThemeId: spotThemeId
            },
            {}
        );

        return template_list.map((template) => {
            return {
                id: template.id,
                type: template.type,
                bannerImageUrl: template.banner_image_url,
                bannerImageAlt: template.banner_image_alt,
                mainText1: template.main_text1,
                mainText2: template.main_text2,
                subText1: template.sub_text1,
                subText2: template.sub_text2,
                url: (!template.url || template.url.startsWith('/')) ? template.url : `/${template.url}`,
                goodsList: template.goods_list.map((goods) => {
                    return {
                        id: goods.id,
                        name: goods.name,
                        brandName: goods.brand_name,
                        thumbnailUrl: goods.thumbnail_url,
                        isSoldout: goods.is_soldout,
                        isOnlyAdult: goods.is_only_adult,
                        baseDiscountedPrice: goods.base_discounted_price,
                        saleRate: goods.sale_rate,
                        sellPrice:goods.sell_price,
                        price: goods.price,
                        badges: goods.badges,
                        reviewCount:  goods.review_count || 0,
                        reviewScoreAverage: goods.review_score_average  || 0,
                        wishCount: goods.wish_count  || 0,
                    }
                })
            }
        })
    } 

}

const spotThemeRepository = new SpotThemeRepository(
    new BackendMapper
)

export { spotThemeRepository }