<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>비밀번호 변경</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-sign">
                            <div class="m_popup-sign-title">
                                <h3><b>변경하실 비밀번호를<br> 입력해주세요</b></h3>
                            </div>
                            <h5 class="mm_text-label">
                                <b>현재 비밀번호</b>
                            </h5>
                            <MMInput 
                                v-model="currentPassword"
                                :place-holder-text="'현재 비밀번호를 입력하세요'"
                                :form-valid-info="formValidData.currentPassword"
                                type="password"
                                :data-type="'password'"
                                max-length="16"
                                @change="validateCurrentPassword"
                                @onClear="
                                    formValidData.currentPassword.show = true; 
                                    formValidData.currentPassword.validStatus = 'invalid'
                                    formValidData.currentPassword.message = '비밀번호를 입력해주세요.'
                                "
                            />
                            <h5 class="mm_text-label">
                                <b>새 비밀번호</b>
                            </h5>
                            <MMInput 
                                v-model="newPassword"
                                :place-holder-text="'새 비밀번호를 입력하세요'"
                                type="password"
                                :data-type="'password'"
                                max-length="16"
                                :form-valid-info="formValidData.newPassword"
                                @onClear="
                                    formValidData.newPassword.show = true; 
                                    formValidData.newPassword.validStatus = 'invalid'
                                    formValidData.newPassword.message = '새 비밀번호를 입력해주세요.'
                                "
                            />
                            <h5 class="mm_text-label">
                                <b>새 비밀번호 확인</b>
                            </h5>
                            <MMInput 
                                v-model="newPasswordConfirm"
                                :place-holder-text="'비밀번호를 한번 더 입력하세요'"
                                type="password"
                                max-length="16"
                                :form-valid-info="formValidData.newPasswordConfirm"
                                @onClear="
                                    formValidData.newPasswordConfirm.show = true; 
                                    formValidData.newPasswordConfirm.validStatus = 'invalid'
                                    formValidData.newPasswordConfirm.message = '새 비밀번호를 한번 더 입력해주세요.'
                                "
                            />
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=primary" :disabled="!isUpdateBtnActive" @click="update">
                                        <b>비밀번호 변경하기</b>
                                    </button>
                                </div>
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
import { FormInputValidState } from '$/@type/front';
import { usePasswordConfirmToken } from '$/composables/auth/confirmComposable';
import { usePasswordChange } from '$/composables/mypage/myInfoComposable';
import { FORM_VALID_CONDITION_CLASS } from '$/constants';
import { validatePassword, defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { memberInfoRepository } from '$/repository/member/infoRepository';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const { accessToken } = usePasswordConfirmToken();

const router = useRouter();
const currentPassword = ref<string>('');
const newPassword = ref<string>('');
const newPasswordConfirm = ref<string>('');

const formValidData = ref<{
    [key: string]: FormInputValidState
}>({
    currentPassword: {
        type: 'valid',
        message: '',
        validStatus: '',
        show: false
    },
    newPassword: {
        type: 'valid',
        message: '',
        validStatus: '',
        show: false
    },
    newPasswordConfirm: {
        type: 'valid',
        message: '',
        validStatus: '',
        show: false
    }
});

const isUpdateBtnActive = computed<boolean>(() => {
    // 유효성 검사에 걸리는 항목이 하나라도 있다면 버튼 비활성화
    for(const validateStateKey in formValidData.value) {
        const validateStatus = formValidData.value[validateStateKey].validStatus
        if (validateStatus !== FORM_VALID_CONDITION_CLASS.VALID && validateStatus !== FORM_VALID_CONDITION_CLASS.NORMAL) {
            return false;
        }
    }
    return true;
});

const { 
    passwordChangeModalData: {
        memberInfo
    }
} = usePasswordChange()

onMounted(() => {
    if (!memberInfo.value || Object.keys(memberInfo.value).length == 0) {
        return router.go(-1)
    }
})

// 새 비밀번호 유효성검사
watchEffect(() => {
    if (newPassword.value === '') {
        formValidData.value.newPassword.show = false;
        formValidData.value.newPassword.validStatus = 'invalid';
        formValidData.value.newPassword.message = '새 비밀번호를 입력해주세요.';
        return
    }

    const validateState = validatePassword(newPassword.value, memberInfo.value.loginId, memberInfo.value.phone, currentPassword.value);
    formValidData.value.newPassword.show = true;
    formValidData.value.newPassword.message = validateState.message;
    formValidData.value.newPassword.validStatus = validateState.condition;
});

// 새 비밀번호 확인 유효성검사
watchEffect(() => {
    if (newPasswordConfirm.value === '') {
        formValidData.value.newPasswordConfirm.show = false;
        formValidData.value.newPasswordConfirm.validStatus = 'invalid';
        formValidData.value.newPasswordConfirm.message = '새 비밀번호를 한번 더 입력해주세요.';
        return;
    }
    formValidData.value.newPasswordConfirm.show = true;

    if (newPasswordConfirm.value == newPassword.value) {
        formValidData.value.newPasswordConfirm.message = '비밀번호가 일치합니다.';
        formValidData.value.newPasswordConfirm.validStatus = FORM_VALID_CONDITION_CLASS.VALID;
    } else {
        formValidData.value.newPasswordConfirm.message = '신규비밀번호와 신규비밀번호 확인이 일치하지 않습니다. 다시 확인해주세요.';
        formValidData.value.newPasswordConfirm.validStatus = FORM_VALID_CONDITION_CLASS.INVALID;
    }
});

// 현재 비밀번호 유효성검사
async function validateCurrentPassword() {
    if (currentPassword.value === '') {
        mmon.bom.alert('비밀번호를 입력해주세요.')
    }
    try {
        const isMatch = await memberInfoRepository.checkCurrentPassword(currentPassword.value, accessToken.value);

        if (currentPassword.value === '') {
            return formValidData.value.currentPassword.show = false
        }
        formValidData.value.currentPassword.show = !isMatch;
        formValidData.value.currentPassword.validStatus = isMatch ? FORM_VALID_CONDITION_CLASS.VALID : FORM_VALID_CONDITION_CLASS.INVALID;
        formValidData.value.currentPassword.message = !isMatch ? '비밀번호가 일치하지 않습니다.' : '';
    } catch (e) {
        defaultCatch(e, {
            401: () => {
                mmon.bom.alert('세션이 만료되었습니다.', () => {
                    router.go(-1)
                });
            }
        })
    }
}

/**
 * 비밀번호 업데이트
 */
async function update() {
    mmon.bom.confirm('비밀번호를 변경하시겠습니까?', async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }
        
        try {
            await memberInfoRepository.changePassword(newPassword.value, accessToken.value);
            mmon.bom.alert('비밀번호가 변경되었습니다.', () => {
                router.go(-1);
            })
        } catch (e) {
            defaultCatch(e);
        }
    });
}
</script>
