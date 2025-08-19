<template>
    <div class="mm_page-content-body">
        <h3 class="mm_heading">
            <b>회원등급 및 혜택</b>
        </h3>
        <!-- 회원등급 및 혜택 -->
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
                            <b>리뷰 작성</b>
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
                        :class="`T=level${grade.order + 1}`"
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
                        <td><b>{{ getLevelupConditionText(grade.gradeUpSellPriceCondition, grade.gradeUpSellAmountCondition) }}</b></td>
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
                                    <div class="mm_coupon T=sm">
                                        <div class="mm_coupon-inner">
                                            <p
                                                v-if="coupon.dcType === 'rate'"
                                                class="text_percent"
                                            >
                                                <strong>{{ coupon.dcAmount }}</strong><sub>%</sub>
                                            </p>
                                            <p
                                                v-if="coupon.dcType === 'KRW'"
                                                class="text_price"
                                            >
                                                <strong>{{ MMFilters.formatNumber(coupon.dcAmount) }}</strong>
                                            </p>
                                            <p class="text_coupon">
                                                등급할인 쿠폰
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <!--발급 제한 횟수 노출-->
                                    <strong
                                        v-if="coupon.isUnlimited"
                                        class="text_amount"
                                    >
                                        <span>x</span> 무제한 발급
                                    </strong>
                                    <strong
                                        v-else
                                        class="text_amount"
                                    >
                                        <span>x</span> {{ coupon.downloadLimit }}장
                                    </strong>
                                </li>
                            </ul>
                            <b v-else>-</b>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mm_note">
            <ul>
                <li>회원 등급은 산정 기준에 따라 매월 1일에 확정됩니다.</li>
                <li>등급별 쿠폰은 매월 1일 다운로드 가능하며, 해당 월에 한하여 사용 가능합니다.</li>
                <li>받으신 쿠폰은 <strong>마이페이지 &#62; 혜택 관리 &#62; 보유 쿠폰</strong> 페이지에서 확인 가능합니다.</li>
                <li>기간 내 사용하지 않은 쿠폰은 이월되지 않으며, 타 쿠폰과 중복 사용 불가합니다.</li>
            </ul>
        </div>
    <!--// 회원등급 및 혜택 -->
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { gradeRepository } from "$/repository/member/gradeRepository";
import { GradeBenefit } from '$/@type/member/grade';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('회원등급 및 혜택', ['이용안내', '고객센터']);
const gradeList = ref<GradeBenefit[]>([]);

// 등급조건문구 생성
function getLevelupConditionText(priceCondition: number, amountCondition: number) {
    // 초기값 세팅
    let gradeupText = ''

    // 구매금액 등급업 조건 존재하는 경우
    if (priceCondition > 0) {
        gradeupText += `${Math.round(priceCondition / 10000)}만원 이상`
    }

    // 구매횟수 등급업 조건 존재하는 경우
    if (amountCondition > 0) {
        gradeupText += gradeupText !== '' ? ', ' : '';  // 앞에서 구매금액 등급업조건 존재하는경우 , 추가
        gradeupText += `${amountCondition}건 이상`;
    }

    // 구매금액/횟수 조건 모두 없는 경우
    if (gradeupText === '') {
        return '신규 회원 및 미구매';
    }
    
    return gradeupText += ' 구매'
}

onMounted(async () => {
    try {
        gradeList.value = await gradeRepository.getBenefitInfo();
    } catch (e) {
        console.log(e);
    }
})
</script>