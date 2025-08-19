import { BaseResponseGoods, BaseGoods } from "$/@type/goods";

/**
 * 1:1 문의 유형
 */
interface QnaType {
    code: number;
    label: string;
    isWithOrder: boolean;
    children: SubQnaType[];
}

interface QnaTypesResponse {
    qna_types: {
        code: number;
        label: string;
        is_with_order: boolean;
        children: {
            code: number;
            label: string;
        }[];
    }[];
}

// 1:1문의 2차 유형
type SubQnaType = Pick<QnaType, "code" | "label">;

/**
 * 1:1문의 주문
 */
interface QnaOrder {
    orderId: string;
    orderedAt: string;
    items: QnaOrderItem[];
}
interface QnaOrderItem {
    id: number;
    goodsName: string;
    optionName: string;
    thumbnailUrl: string;
}

/**
 * 1:1문의 상품
 *
 * 1:1문의의 경우 주문건에서 상품을 선택하여 문의하기때문에 optionName이 항상 존재하지만,
 * 판매자문의에서 이관되는 경우를 고려하여 선택값으로 둡니다.
 */
type QnaGoods = Pick<BaseGoods, "id"|"name"|"thumbnailUrl"> & { 
    optionName?: string; 
    brandName?: string;
}

/**
 * 1:1문의
 */
interface Qna {
    id: number;
    title: string;
    contents: string;
    goodsCount: number;
    topGoods?: QnaGoods;
    answer?: QnaAnswer;
    createdAt: string;
}

interface QnaResponse {
    id: number;
    title: string;
    contents: string;
    goods_count: number;
    top_goods?: Pick<BaseResponseGoods, "id" | "name" | "brand_name" | "thumbnail_url"> & { option_name: string };
    answer?: {
        contents: string;
        created_at: string;
    };
    created_at: string;
}

interface QnaDetail {
    id: number;
    title: string;
    contents: string;
    typeLabel: string;
    subTypeLabel: string;
    orderId?: string;
    orderedAt?: string;
    goodsList: (Pick<BaseGoods, "id"|"name"|"thumbnailUrl"> & { optionName?: string; })[];
}

interface QnaForm {
    title: string;
    contents: string;
    type: number|string;
    subType: number|string;
    orderId: string;
    orderItemIds: (string|number)[];
}

type EditableQnaForm  = Pick<QnaDetail, 'id'|'title'|'contents'>

/**
 * 문의 답변
 */
interface QnaAnswer {
    contents: string;
    createdAt: string;
}

export type {
    // 1:1 문의유형
    QnaType,
    SubQnaType,
    QnaTypesResponse,
    // 1:1문의 주문/상품
    QnaOrder,
    QnaOrderItem,
    QnaGoods,
    // 1:1문의, 문의답변
    Qna,
    QnaAnswer,
    QnaResponse,
    QnaDetail,
    QnaForm,
    EditableQnaForm,
};
