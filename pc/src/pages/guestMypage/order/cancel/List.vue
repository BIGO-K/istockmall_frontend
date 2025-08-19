<template>
    <div class="mm_page-content-body">
        <h5 class="mm_heading">
            <b>주문 관리</b>
        </h5>
        <!-- 탭메뉴 -->
        <div class="mm_tab_menu">
            <ul class="mm_flex T=equal">
                <li>
                    <MMLink :to="{ name: 'GuestMyPageOrderList' }">
                        <b>주문</b>
                    </MMLink>
                </li>
                <li>
                    <MMLink
                        class="S=tab-on"
                        title="선택됨"
                        :to="{ name: 'GuestMyPageCancelList' }"
                    >
                        <b>취소</b>
                    </MMLink>
                </li>
                <li>
                    <MMLink :to="{ name: 'GuestMyPageReturnList' }">
                        <b>반품</b>
                    </MMLink>
                </li>
                <li>
                    <MMLink :to="{ name: 'GuestMyPageExchangeList' }">
                        <b>교환</b>
                    </MMLink>
                </li>
            </ul>
        </div>
        <!--// 탭메뉴 -->

        <!-- 주문 목록 -->
        <p
            v-if="cancelOrders.length < 1"
            class="mm_text-none"
        >
            <i class="ico_text-none" />취소 내역이 없습니다
        </p>
        <div
            v-else
            class="mm_order-list"
        >
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
                        <ul>
                            <li
                                v-for="orderItem in seller.orderItems"
                                :key="orderItem.id"
                            >
                                <div class="mm_flex">
                                    <p class="text_status">
                                        {{ orderItem.orderStatusLabel }}<br><b
                                            v-if="orderItem.refundStatusLabel"
                                            class="mm_tag T=bg"
                                        >{{ orderItem.refundStatusLabel }}</b>
                                    </p>
                                    <MMSimpleGoods
                                        :goods="orderItem.goods"
                                        class="T=single"
                                    />
                                    <p class="text_price">
                                        <strong>{{ MMFilters.formatNumber(orderItem.paidPrice) }}</strong>
                                    </p>
                                    <div class="mm_btn_box" />
                                </div>
                            </li>
                        </ul>
                    </div>
                </template>
            </article>
        </div>
    <!--// 주문 목록 -->
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import moment from 'moment'
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { MyOrder } from '$/@type/myOrder/order';
import { CancelOrderItem } from '$/@type/myOrder/item';
import { cancelRepository } from '$/repository/myOrder/cancelRepository';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('취소 관리', ['주문 관리', '마이페이지']);
const cancelOrders = ref<MyOrder<CancelOrderItem>[]>([]);   // 취소 주문 리스트

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