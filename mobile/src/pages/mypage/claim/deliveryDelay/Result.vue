<template>
    <div class="m_myclaim">
        <h3 class="m_myclaim-title">
            <b>신고 주문수</b>
            <strong class="mm_text-variable">{{ claimResults.total }}개</strong>
        </h3>
        <!-- 신고 주문 목록 -->
        <p v-if="claimResults.total < 1" class="mm_text-none">
            <i class="ico_text-none" />처리중인 배송지연 주문이 없습니다
        </p>
        <template v-else>
            <article 
                v-for="order in claimResults.data"
                :key="order.orderId"
                class="mm_order-item"
            >
                <h5>
                    <b>{{ MMFilters.formatDate(order.paidAt, 'YYYY.MM.DD') }}</b>
                    <strong>주문번호: {{ order.orderId }}</strong>
                </h5>
                
                <template v-for="pack in order.packs" :key="pack.shippingRuleId">
                    <div 
                        v-for="seller in pack.sellers"
                        :key="seller.id"
                        class="mm_order-item-seller"
                    >
                        <div class="mm_order...seller-head">
                            <h5><i class="ico_shop" /><b>{{ seller.name }}</b></h5>
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
                                            <div class="mm_product...footer-indent">
                                                <p><span>결제방식 </span>{{ order.paymentMethodLabel }}</p>
                                            </div>
                                            <div class="mm_product...footer-claim">
                                                <ul>
                                                    <li>
                                                        <b
                                                            class="mm_tag T=lg"
                                                            :class="[
                                                                {'T=variable': orderItem.isComplete},
                                                                {'T=gray': orderItem.isUnableToComplete},
                                                                {'T=dark': !orderItem.isComplete && !orderItem.isUnableToComplete}
                                                            ]"
                                                        >{{ orderItem.processStatusLabel }}</b>
                                                        <p v-if="orderItem.processedAt">
                                                            처리일: {{ MMFilters.formatDate(orderItem.processedAt, 'YYYY.MM.DD') }}
                                                        </p>
                                                        <p v-else-if="orderItem.reportedAt">
                                                            신고일: {{ MMFilters.formatDate(orderItem.reportedAt, 'YYYY.MM.DD') }}
                                                        </p>
                                                    </li>
                                                </ul>
                                            </div>
                                        </template>
                                    </MMOrderGoods>
                                </li>
                            </ul>
                        </div>
                    </div>
                </template>
            </article>
        </template>
        <!-- 페이지네이션 -->
        <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
        <MMPaginator
            :page-block-type="'group'"
            :page-block-count="3"
            :current-page="claimResults.currentPage"
            :items-per-page="claimResults.perPage"
            :total-count="claimResults.total"                    
            @movePageTo="getClaimResults"
        />
        <!--// 페이지네이션 -->
        <!--// 신고 주문 목록 -->

        <!-- 배송지연 신고 처리 순서 -->
        <section class="m_myclaim-info">
            <h6><b>배송지연 신고 처리 순서</b></h6>
            <ol>
                <li>
                    <dl>
                        <dt>STEP 1<b class="mm_tag T=lg T=dark">신고접수</b></dt>
                        <dd>고객님께서 신고 완료한 상태</dd>
                    </dl>
                </li>
                <li>
                    <dl>
                        <dt>STEP 2<b class="mm_tag T=lg T=variable">처리완료</b><b class="mm_tag T=lg T=gray">처리불가</b></dt>
                        <dd>고객센터에서 확인 후 보상적립금 지급이 처리 불가하거나 처리 완료한 상태</dd>
                    </dl>
                </li>
            </ol>
        </section>
        <!--// 배송지연 신고 처리 순서 -->
    </div>
</template>

<script lang="ts" setup>
import { Paginator } from '$/@type';
import { ClaimReportedOrder } from '$/@type/member/claimReport';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { deliveryDelayClaimRepository } from '$/repository/member/deliveryDelayClaimRepository';
import { ref, defineComponent, onMounted } from 'vue';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import MMPaginator from '@/components/Paginator.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('배송지연 처리결과', ['배송지연 신고', '마이페이지']);
const claimResults = ref<Paginator<ClaimReportedOrder>>({
    total: 0,
    currentPage: 1,
    perPage: 10,
    data: []
});

// 신고가능주문조회
async function getClaimResults(page = 1) {
    try {
        claimResults.value = await deliveryDelayClaimRepository.getReportedOrders(page, 10)
    } catch (e) {
        defaultCatch(e)
    }
}

defineExpose({ claimResults });
</script>

<script lang="ts">
    declare module "@vue/runtime-core" { 
        interface ComponentCustomProperties {
            claimResults: Paginator<ClaimReportedOrder>
        }
    }
    
export default defineComponent({
    async beforeRouteEnter(to, from, next) {
        mmon.loading.show();
        try {
            const claimResults = await deliveryDelayClaimRepository.getReportedOrders(1, 10)
            next((vm) => {
                vm.claimResults = claimResults;
            })
        } catch (e) {
            next();
        } finally {
            mmon.loading.hide();
        }
    }
})
</script>