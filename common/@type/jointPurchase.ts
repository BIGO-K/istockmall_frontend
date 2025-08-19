/**
 * 공동 구매 리스트
 */
interface JointPurchase {
    id: number;                 // 공동 구매 ID
    goodsId: number;            // 상품 ID
    goodsName: string;          // 상품명
    thumbnailUrl: string;       // 대표이미지
    brandId: number;            // 브랜드 ID
    brandName: string;          // 브랜드명
    logoImageUrl: string;       // 브랜드 로고 이미지
    isOnlyAdult: boolean;       // 성인전용상품 여부
    price: number;              // 정가
    jointPurchasePrice: number; // 공동구매가
    participantCount: number;   // 참여 인원
    targetCount: number;        // 목표 인원
    isTargetAchieve: boolean;   // 목표 달성 여부
    targetAt: string;           // 목표 일시
    targetAchieveRate: number;  // 목표 달성률
}

/**
 * 공동 구매 상세 정보 (상품상세용)
 */
interface JointPurchaseDetail {
    id: number;                 // 공동 구매 ID
    goodsId: number;            // 상품 ID
    participantCount: number;   // 참여 인원
    targetCount: number;        // 목표 인원  
    isEnd: boolean;             // 종료 여부  
    startAt: string;            //  시작 일시
    endAt: string;              //  종료 일시
    targetAchieveRate: number;  // 목표 달성률
    couponExpirationDateMessage: string;  // 쿠폰 사용기간 
    discountedPrice: number;
    saleRate: number; //정가 대비 공동구매가 할인율 
    isPurchasable: boolean      // 구매가능여부 (참여한 공동구매, 구매이력 없음)
}

/**
 * API 응답용 인터페이스
 */
interface JointPurchaseResponse {
    id: number;                     // 공동 구매 ID
    goods_id: number;               // 상품 ID
    goods_name: string;             // 상품명
    thumbnail_url: string;          // 대표이미지
    brand_id: number;               // 브랜드 ID
    brand_name: string;             // 브랜드명
    logo_image_url: string;         // 브랜드 로고 이미지
    is_only_adult: boolean;         // 성인전용상품 여부
    price: number;                  // 정가
    joint_purchase_price: number;   // 공동구매가
    participant_count: number;      // 참여 인원
    target_count: number;           // 목표 인원
    is_target_achieve: boolean;     // 목표 달성 여부
    target_at: string;              // 목표 일시
    target_achieve_rate: number;    // 목표 달성률
}

export type {
    JointPurchase,
    JointPurchaseResponse,
    JointPurchaseDetail
}