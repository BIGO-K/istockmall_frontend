<template>
    <div 
        class="mm_mui" 
        :class="{ 'T=full': isFullWidth }" 
        :style="{ 
            display: isShow ? '' : 'none' 
        }"
    >
        <component
            :is="blockComponents[index]"
            v-for="(block, index) in container.blocks"
            :key="block.id"
            :block="block"
            @init-block="initBlock"
        />
    </div>
</template>

<script setup lang="ts">
import { Container } from '$/@type/block'
import { computed, ref, toRefs } from 'vue'
import { getBlockComponents } from '@/blockComponents'
import { pluck } from '$/functions';

const props = defineProps<{ container: Container }>()
const emit = defineEmits<{ 
    (e: 'initContainer', containerId: number): void
}>()

const { container } = toRefs(props);
const blockComponents = computed(() => {
    return container.value.blocks.map((block) => {
        return getBlockComponents(block.name);
    })
})
const isFullWidth = computed<boolean>(() => {
    const muiCode = props.container.blocks[0].name || ''
    return muiCode.includes('w6')})

const loadedBlockComponentNames = ref<string[]>([]);
const isShow = computed<boolean>(() => {
    return (loadedBlockComponentNames.value.length > 0 || pluck(container.value.blocks, 'name').includes('hot_keyword')) 
        && !blockComponents.value.every((component) => component === undefined)
});

function initBlock(blockName: string) {
    if (loadedBlockComponentNames.value.includes(blockName)) {
        return
    }

    loadedBlockComponentNames.value.push(blockName)
    emit('initContainer', props.container.id)
}
</script>
