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
                    <MMLink :to="{ name: 'GuestMyPageOrderList' }">
                        <b>주문</b>
                    </MMLink>
                </li>
                <li>
                    <MMLink :to="{ name: 'GuestMyPageCancelList' }">
                        <b>취소</b>
                    </MMLink>
                </li>
                <li>
                    <MMLink
                        class="S=tab-on"
                        title="선택됨"
                        :to="{ name: 'GuestMyPageReturnList' }"
                    >
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
            v-if="returnOrders.length < 1"
            class="mm_text-none"
        >
            <i class="ico_text-none" />반품 내역이 없습니다
        </p>
        <div
            v-else
            class="mm_order-list"
        >
            <article
                v-for="order in returnOrders"
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
                                        <strong>{{ MMFilters.formatNumber(orderItem.paidPrice) }}</strong>
                                    </p>
                                    <div class="mm_btn_box">
                                        <div class="mm_block">
                                            <button 
                                                v-if="orderItem.returnCancelable" 
                                                type="button"
                                                class="mm_btn T=sm T=line T=light" 
                                                @click="cancelReturn(order.returnId, orderItem.returnTargetId)"
                                            >
                                                <b>반품철회</b>
                                            </button>
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
                            </li>
                        </ul>
                    </div>
                </template>
            </article>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import moment from 'moment'
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { ReturnOrder } from '$/@type/myOrder/order';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import { returnRepository } from '$/repository/myOrder/returnRepository';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('반품 관리', ['주문 관리', '마이페이지']);
const returnOrders = ref<ReturnOrder[]>([]);    // 반품 주문 리스트

onMounted(async () => {
    mmon.loading.show();
    await fetchOrders();
    mmon.loading.hide();
})

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