<template>    
    <div class="mm_view L=error">
        <div id="mm_body" class="mm_page">
            <div class="mm_page-inner">
                <div class="mm_page-content">
                    <div class="m_error">
                        <article class="m_error-inner">
                            <i :class="errorInfo.imageClass">
                                <img :src="errorInfo.imageUrl" :alt="errorInfo.imageAlt">
                            </i>
                            <h1><b>{{ errorInfo.title }}</b></h1>
                            <!-- <template v-if="error && isDevelop">
                                <br>
                                <pre>{{ error }}</pre>
                                <pre v-if="isDevelop">{{ error.stack }}</pre>
                            </template> -->
                            <p v-html="errorInfo.message" />
                            <div class="mm_btn_box">
                                <div class="mm_flex T=equal">
                                    <MMLink :to="{ path: '/' }" class="mm_btn T=line T=light">
                                        <span>메인으로</span>
                                    </MMLink>
                                    <button class="mm_btn T=line T=primary" @click.prevent="$router.go(-1)">
                                        <span>이전으로</span>
                                    </button>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>        
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { toRefs, ref } from 'vue';
import ApplicationError from '$/errors/ApplicationError';
import NotFoundError from '$/errors/NotFoundError';
import { useModalPopup } from '$/composables/pageHandler/modalComposable';

interface ErrorInfo  {
    imageUrl: string,
    imageClass: string,
    imageAlt: string,
    message: string,
    title: string
}
const props = defineProps<{
    error: ApplicationError | object
}>();

const { error } = toRefs(props);
const { clearModalPopup } = useModalPopup()

const serverError = ref<ErrorInfo>({
    imageUrl: '/image/common/error_500.svg',
    imageClass: 'image_error',
    imageAlt: '오류 500',
    message: '해당 페이지가 삭제 또는 변경되었거나<br> 일시적인 오류로 표시할 수 없습니다',
    title: '페이지를 찾을 수 없습니다'
});

const notFound = ref<ErrorInfo>({
    imageUrl: '/image/common/error_404.svg',
    imageClass: 'image_error',
    imageAlt: '오류 404',
    message: '해당 페이지가 삭제 또는 변경되었거나<br> 일시적인 오류로 표시할 수 없습니다',
    title: '페이지를 찾을 수 없습니다'
})

const commonError = ref<ErrorInfo>({
    imageUrl: '/image/common/error.svg',
    imageClass: 'image_error T=2xl',
    imageAlt: '오류 400',
    message: '찾고 계시는 페이지가 삭제 또는 변경되어<br> 일시적인 오류로 표시할 수 없습니다',
    title: '불편을 드려 죄송합니다' 
}) 

const unAuthorized = ref<ErrorInfo>({
    imageUrl: '/image/common/error_403.svg',
    imageClass: 'image_error',
    imageAlt: '오류 403',
    message: '',
    title: '',
});

const trafic = ref<ErrorInfo>({
    imageUrl: '/image/common/error_trafic.svg',
    imageAlt: '오류 트래픽증가',
    imageClass: 'T=lg',
    message: '',
    title: ''
})

const renewal = ref<ErrorInfo>({
    imageUrl: '/image/common/error_service.svg',
    imageClass: 'image_error T=xl',
    imageAlt: '오류 리뉴얼',
    message: '',
    title: ''
})

const errorInfo = ref<ErrorInfo>(commonError.value);
        
if (error.value instanceof NotFoundError) {            
    errorInfo.value = notFound.value             
}

// 모달에서 에러 발생시...
// 레이아웃 클리어 처리 
onMounted(() => {
    if (location.hash !== '') {
        clearModalPopup();
        location.hash = '';
    }
})
</script>
