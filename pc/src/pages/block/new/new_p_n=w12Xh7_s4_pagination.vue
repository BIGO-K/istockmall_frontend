<template>
    <MMBlock
        :block-name="'new_p_n=w12Xh7_s4_pagination'"
        :required="{
            requiredValueList: [block.title1, block.title2, block.goodsGroup?.goodsList],
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
        <!-- 페이지네이션 -->
        <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
        <MMPaginator
            :page-block-type="'group'"
            :page-block-count="10"
            :current-page="block.goodsGroup?.currentPage"
            :items-per-page="block.goodsGroup?.perPage"
            :total-count="block.goodsGroup?.total"
            @move-page-to="movePage"
        />
    <!--// 페이지네이션 -->
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import { onBeforeMount, toRefs } from 'vue'
import MMBlock from '@/components/block/Block.vue'
import MMPaginator from '@/components/block/Paginator.vue'
import MMTitle from '@/components/block/Title.vue'
import { blockRepository } from '$/repository/blockRepository'
import { defaultCatch, pluck } from '$/functions'
import { useBlockLikedGoods, useBlockPaginationContext } from '$/composables/blockComposable'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)
const { 
    applyPaginatorContext, 
    savePaginatorContext 
} = useBlockPaginationContext(
    `${block.value.id}_${block.value.name}`,
);

const { applyLikedGoods } = useBlockLikedGoods([]);

/**
 * 페이지 이동
 * @param page 페이지 넘버
 */
async function movePage(page: number) {
    if (!block.value?.goodsGroup || !block.value?.goodsGroup?.pagingUrl) {
        return
    }
    try {
        const goodsGroup = (await blockRepository.getGoodsGroupPaginator(
            block.value.goodsGroup.pagingUrl,
            page,
            block.value.goodsGroup.perPage || 4,
        )) as NonNullable<Block['goodsGroup']>

        applyLikedGoods(pluck(goodsGroup.goodsList, 'id'));
        savePaginatorContext(page, goodsGroup.goodsList);
        applyPaginatorContext(block.value.goodsGroup);
    } catch (e) {
        defaultCatch(e)
    }
}

onBeforeMount(() => {
    if (!block.value.goodsGroup) {
        return
    }
    applyPaginatorContext(block.value.goodsGroup);
})

</script>
<style>
@import '@publish/css/block/specific/new_p_n=w12Xh7_s4_pagination.css';
</style>
