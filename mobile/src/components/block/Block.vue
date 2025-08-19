<template>
    <div v-if="blockName && requiredListPassed" ref="blockElement" :data-mui="blockName">
        <slot :scroll-to-top="scrollToTop" />
    </div>
</template>
<script setup lang="ts">
import { isEmpty } from '$/functions';
import { mmon } from '$/helper/mmon';
import { computed, ref, watch } from 'vue'

/** PROPS & EMITS */
const props = defineProps<{
    blockName: string,
    required?: {
        requiredValueList?: Array<unknown> //블록에 필수인 값이 여러개인 경우 사용하는 값
    type?: 'and' | 'or' //블록에 필수인 값이 여러개인 경우에 &&, || 연산을 결정하는 값
    },
}>()

const emit = defineEmits<{
    (e: 'initBlock', blockName: string): void
}>()
/** //PROPS & EMITS */

const blockElement = ref<HTMLElement | null>(null)
const gnb = ref<HTMLElement|null>(document.querySelector('.mm_gnb-inner') || null);
const header = ref<HTMLElement|null>(document.querySelector('.mm_header') || null);

const unwatch = watch(blockElement, (to) => {
    if (!to) {
        return;
    }
    emit('initBlock', props.blockName)
    unwatch();
})

// 필수값 여러개 검사 통과
const requiredListPassed = computed<boolean>(() => {
    if (!props.required || !Array.isArray(props.required.requiredValueList)) {
        return true
    }

    const validateType = props.required.type === 'and' ? 'and' : 'or'

    let result = true
    if (validateType === 'and') {
        props.required.requiredValueList.every((targetValue) => {
            result = !isEmpty(targetValue)
            if (isEmpty(targetValue)) {
                return false //break loop
            }
            return true //continue loop
        })
    } else {
        props.required.requiredValueList.every((targetValue) => {
            result = !isEmpty(targetValue)
            if (!isEmpty(targetValue)) {
                return false //break loop
            }
            return true //continue loop
        })
    }
    return result
});

// 블록 최상위로 이동
function scrollToTop() {
    if (!blockElement.value) {
        return;
    }

    if (!gnb.value) {
        gnb.value = document.querySelector('.mm_gnb-inner') || null
    }

    if (!header.value) {
        header.value = document.querySelector('.mm_header') || null
    }

    
    const gnbOffsetHeight = gnb.value?.offsetHeight || 0;
    const headerOffsetHeight = header.value?.offsetHeight || 0
    mmon.scroll.to(blockElement.value, { 
        margin: headerOffsetHeight + gnbOffsetHeight 
    })
}

defineExpose({
    blockElement
})
</script>
