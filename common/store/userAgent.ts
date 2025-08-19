
import { ref } from 'vue';
import { defineStore } from 'pinia'

const key = 'userAgent'

export const useUserAgentStore = defineStore(key, () => {
    
    const deviceInfo = ref<{ 
        uuid: string;
        token: string;
        os: 'A' | 'I'
    }| null>(null);

    const hasUserAccessApp = ref<boolean>(false);

    /** FUNC */
    function applyDeviceInfo(device: { uuid: string, token: string, os: 'A'|'I'}) {
        deviceInfo.value = device;
    }

    function setAccessApp() {
        hasUserAccessApp.value = true;
    }

    return {
       deviceInfo,
       applyDeviceInfo,
       hasUserAccessApp,
       setAccessApp
    }
}, {
    persistedState: {
        storage: sessionStorage,
    },
})