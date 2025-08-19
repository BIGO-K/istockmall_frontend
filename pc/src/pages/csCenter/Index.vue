<template>
    <div class="mm_page-content">
        <div class="G:lnb">
            <!-- 서브상단 -->
            <div class="mm_page-content-head">
                <h3 class="mm_title">
                    <b>고객센터</b>
                </h3>
            </div>
            <!--// 서브상단 -->

            <!-- lnb -->
            <nav class="mm_lnb">
                <h2 class="mm_lnb-title">
                    <b>고객센터</b>
                </h2>
                <ul>
                    <li>
                        <a href="#"><h6><b>1:1 문의</b></h6></a>
                        <ul>
                            <li>
                                <MMLink :to="{ name: 'MypageInquiryQnaCreate' }">
                                    <b>1:1 고객상담</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink :to="{ name: 'MypageInquiryQnaList' }">
                                    <b>문의 관리</b>
                                </MMLink>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#"><h6><b>자주하는 질문</b></h6></a>
                        <ul>
                            <li
                                v-for="faqType in faqTypes"
                                :key="faqType.id"
                            >
                                <MMLink
                                    :class="{ 'S=lnb-on': faqTypeId === faqType.id }"
                                    :title="faqTypeId === faqType.id ? '선택됨' : ''"
                                    :to="{ name: 'CsCenterMain', query: { faqTypeId: faqType.id } }"
                                >
                                    <b>{{ faqType.name }}</b>
                                </MMLink>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#"><h6><b>이용안내</b></h6></a>
                        <ul>
                            <li>
                                <MMLink
                                    v-if="shoppingGuidesActivesInfo.isUseReward"
                                    :class="{ 'S=lnb-on': route.name === 'CsCenterInfoReward' }"
                                    :title="route.name === 'CsCenterInfoReward' ? '선택됨' : ''"
                                    :to="{ name: 'CsCenterInfoReward' }"
                                >
                                    <b>고객 보상제도</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink
                                    :class="{ 'S=lnb-on': route.name === 'CsCenterInfoDelivery' }"
                                    :title="route.name === 'CsCenterInfoDelivery' ? '선택됨' : ''"
                                    :to="{ name: 'CsCenterInfoDelivery' }"
                                >
                                    <b>주문/반품 배송조회</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink
                                    :class="{ 'S=lnb-on': route.name === 'CsCenterInfoReturn' }"
                                    :title="route.name === 'CsCenterInfoReturn' ? '선택됨' : ''"
                                    :to="{ name: 'CsCenterInfoReturn' }"
                                >
                                    <b>반품/환불 안내</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink
                                    :class="{ 'S=lnb-on': route.name === 'CsCenterInfoGradeBenefit' }"
                                    :title="route.name === 'CsCenterInfoGradeBenefit' ? '선택됨' : ''"
                                    :to="{ name: 'CsCenterInfoGradeBenefit' }"
                                >
                                    <b>회원등급 및 혜택</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink
                                    :class="{ 'S=lnb-on': route.name === 'CsCenterInfoCouponPoint' }"
                                    :title="route.name === 'CsCenterInfoCouponPoint' ? '선택됨' : ''"
                                    :to="{ name: 'CsCenterInfoCouponPoint' }"
                                >
                                    <b>쿠폰/{{ pointLabel.name }}</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink
                                    v-if="shoppingGuidesActivesInfo.activesEasypays.isKakaoPayUse"
                                    :class="{ 'S=lnb-on': route.name === 'CsCenterInfoPayKakao' }"
                                    :title="route.name === 'CsCenterInfoPayKakao' ? '선택됨' : ''"
                                    :to="{ name: 'CsCenterInfoPayKakao' }"
                                >
                                    <b>간편결제(카카오페이)</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink
                                    v-if="shoppingGuidesActivesInfo.activesEasypays.isNaverPayUse"
                                    :class="{ 'S=lnb-on': route.name === 'CsCenterInfoPayNaver' }"
                                    :title="route.name === 'CsCenterInfoPayNaver' ? '선택됨' : ''"
                                    :to="{ name: 'CsCenterInfoPayNaver' }"
                                >
                                    <b>간편결제(네이버페이)</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink
                                    v-if="shoppingGuidesActivesInfo.activesEasypays.isPaycoUse"
                                    :class="{ 'S=lnb-on': route.name === 'CsCenterInfoPayPayco' }"
                                    :title="route.name === 'CsCenterInfoPayPayco' ? '선택됨' : ''"
                                    :to="{ name: 'CsCenterInfoPayPayco' }"
                                >
                                    <b>간편결제(페이코)</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink
                                    v-if="shoppingGuidesActivesInfo.activesEasypays.isTossUse"
                                    :class="{ 'S=lnb-on': route.name === 'CsCenterInfoPayToss' }"
                                    :title="route.name === 'CsCenterInfoPayToss' ? '선택됨' : ''"
                                    :to="{ name: 'CsCenterInfoPayToss' }"
                                >
                                    <b>간편결제(토스페이)</b>
                                </MMLink>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <MMLink
                            :class="{ 'S=lnb-on': route.name === 'CsCenterNoticeIndex' || route.name === 'CsCenterNoticeDetail' }"
                            :title="route.name === 'CsCenterNoticeIndex' || route.name === 'CsCenterNoticeDetail' ? '선택됨': ''"
                            :to="{ name: 'CsCenterNoticeIndex' }"
                        >
                            <h6><b>공지사항</b></h6>
                        </MMLink>
                    </li>
                </ul>
            </nav>
            <!--// lnb -->

            <!-- 본문 내용 -->
            <router-view :key="route.path" />
            <!--// 본문 내용 -->
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { FaqType } from '$/@type/cs/faq';
import { faqRepository } from '$/repository/cs/faqRepository';
import { ShoppingGuidesActivesInfo } from '$/@type/cs/shoppingGuide';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { PointLabel } from '$/@type/member/point';

const { 
    globalConfigs,
    route,
} = usePageContext();

const faqTypes = ref<FaqType[]>([]);
const shoppingGuidesActivesInfo = ref<ShoppingGuidesActivesInfo>({
    isUseReward: globalConfigs.value.paidFeatures.reward, // 고객 보상제도 안내여부
    activesEasypays: globalConfigs.value.paidFeatures.activesEasypays,
});
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);

const faqTypeId = computed(() => {
    return Number(route.query.faqTypeId) || 0
})

fetchFaqTypes()

async function fetchFaqTypes() {
    try {
        faqTypes.value = await faqRepository.getTypes();
    } catch(e) {
        console.log(e)
    }
}
</script>