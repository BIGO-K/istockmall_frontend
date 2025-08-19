<template>
    <MMBlock
        block-name="tp_nn=w6Xh20_s6"
        :required="{
            requiredValueList: [block.tabs, block.title1, block.title2]
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <div class="mui_tab" data-tab>
            <div class="mui_tab_menu">
                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
                <ul>
                    <li v-for="tab in block.tabs" :key="tab.id">
                        <a 
                            class="btn_tab" 
                            :class="tab.id === selectedTabId ? 'S=tab-on' : ''" 
                            href="#" 
                            @click.prevent="selectedTabId = tab.id"
                        >
                            <b>{{ tab.title }}</b>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="mui_tab-item S=tab-on">
                <div class="mui_product-list">
                    <ul>
                        <li v-for="goods in activeGoodsList" :key="goods.id">
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
            </div>
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from "$/@type/block"
import MMBlock from "@/components/block/Block.vue";
import MMTitle from '@/components/block/Title.vue'
import { useTabBlock } from "$/composables/blockComposable";

/** VARIABLE */
const props = defineProps<{ block: Block }>();
const { selectedTabId, activeGoodsList } = useTabBlock(props.block)
/** // VARIABLE */
</script>
<style>
    @import "@publish/css/block/basic/tp_nn=w6Xh20_s6.css";
</style>