<template v-once>
    <div class="mm_page-content">
        <div class="G:lnb">
            <!-- 서브상단 -->
            <div class="mm_page-content-head">
                <h3 class="mm_title">
                    <b>마이페이지</b>
                </h3>
                <keep-alive>
                    <UserInfo />
                </keep-alive>
            </div>
            <!--// 서브상단 -->
            <!-- lnb -->
            <nav class="mm_lnb">
                <h2 class="mm_lnb-title">
                    <b>마이페이지</b>
                </h2>
                <!-- (D) 현재페이지의 a요소에 S=lnb-on 클래스와 '선택됨' 타이틀을 넣어줍니다 -->
                <ul>
                    <li v-if="globalConfigs.paidFeatures.raffle">
                        <MMLink 
                            :class="router.currentRoute.value.name == 'MypageRaffleEntry' ? 'S=lnb-on' : ''"
                            :title="router.currentRoute.value.name == 'MypageRaffleEntry' ? '선택됨' : ''"
                            :to="{ name: 'MypageRaffleEntry' }"
                        >
                            <h6><b>래플 응모 내역</b></h6>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink 
                            :class="router.currentRoute.value.name == 'MypageOrderList' ? 'S=lnb-on' : ''"
                            :title="router.currentRoute.value.name == 'MypageOrderList' ? '선택됨' : ''"
                            :to="{ name: 'MypageOrderList' }"
                        >
                            <h6><b>주문 관리</b></h6>
                        </MMLink>
                        <ul>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageOrderCancelList' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageOrderCancelList' ? '선택됨' : ''"
                                    :to="{ name: 'MypageOrderCancelList' }"
                                >
                                    <b>주문 취소</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageOrderReturnList' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageOrderReturnList' ? '선택됨' : ''"
                                    :to="{ name: 'MypageOrderReturnList' }"
                                >
                                    <b>주문 반품</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageOrderExchangeList' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageOrderExchangeList' ? '선택됨' : ''"
                                    :to="{ name: 'MypageOrderExchangeList' }"
                                >
                                    <b>주문 교환</b>
                                </MMLink>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <MMLink :to="{ name: 'MypageBenefit' }">
                            <h6><b>혜택 관리</b></h6>
                        </MMLink>
                        <ul>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageBenefitCoupon' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageBenefitCoupon' ? '선택됨' : ''"
                                    :to="{ name: 'MypageBenefitCoupon' }"
                                >
                                    <b>보유 쿠폰</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageBenefitPoint' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageBenefitPoint' ? '선택됨' : ''"
                                    :to="{ name: 'MypageBenefitPoint' }"
                                >
                                    <b>보유 적립금</b>
                                </MMLink>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <MMLink :to="{ name: 'MypageWish' }">
                            <h6><b>My 찜</b></h6>
                        </MMLink>
                        <ul>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageWishGoods' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageWishGoods' ? '선택됨' : ''"
                                    :to="{ name: 'MypageWishGoods' }"
                                >
                                    <b>찜한 아이템</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageWishBrands' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageWishBrands' ? '선택됨' : ''"
                                    :to="{ name: 'MypageWishBrands' }"
                                >
                                    <b>찜한 브랜드</b>
                                </MMLink>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <MMLink :to="{ name: 'MypageRecentView' }">
                            <h6><b>최근 본 쇼핑정보</b></h6>
                        </MMLink>
                        <ul>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageRecentView' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageRecentView' ? '선택됨' : ''"
                                    :to="{ name: 'MypageRecentView' }"
                                >
                                    <b>최근 본 상품/기획전</b>
                                </MMLink>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <MMLink :to="{ name: 'MypageReview' }">
                            <h6><b>리뷰 관리</b></h6>
                        </MMLink>
                        <ul>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageReviewWritable' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageReviewWritable' ? '선택됨' : ''"
                                    :to="{ name: 'MypageReviewWritable' }"
                                >
                                    <b>작성 가능한 리뷰</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageReviewWritten' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageReviewWritten' ? '선택됨' : ''"
                                    :to="{ name: 'MypageReviewWritten' }"
                                >
                                    <b>작성한 리뷰</b>
                                </MMLink>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <MMLink :to="{ name: 'MypageInquiryQnaCreate' }">
                            <h6><b>1:1 문의</b></h6>
                        </MMLink>
                        <ul>
                            <li>
                                <MMLink 
                                    :to="{ name: 'MypageInquiryQnaCreate' }"
                                    :class="router.currentRoute.value.name == 'MypageInquiryQnaCreate' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageInquiryQnaCreate' ? '선택됨' : ''"
                                >
                                    <b>1:1 문의하기</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink 
                                    :to="{ name: 'MypageInquiryQnaList' }"
                                    :class="router.currentRoute.value.name == 'MypageInquiryQnaList' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageInquiryQnaList' ? '선택됨' : ''"
                                >
                                    <b>문의 관리</b>
                                </MMLink>
                            </li>
                        </ul>
                    </li>
                    <template v-if="isUseReward">
                        <li v-if="isUseDeliveryDelay">
                            <MMLink :to="{ name: 'MypageClaimDeliveryDelayClaimable' }">
                                <h6><b>배송지연 신고</b></h6>
                            </MMLink>
                            <ul>
                                <li>
                                    <MMLink 
                                        :to="{ name: 'MypageClaimDeliveryDelayClaimable' }"
                                        :class="router.currentRoute.value.name == 'MypageClaimDeliveryDelayClaimable' ? 'S=lnb-on' : ''"
                                        :title="router.currentRoute.value.name == 'MypageClaimDeliveryDelayClaimable' ? '선택됨' : ''"
                                    >
                                        <b>배송지연 신고</b>
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink 
                                        :to="{ name: 'MypageClaimDeliveryDelayResult' }"
                                        :class="router.currentRoute.value.name == 'MypageClaimDeliveryDelayResult' ? 'S=lnb-on' : ''"
                                        :title="router.currentRoute.value.name == 'MypageClaimDeliveryDelayResult' ? '선택됨' : ''"
                                    >
                                        <b>배송지연 처리결과</b>
                                    </MMLink>
                                </li>
                            </ul>
                        </li>
                        <li v-if="isUseSoldoutCancel">
                            <MMLink :to="{ name: 'MypageClaimSoldoutCancelClaimable' }">
                                <h6><b>품절취소 신고</b></h6>
                            </MMLink>
                            <ul>
                                <li>
                                    <MMLink 
                                        :to="{ name: 'MypageClaimSoldoutCancelClaimable' }"
                                        :class="router.currentRoute.value.name == 'MypageClaimSoldoutCancelClaimable' ? 'S=lnb-on' : ''"
                                        :title="router.currentRoute.value.name == 'MypageClaimSoldoutCancelClaimable' ? '선택됨' : ''"
                                    >
                                        <b>품절취소 신고</b>
                                    </MMLink>
                                </li>
                                <li>
                                    <MMLink 
                                        :to="{ name: 'MypageClaimSoldoutCancelResult' }"
                                        :class="router.currentRoute.value.name == 'MypageClaimSoldoutCancelResult' ? 'S=lnb-on' : ''"
                                        :title="router.currentRoute.value.name == 'MypageClaimSoldoutCancelResult' ? '선택됨' : ''"
                                    >
                                        <b>품절취소 처리결과</b>
                                    </MMLink>
                                </li>
                            </ul>
                        </li>
                    </template>
                    <li>
                        <MMLink :to="{ name: 'MypageMemberInfoEdit' }">
                            <h6><b>회원정보 관리</b></h6>
                        </MMLink>
                        <ul>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageMemberInfoEdit' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageMemberInfoEdit' ? '선택됨' : ''"
                                    :to="{ name: 'MypageMemberInfoEdit' }"
                                >
                                    <b>회원정보 수정</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageMemberInfoRefundAccount' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageMemberInfoRefundAccount' ? '선택됨' : ''"
                                    :to="{ name: 'MypageMemberInfoRefundAccount' }"
                                >
                                    <b>환불 계좌 관리</b>
                                </MMLink>
                            </li>
                            <li>
                                <MMLink 
                                    :class="router.currentRoute.value.name == 'MypageWithdraw' ? 'S=lnb-on' : ''"
                                    :title="router.currentRoute.value.name == 'MypageWithdraw' ? '선택됨' : ''"
                                    :to="{ name: 'MypageWithdraw' }"
                                >
                                    <b>회원 탈퇴</b>
                                </MMLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
            <!--// lnb -->
            <router-view />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UserInfo from '@/components/mypage/UserInfoHeader.vue';
import { useRefreshUser } from '$/composables/auth/userComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';

const router = useRouter();
const { globalConfigs } = useGlobalConfigs();
const isUseReward = ref<boolean>(globalConfigs.value.paidFeatures.reward);
const isUseDeliveryDelay = ref<boolean>(globalConfigs.value.paidFeatures.rewardPolicies?.useDeliveryDelay || false);
const isUseSoldoutCancel = ref<boolean>(globalConfigs.value.paidFeatures.rewardPolicies?.useSoldoutCancel || false);

usePageTitleSetting('마이페이지');

onMounted(async () => {
    await useRefreshUser();
    
});

</script>

