<template>
    <div class="m_main">
        <MMPage :containers="containers" :page-name="pageName" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { blockRepository } from '$/repository/blockRepository'
import { Container } from '$/@type/block'
import { usePageTitleSetting } from '$/composables/seoComposable';
import { BLOCK_PAGE_NAME } from '$/constants';
import { useMainView } from '$/composables/marketingComposable';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        containers: Container[]
    }
}
export default defineComponent({
    components: {
        MMPage: defineAsyncComponent(() => import('@/components/block/Page.vue')),
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const containers = await blockRepository.getPage(BLOCK_PAGE_NAME.MAIN)
            next(vm => {
                vm.containers = containers
            })
        } catch (e) {
            next();

        }        
    },
    emits: ['snsSharedToggle'],
    setup() {
        usePageTitleSetting();
        useMainView();
        const containers = ref<Container[]>([])
        const pageName = BLOCK_PAGE_NAME.MAIN

        return {
            containers,
            pageName,
        }
    }
})
</script>
