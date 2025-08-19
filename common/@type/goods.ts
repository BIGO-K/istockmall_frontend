import { Paginator, PaginatorResponse } from ".";
import { EpCoupon, EpCouponResponse } from "./coupon";
/**
 * 상품 기본
 *
 * MMGoods.vue 컴포넌트를 사용하는 상품 객체는 BaseGoods의 필수값을 모두 가지고 있어야합니다.
 * 이 경우 BaseGoods를 확장, 혹은 nullable 프로퍼티를 제외하고 확장하고 싶다면 ExcludeOptional<BaseGoods>를 사용합니다.
 * ex) type RecentViewGoods = ExcludeOptional<BaseGoods>;
 *
 * 해당 컴포넌트를 사용하지 않아도 되는 경우는 사용할 프로퍼티만 Pick 하여 사용합니다.
 * ex) Pick<BaseGoods, "id"|"name">
 *
 * BaseGoods에 필요한 프로퍼티가 없거나 nullable 프로퍼티가 필수값으로 필요한 경우 & 연산자를 사용합니다.
 * ex) Pick<BaseGoods, "id"|"name"> & { stock: number, extraProps: string }
 */
interface BaseGoods {
    id: number;
    name: string; // 진열 상품명
    brandName: string; // 브랜드명
    thumbnailUrl: string; // 썸네일 이미지    
    isOnlyAdult?: boolean;
    optionLabel1?: string; // 옵션1
    optionLabel2?: string; // 옵션2
    price: number; // 정가격
    sellPrice: number; // 판매가
    baseDiscountedPrice: number; // 1차 할인가
    saleRate: number; // 정가 대비 1차할인가 할인율
    stock?: number;
    isSoldout: boolean;       
}
/**
 * 상품
 */
interface Goods extends BaseGoods {
    mouseOverImageUrl?: string; // 마우스 오버용 이미지
    icon?: {
        backgroundColor: string;
        textColor: string;
        label: string;
    };
    badges?: Array<string>;
    headline?: string|null;    
    orderCount?: number;
    wishCount?: number;
    reviewCount?: number;
    reviewScoreAverage?: number;
    isUseStockNotify?: boolean;
}

/**
 * 주문/문의/리뷰 리스트 등에 쓰이는 상품
 */

type SimpleGoods = Pick<BaseGoods, "id" | "name" | "brandName" | "thumbnailUrl"> & {
    optionName?: string;
    optionId?: number;
    ea?: number;
    isSoldout?: boolean;
};
type SimpleGoodsResponse = Pick<BaseResponseGoods, "id" | "name" | "brand_name" | "thumbnail_url"> & {
    option_name?: string;
    option_id?: number;
    ea?: number;
    is_soldout?: boolean;
};

type SimpleListGoods = Pick<
    BaseGoods,
    | "id"
    | "name"
    | "brandName"
    | "thumbnailUrl"
    | "isSoldout"
    | "baseDiscountedPrice"
    | "saleRate"
> & { isOnlyAdult: boolean; stock: number };

//  예약 판매정보
interface SaleReserve {
    sellStartAt: Date;
    sellEndAt: Date;
    shipStartAt: Date;
    shipEndAt: Date;
}

interface Option {
    id: number;
    name?: string;
    label1: string;
    label2: string;
    stock?: number;
}

interface SelectAbleOption {
    id: number;
    name: string;
    stock: number;
    isSelectAble: boolean;
    isSoldout?: boolean;
    price: number;
}

interface GoodsOptions {
    name: string;
    isSelectAble: boolean;
    subOptions: SelectAbleOption[];
}

// 브랜드 관리자
interface Seller {
    id: number;
    name: string;
    sizeImageList?: string[];
    tel?: string;
}

interface SellerResponse {
    id: number;
    name: string;
    size_image_list?: string[];
    tel?: string;
}


/**
 * API 응답용 인터페이스
 **/

interface BaseResponseGoods {
    id: number;
    name: string;
    option_label_1?: string;
    option_label_2?: string;
    brand_name?: string;
    display_name?: string;
    thumbnail_url: string;
    is_only_adult: boolean;
    max_orderable_count_for_all?: number; // 최대 주문가능갯수
    sell_price: number; // 판매가
    price: number; // 정가
    base_discounted_price: number; // 1차할인가
    sale_rate: number; // 할인율
    stock?: number;
    headline?: string; // 말머리
    is_soldout?: boolean;
    mouse_over_image_url?: string; // 마우스 오버용 이미지 
    icon?: {
        background_color_code: string;
        font_color_code: string;
        label: string;
    };
    is_use_stock_notify?: boolean; 
}

interface ResponseGoods extends BaseResponseGoods {
    badges?: string[];
    order_count?: number;
    wish_count?: number;
    review_count?: number;
    review_score_average: number;
}

interface GoodsBanner {
    isEditorUse: boolean;
    contents?: string;
    imageUrl?: string;
    imageAlt?: string;
}

interface GoodsBannerResponse {
    is_editor_use: boolean;
    contents?: string;
    image_url?: string;
    image_alt?: string;
}

interface GoodsInformation {
    topBanners: GoodsBanner[];
    bottomBanners: GoodsBanner[];
    videoUrl: string;
    mandatory: Mandatory[];
    detailInfo: string;
    useStateLabel: string; // 상품 상태라벨
    originLabel: string; // 원산지 라벨
    sellerHolidayMessage: string; // 셀러 휴무일
    sellerHoliday?: {
        reason: string
        startAt: string
        endAt: string
        releaseAt: string
    }
}

interface GoodsInformationResponse {
    top_banners: GoodsBannerResponse[];
    bottom_banners: GoodsBannerResponse[];
    detail_info: string;
    mandatory: Mandatory[];
    video_url: string;
    origin_label: string;
    use_state_label: string;
    seller_holiday_message: string;
    seller_holiday: {
        reason: string
        start_at: string
        end_at: string
        release_at: string
    }
}

type Mandatory = {
    title: string;
    content: string;
};

// 사은품   
interface GiveAway {
    id: number;
    name: string;
    conditionLabel: string;
    imageUrl: string;
    startAt?: Date;
    endAt?: Date;
}


// 사은품   
interface GiveAwayGoods {
    id: number;
    name: string;
    thumbnailUrl: string;
    headline?: string;
    brandName: string;    
}

// 배송관련 정보
interface DeliveryInfo {
    shippingCompany?: string; // 택배사
    price: number; // 배송료
    isPackageDelivery: boolean; // 묶음 배송 사용 여부
    isFreeDelivery: boolean; // 무배
    isConditionalFreeDelivery: boolean; // 조건부 무배
    conditionalFreePrice: number; // 조건부 무배 금액
    extraPrice: number; // 도서산간 배송비
}

interface DeliveryInfoResponse {
    shipping_company?: string; // 택배사
    shipping_center_name: string; // 배송처 배송지명
    shipping_price: number; // 배송료
    is_package_delivery: boolean; // 묶음 배송 사용 여부
    is_free_delivery: boolean; // 무배
    is_conditional_free_delivery: boolean; // 조건부 무배 여부
    conditional_free_price: number; // 조건부 무배 금액
    extra_price: number; // 도서산간 배송비
}

// 반품지 관련 정보
interface ReturnDeliveryInfo {
    shippingCompany: string; // 택배사
    tel: string; // 전화번호
    returnAddress: string; // 배송지
    ceoName?: string; // 대표자명
    shippingPrice: number; // 반품 배송비
    companyName?: string; // 업체명
}

// 상품 할인가격 정보
interface GoodsPricePromotion {
    isDownloadAbleCoupon: boolean;
    maxDiscountedPrice: number; // 최대 할인가
    nightDiscountedPrice: number; // 심야 할인가
    immediatelyDiscountedPrice: number; // 즉시할인가
    couponDiscountedPrice: number; // 쿠폰 할인가
    purchaseAble?: boolean; // 구매가능여부
    price: number; // 정가격
    sellPrice: number; // 판매가
    baseDiscountedPrice: number; // 1차 할인가
    saleRate: number; // 정가 대비 1차할인가 할인율    
    timeSaleDiscountedPrice: number; // 타임특가 할인 금액
    welcome?: {
        discountedPrice: number;
        saleAmountType: 'rate'|'KRW',
        saleAmount: number
    }
}

type GoodsDetailBaseGoods = Omit<Goods, "price" | "sellPrice" | "baseDiscountedPrice" | "saleRate">;

type TimeDeal = {
    sellStartAt: string;
    sellEndAt: string;
    maxOrderAbleCount: number;
}

interface GoodsDetail extends GoodsDetailBaseGoods {
    brandId: number; // 진열브랜드 ID,
    sellerId: number; // 판매자 ID
    thumbnailUrls: string[];
    stock: number;
    isCustomMade: boolean; // 주문제작여부,
    isOverSeaDelivery: boolean; // 해외배송정보
    saleReserve?: SaleReserve; // 예약 판매정보
    isOnlyAdult: boolean; 
    degree360ImageUrls: string[]; // 360도 이미지    
    type: string;
    category : {
        depth1Code: string;
        depth2Code: string;
        depth3Code: string;
        fullLabel: string;
    }
}

interface AggregateReviewAndQna {
    reviewerCount: number;
    totalReviewCount: number; // 전체 리뷰수
    reviewAverageStars: number; // 평균별점
    satisfaction: number; // 만족도
    totalQnaCount: number;
    totalWishCount: number;
}

interface OptionalReviewStatistics {
    id: number;
    title: string;
    subDivisionList: {
        id: number;
        label: string;
        selectedCount: number;
        selectedRate: number;
        isHighest: boolean;
    }[];
}

interface OptionalReviewStatisticsResponse {
    review_template_list: {
        id: number;
        title: string;
        subdivision_list: {
            id: number;
            label: string;
            selected_count: number;
            selected_rate: number;
            is_highest: boolean;
        }[];
    }[]
}

interface GoodsDetailResponse extends BaseResponseGoods {
    max_discounted_price: number; // 최대 할인가
    night_sale_amount: number; // 심야 할인가
    immediately_sale_amount: number; // 즉시할인가
    highest_downloadable_coupon_amount: number; // 쿠폰 할인가
    brand_id: number; // 진열브랜드 ID,
    seller_id: number; // 판매자 ID
    thumbnail_urls: string[];
    review_average_star: number; // 평균별점
    total_review_count: number; // 전체 리뷰수
    stock: number;
    is_custom_made: boolean; // 주문제작여부,
    is_oversea_delivery: boolean; // 해외배송정보
    custom_made_delivery_day: number;
    oversea_delivery_min: number;
    oversea_delivery_max: number;
    sale_reserve?: {
        sell_end_at: Date;
        sell_start_at: Date;
        ship_end_at: Date;
        ship_start_at: Date;
    }; // 예약 판매정보
    is_only_adult: boolean;
    category: {
        depth1_category_code: string;
        depth2_category_code: string;
        depth3_category_code: string;
        full_label: string;
    }
    delivery_info: DeliveryInfoResponse & {
        extra_shipping_price: number;
        today_exportable_message: string; // 당일출고 메세지
        shipping_arrival_probability: {
            average_date: string;
            probability: number;
        }
        shipping_arrival_probability_list: {
            average_date: string;
            probability: number;
        }[]
    };
    return_delivery_info: {
        shipping_company: string;
        tel: string;
        return_address: string;
        ceo_name: string;
        return_shipping_price: number;
        company_name: string;
    };
    options: {
        name: string;
        sub: {
            name: string;
            qty: number;
            code: number;
        }[];
    }[];
    is_use_seller_shop: boolean;
    degree_360_image_urls: string[];
    giveaways: {
        id: number;
        name: string;
        condition_label: string;
        image_url: string;
        image_alt: string;
        start_at: Date;
        end_at: Date;        
    }[],
    is_use_stock_notify: boolean;   
    type: string
}

interface ResponseGoodsBasicInfo extends BaseResponseGoods {
    goods: GoodsDetailResponse;
    installments_title: string;
    raffle: {
        id: number
    } | null;
    joint_purchase: {
        id: number
    } | null;    
}

interface DetailDeliveryInfo extends DeliveryInfo {
    shippingCenterName: string;
    customMadeDeliveryDay: number; // 주문제작 배송일
    overseaDeliveryMin: number; // 해외배송시작최소 소요일
    overseaDeliveryMax: number; // 해외배송시작최대 소요일
    exportableMessage: string;
    arrivalProbability?: {
        averageDate: string;
        probability: number;
    }
    arrivalProbabilityList: {
        averageDate: string;
        probability: number;
    }[]
}
interface GoodsBasicInfo {
    goods: GoodsDetail;
    deliveryInfo: DetailDeliveryInfo;
    returnDeliveryInfo: ReturnDeliveryInfo;
    isUseSellerShop: boolean;
    giveaways: GiveAway[];
    isUseStockNotify: boolean;
    raffle: {
        id: number
    } | null;
    jointPurchase: {
        id: number
    } | null;    
}

interface Review {
    id?: number;
    contents: string;
    rate: number;
    isPhotoReview: boolean;
    photoCount: number;
    imageUrls: string[];
    optionName: string;
    createdAt: string;
    writerGradeImageUrl: string;
    writerGradeLabel: string;
    writerId: string;
    height?: number;
    weight?: number;
    shoesSize?: number;
    isExperienceGroup?: boolean;
    templates?: SelectedReviewItems[];
    physical?: string;
}

interface ReviewResponse {
    id?: number;
    contents: string;
    rate: number;
    is_photo_review: boolean;
    // photo_count: number,
    image_urls: string[];
    option_name: string;
    created_at: string;
    writer_grade_image_url: string;
    writer_grade_label: string;
    writer_masking_id: string;
    height?: number;
    weight?: number;
    shoes_size?: number;
    is_experience_group?: boolean;
    templates?: SelectedReviewItemsResponse[];
    physical: string;
}

/**
 * 선택한 리뷰 항목
 */
interface SelectedReviewItems {
    id?: number;
    title: string;
    selectedLabel: string;
}

interface SelectedReviewItemsResponse {
    id?: number;
    title: string;
    selected_label: string;
}

// (리뷰상세 페이지용) 상세리뷰 정보
type ReviewInfo = {
    reviewDetail: Review;
    nextReviewId: number;
    prevReviewId: number;
};

// (리뷰상세 모달용) 정보 설정
type ReviewModalInfo = {
    reviewId: number,
    totalCount: number,
    lastReviewId: number,
    firstReviewId: number,
};

// 상품 Q&A
interface Qna {
    id: number;
    title: string;
    contents: string;
    createdAt: string;
    isAnswered: boolean;
    isEditAble: boolean;
    isPrivate: boolean;
    isReadAble: boolean;
    answer?: {
        contents: string;
        createdAt: string;
    };
}

/**
 * 상품 Q&A 정보
 */
interface QnaInfo {
    goods: SimpleGoods;
    sellerName: string;
    sellerTel: string;
}

interface GoodsQnaDetail {
    id: number;
    title: string;
    contents: string;
    // subCode: number;
    typeLabel: string;
    isPrivate: boolean;
    goods: {
        id: number;
        name: string;
        sellerName: string;
        sellerTel: string;
        thumbnailUrl: string;
    };
}

interface ReviewPaginator extends Paginator<Review> {}
interface ReviewPaginatorResponse extends PaginatorResponse<ReviewResponse> {}
interface PhotoReviewPaginator extends Paginator<{ id: number; imageUrl: string; writerId: string }> {}
interface QnaPaginator extends Paginator<Qna> {}
interface QnaPaginatorResponse extends PaginatorResponse<{
    id: number;
    title: string;
    contents: string;
    created_at: string;
    is_reply: boolean;
    is_editable: boolean;
    is_private: boolean;
    is_readable: boolean;
    answer?: {
        contents: string;
        created_at: string;
    };
}> {}


export type {
    Goods,
    SimpleGoods,
    SimpleGoodsResponse,    
    ResponseGoods,
    QnaInfo,
    Seller,
    SellerResponse,
    BaseGoods,
    Option,
    SaleReserve,
    BaseResponseGoods,
    ResponseGoodsBasicInfo,
    GoodsBanner,
    GoodsBannerResponse,
    GoodsInformation,
    DeliveryInfo,
    DeliveryInfoResponse,
    GoodsDetail,
    GoodsBasicInfo,
    ReturnDeliveryInfo,
    GoodsOptions,
    DetailDeliveryInfo,
    SelectAbleOption,
    Mandatory,
    Review,
    ReviewResponse,
    ReviewPaginator,
    ReviewPaginatorResponse,
    PhotoReviewPaginator,
    ReviewInfo,
    ReviewModalInfo,
    QnaPaginator,
    GoodsInformationResponse,
    QnaPaginatorResponse,
    GoodsQnaDetail,
    SimpleListGoods,
    GoodsPricePromotion,
    AggregateReviewAndQna,
    GiveAway,
    GiveAwayGoods,
    OptionalReviewStatistics,
    OptionalReviewStatisticsResponse,
    TimeDeal
};
