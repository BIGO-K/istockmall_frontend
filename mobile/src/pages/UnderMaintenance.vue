<template>
    <div class="mm_view">
        <div id="mm_body" class="mm_page">
            <div class="mm_page-inner">
                <div class="mm_page-content">
                    <div class="m_error">
                        <article class="m_error-inner">
                            <i class="image_error T=xl"><img src="/image/common/error_service.svg" alt="오류 서비스점검"></i>
                            <h1><b>서비스 점검 안내</b></h1>
                            <p>보다 나은 서비스를 위해 서버 점검 중입니다<br> 점검 완료 후 다시 방문해주세요</p>
                            <p v-if="startAt" class="text_period">
                                {{ MMFilters.formatDate(startAt, 'YYYY년 M월 D일 dddd', true) }}
                                <strong>{{ periodText }}</strong>
                            </p>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useMaintenanceState } from '$/composables/pageHandler/contextComposable';
import moment from 'moment';
import { computed, onMounted } from 'vue';
import { formatDate } from '$/filters';
import { useRouter } from 'vue-router';

const router = useRouter();
const { startAt, endAt, startWithoutEndAt, isUnderMaintenance } = useMaintenanceState();

const periodText = computed(() => {
    if (!endAt || startWithoutEndAt) {
        return formatDate(startAt, 'HH:mm') + '~'
    }

    const durationHour = moment(endAt).diff(startAt, 'h');

    return `${formatDate(startAt, 'HH:mm')}~${formatDate(endAt, 'HH:mm')}` + ((durationHour > 0) ? ` (${durationHour}시간)` : '')
})

onMounted(() => {
    if (!isUnderMaintenance.value) {
        router.replace({ name: 'Main' })
    }
})
</script>