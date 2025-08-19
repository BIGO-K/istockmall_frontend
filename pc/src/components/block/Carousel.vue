<template>
    <div v-if="items.length > 0" ref="carouselElement" class="mui_carousel" data-carousel>
        <div class="mui_carousel-inner">
            <ul class="mui_carousel-list">
                <li v-for="(item, index) in items" :key="index" class="mui_carousel-item">
                    <slot name="item" :item="item" />
                </li>
                <!--캐러셀 클론-->
                <template v-if="useClone || items.length == 2 || items.length == 3">
                    <li v-for="item, index in items" :key="index" class="mui_carousel-item S=clone" tabindex="-1">
                        <slot name="item" :item="item" />
                    </li>
                </template>
            </ul>
        </div>
        <div v-if="useControl" class="mui_carousel-control">
            <button type="button" class="btn_carousel-prev">
                <i class="uico_control-prev" /><b class="mui_ir-blind">이전</b>
            </button>
            <button type="button" class="btn_carousel-next">
                <i class="uico_control-next" /><b class="mui_ir-blind">다음</b>
            </button>
        </div>
        <div v-if="useCount" class="mui_carousel-count">
            <strong class="text_carousel-index" />
            <i v-if="useControl">/</i>
            <span class="text_carousel-total" />
        </div>
        <div v-if="useCustomCount" class="mui_carousel-count">
            <slot name="count" />
        </div>
        <div v-if="usePagination" class="mui_carousel-pagination">
            <ol>
                <template v-if="useCustomPagination">
                    <slot name="pagination" />
                </template>
                <template v-else>
                    <li v-for="index in items.length" :key="index">
                        <button type="button" class="btn_carousel-page">
                            <b class="mui_ir-blind">{{ index + 1 }}</b>
                        </button>
                    </li>
                </template>
            </ol>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { toRefs, ref, watch, onMounted, computed } from 'vue'
import {  carouselReload, carouselUpdate, carouselResize } from '@/customMotion'
import { Carousel } from '@/assets/publish/src/script/ui/sliders'
import { useBlockContext } from '$/composables/blockComposable'

/** VARIABLE */
const props = withDefaults(defineProps<{
    contextCode: string;
    items: any[];
    carouselData: CarouselData;
    features: ('clone'|'count'|'control'|'pagination'|'customPagination'|'customCount')[];
    requireResize?: boolean;
    requireIndexReset?: boolean;
}>(), {
    contextCode: '',
    items: () => [],
    carouselData: () => { return {} },
    features: () => [],
    requireResize: false,
    requireIndexReset: false,
})

const carouselElement = ref<HTMLElement | null>(null)
const isCarouselUpdated = ref<boolean>(false)
const { items, carouselData, features, requireResize, requireIndexReset } = toRefs(props)
const { carouselIndex } = useBlockContext(props.contextCode);
// features
const useClone = computed<boolean>(() => features.value.includes('clone'));
const useCount = computed<boolean>(() => features.value.includes('count'));
const useControl = computed<boolean>(() => features.value.includes('control'));
const usePagination = computed<boolean>(() => features.value.includes('pagination'));
const useCustomPagination = computed<boolean>(() => features.value.includes('customPagination'));
const useCustomCount = computed<boolean>(() => features.value.includes('customCount'));
/** //VARIABLE */

/** VUE LIFE CYCLE */
onMounted(() => {
    const carouselUi = ref<Carousel>();
    // set carousel index 
    carouselData.value._index = carouselIndex.value;
    // onComplete에 context update 추가
    const onComplete = carouselData.value.onComplete;
    carouselData.value.onComplete = (carousel: { ui: Carousel, _isBack: boolean }) => {
        if (onComplete instanceof Function) {
            onComplete(carousel);
        }

        carouselIndex.value = carousel.ui.index
    };

    // 캐러셀 update
    if (carouselElement.value && items.value.length > 0) {
        carouselUi.value = carouselUpdate(carouselElement.value, carouselData.value)[0]
        isCarouselUpdated.value = true
    }
    watch(
        [items, carouselElement],
        ([nowItems, nowCarouselElement], [prevItems]) => {
            if (nowCarouselElement === null) {
                return
            }
            if (nowItems.length !== prevItems.length && isCarouselUpdated.value) {
                return carouselReload(nowCarouselElement)
            }
            carouselUpdate(nowCarouselElement, carouselData.value)
            isCarouselUpdated.value = true
        },
        {
            flush: 'post',
        },
    )
    watch(requireResize, (to) => {
        setTimeout(() => {
            if (to && carouselElement.value) {
                carouselResize(carouselElement.value);
            }
        }, 100);
    })

    watch(requireIndexReset, (to) => {
        if (to && carouselElement.value) {
            carouselUi.value?.change(0);
        }
    })

});
/** VUE LIFE CYCLE */
</script>