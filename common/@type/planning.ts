import { Goods, ResponseGoods } from "./goods";

/**
 * 베이스 기획전
 */
interface BasePlanning {
    id: number;
    title: string;
}

interface BasePlanningResponse {
    id: number;
    title: string;
}

/**
 * 기획전
 */
interface Planning extends BasePlanning {
    isUseComment: boolean;
    sections: PlanningSection[];
    groups: PlanningGoodsGroup[];
}

interface PlanningResponse {
    planning: {
        id: number;
        title: string;
        is_use_comment: boolean;
        sections: PlanningSectionResponse[];
        groups?: PlanningGoodsGroupResponse[];
    };
}

/**
 * 상세컨텐츠
 */
interface PlanningSection {
    id: number;
    pcHtml: string;
    mobileHtml: string;
    goodsList?: PlanningGoods[]; // 최대 15개 등록됨
}

interface PlanningSectionResponse {
    id: number;
    pc_html: string;
    mobile_html: string;
    goods_list?: PlanningGoodsResponse[];
}

/**
 * (상품)그룹
 */
interface PlanningGoodsGroup {
    id: number;
    title: string;
    hasPcImage: boolean;
    pcLink: string;
    pcImageUrl: string;
    pcAlt: string;
    hasMobileImage: boolean;
    mobileLink: string;
    mobileImageUrl: string;
    mobileAlt: string;
    goodsList: PlanningGoods[];
}

interface PlanningGoodsGroupResponse {
    id: number;
    title: string;
    has_pc_image: boolean;
    pc_link?: string;
    pc_image_url?: string;
    pc_alt?: string;
    has_mobile_image?: boolean;
    mobile_link?: string;
    mobile_image_url?: string;
    mobile_alt?: string;
    goods_list: PlanningGoodsResponse[];
}

/**
 * (기획전) 상품
 */
type PlanningGoods = Omit<Goods, "mouseOverImageUrl" | "optionLabel1" | "optionLabel2" | "orderCount">;
type PlanningGoodsResponse = Omit<
    ResponseGoods,
    | "order_count"
    | "option_label_1"
    | "option_label_2"
    | "max_orderable_count_for_all"
    | "sell_price"
    | "order_count"
>;

/**
 * 기획전 댓글
 */
interface PlanningComment {
    id: number;
    contents: string; // 최대 200자(띄어쓰기 포함)
    isPrivate: boolean;
    isEditable: boolean;
    writerGradeImageUrl: string;
    writerMaskingLoginId: string;
    writerGradeLevel: number;
    isEditing: boolean; // 페이지에서 사용하기 위한 프로퍼티(수정여부)
    createdAt: string;
}

type EditablePlanningComment = Pick<PlanningComment, "id" | "contents" | "isPrivate">;
type WritablePlanningComment = Pick<PlanningComment, "contents" | "isPrivate">;

interface PlanningCommentResponse {
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
    BasePlanning,
    BasePlanningResponse,
    Planning,
    PlanningResponse,
    PlanningGoods,
    PlanningGoodsResponse,
    PlanningGoodsGroup,
    PlanningSection,
    PlanningComment,
    EditablePlanningComment,
    WritablePlanningComment,
    PlanningCommentResponse,
};
