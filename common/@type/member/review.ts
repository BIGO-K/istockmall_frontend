import { SimpleGoods, SimpleGoodsResponse } from "$/@type/goods";

/**
 * 상품리뷰
 */
interface Review {
    id: number;
    contents: string;
    imageUrls: string[];
    orderItem: Omit<ReviewableOrderItem, "orderedAt"|"optionId">;
    rate: number; // 별점
    isPhotoReview: boolean;
    createdAt: string;
    templates: {
        id: number;
        title: string;
        selectedLabel: string;
    }[];
    isEditable: boolean; // 이전 쇼핑몰에서 이관된 리뷰는 수정 불가능
}
interface ReviewResponse {
    id: number;
    contents: string;
    image_urls: string[];
    order_item: Omit<ReviewableOrderItemResponse, "ordered_at">;
    rate: number;
    is_photo_review: boolean;
    created_at: string;
    templates: {
        id: number;
        title: string;
        selected_label: string;
    }[];
    is_editable: boolean;
}

/**
 * 수정가능 리뷰
 */
interface EditableReview {
    id: number;
    contents: string;
    imageUrls: string[];
    // orderItem: Omit<ReviewableOrderItem, "orderedAt">    // 수정시에 주문상품 재선택 불가
    rate: number; // 별점
    templates: ReviewTemplate[];
    selectedTemplates: {
        templateId: number;
        detailId: number;
    }[];
    height: number;
    weight: number;
    shoesSize: number;
}
interface EditableReviewResponse {
    review: {
        id: number;
        contents: string;
        image_urls: string[];
        rate: number;
        templates: ReviewTemplate[];
        selected_templates: {
            template_id: number;
            detail_id: number;
        }[];
        height: number;
        weight: number;
        shoes_size: number;
    };
}

/**
 * 리뷰 작성가능  주문상품
 *
 * 상품리뷰 작성단위는 동일주문+동일상품옵션
 * 주문번호와 옵션ID가 구분자
 */
interface ReviewableOrderItem {
    orderId: string;
    optionId: number;
    orderedAt: string;
    goods: SimpleGoods;
}

interface ReviewableOrderItemResponse {
    order_id: string;
    option_id: number;
    option_name: string;
    ea: number;
    goods: SimpleGoodsResponse;
    ordered_at: string;
}

/**
 * 리뷰 항목(템플릿)
 */
interface ReviewTemplate {
    id: number;
    title: string;
    details: {
        id: number;
        label: string;
    }[];
}

interface ReviewTemplateResponse {
    review_templates: ReviewTemplate[];
}

/**
 * 리뷰 집계
 */
interface ReviewAggregates {
    writables: number;
    written: number;
}

interface ReviewAggregatesResponse {
    reviews: ReviewAggregates;
}

export type {
    Review,
    ReviewResponse,
    ReviewableOrderItem,
    ReviewableOrderItemResponse,
    ReviewTemplate,
    ReviewTemplateResponse,
    EditableReview,
    EditableReviewResponse,
    ReviewAggregates,
    ReviewAggregatesResponse,
};
