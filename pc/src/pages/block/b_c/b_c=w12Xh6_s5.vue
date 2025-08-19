<template>
    <MMBlock
        :block-name="'b_c=w12Xh6_s5'"
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
            :items="chunk(block.bannerPartition?.banners || [], 5)"
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
                            :show-created-at="true"
                            :date-text-position="2"
                            :date-format="'D MMM Y'"
                        >
                            <template #text-detail>
                                <p class="text_detail">
                                    VIEW MORE<i class="uico_link" />
                                </p>
                            </template>
                        </MMBanner>
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
@import '@publish/css/block/normal/b_c=w12Xh6_s5.css';
</style>
