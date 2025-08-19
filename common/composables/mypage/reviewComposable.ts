import { ReviewableOrderItem } from "$/@type/member/review"
import { NormalOrderItem } from "$/@type/myOrder/item"
import { Ref, ref } from "vue"
import { Review } from '$/@type/member/review';

// 리뷰 작성 모달 옵션
const reviewCreateModalData: {
    orderItem: Ref<ReviewableOrderItem|null>
    orderItems: Ref<ReviewableOrderItem[]>
} = {
    orderItem: ref<ReviewableOrderItem>(),
    orderItems: ref<ReviewableOrderItem[]>([])
}
/**
 * 리뷰 작성 모달
 * @returns 
 */
export function useReviewCreate() {

    /**
     * 리뷰상품(단일) 세팅
     * @param orderItem 리뷰상품
     */
    const setReviewCreateModalOrderItem = (orderItem: ReviewableOrderItem) => {
        reviewCreateModalData.orderItem.value = orderItem;
    }

    /**
     * 리뷰상품(리스트) 세팅
     * @param orderItems 리뷰상품 리스트
     * @param orderId 주문번호
     */
    const setReviewCreateModalOrderItems = (orderItems: NormalOrderItem[], orderId: string) => {
        const reviewables:ReviewableOrderItem[] = orderItems.filter(item => item.reviewWritable).map(item => {
            return {
                orderId: orderId,
                optionId: item.goods.optionId,
                goods: item.goods,
                orderedAt: '',
            }
        });

        const grouped: {[key: number]: ReviewableOrderItem} = reviewables.reduce((
            accumulator: {[key: number]: ReviewableOrderItem},
            currentValue: ReviewableOrderItem
        ) => {
            const key = currentValue.optionId;
            if (!accumulator[key]) {
                accumulator[key] = currentValue;                
            } else {
                accumulator[key].goods.ea++;
            }
            return accumulator;
        }, {});

        reviewCreateModalData.orderItems.value = Object.values(grouped);
    }

    /**
     * 모달 데이터 클리어
     */
    const clearReviewCreateModalData = () => {
        reviewCreateModalData.orderItem.value = null;
        reviewCreateModalData.orderItems.value = [];
    }

    return {
        reviewCreateModalData,
        setReviewCreateModalOrderItems,
        setReviewCreateModalOrderItem,
        clearReviewCreateModalData,
    }
}

// 리뷰 수정 모달 옵션
const reveiwEditModalData: {
    originReview: Ref<Review>
} = {
    originReview: ref<Review>()
}
/**
 * 리뷰 수정 모달
 * @returns 
 */
export function useReviewEdit() {
    const setReviewEditModalData = (review: Review) => {
        reveiwEditModalData.originReview.value = review
    }

    return {
        setReviewEditModalData,
        reveiwEditModalData,
    }
}