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
                        :to="{ name: 'MypageOrderList' }"
                    >
                        <b>주문</b>
                    </MMLink>
                </li>
                <li>
                    <MMLink :to="{ name: 'MypageOrderCancelList' }">
                        <b>취소</b>
                    </MMLink>
                </li>
                <li>
                    <MMLink :to="{ name: 'MypageOrderReturnList' }">
                        <b>반품</b>
                    </MMLink>
                </li>
                <li>
                    <MMLink :to="{ name: 'MypageOrderExchangeList' }">
                        <b>교환</b>
                    </MMLink>
                </li>
            </ul>
        </div>
        <!--// 탭메뉴 -->

        <!-- 주문 목록 정렬 -->
        <div class="m_my-order-menu">
            <!--주문상태-->
            <MMSelect v-model="orderStatusCode">
                <option value="">
                    주문상태 전체
                </option>
                <option
                    v-for="status in orderStatusCodes"
                    :key="status.code"
                    :value="status.code"
                >
                    {{ status.label }}
                </option>
            </MMSelect>

            <!--기간-->
            <div class="mm_tab_menu T=square">
                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                <ul>
                    <li
                        v-for="month in [1,3,6,12]"
                        :key="month"
                    >
                        <a 
                            :class="searchPeriodMonth === month ? 'S=tab-on' : ''" 
                            href="#" 
                            :title="searchPeriodMonth === month ? '선택됨' : ''" 
                            @click.prevent="searchPeriodMonth = month"
                        >
                            <b>최근 {{ (month/12) >= 1 ? `${Math.floor(month/12)} 년` : `${month}개월` }}</b>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!--// 주문 목록 정렬 -->
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
                                        <strong>{{ MMFilters.formatNumber(orderItem.paidPrice + orderItem.pointUsed) }}</strong>
                                    </p>
                                    <div class="mm_btn_box">
                                        <div class="mm_block">
                                            <MMLink 
                                                v-if="orderItem.cancelable"
                                                class="mm_btn T=sm T=line T=light" 
                                                :to="{ name: 'MypageOrderCancel', params: { order_id: order.orderId, item_id: orderItem.id } }"
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
                                                :to="{ name: 'MypageOrderExchange', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                            >
                                                <b>교환신청</b>
                                            </MMLink>
                                            <MMLink 
                                                v-if="orderItem.returnable"
                                                class="mm_btn T=sm T=line T=light" 
                                                :to="{ name: 'MypageOrderReturn', params: { order_id: order.orderId, item_id: orderItem.id } }"
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
                        <div class="mm_btn_box">
                            <a
                                class="btn_inquiry"
                                href="#"
                                @click.prevent="openSellerQnaModal(order.orderId, seller)"
                            >
                                <b>판매자 문의하기</b><i class="ico_link T=sm" />
                            </a>
                            <a 
                                v-if="seller.orderItems.map(item => item.reviewWritable).includes(true)" 
                                class="mm_btn T=sm T=primary btn_review-write"
                                href=""
                                @click.prevent="openReviewModal(seller.orderItems, order.orderId)"
                            >
                                <i class="ico_review-write" />
                                <b>리뷰 쓰기</b>
                            </a>
                        </div>
                    </div>
                </template>
            </article>
        </div>
        <!--// 주문 목록 -->
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { Moment } from 'moment';
import moment from 'moment'
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { NormalOrderItem } from '$/@type/myOrder/item';
import { MyOrder } from '$/@type/myOrder/order';
import { OrderStatus } from '$/@type/myOrder';
import { myOrderRepository } from '$/repository/myOrder/orderRepository'
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import MMSelect from '@/components/input/Select.vue';
import { useRoute, useRouter } from 'vue-router';
import { PointLabel } from '$/@type/member/point';
import { makePath } from '$/services/http';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import SellerQnaModal from '@/components/modal/sellerQna/Create.vue';
import PurchaseConfirm from '@/components/modal/member/PurchaseConfirm.vue';
import ReviewCreate from '@/components/modal/review/Create.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { usePersonalization } from '$/composables/goods/reviewComposable';
import { typeCastBoolean } from '$/filters';
import { useSellerQnaCreateModal } from '$/composables/mypage/sellerQnaComposable';

const route = useRoute();
const router = useRouter();        
const { globalConfigs } = useGlobalConfigs();
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);
usePageTitleSetting('주문 관리', ['마이페이지']);                
const orderStatusCodes = ref<OrderStatus[]>([]);
// 검색 params
const orderStatusCode = ref<string>(route.query.status_code ? `${route.query.status_code}` : '');
const searchPeriodMonth = ref<number>(1);
const searchStartAt = computed<Moment>(() => {
    return moment().subtract(searchPeriodMonth.value, 'month');
});

const showReviewGuide = computed<boolean>(() => {
    if (!orderStatusCode.value) {
        return true;
    }
    const currentStatus = orderStatusCodes.value.find(status => orderStatusCode.value == `${status.code}`);

    return typeCastBoolean(currentStatus?.needReviewGuide);
})
// 리스트
const orders = ref<MyOrder<NormalOrderItem>[]>([]);
    
// 판매자문의 모달
const { open: openSellerQnaModal } = useSellerQnaCreateModal(SellerQnaModal);

onMounted(async () => {
    mmon.loading.show();
    await Promise.all([fetchOrders(), fetchOrderStatusCodes()])
    mmon.loading.hide();
});

// 검색 params 변경되면 재조회
watch([searchPeriodMonth, orderStatusCode], async () => {
    mmon.loading.show();
    await fetchOrders();
    router.replace(
        makePath(
            route.path, 
            Object.assign({ status_code: orderStatusCode.value })
        )
    );
    mmon.loading.hide();
});

/**
* 주문리스트 조회
* @param page 페이지번호
*/
async function fetchOrders() {
    try {
        orders.value = await myOrderRepository.getList(searchStartAt.value, moment(), Number(orderStatusCode.value));
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
 * 상품리뷰 작성 모달 OPEN
 * @param orderItems 주문상품
 * @param orderId 주문 ID
 */
function openReviewModal(orderItems: NormalOrderItem[], orderId: string) {
    const { getMySize, getShoesSizes, hasPersonalization } = usePersonalization();

    const writableReviews = orderItems.filter(item => item.reviewWritable).map(item => {
        return {
            orderId: orderId,
            optionId: item.goods.optionId,
            orderedAt: '',
            goods: item.goods
        }
    });
    useModal().open(ReviewCreate, {
        title: '리뷰쓰기',
        itemClass: 'm_modal-myreview',
        name: 'ReviewCreateModal',
        props: async() => {
            if (hasPersonalization.value) {
                const[ shoesSizes, mySize ] = await Promise.all([
                    getShoesSizes(),
                    getMySize()
                ]);
                
                return {
                    orderItems: writableReviews,
                    shoesSizeList: shoesSizes,
                    mySizeInfo: mySize,
                    hasPersonalization
                }
            }

            return {
                hasPersonalization,
                orderItems: writableReviews,
                mySizeInfo: null,
                shoesSizeList: []
            }
        }, 
        onClose: async() => {
            await fetchOrders()
        }
    })
}

/**
 * 구매 확정 모달 OPEN
 * @param orderItem 주문상품
 * @param sellerName 셀러명
 */
function openPurchaseConfirmModal(orderItem: NormalOrderItem, sellerName: string) {
    useModal().open(PurchaseConfirm, {
        title: '구매 확정',
        name: 'PurchaseConfirm',
        props: {
            orderItem: orderItem,
            sellerName: sellerName,
            pointLabel: pointLabel.value,
            orderStatusCode: orderStatusCode.value
        },
        onClose: async() => {
            await fetchOrders();
        }
    })            
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
