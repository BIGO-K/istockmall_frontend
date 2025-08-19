<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>간편결제 - 페이코</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-cs">
                            <div class="mm_accordion">
                                <ul>
                                    <li>
                                        <dl :class="['mm_dropdown', { 'S=on': selectedItemIndex === 0 }]" @click="() => { selectedItemIndex = selectedItemIndex === 0 ? -1 : 0 }">
                                            <dt class="btn_dropdown" tabindex="0" :title="selectedItemIndex === 0 ? '펼쳐보기' : '접어보기'">
                                                <p><b>첫 결제 고객</b></p><i class="ico_dropdown" />
                                            </dt>
                                            <dd class="mm_dropdown-item" :style="selectedItemIndex === 0 ? { height: 'auto' } : {}">
                                                <div class="mm_dropdown-item-inner">
                                                    <p>페이코는 NHN 페이코가 만든 안전한 간편결제 서비스입니다</p>
                                                    <ul>
                                                        <li><span class="text_indent">1.</span><p>페이코 결제 선택</p></li>
                                                        <li><span class="text_indent">2.</span><p>본인인증(휴대폰/아이핀) 및 회원가입</p></li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">3.</span><p>아이핀 회원가입 시 휴대폰 인증</p></dt>
                                                                <dd><p>휴대폰 인증 가입 시 해당 단계 생략</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li><span class="text_indent">4.</span><p>신용카드 정보 등록</p></li>
                                                        <li><span class="text_indent">5.</span><p>결제 비밀번호 등록</p></li>
                                                        <li><span class="text_indent">6.</span><p>등록 및 결제 완료</p></li>
                                                    </ul>
                                                </div>
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl :class="['mm_dropdown', { 'S=on': selectedItemIndex === 1 }]" @click="() => { selectedItemIndex = selectedItemIndex === 1 ? -1 : 1 }">
                                            <dt class="btn_dropdown" tabindex="0" :title="selectedItemIndex === 1 ? '펼쳐보기' : '접어보기'">
                                                <p><b>재 결제 고객</b></p><i class="ico_dropdown" />
                                            </dt>
                                            <dd class="mm_dropdown-item" :style="selectedItemIndex === 1 ? { height: 'auto' } : {}">
                                                <div class="mm_dropdown-item-inner">                                                    
                                                    <ul>
                                                        <li><span class="text_indent">1.</span><p>페이코 결제선택</p></li>
                                                        <li><span class="text_indent">2.</span><p>로그인</p></li>
                                                        <li><span class="text_indent">3.</span><p>할인 및 결제수단 선택</p></li>
                                                        <li><span class="text_indent">4.</span><p>결제 비밀번호 등록</p></li>
                                                        <li><span class="text_indent">5.</span><p>결제 완료</p></li>
                                                    </ul>
                                                </div>
                                            </dd>
                                        </dl>
                                    </li>
                                </ul>
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
import { ref } from 'vue';
import MMPopup from '@/components/layout/Popup.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('간편결제 페이코');

// 아무것도 선택 안된 상태
const selectedItemIndex = ref<number>(-1);
</script>