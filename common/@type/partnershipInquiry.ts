// 제휴문의 유형
interface PartnershipInquiryType {
    label: string
    description: string
    code: number
    categoryRequired: boolean
}

// 제휴문의 카테고리
interface PartnershipInquiryCategory {
    name: string
    code: number
}

// 제휴문의
interface PartnershipInquiry {
    type: number|string
    categories: number[]
    companyName: string     // 업체명
    brandName: string       // 브랜드명
    name: string            // 담당자명
    email: string
    phone: string
    contents: string
}

export {
    PartnershipInquiry,
    PartnershipInquiryType,
    PartnershipInquiryCategory,
}