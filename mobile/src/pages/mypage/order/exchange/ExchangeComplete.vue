<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>교환 신청 완료</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <h3 class="mm_heading m_popup-myclaim-title">
                            <b>교환 신청이 완료되었습니다</b>
                        </h3>
                        <!-- 교환 상품 목록 -->
                        <div v-if="exchangedOrderPacks.length" class="mm_order-item">
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
                                <div class="mm_product-list T=sm">
                                    <ul>
                                        <li v-for="orderItemSet in pack.orderItemSets" :key="orderItemSet.id">
                                            <p class="text_seller">
                                                <i class="ico_shop" />{{ orderItemSet.sellerName }}
                                            </p>
                                            <MMOrderGoods 
                                                :goods="orderItemSet.goods" 
                                                :price="orderItemSet.totalPaidPrice + orderItemSet.totalPointUsed"
                                            >
                                                <template #footer>
                                                    <template v-for="orderItem in orderItemSet.items" :key="orderItem.id">
                                                        <p v-if="orderItem.exchangeOption" class="text_changed">
                                                            <strong class="mm_text-variable">변경된 옵션</strong>
                                                            <span>{{ `${orderItem.exchangeOption.name} / 1개` }}</span>
                                                        </p>
                                                    </template>
                                                </template>
                                            </MMOrderGoods>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <!--// 교환 상품 목록 -->
                        <div class="mm_inner">
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <div class="mm_flex T=equal">
                                        <a class="mm_btn T=line T=dark" href="#" @click="router.replace({ name: 'Main' })"><b>메인으로 이동</b></a>
                                        <button 
                                            type="button"
                                            class="mm_btn T=primary" 
                                            @click="router.replace({ name: 'MypageOrderExchangeList' })"
                                        >
                                            <b>교환내역 확인</b>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import MMPopup from '@/components/layout/Popup.vue';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
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
