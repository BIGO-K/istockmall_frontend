<template>
    <template v-if="isMainPopupShow">
        <NormalA 
            v-if="mainBanners.length > 0 && mainPopupType === 'normal' && mainPopupVersion === 'A'"
            :main-banners="mainBanners"
            @close-popup="closePopup"
        />
        <NormalB 
            v-if="mainBanners.length > 0 && mainPopupType === 'normal' && mainPopupVersion === 'B'"
            :main-banners="mainBanners"
            @close-popup="closePopup"
        />
        <ToastA 
            v-if="mainBanners.length > 0 && mainPopupType === 'toast' && mainPopupVersion === 'A'"
            :main-banners="mainBanners"
            @close-popup="closePopup"
        />
        <ToastB
            v-if="mainBanners.length > 0 && mainPopupType === 'toast' && mainPopupVersion === 'B'"
            :main-banners="mainBanners"
            @close-popup="closePopup"
        />
        <ToastC
            v-if="mainBanners.length > 0 && mainPopupType === 'toast' && mainPopupVersion === 'C'"
            :main-banners="mainBanners"
            @close-popup="closePopup"
        />
    </template>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, defineAsyncComponent, onUnmounted } from 'vue';
import { mainBannerRepository } from '$/repository/mainBannerRepository';
import { defaultCatch } from '$/functions';
import { MainBanner } from '$/@type/mainBanner';
import { InitialSettings } from '$/@type/configs';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { useClosePopup } from '$/composables/popupComposable'

const NormalA = defineAsyncComponent(() => import('@/components/modal/mainPopup/NormalA.vue'));
const NormalB = defineAsyncComponent(() => import('@/components/modal/mainPopup/NormalB.vue'));
const ToastA = defineAsyncComponent(() => import('@/components/modal/mainPopup/ToastA.vue'));
const ToastB = defineAsyncComponent(() => import('@/components/modal/mainPopup/ToastB.vue'));
const ToastC = defineAsyncComponent(() => import('@/components/modal/mainPopup/ToastC.vue'));

const emit = defineEmits(['mainPopupHandler']);

/** VARIABLE */
const mainBanners = ref<MainBanner[]>([]);    
const { globalConfigs } = useGlobalConfigs();
const isMainPopupShow = ref<boolean>(false);
const mainPopupType = ref<InitialSettings['design']['mobileMainPopupType']>(globalConfigs.value.design.mobileMainPopupType);
const mainPopupVersion = ref<InitialSettings['design']['mobileMainPopupVersion']>(globalConfigs.value.design.mobileMainPopupVersion);
const { setPopupContext } = useClosePopup() 

/** FUNCTION */
/**
 * 팝업 열기
 */
function openPopup() {
    document.documentElement.classList.add("S=noscroll");
    isMainPopupShow.value = true;    
}

/**
 * 팝업 닫기
 */
function closePopup(isHideOnDay: boolean) {
    // [오늘 하루 그만보기] 여부 쿠키 저장
    if (isHideOnDay) {
        setPopupContext('IS_MAIN_POPUP_HIDE', true)
    } 

    document.documentElement.classList.remove("S=noscroll");
    isMainPopupShow.value = false;
    emit('mainPopupHandler');
}

/** VUE LIFE CYCLE */
onBeforeMount(async() => {
    try {
        mainBanners.value = await mainBannerRepository.getMainPopup();
                
        // 노출 해야 하는 팝업 있을 경우에만 실행.
        if (mainBanners.value.length > 0) {
            openPopup();
        }
    } catch (error) {
        defaultCatch(error);
    }
})

onUnmounted(() => {
    document.documentElement.classList.remove("S=noscroll");
});
</script>