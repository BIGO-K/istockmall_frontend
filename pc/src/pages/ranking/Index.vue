<template>
    <div class="mm_page-content">
        <TypeB v-if="rankingType === 'B'" />
        <TypeD v-else-if="rankingType === 'D'" />
        <TypeA v-else />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGlobalConfigStore } from '$/store/globalConfig';
import TypeA from '@/pages/ranking/index/TypeA.vue';
import TypeB from '@/pages/ranking/index/TypeB.vue';
import TypeD from '@/pages/ranking/index/TypeD.vue';
import { InitialSettings } from '$/@type/configs';

const { globalConfigs } = useGlobalConfigStore();
const rankingType = computed<InitialSettings['design']['pcRankingType']>(() => globalConfigs.design.pcRankingType);

</script>