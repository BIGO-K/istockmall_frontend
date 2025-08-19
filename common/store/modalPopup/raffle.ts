import { defineStore } from "pinia";
import { ref } from "vue";

export const useRaffleModalStore = defineStore('raffleModal', () => {
    const raffleId = ref<number|null>();
    const isRaffleEntry = ref<boolean>(false);

    return {
        raffleId,
        isRaffleEntry
    }

}, {
    persistedState: {
        persist: false,
    }
})