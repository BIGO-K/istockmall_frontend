import { Goods, ResponseGoods } from "$/@type/goods";
import { LikedGoods } from "$/@type/shopping";

/**
 * 베이스 이벤트 인터페이스
 */
interface SimpleSpecialEvent {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    startAt: string;
    endAt: string;
    isUseDetailUrl?: boolean; // 상세 URL 사용 여부(true -> detailUrl에 등록된 경로로 이동)
    detailUrl?: string;
}

/**
 * 이벤트 인터페이스
 */
interface SpecialEvent extends SimpleSpecialEvent {
    contentsType: string;
    contentsHtml: string;
    contentsImageUrl: string;
    contentsImageAlt: string;
    isCommentable: boolean;
    goodsGroups: GoodsGroup[];
    alt: string;
}

/**
 * (이벤트) 상품그룹 인터페이스
 */
interface GoodsGroup {
    id: number;
    title: string;
    goodsList: SpecialEventGoods[];
    goodsLikeRelations: LikedGoods[];
}

/**
 * (이벤트) 상품
 */
type SpecialEventGoods = Omit<Goods, "mouseOverImageUrl" | "optionLabel1" | "optionLabel2" | "orderCount">;

/**
 * (이벤트) 댓글 정보
 */
interface Comment {
    id: number;
    contents: string; // 최대 200자(띄어쓰기 포함)
    isPrivate: boolean; // 비밀글 여부
    isEditable: boolean; //로그인 유저의 코멘트 여부
    writerGradeLevel: number; // 댓글 작성자 등급
    writerGradeImageUrl: string;
    writerMaskingLoginId: string;
    createdAt: string;
}
// 수정 댓글 정보
type EditableComment = Pick<Comment, "id" | "contents" | "isPrivate">;
// 등록 댓글 정보
type WritableComment = Pick<Comment, "contents" | "isPrivate">;


/**
 * API 응답용 인터페이스
 **/
interface SimpleSpecialEventResponse {
    id: number;
    title: string;
    description: string;
    image_url: string;
    start_at: string;
    end_at: string;
    is_use_detail_url: boolean;
    detail_url?: string|null;
}

/**
 * 이벤트 상세 조회 API 인터페이스
 **/
interface SpecialEventResponse extends SimpleSpecialEventResponse{
    contents_type: string;
    contents_html: string;
    contents_image_url: string;
    contents_image_alt: string;
    goods_groups: GoodsGroupResponse[];
    is_commentable: boolean;
    alt: string;
}

/**
 * (이벤트) 상품그룹 조회 API 인터페이스
 **/
interface GoodsGroupResponse {
    id: number;
    title: string;
    goods_ids: number[];
    is_display: boolean;
}

/**
 * (이벤트) 상품 조회 API type
 **/
type SpecialEventGoodsResponse = Omit<
ResponseGoods,
| "order_count"
| "option_label_1"
| "option_label_2"
| "max_orderable_count_for_all"
| "sell_price"
| "order_count"
>;

/**
 * (이벤트) 댓글 조회 API 인터페이스
 **/
interface CommentResponse {
    id: number;
    contents: string;
    is_private: boolean;
    is_editable: boolean;
    writer_grade_image_url: string;
    writer_masking_login_id: string;
    writer_grade_level: number;
    created_at: string;
}

export type {
    SimpleSpecialEvent,
    SimpleSpecialEventResponse,
    SpecialEvent,
    SpecialEventResponse,
    SpecialEventGoods,
    SpecialEventGoodsResponse,
    Comment,
    WritableComment,
    EditableComment,
    CommentResponse,
};
