<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>1:1 고객상담</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_inner m_popup-inquiry">
                            <MMSelect 
                                v-model="qnaCreateForm.type"
                                @change="() => {
                                    qnaCreateForm.subType = ''; 
                                    qnaCreateForm.orderId = ''; 
                                    qnaCreateForm.orderItemIds = [];
                                }"
                            >
                                <option value="">
                                    1차 문의 유형선택
                                </option>
                                <option v-for="qnaType in qnaTypes" :key="qnaType.code" :value="qnaType.code">
                                    {{ qnaType.label }}
                                </option>
                            </MMSelect>
                            <MMSelect v-model="qnaCreateForm.subType">
                                <option value="">
                                    2차 문의 유형선택
                                </option>
                                <option v-for="subType in qnaSubTypes" :key="subType.code" :value="subType.code">
                                    {{ subType.label }}
                                </option>
                            </MMSelect>
                            <div class="mm_syncer-inquiry-order" :class="isQnaTypeWithOrder ? 'S=option-use' : ''">
                                <MMSelect v-model="qnaCreateForm.orderId" @change="qnaCreateForm.orderItemIds = []">
                                    <option value="">
                                        주문번호 선택
                                    </option>
                                    <option v-for="order in inquirableOrders" :key="order.orderId" :value="order.orderId">
                                        {{ `${order.orderId} (주문일: ${MMFilters.formatDate(order.orderedAt, 'YYYY-MM-DD')})` }}
                                    </option>
                                </MMSelect>
                                <div 
                                    :class="[
                                        'mm_product-select T=inquiry', 
                                        { 'S=select-complete': qnaCreateForm.orderItemIds.length > 0 }
                                    ]"
                                >
                                    <div 
                                        :class="['mm_dropdown', { 'S=on': dropdownOn }]"
                                        @mouseleave="dropdownOn = false"
                                    >
                                        <button 
                                            type="button"
                                            class="btn_dropdown"
                                            :title="dropdownOn ? '접어놓기' : '펼쳐보기'" 
                                            @click="toggleOrderItemDropdown()"
                                        >
                                            <b>상품을 선택해주세요</b>
                                            <i class="ico_dropdown T=bold" />
                                        </button>
                                        <div 
                                            class="mm_dropdown-item"
                                            :style="dropdownOn ? { height: 'auto'} : {}"
                                        >
                                            <div 
                                                v-if="orderItems.length"
                                                class="mm_dropdown-item-inner"
                                            >
                                                <div class="mm_scroller">
                                                    <div class="mm_product-list T=xs">
                                                        <ul>
                                                            <li v-for="orderItem in orderItems" :key="orderItem.id">
                                                                <div class="mm_product-item">
                                                                    <a @click="selectOrderItem(orderItem.id); dropdownOn = false">
                                                                        <figure>
                                                                            <i v-lazyload="{ src: orderItem.thumbnailUrl }" class="mm_bg-cover image_product" />
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
                                    <div v-if="selectedOrderItems.length > 0" class="mm_product-select-complete">
                                        <div class="mm_scroller">
                                            <div class="mm_product-list T=xs">
                                                <ul>
                                                    <li v-for="orderItem in selectedOrderItems" :key="orderItem.id">
                                                        <div class="mm_product-item">
                                                            <a>
                                                                <figure>
                                                                    <i v-lazyload="{ src: orderItem.thumbnailUrl }" class="mm_bg-cover image_product" />
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
                            </div>
                            <h6 class="mm_text-label">
                                <b>문의 제목</b>
                            </h6>
                            <MMInput 
                                v-model="qnaCreateForm.title"
                                :place-holder-text="'문의 제목을 입력하세요'"
                                :use-trim="false"
                                :max-length="50"
                            />
                            <h6 class="mm_text-label">
                                <b>문의 내용</b>
                            </h6>
                            <MMTextarea
                                v-model="qnaCreateForm.contents"
                                :max-byte="2000"
                                :place-holder-text="'최소 10자 이상 입력하세요<br>개인정보 입력 시 사전 고지없이 삭제될 수 있습니다'"
                                :resize="{ isUse: true, min: 5, max: 10 }"
                            />
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=primary" @click="storeQna">
                                        <b>등록하기</b>
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
    </MMPopup>
</template>

<script setup lang='ts'>
import MMPopup from '@/components/layout/Popup.vue';
import { onMounted, ref } from 'vue';
import { mmon } from '$/helper/mmon';
import MMSelect from '@/components/input/Select.vue';
import MMTextarea from '@/components/input/Textarea.vue';
import { dropdown as vDropdown } from '$/directives'
import { useQnaCreate } from '$/composables/mypage/qnaComposable';
import { defaultCatch } from '$/functions';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const { router, usePageTitleSetting } = usePageContext();
usePageTitleSetting('1:1 문의하기', ['마이페이지']);

const {
    qnaTypes,
    qnaSubTypes,
    isQnaTypeWithOrder,
    inquirableOrders,
    orderItems,
    selectedOrderItems,
    qnaCreateForm,
    selectOrderItem,
    unselectOrderItem,
    prepareQnaCreate,
    store,
} = useQnaCreate();

const dropdownOn = ref(false);

/**
 * 문의 주문상품 선택 dropdown toggle
 */
function toggleOrderItemDropdown() {
    if (!qnaCreateForm.value.orderId && !dropdownOn.value) {
        return mmon.bom.alert("주문번호를 선택해주세요.");
    }
    
    dropdownOn.value = !dropdownOn.value
}

/**
 * 문의 작성 요청
 */
async function storeQna() {
    try {
        mmon.loading.show();
        await store();
        mmon.bom.alert('문의 등록이 완료되었습니다.', () => {
            router.push({ name: 'MypageInquiryQnaList' });
        });
    } catch (e) {
        defaultCatch(e)
    } finally {
        mmon.loading.hide();
    }
}

onMounted(async () => {
    try {
        await prepareQnaCreate();
    } catch (e) {
        defaultCatch(e, undefined, () => {
            router.go(-1);
        });
    }
});
</script>