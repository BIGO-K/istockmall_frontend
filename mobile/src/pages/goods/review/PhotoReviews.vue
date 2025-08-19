<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>포토리뷰 전체</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-review-photo">
                            <ul>
                                <li v-for="photoReview in photoReviewPaginator.data" :key="photoReview.id">
                                    <a href="javascript:;" @click.prevent="photoReviewDetailModalOpen(photoReview.id)">
                                        <i v-lazyload="{ src : photoReview.imageUrl }" class="mm_bg-cover image_review" />
                                        <b class="mm_ir-blind">{{ photoReview.writerId }}님의 포토리뷰</b>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { PhotoReviewPaginator } from '$/@type/goods';
import { goodsRepository } from '$/repository/goodsRepository';
import { useReviewModal } from '$/composables/goods/detailComposable';
import ModalPopup from '@/components/layout/ModalPopup.vue';


const route = useRoute();
const goodsId = Number(route.params.id.toString());
const { setReviewModalInfo } = useReviewModal();

const photoReviewPaginator = ref<PhotoReviewPaginator>({
    total: 0,
    currentPage: 1,
    perPage: 10,
    data: []
});

/**
 * 포토리뷰 상세 모달에서 필요한 정보 SET
 *
 * @param reviewId
 */
function photoReviewDetailModalOpen(reviewId: number) {
    setReviewModalInfo({
        reviewId: reviewId,
        totalCount: photoReviewPaginator.value.total,
        firstReviewId: photoReviewPaginator.value.data[photoReviewPaginator.value.total - 1].id,
        lastReviewId: photoReviewPaginator.value.data[0].id,
    });

    return location.href = "#PHOTO_REVIEW_DETAIL"
}

/** VUE LIFE CYCLE */
onMounted(async() => {
    try {
        photoReviewPaginator.value = await goodsRepository.photoReviewList(goodsId);
    } catch (e) {
        console.log(e)
    }
})

</script>
