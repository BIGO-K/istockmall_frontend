<template>
    <MMBlock
        :block-name="'b_c=w0Xh8_s1_side_1'"
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
            :features="[
                'control',
                'pagination'
            ]"
            :carousel-data="{
                _autoDelay: 4,
            }"
        >
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

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)

</script>
<style>
@import '@publish/css/block/normal/b_c=w0Xh8_s1_side_1.css';
</style>
