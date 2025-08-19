<template>
    <MMBlock
        :block-name="'b_c=w6Xh10_s1_pager_2'"
        :required="{
            requiredValueList: [block.bannerPartition?.banners, block.title1, block.title2],
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <MMCarousel
            :context-code="`${block.id}_${block.name}`"
            :items="block.bannerPartition?.banners"
            :is-force-update="true" 
            :features="[
                'customCount'
            ]"
            :carousel-data="{
                _autoDelay: 4,
                _effect: 'strip'
            }"
        >
            <template #count>
                <a 
                    href="#BLOCK_BANNER_LIST"
                    @click.capture="setBannersPopup('b_c=w6Xh10_s1_pager_2', '기획전 전체보기', (block.bannerPartition?.banners || []))"
                >
                    <strong class="text_carousel-index" /><i>/</i><span class="text_carousel-total" /><i class="uico_plus" />
                </a>
            </template>
            <template #item="{ item }">
                <MMBanner :banner="item" />
            </template>
        </MMCarousel>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMCarousel from '@/components/block/Carousel.vue'
import MMBanner from '@/components/block/Banner.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import { toRefs } from 'vue'
import { useBannersPopup } from '$/composables/blockComposable'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)
const { setBannersPopup } = useBannersPopup();

</script>
<style>
@import '@publish/css/block/basic/b_c=w6Xh10_s1_pager_2.css';
</style>
