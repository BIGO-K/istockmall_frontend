/**
 * 래플 응모 내역 리스트
 */
interface RaffleEntry {
    id: number;                 // 래플 ID
    progressStatus: string;     // 래플 진행 상태
    announceAt: string;         // 당첨자 발표 예정일
    isWinner: boolean;          // 당첨 여부
    isPurchase: boolean;        // 구매 여부
    buyStartAt: string;    // 구매 시작일
    buyEndAt: string;      // 구매 종료일
    goods: {
        id: number;             // 상품 ID
        name: string;           // 상품명
        brandName: string;      // 브랜드명
        thumbnailUrl: string;   // 대표 이미지
    }
}

interface RaffleResponse {
    raffle_list: {
        id: number;                 // 래플 ID
        progress_status?: string;   // 래플 진행 상태
        announce_at?: string;       // 당첨자 발표 예정일
        is_winner: boolean;         // 당첨 여부
        is_purchase: boolean;       // 구매 여부
        purchase_start_at: string;  // 구매 시작일
        purchase_end_at: string;    // 구매 종료일
        goods: {
            id: number;             // 상품 ID
            name: string;           // 상품명
            brand_name: string;     // 브랜드명
            thumbnail_url: string;  // 대표 이미지
        }
    }[]
}

export type {
    RaffleEntry,
    RaffleResponse,
}