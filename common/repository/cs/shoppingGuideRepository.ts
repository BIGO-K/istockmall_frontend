import { ShoppingGuidesActivesInfo } from '$/@type/cs/shoppingGuide';
import { BackendMapper } from "$/dataMapper/backendMapper";
import BaseRepository from "$/repository/baseRepository";

/**
 * 이용안내 레파지토리
 */
class ShoppingGuideRepository extends BaseRepository
{
    /**
     * 노출해야할 이용안내 정보 조회
     * @returns Promise<ShoppingGuidesActivesInfo>
     */
    async getShoppingGuidesActivesInfo() : Promise<ShoppingGuidesActivesInfo> {
        const response = await this.dataSource.execute<{
            shopping_guides_actives_info: {
                is_use_reward: boolean;
                actives_easypays: string[]; // 안내할 간편결제 종류 ex) 간편결제(카카오페이)
            };
        }>(
            'CS_SHOPPING_GUIDES_ACTIVES_INFORMATION',
            {},
            {}
        );

        return {
            isUseReward: response.shopping_guides_actives_info.is_use_reward,
            activesEasypays: {
                isNaverPayUse : response.shopping_guides_actives_info.actives_easypays.includes('naverpay'),
                isKakaoPayUse : response.shopping_guides_actives_info.actives_easypays.includes('kakaopay'),
                isPaycoUse : response.shopping_guides_actives_info.actives_easypays.includes('payco'),
                isTossUse : response.shopping_guides_actives_info.actives_easypays.includes('toss'),
            },
        };
    };
};

const shoppingGuideRepository = new ShoppingGuideRepository(
    new BackendMapper
);

export { shoppingGuideRepository }