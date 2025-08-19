import { ExcludeOptional } from "$/@type/index";
import { BaseBrand, BaseBrandResponse } from "$/@type/brand";
import { BaseGoods, BaseResponseGoods } from "$/@type/goods";

/**
 * 찜한 브랜드
 */
interface WishBrand extends BaseBrand {
    logoImageUrl: string;
}

/**
 * 찜한 상품 폴더
 */
interface WishGoodsFolder {
    id: number; // 폴더 ID
    name: string; // 폴더명
    orderSeq: number; // 폴더 정렬 순서
    recordsCount: number; // 폴더에 등록된 상품 갯수
    recentGoodsThumbnailUrl?: string; // 폴더에 등록된 첫번째 상품 이미지 url
}

/**
 * 찜한 상품
 */
type WishGoods = ExcludeOptional<BaseGoods>;

/**
 * 폴더 내 찜한 상품
 */
interface WishGoodsInFolder extends BaseGoods {}

/**
 * API 응답용 인터페이스
 **/
interface WishBrandResponse extends BaseBrandResponse {
    logo_image_url: string;
}

interface WishAllBrandsResponse {
    wish_brands: (
        Pick<BaseBrandResponse, "id" | "name"> & {
            logo_image_url: string;
        }
    )[];
}

interface WishGoodsFoldersResponse {
    wish_goods_folders: {
        id: number;
        name: string;
        order_seq: number;
        records_count: number;
        recent_goods_thumbnail_url?: string;
    }[];
}

type WishGoodsResponse = Pick<BaseResponseGoods, "id" | "name" | "thumbnail_url" | "base_discounted_price" | "sale_rate"> & {
    brand_name: string;
    is_soldout: boolean;
};

interface WishGoodsInFolderResponse {
    wish_goods: (
        Pick<BaseResponseGoods, "id" | "name" | "thumbnail_url" | "base_discounted_price" | "sale_rate"> & {
            brand_name: string;
            is_soldout: boolean;
        }
    )[];
}

export type {
    WishBrand,
    WishBrandResponse,
    WishAllBrandsResponse,
    WishGoodsFolder,
    WishGoodsFoldersResponse,
    WishGoods,
    WishGoodsResponse,
    WishGoodsInFolder,
    WishGoodsInFolderResponse,
};