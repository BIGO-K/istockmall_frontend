import { ref } from 'vue';
import { defineStore } from 'pinia'
import { RegistEvent } from '$/@type/auth/user';

const key = 'register'

export const useRegisterStore = defineStore(key, () => {
    /** VARIABLE */
    const registEventsInfo = ref<RegistEvent[]>([]);

    const registCompleteId = ref<string|undefined>(undefined);
    /** //VARIABLE **/

    /** FUNCTION **/
    function completeRegister(registEvents: RegistEvent[], loginId?: string) {
        registEventsInfo.value = registEvents;

        if (loginId) {
            registCompleteId.value = loginId;
        }
    }

    function clearCompleteRegister() {
        registEventsInfo.value = []
        registCompleteId.value = undefined;
    }
    /** //FUNCTION **/

    return {
        registEventsInfo,
        completeRegister,
        clearCompleteRegister,
        registCompleteId
    }
}, {
    persistedState: {
        storage: sessionStorage
    }
})