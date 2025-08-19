<template>
    <MMBlock
        :block-name="'b_c=w12Xh4_s2'"
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
            :items="chunk(block.bannerPartition?.banners || [], 2)"
            :features="[
                'pagination'
            ]"
            :carousel-data="{
                _autoDelay: 0,
                _effect: 'fade'
            }"
        >
            <template #item="{ item }">
                <ul class="mui_flex T=equal">
                    <li v-for="banner in item" :key="banner.id">
                        <MMBanner :banner="banner" :banner-image-class="'mui_bg-cover'" />
                    </li>
                </ul>
            </template>
        </MMCarousel>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMBanner from '@/components/block/Banner.vue'
import MMCarousel from '@/components/block/Carousel.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import { chunk } from '$/functions'
import { toRefs } from 'vue'

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props)

</script>
<style>
@import '@publish/css/block/normal/b_c=w12Xh4_s2.css';
</style>
