import { Goods, ResponseGoods } from "$/@type/goods";

/**
 * 기본 코디샷
 */
interface SimpleCodyShot {
    id: number;
    brandName: string;
    title: string;
    thumbnailUrl: string;
    alt: string;
}

/**
 * 코디샷
 */
interface CodyShot extends SimpleCodyShot{
    subTitle: string;
    createdAt: string;
    pointers: Pointer[];
}

/**
 * 코디샷에 등록한 포인터
 */
interface Pointer {
    id: number;
    x: number;
    y: number;
    goods: Goods; // base goods에서 사용할 타입만 재정의해야 함.
}

/**
 * 코디샷 카테고리
 */
interface CodyShotCategory {
    id: number;
    name: string;
}


/**
 * API 응답용 인터페이스
 */

/**
 * 메인>코디샷 목록
 */
interface SimpleCodyShotResponse {
    id: number;
    title: string;
    brand_name: string;
    thumbnail_url: string;
    alt: string;
}

/**
 * 메인>코디샷 상세
 */
interface CodyShotsResponse extends SimpleCodyShotResponse {
    sub_title: string;
    created_at: string;
    pointers: PointerResponse[];
}

/**
 * 코디샷에 등록한 포인터
 */
interface PointerResponse {
    id: number;
    x: number;
    y: number;
    goods: ResponseGoods;
}


export type {
    Pointer,
    CodyShot,
    SimpleCodyShot,
    CodyShotCategory,
    CodyShotsResponse,
    SimpleCodyShotResponse,
};
