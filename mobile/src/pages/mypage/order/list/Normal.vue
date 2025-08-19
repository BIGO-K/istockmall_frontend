<template>
    <!-- 주문목록 정렬 -->
    <div class="m_myorder-sort">
        <MMSelect v-model="searchPeriodMonth" :class="'T=sm'">
            <option v-for="month in [1,3,6,12]" :key="month" :value="month">
                최근 {{ (month/12) >= 1 ? `${Math.floor(month/12)} 년` : `${month}개월` }}
            </option>
        </MMSelect>
        <MMSelect v-model="orderStatusCode" :class="'T=sm'">
            <option value="">
                주문상태 전체
            </option>
            <option v-for="status in orderStatusCodes" :key="status.code" :value="status.code">
                {{ status.label }}
            </option>
        </MMSelect>
    </div>
    <!-- (D) 주문 필터가 [전체, 배송중, 배송완료] 상태 일때만 노출합니다. -->
    <div v-if="showReviewGuide" class="mm_syncer-order-review S=option-use">
        <div class="mm_note">
            <ul>
                <li>리뷰는 구매확정 시점부터 바로 작성할 수 있습니다.</li>
                <li>구매확정 후 30일 경과 시 리뷰를 작성할 수 없습니다.</li>
                <li>미작성 리뷰는 마이페이지 &gt; 리뷰관리에서 작성하실 수 있습니다.</li>
            </ul>
        </div>
    </div>
    <!--// 주문목록 정렬 -->
    <p v-if="orders.length < 1" class="mm_text-none">
        <i class="ico_text-none" />주문 내역이 없습니다
    </p>
    <div v-else class="mm_order-list">
        <article v-for="order in orders" :key="order.orderId" class="mm_order-item">
            <h5><b>{{ MMFilters.formatDate(order.orderedAt, "YYYY.MM.DD") }}</b><strong>주문번호: {{ order.orderId }}</strong></h5>
            <MMLink 
                class="btn_detail"
                :to="{ name: 'MypageOrderDetail', params: { id: order.orderId } }"
            >
                <b>주문상세</b><i class="ico_link" />
            </MMLink>
            <template v-for="pack in order.packs" :key="pack.shippingRuleId">
                <div v-for="seller in pack.sellers" :key="seller.id" class="mm_order-item-seller">
                    <div class="mm_order...seller-head"> 
                        <h5><i class="ico_shop" /><b>{{ seller.name }}</b></h5>
                        <a href="#SELLER_QNA_CREATE" @click.capture="setSellerQnaModalData(order.orderId, seller)"><b>판매자 문의하기</b></a>
                    </div>
                    <div class="mm_product-list T=sm">
                        <ul>
                            <li v-for="orderItem in seller.orderItems" :key="orderItem.id">
                                <MMOrderGoods :goods="orderItem.goods" :price="orderItem.paidPrice + orderItem.pointUsed">
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
                                                    :to="{ name: 'MypageOrderCancel', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                                >
                                                    <b>주문취소</b>
                                                </MMLink>
                                                <MMLink 
                                                    v-if="orderItem.exchangeable"
                                                    class="mm_btn T=sm T=line"
                                                    href="#"
                                                    :to="{ name: 'MypageOrderExchange', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                                >
                                                    <b>교환신청</b>
                                                </MMLink>
                                                <MMLink 
                                                    v-if="orderItem.returnable"
                                                    class="mm_btn T=sm T=line"
                                                    href="#"
                                                    :to="{ name: 'MypageOrderReturn', params: { order_id: order.orderId, item_id: orderItem.id } }"
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
                                                    @click.capture="setPurchaseConfirmModalData(orderItem, seller.name, needReviewConfirmMessage)"
                                                ><b>구매확정</b>
                                                </a>
                                                
                                                <a 
                                                    v-if="seller.orderItems.map(item => item.reviewWritable).includes(true)"
                                                    class="mm_btn T=sm T=line T=variable"
                                                    href="#REVIEW_CREATE"
                                                    @click.capture="setReviewCreateModalOrderItems(seller.orderItems, order.orderId)"
                                                ><b>리뷰 쓰기</b></a>
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

<script setup lang="ts">
import moment from 'moment';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { OrderStatus } from '$/@type/myOrder/index';
import { MyOrder } from '$/@type/myOrder/order'
import { NormalOrderItem } from '$/@type/myOrder/item';
import { myOrderRepository } from '$/repository/myOrder/orderRepository';
import MMSelect from '@/components/input/Select.vue';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import MMLink from '@/components/MMLink.vue';
import { usePurchaseConfirm } from '$/composables/mypage/order/myOrderComposable';
import { useReviewCreate } from '$/composables/mypage/reviewComposable';
import { makePath } from '$/services/http';
import { getOutIntentPath, typeCastBoolean } from '$/filters';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useSellerQnaCreateModalPopup } from '$/composables/mypage/sellerQnaComposable';

const route = useRoute();
const router = useRouter();
usePageTitleSetting('주문관리', ['마이페이지']);

const orderStatusCodes = ref<OrderStatus[]>([]);
const needReviewConfirmMessage = computed(() => orderStatusCode.value !== '');
const showReviewGuide = computed<boolean>(() => {
    if (!orderStatusCode.value) {
        return true;
    }
    const currentStatus = orderStatusCodes.value.find(status => orderStatusCode.value == `${status.code}`);

    return typeCastBoolean(currentStatus?.needReviewGuide);
})

// 검색 params
const orderStatusCode = ref<string>(route.query.status_code ? `${route.query.status_code}` : '');
const searchPeriodMonth = ref<number|string>(1);
const searchStartAt = computed<moment.Moment>(() => {
    return moment().subtract(searchPeriodMonth.value, 'month');
});

// 리스트
const orders = ref<MyOrder<NormalOrderItem>[]>([]);

const { setPurchaseConfirmModalData } = usePurchaseConfirm();
const { setSellerQnaModalData } = useSellerQnaCreateModalPopup()
const { setReviewCreateModalOrderItems } = useReviewCreate()

onMounted(async () => {
    mmon.loading.show();
    await Promise.all([fetchOrders(), fetchOrderStatusCodes()])
    mmon.loading.hide();

    window.addEventListener('hashchange', refreshOrderList);
});

// 검색 params 변경되면 재조회
watch([searchPeriodMonth, orderStatusCode], async () => {
    mmon.loading.show();
    router.replace(
        makePath(
            route.path, 
            Object.assign({ status_code: orderStatusCode.value })
        )
    );
    await fetchOrders();
    mmon.loading.hide();
});

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', refreshOrderList);
})

// 구매확정 후 리스트 재조회
async function refreshOrderList(event: HashChangeEvent) {
    const before = event.oldURL.split('#')[1] ?? '';
    const after = event.newURL.split('#')[1] ?? '';

    if ((before === 'PURCHASE_CONFIRM' || before === 'REVIEW_CREATE') && after === '') {
        await fetchOrders();
    }
}

/**
 * 주문리스트 조회
 * @param page 페이지번호
 */
async function fetchOrders() {
    try {
        orders.value = await myOrderRepository.getList(
            searchStartAt.value, 
            moment(), 
            Number(orderStatusCode.value)
        );
    } catch (e) {
        defaultCatch(e);
    }
}

// 주문상태코드 조회
async function fetchOrderStatusCodes() {
    try {
        orderStatusCodes.value = await myOrderRepository.getNormalOrderStatusCodes();
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
