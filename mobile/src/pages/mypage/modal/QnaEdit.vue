<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>1:1 고객상담 수정</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_inner m_popup-inquiry">
                            <div class="mm_form-select">
                                <label>
                                    <span class="text_disabled">{{ qna.typeLabel }}</span>
                                    <i class="ico_form-select" />
                                </label>
                            </div>
                            <div class="mm_form-select">
                                <label>
                                    <span class="text_disabled">{{ qna.subTypeLabel }}</span>
                                    <i class="ico_form-select" />
                                </label>
                            </div>
                            <div v-if="qna.orderId && hasGoods" class="mm_syncer-inquiry-order" :class="hasGoods ? 'S=option-use' : ''">
                                <div class="mm_form-select">
                                    <label>
                                        <span class="text_disabled">{{ `${qna.orderId} (주문일: ${MMFilters.formatDate(qna.orderedAt || '', 'YYYY-MM-DD')})` }}</span>
                                        <i class="ico_form-select" />
                                    </label>
                                </div>
                                
                                <div class="mm_product-select T=inquiry">
                                    <!-- (D) 선택된 상품이 노출됩니다. -->
                                    <div class="mm_product-select-complete">
                                        <div class="mm_scroller">
                                            <div class="mm_product-list T=xs">
                                                <ul>
                                                    <li v-for="goods in qna.goodsList" :key="goods.id">
                                                        <div class="mm_product-item">
                                                            <a>
                                                                <figure>
                                                                    <i v-lazyload="{ src: goods.thumbnailUrl }" class="mm_bg-cover image_product" />
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
                            </div>
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
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=primary" @click="updateQna">
                                        <b>수정하기</b>
                                    </button>
                                </div>
                            </div>
                            <div class="mm_note">
                                <div v-dropdown class="mm_dropdown">
                                    <button type="button" class="btn_dropdown" title="접어놓기">
                                        <i class="ico_info" /><b>1:1 고객상담 문의 시 유의사항</b><i class="ico_dropdown T=box" />
                                    </button>
                                    <div class="mm_dropdown-item">
                                        <div class="mm_dropdown-item-inner">
                                            <ul>
                                                <li>주민등록번호, 전화번호, 이메일 등 개인정보를 남기면 타인에 의해 도용될 수 있으니 문의하기 작성 시 주의해 주세요.</li>
                                                <li>이메일/SMS 답변 수신은 주문, 회원가입 시 작성한 정보를 기준으로 발송됩니다.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import ModalPopup from '@/components/layout/ModalPopup.vue';
import MMTextarea from '@/components/input/Textarea.vue';
import { useQnaEdit, useQnaEditModal } from '$/composables/mypage/qnaComposable';
import { dropdown as vDropdown } from '$/directives'
import { useRouter } from 'vue-router';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { onMounted } from 'vue';

const router = useRouter();
const { qnaId } = useQnaEditModal();
const { 
    qna,
    qnaEditForm,
    hasGoods,
    update,
    getEditableQna,
    initiateQnaForm,
} = useQnaEdit(qnaId.value);


/**
 * 문의 수정 요청
 */
async function updateQna() {
    try {
        mmon.loading.show();
        await update();
        mmon.bom.alert('문의 수정이 완료되었습니다.', () => {
            router.go(-1)
        });
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

onMounted(async () => {
    if (!qnaId.value) {
        return router.go(-1)
    }

    try {
        mmon.loading.show();
        await getEditableQna();
        initiateQnaForm();
    } catch (e) {
        defaultCatch(e, {
            404: '수정 가능한 1:1문의가 없습니다.'
        }, () => {
            router.go(-1)
        });
    } finally {
        mmon.loading.hide();
    }
})
</script>
