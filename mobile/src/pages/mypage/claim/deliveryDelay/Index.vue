<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>배송지연 신고</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 탭메뉴 -->
                        <div class="mm_tab_menu m_my-tab">
                            <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                            <ul class="mm_flex T=equal">
                                <li>
                                    <a 
                                        href="#"
                                        title="선택됨" 
                                        :class="router.currentRoute.value.name === 'MypageClaimDeliveryDelayClaimable' ? 'S=tab-on' : ''"
                                        @click.prevent="router.replace({ name: 'MypageClaimDeliveryDelayClaimable' })"
                                    ><b>배송지연 신고</b></a>
                                </li>
									
                                <li>
                                    <a 
                                        href="#"
                                        title="선택됨" 
                                        :class="router.currentRoute.value.name === 'MypageClaimDeliveryDelayResult' ? 'S=tab-on' : ''"
                                        @click.prevent="router.replace({ name: 'MypageClaimDeliveryDelayResult' })"
                                    ><b>배송지연 처리결과</b></a>
                                </li>
                            </ul>
                        </div>
                        <!--// 탭메뉴 -->
                        <router-view />
                    </div>
                    <!--// 본문 -->

                    <!-- 푸터 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>
        </template>
    </MMSub>
</template>

<script setup lang="ts">
import MMSub from '@/components/layout/Sub.vue';
import MMFooter from '@/components/Footer.vue'
import { useRouter } from 'vue-router';

const router = useRouter();

</script>
