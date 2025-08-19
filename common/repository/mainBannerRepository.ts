import {
    MainBanner,
    MainBannerResponse,
} from '$/@type/mainBanner';
import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository'

class MainBannerRepository extends BaseRepository {

    /**
     * 메인 배너 조회(최대 4개)
     *
     * @returns Promise<MainBanner[]>
     */
    async getMainPopup(): Promise<MainBanner[]> {
        const { main_popups } = await this.dataSource.execute<{
            main_popups : MainBannerResponse[]
        }>(
            'FETCH_MAIN_POPUPS',
            {},
            {}
        );

        return main_popups.map(mainPopup => {
            return {
                imageAlt: mainPopup.image_alt,
                imageUrl: mainPopup.image_url,
                link: mainPopup.link ?? ''
            };
        });
    }
}

const mainBannerRepository = new MainBannerRepository(
    new BackendMapper
)

export {
    mainBannerRepository
}