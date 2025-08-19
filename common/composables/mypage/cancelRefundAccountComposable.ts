import { RefundAccount } from "$/@type/member/refundAccount";
import { useForm } from "$/composables/pageHandler/formComposable";
import { defaultCatch } from "$/functions";
import { refundAccountRepository } from "$/repository/member/refundAccountRepository";
import { useRefundAccountModalStore } from "$/store/modalPopup/refundAccount";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, ref, watch } from "vue";

/**
 * 환불계좌
 * @returns 
 */
export function useRefundAccount() {
    /** STORE **/
    const store = useRefundAccountModalStore();
    const { refundAccount, isEmpty } = storeToRefs(store);
    /** //STORE **/

    (async () => {
        if (!isEmpty.value) {
            return;
        }
        await store.fetchRefundAccount();
    })()

    onBeforeUnmount(() => {
        store.$reset();  
    })

    return {
        refundAccount,
        isEmpty,
        fetchRefundAccount: store.fetchRefundAccount
    }
}

/**
 * 환불계좌 수정
 * @returns
 */
export function useRefundAccountUpdate(refundAccount: RefundAccount|undefined) {
    /** VARIABLE **/
    const { form: refundAccountForm } = useForm<RefundAccount>({
        ownerName: refundAccount?.ownerName || '',
        accountNumber: refundAccount?.accountNumber || '',
        bankCode: refundAccount?.bankCode || '',
    }, {
        rules: {
            'ownerName(예금주명)': ['required', 'maxLength:50'],
            'bankCode(입금 은행)': ['required'],
            'accountNumber(계좌번호)': ['required', 'maxLength:20']
        },
        messages: {
            'ownerName.required': ':param(을/를) 입력해주세요',
            'bankCode.required': ':param(을/를) 입력해주세요',
            'accountNumber.required': ':param(을/를) 입력해주세요',
        }
    });
    /** //VARIABLE **/

    /** FUNCTION **/
    /**
     * 환불계좌 수정 처리
     */
    async function updateRefundAccount() {
        try {
            await refundAccountForm.value.validate();
            await refundAccountRepository.createOrUpdate(refundAccountForm.value);
        } catch (e) {
            throw e;
        }
    }
    /** //FUNCTION **/

    return {
        refundAccountForm,
        updateRefundAccount,
    }
}

/**
 * 환불계좌 (모달기능 포함)
 */
export function useRefundAccountWithModal() {
    /** VARIABLE **/
    const refundAccount = ref<RefundAccount>({
        ownerName: '',
        accountNumber: '',
        bankCode: '',
        bankName: '',
    });

    const modalData = ref<{
        show: boolean
        refundAccount: RefundAccount
    }>({
        show: false,
        refundAccount: {
            ownerName: '',
            accountNumber: '',
            bankCode: '',
        }
    });
    
    /** //VARIABLE **/

    /** FUNCTION **/
    /**
     * 환불계좌 수정 처리
     */
    async function setRefundAccount(newRefundACcount: RefundAccount) {
        refundAccount.value = {
            ...newRefundACcount
        }
    }
    /** //FUNCTION **/


    (async () => {
        try {
            refundAccount.value = await refundAccountRepository.get();
        } catch (e) {
            defaultCatch(e);
        }
    })();

    watch(refundAccount, () => {
        modalData.value.refundAccount.ownerName = refundAccount.value.ownerName;
        modalData.value.refundAccount.accountNumber = refundAccount.value.accountNumber
        modalData.value.refundAccount.bankCode = refundAccount.value.bankCode
    })

    return {
        refundAccount,
        modalData,
        setRefundAccount,
    }
}