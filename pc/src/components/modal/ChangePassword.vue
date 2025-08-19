<template>
    <div class="m_modal-my-pw">
        <h3 class="mm_heading">
            <b>변경하실 비밀번호를 입력해주세요</b>
        </h3>
        <h6 class="mm_text-label">
            <b>현재 비밀번호</b>
        </h6>
        <MMInput 
            v-model="currentPassword"
            :place-holder-text="'현재 비밀번호를 입력하세요'"
            :form-valid-info="formValidData.currentPassword"
            type="password"
            :data-type="'password'"
            max-length="16"
            @change="validateCurrentPassword"
            @on-clear="
                formValidData.currentPassword.show = true; 
                formValidData.currentPassword.validStatus = 'invalid'
                formValidData.currentPassword.message = '비밀번호를 입력해주세요.'
            "
        />
        <h6 class="mm_text-label">
            <b>새 비밀번호</b>
        </h6>
        <MMInput 
            v-model="newPassword"
            :place-holder-text="'새 비밀번호를 입력하세요'"
            type="password"
            :data-type="'password'"
            max-length="16"
            :form-valid-info="formValidData.newPassword"
            @on-clear="
                formValidData.newPassword.show = true; 
                formValidData.newPassword.validStatus = 'invalid'
                formValidData.newPassword.message = '새 비밀번호를 입력해주세요.'
            "
        />
        <h6 class="mm_text-label">
            <b>새 비밀번호를 입력하세요</b>
        </h6>
        <MMInput 
            v-model="newPasswordConfirm"
            :place-holder-text="'비밀번호를 한번 더 입력하세요'"
            type="password"
            :data-type="'password'"
            max-length="16"
            :form-valid-info="formValidData.newPasswordConfirm"
            @on-clear="
                formValidData.newPasswordConfirm.show = true; 
                formValidData.newPasswordConfirm.validStatus = 'invalid'
                formValidData.newPasswordConfirm.message = '새 비밀번호를 한번 더 입력해주세요.'
            "
        />
        <div class="mm_foot">
            <div class="mm_btn_box">
                <button
                    type="button"
                    class="mm_btn T=primary"
                    :disabled="!isUpdateBtnActive"
                    @click="update"
                >
                    <b>확인하기</b>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, watchEffect, computed } from 'vue'
import { mmon } from '$/helper/mmon';
import { FormInputValidState } from '$/@type/front';
import { validatePassword, defaultCatch } from '$/functions';
import { MemberInfo } from '$/@type/member/info';
import { FORM_VALID_CONDITION_CLASS } from '$/constants';
import { memberInfoRepository } from '$/repository/member/infoRepository';
import { usePasswordConfirmToken } from '$/composables/auth/confirmComposable';
import { ModalCloseHandler } from '$/@type/Modal';


const props = defineProps<{
    memberInfo: MemberInfo,
    closer: ModalCloseHandler<void>
}>();

/** VARIABLE */
const currentPassword = ref<string>('');
const newPassword = ref<string>('');
const newPasswordConfirm = ref<string>('');

const { accessToken } = usePasswordConfirmToken();

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

// 새 비밀번호 유효성검사
watchEffect(() => {
    if (newPassword.value === '') {
        formValidData.value.newPassword.show = false;
        formValidData.value.newPassword.validStatus = 'invalid';
        formValidData.value.newPassword.message = '새 비밀번호를 입력해주세요.';
        return
    }

    const validateState = validatePassword(newPassword.value, props.memberInfo.loginId, props.memberInfo.phone, currentPassword.value);
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

// 모달 data 초기화 후 닫기
async function validateCurrentPassword() {
    if (currentPassword.value === '') {
        return mmon.bom.alert('비밀번호를 입력해주세요.')
    }
    try {
        const isMatch = await memberInfoRepository.checkCurrentPassword(currentPassword.value, accessToken.value);

        // 비동기함수 실행하는동안 currentPassword 입력값이 초기화된 경우
        if (currentPassword.value === '') {
            return;
        }
                    
        formValidData.value.currentPassword.show = !isMatch;
        formValidData.value.currentPassword.validStatus = isMatch ? FORM_VALID_CONDITION_CLASS.VALID : FORM_VALID_CONDITION_CLASS.INVALID;
        formValidData.value.currentPassword.message = !isMatch ? '비밀번호가 일치하지 않습니다.' : '';
    } catch (e) {
        defaultCatch(e, {
            401: () => {
                mmon.bom.alert('세션이 만료되었습니다.', () => {
                    props.closer();
                });
            }
        })
    }
}

async function update() {
    mmon.bom.confirm('비밀번호를 변경하시겠습니까?', async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }
                        
        try {
            await memberInfoRepository.changePassword(newPassword.value, accessToken.value);
            mmon.bom.alert('비밀번호 변경이 완료되었습니다.', () => {
                props.closer();
            })
        } catch (e) {
            defaultCatch(e);
        }
    });
}
/** FUNCTION */

/** VUE LIFE CYCLE */
</script>