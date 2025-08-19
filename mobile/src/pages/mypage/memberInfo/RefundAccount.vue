<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>환불 계좌 관리</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_inner m_myaccount">
                            <template v-if="refundAccount">
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
                                    <b>은행명</b>
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
                                    <div class="mm_btn_box">
                                        <div class="mm_flex T=equal">
                                            <button type="button" class="mm_btn T=line T=light" @click="deleteAccount">
                                                <b>삭제하기</b>
                                            </button>
                                            <button type="button" class="mm_btn T=primary" @click="openEditModalPopup">
                                                <b>변경하기</b>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <p class="mm_text-none">
                                    <i class="ico_text-none" />등록된 환불계좌가 없습니다
                                </p>
                                <div class="mm_foot">
                                    <div class="mm_btn_box">
                                        <a class="mm_btn T=primary" href="#REFUND_ACCOUNT"><b>등록하기</b></a>
                                    </div>
                                </div>
                            </template>
                            <div class="mm_note">
                                <ul>
                                    <li>환불 계좌를 등록하시면 추후 이용 시에도 별도의 입력없이 이용 하실 수 있습니다.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->

                    <!-- 푸터 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>
        </template>
    </MMSub>
</template>

<script setup lang="ts">
import { RefundAccount } from '$/@type/member/refundAccount';
import { useRefundAccountEdit } from '$/composables/mypage/refundAccountComposable';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { refundAccountRepository } from '$/repository/member/refundAccountRepository';
import MMSub from '@/components/layout/Sub.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import MMFooter from '@/components/Footer.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('환불 계좌 관리', ['마이페이지']);
const refundAccount = ref<RefundAccount>();
const { refundAccountModalData, resetRefundAccountModalData } = useRefundAccountEdit();

onMounted(async () => {
    mmon.loading.show();
    await fetchRefundAccount();
    mmon.loading.hide()

    window.addEventListener('hashchange', syncRefundAccount);
});

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', syncRefundAccount);
})

// 회원 환불계좌 조회
async function fetchRefundAccount() {
    try {
        refundAccount.value = await refundAccountRepository.get();
    } catch (e) {
        defaultCatch(e);
    }
}

// 환불계좌 수정 모달 열기
function openEditModalPopup() {
    window.location.hash = "#REFUND_ACCOUNT";
    refundAccountModalData.refundAccount.value = refundAccount.value;
}

// 수정모달과 관리페이지 데이터 sync
function syncRefundAccount(e:HashChangeEvent) {
    const before = e.oldURL.split('#')[1] ?? '';
    const after = e.newURL.split('#')[1] ?? '';

    if (before == 'REFUND_ACCOUNT' && after == '') {
        refundAccount.value = refundAccountModalData.refundAccount.value;
    }
}

/**
 * 환불계좌 삭제
 */
async function deleteAccount() {
    mmon.bom.confirm("환불계좌를 삭제하시겠습니까?", async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }
        
        try {
            await refundAccountRepository.delete();
            mmon.bom.alert('환불계좌가 삭제되었습니다.', () => {
                refundAccount.value = undefined;
                resetRefundAccountModalData();
            })
        } catch (e) {
            defaultCatch(e);
        }
    })
}
</script>
