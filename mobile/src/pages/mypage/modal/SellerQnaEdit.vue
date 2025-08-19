<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>상품 문의하기</b></h1>
        </template>

        <template v-if="sellerQna" #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-inquiry">
                            <dl v-if="sellerQna.seller">
                                <dt>판매자 정보</dt><dd>{{ sellerQna.seller.name }}/{{ sellerQna.seller.tel }}</dd>
                            </dl>
                            <div v-if="sellerQna.goodsList?.length" class="mm_product-select T=inquiry-list">
                                <div class="mm_scroller">
                                    <div class="mm_product-list T=xs">
                                        <ul>
                                            <li v-for="qnaGoods in sellerQna.goodsList" :key="qnaGoods.id">
                                                <div class="mm_product-item">
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
                            </div>
                            <div class="mm_inner">
                                <h6 class="mm_text-label">
                                    <b>문의 유형</b>
                                </h6>
                                <div class="mm_form-select">
                                    <label>
                                        <span class="text_disabled">{{ sellerQna.typeLabel }}</span>
                                        <i class="ico_form-select" />
                                    </label>
                                </div>
                                <h6 class="mm_text-label">
                                    <b>문의 제목</b>
                                </h6>
                                <MMInput
                                    v-model="sellerQnaEditForm.title"
                                    maxlength="30"
                                    place-holder-text="문의 제목을 입력하세요."
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
                                        <li>결제, 적립금, 환불 관련 문의는 고객센터 &#62; 1:1 고객 상담를 통해 문의하세요.</li>
                                        <li>상품, 배송, 기타를 선택한 문의는 해당 상품의 상세 페이지 &#62; Q&#38;A 영역에 노출됩니다.</li>
                                    </ul>
                                </div>
                                <MMCheck v-model="sellerQnaEditForm.isPrivate" label="비공개" />
                                <div class="mm_foot">
                                    <div class="mm_btn_box">
                                        <button type="button" class="mm_btn T=primary" @click="updateSellerQna">
                                            <b>수정하기</b>
                                        </button>
                                    </div>
                                </div>
                                <div class="mm_note">
                                    <div v-dropdown class="mm_dropdown">
                                        <button type="button" class="btn_dropdown" title="접어놓기">
                                            <i class="ico_info" /><b>상품 문의 시 유의사항</b><i class="ico_dropdown T=box" />
                                        </button>
                                        <div class="mm_dropdown-item">
                                            <div class="mm_dropdown-item-inner">
                                                <ul>
                                                    <li>알림톡/SMS 답변 수신은 주문, 회원가입 시 작성한 정보를 기준으로 발송됩니다.</li>
                                                    <li>주민등록번호, 전화번호, 이메일 등 개인 정보를 남기면 타인에 의해 도용될 수 있습니다.</li>
                                                </ul>
                                            </div>
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
import MMCheck from '@/components/input/Check.vue';
import { dropdown as vDropdown } from '$/directives'
import { useRouter } from 'vue-router';
import { useSellerQnaEdit, useSellerQnaEditModalPopup } from '$/composables/mypage/sellerQnaComposable';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { onMounted } from 'vue';

const router = useRouter();

/** VARIABLE */
// 수정할 판매자문의 
const { 
    sellerQnaId,
} = useSellerQnaEditModalPopup();

// 판매자문의 수정 composable
const { 
    sellerQna, 
    sellerQnaEditForm,
    getEditableSellerQna,
    initiateSellerQnaForm,
    update
} = useSellerQnaEdit(sellerQnaId.value);

/**
 * 판매자문의 수정요청
 */
async function updateSellerQna() {
    try {
        mmon.loading.show();
        await update()
        mmon.bom.alert('판매자 문의가 수정되었습니다.', () => {
            router.go(-1)
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
            router.go(-1)
        });
    }
})
</script>
