import { ClaimableOrderItem, ExchangeToReturnableOrderItem, OrderItemSet } from "$/@type/myOrder/item";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useOrderItemSelectModalStore = defineStore('orderItemSelectModal', () => {
    /** VARIABLE **/
    
    /**
     * 주문상품 리스트
     */
    const orderItems = ref<ClaimableOrderItem[]>([]);
    /**
     * 주문상품묶음 ID
     */
    const orderItemSetId = ref<number>(0);

    /**
     * 셀러명
     */
    const sellerName = ref<string>('');

    /**
     * 주문상품 식별값 PROPERTY명
     * @desc 기본값은 주문상품 ID, 교환주문 반품전환의 경우에는 교환상품ID가 식별값으로 사용됩니다.
     */
    const valueKeyName = ref<keyof ClaimableOrderItem|keyof ExchangeToReturnableOrderItem>('id');
    
    /** //VARIABLE **/

    /** FUNCTION **/

    /**
     * 주문상품 부분선택 모달 데이터 세팅
     * @param orderItemSet 주문상품묶음
     */
    function setModalData<T extends ClaimableOrderItem>(
        newOrderItemSet: OrderItemSet<T>, 
        newSellerName: string, 
        newValueKeyName?: keyof ClaimableOrderItem|keyof ExchangeToReturnableOrderItem
    ) {
        if (newOrderItemSet.items.length < 2) {
            return;
        }
        // 부분선택 모달 데이터 세팅
        orderItems.value = newOrderItemSet.items; 
        orderItemSetId.value = newOrderItemSet.id; 
        sellerName.value = newSellerName;
        valueKeyName.value = newValueKeyName || 'id';
    }

    /** //FUNCTION **/

    return {
        orderItems, 
        orderItemSetId, 
        sellerName, 
        valueKeyName,
        setModalData,
    }

}, {
    persistedState: {
        persist: false,
    },
})