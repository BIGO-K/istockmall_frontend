<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="m_sign">
            <div class="m_sign-title">
                <h3 class="mm_title">
                    <b>비밀번호 재설정</b>
                </h3>
                <p>인증이 완료되었습니다<small>변경하실 <span class="mm_text-variable">새 비밀번호</span>를 입력해주세요</small></p>
            </div>
            <!-- 비밀번호 재설정 입력 -->
            <h6 class="mm_text-label">
                <b>새 비밀번호</b>
            </h6>
            <MMInput 
                v-model="passwordForm.password"
                :place-holder-text="'새 비밀번호를 입력하세요'"
                maxlength="16"
                :form-valid-info="formValidData.password"
                type="password"
                :data-type="'password'"
                @input="passwordValidate($event.target.value)"
                @on-clear="passwordValidate('')"
                @focusout="passwordValidate($event.target.value)"
            />
            <h6 class="mm_text-label">
                <b>새 비밀번호 확인</b>
            </h6>
            <MMInput 
                v-model="passwordForm.passwordConfirm"
                maxlength="16"
                type="password"
                :data-type="'password'"
                :place-holder-text="'비밀번호를 한번 더 입력하세요'"
                :form-valid-info="formValidData.passwordConfirm"
                @input="passwordConfirmValidate($event.target.value)"
                @on-clear="passwordConfirmValidate('')"
                @focusout="passwordConfirmValidate($event.target.value)"
            />
            <!--// 비밀번호 재설정 입력 -->

            <!-- 하단버튼 -->
            <div class="mm_foot">
                <div class="mm_btn_box">
                    <button
                        type="button"
                        class="mm_btn T=primary"
                        @click="change"
                    >
                        <b>비밀번호 재설정</b>
                    </button>
                </div>
            </div>
            <!--// 하단버튼 -->
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { mmon } from '$/helper/mmon'
import { defaultCatch } from '$/functions';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePasswordFindChange } from '$/composables/auth/findComposable';

const router = useRouter()
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
    mmon.loading.show()
    try {
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
