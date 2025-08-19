import { Paginator, PaginatorResponse } from "$/@type";
import { Notice, NoticeResponse, NoticeListResponse, ImportantNoticeListResponse } from "$/@type/cs/notice";
import { BackendMapper } from "$/dataMapper/backendMapper";
import BaseRepository from "$/repository/baseRepository";

/**
 * 고객센터 > 공지 관련 레파지토리
 */
class NoticeRepository extends BaseRepository
{
    /**
     * 고객센터 > 메인 > 최근 공지 리스트
     * 최근등록순 5건 조회
     * 
     * @param  {number=5} limit
     * @returns Promise<Notice[]>
     */
    async getTopNotices(limit: number = 5) : Promise<Notice[]> {
        const { notices } = await this.dataSource.execute<NoticeListResponse>(
            'CS_TOP_NOTICES',
            {
                limit: limit
            },
            {},
        )

        return notices.map((notice) => {
            return {
                id: notice.id,
                title: notice.title,
                contents: notice.contents,
                createdAt: notice.created_at,
                isImportant: notice.is_important,
            }
        });
    }
    /**
     * 고객센터 > 공지사항 > 공지 리스트 조회
     * 
     * @param  {number} page
     * @param  {number=10} perPage
     * @returns Promise<Paginator<Notice>>
     */
    async getNotices(page: number, perPage: number = 10) : Promise<Paginator<Notice>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<NoticeResponse>>(
            'CS_NOTICE_LIST',
            {
                page: page,
                page_size: perPage,
            },
            {}
        );

        return {
            total: paginator.total,
            currentPage: paginator.current_page,
            perPage: paginator.per_page,
            data: paginator.data.map((notice) => {
                return {
                    id: notice.id,
                    title: notice.title,
                    contents: notice.contents,
                    createdAt: notice.created_at,
                }
            })
        }
    }

    /**
     * 중요 공지 조회
     * 
     * @returns Promise<Notice[]>
     */
    async getImportantNotices() : Promise<Notice[]> {
        const { important_notices } = await this.dataSource.execute<ImportantNoticeListResponse>(
            'CS_IMPORTANT_NOTICES',
            {},
            {}
        );
        
        return important_notices.map((notice) => {
            return {
                id: notice.id,
                title: notice.title,
                contents: notice.contents,
                createdAt: notice.created_at
            }
        });
    }
    
    /**
     * 공지 상세조회
     * 
     * @param  {number} id
     * @returns Promise<Notice>
     */
    async getNotice(id:number) : Promise<Notice> {
        const response = await this.dataSource.execute<NoticeResponse>(
            'CS_NOTICE',
            {
                id: id,
            },
            {}
        )
        
        return {
            id: response.id,
            title: response.title,
            contents: response.contents,
            createdAt: response.created_at,
            isImportant: response.is_important,
        }
    }
}

const noticeRepository = new NoticeRepository(
    new BackendMapper
)

export { noticeRepository }