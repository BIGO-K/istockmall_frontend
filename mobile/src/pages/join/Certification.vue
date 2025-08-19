<template>
    <!-- 본문 -->
    <div class="mm_page-content">
        <div class="m_popup-join">
            <h3 class="m_popup-join-title">
                <b>STEP 1</b><strong>본인인증</strong><i class="image_line T=step1" />
            </h3>
            <p class="text_welcome">
                <i class="ico_smile" /><strong>반가워요!</strong><span>안전한 회원가입을 위해</span>고객님의 본인인증이<br> 필요합니다
            </p>
            <div class="mm_btn_box">
                <a class="mm_btn T=lg T=primary" href="#" target="_blank" title="새 창 열림" @click.prevent="identityVerificationOpen"><b>휴대폰 인증</b></a>
            </div>
            <div class="mm_note">
                <ul>
                    <li>14세 미만 회원은 가입이 불가합니다.</li>
                    <li>법인폰 사용자는 휴대폰 인증이 불가합니다.</li>
                </ul>
            </div>
            <div class="m_popup-join-sns">
                <h6><b>SNS 계정으로 간편가입</b></h6>
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
                        </a>
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
                        </a>
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
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!--// 본문 -->
</template>

<script setup lang="ts">
import { useIdentityVerification } from '$/composables/auth/certificateComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { defaultCatch } from '$/functions';
import { registRepository } from '$/repository/auth/registRepository';
import { useLogin } from '$/composables/auth/userComposable';
import { LoginResult } from '$/@type/auth/user';
import { useUserAgent } from '$/composables/commonComposable';
import { useNativeNaverLogin } from '$/composables/appBridgeComposable';
import { computed } from 'vue';

const {
    router,
    mmon,
    globalConfigs
} = usePageContext();

const { isAppUser, isIosApp } = useUserAgent();
const { 
    usableSocials,
    socialLogin    
} = useLogin();

const { naverLogin } = useNativeNaverLogin();

async function nativeCallbackNaverLogin(accessToken: string, refreshToken: string) {
    mmon.loading.show();
    try {
        const loginResult: LoginResult = await naverLogin(accessToken, refreshToken)
        mmon.loading.hide();
        if (loginResult.isLoginComplete) {
            return router.replace({
                name: 'Main'
            })
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
                return router.replace({
                    name: 'Main'
                })
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


async function identityVerificationOpen() {
    try {
        const { identityProfile } = await useIdentityVerification('',true);
        const isDuplicateUser = await registRepository.userDuplicateCheck(identityProfile.token);

        if (isDuplicateUser) {
            return mmon.bom.alert('이미 가입한 회원입니다.\n로그인 페이지로 이동합니다.', () => {
                router.replace({
                    name: 'Login',
                });
            });
        }

        router.push({
            name: 'JoinInfo',
            replace : true
        });
    } catch(e) {
        defaultCatch(e);
    }
}
</script>

