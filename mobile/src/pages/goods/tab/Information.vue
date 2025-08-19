<template>
    <div class="m_prodetail-tab-info">
        <!-- 셀러 휴무일 -->
        <div v-if="goodsInformation.sellerHolidayMessage || sellerHolidayMessage" class="m...info-seller-off">
            <strong>배송 공지</strong>
            <p v-if="sellerHolidayMessage">
                {{ sellerHolidayMessage }}
            </p>
            <p v-else>
                {{ goodsInformation.sellerHolidayMessage }}
            </p>
        </div>
        <!--// 셀러 휴무일 -->
        <!-- 상품 공통배너 -->
        <div class="m...info-banner">
            <ul>
                <li v-for="topBanner, index in goodsInformation.topBanners" :key="`top_${index}`">
                    <div v-if="topBanner.isEditorUse" class="mm_editor" v-html="topBanner.contents" />
                    <!-- 이미지 등록 방식 -->
                    <i v-else class="image_banner">
                        <img
                            v-lazyload="{ src: topBanner.imageUrl }" 
                            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                            :alt="topBanner.imageAlt"
                        >
                    </i>                    
                </li>                
            </ul>
        </div>
        <!--// 상품 공통배너 -->
        <div class="mm_inner">
            <p class="text_code">
                상품번호<span>{{ goodsId }}</span>
            </p>
            <!-- 동영상 -->
            <div
                v-if="goodsInformation.videoUrl !== ''"
                class="m...info-media" 
                v-html="goodsInformation.videoUrl"
            />
            <!--// 동영상 -->

            <!-- 상품 상세설명 및 이미지 -->
            <div :class="['m...info-desc', { 'S=switch-on' : isMore } ]">
                <p ref="textZoomElement" :class="['text_zoom', { 'S=on' : isMore } ]">
                    상세정보를 확대해서 볼 수 있어요
                </p>
                <PinchZoom :contents="goodsInformation.detailInfo" :flag="isMore">
                    <template #contents>
                        <p v-editorWithImageTag="{ isForce: true }" v-html="goodsInformation.detailInfo" />
                    </template>
                </PinchZoom>
                <div class="mm_btn_box">
                    <button
                        type="button"
                        class="mm_btn T=line T=primary btn_more"
                        :title="isMore ? '상세정보 접기' : '상세정보 더보기'" 
                        @click="openZoomText"
                    >
                        <b class="mm_ir-blind">{{ isMore ? '상세정보 접기' : '상세정보 더보기' }}</b>
                    </button>
                </div>
                <!--// 상세설명 -->
            </div>
            <!--// 상품 상세설명 및 이미지 -->
        </div>

        <!-- 상품 공통배너 -->
        <div class="m...info-banner">
            <ul>
                <li v-for="bottomBanner,index in goodsInformation.bottomBanners" :key="`bottom_${index}`">
                    <div v-if="bottomBanner.isEditorUse" class="mm_editor" v-html="bottomBanner.contents" />
                    <!-- 이미지 등록 방식 -->
                    <i v-else class="image_banner">
                        <img
                            v-lazyload="{ src: bottomBanner.imageUrl }" 
                            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                            :alt="bottomBanner.imageAlt"
                        >
                    </i>
                </li>                
            </ul>
        </div>
        <!--// 상품 공통배너 -->
    </div>
</template>

<script setup lang="ts">
import { goodsRepository } from '$/repository/goodsRepository';
import { onMounted, ref, toRefs, computed } from 'vue';
import { GoodsInformation } from '$/@type/goods';
import { editorWithImageTag as vEditorWithImageTag } from '$/directives';
import { gsap } from 'gsap'
import { applyZosa, formatDate } from '$/filters';
import PinchZoom from '@/components/PinchZoom.vue';

const props = defineProps<{
    goodsId: number
}>();

const emit = defineEmits(['informationSet']);

const { goodsId } = toRefs(props)
const goodsInformation = ref<GoodsInformation>(
    {
        topBanners: [],
        bottomBanners: [],
        detailInfo: '',
        videoUrl: '',
        mandatory: [],
        useStateLabel: '',
        originLabel: '',
        sellerHolidayMessage: ''
    }
);

const isMore = ref(false);
const textZoomElement = ref<HTMLElement|null>(null);

const sellerHolidayMessage = computed(() => {
    if (!goodsInformation.value.sellerHoliday) {
        return '';
    }

    return applyZosa(`${goodsInformation.value.sellerHoliday.reason}(으로/로)`)
        + ' 인해 '
        + formatDate(goodsInformation.value.sellerHoliday.startAt, 'YYYY-MM-DD')
        + ' ~ '
        + formatDate(goodsInformation.value.sellerHoliday.endAt, 'YYYY-MM-DD')
        + ' 주문한 상품은 '
        + formatDate(goodsInformation.value.sellerHoliday.releaseAt, 'YYYY-MM-DD')
        + '부터 순차적으로 배송합니다.';
})

function openZoomText() {
    isMore.value = !isMore.value;

    if (!textZoomElement.value) {
        return ;
    }

    gsap.to(textZoomElement.value, { opacity: 1, duration: 0.3, ease: 'Sine.Out' });
    setTimeout(function () {
        gsap.to(textZoomElement.value, { opacity: 0, duration: 0.2, ease: 'Sine.In'});
        textZoomElement.value?.classList.remove('S=on');
    }, 1500);
}
        
onMounted(async () => {
    try {
        goodsInformation.value = await goodsRepository.getGoodsDetailInformation(goodsId.value);
        emit('informationSet', goodsInformation.value);
    }
    catch (e) {
        console.log(e);
    }
});
</script>

<style lang="scss">
.mm_editor img{
    max-width: 100% !important;
}
</style>