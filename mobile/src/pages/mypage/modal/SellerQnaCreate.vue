<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>판매자 문의하기</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-inquiry">
                            <dl><dt>판매자 정보</dt><dd>{{ seller.name }}/{{ seller.tel }}</dd></dl>
                            <div class="mm_inner">
                                <div 
                                    :class="[
                                        'mm_product-select T=inquiry', 
                                        { 'S=selected-complete': sellerQnaCreateForm.orderItemIds.length > 0 }
                                    ]"
                                >
                                    <div 
                                        :class="['mm_dropdown', { 'S=on': dropdownOn }]"
                                        data-dropdown
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
                                                    <div class="mm_product-list T=xs">
                                                        <ul>
                                                            <li
                                                                v-for="(orderItem, index) in inquirableOrderItems"
                                                                :key="`${index}_${orderItem.id}`"
                                                            >
                                                                <div class="mm_product-item">
                                                                    <a @mousedown="selectOrderItem(orderItem.id)">
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
                                    </div>
                                    <!-- (D) 선택된 상품이 노출됩니다. -->
                                    <div v-if="selectedOrderItems.length > 0" class="mm_product-select-complete">
                                        <div class="mm_scroller">
                                            <div class="mm_product-list T=xs">
                                                <ul>
                                                    <li v-for="orderItem in selectedOrderItems" :key="orderItem.id">
                                                        <div class="mm_product-item">
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
                                </div>
                                <MMSelect v-model="sellerQnaCreateForm.type">
                                    <option value="">
                                        문의 유형을 선택하세요
                                    </option>
                                    <option v-for="qnaType in sellerQnaTypes" :key="qnaType.code" :value="qnaType.code">
                                        {{ qnaType.label }}
                                    </option>
                                </MMSelect>
                                <h6 class="mm_text-label">
                                    <b>문의 제목</b>
                                </h6>
                                <MMInput
                                    v-model="sellerQnaCreateForm.title"
                                    maxlength="30"
                                    place-holder-text="문의 제목을 입력하세요."
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
                                        <li>결제, 적립금, 환불 관련 문의는 고객센터 &#62; 1:1 고객 상담를 통해 문의하세요.</li>
                                        <li>상품, 배송, 기타를 선택한 문의는 해당 상품의 상세 페이지 &#62; Q&#38;A 영역에 노출됩니다.</li>
                                    </ul>
                                </div>
                                <MMCheck v-model="sellerQnaCreateForm.isPrivate" label="비공개" />
                                <div class="mm_foot">
                                    <div class="mm_btn_box">
                                        <button type="button" class="mm_btn T=primary" @click="storeSellerQna">
                                            <b>문의하기</b>
                                        </button>
                                    </div>
                                </div>
                                <div class="mm_note">
                                    <div v-dropdown class="mm_dropdown">
                                        <button type="button" class="btn_dropdown" title="접어놓기">
                                            <i class="ico_info" /><b>판매자 문의 시 유의사항</b><i class="ico_dropdown T=box" />
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
import MMSelect from '@/components/input/Select.vue';
import MMTextarea from '@/components/input/Textarea.vue';
import MMCheck from '@/components/input/Check.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { dropdown as vDropdown } from '$/directives'
import { useSellerQnaCreate, useSellerQnaCreateModalPopup } from '$/composables/mypage/sellerQnaComposable';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';

const router = useRouter();

const { 
    sellerQnaModalData: {
        orderId,
        seller,
    } 
} = useSellerQnaCreateModalPopup()

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
    orderId.value, 
    seller.value.id
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
            router.go(-1)
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
            router.go(-1)
        });
    }
})

</script>
