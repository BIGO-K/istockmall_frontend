import { IdFindResultInfo } from "$/@type/auth/findResult";
import { useNow } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useIdFindResultStore = defineStore('idFindResult', () => {
    const token = ref<IdFindResultInfo['token']>('')
    const expireAt = ref<IdFindResultInfo['expireAt']>('')
    const idFindResults = ref<IdFindResultInfo['idFindResults']>([])
    const userName = ref<IdFindResultInfo['userName']>('')
    const findType = ref<IdFindResultInfo['findType']>('')
    const email = ref<IdFindResultInfo['email']>('')
    const phone = ref<IdFindResultInfo['phone']>('')

    const expired = computed<boolean>(() => {
        return (new Date(expireAt.value).getTime() - useNow().value.getTime()) < 0
    })

    function setIdFindResultInfo(findResultInfo: IdFindResultInfo) {
        token.value = findResultInfo.token;
        expireAt.value = findResultInfo.expireAt;
        idFindResults.value = findResultInfo.idFindResults;
        userName.value = findResultInfo.userName;
        findType.value = findResultInfo.findType;
        email.value = findResultInfo.email || '';
        phone.value = findResultInfo.phone || '';
    }

    return {
        token,
        expireAt,
        idFindResults,
        userName,
        findType,
        email,
        phone,
        expired,
        setIdFindResultInfo,
    }
}, {
    persistedState: {
        persist: true,
        storage: sessionStorage
    }
})