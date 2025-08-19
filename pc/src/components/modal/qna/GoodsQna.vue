<template>
    <!-- 업체정보 -->
    <div class="m_modal-inquiry-head">
        <dl><dt>업체정보</dt><dd>{{ qnaInfo?.sellerName }}/{{ qnaInfo?.sellerTel }}</dd></dl>
        <p>
            결제/적립금/환불 관련문의
            <MMLink
                :to="{ name : 'CsCenter'}"
                class="mm_btn T=xs T=line"
            >
                <b>고객센터</b><i class="ico_link T=xs" />
            </MMLink>
        </p>
    </div>
    <!--// 업체정보 -->

    <!-- 상품정보 -->
    <div class="mm_product-select">
        <div class="mm_product-item T=single T=sm">
            <a>
                <figure v-if="qnaInfo?.goods">
                    <div class="mm_image-scale"><i
                        v-lazyload="{ src: qnaInfo.goods.thumbnailUrl }"
                        class="mm_bg-cover image_product"
                    /></div>
                    <figcaption>
                        <p class="text_product">{{ qnaInfo.goods.name }}</p>
                        <!-- <p class="text_option">{{ goods.optionName }} / 1개</p> -->
                    </figcaption>
                </figure>
            </a>
        </div>
    </div>
    <!--// 상품정보 -->

    <!-- 유형 선택 -->
    <h6 class="mm_text-label">
        <b>문의 유형</b>
    </h6>
    <mm-select
        v-model="qnaForm.qnaTypeCode" 
        class="T=short"
    >
        <option value="">
            문의 유형을 선택하세요
        </option>
        <option
            v-for="qnaType in qnaTypes"
            :key="qnaType.code"
            :value="qnaType.code"
        >
            {{ qnaType.label }}
        </option>
    </mm-select>
    <!--// 유형 선택 -->

    <!-- 문의 작성 -->
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
        :place-holder-text="'최소 10자 이상 입력하세요'"
    />
    <label class="mm_form-check">
        <input
            v-model="qnaForm.isPrivate"
            type="checkbox"
            data-check
            checked
        >
        <b class="mm_block">
            <i class="ico_form-check" />
            <span class="text_label">비공개</span>
        </b>
    </label>
    <!--// 문의 작성 -->

    <!-- 하단 버튼 -->
    <div class="mm_foot">
        <div class="mm_btn_box">
            <button
                type="button"
                class="mm_btn T=primary"
                @click="registQna"
            >
                <b>등록하기</b>
            </button>
        </div>
    </div>
    <!--// 하단 버튼 -->

    <!-- 유의사항 -->
    <section class="mm_note">
        <h6 class="text_title">
            <i class="ico_note" /><b>상품문의 시 유의사항</b>
        </h6>
        <ul>
            <li>주문내역의 변경(확인)에 대한 내용, 주민등록번호, 연락처 등의 정보는 노출되지 않도록 주의해주세요.</li>
            <li>비방, 음란 등 제반 법령에 저촉되거나 광고성 등 게시글은 사전 고지 없이 삭제될 수 있습니다.</li>
        </ul>
    </section>
    <!--// 유의사항 -->
</template>


<script setup lang='ts'>
import type { SellerQnaType } from '$/@type/cs/inquiry/sellerQna';
import { ref, computed } from 'vue';
import { defaultCatch } from '$/functions';
import { goodsRepository } from '$/repository/goodsRepository';
import MmSelect from '@/components/input/Select.vue';
import MmTextArea from '@/components/input/Textarea.vue';
import { mmon } from '$/helper/mmon';
import { makeValidator } from '$/validator';
import { QnaInfo } from '$/@type/goods';
import { ModalCloseHandler } from '$/@type/Modal';
/** VARIABLE */

const props = defineProps<{
    goodsId: number,
    qnaInfo: QnaInfo,
    qnaTypes: SellerQnaType[],
    closer: ModalCloseHandler<void>
}>();

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

const selectAbleCodes = computed(() => {
    return props.qnaTypes.map((qnaType) => {
        return qnaType.code
    })
})
/** FUNCTION */
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

    try {
        await validator.run();               
        mmon.loading.show();
        await goodsRepository.storeGoodsQna(props.goodsId, qnaForm.value);
        mmon.bom.alert('등록되었습니다.', function() {
            props.closer();
        })
    } catch (error) {                
        defaultCatch(error);
        // console.log(error);
    } finally {
        mmon.loading.hide();
    }

}   

/** VUE LIFE CYCLE */

</script>


