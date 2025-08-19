<template>
    <div 
        v-if="wingBanners.length > 0"
        class="mm_sidebar-wing"
        :class="{
            'S=today-hide': isHide,
            'S=switch-on': extendStatus === 'extended'
        }"
        @mouseover="clearCollapse()"
        @mouseleave="startCollapse();"
    >
        <MMCarousel
            ref="carousel"
            :items="wingBanners"
            :use-pagination="true"
            :use-count="false"
            :use-control="false"
            :carousel-data="{
                _isAutoHeight: true,
                _autoDelay: 4,
                onComplete: callbackOnComplete
            }"
            :is-stop="isCarouselStop"
        >
            <template #item="{ item }">
                <button 
                    type="button"
                    data-switch
                    @click="extend(item)"
                >
                    <i class="image_banner">
                        <img 
                            v-lazyload="{ 'src': item.imageUrl }"
                            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                            :alt="item.alt"
                            :data-lazyload="`{ '_src': '${item.imageUrl}' }`"
                        >
                    </i>
                </button>
            </template>
        </MMCarousel>
        <div 
            v-if="extendedBanner"
            ref="extendedBannerElement"
            class="mm_sidebar-wing-extend"
            :style="`width: ${defaultSize.width}px; height: ${defaultSize.height};`"
        >
            <MMLink :to="extendedBanner.link" @click="collapse()">
                <i class="image_banner">
                    <img 
                        ref="largeImageElement"
                        v-lazyload="{ 'src': extendedBanner.bigImageUrl }"
                        src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                        :alt="extendedBanner.alt"
                        :data-lazyload="`{ '_src': '${extendedBanner.bigImageUrl}' }`"
                    >
                </i>
            </MMLink>
            <button type="button" class="btn_close" @click="collapse">
                <i class="ico_close" /><b class="mm_ir-blind">날개 배너 확장 닫기</b>
            </button>
            <button type="button" class="btn_today" @click="() => { hide(); collapse(); }">
                <b>오늘은 그만 볼게요 X</b>
            </button>
        </div>
    </div>
</template>
<script setup lang='ts'>
import MMCarousel from '@/components/Carousel.vue';
import { useWingBanner } from '$/composables/exhibit/bannerComposable';
import { ref, watch } from 'vue';
import gsap from "gsap";
import { WingBanner } from '$/@type/exhibit';
import { Carousel } from '@/assets/publish/src/script/ui/sliders';
import { useRouter } from 'vue-router';

const router = useRouter();
const { 
    isHide, 
    wingBanners, 
    extendedBanner, 
    hide, 
    setExtendedBanner 
} = useWingBanner();

/** VARIABLE */
const extendedBannerElement = ref<HTMLElement|null>()
const largeImageElement = ref<HTMLImageElement>();
const wingBannerBottom = ref<number>(0);

const isCarouselStop = ref<boolean>(false);

const extendStatus = ref<'collapsed'|'collapsing'|'extending'|'extended'>('collapsed');

const collapseTimeout = ref<NodeJS.Timeout>();
const carousel = ref<InstanceType<typeof MMCarousel>>();

const defaultSize = ref<{
    height: number
    width: number
}>({
    height: 0,
    width: 0
});


/** // VARIABLE */

/** FUNCTION */
function extend(targetBanner?: WingBanner) {
    if (!targetBanner?.bigImageUrl) {
        if (targetBanner?.link) {
            router.push(targetBanner?.link)
        }
        return 
    }

    if (extendStatus.value === 'collapsing') {
        return;
    }

    clearCollapse();
    
    // 펼침 시작
    extendStatus.value = 'extending'
    if (targetBanner) {
        setExtendedBanner(targetBanner);
    }
    
    if (!extendedBannerElement.value) {
        return;
    }
    isCarouselStop.value = true;

    extendedBannerElement.value.style['width'] = `${defaultSize.value.width || 0}px`;
    extendedBannerElement.value.style['height'] = `${defaultSize.value.height || 0}px`;
        
    if (wingBannerBottom.value <= (document.body.offsetHeight * 0.65)) {
        extendedBannerElement.value.style['top'] = `${-(defaultSize.value.height || 0)}px`
        extendedBannerElement.value.style['bottom'] = 'auto'
    }
        
    gsap.to(extendedBannerElement.value, {
        width: largeImageElement.value?.naturalWidth || 0,
        height: largeImageElement.value?.naturalHeight || 0,
        duration: 0.2,
        ease: 'sine.InOut',
        onComplete: () => {
            extendStatus.value = 'extended';
            clearCollapse();
            startCollapse();
        },
    });
}

function collapse() {
    if (extendStatus.value === 'extending') {
        return;
    }

    if (!extendedBannerElement.value) {
        return;
    }
    
    // 접기 시작
    extendStatus.value = 'collapsing';
    gsap.to(extendedBannerElement.value, {
        'width': defaultSize.value.width || 0,
        'height': defaultSize.value.height || 0,
        duration: 0.15,
        ease: 'sine.out',
        onComplete: () => {
            isCarouselStop.value = false;
            extendStatus.value = 'collapsed';
        }
    })
}

function clearCollapse() {
    if (collapseTimeout.value) {
        clearTimeout(collapseTimeout.value);
    }
}

function startCollapse() {
    if (extendStatus.value == 'extended') {
        collapseTimeout.value = setTimeout(collapse, 1000);
    }
}

/**
 * 캐러셀 업데이트
 */
async function callbackOnComplete(carousel: {ui: Carousel, _isBack: boolean}) {
    setExtendedBanner(wingBanners.value[carousel.ui.realIndex]);
}

watch([extendStatus, extendedBanner], () => {
    if (extendStatus.value == 'extended' && (extendedBanner.value == null || extendedBannerElement.value == null)) {
        extend(wingBanners.value[carousel.value?.carouselUi?.index || 0]);
    }
}, {
    immediate: true,
})

// default size, 윙배너 bottom 세팅
const unwatchCarousel = watch(() => carousel.value?.carouselElement, (to) => {
    if (!to) {
        return;
    }
    const defaultSmallImageElement = to.querySelector('.mm_carousel-item')?.querySelector('img');
    const wingBannerElement = to.querySelector('.mm_carousel-item')?.querySelector('button');
    defaultSize.value = {
        width : defaultSmallImageElement?.width || 0,
        height: defaultSmallImageElement?.height || 0,
    }
    wingBannerBottom.value = wingBannerElement?.getBoundingClientRect().bottom || 0;
    unwatchCarousel();
} )
/** // VUE LIFE CYCLE */
</script>
