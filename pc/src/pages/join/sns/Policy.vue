<template>
    <div class="mm_page-content">
        <div class="m_sign m_join-sns">
            <div class="m_sign-title">
                <h3 class="mm_title">
                    <b>추가 정보 입력</b>
                </h3>
                <p>회원가입 완료까지 한단계 남았어요!<small>다음부터는 {{ socialPlatformLabel }}으로 빠르게 로그인할 수 있어요</small></p>
            </div>

            <h6 class="mm_text-label">
                <b>이름</b>
            </h6>
            <template v-if="needUserName">
                <MMInput                         
                    v-model="socialUser.name" 
                    maxlength="30"
                    :place-holder-text="'이름을 입력하세요'"
                />
            </template>
            <template v-else>
                <div class="mm_form-text">
                    <label>
                        <span class="textfield text_readonly">{{ socialUser.name }}</span>
                        <i class="bg_text" />
                    </label>
                </div>
            </template>

            <h6 class="mm_text-label">
                <b>생년월일</b><b class="mm_text-variable">(선택)</b>
            </h6>
            <div class="mm_form_mix-linked">
                <MMSelect
                    v-model="socialUser.birthYear"
                    @change="socialUser.birthDay = 0"
                >
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
                </MMSelect>
                <MMSelect
                    v-model="socialUser.birthMonth"
                    @change="socialUser.birthDay = 0"
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
                <MMSelect v-model="socialUser.birthDay">
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
                <b>성별</b>
            </h6>
            <div class="mm_radio-list T=chain">
                <ul>
                    <li>
                        <MMRadio
                            v-model="socialUser.gender"
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
                            v-model="socialUser.gender"
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
                            v-model="socialUser.gender"
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
                <b>약관동의</b>
            </h6>
            <div class="mm_check_box">
                <div class="mm_check-list">
                    <ul>
                        <li>
                            <MMCheck 
                                v-model="socialUser.isOver14"
                                :label="'만 14세 이상 확인'"
                            />
                        </li>
                        <li v-for="policy, index in policies" :key="policy.code">
                            <div class="mm_flex">
                                <MMCheck            
                                    v-model="socialUser.policies[index].isAgree"
                                    :label="policy.label"
                                />
                                <a
                                    href="#"
                                    class="btn_detail"
                                    @click.prevent="policyModalOpen(policy)"                                    
                                >
                                    <b>자세히</b>
                                </a>
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
                <b>마케팅 수신동의</b>
            </h6>
            <div class="mm_check_box">
                <div class="mm_check-list">
                    <ul>
                        <li>
                            <MMCheck 
                                v-model="socialUser.isReceiveMarketingMail"
                                :label="'이메일'"
                                is-optional
                            />                                
                        </li>
                        <li>
                            <MMCheck 
                                v-model="socialUser.isReceiveMarketingSms"
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
                        @click="registSocial"
                    >
                        <b>가입완료</b>
                    </button>
                </div>
            </div>
            <!--// 하단버튼 -->
        </div>       
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import MMCheck from '@/components/input/Check.vue';
import { makeValidator } from '$/validator';
import { defaultCatch } from '$/functions';
import { registRepository } from '$/repository/auth/registRepository';
import { SocialRegistUser } from '$/@type/auth/user';
import { Policy } from '$/@type/policy';
import { useRouter } from 'vue-router';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useAuthenticationProfile } from '$/composables/auth/userComposable';
import moment from 'moment'
import MMSelect from '@/components/input/Select.vue';
import MMRadio from '@/components/input/Radio.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { policyRepository } from '$/repository/policyRepository';
import PolicyDetail from '@/components/modal/policy/Detail.vue';

usePageTitleSetting('추가 정보 입력', ['간편로그인 가입']);
        
const policies = ref<Policy[]>([]);
const { thirdPartyProfile } = useAuthenticationProfile();
const needUserName = thirdPartyProfile.value.name === '';
const limitEndYear = moment().year() - 14 - 1899;

const router = useRouter();
const socialUser = ref<SocialRegistUser>({
    platform: thirdPartyProfile.value.platform,
    token: thirdPartyProfile.value.accessToken,
    name: thirdPartyProfile.value.name,
    email: thirdPartyProfile.value.email,      
    phoneNumber: thirdPartyProfile.value.phoneNumber,                       
    birthYear: 0,
    birthMonth: 0,
    birthDay: 0,            
    gender: thirdPartyProfile.value.gender,
    isReceiveMarketingMail: false,
    isReceiveMarketingSms: false,
    isOver14: false,
    policies: []
});

const lastDay = computed(() => {
    if (socialUser.value.birthMonth == 0 || socialUser.value.birthYear == 0) {
        return 0;
    }   
    const birthYearMonth = `${socialUser.value.birthYear}-${socialUser.value.birthMonth}-01`;
    return Number(moment(birthYearMonth, 'YYYY-MM').endOf('month').format('DD'));                               
});

const isAcceptAllPolicy = computed({
    get: () => { 
        return socialUser.value.isOver14 
            && socialUser.value.policies.find((policy) => {
                return !policy.isAgree 
            }) === undefined
    },
    set: (flag: boolean) => {
        socialUser.value.isOver14 = flag;
        socialUser.value.policies = socialUser.value.policies.map((policy) => {
            policy.isAgree = flag;
            return policy;
        });
    }
});

const isReceiveAllMarketing = computed({
    get: () => {
        return socialUser.value.isReceiveMarketingMail && socialUser.value.isReceiveMarketingSms
    },
    set: (flag: boolean) => {
        socialUser.value.isReceiveMarketingMail = flag;
        socialUser.value.isReceiveMarketingSms = flag;
    }
})        

const socialPlatformLabel = computed(() => {
    switch (thirdPartyProfile.value.platform) {
    case 'naver':
        return '네이버';
    case 'kakao':
        return '카카오톡';
    case 'apple':
        return '애플';
    }
    
    return '';
})

async function registSocial() {
    const birthDate = moment(`${socialUser.value.birthYear}-${socialUser.value.birthMonth}-${socialUser.value.birthDay}`, 'YYYY-MM-DD');
    if (birthDate.isValid()) {                
        socialUser.value.birthdate = birthDate.format('YYYY-MM-DD');
    }

    const validator = makeValidator({
        policy: isAcceptAllPolicy.value,                
        name: socialUser.value.name,
        phoneNumber: socialUser.value.phoneNumber,
        gender: socialUser.value.gender,       
        birthYear: socialUser.value.birthYear,   
        birthMonth: socialUser.value.birthMonth,
        birthdate: socialUser.value.birthdate
    });            

    validator.setRules({                
        'policy(필수 약관)': ['required', 'in:true'],
        'name(이름)': ['required', 'emojiCheck'],                
        'birthDate(생년월일)': ['isBirthDateExist'],
    });

    validator.setMessages({                
        'policy.in': ':param에 동의해주세요',  
        'name.required': ':param(을/를) 입력 해주세요',
        'name.emojiCheck': ':param에 사용 불가능한 문자가 포함되어 있습니다.',              
        'birthDate.isBirthDateExist': '올바른 생년월일을 선택해주세요.'
    })

    validator.registTester('isBirthDateExist', () => {                
        // 비어있으면 체크 안함 
        if (socialUser.value.birthYear == 0 && socialUser.value.birthMonth == 0 && socialUser.value.birthDay == 0) {
            return true
        } else if (socialUser.value.birthYear !== 0 && socialUser.value.birthMonth !== 0 && socialUser.value.birthDay !== 0) {
            return true
        } else {
            return false;
        }                
    })

    validator.registTester('emojiCheck', () => {
        const regex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;

        // 비어있으면 체크 안 함
        if (socialUser.value.name === '') {
            return true;
        }
        
        // 이모지가 포함되어 있을 때
        if (regex.test(socialUser.value.name)) {
            return false;
        } else {
            return true;
        }
    });

    try {
        await validator.run();
        // 회원가입 처리
        await registRepository.socialUserRegist(socialUser.value)
        router.push({
            name: 'JoinComplete',                    
            replace: true
        });

    } catch (error) {
        return defaultCatch(error);
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

onMounted(async() => {        
    policies.value = await registRepository.getPolicies();
    socialUser.value.policies = policies.value.map((policy) => {
        return {
            id: policy.id,
            code: policy.code,
            isAgree: false
        }
    })        
})
</script>
