<template>
    <!-- 주문목록 정렬 -->
    <div class="m_myorder-sort">
        <MMSelect v-model="searchPeriodMonth" :class="'T=sm'" @change="fetchOrders">
            <option v-for="month in [1,3,6,12]" :key="month" :value="month">
                최근 {{ (month/12) >= 1 ? `${Math.floor(month/12)} 년` : `${month}개월` }}
            </option>
        </MMSelect>
    </div>
    <!--// 주문목록 정렬 -->
    <p v-if="isFetchedFinished && cancelOrders.length < 1" class="mm_text-none">
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
                :to="{ name: 'MypageOrderDetail', params: { id: order.orderId } }"
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
                        <a 
                            href="#SELLER_QNA_CREATE"
                            @click.capture="setSellerQnaModalData(order.orderId, seller)"
                        >
                            <b>판매자 문의하기</b>
                        </a>
                    </div>
                    <div class="mm_product-list T=sm">
                        <ul>
                            <li v-for="orderItem in seller.orderItems" :key="orderItem.id">
                                <MMOrderGoods :goods="orderItem.goods" :price="orderItem.paidPrice + orderItem.pointUsed">
                                    <template #order-status>
                                        <p class="text_status">
                                            {{ orderItem.orderStatusLabel }}<b v-if="orderItem.refundStatusLabel" class="text_refund">{{ orderItem.refundStatusLabel }}</b>
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
import { computed, ref, onBeforeMount } from 'vue';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { MyOrder } from '$/@type/myOrder/order';
import { CancelOrderItem } from '$/@type/myOrder/item';
import { cancelRepository } from '$/repository/myOrder/cancelRepository';
import MMLink from '@/components/MMLink.vue';
import MMSelect from '@/components/input/Select.vue'
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useSellerQnaCreateModalPopup } from '$/composables/mypage/sellerQnaComposable';

usePageTitleSetting('취소관리', ['주문관리', '마이페이지']);
const searchPeriodMonth = ref<number|string>(1);
const isFetchedFinished = ref(false);
const searchStartAt = computed<moment.Moment>(() => {
    return moment().subtract(searchPeriodMonth.value, 'month');
});
const cancelOrders = ref<MyOrder<CancelOrderItem>[]>([]);

const { setSellerQnaModalData } = useSellerQnaCreateModalPopup()

onBeforeMount(async () => {
    mmon.loading.show();
    try {
        await fetchOrders();    
    } catch(e) {

    } finally {
        mmon.loading.hide();
        isFetchedFinished.value = true;
    }
})

// 취소 주문 조회
async function fetchOrders() {
    try {
        cancelOrders.value = await cancelRepository.getList(searchStartAt.value, moment());   
    } catch (e) {
        defaultCatch(e)
    }
}
</script>
