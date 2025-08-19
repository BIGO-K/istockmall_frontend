import { ref } from 'vue';
import { BaseGoods } from '$/@type/goods';
import { defineStore } from 'pinia';
import { PopupContext } from '$/@type/front';

const key = 'popup';

export const usePopupStore = defineStore(key, () => {
    // IS_MAIN_POPUP_HIDE
    // IS_NAVER_COUPON_HIDE_
    // IS_TIMEDEAL_BANNER_HIDE

    const popupContexts = ref<PopupContext[]>([]);
  
    function applyPopupContext(todayClosePopup: PopupContext) {
        popupContexts.value = popupContexts.value
            .filter(popupContext => todayClosePopup.key !== popupContext.key)
            .concat([todayClosePopup])
    }

    return {
        popupContexts,
        applyPopupContext
    }
})