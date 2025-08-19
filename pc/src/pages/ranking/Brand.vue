<template>
    <!-- 브랜드 랭킹 -->
    <TypeB v-if="rankingType === 'B'" />
    <TypeD v-else-if="rankingType === 'D'" />
    <TypeA v-else />
    <!--// 브랜드 랭킹 -->
</template>

<script setup lang="ts">
import { InitialSettings } from '$/@type/configs';
import { useGlobalConfigStore } from '$/store/globalConfig';
import TypeA from '@/pages/ranking/brand/TypeA.vue';
import TypeB from '@/pages/ranking/brand/TypeB.vue';
import TypeD from '@/pages/ranking/brand/TypeD.vue';
import { computed } from 'vue';

const { globalConfigs } = useGlobalConfigStore();
const rankingType = computed<InitialSettings['design']['pcRankingType']>(() => globalConfigs.design.pcRankingType);
</script>