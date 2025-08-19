<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>고객 보상제도</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_tab m_popup-cs" data-tab>
                            <div v-if="rewardInfo.useDeliveryDelay || rewardInfo.useSoldoutCancel" class="mm_tab_menu">
                                <ul class="mm_flex T=equal">
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
							
                            <div v-if="rewardInfo.useDeliveryDelay" :class="['mm_tab-item', { 'S=tab-on': tabIndex === 0 }]">
                                <div class="mm_inner">
                                    <h3 class="m_popup-cs-title">
                                        <b>배송지연 보상정책 안내</b>
                                    </h3>
                                    <p>
                                        결제완료일 다음날(1일째) 부터 3일 이내 배송출발이 되지 않았을 경우 상품금액의 
                                        {{ 
                                            rewardInfo?.deliveryDelayRewardPolicies.length == 1 
                                                ? `${rewardInfo?.deliveryDelayRewardPolicies[0]?.rewardRate}%` 
                                                : `최저 ${rewardInfo?.deliveryDelayRewardPolicies[0]?.rewardRate}% ~ 최고 ${rewardInfo?.deliveryDelayRewardPolicies[rewardInfo?.deliveryDelayRewardPolicies.length - 1]?.rewardRate}%` 
                                        }}
                                        를 {{ MMFilters.applyZosa(`${pointLabel.name}(으로/로)`) }} 보상해드리는 제도입니다.
                                    </p>
                                    <table>
                                        <caption>결제 완료일로부터 배송 출발일 수 기준</caption>
                                        <tbody>
                                            <tr v-for="(rewardPolicy, index) in rewardInfo?.deliveryDelayRewardPolicies" :key="`${rewardPolicy.day}_${rewardPolicy.rewardRate}`">
                                                <th v-if="index + 1 === rewardInfo?.deliveryDelayRewardPolicies.length" scope="row">
                                                    <b>{{ rewardPolicy.day }}일 이상 지연</b>
                                                </th>
                                                <th v-else scope="row">
                                                    <b>{{ rewardPolicy.day }}일 지연</b>
                                                </th>
                                                <td>{{ rewardPolicy.rewardRate }}% ({{ pointLabel.name }} 보상)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <MMLink :to="{ name: 'MypageClaimDeliveryDelayClaimable' }" class="mm_btn T=primary">
                                                <b>배송지연 신고하기</b>
                                            </MMLink>
                                        </div>
                                    </div>
									
                                    <div class="mm_note">
                                        <div v-dropdown class="mm_dropdown" data-dropdown>
                                            <button type="button" class="btn_dropdown" title="접어놓기">
                                                <i class="ico_info" /><b>예외 및 유의사항</b><i class="ico_dropdown T=box" />
                                            </button>
                                            <div class="mm_dropdown-item">
                                                <div class="mm_dropdown-item-inner">
                                                    <ul>
                                                        <li>결제일로부터 30일 이내에 신고하셔야 보상금 지급이 가능합니다.</li>
                                                        <li>해외배송 상품 및 주문제작 상품은 보상제도에서 제외 됩니다.</li>
                                                        <li>보상 신청은 결제일로부터 최대 30일 이내에 하셔야 하고, 최대 보상 금액은 {{ MMFilters.formatNumber(rewardInfo?.maximumRewardPrice) }}원 입니다.</li>
                                                        <li>지연일은 영업일 기준으로 토, 일, 공휴일은 포함하지 않습니다.</li>
                                                        <li>비회원, 해외직배송, 주문 제작, 주문 후 오프라인 매장을 통한 배송 상품, 해당상품 취소 및 반품 시에는 본 기준에서 제외됩니다.</li>
                                                        <li>무통장 결제의 경우 입금완료일을 기준으로 합니다.</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="rewardInfo.useSoldoutCancel" :class="['mm_tab-item', { 'S=tab-on': tabIndex === 1 }]">
                                <div class="mm_inner">
                                    <h3 class="m_popup-cs-title">
                                        <b>품절취소 보상정책 안내</b>
                                    </h3>
                                    <p>
                                        재고 부족 등의 이유로 품절 사실을 안내 받으신 경우 상품 금액 
                                        {{ 
                                            rewardInfo?.soldoutCancelRewardPolicies.length == 1 
                                                ? `${rewardInfo?.soldoutCancelRewardPolicies[0]?.rewardRate || 0}%` 
                                                : `최저 ${rewardInfo?.soldoutCancelRewardPolicies[0]?.rewardRate || 0}% ~ 최고 ${rewardInfo?.soldoutCancelRewardPolicies[rewardInfo?.soldoutCancelRewardPolicies.length - 1]?.rewardRate || 0}%` 
                                        }}
                                        까지 {{ MMFilters.applyZosa(`${pointLabel.name}(으로/로)`) }} 보상해드리는 제도입니다.
                                    </p>
                                    <table>
                                        <caption>결제 완료일로부터 품절등록일 수 기준</caption>
                                        <tbody>
                                            <tr v-for="rewardPolicy in rewardInfo?.soldoutCancelRewardPolicies" :key="`${rewardPolicy.day}_${rewardPolicy.rewardRate}`">
                                                <th scope="row">
                                                    <b>{{ rewardPolicy.day }}일 후 안내</b>
                                                </th>
                                                <td>{{ rewardPolicy.rewardRate }}% ({{ pointLabel.name }} 보상)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <MMLink :to="{ name: 'MypageClaimSoldoutCancelClaimable' }" class="mm_btn T=primary">
                                                <b>품절취소 신고하기</b>
                                            </MMLink>
                                        </div>
                                    </div>
                                    <div class="mm_note">
                                        <div v-dropdown class="mm_dropdown" data-dropdown>
                                            <button type="button" class="btn_dropdown" title="접어놓기">
                                                <i class="ico_info" /><b>예외 및 유의사항</b><i class="ico_dropdown T=box" />
                                            </button>
                                            <div class="mm_dropdown-item">
                                                <div class="mm_dropdown-item-inner">
                                                    <ul>
                                                        <li>해외배송 상품 및 주문제작 상품은 보상제도에서 제외됩니다.</li>
                                                        <li>보상 신청은 결제일로부터 최대 30일 이내에 하셔야 하고, 최대 보상 금액은 {{ MMFilters.formatNumber(rewardInfo?.maximumRewardPrice) }}원 입니다.</li>
                                                        <li>지연일은 영업일 기준으로 토, 일, 공휴일은 포함하지 않습니다.</li>
                                                        <li>비회원, 해외직배송, 주문 제작 주문 후 오프라인 매장을 통한 배송상품, 해당상품 취소 및 반품 시에는 본 기준에서 제외됩니다.</li>
                                                        <li>무통장 결제의 경우 입금 완료일을 기준으로 합니다.</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
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
import { onMounted, ref } from 'vue';
import { dropdown as vDropdown } from '$/directives';
import MMPopup from '@/components/layout/Popup.vue';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { ClaimRewardInfo } from '$/@type/member/claimReport';
import { PointLabel } from '$/@type/member/point';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('고객 보상제도');
        
const tabIndex = ref<number>(0);
const { globalConfigs } = useGlobalConfigs();

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