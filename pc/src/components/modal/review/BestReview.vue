<template>
    <div class="mm_flex">
        <!-- 리뷰사진 -->
        <div
            v-if="review.isPhotoReview"
            class="m_prodetail-thumbnail"
        >
            <i class="image_thumbnail">
                <img
                    v-lazyload="{ src: selectedImageUrl }"
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                    alt="리뷰이미지"
                >
            </i>
            <div class="m_prodetail-thumbnail-list">
                <ul class="mm_flex T=equal">
                    <li v-for="reviewImage, index in (review.imageUrls)" :key="index">
                        <button
                            type="button"
                            :class="['btn_thumbnail', {'S=thumbnail-on' : selectedImageUrl === reviewImage }]"
                            @click="selectedImageUrl = reviewImage"
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
                <p class="text_review">
                    {{ MMFilters.nlToBr(review.contents) }}
                </p>
            </div>
        </div>
        <!--// 리뷰내용 -->
    </div>

    <!-- 리뷰 컨트롤버튼 -->
    <button
        type="button"
        class="btn_control-prev"
        @click="fetchReview(prevIndex)"
    >
        <i class="ico_control-prev" /><b class="mm_ir-blind">이전 리뷰 보기</b>
    </button>
    <button
        type="button"
        class="btn_control-next"
        @click="fetchReview(nextIndex)"
    >
        <i class="ico_control-next" /><b class="mm_ir-blind">다음 리뷰 보기</b>
    </button>
</template>

<script setup lang='ts'>
import { Review } from '$/@type/goods';
import { ref, computed, watch } from 'vue';
import { ModalCloseHandler } from '$/@type/Modal';

const props = defineProps<{
    reviews: Review[],
    reviewId: number,
    closer: ModalCloseHandler<void>
}>();

/** VARIABLE */
const currentIndex = ref<number>(
    props.reviews.findIndex(review => review.id === props.reviewId)
);
const selectedIndex = computed({
    get: () => {
        return currentIndex.value
    },
    set: (index: number) => {
        currentIndex.value = index
    }
});

const reviewLength = computed(() => {
    return props.reviews.length
})

const review = computed(() => {
    const reviewData = props.reviews[selectedIndex.value];
    return reviewData
})

const nextIndex = computed(() => {
    if (reviewLength.value === 1 || selectedIndex.value >= (reviewLength.value - 1)) {
        return 0
    }
    return selectedIndex.value + 1
})

const prevIndex = computed(() => {
    if (selectedIndex.value === 0 && reviewLength.value !== 1) {
        return reviewLength.value - 1;
    }
    else if (selectedIndex.value >= reviewLength.value || reviewLength.value === 1) {
        return reviewLength.value > 1 ? reviewLength.value - 1 : 0;
    }

    return selectedIndex.value - 1
})

const selectedImageUrl = ref('');

watch(review, () => {
    selectedImageUrl.value = review.value.imageUrls[0];
}, {
    immediate: true
})

function fetchReview(index: number) {
    selectedIndex.value = index;
}

/** VUE LIFE CYCLE */

</script>
