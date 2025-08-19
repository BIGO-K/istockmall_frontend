<template>
    <p v-if="orders.length < 1" class="mm_text-none">
        <i class="ico_text-none" />주문 내역이 없습니다
    </p>
    <div v-else class="mm_order-list">
        <article 
            v-for="order in orders"
            :key="order.orderId"
            class="mm_order-item"
        >
            <h5>
                <b>{{ MMFilters.formatDate(order.orderedAt, "YYYY.MM.DD") }}</b>
                <strong>주문번호: {{ order.orderId }}</strong>
            </h5>
            <MMLink 
                class="btn_detail"
                :to="{ name: 'GuestMyPageOrderDetail', params: { id: order.orderId } }"
            >
                <b>주문상세</b><i class="ico_link" />
            </MMLink>
            <template v-for="pack in order.packs" :key="pack.shippingRuleId">
                <div 
                    v-for="seller in pack.sellers"
                    :key="seller.id"
                    class="mm_order-item-seller"
                >
                    <div class="mm_order...seller-head">
                        <h5><i class="ico_shop" /><b>{{ seller.name }}</b></h5>
                    </div>
                    <div class="mm_product-list T=sm">
                        <ul>
                            <li v-for="orderItem in seller.orderItems" :key="orderItem.id">
                                <MMOrderGoods :goods="orderItem.goods" :price="orderItem.paidPrice">
                                    <template #order-status>
                                        <p class="text_status">
                                            {{ orderItem.orderStatusLabel }}
                                        </p>
                                    </template>
                                    <template #footer>
                                        <div class="mm_btn_box">
                                            <div class="mm_flex T=equal">
                                                <MMLink 
                                                    v-if="orderItem.cancelable"
                                                    class="mm_btn T=sm T=line"
                                                    href="#"
                                                    :to="{ name: 'GuestMyPageOrderCancel', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                                >
                                                    <b>주문취소</b>
                                                </MMLink>
                                                <MMLink 
                                                    v-if="orderItem.exchangeable"
                                                    class="mm_btn T=sm T=line"
                                                    href="#"
                                                    :to="{ name: 'GuestMyPageOrderExchange', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                                >
                                                    <b>교환신청</b>
                                                </MMLink>
                                                <MMLink 
                                                    v-if="orderItem.returnable"
                                                    class="mm_btn T=sm T=line"
                                                    href="#"
                                                    :to="{ name: 'GuestMyPageOrderReturn', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                                >
                                                    <b>반품신청</b>
                                                </MMLink>
                                                <button 
                                                    v-if="orderItem.receiptConfirmable" 
                                                    type="button" 
                                                    class="mm_btn T=sm" 
                                                    @click="confirmReceipt(orderItem.id)"
                                                >
                                                    <b>수취확인</b>
                                                </button>
                                                <a 
                                                    v-if="orderItem.deliveryTrackable" 
                                                    class="mm_btn T=sm T=line T=variable" 
                                                    :href="getOutIntentPath(orderItem.deliveryTrackingUrl)" 
                                                    target="_blank" 
                                                    title="새 창 열림"
                                                ><b>배송조회</b>
                                                </a>
                                                <a 
                                                    v-if="orderItem.purchaseConfirmable" 
                                                    class="mm_btn T=sm T=variable"
                                                    href="#PURCHASE_CONFIRM"
                                                    @click.capture="setPurchaseConfirmModalData(orderItem, seller.name)"
                                                ><b>구매확정</b>
                                                </a>
                                            </div>
                                        </div>
                                    </template>
                                </MMOrderGoods>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
        </article>
    </div>
</template>

<script setup lang='ts'>
import moment from 'moment'
import { NormalOrderItem } from '$/@type/myOrder/item';
import { MyOrder } from '$/@type/myOrder/order';
import { usePurchaseConfirm } from '$/composables/mypage/order/myOrderComposable';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { myOrderRepository } from '$/repository/myOrder/orderRepository';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import { getOutIntentPath } from '$/filters';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('주문관리', ['마이페이지']);
// 리스트
const orders = ref<MyOrder<NormalOrderItem>[]>([]);

const { setPurchaseConfirmModalData } = usePurchaseConfirm();

onMounted(async () => {
    mmon.loading.show();
    await fetchOrders()
    mmon.loading.hide();

    window.addEventListener('hashchange', refreshOrderList);
});

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', refreshOrderList);
})

// 구매확정 후 리스트 재조회
async function refreshOrderList(event: HashChangeEvent) {
    const before = event.oldURL.split('#')[1] ?? '';
    const after = event.newURL.split('#')[1] ?? '';
    
    if (before === 'PURCHASE_CONFIRM' && after === '') {
        await fetchOrders();
    }
}

/**
 * 주문리스트 조회
 * @param page 페이지번호
 */
async function fetchOrders() {
    try {
        orders.value = await myOrderRepository.getList(moment().subtract(1, 'year'), moment(), 0);
    } catch (e) {
        defaultCatch(e);
    }
}

/**
 * 수취 확인 처리
 * @param orderItemId 주문상품 ID
 */
function confirmReceipt(orderItemId: number) {
    mmon.bom.confirm('수취 확인 시 배송 완료 처리되며 되돌릴 수 없습니다. 수취 확인을 하시겠습니까?', async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }

        try {
            await myOrderRepository.confirmReceipt(orderItemId);
            await fetchOrders();
        } catch (e) {
            defaultCatch(e);
        }
    })
}
</script>
