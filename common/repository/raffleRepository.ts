import {
    Raffle,
    RaffleResponse,
    RaffleWinnerResponse,
    UserInfoForEntry,
    EntryResult,
    EntryResultResponse,
    UserInfoForEntryResponse,
    RaffleWinner,
    RaffleDetail
} from '$/@type/raffle';
import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository';
import moment from 'moment';
import { PaginatorResponse, Paginator } from '$/@type';
import { typeCastNumber } from '$/filters';

class RaffleRepository extends BaseRepository {

    /**
     * 래플 조회
     * ([진행중/진행예정]인 래플은 모두 노출, [진행종료]는 최근 종료일순, 최대 5개까지 노출)
     *
     * @return Promise<Raffle[]>
     */
    async getRaffleList(): Promise<Raffle[]> {
        const { raffle_list } = await this.dataSource.execute<{ raffle_list: RaffleResponse[] }>(
            'MAIN_RAFFLES',
            {},
            {}
        );

        return raffle_list.map(raffle => {
            return {
                id: raffle.id,
                availableDeviceList: raffle.available_device_list ?? [], // 'M_APP', 'M_WEB', 'PC'
                startAt: raffle.start_at,
                endAt: raffle.end_at,
                noticeAt: raffle.notice_at,
                buyStartAt: raffle.buy_start_at,
                buyEndAt: raffle.buy_end_at,
                totalEntryCount: raffle.total_entry_count,
                isEntry: raffle.is_entry,
                isConfirmedWinner: raffle.is_confirmed_winner,
                isStart: moment().diff(raffle.start_at, 'seconds') > 0,
                isEnd: moment().diff(raffle.end_at, 'seconds') > 0,
                isNotice: moment().diff(raffle.notice_at, 'seconds') > 0,
                isBeforeBuyStart: moment().diff(raffle.buy_start_at, 'seconds') > 0,
                isBuyEnd: moment().diff(raffle.buy_end_at, 'seconds') > 0,
                goods: {
                    id: raffle.goods.id,
                    name: raffle.goods.name,
                    brandName: raffle.goods.brand_name || '',
                    thumbnailUrl: raffle.goods.thumbnail_url,
                    isSoldout: raffle.goods.is_soldout ?? false,
                    isOnlyAdult: raffle.goods.is_only_adult ?? false,
                    baseDiscountedPrice: raffle.goods.base_discounted_price,
                    saleRate: raffle.goods.sale_rate,
                    sellPrice: raffle.goods.sell_price,
                    price: raffle.goods.price,
                }
            };
        });
    }

    /**
     * 종료된 래플 조회
     * (1년 이내 종료된 래플 기준, 최근 종료일순 정렬)
     *
     * @returns Promise<Raffle[]>
     */
    async getEndedRaffleList(page: number, perPage: number): Promise<Paginator<Raffle>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<RaffleResponse>>(
            'RAFFLES_ENDED',
            {
                page: page,
                page_size: perPage
            },
            {}
        );

        return {
            total: typeCastNumber(paginator.total),
            perPage: typeCastNumber(paginator.per_page),
            currentPage: typeCastNumber(paginator.current_page),
            data: paginator.data.map(raffle => {
                
                return {
                    id: raffle.id,
                    availableDeviceList: raffle.available_device_list ?? [], // 'M_APP', 'M_WEB', 'PC'
                    startAt: raffle.start_at,
                    endAt: raffle.end_at,
                    noticeAt: raffle.notice_at,
                    buyStartAt: raffle.buy_start_at,
                    buyEndAt: raffle.buy_end_at,
                    totalEntryCount: raffle.total_entry_count,
                    // 종료래플이기에 상태값 모두 true
                    isStart: true,
                    isEnd: true,
                    isNotice: true,
                    isBeforeBuyStart: true,
                    isBuyEnd: true,
                    isConfirmedWinner: raffle.is_confirmed_winner,
                    isEntry: raffle.is_entry,

                    goods: {
                        id: raffle.goods.id,
                        name: raffle.goods.name,
                        brandName: raffle.goods.brand_name || '',
                        thumbnailUrl: raffle.goods.thumbnail_url,
                        isSoldout: raffle.goods.is_soldout ?? false,
                        isOnlyAdult: raffle.goods.is_only_adult ?? false,
                        baseDiscountedPrice: raffle.goods.base_discounted_price,
                        saleRate: raffle.goods.sale_rate,
                        sellPrice: raffle.goods.sell_price,
                        price: raffle.goods.price,
                    }
                };
            })
        };
    }

    /**
     * 당첨자 리스트 조회
     *
     * @param { number } raffleId
     *
     * @return Promise<RaffleWinner[]>
     */
    async getWinners( raffleId: number ): Promise<RaffleWinner[]> {

        const { winner_list } = await this.dataSource.execute<{ winner_list: RaffleWinnerResponse[] }>(
            'RAFFLE_WINNERS',
            { raffleId : raffleId },
            {}
        );

        return winner_list.map(raffle => {
            return {
                loginId: raffle.login_id,
                name: raffle.name
            };
        });
    }

    /**
     * 래플 응모하기
     *
     * @param raffle_id: number
     *
     * @returns Promise<void>
     */
    async entry( raffle_id: number ): Promise<void> {
        await this.dataSource.execute<void>(
            'RAFFLE_ENTRY',
            {
                raffleId: raffle_id,
            },
            {}
        )
    };

    /**
     * 응모하기 > 유저 정보 및 응모 가능 여부 조회
     *
     * @param { number } raffleId
     *
     * @return Promise<UserInfoForParticipate>
     */
    async userInfoForEntry( raffle_id: number ): Promise<UserInfoForEntry> {
        const { entry_info } = await this.dataSource.execute<{ entry_info: UserInfoForEntryResponse }>(
            'RAFFLE_ENTRY_INFO',
            {
                raffleId: raffle_id,
            },
            {}
        )

        return {
            name: entry_info.name,
            loginId: entry_info.login_id,
            phone: entry_info.phone
        }
    };

    /**
     * 응모하기 > 유저 정보 및 응모 가능 여부 조회
     *
     * @param { number } raffleId
     *
     * @return Promise<EntryResult>
     */
    async winningResult( raffleId: number ): Promise<EntryResult> {
        const response = await this.dataSource.execute<EntryResultResponse>(
            'RAFFLE_WINNING_RESULT',
            {
                raffleId: raffleId,
            },
            {}
        );

        return {
            isWinner: response.is_winner,
            isEntry: response.is_entry,
        }
    };

    /**
     * 래플 상세조회 (상품상세용)
     * @param { number } raffleId
     * @returns { RaffleDetail } Promise<RaffleDetail>
     */
    async getDetail(raffleId: number): Promise<RaffleDetail> {
        const response = await this.dataSource.execute<{
            buy_end_at: string;
            buy_start_at: string;
            start_at: string;
            end_at: string;
            goods_id: number;
            participant_count: number;
            limit_winners: number;
            notice_at: string;
            is_confirmed_winner: boolean;
            is_entry: boolean;
            available_device_list: [];
        }>(
            'GOODS_RAFFLE_DETAIL',
            {
                raffleId: raffleId
            },
            {}
        );

        return {
            id: raffleId,
            goodsId: response.goods_id,
            buyEndAt: response.buy_end_at,
            buyStartAt: response.buy_start_at,
            limitWinner: response.limit_winners,
            participantCount: response.participant_count,
            noticeAt: response.notice_at,
            startAt: response.start_at,
            endAt: response.end_at,
            isAfterNotice : moment().diff(response.notice_at, 'seconds') > 0,
            isStart: moment().diff(response.start_at, 'seconds') > 0,
            isEnd: moment().diff(response.end_at, 'seconds') > 0,
            isBeforeBuyStart: moment().diff(response.buy_start_at, 'seconds') < 0,
            isBuyEnd: moment().diff(response.buy_end_at, 'seconds') > 0,
            isConfirmedWinner: response.is_confirmed_winner,
            isEntry: response.is_entry,
            availableDeviceList: response.available_device_list ?? [], // 'M_APP', 'M_WEB', 'PC'
        };
    }

    /**
     * 래플 구매 가능 여부 조회 
     * @param {number} raffleId : 래플 ID
     * @returns { isWinner: 당첨여부, isPurchaseAble: 구매가능 여부, maxOrderAbleCount: 최대 구매 가능 수량 }
     */
    async getUserBuyable(raffleId: number) {
        const response = await this.dataSource.execute<{
            is_winner: boolean;
            is_purchasable: boolean;
            max_orderable_count: number;
        }>(
            'RAFFLE_IS_BUYABLE_CHECK',
            {
                raffleId: raffleId
            },
            {}
        )

        return {
            isWinner: response.is_winner,
            isPurchaseAble: response.is_purchasable,
            maxOrderAbleCount: response.max_orderable_count
        }
    }
}

const raffleRepository = new RaffleRepository(
    new BackendMapper
)

export {
    raffleRepository
}