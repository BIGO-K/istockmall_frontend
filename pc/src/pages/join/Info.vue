<template>
    <div class="mm_page-content">
        <div class="m_join">
            <div class="m_join-head">
                <h3 class="mm_title">
                    <b>회원가입</b>
                </h3>
                <!-- 회원가입 스텝 -->
                <div class="m_join-head-step">
                    <!-- (D) 현재 페이지에 해당되는 li 요소에 'T=step-on' 클래스와 '현재 진행 중인 단계' 타이틀을 추가합니다 -->
                    <ol class="mm_flex T=equal">
                        <li><span><small>STEP</small>1</span><strong>본인인증</strong></li>
                        <li
                            class="T=step-on"
                            title="현재 진행 중인 단계"
                        >
                            <span><small>STEP</small>2</span><strong>회원정보 및 약관동의</strong>
                        </li>
                        <li><span><small>STEP</small>3</span><strong>가입완료</strong></li>
                    </ol>
                </div>
                <!--// 회원가입 스텝 -->
            </div>
            <div class="m_join-info">
                <h6 class="mm_text-label">
                    <b>약관동의</b>
                </h6>
                <div class="mm_check_box">
                    <div class="mm_check-list">
                        <ul>
                            <li>
                                <MMCheck 
                                    v-model="registUserForm.isOver14"
                                    :label="'만 14세 이상 확인'"
                                />
                            </li>
                            <li v-for="policy, index in policies" :key="policy.id">
                                <div class="mm_flex">
                                    <MMCheck 
                                        v-if="registUserForm.policies[index]"
                                        v-model="registUserForm.policies[index].isAgree"
                                        :label="policy.label"
                                    />
                                    <a
                                        href="#"
                                        class="btn_detail"
                                        @click.prevent="policyModalOpen(policy)"
                                    ><b>자세히</b></a>                                    
                                </div>
                            </li>
                        </ul>
                    </div>
                    <MMCheck 
                        v-model="isAcceptAllPolicy"
                        :label="'전체 동의'"
                    />
                </div>
                <h6 class="mm_text-label">
                    <b>아이디</b>
                </h6>         
                <div class="mm_form_mix-linked">
                    <MMInput                         
                        v-model="registUserForm.id" 
                        maxlength="20"                        
                        :form-valid-info="formValidData.id"
                        :data-type="'id'"
                        :place-holder-text="'아이디를 입력하세요'"                        
                        @keyup="idValidate(registUserForm.id)"
                    />
                    <button
                        type="button"
                        class="mm_btn T=line T=dark"
                        @click="checkIdDuplicate(registUserForm.id)"
                    >
                        <b>아이디 중복확인</b>
                    </button>
                </div>
                <h6 class="mm_text-label">
                    <b>비밀번호</b>
                </h6>
                <MMInput 
                    v-model="registUserForm.password" 
                    maxlength="16"
                    :form-valid-info="formValidData.password"
                    :place-holder-text="'비밀번호를 입력하세요'"
                    type="password"
                    :data-type="'password'"
                    @input="passwordValidate(registUserForm)"
                    @keyup="passwordValidate(registUserForm)"
                />
                <h6 class="mm_text-label">
                    <b>비밀번호 확인</b>
                </h6>
                <MMInput 
                    v-model="registUserForm.passwordConfirm" 
                    maxlength="16"
                    :place-holder-text="'비밀번호를 한번 더 입력하세요'"
                    :form-valid-info="formValidData.passwordConfirm"                            
                    type="password"
                    :data-type="'password'"
                    @keyup="passwordConfirmValidate(registUserForm)"
                />
                <h6 class="mm_text-label">
                    <b>이름</b>
                </h6>                
                <div class="mm_form-text">
                    <label>
                        <span class="textfield text_readonly">{{ registUserForm.name }}</span>
                        <i class="bg_text" />
                    </label>
                </div>
                <h6 class="mm_text-label">
                    <b>생년월일</b><b class="mm_text-variable">(선택)</b>
                </h6>
                <div class="mm_form_mix-linked">
                    <MMSelect
                        v-model="registUserForm.birthYear"
                        @change="registUserForm.birthDay = 0"
                    >
                        <option value="0">
                            년
                        </option>
                        <option 
                            v-for="year of limitEndYear"
                            :key="year"
                            :value="year + baseStartYear"
                        >
                            {{ `${year + baseStartYear}년` }}
                        </option>
                    </MMSelect>
                    <MMSelect
                        v-model="registUserForm.birthMonth"
                        @change="registUserForm.birthDay = 0"
                    >
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
                    </MMSelect>
                    <MMSelect v-model="registUserForm.birthDay">
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
                    </MMSelect>
                </div>
                <h6 class="mm_text-label">
                    <b>휴대폰 번호</b>
                </h6>
                <div class="mm_form-text">
                    <label>
                        <span class="textfield text_readonly">{{ registUserForm.phoneNumber }}</span>
                        <i class="bg_text" />
                    </label>
                </div>
                <h6 class="mm_text-label">
                    <b>성별</b>
                </h6>
                <div class="mm_radio-list T=chain">
                    <ul>
                        <li>
                            <MMRadio
                                v-model="registUserForm.gender"
                                name="gender"
                                value="F"
                            >
                                <b class="mm_block">
                                    <i class="ico_form-radio" />
                                    <span class="text_label">여자</span>
                                </b>
                            </MMRadio>
                        </li>
                        <li>
                            <MMRadio
                                v-model="registUserForm.gender"
                                name="gender"
                                value="M"
                            >
                                <b class="mm_block">
                                    <i class="ico_form-radio" />
                                    <span class="text_label">남자</span>
                                </b>
                            </MMRadio>
                        </li>
                        <li>
                            <MMRadio
                                v-model="registUserForm.gender"
                                name="gender"
                                value="E"
                            >
                                <b class="mm_block">
                                    <i class="ico_form-radio" />
                                    <span class="text_label">선택안함</span>
                                </b>
                            </MMRadio>
                        </li>
                    </ul>
                </div>
                <h6 class="mm_text-label">
                    <b>마케팅 수신동의</b>
                </h6>
                <div class="mm_check_box">
                    <div class="mm_check-list">
                        <ul>
                            <li>
                                <MMCheck 
                                    v-model="registUserForm.isReceiveMarketingMail"
                                    :label="'이메일'"
                                    is-optional
                                />                                
                            </li>
                            <li>
                                <MMCheck 
                                    v-model="registUserForm.isReceiveMarketingSms"
                                    :label="'SMS'"
                                    is-optional
                                />    
                            </li>
                        </ul>
                        <div class="mm_note">
                            <ul>
                                <li>선택 항목에 동의하지 않아도 서비스 이용이 가능합니다.</li>
                                <li>구매 정보 관련 이메일/SMS 수신 동의 여부와 관계없이 발송됩니다.</li>
                            </ul>
                        </div>
                    </div>
                    <MMCheck 
                        v-model="isReceiveAllMarketing"
                        :label="'전체 동의'"
                    />
                </div>
                <!-- 하단버튼 -->
                <div class="mm_foot">
                    <div class="mm_btn_box">
                        <button
                            type="button"
                            class="mm_btn T=primary"
                            @click="regist"
                        >
                            <b>가입완료</b>
                        </button>
                    </div>
                </div>
                <!--// 하단버튼 -->
            </div>
        </div>
    </div>
</template>


<script lang="ts">
export default defineComponent({
    beforeRouteEnter(to, from, next) {
        const { identityProfile } = useAuthenticationProfile(); 
        if (!identityProfile) {
            mmon.bom.alert('본인 인증이 완료되지 않았습니다.');
            return next("/join");
        }
        return next();
    }    
});
</script>

<script setup lang='ts'>
import { defineComponent, computed, watch } from 'vue';
import { defaultCatch } from '$/functions';
import { useRouter } from 'vue-router';
import { mmon } from '$/helper/mmon';
import { RegistUser } from '$/@type/auth/user';
import moment from 'moment'
import { FORM_VALID_CONDITION_CLASS } from '$/constants';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useSignUp } from '$/composables/auth/registComposable';
import { useForm } from '$/composables/pageHandler/formComposable';
import { useAuthenticationProfile } from '$/composables/auth/userComposable';
import { useToNumber } from '@vueuse/core';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { Policy } from '$/@type/policy';
import { policyRepository } from '$/repository/policyRepository';
import MMCheck from '@/components/input/Check.vue';
import MMSelect from '@/components/input/Select.vue';
import MMRadio from '@/components/input/Radio.vue';
import PolicyDetail from '@/components/modal/policy/Detail.vue'

const router = useRouter();        
usePageTitleSetting('회원정보 및 약관동의', ['회원가입']);

const { 
    limitEndYear,
    baseStartYear,
    identityProfile, 
    policies, 
    formValidData, 
    checkIdDuplicate, 
    checkedDuplicateId,
    hasDuplicateId,
    idValidate,
    passwordValidate,
    passwordConfirmValidate,
    signUp
} = useSignUp();

/**
    * VARIABLE
*/
const identityProfileBirthDay = moment(identityProfile.value?.birthDay);
const { form: registUserForm } = useForm<RegistUser>(
    {
        id : '',
        password: '',
        passwordConfirm: '',
        name: identityProfile.value?.name || '',
        birthYear: identityProfileBirthDay.year() === moment().year() ? 0 : identityProfileBirthDay.year(),
        birthMonth: useToNumber(identityProfileBirthDay.format('M')).value,
        birthDay: useToNumber(identityProfileBirthDay.format('D')).value,
        birthdate: '',
        phoneNumber: identityProfile.value?.phoneNumber || '',
        gender: identityProfile.value?.gender || 'E',
        isOver14 : false,        
        isReceiveMarketingMail: false,
        isReceiveMarketingSms: false,
        identityProfileToken: identityProfile.value?.token || '',
        policies: []
    },
    {
        rules: {
            'policies.*.isAgree(필수약관)': ['required', 'in:true'],
            'id(아이디)': ['required', 'minLength:5', 'maxLength:20', 'isIdDuplicate'], // //  ['required', 'minLength:5', 'maxLength:20', 'isIdDuplicate'],
            'password(비밀번호)': ['required', 'isValidatePass'],
            'passwordConfirm(비밀번호 확인)': ['required', 'isSamePassword:password'],  
            'birthdate(생년월일)': ['isBirthDateExist'],
        },
        messages: {
            'policies.*.isAgree.in': `:param(을/를) 동의해주세요.`,
            'id.isIdDuplicate' : ':param 중복체크를 해주세요.',
            'password.required': ':param(을/를) 입력해주세요.',
            'password.isValidatePass': `:param(을/를) ${formValidData.value.password.message}`,
            'passwordConfirm.required': ':param(을/를) 입력해주세요.',
            'passwordConfirm.isSamePassword': '비밀번호가 일치하지 않습니다.',
            'birthdate.isBirthDateExist': '올바른 :param(을/를) 선택해주세요.'
        },
        extraTester: [
            {
                name: 'isBirthDateExist',
                validateFunction: (): boolean => {                
                // 비어있으면 체크 안함 
                    if (registUserForm.value.birthYear == 0 && registUserForm.value.birthMonth == 0 && registUserForm.value.birthDay == 0) {
                        return true
                    } else if (registUserForm.value.birthYear !== 0 && registUserForm.value.birthMonth !== 0 && registUserForm.value.birthDay !== 0) {
                        return true
                    } else {
                        return false;
                    }                
                }
            },
            {
                name: 'isIdDuplicate',
                validateFunction: (): boolean => {
                    return !hasDuplicateId.value && (checkedDuplicateId.value === registUserForm.value.id);
                }
            },
            {
                name: 'isValidatePass',
                validateFunction: (): boolean => {
                    return formValidData.value.password.validStatus === FORM_VALID_CONDITION_CLASS.NORMAL || formValidData.value.password.validStatus === FORM_VALID_CONDITION_CLASS.VALID;
                }
            },
            {
                name: 'isSamePassword',
                validateFunction: (): boolean => {
                    return registUserForm.value.password === registUserForm.value.passwordConfirm;
                }
            }
        ]
    }
)

const isAcceptAllPolicy = computed({
    get: () => { 
        return registUserForm.value.isOver14  &&
                    registUserForm.value.policies.find((policy) => {
                        return !policy.isAgree 
                    }) === undefined
    },
    set: (flag: boolean) => {
        registUserForm.value.isOver14 = flag;
        registUserForm.value.policies = registUserForm.value.policies.map((policy) => {
            policy.isAgree = flag;
            return policy;
        });                
    }
});
        
const isReceiveAllMarketing = computed({
    get: () => {
        return registUserForm.value.isReceiveMarketingMail && registUserForm.value.isReceiveMarketingSms
    },
    set: (flag: boolean) => {
        registUserForm.value.isReceiveMarketingMail = flag;
        registUserForm.value.isReceiveMarketingSms = flag;
    }
});

const lastDay = computed(() => {
    if (registUserForm.value.birthYear == 0 || registUserForm.value.birthMonth == 0) {
        return 0;
    } 
    const birthYearMonth = `${registUserForm.value.birthYear}-${registUserForm.value.birthMonth}-01`;
    return Number(moment(birthYearMonth, 'YYYY-MM').endOf('month').format('DD'));            
});

/** FUNCTION */

/**
 * 회원 가입 처리 
*/
async function regist() {
    const birthDate = moment(`${registUserForm.value.birthYear}-${registUserForm.value.birthMonth}-${registUserForm.value.birthDay}`, 'YYYY-MM-DD');
    if (birthDate.isValid()) {                
        registUserForm.value.birthdate = birthDate.format('YYYY-MM-DD');
    }
    try {
        await registUserForm.value.validate();
        await signUp(registUserForm.value);        
        router.push({
            name: 'JoinComplete',                    
            replace: true
        });
    } catch(e) {
        defaultCatch(e);
    }
}

function policyModalOpen(policy: Policy) {
    return useModal().open(PolicyDetail, {
        name: 'policyDetail',
        itemClass: 'm_modal-term',
        title: policy.label,        
        props: async () => {
            const { prevPolicies: prev, nowPolicy } = await policyRepository.getNowDisplayAndPrevPolices(policy.code);
            return {
                policyType: policy.code,
                prevPolices: prev,
                now: nowPolicy
            }
        },
    })
}

/** VUE LIFE CYCLE **/
watch(policies, () => {
    if (policies.value.length > 0) {
        registUserForm.value.policies = policies.value.map((policy) => {
            return {
                id: policy.id,
                label: policy.label,
                code: policy.code,
                isAgree: false
            }
        })
    }
})
</script>
