<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>{{ accessToken ? '회원정보 수정' : '비밀번호 재입력' }}</b></h1>
        </template>

        <template #contents>
            <confirm-password v-if="!accessToken" />
            <div v-else class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_inner m_popup-myinfo">
                            <h6 class="mm_text-label">
                                <b>아이디</b>
                            </h6>
                            <div class="mm_form-text">
                                <label>
                                    <span class="textfield text_readonly">{{ memberInfo.loginId }}</span>
                                    <i class="bg_text" />
                                </label>
                            </div>
                            <h6 class="mm_text-label">
                                <b>휴대폰 번호</b>
                            </h6>
                            <div class="mm_form-text">
                                <label>
                                    <span class="textfield text_readonly">{{ memberInfo.phone }}</span>
                                    <i class="bg_text" />
                                </label>
                            </div>
                            <a class="mm_btn T=line T=dark" href="#" target="_blank" title="새 창 열림" @click.prevent="changePhoneNumber">
                                <b>휴대폰 번호 {{ memberInfo.phone ? '변경' : '등록' }}</b>
                            </a>
                            <h6 class="mm_text-label">
                                <b>이름</b>
                            </h6>
                            <div class="mm_form-text">
                                <label>
                                    <span class="textfield text_readonly">{{ memberInfo.name }}</span>
                                    <i class="bg_text" />
                                </label>
                            </div>
                            <a class="mm_btn T=line T=dark" href="#" target="_blank" title="새 창 열림" @click.prevent="changeName"><b>이름 변경</b></a>
                            <template v-if="memberInfo.registType === 'shop'">
                                <h6 class="mm_text-label">
                                    <b>비밀번호</b>
                                </h6>
                                <div class="mm_form-text">
                                    <label>
                                        <span class="textfield text_readonly">• • • • • • • •</span>
                                        <i class="bg_text" />
                                    </label>
                                </div>
                                <a class="mm_btn T=line T=dark" href="#PASSWORD_CHANGE" @click.capture="setPasswordChangeModalMemberInfo(memberInfo)"><b>비밀번호 변경</b></a>
                            </template>
                            <h6 class="mm_text-label">
                                <b>이메일</b>
                            </h6>
                            <MMInput 
                                v-model="memberInfo.email"
                                :place-holder-text="'이메일을 입력하세요'"
                                :data-type="'email'"
                                :max-length="50"
                                use-trim 
                            />
                            <h6 class="mm_text-label">
                                <b>생일</b>
                            </h6>
                            <div v-if="memberInfo.birthday" class="mm_form_mix-linked">
                                <div class="mm_form-select">
                                    <label>
                                        <span class="textfield text_readonly">{{ birthYear }}</span>
                                        <i class="ico_form-select" />
                                    </label>
                                </div>
                                <div class="mm_form-select">
                                    <label>
                                        <span class="textfield text_readonly">{{ birthMonth }}</span>
                                        <i class="ico_form-select" />
                                    </label>
                                </div>
                                <div class="mm_form-select">
                                    <label>
                                        <span class="textfield text_readonly">{{ birthDate }}</span>
                                        <i class="ico_form-select" />
                                    </label>
                                </div>
                            </div>
                            <div v-else class="mm_form_mix-linked">
                                <MMSelect v-model="birthYear" @change="changeBirthDate">
                                    <option value="">
                                        년
                                    </option>
                                    <option v-for="year in (nowYear - 14 - 1899)" :key="year" :value="year + 1899">
                                        {{ `${year + 1899}년` }}
                                    </option>
                                </MMSelect>
                                <MMSelect v-model="birthMonth" @change="changeBirthDate">
                                    <option value="">
                                        월
                                    </option>
                                    <option v-for="month in 12" :key="month" :value="month">
                                        {{ `${month}월` }}
                                    </option>
                                </MMSelect>
                                <MMSelect v-model="birthDate">
                                    <option value="">
                                        일
                                    </option>
                                    <option v-for="date in lastDayOfMonth" :key="date" :value="date">
                                        {{ `${date}일` }}
                                    </option>
                                </MMSelect>
                            </div>
                            <h6 class="mm_text-label">
                                <b>마케팅 수신 동의</b>
                            </h6>
                            <div class="mm_check-list">
                                <ul>
                                    <li>
                                        <MMCheck
                                            v-model="memberInfo.isEmailReceive"
                                            :label="'이메일'"
                                            :is-optional="true" 
                                        />
                                    </li>
                                    <li>
                                        <MMCheck 
                                            v-model="memberInfo.isSmsReceive"
                                            :label="'SMS'"
                                            :is-optional="true" 
                                        />
                                    </li>
                                </ul>
                            </div>
                            <div class="mm_note">
                                <ul>
                                    <li>선택 항목에 동의하지 않아도 서비스 이용이 가능합니다.</li>
                                    <li>구매 정보 관련 이메일/SMS는 수신 동의 여부와 관계없이 발송됩니다.</li>
                                </ul>
                            </div>
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=primary" @click="update">
                                        <b>수정 완료</b>
                                    </button>
                                    <a class="btn_withdraw" href="#" @click.prevent="toWithdrawPage"><b>회원탈퇴</b></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ConfirmPassword from '@/pages/mypage/memberInfo/ConfirmPassword.vue';
import moment from 'moment';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { memberInfoRepository } from '$/repository/member/infoRepository';
import { MemberInfo } from '$/@type/member/info';
import MMSelect from '@/components/input/Select.vue';
import MMCheck from '@/components/input/Check.vue';
import MMPopup from '@/components/layout/Popup.vue';
import { certificateRepository } from '$/repository/auth/certificateRepository';
import { makeValidator } from '$/validator';
import { usePasswordChange } from '$/composables/mypage/myInfoComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useIdentityVerification } from '$/composables/auth/certificateComposable';
import { usePasswordConfirmToken } from '$/composables/auth/confirmComposable';
import { onBeforeRouteLeave } from 'vue-router';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useRefreshUser } from '$/composables/auth/userComposable';

/** // VARIABLE */
usePageTitleSetting('회원정보 수정');        
const nowYear = new Date().getFullYear();
const { accessToken, clearToken } = usePasswordConfirmToken();
const { router } = usePageContext();

// 회원정보
const memberInfo = ref<MemberInfo>({
    loginId: '',
    name: '',
    phone: '',
    email: '',
    birthday: '',
    isEmailReceive: false,
    isSmsReceive: false,
    registType: ''
});

// 생일
const birthYear = ref<number>();
const birthMonth = ref<number>();
const birthDate = ref<number>();

const { setPasswordChangeModalMemberInfo } = usePasswordChange();
        
// 선택한 생월의 마지막 일자
const lastDayOfMonth = computed(() => {
    if (!birthYear.value || !birthMonth.value) {
        return 0;
    }

    return new Date(birthYear.value, birthMonth.value, 0).getDate();
});

/** // VARIABLE */


/** FUNCTION */
// 회원탈퇴 페이지 이동
function toWithdrawPage() {
    mmon.bom.confirm('탈퇴 시 적립금/쿠폰 정보가 모두 삭제됩니다. 탈퇴 하시겠습니까?', (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }

        router.push({ name: 'MypageWithdraw' });
    })
}

function changeBirthDate() {
    if (birthDate.value && birthDate.value > lastDayOfMonth.value) {
        birthDate.value = lastDayOfMonth.value
    }
}

// 수정 처리
async function update() {
    const validator = makeValidator(memberInfo.value)
        .setRules({
            'phone(휴대폰 번호)': ['required'],
            'email(이메일)': ['required', 'validEmail'],
            'birthday(생년월일)': ['date'],
        })
        .setMessages({
            'phone.required': ':param(을/를) 입력해주세요.',
            'email.required': '이메일을 입력해주세요.',
            'email.validEmail': '정상적인 이메일을 입력해주세요.',
            'birthday.date' : '생년월일은 날짜형식으로 설정해주세요.',
        })

    const birthdayValidator = makeValidator({
        birthYear: birthYear.value, 
        birthMonth: birthMonth.value,
        birthDate: birthDate.value,
    })
        .setRules({
            'birthYear(태어난 연도)': ['required'],
            'birthMonth(태어난 달)': ['required'],
            'birthDate(태어난 날짜)': ['required'],
        })
        .setMessages({
            'birthYear.required': ':param(을/를) 입력해주세요.',
            'birthMonth.required': ':param(을/를) 입력해주세요.',
            'birthDate.required': ':param(을/를) 입력해주세요.',
        })

    mmon.loading.show();
    try {                    
        await validator.run();
                    
        if (birthYear.value || birthMonth.value || birthDate.value) {
            await birthdayValidator.run();

            memberInfo.value.birthday = moment()
                .set('year', Number(birthYear.value))
                .set('month', Number(birthMonth.value) - 1)
                .set('date', Number(birthDate.value))
                .format('YYYYMMDD')
        }

        await memberInfoRepository.update(memberInfo.value, accessToken.value);
        useRefreshUser();
        mmon.bom.alert('회원정보가 수정되었습니다.', () => {
            clearToken();           
        });
    } catch (error) {
        defaultCatch(error, {
            401: () => {
                mmon.bom.alert('세션이 만료되었습니다.', () => {
                    clearToken();
                });
            }
        })
    } finally {
        mmon.loading.hide();
    }
}
// 본인인증 통해 이름 변경
async function changeName() {
    try {
        mmon.loading.show()
        const { identityProfile: profile } = await useIdentityVerification();
        memberInfo.value.name = profile.name;
        mmon.bom.alert('유효한 이름입니다. 수정 완료 버튼을 클릭하면 수정사항이 적용됩니다.')
    } catch (e) {
        mmon.bom.alert('본인 인증이 완료 되지 않았습니다.');
    } finally {
        mmon.loading.hide();
    }
}
// 본인인증 통해 핸드폰 변경
async function changePhoneNumber() {
    try {
        mmon.loading.show()
        const { identityProfile: profile } = await useIdentityVerification();
        const identityProfile = await certificateRepository.getIdentityProfile(profile.token);
        memberInfo.value.phone = identityProfile.phoneNumber;
        mmon.bom.alert('유효한 휴대폰 번호입니다. 수정 완료 버튼을 클릭하면 수정사항이 적용됩니다.')
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
                
}
/** // FUNCTION */

/** VUE LIFE CYCLE */
watch(accessToken, async(to) => {
    if (to) {
        mmon.loading.show();
        try {
            memberInfo.value = await memberInfoRepository.getUserInfo(accessToken.value);
                
            // 생일정보 존재한다면 생월, 생일(일자) 분리
            if (!memberInfo.value.birthday) {
                return;
            }

            const momentedBirthday = moment(memberInfo.value.birthday);
            if (momentedBirthday.isValid()) {
                birthYear.value = momentedBirthday.year();
                birthMonth.value = momentedBirthday.month() + 1;
                birthDate.value = momentedBirthday.date();
            }
        } catch (e) {
            defaultCatch(e, {
                403: () => {
                    mmon.bom.alert('세션이 만료되었습니다.');
                    clearToken();
                },
                401: () => {
                    mmon.bom.alert('세션이 만료되었습니다.');
                    clearToken();
                }
            })
        } finally {
            mmon.loading.hide();
        }
    }
}, {
    immediate: true
})

onBeforeRouteLeave((to, from, next) => {
    if (to.name !== 'MypageWithdraw') {
        clearToken();
    }
    return next();
});

/** VUE LIFE CYCLE */
</script>