<template>
    <div ref="carouselElement" class="mm_carousel" data-carousel>
        <div class="mm_carousel-inner">
            <ul class="mm_carousel-list">
                <slot name="additionalItem" />
                <li v-for="item, index in items" :key="index" class="mm_carousel-item">
                    <slot name="item" :item="item" />
                </li>
                <!--캐러셀 클론-->
                <template v-if="useCopy || items.length == 2 || items.length == 3">
                    <slot name="additionalItem" :class-name="'S=clone'" :tab-index="-1" />
                    <li v-for="item, index in items" :key="index" class="mm_carousel-item S=clone" tabindex="-1">
                        <slot name="item" :item="item" />
                    </li>
                </template>
            </ul>
        </div>
        <div v-if="useControl" class="mm_carousel-control">
            <button type="button" class="btn_carousel-prev">
                <i class="ico_control-prev T=sm" /><b class="mm_ir-blind">이전</b>
            </button>
            <button type="button" class="btn_carousel-next">
                <i class="ico_control-next T=sm" /><b class="mm_ir-blind">다음</b>
            </button>
        </div>
        <div v-if="useCount" class="mm_carousel-count">
            <strong class="text_carousel-index" />
            <i v-if="items.length > 1">/</i>
            <span class="text_carousel-total" />
        </div>
        <div v-if="useCustomCount" class="mm_carousel-count">
            <slot name="count" />
        </div>
        <div v-if="(usePagination && items.length > 1) || useCustomPagination" class="mm_carousel-pagination">
            <ol>
                <template v-if="useCustomPagination">
                    <slot name="pagination" />
                </template>
                <template v-else>
                    <li v-for="index in items.length" :key="index">
                        <button type="button" class="btn_carousel-page">
                            <b class="mm_ir-blind">{{ index + 1 }}</b>
                        </button>
                    </li>
                </template>
            </ol>
        </div>
        <div v-if="useCustomControl" class="mm_carousel-control">
            <slot name="customControl" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, ref, watch, onMounted } from 'vue';
import { carouselReload, carouselUpdate } from '@/customMotion';
import { Carousel } from '@/assets/publish/src/script/ui/sliders';

const props = withDefaults(defineProps<{
    items: any[]
    carouselData: CarouselData,
    useCount?: boolean
    useCustomCount?: boolean
    useControl?: boolean
    usePagination?: boolean
    useCustomPagination?: boolean
    useCustomControl?: boolean
    isForceUpdate?: boolean,
    useCopy?: boolean
}>(), {
    items: () => [],
    carouselData: () => {
        return {}
    },
    useCount: false,
    useControl: false,
    usePagination: false,
    useCustomControl: false,
    useCustomPagination: false,
    isForceUpdate: false,
    useCopy: false,
})

const {
    items,
    carouselData,
    isForceUpdate,
} = toRefs(props);
const carouselElement = ref<HTMLElement|null>(null);
const carouselUi = ref<Carousel>();

/**
 * 캐러셀 업데이트
 */
function updateCarousel() {
    if (carouselElement.value === null) {
        return
    }

    carouselUi.value = carouselUpdate(
        carouselElement.value,
        carouselData.value,
    )[0]
}

onMounted(() => {
    if (carouselElement.value && (isForceUpdate.value || items.value.length > 0)) {
        carouselUi.value = carouselUpdate(carouselElement.value, carouselData.value)[0];
    }

    watch(items,
        (nowItems, prevItems) => {
            if (carouselElement.value === null) {
                return
            }

            if (nowItems.length === 1) {
                return carouselUi.value?.destroy();
            }

            if (nowItems.length !== prevItems.length) {
                if (carouselElement.value !== null) {
                    carouselReload(carouselElement.value)
                }
                return
            }
        },
        {
            flush: 'post',
            deep: true
        },
    )

    watch(carouselElement,
        () => {
            if (carouselElement.value == null) {
                return
            }                    
            updateCarousel()
        },
        { flush: 'post' },
    )
})

defineExpose({
    carouselElement,
    carouselUi,
})
</script>
