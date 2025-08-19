<template>
    <MMBlock
        block-name="bp_ns=w6Xh14_s6"
        :required="{
            requiredValueList: [block.bannerPartition?.banners, block.title1, block.title2],
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
        <ul>
            <li v-for="banner in block.bannerPartition?.banners" :key="banner.id">
                <!-- 배너 -->
                <MMBanner v-if="banner" :banner="banner" />
                <!--// 배너 -->
                <!-- 상품 -->
                <MMScrollSlider :context-code="`${block.id}_${block.name}_${banner.id}`">
                    <div class="mui_product-list">
                        <ul>
                            <li v-for="goods in banner?.goodsGroup?.goodsList" :key="goods.id">
                                <MMBlockGoods :goods="goods" :use-liked-button="true" :is-show-price="false" :use-badges="true" />
                            </li>
                        </ul>
                    </div>
                </MMScrollSlider>
                <!--// 상품 -->
            </li>
        </ul>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMBanner from '@/components/block/Banner.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import MMScrollSlider from '@/components/block/ScrollSlider.vue'
import { toRefs } from 'vue'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)

</script>
<style>
@import '@publish/css/block/basic/bp_ns=w6Xh14_s6.css';
</style>
