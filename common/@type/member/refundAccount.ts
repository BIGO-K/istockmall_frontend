/**
 * 환불계좌
 */

interface RefundAccount {
    ownerName: string;
    accountNumber: string;
    bankCode: string;
    bankName?: string;
}

/**
 * api 응답용 인터페이스
 */

interface RefundAccountResponse {
    owner_name: string;
    account_number: string;
    bank_code: string;
    bank_name: string;
}

export type { RefundAccount, RefundAccountResponse };
