<template>
    <MMBlock
        v-slot="{ scrollToTop }"
        block-name="tp_nn=w6Xh38_s12"
        :required="{
            requiredValueList: [block.tabs, block.title1, block.title2]
        }"
        :class="route.name === 'Main' ? 'm_main-category' : ''"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <div ref="tabElement" class="mui_tab" data-tab>
            <div
                ref="tabMenuElement" 
                class="mui_tab_menu"
                :class="isSticky ? 'S=sticky-on' : ''"
                :style="`height: ${tabMenuElement?.offsetHeight}px`"
            >
                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
                <ul>
                    <li v-for="tab in block.tabs" :key="tab.id">
                        <a 
                            class="btn_tab" 
                            :class="tab.id === selectedTabId ? 'S=tab-on' : ''" 
                            href="#" 
                            @click.prevent="selectedTabId = tab.id; scrollToTop()"
                        >
                            <b>{{ tab.title }}</b>
                        </a>
                    </li>
                </ul>
            </div>
            <div ref="tabItemElement" class="mui_tab-item S=tab-on">
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
import { usePageContext } from "$/composables/pageHandler/contextComposable";
import { watch, onBeforeUnmount, ref } from "vue";
import { mmon } from "$/helper/mmon";

const { route, header } = usePageContext();

/** VARIABLE */
const props = defineProps<{ block: Block }>();
const { selectedTabId, activeGoodsList } = useTabBlock(props.block)

//sticky
const gnb: HTMLElement|null = document.querySelector('.mm_gnb-inner');
const scroller = mmon.scroll.find()
const tabMenuElement = ref<HTMLElement|null>();
const tabItemElement = ref<HTMLElement|null>();
const isSticky = ref<boolean>(false);
/** // VARIABLE */

function onScroll() {
    const isHeaderHide = document.documentElement.classList.contains("S=hide");
    const tabMenuTop = tabMenuElement.value?.getBoundingClientRect().top || 0;
    const tabMenuBottom = tabMenuElement.value?.getBoundingClientRect().bottom || 0;
    const tabItemBottom = tabItemElement.value?.getBoundingClientRect().bottom || 0
    const tabMenuHeight = tabMenuElement.value?.offsetHeight || 0;
    const tabItemHeight = tabItemElement.value?.offsetHeight || 0
    const gnbHeight = gnb?.offsetHeight || 0;

    // 블록 영역에서 벗어난 경우
    if (tabMenuBottom + (tabItemHeight - tabMenuHeight) + tabItemBottom < 0) {
        isSticky.value = false;
        return;
    }
    
    if (isHeaderHide) {
        isSticky.value = tabMenuTop + tabMenuHeight - gnbHeight + 20 < 0
    } else {
        isSticky.value = tabMenuTop - gnbHeight - header.offset().height - header.rect().top < 0
    }
}

watch(tabMenuElement, (to) => {
    if (!to || route.name !== 'Main' || !tabMenuElement.value) {
        return;
    }
    (scroller).addEventListener('scroll', onScroll);
})

onBeforeUnmount(() => {
    (scroller).removeEventListener('scroll', onScroll);
})

</script>
<style>
    @import "@publish/css/block/basic/tp_nn=w6Xh38_s12.css";
</style>