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
                        <MMLink
                            :to="{ name: 'MypageClaimSoldoutCancelClaimable' }"
                            class="S=tab-on"
                            title="선택됨"
                        >
                            <b>품절취소 신고</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink :to="{ name: 'MypageClaimSoldoutCancelResult' }">
                            <b>품절취소 처리결과</b>
                        </MMLink>
                    </li>
                </ul>
            </div>
            <!--// 탭메뉴 -->
            
            <!--// 탭메뉴 -->
            <p class="text_quantity">
                신고가능 주문 수<strong>{{ claimables.total }}</strong><sub>개</sub>
            </p>
            <p
                v-if="claimables.total < 1"
                class="mm_text-none"
            >
                <i class="ico_text-none" />품절취소 신고 가능 주문이 없습니다
            </p>
            <!-- 품절취소 신고 가능 목록 -->
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
                                        <dl><dt>결제방식</dt><dd>{{ claimableOrder.paymentMethodLabel }}</dd></dl>
                                        <div class="mm_btn_box">
                                            <div class="mm_block">
                                                <button
                                                    type="button"
                                                    class="mm_btn T=sm T=line T=light"
                                                    @click="claimReport(orderItem.id)"
                                                >
                                                    <b>품절취소 신고</b>
                                                </button>
                                            </div>
                                        </div>
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
                :current-page="claimables.currentPage"
                :items-per-page="claimables.perPage"
                :total-count="claimables.total"                    
                @movePageTo="getClaimableOrders"
            />
            <!--// 페이지네이션 -->

            <!-- 품절취소 보상정책 안내 -->
            <section v-if="rewardPolicies && rewardPolicies.length > 0">
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

            <!-- 유의사항 -->
            <section class="mm_note">
                <h5 class="text_title">
                    <i class="ico_note" /><b>유의사항</b>
                </h5>
                <ul>
                    <li>결제일로부터 30일 이내에 신고하셔야 보상금 지급이 가능합니다.</li>
                    <li>해외배송 상품 및 주문제작 상품은 보상제도에서 제외됩니다.</li>
                    <li>보상 신청은 결제일로부터 최대 30일 이내에 하셔야 하고, 최대 보상 금액은 {{ MMFilters.formatNumber(maxRewardPrice) }}원 입니다.</li>
                    <li>지연일은 영업일 기준으로 토,일,공휴일은 포함하지 않습니다.</li>
                    <li>비회원, 해외직배송, 주문 제작, 주문 후 오프라인 매장을 통한 배송 상품, 해당 상품 취소 및 반품 시에는 본 기준에서 제외됩니다.</li>
                    <li>무통장 결제의 경우 입금완료일을 기준으로 합니다.</li>
                </ul>
            </section>
            <!--// 유의사항 -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Paginator } from '$/@type';
import { ClaimReportableOrder, ClaimRewardPolicy } from '$/@type/member/claimReport';
import { soldoutCancelClaimRepository } from '$/repository/member/soldoutCancelClaimRepository';
import { defaultCatch } from '$/functions';
import { defineComponent,ref } from 'vue';
import { mmon } from '$/helper/mmon';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import MMPaginator from '@/components/Paginator.vue';
import { PointLabel } from '$/@type/member/point';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';

const claimables = ref<Paginator<ClaimReportableOrder>>({
    total: 0,
    currentPage: 1,
    perPage: 10,
    data: []
});
const { globalConfigs } = useGlobalConfigs();
usePageTitleSetting('품절취소 신고', ['품절취소 신고', '마이페이지']);

const rewardPolicies = ref<ClaimRewardPolicy[]>(globalConfigs.value.paidFeatures.rewardPolicies?.deliveryDelayRewardPolicies || []);
const maxRewardPrice = ref<number>(globalConfigs.value.paidFeatures.rewardPolicies?.maximumRewardPrice || 0);
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);

    
// 신고가능주문조회
async function getClaimableOrders(page = 1) {
    try {
        claimables.value = await soldoutCancelClaimRepository.getReportableOrders(page, 10);
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
            await getClaimableOrders();
            mmon.loading.hide()
        });
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