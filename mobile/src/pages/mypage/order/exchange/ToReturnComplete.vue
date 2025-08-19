<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>반품 전환 완료</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <h3 class="mm_heading m_popup-myclaim-title">
                            <b>반품 전환이 완료되었습니다</b>
                        </h3>
                        <!-- 반품 상품 목록 -->
                        <div v-if="returnedOrderPacks.length" class="mm_order-item">
                            <div 
                                v-for="pack in returnedOrderPacks"
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
                                            />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <!--// 반품 상품 목록 -->
                        <div class="mm_inner">
                            <div class="mm_note">
                                <ul>
                                    <li>위의 목록은 반품 신청하신 상품에 대한 금액만 표시됩니다.</li>
                                    <li>반품 사유 및 적립금 사용에 따라 실제 환불 금액은 다를 수 있습니다.</li>
                                </ul>
                            </div>
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <div class="mm_flex T=equal">
                                        <a class="mm_btn T=line T=dark" href="#" @click="router.replace({ name: 'Main' })"><b>메인으로 이동</b></a>
                                        <button 
                                            type="button"
                                            class="mm_btn T=primary" 
                                            @click="router.replace({ name: 'MypageOrderReturnList' })"
                                        >
                                            <b>반품내역 확인</b>
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
import { useReturnedOrder } from '$/composables/mypage/order/claim/returnComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

/** VARIABLE */
// 교환번호, (전환)반품주문번호
const props = defineProps<{
    exchangeId: string
    returnId: string
}>()

usePageTitleSetting('반품 전환 완료');
const { router } = usePageContext();
const { returnedOrderPacks } = useReturnedOrder([props.returnId]);
/** // VARIABLE */

</script>
