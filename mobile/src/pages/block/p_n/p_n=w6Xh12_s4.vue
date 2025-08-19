<template>
    <MMBlock
        :block-name="'p_n=w6Xh12_s4'"
        :required="{
            requiredValueList: [block.goodsGroup?.goodsList, block.title1, block.title2],
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <div class="mui_product-list">
            <ul>
                <li v-for="goods in block.goodsGroup?.goodsList" :key="goods.id">
                    <MMBlockGoods :goods="goods" :use-liked-button="true" :is-show-price="false" />
                </li>
            </ul>
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import { toRefs } from 'vue'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)

</script>
<style>
@import '@publish/css/block/basic/p_n=w6Xh12_s4.css';
</style>
