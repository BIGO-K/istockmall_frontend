<template>
    <MMBlock
        :block-name="'rank_p_n=w12Xh10_s4_link'"
        :required="{
            requiredValueList: [block.goodsGroup?.goodsList, block.title1, block.title2]
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
                    <div class="mui_product-item">
                        <MMLink
                            :to="
                                goods.isOnlyAdult && needCertificateAge
                                    ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${goods.id}`, is_need_adult_certification: 'Y' } }
                                    : { name: 'GoodsDetail', params: { id: goods.id } }
                            "
                        >
                            <figure>
                                <div class="mui_product-image">
                                    <div class="mui_image-scale">
                                        <i
                                            v-lazyload="{ src: goods.thumbnailUrl }"
                                            class="mui_bg-cover image_product"
                                            :data-lazyload="`{ '_src': '${goods.thumbnailUrl}' }`"
                                        />
                                    </div>
                                </div>
                                <figcaption>
                                    <p class="text_brand">
                                        {{ goods.brandName }}
                                    </p>
                                    <p class="text_product">
                                        {{ goods.name }}
                                    </p>
                                </figcaption>
                            </figure>
                        </MMLink>
                    </div>
                </li>
            </ol>
        </div>
        <MMBlockLink :link="block.link || ''" :label="'랭킹 상품 더보기'" />
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import { computed, toRefs } from 'vue'
import MMBlock from '@/components/block/Block.vue'
import MMBlockLink from '@/components/block/Link.vue'
import MMTitle from '@/components/block/Title.vue'
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const props = defineProps<{ block: Block }>()
const { isUser, needCertificateAge } = usePageContext();
const pathCertificate = computed(() => isUser.value ? 'AdultCertification' : 'Login')
const { block } = toRefs(props)

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
@import '@publish/css/block/specific/rank_p_n=w12Xh10_s4_link.css';
</style>
