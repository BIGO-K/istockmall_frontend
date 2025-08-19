import { Goods, ResponseGoods } from "$/@type/goods";

interface SpotTheme {
    id: number;
    name: string;
    isUseUrl: boolean;
    url?: string;
}

interface Template {
    id: number;
    type: string;
    bannerImageUrl: string;
    bannerImageAlt: string;
    mainText1: string;
    mainText2: string;
    subText1: string;
    subText2: string;
    url: string;
    goodsList: Goods[];
}

interface TemplateResponse {
    id: number;
    type: string;
    banner_image_url: string;
    banner_image_alt: string;
    main_text1: string;
    main_text2: string;
    sub_text1: string;
    sub_text2: string;
    url: string;
    goods_list: ResponseGoods[];
}

export {
    SpotTheme,
    Template,
    TemplateResponse,
}

