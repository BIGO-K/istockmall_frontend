<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>사이즈 가이드</b></h1>
        </template>

        <template #contents>    
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-size">
                            <p v-if="sizeGuideImages.length === 0 || isAllImageEmpty" class="mm_text-none">
                                <i class="ico_text-none" />등록된 사이즈 차트가 없습니다
                            </p>
                            <ul v-else>
                                <li v-for="imageUrl in sizeGuideImages" :key="imageUrl">
                                    <i>
                                        <img
                                            v-lazyload="{ src: imageUrl, errorCallback: errorHandle }" 
                                            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                            alt=""
                                        >
                                    </i>
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
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { ref, onMounted } from 'vue';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { useSellerSizeChart } from '$/composables/shoppingComposable';
import { useRouter } from "vue-router";

const router = useRouter();
const { forSizeChartSellerId } = useSellerSizeChart();

const sizeGuideImages = ref<string[]>([]);
const errorImageCount = ref(0);
const isAllImageEmpty = ref(true);

function errorHandle() {
    errorImageCount.value = ++errorImageCount.value;
    if (errorImageCount.value === sizeGuideImages.value.length) {
        isAllImageEmpty.value = true;
    }
}

onMounted(async()=> {
    if (forSizeChartSellerId.value !== undefined) {
        sizeGuideImages.value = await shoppingRepository.sizeGuidImages(forSizeChartSellerId.value);
        isAllImageEmpty.value = sizeGuideImages.value.length < 1;
    }
    else {
        router.go(-1);
    }
})
</script>

