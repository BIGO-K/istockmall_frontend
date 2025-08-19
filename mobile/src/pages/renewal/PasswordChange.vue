<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>{{ globalConfigs.shop.name }} 리뉴얼 오픈</b></h1>
        </template>

        <template #contents>
            <div id="mm_body" class="mm_page">
                <div class="mm_scroller">
                    <div class="mm_page-inner">
                        <!-- 본문 -->
                        <div class="mm_page-content">
                            <div class="m_popup-sign m_popup-renewal">
                                <template v-if="!isInquiry">
                                    <h5 class="mm_text-label">
                                        <b>아이디</b>
                                    </h5>
                                    <MMInput
                                        v-model="profileForm.id"
                                        :place-holder-text="'아이디를 입력하세요'"
                                        max-length="50"
                                    />
                                    <h5 class="mm_text-label">
                                        <b>이름</b>
                                    </h5>
                                    <MMInput
                                        v-model="profileForm.name"
                                        :place-holder-text="'이름을 입력하세요'"
                                        :data-type="'name'"
                                        :disabled="isInquiry"
                                        maxlength="10"
                                    />
                                    <h5 class="mm_text-label">
                                        <b>휴대폰 번호</b>
                                    </h5>
                                    <MMInput
                                        v-model="profileForm.phone"
                                        :data-type="'number'"
                                        :disabled="isInquiry"
                                        :place-holder-text="'휴대폰 번호를 입력하세요(숫자만 입력)'"
                                        maxlength="11"
                                    />
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <button
                                                type="button"
                                                class="mm_btn T=primary"
                                                @click="findMember"
                                            >
                                                <b>조회하기</b>
                                            </button>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="m_popup-sign-title">
                                        <h3><b><strong class="mm_text-variable">{{ profileForm.name }}</strong>님<br> 새로운 비밀번호를 설정해주세요</b></h3>
                                        <b>기존 아이디와 해당 비밀번호로 쇼핑몰을<br> 이용하실 수 있습니다</b>
                                    </div>
                                    <div class="mm_note">
                                        <ul>
                                            <li>본인인증이 필요한 회원은 본인인증 후 비밀번호 변경이 가능합니다.</li>
                                        </ul>
                                    </div>
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <a
                                                :class="['mm_btn', 'T=lg', {'T=primary': !hasCompleteCertificate}]"
                                                :href="hasCompleteCertificate ? '' : '#'"
                                                target="_blank"
                                                title="새 창 열림"
                                                @click.prevent="certification"
                                            ><b>휴대폰 인증</b></a>
                                        </div>
                                    </div>
                                    <h5 class="mm_text-label">
                                        <b>새 비밀번호</b>
                                    </h5>
                                    <MMInput
                                        v-model="passwordForm.password"
                                        :place-holder-text="'새 비밀번호를 입력하세요'"
                                        type="password"
                                        :data-type="'password'"
                                        max-length="16"
                                        :auto-fill-off="true"
                                        :form-valid-info="formValidData.password"
                                        @input="passwordValidate"
                                        @on-clear="() => { formValidData.password.show = false; }"
                                        @keyup="passwordValidate"
                                    />
                                    <h5 class="mm_text-label">
                                        <b>새 비밀번호 확인</b>
                                    </h5>
                                    <MMInput
                                        v-model="passwordForm.passwordConfirm"
                                        :place-holder-text="'비밀번호를 한번 더 입력하세요'"
                                        type="password"
                                        :data-type="'password'"
                                        max-length="16"
                                        :form-valid-info="formValidData.passwordConfirm"
                                        @input="passwordConfirmValidate"
                                        @on-clear="() => { formValidData.passwordConfirm.show = false; }"
                                        @keyup="passwordConfirmValidate"
                                    />
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <button
                                                type="button"
                                                class="mm_btn T=primary"
                                                @click="changePassword"
                                            >
                                                <b>비밀번호 변경하기</b>
                                            </button>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <!--// 본문 -->
                    </div>
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang='ts'>
import ModalPopup from '@/components/layout/ModalPopup.vue';
import MMInput from '@/components/input/Text.vue';
import { computed, ref } from 'vue';
import { FormInputValidState } from '$/@type/front';
import { FORM_VALID_CONDITION_CLASS } from '$/constants';
import { defaultCatch, validatePassword } from '$/functions';
import moment from 'moment';
import { makeValidator } from '$/validator';
import { renewalRepository } from '$/repository/renewalRepository';
import { useIdentityVerification } from '$/composables/auth/certificateComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
/** VARIABLE */
const {
    router,
    usePageTitleSetting,
    globalConfigs,
    mmon
} = usePageContext();

usePageTitleSetting(`${globalConfigs.value.shop.name} 리뉴얼 오픈`);
    
const certificateToken = ref<string>('');
const hasCompleteCertificate = computed(() => certificateToken.value !== '') 

const isInquiry = ref(false);
const profileForm = ref({
    id : '',
    name: '',
    email: '',
    phone: '',
    birthYear: 0,
    birthMonth: 0,
    birthDay: 0,
    birthday: '',
});
const passwordForm = ref({
    password: '',
    passwordConfirm: '',
    accessToken: '',
})
const formValidData = ref<{
    [key: string]: FormInputValidState
    }>({
        password: {
            type: 'valid',
            message: '',
            validStatus: '',
            show: false
        },
        passwordConfirm: {
            type: 'valid',
            message: '',
            validStatus: '',
            show: false
        }
    });


function passwordValidate() {
    const passwordValidateState =  validatePassword(passwordForm.value.password, profileForm.value.id, profileForm.value.phone);
    formValidData.value.password.show = true;
    formValidData.value.password.message = passwordValidateState.message;
    formValidData.value.password.validStatus = passwordValidateState.condition;
}

function passwordConfirmValidate() {
    formValidData.value.passwordConfirm.show = passwordForm.value.password !== passwordForm.value.passwordConfirm;
    formValidData.value.passwordConfirm.message = passwordForm.value.password === passwordForm.value.passwordConfirm ? '' : '비밀번호 정보가 일치하지 않습니다. ';
    formValidData.value.passwordConfirm.validStatus = passwordForm.value.password !== passwordForm.value.passwordConfirm ? FORM_VALID_CONDITION_CLASS.INVALID : FORM_VALID_CONDITION_CLASS.VALID;
}
/**
 * 멤버 조회하기
 */
async function findMember() {
    profileForm.value.birthday = moment()
        .set('year', Number(profileForm.value.birthYear))
        .set('month', Number(profileForm.value.birthMonth))
        .set('date', Number(profileForm.value.birthDay))
        .format('YYYYMMDD');
    const validator = makeValidator(profileForm.value);
    validator.setRules({
        'id(아이디)': ['required'],
        'name(이름)': ['required'],
        'email(이메일)': ['validEmail'],
        'phone(휴대폰 번호)': ['required', 'minLength:10'],
        'birthday(생년월일)': ['isBirthDateExist'],
    });
    validator.setMessages({
        'id.required': ':param(을/를) 입력해주세요.',
        'name.required': ':param(을/를) 입력해주세요.',
        'email.required': ':param(을/를) 입력해주세요.',
        'phone.required': ':param(을/를) 입력해주세요.',
        'phone.minLength': '올바른 :param(을/를) 입력해주세요.',
        'birthday.isBirthDateExist': '올바른 생년월일을 선택해주세요.',
    });
    validator.registTester('isBirthDateExist', () => {
        // 비어있으면 체크 안함
        if (profileForm.value.birthYear == 0 && profileForm.value.birthMonth == 0 && profileForm.value.birthDay == 0) {
            profileForm.value.birthday = '';
            return true;
        } else if (profileForm.value.birthYear !== 0 && profileForm.value.birthMonth !== 0 && profileForm.value.birthDay !== 0) {
            return true;
        } else {
            profileForm.value.birthday = '';
            return false;
        }
    })
    try {
        mmon.loading.show();
        await validator.run();
        passwordForm.value.accessToken =  await renewalRepository.findMemberAndGetAccessToken(
            profileForm.value.id,
            profileForm.value.name,
            profileForm.value.phone,
            profileForm.value.email,
            profileForm.value.birthday,
        );
        isInquiry.value = true;
    } catch (error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}
/**
 * 본인인증 확인
*/
async function certification() {
    try {
        const { identityProfile } = await useIdentityVerification('', false);
        if (identityProfile.phoneNumber !== profileForm.value.phone) {
            return mmon.bom.alert('휴대폰 번호가 일치하지 않습니다.\n 다시 진행해주세요.');
        }                
        certificateToken.value = identityProfile.token;        
    } catch (e) {
        defaultCatch(e);
    }
}
/**
 * 비밀번호 변경
 *
 */
async function changePassword() {
    if (!hasCompleteCertificate.value) {
        return mmon.bom.alert('본인 인증이 완료 되지 않았습니다.');
    }

    const validator = makeValidator(passwordForm.value);
    validator.setRules({
        'accessToken': ['required'],
        'password(비밀번호)': ['required', 'isValidatePass'],
        'passwordConfirm(비밀번호 확인)': ['required', 'isSamePassword:password'],
    });
    validator.setMessages({
        'accessToken.required': '본인 인증이 완료 되지 않았습니다.',
        'password.required': ':param(을/를) 입력해주세요.',
        'password.isValidatePass': `:param(을/를) ${formValidData.value.password.message}`,
        'passwordConfirm.required': ':param(을/를) 입력해주세요.',
        'passwordConfirm.isSamePassword': '비밀번호 정보가 일치하지 않습니다.',
    })
    validator.registTester('isValidatePass', ()=> {
        return formValidData.value.password.validStatus === FORM_VALID_CONDITION_CLASS.NORMAL || formValidData.value.password.validStatus === FORM_VALID_CONDITION_CLASS.VALID;
    })
    validator.registTester('isSamePassword', ()=> {
        return passwordForm.value.password === passwordForm.value.passwordConfirm;
    })
    try {
        mmon.loading.show();
        await validator.run();
        await renewalRepository.passwordChange(
            passwordForm.value.password,
            certificateToken.value,
            passwordForm.value.accessToken
        );

        return mmon.bom.alert('비밀번호가 재설정되었습니다.\n로그인 페이지로 이동합니다.', () => {
            router.replace({ name: 'Login' });
        });

    } catch (error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>