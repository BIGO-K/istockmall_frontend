<template>
    <div class="mm_page-content-body">
        <h5 class="mm_heading">
            <b>회원등급 및 혜택</b>
        </h5>
        <!-- 회원등급 및 혜택 -->
        <!-- (D) 현재 회원의 등급 tr태그에 T=secondary 클래스를 추가해줍니다 -->
        <div class="mm_grade">
            <table>
                <colgroup>
                    <col style="width:240px;">
                    <col style="width:240px;">
                    <col style="width:160px;">
                    <col style="width:160px;">
                    <col>
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">
                            <b>등급</b>
                        </th>
                        <th scope="col">
                            <b>등급조건</b>
                        </th>
                        <th scope="col">
                            <b>등급 적립율</b>
                        </th>
                        <th scope="col">
                            <b>리뷰작성</b>
                        </th>
                        <th scope="col">
                            <b>등급별 쿠폰</b>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="grade in gradeList"
                        :key="grade.id"
                        :class="[{ 'T=grade-on': grade.id == user?.grade.id}, `T=level${grade.order + 1}`]"
                    >
                        <th scope="row">
                            <p class="text_grade">
                                <i
                                    v-lazyload="grade.imageUrl"
                                    class="mm_bg-contain image_grade"
                                />
                                <strong>{{ grade.name }}</strong>
                            </p>
                        </th>
                        <td><b>{{ getLevelUpConditionText(grade.gradeUpSellPriceCondition, grade.gradeUpSellAmountCondition) }}</b></td>
                        <td><b>{{ MMFilters.formatNumber(grade.purchaseBenefitRate) }}%</b></td>
                        <td>
                            <ul class="text_review">
                                <li>텍스트 리뷰: {{ MMFilters.formatNumber(grade.textReviewReward) }}원</li>
                                <li>포토 리뷰: {{ MMFilters.formatNumber(grade.photoReviewReward) }}원</li>
                            </ul>
                        </td>
                        <td>
                            <ul v-if="(grade.coupons?.length || 0) > 0">
                                <li
                                    v-for="coupon in grade.coupons || []"
                                    :key="coupon.id"
                                >
                                    <div class="mm_coupon">
                                        <!--회원등급에 해당하는 등급의 쿠폰이면서 발급횟수제한보다 적게 다운받은 경우 > 다운로드 버튼 활성화-->
                                        <a 
                                            class="mm_coupon-inner" 
                                            :href="grade.id === user?.grade?.id && isDownloadable(coupon) ? '' : undefined"
                                            @click.prevent="grade.id === user?.grade?.id && isDownloadable(coupon) ? downloadGradeCoupon(coupon.id) : () => {}"
                                        >
                                            <!--발급상태문구 노출-->
                                            <p
                                                v-if="grade.id === user?.grade?.id && !isDownloadable(coupon)"
                                                class="text_download"
                                            >
                                                발급 완료<i class="ico_coupon-complete" />
                                            </p>
                                            <p
                                                v-else
                                                class="text_download"
                                            >쿠폰받기<i class="ico_coupon-download" /></p>

                                            <!--할인 type 분기-->
                                            <p
                                                v-if="coupon.dcType === 'rate'"
                                                class="text_percent"
                                            ><strong>{{ coupon.dcAmount }}</strong><sub>%</sub></p>
                                            <p
                                                v-if="coupon.dcType === 'KRW'"
                                                class="text_price"
                                            ><strong>{{ MMFilters.formatNumber(coupon.dcAmount) }}</strong></p>
                                            <p class="text_coupon">등급할인 쿠폰</p>
                                        </a>
                                    </div>
                                    <!--발급 제한 횟수 노출-->
                                    <strong
                                        v-if="coupon.isUnlimited"
                                        class="text_amount"
                                    ><span>x</span> 무제한 발급</strong>
                                    <strong
                                        v-else
                                        class="text_amount"
                                    ><span>x</span> {{ coupon.downloadLimit }}장</strong>
                                </li>
                            </ul>
                            <b v-else>-</b>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--// 회원등급 및 혜택 -->

        <!-- 유의사항 -->
        <div class="mm_note">
            <ul>
                <li>회원 등급은 산정 기준에 따라 매월 1일에 확정됩니다.</li>
                <li>등급별 쿠폰은 매월 1일 다운로드 가능하며, 해당 월에 한하여 사용 가능합니다.</li>
                <li>받으신 쿠폰은 <strong>마이페이지 &#62; 혜택 관리 &#62; 보유 쿠폰</strong> 페이지에서 확인 가능합니다.</li>
                <li>기간 내 사용하지 않은 쿠폰은 이월되지 않으며, 타 쿠폰과 중복 사용 불가합니다.</li>
            </ul>
        </div>
    <!--// 유의사항 -->
    </div>
    <!--// 본문 내용 -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { gradeRepository } from "$/repository/member/gradeRepository";
import { GradeBenefit, GradeCoupon, GradeCouponRegistCount } from '$/@type/member/grade';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable'
import { useRefreshUser } from '$/composables/auth/userComposable';

usePageTitleSetting('회원등급 및 혜택', ['마이페이지']);
const { user } = usePageContext();

// 등급별 혜택정보
const gradeList = ref<GradeBenefit[]>([]);
// 회원의 등급쿠폰 발급 횟수 정보
const couponRegistCount = ref<GradeCouponRegistCount[]>([]);

// 등급조건문구 생성
function getLevelUpConditionText(priceCondition: number, amountCondition: number) {
    // 초기값 세팅
    let gradeUpText = ''

    // 구매금액 등급업 조건 존재하는 경우
    if (priceCondition > 0) {
        gradeUpText += `${Math.round(priceCondition / 10000)}만원 이상`
    }

    // 구매횟수 등급업 조건 존재하는 경우
    if (amountCondition > 0) {
        gradeUpText += gradeUpText !== '' ? ', ' : '';  // 앞에서 구매금액 등급업조건 존재하는경우 , 추가
        gradeUpText += `${amountCondition}건 이상`;
    }

    // 구매금액/횟수 조건 모두 없는 경우
    if (gradeUpText === '') {
        return '신규 회원 및 미구매';
    }
    
    return gradeUpText += ' 구매'
}

// 쿠폰 다운로드 가능 여부 계산(발급받은 횟수와 최대 발급가능 횟수 비교)
function isDownloadable(gradeCoupon: GradeCoupon) {
    if (gradeCoupon.isUnlimited) {
        /**
         * 무제한발급
         */
        return true;
    }

    const downloadCountInfo:GradeCouponRegistCount|undefined = couponRegistCount.value.find((registCount) => {
        return registCount.gradeCouponId === gradeCoupon.id
    })
    if (!downloadCountInfo) {
        return true;
    }

    return downloadCountInfo.couponRegistCount < gradeCoupon.downloadLimit;
}

// 등급쿠폰 다운로드
async function downloadGradeCoupon(couponId: number) {
    try {
        mmon.loading.show();
        await gradeRepository.downloadGradeCoupon(couponId);
        couponRegistCount.value = await gradeRepository.gerGradeCouponRegistCount();
        mmon.bom.alert('쿠폰이 발급되었습니다.');
    } catch (e) {
        defaultCatch(e)
    } finally {
        mmon.loading.hide();
    }
}

onMounted(async () => {
    try {
        const [ grades, couponCount ] = await Promise.all([
            gradeRepository.getBenefitInfo(),
            gradeRepository.gerGradeCouponRegistCount()
        ])
        
        gradeList.value = grades;
        couponRegistCount.value = couponCount;

        useRefreshUser();
    } catch (e) {
        console.log(e);
    }
})
</script>