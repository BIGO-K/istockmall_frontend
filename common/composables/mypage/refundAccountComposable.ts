import { RefundAccount } from "$/@type/member/refundAccount";
import { Ref, ref } from "vue";

const refundAccountModalData: {
    refundAccount: Ref<RefundAccount|undefined>
} = {
    refundAccount: ref<RefundAccount>()
}
/**
 * 환불계좌 수정 기능
 */
export function useRefundAccountEdit() {
    const setModalRefundAccount = (account: RefundAccount|undefined) => {
        refundAccountModalData.refundAccount.value = account;
    }

    const resetRefundAccountModalData = () => {
        refundAccountModalData.refundAccount.value = {
            ownerName: '',
            accountNumber: '',
            bankCode: '',
        }
    }
    
    return {
        refundAccountModalData,
        setModalRefundAccount,
        resetRefundAccountModalData
    }
}