import { ref } from 'vue';
import { defineStore } from 'pinia'

type TempOrder = {
    option_id: number;
    ea: number;
}

export const useOrderStore = defineStore('order', () => {
    const forOrderOptions = ref<TempOrder[]>([]);
    
    const forRemoveCartIds = ref<{
        orderId: string,
        cartIds: number[]
    }[]>([]);
    
    function setPrepareOrderOptions(selectedOptions: TempOrder[]) {        
        forOrderOptions.value = selectedOptions
    }

    function setRemoveCartIds() {
        
    }


    return {
        forOrderOptions,        
        forRemoveCartIds,
        setPrepareOrderOptions,
        setRemoveCartIds,
    }
}, 
{
    persistedState: {
        storage: sessionStorage,
    }
})