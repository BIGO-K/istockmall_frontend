<template>
    <div class="mm_page-content">
        <div class="m_sign-find-fin">
            <h3><b><span class="mm_text-variable">{{ userName }}</span>님 <br>아이디 찾기가 완료되었습니다</b></h3>
            <!-- 아이디목록 -->
            <ul class="m...fin-id">
                <template
                    v-for="result in idFindResults"
                    :key="result.maskingLoginId"
                >
                    <li v-if="result.registType === 'shop'">
                        <i
                            class="ico_member"
                            title="일반 회원가입 아이디"
                        /><p>{{ result.maskingLoginId }}</p>
                    </li>
                    <li v-if="result.registType === 'naver'">
                        <i
                            class="ico_sns-naver"
                            title="네이버 아이디"
                        /><p>{{ result.maskingLoginId }}</p>
                    </li>
                    <li v-if="result.registType === 'kakao'">
                        <i
                            class="ico_sns-kakao"
                            title="카카오톡 아이디"
                        /><p>{{ result.maskingLoginId }}</p>
                    </li>
                    <li v-if="result.registType === 'apple'">
                        <i
                            class="ico_sns-apple"
                            title="애플 아이디"
                        /><p>{{ result.maskingLoginId }}</p>
                    </li>
                </template>
            </ul>
            <!--// 아이디목록 -->
            <div class="m...fin-verify">
                <p>가려진 정보가 궁금하다면?</p>
                <!--마스킹 해제된 아이디 전송 분기-->
                <button
                    v-if="findType === 'phone'"
                    type="button"
                    class="mm_btn T=xs T=line"
                    @click.prevent="sendFullId"
                >
                    <b>휴대폰으로 전송</b>
                </button>
                <button
                    v-else
                    type="button"
                    class="mm_btn T=xs T=line"
                    @click.prevent="sendFullId"
                >
                    <b>이메일로 전송</b>
                </button>
            </div>
            <!-- 하단버튼 -->
            <div class="mm_foot">
                <div class="mm_btn_box T=equal">
                    <MMLink
                        :to="{ name: 'FindPassword' }"
                        class="mm_btn T=line T=primary"
                    >
                        <b>비밀번호 찾기</b>
                    </MMLink>
                    <MMLink
                        :to="{ name: 'Login' }"
                        class="mm_btn T=primary"
                    >
                        <b>로그인</b>
                    </MMLink>
                </div>
            </div>
            <!--// 하단버튼 -->
        </div>
    </div>
</template>
<script lang="ts" setup>
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useIdFindResult } from '$/composables/auth/findComposable';
import { onBeforeRouteLeave } from 'vue-router';

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
