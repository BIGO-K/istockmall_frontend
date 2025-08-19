<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>비밀번호 변경</b></h1>
        </template>

        <template #contents>
            <div id="mm_body" class="mm_page">
                <div class="mm_scroller">
                    <div class="mm_page-inner">
                        <!-- 본문 -->
                        <div class="mm_page-content">
                            <div class="m_popup-sign">
                                <div class="m_popup-sign-title">
                                    <h3><b>정보 보호를 위해 6개월마다<br> <strong class="mm_text-variable">비밀번호를 변경해주세요</strong></b></h3>
                                    <b>‘다음에 변경’ 시 1개월간 안내를 받지않습니다</b>
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
                                />
                                <h5 class="mm_text-label">
                                    <b>새 비밀번호 확인</b>
                                </h5>
                                <MMInput 
                                    v-model="newPasswordConfirm"
                                    :place-holder-text="'비밀번호를 한번 더 입력하세요'"
                                    type="password"
                                    :data-type="'password'"
                                    max-length="16"
                                    :form-valid-info="formValidData.newPasswordConfirm"
                                />
                                <div class="mm_foot">
                                    <div class="mm_btn_box">
                                        <button type="button" class="mm_btn T=primary" @click="change">
                                            <b>비밀번호 변경하기</b>
                                        </button>
                                        <button type="button" class="mm_btn T=line" @click="changeLater">
                                            <b>다음에 변경하기</b>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--// 본문 -->
                    </div>
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect, onMounted } from 'vue';
import MMPopup from '@/components/layout/Popup.vue';
import { FormInputValidState } from '$/@type/front';
import { FORM_VALID_CONDITION_CLASS } from '$/constants';
import { defaultCatch, validatePassword } from '$/functions';
import { mmon } from '$/helper/mmon';
import { userRepository } from '$/repository/auth/userRepository';
import { orderRepository } from '$/repository/order/orderRepository';
import { useRoute, useRouter } from 'vue-router';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useUserState } from '$/composables/auth/userComposable';
import { useTempOrder } from '$/composables/orderComposable';

const route = useRoute();
const router = useRouter();
usePageTitleSetting('비밀번호 변경');
const { tempOrderOptions } = useTempOrder();
        
const currentPassword = ref<string>('');
const newPassword = ref<string>('');
const newPasswordConfirm = ref<string>('');       
const isRedirectToOrder = ref(false);  
// 회원 관련
const { user } = useUserState();

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

const isUpdateActive = computed<boolean>(() => {
    // 유효성 검사에 걸리는 항목이 하나라도 있다면 버튼 비활성화
    for(const validateStateKey in formValidData.value) {
        const validateStatus = formValidData.value[validateStateKey].validStatus
        if (validateStatus !== FORM_VALID_CONDITION_CLASS.VALID 
                && validateStatus !== FORM_VALID_CONDITION_CLASS.NORMAL) {
            return false;
        }
    }
    return true;
});


watchEffect(() => {
    if (currentPassword.value === '') {
        return formValidData.value.newPassword.show = false;
    }
    const validateState = validatePassword(currentPassword.value, '', '', '');
    if (validateState.condition !== 'valid' && validateState.condition !== 'normal') {
        formValidData.value.currentPassword.show = true;
        formValidData.value.currentPassword.message = validateState.message;
        formValidData.value.currentPassword.validStatus = validateState.condition;
    } else {
        formValidData.value.currentPassword.show = false;
        formValidData.value.currentPassword.message = '';
        formValidData.value.currentPassword.validStatus = FORM_VALID_CONDITION_CLASS.VALID;
    }
})
// 새 비밀번호 유효성검사
watchEffect(() => {
    if (newPassword.value === '') {
        return formValidData.value.newPassword.show = false;
    }
    const validateState = validatePassword(newPassword.value, user.value.loginId, '', currentPassword.value);
    formValidData.value.newPassword.show = true;
    formValidData.value.newPassword.message = validateState.message;
    formValidData.value.newPassword.validStatus = validateState.condition;
});

// 새 비밀번호 확인 유효성검사
watchEffect(() => {
    if (newPasswordConfirm.value === '') {
        formValidData.value.newPasswordConfirm.show = false;
        return;
    }
    formValidData.value.newPasswordConfirm.show = true;

    if (newPasswordConfirm.value === newPassword.value) {
        formValidData.value.newPasswordConfirm.message = '비밀번호가 일치합니다.';
        formValidData.value.newPasswordConfirm.validStatus = FORM_VALID_CONDITION_CLASS.VALID;
    } else {
        formValidData.value.newPasswordConfirm.message = '신규비밀번호와 신규비밀번호 확인이 일치하지 않습니다. 다시 확인해주세요.';
        formValidData.value.newPasswordConfirm.validStatus = FORM_VALID_CONDITION_CLASS.INVALID;
    }
});

onMounted(() => {
    isRedirectToOrder.value = route.query.redirect_to_after  === 'order';
})

/**
 * 나중에 변경하기
 */
async function changeLater() {
    mmon.loading.show();
    try {
        userRepository.passwordChange('', '', true);

        if (isRedirectToOrder.value) {
            return startOrder()
        }
        router.replace(`${router.currentRoute.value.query.redirect_to_after || '/'}`);
    } catch (error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}

/**
 * 비밀번호 변경 함수 
 */
async function change() {
    if (currentPassword.value === '') {
        formValidData.value.currentPassword.show = true;
        formValidData.value.currentPassword.message = '비밀번호를 입력해주세요.';
        formValidData.value.currentPassword.validStatus = FORM_VALID_CONDITION_CLASS.INVALID;
        return;
    }            

    if (!isUpdateActive.value) {
        return;
    }

    mmon.loading.show();
    try {
        await userRepository.passwordChange(currentPassword.value, newPassword.value, false);

        if (isRedirectToOrder.value) {
            return startOrder()
        }
        router.replace(`${router.currentRoute.value.query.redirect_to_after || '/'}`);
    } catch (error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}

// 회원 주문 시작
async function startOrder() {
    mmon.loading.show(); 
    try {                
        if (tempOrderOptions.value.length < 1) {
            return mmon.bom.alert('주문정보가 없습니다.\n 메인으로 이동됩니다', () => {
                router.replace({
                    name: 'Main'                        
                })
            });
        }

        const tempOrderId = await orderRepository.tempOrderMake(tempOrderOptions.value)
        router.replace({
            name: 'OrderIndex',
            params: {
                id: tempOrderId,
            },
        })
    } catch(error) {
        defaultCatch(error)
    } finally {
        mmon.loading.hide();
    }
}
</script>