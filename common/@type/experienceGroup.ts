/**
 * 체험단 후기 리스트
 */
interface ExperienceGroup {
    id: number;                     // 체험단 후기 ID
    title: string;                  // 체험단 후기 제목
    thumbnailUrl: string;           // 대표 이미지
    grade: number;                  // 평점
    writer: string;                 // 작성자명(회원명)
    recommendationCount: number;    // 추천 수
    viewCount: number;              // 조회 수
    createdAt: string;              // 작성일
}

 interface ExperienceGroupResponse {
    id: number;                     // 체험단 후기 ID
    title: string;                  // 체험단 후기 제목
    thumbnail_url: string;          // 대표 이미지
    grade: number;                  // 평점
    writer: string;                 // 작성자명(회원명)
    recommendation_count: number;   // 추천 수
    view_count: number;             // 조회 수
    created_at: string;             // 작성일
}

/**
 * 체험단 후기 상세
 */
interface ExperienceGroupDetail {
    id: number;                         // 체험단 후기 ID
    title: string;                      // 체험단 후기 제목
    writer: string;                     // 작성자명(회원명)
    createdAt: string;                  // 작성일
    viewCount: number;                  // 조회 수
    goodsId: number;                    // 상품 ID
    goodsName: string;                  // 상품명
    goodsThumbnailUrl: string;          // 상품 대표 이미지
    baseDiscountedPrice: number;        // 상품 1차 할인가(판매가)
    brandName: string;                  // 브랜드명
    grade: number;                      // 평점
    height: number;                     // 키
    weight: number;                     // 몸무게
    shoesSize: number;                  // 신발 사이즈
    contents: string;                   // 체험단 후기 내용
    templates: SelectedReviewItems[];   // 선택 가능 리뷰 항목 리스트
    recommendationCount: number;        // 추천 수
    imageUrlList: string[];             // 체험단 후기 이미지 리스트
}

interface ExperienceGroupDetailResponse {
    detail: {
        id: number;                                 // 체험단 후기 ID
        title: string;                              // 체험단 후기 제목
        writer: string;                             // 작성자명(회원명)
        created_at: string;                         // 작성일
        view_count: number;                         // 조회 수
        goods_id: number;                           // 상품 ID
        goods_name: string;                         // 상품명
        goods_thumbnail_url: string;                // 상품 대표 이미지
        base_discounted_price: number;              // 상품 1차 할인가(판매가)
        brand_name: string;                         // 브랜드명
        grade: number;                              // 평점
        height: number;                             // 키
        weight: number;                             // 몸무게
        shoes_size: number;                         // 신발 사이즈
        contents: string;                           // 체험단 후기 내용
        templates: SelectedReviewItemsResponse[];   // 선택 가능 리뷰 항목 리스트
        recommendation_count: number;               // 추천 수
        image_url_list: string[];                   // 체험단 후기 이미지 리스트
    }
}

/**
 * 리뷰 작성 가능한 체험단 상품
 */
interface ReviewableItem {
    id: number;             // 상품 ID
    name: string;           // 상품명
    brandName: string;      // 브랜드명
    thumbnailUrl: string;   // 대표 이미지
    optionList: Option[];   // 옵션 리스트
}

interface ReviewableItemResponse {
    goods_list: {
        id: number;                     // 상품 ID
        name: string;                   // 상품명
        brand_name: string;             // 브랜드명
        thumbnail_url: string;          // 대표 이미지
        option_list: OptionResponse[];  // 옵션 리스트
    }[]
}

/**
 * 상품 옵션
 */
interface Option {
    id: number;     // 옵션 ID
    name: string;   // 옵션명
}

interface OptionResponse {
    id: number;     // 옵션 ID
    name: string;   // 옵션명
}

/**
 * 선택한 리뷰 항목
 */
interface SelectedReviewItems {
    id: number;
    title: string;
    selectedLabel: string;
}

interface SelectedReviewItemsResponse {
    id: number;
    title: string;
    selected_label: string;
}

/**
 * 선택 가능한 리뷰 항목(템플릿)
 */
 interface SelectableReviewTemplate {
    id: number;
    title: string;
    details: {
        id: number;
        label: string;
    }[];
}

interface SelectableReviewTemplateResponse {
    review_templates: SelectableReviewTemplate[];
}

/**
 * 추천 관련
 */
interface Recommendation {
    reviewId: number;
    isRecommendation: boolean;
}

export type {
    ReviewableItem,
    ReviewableItemResponse,
    ExperienceGroup,
    ExperienceGroupResponse,
    ExperienceGroupDetail,
    ExperienceGroupDetailResponse,
    Recommendation,
    SelectableReviewTemplate,
    SelectableReviewTemplateResponse,
    Option,
    OptionResponse,
}