import { Tokenable } from "$/@type/auth/findResult";
import { useNow } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePasswordConfirmTokenStore = defineStore('passwordConfirmToken', () => {
    const token = ref<string>('');
    const expireAt = ref<string>('');

    const expired = computed<boolean>(() => {
        if (!expireAt.value) {
            return false;
        }
        
        return (new Date(expireAt.value).getTime() - useNow().value.getTime()) < 0
    });

    function setToken(newToken: Tokenable) {
        token.value = newToken.token;
        expireAt.value = newToken.expireAt;
    }

    return {
        token,
        expireAt,
        expired,
        setToken,
    }
}, {
    persistedState: {
        persist: true,
        storage: sessionStorage
    }
})