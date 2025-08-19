import { ShippingAddressForm } from '$/@type/shipping';
import { ShippingAddress } from '$/@type/order/order';
import { ClaimableOrderItem, ExchangeToReturnableOrderItem, NormalOrderItem, OrderItem, OrderItemSet } from "$/@type/myOrder/item";
import { Ref, ref, watch, WatchCallback, WatchStopHandle } from "vue";
import { ClaimDetailOrderItem } from '$/@type/myOrder/detail';


// 옵션변경모달 데이터
const orderItemSelectModalData: {
    orderItems: Ref<ClaimableOrderItem[]>
    orderItemSetId: Ref<number>
    sellerName: Ref<string>
    valueKeyName: Ref<keyof ClaimableOrderItem|keyof ExchangeToReturnableOrderItem>
} = {
    orderItems: ref<ClaimableOrderItem[]>([]),
    orderItemSetId: ref<number>(0),
    sellerName: ref<string>(''),
    valueKeyName: ref<keyof ClaimableOrderItem>('id'),
}
const selectedOrderItemIds = ref<Record<number, number[]>>({});

/**
 * 주문상품 부분선택 기능
 */
export function useOrderItemSelect() {
    /**
     * 주문상품 부분선택 모달 데이터 초기화
     */
    const clearOrderItemSelectModalData = () => {
        orderItemSelectModalData.orderItems.value = [];
        orderItemSelectModalData.orderItemSetId.value = 0;
        orderItemSelectModalData.sellerName.value = '';
        orderItemSelectModalData.valueKeyName.value = 'id';
    }

    /**
     * 선택된 주문상품 데이터 초기화
     */
    const clearSelectedOrderItemIds = () => {
        selectedOrderItemIds.value = {};
    }

    return {
        orderItemSelectModalData,
        selectedOrderItemIds,
        clearOrderItemSelectModalData,
        clearSelectedOrderItemIds,
    }
}

const newShippingAddress = ref<ShippingAddress|null>(null);
const shippingAddressWatcher = ref<WatchStopHandle[]>([]);
/**
 * 배송지 변경 기능
 */
export function useShippingAddressEdit(watcher?: WatchCallback<ShippingAddress|undefined, ShippingAddress|undefined>) {
    if (watcher) {
        // 기존 watcher 해제
        shippingAddressWatcher.value.forEach(unwatch => { return unwatch() });
        // 새로운 watcher 등록
        shippingAddressWatcher.value.push(
            watch(newShippingAddress, watcher)
        )
    } 

    /**
     * 배송지변경 모달 데이터 초기화
     */
    const clearShippingAddressEditModal = () => {
        newShippingAddress.value = null;
    }
    
    return {
        newShippingAddress,
        clearShippingAddressEditModal,
    }
}

// 구매확정 모달 데이터
const purchaseConfirmModalData: {
    orderItem: Ref<NormalOrderItem>
    sellerName: Ref<string>,
    needConfirm: Ref<boolean>
} = {
    orderItem: ref<NormalOrderItem>(),
    sellerName: ref<string>(''),
    needConfirm: ref<boolean>(false)
}
/**
 * 구매확정 기능
 */
export function usePurchaseConfirm() {
    const setPurchaseConfirmModalData = (orderItem: NormalOrderItem, sellerName: string, needConfirm = false) => {
        purchaseConfirmModalData.orderItem.value = orderItem;
        purchaseConfirmModalData.sellerName.value = sellerName;
        purchaseConfirmModalData.needConfirm.value = needConfirm;
    }

    return {
        purchaseConfirmModalData,
        setPurchaseConfirmModalData
    }
}

// 영수증 모달 데이터
const receiptModalData: {
    orderId: Ref<string>
    ordererName: Ref<string>
    goodsName: Ref<string>
} = {
    orderId: ref<string>(''),
    ordererName: ref<string>(''),
    goodsName: ref<string>(''),
}
// 영수증 기능
export function useReceiptModal() {
    // 영수증 모달 데이터 세팅
    const setReceiptModalData = (orderId: string, ordererName: string, goodsName: string) => {
        receiptModalData.orderId.value = orderId;
        receiptModalData.ordererName.value = ordererName;
        receiptModalData.goodsName.value = goodsName;
    }

    return {
        receiptModalData,
        setReceiptModalData
    }
}

// 비회원 배송지
const guestAddress = ref<Omit<ShippingAddressForm, "shippingName">>({
    zipCode: '',
    name: '',
    tel: '',
    baseAddress: '',
    detailAddress: ''
});
// 비회원 > 배송지 변경 모달 기능
export function guestAddressEditModal(watcher?: WatchCallback<ShippingAddress|undefined, ShippingAddress|undefined>) {
    if (watcher) {
        // 기존 watcher 해제
        shippingAddressWatcher.value.forEach(unwatch => { return unwatch() });
        // 새로운 watcher 등록
        shippingAddressWatcher.value.push(
            watch(guestAddress, watcher)
        )
    } 

    /**
     * 배송지 변경 모달 데이터 초기화
     */
    const resetNewAddressData = () => {
        shippingAddressWatcher.value.forEach(unwatch => { return unwatch() });
        guestAddress.value = {
            zipCode: '',
            name: '',
            tel: '',
            baseAddress: '',
            detailAddress: ''
        }
    }
    return {
        guestAddress,
        resetNewAddressData
    }
}

/**
 * 주문상품 묶음기능
 * @returns 
 */
export function useOrderItemSet() {
    function groupByOrderItemSet<T extends ClaimableOrderItem, S extends ClaimableOrderItem|ClaimDetailOrderItem>(orderItems: S[]): OrderItemSet<T>[] {
        const result:{
            [orderItemSetId: string]: OrderItemSet<T>
        } = {};

        orderItems
            .map((item: T|S) => {
                // claim detail order item은 claim된 주문이기에 order status code 받지 않음
                // 기본값 처리
                return Object.assign({}, {
                    orderStatusCode: 0,
                    orderStatusLabel: '',
                }, item) as T;
            })
            .forEach((item: T) => {
                const deepClonedOrderItem = JSON.parse(JSON.stringify(item));
                const targetKey = `${item.goods.id}_${item.goods.optionId}_${item.orderStatusCode || ''}`
                
                // 동일 상품/옵션/배송상태인 주문상품 리스트에 없는경우
                if (!result[targetKey]) {
                    const newOrderItemSet: OrderItemSet<T> = {
                        id: item.id,
                        orderStatusLabel: item.orderStatusLabel || '',
                        orderStatusCode: item.orderStatusCode,
                        goods: {
                            id: item.goods.id,
                            name: item.goods.name,
                            brandName: item.goods.brandName,
                            thumbnailUrl: item.goods.thumbnailUrl,
                            optionName: item.goods.optionName,
                            isSoldout: item.goods.isSoldout,
                            optionId: item.goods.optionId,
                            ea: 0,   // 수량 합계 초기화
                        },
                        totalPaidPrice: 0, // 실결제가 합계 초기화
                        totalPointUsed: 0,  // 포인트 분배액 합계 초기화
                        items: [],
                        sellerName: item.sellerName || ''
                    }
                    
                    result[targetKey] = newOrderItemSet;
                }

                // 동일 상품/옵션/배송상태 묶음에 주문상품 리스트 추가, 총실결제가, 총사용적립금 계산, 주문갯수 합산
                if (deepClonedOrderItem.hasOwnProperty('exchangedOptionName')) {
                    Object.assign(deepClonedOrderItem, {
                        exchangeOption: {
                            name: deepClonedOrderItem.exchangedOptionName
                        }
                    })
                }
                result[targetKey].items.push(deepClonedOrderItem)
                result[targetKey].totalPaidPrice += item.paidPrice;
                result[targetKey].totalPointUsed += item.pointUsed;
                result[targetKey].goods.ea += 1;
            });

        return Object.values(result);
    }
    
    return {
        groupByOrderItemSet,
    }
}