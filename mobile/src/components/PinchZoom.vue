<template>
    <div ref="containerElement" class="mm_pinchzoom" data-pinchzoom>
        <div class="mm_pinchzoom-wrapper">
            <div ref="pinchZoomElement" class="mm_editor">
                <slot name="contents" :contents="contents" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, onBeforeUnmount, watch } from 'vue';
import { gsap , Power0 } from "gsap";
import mm from '@/assets/publish/src/script/mui';

const props = withDefaults(defineProps<{
    contents: string
    flag: boolean
}>(), {
    contents: '',
    flag: false
})

const { contents, flag } = toRefs(props);

const pinchZoomData = ref({
    scale: 1,// ? :number - 초기 scale 값
    scaleMin: 1,// ? :number - 핀치 줌인 가능한 최소 배수
    scaleMax: 3,// ? :number - 핀치 줌인 가능한 최대 배수
    classWrapper: 'mm_pinchzoom-wrapper',
    padding: {// :object - 핀치 영역 상, 하단에 fixed 요소가 겹쳐있는 경우 해당 요소의 높이값 만큼 padding 값 추가
        top: 0,// ? :number - 상단 여백
        bottom: 0,// ? :number - 하단 여백
    }
})

const containerElement = ref<HTMLElement|null>(null);
const pinchZoomElement = ref<HTMLElement|null>(null);
const scrollerElement = computed(() => {
    return mm.scroll?.element;
});

const frameTop = computed(() => {
    if (containerElement.value == null) { return 0 }

    const frameElement = window.frameElement as HTMLElement;

    return frameElement == null
        ? parent.mm.position(containerElement.value).top
        : parent.mm.position(frameElement).top;
});

const zoom = computed<{ scale: number, beforeScale: number}>(() => {
    return { scale: pinchZoomData.value.scale, beforeScale: pinchZoomData.value.scale };
});

let isOnZoom = false;
let isOnDrag = false;
let touch = {
    start: { x: 0, y: 0, distance: 0 },
    move: { x: 0, y: 0, distance: 0 },
    between: { x: 0, y: 0 } // 두 터치점의 중간 값에 대한 x, y 좌표
};
let translate = {
    x: 0,
    y: 0,
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
    beforeX: 0,
    beforeY: 0
};

watch([containerElement, flag], () => {
    if (containerElement.value == null) {
        return
    }

    if (flag.value) {
        containerElement.value.addEventListener('touchstart', touchStartEventHandler);
        containerElement.value.addEventListener('dblclick', dblclickEventHandler);
    } else {
        containerElement.value.removeEventListener('touchstart', touchStartEventHandler);
        containerElement.value.removeEventListener('dblclick', dblclickEventHandler);
    }

    gsap.set(pinchZoomElement.value, { transformOrigin: '0% 0%', scale: 1, x: 0, y: 0 });
}, {
    flush: 'post'
});

/**
 * Life Cycle
 */
onBeforeUnmount(() => {
    containerElement.value?.removeEventListener('touchstart', touchStartEventHandler);
    containerElement.value?.removeEventListener('dblclick', dblclickEventHandler);
})

/**
 * dblclick 이벤트 핸들러
 *
 * @param {MouseEvent} event
 */
function dblclickEventHandler(event: MouseEvent) {
    if (
        containerElement.value == null
        || pinchZoomElement.value == null
        || scrollerElement.value == null
        || mm.scroll == null
    ) {
        return;
    }

    if (zoom.value.scale > pinchZoomData.value.scaleMin) {
        const offsetTop = frameTop.value + pinchZoomElement.value.offsetTop;
        const ratio = zoom.value.scale / pinchZoomData.value.scaleMin;
        const changeScroll = (-translate.y / ratio) + offsetTop
                    + ((scrollerElement.value.scrollTop - offsetTop) / ratio)
                    - event.screenY;

        // 더블탭 동작시 현재 보고있던 영역으로 스크롤을 이동
        mm.scroll.to(changeScroll, { _time: 0, scroller: scrollerElement.value });

        zoom.value.scale = pinchZoomData.value.scaleMin;
        translate.x = -event.offsetX * (pinchZoomData.value.scaleMin - 1);
        translate.y = 0;
    } else {
        zoom.value.scale = pinchZoomData.value.scaleMax;
        translate.x = -event.offsetX * (pinchZoomData.value.scaleMax - 1);
        translate.y = -event.offsetY * (pinchZoomData.value.scaleMax - 1);
    }

    translateMinmax();

    gsap.set(pinchZoomElement.value, {
        scale: zoom.value.scale,
        x: translate.x,
        y: translate.y,
        ease: Power0.easeNone
    });

}

/**
 * touchStart 이벤트 핸들러
 *
 * @param {TouchEvent} event
 */
function touchStartEventHandler(event: TouchEvent) {
    if (containerElement.value == null || pinchZoomElement.value == null) {
        return;
    }

    if (!event.touches) {
        return;
    }

    if (event.touches.length === 1 && zoom.value.scale === 1) {
        return;
    }

    zoom.value.beforeScale = zoom.value.scale = Number(gsap.getProperty(pinchZoomElement.value, 'scaleX'));

    translate.beforeX = Number(gsap.getProperty(pinchZoomElement.value, 'x'));
    translate.beforeY = Number(gsap.getProperty(pinchZoomElement.value, 'y'));

    containerElement.value.addEventListener('touchmove', touchMoveEventHandler);
    containerElement.value.addEventListener('touchend', touchEndEventHandler);
}

/**
 * touchMove 이벤트 핸들러
 *
 * @param {TouchEvent} event
 */
function touchMoveEventHandler(event: TouchEvent) {
    if (
        containerElement.value == null
        || pinchZoomElement.value == null
        || scrollerElement.value == null
        || mm.scroll == null
    ) {
        return;
    }

    const touchData = event.touches;
    const isSingleTouch = (touchData.length === 1) ? true : false;
    const isMultiTouch = (touchData.length > 1) ? true : false;

    // touchstart 시점에서는 핀치 동작인지 구분할 수 없어 touchmove 첫번째 호출 시점에 동작 구분
    if (isMultiTouch && !isOnZoom) {
        touch.start.x = touchData[0].clientX - touchData[1].clientX;
        touch.start.y = touchData[0].clientY - touchData[1]?.clientY;
        touch.start.distance = Math.sqrt(Math.pow(touch.start.x, 2) + Math.pow(touch.start.y, 2));

        // event.touches 좌표값은 화면 기준이기 때문에 mm_pinchzoom 영역이 디바이스 너비보다 작은경우
        // 터치의 좌표값을 보정하기 위해 containerElement.value.getBoundingClientRect()를 이용하여, 터치 위치를 보정
        touch.between.x = ((touchData[0].clientX + touchData[1].clientX) / 2)
                    - containerElement.value.getBoundingClientRect().left;
        touch.between.y = ((touchData[0].clientY + touchData[1].clientY) / 2)
                    - containerElement.value.getBoundingClientRect().top;

        isOnZoom = true;

    } else if (isSingleTouch && !isOnDrag) {

        touch.start.x = touchData[0].clientX;
        touch.start.y = touchData[0].clientY;
        translateMinmax();

        isOnDrag = true;
    }

    if (isOnDrag || isOnZoom) {
        event.preventDefault();
        event.stopPropagation();

        if (isOnZoom) {
            touch.move.x = touchData[0].clientX - touchData[1].clientX;
            touch.move.y = touchData[0].clientY - touchData[1].clientY;

            touch.move.distance = Math.sqrt(Math.pow(touch.move.x, 2) + Math.pow(touch.move.y, 2));

            const changScale = Number((zoom.value.beforeScale * (touch.move.distance / touch.start.distance)).toFixed(5));
            zoom.value.scale = Math.min(Math.max(changScale, pinchZoomData.value.scaleMin), pinchZoomData.value.scaleMax);

            const scaleFactor = (zoom.value.scale / zoom.value.beforeScale) - 1;

            // 두 터치 사이점과 화면 센터(x, y좌표의 0점)간의 거리 비율
            const centerRatioX = (touch.between.x - translate.beforeX) / containerElement.value.offsetWidth;
            const centerRatioY = (touch.between.y - translate.beforeY) / containerElement.value.offsetHeight;

            translate.x = translate.beforeX - (containerElement.value.offsetWidth * scaleFactor) * centerRatioX;
            translate.y = translate.beforeY - (containerElement.value.offsetHeight * scaleFactor) * centerRatioY;

            translateMinmax();
        } else {
            touch.move.x = touchData[0].clientX;
            touch.move.y = touchData[0].clientY;

            translate.x = translate.beforeX - (touch.start.x - touch.move.x);
            translate.y = translate.beforeY - (touch.start.y - touch.move.y);
        }

        translate.x = Math.min(Math.max(translate.x, translate.maxX), translate.minX);
        translate.y = Math.min(Math.max(translate.y, translate.maxY), translate.minY);

        gsap.set(pinchZoomElement.value, {
            scale: zoom.value.scale,
            x: translate.x,
            y: translate.y,
            ease: Power0.easeNone
        });
    }
}

/**
 * touchEnd 이벤트 핸들러
 *
 * @param {TouchEvent} event
 */
function touchEndEventHandler(event: TouchEvent) {
    if (
        containerElement.value == null
        || pinchZoomElement.value == null
        || scrollerElement.value == null
        || mm.scroll == null
    ) {
        return;
    }

    const touchData = event.touches;
    const isSingleTouch = (touchData.length === 1) ? true : false;

    if (isSingleTouch && isOnZoom) {
        // 핀치 동작 중간에 한손가락을 떼는 경우 드래그 이벤트 준비를 위해 현재 translate 값을 저장
        translate.beforeX = translate.x;
        translate.beforeY = translate.y;
    }

    if (zoom.value.scale <= 1) {
        // 줌 아웃 동작으로 scale이 1로 되었을때 drag 했던 Y 위치만큼 스크롤을 이동
        const changeScroll = scrollerElement.value.scrollTop - Number(gsap.getProperty(pinchZoomElement.value, 'y'));

        mm.scroll.to(changeScroll, { _time: 0, scroller: scrollerElement.value });

        translate.x = 0;
        translate.y = 0;
        gsap.set(pinchZoomElement.value, { x: translate.x, y: translate.y, ease: Power0.easeNone });
    }

    isOnDrag = false;
    isOnZoom = false;

    containerElement.value.removeEventListener('touchmove', touchMoveEventHandler);
    containerElement.value.removeEventListener('touchend', touchEndEventHandler);
}

/**
         * 최대 최소 translate 계산
         *
         */
function translateMinmax() {
    if (
        containerElement.value == null
        || scrollerElement.value == null
        || pinchZoomElement.value == null
    ) {
        return;
    }

    // pinch-zoom 전, containerElement의 실 높이, 너비
    const pinchWidth = containerElement.value.offsetWidth;
    const pinchHeight = containerElement.value.offsetHeight;

    // Y축 상단영역 끝까지 이동 가능한 translate
    const maxTop = scrollerElement.value.scrollTop
        - (frameTop.value + pinchZoomElement.value.offsetTop)
        + pinchZoomData.value.padding.top;
    // Y축 하단영역 끝까지 이동 가능한 translate
    const maxBottom = maxTop
        + parent.innerHeight
        - (pinchHeight * zoom.value.scale)
        - pinchZoomData.value.padding.bottom;

    translate.maxX = pinchWidth * (1 - zoom.value.scale);
    translate.minY = Math.max(0, maxTop);
    translate.maxY = Math.min(maxBottom, pinchHeight * (1 - zoom.value.scale));
}
</script>