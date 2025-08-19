<template>
    <MMBlock
        :block-name="'bp_ns=w12Xh8_s4_link_1'"
        :required="{
            requiredValueList: [block.title1, block.title2, banner, banner?.goodsGroup?.goodsList],
        }"
    >
        <MMTitle :title1="block.title1" :title2="block.title2" :design-class-name="block.designTitleClassName" />
        <div class="mui_inner">
            <!-- 배너 -->
            <MMBanner v-if="banner" :banner="banner" :banner-image-class="'mui_bg-cover'" />
            <!--// 배너 -->
            <!-- 상품 -->
            <div class="mui_product-list">
                <MMSlider 
                    :context-code="`${block.id}_${block.name}`"
                    :items="banner?.goodsGroup?.goodsList"
                    :use-control="true"
                >
                    <template #item="{ item }">
                        <MMBlockGoods :goods="item" :is-show-price="false" :use-liked-button="true" :use-badges="true" />
                    </template>
                </MMSlider>
            </div>
            <!--// 상품 -->
        </div>
        <MMBlockLink :link="block?.link || ''" :label="'더보기'" />
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMBanner from '@/components/block/Banner.vue'
import MMSlider from '@/components/block/Slider.vue'
import MMBlock from '@/components/block/Block.vue'
import MMBlockLink from '@/components/block/Link.vue'
import MMTitle from '@/components/block/Title.vue'
import { computed, toRefs } from 'vue'
import { Banner } from '$/@type/block/item'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)
const banner = computed<Banner | null>(() => {
    return (block.value.bannerPartition?.banners || [])[0] || null
})

</script>
<style>
@import '@publish/css/block/normal/bp_ns=w12Xh8_s4_link_1.css';
</style>
