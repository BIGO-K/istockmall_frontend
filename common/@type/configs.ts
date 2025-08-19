import { GradeColor } from '$/@type/front';
import { ClaimRewardInfo } from '$/@type/member/claimReport';
import { PointRules, PointLabel } from '$/@type/member/point';
import { SpotTheme } from '$/@type/spotTheme';

/**
 * 사용중인 소셜로그인
 */
interface UsableSocialLogins {
    kakaotalk: boolean;
    naver: boolean;
    apple: boolean;
    payco: boolean;
    facebook: boolean;
}
/**
 * 쇼핑몰정보
 */
interface ShopInfo {
    name: string;
    nameInBusiness: string;
    engName: string;
    businessNumber: string; // 사업자번호
    sellAccount: string; //통신판매업 신고번호
    ceo: string;
    phone: string;
    privacyManager: string; //개인정보관리자
    baseAddress: string;
    detailAddress: string;
    homepageUrl: string;
    paymentServiceInfoUrl: string; // 구매안전서비스
    copyrightText: string;
    businessServiceInfoUrl: string;
    bankOwnerName: string;  // 가상계좌 입금 예금주명
    cs: CsInfo;
    hasTransferMember: boolean;  // 기존 회원 이관 사용 여부
    snsLink: {
        instagram: string;
        facebook: string;
        youtube: string;
        naverBlog: string;
        kakaoChannel: string;
    },
}

/**
 * 고객센터 정보
 */
interface CsInfo {
    tel: string;
    email: string;
    time: string;
    weekday: string;
    lunchTime: string;
    offday:string;
    faxNumber: string;
    kakaoWeekday: string;
    kakaoTime: string;
    kakaoFriendName: string;
}

/**
 * 은행코드
 */
interface BankCode {
    code: string;
    label: string;
}
interface BankCodesResponse {
    bank_codes: BankCode[];
}

/**
 * 신발 사이즈
 */
interface ShoesSize {
    id: number;
    label: string;
    value: number;
}

/**
 * 신발 카테고리
 */
interface ShoesCategory {
    code: string;
    label: string;
}

/**
 * 등급별 리뷰 포인트
 */
interface GradeReviewPointSetting extends ReviewPointSetting {
    gradeId: number;
    gradeName: string;
    useGradeRule: boolean;
}

interface GradeReviewPointSettingResponse {
    grade_review_point_setting: {
        grade_id: number;
        grade_name: string;
        text_review_point: number;
        photo_review_point: number;
        use_grade_rule: boolean;
    }[];
}

/**
 * 상품평 포인트 지급설정
 */
interface ReviewPointSetting {
    textReviewPoint: number;
    photoReviewPoint: number;
}

/**
 * 택배사 코드,이름
 */
interface DeliveryCompany {
    code: string;
    name: string;
}

/**
 * 마이페이지 > 유료 옵션
 */
interface MypageProOption {
    isUseReward: boolean;
    isUseMySize: boolean;
}

interface MarketingPlatformSetting {
    id: string,
}

export type MarketingPlatforms = 'gtm' | 'kakaoPixel' | 'naver' | 'cafe24' | 'mobion' | 'doyouad' | 'aceCoounter'

type MarketingSetting = {
    [key in MarketingPlatforms]?: MarketingPlatformSetting
}

export type PaidFeatures = 'reward'
    | 'personalization'
    | 'personalization'
    | 'reviewTemplate'
    | 'ranking'
    | 'timeDeal'
    | 'codyShot'
    | 'showcase'
    | 'raffle'
    | 'jointPurchase'
    | 'specialEvent'
    | 'experienceReview'
    | 'socialLogin'
    | 'myPay';

export type socialLogins = 'kakaotalk' | 'naver' | 'apple' | 'payco' | 'facebook';

type PaidFeatureSetting = {
    [key in PaidFeatures]: boolean
} & {
    rewardPolicies?: ClaimRewardInfo
    usableSocialLogins: {
        [key in socialLogins]: boolean
    }
    activesEasypays: {
        isNaverPayUse: boolean
        isKakaoPayUse: boolean
        isPaycoUse: boolean
        isTossUse: boolean
    },
}

type Point = {
    label: PointLabel,
    rules: PointRules,
    gradeRules: GradeReviewPointSetting[],
}

type Seo = {
    title: string;
    description: string;
    keywords: string[];
    // 사이트 소유확인 메타태그 키
    siteVerificationKey: {
        naver: string;
        // google: string;
    }
}

type Design = {
    headerType: 'A'|'B';
    footerType: 'A'|'B';
    toolbarType: 'A'|'B';
    mainColor: string
    subColor: string
    supportColor: string
    colorVersion: 'black'|'color'       // 컬러버전 (추후 다른버전 추가예정)
    useHeaderColor: boolean             // 헤더 유색버전여부 false인 경우 화이트버전
    pcMainPopupType: 'normal'|'floating'
    pcMainPopupVersion: 'A'|'B'
    mobileMainPopupType: 'normal'|'toast'
    mobileMainPopupVersion: 'A'|'B'|'C'
    mobileRankingType: 'A'|'B'|'C'|'D'
    pcRankingType: 'A'|'B'|'C'|'D'
    mobileTopBannerType: 'A'|'B'|'custom'
    pcTopBannerType: 'A'|'B'
    pcWingBannerType: 'A'|'B'
}

export type gnbMenues = 'raffle'|'jointPurchase';
type GnbUsable = { 
    [key in gnbMenues]: boolean
} & {
    spotThemes?: SpotTheme[]
}

/**
 * 초기세팅
 */
interface InitialSettings {
    shop: ShopInfo;
    point: Point;
    //유료기능 (사용여부)
    paidFeatures: PaidFeatureSetting;
    gradeColors: GradeColor[];
    seo: Seo;
    // 마케팅 정보
    marketing: MarketingSetting;
    // gnb 노출정보
    gnb: GnbUsable;
    design: Design;
    // 상품가격원단위 정보 
    goodsPriceKrwUnit: number;    
}

interface InitialSettingsResponse {
    shop: {
        name: string;
        name_in_business: string;
        eng_name: string;
        business_number: string;
        sell_account: string;
        ceo_name: string;
        tel: string;
        privacy_manager: string;
        base_address: string;
        detail_address: string;
        homepage_url: string;
        payment_service_info_url: string;
        copyright_text: string;
        business_service_info_url: string;
        bank_owner_name: string;
        cs_tel: string
        cs_email: string
        cs_time: string
        cs_weekday: string
        cs_lunch_time: string
        cs_offday: string
        cs_fax_number: string
        use_renewal: boolean;
        kakao_cs_weekday?: string
        kakao_cs_time?: string
        instagram_link?: string
        facebook_link?: string
        youtube_link?: string
        naver_blog_link?: string
        kakao_frined_name?: string
        kakao_channel_link?: string
    };
    point: {
        label_name: string;
        suffix: string;
        max_usable_amount: number;
        max_usable_amount_type: string;
        min_usable_balance: number;
        photo_review_point: number;
        review_point: number;
        usable_month: number;
        grade_rules: {
            grade_id: number;
            grade_name: string;
            text_review_point: number;
            photo_review_point: number;
            use_grade_rule: boolean;
        }[]
    };
    paid_features: {
        reward: boolean
        reward_policies: {
            delivery_delay_reward_policies: {
                day: number
                reward_rate: number
            }[],
            soldout_cancel_reward_policies: {
                day: number
                reward_rate: number
            }[],
            maximum_reward_price: number
        }
        personalization: boolean
        review_template: boolean
        ranking: boolean
        time_deal: boolean
        cody_shot: boolean
        showcase: boolean
        raffle: boolean
        joint_purchase: boolean
        special_event: boolean
        experience_review: boolean
        social_login: boolean
        usable_social_logins: ("kakao"|"naver"|"apple"|"payco"|"facebook")[]
        active_easypays: ("naverpay"|"kakaopay"|"payco"|"toss")[],
        my_pay: boolean;
    };
    grade_colors: {
        color_code: string,
        grade_order: number
    }[];
    seo: {
        title: string
        description: string
        keywords: string[]
        site_verification_key: {
            naver?: string;
            // google: string;
        }
    };

    marketing: {
        gtm?: {
            id: string
        },
        kakao_pixel?: {
            id: string
        },
        facebook_pixel?: {
            id: string
        },
        criteo?: {
            id: string
        }
    };
    gnb: {
        raffle: boolean
        joint_purchase: boolean
        spot_themes?: {
            id: number
            name: string
            is_use_url: boolean
            url?: string
        }[]
    };
    design: {
        header_type: 'A'|'B'
        footer_type: 'A'|'B'
        toolbar_type: 'A'|'B'
        main_color: string
        sub_color: string
        support_color: string
        color_version: 'black'|'color'
        use_header_color: boolean
        pc_main_popup_type: 'normal'|'floating'
        pc_main_popup_version: 'A'|'B'
        mobile_main_popup_type: 'normal'|'toast'
        mobile_main_popup_version: 'A'|'B'|'C'
        mobile_ranking_type: 'A'|'B'|'C'
        pc_ranking_type: 'A'|'B'|'C'
        mobile_top_banner_type: 'A'|'B'|'custom'
        pc_top_banner_type: 'A'|'B'
        pc_wing_banner_type: 'A'|'B'
    }
    goods_price_krw_unit: number;
}

export type {
    UsableSocialLogins,
    ShopInfo,
    BankCode,
    BankCodesResponse,
    ShoesSize,
    GradeReviewPointSetting,
    GradeReviewPointSettingResponse,
    ReviewPointSetting,
    DeliveryCompany,
    MypageProOption,
    ShoesCategory,
    MarketingSetting,
    InitialSettings,
    InitialSettingsResponse,
    Point,
    GnbUsable,
    PaidFeatureSetting,
    Seo,
    Design
};
