<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>환불 계좌 {{ operateLabel }}</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_inner m_myaccount">
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
                                <b>은행명</b>
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
                                :place-holder-text="'계좌번호를 입력하세요(숫자만 입력)'"
                                data-type="number"
                                type="text"
                            />
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=primary" @click="update">
                                        <b>{{ operateLabel }}하기</b>
                                    </button>
                                </div>
                            </div>
                            <div class="mm_note">
                                <ul>
                                    <li>환불 계좌를 등록하시면 추후 이용 시에도 별도의 입력없이 이용 하실 수 있습니다.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import ModalPopup from '@/components/layout/ModalPopup.vue';
import MMSelect from '@/components/input/Select.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRefundAccountUpdate } from '$/composables/mypage/cancelRefundAccountComposable';
import { useBankCodes } from '$/composables/globalConfigComposable';
import { mmon } from '$/helper/mmon';
import { useRefundAccountModalStore } from '$/store/modalPopup/refundAccount';
import { storeToRefs } from 'pinia';
import { defaultCatch } from '$/functions';

/** VARIABLES */
// 라우터
const router = useRouter();

const store = useRefundAccountModalStore();
const { refundAccount } = storeToRefs(store);

// 은행코드 composable
const { bankCodes } = useBankCodes();

// 환불계좌 composable
const { refundAccountForm, updateRefundAccount } = useRefundAccountUpdate(store.refundAccount);

// 동작명
const operateLabel = computed<'등록'|'변경'>(() => {
    return refundAccount.value ? '변경' : '등록'
});

/** //VARIABLES */


/** FUNCTION **/

/**
 * 환불계좌 수정처리
 */
async function update() {
    try {
        await updateRefundAccount();
        mmon.bom.alert(`환불계좌가 ${operateLabel.value}되었습니다.`, () => {
            refundAccount.value = {
                ownerName: refundAccountForm.value.ownerName,
                accountNumber: refundAccountForm.value.accountNumber,
                bankCode: refundAccountForm.value.bankCode,
                bankName: bankCodes.value.find(bank => bank.code == refundAccountForm.value.bankCode)?.label
            }
            router.go(-1)
        });
    } catch (e) {
        defaultCatch(e)
    }
}

/** //FUNCTION */

/** VUE LIFE CYCLE */
// onMounted(() => {
//     refundAccountForm.value.ownerName = refundAccount.value.ownerName;
//     refundAccountForm.value.accountNumber = refundAccount.value.accountNumber;
//     refundAccountForm.value.bankCode = refundAccount.value.bankCode;
// })
/** //VUE LIFE CYCLE */

</script>