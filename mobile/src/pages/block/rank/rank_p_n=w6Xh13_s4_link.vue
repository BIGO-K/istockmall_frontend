<template>
    <MMBlock
        :block-name="'rank_p_n=w6Xh13_s4_link'"
        :required="{
            requiredValueList: [block.goodsGroup?.goodsList, block.title1, block.title2],
        }"
    >
        <MMTitle :title1="block.title1" :title2="block.title2" :design-class-name="block.designTitleClassName" />
        <div class="mui_product-list">
            <ol>
                <li v-for="(goods, index) in block.goodsGroup?.goodsList" :key="goods.id">
                    <p class="text_rank">
                        <strong>{{ index + 1 }}</strong>
                        {{ getRankSuffix(index + 1) }}
                    </p>
                    <MMRankingGoods :goods="goods">
                        <figure>
                            <i
                                v-lazyload="{ src: goods.thumbnailUrl }"
                                class="mui_bg-cover image_rank"
                                :data-lazyload="`{ '_src': '${goods.thumbnailUrl}' }`"
                            />
                            <figcaption>
                                <p class="text_brand">
                                    {{ goods.brandName }}
                                </p>
                                <p class="text_product">
                                    {{ goods.name }}
                                </p>
                            </figcaption>
                        </figure>
                    </MMRankingGoods>
                </li>
            </ol>
        </div>
        <MMBlockLink :link="block.link || ''" :label="'랭킹 상품 더보기'" />
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import { toRefs } from 'vue'
import MMBlock from '@/components/block/Block.vue'
import MMBlockLink from '@/components/block/Link.vue'
import MMTitle from '@/components/block/Title.vue'
import MMRankingGoods from '@/components/block/special/RankingGoods.vue'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props);

function getRankSuffix(rank: number): string {
    if (rank < 1) {
        return ''
    }

    switch (rank) {
    case 1:
        return 'st'
    case 2:
        return 'nd'
    case 3:
        return 'rd'
    default:
        return 'th'
    }
}
</script>
<style>
@import '@publish/css/block/feature/rank_p_n=w6Xh13_s4_link.css';
</style>
