<template>
    <div class="mm_page-content-body">
        <div class="m_cs-notice-detail">
            <div class="m...detail-head">
                <h3><b>{{ notice.title }}</b></h3>
                <span class="text_date">{{ MMFilters.formatDate(notice.createdAt, 'yyyy.MM.DD') }}</span>
            </div>
            <div class="m...detail-content">
                <div
                    class="mm_editor"
                    v-html="notice?.contents"
                />
            </div>
            <div class="mm_foot">
                <div class="mm_btn_box">
                    <MMLink 
                        :to="{ name: 'CsCenterNoticeIndex' }" 
                        class="mm_btn T=line T=dark"
                    >
                        <b>목록으로</b>
                    </MMLink>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { noticeRepository } from '$/repository/cs/noticeRepository';
import { Notice } from '$/@type/cs/notice';
import { useRoute } from 'vue-router';
import { usePageTitleSetting } from '$/composables/seoComposable';

const route = useRoute();
const noticeId = Number(`${route.params.id}`);
const notice = ref<Notice>({
    id: noticeId,
    title: '',
    contents: '',
    createdAt: '',
    isImportant: false,
});

onMounted(async () => {
    try {
        notice.value = await noticeRepository.getNotice(noticeId);
    } catch(e) {
        
    }

    usePageTitleSetting(notice.value.title, ['공지사항', '고객센터']);
});
</script>
