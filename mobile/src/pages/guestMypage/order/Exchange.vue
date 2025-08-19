<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>주문 교환</b></h1>
        </template>

        <template #contents>
            <div v-if="process.orderItemSelect" class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 주문목록 -->
                        <article class="mm_order-item">
                            <h5>
                                <b>{{ MMFilters.formatDate(exchangeableOrder.orderedAt, "YYYY.MM.DD") }}</b>
                                <strong>주문번호: {{ exchangeableOrder.orderId }}</strong>
                            </h5>
                            <div 
                                v-for="pack in exchangeableOrder.packs"
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
                                                v-model="orderItemSelectForm.orderItemSetIds"
                                                :value="orderItemSet.id"
                                                label="상품 선택"
                                                :is-blind-label="true"
                                            />
                                            <p class="text_seller">
                                                <i class="ico_shop" />{{ orderItemSet.sellerName }}
                                            </p>
                                            <MMOrderGoods 
                                                :goods="orderItemSet.goods" 
                                                :price="orderItemSet.totalPaidPrice"
                                                :without-link="true"
                                            >
                                                <template #order-status>
                                                    <p class="text_status">
                                                        {{ orderItemSet.orderStatusLabel }}
                                                    </p>
                                                </template>
                                                <template #footer>
                                                    <div v-if="orderItemSet.items.length > 1" class="mm_product...footer-indent">
                                                        <p>교환 수량</p>
                                                        <MMSelect v-model="orderItemSelectForm.exchangeEas[orderItemSet.id]" :class="'T=sm T=shortest'">
                                                            <option v-for="ea in orderItemSet.items.length" :key="ea" :value="ea">
                                                                {{ ea }}
                                                            </option>
                                                        </MMSelect>
                                                    </div>
                                                </template>
                                            </MMOrderGoods>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </article>
                        <!--// 주문목록 -->

                        <!-- 교환신청 -->
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
                                        <i class="ico_info" /><b>교환 주의사항</b><i class="ico_dropdown T=box" />
                                    </button>
                                    <div class="mm_dropdown-item">
                                        <div class="mm_dropdown-item-inner">
                                            <ul>
                                                <li>주문 제작하신 상품 및 해외 배송 상품은 교환이 불가하여 리스트에 노출되지 않습니다.</li>
                                                <li>교환은 배송 완료 이후 7일 이내 신청 가능합니다.</li>
                                                <li>교환 사유별 배송비 부담이 상이합니다.</li>
                                                <li>묶음 교환의 경우 동일한 업체에 한해서 가능합니다.</li>
                                                <li>교환하실 상품을 발송하기 전에 한해서 교환 철회가 가능합니다.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--// 교환신청 -->
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
                            <!-- 교환사유 -->
                            <div class="mm_process-item" :class="process.reasonSelect ? 'S=process-on' : ''">
                                <div class="mm_inner">
                                    <h3 class="mm_heading m_popup-myclaim-title">
                                        <b>교환 사유를 선택하세요</b>
                                    </h3>
                                    <div class="m_popup-myclaim-reason">
                                        <ul>
                                            <li v-for="reason in exchangeReasons" :key="reason.code">
                                                <MMRadio v-model="exchangeForm.reason" :value="reason.code" name="exchange_reason">
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
                                                v-model="exchangeForm.reasonDetail"
                                                :maxlength="100"
                                                place-holder-text="상세 사유를 입력하세요"
                                            />
                                        </div>
                                    </div>
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <div class="mm_flex T=auto">
                                                <a class="mm_btn T=line T=light btn_back" href="#" @click.prevent="toOrderItemSelect()"><i class="ico_page-prev" /><b>이전으로</b></a>
                                                <button type="button" class="mm_btn T=primary" @click="toOptionChange">
                                                    <b>다음 단계로</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 교환사유 -->

                            <!-- 옵션변경 -->
                            <div class="mm_process-item" :class="process.optionChange ? 'S=process-on' : ''">
                                <h3 class="mm_heading m_popup-myclaim-title">
                                    <b>변경할 옵션을 선택하세요</b>
                                </h3>
                                <div class="mm_order-item">
                                    <div 
                                        v-for="pack in selectedOrderItemPacks"
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
                                                    <MMOrderGoods 
                                                        :goods="orderItemSet.goods" 
                                                        :price="orderItemSet.totalPaidPrice"
                                                        :without-link="true"
                                                    >
                                                        <template #footer>
                                                            <div class="mm_product...footer-indent">
                                                                <a 
                                                                    class="mm_btn T=sm T=line T=primary" 
                                                                    href="#EXCHANGE_OPTION_CHANGE" 
                                                                    @click.capture="setExchangeOptionSelectModalData(orderItemSet.items, orderItemSet.sellerName, isSameOptionSelectable)"
                                                                ><b>옵션 변경</b>
                                                                </a>
                                                            </div>
                                                            <template v-for="orderItem in orderItemSet.items" :key="orderItem.id">
                                                                <p v-if="orderItem.exchangeOption" class="text_changed">
                                                                    <strong class="mm_text-variable">변경된 옵션</strong>
                                                                    <span>{{ `${orderItem.exchangeOption.label1} ${orderItem.exchangeOption.label2} / 1개` }}</span>
                                                                </p>
                                                            </template>
                                                        </template>
                                                    </MMOrderGoods>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="mm_inner">
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <div class="mm_flex T=auto">
                                                <button type="button" class="mm_btn T=line T=light btn_back" @click.prevent="toReasonSelect">
                                                    <i class="ico_page-prev" /><b>이전으로</b>
                                                </button>
                                                <button type="button" class="mm_btn T=primary" @click="applySelectedOptionToFormData(); toRetrieveMethodSelect();">
                                                    <b>다음 단계로</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--// 옵션변경 -->

                            <!-- 교환방법 -->
                            <div class="mm_process-item" :class="process.retrieveMethodSelect ? 'S=process-on' : ''">
                                <div class="mm_inner">
                                    <h3 class="mm_heading m_popup-myclaim-title">
                                        <b>교환 방법을 선택하세요</b>
                                    </h3>
                                    <div class="m_popup-myclaim-way">
                                        <ul>
                                            <li v-for="(retrieveMethod, index) in availableRetrieveMethods" :key="retrieveMethod.code">
                                                <MMRadio 
                                                    v-model="exchangeForm.retrieveMethod" 
                                                    :value="retrieveMethod.code" 
                                                    name="retrieve_method"
                                                    :checked="index === 0"
                                                    @change.passive="
                                                        exchangeForm.retrievedShippingInfo.deliveryCompanyCode = ''; 
                                                        exchangeForm.retrievedShippingInfo.invoiceNumber = ''
                                                    "
                                                >
                                                    <b class="mm_block">
                                                        <i class="ico_form-radio" />
                                                        <span class="text_label">{{ retrieveMethod.isRetrieveByOrderer ? '상품을 이미 보냈어요' : '상품을 아직 보내지 않았어요' }}</span>
                                                    </b>
                                                </MMRadio>
                                                <div v-if="isRetrievedByOrderer && exchangeForm.retrieveMethod == retrieveMethod.code" class="mm_syncer-way-already S=radio-use">
                                                    <h6 class="mm_strapline">
                                                        <b>발송한 택배사</b>
                                                    </h6>
                                                    <MMSelect v-model="exchangeForm.retrievedShippingInfo.deliveryCompanyCode">
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
                                                        v-model="exchangeForm.retrievedShippingInfo.invoiceNumber"
                                                        :maxlength="50"
                                                        place-holder-text="송장번호를 입력하세요"
                                                    />
                                                </div>
                                                <div v-else-if="!isRetrievedByOrderer && exchangeForm.retrieveMethod == retrieveMethod.code" class="mm_syncer-way-yet S=radio-use">
                                                    <div class="mm_order-info">
                                                        <table>
                                                            <caption>교환 수거지 정보</caption>
                                                            <tbody>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <b>보내는 분</b>
                                                                    </th>
                                                                    <td>{{ exchangeForm.retrieveAddress.name }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <b>휴대폰 번호</b>
                                                                    </th>
                                                                    <td>{{ exchangeForm.retrieveAddress.tel }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <b>주소</b>
                                                                    </th>
                                                                    <td>
                                                                        {{ exchangeForm.retrieveAddress.zipCode }}
                                                                        <br>{{ exchangeForm.retrieveAddress.baseAddress }} {{ exchangeForm.retrieveAddress.detailAddress }}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <a class="mm_btn T=xs T=line btn_address-change" href="#GUEST_ADDRESS_EDIT" @click.capture="isEditingRetrieveAddress = true;"><b>주소변경</b></a>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <div class="mm_syncer-way-yet" :class="!isRetrievedByOrderer ? 'S=radio-use' : ''">
                                            <div class="mm_note T=bg">
                                                <!-- (D) 굿스플로 사용하는 브랜드 관리자 상품일 경우 노출합니다. -->
                                                <ul v-if="availableRetrieveMethods.find(method => method.isAutoRetrieve)">
                                                    <li>배송비 관련 금액이 발생될 경우 추가 결제가 진행됩니다.</li>
                                                    <li>배송비 관련 금액을 동봉하지 말아주세요.</li>
                                                    <li>택배사 수거 시, 착불로 발송해주세요.</li>
                                                    <li>본 상품은 택배사에 <strong>자동으로 교환/수거 접수</strong>됩니다.</li>
                                                </ul>
                                                <!-- (D) 굿스플로 사용하지 않는 브랜드 관리자 상품일 경우 노출합니다 -->
                                                <ul v-else>
                                                    <li>배송비 관련 금액이 발생될 경우 추가 결제가 진행됩니다.</li>
                                                    <li>배송비 관련 금액을 동봉하지 말아주세요.</li>
                                                    <li>택배사 수거 시, 착불로 발송해주세요.</li>
                                                    <li>본 상품은 <strong>판매처에서 교환/수거 접수</strong>됩니다.</li>
                                                    <li><strong>3일 이내 회수되지 않을 경우</strong> 해당 택배사 또는 쇼핑몰 고객센터로 문의하세요.</li>
                                                    <li>회수 시 발급된 송장번호는 <strong>교환 상세내역에서 등록</strong>하세요.</li>
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
                                                    @click.prevent="toOptionChange"
                                                >
                                                    <i class="ico_page-prev" /><b>이전으로</b>
                                                </button>
                                                <button type="button" class="mm_btn T=primary" @click="toExchangeAddress">
                                                    <b>다음 단계로</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 교환방법 -->

                            <!-- 교환받을주소 -->
                            <div class="mm_process-item" :class="process.exchangeAddress ? 'S=process-on' : ''">
                                <div class="mm_inner">
                                    <h3 class="mm_heading m_popup-myclaim-title">
                                        <b>교환 상품 받으실 주소를 설정하세요</b>
                                    </h3>
                                    <div class="mm_order-info">
                                        <table>
                                            <caption>교환 상품 받을 정보</caption>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">
                                                        <b>받는 사람</b>
                                                    </th>
                                                    <td>{{ exchangeForm.exchangeAddress.name }}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>휴대폰 번호</b>
                                                    </th>
                                                    <td>{{ exchangeForm.exchangeAddress.tel }}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>주소</b>
                                                    </th>
                                                    {{ exchangeForm.exchangeAddress.zipCode }}
                                                    <br>{{ exchangeForm.exchangeAddress.baseAddress }} {{ exchangeForm.exchangeAddress.detailAddress }}
                                                </tr>
                                            </tbody>
                                        </table>
                                        <a class="mm_btn T=xs T=line btn_address-change" href="#GUEST_ADDRESS_EDIT" @click.capture="isEditingExchangeAddress = true;"><b>주소변경</b></a>
                                    </div>
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <div class="mm_flex T=auto">
                                                <button type="button" class="mm_btn T=line T=light btn_back" @click.prevent="toRetrieveMethodSelect">
                                                    <i class="ico_page-prev" /><b>이전으로</b>
                                                </button>
                                                <button type="button" class="mm_btn T=primary" @click="toAdditionalPayment">
                                                    <b>다음 단계로</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 교환받을주소 -->

                            <!-- 추가금액결제 -->
                            <div class="mm_process-item" :class="process.additionalPayment ? 'S=process-on' : ''">
                                <div class="mm_inner">
                                    <h3 class="mm_heading m_popup-myclaim-title">
                                        <b>추가 금액을 결제하세요</b>
                                    </h3>
                                    <div class="mm_cost">
                                        <table>
                                            <tbody>
                                                <tr v-for="detail in additionalPayments.calculateDetails" :key="detail.label">
                                                    <th scope="row">
                                                        <strong>{{ detail.label }}</strong>
                                                    </th>
                                                    <td>
                                                        <p class="text_price">
                                                            <strong>{{ MMFilters.formatNumber(detail.amount) }}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th scope="row">
                                                        <b>추가 결제금액</b>
                                                    </th>
                                                    <td>
                                                        <p class="text_price mm_text-variable">
                                                            <strong>{{ MMFilters.formatNumber(additionalPayments.totalPrice) }}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <template v-if="additionalPayments.totalPrice > 0">
                                        <h6 class="mm_strapline">
                                            <b>결제방법 선택</b>
                                        </h6>
                                        <div class="m_popup-myclaim-way">
                                            <ul>
                                                <li>
                                                    <MMRadio v-model="isPayNow" :value="1" name="is_pay_now">
                                                        <b class="mm_block">
                                                            <i class="ico_form-radio" />
                                                            <span class="text_label">즉시 결제</span>
                                                        </b>
                                                    </MMRadio>
                                                    <div class="mm_syncer-payment-now" :class="Number(isPayNow) == 1 ? 'S=radio-use' : ''">
                                                        <MMSelect v-model="paymentForm.cardCode">
                                                            <option>카드를 선택하세요</option>
                                                            <option v-for="card in (creditCards || [])" :key="card.code" :value="card.code">
                                                                {{ card.label }}
                                                            </option>
                                                        </MMSelect>
                                                    </div>
                                                </li>
                                                <li>
                                                    <MMRadio v-model="isPayNow" :value="0" name="is_pay_now">
                                                        <b class="mm_block">
                                                            <i class="ico_form-radio" />
                                                            <span class="text_label">판매자와 협의 후 결제</span>
                                                        </b>
                                                    </MMRadio>
                                                </li>
                                            </ul>
                                        </div>
                                    </template>
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <div class="mm_flex T=auto">
                                                <button type="button" class="mm_btn T=line T=light btn_back" @click="toExchangeAddress">
                                                    <i class="ico_page-prev" /><b>이전으로</b>
                                                </button>
                                                <button 
                                                    v-if="additionalPayments.totalPrice > 0 && Number(isPayNow) == 1" 
                                                    type="button"
                                                    class="mm_btn T=primary" 
                                                    @click="applyExchange"
                                                >
                                                    <b>결제하기</b>
                                                </button>
                                                <button v-else class="mm_btn T=primary" @click="applyExchange">
                                                    <b>교환 신청하기</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 추가금액결제 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { DeliveryCompany } from '$/@type/configs';
import { 
    RetrieveMethod, 
    ExchangeAdditionalPaymentPrice,
    ExchangeOrderItemSelectForm, 
    ExchangePaymentForm, 
    ExchangeForm, 
    ExchangeOptionPair 
} from '$/@type/myOrder';
import { ExchangeReason } from '$/@type/myOrder/claimReason';
import { ExchangeableOrder } from '$/@type/myOrder/order';
import { PayMethod } from '$/@type/order/order';
import { typeCastNumber } from '$/filters';
import { defaultCatch, handlePopupOpenWithUrlCallback, pluck } from '$/functions';
import { mmon } from '$/helper/mmon';
import MMPopup from '@/components/layout/Popup.vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import MMSelect from '@/components/input/Select.vue';
import MMCheck from '@/components/input/Check.vue';
import MMTextarea from '@/components/input/Textarea.vue';
import MMRadio from '@/components/input/Radio.vue';
import { dropdown as vDropdown } from '$/directives'
import { globalConfigsRepository } from '$/repository/globalConfigsRepository';
import { exchangeRepository } from '$/repository/myOrder/exchangeRepository';
import { orderRepository } from '$/repository/order/orderRepository';
import { makeValidator } from '$/validator';
import { useExchangeOptionChange } from '$/composables/mypage/order/claim/exchangeComposable';
import { guestAddressEditModal } from '$/composables/mypage/order/myOrderComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';

const route = useRoute();
const router = useRouter();
usePageTitleSetting('주문 교환');

const deliveryCompanies = ref<DeliveryCompany[]>([]);
const creditCards = ref<PayMethod["childMethods"]>([])
const exchangeReasons = ref<ExchangeReason[]>([]);
const availableRetrieveMethods = ref<RetrieveMethod[]>([]); // 해당주문에 사용가능한 교환방법

const { 
    selectedOptionList,
    setExchangeOptionSelectModalData,
    resetSelectedOptionList
} = useExchangeOptionChange();

// 배송지(교환수거지) 변경 기능
const { resetNewAddressData } = guestAddressEditModal((newVal) => {
    if (!newVal) {
        return;
    }
    if (isEditingRetrieveAddress.value) {
        exchangeForm.value.retrieveAddress = newVal;
        isEditingRetrieveAddress.value = false;
    }

    if (isEditingExchangeAddress.value) {
        exchangeForm.value.exchangeAddress = newVal;
        isEditingExchangeAddress.value = false;
    }
});
const isEditingRetrieveAddress = ref<boolean>(false);
const isEditingExchangeAddress = ref<boolean>(false);

// 반품 단계
const process = ref<
    Record<
        'orderItemSelect'|'reasonSelect'|'optionChange'|'retrieveMethodSelect'|'exchangeAddress'|'additionalPayment', 
        boolean
    >
>({
    orderItemSelect: true,
    reasonSelect: false,
    optionChange: false,
    retrieveMethodSelect: false,
    exchangeAddress: false,
    additionalPayment: false,
});

// 교환가능 주문
const exchangeableOrder = ref<ExchangeableOrder>({
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
    },
});

const defaultAdditionalPayments = {
    totalPrice: 0,
    calculateDetails: [
        {
            label: "일반 배송비",
            amount: 0,
        },
        {
            label: "교환 배송비",
            amount: 0,
        }
    ]
}
// 추가 결제 금액 정보
const additionalPayments = ref<ExchangeAdditionalPaymentPrice>(defaultAdditionalPayments);
const isPayNow = ref<number|string>(1);

// 상세사유 필요여부
const isReasonDetailRequired = computed<boolean>(() => {
    return exchangeReasons.value.find(reason => exchangeForm.value.reason == reason.code)?.requireDetail || false
});
// 반품방법 정보
const isRetrievedByOrderer = computed<boolean>(() => {
    return availableRetrieveMethods.value.find(method => exchangeForm.value.retrieveMethod == method.code)?.isRetrieveByOrderer === true;
});

// 교환할 상품 선택 form
const orderItemSelectForm = ref<ExchangeOrderItemSelectForm>({
    orderItemSetIds: [],
    exchangeEas: {},
    step1Completed: false,
});

//옵션 변경할 주문상품(묶음)
const selectedOrderItemPacks = computed<ExchangeableOrder["packs"]>(() => {
    const selectedOrderItemSetIds = orderItemSelectForm.value.orderItemSetIds;
    const exchangeEas = orderItemSelectForm.value.exchangeEas;
    const clonedOrder:ExchangeableOrder = JSON.parse(JSON.stringify(exchangeableOrder.value));
    return clonedOrder.packs.filter(pack => {
        pack.orderItemSets = pack.orderItemSets.filter(itemSet => {
            itemSet.items = itemSet.items.slice(0, (Number(exchangeEas[itemSet.id]) || 1));
            itemSet.totalPaidPrice = itemSet.items.reduce((sum, current) => sum += current.paidPrice, 0);
            itemSet.goods.ea = itemSet.items.length
            return selectedOrderItemSetIds.find((orderItemSetId) => String(orderItemSetId) == String(itemSet.id));
        })
        return pack.orderItemSets.length > 0 ;
    })
});

// 교환 결제 form
const paymentForm = ref<ExchangePaymentForm>({
    cardCode: '',
    interestMonth: 0,
    isInterestFree: false,
    isPartialInterest: false,
    paymentPrice: 0
});


// 교환 신청 form
const exchangeForm = ref<ExchangeForm>({
    exchangeOptionPairs: [],
    reason: '',
    reasonDetail: '',
    retrieveMethod: '',
    retrieveAddress: {
        name: '',
        tel: '',
        zipCode: '',
        baseAddress: '',
        detailAddress: ''
    },
    exchangeAddress: {
        name: '',
        tel: '',
        zipCode: '',
        baseAddress: '',
        detailAddress: ''
    },
    retrievedShippingInfo: {
        deliveryCompanyCode: '',
        invoiceNumber: ''
    },
    isAdditionalPaymentPaid: false,
    paymentToken: ''
});

const isSameOptionSelectable = computed<boolean>(() => {
    return exchangeReasons.value.find(reason => exchangeForm.value.reason == reason.code && reason.isSameOptionExchangeable) ? true : false;
})

onMounted(async () => {
    mmon.loading.show();
    await Promise.all([
        fetchExchangeableOrder(String(route.params.order_id), typeCastNumber(String(route.params.item_id))), 
        fetchExchangeReasons(),
        fetchDeliveryCompanyCodes(), 
        fetchCreditCards()
    ]);
    exchangeForm.value.exchangeAddress = exchangeableOrder.value.shippingAddress;
    exchangeForm.value.retrieveAddress = exchangeableOrder.value.shippingAddress;
    orderItemSelectForm.value.orderItemSetIds.push(typeCastNumber(String(route.params.item_id)));
    mmon.loading.hide();

    // 부분선택 디폴트 체크
    exchangeableOrder.value.packs.forEach(pack => {
        pack.orderItemSets.forEach(orderItemSet => {
            orderItemSet.items.forEach(item => {
                // 리스트에서 취소버튼 클릭한 상품 default 체크
                if (item.id == Number(route.params.item_id)) {
                    orderItemSelectForm.value.orderItemSetIds.push(orderItemSet.id);
                }
            });
        })
    });

    // 사유 default 선택처리
    exchangeForm.value.reason = exchangeReasons.value[0].code;
});

onBeforeUnmount(() => {
    resetSelectedOptionList();
    resetNewAddressData();
});

// 교환 form에 선택한 옵션 id 적용
function applySelectedOptionToFormData() {
    const selectedOrderItemIds = pluck(selectedOrderItemPacks.value, "orderItemSets.items.id");
    exchangeForm.value.exchangeOptionPairs = selectedOrderItemIds.map(orderItemId => {
        return {
            orderItemId: typeCastNumber(orderItemId),
            optionId: typeCastNumber(selectedOptionList.value[orderItemId]),
        }
    })
}

// 주문상품 선택 단계로 이동
function toOrderItemSelect() {
    (Object.keys(process.value) as (keyof typeof process.value)[])
        .forEach(processKey => process.value[processKey] = false);
    process.value.orderItemSelect = true;
}

// 사유 선택 단계로 이동
function toReasonSelect() {
    if (selectedOrderItemPacks.value.length < 1) {
        return mmon.bom.alert('상품을 선택해주세요.');
    }

    resetSelectedOptionList();
    // 선택된 옵션 clear
    exchangeForm.value.exchangeOptionPairs = [];
    selectedOrderItemPacks.value.forEach(pack => {
        pack.orderItemSets.forEach(orderItemSet => {
            orderItemSet.items.forEach(orderItem => {
                orderItem.exchangeOption = undefined;
            })
        })
    });

    (Object.keys(process.value) as (keyof typeof process.value)[])
        .forEach(processKey => process.value[processKey] = false);
    process.value.reasonSelect = true;
}

// 옵션선택 단계로 이동
async function toOptionChange() {
    const validator = makeValidator(exchangeForm.value)
        .setRules({
            'reason(주문 교환 사유)': [ 'required' ],
            'reasonDetail(주문 교환 사유)': [ 
                `requiredIf:reason,${exchangeReasons.value.filter(reason => reason.requireDetail).map(reason => reason.code).join(',')}` 
            ]
        })
        .setMessages({
            'reason.required': ':param(을/를) 선택해주세요.',
            'reasonDetail.requiredIf': ':param(을/를) 입력해주세요.',
        });

    try {
        await validator.run();
        (Object.keys(process.value) as (keyof typeof process.value)[])
            .forEach(processKey => process.value[processKey] = false);
        process.value.optionChange = true;
    } catch (e) {
        defaultCatch(e)
    }
}

// 교환방법선택단계로 이동
async function toRetrieveMethodSelect() {
    const validator = makeValidator(exchangeForm.value)
        .setRules({
            "exchangeOptionPairs.*.orderItemId(주문 교환하실 상품)": [ "required"],
            "exchangeOptionPairs.*.optionId(주문 교환하실 옵션)": [ "required", "minValue:1"],
            "exchangeOptionPairs(주문 교환하실 상품)": [ "required" ],
        })
        .setMessages({
            'exchangeOptionPairs.required': ':param(을/를) 선택해주세요.',
            'exchangeOptionPairs.*.orderItemId.required': ':param(을/를) 선택해주세요.',
            'exchangeOptionPairs.*.optionId.required': ':param(을/를) 선택해주세요.',
            'exchangeOptionPairs.*.optionId.minValue': ':param(을/를) 선택해주세요.',
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

// 교환주소 입력단계로 이동
async function toExchangeAddress() {
    const validator = makeValidator(Object.assign(exchangeForm.value, { isSelfRetrieve: isRetrievedByOrderer.value ? '1' : '0' }))
        .setRules({
            // 반품송장정보
            'retrievedShippingInfo.deliveryCompanyCode(택배사)': [ 'requiredIf:isSelfRetrieve,1', `in:${deliveryCompanies.value.map(company => company.code).join(',')}` ],
            'retrievedShippingInfo.invoiceNumber(송장번호)': [ 'requiredIf:isSelfRetrieve,1', 'number' ],
            // 교환수거지 정보
            'retrieveAddress.name(교환 수거지 주문자명)': [ 'requiredIf:isSelfRetrieve,0', 'maxLength:50' ],
            'retrieveAddress.tel(교환 수거지 연락처)': [ 'requiredIf:isSelfRetrieve,0', 'number', 'maxLength:12'],
            'retrieveAddress.zipCode(교환 수거지 우편번호)': [ 'requiredIf:isSelfRetrieve,0' ],
            'retrieveAddress.baseAddress(교환 수거지 주소)': [ 'requiredIf:isSelfRetrieve,0'],
            'retrieveAddress.detailAddress(교환 수거지 상세주소)': [ 'requiredIf:isSelfRetrieve,0', 'maxLength:100'],
        })
        .setMessages({
            'retrievedShippingInfo.deliveryCompanyCode.requiredIf': ':param(을/를) 선택해주세요.',
            'retrievedShippingInfo.invoiceNumber.requiredIf': ':param(을/를) 입력해주세요.',
            'retrievedShippingInfo.invoiceNumber.number': ':param(은/는) 숫자로 입력해주세요.',

            'retrieveAddress.name.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.tel.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.zipCode.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.baseAddress.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.detailAddress.requiredIf': ':param(은/는) 필수값입니다.',
        });
    try {
        await validator.run();
        (Object.keys(process.value) as (keyof typeof process.value)[])
            .forEach(processKey => process.value[processKey] = false);
        process.value.exchangeAddress = true;
    } catch (e) {
        defaultCatch(e)
    }
}

async function toAdditionalPayment() {
    const validator = makeValidator(Object.assign(exchangeForm.value))
        .setRules({
            'exchangeAddress.name(교환 배송지 주문자명)': [ 'required', 'maxLength:50' ],
            'exchangeAddress.tel(교환 배송지 연락처)': [ 'required', 'number', 'maxLength:12'],
            'exchangeAddress.zipCode(교환 배송지 우편번호)': [ 'required' ],
            'exchangeAddress.baseAddress(교환 배송지 주소)': [ 'required'],
            'exchangeAddress.detailAddress(교환 배송지 상세주소)': [ 'required', 'maxLength:100'],
        })
        .setMessages({
            'exchangeAddress.name.requiredIf': ':param(은/는) 필수값입니다.',
            'exchangeAddress.tel.requiredIf': ':param(은/는) 필수값입니다.',
            'exchangeAddress.zipCode.requiredIf': ':param(은/는) 필수값입니다.',
            'exchangeAddress.baseAddress.requiredIf': ':param(은/는) 필수값입니다.',
            'exchangeAddress.detailAddress.requiredIf': ':param(은/는) 필수값입니다.',
        });
    try {
        await validator.run();
        await fetchAdditionalPaymentsInfo(
            exchangeableOrder.value.orderId,
            exchangeForm.value.exchangeOptionPairs,
            typeCastNumber(exchangeForm.value.reason),
            typeCastNumber(exchangeForm.value.retrieveMethod),
            exchangeForm.value.retrieveAddress,
            exchangeForm.value.exchangeAddress
        );
        (Object.keys(process.value) as (keyof typeof process.value)[])
            .forEach(processKey => process.value[processKey] = false);
        process.value.additionalPayment = true;
    } catch (e) {
        defaultCatch(e)
    }
}

// 조회
async function fetchExchangeableOrder(orderId: string, orderItemId: number) {
    try {
        const exchangeable = await exchangeRepository.getExchangeable(orderId, orderItemId);
        exchangeableOrder.value = exchangeable.order;
        availableRetrieveMethods.value = exchangeable.availableRetrieveMethods;
    } catch (e) {
        defaultCatch(e);
    }
}

// 택배사 코드 조회
async function fetchDeliveryCompanyCodes() {
    try {
        deliveryCompanies.value = await globalConfigsRepository.getDeliveryCompanies();
    } catch (e) {
        defaultCatch(e);
    }
}

// 카드사 조회
async function fetchCreditCards() {
    try {
        const paymentMethods = await orderRepository.getPayMethods()
        creditCards.value = (paymentMethods.find(method => method.engLabel === 'credit_card')?.childMethods)|| [];
    } catch (e) {
        defaultCatch(e);
    }
}

// 교환사유 리스트 조회
async function fetchExchangeReasons () {
    try {
        exchangeReasons.value = await exchangeRepository.getReasons();
    } catch (e) {
        defaultCatch(e);
    }
}

/**
 * 추가결제금 조회
 * @param orderId               주문ID
 * @param exchangeOptionPairs   교환옵션 리스트 
 * @param reasonCode            교환사유 코드
 * @param retrieveMethod        수거방법 코드
 * @param retrieveAddress       교환수거지 주소
 * @param exchangeAddress       교환배송지 주소
 */
async function fetchAdditionalPaymentsInfo(
    orderId: string,
    exchangeOptionPairs: ExchangeOptionPair[], 
    reasonCode: number, 
    retrieveMethod: number, 
    retrieveAddress: ExchangeForm["retrieveAddress"],
    exchangeAddress: ExchangeForm["exchangeAddress"]
) {
    const validator = makeValidator({
        exchangeOptionPairs: exchangeOptionPairs, 
        reasonCode: reasonCode, 
        retrieveMethod: retrieveMethod, 
        retrieveAddress: retrieveAddress,
        exchangeAddress: exchangeAddress
    })
        .setRules({
            "exchangeOptionPairs": [ "required" ],
            "exchangeOptionPairs.*.orderItemId": [ "required", "minValue:1"],
            "exchangeOptionPairs.*.optionId": [ "required", "minValue:1"],
            "reasonCode": [ "required"],
            "retrieveMethod": [ "required"],
            "retrieveAddress": [ "required"],
            "retrieveAddress.zipCode": [ "required"],
            "retrieveAddress.baseAddress": [ "required"],
            "retrieveAddress.detailAddress": [ "required"],
            "exchangeAddress": [ "required"],
            "exchangeAddress.zipCode": [ "required"],
            "exchangeAddress.baseAddress": [ "required"],
            "exchangeAddress.detailAddress": [ "required"],
        })

    // 필수 파라미터 없을시 기본값
    try {
        await validator.run();
    } catch (e) {
        additionalPayments.value = defaultAdditionalPayments;
        return;
    }

    // 조회
    try {
        additionalPayments.value = await exchangeRepository.getAdditionalPaymentsInfo(
            orderId,
            exchangeOptionPairs,
            reasonCode,
            retrieveMethod,
            retrieveAddress,
            exchangeAddress,
        )
    } catch (e) {
        defaultCatch(e);
        additionalPayments.value = defaultAdditionalPayments;
    }
}

/**
 * 교환 요청
 */
async function applyExchange() {
    mmon.loading.show()
    // 교환수거지 전화번호 '-'포함시 제거
    exchangeForm.value.retrieveAddress.tel = exchangeForm.value.retrieveAddress.tel.replaceAll('-', '');
    exchangeForm.value.exchangeAddress.tel = exchangeForm.value.retrieveAddress.tel.replaceAll('-', '');

    const isSelfRetrieve = availableRetrieveMethods.value.find(method => method.code == exchangeForm.value.retrieveMethod)?.isRetrieveByOrderer;
    const validator = makeValidator(Object.assign({isSelfRetrieve: isSelfRetrieve ? '1' : '0'}, exchangeForm.value))
        .setRules({
            "exchangeOptionPairs.*.orderItemId(주문 교환하실 상품)": [ "required"],
            "exchangeOptionPairs.*.optionId(주문 교환하실 옵션)": [ "required", "minValue:1"],
            "exchangeOptionPairs(주문 교환하실 상품)": [ "required" ],
            'reason(주문 교환 사유)': [ 'required', `in:${exchangeReasons.value.map(reason => reason.code).join(',')}` ],
            'reasonDetail(주문 교환 사유)': [ `requiredIf:returnReason,${exchangeReasons.value.filter(reason => reason.requireDetail).map(reason => reason.code).join(',')}` ],
            // 반품송장정보
            'retrievedShippingInfo.deliveryCompanyCode(택배사)': [ 'requiredIf:isSelfRetrieve,1', `in:${deliveryCompanies.value.map(company => company.code).join(',')}` ],
            'retrievedShippingInfo.invoiceNumber(송장번호)': [ 'requiredIf:isSelfRetrieve,1', 'number'],
            // 교환수거지 정보
            'retrieveAddress.name(교환 수거지 주문자)': [ 'requiredIf:isSelfRetrieve,0', 'maxLength:50' ],
            'retrieveAddress.tel(교환 수거지 연락처)': [ 'requiredIf:isSelfRetrieve,0', 'number', 'maxLength:12'],
            'retrieveAddress.zipCode(교환 수거지 우편번호)': [ 'requiredIf:isSelfRetrieve,0' ],
            'retrieveAddress.baseAddress(교환 수거지 주소)': [ 'requiredIf:isSelfRetrieve,0'],
            'retrieveAddress.detailAddress(교환 수거지 상세주소)': [ 'requiredIf:isSelfRetrieve,0', 'maxLength:100'],
            // 교환배송지 정보
            'exchangeAddress.name(교환 배송지 주문자)': [ 'required', 'maxLength:50' ],
            'exchangeAddress.tel(교환 배송지 연락처)': [ 'required', 'number', 'maxLength:12'],
            'exchangeAddress.zipCode(교환 배송지 우편번호)': [ 'required' ],
            'exchangeAddress.baseAddress(교환 배송지 주소)': [ 'required'],
            'exchangeAddress.detailAddress(교환 배송지 상세주소)': [ 'required', 'maxLength:100'],
        })
        .setMessages({
            'exchangeOptionPairs.required': ':param(을/를) 선택해주세요.',
            'exchangeOptionPairs.*.orderItemId.required': ':param(을/를) 선택해주세요.',
            'exchangeOptionPairs.*.optionId.required': ':param(을/를) 선택해주세요.',
            'exchangeOptionPairs.*.optionId.minValue': ':param(을/를) 선택해주세요.',
            'reason.in': ':param(이/가) 올바르지 않습니다.',
            'reason.required': ':param(을/를) 선택해주세요.',
            'reasonDetail.requiredIf': ':param(을/를) 입력해주세요.',
            // 반품송장정보
            'retrievedShippingInfo.deliveryCompanyCode.requiredIf': ':param(을/를) 선택해주세요.',
            'retrievedShippingInfo.invoiceNumber.requiredIf': ':param(을/를) 입력해주세요.',
            'retrievedShippingInfo.invoiceNumber.number': ':param(은/는) 숫자로 입력해주세요.',
            // 교환수거지 정보
            'retrieveAddress.name.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.tel.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.zipCode.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.baseAddress.requiredIf': ':param(은/는) 필수값입니다.',
            'retrieveAddress.detailAddress.requiredIf': ':param(은/는) 필수값입니다.',
            // 교환배송지 정보
            'exchangeAddress.name.requiredIf': ':param(은/는) 필수값입니다.',
            'exchangeAddress.tel.requiredIf': ':param(은/는) 필수값입니다.',
            'exchangeAddress.zipCode.requiredIf': ':param(은/는) 필수값입니다.',
            'exchangeAddress.baseAddress.requiredIf': ':param(은/는) 필수값입니다.',
            'exchangeAddress.detailAddress.requiredIf': ':param(은/는) 필수값입니다.',
        });

    try {
        await validator.run();
        if (additionalPayments.value.totalPrice > 0 && typeCastNumber(isPayNow.value) == 1) {
            const paymentValidator = makeValidator(paymentForm.value)
                .setRules({
                    'cardCode(결제수단)': ['required', `in:${(creditCards.value || []).map(card => card.code).join(',')}`]
                })
                .setMessages({
                    'cardCode.required': ':param(을/를) 선택해주세요.',
                    'cardCode.in': ':param(이/가) 올바르지 않습니다.',
                });
                
            await paymentValidator.run();
        }
        mmon.bom.confirm('교환 신청을 진행하시겠습니까?', async (isConfirm: boolean) => {
            if (!isConfirm) {
                return;
            }

            try {
                // 즉시결제진행
                if (additionalPayments.value.totalPrice > 0 && typeCastNumber(isPayNow.value) == 1) {
                    paymentForm.value.paymentPrice = additionalPayments.value.totalPrice;

                    await handlePopupOpenWithUrlCallback(
                        'paying-start', 
                        async() => {
                            const { payingUrl, paymentToken } = await exchangeRepository.prepareAdditionalPay(
                                exchangeableOrder.value.orderId, 
                                paymentForm.value, 
                                exchangeForm.value
                            ); 
                            exchangeForm.value.paymentToken = paymentToken;
                            return payingUrl;
                        },
                        'width=600px, height=600px, resizble=no, scrollbars=no'  
                    );
                    
                    const { isSuccess, errorMessage } = await exchangeRepository.getAdditionalPayResult(exchangeForm.value.paymentToken);
                    if (!isSuccess) {
                        throw new Error(errorMessage)
                    }
                    
                    exchangeForm.value.isAdditionalPaymentPaid = true;
                } 
                
                // 교환 신청
                const exchangeId = await exchangeRepository.applyExchange(exchangeableOrder.value.orderId, exchangeForm.value);

                // 완료 페이지 이동
                router.replace({ 
                    name: 'GuestMyPageOrderExchangeComplete', 
                    params: { 
                        order_id: exchangeableOrder.value.orderId,
                        exchange_id: exchangeId,
                    } 
                });
            } catch (e) {
                defaultCatch(e)
            }
        });

    } catch (e) {
        defaultCatch(e)
    }
    mmon.loading.hide();
}
</script>
