<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>아이디/비밀번호 찾기</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-sign-find">
                            <!-- 탭메뉴 -->
                            <div class="mm_tab_menu">
                                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                                <ul class="mm_flex T=equal">
                                    <li>
                                        <a 
                                            href="#"
                                            title="선택됨" 
                                            :class="router.currentRoute.value.name === 'FindId' ? 'S=tab-on' : ''"
                                            @click.prevent="router.replace({ name: 'FindId' })"
                                        ><b>아이디 찾기</b></a>
                                    </li>
                                    <li>
                                        <a 
                                            href="#"
                                            title="선택됨" 
                                            :class="router.currentRoute.value.name === 'FindPassword' ? 'S=tab-on' : ''"
                                            @click.prevent="router.replace({ name: 'FindPassword' })"
                                        ><b>비밀번호 찾기</b></a>
                                    </li>
                                </ul>
                            </div>
                            <!--// 탭메뉴 -->

                            <router-view />
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import MMPopup from '@/components/layout/Popup.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
