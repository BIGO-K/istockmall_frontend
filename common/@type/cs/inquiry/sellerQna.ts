import { EditableQnaForm, Qna, QnaDetail, QnaForm, QnaResponse, QnaType } from "$/@type/cs/inquiry/qna";
import { BaseOrderItem, BaseOrderItemResponse } from "$/@type/myOrder/item";
import { Seller } from "$/@type/goods";

/**
 * 판매자 문의 유형
 */
type SellerQnaType = Pick<QnaType, "code" | "label">;

interface SellerQnaTypeResponse {
    seller_qna_types: SellerQnaType[];
}
/**
 * 판매자문의
 */
interface SellerQna extends Qna {
    isPrivate: boolean;
}

interface SellerQnaDetail extends Omit<QnaDetail, 'subTypeLabel'>{
    seller: Omit<Seller, "id">
    isPrivate: boolean
}

interface SellerQnaForm extends Omit<QnaForm, 'subType'>{
    isPrivate: boolean;
}

type EditableSellerQnaForm = Pick<SellerQnaDetail, 'id'|'title'|'contents'|'isPrivate'>

interface SellerQnaResponse extends QnaResponse {
    is_private: boolean;
}

/**
 * 판매자문의 > 작성가능 주문아이템
 */
interface SellerQnaOrderItem extends BaseOrderItem {}
interface SellerQnaOrderItemResponse extends BaseOrderItemResponse {}

export type {
    SellerQnaType,
    SellerQnaTypeResponse,
    SellerQna,
    SellerQnaResponse,
    SellerQnaOrderItem,
    SellerQnaOrderItemResponse,
    SellerQnaForm,
    SellerQnaDetail,
    EditableSellerQnaForm,
};
