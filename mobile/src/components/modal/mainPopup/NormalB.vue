<template>
    <div class="m_main-popup T=pb S=on">
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
                <button type="button" class="btn_today" @click="$emit('closePopup', true)">
                    <b>오늘은 그만 볼게요</b>
                </button>
                <button type="button" class="btn_close" @click="$emit('closePopup', false)">
                    <i class="ico_popup-close T=thin" /><b class="mm_ir-blind">닫기</b>
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