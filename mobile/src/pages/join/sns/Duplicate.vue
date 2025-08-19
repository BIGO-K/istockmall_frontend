<template>
    <div class="mm_scroller">
        <div class="mm_page-inner">
            <!-- 본문 -->
            <div class="mm_page-content">
                <div class="m_popup-sign-find">
                    <div class="m_popup-sign-title">
                        <h3><b>이미 가입된 아이디 정보입니다</b></h3>
                        <b>카카오톡, 네이버, 애플 회원은<br> 이메일 주소를 아이디로 사용하게 됩니다</b>
                    </div>
                    <ul class="m...find-id">
                        <li
                            v-for="duplicateUser in duplicateSocialUsers" 
                            :key="duplicateUser.maskingId"
                        >
                            <i :class="`ico_sns-${duplicateUser.platform}`" title="네이버 아이디" /><p>{{ duplicateUser.maskingId }}</p>
                        </li>                        
                    </ul>
                    <div class="mm_foot">
                        <div class="mm_btn_box">
                            <MMLink class="mm_btn T=lg T=primary" :to="{ name: 'Login'}">
                                <b>로그인</b>
                            </MMLink>
                            <MMLink class="mm_btn T=lg T=line T=primary" :to="{ name: 'Login'}">
                                <b>아이디 찾기</b>
                            </MMLink>
                        </div>
                    </div>
                </div>
            </div>
            <!--// 본문 -->
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useDuplicateSocialUser } from '$/composables/auth/userComposable';

/** VARIABLE */
const { duplicateSocialUsers } = useDuplicateSocialUser();

/** FUNCTION */

/** VUE LIFE CYCLE */

</script>
