import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository';

/**
 * 비회원 관련 레파지토리
 */
class GuestUserRepository extends BaseRepository {
    
    /**
     * 구매자 이름, 주문번호로 비회원 주문 조회
     * @param {string} ordererName: 구매자 이름
     * @param {string} orderId: 주문번호
     * @returns promise()
     */
    async guestToken(ordererName: string, orderId: string): Promise<string> {
        const response = await this.dataSource.execute<{
            token: string
        }> (
            'AUTH_GUEST_LOGIN',
            {},
            {
                orderer_name : ordererName,
                order_id: orderId
            }
        )

        return response.token;
    }
}

const guestUserRepository = new GuestUserRepository(
    new BackendMapper
)

export { guestUserRepository }