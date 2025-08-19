interface BaseClaimReason {
    code: number;
    label: string;
    engLabel: string;
    requireDetail: boolean;
}

interface BaseClaimReasonResponse {
    code: number;
    label: string;
    eng_label: string;
    require_detail: boolean;
}

/**
 * 취소사유
 */
interface CancelReason extends BaseClaimReason {}
interface CancelReasonResponse extends BaseClaimReasonResponse {}

/**
 *  반품사유
 */
interface ReturnReason extends BaseClaimReason {
    iconClassName: string;
    censure: string; // seller|orderer
}
interface ReturnReasonResponse extends BaseClaimReasonResponse {
    censure: string;
}

/**
 * 교환 사유
 */
interface ExchangeReason extends ReturnReason {
    iconClassName: string;
    censure: string; // seller|orderer
    isSameOptionExchangeable: boolean; // 동일옵션교환 가능 여부
}
interface ExchangeReasonResponse extends ReturnReasonResponse {
    censure: string;
    is_same_option_exchangeable: boolean;
}

/**
 * 선택된 취소/반품/교환 사유
 */
type ChosenClaimReason = Omit<BaseClaimReason, "requireDetail"> & {
    detail?: string;
};
type ChosenClaimReasonResponse = Omit<BaseClaimReasonResponse, "require_detail"> & {
    detail?: string;
};

export type {
    CancelReason,
    CancelReasonResponse,
    ReturnReason,
    ReturnReasonResponse,
    ExchangeReason,
    ExchangeReasonResponse,
    ChosenClaimReason,
    ChosenClaimReasonResponse,
};
