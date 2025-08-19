<template>
    <div class="mm_page-content-body">
        <div class="m_my-claim">
            <h5 class="mm_heading">
                <b>품절취소 신고</b>
            </h5>
            <!-- 탭메뉴 -->
            <div class="mm_tab_menu">
                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                <ul class="mm_flex T=equal">
                    <li>
                        <MMLink :to="{ name: 'MypageClaimSoldoutCancelClaimable' }">
                            <b>품절취소 신고</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink
                            :to="{ name: 'MypageClaimSoldoutCancelResult' }"
                            class="S=tab-on"
                            title="선택됨"
                        >
                            <b>품절취소 처리결과</b>
                        </MMLink>
                    </li>
                </ul>
            </div>
            <!--// 탭메뉴 -->
            <p class="text_quantity">
                신고 주문 수<strong>{{ MMFilters.formatNumber(claimResults.total) }}</strong><sub>개</sub>
            </p>
            <p
                v-if="claimResults.total < 1"
                class="mm_text-none"
            >
                <i class="ico_text-none" />품절취소 신고 가능 주문이 없습니다
            </p>
            <!-- 품절취소 신고 가능 목록 -->
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
                                        <dl><dt>결제방식</dt><dd>{{ order.paymentMethodLabel }}</dd></dl>
                                        <ul class="mm...order-claim">
                                            <li>
                                                <b
                                                    class="mm_tag T=round"
                                                    :class="[
                                                        {'T=variable': orderItem.isComplete},
                                                        {'T=gray': orderItem.isUnableToComplete},
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
                                </li>
                            </ul>
                        </div>
                    </template>
                </article>
            </template>
            <!-- // 품절취소 신고 가능 목록 -->

            <!-- 페이지네이션 -->
            <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
            <MMPaginator
                :page-block-type="'group'"
                :page-block-count="10"
                :current-page="claimResults.currentPage"
                :items-per-page="claimResults.perPage"
                :total-count="claimResults.total"                    
                @movePageTo="getClaimResults"
            />
            <!--// 페이지네이션 -->

            <!-- 품절취소 신고 처리 순서 -->
            <section>
                <h5><b>품절취소 신고 처리 순서</b></h5>
                <ol>
                    <li><dl><dt><small>STEP 1.</small>신고접수</dt><dd>고객님께서 신고 완료한 상태</dd></dl></li>
                    <li><dl><dt><small>STEP 2.</small>처리완료/처리불가</dt><dd>보상적립금 지급 처리불가 또는 처리를 완료한 상태</dd></dl></li>
                </ol>
                <div class="mm_note">
                    <ul>
                        <li>
                            처리 완료된 건의 보상 {{ MMFilters.applyZosa(`${pointLabel.name}(은/는)`) }} 
                            <strong>[마이페이지 &#62; 혜택 관리 &#62; 보유 적립금]</strong>
                            에서 확인이 가능합니다.
                        </li>
                    </ul>
                </div>
            </section>
            <!--// 품절취소 신고 처리 순서 -->

            <!-- 품절취소 보상정책 안내 -->
            <section v-if="rewardPolicies.length">
                <h5><b>품절취소 보상정책 안내</b></h5>
                <p>
                    재고 부족 등의 이유로 결제 완료일 다음날(1일째) 품절 사실을 안내받은 경우 
                    {{ 
                        rewardPolicies.length == 1 
                            ? `${rewardPolicies[0]?.rewardRate}%` 
                            : `최저 ${rewardPolicies[0]?.rewardRate}% ~ 최고 ${rewardPolicies[rewardPolicies.length - 1]?.rewardRate}%` 
                    }}

                    까지 {{ MMFilters.applyZosa(`${pointLabel.name}(으로/로)`) }} 보상해드리는 제도입니다.
                </p>
                <div class="mm_table-point">
                    <table>
                        <colgroup>
                            <col style="width: 205px;">
                            <col>
                        </colgroup>
                        <tbody>
                            <tr
                                v-for="rewardPolicy in rewardPolicies"
                                :key="`${rewardPolicy.day}_${rewardPolicy.rewardRate}`"
                            >
                                <th scope="row">
                                    <b>{{ rewardPolicy.day }}일 후 안내</b>
                                </th>
                                <td>{{ rewardPolicy.rewardRate }}% ({{ pointLabel.name }} 보상)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mm_note">
                    <ul>
                        <li>결제완료일로부터 품절등록일 수 기준</li>
                    </ul>
                </div>
            </section>
            <!--// 품절취소 보상정책 안내 -->
        </div>
    </div>
</template>
<script lang="ts" setup>
import { Paginator } from '$/@type';
import { ClaimReportedOrder, ClaimRewardPolicy } from '$/@type/member/claimReport';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { soldoutCancelClaimRepository } from '$/repository/member/soldoutCancelClaimRepository';
import { ref, defineComponent } from 'vue';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import MMPaginator from '@/components/Paginator.vue';
import { PointLabel } from '$/@type/member/point';
import {useGlobalConfigs } from '$/composables/globalConfigComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';

const claimResults = ref<Paginator<ClaimReportedOrder>>({
    total: 0,
    currentPage: 1,
    perPage: 10,
    data: []
});

const { globalConfigs } = useGlobalConfigs();
const rewardPolicies = ref<ClaimRewardPolicy[]>(globalConfigs.value.paidFeatures.rewardPolicies?.soldoutCancelRewardPolicies || []);
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);

usePageTitleSetting('품절취소 처리결과', ['품절취소 신고', '마이페이지']);

// 신고가능주문조회
async function getClaimResults(page = 1) {
    try {
        claimResults.value = await soldoutCancelClaimRepository.getReportedOrders(page, 10)
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
            const claimResults = await soldoutCancelClaimRepository.getReportedOrders(1, 10)
            next((vm) => {
                vm.claimResults = claimResults;
            })
        } catch (e) {
            console.log(e)
            next();
        } finally {
            mmon.loading.hide();
        }
    }
})
</script>