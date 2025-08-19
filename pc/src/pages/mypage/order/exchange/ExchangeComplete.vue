<template>
    <div class="mm_page-content-body">
        <h3 class="mm_heading">
            <b>주문 교환</b>
        </h3>
        <div class="m_my-order-fin">
            <p>교환 신청이 완료되었습니다</p>
            <div class="mm_btn_box">
                <a
                    class="mm_btn T=line T=dark"
                    href="#"
                    @click.prevent="router.replace({ name: 'Main' })"
                ><b>메인으로 이동</b></a>
                <a
                    class="mm_btn T=primary"
                    href="#"
                    @click.prevent="router.replace({ name: 'MypageOrderExchangeList' })"
                ><b>교환내역 확인</b></a>
            </div>
        </div>
        <!-- 주문 교환 내역 -->
        <div
            v-if="exchangedOrderPacks.length"
            class="mm_order-item"
        >
            <div
                v-for="pack in exchangedOrderPacks"
                :key="pack.shippingRuleId"
                class="mm_order-item-seller"
            >
                <div class="mm_order...seller-head">
                    <p class="text_ship">
                        <i class="ico_ship" />
                        <span v-if="pack.paidShippingPrice === 0">무료배송</span>
                        <span v-else class="text_price">
                            <strong>{{ MMFilters.formatNumber(pack.paidShippingPrice) }}</strong>
                        </span>
                    </p>
                </div>
                <ul>
                    <li
                        v-for="itemSet in pack.orderItemSets"
                        :key="itemSet.id"
                    >
                        <div class="mm_flex">
                            <MMSimpleGoods
                                class="T=single"
                                :goods="itemSet.goods"
                            />
                            <p class="text_seller">
                                <i class="ico_shop" />{{ itemSet.sellerName }}
                            </p>
                            <p class="text_price">
                                <strong>{{ MMFilters.formatNumber(itemSet.totalPaidPrice + itemSet.totalPointUsed) }}</strong>
                            </p>
                        </div>
                        <template
                            v-for="orderItem in itemSet.items"
                            :key="orderItem.id"
                        >
                            <p
                                v-if="orderItem.exchangeOption"
                                class="text_changed"
                            >
                                <span>변경한 옵션</span><strong>{{ `${orderItem.exchangeOption.name} / 1개` }}</strong>
                            </p>
                        </template>
                    </li>
                </ul>
            </div>
        </div>
    <!--// 주문 교환 내역 -->
    </div>
</template>
<script setup lang="ts">
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useExchangedOrder } from '$/composables/mypage/order/claim/exchangeComposable';

/** VARIABLE */
// 주문번호,  교환주문번호
const props = defineProps<{
    orderId: string
    exchangeId: string
}>()

usePageTitleSetting('교환 완료', ['주문 교환', '주문 관리', '마이페이지']);
const { router } = usePageContext();
const { exchangedOrderPacks } = useExchangedOrder(props.exchangeId);
/** //VARIABLE **/
</script>
