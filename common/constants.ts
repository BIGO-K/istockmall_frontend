/**
 * 응답코드 상수처리
 */
export const HTTP_STATUS_CODE = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
}

/**
 * 폼 유효성 검사 관련 상수
 */
export const FORM_VALID_CONDITION_CLASS = {
    DANGER: 'danger',
    WARNING: 'warn',
    INVALID: 'invalid',
    VALID: 'valid',
    NORMAL: 'normal'
}

/**
 * 반품/교환 사유별 icon class명
 */
export const CLAIM_REASON_ICON_CLASS = {
    CHANGE_MIND: 'change',
    ISSUE_WITH_GOODS: 'defects',
    WRONG_GOODS_DELIVERED: 'other'
}

/**
 * 블록 페이지명 상수
 */
export const BLOCK_PAGE_NAME = {
    MAIN: 'mainpage',
}

/**
 * 래플 사용 가능 디바이스
 */
export const AVAILABLE_RAFFLE_DEVICE = {
    M_APP: "모바일 APP",
    M_WEB: "모바일 WEB",
    PC: "PC",
}