<template>
    <!-- 본문 내용 -->
    <div class="mm_page-content-body">
        <div class="m_cs-info">
            <h3 class="mm_heading">
                <b>고객 보상제도</b>
            </h3>
            <div
                class="mm_tab"
                data-tab
            >
                <!-- 탭메뉴 -->
                <div class="mm_tab_menu T=square">
                    <ul>
                        <li v-if="rewardInfo.useDeliveryDelay">
                            <a
                                :class="['btn_tab', { 'S=tab-on': tabIndex === 0 }]"
                                :title="tabIndex === 0 ? '선택됨' : ''"
                                @click="tabIndex = 0"
                            >
                                <b>배송지연 보상정책</b>
                            </a>
                        </li>
                        <li v-if="rewardInfo.useSoldoutCancel">
                            <a
                                :class="['btn_tab', { 'S=tab-on': tabIndex === 1 }]"
                                :title="tabIndex === 1 ? '선택됨' : ''"
                                @click="tabIndex = 1"
                            >
                                <b>품절취소 보상정책</b>
                            </a>
                        </li>
                    </ul>
                </div>
                <!--// 탭메뉴 -->
                <!-- 주문 배송조회 -->
                <div v-if="rewardInfo.useDeliveryDelay" :class="['mm_tab-item', { 'S=tab-on': tabIndex === 0 }]">
                    <div class="m_cs-info-reward">
                        <h5><i class="ico_cs-ship" /><b>배송지연 보상정책 안내</b></h5>
                        <p>
                            결제완료일 다음날(1일째) 부터 3일 이내 배송출발이 되지 않았을 경우 상품금액의 
                            {{ 
                                rewardInfo?.deliveryDelayRewardPolicies.length == 1 
                                    ? `${rewardInfo?.deliveryDelayRewardPolicies[0]?.rewardRate || 0}%` 
                                    : `최저 ${rewardInfo?.deliveryDelayRewardPolicies[0]?.rewardRate || 0}% ~ 최고 ${rewardInfo?.deliveryDelayRewardPolicies[rewardInfo?.deliveryDelayRewardPolicies.length - 1]?.rewardRate || 0}%` 
                            }}
                            를 {{ MMFilters.applyZosa(`${pointLabel.name || ''}(으로/로)`) }} 보상해드리는 제도입니다.
                        </p>
                        <MMLink
                            :to="{ name: 'MypageClaimDeliveryDelayClaimable' }"
                            class="mm_btn"
                        >
                            <b>배송지연 신고하기</b><i class="ico_link" />
                        </MMLink>
                        <div class="mm_table-point">
                            <table>
                                <colgroup>
                                    <col style="width:206px;">
                                    <col>
                                </colgroup>
                                <tbody>
                                    <tr
                                        v-for="(rewardPolicy, index) in rewardInfo?.deliveryDelayRewardPolicies"
                                        :key="`${rewardPolicy.day}_${rewardPolicy.rewardRate}`"
                                    >
                                        <th
                                            v-if="index + 1 === rewardInfo?.deliveryDelayRewardPolicies.length"
                                            scope="row"
                                        >
                                            <b>{{ rewardPolicy.day }}일 이상 지연</b>
                                        </th>
                                        <th
                                            v-else
                                            scope="row"
                                        >
                                            <b>{{ rewardPolicy.day }}일 지연</b>
                                        </th>
                                        <td>{{ rewardPolicy.rewardRate }}% ({{ pointLabel.name }} 보상)</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p>결제완료일로부터 배송출발일 수 기준</p>
                        </div>
                        <section class="mm_note">
                            <h6 class="text_title">
                                <i class="ico_note" /><b>유의사항</b>
                            </h6>
                            <ul>
                                <li>결제일로부터 30일 이내에 신고하셔야 보상금 지급이 가능합니다.</li>
                                <li>해외배송 상품 및 주문제작 상품은 보상제도에서 제외됩니다.</li>
                                <li>보상 신청은 결제일로부터 최대 30일 이내에 하셔야 하고, 최대 보상 금액은 {{ MMFilters.formatNumber(rewardInfo?.maximumRewardPrice) }}원 입니다.</li>
                                <li>지연일은 영업일 기준으로 토, 일, 공휴일은 포함하지 않습니다.</li>
                                <li>비회원, 해외직배송, 주문 제작, 주문 후 오프라인 매장을 통한 배송 상품, 해당상품 취소 및 반품 시에는 본 기준에서 제외됩니다.</li>
                                <li>무통장 결제의 경우 입금완료일을 기준으로 합니다.</li>
                            </ul>
                        </section>
                    </div>
                </div>
                <!--// 주문 배송조회 -->

                <!-- 반품 배송조회 -->
                <div v-if="rewardInfo.useSoldoutCancel" :class="['mm_tab-item', { 'S=tab-on': tabIndex === 1 }]">
                    <div class="m_cs-info-reward">
                        <h5><i class="ico_cs-soldout" /><b>품절취소 보상정책 안내</b></h5>
                        <p>
                            재고 부족 등의 이유로 결제 완료일 다음날(1일째) 품절 사실을 안내받은 경우 
                            {{ 
                                rewardInfo?.soldoutCancelRewardPolicies.length == 1 
                                    ? `${rewardInfo?.soldoutCancelRewardPolicies[0]?.rewardRate || 0}%` 
                                    : `최저 ${rewardInfo?.soldoutCancelRewardPolicies[0]?.rewardRate || 0}% ~ 최고 ${rewardInfo?.soldoutCancelRewardPolicies[rewardInfo?.soldoutCancelRewardPolicies.length - 1]?.rewardRate || 0}%` 
                            }}

                            까지 {{ MMFilters.applyZosa(`${pointLabel.name}(으로/로)`) }} 보상해드리는 제도입니다.
                        </p>
                        <MMLink
                            :to="{ name: 'MypageClaimSoldoutCancelClaimable' }"
                            class="mm_btn"
                        >
                            <b>품절취소 신고하기</b><i class="ico_link" />
                        </MMLink>
                        <div class="mm_table-point">
                            <table>
                                <colgroup>
                                    <col style="width:206px;">
                                    <col>
                                </colgroup>
                                <tbody>
                                    <tr
                                        v-for="rewardPolicy in rewardInfo?.soldoutCancelRewardPolicies"
                                        :key="`${rewardPolicy.day}_${rewardPolicy.rewardRate}`"
                                    >
                                        <th scope="row">
                                            <b>{{ rewardPolicy.day }}일 후 안내</b>
                                        </th>
                                        <td>{{ rewardPolicy.rewardRate }}% ({{ pointLabel.name }} 보상)</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p>결제완료일로부터 품절등록일 수 기준</p>
                        </div>
                        <section class="mm_note">
                            <h6 class="text_title">
                                <i class="ico_note" /><b>유의사항</b>
                            </h6>
                            <ul>
                                <li>해외배송 상품 및 주문제작 상품은 보상제도에서 제외됩니다.</li>
                                <li>보상 신청은 결제일로부터 최대 30일 이내에 하셔야 하고, 최대 보상 금액은 {{ MMFilters.formatNumber(rewardInfo?.maximumRewardPrice) }}원 입니다.</li>
                                <li>지연일은 영업일 기준으로 토, 일, 공휴일은 포함하지 않습니다.</li>
                                <li>비회원, 해외직배송, 주문 제작 주문 후 오프라인 매장을 통한 배송상품, 해당상품 취소 및 반품 시에는 본 기준에서 제외됩니다.</li>
                                <li>무통장 결제의 경우 입금 완료일을 기준으로 합니다.</li>
                            </ul>
                        </section>
                    </div>
                </div>
                <!--// 반품 배송조회 -->
            </div>
        </div>
    </div>
    <!--// 본문 내용 -->
</template>

<script setup lang="ts">
import { ClaimRewardInfo } from '$/@type/member/claimReport';
import { PointLabel } from '$/@type/member/point';
import { defineComponent, onMounted, ref } from 'vue'
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';

const { globalConfigs } = useGlobalConfigs();
usePageTitleSetting('고객 보상제도', ['이용안내', '고객센터']);
const tabIndex = ref<number>(0);

const rewardInfo = ref<ClaimRewardInfo|undefined>(globalConfigs.value.paidFeatures.rewardPolicies);
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);


onMounted(async () => {
    if (rewardInfo.value
        && !rewardInfo.value.useDeliveryDelay 
        && rewardInfo.value.soldoutCancelRewardPolicies
    ) {
        tabIndex.value = 1;
    }
})
</script>