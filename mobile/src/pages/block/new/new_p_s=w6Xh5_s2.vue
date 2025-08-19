<template>
    <MMBlock
        :block-name="'new_p_s=w6Xh5_s2'"
        :required="{
            requiredValueList: [block.goodsGroup?.goodsList, block.title1, block.title2]
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <MMScrollSlider :context-code="`${block.id}_${block.name}`">
            <div class="mui_product-list">
                <ul>
                    <li v-for="goods in block.goodsGroup?.goodsList" :key="goods.id">
                        <MMBlockGoods :goods="goods" :use-liked-button="true" :use-react-tag="true" :use-badges="true" />
                    </li>
                </ul>
            </div>
        </MMScrollSlider>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import { toRefs } from 'vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import MMScrollSlider from '@/components/block/ScrollSlider.vue'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)

</script>
<style>
@import '@publish/css/block/feature/new_p_s=w6Xh5_s2.css';
</style>
