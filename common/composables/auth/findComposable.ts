import { IdFindResultInfo, PasswordFindResult } from "$/@type/auth/findResult";
import { FormInputValidState } from "$/@type/front";
import { useForm } from "$/composables/pageHandler/formComposable";
import { FORM_VALID_CONDITION_CLASS } from "$/constants";
import { defaultCatch, validatePassword } from "$/functions";
import { mmon } from "$/helper/mmon";
import { authFindRepository } from "$/repository/auth/findRepository";
import { useIdFindResultStore } from "$/store/findResult/id"
import { usePasswordFindStore } from "$/store/findResult/password";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

export function useIdFind() {
    /** STORE **/
    const store = useIdFindResultStore();
    const { expired } = storeToRefs(store);
    /** //STORE **/

    /** VARIABLE **/
    const { form: idFindForm } = useForm<{
        name: string;
        email: string;
        phoneNumber: string;
        findType: 'email'|'phone'
    }>({
        name: '',
        email: '',
        phoneNumber: '',
        findType: 'email',
    }, {
        rules: {
            'name(이름)' : ['required'],
            'email(이메일)' : ['requiredIf:findType,email', 'validEmail'],
            'phoneNumber(휴대폰 번호)' : ['requiredIf:findType,phone', 'minLength:10'],
        },
        messages: {
            'name.required' : ':param(을/를) 입력해주세요.',
            'email.requiredIf' : ':param(을/를) 입력해주세요.',
            'phoneNumber.requiredIf' : ':param(을/를) 입력해주세요.',
            'phoneNumber.minLength': '올바른 :param(을/를) 입력해주세요.'
        }
    });
    /** //VARIABLE **/

    /** FUNCTION **/
    /**
     * form data reset
     */
    function resetForm() {
        idFindForm.value.name = '';
        idFindForm.value.email = '';
        idFindForm.value.phoneNumber = '';
    }

    /**
     * 아이디 찾기
     */
    async function findId() {
        const findResultInfo: IdFindResultInfo = 
            idFindForm.value.findType === 'phone' 
            ? await authFindRepository.findIdByPhone(idFindForm.value.name, idFindForm.value.phoneNumber)
            : await authFindRepository.findIdByEmail(idFindForm.value.name, idFindForm.value.email);

        if (findResultInfo.idFindResults.length < 1) {
            throw new Error('입력하신 정보와 일치하는 회원정보가 없습니다.')
        }
        store.setIdFindResultInfo(findResultInfo);
    }
    /** //FUNCTION **/

    (() => {
        if (expired.value) {
            store.$reset();
        }
    })()

    return {
        idFindForm,
        resetForm,
        findId,
    }
}

export function useIdFindResult() {
    /** STORE **/
    const store = useIdFindResultStore();
    const { 
        idFindResults, 
        userName, 
        findType,
        expired,
        phone,
        token,
        email,
    } = storeToRefs(store);
    /** //STORE **/

    /** VARIABLE **/
    const findResultExists = computed<boolean>(() => idFindResults.value.length > 0);
    /** //VARIABLE **/
    
    /** FUNCTION **/
    /**
     * 마스킹 제거 아이디 전송
     */
    async function sendFullId() {
        try {
            if (findType.value === 'phone') {
                await authFindRepository.sendUnmaskedIdByPhone(phone.value, token.value);
                mmon.bom.alert('입력하신 휴대폰 번호로 전송되었습니다.');
            } else if (findType.value === 'email') {
                await authFindRepository.sendUnmaskedIdByEmail(email.value, token.value);
                mmon.bom.alert('입력하신 이메일 주소로 전송되었습니다.');
            }
        } catch (e) {
            defaultCatch(e);
        }
    }

    /**
     * STORE RESET
     */
    function resetFindResult() {
        store.$reset();
    }
    /** //FUNCTION **/
    (() => {
        if (expired.value) {
            store.$reset();
        }
    })()   

    return {
        findType: findType.value,
        userName: userName.value,
        idFindResults: idFindResults.value,
        findResultExists,
        sendFullId,
        resetFindResult,
    }
}

export function usePasswordFind() {
    /** STORE **/
    const store = usePasswordFindStore();
    const { expired, token } = storeToRefs(store);
    /** //STORE **/

    /** VARIABLE **/
    const isVerificationCodeSended = ref<boolean>(false);
    const isVerified = ref<boolean>(false);
    const { form: passwordFindForm } = useForm<{
        findType: 'email'|'phone'
        loginId: string
        name: string
        email: string
        phone: string
        verificationCode: string
    }>({
        findType: 'email',
        loginId: '',
        name: '',
        email: '',
        phone: '',
        verificationCode: '',
    }, {
        rules: {
            'loginId(아이디)' : ['required'],
            'name(이름)' : ['required'],
            'email(이메일)' : ['requiredIf:findType,email', 'validEmail'],
            'phone(휴대폰 번호)' : ['requiredIf:findType,phone', 'minLength:10'],
        }, 
        messages: {
            'loginId.required': ':param(을/를) 입력해주세요.',
            'name.required': ':param(을/를) 입력해주세요.',
            'email.requiredIf': ':param(을/를) 입력해주세요.',
            'email.validEmail': ':param(을/를) 올바르게 입력해주세요.',
            'phone.requiredIf': ':param(을/를) 입력해주세요.',
            'phone.minLength': '올바른 :param(을/를) 입력해주세요.',
            'verificationCode.required': ':param(을/를) 확인해주세요.',
        }
    });

    /** FUNCTION **/
    /**
     * FORM DATA RESET
     */
    function resetForm() {
        passwordFindForm.value.loginId = '';
        passwordFindForm.value.name = '';
        passwordFindForm.value.email = '';
        passwordFindForm.value.phone = '';
        passwordFindForm.value.verificationCode = '';
        isVerificationCodeSended.value = false;
        isVerified.value = false;
        store.$reset()
    }

    /**
     * 인증번호 발송
     */
    async function sendVerificationCode() {
        try {
            mmon.loading.show();
            await passwordFindForm.value.validate();
            const findResult: PasswordFindResult = {
                token: '',
                expireAt: '',
                loginId: passwordFindForm.value.loginId
            }; 
            if (passwordFindForm.value.findType === 'email') {
                const { token, expireAt } = await authFindRepository.sendVerificationCodeByEmail(
                    passwordFindForm.value.loginId,
                    passwordFindForm.value.name,
                    passwordFindForm.value.email
                )
                findResult.token = token;
                findResult.expireAt = expireAt;
                mmon.bom.alert('입력하신 이메일 주소로 인증번호가 발송되었습니다.');
            } else if (passwordFindForm.value.findType === 'phone') {
                const { token, expireAt } = await authFindRepository.sendVerificationCodeByPhone(
                    passwordFindForm.value.loginId,
                    passwordFindForm.value.name,
                    passwordFindForm.value.phone
                )
                findResult.token = token;
                findResult.expireAt = expireAt;
                mmon.bom.alert('입력하신 휴대폰 번호로 인증번호가 발송되었습니다.');
            }
    
            store.setFindResultInfo(findResult);
            isVerificationCodeSended.value = true;
        } catch (e) {
            defaultCatch(e)
        } finally {
            mmon.loading.hide();
        }
    }

    /**
     * 인증번호 발송
     */
    async function verifyCode() {
        if (!isVerificationCodeSended.value) {
            return mmon.bom.alert('인증번호를 발송해주세요.');
        }

        if (passwordFindForm.value.verificationCode == '') {
            return mmon.bom.alert('인증번호를 입력해주세요.');
        }

        if (expired.value) {
            mmon.bom.alert('인증시간이 초과되었습니다. 다시 시도해주세요.', resetForm);
        }

        mmon.loading.show();
        try {
            await authFindRepository.verifyCode(Number(passwordFindForm.value.verificationCode), token.value);
            isVerified.value = true;
            mmon.bom.alert('인증되었습니다.');
        } catch (e) {
            defaultCatch(e, {
                422: '인증번호를 확인해주세요.',
                401: '인증시간이 초과 되었습니다. 다시 시도해주세요.'
            });
        } finally {
            mmon.loading.hide();
        }
    }

    /**
     * 
     */
    async function findPassword() {
        if (!isVerified.value) {
            const findTypeLabel = passwordFindForm.value.findType === 'email' ? '이메일 주소' : '휴대폰 번호';
            return mmon.bom.alert(`${findTypeLabel} 인증을 해주세요.`);
        }

        passwordFindForm.value.rules['verificationCode(인증번호)'] = ['required'];
        await passwordFindForm.value.validate();
        if (passwordFindForm.value.findType === 'email') {
            await authFindRepository.findPasswordByEmail(
                passwordFindForm.value.name, 
                passwordFindForm.value.loginId, 
                Number(passwordFindForm.value.verificationCode), 
                passwordFindForm.value.email, 
                token.value,
            )
        } else if (passwordFindForm.value.findType === 'phone') {
            await authFindRepository.findPasswordByPhone(
                passwordFindForm.value.name, 
                passwordFindForm.value.loginId, 
                Number(passwordFindForm.value.verificationCode), 
                passwordFindForm.value.phone, 
                token.value,
            )
        }
    }
    /** //FUNCTION **/

    return {
        passwordFindForm,
        isVerificationCodeSended,
        isVerified,
        resetForm,
        sendVerificationCode,
        verifyCode,
        findPassword,
    }
}

export function usePasswordFindChange() {
    /** STORE **/
    
    const store = usePasswordFindStore();
    const { 
        token,
        loginId,
        expired,
    } = storeToRefs(store);
    /** //STORE **/

    /** VARIABLE **/
    const findResultExists = computed<boolean>(() => token.value !== '' && !expired.value);

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

    const { form: passwordForm } = useForm<{
        password: string
        passwordConfirm: string
    }>({
        password: '',
        passwordConfirm: '',
    }, {
        rules: { 
            'password(새 비밀번호)': ['required', 'maxLength:16', 'confirm'],
        },
        messages: {
            'password.required': ':param(을/를) 입력해주세요.',
            'password.confirm': ':param(이/가) 일치하지 않습니다.',
        },
        extraTester: [
            {
                name: 'confirm',
                validateFunction: (): boolean => {
                    return passwordForm.value.password === passwordForm.value.passwordConfirm;
                }
            },
            {
                name: 'validatePass',
                validateFunction: (): boolean => {
                    return formValidData.value.password.validStatus !== FORM_VALID_CONDITION_CLASS.INVALID
                        && formValidData.value.password.validStatus !== FORM_VALID_CONDITION_CLASS.DANGER
                }
            }
        ]
    });
    /** //VARIABLE **/

    /** FUNCTION **/
    /**
     * 비밀번호 수정처리
     */
    async function changePassword() {
        passwordValidate(passwordForm.value.password);
        await authFindRepository.changePassword(passwordForm.value.password, token.value);
    }

    /**
     * 비밀번호 valid 데이터 update
     * @param newPassword 새 비밀번호
     * @returns 
     */
    async function passwordValidate(newPassword: string) {
        if (newPassword === '') {
            formValidData.value.password.show = false;
            return;
        }
        const result = validatePassword(newPassword, loginId.value, '');

        formValidData.value.password.show = true;
        formValidData.value.password.message = result.message;
        formValidData.value.password.validStatus = result.condition;
    }

    /**
     * 비밀번호 확인 valid 데이터 update
     * @param newPassword 새 비밀번호
     * @returns 
     */
    async function passwordConfirmValidate(newPasswordConfirm: string) {
            if (newPasswordConfirm === '') {
                formValidData.value.passwordConfirm.show = false;
                return;
            }
            const invalid: boolean = passwordForm.value.password !== newPasswordConfirm;

            formValidData.value.passwordConfirm.show = true;
            formValidData.value.passwordConfirm.message = !invalid ? '비밀번호 정보가 일치합니다.' : '비밀번호 정보가 일치하지 않습니다. ';
            formValidData.value.passwordConfirm.validStatus = invalid ? FORM_VALID_CONDITION_CLASS.INVALID : FORM_VALID_CONDITION_CLASS.VALID;
    }

    /** //FUNCTION **/

    (() => {
        if (expired.value) {
            store.$reset();
        }
    })()
    
    return {
        findResultExists,
        formValidData,
        passwordForm,
        changePassword,
        passwordValidate,
        passwordConfirmValidate,
        resetFindResult: store.$reset,
    }
}