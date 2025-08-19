/**
 * 타임딜 인터페이스
 */
interface TimeDeal {
    id: number;
    title: string;
    displayStartAt: string;
    startAt: string;
    endAt: string;
    imageUrl: string;
    imageAlt: string;
    goodsId: number;
    isOnlyAdult: boolean;
    isStart: boolean;
    isEnd: boolean;
    isUseBannerText: boolean;
    bannerText1: string;
    bannerText2: string;
    bannerText3: string;
    bannerText4: string;
    bannerTextColor: '#FFFFFF' | '#000000';
    goodsName?: string;
    brandName?: string;
}


interface TimeDealsInfo {
    type: 'A'|'B'|'C'
    banners: TimeDeal[]    
}

interface TimeDealResponse {
    id: number;
    title: string;
    display_start_at: string;
    sell_start_at: string;
    sell_end_at: string;
    image_url: string;
    image_alt: string;
    goods_id: number;
    is_only_adult: boolean;
    is_use_banner_text: boolean;
    banner_text_1: string;
    banner_text_2: string;
    banner_text_3: string;
    banner_text_4: string;
    banner_text_color: '#FFFFFF' | '#000000';
    goods_name?: string;
    brand_name?: string;
}

interface TimeDealsInfoResponse {
    type: 'A' | 'B';
    banners: TimeDealResponse[]
}

export type {
    TimeDeal,
    TimeDealsInfo,
    TimeDealResponse,
    TimeDealsInfoResponse,
};
