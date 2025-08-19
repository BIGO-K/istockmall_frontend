import { RaffleEntry, RaffleResponse } from "$/@type/raffleEntry";
import BaseRepository from "$/repository/baseRepository";
import { BackendMapper } from '$/dataMapper/backendMapper';


/**
 * 마이페이지 > 래플 응모 내역 관련 레파지토리
 */
class ReffleEntryRepository extends BaseRepository
{
    /**
     * 래플 응모 내역 리스트
     * 
     * @param { boolean } is_end
     * @returns Promise
     */
    async getRaffleEntryList(is_end: number): Promise<RaffleEntry[]> {
        const { raffle_list } = await this.dataSource.execute<RaffleResponse>(
            'MYPAGE_RAFFLE_ENTRY_LIST',
            {
                is_end
            },
            {}
        );

        return raffle_list.map(raffle => {
            return {
                id: raffle.id,
                progressStatus: raffle?.progress_status,
                announceAt: raffle?.announce_at,
                isWinner: raffle.is_winner,
                isPurchase: raffle.is_purchase,
                buyStartAt: raffle.purchase_start_at,
                buyEndAt: raffle.purchase_end_at,
                goods: {
                    id: raffle.goods.id,
                    name: raffle.goods.name,
                    brandName: raffle.goods.brand_name,
                    thumbnailUrl: raffle.goods.thumbnail_url,
                }
            }
        });
    }
}

const raffleEntryRepository = new ReffleEntryRepository(
    new BackendMapper
)

export { raffleEntryRepository }