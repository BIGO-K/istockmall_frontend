/**
 * 고객센터 > 공지
 */
interface Notice {
    id: number;
    title: string;
    contents?: string;
    isImportant?: boolean;
    createdAt: string;
}

/**
 * API 응답용 인터페이스
 */
interface NoticeResponse {
    id: number;
    title: string;
    contents?: string;
    is_important?: boolean;
    created_at: string;
}

interface NoticeListResponse {
    notices: NoticeResponse[];
}

interface ImportantNoticeListResponse {
    important_notices: NoticeResponse[];
}

export type {
    Notice,
    NoticeResponse,
    NoticeListResponse,
    ImportantNoticeListResponse,
};
