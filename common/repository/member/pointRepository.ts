import { Moment } from "moment";
import { PointHistoryPaginator, PointHistoryPaginatorResponse, PointRules, PointRulesResponse } from "$/@type/member/point";
import { BackendMapper } from "$/dataMapper/backendMapper";
import { JsonMapper } from "$/dataMapper/jsonMapper";
import BaseRepository from "$/repository/baseRepository";
import { typeCastNumber } from '$/filters';

class PointRepository extends BaseRepository
{
    /**
     * 회원 포인트내역 조회
     * 
     * @param  {Moment} startDate
     * @param  {Moment} endDate
     * @param  {number} page
     * @param  {number=20} perPage
     * @returns Promise
     */
    async getPointHistories(startDate: Moment, endDate: Moment, page: number, perPage: number = 20): Promise<PointHistoryPaginator> {
        const { total_point_balance, paginator } = await this.dataSource.execute<PointHistoryPaginatorResponse>(
            'MEMBER_POINT_HISTORY',
            {
                page: page,
                page_size: perPage,
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD'),
            },
            {}
        );

        return {
            totalPointBalance: typeCastNumber(total_point_balance),
            total: typeCastNumber(paginator.total),
            currentPage: typeCastNumber(paginator.current_page),
            perPage: typeCastNumber(paginator.per_page),
            data: paginator.data.map((history) => {
                return {
                    isEarned: history.is_earned,
                    pointAmount: history.point_amount,
                    description: history.description,
                    orderId: history.order_id,
                    createdAt: history.created_at,
                    expireAt: history.expire_at,
                }
            })
        }
    }
}

const pointRepository = new PointRepository(
    new BackendMapper
);

export { pointRepository }