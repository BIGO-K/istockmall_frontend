<template>
    <div
        ref="refreshContainer"
        :style="displayRefreshContainer ? {} : { zIndex: -1, opacity: 0 }" 
        class="mm_refresh"        
    >
        <div class="ico_loading">
            <i /><i /><i /><i /><i /><i /><i /><i />
        </div>
        <p>아래로 당겨 새로고침</p>
    </div>
</template>


<script setup lang='ts'>
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { isMobile } from '$/functions';
import { ref, computed, onMounted } from 'vue';
import { useScroll, useEventListener } from '@vueuse/core';
import gsap from 'gsap';

/** VARIABLE */
const props = withDefaults(defineProps<{
    mainPage?: boolean,    
}>(), {
    mainPage: false,    
})

const {
    setPageContext,
    route,
    router
} = usePageContext();

const startTouch = ref<Touch|null>(null);
const touchMoved = ref<boolean>(false);
const displayRefreshContainer = computed(() => {
    return startTouch.value && scrollY.value <= 0 && touchMoved.value
})
const refreshContainer = ref<HTMLElement|null>(null);
const mainScroller = ref<HTMLElement|null>(null);

const { y: scrollY } = useScroll(mainScroller);

useEventListener(mainScroller, 'touchstart', touchStartHandler, { passive: true })
useEventListener(mainScroller, 'touchmove', touchMoveHandler, { passive: true })
useEventListener(mainScroller, 'touchend', touchEndHandler, { passive: true })

const limitY = computed(() => {
    const y = isMobile('ios') ? 70 : 130;
    const plusOption = isMobile('ios') ? 20 : 40;

    return props.mainPage ? y + plusOption : y;
})

const limitMarginTop = computed(() => {
    const marginTop = isMobile('ios') ? 105 : 130;
    const plusOption = isMobile('ios') ? 45 : 40;    
    return props.mainPage ? marginTop + plusOption : marginTop;
})

/** FUNCTION */
function touchStartHandler(event: TouchEvent) {    
    // 터치가 없는 경우 리턴 
    if (!event.touches || scrollY.value > 0) {
        startTouch.value = null;
        return;
    }
    
    // 메인 페이지의 경우 앱설치 배너로 인해 마진 값 추가 
    if (refreshContainer.value && props.mainPage) {
        const headerElement = document.querySelector('.mm_header');
        if (headerElement) {
            refreshContainer.value.style.marginTop = getComputedStyle(headerElement).paddingTop;
        }
    }
    
    // MY 찜 순서편집 일 경우 새로고침 사용안함.
    if (document.querySelector('.S\\=sortable') !== null) {
        return;
    }

    startTouch.value = event.touches[0];        
}

function touchMoveHandler(event: TouchEvent) {
    touchMoved.value = false;
    if (startTouch.value === null) {
        return;    
    }   
    // 아래로 내려가는 방향인 경우 
    const changedTouches = event.changedTouches[0];
    if (changedTouches.pageY - startTouch.value.pageY < 0) {
        return;
    }

    touchMoved.value = true;
    const touches = event.touches[0];
    gsap.set(mainScroller.value, { marginTop: Math.max((touches.screenY - startTouch.value.screenY) * 0.4, 0) });
}

function touchEndHandler(event: TouchEvent) {    
    if (!startTouch.value) {
        return;
    }
    const changedTouches = event.changedTouches[0];
    const changedY = Math.max((changedTouches.screenY - startTouch.value.screenY) * 0.4, 0);

    gsap.to(mainScroller.value, {
        marginTop: changedY < limitY.value ? 0 : limitMarginTop.value, 
        duration: 0.2,
        ease: 'sine.inOut', 
        onComplete: () => {                    
            if (changedY > limitY.value) {
                setPageContext(route.path, 0);
                return router.go(0);
            }
            touchMoved.value = false;
        }
    });            
}

/** VUE LIFE CYCLE */
onMounted(async() => {    
    if (route.meta.layouts.includes('L=modal') || route.meta.layouts.includes('L=side')) {
        return;
    }   
    if (!refreshContainer.value) {
        return;
    }

    mainScroller.value = refreshContainer.value.closest('#mm_body')?.querySelector('.mm_scroller') as HTMLElement;
});

</script>