<template>
    <a
        ref="topButton" 
        :class="['btn_topmost', topButtonOnClassName ]" 
        href="#mm_app"         
        title="페이지 처음으로"
        @click.prevent="positionToTop"
    >
        <i class="ico_topmost" /><b>TOP</b>
    </a>
    <a
        v-if="useRecentGoods && mostRecentGoodsThumbnailUrl !== ''" 
        href="#RECENT_VIEW_GOODS"
        class="btn_prodetail-recent" 
    >
        <i v-lazyload="{ src: mostRecentGoodsThumbnailUrl }" class="mm_bg-cover image_product" />
        <b class="mm_ir-blind">최근 본 상품</b>
    </a>
</template>

<script setup lang='ts'>
import { ref, onMounted, watch, toRefs, computed } from 'vue';
import { useRecentViewGoods } from '$/composables/shoppingComposable';
import { useScroll } from '@vueuse/core';
/** VARIABLE */
withDefaults(
    defineProps<{
        useRecentGoods?: boolean
    }>(), {
        useRecentGoods: false
    }
);
const topButton = ref<HTMLElement|null>(null);
const scroller = ref<HTMLElement|null>(null);
const header = ref<HTMLElement|null>(null);
const topButtonOnClassName = ref('');
const { mostRecentGoodsThumbnailUrl } = useRecentViewGoods();
const headerHide = ref<boolean>(false);
const hideClass = ['S=hide'];

watch(headerHide, () => {
    if (headerHide.value == true) {
        document.documentElement.classList.add(...hideClass);
    } else {
        document.documentElement.classList.remove(...hideClass);
    }
})

const smooth = ref(false)
const behavior = computed(() => smooth.value ? 'smooth' : 'auto')
function positionToTop() {
    smooth.value = true;
    y.value = 0;
}

const {  y, arrivedState, directions } = useScroll(scroller, { behavior });
const { top, bottom } = toRefs(directions);


watch(y, (currentScrollY, beforeScrollY) => {
    // 최초 진입시 스크롤 0 인경우는 처리 안함
    if (beforeScrollY < 1) {
        return 
    } 
    
    if (!header.value) {
        return;
    }

    if (arrivedState.bottom) {                
        document.documentElement.classList.remove(...hideClass);
        return topButtonOnClassName.value = 'S=btn-on';
    }
            
    if (top.value) {
        document.documentElement.classList.remove(...hideClass);
        topButtonOnClassName.value = currentScrollY > header.value?.offsetHeight * 2 ? 'S=btn-on' : '';
    }

    if (bottom.value && currentScrollY > header?.value.offsetHeight * 2) {
        document.documentElement.classList.add(...hideClass);
        topButtonOnClassName.value = '';
    }
}, {
    flush: 'post'
})

onMounted(()=> {
    if (topButton.value !== null) {
        const isNearView = topButton.value.closest('.mm_view > .mm_page');
        if (isNearView !== null) {
            header.value = topButton.value.closest('.mm_view')?.querySelector('.mm_header') as HTMLElement;
            scroller.value = isNearView.querySelector('.mm_scroller') as HTMLElement;                    
        }
    }
});      
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>
