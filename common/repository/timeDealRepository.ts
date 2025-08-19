import {
    TimeDealResponse,
    TimeDealsInfo,
    TimeDealsInfoResponse
} from '$/@type/timeDeal';
import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository'
import moment from 'moment';

class TimeDealRepository extends BaseRepository {

    /**
     * 타임딜 조회
     *
     * @returns Promise<TimeDeal[]>
     */
    async getTimeDeals(): Promise<TimeDealsInfo> {

        const response = await this.dataSource.execute<TimeDealsInfoResponse>(
            'TIME_DEAL',
            {},
            {}
        )

        return {
            type: response.type,
            banners: response.banners.map((timeDeal: TimeDealResponse) => {
                return {
                    id: timeDeal.id,
                    title: timeDeal.title,
                    displayStartAt: timeDeal.display_start_at,
                    startAt: timeDeal.sell_start_at,
                    endAt: timeDeal.sell_end_at,
                    imageUrl: timeDeal.image_url,
                    imageAlt: timeDeal.image_alt,
                    goodsId: timeDeal.goods_id,
                    isOnlyAdult: timeDeal.is_only_adult,
                    isStart: moment().diff(timeDeal.sell_start_at, 'seconds') > 0,
                    isEnd: moment().diff(timeDeal.sell_end_at, 'seconds') > 0,
                    isUseBannerText: timeDeal.is_use_banner_text,
                    bannerText1: timeDeal.banner_text_1,
                    bannerText2: timeDeal.banner_text_2,
                    bannerText3: timeDeal.banner_text_3,
                    bannerText4: timeDeal.banner_text_4,
                    bannerTextColor: timeDeal.banner_text_color ?? '#000000',// 기본 검정색
                    goodsName: timeDeal.goods_name || '',
                    brandName: timeDeal.brand_name || ''
                };
            })
        }
    }

}

const timeDealRepository = new TimeDealRepository(
    new BackendMapper
)

export {
    timeDealRepository
}