<template>
    <MMBlock
        :block-name="'p_n=w12Xh6_s4'"
        :required="{
            requiredValueList: [block.goodsGroup?.goodsList, block.title1, block.title2]
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
                    <MMBlockGoods 
                        :goods="goods"
                        :use-liked-button="true"
                        :use-react-tag="true"
                        :use-badges="true"
                    />
                </li>
            </ul>
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from "$/@type/block"
import MMBlock from "@/components/block/Block.vue";
import MMTitle from '@/components/block/Title.vue'
import { toRefs } from "vue";

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props);

</script>
<style>
    @import "@publish/css/block/normal/p_n=w12Xh6_s4.css";
</style>