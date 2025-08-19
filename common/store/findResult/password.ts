import { PasswordFindResult } from "$/@type/auth/findResult";
import { useNow } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePasswordFindStore = defineStore('passwordFindResult', () => {
    const token = ref<PasswordFindResult['token']>('')
    const expireAt = ref<PasswordFindResult['expireAt']>('')
    const loginId = ref<PasswordFindResult['loginId']>('')

    const expired = computed<boolean>(() => {
        return (new Date(expireAt.value).getTime() - useNow().value.getTime()) < 0
    })

    function setFindResultInfo(findResultInfo: PasswordFindResult) {
        token.value = findResultInfo.token;
        expireAt.value = findResultInfo.expireAt;
        loginId.value = findResultInfo.loginId
    }

    return {
        token,
        expireAt,
        loginId,
        expired,
        setFindResultInfo,
    }
}, {
    persistedState: {
        persist: true,
        storage: sessionStorage
    }
})