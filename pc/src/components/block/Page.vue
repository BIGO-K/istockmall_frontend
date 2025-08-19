<template>
    <MMContainer v-for="container in containers" :key="container.id" :container="container" />
</template>

<script setup lang="ts">
import { Container } from '$/@type/block'
import { useBlockLikedGoods } from '$/composables/blockComposable';
import { findNested, unique } from '$/functions';
import MMContainer from '@/components/block/Container.vue'
import { watch } from 'vue'

const props = withDefaults(defineProps<{
    containers: Container[]
}>(), {
    containers: () => [],
});

const unwatch = watch(() => props.containers, (to) => {
    useBlockLikedGoods(unique(findNested(to, 'goodsList.id')));
    unwatch();
})
</script>

<style>
@import '@publish/css/block.css';
</style>
