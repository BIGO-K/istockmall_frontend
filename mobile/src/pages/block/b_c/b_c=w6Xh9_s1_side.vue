<template>
    <MMBlock
        :block-name="'b_c=w6Xh9_s1_side'"
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
                'pagination'
            ]"
            :carousel-data="{
                _autoDelay: 4,
                _isAutoHeight: true,
                _isMoreSide: true,
            }"
        >
            <template #item="{ item }">
                <MMBanner :banner="item" :show-created-at="true" :date-format="'D MMM Y'" :date-text-position="2" />
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

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props)

</script>
<style>
@import '@publish/css/block/basic/b_c=w6Xh9_s1_side.css';
</style>
