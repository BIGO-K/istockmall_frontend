<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>상품 문의하기</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div v-if="qnaInfo" class="m_popup-inquiry">
                            <dl><dt>업체 정보</dt><dd>{{ qnaInfo.sellerName }}/{{ MMFilters.formatTel(qnaInfo.sellerTel) }}</dd></dl>
                            <p>
                                결제/적립금/환불 관련문의
                                <MMLink :to="{ name : 'CsCenter'}">
                                    <b>고객센터 바로가기</b>
                                    <i class="ico_link" />
                                </MMLink>
                            </p>
                            <div class="mm_product-item T=single-sm">
                                <a>
                                    <figure>
                                        <i v-lazyload="{ src: qnaInfo.goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                        <figcaption>
                                            <p class="text_brand">{{ qnaInfo.goods.brandName }}</p>
                                            <p class="text_product">{{ qnaInfo.goods.name }}</p>
                                        </figcaption>
                                    </figure>
                                </a>
                            </div>
                            <div class="mm_inner">
                                <h6 class="mm_text-label">
                                    <b>문의 유형</b>
                                </h6>
                                <div class="mm_form-select">
                                    <label>
                                        <span class="text_disabled">{{ qnaTypeLabel }}</span>
                                        <i class="ico_form-select" />
                                    </label>
                                </div>
                                <h6 class="mm_text-label">
                                    <b>문의 제목</b>
                                </h6>
                                <MMInput
                                    v-model="qnaForm.title"
                                    :place-holder-text="'문의 제목을 30자 이하로 입력하세요'"
                                    maxlength="30"
                                    :use-trim="false"
                                />
                                <h6 class="mm_text-label">
                                    <b>문의 내용</b>
                                </h6>
                                <mm-text-area
                                    v-model="qnaForm.contents"
                                    :max-byte="2000"
                                    :place-holder-text="'개인정보 입력 시 사전 고지없이 삭제될 수 있습니다<br> 최소 10자 이상 입력하세요'"
                                />
                                <label class="mm_form-check">
                                    <input v-model="qnaForm.isPrivate" type="checkbox" data-check>
                                    <b class="mm_block">
                                        <i class="ico_form-check" />
                                        <span class="text_label">비공개</span>
                                    </b>
                                </label>
                                <div class="mm_foot">
                                    <div class="mm_btn_box">
                                        <button type="button" class="mm_btn T=primary" @click="updateQna">
                                            <b>등록하기</b>
                                        </button>
                                    </div>
                                </div>
                                <div class="mm_note">
                                    <div :class="['mm_dropdown', { 'S=on' : dropdownOn }]" data-dropdown>
                                        <button type="button" class="btn_dropdown" title="펼쳐보기" @click="() => { dropdownOn = !dropdownOn }">
                                            <i class="ico_info" /><b>상품 문의 시 유의사항</b><i class="ico_dropdown T=box" />
                                        </button>
                                        <div class="mm_dropdown-item" :style="dropdownOn ? { height: 'auto' } : {}">
                                            <div class="mm_dropdown-item-inner">
                                                <ul>
                                                    <li>주문내역의 변경(확인)에 대한 내용, 주민등록번호, 연락처 등의 정보는 노출되지 않도록 주의해주세요.</li>
                                                    <li>비방, 음란 등 제반 법령에 저촉되거나 광고성 등 게시글은 사전 고지 없이 삭제될 수 있습니다.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </ModalPopup>
</template>


<script setup lang="ts">
import { SellerQnaType } from '$/@type/cs/inquiry/sellerQna';
import { QnaInfo } from '$/@type/goods';
import { sellerQnaRepository } from '$/repository/cs/sellerQnaRepository';
import { goodsRepository } from '$/repository/goodsRepository';
import ModalPopup from '@/components/layout/ModalPopup.vue'
import MmTextArea from '@/components/input/Textarea.vue'
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MmSelect from '@/components/input/Select.vue';
import { makeValidator } from '$/validator';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { useQnaDetail } from '$/composables/goods/detailComposable';

const route = useRoute();
const router = useRouter();
const goodsId = Number(route.params.id.toString());
const qnaInfo = ref<QnaInfo>();
const qnaTypeLabel = ref('');
const qnaForm = ref<{
    id: number;
    title: string,
    contents: string,
    isPrivate: boolean
}>({
    id: 0,
    title: '',
    contents: '',
    isPrivate: false
});

const dropdownOn = ref(false);

/**
 * 상품문의 등록처리
 */
async function updateQna() {
    const validator = makeValidator(qnaForm.value);

    validator.setRules({
        'title(문의 제목)': ['required', 'maxLength:30'],
        'contents(문의 내용)': ['required', 'minLength:10'],
    });

    validator.setMessages({
        'title.required': ':param(을/를) 입력해주세요.',
        'contents.required': ':param(을/를) 입력해주세요.',
    })

    mmon.loading.show();
    try {
        await validator.run();                       
        await goodsRepository.updateQna(goodsId, qnaForm.value);
        mmon.bom.alert('수정 되었습니다.', function() {
            mmon.loading.hide();
            router.go(-1);
        })
    } catch (error) {                
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }

}   

onMounted(async() => {
    const { qnaId } = useQnaDetail();

    if (qnaId.value === 0) {
        return router.go(-1);
    }
    
    qnaInfo.value = await goodsRepository.goodsQnaInfo(goodsId);
    const qna = await goodsRepository.showQna(goodsId, qnaId.value);

    if (qna !== null) {
        qnaForm.value.id = qna.id
        qnaForm.value.title = qna.title;
        qnaForm.value.contents = qna.contents;
        qnaForm.value.isPrivate = qna.isPrivate;
        qnaTypeLabel.value = qna.typeLabel;
    }
})
</script>
