<template>
    <div class="mm_page-content-body">
        <h5 class="mm_heading">
            <b>주문 관리</b>
        </h5>
        <!-- 탭메뉴 -->
        <div class="mm_tab_menu">
            <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
            <ul class="mm_flex T=equal">
                <li>
                    <MMLink
                        class="S=tab-on"
                        title="선택됨"
                        :to="{ name: 'GuestMyPageOrderList' }"
                    >
                        <b>주문</b>
                    </MMLink>
                </li>
                <li>
                    <MMLink :to="{ name: 'GuestMyPageCancelList' }">
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
            v-if="orders.length < 1"
            class="mm_text-none"
        >
            <i class="ico_text-none" />주문 내역이 없습니다
        </p>
        <div
            v-else
            class="mm_order-list"
        >
            <article
                v-for="order in orders"
                :key="order.orderId"
                class="mm_order-item"
            >
                <h5><b>{{ MMFilters.formatDate(order.orderedAt, "YYYY.MM.DD") }}</b><strong>주문번호: {{ order.orderId }}</strong></h5>
                <MMLink 
                    class="btn_detail"
                    :to="{ name: 'GuestMyPageOrderDetail', params: { id: order.orderId } }"
                >
                    <b>주문 상세보기</b><i class="ico_link" />
                </MMLink>
                <template v-for="pack in order.packs" :key="pack.shippingRuleId">
                    <div v-for="seller in pack.sellers" :key="seller.id" class="mm_order-item-seller">
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
                                        {{ orderItem.orderStatusLabel }}
                                    </p>
                                    <MMSimpleGoods
                                        :goods="orderItem.goods"
                                        class="T=single"
                                    />
                                    <p class="text_price">
                                        <strong>{{ MMFilters.formatNumber(orderItem.paidPrice) }}</strong>
                                    </p>
                            
                                    <div class="mm_btn_box">
                                        <div class="mm_block">
                                            <MMLink 
                                                v-if="orderItem.cancelable"
                                                class="mm_btn T=sm T=line T=light" 
                                                :to="{ name: 'GuestMyPageCancel', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                            >
                                                <b>주문취소</b>
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
                                                v-if="orderItem.purchaseConfirmable" 
                                                class="mm_btn T=sm T=line T=variable" 
                                                href="#" 
                                                @click.prevent="openPurchaseConfirmModal(orderItem, seller.name)"
                                            >
                                                <b>구매확정</b>
                                            </a>
                                            <MMLink 
                                                v-if="orderItem.exchangeable" 
                                                class="mm_btn T=sm T=line T=light" 
                                                :to="{ name: 'GuestMyPageExchange', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                            >
                                                <b>교환신청</b>
                                            </MMLink>
                                            <MMLink 
                                                v-if="orderItem.returnable"
                                                class="mm_btn T=sm T=line T=light" 
                                                :to="{ name: 'GuestMyPageReturn', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                            >
                                                <b>반품신청</b>
                                            </MMLink>
                                            <a
                                                v-if="orderItem.deliveryTrackable"
                                                class="btn_tracking"
                                                :href="orderItem.deliveryTrackingUrl"
                                                target="_blank"
                                                title="새 창 열림"
                                            ><b>배송조회</b><i class="ico_link T=circle" /></a>
                                        </div>
                                    </div>
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
<script setup lang="ts">
import moment from 'moment'
import { mmon } from '$/helper/mmon';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import PurchaseConfirm from '@/components/modal/member/PurchaseConfirm.vue';
import { onMounted, ref } from 'vue';
import { myOrderRepository } from '$/repository/myOrder/orderRepository';
import { MyOrder } from '$/@type/myOrder/order';
import { NormalOrderItem } from '$/@type/myOrder/item';
import { defaultCatch } from '$/functions';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useModal } from '$/composables/pageHandler/modalComposable';


usePageTitleSetting('주문 관리', ['마이페이지']);

const orders = ref<MyOrder<NormalOrderItem>[]>([]);

/**
 * 주문 리스트 조회
 */
async function fetchOrders() {
    try {
        orders.value = await myOrderRepository.getList(moment().subtract(1, 'year'), moment(), 0);
    } catch (e) {
        defaultCatch(e);
    }
}

/**
 * 구매확정 모달 open
 * @param orderItem 주문상품 정보
 * @param sellerName 판매자명
 */
function openPurchaseConfirmModal (orderItem: NormalOrderItem, sellerName: string) {
    useModal().open(PurchaseConfirm, {
        title: '구매 확정',
        name: 'PurchaseConfirm',
        props: {
            orderItem: orderItem,
            sellerName: sellerName,
        },
        onClose: async() => {
            await fetchOrders();
        }
    })
}

/**
 * 수취확인 처리
 * @param orderItemId 주문상품 id
 */
function confirmReceipt (orderItemId: number) {
    mmon.bom.confirm('수취 확인 시 배송 완료 처리되며 되돌릴 수 없습니다. 수취 확인을 하시겠습니까?', async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }

        try {
            await myOrderRepository.confirmReceipt(orderItemId);
            await fetchOrders()
        } catch (e) {
            defaultCatch(e);
        }
    })
}

onMounted(async () => {
    mmon.loading.show();
    await fetchOrders();
    mmon.loading.hide();
});
</script>