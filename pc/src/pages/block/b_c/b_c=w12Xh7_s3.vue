<template>
    <MMBlock
        :block-name="'b_c=w12Xh7_s3'"
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
            :items="chunk(block.bannerPartition?.banners || [], block.bannerPartition?.perPage || 3)"
            :features="[
                'pagination'
            ]"
            :carousel-data="{
                _autoDelay: 4,
                _isAutoHeight: true,
            }"
        >
            <template #item="{ item }">
                <ul>
                    <li v-for="banner in item" :key="banner.id">
                        <MMBanner 
                            :banner="banner" 
                            :banner-image-class="'mui_bg-cover'" 
                        />
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

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)

</script>
<style>
@import '@publish/css/block/normal/b_c=w12Xh7_s3.css';
</style>
