<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>MY 찜</b></h1>
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
                                        :class="wishTab === 'goods' ? 'S=tab-on' : ''"
                                        :title="wishTab === 'goods' ? '선택됨' : ''"
                                        @click.prevent="() => { wishTab = 'goods'; $router.replace({ name: 'MypageWishGoods'}) }"
                                    >
                                        <b>찜한 아이템</b>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        :class="wishTab === 'brand' ? 'S=tab-on' : ''"
                                        :title="wishTab === 'brand' ? '선택됨' : ''"
                                        @click.prevent="() => { wishTab = 'brand'; $router.replace({ name: 'MypageWishBrands'}) }"
                                    >
                                        <b>찜한 브랜드</b>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <!--// 탭메뉴 -->
                        <keep-alive>
                            <component :is="wishTab === 'goods' ? wishGoods : wishBrands" />
                        </keep-alive>
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
import { defineAsyncComponent, ref } from 'vue';
import MMFooter from '@/components/Footer.vue';
import MMSub from '@/components/layout/Sub.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const wishTab = route.path === '/mypage/wish/goods' ? ref('goods') : ref('brand');
			
// component
const wishBrands = defineAsyncComponent(() => import("@/pages/mypage/wish/list/Brand.vue"));
const wishGoods = defineAsyncComponent(() => import("@/pages/mypage/wish/list/Goods.vue"));

</script>