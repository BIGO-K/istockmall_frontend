<template>
    <div class="m_ranking" :class="`T=r${rankingType.toLowerCase()}`">
        <TypeB v-if="rankingType === 'B'" />
        <TypeD v-else-if="rankingType === 'D'" />
        <TypeA v-else />
        <router-view />
    </div>
</template>

<script setup lang="ts">
import { InitialSettings } from '$/@type/configs';
import { useGlobalConfigStore } from '$/store/globalConfig';
import { computed } from 'vue';
import TypeA from '@/pages/ranking/gnb/TypeA.vue';
import TypeB from '@/pages/ranking/gnb/TypeB.vue';
import TypeD from '@/pages/ranking/gnb/TypeD.vue';

const { globalConfigs } = useGlobalConfigStore();
const rankingType = computed<InitialSettings['design']['mobileRankingType']>(() => globalConfigs.design.mobileRankingType);
</script>

