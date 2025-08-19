import { ref } from 'vue';
import { defineStore } from 'pinia'
import { MonsAlert } from '$/@type/front';
import ApplicationError from '$/errors/ApplicationError';

const key = 'error'

export const useErrorStore = defineStore(key, () => {

    const alertInfo = ref<MonsAlert[]>([]);
    const applicationError = ref<ApplicationError|null>(null);
    const needLoadingBar = ref<boolean>(false);
    
    function applyAlert(info: MonsAlert) {
        return alertInfo.value = alertInfo.value.concat(info);
    }

    function closeAlert(info: MonsAlert) {
        alertInfo.value = alertInfo.value.filter((alert) => {
            return alert.uuid !== info.uuid
        });
    }

    function applyError(error: ApplicationError) {
        applicationError.value = error;
    }

    function clearError() {
        applicationError.value = null
    }

    function toggleLoadingBar(toggle: boolean) {
        needLoadingBar.value = toggle
    }

    return {
        alertInfo,
        applicationError,
        needLoadingBar,
        applyAlert,
        closeAlert,
        applyError,
        clearError,
        toggleLoadingBar
    }
}, {
    persistedState: {
        persist: false
    }
})