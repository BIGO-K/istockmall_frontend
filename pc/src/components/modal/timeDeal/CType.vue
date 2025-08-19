<template>
    <div class="mm_timedeal-content">
        <h5><i v-lazyload="{ src : '../image/content/main_timedeal_c_title.png' }" /><b class="mm_ir-blind">타임딜</b></h5>
        <p class="text_timer">
            <span class="text_hour">{{ countTimer.hour }}</span>
            :<span class="text_min">{{ countTimer.min }}</span>
            :<span class="text_sec">{{ countTimer.seconds }}</span>
        </p>
        <p class="text_brand">
            {{ nowDisplayedBanner?.brandName || '' }}
        </p>
        <p class="text_product">
            {{ nowDisplayedBanner?.goodsName || '' }}
        </p>
        <Carousel
            :items="displayedBanner"
            :use-pagination="true"
            :use-count="false"
            :carousel-data="{
                _autoDelay: 0,                
                onComplete: callbackOnComplete
            }"
        >
            <template #item="{ item }">
                <MMLink
                    :to="item.isOnlyAdult && needCertificateAge 
                        ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${item.goodsId}`, is_need_adult_certification :'Y' }} 
                        : { name:'GoodsDetail', params: { id: item.goodsId }}"
                >
                    <i v-lazyload="{ src: item.imageUrl }" class="mm_bg-cover image_banner" :data-lazyload="`{'_src': '${item.imageUrl}'}`" />
                    <p v-if="item.isOnlyAdult" class="text_adult">
                        <b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult T=sm" />
                    </p>
                </MMLink>
            </template>
        </Carousel>
    </div>
</template>

<script setup lang='ts'>
import Carousel from '@/components/Carousel.vue';
import { TimeDealsInfo } from '$/@type/timeDeal';
import { Carousel as CarouselData } from '@/assets/publish/src/script/ui/sliders'
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { ref, computed, watch } from 'vue';
import { countdown } from '$/functions';
import { padLeft } from '$/filters';

const props = defineProps<{
    banners: TimeDealsInfo['banners']
}>();

const {
    isUser,
    needCertificateAge
} = usePageContext();

/** VARIABLE */
const pathCertificate = isUser.value ? 'AdultCertification' : 'Login';
const displayItemIndex = ref<number>(0);
const displayedBanner = computed(() => props.banners);
const nowDisplayedBanner = computed(() => {
    const findBanner = displayedBanner.value.find((banner, index) => index === displayItemIndex.value) || null
    if (!findBanner) {
        return null;
    } 
    
    return {
        goodsName: findBanner?.goodsName || '',
        brandName: findBanner?.brandName || '',
        endAt: findBanner.endAt || ''        
    }
})

const countTimer = ref<{
    hour: string; 
    min: string; 
    seconds: string,
    timer: NodeJS.Timeout|null
}>({
    hour: '',
    min: '',
    seconds: '',
    timer: null
});

watch(nowDisplayedBanner, () => {
    if (nowDisplayedBanner.value === null) {
        return
    }
    if (countTimer.value.timer) {
        clearInterval(countTimer.value.timer);
    }
    
    countTimer.value.timer = countdown(`${nowDisplayedBanner.value.endAt}`, 's', (ms, diff) => {
        countTimer.value.hour = padLeft(`${diff.hour}`, 2, '0');
        countTimer.value.min = padLeft(`${diff.minute}`, 2, '0');
        countTimer.value.seconds = padLeft(`${diff.second}`, 2, '0');
    }, true);
}, {
    immediate: true
})

/** FUNCTION */
async function callbackOnComplete(carousel: {ui: CarouselData, _isBack: boolean}) {
    if (carousel._isBack) {
        return;
    }
    displayItemIndex.value = carousel.ui.realIndex;
}
/** VUE LIFE CYCLE */

</script>