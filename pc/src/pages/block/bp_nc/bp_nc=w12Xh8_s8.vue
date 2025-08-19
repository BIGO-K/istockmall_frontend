<template>
    <MMBlock
        :block-name="'bp_nc=w12Xh8_s8'"
        :required="{
            requiredValueList: [ block.bannerPartition?.banners, block.title1, block.title2 ]
        }"
        :class="isShowMore ? 'S=switch-on' : ''"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <div v-if="leftBanner" class="mui_lside">
            <!-- 배너 -->
            <MMBanner :banner="leftBanner" :banner-image-class="'mui_bg-cover'" />
            <!--// 배너 -->

            <!-- 상품 -->
            <MMCarousel
                :context-code="`${block.id}_${block.name}_left`"
                :items="chunk(leftBanner.goodsGroup?.goodsList || [], leftBanner.goodsGroup?.perPage || 3)" 
                :features="[
                    'pagination'
                ]"
                :carousel-data="{
                    _autoDelay: 4,
                    _isAutoHeight: true
                }"
            >
                <template #item="{ item }">
                    <div class="mui_product-list">
                        <ul>
                            <li v-for="goods in item" :key="goods.id">
                                <MMBlockGoods 
                                    :goods="goods"
                                    :is-show-price="false"
                                    :use-liked-button="true"
                                    :use-badges="true"
                                    :use-react-tag="true"
                                />
                            </li>
                        </ul>
                    </div>
                </template>
            </MMCarousel>
            <!--// 상품 -->
        </div>
        <div v-if="rightBanner" class="mui_rside">
            <!-- 배너 -->
            <MMBanner :banner="rightBanner" :banner-image-class="'mui_bg-cover'" />
            <!--// 배너 -->

            <!-- 상품 -->
            <MMCarousel  
                :context-code="`${block.id}_${block.name}_right`"
                :items="chunk(rightBanner.goodsGroup?.goodsList || [], rightBanner.goodsGroup?.perPage || 3)" 
                :features="[
                    'control',
                    'pagination'
                ]"
                :carousel-data="{
                    _autoDelay: 4,
                    _isAutoHeight: true
                }"
            >
                <template #item="{ item }">
                    <div class="mui_product-list">
                        <ul>
                            <li v-for="goods in item" :key="goods.id">
                                <MMBlockGoods 
                                    :goods="goods"
                                    :is-show-price="false"
                                    :use-liked-button="true"
                                    :use-badges="true"
                                    :use-react-tag="true"
                                />
                            </li>
                        </ul>
                    </div>
                </template>
            </MMCarousel>
            <!--// 상품 -->
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMBanner from '@/components/block/Banner.vue'
import MMCarousel from '@/components/block/Carousel.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import { computed, ref, toRefs } from 'vue'
import { Banner } from '$/@type/block/item'
import { chunk } from "$/functions"

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)
const isShowMore = ref<boolean>(false);

const leftBanner = computed<Banner | null>(() => {
    return (block.value.bannerPartition?.banners || [])[0] || null
})

const rightBanner = computed<Banner | null>(() => {
    return (block.value.bannerPartition?.banners || [])[1] || null
})

</script>
<style>
@import '@publish/css/block/normal/bp_nc=w12Xh8_s8.css';
</style>
