<template>
    <MMBlock
        :block-name="'b_c=w6Xh6_s2'"
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
            :items="chunk(block.bannerPartition?.banners || [], block.bannerPartition?.perPage || 2)"
            :is-force-update="true" 
            :features="[
                'pagination'
            ]"
            :carousel-data="{
                _autoDelay: 4,
                _effect: 'fade'
            }"
        >
            <template #item="{ item }">
                <ul>
                    <li v-for="banner in item" :key="banner.id">
                        <MMBanner :banner="banner" />
                    </li>
                </ul>
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
import { chunk } from '$/functions'

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props)

</script>
<style>
@import '@publish/css/block/basic/b_c=w6Xh6_s2.css';
</style>
