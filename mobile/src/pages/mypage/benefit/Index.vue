<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>혜택 관리</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 탭 메뉴 -->
                        <div class="mm_tab_menu m_my-tab">
                            <ul class="mm_flex T=equal">
                                <li v-for="tab in tabList" :key="tab.type">
                                    <a
                                        :class="{ 'S=tab-on': tabType === tab.type }"
                                        :title="tabType === tab.type ? '선택됨' : ''"
                                        @click="selectTab(tab)"
                                    >
                                        <b>{{ tab.name }}</b>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <!--// 탭 메뉴 -->

                        <!-- 탭 본문 -->
                        <component :is="currentTabComponent?.component" />
                        <!--// 탭 본문 -->
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
import { computed, defineAsyncComponent, ref } from 'vue';
import MMSub from '@/components/layout/Sub.vue';
import MMFooter from '@/components/Footer.vue';
import { PointLabel } from '$/@type/member/point';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const {
    route,
    router,
    usePageTitleSetting,
    globalConfigs,
} = usePageContext();
        
// 적립금 라벨
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);

const tabList = [
    {
        name: '보유 쿠폰',
        type: 'coupon',
        component: defineAsyncComponent(() => import('@/pages/mypage/benefit/tab/Coupon.vue')),
        query: {}
    },
    {
        name: `보유 ${pointLabel?.value.name}`,
        type: 'point',
        component: defineAsyncComponent(() => import('@/pages/mypage/benefit/tab/Point.vue')),
        query: {}
    },
];
// 페이지 진입시 선택한 tab type(coupon | point)
const tabType = ref<string>(String(route.params.tabType));

/**
 * 컴포넌트 데이터 동기화 처리를 위한 computed
 */
const currentTabComponent = computed(() => {
    return tabList.find(tab => tab.type == tabType.value);
});

function selectTab(tab: { type: string, name: string }) {
    if (currentTabComponent.value){
        currentTabComponent.value.query = route.query
    }

    tabType.value = tab.type;
    router.replace({
        name: 'MypageBenefit',
        params: {
            tabType: tab.type,
        },
        query: currentTabComponent.value?.query,
    })

    usePageTitleSetting(tab.name, ['혜택관리', '마이페이지']);
}
</script>