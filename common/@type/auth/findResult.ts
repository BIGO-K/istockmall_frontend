/**
 * 엑세스토큰 정보
 */
interface Tokenable {
    token: string;
    expireAt: string;
}

interface TokenableResponse {
    access_token: string;
    expire_at: string;
}

/**
 * 아이디 찾기 결과
 */
interface IdFindResult {
    maskingLoginId: string; // 마스킹된 아이디
    registType: string; // 회원가입 유형
}

interface IdFindResultInfo extends Tokenable {
    idFindResults: IdFindResult[];
    userName: string; // 회원명
    findType: string; // 'email'|'phone'
    email?: string;
    phone?: string;
}

type IdFindResultInfoEmail = IdFindResultInfo & {
    email: NonNullable<IdFindResultInfo['email']>
}

type IdFindResultInfoPhone = IdFindResultInfo & {
    phone: NonNullable<IdFindResultInfo['phone']>
}

/**
 * 아이디 찾기 결과 API response 인터페이스
 */

interface IdFindResultResponse {
    masking_login_id: string;
    regist_type: string;
}

interface IdFindResultsResponse extends TokenableResponse {
    find_results: IdFindResultResponse[];
    user_name: string;
}

/**
 * 비밀번호 찾기 결과
 */
interface PasswordFindResult extends Tokenable {
    loginId: string;
}

/**
 * 비밀번호 찾기 > 인증코드 확인용 엑세스토큰정보
 */
interface PasswordVerifyCodeTokenInfo extends Tokenable {}

/**
 * 비밀번호 찾기 결과 API response 인터페이스
 */
interface PasswordFindResultResponse extends TokenableResponse {}

export type {
    Tokenable,
    TokenableResponse,
    IdFindResult,
    IdFindResultInfo,
    IdFindResultInfoEmail,
    IdFindResultInfoPhone,
    IdFindResultResponse,
    IdFindResultsResponse,
    PasswordFindResult,
    PasswordVerifyCodeTokenInfo,
    PasswordFindResultResponse,
};
