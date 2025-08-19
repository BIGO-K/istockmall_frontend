<template>
    <MMBlock
        :block-name="'b_s=w12Xh6_s5'"
        :required="{
            requiredValueList: [block.bannerPartition?.banners, block.title1, block.title2],
        }"
    >
        <MMTitle :title1="block.title1" :title2="block.title2" :design-class-name="block.designTitleClassName" />
        <div class="m_banner">
            <div class="m_banner-inner">
                <!-- (D) 1,3,4 번 째 li요소에만 'T:lg'클래스를 추가합니다. -->
                <ul ref="listUlElement" class="m_banner-list" @mouseenter="stop" @mouseleave="play" @mousedown.prevent="slideMouseDown">
                    <li 
                        v-for="(banner, index) in block.bannerPartition?.banners"
                        :key="banner.id"
                        class="m_banner-item"
                        :class="[0,2,3].includes(index) ? 'T:lg' : ''"
                    >
                        <MMBanner :banner="banner" :banner-image-class="'mui_bg-cover'" />
                    </li>
                </ul>
            </div>
            <div class="m_banner-progress">
                <div class="m_banner-progress-bar" :style="`width:${progressPercentage}%;`" />
            </div>
            <div class="m_banner-count">
                <span class="m_banner-count-index">{{ indexCount }}</span>
                <span class="m_banner-count-total">{{ totalCount }}</span>
            </div>
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMBanner from '@/components/block/Banner.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import { computed, onMounted, ref, toRefs } from 'vue'
import gsap from 'gsap';
import { lazyloadUpdate } from '@/customMotion'
import { useEventListener } from '@vueuse/core'

const props = defineProps<{
  block: Block
}>()
const { block } = toRefs(props)

const indexCount = ref<number>(0);
const totalCount = ref<number>(block.value.bannerPartition?.banners?.length || 0);
const progressPercentage = ref<number>(0);

const itemIndex = ref<number>(0);
const splitWidth = ref<number>(0);
const interval = ref<NodeJS.Timeout>();

const listUlElement = ref<HTMLElement|null>();

const slideData = ref<{
    isMouseMove: boolean
    startX: number
    startValue: number
}>({
    isMouseMove: false,
    startX: 0,
    startValue: 0,
});

onMounted(() => {
    setProgress();
    play();
    clone();
    lazyloadUpdate('data-lazyload');
})

function setProgress() {
    itemIndex.value = (itemIndex.value < 0) ? totalCount.value + itemIndex.value : itemIndex.value % totalCount.value;
    indexCount.value = itemIndex.value + 1;
    progressPercentage.value = indexCount.value / totalCount.value * 100;
}

function play() {
    stop();

    interval.value = setInterval(() => {
        itemIndex.value++;
        change();
    }, 2000)
}

function stop() {
    if (!interval.value) {
        return;
    }
    clearInterval(interval.value);
}

function change() {
    if (!listUlElement.value) {
        return;
    }

    gsap.to(listUlElement.value, {
        x: -itemIndex.value * splitWidth.value,
        duration: 0.4,
        onComplete: () => {
            if (!listUlElement.value) {
                return;
            }
            gsap.set(listUlElement.value, {
                x: -itemIndex.value * splitWidth.value,
            })
        }
    });

    setProgress();

    const listLiElementList = Array.from(listUlElement.value?.querySelectorAll('li') || []);
    for (let i = 0; i < listLiElementList.length; i++) {
        let index = i + itemIndex.value;
        
        if (index > (listLiElementList.length - 1)) {
            index -= listLiElementList.length;
        }
        const targetElement = listLiElementList[index];

        if (!targetElement) {
            return
        }

        if (i % totalCount.value < 4 && i % totalCount.value !== 1) {
            targetElement.classList.add(`T:lg`)
        } else {
            targetElement.classList.remove(`T:lg`)
        }
    }
}

function clone() {
    const listLiElementList = Array.from(listUlElement.value?.querySelectorAll('li') || []);
    if (!listUlElement.value || listLiElementList.length == 0) {
        return;
    }

    const firstItem = listLiElementList[0];
    const defaultWidth = parseFloat(getComputedStyle(listUlElement.value)['width'])

    listLiElementList.forEach((liElement) => {
        let count = 0;
        
        while (count++ < 2) {
            const $clone = liElement.cloneNode(true) as HTMLElement;
            $clone.classList.add(`S=clone`);
            $clone.setAttribute(`tabindex`, `-1`);

            if (count === 1) {
                firstItem.before($clone);
            } else {
                listUlElement.value?.append($clone);
            }
        }

    })
    
    splitWidth.value = listUlElement.value.offsetWidth / listLiElementList.length;
    listLiElementList[0].style.marginInlineStart = `${-defaultWidth}px`;
}

function slideMouseDown(e: MouseEvent) {
    if (e.type === 'click' || !listUlElement.value) {
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    slideData.value.startX = e.clientX;
    const matrix = getComputedStyle(listUlElement.value)['transform'].split(',');
    slideData.value.startValue = parseFloat(matrix[matrix[0].includes(`matrix3d`) ? 12 : 4]) || 0;
    slideData.value.isMouseMove = false;

    useEventListener(document, 'mousemove', slideMouseInlineHandler)
    useEventListener(document, 'mouseup', removeHandler)
}

function slideMouseInlineHandler (e: MouseEvent) {
    if (!listUlElement.value) {
        return;
    }

    if (!slideData.value.isMouseMove && slideData.value.startX !== e.clientX) {
        slideData.value.isMouseMove = true;
    }
    gsap.set(listUlElement.value, { x: slideData.value.startValue + (e.clientX - slideData.value.startX)})
}

function removeHandler(e: MouseEvent) {
    itemIndex.value = -Math.round((slideData.value.startValue + (e.clientX - slideData.value.startX)) / splitWidth.value);
    change();
    document.removeEventListener('mousemove', slideMouseInlineHandler);
}

</script>
<style>
@import '@publish/css/block/normal/b_s=w12Xh6_s5.css';
</style>
