<template>
    <p v-if="recentViewPlanningList.length < 1" class="mm_text-none">
        <i class="ico_text-none" />최근 본 기획전이 없습니다
    </p>
    <template v-else>
        <p class="m_myrecent-note">
            * 2주 후 자동 삭제
        </p>
        <div class="mm_list m_myrecent-promo">
            <ul>
                <li v-for="planning in recentViewPlanningList" :key="planning.id">
                    <MMLink :to="{ name: 'PlanningDetail', params: { id: planning.id }}">
                        <b v-if="planning.isEnded" class="text_status T=status-off">종료</b>
                        <b v-else class="text_status">진행중</b>
                        <p>{{ planning.title }}</p>
                    </MMLink>
                </li>
            </ul>
        </div>
    </template>
</template>

<script setup lang='ts'>
import { RecentViewPlanning } from '$/@type/member/recentViews';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { ref, onMounted } from 'vue';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('최근 본 기획전', ['최근 본 쇼핑정보', '마이페이지']);
const recentViewPlanningList = ref<RecentViewPlanning[]>([]);
onMounted(async () => {
    try {     
        mmon.loading.show();           
        recentViewPlanningList.value = await shoppingRepository.getRecentViewPlannings();
    } catch (e) {
        defaultCatch(e);
    } finally  {
        mmon.loading.hide();    
    }
})

</script>
