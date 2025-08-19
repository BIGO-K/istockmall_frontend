<template>
    <template v-if="showDay">
        D<span>-</span>{{ day }}
    </template>
    <component :is="tag || 'strong'">
        {{ hour }}
        <span>:</span>
        {{ minute }}
        <span>:</span>
        {{ second }}
    </component>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onBeforeMount, toRefs, computed, watch } from 'vue';
import { countdown } from '$/functions';
import { padLeft } from '$/filters';
import moment from 'moment';

const props = withDefaults(defineProps<{
    targetAt: string
    showDay?: boolean
    isEnd?: boolean
    tagName?: 'b'|'strong'
}>(), {
    targetAt: '',
    showDay: false,
    isEnd: false,
    tagName: 'strong'
});

const emit = defineEmits(['onTimer']);

/** VARIABLE */
const { targetAt, isEnd, showDay, tagName } = toRefs(props);
const tag = computed(() => {
    return ['b', 'strong'].includes(tagName.value) ? tagName.value : ''
})
const momentedTargetAt = computed(() => {
    return moment(targetAt.value);
})

const day = ref('');
const hour = ref('');
const minute = ref('');
const second = ref('');
const countDownTimer = ref<null|NodeJS.Timeout>(null);
/** // VARIABLE */

/** FUNCTION */
function startCountdown() {
    if (isEnd.value) {
        day.value = '00'
        hour.value = '00'
        minute.value = '00'
        second.value = '00'
    }
    countDownTimer.value = countdown(targetAt.value.toString(), 's', (ms, diff) => {
        day.value = String(Math.floor(diff.hour / 24));
        hour.value = padLeft(String(showDay.value ? diff.hour % 24 : diff.hour), 2, '0');
        minute.value = padLeft(String(diff.minute), 2, '0');
        second.value = padLeft(String(diff.second), 2, '0');
        emit('onTimer', ms);
    }, true);
}
/** // FUNCTION */

/** VUE LIFE CYCLE */
onBeforeMount(() => {
    if (isEnd.value) {
        day.value = '00'
        hour.value = '00'
        minute.value = '00'
        second.value = '00'
        return;
    }
    const now = moment(new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0] + ' ' + new Date().toTimeString().split(" ")[0]);
    const diff = {
        day: momentedTargetAt.value.diff(now, 'days'),
        hour: moment.duration(momentedTargetAt.value.diff(now)).hours(),
        minute: String(moment.duration(momentedTargetAt.value.diff(now)).minutes()),
        second: String(moment.duration(momentedTargetAt.value.diff(now)).seconds() - 1),  // onMounted 시점에 2초가 지나는 부분 때문에 -1
    }
            
    day.value = String(diff.day);
    hour.value = padLeft(String(showDay.value ? diff.hour % 24 : diff.hour), 2, '0');
    minute.value = padLeft(String(diff.minute), 2, '0');
    second.value = padLeft(String(diff.second), 2, '0');
})

onMounted(() => {
    startCountdown();
});
        
watch(targetAt, () => {
    startCountdown()
});

onBeforeUnmount(() => {
    if (countDownTimer.value !== null) {
        clearInterval(countDownTimer.value);
    }
})
/** // VUE LIFE CYCLE */
        
</script>
