<template>
    <MMBlock
        :block-name="'live_b_c=w6Xh10_s1_sideLink'"
        :required="{
            requiredValueList: [block.liveCommercePartition?.liveCommerceList, block.title1, block.title2]
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
            :position="'center'"
        />
        <MMCarousel
            :context-code="`${block.id}_${block.name}`"
            :items="block.liveCommercePartition?.liveCommerceList"
            :features="[
                'useProgressBar'
            ]"
            :carousel-data="{
                _autoDelay: 4,
                _isMoreSide: true,
            }"
        >
            <template #item="{ item }">
                <template v-if="item.isOnAir">
                    <MMLink :to="{ name: 'LiveCommerceShowRoom', params: { roomId: item.broadcastId}}">
                        <figure>
                            <div>
                                <i v-lazyload="{ src: item.mainThumbnail }" class="mm_bg-cover image_banner" />
                                <LiveVideoPreview
                                    :preview-url="item.previewUrl || ''"
                                />
                                <b class="text_tag T=live">ON AIR</b>
                            </div>
                            <figcaption>
                                <p class="text_state">
                                    현재 방송중
                                </p>
                                <p class="text_banner1">
                                    {{ item.broadcastName }}
                                </p>
                            </figcaption>
                        </figure>
                    </MMLink>
                </template>
                <template v-else>
                    <MMLink :to="{ name: 'LiveCommerceShowRoom', params: { roomId: item.broadcastId}}">
                        <figure>
                            <div>
                                <i v-lazyload="{ src: item.mainThumbnail }" class="mm_bg-cover image_banner" />
                                <b class="text_tag T=standby">방송예정</b>
                                <LiveVideoPreview 
                                    :preview-url="item.previewUrl || ''"
                                />
                                <p class="text_open">
                                    {{ formatDate(item.programmingStartAt , 'MM월 DD일') }}
                                    <span>{{ formatDate(item.programmingStartAt , 'HH:mm') }}</span>
                                </p>
                            </div>
                            <figcaption>
                                <p class="text_state">
                                    {{ formatDate(item.programmingStartAt, 'MM월 DD일 A HH시', true) }}
                                </p>
                                <p class="text_banner1">
                                    {{ item.broadcastName }}
                                </p>
                            </figcaption>
                        </figure>
                    </MMLink>
                </template>
            </template>
        </MMCarousel>
        <MMBlockLink :link="block.link || ''" :label="'전체보기'" />
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block';
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue';
import MMCarousel from '@/components/block/Carousel.vue'
import LiveVideoPreview from '@/pages/live/LiveVideoPreview.vue';
import MMBlockLink from '@/components/block/Link.vue'
import { toRefs } from 'vue';
import { formatDate } from '$/filters';

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props);

</script>
<style>
@import '@publish/css/block/feature/live_b_c=w6Xh10_s1_sideLink.css';
</style>