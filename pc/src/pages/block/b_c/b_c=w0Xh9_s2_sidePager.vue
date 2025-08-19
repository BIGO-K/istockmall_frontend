<template>
    <MMBlock
        :block-name="'b_c=w0Xh9_s2_sidePager'"
        :required="{
            requiredValueList: [block.bannerPartition?.banners, block.title1, block.title2],
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <MMCarousel
            :context-code="`${block.id}_${block.name}`"
            :items="chunk(block.bannerPartition?.banners || [], 2)"
            :features="[
                'control',
                'customCount'
            ]"
            :carousel-data="{
                _autoDelay: 4,
                _isMoreSide: true
            }"
        >
            <template #item="{ item }">
                <ul class="mui_flex T=equal">
                    <li v-for="banner in item" :key="banner.id">
                        <MMBanner :banner="banner" />
                    </li>
                </ul>
            </template>
            <template #count>
                <strong class="text_carousel-index" /><i /><span class="text_carousel-total" />
                <a href="#" class="btn_more" @click.prevent="showMoreModal = true">
                    <b><i class="uico_more" />전체보기</b>
                </a>
            </template>
        </MMCarousel>
        <div v-if="showMoreModal" class="mui_modal" :class="showMoreModal ? 'S=on' : ''" data-mui="b_c=w0Xh9_s2_sidePager">
            <div class="mui_modal-dim" />
            <div class="mui_modal-inner">
                <div class="mm_scroller">
                    <ul>
                        <li v-for="banner in block.bannerPartition?.banners" :key="banner.id">
                            <MMBanner :banner="banner" />
                        </li>
                    </ul>
                </div>
                <button type="button" class="btn_close" @click="showMoreModal = false">
                    <i class="ico_close" /><b class="mm_ir-blind">닫기</b>
                </button>
            </div>
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import MMCarousel from '@/components/block/Carousel.vue'
import MMBanner from '@/components/block/Banner.vue'
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import { ref, toRefs } from 'vue'
import { chunk } from '$/functions'

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props)
const showMoreModal = ref<boolean>(false);

</script>
<style>
@import '@publish/css/block/normal/b_c=w0Xh9_s2_sidePager.css';
</style>
