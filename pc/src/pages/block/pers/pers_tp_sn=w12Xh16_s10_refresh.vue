<template>
    <MMBlock
        :block-name="'pers_tp_sn=w12Xh16_s10_refresh'"
        :required="{
            requiredValueList: [block.tabs, block.title1, block.title2]
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <div class="mui_inner">
            <button v-if="showRefreshButton" type="button" class="btn_refresh" @click="shuffleList">
                <b>새로고침</b><i class="uico_refresh" />
            </button>
            <div v-if="block" class="mui_tab" data-tab>
                <div class="mui_tab_menu">
                    <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
                    <MMSlider 
                        :context-code="`${block.id}_${block.name}`"
                        :items="block.tabs"
                    >
                        <template #item="{ item, index }">
                            <a 
                                class="btn_tab" 
                                :class="item.id === selectedTabId ? 'S=tab-on' : ''" 
                                href="#" 
                                @click.prevent="selectedTabId = item.id"
                            >
                                <b>{{ item.title }}</b>
                            </a>
                            <!-- 체형정보 입력 pop -->
                            <!-- (D) 체형정보를 입력하지 않은 회원이 로그인 시 노출합니다.-->
                            <div v-if="showFitPopup && index === 0 && item.id == selectedTabId" class="m_pers-size-pop">
                                <p>체형정보를 입력하시면<br>아이템을 추천해드려요!</p>
                                <MMLink class="btn_write" :to="{ name: 'Mypage' }">
                                    <b>입력하러가기</b>
                                </MMLink>
                                <button type="button" class="btn_close" @click="showFitPopup = false">
                                    <i class="uico_close" /><b class="mui_ir-blind">팝업 닫기</b>
                                </button>
                            </div>
                            <!--// 체형정보 입력 pop -->
                        </template>
                    </MMSlider>
                </div>
            
                <div v-for="tab in block.tabs" :key="tab.id" class="mui_tab-item" :class="tab.id === selectedTabId ? 'S=tab-on' : ''">
                    <div class="mui_product-list">
                        <ul>
                            <li v-for="goods in tab.goodsGroup.goodsList.slice(0, tab.goodsGroup.perPage || 10)" :key="goods.id">
                                <MMBlockGoods 
                                    :goods="goods" 
                                    :is-show-price="true" 
                                    :use-liked-button="true" 
                                    :use-badges="true" 
                                    :use-react-tag="true"
                                />
                            </li>
                        </ul>
                    </div>
                <!--// 상품 -->
                </div>
            </div>
        </div>
        <button v-if="showRefreshButton" type="button" class="btn_refresh" @click="shuffleList">
            <b>새로고침</b><i class="uico_refresh" />
        </button>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from "$/@type/block"
import MMBlock from "@/components/block/Block.vue";
import MMSlider from '@/components/block/Slider.vue';
import MMTitle from '@/components/block/Title.vue'
import { computed, onMounted, ref, toRefs } from "vue";
import { useBlockContext, useRefreshButtonWithRef } from "$/composables/blockComposable";
import { GoodsGroup } from "$/@type/block/partition";

/** VARIABLE */
const props = defineProps<{ block: Block }>();
const { block } = toRefs(props)
const { tabId: selectedTabId } = useBlockContext(`${block.value.id}_${block.value.name}`)
const showFitPopup = ref<boolean>(!block.value.existsMyFit);
const targetGoodsGroup = computed<GoodsGroup|null>(() => {
    return (block.value?.tabs || []).find(tab => tab.id === selectedTabId.value)?.goodsGroup || null
})
const { 
    showButton: showRefreshButton, 
    shuffleList, 
} = useRefreshButtonWithRef(
    `${block.value.id}_${block.value.name}`, 
    targetGoodsGroup
)
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
    @import "@publish/css/block/specific/pers_tp_sn=w12Xh16_s10_refresh.css";
</style>