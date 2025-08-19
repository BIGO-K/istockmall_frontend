
<template>
    <ModalPopup>
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
                                    <i><img v-lazyload="{ src: imageUrl }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="포토리뷰 상세 이미지"></i>
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
import { useZoomImages } from '$/composables/shoppingComposable';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { historyBack } from '$/functions';

const { zoomImages } = useZoomImages();
const router = useRouter();

const reviewImages = ref<string[]>([]);

onMounted(async() => {
    if(zoomImages.value.length < 1) {
        historyBack(router);
    }
    reviewImages.value = zoomImages.value;
})

</script>


