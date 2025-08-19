
<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>포토리뷰</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-image-detail">
                            <ul>
                                <li v-for="imageUrl in reviewImages" :key="imageUrl">
                                    <i><img v-lazyload="{ src: imageUrl }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""></i>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import MMPopup from '@/components/layout/Popup.vue';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { reviewRepository } from '$/repository/reviewRepository';
const route = useRoute();
const reviewId = Number(route.params.id.toString());
const reviewImages = ref<string[]>([]);

onMounted(async() => {
    reviewImages.value = await reviewRepository.reviewImageZoom(reviewId);
})

</script>
