<template>
    <ModalPopup v-if="isCompleteLoading">
        <template #headerTitle>
            <h1><b>포토리뷰</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-review-detail">
                            <MMCarousel
                                v-if="reviews.length > 0"
                                v-auto-height
                                class="mm_toast-inner"
                                :carousel-data="{
                                    onComplete: callbackOnComplete
                                }"
                                :items="reviews"
                                :use-pagination="false"
                                :use-custom-control="true"
                            >
                                <template #item="{ item: review }: { item: ReviewInfo}">
                                    <div v-if="review" class="mm_review">
                                        <div class="mm_review-head">
                                            <p class="text_user">
                                                <i 
                                                    v-lazyload="{ src: review.reviewDetail.writerGradeImageUrl, useErrorImage: false }"
                                                    class="mm_bg-contain image_grade"
                                                />
                                                {{ review.reviewDetail.writerId }}
                                            </p>
                                            <p class="text_star">
                                                <i class="ico_star-fill" /><span>{{ review.reviewDetail.rate }}</span>
                                            </p>
                                        </div>
                                        <ul v-if="review.reviewDetail.imageUrls.length > 0" class="m...detail-image">
                                            <li v-for="imageUrl, index in review.reviewDetail.imageUrls" :key="index">
                                                <a>
                                                    <i class="image_review">
                                                        <img
                                                            v-lazyload="{ src : imageUrl }"
                                                            :data-lazyload="`{ '_src':  '${imageUrl}' }`"
                                                            :alt="`리뷰이미지_${index}`"
                                                        >
                                                    </i>
                                                </a>
                                            </li>
                                        </ul>
                                        <p class="text_info">
                                            {{ review.reviewDetail.optionName }}
                                        </p>
                                        <p class="text_review">
                                            <b v-html="MMFilters.nlToBr(review.reviewDetail.contents)" />
                                        </p>
                                        <p class="text_date">
                                            {{ review.reviewDetail.createdAt }}
                                        </p>
                                    </div>
                                </template>
                                <template #customControl>
                                    <button type="button" :class="['btn_carousel-prev', { 'S=control-on': isShowControlBtn }]" @click="controllerBtnHide()">
                                        <i class="ico_page-prev" /><b class="mm_ir-blind">이전 리뷰 보기</b>
                                    </button>
                                    <button type="button" :class="['btn_carousel-next', { 'S=control-on': isShowControlBtn }]" @click="controllerBtnHide()">
                                        <i class="ico_page-next" /><b class="mm_ir-blind">다음 리뷰 보기</b>
                                    </button>
                                </template>
                            </MMCarousel>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { ReviewInfo } from '$/@type/goods';
import { goodsRepository } from '$/repository/goodsRepository';
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { useReviewModal } from '$/composables/goods/detailComposable';
import { useRoute } from 'vue-router';
import gsap from 'gsap';
import { Carousel } from '@/assets/publish/src/script/ui/sliders';
import  MMCarousel from '@/components/Carousel.vue'
import  ModalPopup from '@/components/layout/ModalPopup.vue'

const vAutoHeight = {
    beforeUpdate(el: HTMLElement) {
        const ulEl = el.querySelector('ul') as HTMLElement;
        const targetEl = ulEl.querySelector("li[class='mm_carousel-item S=on']>div") as HTMLElement;
        if (targetEl?.offsetHeight == undefined) {
            return;
        }
        gsap.to(ulEl, {
            height: targetEl.offsetHeight,
            duration: 0.2,
            ease: 'cubic.out'
        });
    },
}

const route = useRoute();

/** VARIABLE */
const goodsId = Number(route.params.id.toString());
// 캐러셀의 리뷰목록
const reviews = ref<ReviewInfo[]>([]);
// API로 조회한 리뷰 목록
const totalReviews = ref<ReviewInfo[]>([]);

// 포토리뷰 상세 모달 정보
const { reviewModalInfo } = useReviewModal();
const reviewId = Number(reviewModalInfo.value?.reviewId) || 0;
const firstReviewId = Number(reviewModalInfo.value?.firstReviewId) || 0;
const lastReviewId = Number(reviewModalInfo.value?.lastReviewId) || 0;
const totalCount = Number(reviewModalInfo.value?.totalCount) || 0;

// 캐러셀 관련 정보
const targetReview = ref<ReviewInfo>();
const hideBtnTimeout = ref<NodeJS.Timeout>();
const isShowControlBtn = ref<boolean>(true);
const currentIndex = ref<number>(0);
// 최대 캐러셀 아이템(li) 개수(최대 4개)
const maxItemCount = totalCount > 3 ? 4 : totalCount;
const isCompleteLoading = ref<boolean>(false);

/** FUNCTION */
/**
 * 리뷰정보 FETCH
 *
 * @param {number} goodsId  상품 id
 * @param {number} reviewId  리뷰 id
 * @param {number} index  캐러셀에 보여질 index
 */
async function fetchReviewInfo(goodsId: number, reviewId: number, index: number) {
    const visibleReview = totalReviews.value.find(review => review.reviewDetail.id === reviewId);

    if (visibleReview) {
        return reviews.value[index] = visibleReview    
    }

    const review = await goodsRepository.photoDetailReview(goodsId, reviewId);
    totalReviews.value.push(review);
    reviews.value[index] = review
}

/**
 * 캐러셀 OnComplete 시점에서 호출할 콜백
 *
 * @param {ui: Carousel} carousel
 */
async function callbackOnComplete(carousel: {ui: Carousel}) {
    controllerBtnHide();
    currentIndex.value = carousel.ui.realIndex;
    await fetchSideReviewInfo();
}

/**
 * 이전, 다음 리뷰 정보 fetch
 *
 * - 최근 등록일 기준 내림 차순 정렬되어
 *   (=>) 방향으로 스크롤시 이전 리뷰
 *   (<=) 방향으로 스크롤시 다음 리뷰가 노출
 */
async function fetchSideReviewInfo() {
    try {
        targetReview.value = reviews.value[currentIndex.value];

        // 이전(=>), 다음(<=) 리뷰의 캐러셀 index
        const nextIndex = currentIndex.value === maxItemCount - 1 ? 0 : currentIndex.value + 1;
        const prevIndex = currentIndex.value === 0 ? maxItemCount - 1 : currentIndex.value - 1;

        const nextItemReviewId = targetReview.value?.prevReviewId || lastReviewId;
        const prevItemReviewId = targetReview.value?.nextReviewId || firstReviewId;

        await Promise.all([
            await fetchReviewInfo(goodsId, nextItemReviewId, nextIndex),
            await fetchReviewInfo(goodsId, prevItemReviewId, prevIndex)
        ]);
    } catch (e) {
        // defaultCatch(e);
    }
}

/**
 * <, > 버튼 숨김처리
 */
function controllerBtnHide() {
    if (hideBtnTimeout.value !== undefined) {
        clearTimeout(hideBtnTimeout.value)
    }
    isShowControlBtn.value = true;
    hideBtnTimeout.value = setTimeout(() => {
        isShowControlBtn.value = false;
    }, 1000);
}

/** VUE LIFE CYCLE */
onMounted(async () => {
    try {
        // 캐러셀의 0번째 target 조회
        await fetchReviewInfo(goodsId, reviewId, 0);
        // target의 next, prev 조회
        await fetchSideReviewInfo();
    } catch(e) {
                
    }

    controllerBtnHide();
    isCompleteLoading.value = true;
});

onBeforeUnmount(() => {
    if (hideBtnTimeout.value !== undefined) {
        clearTimeout(hideBtnTimeout.value)
    }
})
</script>
