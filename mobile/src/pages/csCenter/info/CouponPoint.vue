<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>쿠폰/적립금</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_tab m_popup-cs" data-tab>
                            <div class="mm_tab_menu">
                                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
                                <ul class="mm_flex T=equal">
                                    <li>
                                        <a
                                            :class="['btn_tab', { 'S=tab-on' : showCoupon }]"
                                            :title="showCoupon ? '선택됨' : ''"
                                            @click="showCoupon = true; showPoint = false; orderOfGuidance = ''; check = ''"
                                        >
                                            <b>쿠폰 안내</b>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            :class="['btn_tab', { 'S=tab-on' : showPoint }]"
                                            :title="showPoint ? '선택됨' : ''"
                                            @click="showCoupon = false; showPoint = true; orderOfGuidance = ''; check = ''"
                                        >
                                            <b>적립금 안내</b>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <!-- 쿠폰안내 -->
                            <div :class="['mm_tab-item', { 'S=tab-on' : showCoupon }]">
                                <div class="mm_accordion">
                                    <ul>
                                        <li>
                                            <dl
                                                :class="['mm_dropdown', { 'S=on' : check === 'precaution' }]"
                                                @click="() => {
                                                    orderOfGuidance = 'precaution'
                                                    check = check === orderOfGuidance ? '' : orderOfGuidance;
                                                }"
                                            >
                                                <dt class="btn_dropdown" tabindex="0" :title="check === 'precaution' ? '접어보기' : '펼쳐보기'">
                                                    <p><b>쿠폰 유의사항</b></p><i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="check === 'precaution' ? { height: 'auto' } : {}">
                                                    <div class="mm_dropdown-item-inner">
                                                        <ul>
                                                            <li><p>쿠폰은 회원에 한해 적용되며, 한 품목당 한장의 쿠폰만 사용할 수 있습니다.</p></li>
                                                            <li><p>쿠폰 사용 후 잔액은 환불이 불가하며, 자동 소멸됩니다.</p></li>
                                                            <li><p>쿠폰에 따라 유효기간/최소 사용금액과 같은 사용 조건이 상이합니다.</p></li>
                                                            <li><p>쿠폰에 따라 금액, 브랜드, 상품, 디바이스별로 사용이 제한될 수 있습니다.</p></li>
                                                            <li><p>유효기간이 만료된 쿠폰은 사용할 수 없습니다.</p></li>
                                                        </ul>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                        <li>
                                            <dl
                                                :class="['mm_dropdown', { 'S=on' : check === 'howToUse' }]"
                                                @click="() => {
                                                    orderOfGuidance = 'howToUse'
                                                    check = check === orderOfGuidance ? '' : orderOfGuidance;
                                                }"
                                            >
                                                <dt class="btn_dropdown" tabindex="0" :title="check === 'howToUse' ? '접어보기' : '펼쳐보기'">
                                                    <p><b>쿠폰 종류별 사용 방법</b></p><i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="check === 'howToUse' ? { height: 'auto' } : {}">
                                                    <div class="mm_dropdown-item-inner">
                                                        <ul>
                                                            <li><p>등급 혜택에서 회원 등급별로 매월 할인 쿠폰을 다운로드 받으실 수 있습니다.</p></li>
                                                        </ul>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <!--// 쿠폰안내 -->

                            <!-- 적립금 안내 -->
                            <div :class="['mm_tab-item', { 'S=tab-on' : showPoint }]">
                                <div class="mm_accordion">
                                    <ul>
                                        <li v-if="isUseReward && (rewardInfo?.useDeliveryDelay || rewardInfo?.useSoldoutCancel)">
                                            <dl
                                                :class="['mm_dropdown', { 'S=on' : check === 'reward' }]"
                                                @click="() => {
                                                    orderOfGuidance = 'reward'
                                                    check = check === orderOfGuidance ? '' : orderOfGuidance;
                                                }"
                                            >
                                                <dt class="btn_dropdown" tabindex="0" title="펼쳐보기">
                                                    <p>
                                                        <b>
                                                            {{ rewardInfo.useDeliveryDelay ? "배송지연" : "" }}{{ rewardInfo.useDeliveryDelay && rewardInfo.useSoldoutCancel ? "/" : "" }}{{ rewardInfo.useSoldoutCancel ? "품절보상" : "" }} 적립금
                                                        </b>
                                                    </p>
                                                    <i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="check === 'reward' ? { height: 'auto' } : {}">
                                                    <div class="mm_dropdown-item-inner">
                                                        <table class="m_popup-cs-point">
                                                            <colgroup>
                                                                <col style="width: 29.46428%;">
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
                                                                        }}를 적립금으로 보상해드리는 제도입니다.
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
                                                                        }}를 적립금으로 보상해드리는 제도입니다.
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <ul>
                                                            <li><p>배송지연/품절취소 보상은 <strong class="text_highlight">[<span>고객센터 &#62; 고객 보상제도</span>]</strong>에서 상세한 내용 확인이 가능합니다.</p></li>
                                                        </ul>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                        <li>
                                            <dl
                                                :class="['mm_dropdown', { 'S=on' : check === 'event' }]"
                                                @click="() => {
                                                    orderOfGuidance = 'event'
                                                    check = check === orderOfGuidance ? '' : orderOfGuidance;
                                                }"
                                            >
                                                <dt class="btn_dropdown" tabindex="0" :title="check === 'event' ? '접어보기' : '펼쳐보기'">
                                                    <p><b>이벤트를 통한 적립금</b></p><i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="check === 'event' ? { height: 'auto' } : {}">
                                                    <div class="mm_dropdown-item-inner">
                                                        <ul>
                                                            <li><p>적립금이 책정되어 있는 이벤트를 통해서 적립금을 적립하실 수 있습니다. (이벤트당 적립금 상이)</p></li>
                                                        </ul>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                        <li>
                                            <dl
                                                :class="['mm_dropdown', { 'S=on' : check === 'howToUse' }]"
                                                @click="() => {
                                                    orderOfGuidance = 'howToUse'
                                                    check = check === orderOfGuidance ? '' : orderOfGuidance;
                                                }"
                                            >
                                                <dt class="btn_dropdown" tabindex="0" :title="check === 'howToUse' ? '접어보기' : '펼쳐보기'">
                                                    <p><b>적립금 사용 안내</b></p>
                                                    <i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="check === 'howToUse' ? { height: 'auto' } : {}">
                                                    <div class="mm_dropdown-item-inner">
                                                        <ul>
                                                            <li><p>적립금 100원 이상 보유시 적립금 1원 = 현금 1원으로 {{ shopName }}몰 내에서 사용 가능합니다.</p></li>
                                                            <li><p>상품 주문시 사용하신 적립금은 해당 상품의 취소/반품/환 불시 재적립이 가능합니다.</p></li>
                                                        </ul>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <!--// 적립금 안내 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MMPopup from '@/components/layout/Popup.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { ClaimRewardInfo } from '$/@type/member/claimReport';

usePageTitleSetting('쿠폰/적립금');
        
const showCoupon		= ref(true);
const showPoint 		= ref(false);
const orderOfGuidance	= ref('');
const check				= ref('');

const { globalConfigs } = useGlobalConfigs();
const shopName = ref<string>(globalConfigs.value.shop.name);
const isUseReward = ref<boolean>(globalConfigs.value.paidFeatures.reward);
const rewardInfo = ref<ClaimRewardInfo|undefined>(globalConfigs.value.paidFeatures.rewardPolicies);


</script>