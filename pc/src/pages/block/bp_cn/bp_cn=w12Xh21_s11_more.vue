<template>
    <MMBlock
        :block-name="'bp_cn=w12Xh21_s11_more'"
        :required="{
            requiredValueList: [ block.bannerPartition?.banners, block.goodsGroup?.goodsList, block.title1, block.title2 ]
        }"
        :class="isShowMore ? 'S=switch-on' : ''"
    >
        <MMTitle :title1="block.title1" :title2="block.title2" :design-class-name="block.designTitleClassName" />
        <!-- 배너 -->
        <template v-if="block.bannerPartition">
            <MMCarousel
                :context-code="`${block.id}_${block.name}`"
                :items="block.bannerPartition.banners"
                :features="[
                    'control',
                    'pagination'
                ]"
                :carousel-data="{
                    _autoDelay: 4,
                    _effect: 'fade'
                }"
            >
                <template #item="{ item }">
                    <MMBanner :banner="item" :banner-image-class="'mui_bg-cover'" />
                </template>
            </MMCarousel>
        </template>
        <!--// 배너 -->
        <template v-if="block.goodsGroup">
            <!-- 상품 -->
            <div class="mui_product-list">
                <ul>
                    <li v-for="goods in block.goodsGroup.goodsList" :key="goods.id">
                        <MMBlockGoods :goods="goods" :use-react-tag="true" :use-liked-button="true" :use-badges="true" />
                    </li>
                </ul>
            </div>
            <!--// 상품 -->
            <!-- (D) 등록된 상품이 11개 이상일 경우 노출합니다. -->
            <button 
                v-if="showButton"
                type="button"
                class="btn_more"
                data-switch
                :title="buttonTitle"
                @click="toggleShowMore"
            >
                <i class="uico_more" />
            </button>
        </template>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMBanner from '@/components/block/Banner.vue'
import MMCarousel from '@/components/block/Carousel.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import { toRefs } from 'vue'
import { useMoreButton } from '$/composables/blockComposable'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)
const { 
    isShowMore, 
    buttonTitle, 
    showButton,
    toggle: toggleShowMore 
} = useMoreButton(
    `${block.value.id}_${block.value.name}`,
    { target: block.value.goodsGroup }
);
</script>
<style>
@import '@publish/css/block/normal/bp_cn=w12Xh21_s11_more.css';
</style>
