<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>주문 반품</b></h1>
        </template>

        <template #contents>
            <div v-if="process.orderItemSelect" class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 주문목록 -->
                        <article class="mm_order-item">
                            <h5>
                                <b>{{ MMFilters.formatDate(returnableOrder.orderedAt, "YYYY.MM.DD") }}</b>
                                <strong>주문번호: {{ returnableOrder.orderId }}</strong>
                            </h5>
                            <div 
                                v-for="pack in returnableOrder.packs"
                                :key="pack.shippingRuleId"
                                class="mm_order-item-seller"
                            >
                                <div class="mm_order...seller-head">
                                    <p class="text_ship">
                                        <i class="ico_ship" />
                                        <span v-if="pack.paidShippingPrice === 0">무료배송</span>
                                        <span v-else class="text_price">
                                            <strong>{{ MMFilters.formatNumber(pack.paidShippingPrice) }}</strong>
                                        </span>
                                    </p>
                                </div>
                                <div class="mm_product-list T=sm">
                                    <ul>
                                        <li v-for="orderItemSet in pack.orderItemSets" :key="orderItemSet.id">
                                            <MMCheck
                                                v-model="checkedOrderItemSetIds"
                                                :value="orderItemSet.id"
                                                label="상품 선택"
                                                :is-blind-label="true"
                                            />
                                            <p class="text_seller">
                                                <i class="ico_shop" />{{ orderItemSet.sellerName }}
                                            </p>
                                            <MMOrderGoods 
                                                :goods="orderItemSet.goods"
                                                :price="orderItemSet.totalPaidPrice + orderItemSet.totalPointUsed"
                                            >
                                                <template #order-status>
                                                    <p class="text_status">
                                                        {{ orderItemSet.orderStatusLabel }}
                                                    </p>
                                                </template>
                                                <template #footer>
                                                    <div v-if="orderItemSet.items.length > 1" class="mm_product...footer-indent">
                                                        <p>반품 수량: {{ selectedOrderItemIds[orderItemSet.id]?.length || 0 }}개</p>
                                                        <a 
                                                            class="mm_btn T=sm T=line T=primary"
                                                            href="#ORDER_ITEM_SELECT"
                                                            @click.capture="openOrderItemSelectModal(orderItemSet, orderItemSet.sellerName)"
                                                        >
                                                            <b>부분 선택</b>
                                                        </a>
                                                    </div>
                                                    <p class="text_point">
                                                        사용 {{ pointLabel.name }}
                                                        <b>
                                                            <strong>{{ MMFilters.formatNumber(orderItemSet.totalPointUsed) }}</strong>
                                                            <sub>{{ pointLabel.suffix }}</sub>
                                                        </b>
                                                    </p>
                                                </template>
                                            </MMOrderGoods>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </article>
                        <!--// 주문목록 -->

                        <!-- 반품신청 -->
                        <div class="mm_inner">
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=primary" @click="toReasonSelect">
                                        <b>다음 단계로</b>
                                    </button>
                                </div>
                            </div>
                            <div class="mm_note">
                                <div v-dropdown="{ isOn: true }" class="mm_dropdown">
                                    <button type="button" class="btn_dropdown" title="접어놓기">
                                        <i class="ico_info" /><b>반품 주의사항</b><i class="ico_dropdown T=box" />
                                    </button>
                                    <div class="mm_dropdown-item">
                                        <div class="mm_dropdown-item-inner">
                                            <ul>
                                                <li>주문 제작하신 상품 및 해외 배송 상품은 반품이 불가하여 리스트에 노출되지 않습니다.</li>
                                                <li>반품은 배송 완료 이후 7일 이내 신청 가능합니다.</li>
                                                <li>반품 사유별 배송비 부담이 상이합니다.</li>
                                                <li>묶음 반품의 경우 동일한 업체에 한해서 가능합니다.</li>
                                                <li>반품하실 상품을 발송하기 전에 한해서 반품 철회가 가능합니다.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--// 반품신청 -->
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
            <div v-else class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- (D) '.mm_process' 영역은 단계별 입력 페이지로 현재 순서에 해당하는 '.mm_process-item' 영역에 'S=process-on' 클래스가 추가됩니다. -->
                        <div class="mm_process">
                            <!-- 반품사유 -->
                            <div class="mm_process-item" :class="process.reasonSelect ? 'S=process-on' : ''">
                                <div class="mm_inner">
                                    <h3 class="mm_heading m_popup-myclaim-title">
                                        <b>반품 사유를 선택하세요</b>
                                    </h3>
                                    <div class="m_popup-myclaim-reason">
                                        <ul>
                                            <li v-for="reason in returnReasons" :key="reason.code">
                                                <MMRadio v-model="returnForm.returnReason" :value="reason.code" name="return_reason">
                                                    <b class="mm_block">
                                                        <i class="ico_form-radio" />
                                                        <i :class="`ico_my-${reason.iconClassName}`">
                                                            <i v-if="reason.iconClassName !== 'other'" class="ico_my-cancel" />
                                                            <i v-else class="ico_my-question" />
                                                        </i>
                                                        <strong>{{ reason.label }}</strong>
                                                        <span v-if="reason.censure === 'orderer'">구매자 반품비용 부담</span>
                                                        <span v-if="reason.censure === 'seller'">판매자 반품비용 부담</span>
                                                    </b>
                                                </MMRadio>
                                            </li>
                                        </ul>
                                        <div class="mm_syncer-reason" :class="isReasonDetailRequired ? 'S=radio-use' : ''">
                                            <h6 class="mm_strapline">
                                                <b>상세사유</b><strong>(필수입력)</strong>
                                            </h6>
                                            <MMTextarea
                                                v-model="returnForm.returnReasonDetail"
                                                :maxlength="100"
                                                place-holder-text="상세 사유를 입력하세요"
                                            />
                                        </div>
                                    </div>
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <div class="mm_flex T=auto">
                                                <a 
                                                    class="mm_btn T=line T=light btn_back"
                                                    href="#" 
                                                    @click.prevent="toOrderItemSelect"
                                                >
                                                    <i class="ico_page-prev" /><b>이전으로</b>
                                                </a>
                                                <button type="button" class="mm_btn T=primary" @click="toRetrieveMethodSelect">
                                                    <b>다음 단계로</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 반품사유 -->

                            <!-- 반품방법 -->
                            <div class="mm_process-item" :class="process.retrieveMethodSelect ? 'S=process-on' : ''">
                                <div class="mm_inner">
                                    <h3 class="mm_heading m_popup-myclaim-title">
                                        <b>반품 방법을 선택하세요</b>
                                    </h3>
                                    <div class="m_popup-myclaim-way">
                                        <ul>
                                            <li v-for="(retrieveMethod, index) in retrieveMethods" :key="retrieveMethod.code">
                                                <MMRadio 
                                                    v-model="returnForm.retrieveMethod" 
                                                    :value="retrieveMethod.code" 
                                                    name="retrieve_method"
                                                    :checked="index === 0"
                                                    @change.passive="
                                                        returnForm.retrievedShippingInfo.deliveryCompany = ''; 
                                                        returnForm.retrievedShippingInfo.invoiceNumber = ''
                                                    "
                                                >
                                                    <b class="mm_block">
                                                        <i class="ico_form-radio" />
                                                        <span class="text_label">{{ retrieveMethod.isRetrieveByOrderer ? '상품을 이미 보냈어요' : '상품을 아직 보내지 않았어요' }}</span>
                                                    </b>
                                                </MMRadio>
                                                <div v-if="isRetrievedByOrderer && returnForm.retrieveMethod == retrieveMethod.code" class="mm_syncer-way-already S=radio-use">
                                                    <h6 class="mm_strapline">
                                                        <b>발송한 택배사</b>
                                                    </h6>
                                                    <MMSelect v-model="returnForm.retrievedShippingInfo.deliveryCompany">
                                                        <option value="">
                                                            택배사를 선택하세요
                                                        </option>
                                                        <option 
                                                            v-for="deliveryCompany in deliveryCompanies" 
                                                            :key="deliveryCompany.code" 
                                                            :value="deliveryCompany.code"
                                                        >
                                                            {{ deliveryCompany.name }}
                                                        </option>
                                                    </MMSelect>
                                                    <h6 class="mm_strapline">
                                                        <b>송장번호</b>
                                                    </h6>
                                                    <MMInput
                                                        v-model="returnForm.retrievedShippingInfo.invoiceNumber"
                                                        :maxlength="50"
                                                        place-holder-text="송장번호를 입력하세요"
                                                    />
                                                </div>
                                                <div v-else-if="!isRetrievedByOrderer && returnForm.retrieveMethod == retrieveMethod.code" class="mm_syncer-way-yet S=radio-use">
                                                    <div class="mm_order-info">
                                                        <table>
                                                            <caption>반품 수거지 정보</caption>
                                                            <tbody>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <b>보내는 분</b>
                                                                    </th>
                                                                    <td>{{ returnForm.retrieveAddress.name }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <b>휴대폰 번호</b>
                                                                    </th>
                                                                    <td>{{ returnForm.retrieveAddress.tel }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <b>주소</b>
                                                                    </th>
                                                                    <td>
                                                                        {{ returnForm.retrieveAddress.zipCode }}
                                                                        <br>{{ returnForm.retrieveAddress.baseAddress }} {{ returnForm.retrieveAddress.detailAddress }}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <a class="mm_btn T=xs T=line btn_address-change" href="#ADDRESS_LIST"><b>주소변경</b></a>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <div class="mm_syncer-way-yet" :class="!isRetrievedByOrderer ? 'S=radio-use' : ''">
                                            <div class="mm_note T=bg">
                                                <!-- (D) 굿스플로 사용하는 브랜드 관리자 상품일 경우 노출합니다. -->
                                                <ul v-if="retrieveMethods.find(method => method.isAutoRetrieve)">
                                                    <li>배송비 관련 금액은 반품 완료 시 환불 예정 금액에서 차감됩니다.</li>
                                                    <li>배송비 관련 금액을 동봉하지 마세요.</li>
                                                    <li>상품은 착불로 발송해주세요.</li>
                                                    <li>본 상품은 택배사에 <strong>자동으로 반품/수거 접수</strong>됩니다.</li>
                                                </ul>
                                                <!-- (D) 굿스플로 사용하지 않는 브랜드 관리자 상품일 경우 노출합니다 -->
                                                <ul v-else>
                                                    <li>반품 택배비는 환불 예정 금액에서 차감됩니다.</li>
                                                    <li>반품 택배비를 동봉하지 말아주세요.</li>
                                                    <li>상품은 착불로 발송바랍니다.</li>
                                                    <li>본 상품은 <strong>판매처에서 반품/수거 접수</strong>됩니다.</li>
                                                    <li><strong>3일 이내 회수되지 않을 경우</strong> 해당 택배사 또는 쇼핑몰 고객센터로 문의바랍니다.</li>
                                                    <li>회수 시 발급된 송장번호는 <strong>반품 상세내역에서 등록</strong>바랍니다.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <div class="mm_flex T=auto">
                                                <button 
                                                    type="button"
                                                    class="mm_btn T=line T=light btn_back" 
                                                    @click.prevent="toReasonSelect"
                                                >
                                                    <i class="ico_page-prev" /><b>이전으로</b>
                                                </button>
                                                <button type="button" class="mm_btn T=primary" @click="toRefundInfo">
                                                    <b>다음 단계로</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 반품방법 -->

                            <!-- 환불관련정보 -->
                            <div class="mm_process-item" :class="process.refundInfo ? 'S=process-on' : ''">
                                <div class="mm_inner">
                                    <h3 class="mm_heading m_popup-myclaim-title">
                                        <b>예상 환불금액을 확인하세요</b>
                                    </h3>
                                    <div class="mm_cost">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">
                                                        <b>총 결제금액</b>
                                                    </th>
                                                    <td>
                                                        <p class="text_price">
                                                            <strong>{{ MMFilters.formatNumber(refundInfo.totalPaidPrice) }}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr v-for="detail in refundInfo.calculateDetails" :key="detail.label">
                                                    <th scope="row">
                                                        <strong>{{ detail.label }}</strong>
                                                    </th>
                                                    <td>
                                                        <p class="text_price">
                                                            {{ detail.isSubtracted ? '-' : '+' }}
                                                            <strong>{{ MMFilters.formatNumber(detail.amount) }}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th scope="row">
                                                        <b>환불 예상 금액</b>
                                                    </th>
                                                    <td>
                                                        <p class="text_price mm_text-variable">
                                                            <strong>{{ MMFilters.formatNumber(refundInfo.refundPrice + refundInfo.refundPoint) }}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div class="mm_note">
                                        <ul>
                                            <li>초도 배송비를 지불하셨을 경우 귀책 사유 관계 없이 면제 배송비가 부과되지 않습니다.</li>
                                        </ul>
                                    </div>
                                    <h6 class="mm_strapline">
                                        <b>환불 정보</b>
                                    </h6>
                                    <div class="mm_cost">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">
                                                        <b>{{ returnableOrder.paymentMethodLabel }} 환불</b>
                                                    </th>
                                                    <td>
                                                        <p class="text_price">
                                                            <strong>{{ MMFilters.formatNumber(refundInfo.refundPrice) }}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>{{ pointLabel.name }} 환불</b>
                                                    </th>
                                                    <td>
                                                        <p class="text_point">
                                                            <strong>{{ MMFilters.formatNumber(refundInfo.refundPoint) }}</strong>
                                                            <sub>{{ pointLabel.suffix }}</sub>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="mm_note">
                                        <ul>
                                            <li>환불 예상금액과 최종적으로 환불 받으실 금액은 상이할 수 있습니다.</li>
                                            <li>적립금을 제외한 환불금액이 0원 이하일 경우 반품 신청이 불가합니다.</li>
                                        </ul>
                                    </div>
                                    <h6 class="mm_strapline">
                                        <b>환불 계좌 관리</b>
                                    </h6>
                                    <div v-if="refundAccount" class="mm_order-refund">
                                        <p class="text_bank">
                                            {{ refundAccount.ownerName }}
                                        </p>
                                        <p class="text_name">
                                            {{ refundAccount.bankName }}
                                        </p>
                                        <p>{{ refundAccount.accountNumber }}</p>
                                        <a class="mm_btn T=xs T=dark" href="#REFUND_ACCOUNT"><b>변경하기</b><i class="ico_link T=sm" /></a>
                                    </div>
                                    <!-- (D) 등록된 계좌가 없을 경우 노출합니다. -->
                                    <div v-else class="mm_order-refund-none">
                                        <p>환불 계좌를 등록하세요</p>
                                        <a class="mm_btn T=dark" href="#REFUND_ACCOUNT"><b>환불 계좌 등록하기</b></a>
                                    </div>
                                    <div class="mm_note">
                                        <ul>
                                            <li>입력하신 계좌 정보는 환불 목적으로만 이용되고 있습니다.</li>
                                        </ul>
                                    </div>
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <div class="mm_flex T=auto">
                                                <button 
                                                    type="button"
                                                    class="mm_btn T=line T=light btn_back"
                                                    @click="toRetrieveMethodSelect"
                                                >
                                                    <i class="ico_page-prev" /><b>이전으로</b>
                                                </button>
                                                <button type="button" class="mm_btn T=primary" @click="applyReturn">
                                                    <b>반품 신청하기</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 환불관련정보 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { AddressForm, RefundInfo, RetrieveMethod, ReturnForm } from '$/@type/myOrder';
import { ReturnableOrder } from '$/@type/myOrder/order';
import { defaultCatch } from '$/functions';
import MMPopup from '@/components/layout/Popup.vue';
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { dropdown as vDropdown } from '$/directives'
import { ReturnReason } from '$/@type/myOrder/claimReason';
import { DeliveryCompany } from '$/@type/configs';
import { PointLabel } from '$/@type/member/point';
import { returnRepository } from '$/repository/myOrder/returnRepository';
import { globalConfigsRepository } from '$/repository/globalConfigsRepository';
import { typeCastNumber } from '$/filters';
import { mmon } from '$/helper/mmon';
import { makeValidator } from '$/validator';
import { refundAccountRepository } from '$/repository/member/refundAccountRepository';
import MMCheck from '@/components/input/Check.vue';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import MMRadio from '@/components/input/Radio.vue';
import MMTextarea from '@/components/input/Textarea.vue';
import MMSelect from '@/components/input/Select.vue';
import { useOrderItemSelect, useShippingAddressEdit } from '$/composables/mypage/order/myOrderComposable';
import { OrderItemSet, ReturnableOrderItem } from '$/@type/myOrder/item';
import { useRefundAccountEdit } from '$/composables/mypage/refundAccountComposable';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';

const router = useRouter();
const route = useRoute();
usePageTitleSetting('주문 반품');

const { globalConfigs } = useGlobalConfigs();
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);
const returnReasons = ref<ReturnReason[]>([]);  // 반품사유 리스트
const retrieveMethods = ref<RetrieveMethod[]>([]);
const deliveryCompanies = ref<DeliveryCompany[]>([]);

//주문상품 선택기능
const {
    orderItemSelectModalData,
    selectedOrderItemIds
} = useOrderItemSelect();

// 배송지(반품수거지) 변경 기능
const { clearShippingAddressEditModal } = useShippingAddressEdit((newVal) => {
    if (!newVal) {
        return;
    }
    returnForm.retrieveAddress = newVal;
});

// 환불계좌 수정 기능
const { 
    refundAccountModalData: {
        refundAccount
    }
} = useRefundAccountEdit();


// 반품 단계
const process = ref<Record<'orderItemSelect'|'reasonSelect'|'retrieveMethodSelect'|'refundInfo', boolean>>({
    orderItemSelect: false,
    reasonSelect: false,
    retrieveMethodSelect: false,
    refundInfo: false,
});

// 반품가능 주문
const returnableOrder = ref<ReturnableOrder>({
    orderId: '',
    orderedAt: '',
    packs: [],
    paymentMethodLabel: '',
    shippingAddress: {
        name: '',
        tel: '',
        zipCode: '',
        baseAddress: '',
        detailAddress: '',
    }
});
//선택된 주문상품
const checkedOrderItemSetIds = ref<number[]>([]);   // 선택된 주문상품 묶음 ID

//환불금액정보
const refundInfo = ref<RefundInfo>({
    totalPaidPrice: 0,
    refundPrice: 0,
    refundPoint: 0,
    calculateDetails: []
});

// 반품신청 Form
const returnForm = reactive<ReturnForm>({
    orderItemIds: [],
    returnReason: '',
    returnReasonDetail: '',
    retrieveMethod: '',
    retrievedShippingInfo: {
        deliveryCompany: '',
        invoiceNumber: ''
    },
    retrieveAddress: {
        name: '',
        tel: '',
        zipCode: '',
        baseAddress: '',
        detailAddress: '',
    },
    refundAccount: {
        ownerName: '',
        accountNumber: '',
        bankCode: '',
    }
});

// 상세사유 필요여부
const isReasonDetailRequired = computed<boolean>(() => {
    return returnReasons.value.find(reason => returnForm.returnReason == reason.code)?.requireDetail || false
});
// 반품방법
const isRetrievedByOrderer = computed<boolean>(() => {
    return retrieveMethods.value.find(method => returnForm.retrieveMethod == method.code)?.isRetrieveByOrderer === true;
});

onMounted(async () => {
    mmon.loading.show();
    await Promise.all([
        fetchReturnableOrder(), 
        fetchReturnReasons(),
        fetchDeliveryCompanies(),
        fetchRefundAccount()
    ]);
    mmon.loading.hide();

    // 부분선택 디폴트 체크
    returnableOrder.value.packs.forEach(pack => {
        pack.orderItemSets.forEach(orderItemSet => {
            selectedOrderItemIds.value[orderItemSet.id] = []
            orderItemSet.items.forEach(item => {
                // 리스트에서 버튼 클릭한 상품 default 체크
                if (item.id == Number(route.params.item_id)) {
                    checkedOrderItemSetIds.value.push(orderItemSet.id);
                    selectedOrderItemIds.value[orderItemSet.id].push(item.id)
                    return;
                }
                
                if (orderItemSet.items.length == 1) {
                    selectedOrderItemIds.value[orderItemSet.id].push(item.id);
                }
            });
        })
    });
    // 반품사유 default 선택처리
    returnForm.returnReason = returnReasons.value[0].code;
    applySelectedToReturnForm();
    
    // 주문상품 선택 페이지 노출
    process.value.orderItemSelect = true;

    // hash change 이벤트 (모달)
    window.addEventListener('hashchange', orderItemSelectedModalClose);
    window.addEventListener('hashchange', refundAccountEditModalClose);
});

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', orderItemSelectedModalClose);
    window.removeEventListener('hashchange', refundAccountEditModalClose);
    clearShippingAddressEditModal();
});

watch(checkedOrderItemSetIds, () => {
    applySelectedToReturnForm();
})

/**
 * 상품 선택모달 닫힐시 form에 선택한 orderItemId 적용
 * @param event 
 */
function orderItemSelectedModalClose(event: HashChangeEvent) {
    const before = event.oldURL.split('#')[1] ?? '';
    const after = event.newURL.split('#')[1] ?? '';
    if (before == 'ORDER_ITEM_SELECT' && after === '') {
        applySelectedToReturnForm()
    }
}

/**
 * 환불계좌 모달 닫힐시 form에 환불계좌값 적용
 * @param event 
 */
function refundAccountEditModalClose(event: HashChangeEvent) {
    const before = event.oldURL.split('#')[1] ?? '';
    const after = event.newURL.split('#')[1] ?? '';
    if (before == 'REFUND_ACCOUNT' && after === '' && refundAccount.value) {
        returnForm.refundAccount = refundAccount.value;
    }
}

/**
 * 선택상품 form 에 적용
 */
function applySelectedToReturnForm() {
    let selected: number[] = [];
    checkedOrderItemSetIds.value.forEach(itemId => {
        selected = selected.concat(selectedOrderItemIds.value[itemId]);
    });
    returnForm.orderItemIds = selected;
}

/**
 * 주문상품 부분선택 모달 open
 * @param orderItem 취소주문상품
 */
function openOrderItemSelectModal(orderItemSet: OrderItemSet<ReturnableOrderItem>, sellerName: string) {
    if (orderItemSet.items.length < 2) {
        return;
    }
    // 부분선택 모달 데이터 세팅
    orderItemSelectModalData.orderItems.value = orderItemSet.items; 
    orderItemSelectModalData.orderItemSetId.value = orderItemSet.id; 
    orderItemSelectModalData.sellerName.value = sellerName;
}

/**
 * 주문상품 선택단계로 이동
 */
function toOrderItemSelect() {
    (Object.keys(process.value) as (keyof typeof process.value)[])
        .forEach(processKey => process.value[processKey] = false);
    process.value.orderItemSelect = true;
}

/**
 * 반품사유 선택단계로 이동
 */
function toReasonSelect() {
    if (returnForm.orderItemIds.length < 1) {
        return mmon.bom.alert('상품을 선택해주세요.');
    }

    (Object.keys(process.value) as (keyof typeof process.value)[])
        .forEach(processKey => process.value[processKey] = false);
    process.value.reasonSelect = true;
}

/**
 * 반품 방법 선택 단계로 이동
 */
async function toRetrieveMethodSelect() {
    const validator = makeValidator(returnForm)
        .setRules({
            'returnReason(주문 반품 사유)': [ 'required' ],
            'returnReasonDetail(주문 반품 사유)': [ 
                `requiredIf:returnReason,${returnReasons.value.filter(reason => reason.requireDetail).map(reason => reason.code).join(',')}` 
            ]
        })
        .setMessages({
            'returnReason.required': ':param(을/를) 선택해주세요.',
            'returnReasonDetail.requiredIf': ':param(을/를) 입력해주세요.',
        });

    try {
        await validator.run();
        (Object.keys(process.value) as (keyof typeof process.value)[])
            .forEach(processKey => process.value[processKey] = false);
        process.value.retrieveMethodSelect = true;
    } catch (e) {
        defaultCatch(e)
    }
}

/**
 * 환불정보 조회 단계로 이동
 */
async function toRefundInfo() {
    const validator = makeValidator(Object.assign(returnForm, { isSelfRetrieve: isRetrievedByOrderer.value ? '1' : '0' }))
        .setRules({
            // 반품송장정보
            'retrievedShippingInfo.deliveryCompany(택배사)': [ 'requiredIf:isSelfRetrieve,1', `in:${deliveryCompanies.value.map(company => company.code).join(',')}` ],
            'retrievedShippingInfo.invoiceNumber(송장번호)': [ 'requiredIf:isSelfRetrieve,1', 'number' ],
            // 반품수거지 정보
            'retrieveAddress.name(반품 수거지 주문자)': [ 'requiredIf:isSelfRetrieve,0', 'maxLength:50' ],
            'retrieveAddress.tel(반품 수거지 연락처)': [ 'requiredIf:isSelfRetrieve,0', 'number', 'maxLength:12'],
            'retrieveAddress.zipCode(반품 수거지 우편번호)': [ 'requiredIf:isSelfRetrieve,0' ],
            'retrieveAddress.baseAddress(반품 수거지 주소)': [ 'requiredIf:isSelfRetrieve,0'],
            'retrieveAddress.detailAddress(반품 수거지 상세주소)': [ 'requiredIf:isSelfRetrieve,0', 'maxLength:100'],
        })
        .setMessages({
            'retrievedShippingInfo.deliveryCompany.requiredIf': ':param(을/를) 선택해주세요.',
            'retrievedShippingInfo.invoiceNumber.requiredIf': ':param(을/를) 입력해주세요.',
            'retrievedShippingInfo.invoiceNumber.number': ':param(은/는) 숫자만 입력가능합니다.',

            'retrieveAddress.name.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.tel.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.zipCode.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.baseAddress.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.detailAddress.requiredIf': ':param(은/는) 필수값입니다.',
        });

    try {
        await validator.run();

        // [상품을 이미 보냈어요] 선택시 입력한 송장번호 유효성 검사
        if (isRetrievedByOrderer.value) {
            await returnRepository.validateInvoice(returnForm.retrievedShippingInfo.deliveryCompany, returnForm.retrievedShippingInfo.invoiceNumber)
        }

        // 환불정보 조회
        await fetchRefundInfo(
            returnForm.orderItemIds, 
            typeCastNumber(returnForm.returnReason), 
            typeCastNumber(returnForm.retrieveMethod),
            {
                zipCode: returnForm.retrieveAddress.zipCode,
                baseAddress: returnForm.retrieveAddress.baseAddress,
                detailAddress: returnForm.retrieveAddress.detailAddress,
            }
        );

        (Object.keys(process.value) as (keyof typeof process.value)[])
            .forEach(processKey => process.value[processKey] = false);
        process.value.refundInfo = true;
    } catch (e) {
        defaultCatch(e)
    }
}

/**
 * 주문조회
 */
async function fetchReturnableOrder () {
    try {
        const returnable = await returnRepository.getReturnable(String(route.params.order_id), Number(route.params.item_id));
        returnableOrder.value = returnable.order;
        retrieveMethods.value = returnable.availableRetrieveMethods;
        returnForm.retrieveAddress = {
            name: returnableOrder.value.shippingAddress?.name || '',
            tel: returnableOrder.value.shippingAddress?.tel || '',
            zipCode: returnableOrder.value.shippingAddress?.zipCode || '',
            baseAddress: returnableOrder.value.shippingAddress?.baseAddress || '',
            detailAddress: returnableOrder.value.shippingAddress?.detailAddress || ''
        }
    } catch (e) {
        defaultCatch(e);
    }
}

/**
 * 반품사유 조회
 */
async function fetchReturnReasons() {
    try {
        returnReasons.value = await returnRepository.getReturnReasons();
    } catch (e) {
        defaultCatch(e)
    }
}

/**
 * 택배사리스트 조회
 */
async function fetchDeliveryCompanies() {
    try {
        deliveryCompanies.value = await globalConfigsRepository.getDeliveryCompanies();
    } catch (e) {
        defaultCatch(e)
    }
}

/**
 * 환불계좌 조회
 */
async function fetchRefundAccount() {
    try {
        refundAccount.value = await refundAccountRepository.get();
        if (refundAccount.value) {
            returnForm.refundAccount = refundAccount.value;
        }
    } catch (e) {
        defaultCatch(e);
    }
}

/**
 * 환불정보 조회
 * @param orderItemIds 선택된 주문상품 id 리스트
 * @param reasonCode 반품 사유 코드
 * @param retrieveMethodCode 반품 회수 방법 코드
 * @param retrieveShippingAddress 반품 수거지 주소 정보
 */
async function fetchRefundInfo(orderItemIds: number[], reasonCode: number, retrieveMethodCode: number, retrieveShippingAddress: AddressForm) {
    if (!reasonCode || orderItemIds.length < 1 || !retrieveMethodCode) {
        refundInfo.value = {
            totalPaidPrice: 0,
            refundPrice: 0,
            refundPoint: 0,
            calculateDetails: []
        };
        return;
    }
    
    try {
        refundInfo.value = await returnRepository.getRefundInfo(returnableOrder.value.orderId, orderItemIds, reasonCode, retrieveMethodCode, retrieveShippingAddress);
    } catch (e) {
        defaultCatch(e);
    }
}

/**
 * 반품 신청
 */
async function applyReturn() {
    applySelectedToReturnForm();

    if (refundInfo.value.refundPrice <= 0) {
        return mmon.bom.alert('적립금을 제외한 환불금액이 0원 이하일 경우 반품 신청이 불가합니다.');
    }
    // 반품수거지 전화번호 '-'포함시 제거
    returnForm.retrieveAddress.tel = returnForm.retrieveAddress.tel.replaceAll('-', '');
    
    const isSelfRetrieve = retrieveMethods.value.find(method => method.code == returnForm.retrieveMethod)?.isRetrieveByOrderer;
    const validator = makeValidator(Object.assign({isSelfRetrieve: isSelfRetrieve ? '1' : '0'}, returnForm))
        .setRules({
            'orderItemIds(주문 반품하실 상품)': [ 'required' ],
            'returnReason(주문 반품 사유)': [ 'required', `in:${returnReasons.value.map(reason => reason.code).join(',')}` ],
            'returnReasonDetail(주문 반품 사유)': [ `requiredIf:returnReason,${returnReasons.value.filter(reason => reason.requireDetail).map(reason => reason.code).join(',')}` ],
            // 반품송장정보
            'retrievedShippingInfo.deliveryCompany(택배사)': [ 'requiredIf:isSelfRetrieve,1', `in:${deliveryCompanies.value.map(company => company.code).join(',')}` ],
            'retrievedShippingInfo.invoiceNumber(송장번호)': [ 'requiredIf:isSelfRetrieve,1', 'number' ],
            // 반품수거지 정보
            'retrieveAddress.name(반품 수거지 주문자)': [ 'requiredIf:isSelfRetrieve,0', 'maxLength:50' ],
            'retrieveAddress.tel(반품 수거지 연락처)': [ 'requiredIf:isSelfRetrieve,0', 'number', 'maxLength:12'],
            'retrieveAddress.zipCode(반품 수거지 우편번호)': [ 'requiredIf:isSelfRetrieve,0' ],
            'retrieveAddress.baseAddress(반품 수거지 주소)': [ 'requiredIf:isSelfRetrieve,0'],
            'retrieveAddress.detailAddress(반품 수거지 상세주소)': [ 'requiredIf:isSelfRetrieve,0', 'maxLength:100'],
            // 환불계좌 정보
            'refundAccount.ownerName(환불계좌)': [ 'required' ],
            'refundAccount.bankCode(환불계좌)': [ 'required' ],
            'refundAccount.accountNumber(환불계좌)': [ 'required' ],
        })
        .setMessages({
            'orderItemIds': ':param(을/를) 선택해주세요.',
            'returnReason.in': ':param(이/가) 올바르지 않습니다.',
            'returnReason.required': ':param(을/를) 선택해주세요.',
            'returnReasonDetail.requiredIf': ':param(을/를) 입력해주세요.',

            'retrievedShippingInfo.deliveryCompany.requiredIf': ':param(을/를) 선택해주세요.',
            'retrievedShippingInfo.invoiceNumber.requiredIf': ':param(을/를) 입력해주세요.',
            'retrievedShippingInfo.invoiceNumber.number': ':param(은/는) 숫자만 입력가능합니다.',

            'retrieveAddress.name.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.tel.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.zipCode.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.baseAddress.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.detailAddress.requiredIf': ':param(은/는) 필수값입니다.',

            'refundAccount.ownerName.required': ':param(을/를) 등록해주세요.',
            'refundAccount.bankCode.required': ':param(을/를) 등록해주세요.',
            'refundAccount.accountNumber.required': ':param(을/를) 등록해주세요.',
        })

    try {
        await validator.run();
        mmon.bom.confirm('반품 신청을 진행하시겠습니까?', async (isConfirm: boolean) => {
            if (!isConfirm) {
                return;
            }

            if (refundInfo.value.refundPrice <= 0) {
                return mmon.bom.alert('환불 예상 금액이 0원 이하일 경우 반품 신청이 불가합니다.');
            }

            try {
                const returnIds = await returnRepository.applyReturn(returnableOrder.value.orderId, returnForm);
                router.replace({ 
                    name: 'MypageOrderReturnComplete', 
                    params: { 
                        order_id: returnableOrder.value.orderId,
                        return_ids: returnIds, 
                    } 
                });
            } catch (e) {
                defaultCatch(e);
            }
        });
    } catch (e) {
        defaultCatch(e);
    }
}
</script>
