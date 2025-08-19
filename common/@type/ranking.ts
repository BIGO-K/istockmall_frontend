import { BaseBrand } from "$/@type/brand";
import { Goods, BaseResponseGoods, ResponseGoods } from "$/@type/goods";

/**
 * 랭킹 메인
 */
 interface RankingMain {
    rankingItem: RankingItem;
    rankingBrand: RankingBrand;
    rankingView: RankingItem;
    rankingLike: RankingItem;
}

/**
 * 아이템, view, 찜 랭킹 > 정보
 */
interface RankingItem {
    hasRankRange: boolean;
    targetDate: string;
    rankPeriod?: string;
    goodsIds: number[];
    goodsList?: RankingGoods[];
}

/**
 * 아이템, view, 찜 랭킹 > 상품 목록
 * 랭킹 상품 목록에서 사용하는 유료기능 - 아이콘, 헤드라인, 마우스 오버 이미지
 */
interface RankingGoods extends Goods {
    rank: number;
    changeType: 'U'|'D'|'N'|''; // 순위 변동 타입 (U : 상승, D : 하락, N : 신규, '' : 변동없음)
    changeValue: number;
    alt?: string;
}

/**
 * API 응답용 인터페이스
 * 아이템, view, 찜 랭킹
 */
interface RankingItemResponse {
    has_rank_range: boolean;
    target_date: string;
    rank_period?: string;
    goods_list?: RankingGoodsResponse[];
}

/**
 * API 응답용 인터페이스
 * 아이템, view, 찜 랭킹 > 상품 목록
 * 랭킹 상품 목록에서 사용하는 유료기능 - 아이콘, 헤드라인, 마우스 오버 이미지
 */
interface RankingGoodsResponse extends ResponseGoods {
    rank: number;
    change_type: 'U'|'D'|'N'|'';
    change_value: number;
    alt?: string;
    badges?: string[];
}

/**
 * 브랜드 랭킹 > 정보
 */
interface RankingBrand {
    hasRankRange: boolean;
    targetDate: string;
    rankPeriod?: string;
    brandList: RankingBrandList[];
}

/**
 * 브랜드 랭킹 > 브랜드 목록
 */
interface RankingBrandList extends BaseBrand  {
    id: number;
    name: string;
    rank: number;
    changeType: string;
    changeValue: number;
    goodsList?: RankingBrandGoods[];
}

/**
 * 브랜드 랭킹 > 브랜드 목록 > 상품 목록
 */
interface RankingBrandGoods {
    id: number;
    name: string;
    brandName: string;
    saleRate: number; // 정가 대비 1차할인가 할인율
    baseDiscountedPrice: number;
    thumbnailUrl?: string;
    alt?: string;
    stock: number;
    mouseOverImageUrl?: string; // 마우스 오버용 이미지 
    icon?: {
        backgroundColor: string;
        textColor: string;
        label: string;
    };
    isOnlyAdult: boolean;
}

/**
 * API 응답용 인터페이스
 * 브랜드 랭킹 > 정보
 */
interface RankingBrandResponse {
    has_rank_range: boolean;
    target_date: string;
    rank_period?: string;
    brand_list: RankingBrandListResponse[];
}

/**
 * API 응답용 인터페이스
 * 브랜드 랭킹 > 브랜드 목록
 */
interface RankingBrandListResponse extends BaseBrand  {
    id: number;
    name: string;
    rank: number;
    change_type: string;
    change_value: number;
    goods_list?: RankingBrandGoodsResponse[];
}

/**
 * API 응답용 인터페이스
 * 브랜드 랭킹 > 브랜드 목록 > 상품 목록
 */
interface RankingBrandGoodsResponse {
    id: number;
    name: string;
    brand_name: string;
    sale_rate: number;
    base_discounted_price: number;
    thumbnail_url?: string;
    alt?: string;
    stock: number;
    is_soldout?: boolean;
    mouse_over_image_url?: string; // 마우스 오버용 이미지 
    icon?: {
        background_color_code: string;
        font_color_code: string;
        label: string;
    };
    is_only_adult: boolean;
}

export type {
    RankingMain,
    RankingItem,
    RankingGoods,
    RankingBrand,
    RankingBrandList,
    RankingBrandGoods,
    RankingItemResponse,
    RankingGoodsResponse,
    RankingBrandResponse,
    RankingBrandListResponse,
    RankingBrandGoodsResponse,
};
