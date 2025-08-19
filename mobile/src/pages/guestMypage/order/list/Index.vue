<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>주문관리</b></h1>
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
                                        :class="router.currentRoute.value.name === 'GuestMyPageOrderList' ? 'S=tab-on' : ''"
                                        @click.prevent="router.replace({ name: 'GuestMyPageOrderList' })"
                                    ><b>주문</b></a>
                                </li>
                                <li>
                                    <a 
                                        href="#"
                                        title="선택됨" 
                                        :class="router.currentRoute.value.name === 'GuestMyPageOrderCancelList' ? 'S=tab-on' : ''"
                                        @click.prevent="router.replace({ name: 'GuestMyPageOrderCancelList' })"
                                    ><b>취소</b></a>
                                </li>
                                <li>
                                    <a 
                                        href="#"
                                        title="선택됨" 
                                        :class="router.currentRoute.value.name === 'GuestMyPageOrderReturnList' ? 'S=tab-on' : ''"
                                        @click.prevent="router.replace({ name: 'GuestMyPageOrderReturnList' })"
                                    ><b>반품</b></a>
                                </li>
                                <li>
                                    <a 
                                        href="#"
                                        title="선택됨" 
                                        :class="router.currentRoute.value.name === 'GuestMyPageOrderExchangeList' ? 'S=tab-on' : ''"
                                        @click.prevent="router.replace({ name: 'GuestMyPageOrderExchangeList' })"
                                    ><b>교환</b></a>
                                </li>
                            </ul>
                        </div>
                        <!--// 탭메뉴 -->

                        <!-- 주문목록 -->
                        <router-view />
                        <!--// 주문목록 -->
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
import MMFooter from '@/components/Footer.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

</script>
