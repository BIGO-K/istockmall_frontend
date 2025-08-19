<template>
    <div class="mm_page-content">
        <div v-if="joinProcessType === 'policy'" class="m_popup-join">
            <h3 class="m_popup-join-title">
                <b>STEP 2</b><strong>약관동의</strong><i class="image_line T=step2" />
            </h3>
            <div class="mm_check_box">
                <div class="mm_check-list">
                    <ul>
                        <li>
                            <MmCheck 
                                v-model="registUser.isOver14"
                                :label="'만 14세 이상 확인'"
                            />
                        </li>
                        <li
                            v-for="policy, index in policies"
                            :key="policy.id"
                        >
                            <div class="mm_flex">
                                <MmCheck 
                                    v-model="registUser.policies[index].isAgree"
                                    :label="policy.label"
                                />                                
                                <a href="#POLICY_DETAIL" class="btn_detail" @click="setContents(policy.content, policy.label, policy.code)"><b>자세히</b></a>                                    
                            </div>
                        </li>
                    </ul>
                </div>
                <MmCheck 
                    v-model="isAcceptAllPolicy"
                    :label="'전체 동의'"
                />
            </div>
            <div class="mm_foot">
                <div class="mm_btn_box">
                    <!-- <a class="mm_btn T=primary" href="#" @click.prevent="joinProcessType = 'Info'"><b>다음으로</b></a> -->
                    <button class="mm_btn T=primary" @click="policyComplete">
                        <b>다음으로</b>
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="m_popup-join">
            <h3 class="m_popup-join-title">
                <b>STEP 3</b><strong>정보입력</strong><i class="image_line T=step3" />
            </h3>
            <!-- (D) '.mm_process' 영역은 단계별 입력 페이지로 현재 순서에 해당하는 '.mm_process-item' 영역에 'S=process-on' 클래스가 추가됩니다. -->
            <div class="mm_process">
                <!-- 개인정보 설정 -->
                <div :class="['mm_process-item', {'S=process-on' : joinProcessName === PROCESS_NAME.INFO } ]">
                    <h5 class="mm_text-label">
                        <b>이름</b>
                    </h5>
                    <div class="mm_form-text">
                        <label>
                            <span class="textfield text_readonly">{{ registUser.name }}</span>
                            <i class="bg_text" />
                        </label>
                    </div>
                    <h5 class="mm_text-label">
                        <b>생년월일</b><strong class="mm_text-variable">(선택)</strong>
                    </h5>
                    <div class="mm_form_mix-linked">
                        <MmSelect v-model="registUser.birthYear" @change="registUser.birthDay = 0">
                            <option value="0">
                                년
                            </option>
                            <option 
                                v-for="year of limitEndYear"
                                :key="year"
                                :value="year + 1899"
                            >
                                {{ `${year + 1899}년` }}
                            </option>
                        </MmSelect>
                        <MmSelect v-model="registUser.birthMonth" @change="registUser.birthDay = 0">
                            <option value="0">
                                월
                            </option>
                            <option 
                                v-for="month in 12" 
                                :key="month"
                                :value="month"
                            >
                                {{ `${month}월` }}
                            </option>
                        </MmSelect>
                        <MmSelect v-model="registUser.birthDay">
                            <option value="0">
                                일
                            </option>
                            <option 
                                v-for="day in lastDay" 
                                :key="day"
                                :value="day"
                            >
                                {{ `${day}일` }}
                            </option>
                        </MmSelect>
                    </div>
                    <h5 class="mm_text-label">
                        <b>휴대폰 번호</b>
                    </h5>
                    <div class="mm_form-text">
                        <label>
                            <span class="textfield text_readonly">{{ registUser.phoneNumber }}</span>
                            <i class="bg_text" />
                        </label>
                    </div>
                    <h5 class="mm_text-label">
                        <b>성별</b>
                    </h5>
                    <div class="mm_radio-list T=chain">
                        <ul>
                            <li>
                                <MmRadio v-model="registUser.gender" name="gender" value="F">
                                    <b class="mm_block">
                                        <i class="ico_form-radio" />
                                        <span class="text_label">여자</span>
                                    </b>
                                </MmRadio>
                            </li>
                            <li>
                                <MmRadio v-model="registUser.gender" name="gender" value="M">
                                    <b class="mm_block">
                                        <i class="ico_form-radio" />
                                        <span class="text_label">남자</span>
                                    </b>
                                </MmRadio>
                            </li>
                            <li>
                                <MmRadio v-model="registUser.gender" name="gender" value="E">
                                    <b class="mm_block">
                                        <i class="ico_form-radio" />
                                        <span class="text_label">선택안함</span>
                                    </b>
                                </MmRadio>
                            </li>
                        </ul>
                    </div>
                    <div class="mm_foot">
                        <div class="mm_btn_box">
                            <div class="mm_flex T=auto">
                                <button type="button" class="mm_btn T=line T=light btn_back" @click="joinProcessType = 'policy'">
                                    <i class="ico_page-prev" /><b>이전으로</b>
                                </button>
                                <button type="button" class="mm_btn T=primary" @click="validateBaseInfo()">
                                    <b>다음으로</b>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!--// 개인정보 설정 -->
                <!-- 아이디 설정 -->
                <div :class="['mm_process-item', { 'S=process-on' : joinProcessName === PROCESS_NAME.ID } ]">
                    <h5 class="mm_text-label">
                        <b>아이디</b>
                    </h5>
                    <MMInput                         
                        v-model="registUser.id" 
                        maxlength="20"
                        :form-valid-info="formValidData.id"
                        :auto-fill-off="true"
                        :data-type="'id'"
                        :place-holder-text="'아이디를 입력하세요'"
                        @focusout="idValidate"                        
                        @keydown="formValidData.id.show = false"
                    />
                    <button type="button" class="mm_btn T=line T=dark" @click="duplicateIdCheck()">
                        <b>아이디 중복확인</b>
                    </button>
                    <div class="mm_foot">
                        <div class="mm_btn_box">
                            <div class="mm_flex T=auto">
                                <button type="button" class="mm_btn T=line T=light btn_back" @click="joinProcessNameHandle(PROCESS_NAME.INFO)">
                                    <i class="ico_page-prev" /><b>이전으로</b>
                                </button>
                                <button type="button" class="mm_btn T=primary" @click="validateId()">
                                    <b>다음으로</b>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!--// 아이디 설정 -->

                <!-- 비밀번호 설정 -->
                <div v-if="joinProcessName === PROCESS_NAME.PASSWORD" :class="['mm_process-item', {'S=process-on' : joinProcessName === PROCESS_NAME.PASSWORD } ]">
                    <h5 class="mm_text-label">
                        <b>비밀번호</b>
                    </h5>
                    <MMInput
                        v-model="registUser.password" 
                        maxlength="16"
                        :auto-fill-off="true"
                        :form-valid-info="formValidData.password"
                        :place-holder-text="'비밀번호를 입력하세요'"
                        type="password"
                        :data-type="'password'"
                        @keyup="passwordValidate"
                        @focusout="passwordValidate"
                    />                    
                    <h5 class="mm_text-label">
                        <b>비밀번호 확인</b>
                    </h5>
                    <MMInput 
                        v-model="passwordConfirm" 
                        maxlength="16"
                        :auto-fill-off="true"
                        :form-valid-info="formValidData.passwordConfirm"
                        :place-holder-text="'비밀번호를 한번 더 입력하세요'"
                        type="password"
                        :data-type="'password'"
                        @keyup="passwordValidate"                            
                        @focusout="passwordValidate"
                    />
                    <div class="mm_foot">
                        <div class="mm_btn_box">
                            <div class="mm_flex T=auto">
                                <button type="button" class="mm_btn T=line T=light btn_back" @click="joinProcessNameHandle(PROCESS_NAME.ID)">
                                    <i class="ico_page-prev" /><b>이전으로</b>
                                </button>
                                <button type="button" class="mm_btn T=primary" @click="validatePasswordProcess()">
                                    <b>다음으로</b>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!--// 비밀번호 설정 -->

                <!-- 마케팅 수신동의 -->
                <div :class="['mm_process-item', {'S=process-on' : joinProcessName === PROCESS_NAME.MARKETING } ]">
                    <div class="mm_check_box">
                        <div class="mm_check-list">
                            <ul>
                                <li>
                                    <MmCheck 
                                        v-model="registUser.isReceiveMarketingMail"
                                        :label="'이메일'"
                                        is-optional
                                    />       
                                </li>
                                <li>
                                    <MmCheck 
                                        v-model="registUser.isReceiveMarketingSms"
                                        :label="'SMS'"
                                        is-optional
                                    /> 
                                </li>
                            </ul>
                        </div>
                        <MmCheck 
                            v-model="isReceiveAllMarketing"
                            :label="'전체 동의'"
                        />
                    </div>
                    <div class="mm_foot">
                        <div class="mm_btn_box">
                            <div class="mm_flex T=auto">
                                <button type="button" class="mm_btn T=line T=light btn_back" @click="joinProcessNameHandle(PROCESS_NAME.PASSWORD)">
                                    <i class="ico_page-prev" /><b>이전으로</b>
                                </button>
                                <a class="mm_btn T=primary" href="#" @click.prevent="registProcessStart()"><b>다음으로</b></a>
                            </div>
                        </div>
                    </div>
                    <div class="mm_note">
                        <ul>
                            <li>선택 항목에 동의하지 않아도 서비스 이용이 가능합니다.</li>
                            <li>구매 정보 관련 이메일/SMS는 수신 동의 여부와 관계없이 발송됩니다.</li>
                        </ul>
                    </div>
                </div>
                <!--// 마케팅 수신동의 -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { mmon } from '$/helper/mmon';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { registRepository } from '$/repository/auth/registRepository';
import { useRouter } from 'vue-router';
import { usePolicyModal } from '$/composables/policyComposable';
import { Policy } from '$/@type/policy';
import moment from 'moment'
import { typeCastNumber } from '$/filters';
import { FORM_VALID_CONDITION_CLASS } from '$/constants';
import { FormInputValidState } from '$/@type/front';
import { useAuthenticationProfile } from '$/composables/auth/userComposable';

export default defineComponent({  
    beforeRouteEnter(to, from, next) {
        const { identityProfile } = useAuthenticationProfile(); 
        if (!identityProfile.value) {
            mmon.bom.alert('본인 인증이 완료되지 않았습니다.');
            return next("/join");
        }
        return next();
    },
});
</script>
<script lang="ts" setup>
import { RegistUser } from '$/@type/auth/user';
import MmSelect from '@/components/input/Select.vue';
import MmCheck from '@/components/input/Check.vue';
import MmRadio from '@/components/input/Radio.vue';
import { makeValidator } from '$/validator';
import { defaultCatch, validatePassword } from '$/functions';
    
const joinProcessType = ref('policy');
const PROCESS_NAME = {
    INFO : 'info',
    ID : 'loginId',
    PASSWORD : 'password',
    MARKETING : 'marketing'
}
const joinProcessName = ref('info');
const { identityProfile } = useAuthenticationProfile(); 

const now = moment();
const identityProfileBirthDay = moment(identityProfile.value?.birthDay);
const limitEndYear = moment().year() - 14 - 1899;
const policies = ref<Policy[]>([]);
	
const registUser = ref<RegistUser>({
    isOver14 : false,
    isReceiveMarketingMail: false,
    isReceiveMarketingSms: false,
    id : '',
    name: identityProfile.value?.name || '',
    password: '',            
    passwordConfirm: '',
    birthYear: identityProfileBirthDay.year() === now.year() ? 0 : identityProfileBirthDay.year(),
    birthMonth: typeCastNumber(identityProfileBirthDay.format('M')),
    birthDay: typeCastNumber(identityProfileBirthDay.format('D')),
    phoneNumber: identityProfile.value?.phoneNumber || '', 
    gender: identityProfile.value?.gender || 'E',            
    birthdate: '',
    identityProfileToken: identityProfile.value?.token || '',
    policies: []
});
const lastDay = computed(() => {
    if (registUser.value.birthYear == 0 || registUser.value.birthMonth == 0) {
        return 0;
    } 
    const birthYearMonth = `${registUser.value.birthYear}-${registUser.value.birthMonth}-01`;
    return Number(moment(birthYearMonth, 'YYYY-MM').endOf('month').format('DD'));                               
});

const passwordConfirm = ref('');

const isReceiveAllMarketing = computed({
    get: () => {
        return registUser.value.isReceiveMarketingMail && registUser.value.isReceiveMarketingSms
    },
    set: (flag: boolean) => {
        registUser.value.isReceiveMarketingMail = flag;
        registUser.value.isReceiveMarketingSms = flag;
    }
});

const isAcceptAllPolicy = computed({
    get: () => { 
        return registUser.value.isOver14  &&
				registUser.value.policies.find((policy) => {
				    return !policy.isAgree 
				}) === undefined
    },
    set: (flag: boolean) => {
        registUser.value.isOver14 = flag;
        registUser.value.policies = registUser.value.policies.map((policy) => {
            policy.isAgree = flag;
            return policy;
        })
    }
});

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
	    },
	});

    
function idValidate() {
    const idRegExp = /^[a-zA-Z0-9]{5,20}$/i;
    const isInvalid = registUser.value.id.match(idRegExp) === null;     
    // isInValid === true 실패
    formValidData.value.id.show = isInvalid;
    formValidData.value.id.message = isInvalid ? '영문, 숫자를 포함하여 5~20자만 가능합니다' : '';
}	

function passwordValidate() {
    // 비밀번호 입력 체크
    const passwordValidateState =  validatePassword(registUser.value.password, registUser.value.id, registUser.value.phoneNumber);
    formValidData.value.password.show = true;
    formValidData.value.password.message = passwordValidateState.message;
    formValidData.value.password.validStatus = passwordValidateState.condition;

    // 비밀번호 확인 입력 체크
    const passwordIsSame = registUser.value.password === passwordConfirm.value;		
    formValidData.value.passwordConfirm.show = !passwordIsSame && passwordConfirm.value !== '';
    formValidData.value.passwordConfirm.message = '비밀번호 정보가 일치하지 않습니다.'
    formValidData.value.passwordConfirm.validStatus = !passwordIsSame ? 'invalid' : 'valid';
}

const { setContents } = usePolicyModal();
    
const baseInfoValidator = makeValidator({
    name: registUser.value.name,
    phoneNumber: registUser.value.phoneNumber,
    gender: registUser.value.gender,       
    birthYear: registUser.value.birthYear,   
    birthMonth: registUser.value.birthMonth,
    birthdate: registUser.value.birthdate
}); 

async function validateBaseInfo() {
    const birthDate = moment(`${registUser.value.birthYear}-${registUser.value.birthMonth}-${registUser.value.birthDay}`, 'YYYY-MM-DD');
    if (birthDate.isValid()) {                
        registUser.value.birthdate = birthDate.format('YYYY-MM-DD');
    }
    const validator = makeValidator({
        name: registUser.value.name,
        phoneNumber: registUser.value.phoneNumber,
        gender: registUser.value.gender,       
        birthYear: registUser.value.birthYear,   
        birthMonth: registUser.value.birthMonth,
        birthdate: registUser.value.birthdate
    });
        
    validator.setRules({
        'name(이름)' : ['required'],
        'birthdate(생년월일)': ['isBirthDateExist'],
        'phoneNumber(휴대폰 번호)' : ['required'],
        'gender(성별)' : ['required', 'in:F,M,E']
    })

    validator.setMessages({            
        'birthdate.isBirthDateExist': '올바른 생년월일을 선택해주세요.'
    })
    validator.registTester('isBirthDateExist', () => {                
        // 비어있으면 체크 안함 
        if (registUser.value.birthYear == 0 && registUser.value.birthMonth == 0 && registUser.value.birthDay == 0) {
            return true
        } else if (registUser.value.birthYear != 0 && registUser.value.birthMonth != 0 && registUser.value.birthDay != 0) {
            return true
        } else {
            return false;
        }                
    })
        
    try {
        await validator.run();
        joinProcessName.value = PROCESS_NAME.ID;
    } catch(e) {
        defaultCatch(e);
    }
}

const isIdDuplicated = ref(false);
const checkedDuplicateId = ref('');


async function duplicateIdCheck() {
    const userIdLength = registUser.value.id.length;
    if (userIdLength < 1) {
        return mmon.bom.alert('아이디를 입력해주세요.');
    }
    if (userIdLength < 5 || userIdLength > 20) {
        return mmon.bom.alert('사용할 수 없는 아이디입니다.');
    }
        
    try
    {
        const isExist = await registRepository.idDuplicateCheck(registUser.value.id);
        isIdDuplicated.value = isExist;
        if (!isExist) {
            checkedDuplicateId.value = registUser.value.id;
        } else {
            formValidData.value.id.show = true;
            formValidData.value.id.message = '이미 사용 중인 아이디입니다';
        }
            
        return mmon.bom.alert(isExist ? '이미 사용 중인 아이디입니다' : '사용 가능한 아이디 입니다.');
    } catch (error) {
        return defaultCatch(error);
    }
}

function validateId() {
    const userIdLength = registUser.value.id.length;
    if (userIdLength < 1) {
        return mmon.bom.alert('아이디를 입력해주세요.');
    }

    if (userIdLength < 5 || userIdLength > 20) {
        return mmon.bom.alert('사용할 수 없는 아이디입니다.');
    }

    if(isIdDuplicated.value || checkedDuplicateId.value !== registUser.value.id) {
        return mmon.bom.alert('아이디 중복확인을 해주세요');
    }
    joinProcessName.value = PROCESS_NAME.PASSWORD;
}

function validatePasswordProcess() {
    if (registUser.value.password === '') {
        return mmon.bom.alert('비밀번호를 입력해주세요');
    }        

    if (passwordConfirm.value === '') {
        formValidData.value.passwordConfirm.show = true;
        formValidData.value.passwordConfirm.message = '비밀번호 정보가 일치하지 않습니다.'
        formValidData.value.passwordConfirm.validStatus = 'invalid';
        return mmon.bom.alert('비밀번호 확인을 입력해주세요.');
    }
    
    if ((formValidData.value.password.validStatus !== FORM_VALID_CONDITION_CLASS.NORMAL 
    && formValidData.value.password.validStatus !== FORM_VALID_CONDITION_CLASS.VALID)
    || formValidData.value.passwordConfirm.validStatus === 'invalid') {
        return;
    }

    joinProcessName.value = PROCESS_NAME.MARKETING;
}

const router = useRouter();

async function registProcessStart() {
    mmon.loading.show();
    try {            
        const birthdate = moment(`${registUser.value.birthYear}-${registUser.value.birthMonth}-${registUser.value.birthDay}`, 'YYYY-MM-DD');
        if (birthdate.isValid()) {                
            registUser.value.birthdate = birthdate.format('YYYY-MM-DD');
        }
        const validator = makeValidator({
            policy: isAcceptAllPolicy.value,
            id: registUser.value.id,
            password: registUser.value.password,
            passwordConfirm: passwordConfirm.value,
            name: registUser.value.name,
            phoneNumber: registUser.value.phoneNumber,
            gender: registUser.value.gender,       
            birthYear: registUser.value.birthYear,   
            birthMonth: registUser.value.birthMonth,
            birthdate: registUser.value.birthdate
        });     
            
        validator.setRules({                
            'policy(필수 약관)': ['required', 'in:true'],
            'id(아이디)': ['required', 'minLength:5', 'maxLength:20', 'isIdDuplicate'],
            'password(비밀번호)': ['required', 'isValidatePass'],                              
            'passwordConfirm(비밀번호 확인)': ['required', 'isSamePassword:password'],               
            'birthdate(생년월일)': ['isBirthDateExist'],
        });

        validator.setMessages({                
            'policy.in': ':param에 동의해주세요',
            'id.isIdDuplicate' : ':param 중복체크를 해주세요.',
            'password.required': ':param(을/를) 입력해주세요.',
            'password.isValidatePass': `:param(을/를) ${formValidData.value.password.message}`,
            'passwordConfirm.required': ':param(을/를) 입력해주세요.',
            'passwordConfirm.isSamePassword': '비밀번호 정보가 일치하지 않습니다.',
            'birthdate.isBirthDateExist': '올바른 생년월일을 선택해주세요.'
        })

        validator.registTester('isBirthDateExist', () => {                
            // 비어있으면 체크 안함 
            if (registUser.value.birthYear == 0 && registUser.value.birthMonth == 0 && registUser.value.birthDay == 0) {
                return true
            } else if (registUser.value.birthYear !== 0 && registUser.value.birthMonth !== 0 && registUser.value.birthDay !== 0) {
                return true
            } else {
                return false;
            }                
        })

        validator.registTester('isSamePassword', ()=> {
            return registUser.value.password === passwordConfirm.value;
        })

        validator.registTester('isValidatePass', ()=> {
            return formValidData.value.password.validStatus === FORM_VALID_CONDITION_CLASS.NORMAL || formValidData.value.password.validStatus === FORM_VALID_CONDITION_CLASS.VALID;
        })

        validator.registTester('isIdDuplicate', () => {
            return !isIdDuplicated.value && checkedDuplicateId.value === registUser.value.id;
        })

        try {
            await validator.run();
            // 회원가입 처리
            await registRepository.regist(registUser.value);
            router.push({
                name: 'JoinComplete',                    
                replace: true
            });
        } catch (error) {
            throw (error);
        }             
    } catch (error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}    

onMounted(async() => {
    policies.value = await registRepository.getPolicies();
    registUser.value.policies = policies.value.map((policy) => {
        return {
            id: policy.id,
            code: policy.code,
            isAgree: false
        } 
    })
        
})

function policyComplete() {
    if (isAcceptAllPolicy.value === false) {
        return mmon.bom.alert('필수 약관에 동의해주세요.');
    }
    joinProcessType.value = 'info';
}

function joinProcessNameHandle(processName: string) {    
    formValidData.value.password.show = false;
    formValidData.value.password.message = '';
    joinProcessName.value = processName;
}

</script>