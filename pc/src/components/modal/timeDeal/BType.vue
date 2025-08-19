<template>
    <p v-html="titleHtml" />
    <MMCarousel
        :items="timeDealsInfo.banners"
        :use-pagination="true"
        :use-count="false"
        :carousel-data="{
            _autoDelay: 4,
            _isMoreSide: true,
            onReady: callbackOnReady,
            onComplete: callbackOnComplete
        }"
        @mousedown="() => { isDrag = false }"
        @mousemove="() => { isDrag = true }"
    >
        <template #item="{ item }">
            <a
                :data-id="item.id"
                :class="{ 'S=timedeal-ready': item.isStart === false }"
                href="javascript:;"
                @click.capture="timeDealItemClickEvent"
            >
                <i
                    v-lazyload="{ src: item.imageUrl }"
                    :data-lazyload="`{'_src': '${item.imageUrl}'}`"
                    class="mm_bg-cover image_banner"
                />
                <p v-if="item.isOnlyAdult && needCertificateAge" class="text_adult">
                    <b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult" />
                </p>
                <p class="mm_ir-blind" v-text="item.title" />
            </a>
        </template>
    </MMCarousel>
</template>


<script setup lang='ts'>
import { onMounted, ref, onBeforeUnmount, computed } from 'vue';
import { mmon } from '$/helper/mmon'
import { formatDate, padLeft } from '$/filters'
import { Carousel } from '@/assets/publish/src/script/ui/sliders'
import moment from 'moment'
import { TimeDealsInfo } from '$/@type/timeDeal';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import MMCarousel from '@/components/Carousel.vue';

const props = defineProps<{
    timeDealsInfo: TimeDealsInfo,
}>();

/** VARIABLE */
const filteredTimeDeals = computed(() => {
    return props.timeDealsInfo.banners.filter(
        timeDeal => moment().diff(timeDeal.endAt, 'seconds') < 0
    );
})
const { router, isUser, needCertificateAge } = usePageContext();
const pathCertificate = isUser.value ? 'AdultCertification' : 'Login';

// 타임딜 캐러셀 관련
const titleHtml = ref('');
const interval = ref<NodeJS.Timeout|null>(null); // 타임딜 카운트 다운 인터벌
const realIndex = ref(0);
const isDrag = ref(false);
/** FUNCTION */
/**
 * Carousel cycle
 *
 * @param {ui: Carousel, _isBack: boolean} carousel
 */
async function callbackOnComplete(carousel: {ui: Carousel, _isBack: boolean}) {
    if (carousel._isBack) {
        return;
    }

    realIndex.value = carousel.ui.realIndex;
    updateBannerTitle();
}

function callbackOnReady(carousel:  {ui: Carousel, _isBack: boolean}) {
    realIndex.value = filteredTimeDeals.value.length < 2 ? 0 : carousel.ui.realIndex;
    if (interval.value != null) {
        clearInterval(interval.value);
    }

    updateBannerTitle();
    interval.value = setInterval(() => {
        updateBannerTitle();
    }, 1000)
}

/**
 * 타임딜 배너 상단( 타임딜 상태, 남은 시간 ) 업데이트
 *
 */
function updateBannerTitle() {
    const targetTimeDeal = filteredTimeDeals.value[realIndex.value];
    if (targetTimeDeal == null) {
        return;
    }

    // 진행예정
    const diffMsBeforeStart = moment(targetTimeDeal.startAt).valueOf() - Date.now();
    if (diffMsBeforeStart > 500) {
        targetTimeDeal.isStart = false;
        titleHtml.value = `<b class="T=timedeal-schedule">
                    <i class="ico_clock"></i><strong>진행예정</strong></b>
                    <span class="text_hour">${padLeft(`${Math.floor(diffMsBeforeStart / 1000 / 60 / 60)}`, 2, '0')}</span>
                    :<span class="text_min">${padLeft(`${Math.floor(diffMsBeforeStart / 1000 / 60) % 60}`, 2, '0')}</span>
                    :<span class="text_sec">${padLeft(`${Math.floor(diffMsBeforeStart / 1000) % 60}`, 2, '0')}</span>`;
        return;
    }

    // 진행종료 && 진행중
    const diffMsEnd = moment(targetTimeDeal.endAt).valueOf() - Date.now();
    // 진행종료
    if (diffMsEnd < 500) {
        targetTimeDeal.isEnd = true;

        if (interval.value) {
            clearInterval(interval.value);
        }

        titleHtml.value = `<b class="T=timedeal-schedule">
                    <i class="ico_clock"></i><strong>진행종료</strong></b>
                    <span class="text_hour">00</span>
                    :<span class="text_min">00</span>
                    :<span class="text_sec">00</span>`;
        return;
    }

    // 진행중
    targetTimeDeal.isStart = true;
    titleHtml.value = `<b><i class="ico_clock"></i><strong>진행중</strong></b>
            <span class="text_hour">${padLeft(`${Math.floor(diffMsEnd / 1000 / 60 / 60)}`, 2, '0')}</span>
            :<span class="text_min">${padLeft(`${Math.floor(diffMsEnd / 1000 / 60) % 60}`, 2, '0')}</span>
            :<span class="text_sec">${padLeft(`${Math.floor(diffMsEnd / 1000) % 60}`, 2, '0')}</span>`;
    return;
}

/**
 * 타임딜 클릭시 이벤트
 *
 * @param {Event} event
 */
function timeDealItemClickEvent(event: Event) {
    if (isDrag.value === true) {
        return;
    }

    event.stopPropagation();

    const timeDeal = filteredTimeDeals.value[realIndex.value];
    if (timeDeal == null) {
        return;
    }

    // 진행예정
    if (timeDeal.isStart === false) {
        return mmon.bom.alert(`${formatDate(timeDeal.startAt, 'MM월 DD일 HH시', true)}에 시작되는\n타임특가 상품입니다.`);
    }

    // 종료
    if (timeDeal.isEnd === true) {
        return mmon.bom.alert(`종료된 타임특가 상품입니다.`);
    }

    // 진행중
    if (timeDeal.isOnlyAdult && needCertificateAge.value) {
        return router.push({
            name: pathCertificate,
            query: {
                redirect_to_after: `/goods/detail/${timeDeal.goodsId}`, is_need_adult_certification: 'Y'
            },
        });
    }

    return router.push({
        name: 'GoodsDetail',
        params: { id: timeDeal.goodsId },
    });
}

/**
 * 타임딜 sticky 관련 이벤트 핸들러
 *
 * @param {Event} event
 */
function timeDealStickyEventHandler(event: Event) {
    const headerEl = document.getElementsByClassName('mm_header')[0] as HTMLElement
    const pageEl = document.getElementsByClassName('mm_page')[0] as HTMLElement;
    const timeDealEl = document.getElementsByClassName('mm_timedeal')[0] as HTMLElement
    const btnTimeEl = timeDealEl.getElementsByClassName('btn_timedeal')[0] as HTMLElement;
    const timeInnerEl = timeDealEl.getElementsByClassName('mm_timedeal-inner')[0] as HTMLElement;

    const timeOffset = timeDealEl.getBoundingClientRect()
    const isSticky = headerEl ? timeOffset.top - headerEl.offsetHeight - headerEl.getBoundingClientRect().top < 0 : false;

    if (isSticky) {
        timeDealEl.classList.add('S=sticky-on');
    } else {
        timeDealEl.classList.remove('S=sticky-on');
    }

    // 스크롤 시 타임특가 배너가 본문 안에서만 fixed 되도록 처리하기 위해 bottom값 계산
    const scrollRect = { top: 0, left: 0 };
    const scrollOffset = { top: window.pageYOffset, left: window.pageXOffset };

    const btnPositionTop = scrollOffset.top + btnTimeEl.getBoundingClientRect().top - scrollRect.top;
    const pagePositionTop = scrollOffset.top + pageEl.getBoundingClientRect().top - scrollRect.top;

    // 스크롤 시 타임특가 배너가 본문 안에서만 fixed 되도록 처리하기 위해 bottom값 계산
    const margin = btnPositionTop + 224 - (pagePositionTop + pageEl.offsetHeight);

    const styleBottom = parseFloat(getComputedStyle(timeInnerEl)['bottom']) + margin;
    timeInnerEl.style.bottom = styleBottom < 224 ? '' : styleBottom + 'px';
}
/** VUE LIFE CYCLE */
/**
 * Life cycle
 */
onMounted(async () => {
    try {
        if (filteredTimeDeals.value.length === 1) {
            updateBannerTitle();
        }

        // 타임딜 배너 sticky 이벤트 set
        window.addEventListener('load', timeDealStickyEventHandler)
        window.addEventListener('scroll', timeDealStickyEventHandler)
        window.addEventListener('resize', timeDealStickyEventHandler)
    } catch (e) {
        console.log(e)
    }
})

onBeforeUnmount(() => {
    if (interval.value != null) {
        clearInterval(interval.value);
    }

    // 타임딜 배너 sticky 이벤트 remove
    window.removeEventListener('load', timeDealStickyEventHandler)
    window.removeEventListener('scroll', timeDealStickyEventHandler)
    window.removeEventListener('resize', timeDealStickyEventHandler)
})

</script>

