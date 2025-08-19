<template>
    <MMBlock
        :block-name="'tp_nc=w6Xh14_s4'"
        :required="{
            requiredValueList: [block.tabs, block.title1, block.title2],
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
                            @click.prevent="() => {
                                changeTab(tab.id);
                                onTabChanged();
                            }"
                        ><b>{{ tab.title }}</b></a>
                    </li>
                </ul>
            </div>
            <div class="mui_tab-item S=tab-on">
                <MMCarousel
                    :context-code="`${block.id}_${block.name}_${activeTab?.id}`"
                    :items="chunk(activeGoodsList, goodsPerPage || 4)"
                    :features="[
                        'pagination'
                    ]"
                    :carousel-data="{
                        _autoDelay: 4,
                        _isAutoHeight: true
                    }"
                    :require-resize="requireResizeList[currentTabIndex]"
                    :require-index-reset="requireIndexReset[currentTabIndex]"
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
            </div>
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMCarousel from '@/components/block/Carousel.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import { ref, toRefs } from 'vue'
import { chunk } from '$/functions'
import { useTabBlock } from '$/composables/blockComposable'

/** VARIABLE */
const props = defineProps<{ block: Block }>();
const { block } = toRefs(props)
const requireResizeList = ref<boolean[]>([]);
const requireIndexReset = ref<boolean[]>([]);
const { 
    selectedTabId, 
    activeGoodsList, 
    activeTab,
    goodsPerPage,
    currentTabIndex, 
    changeTab 
} = useTabBlock(props.block);
/** // VARIABLE */

/** VUE LIFE CYCLE */
function onTabChanged() {
    requireResizeList.value[currentTabIndex.value] = true;
    requireIndexReset.value[currentTabIndex.value] = true;

    setTimeout(() => {
        requireIndexReset.value[currentTabIndex.value] = false;
    }, 100);
}
/** // VUE LIFE CYCLE */
</script>
<style>
@import '@publish/css/block/basic/tp_nc=w6Xh14_s4.css';
</style>
