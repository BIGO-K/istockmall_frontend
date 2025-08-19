import { Ref, ref } from "vue";
import { ExchangeableOrderItem } from "$/@type/myOrder/item";
import { ExchangeableOrder } from "$/@type/myOrder/order";
import { useOrderItemSet } from "$/composables/mypage/order/myOrderComposable";
import { orderDetailRepository } from "$/repository/myOrder/detailRepository";
import { ExchangeDetail } from "$/@type/myOrder/detail";

// 옵션변경모달 데이터
const exchangeOptionChangeModalData: {
    orderItems: Ref<ExchangeableOrderItem[]>
    sellerName: Ref<string>
    isSameOptionSelectable: Ref<boolean>
} = {
    orderItems: ref<ExchangeableOrderItem[]>([]),
    sellerName: ref<string>(''),
    isSameOptionSelectable: ref<boolean>(false),
}
// 주문상품id별 선택된 옵션 리스트
const selectedOptionList = ref<Record<number, number|string>>({})

/**
 * 옵션변경기능
 */
export function useExchangeOptionChange() {
    const setExchangeOptionSelectModalData = (orderItems: ExchangeableOrderItem[], selerName: string, isSameOptionSelectable: boolean) => {
        exchangeOptionChangeModalData.orderItems.value = orderItems
        exchangeOptionChangeModalData.sellerName.value = selerName
        exchangeOptionChangeModalData.isSameOptionSelectable.value = isSameOptionSelectable
    }

    const resetSelectedOptionList = () => {
        selectedOptionList.value = [];
    }

    return {
        exchangeOptionChangeModalData,
        selectedOptionList,
        setExchangeOptionSelectModalData,
        resetSelectedOptionList
    }
}

/**
 * 교환완료 주문
 * @returns 
 */
export function useExchangedOrder(exchangeId: string) {
    /** VARIABLE **/
    const exchangedOrderPacks = ref<ExchangeableOrder['packs']>([]);
    const { groupByOrderItemSet } = useOrderItemSet();
    /** //VARIABLE **/

    (async () => {
        if (!exchangeId) {
            return;
        }
        
        try {
            const { pack } = await orderDetailRepository.getExchangeDetail(exchangeId);
            const exchangedPack = Object.assign({}, pack, {
                orderItemSets: groupByOrderItemSet<ExchangeableOrderItem, typeof pack.orderItems[0]>(pack.orderItems) 
            })
            exchangedOrderPacks.value = [exchangedPack];
        } catch (e) {
            console.log(e)
        }
    })();

    return {
        exchangedOrderPacks,
    }
}