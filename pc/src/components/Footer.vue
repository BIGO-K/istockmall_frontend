<template>
    <component :is="footerComponent" />    
</template>


<script setup lang='ts'>
import { defineAsyncComponent, computed } from 'vue'
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
/** VARIABLE */
const { globalConfigs } = useGlobalConfigs()
const footerComponent = computed(() => {
    if (globalConfigs.value.design.footerType) {
        return defineAsyncComponent(() => import('@/components/footer/FooterA.vue'))
    } else {
        return defineAsyncComponent(() => import('@/components/footer/FooterB.vue'))
    }
})
/** FUNCTION */

/** VUE LIFE CYCLE */
</script>
