<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>간편결제 - 카카오페이</b></h1>
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
                                                    <ul>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">1.</span><p>결제수단 선택</p></dt>
                                                                <dd><p>주문하기 결제수단을 간편결제 > 카카오페이 선택 [결제하기] 클릭</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">2.</span><p>카카오 페이지 카드 등록 및 선택</p></dt>
                                                                <dd><p>카드등록 및 선택 후 [결제하기] 클릭</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">3.</span><p>카카오페이 비밀번호 또는 지문인증</p></dt>
                                                                <dd><p>카카오페이 비밀번호 또는 지문 입력</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">4.</span><p>카드 200만원 이상 결제 시 ARS 인증</p></dt>
                                                                <dd><p>ARS 인증 요청 클릭 후 고객 인증(200만원 미만 결제 시 인증 페이지 미 노출)</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">5.</span><p>결제 인증 완료</p></dt>
                                                                <dd><p>[확인] 버튼 클릭</p></dd>
                                                            </dl>
                                                        </li>
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
                                                    <p>카카오톡에 탑재되어 별도의 어플을 설치할 필요가 없습니다</p>
                                                    <ul>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">1.</span><p>결제수단 선택</p></dt>
                                                                <dd><p>주문하기 결제수단을 간편결제 > 카카오페이 선택</p></dd>
                                                                <dd><p>[결제하기] 클릭</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">2.</span><p>휴대폰 번호/생년월일을 입력</p></dt>
                                                                <dd><p>휴대폰 번호/생년월일 입력 후 [결제 요청] 클릭</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">3.</span><p>카톡 메시지 확인</p></dt>
                                                                <dd><p>[결제하기] 클릭하면 카카오 페이로 이동</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">4.</span><p>카카오페이 카드 등록 및 선택</p></dt>
                                                                <dd><p>카드 등록 및 선택 후 [결제하기] 클릭</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">5.</span><p>카카오페이 비밀번호 또는 지문인증</p></dt>
                                                                <dd><p>카카오페이 비밀번호 또는 지문 입력</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">6.</span><p>카드 200만원 이상 결제 시 ARS 인증</p></dt>
                                                                <dd><p>ARS 인증 요청 클릭 후 고객 인증(200만원 미만 결제 시 인증 페이지 미 노출)</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">7.</span><p>결제 인증 완료</p></dt>
                                                                <dd><p>[확인] 버튼 클릭</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li><span class="text_indent">8.</span><p>결제 완료</p></li>
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

usePageTitleSetting('간편결제 카카오페이');

// 아무것도 선택 안된 상태
const selectedItemIndex = ref<number>(-1);

</script>