<template>
    <MMBlock
        :block-name="'tp_sc=w6Xh13_s4_1'"
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
                <MMScrollSlider :context-code="`${block.id}_${block.name}`">
                    <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
                    <ul>
                        <li v-for="(tab, tabIndex) in block.tabs" :key="tab.id">
                            <a
                                class="btn_tab"
                                :class="tab.id === selectedTabId ? 'S=tab-on' : ''"
                                href="#"
                                @click.prevent="() => { 
                                    selectedTabId = tab.id; 
                                    requireResizeList[tabIndex] = true 
                                }"
                            ><b>{{ tab.title }}</b></a>
                        </li>
                    </ul>
                </MMScrollSlider>
            </div>
            <div 
                v-for="tab, tabIndex in block.tabs"
                :key="tab.id"
                class="mui_tab-item"
                :class="tab.id === selectedTabId ? 'S=tab-on' : ''"
            >
                <MMCarousel
                    :context-code="`${block.id}_${block.name}_${tab.id}`"
                    :items="chunk((tab.goodsGroup?.goodsList || []), 4)"
                    :features="[
                        'pagination'
                    ]"
                    :carousel-data="{
                        _autoDelay: 4,
                        _isAutoHeight: true
                    }"
                    :require-resize="requireResizeList[tabIndex]"
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
import MMScrollSlider from '@/components/block/ScrollSlider.vue'
import { ref, toRefs, onMounted } from 'vue'
import { chunk } from '$/functions'
import { useBlockContext } from '$/composables/blockComposable'

/** VARIABLE */
const props = defineProps<{ block: Block }>();
const { block } = toRefs(props)
const { tabId: selectedTabId } = useBlockContext(`${block.value.id}_${block.value.name}`)
const requireResizeList = ref<boolean[]>([]);
/** // VARIABLE */

/** VUE LIFE CYCLE */
onMounted(() => {
    if (!selectedTabId.value && block.value.tabs?.length) {
        selectedTabId.value = block.value.tabs[0].id;
    }
});
/** // VUE LIFE CYCLE */
</script>
<style>
@import '@publish/css/block/basic/tp_sc=w6Xh13_s4_1.css';
</style>
