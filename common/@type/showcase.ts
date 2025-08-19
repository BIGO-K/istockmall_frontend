import { Goods, ResponseGoods } from '$/@type/goods';
import { LikedGoods } from '$/@type/shopping';

/**
 * 쇼케이스 구분 리스트
 */
interface ShowcaseSort {
    id: number;     // 쇼케이스 구분 ID
    name: string;   // 쇼케이스 구분명
}[];

interface ShowcaseSortResponse extends ShowcaseSort {};

/**
 * 쇼케이스 리스트
 */
interface Showcase {
    id: number;             // 쇼케이스 ID
    title: string;          // 쇼케이스 제목
    firstWords: string;     // 메인 문구1
    secondWords: string;    // 메인 문구2
    brandId: number;        // 브랜드 ID
    brandName: string;      // 브랜드명
    thumbnailUrl: string;   // 쇼케이스 대표이미지
    sortId: number;         // 쇼케이스 구분 ID
    sortName: string;       // 쇼케이스 구분명
};

interface ShowcaseResponse {
    id: number;            // 쇼케이스 ID
    title: string;         // 쇼케이스 제목
    first_words: string;   // 메인 문구1
    second_words: string;  // 메인 문구2
    brand_id: number;      // 브랜드 ID
    brand_name: string;    // 브랜드명
    thumbnail_url: string; // 쇼케이스 대표이미지
    sort_id: number;       // 쇼케이스 구분 ID
    sort_name: string;     // 쇼케이스 구분명
};

/**
 * 쇼케이스 상세
 */
interface ShowcaseDetail {
    id: number;                 // 쇼케이스 ID
    title: string;              // 쇼케이스 제목
    firstWords: string;         // 메인 문구1
    secondWords: string;        // 메인 문구2
    brandId: number;            // 브랜드 ID
    brandName: string;          // 브랜드명
    createdAt: string;          // 쇼케이스 등록일
    mobileBannerUrl: string;    // 쇼케이스 배너 이미지 (Mobile)
    mobileBannerAlt: string;    // 쇼케이너 배너 대체 텍스트 (Mobile)
    pcBannerUrl: string;        // 쇼케이스 배너 이미지 (PC)
    pcBannerAlt: string;        // 쇼케이너 배너 대체 텍스트 (PC)
    subTitle: string;           // 쇼케이스 소제목
    details: string;            // 쇼케이스 상세 내용
    isVideo: boolean;           // 동영상 등록 여부
    videoUrl?: string;          // 동영상 URL
    logoImageUrl: string;       // 브랜드 로고 이미지
    groups: ShowcaseGoodsGroup[];
};

interface ShowcaseDetailResponse {
    showcase_information: {
        id: number;                 // 쇼케이스 ID
        title: string;              // 쇼케이스 제목
        first_words: string;        // 메인 문구1
        second_words: string;       // 메인 문구2
        brand_id: number;           // 브랜드 ID
        brand_name: string;         // 브랜드명
        created_at: string;         // 쇼케이스 등록일
        mobile_banner_url: string;  // 쇼케이스 배너 이미지 (Mobile)
        mobile_banner_alt: string;  // 쇼케이너 배너 대체 텍스트 (Mobile)
        pc_banner_url: string;      // 쇼케이스 배너 이미지 (PC)
        pc_banner_alt: string;      // 쇼케이너 배너 대체 텍스트 (PC)
        sub_title: string;          // 쇼케이스 소제목
        details: string;            // 쇼케이스 상세 내용
        is_video: boolean;          // 동영상 등록 여부
        video_url?: string;         // 동영상 URL
        logo_image_url: string;     // 브랜드 로고 이미지
        groups: ShowcaseGoodsGroupResponse[];
    }
};

/**
 * 다른 쇼케이스
 */
interface AnotherShowcase {
    id: number;             // 쇼케이스 ID
    title: string;          // 쇼케이스 제목
    thumbnailUrl: string;  // 쇼케이스 이미지 URL
    sortId: number;        // 쇼케이스 구분 ID
    sortName: string;      // 쇼케이스 구분명
}[];

interface AnotherShowcaseResponse {
    id: number;             // 쇼케이스 ID
    title: string;          // 쇼케이스 제목
    thumbnail_url: string;  // 쇼케이스 이미지 URL
    sort_id: number;        // 쇼케이스 구분 ID
    sort_name: string;      // 쇼케이스 구분명
}[];

/**
 * (쇼케이스 상품) 그룹
 */
interface ShowcaseGoodsGroup {
    id: number;                     // 상품 그룹 ID
    mobileImageUrl: string;       // 상세 이미지 (Mobile)
    mobileImageAlt: string;       // Mobile 대체 텍스트
    pcImageUrl: string;           // 상세 이미지 (PC)
    pcImageAlt: string;           // PC 대체 텍스트
    goodsList: ShowcaseGoods[];    // 상품 리스트
};

interface ShowcaseGoodsGroupResponse {
    id: number;
    mobile_image_url: string;
    mobile_image_alt: string;
    pc_image_url: string;
    pc_image_alt: string;
    goods_list: ShowcaseGoodsResponse[];
}

/**
 * (쇼케이스 상품 그룹) 상품
 */
type ShowcaseGoods = Omit<Goods, "mouseOverImageUrl" | "optionLabel1" | "optionLabel2" | "orderCount">;
type ShowcaseGoodsResponse = Pick<LikedGoods, "liked"> & Omit<
    ResponseGoods,
    | "order_count"
    | "option_label_1"
    | "option_label_2"
    | "max_orderable_count_for_all"
    | "sell_price"
    | "order_count"
>;

export type {
    ShowcaseSort,
    Showcase,
    ShowcaseResponse,
    ShowcaseSortResponse,
    ShowcaseDetail,
    ShowcaseDetailResponse,
    ShowcaseGoods,
    AnotherShowcase,
    AnotherShowcaseResponse,
    ShowcaseGoodsGroup
}