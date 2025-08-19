<template>
    <div class="m_modal-my-account">
        <h6 class="mm_text-label">
            <b>예금주명</b>
        </h6>
        <MMInput 
            v-model="refundAccountForm.ownerName"
            :place-holder-text="'예금주명을 입력하세요'"
            maxlength="50"
            type="text"
        />
        <h6 class="mm_text-label">
            <b>입금은행</b>
        </h6>
        <MMSelect v-model="refundAccountForm.bankCode">
            <option value="">
                입금은행을 선택하세요
            </option>
            <option
                v-for="bankCode in bankCodes"
                :key="bankCode.code" 
                :value="bankCode.code"
            >
                {{ bankCode.label }}
            </option>
        </MMSelect>
        <h6 class="mm_text-label">
            <b>계좌번호</b>
        </h6>
        <MMInput 
            v-model="refundAccountForm.accountNumber"
            :place-holder-text="'계좌번호를 입력하세요'"
            data-type="number"
            type="text"
        />
        <div class="mm_foot">
            <div class="mm_btn_box">
                <button
                    type="button"
                    class="mm_btn T=primary"
                    @click="update"
                >
                    <b>{{ operateLabel }}하기</b>
                </button>
            </div>
        </div>
        <div class="mm_note">
            <ul>
                <li>환불 계좌를 등록하시면 추후 이용시에도 별도의 입력없이 이용하실 수 있습니다.</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { RefundAccount } from '$/@type/member/refundAccount';
import MMSelect from '@/components/input/Select.vue';
import { BankCode } from '$/@type/configs';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { ModalCloseHandler } from '$/@type/Modal';
import { useRefundAccountUpdate } from '$/composables/mypage/cancelRefundAccountComposable';

const props = withDefaults(defineProps<{
    refundAccount: RefundAccount,
    bankCodes: BankCode[],
    closer: ModalCloseHandler<void>,
}>(), {
    refundAccount: () => ({
        accountNumber: '',
        ownerName: '',
        bankCode: '',
    })
})

const { 
    refundAccountForm, 
    updateRefundAccount 
} = useRefundAccountUpdate(props.refundAccount);

/** VARIABLE */
// 동작명
const operateLabel = computed<'등록'|'변경'>(() => {
    return props.refundAccount?.bankCode ? '변경' : '등록'
});

/** FUNCTION */
/**
 * 환불계좌 수정처리
 */
async function update() {
    try {
        await updateRefundAccount();
        mmon.bom.alert(`환불계좌가 ${operateLabel.value}되었습니다.`, () => {
            props.closer();
        });
    } catch (e) {
        defaultCatch(e)
    }
}
/** VUE LIFE CYCLE */
</script>

