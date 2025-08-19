<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>간편결제 - 토스페이</b></h1>
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
                                                <p><b>간편결제(토스페이) 안내</b></p><i class="ico_dropdown" />
                                            </dt>
                                            <dd class="mm_dropdown-item" :style="selectedItemIndex === 0 ? { height: 'auto' } : {}">
                                                <div class="mm_dropdown-item-inner">
                                                    <p>토스페이는 간편하게 지문 또는 비밀번호만으로 결제할 수 있는 빠르고 편리한 간편 결제 서비스입니다</p>
                                                    <ul>                                                        
                                                        <li><span class="text_indent">1.</span><p>결제수단 선택</p></li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">2.</span><p>휴대폰 번호/생년월일을 입력</p></dt>
                                                                <dd><p>앱 없이 결제 시 [휴대폰 번호/생년월일] 입력</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li><span class="text_indent">3.</span><p>금액 확인 및 결제하기</p></li>
                                                        <li><span class="text_indent">4.</span><p>토스 비밀번호 입력 또는 생체 인증</p></li>
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


usePageTitleSetting('간편결제 토스');

// 아무것도 선택 안된 상태
const selectedItemIndex = ref<number>(-1);
</script>