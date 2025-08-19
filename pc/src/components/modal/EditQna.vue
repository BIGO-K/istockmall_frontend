<template>
    <div class="mm_form-select T=short">
        <label>
            <span class="text_disabled">{{ qna.typeLabel }}</span>
            <i class="ico_form-select" />
        </label>
    </div>
    <div class="mm_form-select T=short">
        <label>
            <span class="text_disabled">{{ qna.subTypeLabel }}</span>
            <i class="ico_form-select" />
        </label>
    </div>
    <div
        v-if="qna.orderId && hasGoods"
        class="mm_syncer-inquiry-order"
        :class="{ 'S=option-use' : hasGoods }"
    >
        <div class="mm_form-select">
            <label>
                <span class="text_disabled">{{ `${qna.orderId} (주문일: ${MMFilters.formatDate(qna.orderedAt || '', 'YYYY-MM-DD')})` }}</span>
                <i class="ico_form-select" />
            </label>
        </div>
        <div class="mm_product-select T=inquiry S=selected-complete">
            <div class="mm_dropdown" />
            <!-- (D) 선택된 상품이 노출됩니다. -->
            <div class="mm_product-select-complete">
                <div class="mm_scroller">
                    <ul>
                        <li v-for="goods in qna.goodsList" :key="goods.id">
                            <div class="mm_product-item T=single">
                                <a>
                                    <figure>
                                        <div class="mm_image-scale">
                                            <i v-lazyload="{ src: goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                        </div>
                                        <figcaption>
                                            <p class="text_product">{{ goods.name }}</p>
                                            <p class="text_option">{{ goods.optionName }}</p>
                                        </figcaption>
                                    </figure>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- 문의 작성 -->
    <h6 class="mm_text-label">
        <b>문의 제목</b>
    </h6>
    <MMInput 
        v-model="qnaEditForm.title"
        :place-holder-text="'문의 제목을 입력하세요'"
        :use-trim="false"
        :max-length="50"
    />
    <h6 class="mm_text-label">
        <b>문의 내용</b>
    </h6>
    <MMTextarea
        v-model="qnaEditForm.contents"
        :max-byte="2000"
        :place-holder-text="'최소 10자 이상 입력하세요<br>개인정보 입력 시 사전 고지없이 삭제될 수 있습니다'"
        :resize="{ isUse: true, min: 5, max: 10 }"
    />
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
    <!--// 하단 버튼 -->

    <!-- 유의사항 -->
    <section class="mm_note">
        <h6 class="text_title">
            <i class="ico_note" /><b>유의사항</b>
        </h6>
        <ul>
            <li>주민번호, 전화번호, 이메일 등 개인정보를 남기면 타인에 의해 도용될 수 있으니 문의하기 작성 시 주의해주세요.</li>
            <li>이메일/SMS 답변 수신은 주문, 회원 가입 시 작성한 정보를 기준으로 발송됩니다.</li>
        </ul>
    </section>
    <!--// 유의사항 -->
</template>


<script setup lang='ts'>
import MMTextarea from '@/components/input/Textarea.vue';
import { ModalCloseHandler } from '$/@type/Modal';
import { useQnaEdit } from '$/composables/mypage/qnaComposable';
import { onMounted } from 'vue';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';

const props = defineProps<{
    qnaId: number,
    closer: ModalCloseHandler<void>
}>();

const { 
    qna,
    qnaEditForm,
    hasGoods,
    getEditableQna,
    initiateQnaForm,
    update,
} = useQnaEdit(props.qnaId);

/**
 * 문의 수정 요청
 */
async function updateQna() {
    try {
        mmon.loading.show();
        await update();
        mmon.bom.alert('문의 수정이 완료되었습니다.', () => {
            props.closer();
        });
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

onMounted(async () => {
    if (!props.qnaId) {
        return props.closer()
    }

    try {
        mmon.loading.show();
        await getEditableQna();
        initiateQnaForm();
    } catch (e) {
        defaultCatch(e, {
            404: '수정 가능한 1:1문의가 없습니다.'
        }, () => {
            props.closer()
        });
    } finally {
        mmon.loading.hide();
    }
})
</script>