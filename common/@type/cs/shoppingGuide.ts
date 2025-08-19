/**
 * 고객센터 > 이용안내 사용 정보
 */
interface ShoppingGuidesActivesInfo {
    isUseReward: boolean; // 고객 보상제도 안내여부
    activesEasypays: {
        isNaverPayUse: boolean;
        isKakaoPayUse: boolean;
        isPaycoUse: boolean;
        isTossUse: boolean;
    };
}

export type { ShoppingGuidesActivesInfo };
