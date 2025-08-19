<template>
    <div class="m_prodetail-tab-review">
        <template v-if="aggregateInfo.reviewerCount > 0">
            <strong class="text_star"><i class="ico_star-fill" /><span>{{ aggregateInfo.reviewAverageStars }}</span></strong>
            <p> 
                <strong v-text="`${MMFilters.formatNumber(aggregateInfo.totalReviewCount)}명`" />의 고객님이 리뷰를 남겨주셨고,<br> 
                <strong class="mm_text-secondary">{{ aggregateInfo.satisfaction }}%</strong>가 만족하셨습니다.
            </p>
        </template>

        <!-- 개인화 상품 평가 -->
        <div v-if="isUsePersonalization && optionalReviewInfo.length > 0" :class="['m...review-satisfy', { 'S=switch-on' : isReadMore }]">
            <section v-for="template in optionalReviewInfo" :key="template.id">
                <h6>
                    <b>{{ template.title }}</b>
                    <template v-for="subDivision in template.subDivisionList" :key="subDivision.id">
                        <template v-if="subDivision.isHighest">
                            <strong>{{ subDivision.label }}</strong>
                            <span>{{ subDivision.selectedRate }}%<small>({{ MMFilters.formatNumber(subDivision.selectedCount) }}명)</small></span>
                        </template>
                    </template>
                </h6>
                <ul>
                    <li
                        v-for="sub in template.subDivisionList"
                        :key="sub.id"
                        :class="sub.isHighest ? 'S=value-high' : ''"
                    >
                        <span class="text_label">{{ sub.label }}</span>
                        <b class="m...review-satisfy-progress">
                            <i :style="`width:${sub.selectedRate}%;`" :title="`${sub.selectedRate}%`" />
                        </b>
                        <span>{{ MMFilters.formatNumber(sub.selectedCount) }}명</span>
                    </li>
                </ul>
            </section>
            <button
                :title="isReadMore ? '선택됨' : ''"
                type="button"
                class="btn_detail"
                @click="isReadMore = !isReadMore"
            >
                <b>자세히 보기</b>
                <i class="ico_more" />
            </button>
        </div>
        <!--// 개인화 상품 평가 -->

        <div class="m...review-point">
            <p>리뷰 작성하시면 포인트를 적립해드립니다.</p>
            <ul>
                <li>
                    <p>
                        텍스트 리뷰: <strong>{{ MMFilters.formatNumber(textReviewAmount) }}</strong>
                        <sub>원</sub>
                    </p>
                </li>
                <li>
                    <p>
                        포토 리뷰: <strong>{{ MMFilters.formatNumber(photoReviewAmount) }}</strong>
                        <sub>원</sub>
                    </p>
                </li>
            </ul>
            <a class="mm_btn T=primary" href="#" @click.prevent="reviewWrite"><b>리뷰 작성하기</b></a>
        </div>

        <template v-if="aggregateInfo.reviewerCount === 0 && reviewPaginator.data.length < 1">
            <p class="mm_text-none">
                <i class="ico_text-none" />등록된 리뷰가 아직 없습니다
            </p>
        </template>
        <template v-else>
            <div v-if="bestReviews.length > 0" class="m...review-best">
                <h4><b>베스트 리뷰</b></h4>
                <MMCarousel
                    :items="bestReviews"
                    :use-count="true"
                    :carousel-data="{
                        _isMoreSide: true,
                        _autoDelay: 4,
                    }"
                    @click.capture="bestReviewDetailModalOpen"
                    @mousedown="() => {isDrag = false}"
                    @mousemove="() => {isDrag = true}"
                >
                    <template #item="{ item: bestReview }">
                        <a href="javascript:;" :data-id="bestReview.id">
                            <p class="text_user">
                                <i
                                    v-lazyload="{ src : bestReview.writerGradeImageUrl, useErrorImage: false }" 
                                    class="mm_bg-contain image_grade"
                                />
                                {{ bestReview.writerId }}
                            </p>
                            <p class="text_star"><i class="ico_star-fill" /><span>{{ bestReview.rate }}</span></p>
                            <div class="mm_flex">
                                <p class="text_review">
                                    <b v-html="bestReview.contents" />
                                    <span class="text_date">{{ bestReview.createdAt }}</span>
                                </p>
                                <i v-if="bestReview.isPhotoReview" v-lazyload="{ src: bestReview.imageUrls[0] }" class="mm_bg-cover image_review" :data-lazyload="`{'_src': '${bestReview.imageUrls[0]}'}`" />
                            </div>
                        </a>
                    </template>
                </MMCarousel>
            </div>
            <section ref="reviewListEl" class="m...review-list">
                <h4><b>전체 리뷰수</b><strong>{{ MMFilters.formatNumber(reviewPaginator.total) }}</strong></h4>
                <!-- 포토리뷰 -->
                <div
                    v-if="recentPhotoReviewList.length > 0"
                    class="m...review-list-photo"
                >
                    <ul>
                        <li v-for="recentPhotoReview, index in recentPhotoReviewList.slice(0, 4)" :key="index">
                            <a href="#GOODS_DETAIL_PHOTO_REVIEWS">
                                <i
                                    v-lazyload="{ src: recentPhotoReview.imageUrl }" 
                                    class="mm_bg-cover image_review"
                                />
                                <b v-if="index > 2 && recentPhotoReviewList.length > 4">
                                    +{{ MMFilters.formatNumber(recentPhotoReviewList.length - 4) }}
                                    <span class="mm_ir-blind">리뷰 더보기</span>
                                </b>
                                <b v-else class="mm_ir-blind">{{ recentPhotoReview.writerId }}님의 포토리뷰</b>
                            </a>
                        </li>
                    </ul>
                </div>
                <!--// 포토리뷰 -->

                <!-- 리뷰 목록 -->
                <div class="m...review-list-head">
                    <label class="mm_form-check">
                        <input v-model="reviewFilter.onlyPhotoReview" type="checkbox" data-check @change="fetchReview">
                        <b class="mm_block">
                            <i class="ico_form-check" />
                            <span class="text_label">포토리뷰</span>
                        </b>
                    </label>
                    <ul>
                        <li v-for="sortOption in sortOptions" :key="sortOption.value">
                            <button 
                                type="button" 
                                :class="{ 'S=on' : sortOption.value === reviewFilter.sort }" 
                                :title="sortOption.value === reviewFilter.sort ? '선택됨' : ''"
                                @click.prevent="() => { reviewFilter.sort = sortOption.value; fetchReview(); }"
                            >
                                <b>{{ sortOption.label }}</b>
                            </button>
                        </li>  
                    </ul>
                </div>
                <p v-if="reviewFilter.onlyPhotoReview && reviewPaginator.data.length < 1" class="mm_text-none">
                    <i class="ico_text-none" />등록된 포토리뷰가 아직 없습니다
                </p>
                <ul v-else>
                    <li v-for="review, index in reviewPaginator.data" :key="review.id">
                        <div class="mm_review" :class="switchOnReviewId === review.id ? 'S=switch-on' : ''">
                            <div class="mm_review-head">
                                <p class="text_user">
                                    <b v-if="review.isExperienceGroup" class="mm_tag T=full T=square T=dark"><i class="ico_experience" />체험단</b>
                                    <i v-lazyload="{ src: review.writerGradeImageUrl, useErrorImage: false }" class="mm_bg-contain image_grade" />{{ review.writerId }}
                                </p>
                                <p class="text_star">
                                    <i class="ico_star-fill" /><span>{{ review.rate }}</span>
                                </p>
                                <p class="text_info">
                                    {{ review.optionName }}
                                    <span v-if="isUsePersonalization && review.physical">{{ review.physical }}</span>
                                </p>
                            </div>
                            <p class="text_review" tabindex="0" @click="reviewContentsLineClampFlags[index] ? toggleContentsLineClamp(Number(review.id)) : () => {}">
                                <b v-contents-line-clamp="{ setFlag: setContentsLineClampFlag }" v-html="MMFilters.nlToBr(review.contents)" />
                                <span v-if="reviewContentsLineClampFlags[index]" class="mm_btn T=line T=dark">
                                    <i class="ico_toggle" />
                                </span>
                            </p>
                            <ul v-if="review.isPhotoReview" class="mm_review-image">
                                <li v-for="photoUrl in review.imageUrls" :key="photoUrl">
                                    <a href="#ZOOM_REVIEW_IMAGE" @click="setImage(review.imageUrls)">
                                        <i class="image_review"><img v-lazyload="{ src: photoUrl, isRatio: true }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""></i>
                                    </a>                                
                                </li>
                            </ul>
                            <div v-if="isUsePersonalization" class="mm_satisfy">
                                <dl v-for="template in review.templates" :key="template.id">
                                    <dt>{{ template.title }}</dt>
                                    <dd>{{ template.selectedLabel }}</dd>
                                </dl>
                            </div>
                            <p class="text_date">
                                {{ MMFilters.formatDate(review.createdAt, 'YYYY.MM.DD') }}
                            </p>
                        </div>
                    </li>
                </ul>
                <!--// 리뷰 목록 -->

                <!-- 페이지네이션 -->
                <MMpaginator
                    :page-block-type="'group'"
                    :page-block-count="3"
                    :current-page="reviewPaginator.currentPage"
                    :items-per-page="reviewPaginator.perPage"
                    :total-count="reviewPaginator.total"
                    :scroll-y-target="reviewListEl"
                    @move-page-to="movePage"
                />
            <!--// 페이지네이션 -->
            </section>
        </template>
    </div>
</template>


<script setup lang="ts">
import { goodsRepository } from '$/repository/goodsRepository';
import { onMounted, ref, defineAsyncComponent, toRefs, DirectiveBinding } from 'vue';
import { Review, ReviewPaginator, AggregateReviewAndQna, OptionalReviewStatistics } from '$/@type/goods';
import { mmon } from '$/helper/mmon';
import { useGlobalConfigs, useMyPointRule } from '$/composables/globalConfigComposable';
import { useZoomImages } from '$/composables/shoppingComposable';
import { useReviewModal } from '$/composables/goods/detailComposable';
import MMpaginator from '@/components/Paginator.vue';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const MMCarousel = defineAsyncComponent(() => import('@/components/Carousel.vue'));

const vContentsLineClamp = {
    mounted: (el: HTMLElement, binding: DirectiveBinding<{ setFlag: (flag: boolean) => void}>) => {
        if (el.scrollHeight > el.clientHeight) {
            return binding.value.setFlag(true);
        }
        binding.value.setFlag(false);
    }
}

const props = withDefaults(defineProps<{
    goodsId: number
    aggregateInfo: AggregateReviewAndQna
    optionalReviewInfo: OptionalReviewStatistics[]
    isWritableReview: boolean
}>(), {
    optionalReviewInfo: () => [],
    isWritableReview: false,
})

const { isUser, router } = usePageContext();

/** VARIABLE */
const { isWritableReview, goodsId } = toRefs(props);
const { globalConfigs } = useGlobalConfigs()
const { myPointRule } = useMyPointRule()
const photoReviewAmount = ref<number>(myPointRule.value.photoReviewPoint);
const textReviewAmount = ref<number>(myPointRule.value.textReviewPoint);
const bestReviews = ref<Review[]>([]);
const reviewListEl = ref<HTMLElement>();
const { setImage } = useZoomImages();
        
// 개인화 사용 여부
const isUsePersonalization = ref<boolean>(globalConfigs.value.paidFeatures.personalization);

const { setReviewModalInfo } = useReviewModal();

const reviewFilter = ref({
    page: 1,
    perPage: 10,
    sort: 'recent',
    onlyPhotoReview: false,
})

const sortOptions = [
    {
        label: '최신순',
        value: 'recent',                
    },
    {
        label: '별점 높은순',
        value: 'rate_high'
    },
    {
        label: '별점 낮은순',
        value: 'rate_low'
    },
]
const reviewPaginator = ref<ReviewPaginator>({
    total: 0,
    currentPage: 1,
    perPage: 10,
    data: []
});

const isReadMore = ref<boolean>(false);

const switchOnReviewId = ref<number>(0);

// 리뷰 콘텐츠 말 줄임 처리 flag 리스트
const reviewContentsLineClampFlags = ref<boolean[]>([]);

const isDrag = ref(false);        

const recentPhotoReviewList = ref<{
    id: number,
    writerId: string,
    imageUrl: string
}[]>([]);

/** FUNCTION */
async function fetchReview() {
    mmon.loading.show();
    try {
        reviewPaginator.value = await goodsRepository.fetchReviews(goodsId.value, reviewFilter.value);
    } catch(e) {

    } finally {
        mmon.loading.hide();
    }
}

async function movePage(page: number) {
    reviewFilter.value.page = page;
    await fetchReview();
}

function reviewWrite() {
    if (isUser.value === false) {
        return mmon.bom.alert('상품 구매 회원만 리뷰 작성이 가능합니다.');
    }
            
    if (isWritableReview.value === false) {
        return mmon.bom.alert('상품 구매 후 구매확정된 주문만 리뷰 작성 가능합니다.');
    }

    router.push({
        name: 'MypageReviewWritable',
    })
}

/**
 * 베스트 리뷰 상세 모달에서 필요한 정보 SET && OPEN
 */
async function bestReviewDetailModalOpen(event: Event) {
    if (isDrag.value === true) {
        return;
    }

    const targetEl = event.target as HTMLElement;
    if (targetEl == null) {
        return;
    }

    const reviewId = targetEl.closest('a')?.dataset.id;
    if (reviewId === '') {
        event.preventDefault();
        return;
    }

    await setReviewModalInfo({
        reviewId: Number(reviewId),
        totalCount: bestReviews.value.length,
        firstReviewId: Number(bestReviews.value[bestReviews.value.length - 1].id),
        lastReviewId: Number(bestReviews.value[0]?.id),
    });

    return location.href = "#GOODS_DETAIL_BEST_REVIEW"
}

// 리뷰 콘텐츠 말 줄임 처리 flag 세팅
function setContentsLineClampFlag(flag: boolean) {
    reviewContentsLineClampFlags.value.push(flag);
}

// 리뷰 콘텐츠 말줄임 내용 열기/닫기
function toggleContentsLineClamp (reviewId: number) {
    if (!switchOnReviewId.value) {
        return switchOnReviewId.value = reviewId
    }
            
    switchOnReviewId.value = 0
}

/** VUE LIFE CYCLE */
onMounted(async () => {
    try {
        // 기타 항목 패치                 
        await fetchReview();                
        const [bestReview, photoReview] = await Promise.all([
            goodsRepository.bestReviews(goodsId.value), 
            goodsRepository.photoReviewList(goodsId.value)
        ])                                
        bestReviews.value = bestReview;
        recentPhotoReviewList.value = photoReview.data
    } catch (e) {
        console.log(e);
    }
});
</script>