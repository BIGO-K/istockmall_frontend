<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>등급 혜택 안내</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 회원등급정보 -->
                        <!--
                            (D) 'm_popup-mymember' 영역에 회원 등급에 맞는 'T=등급' 클래스를 추가합니다.
                            등급 : level5, level4, level3, level2, level1
                        -->
                        <section :class="`m_popup-mymember T=level${user?.grade.id || ''}`">
                            <h2>
                                <i v-lazyload="{ src: user?.grade.imageUrl }" class="mm_bg-contain image_grade" />
                                <b>{{ user?.name }}님은 <strong>{{ user?.grade.name }}</strong>입니다</b>
                            </h2>
                            <!-- 등급 구매정보 -->
                            <div class="m_popup-mymember-amount">
                                <!-- 구매금액 -->
                                <div class="m...amount-progress">
                                    <dl class="mm_flex">
                                        <dt class="mm_flex-equal">
                                            구매금액<small v-text="`최근 ${gradeUpCondition.gradeUpCalculationPeriodMonth}개월`" />
                                        </dt>
                                        <dd class="text_price">
                                            <strong>{{ MMFilters.formatNumber(gradeUpCondition.orderAmount) }}</strong>
                                        </dd>
                                    </dl>
                                    <!-- (D) 'm...amount-progress-bar > i'의 title, width 값에 목표 금액 대비 현재 구매액의 비율값을 추가합니다. -->
                                    <b class="m...amount-progress-bar">
                                        <i 
                                            :style="`width:${gradeUpProgressPercentage.orderAmountPercentage}%;`" 
                                            :title="`${gradeUpProgressPercentage.orderAmountPercentage}%`"
                                        />
                                    </b>
                                    <p class="text_price">
                                        <strong class="text_min">0</strong>
                                        <strong class="text_max">{{ MMFilters.formatNumber(gradeUpCondition.gradeUpOrderAmountCondition) }}</strong>
                                    </p>
                                </div>
                                <!--// 구매금액 -->

                                <!-- 구매횟수 -->
                                <div class="m...amount-progress">
                                    <dl class="mm_flex">
                                        <dt class="mm_flex-equal">
                                            구매횟수<small v-text="`최근 ${gradeUpCondition.gradeUpCalculationPeriodMonth}개월`" />
                                        </dt>
                                        <dd><strong>{{ MMFilters.formatNumber(gradeUpCondition.orderCount) }}</strong><sub>건</sub></dd>
                                    </dl>
                                    <!-- (D) 'm...amount-progress-bar > i'의 title, width 값에 목표 금액 대비 현재 구매액의 비율값을 추가합니다. -->
                                    <b class="m...amount-progress-bar">
                                        <i 
                                            :style="`width:${gradeUpProgressPercentage.orderCountPercentage}%;`" 
                                            :title="`${gradeUpProgressPercentage.orderCountPercentage}%`"
                                        />
                                    </b>
                                    <p>
                                        <strong class="text_min">0<sub>건</sub></strong>
                                        <strong class="text_max">{{ MMFilters.formatNumber(gradeUpCondition.gradeUpOrderCountCondition) }}<sub>건</sub></strong>
                                    </p>
                                </div>
                                <!--// 구매횟수 -->
                                <p>
                                    <b>
                                        추가로 <strong>{{ MMFilters.formatNumber(requireGradeUpAmount) }}</strong>원 &<strong>{{ MMFilters.formatNumber(requireGradeUpOrderCount) }}</strong>건 더 구매하시면
                                    </b>
                                    <span>
                                        <strong>{{ gradeUpCondition.isTopLevel ? user?.grade.name :gradeUpCondition.nextGradeName }}</strong>
                                        {{ gradeUpCondition.isTopLevel ? '등급을 유지할 수 있어요' : '혜택을 받으실 수 있어요' }}
                                    </span>
                                    <!-- (D) 버튼 클릭 시 노출 되어야 하는 등급별 혜택 안내 내용의 index 값을 moveToBenefit 이벤트 parameter 값으로 넣어줍니다 -->
                                    <button type="button" class="btn_benefit" @click="toBenefit()">
                                        <b>혜택보기</b><i class="ico_link-circle" />
                                    </button>
                                </p>
                            </div>
                            <!--// 등급 구매정보 -->

                            <!-- 등급 쿠폰정보 -->
                            <div v-if="myGradeCoupons.length" class="m_popup-mymember-coupon">
                                <ul>
                                    <li v-for="coupon in myGradeCoupons" :key="coupon.id">
                                        <strong v-if="coupon.isUnlimited" class="T=unlimited">무제한</strong>
                                        <strong v-else><span>x</span>{{ coupon.downloadLimit }}<sub>장</sub></strong>
                                        <div class="mm_coupon T=xl">
                                            <a 
                                                class="mm_coupon-inner" 
                                                :href="isDownloadable(coupon) ? '' : undefined" 
                                                @click.prevent="isDownloadable(coupon) ? downloadGradeCoupon(coupon.id) : () => {}"
                                            >
                                                <p v-if="coupon.dcType === 'rate'" class="text_percent"><strong>{{ coupon.dcAmount }}</strong><sub>%</sub></p>
                                                <p v-if="coupon.dcType === 'KRW'" class="text_price"><strong>{{ MMFilters.formatNumber(coupon.dcAmount) }}</strong></p>
                                                <p class="text_coupon">등급별 쿠폰</p>
                                                <p class="text_download">쿠폰받기<i class="ico_coupon-download T=circle" /></p>
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <!-- 유의사항 -->
                            <div class="mm_note">
                                <div v-dropdown="{ isOn: true }" class="mm_dropdown">
                                    <button type="button" class="btn_dropdown" title="접어놓기">
                                        <i class="ico_info" /><b>쿠폰 유의사항</b><i class="ico_dropdown T=box" />
                                    </button>
                                    <div class="mm_dropdown-item">
                                        <div class="mm_dropdown-item-inner">
                                            <ul>
                                                <li>회원 등급은 산정 기준에 따라 매월 1일에 확정됩니다.</li>
                                                <li>등급별 쿠폰은 매월 1일 다운로드 가능하며, 해당 월에 한하여 사용 가능합니다.</li>
                                                <li>받으신 쿠폰은 <strong>마이페이지 &#62; 혜택 관리 &#62; 보유 쿠폰</strong> 페이지에서 확인 가능합니다.</li>
                                                <li>기간 내 사용하지 않은 쿠폰은 이월되지 않으며, 타 쿠폰과 중복 사용 불가합니다.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--// 유의사항 -->
                            <!--// 등급 쿠폰정보 -->
                        </section>
                        <!--// 회원등급정보 -->
                        <hr class="mm_line">
                        <div class="mm_grade">
                            <h3><b>등급별 혜택 안내</b></h3>
                            <p>최근 {{ gradeUpCondition.gradeUpCalculationPeriodMonth }}개월간 실 결제금액을 기준으로 매월 1일<br>구매등급에 반영됩니다</p>
                            <div class="mm_accordion">
                                <ul>
                                    <li v-for="grade in gradeList" :key="grade.id">
                                        <dl v-dropdown="{ isOn: grade.id === user?.grade.id, groupName: 'grade' }" class="mm_dropdown">
                                            <dt :ref="setGradeBenefitAreas" class="btn_dropdown">
                                                <p class="text_grade">
                                                    <strong>
                                                        <i v-lazyload="{ src: grade.imageUrl }" class="mm_bg-cover image_grade" />
                                                        {{ grade.name }}
                                                    </strong>
                                                    <span>{{ getLevelupConditionText(grade.gradeUpSellPriceCondition, grade.gradeUpSellAmountCondition) }}</span>
                                                </p>
                                                <i class="ico_dropdown" />
                                            </dt>
                                            <dd class="mm_dropdown-item">
                                                <div class="mm_dropdown-item-inner">
                                                    <dl v-if="grade.coupons.length > 0">
                                                        <dt>등급별 쿠폰</dt>
                                                        <dd v-for="coupon in grade.coupons" :key="coupon.id">
                                                            <p>{{ MMFilters.formatNumber(coupon.dcAmount) }}{{ coupon.dcType === 'KRW' ? '원' : '%' }} 할인</p>
                                                            <div class="mm_coupon">
                                                                <div class="mm_coupon-inner">
                                                                    <p v-if="coupon.dcType === 'rate'" class="text_percent">
                                                                        <strong>{{ coupon.dcAmount }}</strong><sub>%</sub>
                                                                    </p>
                                                                    <p v-if="coupon.dcType === 'KRW'" class="text_price">
                                                                        <strong>{{ MMFilters.formatNumber(coupon.dcAmount) }}</strong>
                                                                    </p>
                                                                    <p class="text_coupon">
                                                                        등급할인 쿠폰
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span v-if="coupon.isUnlimited" class="text_amount T=unlimited"><span>x</span> 무제한 발급</span>
                                                            <span v-else class="text_amount">x {{ coupon.downloadLimit }}<sub>장</sub></span>
                                                        </dd>
                                                    </dl>
                                                    <dl>
                                                        <dt>등급 적립율</dt>
                                                        <dd>{{ MMFilters.formatNumber(grade.purchaseBenefitRate) }}%</dd>
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
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { GradeBenefit, GradeCouponRegistCount, GradeCoupon, GradeUpCondition } from '$/@type/member/grade';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { gradeRepository } from '$/repository/member/gradeRepository';
import { onMounted, computed, onBeforeUpdate } from 'vue';
import MMPopup from '@/components/layout/Popup.vue';
import { defineComponent, ref } from 'vue';
import { dropdown as vDropdown } from '$/directives'
import { memberAggregateRepository } from '$/repository/member/aggregateRepository';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useRefreshUser, useUserState } from '$/composables/auth/userComposable';

usePageTitleSetting('등급 혜택 안내');
// 회원 관련
const { user } = useUserState();
// 등급별 혜택정보
const gradeList = ref<GradeBenefit[]>([]);
// 회원의 등급쿠폰 발급 횟수 정보
const couponRegistCount = ref<GradeCouponRegistCount[]>([]);
// 내 등급쿠폰
const myGradeCoupons = computed<GradeCoupon[]>(() => {
    return gradeList.value.find(grade => grade.id === user.value?.grade.id)?.coupons || []
});
// 등급혜택 리스트 elements
const gradeBenefitAreas = ref<HTMLElement[]>([]);

// 승급정보
const gradeUpCondition = ref<GradeUpCondition>({
    orderAmount: 0,
    orderCount: 0,
    gradeUpOrderAmountCondition: 0,
    gradeUpOrderCountCondition: 0,
    gradeUpCalculationPeriodMonth: 0,
    nextGradeName: '',
    isTopLevel: false,
});

// 승급까지 필요한 구매금액
const requireGradeUpAmount = computed(() => {
    return gradeUpCondition.value.gradeUpOrderAmountCondition - gradeUpCondition.value.orderAmount < 0 
        ? 0 
        : gradeUpCondition.value.gradeUpOrderAmountCondition - gradeUpCondition.value.orderAmount
})

// 승급까지 필요한 구매횟수
const requireGradeUpOrderCount = computed(() => {
    return gradeUpCondition.value.gradeUpOrderCountCondition - gradeUpCondition.value.orderCount < 0 
        ? 0 
        : gradeUpCondition.value.gradeUpOrderCountCondition - gradeUpCondition.value.orderCount 
});

// 승급조건 달성 퍼센티지
const gradeUpProgressPercentage = computed<{
    orderAmountPercentage: number,
    orderCountPercentage: number,
}>(() => {
    return {
        orderAmountPercentage: gradeUpCondition.value.orderAmount / gradeUpCondition.value.gradeUpOrderAmountCondition * 100,
        orderCountPercentage: gradeUpCondition.value.orderCount / gradeUpCondition.value.gradeUpOrderCountCondition * 100,
    }
});

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
});

onBeforeUpdate(() => {
    gradeBenefitAreas.value = []
});

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
    }
    mmon.loading.hide();
}

function setGradeBenefitAreas(el: HTMLElement) {
    gradeBenefitAreas.value.push(el);
    return gradeBenefitAreas
}

function toBenefit() {
    const index = gradeList.value.findIndex(grade => grade.id == user.value?.grade.id)
    if (!gradeBenefitAreas.value[index].parentElement?.classList.contains('S\=on')) {
        gradeBenefitAreas.value[index].click();
    }
    gradeBenefitAreas.value[index].scrollIntoView({ behavior: "smooth" });
}

defineExpose({ gradeUpCondition });
</script>

<script lang="ts">
declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        gradeUpCondition: GradeUpCondition
    }
}

export default defineComponent({
    async beforeRouteEnter(to, from, next) {
        try {
            const gradeUpCondition = await memberAggregateRepository.getGradeUpCondition();
            next((vm) => {
                vm.gradeUpCondition = gradeUpCondition;                
            })
        } catch (e) {
            next();
        }
    }
})
</script>
