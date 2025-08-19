<template>
    <div
        ref="carouselElement"
        class="mm_carousel"
        data-carousel
    >
        <div class="mm_carousel-inner">
            <ul class="mm_carousel-list">
                <li
                    v-for="(item, index) in items"
                    :key="index"
                    class="mm_carousel-item"
                >
                    <slot name="item" :item="item" />
                </li>
                <!--캐러셀 클론-->
                <template v-if="useCopy || items.length == 2 || items.length == 3">
                    <li
                        v-for="(item, index) in items"
                        :key="index"
                        class="mm_carousel-item S=clone"
                        tabindex="-1"
                    >
                        <slot name="item" :item="item" />
                    </li>
                </template>
            </ul>
        </div>
        <div
            v-if="useControl"
            class="mm_carousel-control"
        >
            <button
                type="button"
                class="btn_carousel-prev"
            >
                <i class="ico_control-prev T=sm" /><b class="mm_ir-blind">이전</b>
            </button>
            <button
                type="button"
                class="btn_carousel-next"
            >
                <i class="ico_control-next T=sm" /><b class="mm_ir-blind">다음</b>
            </button>
        </div>
        <div
            v-if="useCount"
            class="mm_carousel-count"
        >
            <strong class="text_carousel-index" />
            <i v-if="useControl">/</i>
            <span class="text_carousel-total" />
        </div>
        <div v-if="useCustomCount" class="mm_carousel-count">
            <slot name="count" />
        </div>
        <div
            v-if="usePagination"
            class="mm_carousel-pagination"
        >
            <ol>
                <template v-if="useCustomPagination">
                    <slot name="pagination" />
                </template>
                <template v-else>
                    <li v-for="index in items.length" :key="index">
                        <button
                            type="button"
                            class="btn_carousel-page"
                        >
                            <b class="mm_ir-blind">{{ index + 1 }}</b>
                        </button>
                    </li>
                </template>
            </ol>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, ref, watch, onMounted } from 'vue';
import { carouselReload, carouselUpdate } from '@/customMotion'
import { Carousel } from '@/assets/publish/src/script/ui/sliders';

const props = withDefaults(defineProps<{
    items: any[],
    useCount?: boolean,
    useCustomCount?: boolean,
    useControl?: boolean,
    usePagination?: boolean,
    useCustomPagination?: boolean,
    carouselData: CarouselData,
    useCopy?: boolean,
    isStop?: boolean,
}>(), {
    items: () => [],
    useCount: true,
    useCustomCount: false,
    useControl: false,
    usePagination: false,
    useCustomPagination: false,
    carouselData: () => { return {} },
    useCopy: false,
    isStop: false,
})

const isCarouselUpdated = ref<boolean>(false)
const carouselElement = ref<HTMLElement | null>(null)
const { items, carouselData } = toRefs(props);
const carouselUi = ref<Carousel>()

onMounted(() => {
    if (carouselElement.value && items.value.length > 0) {
        carouselUi.value = carouselUpdate(carouselElement.value, carouselData.value)[0]
        isCarouselUpdated.value = true
    }   
});

watch(
    [items, carouselElement],
    ([nowItems, nowCarouselElement], [prevItems]) => {
        if (nowCarouselElement === null) {
            return
        }

        if (nowItems.length !== prevItems.length && isCarouselUpdated.value) {
            setTimeout(() => {
                if (carouselElement.value !== null) {
                    carouselReload(nowCarouselElement)
                }
            }, 300)
            return
        }
        carouselUpdate(nowCarouselElement, carouselData.value)
        isCarouselUpdated.value = true
    },
    {
        flush: 'post',
        deep: true
    },
)
    
watch(() => props.isStop, (isStop) => {
    setTimeout(() => {
        if (!carouselUi.value) {
            return;
        }
        if (isStop) {
            carouselUi.value.stop();
        } else {
            carouselUi.value.play();
        }
    }, 500);
}, {
    immediate: true
})

defineExpose({
    carouselUi,
    carouselElement
})
</script>
