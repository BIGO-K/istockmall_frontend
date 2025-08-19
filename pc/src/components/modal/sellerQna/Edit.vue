<template>
    <div
        v-if="sellerQna.seller"
        class="m_modal-inquiry-head"
    >
        <dl><dt>업체정보</dt><dd>{{ sellerQna.seller.name }}/{{ sellerQna.seller.tel }}</dd></dl>
    </div>
    <!--// 업체정보 -->

    <!-- 상품정보 : 자동노출 -->
    <div v-if="sellerQna.goodsList?.length" class="mm_product-select T=inquiry">
        <div class="mm_scroller">
            <ul>
                <li v-for="qnaGoods in sellerQna.goodsList" :key="qnaGoods.id">
                    <div class="mm_product-item T=single">
                        <a>
                            <figure>
                                <div class="mm_image-scale">
                                    <i v-lazyload="{ src: qnaGoods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                </div>
                                <figcaption>
                                    <p class="text_product">{{ qnaGoods.name }}</p>
                                    <p class="text_option">{{ qnaGoods.optionName }}</p>
                                </figcaption>
                            </figure>
                        </a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <!--// 상품정보 : 자동노출 -->

    <!-- 유형 선택 -->
    <h6 class="mm_text-label">
        <b>문의 유형</b>
    </h6>
    
    <div class="mm_form-select T=short">
        <label>
            <span class="text_disabled">{{ sellerQna.typeLabel }}</span>
            <i class="ico_form-select" />
        </label>
    </div>
    <!--// 유형 선택 -->

    <!-- 문의 작성 -->
    <h6 class="mm_text-label">
        <b>문의 제목</b>
    </h6>
    <MMInput
        v-model="sellerQnaEditForm.title"
        maxlength="30"
        place-holder-text="문의 제목을 30자 이하로 입력하세요."
        :use-trim="false"
    />
    <h6 class="mm_text-label">
        <b>문의 내용</b>
    </h6>
    <MMTextarea
        v-model="sellerQnaEditForm.contents"
        place-holder-text="최소 10자 이상 입력하세요."
        :max-byte="2000"
    />
    <div class="mm_note">
        <ul>
            <li>결제, 적립금, 환불 관련 문의는 고객센터 &#62; 1:1 고객상담을 통해 문의하세요.</li>
            <li>상품, 배송, 기타를 선택한 문의는 해당 상품의 상세페이지 &#62; Q&#38;A 영역에 노출됩니다.</li>
        </ul>
    </div>
    <MMCheck
        v-model="sellerQnaEditForm.isPrivate"
        label="비공개"
    />
    <!--// 문의 작성 -->

    <!-- 하단 버튼 -->
    <div class="mm_foot">
        <div class="mm_btn_box">
            <button
                type="button"
                class="mm_btn T=primary"
                @click="updateSellerQna"
            >
                <b>수정하기</b>
            </button>
        </div>
    </div>
    <!--// 하단 버튼 -->

    <!-- 유의사항 -->
    <section class="mm_note">
        <h6 class="text_title">
            <i class="ico_note" /><b>상품 문의 시 주의사항</b>
        </h6>
        <ul>
            <li>알림톡/SMS 답변 수신은 주문, 회원가입 시 작성한 정보를 기준으로 발송됩니다.</li>
            <li>주민등록번호, 전화번호, 이메일 등 개인 정보를 남기면 타인에 의해 도용될 수 있습니다.</li>
        </ul>
    </section>
    <!--// 유의사항 -->
</template>


<script setup lang='ts'>
import MMTextarea from '@/components/input/Textarea.vue';
import MMCheck from '@/components/input/Check.vue';
import { ModalCloseHandler } from '$/@type/Modal';
import { useSellerQnaEdit } from '$/composables/mypage/sellerQnaComposable';
import { onMounted } from 'vue';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';

const props = defineProps<{
    qnaId: number,
    closer: ModalCloseHandler<void>,
}>();

/** VARIABLE */
const { 
    sellerQna, 
    sellerQnaEditForm,
    getEditableSellerQna,
    initiateSellerQnaForm,
    update
} = useSellerQnaEdit(props.qnaId);

/**
 * 판매자문의 수정요청
 */
async function updateSellerQna() {
    try {
        mmon.loading.show();
        await update()
        mmon.bom.alert('판매자 문의가 수정되었습니다.', () => {
            props.closer()
        });
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

onMounted(async () => {
    try {
        await getEditableSellerQna()
        initiateSellerQnaForm();
    } catch (e) {
        defaultCatch(e, {
            404: '수정 가능한 판매자문의가 없습니다.'
        }, () => {
            props.closer();
        });
    }
})
</script>
