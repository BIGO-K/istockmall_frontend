import { GradeUpCondition } from "./grade";

// 회원 주문 및 리뷰,문의,포인트, 쿠폰 집계
interface Aggregates {
    orders?: OrderAggregates;
    benefits?: BenefitAggregates;
    gradeUpCondition?: GradeUpCondition;
}

// 주문집계
interface OrderAggregates {
    payReady: {
        count: number;
        statusCode: number;
    }; // 입금대기
    paid: {
        count: number;
        statusCode: number;
    }; // 결제완료
    deliveryReady: {
        count: number;
        statusCode: number;
    }; // 배송준비
    deliveryIng: {
        count: number;
        statusCode: number;
    }; // 배송중
    deliveryComplete: {
        count: number;
        statusCode: number;
    }; // 배송완료
    purchaseConfirmed: {
        count: number;
        statusCode: number;
    }; // 구매확정
    cancelCount: number; // 취소
    returnCount: number; // 반품
    exchangeCount: number; // 교환
    refundCount: number; // 환불
}

// 혜택집계
interface BenefitAggregates {
    point: number; // 보유 포인트
    couponCount: number; // 보유 쿠폰수
}

// 집계 리스폰스
interface OrderAggregatesResponse {
    orders: {
        pay_ready: {
            count: number;
            status_code: number;
        };
        paid: {
            count: number;
            status_code: number;
        };
        delivery_ready: {
            count: number;
            status_code: number;
        };
        delivery_ing: {
            count: number;
            status_code: number;
        };
        delivery_complete: {
            count: number;
            status_code: number;
        };
        purchase_confirmed: {
            count: number;
            status_code: number;
        };
        cancel_count: number;
        return_count: number;
        exchange_count: number;
        refund_count: number;
    };
}

interface BenefitAggregatesResponse {
    benefits: {
        point: number;
        coupon_count: number;
    };
}

export type {
    Aggregates,
    OrderAggregates,
    BenefitAggregates,
    OrderAggregatesResponse,
    BenefitAggregatesResponse,
};
