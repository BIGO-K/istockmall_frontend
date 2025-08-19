<template>
    <div class="mm_page-content">
        <div class="m_sign m_login">
            <div class="m_sign-title">
                <h3 class="mm_title">
                    <b>로그인</b>
                </h3>                
                <strong
                    v-if="isNeedAdultCertification"
                    class="text_adult"
                >
                    <i class="ico_adult T=sm" /><b>본 상품은 19세 미만의 청소년이 이용할 수 없습니다</b>
                </strong>
            </div>
            <h6 class="mm_text-label">
                <b>아이디</b>
            </h6>
            <MMInput 
                v-model="loginForm.loginId"
                :place-holder-text="'아이디를 입력하세요'"
                maxlength="20"
                type="text"
                @keydown.enter.prevent="login"
            />
            <h6 class="mm_text-label">
                <b>비밀번호</b>
            </h6>
            <MMInput 
                v-model="loginForm.password"
                :place-holder-text="'비밀번호 영문/특수문자/숫자 8~16자'"
                maxlength="16"
                type="password"
                @keydown.enter.prevent="login"
            />
            <!-- 보안문자입력 -->
            <div
                v-if="needAdditionalCertificate"
                class="m_login-security"
            >
                <p class="mm_text-negative">
                    로그인을 5회 실패하였습니다.<br> 보안 문자를 입력하여 로그인해주세요.
                </p>
                <div class="mm_flex m_login-security-info">
                    <i class="image_security">
                        <img
                            :src="captchaImage"
                            alt="보안문자"
                        >
                    </i>
                    <button
                        type="button"
                        class="btn_refresh"
                        @click="refreshCaptchaImage"
                    >
                        <i class="ico_refresh" /><b>새로고침</b>
                    </button>
                    <MMInput
                        v-model="loginForm.captchaCode"
                        :placeholder="'보안문자 입력'"
                    />
                </div>
            </div>
            <!--// 보안문자입력 -->
            <MMCheck
                v-model="loginForm.useIdRemember"
                :label="'아이디 저장'"
            />
            <MMLink
                v-if="needTransferUserPasswordChange"
                :to="{ name: 'RenewalPasswordChange' }"
                class="m_login-customer-pw"
            >
                <b>
                    <strong>기존 가입고객</strong>은 최초 1회 비밀번호 변경 후 사용 가능합니다.                    
                    <small>GO <i class="ico_more" /></small>
                </b>
            </MMLink>
            <!-- 하단버튼-->
            <div class="mm_foot">
                <div class="mm_btn_box">
                    <div class="mm_block">
                        <button
                            type="button"
                            class="mm_btn T=lg T=primary"
                            @click="login"
                        >
                            <b>로그인</b>
                        </button>
                        <MMLink
                            class="mm_btn T=lg T=line T=dark"
                            :to="{ name : 'Join'}"
                        >
                            <b>회원가입</b>
                        </MMLink>
                    </div>
                </div>
                <div class="mm_btn_box mm_flex T=auto">         
                    <MMLink :to="{ name: 'FindId' }">
                        <b>아이디 찾기</b>
                    </MMLink>           
                    <MMLink :to="{ name: 'FindPassword' }">
                        <b>비밀번호 찾기</b>
                    </MMLink>           
                    <a 
                        v-if="isRedirectToOrder" 
                        href="#"
                        @click.prevent="moveToOrderPage()"
                    >
                        <b>비회원 주문하기</b>
                    </a>                    
                    <a
                        v-else
                        href="#" 
                        @click.prevent="guestLoginModalOpen"
                    >
                        <b>비회원 주문조회</b>
                    </a>

                    <!-- (D) 비회원 주문 시 '비회원 주문조회' 대신 '비회원 주문하기' 버튼을 노출합니다. -->
                    <!-- <a> -->
                </div>
            </div>
            <!--// 하단버튼-->            

            <!-- 간편로그인 -->
            <div class="m_login-sns">
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
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { defaultCatch } from '$/functions';
import MMCheck from '@/components/input/Check.vue';
import { useLogin } from '$/composables/auth/userComposable';
import { useRouteQuery } from '@vueuse/router';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { useForm } from '$/composables/pageHandler/formComposable';
import { LoginResult } from '$/@type/auth/user';
import { useStartOrder } from '$/composables/orderComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import GuestLogin from '@/components/modal/GuestLogin.vue';
import SleptAwake from '@/components/modal/SleptAwake.vue';
import CertificateNeed from '@/components/modal/CertificateNeed.vue';
/** VARIABLE **/ 
const {
    router,
    route,
    mmon,
    usePageTitleSetting,
    user,
    isUser
} = usePageContext();

const { 
    savedId, 
    needAdditionalCertificate, 
    usableSocials,
    captchaImage,
    awakeCoupon,
    needTransferUserPasswordChange,
    recentSocialLoginType,
    refreshCaptchaImage,
    shopUserLogin, 
    socialLogin,
    saveRecentSocialLoginType        
} = useLogin();

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

const { moveToOrderPage } = useStartOrder();

usePageTitleSetting('로그인');    

/** VIEW PAGE VARIABLE **/
const redirectPath = computed(() => {
    return `${route.query.redirect_to_after || '/'}`;
})
const isNeedAdultCertification = useRouteQuery<string>('is_need_adult_certification', '').value.toLowerCase() === 'y' ? true : false;        
const isRedirectToOrder = redirectPath.value === 'order';


/** FUNCTION **/
/**
 * 회원 로그인 
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

/**
 * 소셜 회원 로그인 처리
 * @param { string } socialType : 소셜 타입 여부
 * @param { string } socialLabel : 소셜 타입 라벨
 */
async function socialUserLogin(socialType: string) {
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
        console.log(e);
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

/**
 * 로그인 처리 후 라우트 이동
 * @param userInfo : 유저 정보
*/
function movePage(loginResult: LoginResult) {
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
        return awakeModalOpen();
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
        if (isUser.value && !user.value?.isCertificated) {
            return certificateModalOpen();
        }

        return moveToOrderPage()
    }
            
    // 로그인 처리 후 로그인 페이지로 돌아오지 않게 replace 처리                
    
    return router.replace(redirectPath.value);
}

function guestLoginModalOpen() {
    useModal().open(GuestLogin, {
        name: 'guest',
        title: '비회원 주문조회',        
        onClose: () => {
            router.replace({
                name: 'GuestMyPage'
            })        
        }
    })
}

function awakeModalOpen() {
    useModal().open(SleptAwake, {
        name: 'sleptAwake',
        title: '휴면회원 해제안내',
        itemClass: 'm_modal-login-quiescent',
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
    })
}

function certificateModalOpen() {
    useModal().open(CertificateNeed, {
        name: 'certificateNeed',
        title: '본인인증',
        onClose: () => {
            moveToOrderPage();
        }
    })
}
</script>