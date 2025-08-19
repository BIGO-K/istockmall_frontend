import { Paginator } from "$/@type";
import { BaseBrand } from "$/@type/brand";
import { Goods, BaseGoods } from '$/@type/goods';
import { CommonFilter } from "$/@type/searchFilter";
import { ComputedRef } from "vue";

export type ComponentHandleOptions = {
    open: (componentName: string) => Promise<void>;
    close: (componentName: string) => Promise<void>;    
};
// 최근 본 상품 레코드

// export interface RecentViewGoodsRecord {
//     id: number;
//     brandName: string;
//     name: string;
//     baseDiscountedPrice: number;
//     isSoldOut: boolean;
//     thumbnailUrl: string;
//     saleRate: number;
//     price: number; // 정가격
//     sellPrice: number; // 판매가
//     recentViewAt?: string;
// }


// 최근 검색 레코드
export interface RecentSearchRecord {
    keyword: string;
    searchCount: number;
    recentSearchedAt: Date;
}

export interface SearchAutoComplete {
    type: string;
    value: {};
}

export interface ShoppingState {
    recentViewGoodsRecords: Array<BaseGoods>;
    recentSearchRecords: Array<RecentSearchRecord>;
    cartGoodsCount: number;
    forRemoveCartIdsInOrder: Array<RemoveCartItems>
}

export type RemoveCartItems = {
    orderId: string;
    cartIds: number[]
}

export type FormInputValidState = {
    type: string;
    message: string;
    validStatus: string;
    show: boolean;
};

export interface SelectedOption {
    optionName: string;
    code: number;
    subOptionName: string;
    stock: number;
    buyAmount: number;
    optionPrice: number;
    goodsPrice: number;
}

export interface mmonAlert {
    title?: string;
    closeButtonTitle?: string;
    cancelButtonTitle?: string;
    forms?: object;
}
export interface RootState {
    monsAlert?: mmonAlert;
    applicationError?: Error;
    loadingBarOn?: boolean;
}
/**
 * 알럿에 사용되는 옵션항목
 * title : 상단에 노출될 제목
 * closeButtonLabel : 확인 버튼 타이틀
 * cancelButtonLabel : 취소 버튼 타이틀 
 * forms : 프롬프트에 사용될 폼 정보가 담긴 객체
 */
export type AlertOptions = {
    title? : string
    closeButtonLabel? : string
    cancelButtonLabel? : string
    forms? : {
        type: 'text'|'textarea'|'select'|'password'
        name: string
        value?: string|number|boolean
        options?: {
            text: string
            value: number|string|boolean
        }[],
        placeholder?: string
        maxLength?: number
    }[]
}

export type GradeColor = {
    color: string;
    seq: number;
}

export interface HotKeyword {
    rank: number;
    previousRank: number;
    keyword: string;
    changeType: string;
    changeRank: number;
}

export interface AutoCompleteKeyword { 
    categories: {
        name: string;
        fullPath: string;
        depth: number;
        code: string;
    }[];
    brands: {
        id: number;
        korName: string;
        engName: string;
        logoImageUrl: string;
    }[]
    keywords: string[];
}

export type BaseSearchWords = {
    text: string;
    customLink: string;
}

export type SearchResult = {
    paginator: Paginator<Goods>;
    filters: CommonFilter;
    goodsIds: number[];
    bestGoods: Goods[];
    originKeyword: string;
    isCorrected: boolean;
    relatedKeywords: string[];
    correctedKeyword: string;
    brand: BaseBrand & { korName: string, engName: string } |null
}

export type CarouselCallback = {
    onReady?: Function;
    onUpdate?: Function;
    onStart?: Function;
    onComplete?: Function;
    onActive?: Function;
}

export type loadedImage = {
    file: File|Blob|null
    name: string
    type: 'image/jpeg'|'image/png'|'image/gif'|'image/svg+xmll'
    result: string
    width: number
    height: number
    canvasElement: HTMLCanvasElement
}

export type MonsAlert = {
    type: 'alert'|'confirm'|'prompt';
    uuid: string,
    message: string,
    callback: (...args) => void|Promise<void>,
    options?: AlertOptions
}

export type PageContext = {
    key: string,
    scrollTop: number
}

export type SearchPageContext = {
    recentType: number;
    keyword: string;
}

export type PopupContext = {
    key: string,
    isTodayClose: boolean,
    closeDate: string,
}

