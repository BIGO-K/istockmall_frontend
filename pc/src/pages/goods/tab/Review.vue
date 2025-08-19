<template>
    <div class="m_prodetail-tab-review">
        <p
            v-if="aggregateInfo.reviewerCount > 0"
            class="text_satisfy"
        >
            <i class="ico_star" />
            <span>{{ aggregateInfo.reviewAverageStars }}</span>
            <strong v-text="`${MMFilters.formatNumber(aggregateInfo.totalReviewCount)}명`" />의 고객님이 리뷰를 남겨주셨고,
            <strong class="mm_text-secondary">{{ aggregateInfo.satisfaction }}%</strong>가 만족하셨습니다.
        </p>

        <!-- 상품 평가 -->
        <div
            v-if="isUsePersonalization && optionalReviewInfo.length > 0"
            :class="['mm_flex T=equal m...review-value', { 'T=value-shoes' : optionalReviewInfo.length > 3 }]"
        >
            <section
                v-for="template, index in optionalReviewInfo"
                :key="template.id"
            >
                <h6>
                    <b>{{ template.title }}</b>
                    <strong>{{ highestSubDivision[index].label }}</strong>
                    <span>{{ highestSubDivision[index].selectedRate }}%<small>({{ MMFilters.formatNumber(highestSubDivision[index].selectedCount) }}명)</small></span>
                </h6>
                <ul>
                    <li
                        v-for="sub in template.subDivisionList"
                        :key="sub.id"
                        :class="sub.isHighest ? 'S=value-high' : ''"
                    >
                        <span class="text_label">{{ sub.label }}</span>
                        <b class="m...review-value-progress">
                            <i
                                :style="`width:${sub.selectedRate}%;`"
                                :title="`${sub.selectedRate}%`"
                            />
                        </b>
                        <span>{{ MMFilters.formatNumber(sub.selectedCount) }}명</span>
                    </li>
                </ul>
            </section>
        </div>
        <!--// 상품 평가 -->

        <div class="mm_flex m...review-info">
            <p>리뷰를 작성하시면 최대 {{ MMFilters.formatNumber(photoReviewAmount) }} {{ MMFilters.applyZosa(pointLabel.name + '(을/를)') }} 적립해드립니다.</p>
            <ul>
                <li><i class="ico_photo" />포토 리뷰<b><strong>{{ MMFilters.formatNumber(photoReviewAmount) }}</strong><sub>원</sub></b></li>
                <li v-if="textReviewAmount !== undefined">
                    <i class="ico_write" />텍스트 리뷰<b><strong>{{ MMFilters.formatNumber(textReviewAmount) }}</strong><sub>원</sub></b>
                </li>
            </ul>
            <a
                class="mm_btn T=primary"
                href="#"
                @click.prevent="reviewWrite"
            ><b>리뷰 작성하기</b></a>
        </div>

        <!-- 리뷰 없을때 -->
        <template v-if="aggregateInfo.reviewerCount === 0 && reviewPaginator.data.length < 1">
            <p class="mm_text-none">
                <i class="ico_text-none" />등록된 리뷰가 아직 없습니다
            </p>
        </template>
        <template v-else>
            <!-- 베스트 리뷰 -->
            <div
                v-if="bestReviews.length > 0"
                class="m...review-best"
            >
                <h5><b>베스트 리뷰</b></h5>
                <Slider
                    :items="bestReviews"
                    :use-control="true"
                    :use-count="true"
                    :use-control-small-icon="true"
                    :item-additional-class="`m...review-best-item`"
                    :style-text-align="`left`"
                    :slider-data="{ '_isLoop': true }"
                    @click="openBestReviewModal"
                >
                    <template #item="{ item }">
                        <a :data-review-id="item.id" href="javascript:;">
                            <div class="m...item-content">
                                <b class="text_user">
                                    <i
                                        v-lazyload="{ src : item.writerGradeImageUrl, useErrorImage: false }"
                                        class="mm_bg-cover"
                                        :title="item.writerGradeLabel"
                                    />{{ item.writerId }}</b>
                                <b class="text_star"><i class="ico_star" /><span>{{ item.rate }}</span></b>
                                <span class="text_date">{{ item.createdAt }}</span>
                                <p class="text_review">{{ item.contents }}</p>
                            </div>
                            <div
                                v-if="item.isPhotoReview"
                                class="m...item-image"
                            >
                                <i
                                    v-lazyload="{ src: item.imageUrls[0] }"
                                    class="mm_bg-cover image_review"
                                    :data-lazyload="`{ '_src': '${item.imageUrls[0]}' }`"
                                />
                                <!-- (D) 등록된 포토 리뷰가 2장 이상 일 때 노출합니다 -->
                                <b
                                    v-if="item.photoCount > 1"
                                    class="text_more"
                                >
                                    <i class="ico_plus" />{{ item.photoCount }}
                                </b>
                            </div>
                        </a>
                    </template>
                </Slider>
            </div>
            <!--// 베스트 리뷰 -->
            <!-- 리뷰 리스트 -->
            <div ref="reviewListEl" class="m...review-list">
                <h5 class="mm_strapline">
                    <b>전체 리뷰수</b><strong>{{ MMFilters.formatNumber(reviewPaginator.total) }}</strong>
                </h5>
                <!-- 포토리뷰 -->
                <div
                    v-if="recentPhotoReviewList.length > 0"
                    class="m...review-list-photo"
                >
                    <ul>
                        <li v-for="recentPhotoReview, index in recentPhotoReviewList.slice(0, 10)" :key="index">
                            <template v-if="index === 9 && recentPhotoReviewList.length > 10">
                                <a
                                    href="#"
                                    @click.prevent="allPhotoReviewModalOpen()"
                                >
                                    <b>포토리뷰 더보기</b>
                                    <b>+{{ recentPhotoReviewList.length - 10 }}</b>
                                    <i
                                        v-lazyload="{ src: recentPhotoReview.imageUrl }"
                                        class="mm_bg-cover image_review"
                                    />
                                </a>
                            </template>
                            <template v-else>
                                <a
                                    href="#"
                                    @click.prevent="photoDetailModalOpen(recentPhotoReview.id)"
                                >
                                    <b class="mm_ir-blind">{{ recentPhotoReview.writerId }}님의 포토리뷰</b>
                                    <i
                                        v-lazyload="{ src: recentPhotoReview.imageUrl }"
                                        class="mm_bg-cover image_review"
                                    />
                                </a>
                            </template>
                        </li>
                    </ul>
                </div>
                <!--// 포토리뷰 -->
                <!-- 전체리뷰 -->
                <div class="m...review-list-unit">
                    <label class="mm_form-check">
                        <input
                            v-model="reviewFilter.onlyPhotoReview"
                            type="checkbox"
                            data-check
                            @change="fetchReview"
                        >
                        <b class="mm_block">
                            <i class="ico_form-check" />
                            <span class="text_label">포토리뷰</span>
                        </b>
                    </label>
                    <!-- (D) 선택된 정렬메뉴에 'S=sort-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                    <ul>
                        <li v-for="sortOption, index in sortOptions" :key="index">
                            <a
                                :class="{ 'S=sort-on' : sortOption.value === reviewFilter.sort }"
                                href="#"
                                title="선택됨"
                                @click.prevent="() => { reviewFilter.sort = sortOption.value; fetchReview(); }"
                            >
                                <b>{{ sortOption.label }}</b>
                            </a>
                        </li>
                    </ul>
                </div>
                <p
                    v-if="reviewFilter.onlyPhotoReview && reviewPaginator.data.length < 1"
                    class="mm_text-none"
                >
                    <i class="ico_text-none" />등록된 포토리뷰가 아직 없습니다
                </p>
                <ul v-else>
                    <li v-for="review in reviewPaginator.data" :key="review.id">
                        <div class="m...review-item">
                            <p class="text_user">
                                <b
                                    v-if="review.isExperienceGroup"
                                    class="mm_tag T=bg T=dark"
                                ><i class="ico_experience" />체험단</b>
                                <i
                                    v-lazyload="{ src: review.writerGradeImageUrl, useErrorImage: false }"
                                    class="mm_bg-cover"
                                    :title="review.writerGradeLabel"
                                />{{ review.writerId }}
                            </p>
                            <p class="text_star">
                                <i class="ico_star" /><span>{{ review.rate }}</span>
                            </p>
                            <p class="text_info">
                                {{ review.optionName }}
                                <span v-if="isUsePersonalization && review.physical">{{ review.physical }}</span>
                            </p>
                            <div
                                v-if="isUsePersonalization"
                                class="mm_satisfy"
                            >
                                <dl
                                    v-for="template in review.templates"
                                    :key="template.id"
                                >
                                    <dt>{{ template.title }}</dt>
                                    <dd>{{ template.selectedLabel }}</dd>
                                </dl>
                            </div>
                            <p class="text_review" v-html="MMFilters.nlToBr(review.contents)" />
                            <ul
                                v-if="review.isPhotoReview"
                                class="m...review-item-photo"
                            >
                                <li v-for="reviewImage, reviewIndex in review.imageUrls" :key="reviewIndex">
                                    <a
                                        href="#"
                                        @click.prevent="zoomModalOpen(review.imageUrls, reviewImage)"
                                    >
                                        <i
                                            v-lazyload="{ src: reviewImage }"
                                            class="mm_bg-cover image_review"
                                        />
                                        <b class="mm_ir-blind">이미지 확대보기</b>
                                    </a>
                                </li>
                            </ul>
                            <p class="text_date">
                                {{ MMFilters.formatDate(review.createdAt, 'YYYY.MM.DD') }}
                            </p>
                        </div>
                    </li>
                </ul>
                <!--// 전체리뷰 -->

                <!-- 페이지네이션 -->
                <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                <mm-paginator
                    :page-block-type="'group'"
                    :page-block-count="10"
                    :current-page="reviewPaginator.currentPage"
                    :items-per-page="reviewPaginator.perPage"
                    :total-count="reviewPaginator.total"
                    :scroll-y-target="reviewListEl"
                    @move-page-to="movePage"
                />
                <!--// 페이지네이션 -->
            </div>
            <!--// 리뷰 리스트 -->
        </template>
    </div>
</template>

<script setup lang='ts'>
import { goodsRepository } from '$/repository/goodsRepository';
import { onMounted, ref, toRefs, computed, onActivated } from 'vue'
import { Review, ReviewPaginator, AggregateReviewAndQna, OptionalReviewStatistics } from '$/@type/goods';
import { mmon } from '$/helper/mmon';
import { PointLabel } from '$/@type/member/point';
import { useGlobalConfigs, useMyPointRule } from '$/composables/globalConfigComposable';
import ReviewImageModal from '@/components/modal/review/Image.vue';
import BestReviewModal from '@/components/modal/review/BestReview.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import MmPaginator from '@/components/Paginator.vue';
import Slider from '@/components/Slider.vue';
import PhotoDetail from '@/components/modal/review/PhotoDetail.vue';
import AllPhoto from '@/components/modal/review/AllPhoto.vue';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const props = defineProps<{
    goodsId: number,
    aggregateInfo: AggregateReviewAndQna,
    optionalReviewInfo: OptionalReviewStatistics[],
    isWritableReview: boolean
}>();

/** VARIABLE */
const { globalConfigs } = useGlobalConfigs();
const { myPointRule } = useMyPointRule();
const { router, isUser } = usePageContext();

const { optionalReviewInfo, isWritableReview, goodsId } = toRefs(props);
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);
// 개인화 사용 여부
const isUsePersonalization = ref<boolean>(globalConfigs.value.paidFeatures.personalization);
const photoReviewAmount = ref<number>(myPointRule.value.photoReviewPoint);
const textReviewAmount = ref<number>(myPointRule.value.textReviewPoint);

const bestReviews = ref<Review[]>([]);
const reviewListEl = ref<HTMLElement|undefined>(undefined);

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

const highestSubDivision = computed(()=> {
    if (optionalReviewInfo.value.length < 1) {
        return [];
    }
    return optionalReviewInfo.value.map((reviewInfo)=> {
        return reviewInfo.subDivisionList.find((subDivision)=> {
            return subDivision.isHighest;
        }) || reviewInfo.subDivisionList[0]
    });
})

const recentPhotoReviewList = ref<{
    id: number,
    writerId: string,
    imageUrl: string
}[]>([]);

async function fetchReview() {
    reviewPaginator.value = await goodsRepository.fetchReviews(goodsId.value, reviewFilter.value);
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
 * 베스트 리뷰 상세모달 OPEN
 *
 * @param {Event} event
*/
function openBestReviewModal(event: PointerEvent) {
    const eventTarget = event.target as HTMLElement;
    const target = eventTarget.closest("[data-review-id]") as HTMLElement;
    if (target == null) {
        return;
    }
    useModal().open(BestReviewModal, {
        title: '베스트 리뷰',
        name: 'BestReview',
        itemClass: 'm_modal-prodetail-review',
        props: {
            reviews: bestReviews,
            reviewId: target.dataset.reviewId ? Number(target.dataset.reviewId) : 0
        }
    })
}
function photoDetailModalOpen(reviewId: number) {
    useModal().open(PhotoDetail, {
        title: '포토 리뷰',
        name: 'PhotoDetail',
        itemClass: 'm_modal-prodetail-review',
        props: async() => {
            const { reviewDetail, nextReviewId, prevReviewId } = await goodsRepository.photoDetailReview(goodsId.value, reviewId)
            return {
                goodsId: goodsId.value,
                reviewDetail,
                nextReviewId,
                prevReviewId
            }
        }

    })
}

function allPhotoReviewModalOpen() {
    useModal().open(AllPhoto, {
        title: '포토 리뷰',
        itemClass: 'm_modal-prodetail-photo',
        name: 'AllPhoto',
        props: async() => {
            const photoReviewPaginator =  await goodsRepository.photoReviewList(goodsId.value, 1);
            return {
                photoReviewPaginator,
                goodsId: props.goodsId,
            }
        }
    })
}

function zoomModalOpen(imageUrl: string[], nowImage: string) {
    useModal().open(ReviewImageModal, {
        title: '포토리뷰',
        name: 'ReviewImageModal',
        itemClass: 'prodetail-zoom',
        props: {
            selectedImageUrl: nowImage,
            imageUrls: imageUrl
        }          
    })
}
/** FUNCTION */



/** VUE LIFE CYCLE */

onMounted(async () => {
    try {
        await fetchReview();
        // 기타 항목 패치
        const [bestReview, photoReview] = await Promise.all(
            [
                goodsRepository.bestReviews(goodsId.value),
                goodsRepository.photoReviewList(goodsId.value)
            ]
        );

        bestReviews.value = bestReview;
        recentPhotoReviewList.value = photoReview.data
    } catch (e) {
        console.log(e);
    }
})

onActivated(() => {
    if (bestReviews.value.length > 0) {
        bestReviews.value = [...bestReviews.value];
    }
})


</script>
