<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>문의 관리</b></h1>
        </template>

        <template #contents>
            <div ref="scroller" class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 탭메뉴 -->
                        <div class="mm_tab_menu m_my-tab">
                            <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                            <ul class="mm_flex T=equal">
                                <li>
                                    <MMLink 
                                        href="#"
                                        title="선택됨" 
                                        :class="$route.name == 'MypageInquiryQnaList' ? 'S=tab-on' : ''"
                                        :to="{ name: 'MypageInquiryQnaList' }"
                                    >
                                        <b>1:1 문의</b>
                                    </MMLink>
                                </li>
                                
                                <li>
                                    <MMLink 
                                        href="#"
                                        title="선택됨" 
                                        :class="$route.name == 'MypageInquirySellerQnaList' ? 'S=tab-on' : ''"
                                        :to="{ name: 'MypageInquirySellerQnaList' }"
                                    >
                                        <b>상품 Q&A</b>
                                    </MMLink>
                                </li>
                            </ul>
                        </div>
                        <!--// 탭메뉴 -->

                        <!-- 문의목록 -->
                        <router-view />
                        <!--// 문의목록 -->
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

<script setup lang='ts'>
import MMFooter from '@/components/Footer.vue';
import MMSub from '@/components/layout/Sub.vue';

</script>
