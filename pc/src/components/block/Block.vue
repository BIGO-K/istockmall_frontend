<template>
    <div v-if="blockName && requiredListPassed" ref="blockElement" :data-mui="blockName">
        <slot />
    </div>
</template>
<script setup lang="ts">
import { Block, BlockContext } from '$/@type/block';
import { isEmpty } from '$/functions';
import { computed, ref, watch } from 'vue'

/** PROPS & EMITS */
const props = defineProps<{
    blockName: string,
    block?: Block,
    required?: {
        requiredValueList?: Array<unknown> //블록에 필수인 값이 여러개인 경우 사용하는 값
        requiredType?: 'and' | 'or' //블록에 필수인 값이 여러개인 경우에 &&, || 연산을 결정하는 값
    },
    contexts?: BlockContext[]
}>()

const emit = defineEmits<{
    (e: 'initBlock', blockName: string): void
}>()
/** //PROPS & EMITS */

const blockElement = ref<HTMLElement | null>(null)

// 필수값 검사 통과
const requiredListPassed = computed<boolean>(() => {
    if (!props.required || !Array.isArray(props.required.requiredValueList)) {
        return true
    }

    const validateType = props.required.requiredType === 'and' ? 'and' : 'or'

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
})

/** VUE LIFE CYCLE */
const unwatch = watch(blockElement, (to) => {
    if (!to) {
        return;
    }
    emit('initBlock', props.blockName)
    unwatch();
})
/** // VUE LIFE CYCLE */

defineExpose({
    blockElement
})
</script>
