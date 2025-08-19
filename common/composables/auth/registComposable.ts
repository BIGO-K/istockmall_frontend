import { RegistUser } from "$/@type/auth/user";
import { mmon } from "$/helper/mmon";
import { registRepository } from "$/repository/auth/registRepository";
import { useAuthStore } from "$/store/auth"
import { storeToRefs } from 'pinia';
import { Policy } from "$/@type/policy";
import { onBeforeMount, ref, onBeforeUnmount, computed } from 'vue';
import { defaultCatch, validatePassword } from "$/functions";
import { FormInputValidState } from "$/@type/front";
import { FORM_VALID_CONDITION_CLASS } from "$/constants";
import { useRegisterStore } from '$/store/register';


export function useSignUp () {
    /** STORE **/
    const authStore = useAuthStore();
    const { identityProfile } = storeToRefs(authStore)
    /** //STORE **/

    /** VARIABLE **/
    const policies = ref<Policy[]>([]);
    const baseStartYear = 1899;
    const limitEndYear = new Date().getFullYear() - 14 - baseStartYear;
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
    
    const checkedDuplicateId = ref('');
    const hasDuplicateId = ref(true);

    /** //VARIABLE **/

    /** FUNC **/

    /**
     * ID 중복검사 
     * @param {string} loginId : 사용자 ID
     * @returns void
    */
    async function checkIdDuplicate(userId: string) {
        const userIdLength = userId.length;
        if (userIdLength < 1) {
            return mmon.bom.alert('아이디를 입력해주세요.');
        }
        if (userIdLength < 5 || userIdLength > 20) {
            return mmon.bom.alert('사용할 수 없는 아이디입니다.');
        }
        try
        {
            const isExist = await registRepository.idDuplicateCheck(userId);
            hasDuplicateId.value = isExist;
            if (!isExist) {
                checkedDuplicateId.value = userId;
            }
            return mmon.bom.alert(isExist ? '이미 사용 중인 아이디입니다' : '사용 가능한 아이디 입니다.');
        } catch (error) {
            return defaultCatch(error);
        }
    }

    /**
     * ID 검증 처리  
     * @param {string} loginId : 사용자 ID
    */
    function idValidate(loginId: string) {
        const idRegExp = /^[a-zA-Z0-9]{4,16}$/i;
        const isInValid = loginId.match(idRegExp) === null;     
        formValidData.value.id.show = isInValid;
        formValidData.value.id.message = isInValid ? '영문, 숫자를 포함하여 5~16자만 가능합니다' : '';
    }

    function passwordValidate(registUserForm: RegistUser) {                
        const passwordValidateState =  validatePassword(registUserForm.password, registUserForm.id, registUserForm.phoneNumber);
        formValidData.value.password.show = true;
        formValidData.value.password.message = passwordValidateState.message;
        formValidData.value.password.validStatus = passwordValidateState.condition;
        // isInValid === true 실패
        // formValidData.value.id.show = isInValid;
        // formValidData.value.id.message = isInValid ? '영문, 숫자를 포함하여 4~16자만 가능합니다' : '';
    }

    function passwordConfirmValidate(registUserForm: RegistUser) {
        formValidData.value.passwordConfirm.show = registUserForm.password !== registUserForm.passwordConfirm;
        formValidData.value.passwordConfirm.message = registUserForm.password === registUserForm.passwordConfirm ? '' : '비밀번호 정보가 일치하지 않습니다. ';
        formValidData.value.passwordConfirm.validStatus = registUserForm.password !== registUserForm.passwordConfirm ? FORM_VALID_CONDITION_CLASS.INVALID : FORM_VALID_CONDITION_CLASS.VALID;
    }
    
    /**
     * 회원가입 처리
     * @param {RegistUser} registUserForm : 회원가입에 사용되는 유저 폼
     */
    async function signUp(registUserForm: RegistUser) {
        try {
            await registRepository.regist(registUserForm);
        } catch(e) {
            throw(e);
        }
    }
    /** //FUNC **/

    /** LIFE CYCLE **/
    onBeforeMount(async() => {
        policies.value = await registRepository.getPolicies();  
    });

    onBeforeUnmount(() => {
        authStore.clearIdentityProfile();
    })


    return {
        limitEndYear,
        baseStartYear,
        policies,
        checkedDuplicateId,
        hasDuplicateId,
        identityProfile,
        formValidData,
        checkIdDuplicate,
        idValidate,
        passwordValidate,
        passwordConfirmValidate,
        signUp
    }
}

export function useRegistCompleteEventCoupon() {
    /** STORE **/
    const registStore = useRegisterStore();
    const { registEventsInfo, registCompleteId } = storeToRefs(registStore)
    /** //STORE **/

    /** VARIABLE **/
    const couponEvent = computed(() => {
        return registEventsInfo.value.find(eventInfo => eventInfo.type === 'coupon')
    })

    const pointEvent = computed(() => {
        return registEventsInfo.value.find(eventInfo => eventInfo.type === 'point')
    })
    /** //VARIABLE **/
    
    function removeEventCoupon() {
        registStore.clearCompleteRegister()
    }

    return {
        registEventsInfo,
        couponEvent,
        pointEvent,
        removeEventCoupon,
        registCompleteId
    }
}