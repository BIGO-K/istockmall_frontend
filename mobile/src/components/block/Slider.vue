<template>
    <div ref="sliderElement" class="mui_slider S=ready" data-slider="{ '_isLoop': false }">
        <div class="mui_slider-inner">
            <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
            <ul class="mui_slider-list">
                <li v-for="(item, index) in items" :key="index" :class="itemClass">
                    <slot name="item" :item="item" :index="index" />
                </li>
                <div v-if="useControl" class="mui_slider-control">
                    <button type="button" class="btn_slider-prev" @click="sliderIndexChange(false)">
                        <i :class="['uico_control-prev', { 'T=sm': useControlSmallIcon }]" />
                        <b class="mui_ir-blind">이전</b>
                    </button>
                    <button type="button" class="btn_slider-next" @click="sliderIndexChange(true)">
                        <i :class="['uico_control-next', { 'T=sm': useControlSmallIcon }]" />
                        <b class="mui_ir-blind">다음</b>
                    </button>
                </div>
                <div v-if="useCount" class="mui_slider-count">
                    <strong class="text_slider-index">{{ sliderIndex }}</strong>
                    <span class="text_slider-total">{{ sliderLastIndex }}</span>
                </div>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useBlockContext } from '$/composables/blockComposable';
import { Slider } from '@/assets/publish/src/script/ui/sliders';
import { sliderUpdate, sliderReload } from '@/customMotion';
import { computed, onMounted, ref, toRefs, watch } from 'vue';
/** VARIABLE */
const props = withDefaults(defineProps<{
    contextCode: string;
    items: any[];
    itemAdditionalClass?: string;
    useCount?: boolean;
    useControl?: boolean;
    useControlSmallIcon?: boolean;
}>(), {
    contextCode: '',
    items: () => [],
    itemAdditionalClass: '',
    useCount: false,
    useControl: false,
    useControlSmallIcon: false,
});

const { items, itemAdditionalClass } = toRefs(props)
const itemClass = computed(() => 'mui_slider-item ' + itemAdditionalClass.value);
const isSliderUpdated = ref(false)
const sliderElement = ref<HTMLElement | null>(null)

// 슬라이더 INDEX 컨트롤 관련 변수
const { sliderIndex: sliderPreviousIndex } = useBlockContext(props.contextCode);
const sliderIndex = ref(1)
const sliderLastIndex = ref<number>(0)
const sliderData = ref<SliderData>({});
/** //VARIABLE */

/** FUNCTION */
function sliderIndexChange(isNext: boolean) {
    if (isNext) {
        if (sliderIndex.value === sliderLastIndex.value) {
            return (sliderIndex.value = 1)
        }

        return (sliderIndex.value = sliderIndex.value + 1)
    }

    if (sliderIndex.value === 1) {
        return (sliderIndex.value = sliderLastIndex.value)
    }

    sliderIndex.value = sliderIndex.value - 1
}
/** //FUNCTION */

/** VUE LIFE CYCLE */
onMounted(() => {
    sliderLastIndex.value = (Number((items.value.length / 2).toFixed()));
    sliderData.value._index = sliderPreviousIndex.value;
    sliderData.value.onComplete = (slider: { ui: Slider }) => {
        sliderPreviousIndex.value = slider.ui.index 
    }
    setTimeout(() => {
        if (sliderElement.value == null || items.value.length < 0) {
            return;
        }

        sliderUpdate(sliderElement.value, sliderData.value)[0];
        isSliderUpdated.value = true;
    }, 10);

    watch(
        [items, sliderElement], 
        ([nowItems, sliderEl], [prevItems]) => {
            if (sliderEl === null) {
                return;
            }
            if (nowItems.length !== prevItems.length && isSliderUpdated.value) {       
                return sliderReload(sliderEl);
            } 
                    
            setTimeout(() => {
                sliderUpdate(sliderEl);
                isSliderUpdated.value = true;
            }, 10);
        }, 
        {
            flush: 'post'
        }
    )
});
</script>
