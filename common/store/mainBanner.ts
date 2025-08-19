import { defineStore } from "pinia";
import { ref } from "vue";

export const useMainBannerStore = defineStore('mainBanner', () => {
    const isHideTopBanner = ref<boolean>(false);

    function hideTopBanner() {
        isHideTopBanner.value = true;
    }

    return {
        isHideTopBanner,
        hideTopBanner,
    }
}, {
    persistedState: {
        persist: true,
        storage: sessionStorage
    }
})