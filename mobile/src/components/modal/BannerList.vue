<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>{{ popupTitle || '전체보기' }}</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-category-banner">
                            <ul>
                                <li v-for="banner in bannerList" :key="banner.id">
                                    <MMLink :to="banner.link || ''">
                                        <figure>
                                            <i v-lazyload="{ src: banner.imageUrl }" class="mm_bg-cover image_banner" :alt="banner.alt" />
                                            <figcaption :class="banner.colorCode === '#000000' ? 'T=text-black' : ''">
                                                <p v-if="!banner.text1 && !banner.text2 && !banner.text3" class="mm_ir-blind">
                                                    이미지 대체텍스트
                                                </p>
                                                <template v-else>
                                                    <p class="text_main">
                                                        {{ banner.text1 }}
                                                    </p>
                                                    <p class="text_main">
                                                        {{ banner.text2 }}
                                                    </p>
                                                    <p class="text_sub">
                                                        {{ banner.text3 }}
                                                    </p>
                                                </template>
                                            </figcaption>
                                        </figure>
                                    </MMLink>
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
import { useBannersPopup } from '$/composables/blockComposable'
import { onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useModalPopup } from '$/composables/pageHandler/modalComposable';
const router = useRouter()
const {
    clearBannersPopup, 
    bannersPopupData: {
        bannerList,
        popupTitle,
    } 
} = useBannersPopup()
const { clearModalPopup } = useModalPopup()
onMounted(() => {
    if ((bannerList.value?.length) < 1) {
        clearModalPopup();
        router.replace(router.currentRoute.value.fullPath.replaceAll(location.hash, ''));
    }
});
onBeforeUnmount(() => {
    clearBannersPopup();
});
</script>