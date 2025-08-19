<template>
    <MMBlock
        block-name="rank_p_n=w6Xh17_s5_link"
        :required="{
            requiredValueList: [block.goodsGroup?.goodsList, block.title1, block.title2],
        }"
    >
        <MMTitle :title1="block.title1" :title2="block.title2" :design-class-name="block.designTitleClassName" />
        <div class="mui_product-list">
            <ol>
                <li v-for="goods in block.goodsGroup?.goodsList" :key="goods.id">
                    <p class="text_rank" :class="goods.rank === 1 ? 'T=rank-first' : ''">
                        <strong>{{ goods.rank }}</strong>
                        <template v-if="block.rankHasRange">
                            <span v-if="goods.rankChangeType === 'U'" class="text_rank-up">
                                <i class="uico_rank-up" title="상승" />{{ goods.rankChangeValue }}
                            </span>
                            <span v-else-if="goods.rankChangeType === 'D'" class="text_rank-down">
                                <i class="uico_rank-down" title="하락" />{{ goods.rankChangeValue }}
                            </span>
                            <i v-else-if="goods.rankChangeType === 'N'" class="uico_rank-new" title="신규" />
                            <i v-else class="uico_rank-unchanged" title="변동없음" />
                        </template>
                    </p>
                    <div class="mui_product-item">
                        <MMRankingGoods :goods="goods">
                            <figure>
                                <i
                                    v-lazyload="{ src: goods.thumbnailUrl }"
                                    class="mui_bg-cover image_product"
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
                    </div>
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

</script>
<style>
@import '@publish/css/block/feature/rank_p_n=w6Xh17_s5_link.css';
</style>
