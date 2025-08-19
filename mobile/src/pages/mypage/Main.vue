<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>마이페이지</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 회원정보 -->
                        <!--
							(D) 'm_my-member' 영역에 회원 등급에 맞는 'T=등급' 클래스를 추가합니다.
							등급 : level5, level4, level3, level2, level1
						-->
                        <section :class="`m_mymain-member T=level${user?.grade?.id || 1}`">
                            <h2>
                                <i v-lazyload="{ src: user?.grade?.imageUrl }" class="mm_bg-contain image_grade" />
                                <b>{{ user?.name }} 님은 <strong>{{ user?.grade.name }}</strong>입니다</b>
                            </h2>
                            <MMLink :to="{ name: 'Setting'}" class="btn_setup">
                                <i class="ico_setup" />
                                <b>계정관리</b>
                            </MMLink>
                            <div class="m_mymain-member-info">
                                <MMLink :to="{ name: 'MypageBenefit', params: { tabType: 'coupon' } }">
                                    <dl class="mm_flex">
                                        <dt class="mm_flex-equal">
                                            보유 쿠폰
                                        </dt>
                                        <dd><strong>{{ MMFilters.formatNumber(benefitAggregates.couponCount) }}</strong><sub>장</sub></dd>
                                    </dl>
                                </MMLink>
                                <MMLink :to="{ name: 'MypageBenefit', params: { tabType: 'point' } }">
                                    <dl class="mm_flex">
                                        <dt class="mm_flex-equal">
                                            보유 적립금
                                        </dt>
                                        <dd><strong>{{ MMFilters.formatNumber(benefitAggregates.point) }}</strong><sub>원</sub></dd>
                                    </dl>
                                </MMLink>
                                <div class="mm_flex T=auto">
                                    <MMLink :to="{ name: 'MypageGradeBenefit' }">
                                        <b>등급혜택</b>
                                    </MMLink>
                                    <MMLink :to="{ name: 'MypageMemberInfoEdit' }">
                                        <b>정보관리</b>
                                    </MMLink>
                                    <MMLink v-if="isUseMySize" :to="{ name: 'MypageMySize'}" class="btn_size">
                                        <i class="ico_size" /><b>My 사이즈</b>
                                    </MMLink>
                                </div>
                            </div>
                        </section>
                        <!--// 회원정보 -->

                        <!-- 진행중인 주문 -->
                        <section class="m_mymain-order">
                            <h3 class="mm_heading">
                                <b>진행중인 주문<small>최근 3주 기준</small></b>
                            </h3>
                            <!-- (D) 진행중인 주문건이 1건 이상인 경우 strong 태그에 mm_text-variable 클래스를 추가합니다. -->
                            <ol class="mm_flex T=equal">
                                <li>
                                    <MMLink :to="{ name: 'MypageOrderList', query: { status_code: orderAggregates.payReady.statusCode } }">
                                        <strong :class="orderAggregates.payReady.count > 0 ? 'mm_text-variable' : ''">
                                            {{ orderAggregates.payReady.count }}
                                        </strong>
                                        <b>입금 대기</b>
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageOrderList', query: { status_code: orderAggregates.paid.statusCode }}">
                                        <strong :class="orderAggregates.paid.count > 0 ? 'mm_text-variable' : ''">
                                            {{ orderAggregates.paid.count }}
                                        </strong>
                                        <b>결제완료</b>
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageOrderList', query: { status_code: orderAggregates.deliveryReady.statusCode }}">
                                        <strong :class="orderAggregates.deliveryReady.count > 0 ? 'mm_text-variable' : ''">
                                            {{ orderAggregates.deliveryReady.count }}
                                        </strong>
                                        <b>배송준비</b>
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageOrderList', query: { status_code: orderAggregates.deliveryIng.statusCode }}">
                                        <strong :class="orderAggregates.deliveryIng.count > 0 ? 'mm_text-variable' : ''">
                                            {{ orderAggregates.deliveryIng.count }}
                                        </strong>
                                        <b>배송중</b>
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageOrderList', query: { status_code: orderAggregates.deliveryComplete.statusCode }}">
                                        <strong :class="orderAggregates.deliveryComplete.count > 0 ? 'mm_text-variable' : ''">
                                            {{ orderAggregates.deliveryComplete.count }}
                                        </strong>
                                        <b>배송완료</b>
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageOrderList', query: { status_code: orderAggregates.purchaseConfirmed.statusCode }}">
                                        <strong :class="orderAggregates.purchaseConfirmed.count > 0 ? 'mm_text-variable' : ''">
                                            {{ orderAggregates.purchaseConfirmed.count }}
                                        </strong>
                                        <b>구매확정</b>
                                    </MMLink>
                                </li>
                            </ol>

                            <!-- (D) 취소, 교환, 반품이 1건 미만인 경우 <span> 태그, 1건 이상인 경우에는 <strong> 태그로 감싸줍니다. -->
                            <ul class="mm_flex T=equal">
                                <li>
                                    <MMLink :to="{ name: 'MypageOrderCancelList' }">
                                        <p>
                                            취소
                                            <strong v-if="orderAggregates.cancelCount > 0">{{ orderAggregates.cancelCount }}</strong>
                                            <span v-else>{{ orderAggregates.cancelCount }}</span>
                                        </p>
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageOrderReturnList' }">
                                        <p>
                                            반품
                                            <strong v-if="orderAggregates.returnCount > 0">{{ orderAggregates.returnCount }}</strong>
                                            <span v-else>{{ orderAggregates.returnCount }}</span>
                                        </p>
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageOrderExchangeList' }">
                                        <p>
                                            교환
                                            <strong v-if="orderAggregates.exchangeCount > 0">{{ orderAggregates.exchangeCount }}</strong>
                                            <span v-else>{{ orderAggregates.exchangeCount }}</span>
                                        </p>
                                    </MMLink>
                                </li>
                            </ul>
                        </section>
                        <!--// 진행중인 주문 -->

                        <!-- 마이페이지 메뉴 -->
                        <div class="m_mymain-menu">
                            <ul>
                                <li>
                                    <MMLink :to="{ name: 'MypageOrderList' }">
                                        <b>주문 관리</b><i class="ico_link" />
                                    </MMLink>
                                </li>
                                <li v-if="globalConfigs.paidFeatures.raffle">
                                    <MMLink :to="{ name: 'MypageRaffleEntry' }">
                                        <b>래플 응모 내역</b><i class="ico_link" />
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageBenefit', params: { tabType: 'coupon' } }">
                                        <b>혜택 관리</b><i class="ico_link" />
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageWishGoods' }">
                                        <b>My 찜</b><i class="ico_link" />
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageReviewList' }">
                                        <b>리뷰 관리</b><i class="ico_link" />
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageInquiryList' }">
                                        <b>문의 관리</b><i class="ico_link" />
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageInquiryQnaCreate' }">
                                        <b>1:1 문의하기</b><i class="ico_link" />
                                    </MMLink>
                                </li>
                                <li v-if="isUseReward && isUseDeliveryDelay">
                                    <MMLink :to="{ name: 'MypageClaimDeliveryDelay' }">
                                        <b>배송지연 신고</b><i class="ico_link" />
                                    </MMLink>
                                </li>
                                <li v-if="isUseReward && isUseSoldoutCancel">
                                    <MMLink :to="{ name: 'MypageClaimSoldoutCancel' }">
                                        <b>품절취소 신고</b><i class="ico_link" />
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageMemberInfoRefundAccount' }">
                                        <b>환불 계좌 관리</b><i class="ico_link" />
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink :to="{ name: 'MypageWithdraw' }">
                                        <b>회원 탈퇴</b><i class="ico_link" />
                                    </MMLink>
                                </li>
                            </ul>
                        </div>
                        <!--// 마이페이지 메뉴 -->

                        <!-- 최근 본 상품 -->
                        <section class="m_mymain-recent">
                            <h3 class="mm_strapline">
                                <b>최근 본 상품</b><strong>{{ recentViewGoods.length }}</strong>
                            </h3>
                            <p v-if="recentViewGoods.length < 1" class="mm_text-none">
                                <i class="ico_text-none" />최근 본 상품이 없습니다
                            </p>
                            <div v-else class="mm_scroller T=x">
                                <ul>
                                    <li v-for="goods in recentViewGoods.slice(0, 10)" :key="goods.id">
                                        <MMLink :to="{ name: 'GoodsDetail', params: { id: goods.id }}">
                                            <figure>
                                                <i v-lazyload="{ 'src': goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                                <figcaption class="mm_ir-blind">
                                                    <p class="text_brand">
                                                        {{ goods.brandName }}
                                                    </p>
                                                    <p class="text_product">
                                                        {{ goods.name }}
                                                    </p>
                                                </figcaption>
                                            </figure>
                                        </MMLink>
                                    </li>
                                </ul>
                            </div>
                            <MMLink class="btn_more" :to="{ name: 'MypageRecentViewGoods' }">
                                <b>더보기</b><i class="ico_link" />
                            </MMLink>
                        </section>
                        <!--// 최근 본 상품 -->

                        <!-- 최근 본 기획전 -->
                        <section class="m_mymain-recent">
                            <h3 class="mm_strapline">
                                <b>최근 본 기획전</b><strong>{{ recentViewPlannings.length }}</strong>
                            </h3>
                            <p v-if="recentViewPlannings.length < 1" class="mm_text-none">
                                <i class="ico_text-none" />최근 본 기획전이 없습니다
                            </p>
                            <div v-else class="mm_list">
                                <ul>
                                    <li v-for="planning in recentViewPlannings.slice(0, 10)" :key="planning.id">
                                        <MMLink :to="{ name: 'PlanningDetail', params: { id: planning.id } }">
                                            <b v-if="planning.isEnded" class="text_status T=status-off">종료</b>
                                            <b v-else class="text_status">진행중</b>
                                            <b>{{ planning.title }}</b>
                                        </MMLink>
                                    </li>
                                </ul>
                            </div>
                            <MMLink class="btn_more" :to="{ name: 'MypageRecentViewPlanning' }">
                                <b>더보기</b><i class="ico_link" />
                            </MMLink>
                        </section>
                        <!--// 최근 본 기획전 -->
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

<script setup lang='ts'>
import MMSub from '@/components/layout/Sub.vue';
import MMFooter from '@/components/Footer.vue';
import MMLink from '@/components/MMLink.vue';
import { onMounted, ref } from 'vue';
import { mmon } from '$/helper/mmon';
import { BenefitAggregates, OrderAggregates } from '$/@type/member/aggregates';
import { memberAggregateRepository } from '$/repository/member/aggregateRepository';
import { RecentViewPlanning } from '$/@type/member/recentViews';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useUserState, useRefreshUser } from '$/composables/auth/userComposable';
import { useRecentViewGoods } from '$/composables/shoppingComposable';

/** VARIABLE */
usePageTitleSetting('마이페이지');
// 회원 정보 
const { user } = useUserState();
const { globalConfigs } = useGlobalConfigs();
// 회원 혜택 집계(포인트, 쿠폰) 정보
const benefitAggregates = ref<BenefitAggregates>({
    couponCount: 0,
    point: 0,
});
		
const orderAggregates = ref<OrderAggregates>({
    payReady: {
        count: 0,
        statusCode: 0
    },           // 입금대기
    paid: {
        count: 0,
        statusCode: 0
    },               // 결제완료
    deliveryReady: {
        count: 0,
        statusCode: 0
    },      // 배송준비
    deliveryIng: {
        count: 0,
        statusCode: 0
    },        // 배송중
    deliveryComplete: {
        count: 0,
        statusCode: 0
    },   // 배송완료
    purchaseConfirmed: {
        count: 0,
        statusCode: 0
    },    // 구매확정
    cancelCount: 0,             // 취소
    returnCount: 0,             // 반품
    exchangeCount: 0,           // 교환
    refundCount: 0              // 환불
});

const isUseReward = ref<boolean>(globalConfigs.value.paidFeatures.reward);
const isUseMySize = ref<boolean>(globalConfigs.value.paidFeatures.personalization);
const isUseDeliveryDelay = ref<boolean>(globalConfigs.value.paidFeatures.rewardPolicies?.useDeliveryDelay || false);
const isUseSoldoutCancel = ref<boolean>(globalConfigs.value.paidFeatures.rewardPolicies?.useSoldoutCancel || false);

// 최근 본 상품/기획전
const { recentViewGoods } = useRecentViewGoods();
const recentViewPlannings = ref<RecentViewPlanning[]>([]);

onMounted(async () => {
    mmon.loading.show();
    try {
        const [ benefit, orderAggregate, recentViewPlanning ] = await Promise.all([
            memberAggregateRepository.getBenefitInfo(),
            memberAggregateRepository.getOrderInfo(),
            shoppingRepository.getRecentViewPlannings()
        ]);
        
        benefitAggregates.value = benefit;
        orderAggregates.value = orderAggregate;
        recentViewPlannings.value = recentViewPlanning;

        useRefreshUser();
    } catch(e) {

    } finally {
        mmon.loading.hide();
    }
});

</script>