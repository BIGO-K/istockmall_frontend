<template>
    <div class="m_my-member-amount">
        <dl>
            <dt>구매금액<small v-text="`(최근 ${gradeUpCondition.gradeUpCalculationPeriodMonth}개월)`" /></dt>
            <dd><strong>{{ MMFilters.formatNumber(gradeUpCondition.orderAmount) }}</strong><sub>원</sub></dd>
        </dl>
        <div class="m...amount-progress">
            <!-- (D) 'm...amount-progress-bar > i'의 width, title 값에 목표 금액 대비 현재 구매액의 비율값을 추가합니다. -->
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
        <dl>
            <dt>구매횟수<small v-text="`(최근 ${gradeUpCondition.gradeUpCalculationPeriodMonth}개월)`" /></dt>
            <dd><strong>{{ MMFilters.formatNumber(gradeUpCondition.orderCount) }}</strong><sub>건</sub></dd>
        </dl>
        <div class="m...amount-progress T=progress-buy">
            <b class="m...amount-progress-bar">
                <i
                    :style="`width:${gradeUpProgressPercentage.orderAmountPercentage}%;`" 
                    :title="`${gradeUpProgressPercentage.orderAmountPercentage}%`"
                />
            </b>
            <p>
                <strong class="text_min">0<sub>건</sub></strong>
                <strong class="text_max">{{ MMFilters.formatNumber(gradeUpCondition.gradeUpOrderCountCondition) }}<sub>건</sub></strong>
            </p>
        </div>
        <p>
            <i class="ico_plus-circle" />
            추가로 
            <b class="text_price"><strong>{{ MMFilters.formatNumber(requireGradeUpAmount) }}</strong></b> & <strong>{{ MMFilters.formatNumber(requireGradeUpOrderCount) }}</strong>건 더 구매하시면
            <strong>{{ gradeUpCondition.isTopLevel ? user?.grade.name :gradeUpCondition.nextGradeName }}</strong>
            {{ gradeUpCondition.isTopLevel ? '등급을 유지할 수 있어요' : '혜택을 받으실 수 있어요' }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { GradeUpCondition } from '$/@type/member/grade';
import { defaultCatch } from '$/functions';
import { memberAggregateRepository } from '$/repository/member/aggregateRepository';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const { user } = usePageContext();
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
        gradeUpCondition.value = await memberAggregateRepository.getGradeUpCondition();
    } catch (e) {
        defaultCatch(e)
    }
})
</script>