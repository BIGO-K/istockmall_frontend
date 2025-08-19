<template>
    <MMBlock
        :block-name="'bp_nn=w6Xh23_s5_more'"
        :required="{
            requiredValueList: [
                block.bannerPartition?.banners, 
                block.goodsGroup?.goodsList, 
                block.title1, 
                block.title2
            ],
        }"
        :class="isShowMore ? 'S=switch-on' : ''"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <!-- 배너 -->
        <MMBanner
            v-if="banner"
            :banner="banner"
            :use-link-icon="true"
        />
        <!--// 배너 -->
        <!-- 상품 -->
        <div class="mui_product-list">
            <ul>
                <li v-for="goods in block.goodsGroup?.goodsList" :key="goods.id">
                    <MMBlockGoods 
                        :goods="goods"
                        :use-badges="true"
                        :use-react-tag="true"
                        :use-liked-button="true"
                        :is-show-price="true"
                    />
                </li>
            </ul>
        </div>
        <!-- (D) 등록된 상품이 5개 이상일 경우 노출합니다. -->
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
    <!--// 상품 -->
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMBanner from '@/components/block/Banner.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import { computed, toRefs } from 'vue'
import { Banner } from '$/@type/block/item'
import { useMoreButton } from '$/composables/blockComposable'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)
const banner = computed<Banner | null>(() => {
    return (block.value.bannerPartition?.banners || [])[0] || null
});

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
@import '@publish/css/block/basic/bp_nn=w6Xh23_s5_more.css';
</style>
