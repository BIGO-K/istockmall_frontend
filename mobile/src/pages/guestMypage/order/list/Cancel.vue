<template>
    <p v-if="cancelOrders.length < 1" class="mm_text-none">
        <i class="ico_text-none" />취소 내역이 없습니다
    </p>
    <div v-else class="mm_order-list">
        <!--동일주문내 취소주문 여러개인경우 orderId가 unique 하지 않을수 있음-->
        <article 
            v-for="(order, index) in cancelOrders"
            :key="`${order.orderId}_${index}`"
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
                                            <b v-if="orderItem.refundStatusLabel" class="text_refund">{{ orderItem.refundStatusLabel }}</b>
                                        </p>
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
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { MyOrder } from '$/@type/myOrder/order';
import { CancelOrderItem } from '$/@type/myOrder/item';
import { cancelRepository } from '$/repository/myOrder/cancelRepository';
import MMLink from '@/components/MMLink.vue';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('취소관리', ['주문관리', '마이페이지']);
const cancelOrders = ref<MyOrder<CancelOrderItem>[]>([]);

onMounted(async () => {
    mmon.loading.show();
    await fetchOrders();
    mmon.loading.hide();
})

// 취소 주문 조회
async function fetchOrders() {
    try {
        cancelOrders.value = await cancelRepository.getList(moment().subtract(1, 'year'), moment());   
    } catch (e) {
        defaultCatch(e)
    }
}
</script>
