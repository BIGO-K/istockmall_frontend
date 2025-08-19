<template>
    <div class="m_myreview">
        <template v-if="isFetched">
            <p v-if="writables.total < 1" class="mm_text-none">
                <i class="ico_text-none" />작성 가능한 리뷰가 없습니다
            </p>
            <p v-else class="m_myreview-note">
                {{ writables.total }}건의 리뷰를 작성하시면 
                <strong class="mm_text-variable">최대 {{ MMFilters.formatNumber(maxEarnablePoint * writables.total) }}원</strong>
                을 드립니다
            </p>
            <!-- 리뷰 목록 -->
            <div class="m_myreview-list">
                <ul>
                    <li v-for="orderItem in writables.data" :key="orderItem.orderId + orderItem.optionId">
                        <p class="text_date">
                            {{ MMFilters.formatDate(orderItem.orderedAt, 'YYYY.MM.DD') }}
                        </p>
                        <div class="mm_product-item T=single-sm">
                            <MMLink :to="{ name: 'GoodsDetail', params: { id: orderItem.goods.id }}">
                                <figure>
                                    <i v-lazyload="{ src: orderItem.goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                    <figcaption>
                                        <p class="text_brand">
                                            {{ orderItem.goods.brandName }}
                                        </p>
                                        <p class="text_product">
                                            {{ orderItem.goods.name }}
                                        </p>
                                        <p class="text_option">
                                            {{ orderItem.goods.optionName }} / {{ orderItem.goods.ea }}개
                                        </p>
                                    </figcaption>
                                </figure>
                            </MMLink>
                        </div>
                        <p class="m_myreview-tooltip">
                            최대 <strong class="mm_text-secondary">{{ MMFilters.formatNumber(maxEarnablePoint) }}{{ pointLabel.suffix }}</strong> 적립
                        </p>
                        <a class="btn_write-review" href="#REVIEW_CREATE" @click.capture="setReviewCreateModalOrderItem(orderItem)">
                            <i class="ico_review-write" />
                            <b class="mm_ir-blind">리뷰 작성하기</b>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- // 리뷰 목록 -->
            <!-- 유의사항 -->
            <div class="mm_note">
                <ul>
                    <li>리뷰는 구매확정 시점부터 바로 작성할 수 있습니다.</li>
                    <li>구매확정 후 30일 경과 시 리뷰를 작성할 수 없습니다.</li>
                </ul>
            </div>
            <!--// 유의사항 -->
        </template>
        <!-- 페이지네이션 -->
        <MMPaginator
            v-if="writables.total > 0"
            :page-block-type="'group'"
            :page-block-count="20"
            :current-page="writables.currentPage"
            :items-per-page="writables.perPage"
            :total-count="writables.total"
            @move-page-to="movePage"
        />
        <!--// 페이지네이션 -->
    </div>
</template>

<script setup lang='ts'>
import {  onMounted, ref } from 'vue';
import { ReviewableOrderItem } from '$/@type/member/review';
import { reviewRepository } from '$/repository/reviewRepository';
import { useReviewCreate } from '$/composables/mypage/reviewComposable';
import { defaultCatch } from '$/functions';
import { PointLabel } from '$/@type/member/point';
import { useGlobalConfigs, useMyPointRule } from '$/composables/globalConfigComposable';
import { Paginator } from '$/@type';
import { mmon } from '$/helper/mmon';
import MMPaginator from '@/components/Paginator.vue';
import { useEventListener } from '@vueuse/core';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const emit = defineEmits(['updateAggregate']);
/** VARIABLE */
const {
    route,
    router,
    usePageTitleSetting,
} = usePageContext();
usePageTitleSetting('작성 가능한 리뷰', ['리뷰 관리', '마이페이지']);
const { globalConfigs } = useGlobalConfigs();
const { myPointRule } = useMyPointRule();
const { setReviewCreateModalOrderItem } = useReviewCreate()

const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);
const maxEarnablePoint = ref<number>(myPointRule.value.photoReviewPoint);

// 작성가능리뷰
const writables = ref<Paginator<ReviewableOrderItem>>({
    total: 0,
    currentPage: 1,
    perPage: 20,
    data: []
});

const isFetched = ref(false);
const page = ref<number>(1);

// 작성가능리뷰 조회
async function fetchReviewWritables() {
    mmon.loading.show();
    try {
        writables.value = await reviewRepository.getWritables(page.value);

        router.replace({
            path: route.path,
            query: { page: page.value },
        });
    } catch (e) {
        defaultCatch(e)
    } finally {
        mmon.loading.hide();
        isFetched.value = true;
    }
}

async function movePage(nextPage: number) {
    page.value = nextPage;
    await fetchReviewWritables();        
}

/** VUE LIFE CYCLE */
onMounted(async () => {
    page.value = Number(route.query.page) || 1;
    await fetchReviewWritables();
})
/** VUE LIFE CYCLE */

useEventListener(window, 'hashchange', async (e: HashChangeEvent) => {
    const before = e.oldURL.split('#')[1] ?? '';
    const after = e.newURL.split('#')[1] ?? '';
    if (before === 'REVIEW_CREATE' && after === '') {
        page.value = 1;
        await fetchReviewWritables();
        emit("updateAggregate");
    }
}) 
</script>
