<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>고객센터</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_cs-main">
                            <div class="mm_inner">
                                <!-- 고객센터 퀵메뉴 -->
                                <div class="m_cs-main-menu">
                                    <ul>
                                        <li>
                                            <MMLink :to="{ name: 'MypageInquiryQnaCreate' }">
                                                <i class="ico_cs-inquiry" /><b>1:1 고객 상담</b>
                                            </MMLink>
                                        </li>
                                        <li>
                                            <MMLink :to="{ name: 'MypageInquiry' }">
                                                <i class="ico_cs-answer" /><b>상담/답변확인</b>
                                            </MMLink>
                                        </li>
                                        <li>
                                            <MMLink :to="{ name: 'MypageOrderList' }">
                                                <i class="ico_cs-order" /><b>주문 배송조회</b>
                                            </MMLink>
                                        </li>
                                        <li>
                                            <MMLink :to="{ name: 'MypageBenefit', params: { tabType: 'coupon' } }">
                                                <i class="ico_cs-coupon" /><b>쿠폰/적립금</b>
                                            </MMLink>
                                        </li>
                                    </ul>
                                </div>
                                <!--// 고객센터 퀵메뉴 -->

                                <!-- 자주하는 질문 -->
                                <div class="m_cs-faq-menu">
                                    <h3 class="mm_heading">
                                        <b>FAQ 바로가기</b>
                                    </h3>
                                    <ul>
                                        <li v-for="faqType in faqTypes" :key="faqType.id">
                                            <MMLink :to="{ name: 'CsCenterFaq', params: { faqTypeId: faqType.id } }">
                                                <b>{{ faqType.name }}</b>
                                            </MMLink>
                                        </li>
                                    </ul>
                                </div>
                                <!--// 자주하는 질문 -->
                            </div>
                            <!-- 공지사항 -->
                            <section class="m_cs-main-notice">
                                <h3 class="mm_strapline">
                                    <b>공지사항</b>
                                </h3>
                                <p v-if="notices.length < 1" class="mm_text-none">
                                    <i class="ico_text-none" />공지사항 내역이 없습니다.
                                </p>
                                <div v-else class="mm_accordion">
                                    <ul>
                                        <li v-for="notice in notices" :key="notice.id">
                                            <dl
                                                :class="['mm_dropdown', { 'S=on' : selectedNoticeId === notice.id }]"
                                                @click="() => { selectedNoticeId = selectedNoticeId === notice.id ? 0 : notice.id }"
                                            >
                                                <dt
                                                    class="btn_dropdown"
                                                    tabindex="0"
                                                    :title="selectedNoticeId === notice.id ? '접어보기' : '펼쳐보기'"
                                                >
                                                    <p>
                                                        <b v-if="notice.isImportant === true" class="text_important">중요</b>
                                                        <b>{{ notice.title }}</b>
                                                    </p><i class="ico_dropdown" />
                                                </dt>
                                                <dd
                                                    class="mm_dropdown-item"
                                                    :style="selectedNoticeId === notice.id ? { height: 'auto' } : {}"
                                                >
                                                    <div class="mm_dropdown-item-inner" v-html="MMFilters.nlToBr(notice.contents || '')" />
                                                </dd>
                                            </dl>
                                        </li>
                                    </ul>
                                </div>

                                <MMLink v-if="notices.length === 5" :to="{ name: 'CsCenterNoticeIndex' }" class="btn_more">
                                    <b>더보기</b><i class="ico_link" />
                                </MMLink>
                            </section>
                            <!-- 공지사항 -->

                            <!-- 이용안내 -->
                            <section class="m_cs-main-info">
                                <h3 class="mm_strapline">
                                    <b>이용안내</b>
                                </h3>
                                <ul>
                                    <!-- Pro -->
                                    <li v-if="shoppingGuidesActivesInfo.isUseReward">
                                        <MMLink :to="{ name: 'CsCenterInfoReward' }">
                                            <b>고객 보상제도</b><i class="ico_link" />
                                        </MMLink>
                                    </li>
                                    <!--// Pro -->
                                    <!-- <li>
                                        <MMLink :to="{ name: 'CsCenterInfoDelivery' }"><b>주문/반품 배송조회</b><i class="ico_link"></i></MMLink>
                                    </li> -->
                                    <li>
                                        <MMLink :to="{ name: 'CsCenterInfoReturn' }">
                                            <b>반품/환불 안내</b><i class="ico_link" />
                                        </MMLink>
                                    </li>
                                    <li>
                                        <MMLink :to="{ name: 'CsCenterInfoGradeBenefit' }">
                                            <b>회원등급 및 혜택</b><i class="ico_link" />
                                        </MMLink>
                                    </li>
                                    <li>
                                        <MMLink :to="{ name: 'CsCenterInfoCouponPoint' }">
                                            <b>쿠폰/적립금</b><i class="ico_link" />
                                        </MMLink>
                                    </li>
                                    <!-- 유료 -->
                                    <li v-if="shoppingGuidesActivesInfo.activesEasypays.isKakaoPayUse">
                                        <MMLink :to="{ name: 'CsCenterInfoPayKakao' }">
                                            <b>간편결제(카카오페이)</b><i class="ico_link" />
                                        </MMLink>
                                    </li>
                                    <li v-if="shoppingGuidesActivesInfo.activesEasypays.isNaverPayUse">
                                        <MMLink :to="{ name: 'CsCenterInfoPayNaver' }">
                                            <b>간편결제(네이버페이)</b><i class="ico_link" />
                                        </MMLink>
                                    </li>
                                    <li v-if="shoppingGuidesActivesInfo.activesEasypays.isPaycoUse">
                                        <MMLink :to="{ name: 'CsCenterInfoPayPayco' }">
                                            <b>간편결제(페이코)</b><i class="ico_link" />
                                        </MMLink>
                                    </li>
                                    <li v-if="shoppingGuidesActivesInfo.activesEasypays.isTossUse">
                                        <MMLink :to="{ name: 'CsCenterInfoPayToss' }">
                                            <b>간편결제(토스페이)</b><i class="ico_link" />
                                        </MMLink>
                                    </li>
                                    <!--// 유료 -->
                                </ul>
                            </section>
                            <!--// 이용안내 -->
                        </div>
                    </div>
                    <!--// 본문 -->

                    <!-- 푸터 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>
        </template>
    </MMSub>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { noticeRepository } from '$/repository/cs/noticeRepository';
import { faqRepository } from "$/repository/cs/faqRepository";
import { ShoppingGuidesActivesInfo } from '$/@type/cs/shoppingGuide';
import { FaqType } from '$/@type/cs/faq';
import { Notice } from '$/@type/cs/notice';
import MMLink from '@/components/MMLink.vue';
import MMFooter from '@/components/Footer.vue'
import MMSub from '@/components/layout/Sub.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        faqTypes: FaqType[],
        notices: Notice[],
    }
}

export default defineComponent({
    components: {
        MMSub,
        MMFooter,
        MMLink
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const [faqTypes, notices] = await Promise.all([
                faqRepository.getTypes(),
                noticeRepository.getTopNotices(),
            ]);

            next(async (vm) => {
                vm.faqTypes =  faqTypes;
                vm.notices = notices;
            })
        } catch (e) {
            console.log(e);
            next();
        }
    },
    setup() {
        usePageTitleSetting('고객센터');
        const { globalConfigs } = useGlobalConfigs();
        
        // FAQ
        const faqTypes  = ref<FaqType[]>([]);

        // 공지사항
        const notices           = ref<Notice[]>([]);
        const selectedNoticeId  = ref(0);
        
        // 이용안내
        // isUseReward: reward && (useDeliveryDelay || useSoldoutCancel),
        const shoppingGuidesActivesInfo = ref<ShoppingGuidesActivesInfo>({
            isUseReward: globalConfigs.value.paidFeatures.reward , // 고객 보상제도 안내여부
            activesEasypays: globalConfigs.value.paidFeatures.activesEasypays
        });

        return {
            faqTypes,
            notices,
            selectedNoticeId,
            shoppingGuidesActivesInfo,
        }
    }
})
</script>
