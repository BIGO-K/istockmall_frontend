import { Paginator, PaginatorResponse } from "$/@type";
import { Faq, FaqResponse, FaqType, FaqTypeListResponse } from "$/@type/cs/faq";
import { BackendMapper } from "$/dataMapper/backendMapper";
import BaseRepository from "$/repository/baseRepository";

/**
 * 자주하는 질문 FAQ 레파지토리
 */
class FaqRepository extends BaseRepository
{
    /**
     * 노출중인 faq 분류 조회
     *
     * @returns Promise<FaqTypep[]>
     */
    async getTypes() : Promise<FaqType[]> {
        const { faq_types } = await this.dataSource.execute<FaqTypeListResponse>(
            'CS_FAQ_TYPES',
            {},
            {}
        );

        return faq_types.map(type => {
            return {
                id: type.id,
                name: type.name
            }
        })
    }

    /**
     * FAQ분류별 FAQ리스트 조회
     *
     * @param  {number} typeId
     * @param  {string=""} searchWord
     * @param  {number=1} page
     * @param  {number=20} perPage
     * @returns Promise<Faq[]>
     */
    async getFaqs(
        typeId: number,
        searchWord: string = "",
        page: number = 1,
        perPage: number = 10
    ): Promise<Paginator<Faq>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<FaqResponse>>(
            'CS_FAQ_LIST',
            {
                type_id: typeId,
                search_word: searchWord,
                page: page,
                page_size: perPage,
            },
            {}
        );

        return {
            total: paginator.total,
            currentPage: paginator.current_page,
            perPage: paginator.per_page,
            data: paginator.data.map(faq => {
                return {
                    id: faq.id,
                    title : faq.title,
                    contents : faq.contents,
                }
            })
        };
    }

    /**
     * FAQ분류별 FAQ리스트 조회(페이지네이터x)
     *
     * @param  {number} typeId
     * @param  {string=""} searchWord
     * @returns Promise<Faq[]>
     */
    async getFaqList(
        typeId: number,
        searchWord: string = ""
    ): Promise<Faq[]> {
        const { faqs } = await this.dataSource.execute<{ faqs: FaqResponse[]; }>(
            'CS_FAQ_ALL_LIST',
            {
                type_id: typeId,
                search_word: searchWord,
            },
            {}
        );

        return faqs.map((faq) => {
            return {
                id: faq.id,
                title: faq.title,
                contents: faq.contents,
            }
        });
    }
}

const faqRepository = new FaqRepository(
    new BackendMapper
)

export { faqRepository }