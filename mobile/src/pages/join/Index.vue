<template>    
    <MMPopup>
        <template #headerTitle>
            <h1><b>{{ headerTitle }}</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <router-view @headerTitleChange="headerTitleChange" />
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import MMPopup from '@/components/layout/Popup.vue';
import { ref } from 'vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
    
usePageTitleSetting('회원가입');

const headerTitle = ref('회원가입');
const headerTitleChange = (title: string) => {
    headerTitle.value = title;
}

</script>
