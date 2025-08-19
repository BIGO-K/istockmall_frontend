<template>
    <div class="mm_page-content-body">
        <div class="m_cs-info">
            <h3 class="mm_heading">
                <b>쿠폰/{{ pointLabel.name }}</b>
            </h3>
            <div
                class="mm_tab"
                data-tab
            >
                <!-- 탭메뉴 -->
                <div class="mm_tab_menu T=square">
                    <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
                    <ul>
                        <li>
                            <a 
                                class="btn_tab" 
                                :class="showCoupon ? 'S=tab-on' : ''"
                                href="#"
                                :title="showCoupon ? '선택됨' : ''" 
                                @click.prevent="showCoupon = true; showPoint = false"
                            >
                                <b>쿠폰 안내</b>
                            </a>
                        </li>
                        <li>
                            <a 
                                class="btn_tab" 
                                :class="showPoint ? 'S=tab-on' : ''"
                                href="#" 
                                :title="showPoint ? '선택됨' : ''"
                                @click.prevent="showPoint = true; showCoupon = false"
                            >
                                <b>{{ pointLabel.name }} 안내</b>
                            </a>
                        </li>
                    </ul>
                </div>
                <!--// 탭메뉴 -->

                <!-- 쿠폰안내 -->
                <div
                    class="mm_tab-item"
                    :class="showCoupon ? 'S=tab-on': ''"
                >
                    <!-- 쿠폰 유의사항 -->
                    <h5 class="m_cs-info-strapline">
                        <b>쿠폰 유의사항</b>
                    </h5>
                    <div class="mm_note m_cs-info-note">
                        <ul>
                            <li>쿠폰 발급 및 사용은 당사 회원일 때만 적용 가능합니다.</li>
                            <li>쿠폰 1장당 1개의 상품에 한해서 적용 됩니다.</li>
                            <li>한가지 상품에 2장 이상의 쿠폰을 중복으로 사용하실 수 없습니다.</li>
                            <li>쿠폰은 현금화되지 않으며, 쿠폰 적용 상품의 반품 시 재발급 되지 않습니다.</li>
                            <li>유효기간이 만료된 쿠폰은 사용하실 수 없습니다.</li>
                            <li>쿠폰에 따라 금액/브랜드/상품별로 사용이 제한될 수 있습니다.</li>
                            <li>즉시 할인은 별도 다운로드 없이 자동으로 할인 금액이 적용됩니다.</li>
                            <li>쿠폰에 따라 유효기간/최소 사용금액 등과 같은 사용 조건이 상이합니다.</li>
                        </ul>
                    </div>
                    <!--// 쿠폰 유의사항 -->

                    <!-- 쿠폰 종류별 사용 방법 -->
                    <h5 class="m_cs-info-strapline">
                        <b>쿠폰 종류별 사용 방법</b>
                    </h5>
                    <div class="mm_note m_cs-info-note">
                        <ul>
                            <li>등급 혜택에서 회원 등급별로 매월 할인 쿠폰을 다운로드 받으실 수 있습니다.</li>
                        </ul>
                    </div>
                    <!--// 쿠폰 종류별 사용 방법 -->
                </div>
                <!--// 쿠폰안내 -->

                <!-- 적립금 안내 -->
                <div
                    class="mm_tab-item"
                    :class="showPoint ? 'S=tab-on': ''"
                >
                    <div class="m_cs-info-point">
                        <template v-if="isUseReward && (rewardInfo.useDeliveryDelay || rewardInfo.useSoldoutCancel)">
                            <h5 class="m_cs-info-strapline">
                                <b>
                                    {{ rewardInfo.useDeliveryDelay ? "배송지연" : "" }}{{ rewardInfo.useDeliveryDelay && rewardInfo.useSoldoutCancel ? "/" : "" }}{{ rewardInfo.useSoldoutCancel ? "품절보상" : "" }} 
                                    {{ pointLabel.name }}
                                </b>
                            </h5>
                            <div class="mm_table-point">
                                <table>
                                    <colgroup>
                                        <col style="width:206px;">
                                        <col>
                                    </colgroup>
                                    <tbody>
                                        <tr v-if="rewardInfo.useDeliveryDelay">
                                            <th scope="row">
                                                <b>배송 지연</b>
                                            </th>
                                            <td>
                                                결제 완료일 다음날(1일째)부터 3일 이내 배송 출발이 되지 않았을 경우, 상품 금액의 
                                                {{ 
                                                    rewardInfo?.deliveryDelayRewardPolicies.length == 1 
                                                        ? `${rewardInfo?.deliveryDelayRewardPolicies[0]?.rewardRate || 0}%` 
                                                        : `최저 ${rewardInfo?.deliveryDelayRewardPolicies[0]?.rewardRate || 0}% ~ 최고 ${rewardInfo?.deliveryDelayRewardPolicies[rewardInfo?.deliveryDelayRewardPolicies.length - 1]?.rewardRate || 0}%` 
                                                }}
                                                를 {{ MMFilters.applyZosa(`${pointLabel.name || ''}(으로/로)`) }} 보상해드리는 제도입니다.
                                            </td>
                                        </tr>
                                        <tr v-if="rewardInfo.useSoldoutCancel">
                                            <th scope="row">
                                                <b>품절 지연</b>
                                            </th>
                                            <td>
                                                재고 부족 등의 이유로 품절 사실을 안내 받으신 경우 상품 금액 
                                                {{ 
                                                    rewardInfo?.soldoutCancelRewardPolicies.length == 1 
                                                        ? `${rewardInfo?.soldoutCancelRewardPolicies[0]?.rewardRate || 0}%` 
                                                        : `최저 ${rewardInfo?.soldoutCancelRewardPolicies[0]?.rewardRate || 0}% ~ 최고 ${rewardInfo?.soldoutCancelRewardPolicies[rewardInfo?.soldoutCancelRewardPolicies.length - 1]?.rewardRate || 0}%` 
                                                }}
                                                를 {{ MMFilters.applyZosa(`${pointLabel.name || ''}(으로/로)`) }} 보상해드리는 제도입니다.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="mm_note">
                                    <ul>
                                        <li>
                                            {{ rewardInfo.useDeliveryDelay ? "배송지연" : "" }}{{ rewardInfo.useDeliveryDelay && rewardInfo.useSoldoutCancel ? "/" : "" }}{{ rewardInfo.useSoldoutCancel ? "품절보상" : "" }} 
                                            보상은 <strong>[고객센터 &#62; 고객 보상제도]</strong>에서 상세한 내용 확인이 가능합니다.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </template>
                        <!-- 이벤트를 통한 적립금 -->
                        <h5 class="m_cs-info-strapline">
                            <b>이벤트를 통한 {{ pointLabel.name }}</b>
                        </h5>
                        <div class="mm_note m_cs-info-note">
                            <ul>
                                <li>{{ pointLabel.name }}이 책정되어 있는 이벤트를 통해서 {{ pointLabel.name }}을 적립하실 수 있습니다. (이벤트당 {{ pointLabel.name }} 상이)</li>
                                <li>유효기간: 지급월을 기준으로 6개월 후 익일 0시에 소멸됩니다.</li>
                            </ul>
                        </div>
                        <!--// 이벤트를 통한 적립금 -->

                        <!-- 적립금 사용안내 -->
                        <h5 class="m_cs-info-strapline">
                            <b>{{ pointLabel.name }} 사용안내</b>
                        </h5>
                        <div class="mm_note m_cs-info-note">
                            <ul>
                                <li>
                                    {{ pointLabel.name }} {{ MMFilters.formatNumber(minUsablePoint) }}{{ pointLabel.suffix }} 이상 보유시 
                                    {{ pointLabel.name }} 1{{ pointLabel.suffix }} = 현금 1원으로 {{ shopName }}몰 내에서 사용 가능합니다.
                                </li>
                                <li>상품 주문시 사용하신 {{ pointLabel.name }}은 해당 상품의 취소/반품/환불시 재적립이 가능합니다.</li>
                            </ul>
                        </div>
                    <!--// 적립금 사용안내 -->
                    </div>
                </div>
                <!--// 적립금 안내 -->
            </div>
        </div>
    </div>    
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { ClaimRewardInfo } from '$/@type/member/claimReport';
/** VARIABLE */
usePageTitleSetting('쿠폰/적립금', ['이용안내', '고객센터']);
const showCoupon = ref<boolean>(true);
const showPoint = ref<boolean>(false);
const { globalConfigs } = useGlobalConfigs();
const pointLabel = globalConfigs.value.point.label;

const shopName = ref<string>(globalConfigs.value.shop.name);
const minUsablePoint = ref<number>(globalConfigs.value.point.rules.minUsableBalance);
const isUseReward = ref<boolean>(globalConfigs.value.paidFeatures.reward);
const rewardInfo = ref<ClaimRewardInfo| undefined>(globalConfigs.value.paidFeatures.rewardPolicies);
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>