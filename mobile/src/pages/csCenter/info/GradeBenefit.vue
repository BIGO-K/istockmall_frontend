<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>회원등급 및 혜택</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-cs-benefit">
                            <div class="mm_grade">
                                <h3><b>등급별 혜택 안내</b></h3>
                                <p>최근 6개월간 실 결제금액을 기준으로 매월 1일<br>구매등급에 반영됩니다</p>
                                <div class="mm_accordion">
                                    <ul>
                                        <li v-for="grade in grades" :key="grade.id">
                                            <dl 
                                                :class="['mm_dropdown', { 'S=on' : selectedGradeId === grade.id }]"
                                                @click="toggleGrade(grade.id)"
                                            >
                                                <dt class="btn_dropdown" tabindex="0" :title="selectedGradeId === grade.id ? '접어보기' : '펼쳐보기'">
                                                    <p class="text_grade">
                                                        <strong>
                                                            <i v-lazyload="grade.imageUrl" class="mm_bg-cover image_grade" />{{ grade.name }}
                                                        </strong>
                                                        <span>{{ getLevelupConditionText(grade.gradeUpSellPriceCondition, grade.gradeUpSellAmountCondition) }}</span>
                                                    </p>
                                                    <i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="selectedGradeId === grade.id ? { height: 'auto' } : {}">
                                                    <div class="mm_dropdown-item-inner">
                                                        <template v-if="grade.coupons?.length">
                                                            <dl v-for="coupon, index in grade.coupons" :key="coupon.id">
                                                                <dt>{{ index === 0 ? '등급별 쿠폰' : '' }}</dt>
                                                                <dd>
                                                                    <template v-if="coupon.dcType === 'rate'">
                                                                        <p>{{ coupon.dcAmount }}% 할인</p>
                                                                    </template>
                                                                    <template v-else>
                                                                        <p>{{ MMFilters.formatNumber(coupon.dcAmount) }}원 할인</p>
                                                                    </template>
                                                                    <div class="mm_coupon">
                                                                        <div class="mm_coupon-inner">
                                                                            <template v-if="coupon.dcType === 'rate'">
                                                                                <p class="text_percent">
                                                                                    <strong>{{ coupon.dcAmount }}</strong><sub>%</sub>
                                                                                </p>
                                                                                <p class="text_coupon">
                                                                                    등급할인 쿠폰
                                                                                </p>
                                                                            </template>
                                                                            <template v-else-if="coupon.dcType === 'KRW'">
                                                                                <p class="text_price">
                                                                                    <strong>{{ MMFilters.formatNumber(coupon.dcAmount) }}</strong>
                                                                                </p>
                                                                                <p class="text_coupon">
                                                                                    등급할인 쿠폰
                                                                                </p>
                                                                            </template>
                                                                        </div>
                                                                    </div>
                                                                    <template v-if="coupon.isUnlimited">
                                                                        <span class="text_amount T=unlimited">x 무제한 발급</span>
                                                                    </template>
                                                                    <template v-else>
                                                                        <span class="text_amount">x {{ coupon.downloadLimit }}<sub>장</sub></span>
                                                                    </template>
                                                                </dd>
                                                            </dl>
                                                        </template>
                                                        <template v-else>
                                                            <dl>
                                                                <dt>등급별 쿠폰</dt>
                                                                <dd>-</dd>
                                                            </dl>
                                                        </template>
                                                        <dl>
                                                            <dt>등급 적립율</dt>
                                                            <dd>{{ grade.purchaseBenefitRate }}%</dd>
                                                        </dl>
                                                        <dl>
                                                            <dt>리뷰 작성</dt>
                                                            <dd>
                                                                <ul>
                                                                    <li>텍스트 리뷰: {{ MMFilters.formatNumber(grade.textReviewReward) }}원</li>
                                                                    <li>포토 리뷰: {{ MMFilters.formatNumber(grade.photoReviewReward) }}원</li>
                                                                </ul>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="mm_note">
                                <ul class="mm_inner">
                                    <li>회원 등급은 산정 기준에 따라 매월 1일에 확정됩니다.</li>
                                    <li>등급별 쿠폰은 매월 1일 다운로드 가능하며, 해당 월에 한하여 사용 가능합니다.</li>
                                    <li>받으신 쿠폰은 <strong>마이페이지 &#62; 혜택 관리 &#62; 보유 쿠폰</strong> 페이지에서 확인 가능합니다.</li>
                                    <li>기간 내 사용하지 않은 쿠폰은 이월되지 않으며, 타 쿠폰과 중복 사용 불가합니다.</li>
                                </ul>
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
import MMPopup from '@/components/layout/Popup.vue';
import { gradeRepository } from '$/repository/member/gradeRepository';
import { GradeBenefit } from '$/@type/member/grade';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('회원등급 및 혜택');
        
const grades = ref<GradeBenefit[]>([])
const selectedGradeId = ref(0);	// 등급 체크
		
function toggleGrade(gradeId: number) {
    if (selectedGradeId.value === gradeId) {
        selectedGradeId.value = 0
        return
    }

    selectedGradeId.value = gradeId
}

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
        grades.value = await gradeRepository.getBenefitInfo()
    } catch (e) {
        console.log(e)
    }
});
</script>