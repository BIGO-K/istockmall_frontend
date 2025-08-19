import { ref, computed, nextTick } from 'vue';
import { defineStore } from 'pinia'
import { ModalLayer } from '$/@type/Modal';

const key = 'modal'


export const useModalStore = defineStore(key, () => {
    const forOpenModals = ref<ModalLayer[]>([]);

    function addModal(target: ModalLayer) {
        const legacyModal = forOpenModals.value.find((layer) => layer.isActive);
        if (legacyModal) {
            legacyModal.isActive = false;
        }


        const sameModal = forOpenModals.value.find((layer) => layer.name === target.name) 
        if (sameModal) {
            forOpenModals.value = forOpenModals.value.filter((layer) => layer.name !== target.name);
            return nextTick().then(() => {
                forOpenModals.value = forOpenModals.value.concat(target);    
            })
        }
        forOpenModals.value = forOpenModals.value.concat(target);    
    }

    function removeModal(targetName: string) {
        forOpenModals.value = forOpenModals.value.filter((openingModal) => openingModal.name !== targetName);        
        if (forOpenModals.value.length > 0)  {
            forOpenModals.value[forOpenModals.value.length - 1].isActive = true;
        }
    }

    return {
        forOpenModals,  
        addModal,
        removeModal
    }
}, {
    persistedState: {
        persist: false
    }
})