<template>
    <MMBlock
        block-name="rank_p_c=w0Xh10_s5_link"
        :required="{
            requiredValueList: [block.goodsGroup?.goodsList, block.title1, block.title2]
        }"
    >
        <div class="mui_inner">
            <MMTitle 
                :title1="block.title1"
                :title2="block.title2"
                :design-class-name="block.designTitleClassName"
            />
            <MMCarousel 
                :context-code="`${block.id}_${block.name}`"
                :items="chunk(block.goodsGroup?.goodsList || [], 5)"
                :features="[
                    'control',
                    'count'
                ]"
                :carousel-data="{
                    _autoDelay: 4,
                    _isAutoHeight: true
                }"
            >
                <template #item="{ item }">
                    <div class="mui_product-list">
                        <ol>
                            <li v-for="goods in item" :key="goods.id">
                                <div class="mui_product-item">
                                    <MMRankingGoods 
                                        :goods="goods"
                                        :has-range="block.rankHasRange"
                                        :use-badges="true"
                                    />
                                </div>
                            </li>
                        </ol>
                    </div>
                </template>
            </MMCarousel>
            <MMBlockLink :link="block.link || ''" :label="'랭킹 상품 더보기'" />
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import { toRefs } from 'vue'
import MMBlock from '@/components/block/Block.vue'
import MMRankingGoods from '@/components/block/special/RankingGoods.vue'
import MMCarousel from '@/components/block/Carousel.vue'
import MMBlockLink from '@/components/block/Link.vue'
import MMTitle from '@/components/block/Title.vue'
import { chunk } from '$/functions'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)

</script>

<style>
@import '@publish/css/block/specific/rank_p_c=w0Xh10_s5_link.css';
</style>