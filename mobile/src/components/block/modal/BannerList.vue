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
                        <!-- (D) 팝업의 구조는 솔루션 _layoutPopup 과 동일하며, 블록 내부 내용을 붙일 때는 data-mui 구조부터 넣어주세요. -->
                        <div :data-mui="blockName">
                            <ul class="m_banner-list">
                                <li v-for="banner in bannerList" :key="banner.id">
                                    <MMBanner :banner="banner" />
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
import MMBanner from '@/components/block/Banner.vue'
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
        blockName,
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
