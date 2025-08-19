<template>
    <div class="mm_page-content-body">
        <h3 class="mm_heading">
            <b>주문 반품</b>
        </h3>
        <div class="m_my-order">
            <!--
                (D) 반품 상품 선택 후 '선택 완료' 버튼 클릭 시 'S=process-on' 클래스가 추가됩니다.
                    'S=process-on'클래스가 추가될 경우 'm_my-order-process'가 노출됩니다
                    '상품 재선택' 버튼 클릭 시 'S=process-on' 클래스가 삭제되고, 반품 상품을 다시 선택할 수 있습니다
            -->
            <div
                class="m_my-order-process"
                :class="isOrderItemSelectComplete ? 'S=process-on' : ''"
            >
                <!-- 반품 신청 내용 -->
                <div class="m...process-apply">
                    <!-- 반품 사유 선택 -->
                    <!-- 펀딩상품(유료기능)은 단순 변심으로 인한 반품 및 교환 불가 -->
                    <section class="m_my-order-choice">
                        <h5 class="mm_strapline T=line">
                            <b>반품 사유 선택</b>
                        </h5>
                        <div class="m_my-order-reason">
                            <ul class="mm_flex T=equal">
                                <li
                                    v-for="reason in returnReasons"
                                    :key="reason.code"
                                >
                                    <MMRadio
                                        v-model="returnForm.returnReason"
                                        :value="reason.code"
                                        name="return_reason"
                                    >
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
                            <div
                                class="mm_syncer-reason"
                                :class="isReasonDetailRequired ? 'S=radio-use' : ''"
                            >
                                <MMTextarea
                                    v-model="returnForm.returnReasonDetail"
                                    :maxlength="100"
                                    place-holder-text="상세 사유를 입력하세요(필수입력)"
                                />
                            </div>
                        </div>
                    </section>
                    <!--// 반품 사유 선택 -->

                    <!-- 반품 방법 선택 -->
                    <section class="m_my-order-way">
                        <h5 class="mm_strapline T=line">
                            <b>반품 방법 선택</b>
                        </h5>
                        <div class="mm_radio-list T=chain">
                            <ul>
                                <li
                                    v-for="(retrieveMethod, index) in retrieveMethods"
                                    :key="retrieveMethod.code"
                                >
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
                                </li>
                            </ul>
                        </div>
                        <div
                            class="mm_syncer-way-already"
                            :class="isRetrievedByOrderer ? 'S=radio-use' : ''"
                        >
                            <div class="mm_order-form">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th scope="row">
                                                <b>발송한 택배사</b>
                                            </th>
                                            <td>
                                                <MMSelect
                                                    v-model="returnForm.retrievedShippingInfo.deliveryCompany"
                                                    class="T=short"
                                                >
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
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">
                                                <b>송장번호</b>
                                            </th>
                                            <td>
                                                <MMInput
                                                    v-model="returnForm.retrievedShippingInfo.invoiceNumber"
                                                    class="T=short"
                                                    :maxlength="50"
                                                    place-holder-text="송장번호를 입력하세요"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div
                            class="mm_syncer-way-yet"
                            :class="!isRetrievedByOrderer ? 'S=radio-use' : ''"
                        >
                            <div class="mm_order-info">
                                <table>
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
                                                <span class="text_postcode">{{ returnForm.retrieveAddress.zipCode }}</span>
                                                <b>{{ returnForm.retrieveAddress.baseAddress + ' ' + returnForm.retrieveAddress.detailAddress }}</b>
                                                <a 
                                                    class="mm_btn T=xs T=line T=dark btn_address-change" 
                                                    href="" 
                                                    @click.prevent="addressModalOpen()"
                                                >
                                                    <b>주소변경</b><i class="ico_link T=xs" />
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="mm_note">
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
                    </section>
                    <!--// 반품 방법 선택 -->

                    <!-- 환불 예상금액 -->
                    <section class="mm_order-info">
                        <h5 class="mm_strapline T=line">
                            <b>환불 예상금액</b>
                        </h5>
                        <table>
                            <tbody>
                                <tr>
                                    <th scope="row">
                                        <strong>반품 상품 주문 금액</strong>
                                    </th>
                                    <td>
                                        <p class="text_price">
                                            <strong>{{ MMFilters.formatNumber(refundInfo.totalPaidPrice) }}</strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr
                                    v-for="detail in refundInfo.calculateDetails"
                                    :key="detail.label"
                                >
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
                                <tr>
                                    <th scope="row">
                                        <strong>환불 예상금액</strong>
                                    </th>
                                    <td>
                                        <p class="text_price mm_text-variable">
                                            <strong>{{ MMFilters.formatNumber(refundInfo.refundPrice + refundInfo.refundPoint) }}</strong>
                                        </p>
                                        <b>
                                            ({{ returnableOrder.paymentMethodLabel }} 환불 {{ MMFilters.formatNumber(refundInfo.refundPrice) }}원 + 
                                            {{ pointLabel.name }} 환불 {{ MMFilters.formatNumber(refundInfo.refundPoint) }}{{ pointLabel.suffix }})
                                        </b>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="mm_note">
                            <ul>
                                <li>환불 예상금액과 최종적으로 환불 받으실 금액은 상이할 수 있습니다.</li>
                                <li>적립금을 제외한 환불금액이 0원 이하일 경우 반품 신청이 불가합니다.</li>
                                <li>초도 배송비를 지불하셨을 경우 귀책 사유 관계 없이 면제 배송비가 부과되지 않습니다.</li>
                            </ul>
                        </div>
                    </section>
                    <!--// 환불 예상금액 -->
                    <!-- 환불 계좌 관리 -->
                    <section class="mm_order-info">
                        <h5 class="mm_strapline T=line">
                            <b>환불 계좌 관리</b>
                        </h5>
                        <table>
                            <tbody v-if="refundAccount">
                                <!-- (D) 환불 계좌 등록 후 노출 형식 입니다 -->
                                <tr>
                                    <th scope="row">
                                        <b>예금주명</b>
                                    </th>
                                    <td>{{ refundAccount.ownerName }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>은행명</b>
                                    </th>
                                    <td>{{ refundAccount.bankName }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>계좌번호</b>
                                    </th>
                                    <td>
                                        <b>{{ refundAccount.accountNumber }}</b>
                                        <a
                                            class="mm_btn T=xs btn_refund-set"
                                            href="#"
                                            @click.prevent="refundModalOpen()"
                                        >
                                            <b>변경하기</b>
                                            <i class="ico_link T=xs" />
                                        </a>
                                        <div class="mm_note">
                                            <ul>
                                                <li>입력하신 계좌 정보는 환불 목적으로만 이용되고 있습니다.</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <!-- (D) 환불 계좌 등록 전 노출 형식 입니다 -->
                            <tbody v-else>
                                <tr>
                                    <th scope="row">
                                        <b>계좌번호</b>
                                    </th>
                                    <td>
                                        <b>환불 계좌를 등록해주세요.</b>
                                        <a
                                            class="mm_btn T=xs btn_refund-set"
                                            href="#"
                                            @click.prevent="refundModalOpen()"
                                        >
                                            <b>등록하기</b><i class="ico_link T=xs" />
                                        </a>
                                        <div class="mm_note">
                                            <ul>
                                                <li>입력하신 계좌 정보는 환불 목적으로만 이용되고 있습니다.</li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <!--// 환불 계좌 관리 -->

                    <!-- 하단 버튼 -->
                    <div class="mm_foot">
                        <div class="mm_btn_box T=equal">
                            <button
                                type="button"
                                class="mm_btn T=line btn_process-select"
                                @click="isOrderItemSelectComplete = false"
                            >
                                <b>상품 재선택</b>
                            </button>
                            <button
                                type="button"
                                class="mm_btn T=primary"
                                @click="applyReturn"
                            >
                                <b>반품 신청하기</b>
                            </button>
                        </div>
                    </div>
                    <!--// 하단 버튼 -->

                    <!-- 유의사항 -->
                    <section class="mm_note">
                        <h6 class="text_title">
                            <i class="ico_note" /><b>반품 주의사항</b>
                        </h6>
                        <ul>
                            <li>주문 제작하신 상품 및 해외 배송 상품은 반품이 불가하여 리스트에 노출되지 않습니다.</li>
                            <li>반품은 배송 완료 이후 7일 이내 신청 가능합니다.</li>
                            <li>반품 사유별 배송비 부담이 상이합니다.</li>
                            <li>묶음 반품의 경우 동일한 업체에 한해서 가능합니다.</li>
                            <li>반품하실 상품을 발송하기 전에 한해서 반품 철회가 가능합니다.</li>
                        </ul>
                    </section>
                    <!--// 유의사항 -->
                </div>
                <!--// 반품 신청 내용 -->

                <!-- 반품 상품 선택 -->
                <div class="m...process-product">
                    <!-- 주문 반품 내역 -->
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
                            <ul>
                                <li
                                    v-for="orderItemSet in pack.orderItemSets"
                                    :key="orderItemSet.id"
                                >
                                    <div class="mm_flex">
                                        <MMCheck
                                            v-model="checkedOrderItemSetIds"
                                            :value="orderItemSet.id"
                                            label="상품 선택"
                                            :is-blind-label="true"
                                        />
                                        <p class="text_status">
                                            {{ orderItemSet.orderStatusLabel }}
                                        </p>
                                        <MMSimpleGoods
                                            :goods="orderItemSet.goods"
                                            class="T=single"
                                        />
                                        <p class="text_seller">
                                            <i class="ico_shop" />{{ orderItemSet.sellerName }}
                                        </p>
                                        <!-- (D) 회원 일 경우에 사용 적립금 관련 내용이 노출됩니다 -->
                                        <div class="mm...order-price">
                                            <p class="text_price">
                                                <strong>{{ MMFilters.formatNumber(orderItemSet.totalPaidPrice + orderItemSet.totalPointUsed) }}</strong>
                                            </p>
                                            <p class="text_point">
                                                사용 {{ pointLabel.name }}
                                                <b>
                                                    <strong>{{ MMFilters.formatNumber(orderItemSet.totalPointUsed) }}</strong>
                                                    <sub>{{ pointLabel.suffix }}</sub>
                                                </b>
                                            </p>
                                        </div>
                                        <dl><dt>반품 수량</dt><dd>{{ checkedPartialOrderItemIds[orderItemSet.id]?.length || 0 }}개</dd></dl>
                                        <div class="mm_block">
                                            <a 
                                                class="mm_btn T=sm T=line T=light" 
                                                :href="orderItemSet.items.length <= 1 ? undefined : '#'"
                                                @click.prevent="openOrderItemSelectModal(orderItemSet, orderItemSet.sellerName)"
                                            >
                                                <b>부분 선택</b>
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </article>
                    <!--// 주문 반품 내역 -->

                    <!-- 하단버튼 -->
                    <div class="mm_foot">
                        <div class="mm_btn_box">
                            <button
                                type="button"
                                class="mm_btn T=primary btn_process-complete"
                                @click="completeOrderItemSelect"
                            >
                                <b>선택 완료</b>
                            </button>
                        </div>
                    </div>
                    <!--// 하단버튼 -->

                    <!-- 유의사항 -->
                    <section class="mm_note">
                        <h6 class="text_title">
                            <i class="ico_note" /><b>반품 주의사항</b>
                        </h6>
                        <ul>
                            <li>주문 제작하신 상품 및 해외 배송 상품은 반품이 불가하여 리스트에 노출되지 않습니다.</li>
                            <li>반품은 배송 완료 이후 7일 이내 신청 가능합니다.</li>
                            <li>반품 사유별 배송비 부담이 상이합니다.</li>
                            <li>묶음 반품의 경우 동일한 업체에 한해서 가능합니다.</li>
                            <li>반품하실 상품을 발송하기 전에 한해서 반품 철회가 가능합니다.</li>
                        </ul>
                    </section>
                    <!--// 유의사항 -->
                </div>
                <!--// 반품 상품 선택 -->
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, computed, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { makeValidator } from '$/validator';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { typeCastNumber } from '$/filters';
import { DeliveryCompany } from '$/@type/configs';
import { ShippingAddress } from '$/@type/order/order';
import { PointLabel } from '$/@type/member/point';
import { AddressForm, RefundInfo, RetrieveMethod, ReturnForm } from '$/@type/myOrder';
import { ReturnableOrder } from '$/@type/myOrder/order';
import { ReturnReason } from '$/@type/myOrder/claimReason';
import { OrderItemSet, ReturnableOrderItem } from '$/@type/myOrder/item';
import { RefundAccount } from '$/@type/member/refundAccount';
import { returnRepository } from '$/repository/myOrder/returnRepository';
import { globalConfigsRepository } from '$/repository/globalConfigsRepository';
import { refundAccountRepository } from '$/repository/member/refundAccountRepository';
import MMCheck from '@/components/input/Check.vue';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import MMRadio from '@/components/input/Radio.vue';
import MMTextarea from '@/components/input/Textarea.vue';
import MMSelect from '@/components/input/Select.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useBankCodes, useGlobalConfigs } from '$/composables/globalConfigComposable';
import OrderItemSelect from '@/components/modal/myOrder/OrderItemSelect.vue'
import { useModal } from '$/composables/pageHandler/modalComposable';
import RefundAccountModal from '@/components/modal/RefundAccount.vue';
import AddressModal from '@/components/modal/myOrder/AddressList.vue';
import { shippingRepository } from '$/repository/order/shippingRepository';

const router = useRouter();
const route = useRoute();
usePageTitleSetting('주문 반품', ['주문 관리', '마이페이지']);

const { globalConfigs } = useGlobalConfigs();
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);
const returnReasons = ref<ReturnReason[]>([]);  // 반품사유 리스트
const retrieveMethods = ref<RetrieveMethod[]>([]);
const deliveryCompanies = ref<DeliveryCompany[]>([]);
const refundAccount = ref<RefundAccount>(); // 환불계좌

// 주문
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
//주문상품 선택 영역 노출여부
const isOrderItemSelectComplete = ref<boolean>(false);
//선택된 주문상품
const checkedOrderItemSetIds = ref<number[]>([]);   // 선택된 주문상품 묶음 ID
const checkedPartialOrderItemIds = reactive<{ [key: number]: number[] }>({});   // 부분선택된 주문상품 ID

// 환불금액정보
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


/**
 * 선택상품 form 에 적용
 */
function applySelectedToReturnForm() {
    let selected: number[] = [];
    checkedOrderItemSetIds.value.forEach(itemId => {
        selected = selected.concat(checkedPartialOrderItemIds[itemId]);
    });
    returnForm.orderItemIds = selected;
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
 * 주문상품 선택 완료 처리
 */
function completeOrderItemSelect() {
    applySelectedToReturnForm();
    if (returnForm.orderItemIds.length < 1) {
        return mmon.bom.alert('반품할 상품을 선택해주세요.');   
    }
    isOrderItemSelectComplete.value = true;
}

/**
 * 주문상품 부분선택 모달 open
 * @param orderItem 취소주문상품
 */
function openOrderItemSelectModal(orderItemSet: OrderItemSet<ReturnableOrderItem>, sellerName: string) {
    if (orderItemSet.items.length < 2) {
        return;
    }

    useModal().open(OrderItemSelect, {
        title: '부분선택',
        name: 'OrderItemSelect',
        itemClass: 'm_modal-myorder-option',
        props: {
            orderItems: orderItemSet.items,
            orderItemSetId: orderItemSet.id,
            sellerName: sellerName,
            selectedOrderItemIds: checkedPartialOrderItemIds[orderItemSet.id] || []
        },
        onClose: (changeItems: { selected: number[], orderItemSetId: number }) => {
            // /**
            //  * 부분선택 처리
            //  * @param selected 선택된 주문상품 id 리스트. checkedPartialOrderItemIds에 저장됨
            //  * @param orderItemSetId 동일 상품/옵션/배송상태 묶음 주문상품 아이디. checkedOrderItemSetIds에 저장됨
            //  */
            checkedPartialOrderItemIds[changeItems.orderItemSetId] = changeItems.selected;
        }
    })           
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
 * 환불계좌 조회
 */
async function fetchRefundAccount() {
    try {
        refundAccount.value = await refundAccountRepository.get();
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
            'refundAccount.bankCod.required': ':param(을/를) 등록해주세요.',
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

function refundModalOpen() {
    useModal().open(RefundAccountModal, {
        title: refundAccount.value ? '환불 계좌 변경' : '환불 계좌 등록',
        name: 'RefundAccountModal',
        props: async() => {
            const { bankCodes } = useBankCodes();
            return {
                refundAccount: refundAccount.value,
                bankCodes
            }
        },
        onClose: async() => {
            // 환불계좌 재조회
            await fetchRefundAccount();
            // 반품신청 form data에 환불계좌정보 적용
            returnForm.refundAccount.accountNumber = refundAccount.value?.accountNumber || '';
            returnForm.refundAccount.bankCode = refundAccount.value?.bankCode || '';
            returnForm.refundAccount.bankName = refundAccount.value?.bankName || '';
            returnForm.refundAccount.ownerName = refundAccount.value?.ownerName || '';

        }
    })
}

function addressModalOpen() {
    useModal().open(AddressModal, {
        title: '배송지 관리',
        name: 'AddressModal',
        props: async() => {
            const addressList = await shippingRepository.getReceiveAddresses();
            return {
                addressList
            }
        },
        onClose: (shippingAddress: ShippingAddress) => {
            returnForm.retrieveAddress = shippingAddress;
        }
    })
}

/**
    * 반품사유, 주문상품선택완료 여부 따라 환불정보 조회
    */
watchEffect(async () => {
    if (!isOrderItemSelectComplete.value) {
        return;
    }

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
})

onMounted(async () => {
    mmon.loading.show()
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
            checkedPartialOrderItemIds[orderItemSet.id] = []
            orderItemSet.items.forEach(item => {
                // 리스트에서 버튼 클릭한 상품 default 체크
                if (item.id == Number(route.params.item_id)) {
                    checkedOrderItemSetIds.value.push(orderItemSet.id);
                    checkedPartialOrderItemIds[orderItemSet.id].push(item.id)
                    return;
                }
                if (orderItemSet.items.length == 1) {
                    checkedPartialOrderItemIds[orderItemSet.id].push(item.id);
                }
            });
        })
    });
    
    // 반품사유 default 선택처리
    returnForm.returnReason = returnReasons.value[0].code;

    // 환불계좌 세팅
    if (refundAccount.value) {
        returnForm.refundAccount = {
            ownerName: refundAccount.value.ownerName,
            bankCode: refundAccount.value.bankCode,
            accountNumber: refundAccount.value.accountNumber,
        }
    }
    applySelectedToReturnForm();
})
</script>