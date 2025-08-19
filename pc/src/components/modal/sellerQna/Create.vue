<template>
    <!-- 업체정보 -->
    <div class="m_modal-inquiry-head">
        <dl><dt>업체정보</dt><dd>{{ seller.name }}/{{ seller.tel }}</dd></dl>
    </div>
    <!--// 업체정보 -->
    <!-- 상품정보 -->
    <!--
        (D) 단일/묶음상품에 따라 노출되는 'mm_product-select(상품정보)'의 형태가 다릅니다.
        1. 상품정보 자동노출 형태 : 단일 상품 주문건, '마이페이지 > MY리뷰'에서 리뷰수정 버튼 클릭 시
        2. 상품 선택 형태 : 주문관리 페이지에서 한 셀러에게 2개 이상 구매한 상품 주문건
    -->
    <!-- 상품정보 : 선택형 -->
    <div 
        :class="[
            'mm_product-select T=inquiry', 
            { 'S=selected-complete': sellerQnaCreateForm.orderItemIds.length > 0 }
        ]"
    >
        <div 
            :class="['mm_dropdown', { 'S=on': dropdownOn }]"
            @focusout="dropdownOn = false"
        >
            <button 
                type="button"
                class="btn_dropdown"
                :title="dropdownOn ? '접어놓기' : '펼쳐보기'" 
                @click="dropdownOn = !dropdownOn"
            >
                <b>문의 상품을 선택하세요</b><i class="ico_dropdown T=bold" />
            </button>
            <div 
                class="mm_dropdown-item"
                :style="dropdownOn ? { height: 'auto'} : {}"
            >
                <div v-if="inquirableOrderItems.length" class="mm_dropdown-item-inner">
                    <div class="mm_scroller">
                        <ul>
                            <li 
                                v-for="(orderItem, index) in inquirableOrderItems"
                                :key="`${index}_${orderItem.id}`"
                            >
                                <div class="mm_product-item T=single">
                                    <a 
                                        @mousedown="selectOrderItem(orderItem.id)"
                                    >
                                        <figure>
                                            <div class="mm_image-scale">
                                                <i v-lazyload="{ src: orderItem.thumbnailUrl }" class="mm_bg-cover image_product" />
                                            </div>
                                            <figcaption>
                                                <p class="text_product">{{ orderItem.goodsName }}</p>
                                                <p class="text_option">{{ orderItem.optionName }}</p>
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
        <!-- (D) 선택된 상품이 노출됩니다. -->
        <div v-if="selectedOrderItems.length > 0" class="mm_product-select-complete">
            <div class="mm_scroller">
                <ul>
                    <li v-for="orderItem in selectedOrderItems" :key="orderItem.id">
                        <div class="mm_product-item T=single">
                            <a>
                                <figure>
                                    <div class="mm_image-scale">
                                        <i v-lazyload="{ src: orderItem.thumbnailUrl }" class="mm_bg-cover image_product" />
                                    </div>
                                    <figcaption>
                                        <p class="text_product">{{ orderItem.goodsName }}</p>
                                        <p class="text_option">{{ orderItem.optionName }}</p>
                                    </figcaption>
                                </figure>
                            </a>
                        </div>
                        <button type="button" class="btn_remove" @click="unselectOrderItem(orderItem.id)">
                            <i class="ico_remove" /><b class="mm_ir-blind">삭제하기</b>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!--// 상품정보 : 선택형 -->

    <!-- 유형 선택 -->
    <h6 class="mm_text-label">
        <b>문의 유형</b>
    </h6>
    <MMSelect
        v-model="sellerQnaCreateForm.type"
        class="T=short"
    >
        <option value="">
            문의 유형을 선택하세요
        </option>
        <option
            v-for="qnaType in sellerQnaTypes"
            :key="qnaType.code"
            :value="qnaType.code"
        >
            {{ qnaType.label }}
        </option>
    </MMSelect>
    <!--// 유형 선택 -->

    <!-- 문의 작성 -->
    <h6 class="mm_text-label">
        <b>문의 제목</b>
    </h6>
    <MMInput
        v-model="sellerQnaCreateForm.title"
        maxlength="30"
        place-holder-text="문의 제목을 30자 이하로 입력하세요."
        :use-trim="false"
    />
    <h6 class="mm_text-label">
        <b>문의 내용</b>
    </h6>
    <MMTextarea
        v-model="sellerQnaCreateForm.contents"
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
        v-model="sellerQnaCreateForm.isPrivate"
        label="비공개"
    />
    <!--// 문의 작성 -->

    <!-- 하단 버튼 -->
    <div class="mm_foot">
        <div class="mm_btn_box">
            <button
                type="button"
                class="mm_btn T=primary"
                @click="storeSellerQna"
            >
                <b>등록하기</b>
            </button>
        </div>
    </div>
    <!--// 하단 버튼 -->

    <!-- 유의사항 -->
    <section class="mm_note">
        <h6 class="text_title">
            <i class="ico_note" /><b>판매자 문의 시 주의사항</b>
        </h6>
        <ul>
            <li>알림톡/SMS 답변 수신은 주문, 회원가입 시 작성한 정보를 기준으로 발송됩니다.</li>
            <li>주민등록번호, 전화번호, 이메일 등 개인 정보를 남기면 타인에 의해 도용될 수 있습니다.</li>
        </ul>
    </section>
    <!--// 유의사항 -->
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { Seller } from '$/@type/goods';
import MMSelect from '@/components/input/Select.vue';
import MMTextarea from '@/components/input/Textarea.vue';
import MMCheck from '@/components/input/Check.vue';
import { ModalCloseHandler } from '$/@type/Modal';
import { useSellerQnaCreate } from '$/composables/mypage/sellerQnaComposable';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';

/** VARIABLE */
const props = defineProps<{
    seller: Seller,
    orderId: string
    closer: ModalCloseHandler<void>,
}>();

const {
    sellerQnaCreateForm,
    sellerQnaTypes,
    inquirableOrderItems,
    selectedOrderItems,
    selectOrderItem,
    unselectOrderItem,
    prepareSellerQnaCreate,
    store,
} = useSellerQnaCreate(
    props.orderId, 
    props.seller.id
)

const dropdownOn = ref(false);

/**
 * 판매자문의 작성 요청
 */
async function storeSellerQna() {
    try {
        mmon.loading.show();
        await store();
        mmon.bom.alert('판매자 문의가 등록되었습니다.', () => {
            props.closer();
        });
    } catch (e) {
        defaultCatch(e)
    } finally {
        mmon.loading.hide();
    }
}

onMounted(async () => {
    try {
        await prepareSellerQnaCreate();
    } catch (e) {
        defaultCatch(e, undefined, () => {
            props.closer();
        });
    }
})
</script>
