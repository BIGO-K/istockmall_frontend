import { Goods } from "$/@type/goods";
/**
 * 베이스 브랜드 인터페이스
 */
interface BaseBrand {
    id: number;
    name: string;
}

interface BrandShopInfo extends BaseBrand {
    topPcImageUrl: string;
    topMobileImageUrl: string;
    mainText: string;
    subText: string;
    isUseRecommendedGoods: boolean;
    curations: Goods[];
    brandContents: {
        id: number;
        title: string;
        imageUrl: string;
        imageAlt: string;
        mainText1: string;
        mainText2: string;        
    }[]
}

/**
 * 브랜드 구분
 */
interface BrandCategories {
    id: number;
    name: string;
}

/**
 * API 응답용 인터페이스
 **/
interface BaseBrandResponse {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    korName: string;
    engName: string;
    brandCategoryIds: number[];
}

export type {
    Brand,
    BaseBrand,
    BaseBrandResponse,
    BrandShopInfo,
    BrandCategories,
};
