<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>간편결제 - 네이버페이</b></h1>
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
                                                <p><b>모바일</b></p><i class="ico_dropdown" />
                                            </dt>
                                            <dd class="mm_dropdown-item" :style="selectedItemIndex === 0 ? { height: 'auto' } : {}">
                                                <div class="mm_dropdown-item-inner">
                                                    <div class="mm_note">
                                                        <ul>
                                                            <li>네이버페이는 네이버ID로 신용카드 또는 은행계좌 정보를 등록하여 결제할 수 있는 간편결제 서비스입니다.</li>
                                                            <li>주문 변경 시 카드사 혜택 및 할부 적용 여부는 해당 카드사 정책에 따라 변경될 수 있습니다.</li>
                                                            <li>지원 가능 결제수단: 네이버페이 결제창 내 노출되는 모든 카드/계좌</li>
                                                        </ul>
                                                    </div>
                                                    <ul>
                                                        <li><span class="text_indent">1.</span><p>네이버페이 결제선택</p></li>
                                                        <li><span class="text_indent">2.</span><p>네이버 ID 로그인</p></li>
                                                        <li><span class="text_indent">3.</span><p>사전 설정한 결제 비밀번호로 인증</p></li>
                                                        <li><span class="text_indent">4.</span><p>결제 완료</p></li>
                                                    </ul>
                                                </div>
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl :class="['mm_dropdown', { 'S=on': selectedItemIndex === 1 }]" @click="() => { selectedItemIndex = selectedItemIndex === 1 ? -1 : 1 }">
                                            <dt class="btn_dropdown" tabindex="0" :title="selectedItemIndex === 1 ? '펼쳐보기' : '접어보기'">
                                                <p><b>PC</b></p><i class="ico_dropdown" />
                                            </dt>
                                            <dd class="mm_dropdown-item" :style="selectedItemIndex === 1 ? { height: 'auto' } : {}">
                                                <div class="mm_dropdown-item-inner">
                                                    <div class="mm_note">
                                                        <ul>
                                                            <li>네이버페이는 네이버ID로 신용카드 또는 은행계좌 정보를 등록하여 결제할 수 있는 간편결제 서비스입니다.</li>
                                                            <li>주문 변경 시 카드사 혜택 및 할부 적용 여부는 해당 카드사 정책에 따라 변경될 수 있습니다.</li>
                                                            <li>지원 가능 결제수단: 네이버페이 결제창 내 노출되는 모든 카드/계좌</li>
                                                        </ul>
                                                    </div>
                                                    <ul>
                                                        <li><span class="text_indent">1.</span><p>네이버페이 결제선택</p></li>
                                                        <li><span class="text_indent">2.</span><p>네이버 ID 로그인</p></li>
                                                        <li><span class="text_indent">3.</span><p>결제카드 등록 및 본인인증</p></li>
                                                        <li><span class="text_indent">4.</span><p>결제 비밀번호 인증</p></li>
                                                        <li><span class="text_indent">5.</span><p>등록 및 결제 완료</p></li>
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

usePageTitleSetting('간편결제 네이버페이');

// 아무것도 선택 안된 상태
const selectedItemIndex = ref<number>(-1);
</script>