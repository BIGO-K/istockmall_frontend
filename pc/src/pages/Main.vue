<template>
    <div class="mm_page-content">
        <MMPage :containers="containers" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MMPage from '@/components/block/Page.vue'
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
        MMPage,
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const containers = await blockRepository.getPage(BLOCK_PAGE_NAME.MAIN)
            next(vm => {
                vm.containers = containers
            })
        } catch (e) {
            next(vm => {
                vm.containers = [];
            })
        }
    },
    setup() {
        usePageTitleSetting();
        useMainView();
        const containers = ref<Container[]>([]);

        return {
            containers,
        }
    }
})
</script>
