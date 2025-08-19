/**
 * 자주하는 질문 FAQ 분류
 */
interface FaqType {
    id: number;
    name: string;
}

/**
 * 자주하는 질문 FAQ
 */
interface Faq {
    id: number;
    title: string;
    contents: string;
}

/**
 * API 응답용 인터페이스
 */
interface FaqTypeListResponse {
    faq_types: {
        id: number;
        name: string;
    }[];
}

interface FaqResponse {
    id: number;
    title: string;
    contents: string;
}

export type { FaqType, Faq, FaqResponse, FaqTypeListResponse };
