<template>
    <MMBlock
        block-name="b_n=w6Xh47_s6"
        :required="{
            requiredValueList: [block.bannerPartition?.banners, block.title1, block.title2],
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <ul>
            <li v-for="banner in block.bannerPartition?.banners" :key="banner.id">
                <MMBanner :banner="banner" />
            </li>
        </ul>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMBanner from '@/components/block/Banner.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import { toRefs } from 'vue'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props);

</script>
<style>
@import '@publish/css/block/basic/b_n=w6Xh47_s6.css';
</style>
