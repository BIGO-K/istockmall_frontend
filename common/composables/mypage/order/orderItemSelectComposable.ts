import { useOrderItemSelectModalStore } from "$/store/modalPopup/orderItemSelect";
import { useSelectedOrderItemsStore } from "$/store/selectedOrderItems";
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, ref } from "vue";

/**
 * 주문상품 선택기능
 */
export function useCancelOrderItemSelect() {
    /** STORE **/
    const store = useSelectedOrderItemsStore();
    const { selectedOrderItemIdRecords } = storeToRefs(store);
    /** //STORE **/

    /** VARIABLE **/
    /**
     * 선택된 주문상품묶음 ID 리스트
     */
    const checkedOrderItemSetIds = ref<number[]>([]);
    
    /**
     * 주문 내 선택된 전체 주문상품 ID 리스트
     */
    const selectedOrderItemIds = computed<number[]>(() => {
        return checkedOrderItemSetIds.value.map(setId => selectedOrderItemIdRecords.value?.[setId] || []).flat();
    });

    onBeforeUnmount(() => {
        store.$reset();
    })

    return {
        checkedOrderItemSetIds,
        selectedOrderItemIds,
        getPartialSelectedItems: store.getPartialSelectedItems,
        setSelectedOrderItemIds: store.setSelectedOrderItemIds
    }
}

/**
 * 선택된 주문상품 STORE 조회
 */
export function useSelectedOrderItems() {
    /** STORE **/
    const store = useSelectedOrderItemsStore();
    const { selectedOrderItemIdRecords } = storeToRefs(store);
    /** //STORE **/
    
    return {
        selectedOrderItemIdRecords,
        setSelectedOrderItemIds: store.setSelectedOrderItemIds,
        getPartialSelectedItems: store.getPartialSelectedItems,
    }
}

/**
 * 주문상품 선택모달
 */
export function useOrderItemSelectModal() {
    /** STORE **/
    const store = useOrderItemSelectModalStore();
    const { 
        orderItems, 
        orderItemSetId, 
        sellerName, 
        valueKeyName, 
    } = storeToRefs(store);
    /** //STORE **/

    onBeforeUnmount(() => {
        store.$reset();
    })

    return {
        orderItems, 
        orderItemSetId, 
        sellerName, 
        valueKeyName, 
        setOrderItemSelectModalData: store.setModalData
    }
}