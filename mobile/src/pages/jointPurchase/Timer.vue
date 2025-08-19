<template>
    <p class="text_state">
        <b v-html="timerHtml" />
        <strong>{{ jointPurchase.isTargetAchieve ? '공동구매 목표 달성' : '공동구매 진행 중' }}</strong>
    </p>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, onUnmounted } from 'vue';
import { JointPurchase } from '$/@type/jointPurchase';
import { countdown } from '$/functions';
import { padLeft } from '$/filters';

const props = withDefaults(defineProps<{
    jointPurchase: JointPurchase
}>(), {
    jointPurchase: () => {
        return {}
    }
})

const { jointPurchase } = toRefs(props);

const day = ref('');
const hour = ref('');
const timerHtml = ref('');
const countDownTimer = ref<null|NodeJS.Timeout>(null);

onMounted(async () => {
    countDownTimer.value = countdown(jointPurchase.value.targetAt, 's', (ms, diff) => {
        day.value = String(Math.floor(diff.hour / 24));
        hour.value = String(diff.hour % 24);                    
        timerHtml.value = `D<span>-</span>${day.value}<strong> ${padLeft(hour.value, 2, '0')}<span>:</span>${padLeft(`${diff.minute}`, 2, '0')}<span>:</span>${padLeft(`${diff.second}`, 2, '0')}</strong>`;
    }, true);
});

onUnmounted(() => {
    if (countDownTimer.value !== null) {
        clearInterval(countDownTimer.value);
    }
})
</script>
