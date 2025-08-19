<template>
    <MMBlock
        :block-name="'tb_sn=w12Xh17_s6'"
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
                <MMSlider 
                    :context-code="`${block.id}_${block.name}`"
                    :items="block.tabs"
                    :use-control="true"
                >
                    <template #item="{ item }">
                        <a 
                            :class="{ btn_tab: true, 'S=tab-on': item.id === selectedTabId}"
                            href="#"
                            @click.prevent="selectedTabId = item.id"
                        >
                            <b>{{ item.title }}</b>
                        </a>
                    </template>
                </MMSlider>
            </div>
            <div class="mui_tab-item S=tab-on">
                <ul>
                    <li v-for="banner in activeBannerList" :key="banner.id">
                        <MMBanner :banner="banner" :banner-image-class="'mui_bg-cover'" :show-display-period="true" />
                    </li>
                </ul>
            </div>
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMBanner from '@/components/block/Banner.vue'
import MMSlider from '@/components/block/Slider.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import { useTabBlock } from '$/composables/blockComposable'

/** VARIABLE */
const props = defineProps<{ block: Block }>()
const { selectedTabId, activeBannerList, changeTab } = useTabBlock(props.block)
/** // VARIABLE */
</script>

<style>
@import '@publish/css/block/normal/tb_sn=w12Xh17_s6.css';
</style>
