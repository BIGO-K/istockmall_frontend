import { RefundAccount, RefundAccountResponse } from '$/@type/member/refundAccount';
import { BackendMapper } from '$/dataMapper/backendMapper';
import { JsonMapper } from '$/dataMapper/jsonMapper';
import BaseRepository from '$/repository/baseRepository';

class RefundAccountRepository extends BaseRepository
{
    /**
     * 등록된 환불계좌 조회 
     * @returns Promise
     */
    async get(): Promise<RefundAccount|undefined> {
        const { refund_account } = await this.dataSource.execute<{
            refund_account: RefundAccountResponse
        }>(
            "MEMBER_REFUND_ACCOUNT",
            {},
            {}
        );
        
        if (!refund_account) {
            return undefined;
        }

        return {
            ownerName: refund_account.owner_name,
            bankName: refund_account.bank_name,
            bankCode: refund_account.bank_code,
            accountNumber: refund_account.account_number,
        }
    }
    
    /**
     * 회원 환불계좌 존재하면 업데이트, 존재하지 않으면 신규 생성
     * 
     * @param  {RefundAccount} refundAccount
     * @returns Promise
     */
    async createOrUpdate(refundAccount: RefundAccount): Promise<void> {
        await this.dataSource.execute<void>(
            "MEMBER_CREATE_OR_UPDATE_REFUND_ACCOUNT",
            {},
            {
                bank_code: refundAccount.bankCode,
                owner_name: refundAccount.ownerName,
                account_number: refundAccount.accountNumber,
            }
        );
    }

    /**
     * 회원 환불계좌 삭제
     * 
     * @returns Promise
     */
    async delete(): Promise<void> {
        await this.dataSource.execute<void>(
            "MEMBER_DELETE_REFUND_ACCOUNT",
            {},
            {},
        );
    }
}

const refundAccountRepository = new RefundAccountRepository(
    new BackendMapper
)

export { refundAccountRepository }