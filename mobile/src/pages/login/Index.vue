<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>로그인</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-sign m_popup-login">
                            <!-- (D) 성인인증이 필요한 로그인의 경우에만 .text_adult를 노출합니다. -->
                            <strong
                                v-if="isNeedAdultCertification"
                                class="text_adult"
                            >
                                <i class="ico_adult T=lg" />
                                <b>
                                    본 상품은 19세 미만의 청소년이<br>
                                    이용할 수 없습니다
                                </b>
                            </strong>
                            <h5 class="mm_text-label">
                                <b>아이디</b>
                            </h5>
                            <MMInput
                                v-model="loginForm.loginId"
                                :form-class="'mm_form-text T=lg'"
                                :place-holder-text="'아이디를 입력하세요'"
                                maxlength="20"
                                type="text"
                                @keydown.enter.prevent="login"
                            />
                            <h5 class="mm_text-label">
                                <b>비밀번호</b>
                            </h5>
                            <MMInput
                                v-model="loginForm.password"
                                :form-class="'mm_form-text T=lg'"
                                :place-holder-text="'비밀번호를 입력하세요'"
                                maxlength="16"
                                :auto-fill-off="true"
                                type="password"
                                @keydown.enter.prevent="login"
                            />
                            <!-- 보안문자입력 -->
                            <!-- (D) 로그인 5회 실패 시 .m_popup-login-security 영역을 노출합니다. -->
                            <div v-if="needAdditionalCertificate" class="m_popup-login-security">
                                <p class="mm_text-negative">
                                    로그인을 5회 실패하셨습니다<br>보안 문자를 입력하여 로그인하세요
                                </p>
                                <div class="m...security-info">
                                    <i class="image_security">
                                        <img :src="captchaImage" alt="보안문자">
                                    </i>
                                    <button
                                        type="button" 
                                        class="mm_btn T=xs T=line T=light btn_refresh" 
                                        @click="refreshCaptchaImage"
                                    >
                                        <i class="ico_reload" /><b>새로고침</b>
                                    </button>
                                    <MMInput 
                                        v-model="loginForm.captchaCode" 
                                        :place-holder-text="'보안문자 입력'" 
                                        type="text" 
                                    />
                                </div>
                            </div>
                            <!--// 보안문자입력 -->
                            <MMCheck v-model="loginForm.useIdRemember" :label="'아이디 저장하기'" />
                            <a
                                v-if="needTransferUserPasswordChange"
                                href="#RENEWAL_PASSWORD_CHANGE"
                                class="m_popup-login-customer"
                            >
                                <b>
                                    <strong>기존 가입고객</strong>
                                    은 최초 1회 비밀번호 변경 후 사용합니다.
                                </b>
                                <small>GO <i class="ico_link T=bold" /></small>
                            </a>
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button 
                                        type="button" 
                                        class="mm_btn T=lg T=primary" 
                                        @click="login"
                                    >
                                        <b>로그인</b>
                                    </button>
                                    <MMLink class="mm_btn T=lg T=line" :to="{ name: 'Join' }">
                                        <b>회원가입</b>
                                    </MMLink>
                                </div>
                                <div class="mm_btn_box">
                                    <div class="mm_flex T=auto">
                                        <MMLink :to="{ name: 'FindId' }">
                                            <b>아이디 찾기</b>
                                        </MMLink>
                                        <MMLink :to="{ name: 'FindPassword' }">
                                            <b>비밀번호 찾기</b>
                                        </MMLink>
                                        <a v-if="isRedirectToOrder" href="#" @click.prevent="moveToOrderPage()">
                                            <b>비회원 주문하기</b>
                                        </a>
                                        <a v-else href="#GUEST_LOGIN">
                                            <b>비회원 주문조회</b>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <!-- 간편로그인 -->
                            <div class="m_popup-login-sns">
                                <h6><b>SNS 계정으로 로그인</b></h6>
                                <ul>
                                    <li v-if="usableSocials.naver">
                                        <a
                                            class="btn_naver"
                                            href="#"
                                            target="_blank"
                                            title="새 창 열림"
                                            @click.prevent="socialUserLogin('naver')"
                                        >
                                            <i class="ico_sns-naver" />
                                            <b class="mm_ir-blind">네이버</b>
                                        </a>
                                        <span v-if="recentSocialLoginType === 'naver'" class="text_recent">최근 로그인</span>
                                    </li>
                                    <li v-if="usableSocials.kakaotalk">
                                        <a
                                            class="btn_kakaotalk"
                                            href="#"
                                            target="_blank"
                                            title="새 창 열림"
                                            @click.prevent="socialUserLogin('kakao')"
                                        >
                                            <i class="ico_sns-kakao" />
                                            <b class="mm_ir-blind">카카오톡</b>
                                        </a>
                                        <span v-if="recentSocialLoginType === 'kakao'" class="text_recent">최근 로그인</span>
                                    </li>                                    
                                    <li v-if="usableSocials.apple">
                                        <a
                                            class="btn_apple"
                                            href="#"
                                            target="_blank"
                                            title="새 창 열림"
                                            @click.prevent="socialUserLogin('apple')"
                                        >
                                            <i class="ico_sns-apple" />
                                            <b class="mm_ir-blind">애플</b>
                                        </a>
                                        <span v-if="recentSocialLoginType === 'apple'" class="text_recent">최근 로그인</span>
                                    </li>
                                </ul>
                            </div>                            
                            <!--// 간편로그인 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
            <!-- 생체인증 안내 -->
            <div :class="['m_login-popover', { 'S=popover-on': needBioMetricLogin }]">
                <div class="m_login-popover-dim" @click="bioPopupClose" />
                <div class="m_login-popover-item">
                    <i v-lazyload="{ src: '../image/content/login_biometric.svg' }" class="mm_bg-contain image_biometric" />
                    <p><strong class="mm_text-variable">[필수] 생체정보(얼굴, 지문) 수집 및<br> 이용에 동의</strong>하시면 간편하게 로그인이<br> 가능합니다</p>
                    <div class="mm_btn_box">
                        <button type="button" class="mm_btn T=lg T=primary" @click="startBiometricLogin">
                            <b>동의하고 사용하기</b>
                        </button>
                    </div>
                    <div class="mm_note">
                        <ul>
                            <li>최초 1회 생체정보 동의로 생체 로그인이 가능합니다</li>
                            <li>[마이페이지 &#62; 설정]에서 연동 및 해제 가능합니다</li>
                        </ul>
                    </div>
                    <button type="button" class="btn_cancel" @click="bioPopupClose">
                        <b>다음에 할래요</b>
                    </button>
                    <button type="button" class="btn_close" @click="bioPopupClose">
                        <i class="ico_popover-close" /><b class="mm_ir-blind">닫기</b>
                    </button>
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeMount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useRouteQuery } from '@vueuse/router';
import { defaultCatch, ios } from '$/functions'
import { mmon } from '$/helper/mmon'
import MMCheck from '@/components/input/Check.vue'
import MMPopup from '@/components/layout/Popup.vue'
import { LoginResult } from '$/@type/auth/user'
import { usePageTitleSetting } from '$/composables/seoComposable';
import SleptAwakePopup from '@/components/modal/SleptAwake.vue'
import { useLogin, useUserState } from '$/composables/auth/userComposable';
import { useForm } from '$/composables/pageHandler/formComposable';
import { useStartOrder } from '$/composables/orderComposable';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { useUserAgent } from '$/composables/commonComposable';
import { useBiometricLogin, useNativeNaverLogin } from '$/composables/appBridgeComposable';

const router = useRouter();
const route = useRoute();
usePageTitleSetting('로그인');

const { 
    savedId, 
    needAdditionalCertificate, 
    usableSocials,
    captchaImage,
    awakeCoupon,    
    needTransferUserPasswordChange,
    refreshCaptchaImage,
    shopUserLogin, 
    socialLogin,
    isAppFirstLogin,
    shopLoginId,
    loggingLoginSuccess,
    saveBiometricPopupForInfo,
    saveRecentSocialLoginType,
    recentSocialLoginType,
} = useLogin();

const {
    isAppUser,
    isIosApp,
    isAndroidApp,    
} = useUserAgent();

const { user } = useUserState();

const { form: loginForm } = useForm<{
    loginId: string,
    password: string,
    useIdRemember: boolean,
    captchaCode: string,
    needAdditionalCertificate?: string,
}>(
    {
        loginId: savedId.value,
        password: '',
        useIdRemember: savedId.value !== '',
        captchaCode: '',
        needAdditionalCertificate: needAdditionalCertificate.value ? '1' : '0' 
    },
    {
        rules: { 
            'loginId(아이디)' : ['required'],
            'password(비밀번호)' : ['required'],
            'captchaCode(보안문자)' : ['requiredIf:needAdditionalCertificate,1']
        },
        messages: {
            'loginId.required' : ':param(을/를) 입력해주세요.',
            'password.required': ':param(을/를) 입력해주세요.',
            'captchaCode.requiredIf': ':param(을/를) 입력해주세요.',
        }
    }
);

const redirectPath = computed(() => {
    return `${route?.query.redirect_to_after || '/'}`;
})
const isNeedAdultCertification = useRouteQuery<string>('is_need_adult_certification', '').value.toLowerCase() === 'y' ? true : false;        
const isRedirectToOrder = redirectPath.value === 'order';
const { Android } = window;
const needBioMetricLogin = ref<boolean>(false);
const { moveToOrderPage } = useStartOrder();

/**
 * 자사회원 로그인
*/
async function login() {
    mmon.loading.show();
    try {
        await loginForm.value.validate();
        const loginResult: LoginResult = await shopUserLogin(loginForm.value)
        mmon.loading.hide();
        movePage(loginResult);
        
    } catch(e) {          
        defaultCatch(e);                
    } finally {
        mmon.loading.hide();
    }
}

/** //FUNC **/
const { naverLogin } = useNativeNaverLogin();

async function nativeCallbackNaverLogin(accessToken: string, refreshToken: string) {
    mmon.loading.show();
    try {
        const loginResult: LoginResult = await naverLogin(accessToken, refreshToken)
        mmon.loading.hide();
        if (loginResult.isLoginComplete) {
            return movePage(loginResult);
        }
        /// 중복회원
        if (loginResult.isDuplicate) {
            return router.push({
                name: 'SnsIdDuplicate'
            });
        }      
        // 회원 정보 없음
        return router.push({
            name: 'JoinSnsPolicy' 
        });
    } catch(e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}
/**
 * 소셜 회원 로그인 처리
 * @param { string } socialType : 소셜 타입 여부
 * @param { string } socialLabel : 소셜 타입 라벨
 */
async function socialUserLogin(socialType: string) {    
    if (isAppUser && socialType === 'naver') {
        window['nativeCallbackNaverLogin'] = nativeCallbackNaverLogin;
        if (isIosApp) {            
            ios.run('naverLogin')
        } else {
            Android.naverLogin()
        }
    }
    else {
        mmon.loading.show();
        try {
            const loginResult: LoginResult = await socialLogin(socialType);
            mmon.loading.hide();           

            if (loginResult.isLoginComplete) {
                return movePage(loginResult);
            }

            /// 중복회원
            if (loginResult.isDuplicate) {
                return router.push({
                    name: 'SnsIdDuplicate'
                });
            }      
            // 회원 정보 없음
            return router.push({
                name: 'JoinSnsPolicy' 
            });
        } catch (e) {
            defaultCatch(e);
        } finally {
            mmon.loading.hide();
        }
    }
}

watch(needBioMetricLogin, (to) => {
    if(to) {
        if (!user.value) {
            return;
        }

        saveBiometricPopupForInfo(user.value.loginId);
    }
})

/**
 * 로그인 처리 후 라우트 이동
 * @param { LoginResult } loginResult : 유저 정보
*/
function movePage(loginResult: LoginResult) {
    // 앱 유저일 경우
    if (isAppUser) {        
        // 첫 로그인 시 생체인증 팝업 
        if (isAppFirstLogin.value) {
            return needBioMetricLogin.value = true;
        } else {
            if (user.value === null) {
                return;
            }

            if (shopLoginId.value !== user.value.loginId) {
                if (isIosApp) {
                    ios.run('removeBioMetricToken');
                } else if (isAndroidApp) {
                    Android.removeBioMetricToken();
                }
                return needBioMetricLogin.value = true;    
            }
        }
    }
    
    if (user.value !== null) {
        if (user.value.loginType !== 'shop') {
            saveRecentSocialLoginType(user.value?.loginType)
        } else {
            saveRecentSocialLoginType('')
        }
    }

    if (isNeedAdultCertification && loginResult.verifiedAge === false) {
        return router.replace({
            name: 'AdultCertification',
            query: {
                redirect_to_after: redirectPath.value
            }
        })
    }
    
    // 휴면 해제 회원 모달 노출
    if (loginResult.isAwaked) {            
        return useModal().open(SleptAwakePopup, {
            title: '휴면회원 해제안내',
            name: 'SleptAwake',
            props: {
                couponInfo: awakeCoupon.value
            },
            onClose: () => {
                if (user.value === null) {
                    return;
                }

                movePage({
                    isLoginComplete: true,
                    verifiedAge: user.value.isVerifyAge,
                    isAwaked: false,
                    needPasswordUpdate: user.value.isNeedPasswordUpdate,
                    isDuplicate: false,
                    isSocialNameEmpty: false
                });
            }
        });
    }

    // 비밀번호 변경 권유
    if (loginResult.needPasswordUpdate) {
        return router.replace({
            name: 'PasswordChangeAdvice',
            query: {
                redirect_to_after: redirectPath.value
            }                    
        })
    } 
            
    // 주문서 이동
    if (isRedirectToOrder) {
        return moveToOrderPage()
    }
    
    // 로그인 처리 후 로그인 페이지로 돌아오지 않게 replace 처리                
    return router.replace(redirectPath.value);
}

const { biometricLogin, storeToken } = useBiometricLogin();

/**
 * 생체인증 로그인 처리 
*/
function startBiometricLogin() {
    if (isIosApp) {
        top.nativeCallbackBiometricLogin = storeBiometricToken;
        ios.run('biometricLogin', true);
    } else if (isAndroidApp) {
        top.nativeCallbackBiometricLogin = storeBiometricToken;
        Android.bioMetricLogin(true);
    }
}

async function storeBiometricToken() {
    try {
        await storeToken();
        if (user.value !== null) {
            if (isAppFirstLogin.value) {
                loggingLoginSuccess();
            }

            movePage({
                isLoginComplete: true,
                verifiedAge: user.value.isVerifyAge,
                isAwaked: false,
                needPasswordUpdate: user.value.isNeedPasswordUpdate,
                isDuplicate: false,
                isSocialNameEmpty: false
            });
        }
    } catch (error) {
        mmon.bom.alert('생체인식 정보 등록에 실패 하였습니다.\n 다시 시도해주세요.');
    } finally {
        mmon.loading.hide();
    }
}



/**
 * 생체정보 미동의(닫기)
 */
async function bioPopupClose() {
    needBioMetricLogin.value = false;
    /// 
    if (user.value !== null) {
        if (isAppFirstLogin.value) {
            loggingLoginSuccess();
        }

        movePage({
            isLoginComplete: true,
            verifiedAge: user.value.isVerifyAge,
            isAwaked: false,
            needPasswordUpdate: user.value.isNeedPasswordUpdate,
            isDuplicate: false,
            isSocialNameEmpty: false
        })
    }
}

/**
 * 생체인증 재로그인 콜백함수
*/
async function nativeCallbackBiometricReLogin(loginToken: string) {
    mmon.loading.show();
    try {
        const loginResult: LoginResult = await biometricLogin(loginToken);
        if (isAppFirstLogin.value) {
            loggingLoginSuccess();
        }

        mmon.loading.hide();
        return movePage(loginResult);
    } catch (error) {
        mmon.bom.alert('로그인에 실패하였습니다.\n 생체인증 정보를 재등록해주세요');
        if (isIosApp) {
            ios.run('removeBioMetricToken');
        } else if (isAndroidApp) {
            Android.removeBioMetricToken();
        }
    } finally {
        mmon.loading.hide();
    }
}

/**
 * 생체인증 사용여부 콜백 함수(네이티브 IOS 전용)
 */
async function iosBiometricLoginCallback(accessToken: string) {
    if (accessToken !== '') {
        top.nativeCallbackBiometricLogin = nativeCallbackBiometricReLogin;
        ios.run('biometricLogin');
    }
}

onBeforeMount(() => {
    if (isAppUser) {
        if (isIosApp) {
            top.nativeCallbackBiometricUse = iosBiometricLoginCallback;
            ios.run('isBioMetricUse');
        } else if (isAndroidApp) {
            if (Android.isBioMetricUse() && Android.getBioMetricToken() != '') {
                top.nativeCallbackBiometricLogin = nativeCallbackBiometricReLogin;
                Android.bioMetricLogin(Android.getBioMetricToken());
            }
        }
    }
});

</script>
