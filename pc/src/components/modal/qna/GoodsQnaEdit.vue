<template>
    <!-- 업체정보 -->
    <div class="m_modal-inquiry-head">
        <dl><dt>업체정보</dt><dd>{{ qna.goods.sellerName }}/{{ qna.goods.sellerTel }}</dd></dl>
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
    <div class="mm_product-select">
        <div class="mm_product-item T=single T=sm">
            <a>
                <figure>
                    <div class="mm_image-scale"><i
                        v-lazyload="{ src: qna.goods.thumbnailUrl }"
                        class="mm_bg-cover image_product"
                    /></div>
                    <figcaption>
                        <p class="text_product">{{ qna.goods.name }}</p>
                        <!-- <p class="text_option">화이트 FREE / 1개</p> -->
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
    <div class="mm_form-select T=short">
        <label>
            <span class="text_disabled">{{ qna.typeLabel }}</span>
            <i class="ico_form-select" />
        </label>
    </div>         
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
                @click="updateQna"
            >
                <b>수정하기</b>
            </button>
        </div>
    </div>

    <!-- 유의사항 -->
    <section
        v-once
        class="mm_note"
    >
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
import { ref } from 'vue'
import { makeValidator } from '$/validator';
import { defaultCatch } from '$/functions';
import { goodsRepository } from '$/repository/goodsRepository';
import MmTextArea from '@/components/input/Textarea.vue';
import { GoodsQnaDetail } from '$/@type/goods';
import { mmon } from '$/helper/mmon';
import { ModalCloseHandler } from '$/@type/Modal';

const props = defineProps<{
    goodsId: number,
    qna: GoodsQnaDetail,
    qnaTypes: SellerQnaType[],
    closer: ModalCloseHandler<void>
}>();

/** VARIABLE */
const qnaForm = ref<{
    id: number,
    title: string,
    contents: string,
    isPrivate: boolean
}>({
    id: props.qna.id,
    title: props.qna.title,
    contents: props.qna.contents,
    isPrivate: props.qna.isPrivate
});       

/**
 * 상품문의 수정 처리
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

    try {
        await validator.run();     
        mmon.loading.show();
        await goodsRepository.updateQna(props.goodsId, qnaForm.value);        
        mmon.bom.alert('수정 되었습니다.', function() {            
            props.closer();
        })
    } catch (error) {                
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}   
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>
