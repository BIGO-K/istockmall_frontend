
/**
 * 메인 배너
 */
interface MainBanner {
    imageUrl: string;
    imageAlt: string;
    link: string;
}

/**
/**
 * 코디샷 카테고리
 */
interface MainBannerResponse {
    image_url: string;
    image_alt: string;
    link: string;
}

export type {
    MainBanner,
    MainBannerResponse,
};
