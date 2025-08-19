<template>
    <div class="m_main-popup T=popup-toast T=pb S=on">
        <div class="m_main-popup-dim" />
        <div class="m_main-popup-item">
            <MMCarousel
                :items="mainBanners"
                :use-count="true"
                :carousel-data="{ _autoDelay: 4 }"
            >
                <template #item="{ item }">
                    <MMLink :to="item.link" data-href="{ '_type': 'link' }">
                        <i class="mm_bg-cover image_banner" :data-lazyload="`{'_src': '${item.imageUrl}'}`" />
                        <b>{{ item.imageAlt }}</b>
                    </MMLink>
                </template>
            </MMCarousel>
            <div class="mm_btnbox">
                <button type="button" class="btn_today" @click="$emit('closePopup', true)">
                    <b>오늘 하루 그만보기</b>
                </button>
                <button type="button" class="btn_close" @click="$emit('closePopup', false)">
                    <b>닫기</b>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { MainBanner } from '$/@type/mainBanner';
import MMCarousel from '@/components/Carousel.vue';

withDefaults(defineProps<{
    mainBanners: MainBanner[]
}>(), {
    mainBanners: () => []
})

defineEmits(['closePopup'])
</script>