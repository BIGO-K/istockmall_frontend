<template>
    <div class="mm_timedeal-content">
        <MMCarousel
            ref="carouselInfo"
            :items="timeDealsInfo.banners"
            :use-count="true"
            :use-control="true"
            :carousel-data="{
                _autoDelay: 0,
                onReady: callbackOnReady,
                onComplete: callbackOnComplete
            }"
            @click.capture="timeDealItemClickEvent"
            @mousedown="() => {isDrag = false}"
            @mousemove="() => {isDrag = true}"
        >
            <template #item="{ item }">
                <a
                    :data-id="item.id"
                    :class="{ 'S=timedeal-ready': item.isStart === false }"
                    href="javascript:;"
                >
                    <p v-if="item.isOnlyAdult && needCertificateAge" class="text_adult"><b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult" /></p>
                    <figure>
                        <i
                            v-lazyload="{ src: item.imageUrl }"
                            :data-lazyload="`{'_src': '${item.imageUrl}'}`"
                            class="mm_bg-cover image_banner"
                        />
                        <figcaption :class="{'T=text-black': item.bannerTextColor === '#000000'}">
                            <p class="text_state" v-html="initTimeStatusText(item)" />
                            <template v-if="item.isUseBannerText">
                                <p class="text_banner1">{{ item.bannerText1 }}</p>
                                <p class="text_banner2">{{ item.bannerText2 }}</p>
                                <p class="text_banner3">{{ item.bannerText3 }}</p>
                                <p class="text_banner4">{{ item.bannerText4 }}</p>
                            </template>
                        </figcaption>
                    </figure>
                </a>
            </template>
        </MMCarousel>
    </div>
    <div class="mm_timedeal-foot">
        <button type="button" class="btn_today" @click="closePopup(true)">
            <b>오늘 그만보기</b>
        </button>
        <button type="button" class="btn_close" @click="closePopup(false)">
            <b>닫기</b>
        </button>
    </div>
</template>


<script setup lang='ts'>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { mmon } from '$/helper/mmon'
import { formatDate, padLeft } from '$/filters'
import { Carousel } from '@/assets/publish/src/script/ui/sliders'
import moment from 'moment';
import { TimeDeal, TimeDealsInfo } from '$/@type/timeDeal';
import MMCarousel from '@/components/Carousel.vue';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useClosePopup } from '$/composables/popupComposable'

const props = defineProps<{
    timeDealsInfo: TimeDealsInfo,
    hideBanner: () => void,
}>();
/** VARIABLE */
const { router, needCertificateAge, isUser } = usePageContext();
const pathCertificate = isUser.value ? 'AdultCertification' : 'Login';
// 타임딜 캐러셀 관련
const carouselInfo = ref<typeof MMCarousel|null>(null);
const interval = ref<NodeJS.Timeout|null>(null); // 타임딜 카운트 다운 인터벌
const realIndex = ref(0);
const isDrag = ref(false);

const { setPopupContext } = useClosePopup() 

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
    updateBannerTitle(carousel.ui.$element);
}

function callbackOnReady(carousel: {ui: Carousel, _isBack: boolean}) {
    realIndex.value = props.timeDealsInfo.banners.length < 2 ? 0 : carousel.ui.realIndex;

    if (interval.value != null) {
        clearInterval(interval.value);
    }

    updateBannerTitle(carousel.ui.$element);
    interval.value = setInterval(() => {
        updateBannerTitle(carousel.ui.$element);
    }, 1000)
}

/**
 * 타임딜 배너 상단( 타임딜 상태, 남은 시간 ) 업데이트
 * @param {HTMLElement} carouselEl
*/
function updateBannerTitle(carouselEl: HTMLElement) {
    const targetTimeDeal = props.timeDealsInfo.banners[realIndex.value] as TimeDeal;
    const targetEl = carouselEl.querySelector('.S\\=on');
    
    if (targetEl == null) {
        return;
    }

    const titleEl = targetEl.querySelector('.text_state');
    if (titleEl == null) {
        return;
    }

    return titleEl.innerHTML = initTimeStatusText(targetTimeDeal);
}


function initTimeStatusText(targetTimeDeal: TimeDeal): string {
    // 진행예정
    const diffMsBeforeStart = moment(targetTimeDeal.startAt).valueOf() - Date.now();
    if (diffMsBeforeStart > 500) {
        targetTimeDeal.isStart = false;
        return `<strong class="T=timedeal-schedule">타임딜 진행예정</strong><b>
            <span class="text_hour">${padLeft(`${Math.floor(diffMsBeforeStart / 1000 / 60 / 60)}`, 2, '0')}</span>
            :<span class="text_min">${padLeft(`${Math.floor(diffMsBeforeStart / 1000 / 60) % 60}`, 2, '0')}</span>
            :<span class="text_sec">${padLeft(`${Math.floor(diffMsBeforeStart / 1000) % 60}`, 2, '0')}</span></b>`;                
    }

    // 진행종료 && 진행중
    const diffMsEnd = moment(targetTimeDeal.endAt).valueOf() - Date.now();
    // 진행종료
    if (diffMsEnd < 500) {
        targetTimeDeal.isEnd = true;

        if (interval.value) {
            clearInterval(interval.value);
        }

        return `<strong class="T=timedeal-schedule">
            타임딜 종료</strong><b>
            <span class="text_hour">00</span>
            :<span class="text_min">00</span>
            :<span class="text_sec">00</span></b>`;                
    }

    // 진행중
            
    return `<strong>타임딜 진행중</strong><b>
        <span class="text_hour">${padLeft(`${Math.floor(diffMsEnd / 1000 / 60 / 60)}`, 2, '0')}</span>
        :<span class="text_min">${padLeft(`${Math.floor(diffMsEnd / 1000 / 60) % 60}`, 2, '0')}</span>
        :<span class="text_sec">${padLeft(`${Math.floor(diffMsEnd / 1000) % 60}`, 2, '0')}</span></b>`;
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

    const timeDeal = props.timeDealsInfo.banners[realIndex.value] as TimeDeal;
    if (timeDeal == null) {
        return;
    }

    // 진행예정
    if (timeDeal.isStart === false) {
        return mmon.bom.alert(
            `${formatDate(timeDeal.startAt, 'MM월 DD일 HH시', true)}
                    에 시작되는\n타임특가 상품입니다.`
        );
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
 * 팝업 닫기
 *
 * @param {boolean} isHideOnDay
 */
function closePopup(isHideOnDay: boolean) {
    // [오늘 하루 그만보기] 여부 쿠키 저장
    if (isHideOnDay) {
        setPopupContext('IS_TIMEDEAL_BANNER_HIDE', true)
    }
    props.hideBanner();
}

/**
 * 타임딜 sticky 관련 이벤트 핸들러
 *
 * @param {Event} event
 */
function timeDealStickyEventHandler(event: Event) {
    const timeDealEl = document.getElementsByClassName('mm_timedeal')[0] as HTMLElement
    const pageEl = document.getElementsByClassName('mm_page')[0] as HTMLElement;
    if (timeDealEl == null || pageEl == null) {
        return
    }
    // 스크롤 시 팝업이 본문 안에서만 fixed 되도록 처리하기 위해 bottom값 계산
    const margin = timeDealEl.getBoundingClientRect().top + timeDealEl.offsetHeight + 30
                            - (pageEl.getBoundingClientRect().top + pageEl.offsetHeight)

    const bottom = parseFloat(getComputedStyle(timeDealEl)['bottom']) + margin
    if ( bottom > 30) {
        timeDealEl.style.bottom = `${bottom}px`
    }
}
/** FUNCTION */

/** VUE LIFE CYCLE */
onMounted(async () => {
    try {
        if (props.timeDealsInfo.banners.length === 1 && carouselInfo.value != null) {
            updateBannerTitle(carouselInfo.value.carouselElement);
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
