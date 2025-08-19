<template>
    <div class="mm_page-content">
        <div class="m_join">
            <div class="m_join-head">
                <h3 class="mm_title">
                    <b>회원가입</b>
                </h3>
                <!-- 회원가입 스텝 -->
                <div class="m_join-head-step">
                    <ol class="mm_flex T=equal">
                        <li
                            class="T=step-on"
                            title="현재 진행 중인 단계"
                        >
                            <span><small>STEP</small>1</span><strong>본인인증</strong>
                        </li>
                        <li><span><small>STEP</small>2</span><strong>회원정보 및 약관동의</strong></li>
                        <li><span><small>STEP</small>3</span><strong>가입완료</strong></li>
                    </ol>
                </div>
                <!--// 회원가입 스텝 -->
            </div>
            <p class="text_welcome">
                <i class="ico_smile" /><strong>반가워요!</strong><br> <span>안전한 회원가입을 위해</span> 고객님의 본인인증이 필요합니다
            </p>
            <!-- 유의사항 -->
            <div class="mm_note">
                <ul>
                    <li>14세 미만 회원은 가입이 불가합니다</li>
                    <li>법인폰 사용자는 휴대폰 인증이 불가합니다</li>
                </ul>
            </div>
            <!--// 유의사항 -->

            <!-- 하단버튼 -->
            <div class="mm_foot">
                <div class="mm_btn_box">
                    <a
                        class="mm_btn T=primary"
                        href="#"
                        title="새 창 열림"
                        @click.prevent="startIdentityVerification"
                    >
                        <b>휴대폰 인증</b>
                    </a>
                </div>
            </div>
            <!--// 하단버튼 -->
            <!-- 간편회원가입 -->
            <div class="m_join-sns">
                <h5><b>간편회원가입</b></h5>
                <p>자주 사용하는 SNS 아이디로 간편하게 가입하실 수 있습니다.</p>
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
            <!--// 간편회원가입 -->
        </div>
    </div>
</template>


<script setup lang='ts'>
import { useIdentityVerification } from '$/composables/auth/certificateComposable';
import { registRepository } from '$/repository/auth/registRepository';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { defaultCatch } from '$/functions';
import { useLogin } from '$/composables/auth/userComposable';
import { LoginResult } from '$/@type/auth/user';
import { computed } from 'vue';

const {
    router,
    mmon,
    usePageTitleSetting,
    globalConfigs
} = usePageContext();

const { 
    usableSocials,
    socialLogin    
} = useLogin();


usePageTitleSetting('본인인증', ['회원가입']);
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
            return router.push({
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
        return router.replace({
            name: 'JoinSnsPolicy' 
        });
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}


/**
 * 본인인증 시작함수 
*/
async function startIdentityVerification() {
    try {
        const { identityProfile }= await useIdentityVerification(
            'width=643px, height=593px, resizble=no, scrollbars=yes',
            true
        );

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