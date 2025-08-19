import { Goods, ResponseGoods } from '$/@type/goods';

interface Banner {
    id: number;
    mobileTextUse: boolean;
    pcTextUse: boolean;
    mobileMainText1: string;
    mobileMainText2: string;
    mobileSubText1: string;
    mobileSubText2: string;
    mobileTextColor: string;
    mobileImageUrl: string;
    pcMainText1: string;
    pcMainText2: string;
    pcSubText1: string;
    pcSubText2: string;
    pcTextColor: string;
    pcImageUrl: string;
    linkUrl: string;
    displayMobileDeviceType: string;
}

interface BannerResponse {
    idx: number;
    mobile_text_use: boolean;
    pc_text_use: boolean;
    mobile_main_text_1: string;
    mobile_main_text_2: string;
    mobile_sub_text_1: string;
    mobile_sub_text_2: string;
    mobile_text_color: string;
    mobile_image: string;
    pc_main_text_1: string;
    pc_main_text_2: string;
    pc_sub_text_1: string;
    pc_sub_text_2: string;
    pc_text_color: string;
    pc_image: string;
    url: string;
    mobile_device_type: string;
}

interface MainPopup {
    imageUrl: string;
    imageAlt: string;
    link?: string;
}

interface MainPopupResponse {
    image_url: string;
    image_alt: string;
    link?: string;
}

interface CardBenefit {
    imageUrl: string;
    imageAlt: string;
    info: string;
}

interface CardBenefitResponse {
    image_url: string;
    image_alt: string;
    info: string;
}

interface CardInstallMentInfo {
    interestFreeList: CardBenefit[],
    partialInterestList: CardBenefit[],
    startAt: string,
    endAt: string,
    title: string
}

interface TopBanner {
    title: string
    imageUrl: string
    alt: string
    link: string
    curtainBannerImageUrl: string
    curtainBannerAlt: string
}

interface WingBanner {
    title: string
    imageUrl: string
    alt: string
    link: string
    bigImageUrl: string
    bigImageAlt: string
}

interface ExhibitCategory {
    name: string
    children: {
        code: string;
        name: string;
    }[]
    // 최대 50개
    mainBanners: {
        id: number;
        imageUrl: string;
        alt: string;
        link?: string; // 더보기 url
        text1?: string;
        text2?: string;
        text3?: string;
        colorCode?: "#FFFFFF" | "#000000";
    }[]
    brandBannerGroup: {
        title: string;
        // 최대 12개
        banners: {
            id: number;
            imageUrl: string;
            alt: string;
            link?: string; // 더보기 url
            text1?: string;
            text2?: string;
            colorCode?: "#FFFFFF" | "#000000";
        }[]
    } | null
    brandGroup: {
        title: string;
        // 최대 50개
        brands: {
            id: number;
            name: string;
        }[]
    } | null
    goodsGroup: {
        title: string;
        // 최대 20개
        goodsList: Goods[]
    } | null
}

interface ExhibitCategoryResponse {
    name: string
    children: {
        code: string;
        name: string;
    }[]
    main_banners: {
        id: number;
        image_url: string;
        alt: string;
        link?: string; // 더보기 url
        text_1?: string;
        text_2?: string;
        text_3?: string;
        text_color: "#FFFFFF" | "#000000";
    }[]
    brand_banner_group?: {
        title: string;
        banners: {
            id: number;
            image_url: string;
            alt: string;
            link?: string; // 더보기 url
            text_1?: string;
            text_2?: string;
            text_color: "#FFFFFF" | "#000000";
        }[]
    }
    brand_group?: {
        title: string;
        brands: {
            id: number;
            name: string;
        }[]
    }
    goods_group?: {
        title: string;
        goods_list: ResponseGoods[];
    }
}

export {
    Banner,
    BannerResponse,
    MainPopup,
    MainPopupResponse,
    CardBenefit,
    CardBenefitResponse,
    CardInstallMentInfo,
    TopBanner,
    WingBanner,
    ExhibitCategory,
    ExhibitCategoryResponse,
};
