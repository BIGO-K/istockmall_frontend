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
                    <MMLink :to="{ name: 'MypageOrderList' }">
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
                    <MMLink
                        class="S=tab-on"
                        title="선택됨"
                        :to="{ name: 'MypageOrderExchangeList' }"
                    >
                        <b>교환</b>
                    </MMLink>
                </li>
            </ul>
        </div>
        <!--// 탭메뉴 -->

        <!-- 주문 목록 정렬 -->
        <div class="m_my-order-menu">
            <div class="mm_tab_menu T=square">
                <ul>
                    <li
                        v-for="month in [1,3,6,12]"
                        :key="month"
                    >
                        <a 
                            :class="searchPeriodMonth === month ? 'S=tab-on' : ''"
                            href="#" 
                            :title="searchPeriodMonth === month ? '선택됨' : ''" 
                            @click.prevent="searchPeriodMonth = month; fetchOrders()"
                        >
                            <b>최근 {{ (month/12) >= 1 ? `${Math.floor(month/12)} 년` : `${month}개월` }}</b>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!--// 주문 목록 정렬 -->

        <!-- 주문 목록 -->
        <p
            v-if="exchangeOrders.length < 1"
            class="mm_text-none"
        >
            <i class="ico_text-none" />교환 내역이 없습니다
        </p>
        <div
            v-else
            class="mm_order-list"
        >
            <article
                v-for="order in exchangeOrders"
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
                                            <button 
                                                v-if="orderItem.exchangeCancelable" 
                                                type="button" 
                                                class="mm_btn T=sm T=line T=light" 
                                                @click="cancelExchange(order.exchangeId, orderItem.exchangeTargetId)"
                                            >
                                                <b>교환철회</b>
                                            </button>
                                            <MMLink
                                                v-if="orderItem.toReturnSwitchable"
                                                class="mm_btn T=sm T=line T=light" 
                                                :to="{ name: 'MypageOrderExchangeToReturn', params: { exchange_id: order.exchangeId } }"
                                            >
                                                <b>반품전환</b>
                                            </MMLink>
                                            <a 
                                                v-if="orderItem.returnDeliveryTrackable" 
                                                class="btn_tracking" 
                                                :href="orderItem.returnDeliveryTrackingUrl" 
                                                target="_blank"
                                            >
                                                <b>반송조회</b><i class="ico_link T=circle" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <p class="text_changed">
                                    <span>변경한 옵션</span><strong>{{ orderItem.exchangedOptionName }} / 1개</strong>
                                </p>
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
                        </div>
                    </div>
                </template>
            </article>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Moment } from 'moment';
import moment from 'moment';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { usePageTitleSetting } from '$/composables/seoComposable';
import SellerQnaModal from '@/components/modal/sellerQna/Create.vue';
import { ExchangeOrder } from '$/@type/myOrder/order';
import { exchangeRepository } from '$/repository/myOrder/exchangeRepository';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import { useSellerQnaCreateModal } from '$/composables/mypage/sellerQnaComposable';

usePageTitleSetting('교환 관리', ['주문 관리', '마이페이지']);
// 검색기간
const searchPeriodMonth = ref<number>(1);
const searchStartAt = computed<Moment>(() => {
    return moment().subtract(searchPeriodMonth.value, 'month');
});

// 교환 주문 리스트
const exchangeOrders = ref<ExchangeOrder[]>([]);
// 판매자문의 모달
const { open: openSellerQnaModal } = useSellerQnaCreateModal(SellerQnaModal);

onMounted(async () => {
    await fetchOrders();
});

/**
 * 교환주문리스트 조회
 * @param page 페이지 번호
 */
async function fetchOrders() {
    mmon.loading.show();
    try {
        exchangeOrders.value = await exchangeRepository.getList(searchStartAt.value, moment());
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
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