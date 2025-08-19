<template>
    <MMBlock
        block-name="bp_ns=w6Xh14_s3_link_1"
        :required="{
            requiredValueList: [block.title1, block.title2, banner, banner?.goodsGroup?.goodsList],
        }"
    >
        <!-- 타이틀 -->
        <!-- (D) '디자인 타이틀 사용' 선택 시 mui_title에 'T=design' 클래스를 추가합니다. -->
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <!--// 타이틀 -->
        <!-- 배너 -->
        <MMBanner v-if="banner" :banner="banner" />
        <!--// 배너 -->
        <!-- 상품 -->
        <MMScrollSlider :context-code="`${block.id}_${block.name}`">
            <div class="mui_product-list">
                <ul>
                    <li v-for="goods in banner?.goodsGroup?.goodsList" :key="goods.id">
                        <MMBlockGoods :goods="goods" :use-liked-button="true" :is-show-price="false" :use-badges="true" />
                    </li>
                </ul>
            </div>
        </MMScrollSlider>
        <MMBlockLink :link="block?.link || ''" :label="'더보기'" />
    <!--// 상품 -->
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMBanner from '@/components/block/Banner.vue'
import MMBlock from '@/components/block/Block.vue'
import MMBlockLink from '@/components/block/Link.vue'
import MMTitle from '@/components/block/Title.vue'
import MMScrollSlider from '@/components/block/ScrollSlider.vue'
import { computed, toRefs } from 'vue'
import { Banner } from '$/@type/block/item'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)
const banner = computed<Banner | null>(() => {
    return (block.value.bannerPartition?.banners || [])[0] || null
})

</script>
<style>
@import '@publish/css/block/basic/bp_ns=w6Xh14_s3_link_1.css';
</style>
