<template>
    <div
        v-if="isShowBanner && timeDealsInfo.banners.length > 0"
        :class="[
            'mm_timedeal',
            { 'T=ta S=on': timeDealsInfo.type === 'A' },
            { 'T=tb': timeDealsInfo.type === 'B' },
            { 'T=tc': timeDealsInfo.type === 'C' },
            { 'S=switch-on': isSwitchOn },
        ]"
    >
        <AType
            v-if="timeDealsInfo.type === 'A' && needTimeDealAType"
            :hide-banner="() => { isShowBanner = false }"
            :time-deals-info="timeDealsInfo"
        />
        <div v-if="timeDealsInfo.type === `B`" class="mm_timedeal-inner">
            <button
                type="button"
                class="btn_timedeal"
                @click="() => { isSwitchOn = !isSwitchOn }"
            >
                <i v-lazyload="{ src: 'image/content/main_timedeal_c_badge.png' }" class="image_badge" title="타임특가" />
            </button>
            <div class="mm_timedeal-content">
                <BType                
                    :time-deals-info="timeDealsInfo"
                />
                <button
                    type="button"
                    class="btn_close"
                    @click="() => { isSwitchOn = !isSwitchOn }"
                >
                    <b>닫기</b><i class="ico_close" />
                </button>
            </div>
        </div>
        <div v-if="timeDealsInfo.type === `C` && filteredSellingTimeDeals.length > 0" class="mm_timedeal-inner">
            <button
                type="button"
                class="btn_timedeal"
                @click="() => { isSwitchOn = !isSwitchOn }"
            >
                <i v-lazyload="{ src: '../image/content/main_timedeal_c_badge.png' }" class="image_badge" title="타임특가" />
            </button>

            <CType
                :banners="filteredSellingTimeDeals"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineAsyncComponent, computed } from 'vue';
import { timeDealRepository } from '$/repository/timeDealRepository';
import { TimeDealsInfo } from '$/@type/timeDeal';
import { useClosePopup } from '$/composables/popupComposable'

const AType = defineAsyncComponent(() => import('@/components/modal/timeDeal/AType.vue'));
const BType = defineAsyncComponent(() => import('@/components/modal/timeDeal/BType.vue'));
const CType = defineAsyncComponent(() => import('@/components/modal/timeDeal/CType.vue'));

const timeDealsInfo = ref<TimeDealsInfo>({
    type: 'A',
    banners: []
});
const isShowBanner = ref(false) // 타임딜 노출 여부
const isSwitchOn = ref(false) // b 타입 타임딜 switch 여부
const { isShowPopup } = useClosePopup() 

// [오늘 하루 그만보기] 체크 여부 확인
const needTimeDealAType = isShowPopup('IS_TIMEDEAL_BANNER_HIDE') !== true;
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

onMounted(async () => {
    try {                
        // 타임딜 정보 목록 조회
        timeDealsInfo.value = await timeDealRepository.getTimeDeals();
        isShowBanner.value = true;
    } catch (e) {
        console.log(e)
    }
})

</script>