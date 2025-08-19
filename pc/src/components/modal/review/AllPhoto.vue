<template>
    <!-- 포토리뷰 리스트 -->
    <div class="m...photo-list">
        <ul>
            <li 
                v-for="photoReview in photoReviewPaginator.data" 
                :key="photoReview.id"
            >
                <a
                    href="#"
                    @click.prevent="switchedDetailModal(photoReview.id)"
                >
                    <b class="mm_ir-blind">{{ photoReview.writerId }}님의 포토리뷰</b>
                    <i
                        v-lazyload="{ src : photoReview.imageUrl }"
                        class="mm_bg-cover image_review"
                    />
                </a>
            </li>      
        </ul>
    </div>
    <!--// 포토리뷰 리스트 -->

    <!-- 페이지네이션 -->
    <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
    <mm-paginator
        :page-block-type="'group'"
        :page-block-count="10"
        :current-page="photoReviewPaginator.currentPage"
        :items-per-page="photoReviewPaginator.perPage"
        :total-count="photoReviewPaginator.total"
        @move-page-to="movePage"
    />
    <!--// 페이지네이션 -->
</template>

<script setup lang='ts'>
import { PhotoReviewPaginator } from '$/@type/goods';
import { ref, toRef } from 'vue';
import { goodsRepository } from '$/repository/goodsRepository';
import { ModalCloseHandler } from '$/@type/Modal';
import MmPaginator from '@/components/Paginator.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import PhotoDetail from '@/components/modal/review/PhotoDetail.vue';

const props = defineProps<{
    goodsId: number,
    photoReviewPaginator: PhotoReviewPaginator
    closer: ModalCloseHandler<void>,
}>();

/** VARIABLE */
const photoReviewPaginator = toRef(props, 'photoReviewPaginator');

const currentPage = ref<number>(1);
/** FUNCTION */
async function movePage(page: number) {
    currentPage.value = page;
    await fetchPhotoReviewList();
}

async function fetchPhotoReviewList() {
    photoReviewPaginator.value = await goodsRepository.photoReviewList(props.goodsId, currentPage.value);
}
        
/** VUE LIFE CYCLE */
async function switchedDetailModal(reviewId: number) {
    useModal().open(PhotoDetail, {
        title: '포토 리뷰',
        name: 'PhotoDetail',
        itemClass: 'm_modal-prodetail-review',
        props: async() => {
            const { reviewDetail, nextReviewId, prevReviewId } = await goodsRepository.photoDetailReview(props.goodsId, reviewId)
            return {
                goodsId: props.goodsId,
                reviewDetail,
                nextReviewId,
                prevReviewId
            }
        }

    })
}
</script>