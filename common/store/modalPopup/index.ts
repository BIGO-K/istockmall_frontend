import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalPopupStore = defineStore('modalPopup', () => {
    
    const modalStacks = ref<string[]>([]);
    
    function addModal(componentName: string) {
        modalStacks.value = modalStacks.value
            .filter((originComponent) => originComponent !== componentName)
            .concat([componentName]);
    }

    function removeModal(targetName: string) {
        modalStacks.value = modalStacks.value.filter((modalName) => modalName !== targetName);
    }

    return {
        modalStacks,
        addModal,
        removeModal
    }
}, {
    persistedState: {
        persist: true,
        storage: sessionStorage,
    }
})