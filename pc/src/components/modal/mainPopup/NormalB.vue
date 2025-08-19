<template>
    <div class="m_main-popup T=pb S=on">
        <div class="m_main-popup-dim" />
        <div class="m_main-popup-item">
            <Carousel
                :items="banners"
                :use-count="false"
                :use-pagination="true"
                :carousel-data="{ _isAutoHeight: true }"
            >
                <template #item="{ item }">
                    <MMLink :to="item.link">
                        <img
                            v-lazyload="{ src : item.imageUrl }"
                            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                            :data-lazyload="`{ '_src':  '${item.imageUrl}' }`"
                            :alt="item.imageAlt"
                        >
                    </MMLink>
                </template>
            </Carousel>
            <div class="m...item-foot">
                <button type="button" class="btn_today" @click="$emit('close', true)">
                    <b>오늘은 그만 볼게요</b>
                </button>
                <button type="button" class="btn_popup-close" @click="$emit('close', false)">
                    <b class="mm_ir-blind">닫기</b><i class="ico_popup-close" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { MainBanner } from '$/@type/mainBanner';
import Carousel from '@/components/Carousel.vue';

withDefaults(defineProps<{
    banners: MainBanner[],
}>(), {
    banners: () => []
})
defineEmits(['close']);
</script>
