<template>
    <div 
        ref="sliderScroller"
        class="mui_scroller T=x"
        @touchend.passive="sliderScrollPosition = sliderScroller?.scrollLeft || 0"
    >
        <slot />
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { applyPosition } from '$/functions'
import { useBlockContext } from '$/composables/blockComposable'

const props = defineProps<{ contextCode: string }>()
const sliderScroller = ref<HTMLElement|null>(null);
const { sliderScrollPosition } = useBlockContext(props.contextCode)

onMounted(() => {
    applyPosition(
        sliderScroller.value, 
        sliderScrollPosition.value, 
        'horizontal'
    );
});
</script>