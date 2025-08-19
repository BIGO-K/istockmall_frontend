<template>
    <ModalPopup>    
        <template #headerTitle>
            <h1><b>360도 보기</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-multiangle S=multiangle-on" @touchstart="view360MouseDown($event)">
                            <p :class="['m_popup-multiangle-note', { 'S=note-on' : degree360NoteOn }]">
                                <i class="ico_multiangle-drag" />좌우로 움직여 더 자세히 보세요
                            </p>
                            <div class="m_popup-multiangle-image">
                                <i
                                    v-for="imageUrl, index in degree360ImageUrls" 
                                    :key="index"
                                    v-lazyload="{ src: imageUrl, isForce: true }"
                                    :class="['mm_bg-cover image_product', { 'S=on' : selectedImageIndex === Number(index) }]"
                                />                                
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { use360DegreeImage } from '$/composables/goods/detailComposable';

const prevTouched = ref<Touch>();
const dragCount = ref(0);
const selectedImageIndex = ref(0);
const degree360NoteOn = ref(true);

const { degree360ImageUrls } = use360DegreeImage();

function view360MouseDown(event: TouchEvent) {
    prevTouched.value = event.touches[0];
    dragCount.value = 0;
    document.addEventListener('touchmove', view360MouseInlineHandler);
    document.addEventListener('touchend', removeHandler);
}

function removeHandler() {
    document.removeEventListener('touchmove', view360MouseInlineHandler);
}

function view360MouseInlineHandler(event: TouchEvent) {
    if (prevTouched.value === undefined) {
        return;
    }

    const moveX = event.touches[0].screenX - prevTouched.value?.screenX
    prevTouched.value = event.touches[0];

    if (moveX > 0) {
        dragCount.value++;
    } else {
        dragCount.value--;
    } 
            
    if (degree360ImageUrls.value.length < 1) {
        return;
    }

    if (Math.abs(dragCount.value) > 1.7 * ( 32/ degree360ImageUrls.value.length)) {
        dragCount.value = 0;
        selectedImageIndex.value = (moveX > 0) ? selectedImageIndex.value + 1 : selectedImageIndex.value - 1;

        if (selectedImageIndex.value >= degree360ImageUrls.value.length) {
            selectedImageIndex.value = 0;
        }
        if (selectedImageIndex.value < 0) {
            selectedImageIndex.value = degree360ImageUrls.value.length - 1;
        } 
    }
}

onBeforeUnmount(() => {
    document.removeEventListener('touchmove', view360MouseInlineHandler);
    document.removeEventListener('touchend', removeHandler);
})
</script>
