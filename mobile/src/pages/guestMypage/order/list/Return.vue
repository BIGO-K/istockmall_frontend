<template>
    <p v-if="returnOrders.length < 1" class="mm_text-none">
        <i class="ico_text-none" />반품 내역이 없습니다
    </p>
    <div v-else class="mm_order-list">
        <article 
            v-for="order in returnOrders"
            :key="order.returnId"
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
                                        <div class="mm_btn_box">
                                            <div class="mm_flex T=equal">
                                                <button
                                                    v-if="orderItem.returnCancelable" 
                                                    type="button"
                                                    class="mm_btn T=sm T=line"
                                                    @click="cancelReturn(order.returnId, orderItem.returnTargetId)"
                                                >
                                                    <b>반품철회</b>
                                                </button>
                                                <a 
                                                    v-if="orderItem.returnDeliveryTrackable" 
                                                    class="mm_btn T=sm T=line T=variable" 
                                                    :href="getOutIntentPath(orderItem.returnDeliveryTrackingUrl)" 
                                                    target="_blank" 
                                                    title="새 창 열림"
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
import { onMounted, ref } from 'vue';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { ReturnOrder } from '$/@type/myOrder/order';
import { returnRepository } from '$/repository/myOrder/returnRepository';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import MMLink from '@/components/MMLink.vue';
import { getOutIntentPath } from '$/filters';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('반품관리', ['주문관리', '마이페이지']);
// 반품 주문 리스트
const returnOrders = ref<ReturnOrder[]>([]);

onMounted(async () => {
    mmon.loading.show();
    await fetchOrders();
    mmon.loading.hide();
});

// 반품 주문 조회
async function fetchOrders() {
    try {
        returnOrders.value = await returnRepository.getList(moment().subtract(1, 'year'), moment());   
    } catch (e) {
        defaultCatch(e)
    }
}

/**
 * 반품 철회
 * @param returnId 반품주문 ID
 * @param returnTargetId 반품주문내 주문상품 식별값
 */
function cancelReturn(returnId: string, returnTargetId: number) {
    mmon.bom.confirm('반품 신청을 철회하시겠습니까?', async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }

        try {
            await returnRepository.cancelReturn(returnId, returnTargetId);
            await fetchOrders();
        } catch (e) {
            defaultCatch(e)
        }
    })
}
</script>
