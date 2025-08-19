<template>
    <div v-if="user?.loginType === 'shop'" class="mm_page-content-body">
        <section class="m_my-info">
            <h3 class="mm_heading">
                <b>회원정보 관리</b>
            </h3>
            <div class="m_my-info-inner">
                <h6 class="m_my-info-title">
                    <b>비밀번호 재입력</b><small>정보 보호를 위해 비밀번호를 입력해주세요</small>
                </h6>
                <h6 class="mm_text-label">
                    <b>비밀번호</b>
                </h6>
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
        </section>
    </div>
    <div v-else class="mm_page-content-body">
        <div class="m_my-info">
            <h5 class="mm_heading">
                <b>회원정보 관리</b>
            </h5>
            <div class="m_my-info-inner m_sign">
                <h6 class="m_my-info-title">
                    <b>소중한 개인정보 보호를 위해 <strong class="mm_text-variable">한번 더 로그인해주세요</strong></b><small>로그인하셔야 회원정보 수정이 가능합니다</small>
                </h6>
                <!-- 간편로그인 -->
                <ul class="m_login-sns">
                    <li v-if="user?.loginType === 'naver'">
                        <a class="btn_naver" href="#" target="_blank" title="새 창 열림" @click.prevent="socialReLogin('naver')">
                            <i class="ico_sns-naver" /><b>네이버</b>
                        </a>
                    </li>
                    <li v-if="user?.loginType === 'kakao'">
                        <a class="btn_kakaotalk" href="#" target="_blank" title="새 창 열림" @click.prevent="socialReLogin('kakao')">
                            <i class="ico_sns-kakao" /><b>카카오톡</b>
                        </a>
                    </li>
                    <li v-if="user?.loginType === 'apple'">
                        <a class="btn_apple" href="#" target="_blank" title="새 창 열림" @click.prevent="socialReLogin('apple')">
                            <i class="ico_sns-apple" /><b>애플</b>
                        </a>
                    </li>
                </ul>
                <!--// 간편로그인 -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defaultCatch, withPopup } from '$/functions'
import { memberInfoRepository } from '$/repository/member/infoRepository'
import { mmon } from '$/helper/mmon'
import { userRepository } from '$/repository/auth/userRepository'
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePasswordConfirmToken } from '$/composables/auth/confirmComposable'
import { usePageContext } from '$/composables/pageHandler/contextComposable'

/** VARIABLE */
usePageTitleSetting('회원정보 수정', ['회원정보 관리', '마이페이지']);
const { user } = usePageContext();
const { setToken } = usePasswordConfirmToken();

const password = ref<string>('')
/** // VARIABLE */

/** FUNCTION */
async function socialReLogin(platform: 'naver'|'kakao'|'apple') {
    mmon.loading.show()
    try {
        const { token, enterUrl } = await userRepository.thirdPartyGenerateToken(platform)
        await withPopup(enterUrl, 'thirdparty-login', 'width=643px, height=593px, resizble=no, scrollbars=yes')
        const accessToken = await memberInfoRepository.reCertificateSocial(platform, token)
        setToken(accessToken);
        
    } catch (e) {
        mmon.bom.alert('재로그인 실패')
    } finally {
        mmon.loading.hide()
    }
}

// 자사가입 회원 비밀번호 확인
async function confirmPassword() {
    if (password.value === '') {
        return mmon.bom.alert('비밀번호를 입력해주세요.')
    }
    try {
        const accessToken = await memberInfoRepository.checkPassword(password.value)
        setToken(accessToken);
        
    } catch (e) {
        defaultCatch(e, {
            401: '비밀번호가 일치하지 않습니다.',
        })
    }
}
/** // FUNCTION */
</script>
