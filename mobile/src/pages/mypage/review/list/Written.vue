<template>
    <p v-if="reviews.total < 1" class="mm_text-none">
        <i class="ico_text-none" />작성한 리뷰가 없습니다
    </p>
    <div v-else class="m_myreview">
        <!-- 리뷰목록 -->
        <div class="m_myreview-written">
            <ul>
                <li v-for="(review, index) in reviews.data" :key="review.id">
                    <div class="mm_product-item T=single-sm">
                        <MMLink :to="{ name: 'GoodsDetail', params: { id: review.orderItem.goods.id } }">
                            <figure>
                                <i v-lazyload="{ src: review.orderItem.goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                <figcaption>
                                    <p class="text_brand">
                                        {{ review.orderItem.goods.brandName }}
                                    </p>
                                    <p class="text_product">
                                        {{ review.orderItem.goods.name }}
                                    </p>
                                    <p class="text_option">
                                        {{ review.orderItem.goods.optionName }} / {{ review.orderItem.goods.ea }}개
                                    </p>
                                </figcaption>
                            </figure>
                        </MMLink>
                    </div>
                    <div :class="['mm_review', switchOnReviewId === review.id ? 'S=switch-on' : '']">
                        <div class="mm_review-head">
                            <p class="text_star">
                                <i class="ico_star-fill" /><span>{{ review.rate }}</span>
                            </p>
                        </div>
                        <p class="text_review" tabindex="0" @click="reviewContentsLineClampFlags[index] ? toggleContentsLineClamp(review.id) : () => {}">
                            <b v-contents-line-clamp="{ setFlag: setContentsLineClampFlag }" v-html="MMFilters.nlToBr(review.contents)" />
                            <span 
                                v-if="reviewContentsLineClampFlags[index]" 
                                class="mm_btn T=line T=dark" 
                            ><i class="ico_toggle" /></span>
                        </p>
                        <ul v-if="review.imageUrls.length" class="mm_review-image">
                            <li v-for="imageUrl in review.imageUrls" :key="imageUrl">
                                <a href="#ZOOM_REVIEW_IMAGE" @click="setImage(review.imageUrls)">
                                    <i class="image_review"><img v-lazyload="{ src: imageUrl, isRatio: true }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""></i>
                                </a>
                            </li>
                        </ul>
                        <p class="text_date">
                            {{ MMFilters.formatDate(review.createdAt, 'YYYY.MM.DD') }}
                        </p>
                        <div v-if="isUsePersonalization" class="mm_satisfy">
                            <dl v-for="template in review.templates" :key="template.id">
                                <dt>{{ template.title }}</dt>
                                <dd>{{ template.selectedLabel }}</dd>
                            </dl>
                        </div>
                        <div class="mm_review-foot">
                            <p v-if="!review.isPhotoReview" class="m_myreview-tooltip">
                                포토 등록 시
                                <strong class="mm_text-secondary">
                                    {{ MMFilters.formatNumber(myReviewPointSetting.photoReviewPoint - myReviewPointSetting.textReviewPoint) }}
                                    {{ pointLabel.suffix }}
                                </strong>
                                추가
                            </p>
                            <a class="btn_modify" href="" @click.prevent="openEditModal(review)"><i class="ico_review-write" /><b>리뷰 수정하기</b></a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!--// 리뷰목록 -->

        <!-- 페이지네이션 -->
        <MMPaginator
            v-if="reviews.total > 0"
            :page-block-type="'group'"
            :page-block-count="20"
            :current-page="reviews.currentPage"
            :items-per-page="reviews.perPage"
            :total-count="reviews.total"
            @move-page-to="movePage"
        />
        <!--// 페이지네이션 -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, DirectiveBinding } from 'vue';
import { reviewRepository } from "$/repository/reviewRepository";
import { useReviewEdit } from "$/composables/mypage/reviewComposable";
import { defaultCatch } from "$/functions";
import { PointLabel } from "$/@type/member/point";
import { useMyPointRule } from "$/composables/globalConfigComposable";
import { Paginator } from "$/@type";
import { Review } from "$/@type/member/review";
import { mmon } from "$/helper/mmon";
import MMPaginator from "@/components/Paginator.vue";
import { useZoomImages } from '$/composables/shoppingComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const vContentsLineClamp = {
    mounted: (el: HTMLElement, binding: DirectiveBinding<{ setFlag: (flag: boolean) => void }>) =>  {
        if (el.scrollHeight > el.clientHeight) {
            return binding.value.setFlag(true);
        }
        binding.value.setFlag(false);
    }
}

const {
    route,
    router,
    globalConfigs
} = usePageContext()
const { myPointRule: myReviewPointSetting } = useMyPointRule();
const { setReviewEditModalData } = useReviewEdit();
const { setImage } = useZoomImages();
usePageTitleSetting('작성한 리뷰', ['리뷰 관리', '마이페이지']);

/** VARIABLE */
const shopName = ref<string>(globalConfigs.value.shop.name);
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);
const isUsePersonalization = ref<boolean>(globalConfigs.value.paidFeatures.personalization);

//리뷰 콘텐츠 말줄임 처리 flag 리스트
const reviewContentsLineClampFlags = ref<boolean[]>([]);

// 작성한 리뷰 목록
const reviews = ref<Paginator<Review>>({
    total: 0,
    currentPage: 1,
    perPage: 20,
    data: [],
});

const switchOnReviewId = ref<number>(0);
const page = ref<number>(1);
/** .. VARIABLE */

/** FUNCTION */
// 작성된 리뷰리스트 조회
async function fetchReviews() {
    mmon.loading.show();
    try {
        reviews.value = await reviewRepository.getList(page.value);

        router.replace({
            path: route.path,
            query: { page: page.value },
        });
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

async function refreshReviewList(e: HashChangeEvent) {
    const before = e.oldURL.split("#")[1] ?? "";
    const after = e.newURL.split("#")[1] ?? "";
    if (before === "REVIEW_EDIT" && after === "") {
        page.value = 1;
        await fetchReviews();
    }

    if (before === "ZOOM_REVIEW_IMAGE" && after === "") {
        page.value = 1;
        await fetchReviews();
    }
}

// 리뷰 콘텐츠 말줄임 처리 flag 세팅
function setContentsLineClampFlag(flag: boolean) {
    reviewContentsLineClampFlags.value.push(flag);
}

// 리뷰 콘텐츠 말줄임 내용 열기/닫기
function toggleContentsLineClamp(reviewId: number) {
    if (!switchOnReviewId.value) {
        return (switchOnReviewId.value = reviewId);
    }

    switchOnReviewId.value = 0;
}

async function movePage(nextPage: number) {
    page.value = nextPage;
    await fetchReviews();
}

function openEditModal(review: Review) {
    if (!review.isEditable) {
        return mmon.bom.alert(`기존 ${shopName.value}에서 작성하신 \n 리뷰는 수정 할 수 없습니다.`);
    }
            
    setReviewEditModalData(review);
    window.location.hash = '#REVIEW_EDIT'
}
/** // FUNCTION */

/** VUE LIFE CYCLE */
onMounted(async () => {
    page.value = Number(route.query.page) || 1;
    await fetchReviews();

    window.addEventListener("hashchange", refreshReviewList);
});

onBeforeUnmount(() => {
    window.removeEventListener("hashchange", refreshReviewList);
});
/** // VUE LIFE CYCLE */

</script>
