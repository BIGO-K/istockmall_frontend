import { RefundAccount } from "$/@type/member/refundAccount";
import { defaultCatch } from "$/functions";
import { refundAccountRepository } from "$/repository/member/refundAccountRepository";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useRefundAccountModalStore = defineStore('refundAccountModal', () => {
    const refundAccount = ref<RefundAccount>({
        ownerName: '',
        accountNumber: '',
        bankCode: '',
        bankName: '',
    });
    
    const isEmpty = computed<boolean>(() => {
        return !refundAccount.value.accountNumber || !refundAccount.value.bankCode || !refundAccount.value.ownerName; 
    })

    /**
     * 환불계좌 조회
     */
    async function fetchRefundAccount() {
        try {
            refundAccount.value = await refundAccountRepository.get();
        } catch (e) {
            defaultCatch(e);
        }
    }

    return {
        refundAccount,
        isEmpty,
        fetchRefundAccount,
    }

}, {
    persistedState: {
        persist: false,
    }
})