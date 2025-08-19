<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>아이디 찾기 완료</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-sign-find">
                            <div class="m_popup-sign-title">
                                <h3><b><strong class="mm_text-variable">{{ userName }}</strong> 님<br> 아이디 찾기가 완료되었습니다</b></h3>
                            </div>
                            <ul class="m...find-id">
                                <template v-for="result in idFindResults" :key="result.maskingLoginId">
                                    <li v-if="result.registType === 'shop'">
                                        <i class="ico_member" title="MMONSTAR 아이디" /><p>{{ result.maskingLoginId }}</p>
                                    </li>
                                    <li v-if="result.registType === 'naver'">
                                        <i class="ico_sns-naver" title="네이버 아이디" /><p>{{ result.maskingLoginId }}</p>
                                    </li>
                                    <li v-if="result.registType === 'kakao'">
                                        <i class="ico_sns-kakao" title="카카오톡 아이디" /><p>{{ result.maskingLoginId }}</p>
                                    </li>
                                    <li v-if="result.registType === 'apple'">
                                        <i class="ico_sns-apple" title="애플 아이디" /><p>{{ result.maskingLoginId }}</p>
                                    </li>
                                </template>
                            </ul>
                            <div class="m...find-verify">
                                <p>가려진 정보가 궁금하신가요?</p>
                                <!-- (D) 휴대폰 번호로 아이디를 찾았을 경우 아래 '휴대폰 번호로 전송' 버튼을 노출합니다 -->
                                <button v-if="findType === 'phone'" type="button" class="mm_btn T=xs T=line" @click.prevent="sendFullId">
                                    <b>휴대폰으로 전송</b>
                                </button>
                                <!-- (D) 이메일로 아이디를 찾았을 경우 아래 '이메일 주소로 전송' 버튼을 노출합니다 -->
                                <button v-else type="button" class="mm_btn T=xs T=line" @click.prevent="sendFullId">
                                    <b>이메일로 전송</b>
                                </button>
                            </div>
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <MMLink :to="{ name: 'Login' }" class="mm_btn T=lg T=primary">
                                        <b>로그인</b>
                                    </MMLink>
                                    <MMLink :to="{ name: 'FindPassword', replace: true }" class="mm_btn T=lg T=line T=primary">
                                        <b>비밀번호 찾기</b>
                                    </MMLink>
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
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useIdFindResult } from '$/composables/auth/findComposable';
import { onBeforeRouteLeave } from 'vue-router';
import MMPopup from '@/components/layout/Popup.vue';

usePageTitleSetting('아이디 찾기 완료', ['아이디 찾기', '로그인']);
const {
    findType,
    userName,
    idFindResults,
    sendFullId,
    resetFindResult,
} = useIdFindResult();
onBeforeRouteLeave(() => {
    resetFindResult();
})
</script>