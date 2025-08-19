<template>
    <keep-alive>
        <footer id="mm_footer" ref="footerElement" class="mm_footer" :class="footerType === 'A' ? 'T=fa' : 'T=fb'">
            <FooterA v-if="footerType === 'A'" />
            <FooterB v-else />
        </footer>
    </keep-alive>
</template>

<script setup lang="ts">
import { InitialSettings } from '$/@type/configs';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { ref, defineAsyncComponent } from 'vue'

const FooterA = defineAsyncComponent(() => import('@/components/footer/FooterA.vue'));
const FooterB = defineAsyncComponent(() => import('@/components/footer/FooterB.vue'));
const { globalConfigs } = useGlobalConfigs();
const footerElement = ref<HTMLElement|null>(null)
const footerType = ref<InitialSettings['design']['footerType']>(globalConfigs.value.design.footerType);
</script>