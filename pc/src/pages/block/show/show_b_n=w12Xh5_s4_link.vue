<template>
    <MMBlock
        :block-name="'show_b_n=w12Xh5_s4_link'"
        :required="{
            requiredValueList: [block.bannerPartition?.banners, block.title1, block.title2]
        }"
    >
        <MMTitle :title1="block.title1" :title2="block.title2" :design-class-name="block.designTitleClassName" />
        <div class="mui_inner">
            <ul>
                <li v-for="banner in block.bannerPartition?.banners" :key="banner.id">
                    <MMBanner :banner="banner" :banner-image-class="'mui_bg-cover'" />
                </li>
            </ul>
            <MMBlockLink :link="block?.link || ''" :label="'전체보기'" />
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import { toRefs } from 'vue'
import MMBlock from '@/components/block/Block.vue'
import MMBanner from '@/components/block/Banner.vue'
import MMBlockLink from '@/components/block/Link.vue'
import MMTitle from '@/components/block/Title.vue'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)
</script>
<style>
@import '@publish/css/block/specific/show_b_n=w12Xh5_s4_link.css';
</style>
