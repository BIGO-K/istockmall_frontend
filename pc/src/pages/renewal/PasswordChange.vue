<template>
    <div class="mm_page-content">
        <div class="m_sign m_renewal-info">
            <div class="m_sign-title">
                <h3 class="mm_title">
                    <b>{{ globalConfigs.shop.name }} 리뉴얼 오픈</b>
                </h3>
            </div>
            <h6 class="mm_text-label">
                <b>아이디</b>
            </h6>
            <div class="mm_form-text">
                <MMInput
                    v-model="profileForm.id"
                    maxlength="20"
                    :place-holder-text="'아이디를 입력하세요'"
                    :disabled="isInquiry"
                />
            </div>
            <h6 class="mm_text-label">
                <b>이름</b>
            </h6>
            <div class="mm_form-text">
                <MMInput
                    v-model="profileForm.name"
                    maxlength="10"
                    :place-holder-text="'이름을 입력하세요'"
                    :disabled="isInquiry"
                />
            </div>
            <h6 class="mm_text-label">
                <b>휴대폰 번호</b>
            </h6>
            <div class="mm_form-text">
                <MMInput
                    v-model="profileForm.phone"
                    :place-holder-text="'휴대폰 번호를 입력하세요'"
                    data-type="number"
                    max-length="12"
                    :disabled="isInquiry"
                />
            </div>
            <!-- (D) 회원정보 조회 후에는 'm_renewal-info-pw' 영역을 노출하고 하단에 조회하기 버튼 대신 비밀번호 변경하기 버튼을 노출합니다  -->
            <div v-if="isInquiry" class="m_renewal-info-pw">
                <p><strong class="mm_text-highlight">{{ profileForm.name }}</strong>님 새로운 비밀번호를 설정해주세요<small>기존 아이디와 해당 비밀번호로 쇼핑몰을 이용하실 수 있습니다</small></p>
                <div class="mm_note">
                    <ul>
                        <li>본인인증이 필요한 회원은 본인인증 후 비밀번호 변경이 가능합니다.</li>
                    </ul>
                </div>
                <div class="mm_btn_box">
                    <div class="mm_btnbox">
                        <button
                            :class="['mm_btn', { 'T=primary': !hasCompleteCertificate }]"
                            :disabled="hasCompleteCertificate"
                            type="button"
                            @click="certification"
                        >
                            <b>휴대폰 인증</b>
                        </button>
                    </div>
                </div>
                <h6 class="mm_text-label">
                    <b>새 비밀번호</b>
                </h6>
                <div class="mm_form-text">
                    <MMInput
                        v-model="passwordForm.password"
                        maxlength="16"
                        :form-valid-info="formValidData.password"
                        :place-holder-text="'비밀번호를 입력하세요'"
                        type="password"
                        :data-type="'password'"
                        @input="passwordValidate"
                        @keyup="passwordValidate"
                    />
                </div>
                <h6 class="mm_text-label">
                    <b>새 비밀번호 확인</b>
                </h6>
                <div class="mm_form-text">
                    <MMInput
                        v-model="passwordForm.passwordConfirm"
                        :place-holder-text="'비밀번호를 한번 더 입력하세요'"
                        type="password"
                        :data-type="'password'"
                        max-length="16"
                        :form-valid-info="formValidData.passwordConfirm"
                        @keyup="passwordConfirmValidate"
                    />
                </div>
            </div>
        </div>

        <div class="mm_foot">
            <div class="mm_btn_box T=equal">
                <button type="button" class="mm_btn T=line T=primary" @click="cancel">
                    <b>취소</b>
                </button>
                <button v-if="!isInquiry" type="button" class="mm_btn T=primary" @click="findMember">
                    <b>조회하기</b>
                </button>
                <button v-else type="button" class="mm_btn T=primary" @click="changePassword">
                    <b>비밀번호 변경하기</b>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue';
import { FormInputValidState } from '$/@type/front';
import { validatePassword, defaultCatch } from '$/functions';
import { FORM_VALID_CONDITION_CLASS } from '$/constants';
import moment from 'moment';
import { makeValidator } from '$/validator';
import { renewalRepository } from '$/repository/renewalRepository';
import { useIdentityVerification } from '$/composables/auth/certificateComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const {
    router,
    usePageTitleSetting,
    globalConfigs,
    mmon
} = usePageContext();

usePageTitleSetting(`${globalConfigs.value.shop.name} 리뉴얼 오픈`);

/** VARIABLE */
const certificateToken = ref<string>('');
const hasCompleteCertificate = computed(() => certificateToken.value !== '') 
const isInquiry = ref(false);
const limitEndYear = moment().year() - 14 - 1949;
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
        id: {
            type: 'alert',
            message: '아이디를 입력해주세요.',
            validStatus: '',
            show: false
        },
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

const lastDay = computed(() => {
    if (profileForm.value.birthYear == 0 || profileForm.value.birthMonth == 0) {
        return 0;
    }
    const birthYearMonth = `${profileForm.value.birthYear}-${profileForm.value.birthMonth}-01`;
    return Number(moment(birthYearMonth, 'YYYY-MM').endOf('month').format('DD'));
});
/**
 * 멤버 조회하기
 *
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
        passwordForm.value.accessToken = await renewalRepository.findMemberAndGetAccessToken(
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
 * 본인인증
 *
 */
async function certification() {
    try {
        mmon.loading.show();
        const { identityProfile } = await useIdentityVerification(
            'width=643px, height=593px, resizble=no, scrollbars=yes',
            false
        );

        if (identityProfile.phoneNumber !== profileForm.value.phone) {
            return mmon.bom.alert('휴대폰 번호가 일치하지 않습니다. \n다시 진행해주세요.');
        }
        certificateToken.value = identityProfile.token;        
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}
/**
         * 비밀번호 변경
         *
         */
async function changePassword() {
    if (hasCompleteCertificate.value === false) {
        return mmon.bom.alert('본인 인증이 완료 되지 않았습니다.');
    }
    const validator = makeValidator(passwordForm.value)
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
 * 작성취소
 *
 */
function cancel() {
    certificateToken.value = '';
    isInquiry.value = false;
    profileForm.value = {
        id : '',
        name: '',
        email: '',
        phone: '',
        birthYear: 0,
        birthMonth: 0,
        birthDay: 0,
        birthday: '',
    };
}
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>