<template>
    <div ref="sliderElement" class="mm_slider" data-slider>
        <div class="mm_slider-inner" :style="{ textAlign: styleTextAlign }">
            <ul class="mm_slider-list">
                <slot
                    v-if="additionalIsFirst"
                    name="additionalItem"
                />
                <li
                    v-for="item, index in items"
                    :key="index"                    
                    :class="itemClass"
                >
                    <slot
                        name="item"
                        :item="item"
                    />
                </li>
                <slot
                    v-if="!additionalIsFirst"
                    name="additionalItem"
                />
            </ul>
        </div>
        <slot name="sliderCommonContent" />
        <div
            v-if="useControl"
            class="mm_slider-control"
        >
            <button
                type="button"
                class="btn_slider-prev"
            >
                <i :class="['ico_control-prev', { 'T=sm' : useControlSmallIcon }]" />
                <b class="mm_ir-blind">이전</b>
            </button>
            <button
                type="button"
                class="btn_slider-next"
            >
                <i :class="['ico_control-next', { 'T=sm' : useControlSmallIcon }]" />
                <b class="mm_ir-blind">다음</b>
            </button>
        </div>
        <div
            v-if="useCount"
            class="mm_slider-count"
        >
            <strong class="text_slider-index">{{ currentIndex }}</strong>
            <span class="text_slider-total">{{ lastIndex }}</span>
        </div>
        <div v-if="usePagination" class="mm_slider-pagination">
            <ol>
                <li v-for="i in useManageItem ? items.length + 1 : items.length" :key="i">
                    <button type="button" class="btn_slider-page">
                        <b class="mm_ir-blind">{{ i }}</b>
                    </button>
                </li>
            </ol>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Slider } from '@/assets/publish/src/script/ui/sliders';
import { sliderUpdate } from '@/customMotion'
import { toRefs, onMounted, ref, computed, watch } from 'vue';

const props = withDefaults(defineProps<{
    items: unknown[],
    useCount?: boolean,
    usePagination?: boolean,
    itemAdditionalClass?: string,
    useControl?: boolean,
    useControlSmallIcon?: boolean,
    additionalIsFirst?: boolean,
    sliderData?: SliderData,
    styleTextAlign?: "center" | "end" | "justify" | "left" | "match-parent" | "right" | "start",
    useManageItem?: boolean
}>(), {
    useCount: false,
    usePagination: false,
    itemAdditionalClass: '',
    useControl: true,
    useControlSmallIcon: false,
    additionalIsFirst: true,
    styleTextAlign: 'center',
    useManageItem: false,
    sliderData: () => { return {} }
});

const sliderElement = ref<HTMLElement|null>(null)

const { items, itemAdditionalClass, sliderData, styleTextAlign, usePagination, useManageItem } = toRefs(props)

const currentIndex = ref(1);
const lastIndex = ref<number>(0);

const itemClass = computed(() => {
    return 'mm_slider-item ' + itemAdditionalClass.value
})

const sliderUi = ref<Slider>()

onMounted(() => {
    lastIndex.value = items.value.length
    setTimeout(() => {
        if (sliderElement.value !== null && items.value.length > 0) {
            // // sliderData.value.onIntersecting = changeControlBtnNumber
            sliderUi.value = sliderUpdate(sliderElement.value, sliderData.value)[0]
        }
    }, 100)

    watch(
        [items, sliderElement],
        ([nowItems, nowSliderElement], [prevItems]) => {
            if (nowSliderElement === null) {
                return
            }
                    
            if (nowItems.length !== prevItems.length && sliderUi.value !== undefined) {
                sliderUi.value.destroy()
            }

            sliderUi.value = sliderUpdate(nowSliderElement, sliderData.value)[0]
        },
        {
            flush: 'post'
        }
    )
})
/**
 * 슬라이더 아이템 변경시 하단에 컨트롤 버튼 숫자 변경 ex) < 1 / 4 >
 *
 * @param {ui: Slider}: slider
 */
function changeControlBtnNumber(slider: { ui: Slider }) {
    const liElements = slider.ui.$element.querySelectorAll("li[class*='S=on']")
    if (items.value.length === 0) {
        return
    }

    currentIndex.value = liElements.length === 1
        ? Number(liElements[0].getAttribute('data-_slider-index')) || items.value.length
        : slider.ui.realIndex + 1
    lastIndex.value = items.value.length
}
</script>