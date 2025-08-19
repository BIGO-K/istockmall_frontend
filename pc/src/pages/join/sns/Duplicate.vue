<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="m_sign-find-fin">
            <div class="m_sign-title">
                <h3 class="mm_title">
                    <b>회원가입</b>
                </h3>
                <p>이미 가입된 아이디 정보입니다<small>카카오톡, 네이버, 애플 회원은 이메일 주소를 아이디로 사용하게 됩니다</small></p>
            </div>
            <!-- 아이디목록 -->
            <ul class="m...fin-id">
                <li
                    v-for="duplicateUser in duplicateSocialUsers"
                    :key="duplicateUser.maskingId"
                >
                    <i
                        :class="`ico_sns-${duplicateUser.platform}`"
                        title="아이디"
                    /><p>{{ duplicateUser.maskingId }}</p>
                </li>  
            </ul>
            <!--// 아이디목록 -->

            <!-- 하단버튼 -->
            <div class="mm_foot">
                <div class="mm_btn_box T=equal">
                    <MMLink
                        class="mm_btn T=line T=primary"
                        :to="{ name: 'FindId'}"
                    >
                        <b>아이디 찾기</b>
                    </MMLink>                    
                    <MMLink
                        class="mm_btn T=primary"
                        :to="{ name: 'Login'}"
                    >
                        <b>로그인</b>
                    </MMLink>
                </div>
            </div>
            <!--// 하단버튼 -->
        </div>
    </div>
</template>

<script setup lang='ts'>
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useDuplicateSocialUser } from '$/composables/auth/userComposable';
/** VARIABLE */
usePageTitleSetting('중복 가입 안내', ['간편로그인 가입']);
const { duplicateSocialUsers } = useDuplicateSocialUser();
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>