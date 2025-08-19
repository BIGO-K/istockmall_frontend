<template>
    <p v-if="exchangeOrders.length < 1" class="mm_text-none">
        <i class="ico_text-none" />교환 내역이 없습니다
    </p>
    <div v-else class="mm_order-list">
        <article 
            v-for="order in exchangeOrders"
            :key="order.exchangeId"
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
                <b>주문 상세보기</b><i class="ico_link" />
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
                                        <p class="text_changed">
                                            <strong class="mm_text-variable">변경된 옵션</strong>
                                            <span>{{ orderItem.exchangedOptionName }} / 1개</span>
                                        </p>
                                        <div class="mm_btn_box">
                                            <div class="mm_flex T=equal">
                                                <button 
                                                    v-if="orderItem.exchangeCancelable" 
                                                    type="button"
                                                    class="mm_btn T=sm T=line"
                                                    @click="cancelExchange(order.exchangeId, orderItem.exchangeTargetId)"
                                                >
                                                    <b>교환철회</b>
                                                </button>
                                                <MMLink 
                                                    v-if="orderItem.toReturnSwitchable"
                                                    class="mm_btn T=sm T=line"
                                                    :to="{ name: 'GuestMyPageOrderExchangeToReturn', params: { exchange_id: order.exchangeId }}"
                                                >
                                                    <b>반품전환</b>
                                                </MMLink>
                                                <a 
                                                    v-if="orderItem.returnDeliveryTrackable" 
                                                    class="mm_btn T=sm T=line T=variable" 
                                                    :href="getOutIntentPath(orderItem.returnDeliveryTrackingUrl)"
                                                    target="_blank"
                                                >
                                                    <b>반송조회</b>
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
import moment from 'moment';
import { ref, onMounted } from 'vue';
import { ExchangeOrder } from '$/@type/myOrder/order';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { exchangeRepository } from '$/repository/myOrder/exchangeRepository';
import MMLink from '@/components/MMLink.vue';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import { getOutIntentPath } from '$/filters';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('교환관리', ['주문관리', '마이페이지']);
// 교환 주문 리스트
const exchangeOrders = ref<ExchangeOrder[]>([]);

onMounted(async () => {
    mmon.loading.show();
    await fetchOrders();
    mmon.loading.hide();
});

/**
 * 교환주문리스트 조회
 * @param page 페이지 번호
 */
async function fetchOrders() {
    try {
        exchangeOrders.value = await exchangeRepository.getList(moment().subtract(1, 'year'), moment());
    } catch (e) {
        defaultCatch(e);
    }
}

/**
 * 교환 철회
 * @param exchangeId 교환주문ID
 * @param exchangeTargetId 교환주문내 주문상품 식별값
 */
function cancelExchange(exchangeId: string, exchangeTargetId: number) {
    mmon.bom.confirm('교환 신청을 철회하시겠습니까?', async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }

        try {
            await exchangeRepository.cancelExchange(exchangeId, exchangeTargetId);
            await fetchOrders();
        } catch (e) {
            defaultCatch(e)
        }
    });
}
</script>
