<template>
    <div class="mm_page-content-body">
        <div
            v-if="refundAccount"
            class="m_my-info"
        >
            <h5 class="mm_heading">
                <b>회원정보 관리</b>
            </h5>
            <h6 class="mm_strapline T=line">
                <b>환불 계좌 관리</b>
            </h6>
            <div class="m_my-info-inner">
                <h6 class="mm_text-label">
                    <b>예금주명</b>
                </h6>
                <div class="mm_form-text">
                    <label>
                        <span class="textfield text_readonly">{{ refundAccount.ownerName }}</span>
                        <i class="bg_text" />
                    </label>
                </div>
                <h6 class="mm_text-label">
                    <b>입금은행</b>
                </h6>
                <div class="mm_form-text">
                    <label>
                        <span class="textfield text_readonly">{{ refundAccount.bankName }}</span>
                        <i class="bg_text" />
                    </label>
                </div>
                <h6 class="mm_text-label">
                    <b>계좌번호</b>
                </h6>
                <div class="mm_form-text">
                    <label>
                        <span class="textfield text_readonly">{{ refundAccount.accountNumber }}</span>
                        <i class="bg_text" />
                    </label>
                </div>
                <div class="mm_foot">
                    <div class="mm_btn_box mm_flex T=equal">
                        <button
                            type="button"
                            class="mm_btn T=line"
                            @click="deleteAccount"
                        >
                            <b>삭제하기</b>
                        </button>
                        <button
                            type="button"
                            class="mm_btn T=primary"
                            @click="openModal"
                        >
                            <b>변경하기</b>
                        </button>
                    </div>
                </div>
                <div class="mm_note">
                    <ul>
                        <li>환불 계좌를 등록하시면 추후 이용시에도 별도의 입력없이 이용하실 수 있습니다.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div
            v-else
            class="m_my-info"
        >
            <h5 class="mm_heading">
                <b>회원정보 관리</b>
            </h5>
            <h6 class="mm_strapline T=line">
                <b>환불 계좌 관리</b>
            </h6>
            <p class="mm_text-none">
                <i class="ico_text-none" />등록된 환불 계좌 정보가 없습니다
            </p>
            <div class="mm_btn_box T=equal">
                <a
                    class="mm_btn T=primary"
                    href="#"
                    @click.prevent="openModal"
                ><b>등록하기</b></a>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { RefundAccount } from '$/@type/member/refundAccount';
import { refundAccountRepository } from '$/repository/member/refundAccountRepository';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';
import RefundAccountModal from '@/components/modal/RefundAccount.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { useBankCodes } from '$/composables/globalConfigComposable';


usePageTitleSetting('환불 계좌 관리', ['회원정보 관리', '마이페이지']);
const refundAccount = ref<RefundAccount>();

// 회원 환불계좌 조회
async function fetchRefundAccount() {
    try {
        refundAccount.value = await refundAccountRepository.get();
    } catch (e) {
        defaultCatch(e);
    }
}

/** VARIABLE */
            
/** FUNCTION */

function openModal() {
    useModal().open(RefundAccountModal, {
        title: refundAccount.value ? '환불 계좌 변경' : '환불 계좌 등록',
        name: 'RefundAccountModal',
        props: async() => {
            const { bankCodes } = useBankCodes();
            return {
                refundAccount: refundAccount.value,
                bankCodes
            }
        },
        onClose: () => {
            fetchRefundAccount();
        }
    })
}

async function deleteAccount() {
    mmon.bom.confirm("환불계좌를 삭제하시겠습니까?", async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }
        
        try {
            await refundAccountRepository.delete();
            mmon.bom.alert('환불계좌가 삭제되었습니다.', () => {
                refundAccount.value = undefined;
            })
        } catch (e) {
            defaultCatch(e);
        }
    })
}

/** VUE LIFE CYCLE */
onMounted(async () => {
    mmon.loading.show();
    await fetchRefundAccount();
    mmon.loading.hide()
})

</script>
