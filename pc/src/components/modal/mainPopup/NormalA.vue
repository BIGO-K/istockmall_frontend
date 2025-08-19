<template>
    <div class="m_main-popup T=pa S=on">
        <div class="m_main-popup-dim" />
        <div
            ref="popupItemElement"
            class="m_main-popup-item"
        >
            <Carousel
                :items="banners"
                :use-count="false"
                :use-pagination="true"
                :use-control="false"
                :carousel-data="{ _isAutoHeight: true, _autoDelay: 4 }"
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
                <label class="mm_form-check">
                    <input
                        type="checkbox"
                        @change="checkMainPopupHide = !checkMainPopupHide"
                    >
                    <b class="mm_block">
                        <i class="ico_form-check" />
                        <span class="text_label">오늘 하루 그만보기</span>
                    </b>
                </label>
                <button
                    type="button"
                    class="btn_popup-close"
                    @click="$emit('close', checkMainPopupHide)"
                >
                    <b>닫기</b><i class="ico_close" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Carousel from '@/components/Carousel.vue';
import { MainBanner } from '$/@type/mainBanner';
import { onClickOutside } from '@vueuse/core';

withDefaults(defineProps<{
    banners: MainBanner[],
}>(), {
    banners: () => []
})

const emit = defineEmits(['close']);

const popupItemElement = ref<HTMLElement|null>(null);
const checkMainPopupHide = ref<boolean>(false);

onMounted(() => {
    onClickOutside(popupItemElement.value, () => {
        emit('close');
    });
})
</script>
