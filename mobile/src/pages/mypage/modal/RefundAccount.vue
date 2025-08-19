<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>환불 계좌 {{ refundAccount ? '변경' : '등록' }}</b></h1>
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
                                v-model="newRefundAccount.ownerName"
                                :place-holder-text="'예금주명을 입력하세요'"
                                maxlength="50"
                                type="text"
                            />
                            <h6 class="mm_text-label">
                                <b>은행명</b>
                            </h6>
                            <MMSelect v-model="newRefundAccount.bankCode">
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
                                v-model="newRefundAccount.accountNumber"
                                :place-holder-text="'계좌번호를 입력하세요(숫자만 입력)'"
                                data-type="number"
                                type="text"
                            />
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=primary" @click="updateRefundAccount">
                                        <b>{{ refundAccount ? '변경' : '등록' }}하기</b>
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
import { makeValidator } from '$/validator';
import { useRefundAccountEdit } from '$/composables/mypage/refundAccountComposable';
import { mmon } from '$/helper/mmon';
import { globalConfigsRepository } from '$/repository/globalConfigsRepository';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import MMSelect from '@/components/input/Select.vue';
import { BankCode } from '$/@type/configs';
import { defaultCatch } from '$/functions';
import { refundAccountRepository } from '$/repository/member/refundAccountRepository';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { RefundAccount } from '$/@type/member/refundAccount';

const router = useRouter();
const bankCodes = ref<BankCode[]>([]);
const { 
    refundAccountModalData: {
        refundAccount
    },
} = useRefundAccountEdit();
const newRefundAccount = ref<RefundAccount>({
    accountNumber: '',
    ownerName: '',
    bankCode: '',
});

onMounted(async() => {
    if(refundAccount.value) {
        newRefundAccount.value = {
            accountNumber: refundAccount.value.accountNumber,
            ownerName: refundAccount.value.ownerName,
            bankCode:refundAccount.value.bankCode,
        }
    }

    try {
        bankCodes.value = await globalConfigsRepository.getBankCodes();
    } catch (e) {
        defaultCatch(e);
    }  
});

/**
 * 환불계좌 수정처리
 */
async function updateRefundAccount() {
    try {
        const validator = makeValidator(newRefundAccount.value)
            .setRules({
                'ownerName(예금주명)': ['required', 'maxLength:50'],
                'bankCode(입금 은행)': ['required'],
                'accountNumber(계좌번호)': ['required', 'maxLength:20']
            })
            .setMessages({
                'ownerName.required': ':param(을/를) 입력해주세요',
                'bankCode.required': ':param(을/를) 입력해주세요',
                'accountNumber.required': ':param(을/를) 입력해주세요',
            })
        
        await validator.run();
        await refundAccountRepository.createOrUpdate(newRefundAccount.value)
        mmon.bom.alert(`환불계좌가 ${refundAccount.value ? '변경' : '등록'}되었습니다.`, () => {
            refundAccount.value = newRefundAccount.value;
            refundAccount.value.bankName = bankCodes.value.find(bank => bank.code == newRefundAccount.value.bankCode)?.label;
            router.go(-1)
        });
        
    } catch (e) {
        defaultCatch(e);
    }
}

</script>
