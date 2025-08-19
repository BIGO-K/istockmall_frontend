<template>
    <MMBlock
        :block-name="'p_s=w8Xh6_s3'"
        :required="{
            requiredValueList: [block.goodsGroup?.goodsList, block.title1, block.title2]
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <MMSlider 
            :context-code="`${block.id}_${block.name}`"
            :items="block.goodsGroup?.goodsList"
            :use-control="true"
        >
            <template #item="{ item }">
                <MMBlockGoods :goods="item" :is-show-price="false" :use-liked-button="true" />
            </template>
        </MMSlider>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMSlider from '@/components/block/Slider.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import { toRefs } from 'vue';

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props);

</script>
<style>
@import '@publish/css/block/normal/p_s=w8Xh6_s3.css';
</style>
