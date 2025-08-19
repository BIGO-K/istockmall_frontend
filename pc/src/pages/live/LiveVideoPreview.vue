<template>
    <video
        :src="previewUrl"
        autoplay
        muted 
        @loadeddata="handleLoaded" 
        @ended="handleEnd"
    />
</template>

<script setup lang='ts'>
import { toRefs } from 'vue';
const props = defineProps<{
    previewUrl: string
}>();

/** VARIABLE */
const { previewUrl } = toRefs(props);

/** FUNCTION */
function handleLoaded(event: Event) {
    const target = event.target;
    if (target) {
        (target as HTMLElement).classList.add('S=loaded');
    }
}

function handleEnd(event: Event) {
    const target = event.target;

    if (target) {
        (target as HTMLMediaElement).play();
    }
}
/** VUE LIFE CYCLE */

</script>