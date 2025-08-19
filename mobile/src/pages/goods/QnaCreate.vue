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
                                <MMLink :to="{ name : 'CsCenter', replace: true }">
                                    <b>고객센터 바로가기</b><i class="ico_link" />
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
                                <MMSelect 
                                    v-model="qnaForm.qnaTypeCode"
                                >
                                    <option value="">
                                        문의 유형을 선택하세요
                                    </option>
                                    <option v-for="qnaType in qnaTypes" :key="qnaType.code" :value="qnaType.code">
                                        {{ qnaType.label }}
                                    </option>
                                </MMSelect>
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
                                <MMTextArea
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
                                        <button type="button" class="mm_btn T=primary" @click="registQna">
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
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'; 
import { makeValidator } from '$/validator';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { useQnaDetail } from '$/composables/goods/detailComposable';
import ModalPopup from '@/components/layout/ModalPopup.vue'
import MMTextArea from '@/components/input/Textarea.vue';
import MMSelect from '@/components/input/Select.vue';

const router = useRouter();
const { goodsId } = useQnaDetail();
const qnaInfo = ref<QnaInfo>();
const qnaTypes = ref<SellerQnaType[]>([]);
const qnaForm = ref<{
    title: string,
    qnaTypeCode: number,
    contents: string,
    isPrivate: boolean
}>({
    title: '',
    qnaTypeCode: 0,
    contents: '',
    isPrivate: false
});


const dropdownOn = ref(false);

const selectAbleCodes = computed(() => {
    return qnaTypes.value.map((qnaType) => {
        return qnaType.code
    })
})

/**
* 상품문의 등록처리
*/
async function registQna() {
    const validator = makeValidator(qnaForm.value);

    validator.setRules({                
        'qnaTypeCode(문의 유형)': ['required',`in:${selectAbleCodes.value.join(',')}`],
        'title(문의 제목)': ['required', 'maxLength:30'],
        'contents(문의 내용)': ['required', 'minLength:10'],
    });

    validator.setMessages({                
        'qnaTypeCode.required' : ':param(을/를) 선택해주세요.',            
        'qnaTypeCode.in' : ':param(을/를) 선택해주세요.',
        'title.required': ':param(을/를) 입력해주세요.',
        'contents.required': ':param(을/를) 입력해주세요.',
    })

    mmon.loading.show();
    try {
        await validator.run();                       
        await goodsRepository.storeGoodsQna(goodsId.value, qnaForm.value);
        mmon.bom.alert('등록되었습니다.', function() {
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
    if (!goodsId.value) {
        return router.go(-1);
    }
            
    const [qnaTypesPromise, qnaInfoPromise] = await Promise.all(
        [
            sellerQnaRepository.getTypes(true),
            goodsRepository.goodsQnaInfo(goodsId.value)
        ]
    )
    qnaTypes.value = qnaTypesPromise;
    qnaInfo.value = qnaInfoPromise;
})
</script>