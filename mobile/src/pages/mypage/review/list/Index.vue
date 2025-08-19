<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>리뷰 관리</b></h1>
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
                                        :class="tab === 'writable' ? 'S=tab-on': ''"
                                        @click.prevent="tab = 'writable'; fetchReviewAggregates()"
                                    >
                                        <b>작성 가능한 리뷰 {{ aggregates.writables }}</b>
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="#"
                                        title="선택됨"
                                        :class="tab === 'written' ? 'S=tab-on' : ''"
                                        @click.prevent="tab = 'written'; fetchReviewAggregates()"
                                    >
                                        <b>
                                            작성한 리뷰 {{ aggregates.written }}
                                        </b>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <!--// 탭메뉴 -->

                        <!-- 리뷰 목록 -->
                        <component :is="tab === 'writable' ? writable : written" @update-aggregate="fetchReviewAggregates" />
                        <!-- // 리뷰 목록 -->
                    </div>
                    <!--// 본문 -->
                    <MMFooter />
                </div>
            </div>
        </template>
    </MMSub>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { reviewRepository } from "$/repository/reviewRepository";
import { ReviewAggregates } from "$/@type/member/review";
import { defaultCatch } from "$/functions";
import MMFooter from "@/components/Footer.vue";
import MMSub from "@/components/layout/Sub.vue";

const route = useRoute();

const tab = route.path === '/mypage/review/writable' ? ref('writable') : ref('written');

const writable = defineAsyncComponent(() => import("@/pages/mypage/review/list/Writable.vue"));
const written = defineAsyncComponent(() => import("@/pages/mypage/review/list/Written.vue"));

// 리뷰 집계
const aggregates = ref<ReviewAggregates>({
    writables: 0,
    written: 0,
});

onMounted(async () => {
    await fetchReviewAggregates();
});

// 리뷰 집계 조회
async function fetchReviewAggregates() {
    try {
        aggregates.value = await reviewRepository.getAggregates();
    } catch (e) {
        defaultCatch(e);
    }
}
</script>
