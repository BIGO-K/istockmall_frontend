
import { ref } from 'vue';
import { defineStore } from 'pinia'

const key = 'pcMode'

export const usePcModeStore = defineStore(key, () => {
    
    const isPcModeOn = ref<boolean>(false);

    function turnOnPcMode() {
        isPcModeOn.value = true;
    }

    return {
        isPcModeOn,
        turnOnPcMode
    }
}, {
    persistedState: {
        storage: sessionStorage,
    },
})