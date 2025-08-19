<template>
    <!-- 작성 가능한 리뷰 -->
    <p v-if="writableReviews.total < 1" class="mm_text-none">
        <i class="ico_text-none" />작성 가능한 리뷰가 없습니다
    </p>
    <div v-else class="m_my-review-list">
        <p class="text_note">
            {{ writableReviews.total }}건의 리뷰를 작성하시면 최대 
            <strong>{{ MMFilters.formatNumber(maxEarnablePoint * writableReviews.total) }}원</strong>
            을 드립니다
        </p>
        <ul>
            <li v-for="orderItem in writableReviews.data" :key="orderItem.orderId + orderItem.optionId">
                <div class="m_my-review-item">
                    <p class="text_date">
                        {{ MMFilters.formatDate(orderItem.orderedAt, 'YYYY.MM.DD') }}
                    </p>
                    <MMSimpleGoods
                        class="T=single"
                        :goods="orderItem.goods"
                    />
                    <p class="text_tooltip">
                        최대<strong>{{ MMFilters.formatNumber(maxEarnablePoint) }}{{ pointLabel.suffix }}</strong>적립
                    </p>
                    <a 
                        class="mm_btn btn_write T=xs T=primary" 
                        href="#"                                                 
                        @click.prevent="createReviewModalOpen(orderItem)"
                    ><i class="mco_review-write" /><b>리뷰 쓰기</b>
                    </a>
                </div>
            </li>
        </ul>
    </div>    
    <!--// 작성 가능한 리뷰 -->

    <MMPaginator
        :page-block-type="'group'"
        :page-block-count="3"
        :current-page="writableReviews.currentPage"
        :items-per-page="writableReviews.perPage"
        :total-count="writableReviews.total"
        @move-page-to="movePage"
    />

    <!-- 유의사항 -->
    <div class="mm_note">
        <ul>
            <li>리뷰는 구매확정 시점부터 바로 작성하실 수 있습니다.</li>
            <li>구매확정 후 30일 경과 시 리뷰를 작성할 수 없습니다.</li>
        </ul>
    </div>
    <!--// 유의사항 -->
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { ExtractComponentProps, Paginator } from '$/@type';
import { ReviewableOrderItem } from '$/@type/member/review';
import { reviewRepository } from '$/repository/reviewRepository';
import MMPaginator from '@/components/Paginator.vue';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import { PointLabel } from '$/@type/member/point';
import { useMyPointRule } from '$/composables/globalConfigComposable';
import ReviewCreateModal from '@/components/modal/review/Create.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { usePersonalization } from '$/composables/goods/reviewComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const emit = defineEmits(['updateAggregate']);

/** VARIABLE */
const { router, route, globalConfigs, usePageTitleSetting } = usePageContext();
usePageTitleSetting('작성 가능한 리뷰', ['리뷰 관리', '마이페이지']);
const { myPointRule } = useMyPointRule();
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);     
const maxEarnablePoint = ref<number>(myPointRule.value.photoReviewPoint);  // 최대 적립 가능 포인트 

// 작성가능리뷰
const writableReviews = ref<Paginator<ReviewableOrderItem>>({
    total: 0,
    currentPage: 1,
    perPage: 20,
    data: []
});
const page = ref(1);
/** // VARIABLE */

/** FUNCTION */
/**
 *  작성가능리뷰 조회
 */
async function fetch() {
    mmon.loading.show();
    try {
        writableReviews.value = await reviewRepository.getWritables(page.value);
        // 페이지 유지
        router.replace({
            path: route.path,
            query: { page: page.value },
        });
    } catch (e) {
        defaultCatch(e)
    } finally {
        mmon.loading.hide();
    }
}

/**
 * 페이지 이동
 * @param nextPage 
 */
async function movePage(nextPage: number) {
    page.value = nextPage;
    await fetch();
}

/**
 * 리뷰 작성 모달 open
 * @param orderItem 
 */
function createReviewModalOpen(orderItem: ReviewableOrderItem) {
    const { getMySize, getShoesSizes, hasPersonalization } = usePersonalization();
    useModal().open(ReviewCreateModal, {
        title: '리뷰쓰기',
        itemClass: 'm_modal-myreview',
        name: 'ReviewCreateModal',
        props: async() => {
            const propData: Omit<ExtractComponentProps<typeof ReviewCreateModal>, 'closer'>= {
                hasPersonalization: hasPersonalization.value,
                orderItems: [orderItem],
                mySizeInfo: null,
                shoesSizeList: []
            }

            if (hasPersonalization.value) {
                const[ shoesSizes, mySize ] = await Promise.all([
                    getShoesSizes(),
                    getMySize()
                ]);
                propData.shoesSizeList = shoesSizes;
                propData.mySizeInfo = mySize;
            }

            return propData
        }, 
        onClose: () => {
            fetch();
            emit("updateAggregate") // 리뷰 집계 업데이트
        }
    })
}
/** // FUNCTION */

onMounted(async () => {
    page.value = Number(route.query.page) || 1;
    await fetch();
});

</script>
