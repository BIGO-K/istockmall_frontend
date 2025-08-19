/**
 * 회원 정보
 */
interface MemberInfo {
    loginId: string;
    name: string;
    phone: string;
    email: string;
    birthday?: string;
    isEmailReceive: boolean;
    isSmsReceive: boolean;
    registType: string;
}

/**
 * 회원 탈퇴 사유
 */
interface WithdrawReason {
    code: number;
    label: string;
    detailReasonRequired: boolean;
}

/**
 * 회원 정보 (API) 리스폰스
 */
interface MemberInfoResponse {
    login_id: string;
    name: string;
    email: string;
    phone: string;
    birthday: string;
    is_email_receive: boolean;
    is_sms_receive: boolean;
    regist_type: string;
}

/**
 * 회원 탈퇴 사유 api 리스폰스
 */
interface WithdrawReasonResponse {
    code: number;
    label: string;
    detail_reason_required: boolean;
}

interface WithdrawReasonListResponse {
    withdraw_reasons: WithdrawReasonResponse[];
}

/**
 * 회원 연결된 소셜 정보 인터페이스
 */
interface MemberConnectedSocials {
    isAppleConnected: boolean;
    isNaverConnected: boolean;
    isFacebookConnected: boolean;
    isKakaoConnected: boolean;
    isPaycoConnected: boolean;
    isUsableConnect: boolean;
}

interface MySize {
    gender?: string
    fitId?: number
    shoesCategoryCode?: string
    shoesSizeId?: number
    height?: number
    weight?: number
    informationAgree?: boolean
}

export type {
    MemberInfoResponse,
    MemberInfo,
    WithdrawReason,
    WithdrawReasonListResponse,
    MemberConnectedSocials,
    MySize
};
