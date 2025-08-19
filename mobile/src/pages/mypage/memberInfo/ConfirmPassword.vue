<template>
    <div class="mm_scroller">
        <div class="mm_page-inner">
            <!-- 본문 -->
            <div v-if="user" class="mm_page-content">
                <div v-if="user.loginType == 'shop'" class="mm_inner m_popup-myinfo">
                    <h3 class="mm_title">
                        <b>개인정보 보호를 위해<br>
                            <strong>비밀번호를 입력해주세요</strong></b>
                    </h3>
                    <MMInput 
                        v-model="password" 
                        :type="'password'"
                        :data-type="'password'"
                        :place-holder-text="'비밀번호를 입력하세요'"
                        @keydown.enter.prevent="confirmPassword"
                    />
                    <div class="mm_foot">
                        <div class="mm_btn_box">
                            <button type="button" class="mm_btn T=primary" @click="confirmPassword">
                                <b>확인하기</b>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="mm_inner m_popup-myinfo">
                    <h3 class="mm_title">
                        <b>소중한 개인정보 보호를 위해<br>
                            <strong>한번 더 로그인해주세요</strong></b>
                    </h3>
                    <p>로그인하셔야 회원정보 수정이 가능합니다</p>
                    <ul class="m_my-sns">
                        <li v-if="user.loginType === 'naver'">
                            <a class="btn_sns" href="#" target="_blank" title="새 창 열림" @click.prevent="naverReLogin">
                                <i class="ico_sns-naver" /><b>네이버</b>
                            </a>
                        </li>
                        <li v-if="user.loginType === 'kakao'">
                            <a class="btn_sns" href="#" target="_blank" title="새 창 열림" @click.prevent="kakaoReLogin">
                                <i class="ico_sns-kakao" /><b>카카오톡</b>
                            </a>
                        </li>
                        <li v-if="user.loginType === 'apple'">
                            <a class="btn_sns" href="#" target="_blank" title="새 창 열림" @click.prevent="appleReLogin">
                                <i class="ico_sns-apple" /><b>애플</b>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <!--// 본문 -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { defaultCatch, handlePopupOpenWithUrlCallback, isMobile, ios } from '$/functions'
import { mmon } from '$/helper/mmon'
import { userRepository } from '$/repository/auth/userRepository'
import { memberInfoRepository } from '$/repository/member/infoRepository'
import { ref, Ref } from 'vue'
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePasswordConfirmToken } from '$/composables/auth/confirmComposable'
import { usePageContext } from '$/composables/pageHandler/contextComposable'

/** VARIABLE */
usePageTitleSetting('비밀번호 재입력');
const { user } = usePageContext();
const { setToken } = usePasswordConfirmToken(); // 로그인 재확인 액세스 토큰
const password = ref<string>('')
const { Android } = window
const isAndroidApp = isMobile('app_android')
const isIosApp = isMobile('app_ios')
/** // VARIABLE */

/** FUNCTION */
async function nativeCallbackNaverLogin(naverAccessToken: string, refreshToken: string) {
    try {
        const token = await memberInfoRepository.reCertificateSocial('naver', naverAccessToken)
        setToken(token);
    } catch (e) {
        mmon.bom.alert('네이버 재로그인 실패')
    }
}

// 네이버 소셜회원 재로그인
async function naverReLogin() {
    if (isAndroidApp) {
        top.nativeCallbackNaverLogin = nativeCallbackNaverLogin
        Android.naverLogin()
    } else if (isIosApp) {
        top.nativeCallbackNaverLogin = nativeCallbackNaverLogin
        ios.run('naverLogin')
    } else {
        try {
            mmon.loading.show()
            const naverLoginToken = ref('')
            const { isPopupClose } = await handlePopupOpenWithUrlCallback(
                'thirdparty-login',
                async () => {
                    const { token, enterUrl } = await userRepository.thirdPartyGenerateToken('naver')
                    naverLoginToken.value = token
                    return enterUrl
                },
                '',
                true,
            )
            const isPopupClosed = ref<boolean>(isPopupClose)
            await checkThirdPartyTokenGenerateStatus('naver', naverLoginToken.value, isPopupClosed)

            const token = await memberInfoRepository.reCertificateSocial('naver', naverLoginToken.value)
            setToken(token);
        } catch (e) {
            mmon.bom.alert('네이버 재로그인 실패')
        } finally {
            mmon.loading.hide()
        }
    }
}

// 카카오 소셜회원 재로그인
async function kakaoReLogin() {
    try {
        mmon.loading.show()
        const kakaoAccessToken = ref('')
        const { isPopupClose } = await handlePopupOpenWithUrlCallback(
            'thirdparty-login',
            async () => {
                const { token, enterUrl } = await userRepository.thirdPartyGenerateToken('kakao')
                kakaoAccessToken.value = token
                return enterUrl
            },
            '',
            isMobile('android'),
        )
        const isPopupClosed = ref<boolean>(isPopupClose)
        await checkThirdPartyTokenGenerateStatus('kakao', kakaoAccessToken.value, isPopupClosed)

        const token = await memberInfoRepository.reCertificateSocial('kakao', kakaoAccessToken.value);
        setToken(token);
    } catch (e) {
        mmon.bom.alert('카카오 재로그인 실패')
    } finally {
        mmon.loading.hide()
    }
}

/**
 * 애플 소셜회원 재로그인
 */
async function appleReLogin() {
    mmon.loading.show()
    try {
        const appleAccessToken = ref('')
        const { isPopupClose } = await handlePopupOpenWithUrlCallback('thirdparty-login', async () => {
            const { token, enterUrl } = await userRepository.thirdPartyGenerateToken('apple')
            appleAccessToken.value = token
            return enterUrl
        })
        const isPopupClosed = ref<boolean>(isPopupClose)
        await checkThirdPartyTokenGenerateStatus('apple', appleAccessToken.value, isPopupClosed)
        const token = await memberInfoRepository.reCertificateSocial('apple', appleAccessToken.value)
        setToken(token);
    } catch (error) {
        defaultCatch(error)
    } finally {
        mmon.loading.hide()
    }
}

/**
 * 서드파티 토큰 발급 완료 여부
 * @param platform
 * @param token
 */
async function checkThirdPartyTokenGenerateStatus(platform: 'kakao' | 'apple' | 'naver', token: string, isPopupClosed: Ref<boolean>) {
    let isProcessCompleted = false
    return new Promise(async (resolve, reject) => {
        const checkTokenGenerateStatusInterval = setInterval(async () => {
            if (isPopupClosed.value) {
                clearInterval(checkTokenGenerateStatusInterval)
                resolve(isProcessCompleted)
            }

            try {
                const isCompleted = await userRepository.thirdPartyIsTokenGenerateCompleted(platform, token)
                if (isCompleted) {
                    clearInterval(checkTokenGenerateStatusInterval)
                    resolve(isProcessCompleted)
                }
            } catch (e) {
                clearInterval(checkTokenGenerateStatusInterval)
                reject(e)
            }
        }, 1000)
    })
}

// 자사가입 회원 비밀번호 확인
async function confirmPassword() {
    if (password.value === '') {
        return mmon.bom.alert('비밀번호를 입력해주세요.')
    }
    try {
        const token  = await memberInfoRepository.checkPassword(password.value);
        setToken(token);        
    } catch (e) {
        defaultCatch(e, {
            401: '비밀번호가 일치하지 않습니다.',
        })
    }
}
/** // FUNCTION */
</script>
