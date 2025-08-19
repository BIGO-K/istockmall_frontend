<template>
    <p class="text_rank">
        <sub>위</sub>
        <template v-if="hasRankRange">
            <span
                v-if="brand.changeType === 'U'"
                class="text_rank-up"
            ><i
                class="ico_rank-up"
                title="상승"
            />{{ brand.changeValue }}</span>
            <span
                v-else-if="brand.changeType === 'D'"
                class="text_rank-down"
            ><i
                class="ico_rank-down"
                title="하락"
            />{{ brand.changeValue }}</span>
            <i
                v-else-if="brand.changeType === 'N'"
                class="ico_rank-new"
                title="신규"
            />
            <i
                v-else
                class="ico_rank-unchanged"
                title="변동없음"
            />
        </template>
        <template v-else>
            <i class="ico_rank-unchanged" title="변동없음" />
        </template>
    </p>
    <MMLink
        :to="{ name: 'GoodsBrandIndex', params: { id: brand.id } }"
        :class="['btn_brand']"
    >
        <b>{{ brand.name }}</b><i class="ico_link T=thin" />
    </MMLink>
    <div class="mm_product-list">
        <ul>
            <li v-for="goods in brand.goodsList" :key="goods.id">
                <mm-ranking-simple-goods :goods="goods" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue'
import { RankingBrandList } from '$/@type/ranking';
import MmRankingSimpleGoods from '@/components/ranking/SimpleGoods.vue';

export default defineComponent({
    components: {
        MmRankingSimpleGoods
    },
    props: {
        brand: {
            type: Object as PropType<RankingBrandList>,
            required: true
        },
        hasRankRange: {
            type: Boolean,
            default: true,
        }
    },
    setup(props, { attrs }) {
        return {

        }        
    },
})
</script>
