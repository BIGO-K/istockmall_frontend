
<template>
    <div class="mm_flex">
        <!-- 리뷰사진 -->
        <div
            v-if="review.isPhotoReview"
            class="m_prodetail-thumbnail"
        >
            <i class="image_thumbnail"><img
                v-lazyload="{ src: selectedImageUrl }"
                src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                alt="리뷰이미지"
            ></i>
            <div class="m_prodetail-thumbnail-list">
                <ul class="mm_flex T=equal">
                    <li v-for="reviewImage, index in (review.imageUrls)" :key="index">
                        <button
                            type="button"
                            :class="['btn_thumbnail', {'S=thumbnail-on' : selectedImageUrl === reviewImage }]"
                            @click="() => { selectedImageUrl = reviewImage }"
                        >
                            <i
                                v-lazyload="{ src: reviewImage }"
                                class="mm_bg-cover"
                            />
                        </button>
                    </li>
                </ul>
            </div>
        </div>
        <!--// 리뷰사진 -->
        <!-- 리뷰내용 -->
        <div class="m...review-item">
            <div class="mm_scroller">
                <div class="m...review-item-head">
                    <p class="text_star">
                        <i
                            class="ico_star"
                            title="별점"
                        /><span>{{ review.rate }}</span>
                    </p>
                    <p class="text_user">
                        <i
                            v-lazyload="{ src: review.writerGradeImageUrl, useErrorImage: false }"
                            class="mm_bg-cover"
                            :title="review.writerGradeLabel"
                        />{{ review.writerId }}
                    </p>
                    <p class="text_info">
                        {{ review.optionName }}
                    </p>
                    <p class="text_date">
                        {{ review.createdAt }}
                    </p>
                </div>
                <p class="text_review" v-html="MMFilters.nlToBr(review.contents)" />
            </div>
        </div>
        <!--// 리뷰내용 -->
    </div>

    <!-- 리뷰 컨트롤버튼 -->
    <button
        type="button"
        :disabled="prevId == null"
        class="btn_control-prev"
        @click="fetchReview(prevId)"
    >
        <i class="ico_control-prev" /><b class="mm_ir-blind">이전 리뷰 보기</b>
    </button>
    <button
        type="button"
        :disabled="nextId == null"
        class="btn_control-next"
        @click="fetchReview(nextId)"
    >
        <i class="ico_control-next" /><b class="mm_ir-blind">다음 리뷰 보기</b>
    </button>
    <button
        type="button"
        class="mm_btn T=line btn_control-back"
        @click="showAllPhotoReviews"
    >
        <i class="ico_review-list" /><b>전체보기</b>
    </button>
    <!--// 리뷰 컨트롤버튼 -->
</template>

<script setup lang='ts'>
import { ModalCloseHandler } from '$/@type/Modal';
import { Review } from '$/@type/goods';
import { ref } from 'vue';
import { goodsRepository } from '$/repository/goodsRepository';
import { defaultCatch } from '$/functions';
import { useModal } from '$/composables/pageHandler/modalComposable';
import AllPhoto from '@/components/modal/review/AllPhoto.vue';

const props = defineProps<{
    reviewDetail: Review,
    goodsId: number,
    nextReviewId: number|null,
    prevReviewId: number|null,
    closer: ModalCloseHandler<void>,
}>()
/** VARIABLE */

const selectedImageUrl = ref<string>(props.reviewDetail.imageUrls[0]);
const review = ref<Review>(props.reviewDetail);
const nextId = ref<number|null>(props.nextReviewId);
const prevId = ref<number|null>(props.prevReviewId);

/** FUNCTION */
async function fetchReview(reviewId: number|null) {
    if (reviewId === null) {
        return;
    }

    try {
        const { reviewDetail, nextReviewId, prevReviewId } = await goodsRepository.photoDetailReview(props.goodsId, reviewId)
        review.value = reviewDetail
        selectedImageUrl.value = review.value?.imageUrls[0] || '';
        nextId.value = nextReviewId;
        prevId.value = prevReviewId;
    } catch (e) {
        defaultCatch(e);
    }
}

function showAllPhotoReviews() {
    useModal().open(AllPhoto, {
        title: '포토 리뷰',
        itemClass: 'm_modal-prodetail-photo',
        name: 'AllPhoto',
        props: async() => {
            const photoReviewPaginator =  await goodsRepository.photoReviewList(props.goodsId, 1);
            return {
                photoReviewPaginator,
                goodsId: props.goodsId,
            }
        }
    })
}
/** VUE LIFE CYCLE */

</script>
