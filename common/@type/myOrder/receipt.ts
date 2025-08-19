/**
 * 영수증
 */
interface Receipt {
    all: EntireReceiptDetail
    approve: ApprovedReceiptDetail
    cancels: CanceledReceiptDetail[]
    // 공급자정보
    // shopInfo?: Pick<ShopInfo, "name"|"businessNumber"|"ceo"|"phone"|"baseAddress"|"detailAddress"|"homepageUrl">
    // 결제대행사 정보
    paymentCompanyInfo: {
        name: string        //상호
        businessNumber: string,   // 사업자번호
        ceo: string,        // 대표자명
        phone: string,      // 연락처
        address: string     // 주소
        homepageUrl: string // 홈페이지
    }
}

interface ReceiptResponse {
    all: EntireReceiptDetailResponse
    approve: ApprovedReceiptDetailResponse
    cancels: CanceledReceiptDetailResponse[]
    payment_company_info: {
        name: string        //상호
        business_number: string,   // 사업자번호
        ceo: string,        // 대표자명
        phone: string,      // 연락처
        address: string     // 주소
        homepage_url: string // 홈페이지
    }
}

/**
 * 영수증 상세
 */
interface BaseReceiptDetail {
    payMethodName: string   //결제수단
    status: string          //거래상태

    paidAt: string          //거래일시
    canceledAt?: string     //취소일시
    // 카드결제정보
    card?: {
        name: string    // 카드사명
        maskedNumber: string   // 카드번호(마스킹)
        installment: string   // 할부기간
        tid: string   // 승인번호
    }
    // 가상계좌 결제정보
    virtualBank?: {
        bankName: string    // 결제은행
        virtualAccountNumber: string  // 가상계좌 번호
    }
    // 현금영수증
    cashReceipt?: CashReceipt
    
    paymentPrice?: number       // 승인금액
    canceledPrice?: number      // 취소금액
    balancePrice?: number       // 잔액
    taxPrice?: number           // 과세금액
    surtaxPrice?: number        // 부가세
    taxFreePrice?: number       // 면세금액
    cancelPrice?: number        // 취소금액
    refundId?:string            // 환불 ID(취소영수증 식별용)
}

interface BaseReceiptDetailResponse {
    pay_method_name: string
    status: string
    paid_at: string
    canceled_at?: string
    card?: {
        name: string
        masked_number: string
        installment: string
        tid: string
    }
    virtual_bank?: {
        bank_name: string
        virtual_account_number: string
    }
    cash_receipt?: CashReceiptResponse
}

/**
 * 전체 결제 영수증 상세
 */
interface EntireReceiptDetail extends BaseReceiptDetail {
    paymentPrice: number    // 승인금액
    canceledPrice: number      // 취소금액
    balancePrice: number    // 잔액
}

interface EntireReceiptDetailResponse extends BaseReceiptDetailResponse {
    payment_price: number
    canceled_price: number
    balance_price: number
}

/**
 * 승인결제 영수증 상세
 */
interface ApprovedReceiptDetail extends BaseReceiptDetail {
    paymentPrice: number    // 승인금액
    taxPrice: number        // 과세금액
    surtaxPrice: number     // 부가세
    taxFreePrice: number    // 면세금액
}
interface ApprovedReceiptDetailResponse extends BaseReceiptDetailResponse {
    payment_price: number
    tax_price: number
    surtax_price: number
    tax_free_price: number
}

/**
 * 취소결제 영수증 상세
 */
interface CanceledReceiptDetail extends BaseReceiptDetail {
    paymentPrice: number    // 승인금액
    taxPrice: number        // 과세금액
    surtaxPrice: number     // 부가세
    taxFreePrice: number    // 면세금액
    canceledPrice: number   // 기취소금액
    cancelPrice: number      // 취소금액
    balancePrice: number    // 잔액
    refundId: string        // 환불 ID (취소결제영수증 식별)
}
interface CanceledReceiptDetailResponse extends BaseReceiptDetailResponse {
    payment_price: number
    tax_price: number
    surtax_price: number
    tax_free_price: number
    canceled_price: number
    cancel_price: number
    balance_price: number
    refund_id: string
}

/**
 * 현금영수증
 */
interface CashReceipt {
    status: string     // 거래상태
    // shopBusinessNumber: string   // 쇼핑몰(공급자) 사업자번호
    useType:string          // 현금영수증 용도
    maskedRequestNumber: string // masked 현금영수증 인증값
    authCode: string            // 현금영수증 승인번호
}

interface CashReceiptResponse {
    status: string
    use_type: string
    masked_request_number: string
    auth_code: string
}

export {
    Receipt,
    ReceiptResponse,
    EntireReceiptDetail,
    ApprovedReceiptDetail,
    CanceledReceiptDetail,
    BaseReceiptDetail
}