<template>
    <a href="#" class="btn_timedeal" title="펼쳐보기" @click.prevent="$emit('showBanner')">
        <i 
            v-lazyload="{ src : '../image/content/main_timedeal_c_switch_title.png' }"
            class="mm_bg-contain"
        />
        <b class="mm_ir-blind">타임딜</b>
        <p class="text_timer">
            <span class="text_hour">{{ countTimer.hour }}</span>
            :<span class="text_min">{{ countTimer.min }}</span>
            :<span class="text_sec">{{ countTimer.seconds }}</span>
        </p>
    </a>
    <div class="mm_timedeal-inner">
        <div class="mm_timedeal-dim" />
        <div class="mm_timedeal-content">
            <div>
                <h5>
                    <i 
                        v-lazyload="{ src : '../image/content/main_timedeal_c_title.png' }"
                        class="mm_bg-contain"
                    /><b class="mm_ir-blind">타임딜</b>
                </h5>
                <!-- (D) 타임딜 배너 중 가장 시간이 긴 타임딜 상품의 시간이 노출됩니다. -->
                <p class="text_timer">
                    <span class="text_hour"><b>{{ countTimer.hour }}</b></span>
                    :<span class="text_min"><b>{{ countTimer.min }}</b></span>
                    :<span class="text_sec"><b>{{ countTimer.seconds }}</b></span>
                </p>
                <p class="text_brand">
                    {{ nowDisplayedBanner?.brandName || '' }}
                </p>
                <p class="text_product">
                    {{ nowDisplayedBanner?.goodsName || '' }}
                </p>
            </div>
            <Carousel
                :items="displayedBanner"
                :use-pagination="true"
                :use-count="false"
                :carousel-data="{
                    _isAutoHeight: true,
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
                        <i :data-lazyload="`{ '_src' : '${item.imageUrl}' }`" class="mm_bg-cover image_banner" />
                        <p v-if="item.isOnlyAdult" class="text_adult">
                            <b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult T=sm" />
                        </p>
                    </MMLink>
                </template>
            </Carousel>
            <button type="button" class="btn_close" @click="$emit('hideBanner');">
                <i class="ico_close T=thin" /><b class="mm_ir-blind">닫기</b>
            </button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Carousel from '@/components/Carousel.vue';
import { Carousel as CarouselData } from '@/assets/publish/src/script/ui/sliders'
import { TimeDealsInfo } from '$/@type/TimeDeal';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { padLeft } from '$/filters';
import { countdown } from '$/functions';
import { ref, computed, watch } from 'vue';

const props = defineProps<{
    banners: TimeDealsInfo['banners']
}>();

defineEmits(['showBanner', 'hideBanner'])

const {
    isUser,
    needCertificateAge
} = usePageContext();

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
/** VARIABLE */

/** FUNCTION */

/** VUE LIFE CYCLE */

</script>