<template>
    <MMBlock
        :block-name="'p_c=w12Xh6_s5'"
        :required="{
            requiredValueList: [block.goodsGroup?.goodsList, block.title1, block.title2]
        }"
    >
        <MMTitle :title1="block.title1" :title2="block.title2" :design-class-name="block.designTitleClassName" />
        <!-- 상품 -->
        <MMCarousel 
            :context-code="`${block.id}_${block.name}`"
            :items="chunk(block.goodsGroup?.goodsList || [], block.goodsGroup?.perPage || 5)"
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
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from "$/@type/block"
import MMBlock from "@/components/block/Block.vue";
import MMTitle from '@/components/block/Title.vue'
import MMCarousel from '@/components/block/Carousel.vue'
import { toRefs } from "vue";
import { chunk } from "$/functions"

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props);

</script>
<style>
    @import "@publish/css/block/normal/p_c=w12Xh6_s5.css";
</style>