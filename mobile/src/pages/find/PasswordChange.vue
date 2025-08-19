<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>비밀번호 재설정</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-sign-find">
                            <div class="m_popup-sign-title">
                                <h3><b>인증이 완료되었습니다</b></h3>
                                <p>변경하실 <strong class="mm_text-variable">새 비밀번호</strong>를 입력해주세요</p>
                            </div>
                            <h5 class="mm_text-label">
                                <b>새 비밀번호</b>
                            </h5>
                            <MMInput 
                                v-model="passwordForm.password"
                                :place-holder-text="'새 비밀번호를 입력하세요'"
                                maxlength="16"
                                :form-valid-info="formValidData.password"
                                type="password"
                                :data-type="'password'"
                                @input="passwordValidate($event.target.value)"
                                @on-clear="passwordValidate('')"
                                @keyup="passwordValidate($event.target.value)"
                            />
                            <h5 class="mm_text-label">
                                <b>새 비밀번호 확인</b>
                            </h5>
                            <MMInput 
                                v-model="passwordForm.passwordConfirm"
                                :place-holder-text="'비밀번호를 한번 더 입력하세요'"
                                maxlength="16"
                                type="password"
                                :data-type="'password'"
                                :form-valid-info="formValidData.passwordConfirm"
                                @input="passwordConfirmValidate($event.target.value)"
                                @on-clear="passwordConfirmValidate('')"
                                @keyup="passwordConfirmValidate($event.target.value)"
                            />
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=primary" @click="change">
                                        <b>비밀번호 재설정</b>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import { mmon } from '$/helper/mmon'
import { defaultCatch } from '$/functions';
import MMPopup from '@/components/layout/Popup.vue';
import { usePasswordFindChange } from '$/composables/auth/findComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const { router } = usePageContext();
usePageTitleSetting('비밀번호 재설정', ['비밀번호 찾기', '로그인']);
const {
    formValidData,
    passwordForm,
    changePassword,
    passwordValidate,
    passwordConfirmValidate,
    resetFindResult
} = usePasswordFindChange()

async function change() {
    try {
        mmon.loading.show()
        await passwordForm.value.validate();
        await changePassword();
        mmon.bom.alert('비밀번호가 재설정되었습니다.\n로그인 페이지로 이동합니다.', () => {
            router.replace({ name: 'Login' });
        });
    } catch (e) {
        defaultCatch(e, {
            401: () => {
                mmon.bom.alert('세션이 만료되었습니다.', () => {
                    router.go(-1);
                });
            }
        });
    } finally {
        mmon.loading.hide();
    }
}

onBeforeRouteLeave(() => {
    resetFindResult();
});
</script>
    