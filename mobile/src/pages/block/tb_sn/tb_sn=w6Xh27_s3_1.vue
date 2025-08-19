<template>
    <MMBlock
        :block-name="'tb_sn=w6Xh27_s3_1'"
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
                        <li v-for="tab in block.tabs" :key="tab.id">
                            <a 
                                class="btn_tab"
                                :class="tab.id === selectedTabId ? 'S=tab-on' : ''"
                                href="#"
                                title="선택됨"
                                @click.prevent="selectedTabId = tab.id"
                            >
                                <b>{{ tab.title }}</b>
                            </a>
                        </li>
                    </ul>
                </MMScrollSlider>
            </div>
            <div class="mui_tab-item S=tab-on">
                <ul>
                    <li v-for="banner in activeBannerList" :key="banner.id">
                        <MMBanner 
                            :banner="banner"
                            :show-display-period="true"
                            :banner-image-class="'mui_bg-cover'"
                        />
                    </li>
                </ul>
            </div>
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMBanner from '@/components/block/Banner.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import MMScrollSlider from '@/components/block/ScrollSlider.vue'
import { useTabBlock } from '$/composables/blockComposable'

/** VARIABLE */
const props = defineProps<{ block: Block }>()
const { selectedTabId, activeBannerList } = useTabBlock(props.block)
/** // VARIABLE */

</script>
<style>
@import '@publish/css/block/basic/tb_sn=w6Xh27_s3_1.css';
</style>
