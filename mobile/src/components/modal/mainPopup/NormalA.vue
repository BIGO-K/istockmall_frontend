<template>
    <div class="m_main-popup T=pa S=on">
        <div class="m_main-popup-dim" />
        <div class="m_main-popup-item">
            <MMCarousel
                :items="mainBanners"
                :use-pagination="true"
                :use-custom-pagination="true"
                :carousel-data="{
                    _autoDelay: 4,
                    _isAutoHeight: true
                }"
            >
                <template #item="{ item }">
                    <MMLink :to="item.link">
                        <img
                            v-lazyload="{ src : item.imageUrl }"
                            :data-lazyload="`{ '_src':  '${item.imageUrl}' }`"
                            :alt="item.imageAlt"
                        >
                    </MMLink>
                </template>
                <template #pagination>
                    <li v-for="index in mainBanners.length" :key="index">
                        <button type="button" class="btn_carousel-page">
                            <span class="mm_ir-blind">{{ index + 1 }}</span>
                        </button>
                    </li>
                </template>
            </MMCarousel>
            <div class="mm_btnbox">
                <div class="mm_flex T=equal">
                    <button type="button" class="btn_today" @click="$emit('closePopup', true)">
                        <b>오늘 하루 그만보기</b>
                    </button>
                    <button type="button" class="btn_close" @click="$emit('closePopup', false)">
                        <b>닫기</b>
                    </button>
                </div>
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