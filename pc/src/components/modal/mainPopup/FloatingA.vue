<template>
    <div class="m_main-popup T=popup-floating T=pa S=on">
        <div class="m_main-popup-inner">
            <div class="m_main-popup-item">
                <Carousel
                    :items="banners"
                    :use-count="false"
                    :use-pagination="true"
                    :carousel-data="{ _autoDelay: 4 }"
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
                    <button
                        type="button"
                        class="btn_today"
                        @click="$emit('close', true)"
                    >
                        <b>오늘 그만보기</b>
                    </button>
                    <button type="button" class="btn_popup-close" @click="$emit('close', false)">
                        <b class="mm_ir-blind">닫기</b><i />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Carousel from '@/components/Carousel.vue';
import { MainBanner } from '$/@type/mainBanner';

withDefaults(defineProps<{
    banners: MainBanner[],
}>(), {
    banners: () => []
});
defineEmits(['close']);
</script>