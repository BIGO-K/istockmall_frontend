import { BaseBrand, BaseBrandResponse } from "./brand";

/**
 * 브랜드 필터용 인터페이스
 */
interface FilterBrand extends BaseBrand {
    goodsCount: number;
}

interface FilterBrandResponse extends BaseBrandResponse {
    goods_count: number;
}

interface FilterCategory {
    code: string;
    name: string;
    goodsCount: number;
    childCategoryList: ChildFilterCategory[];
}

interface ChildFilterCategory {
    code: string;
    parentCode: string;
    name: string;
    goodsCount: number;
    fullPath: string;
    childCategoryList?: ChildFilterCategory[];
}

interface FilterFit {
    id: number;
    label: string;
}

interface FilterShoesSize {
    id: number;
    label: string;
}

interface FilterColor {
    id: number;
    label: string;
    code: string;
}

interface FilterCategoryResponse {
    code: string;
    name: string;
    goods_count: number;
    full_label?: string;
    child_categories: FilterCategoryResponse[];
}

/**
 * 상품 관련 검색 기본 필터
 */
interface CommonGoodsFilter {
    /** 페이지  */
    page: number;
    /** 페이지당 노출 갯수 */
    perPage: number;
    /** 정렬 조건 */
    sorting: string;
    /** 카테고리 코드 */
    categoryCodes: string[];
    /** 브랜드 ID */
    brandIds: number[];
    /** 가격 범위 */
    // priceRanges: string[];
    //  최대금액
    maxPrice: number;
    // 최소 금액
    minPrice: number;
    /** 별점 */
    reviewRates: number[];
    /** 핏 */
    fitIds: number[],
    /** 슈즈  */
    shoesSizeIds: number[],
    /** 색상 */
    colorIds: number[],
    /** 성별 */
    gender?: string;
    /** */
    /** 무료 배송 여부 */
    onlyFreeDelivery: boolean;
    /** 할인 여부 */
    onlySale: boolean;
    /** 품절 제외 */
    exceptSoldout: boolean;
}

interface CommonFilter {
    categories: FilterCategory[],
    brands: FilterBrand[],
    fitSizes: FilterFit[],
    shoesSizes: FilterShoesSize[],
    colors: FilterColor[],
    gender?: string;
}

interface Tag { 
    /** 노출될 라벨명 */
    label: string;
    /** 필터 태그 종류 */
    type: string;
    /** 필터 태그 값 */
    value: string;
    /** 해당 필터내 구분할 수 있는 값 */
    key: string;  
}

interface PriceTag { 
    label: string;
    value: string;
    min: number;
    max: number;
}

export type {
    FilterBrand,
    FilterBrandResponse,
    FilterCategory,
    FilterCategoryResponse,
    ChildFilterCategory,
    CommonGoodsFilter,
    Tag,
    PriceTag,
    FilterFit,
    FilterShoesSize,
    FilterColor,
    CommonFilter
};
