<template>
    <MMBlock 
        :block-name="'b_n=w12Xh3_s1_1'"
        :required="{
            requiredValueList: [banner, block.title1, block.title2],
        }"
    >
        <MMTitle :title1="block.title1" :title2="block.title2" :design-class-name="block.designTitleClassName" />
        <MMBanner v-if="banner" :banner="banner" :banner-image-class="'mui_bg-cover'" />
    </MMBlock>
</template>

<script setup lang='ts'>
import { Block } from "$/@type/block"
import { Banner } from "$/@type/block/item";
import MMBanner from '@/components/block/Banner.vue';
import MMBlock from "@/components/block/Block.vue";
import MMTitle from '@/components/block/Title.vue'
import { computed, toRefs } from "vue";

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props)
const banner = computed<Banner | null>(() => {
    return (block.value.bannerPartition?.banners || [])[0] || null
})
</script>
<style>
@import '@publish/css/block/normal/b_n=w12Xh3_s1_1.css';
</style>
