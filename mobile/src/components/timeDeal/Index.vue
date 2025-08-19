<template>
    <!-- 타임특가 -->
    <div
        v-if="isShowBanner && timeDealsInfo.banners.length > 0"
        :class="[
            'mm_timedeal',
            { 'T=ta S=on': timeDealsInfo.type === 'A' },
            { 'T=tb': timeDealsInfo.type === 'B' },
            { 'T=tc': timeDealsInfo.type === 'C' },
            { 'S=switch-on' : switchOn }
        ]"
    >
        <AType
            v-if="timeDealsInfo.type === 'A'"
            :time-deals-info="timeDealsInfo"
            @show-banner="isShowBanner = true"
            @hide-banner="isShowBanner = false"
        />
        <BType
            v-if="timeDealsInfo.type === 'B'"
            :time-deals-info="timeDealsInfo"
            @show-banner="isShowBanner = true"
            @hide-banner="isShowBanner = false"
        />
        <CType
            v-if="timeDealsInfo.type === 'C' && filteredSellingTimeDeals.length > 0"
            :banners="filteredSellingTimeDeals"
            @show-banner="() => { isShowBanner = true; switchOn = true; }"
            @hide-banner="() => { switchOn = false; }"
        />
    </div>
    <!--// 타임특가 -->
</template>

<script setup lang="ts">

import { defineAsyncComponent, onMounted, ref, computed } from 'vue';
import { timeDealRepository } from '$/repository/timeDealRepository';
import { TimeDealsInfo } from '$/@type/TimeDeal';

const AType = defineAsyncComponent(() => import('@/components/timeDeal/AType.vue'));
const BType = defineAsyncComponent(() => import('@/components/timeDeal/BType.vue'));
const CType = defineAsyncComponent(() => import('@/components/timeDeal/CType.vue'));

const timeDealsInfo = ref<TimeDealsInfo>({
    type: 'A',
    banners: []
});

const filteredSellingTimeDeals = computed(() => {
    if (!timeDealsInfo.value) {
        return []
    }

    if (timeDealsInfo.value.banners.length < 1) {
        return [];
    }

    return timeDealsInfo.value.banners.filter((banners) => {
        return banners.isStart
    })
})

const switchOn = ref<boolean>(false);
const isShowBanner = ref(false); // 타임딜 노출 여부

onMounted(async() => {
    try {                
        timeDealsInfo.value = await timeDealRepository.getTimeDeals();
        isShowBanner.value = true;
    } catch (e) {
        console.log(e);
    }
});
</script>