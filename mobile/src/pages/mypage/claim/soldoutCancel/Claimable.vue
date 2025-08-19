<template>
    <div class="m_myclaim">
        <h3 class="m_myclaim-title">
            <b>신고가능 주문수</b><strong class="mm_text-variable">{{ MMFilters.formatNumber(claimables.total) }}개</strong>
        </h3>
        <!-- 신고 가능 주문 목록 -->
        
        <p v-if="claimables.total < 1" class="mm_text-none">
            <i class="ico_text-none" />품절취소 신고 가능 주문이 없습니다
        </p>
        <template v-else>
            <article 
                v-for="claimableOrder in claimables.data"
                :key="claimableOrder.orderId"
                class="mm_order-item"
            >
                <h5>
                    <b>{{ MMFilters.formatDate(claimableOrder.paidAt, 'YYYY.MM.DD') }}</b>
                    <strong>주문번호: {{ claimableOrder.orderId }}</strong>
                </h5>
                
                <template v-for="pack in claimableOrder.packs" :key="pack.shippingRuleId">
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
                                                <p><span>결제방식 </span>{{ claimableOrder.paymentMethodLabel }}</p>
                                            </div>
                                            <div class="mm_btn_box">
                                                <div class="mm_flex T=equal">
                                                    <button type="button" class="mm_btn T=sm T=line T=lighter" @click="claimReport(orderItem.id)">
                                                        <b>품절취소 신고하기</b>
                                                    </button>
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
        </template>
        <!-- 페이지네이션 -->
        <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
        <MMPaginator
            :page-block-type="'group'"
            :page-block-count="3"
            :current-page="claimables.currentPage"
            :items-per-page="claimables.perPage"
            :total-count="claimables.total"                    
            @movePageTo="getClaimableOrders"
        />
        <!--// 페이지네이션 -->
        <!--// 신고 가능 주문 목록 -->

        <!-- 품절취소 보상정책 안내 -->
        <section v-if="rewardPolicies && rewardPolicies.length" class="m_myclaim-info">
            <h6><b>품절취소 보상정책 안내</b></h6>
            <p>
                재고 부족 등의 이유로 결제 완료일 다음날(1일째) 품절 사실을 안내받은 경우 
                {{ 
                    rewardPolicies.length == 1 
                        ? `${rewardPolicies[0]?.rewardRate}%` 
                        : `최저 ${rewardPolicies[0]?.rewardRate}% ~ 최고 ${rewardPolicies[rewardPolicies.length - 1]?.rewardRate}%` 
                }}
                까지 {{ MMFilters.applyZosa(`${pointLabel.name}(으로/로)`) }} 보상해드리는 제도입니다.
            </p>
            <table>
                <caption>결제 완료일로부터 품절 등록일 수 기준</caption>
                <tbody>
                    <tr v-for="rewardPolicy in rewardPolicies" :key="`${rewardPolicy.day}_${rewardPolicy.rewardRate}`">
                        <th scope="row">
                            <b>{{ rewardPolicy.day }}일 후 안내</b>
                        </th>
                        <td>{{ rewardPolicy.rewardRate }}% ({{ pointLabel.name }} 보상)</td>
                    </tr>
                </tbody>
            </table>
            <div class="mm_note">
                <ul>
                    <li>단, 오전 10시 이후 주문은 2일째부터 적용</li>
                </ul>
            </div>
        </section>
        <!--// 품절취소 보상정책 안내 -->

        <!-- 품절취소 신고 안내 -->
        <div class="mm_inner">
            <div class="mm_note">
                <div v-dropdown class="mm_dropdown">
                    <button type="button" class="btn_dropdown" title="펼쳐보기">
                        <i class="ico_info" /><b>품절취소 신고 안내</b><i class="ico_dropdown T=box" />
                    </button>
                    <div class="mm_dropdown-item">
                        <div class="mm_dropdown-item-inner">
                            <ul>
                                <li>결제일로부터 30일 이내에 신고하셔야 보상금 지급이 가능합니다.</li>
                                <li>해외배송 상품 및 주문제작 상품은 보상제도에서 제외됩니다.</li>
                                <li>보상 신청은 결제일로부터 최대 30일 이내에 하셔야 하고, 최대 보상 금액은 {{ MMFilters.formatNumber(maxRewardPrice) }}원 입니다.</li>
                                <li>지연일은 영업일 기준으로 토,일,공휴일은 포함하지 않습니다.</li>
                                <li>비회원, 해외직배송, 주문 제작, 주문 후 오프라인 매장을 통한 배송 상품, 해당 상품 취소 및 반품 시에는 본 기준에서 제외됩니다.</li>
                                <li>무통장 결제의 경우 입금완료일을 기준으로 합니다.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--// 품절취소 신고 안내 -->
    </div>
</template>

<script lang="ts" setup>
import { Paginator } from '$/@type';
import { ClaimReportableOrder, ClaimRewardPolicy } from '$/@type/member/claimReport';
import { soldoutCancelClaimRepository } from '$/repository/member/soldoutCancelClaimRepository';
import { defaultCatch } from '$/functions';
import { defineComponent, ref } from 'vue';
import { mmon } from '$/helper/mmon';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import MMPaginator from '@/components/Paginator.vue';
import { PointLabel } from '$/@type/member/point';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { dropdown as vDropdown } from '$/directives'
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('품절취소 신고', ['품절취소 신고', '마이페이지']);
const claimables = ref<Paginator<ClaimReportableOrder>>({
    total: 0,
    currentPage: 1,
    perPage: 10,
    data: []
});

const { globalConfigs } = useGlobalConfigs();
const rewardPolicies = ref<ClaimRewardPolicy[]>(globalConfigs.value.paidFeatures.rewardPolicies?.deliveryDelayRewardPolicies || []);
const maxRewardPrice = ref<number>(globalConfigs.value.paidFeatures.rewardPolicies?.maximumRewardPrice || 0);
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);

// 신고가능주문조회
async function getClaimableOrders(page = 1) {
    try {
        claimables.value = await soldoutCancelClaimRepository.getReportableOrders(page, 10)
    } catch (e) {
        defaultCatch(e)
    }
}

/**
     * 품절취소신고
     * @param orderItemId 주문상품 id
     */
async function claimReport(orderItemId: number) {
    try {
        await soldoutCancelClaimRepository.reportOrderItems(orderItemId);
        mmon.bom.alert('품절취소 신고가 완료되었습니다.', async () => {
            mmon.loading.show()
            await getClaimableOrders(1)
            mmon.loading.hide()
        })
    } catch (e) {
        defaultCatch(e)
    }
}

defineExpose({ claimables });
</script>

<script lang="ts">
    declare module "@vue/runtime-core" { 
        interface ComponentCustomProperties {
            claimables: Paginator<ClaimReportableOrder>
        }
    }
    
export default defineComponent({
    async beforeRouteEnter(to, from, next) {
        mmon.loading.show();
        try {
            const claimables = await soldoutCancelClaimRepository.getReportableOrders(1, 10);
            next((vm) => {
                vm.claimables = claimables;
            })
        } catch (e) {
            next();
        } finally {
            mmon.loading.hide();
        }
    }
})
</script>
