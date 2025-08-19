import {
    CodyShot,
    SimpleCodyShot,
    CodyShotCategory,
    CodyShotsResponse,
    SimpleCodyShotResponse,
} from '$/@type/codyShot';
import { BackendMapper } from '$/dataMapper/backendMapper';
import { Paginator, PaginatorResponse } from '$/@type';
import BaseRepository from '$/repository/baseRepository'

class CodyShotRepository extends BaseRepository {

    /**
     * 신규 등록 코디샷 조회(최대 10개)
     *
     * @returns Promise<SimpleCodyShot[]>
     */
    async getRecentCodyShots(): Promise<SimpleCodyShot[]> {
        const { recent_cody_shots } = await this.dataSource.execute<{
            recent_cody_shots: SimpleCodyShotResponse[]
        }>(
            'MAIN_RECENT_CODY_SHOTS',
            {},
            {}
        );

        return recent_cody_shots.map(simpleCodyShot => {
            return {
                id: simpleCodyShot.id,
                brandName: simpleCodyShot.brand_name,
                title: simpleCodyShot.title,
                thumbnailUrl: simpleCodyShot.thumbnail_url,
                alt: simpleCodyShot.alt
            };
        });
    }

    /**
     * 코디샷 페이지네이션
     *
     * @param   categoryId: number | null
     * @param   page: number = 1
     * @param   perPage: number = 20
     *
     * @returns Promise<Paginator<SimpleCodyShot>>
     */
    async getCodyShotPaginator(
        categoryId?: number,
        page: number = 1,
        perPage: number = 20,
    ): Promise<Paginator<SimpleCodyShot>> {
        const response = await this.dataSource.execute<PaginatorResponse<SimpleCodyShotResponse>>(
            'MAIN_CODY_SHOTS',
            {
                category_id: categoryId === 0 ? null : categoryId,
                page: page,
                page_size: perPage,
            },
            {}
        );

        return {
            currentPage: response.paginator.current_page,
            perPage: response.paginator.per_page,
            total: response.paginator.total,
            data: response.paginator.data.map(simpleCodyShot => {
                return {
                    id: simpleCodyShot.id,
                    brandName: simpleCodyShot.brand_name,
                    title: simpleCodyShot.title,
                    thumbnailUrl: simpleCodyShot.thumbnail_url,
                    alt: simpleCodyShot.alt,
                };
            }),
        }
    }

    /**
     * 코디샷 카테고리 조회
     *
     * @returns Promise<CodyShotCategory[]>
     */
    async getCodyShotCategories(): Promise<CodyShotCategory[]> {
        const { cody_shot_categories } = await this.dataSource.execute<{
            cody_shot_categories: CodyShotCategory[]
        }>(
            'CODY_SHOT_CATEGORIES',
            {},
            {}
        );

        return cody_shot_categories.map(category => {
            return {
                id: category.id,
                name: category.name
            }
        });
    }

    /**
     * 코디샷 상세
     *
     * @param codyShotId: number
     * @returns Promise<CodyShot>
     */
    async getCodyShot(codyShotId: number): Promise<CodyShot> {
        const { cody_shot } = await this.dataSource.execute<{
            cody_shot: CodyShotsResponse
        }>(
            'CODY_SHOT_DETAIL',
            {
                cody_shot_id: codyShotId
            },
            {}
        );

        return {
            id: cody_shot.id,
            title: cody_shot.title,
            brandName: cody_shot.brand_name,
            thumbnailUrl: cody_shot.thumbnail_url,
            alt: cody_shot.alt,
            createdAt: cody_shot.created_at,
            subTitle: cody_shot.sub_title,
            pointers: cody_shot.pointers.map(pointer => {
                return {
                    id: pointer.id,
                    x: pointer.x,
                    y: pointer.y,
                    goods: {
                        id: pointer.goods.id,
                        name: pointer.goods.name,
                        brandName: pointer.goods.brand_name,
                        thumbnailUrl: pointer.goods.thumbnail_url,
                        isSoldout: pointer.goods.is_soldout,
                        isOnlyAdult: pointer.goods.is_only_adult,
                        baseDiscountedPrice: pointer.goods.base_discounted_price,
                        saleRate: pointer.goods.sale_rate,
                        sellPrice: pointer.goods.sell_price,
                        price: pointer.goods.price,
                        badges: pointer.goods.badges,
                        reviewCount:  pointer.goods.review_count || 0,
                        reviewScoreAverage: pointer.goods.review_score_average  || 0,
                        wishCount: pointer.goods.wish_count  || 0,
                    }
                }
            })
        }
    }
}

const codyShotRepository = new CodyShotRepository(
    new BackendMapper
)

export {
    codyShotRepository
}