<template>
    <MMBlock
        :block-name="'mult_p_n=w6Xh19_s6_refresh'"
        :required="{
            requiredValueList: [goodsList, block.title1, block.title2],
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <div class="mui_inner">
            <button v-if="showRefreshButton" type="button" class="btn_refresh" @click="shuffleList">
                <b class="mui_ir-blind">새로고침</b><i class="uico_refresh" />
            </button>
            <div class="mui_product-list">
                <ul>
                    <li v-for="goods in goodsList" :key="goods.id">
                        <MMBlockGoods 
                            :goods="goods" 
                            :use-liked-button="true" 
                            :use-react-tag="true" 
                            :use-badges="true" 
                            :is-show-price="true" 
                            :use-multiangle-icon="true" 
                        />
                    </li>
                </ul>
            </div>
        </div>
        <button v-if="showRefreshButton" type="button" class="btn_refresh" @click="shuffleList">
            <b>새로고침</b><i class="uico_refresh" />
        </button>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMTitle from '@/components/block/Title.vue'
import { toRefs } from 'vue'
import MMBlock from '@/components/block/Block.vue'
import { useRefreshButton } from '$/composables/blockComposable'

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)

const { 
    showButton: showRefreshButton, 
    displayingList: goodsList,
    shuffleList, 
} = useRefreshButton(
    `${block.value.id}_${block.value.name}`, 
    block.value.goodsGroup || null
)

</script>
<style>
@import '@publish/css/block/feature/mult_p_n=w6Xh19_s6_refresh.css';
</style>
