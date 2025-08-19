<template>
    <div
        ref="toastDiv"
        :class="[
            'mm_toast',
            {'S=on': isOpenToast}
        ]"
        data-toast
        :style="isTouch ? `transition: none 0s ease 0s; transform: translateY(${rate}%);` : ''"
    >
        <a
            class="btn_toast"
            :title="isOpenToast ? '접어놓기' : '펼쳐보기'"
            @click.prevent="isOpenToast = !isOpenToast"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
        >
            <p v-html="titleHtml" />
        </a>
        <div class="mm_toast-inner">
            <div class="mm_timedeal-content">
                <MMCarousel
                    :items="timeDealsInfo.banners"
                    :use-pagination="true"
                    :carousel-data="{
                        _isMoreSide: true,
                        _isAutoHeight: true,
                        onReady: callbackOnReady,
                        onComplete: callbackOnComplete,
                    }"
                >
                    <template #item="{ item }">
                        <a
                            :data-id="`${item.id}`"
                            :class="{ 'S=timedeal-ready': item.isStart === false}"
                            href="javascript:;"
                            @click.capture="timeDealItemClickEvent"
                        >
                            <i v-lazyload="{ src: item.imageUrl }" class="mm_bg-cover image_banner" :data-lazyload="`{'_src': '${item.imageUrl}'}`" />
                            <p v-if="item.isOnlyAdult && needCertificateAge" class="text_adult">
                                <b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult" />
                            </p>
                            <p class="mm_ir-blind" v-text="item.title" />
                        </a>
                    </template>
                </MMCarousel>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, onBeforeUnmount } from 'vue';
import { TimeDealsInfo } from '$/@type/TimeDeal';
import { mmon } from '$/helper/mmon';
import { formatDate, padLeft } from '$/filters';
import { Carousel } from '@/assets/publish/src/script/ui/sliders';
import moment from 'moment';
import MMCarousel from '@/components/Carousel.vue';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const props = defineProps<{
    timeDealsInfo: TimeDealsInfo
}>();

const {
    router,
    isUser,
    needCertificateAge,
} = usePageContext();


/** VARIABLE */
const pathCertificate = isUser.value ? 'AdultCertification' : 'Login';
// 타임딜 캐러셀 관련
const isOpenToast = ref<boolean>(false); // 토스트배너 open 여부
const interval = ref<NodeJS.Timer|null>(null);
const timeDealRemoveIndexs = new Set<number>() // 목록에서 제거해야 하는 종료된 타임딜 realIndex
const toastDiv = ref<HTMLElement|null>(null);
const btnToastHeight = ref<number>(0);
const realIndex = ref(0);
const titleHtml = ref('');

const rate = ref<number>(0);            // translateY 비율
const isTouch = ref(false);             // 터치 여부

const startHeight = ref<number>(0);     // touchStart 시 높이
const moveHeight = ref<number>(0);      // touchMove 시 높이
const height = computed(() => {
    return btnToastHeight.value;
});

const beforeHeight = ref<number>(0);    // touchmove 시 moveHeight 이전 높이
const afterHeight = ref<number>(0);     // touchmove 시 moveHeight 이후 높이

/** FUNCTION */
/**
 * 타임딜 아이템 클릭시 이벤트
 *
 */
function timeDealItemClickEvent() {
    const timeDeal = props.timeDealsInfo.banners[realIndex.value];
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

    if (timeDeal.isOnlyAdult && needCertificateAge) {
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
 * Carousel cycle
 *
 * @param {ui: Carousel, _isBack: boolean} carousel
 */
async function callbackOnComplete(carousel: {ui: Carousel, _isBack: boolean}) {
    if (carousel._isBack) {
        return;
    }

    realIndex.value = carousel.ui.realIndex;

    // 타임딜 배너 타이틀 업데이트
    updateBannerTitle();
}

function callbackOnReady(carousel: {ui: Carousel, _isBack: boolean}) {
    realIndex.value = props.timeDealsInfo.banners.length < 2 ? 0 : carousel.ui.realIndex;

    if (interval.value != null) {
        clearInterval(interval.value);
    }

    updateBannerTitle();
    interval.value = setInterval(() => {
        updateBannerTitle();
    }, 1000)
}

// 터치 시작했을 때
function touchStart(event: TouchEvent) {
    startHeight.value = event.touches[0].clientY;
}

// 터치하여 움직일 때
function touchMove(event: TouchEvent) {
    isTouch.value = true;
    moveHeight.value = event.touches[0].clientY;
}

// 터치 종료했을 때
function touchEnd() {
    if (isTouch.value) {
        // 마우스 마지막 움직임에 따라 토스트 팝업 노출/숨김
        if (beforeHeight.value > afterHeight.value) {
            isOpenToast.value = true;
        } else {
            isOpenToast.value = false;
        }

        isTouch.value = false;
    }
}

/**
 * 타임딜 배너 상단( 타임딜 상태, 남은 시간 ) 업데이트
 */
function updateBannerTitle() {
    const targetTimeDeal = props.timeDealsInfo.banners[realIndex.value];
    if (targetTimeDeal == null) {
        return;
    }

    // 진행예정
    const diffMsBeforeStart = moment(targetTimeDeal.startAt).valueOf() - Date.now();
    if (diffMsBeforeStart > 500) {
        targetTimeDeal.isStart = false;
        titleHtml.value = `<b class="text_state T=state-schedule">
            <i class="ico_clock"></i>진행예정</b>
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

        timeDealRemoveIndexs.add(realIndex.value);

        titleHtml.value = `<b class="text_state T=state-schedule">
            <i class="ico_clock"></i>진행종료</b>
            <span class="text_hour">00</span>
            :<span class="text_min">00</span>
            :<span class="text_sec">00</span>`;
        return;
    }

    // 진행중
    targetTimeDeal.isStart = true;
    titleHtml.value = `<b class="text_state"><i class="ico_clock"></i>진행중</b>
        <span class="text_hour">${padLeft(`${Math.floor(diffMsEnd / 1000 / 60 / 60)}`, 2, '0')}</span>
        :<span class="text_min">${padLeft(`${Math.floor(diffMsEnd / 1000 / 60) % 60}`, 2, '0')}</span>
        :<span class="text_sec">${padLeft(`${Math.floor(diffMsEnd / 1000) % 60}`, 2, '0')}</span>`;
    return;
}

/** VUE LIFE CYCLE */
onMounted(async() => {
    try {
        if (props.timeDealsInfo.banners.length === 1) {
            updateBannerTitle();
        }

        setTimeout(() => {
            btnToastHeight.value = toastDiv.value?.offsetHeight || 0;
        }, 500);
    } catch (e) {
        console.log(e);
    }
});

onBeforeUnmount(() => {
    if (interval.value !== null) {
        clearInterval(interval.value);
    }
})

watch(moveHeight, (to, from) => {
    if (startHeight.value > moveHeight.value) {
        rate.value = isOpenToast.value ? 0 : Math.max(0, Math.min(100, (1 - (startHeight.value - moveHeight.value) / height.value) * 100));

        if (rate.value <= 0) {
            rate.value = 0;
            isOpenToast.value = true;
        }
    } else {
        rate.value = isOpenToast.value ? Math.max(0, Math.min(100, (0 + (moveHeight.value - startHeight.value) / height.value) * 100)) : 100;

        if (rate.value >= 100) {
            rate.value = 100;
            isOpenToast.value = false;
        }
    }

    beforeHeight.value = from;
    afterHeight.value = to;
});
</script>