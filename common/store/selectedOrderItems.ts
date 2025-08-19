import { unique } from "$/functions";
import { defineStore } from "pinia";
import { computed, readonly, ref } from "vue";

export const useSelectedOrderItemsStore = defineStore('selectedOrderItems', () => {
    
    /** VARIABLE **/
    /**
     * 주문상품묶음별 선택된 주문상품 ID 리스트
     */
    const selectedOrderItemIdRecords = ref<Record<number|string, number[]>|null>(null);
    /** //VARIABLE **/
    
    /** FUNCTION **/
    /**
     * 선택된 주문상품 개수 조회
     * @param orderItemSetId 주문상품묶음 ID
     * @returns 
     */
    function getPartialSelectedItems(orderItemSetId: number): number[] {
        return selectedOrderItemIdRecords.value?.[orderItemSetId] || [];
    }
    
    /**
     * 주문상품 선택 처리
     * @param orderItemSetId 주문상품묶음 ID
     * @param orderItemIds 주문상품 ID 리스트
     */
    function setSelectedOrderItemIds(orderItemSetId: number, orderItemIds: number[]) {
        if (selectedOrderItemIdRecords.value == null) {
            selectedOrderItemIdRecords.value = {};
        }
        selectedOrderItemIdRecords.value[orderItemSetId] = unique(orderItemIds);
    }
    /** //FUNCTION **/

    return {
        selectedOrderItemIdRecords,
        getPartialSelectedItems,
        setSelectedOrderItemIds,
    }

}, {
    persistedState: {
        persist: false,
    }
})