<template>
    <template v-for="container in containers" :key="container.id">
        <template v-if="showHotKeyword && isHotKeywordContainer(container)">
            <HotKeyword />
        </template>
        <MMContainer v-else :container="container" @init-container="initContainer" />
    </template>
</template>

<script setup lang="ts">
import { Container } from '$/@type/block'
import MMContainer from '@/components/block/Container.vue'
import { computed, ref, toRefs } from 'vue'
import { pluck, findNested, unique } from '$/functions';
import HotKeyword from '@/components/HotKeyword.vue'
import { BLOCK_PAGE_NAME } from '$/constants';
import { useBlockLikedGoods } from '$/composables/blockComposable';

const props = withDefaults(defineProps<{
    containers: Container[],
    pageName: string
}>(), {
    containers: () => [],
    pageName: ''
});

const { pageName } = toRefs(props);
const loadedContainers = ref<number[]>([]);
const firstContainerLoaded = computed<boolean>(() => {
    return loadedContainers.value.includes((props.containers || [])[0]?.id);
})
const showHotKeyword = computed<boolean>(() => {
    return pageName.value === BLOCK_PAGE_NAME.MAIN && firstContainerLoaded.value
})

function isHotKeywordContainer(container: Container) {
    return pluck(container.blocks, 'name').includes('hot_keyword');
}
function initContainer(containerId: number) {
    loadedContainers.value.push(containerId);
}
        
// 상품 좋아요 처리
useBlockLikedGoods(unique(findNested(props.containers, 'goodsList.id')));

</script>

<style>
@import '@publish/css/block.css';
</style>
