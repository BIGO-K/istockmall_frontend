import { Paginator } from "$/@type";
import { PaginatorResponse } from "$/@type";

/**
 * 적립금 설정
 */
interface PointRules {
    minUsableBalance: number; // 사용 가능한 최소보유조건
    maxUsableAmountType: string; // rate|KRW,
    maxUsableAmount: number; // 최대사용조건
    usableMonth: number; // 포인트 유효기간(개월단위)
    photoReviewPoint: number; // 포토 상품평 작성 적립금. 어드민에서 설정한 사용유무 설정이 미사용일 시 undefined)
    textReviewPoint: number; // 상품평 작성 적립금 어드민에서 설정한 사용유무 설정이 미사용일 시 undefined
}

interface PointLabel {
    name: string; // 포인트 명칭 ex) 포인트|마일리지|적립금
    suffix: string; // 포인트 단위 ex) 원
}

/**
 * 적립금 내역
 */
interface PointHistory {
    isEarned: boolean; // 적립여부 (false이면 차감내역)
    pointAmount: number; // 적립금
    description: string; // 내역(발생사유)
    orderId?: string; // 주문번호
    createdAt: string; // 내역 발생일(지급/차감일)
    expireAt?: string; // 유효일자 (차감내역에는 존재하지 않음)
}

interface PointHistoryPaginator extends Paginator<PointHistory> {
    totalPointBalance: number;
}

/**
 * API응답용 리스폰스
 */
interface PointRulesResponse {
    point_rule: {
        min_usable_balance: number;
        max_usable_amount_type: string;
        max_usable_amount: number;
        usable_month: number;
        photo_review_point?: number;
        review_point?: number;
    };
}

interface PointLabelResponse {
    point_label: {
        name: string;
        suffix: string;
    };
}

interface PointHistoryResponse {
    is_earned: boolean; // 적립여부 (false이면 차감내역)
    point_amount: number; // 적립금
    description: string; // 내역(발생사유)
    order_id?: string; // 주문번호
    created_at: string; // 내역 발생일(지급/차감일)
    expire_at?: string; // 유효일자 (차감내역에는 존재하지 않음)
}

interface PointHistoryPaginatorResponse extends PaginatorResponse<PointHistoryResponse> {
    total_point_balance: number;
}

export type {
    PointRules,
    PointRulesResponse,
    PointHistory,
    PointHistoryPaginator,
    PointHistoryResponse,
    PointHistoryPaginatorResponse,
    PointLabel,
    PointLabelResponse,
};
