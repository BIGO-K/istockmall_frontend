<template>
    <div v-if="accessToken" class="mm_page-content-body">
        <div class="m_my-info">
            <h5 class="mm_heading">
                <b>회원정보 관리</b>
            </h5>
            <!-- 유의사항 -->
            <section class="mm_note T=bg">
                <h6 class="text_title">
                    <i class="ico_note" /><b>회원탈퇴 유의사항</b>
                </h6>
                <ul>
                    <li>고객님의 구매 및 반품 등 고객서비스가 완료되지 않은 경우 탈퇴처리 되지 않습니다. (1:1 상담게시판을 통해 회원탈퇴관련 문의내용을 남겨주시면 확인하여 안내 드리겠습니다.)</li>
                    <li>탈퇴 시에는 보유하고 계신 적립금 및 할인쿠폰은 자동으로 소멸 됩니다. (회원탈퇴로 소멸된 쿠폰과 적립금은 재가입시 복원되지 않습니다.)</li>
                    <li>탈퇴 시에 주문정보는 교환/반품/환불 및 사후처리(A/S) 등을 위하여 전자상거래 등 에서의 소비자보호에 관한 법류에 의거, 개인정보보호정책에 따라 관리됩니다.</li>
                    <li>탈퇴 신청 후 완료까지 일부 기간 소요되며 기간 중 메일이 발송될 수 있으니 양해 부탁드립니다.</li>
                </ul>
            </section>
            <!--// 유의사항 -->
            <div class="m_my-info-withdraw">
                <p>어떤 부분이 불편하셨나요? <small>탈퇴 사유를 남겨주시면 소중한 의견을 반영해 더 좋은 서비스로 찾아뵙겠습니다</small></p>
                <div class="mm_radio-list T=chain">
                    <ul>
                        <li
                            v-for="reason in withdrawReasons"
                            :key="reason.code"
                        >
                            <MMRadio
                                v-if="!reason.detailReasonRequired"
                                v-model="reasonCode"
                                name="reason_code"
                                :value="reason.code"
                            > 
                                <b class="mm_block">
                                    <i class="ico_form-radio" />
                                    <span class="text_label">{{ reason.label }}</span>
                                </b>
                            </MMRadio>
                            <div
                                v-else
                                class="mm_form_mix-linked"
                            >
                                <MMRadio
                                    v-model="reasonCode"
                                    name="reason_code"
                                    :value="reason.code"
                                > 
                                    <b class="mm_block">
                                        <i class="ico_form-radio" />
                                        <span class="text_label">{{ reason.label }}</span>
                                    </b>
                                </MMRadio>
                                <MMTextarea 
                                    v-model="reasonDetail"
                                    :place-holder-text="'기타 사유를 입력하세요'"
                                    :disabled="reasonCode != reason.code"
                                />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <h5 class="m_my-info-title">
                <b>그동안 <strong class="mm_text-variable">{{ globalConfigs.shop.name }} 쇼핑몰</strong>을 이용해 주셔서 감사합니다.</b>
            </h5>
            <p class="text_sub">
                고객님과 앞으로 함께하지 못해 아쉽습니다
            </p>
            <p class="text_sub">
                다시 돌아오셨을 때 지금보다 더 나은 상품과 서비스로 발전된<br> {{ globalConfigs.shop.name }} 쇼핑몰이 될 수 있도록 노력하겠습니다
            </p>
            <!-- 하단버튼 -->
            <div class="mm_foot">
                <div class="mm_btn_box">
                    <button
                        type="button"
                        class="mm_btn T=primary"
                        @click="withdraw"
                    >
                        <b>회원탈퇴 신청</b>
                    </button>
                </div>
            </div>
            <!--// 하단버튼 -->
        </div>
    </div>
    <confirm-password v-else />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { WithdrawReason } from '$/@type/member/info';
import { memberInfoRepository } from '$/repository/member/infoRepository';
import ConfirmPassword from '@/pages/mypage/memberInfo/ConfirmPassword.vue';
import MMRadio from '@/components/input/Radio.vue';
import MMTextarea from '@/components/input/Textarea.vue';
import { makeValidator } from '$/validator';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useLogout } from '$/composables/auth/userComposable';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { usePasswordConfirmToken } from '$/composables/auth/confirmComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const router = useRouter();
const { globalConfigs } = usePageContext();
usePageTitleSetting('회원탈퇴', ['회원정보 수정', '회원정보 관리', '마이페이지']);
const { accessToken, clearToken } = usePasswordConfirmToken();
const withdrawReasons = ref<WithdrawReason[]>([]);        
const reasonCode = ref<number>(0);
const reasonDetail = ref<string>();

async function withdraw() {
    // 탈퇴사유 코드 concat 문자열
    const reasonCodes: string = withdrawReasons.value.map((reason) => reason.code).join(',');
    const detailRequiredReasons: string = withdrawReasons.value
        .filter((reason) => reason.detailReasonRequired)
        .map((reason) => reason.code)
        .join(',');
                
    const validator = makeValidator({
        reasonCode: `${reasonCode.value}`,
        reasonDetail: reasonDetail.value,
    })
        .setRules({
            'reasonCode(탈퇴 사유)': ['required', 'notIn:0', `in:${reasonCodes}`],
            'reasonDetail(탈퇴 사유)': [`requiredIf:reasonCode,${detailRequiredReasons}`],
        })
        .setMessages({
            'reasonCode.required': ':param(을/를) 선택해주세요.',
            'reasonCode.notIn': ':param(을/를) 선택해주세요.',
            'reasonDetail.requiredIf': ':param(을/를) 입력해주세요.',
        })

    try {
        await validator.run();
        mmon.bom.confirm('탈퇴 시 적립금/쿠폰 정보가 모두 삭제됩니다. 탈퇴 하시겠습니까?', async(isConfirm: boolean) => {
            if (!isConfirm) {
                return;
            }
            try {
                mmon.loading.show();
                await memberInfoRepository.withdraw(accessToken.value, reasonCode.value, reasonDetail.value);
                // 회원정보 초기화
                await useLogout(true);

                mmon.bom.alert('회원 탈퇴가 완료되었습니다.', async() => {
                    router.replace({
                        name: 'Main'
                    });
                });
            } catch (e) {
                defaultCatch(e);
            } finally {
                mmon.loading.hide();
            }
        });
    } catch (e) {
        defaultCatch(e);
    }
}

/** VUE LIFE CYCLE */
onMounted(async () => {
    try {
        withdrawReasons.value = await memberInfoRepository.getWithdrawReasons();
    } catch (e) {
        defaultCatch(e);
    }
});

onBeforeRouteLeave((to, from, next) => {
    if (to.name !== 'MypageMemberInfoEdit') {
        clearToken();
    }
    return next();
});
/** // VUE LIFE CYCLE */
</script>