<template>
    <div class="mm_page-content-body">
        <h3 class="mm_heading">
            <b>주문 반품</b>
        </h3>
        <div class="m_my-order-fin">
            <p>반품 전환이 완료되었습니다</p>
            <div class="mm_btn_box">
                <a
                    class="mm_btn T=line T=dark"
                    href="#"
                    @click.prevent="router.replace({ name: 'Main' })"
                ><b>메인으로 이동</b></a>
                <a
                    class="mm_btn T=primary"
                    href="#"
                    @click.prevent="router.replace({ name: 'MypageOrderReturnList' })"
                ><b>반품내역 확인</b></a>
            </div>
        </div>
        <!-- 주문 반품 내역 -->
        <div
            v-if="returnedOrderPacks.length"
            class="mm_order-item"
        >
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
                    </li>
                </ul>
            </div>
        </div>
        <!--// 주문 반품 내역 -->

        <!-- 유의사항 -->
        <div class="mm_note">
            <ul>
                <li>위의 목록은 반품 신청하신 상품에 대한 금액만 표시됩니다.</li>
                <li>반품 사유 및 적립금 사용에 따라 실제 환불 금액은 다를 수 있습니다.</li>
            </ul>
        </div>
    <!--// 유의사항 -->
    </div>
</template>
<script setup lang="ts">
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useReturnedOrder } from '$/composables/mypage/order/claim/returnComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

/** VARIABLE */
// 교환번호, (전환)반품주문번호
const props = defineProps<{
    exchangeId: string
    returnId: string
}>()

usePageTitleSetting('반품 전환 완료', ['교환 관리', '주문 관리', '마이페이지']);
const { router } = usePageContext();
const { returnedOrderPacks } = useReturnedOrder([props.returnId]);
/** // VARIABLE */

</script>
