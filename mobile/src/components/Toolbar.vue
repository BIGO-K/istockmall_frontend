<template>
    <ToolbarA 
        v-if="toolbarType === 'A'"
        :main-thumbnail-url="mostRecentGoodsThumbnailUrl"
    />
    <ToolbarB 
        v-else
        :main-thumbnail-url="mostRecentGoodsThumbnailUrl"
    />
</template>

<script setup lang="ts">
import { InitialSettings } from '$/@type/configs';
import { defineAsyncComponent, ref } from 'vue';
import { useGlobalConfigs } from '$/composables/globalConfigComposable'
import { useRecentShopping } from '$/composables/shoppingComposable';

const ToolbarA = defineAsyncComponent(() => import('@/components/toolbar/ToolbarA.vue'));
const ToolbarB = defineAsyncComponent(() => import('@/components/toolbar/ToolbarB.vue'));

const { globalConfigs } = useGlobalConfigs();
const toolbarType = ref<InitialSettings['design']['toolbarType']>(globalConfigs.value.design.toolbarType);
const { mostRecentGoodsThumbnailUrl } = useRecentShopping();

</script>


