<template>
    <MMBlock
        :block-name="'reco_p_n=w6Xh20_s5_link'"
        :required="{
            requiredValueList: [block.goodsGroup?.goodsList, block.title1, block.title2],
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <div v-if="block.goodsGroup?.goodsList.length" class="mui_inner">
            <!-- (D) 로그인 상태 -->
            <h5 v-if="user" class="text_main">
                <b>
                    <strong>{{ user.name }}</strong>
                    님
                </b>
                <b>이런 상품은 어떠세요?</b>
            </h5>
            <!--// (D) 로그인 상태 -->
            <!-- (D) 비로그인 상태 -->
            <h5 v-else class="text_main">
                <b v-html="MMFilters.wrap(MMFilters.applyZosa(`${shopName}(이/가)`), shopName, '<strong>', '</strong>')" />
                <b>추천하는 아이템</b>
            </h5>
            <!--// (D) 비로그인 상태 -->
            <p class="text_sub">
                당신만을 위한 오늘의 추천
            </p>
            <div class="mui_product-list">
                <ul>
                    <li v-for="goods in block.goodsGroup?.goodsList" :key="goods.id">
                        <MMBlockGoods :goods="goods" :is-show-price="false" :use-liked-button="true" />
                    </li>
                </ul>
            </div>
            <MMBlockLink :link="block.link || ''" :label="'추천상품 더보기'" />
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import { ref, toRefs } from 'vue'
import MMBlock from '@/components/block/Block.vue'
import MMBlockLink from '@/components/block/Link.vue'
import MMTitle from '@/components/block/Title.vue'
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)
const { user, globalConfigs } = usePageContext();
const shopName = ref<string>(globalConfigs.value.shop.name);

</script>
<style>
@import '@publish/css/block/feature/reco_p_n=w6Xh20_s5_link.css';

</style>
