<template>
    <div class="mm_page-content-body">
        <div class="m_my-review">
            <h5 class="mm_heading">
                <b>최근 본 상품/기획전</b>
            </h5>
            <div class="m_my-recent">
                <p class="text_update">
                    2주 후 자동 삭제
                </p>
                <!-- 최근 본 상품 -->
                <section class="m_my-recent-prod">
                    <h6 class="mm_strapline">
                        <b>최근 본 상품</b>
                    </h6>
                    <p
                        v-if="recentViewGoods.length < 1"
                        class="mm_text-none T=sm"
                    >
                        <i class="ico_text-none" />최근 본 상품이 없습니다
                    </p>
                    <ul v-else>
                        <li
                            v-for="goods in recentViewGoods"
                            :key="goods.id"
                        >
                            <MmGoods 
                                :goods="goods"
                                :use-liked-button="false"
                                :is-show-price="false"
                                class="T=single T=sm"
                            />
                        </li>
                    </ul>
                </section>
                <!--// 최근 본 상품 -->

                <!-- 최근 본 기획전 -->
                <section>
                    <h6 class="mm_strapline">
                        <b>최근 본 기획전</b>
                    </h6>
                    <p
                        v-if="recentViewPlanningList.length < 1"
                        class="mm_text-none T=sm"
                    >
                        <i class="ico_text-none" />최근 본 기획전이 없습니다
                    </p>
                    <div
                        v-else
                        class="mm_list"
                    >
                        <ul>
                            <li
                                v-for="planning in recentViewPlanningList"
                                :key="planning.id"
                            >
                                <MMLink
                                    :to="{ name: 'PlanningDetail', params: { id: planning.id } }"
                                >
                                    <b
                                        v-if="planning.isEnded"
                                        class="mm_tag T=round T=gray"
                                    >종료</b>
                                    <b
                                        v-else
                                        class="mm_tag T=round T=primary"
                                    >진행중</b>
                                    <b>{{ planning.title }}</b>
                                </MMLink>
                            </li>
                        </ul>
                    </div>
                </section>
                <!--// 최근 본 기획전 -->
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { RecentViewPlanning } from '$/@type/member/recentViews';
import { defaultCatch } from '$/functions';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useRecentViewGoods } from '$/composables/shoppingComposable';

/** VARIABLE */

usePageTitleSetting('최근 본 상품/기획전', ['최근 본 쇼핑정보', '마이페이지']);
const {
    recentViewGoods
} = useRecentViewGoods();
        
const recentViewPlanningList = ref<RecentViewPlanning[]>([]);
/** FUNCTION */

/** VUE LIFE CYCLE */

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