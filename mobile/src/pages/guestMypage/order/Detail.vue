<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>주문 상세</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <section class="m_myorder-detail">
                            <h3>
                                <b>{{ MMFilters.formatDate(order.orderedAt, "YYYY.MM.DD") }}</b>
                                <strong>주문번호: {{ order.orderId }}</strong>
                            </h3>
                            <hr class="mm_line">
                            <!-- 주문자 정보 -->
                            <div v-dropdown="{ isOn: true, closeOther: false }" class="mm_dropdown T=order">
                                <button type="button" class="btn_dropdown" title="접어놓기">
                                    <b>주문자 정보</b><i class="ico_dropdown" />
                                </button>
                                <div class="mm_dropdown-item">
                                    <div class="mm_dropdown-item-inner">
                                        <div class="mm_inner">
                                            <div class="mm_order-info">
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row">
                                                                <b>주문자 이름</b>
                                                            </th>
                                                            <td>{{ order.ordererInfo.name }}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">
                                                                <b>휴대폰 번호</b>
                                                            </th>
                                                            <td>{{ order.ordererInfo.tel }}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">
                                                                <b>이메일 주소</b>
                                                            </th>
                                                            <td>{{ order.ordererInfo.email }}</td>
                                                        </tr>
                                                        <tr v-if="order.ordererInfo.personalClearanceCode">
                                                            <th scope="row">
                                                                <b>개인통관<br> 고유번호</b>
                                                            </th>
                                                            <td>{{ order.ordererInfo.personalClearanceCode }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="mm_line">
                            <!--// 주문자 정보 -->

                            <!-- 배송 정보 -->
                            <div v-dropdown="{ isOn: true, closeOther: false }" class="mm_dropdown T=order">
                                <button type="button" class="btn_dropdown" title="접어놓기">
                                    <b>배송 정보</b><i class="ico_dropdown" />
                                </button>
                                <div class="mm_dropdown-item">
                                    <div class="mm_dropdown-item-inner">
                                        <div class="mm_inner">
                                            <div class="mm_order-info">
                                                <table>
                                                    <caption>상품 받을 주소</caption>
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row">
                                                                <b>받는 사람</b>
                                                            </th>
                                                            <td>{{ order.shippingAddress.name }}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">
                                                                <b>휴대폰 번호</b>
                                                            </th>
                                                            <td>{{ order.shippingAddress.tel }}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">
                                                                <b>주소</b>
                                                            </th>
                                                            <td>{{ order.shippingAddress.zipCode }}<br>{{ order.shippingAddress.baseAddress }} {{ order.shippingAddress.detailAddress }}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">
                                                                <b>배송메모</b>
                                                            </th>
                                                            <td>{{ order.shippingAddress.message }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <!-- (D) '입금 대기, 결제 완료' 주문일 경우 '주소변경' 버튼을 노출합니다. -->
                                                <a v-if="order.shippingAddressChangeable" class="mm_btn T=xs T=line btn_address-change" href="#GUEST_ADDRESS_EDIT"><b>주소변경</b></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="mm_line">
                            <!--// 배송 정보 -->

                            <!-- 구매 상품 -->
                            <div v-dropdown="{ isOn: true, closeOther: false }" class="mm_dropdown T=order">
                                <button type="button" class="btn_dropdown" title="접어놓기">
                                    <b>구매 상품</b><i class="ico_dropdown" />
                                </button>
                                <div class="mm_dropdown-item">
                                    <div class="mm_dropdown-item-inner">
                                        <div class="mm_order-item">
                                            <template v-for="pack in order.packs" :key="pack.shippingRuleId">
                                                <div v-for="seller in pack.sellers" :key="seller.id" class="mm_order-item-seller">
                                                    <div class="mm_order...seller-head">
                                                        <h5><i class="ico_shop" /><b>{{ seller.name }}</b></h5>
                                                    </div>
                                                    <div class="mm_product-list T=sm">
                                                        <ul>
                                                            <li v-for="orderItem in seller.orderItems" :key="orderItem.id">
                                                                <MMOrderGoods :goods="orderItem.goods" :price="orderItem.paidPrice">
                                                                    <template #order-status>
                                                                        <p class="text_status">
                                                                            {{ orderItem.orderStatusLabel }}
                                                                            <b v-if="orderItem.refundStatusLabel" class="text_refund">{{ orderItem.refundStatusLabel }}</b>
                                                                        </p>
                                                                    </template>
                                                                    <template #footer>
                                                                        <p v-if="orderItem.exchangedOptionName" class="text_changed">
                                                                            <strong class="mm_text-variable">변경된 옵션</strong>
                                                                            <span>{{ orderItem.exchangedOptionName.replace('/', ' ') }} / 1개</span>
                                                                        </p>
                                                                        <div class="mm_btn_box">
                                                                            <div class="mm_flex T=equal">
                                                                                <MMLink 
                                                                                    v-if="orderItem.cancelable"
                                                                                    class="mm_btn T=sm T=line"
                                                                                    href="#"
                                                                                    :to="{ name: 'GuestMyPageOrderCancel', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                                                                >
                                                                                    <b>주문취소</b>
                                                                                </MMLink>
                                                                                <button 
                                                                                    v-if="orderItem.receiptConfirmable" 
                                                                                    type="button"
                                                                                    class="mm_btn T=sm" 
                                                                                    @click="confirmReceipt(orderItem.id)"
                                                                                >
                                                                                    <b>수취확인</b>
                                                                                </button>
                                                                                <MMLink 
                                                                                    v-if="orderItem.exchangeable"
                                                                                    class="mm_btn T=sm T=line"
                                                                                    href="#"
                                                                                    :to="{ name: 'GuestMyPageOrderExchange', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                                                                >
                                                                                    <b>교환신청</b>
                                                                                </MMLink>
                                                                                <MMLink 
                                                                                    v-if="orderItem.returnable"
                                                                                    class="mm_btn T=sm T=line"
                                                                                    href="#"
                                                                                    :to="{ name: 'GuestMyPageOrderReturn', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                                                                >
                                                                                    <b>반품신청</b>
                                                                                </MMLink>
                                                                                <a 
                                                                                    v-if="orderItem.deliveryTrackable && !orderItem.returnDeliveryTrackingUrl" 
                                                                                    class="mm_btn T=sm T=line T=variable" 
                                                                                    :href="getOutIntentPath(orderItem.deliveryTrackingUrl)" 
                                                                                    target="_blank"
                                                                                    title="새 창 열림"
                                                                                ><b>배송조회</b>
                                                                                </a>
                                                                                <a 
                                                                                    v-if="orderItem.purchaseConfirmable" 
                                                                                    class="mm_btn T=sm T=variable"
                                                                                    href="#PURCHASE_CONFIRM"
                                                                                    @click.capture="setPurchaseConfirmModalData(orderItem, seller.name)"
                                                                                ><b>구매확정</b>
                                                                                </a>
                                                                                <button 
                                                                                    v-if="orderItem.returnCancelable" 
                                                                                    type="button"
                                                                                    class="mm_btn T=sm T=line"
                                                                                    @click="cancelReturn(orderItem.returnId, orderItem.returnTargetId)"
                                                                                >
                                                                                    <b>반품철회</b>
                                                                                </button>
                                                                                <button 
                                                                                    v-if="orderItem.exchangeCancelable" 
                                                                                    type="button"
                                                                                    class="mm_btn T=sm T=line"
                                                                                    @click="cancelExchange(orderItem.exchangeId, orderItem.exchangeTargetId)"
                                                                                >
                                                                                    <b>교환철회</b>
                                                                                </button>
                                                                                <MMLink 
                                                                                    v-if="orderItem.toReturnSwitchable"
                                                                                    class="mm_btn T=sm T=line"
                                                                                    :to="{ name: 'GuestMyPageOrderExchangeToReturn', params: { exchange_id: orderItem.exchangeId }}"
                                                                                >
                                                                                    <b>반품전환</b>
                                                                                </MMLink>
                                                                                <a 
                                                                                    v-if="orderItem.returnDeliveryTrackable" 
                                                                                    class="mm_btn T=sm T=line T=variable" 
                                                                                    :href="getOutIntentPath(orderItem.returnDeliveryTrackingUrl)"
                                                                                    target="_blank" 
                                                                                    title="새 창 열림"
                                                                                ><b>반송조회</b></a>
                                                                            </div>
                                                                        </div>
                                                                    </template>
                                                                </MMOrderGoods>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-if="order.originalOrderId">
                                                <MMLink 
                                                    class="btn_order-origin"
                                                    :to="{ name: 'GuestMyPageOrderDetail', params: { id: order.originalOrderId } }"
                                                >
                                                    <b>원 주문 상세보기<i class="ico_link" /></b>
                                                </MMLink>
                                            </template>
                                        </div>
                                        <!-- 사은품 정보 -->
                                        <div v-if="order.giveaways && order.giveaways.length > 0" class="mm_inner m_myorder-detail-gift">
                                            <h4 class="mm_strapline">
                                                <b>사은품 정보</b>
                                            </h4>
                                            <ul class="mm_gift-list">
                                                <li v-for="giveaway in order.giveaways" :key="giveaway.id">
                                                    <div class="mm_gift-item">
                                                        <figure>
                                                            <i v-lazyload="{ src: giveaway.imageUrl }" class="mm_bg-cover image_gift" />
                                                            <figcaption>
                                                                <p class="text_name">
                                                                    {{ giveaway.name }}
                                                                </p>
                                                                <p class="text_condition">
                                                                    {{ giveaway.conditionLabel }}
                                                                </p>
                                                            </figcaption>
                                                        </figure>
                                                        <div class="mm_btn_box">
                                                            <div class="mm_rside">
                                                                <a class="btn_gift-info" href="#GIVE_AWAY_TARGET" @click.capture="setGiveawayId(giveaway.id)">
                                                                    <b>지급대상확인</b><i class="ico_link T=xs" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <!--// 사은품 정보 -->
                                        <div v-if="!order.originalOrderId" class="mm_inner m_myorder-detail-cost">
                                            <!-- 최종 결제금액 -->
                                            <section class="mm_costbox">
                                                <h4 class="mm_strapline">
                                                    <b>최종 결제금액</b>
                                                </h4>
                                                <div class="mm_cost">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row">
                                                                    <b>총 상품금액</b>
                                                                </th>
                                                                <td>
                                                                    <p class="text_price">
                                                                        <strong>{{ MMFilters.formatNumber(order.paymentSummary.totalGoodsPrice) }}</strong>
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th scope="row">
                                                                    <b>배송비</b>
                                                                </th>
                                                                <td>
                                                                    <p class="text_price">
                                                                        + <strong>{{ MMFilters.formatNumber(order.paymentSummary.totalShippingPrice) }}</strong>
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <th scope="row">
                                                                    <b>최종 결제금액</b>
                                                                </th>
                                                                <td>
                                                                    <p class="text_price mm_text-variable">
                                                                        <strong>{{ MMFilters.formatNumber(order.paymentSummary.totalPrice) }}</strong>
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                                <div class="mm_costbox-unit">
                                                    <p>결제수단: {{ order.paymentInfo.label }}</p>
                                                    <template v-if="order.paymentInfo.card">
                                                        <p>카드사: {{ order.paymentInfo.card.label }}</p>
                                                        <p>카드번호: {{ order.paymentInfo.card.maskingNumber }}</p>
                                                        <p>결제승인일: {{ MMFilters.formatDate(order.paymentInfo.card.approvedAt, "YYYY.MM.DD") }}</p>
                                                    </template>
                                                    <template v-if="order.paymentInfo.bankAccount">
                                                        <p>예금주: {{ bankOwnerName }} </p>
                                                        <p>은행명: {{ order.paymentInfo.bankAccount.bankName }}</p>
                                                        <p>계좌번호: {{ order.paymentInfo.bankAccount.accountNumber }}</p>
                                                        <p>입금기한: {{ MMFilters.formatDate(order.paymentInfo.bankAccount.inputExpireAt, "YYYY.MM.DD") }}</p>
                                                    </template>
                                                    <template v-if="order.paymentInfo.mobileApproveAt">
                                                        <p>결제 승인일: {{ MMFilters.formatDate(order.paymentInfo.mobileApproveAt, "YYYY.MM.DD HH:mm:ss") }}</p>
                                                    </template>
                                                </div>
                                                <a 
                                                    v-if="order.receiptViewable" 
                                                    class="mm_btn T=2xs T=dark btn_receipt"
                                                    href="#RECEIPT" 
                                                    @click.capture="setReceiptModalData(
                                                        order.orderId, 
                                                        order.ordererInfo.name, 
                                                        order.packs[0]?.sellers[0]?.orderItems[0]?.goods?.name || ''
                                                    )"
                                                ><b>영수증 보기</b></a>
                                            </section>
                                            <!--// 최종 결제금액 -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="mm_line">
                            <!--// 구매 상품 -->

                            <!-- 취소 주문번호 -->
                            <template v-for="cancelId in order.cancelIds" :key="cancelId">
                                <div v-dropdown="{ closeOther: false }" class="mm_dropdown T=order">
                                    <button type="button" class="btn_dropdown" title="접어놓기" @click.once="viewedClaimIds.cancelIds.push(cancelId)">
                                        <b>취소 주문번호</b><b class="text_contraction">{{ cancelId }}</b><i class="ico_dropdown" />
                                    </button>
                                    <div class="mm_dropdown-item">
                                        <MMCancelDetail
                                            :cancel-id="cancelId"
                                            :pay-method-label="order.paymentInfo.label"
                                        />
                                    </div>
                                </div>
                                <hr class="mm_line">
                            </template>
                            <!--// 취소 주문번호 -->

                            <!-- 반품 주문번호 -->
                            <template v-for="returnId in order.returnIds" :key="returnId">
                                <div v-dropdown="{ closeOther: false }" class="mm_dropdown T=order">
                                    <button type="button" class="btn_dropdown" title="접어놓기" @click.once="viewedClaimIds.returnIds.push(returnId)">
                                        <b>반품 주문번호</b><b class="text_contraction">{{ returnId }}</b><i class="ico_dropdown" />
                                    </button>
                                    <div class="mm_dropdown-item">
                                        <MMReturnDetail
                                            v-if="viewedClaimIds.returnIds.includes(returnId)"
                                            :return-id="returnId"
                                            :pay-method-label="order.paymentInfo.label"
                                            :delivery-companies="deliveryCompanies"
                                        />
                                    </div>
                                </div>
                                <hr class="mm_line">
                            </template>
                            <!--// 반품 주문번호 -->

                            <!-- 교환 주문번호 -->
                            <template v-for="exchangeId in order.exchangeIds" :key="exchangeId">
                                <div v-dropdown="{ closeOther: false }" class="mm_dropdown T=order">
                                    <button type="button" class="btn_dropdown" title="접어놓기" @click.once="viewedClaimIds.exchangeIds.push(exchangeId)">
                                        <b>교환 주문번호</b><b class="text_contraction">{{ exchangeId }}</b><i class="ico_dropdown" />
                                    </button>
                                    <div class="mm_dropdown-item">
                                        <MMExchangeDetail
                                            v-if="viewedClaimIds.exchangeIds.includes(exchangeId)"
                                            :exchange-id="exchangeId"
                                            :pay-method-label="order.paymentInfo.label"
                                            :delivery-companies="deliveryCompanies"
                                        />
                                    </div>
                                </div>
                                <hr class="mm_line">
                            </template>
                            <!--// 교환 주문번호 -->
                        </section>
                    </div>
                    <!--// 본문 -->

                    <MMFooter />
                </div>
            </div>
        </template>
    </MMSub>
</template>

<script setup lang="ts">
import { DeliveryCompany } from '$/@type/configs';
import { MyOrderDetail } from '$/@type/myOrder/detail';
import MMSub from '@/components/layout/Sub.vue';
import { onBeforeUnmount, onMounted, ref, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { dropdown as vDropdown } from '$/directives'
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { orderDetailRepository } from '$/repository/myOrder/detailRepository';
import { globalConfigsRepository } from '$/repository/globalConfigsRepository';
import { returnRepository } from '$/repository/myOrder/returnRepository';
import { myOrderRepository } from '$/repository/myOrder/orderRepository';
import { exchangeRepository } from '$/repository/myOrder/exchangeRepository';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import MMFooter from '@/components/Footer.vue';
import MMLink from '@/components/MMLink.vue';
import MMCancelDetail from '@/pages/guestMypage/order/detail/Cancel.vue'
import MMReturnDetail from '@/pages/guestMypage/order/detail/Return.vue'
import MMExchangeDetail from '@/pages/guestMypage/order/detail/Exchange.vue'
import { guestAddressEditModal, usePurchaseConfirm, useReceiptModal } from '$/composables/mypage/order/myOrderComposable';
import { useGiveawayTargetModal } from '$/composables/orderComposable';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { getOutIntentPath } from '$/filters';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useEventListener } from '@vueuse/core';

const { globalConfigs } = useGlobalConfigs();
const route = useRoute();
usePageTitleSetting('주문 상세', ['주문관리', '마이페이지']);

const deliveryCompanies = ref<DeliveryCompany[]>([]);
const bankOwnerName = ref<string>(globalConfigs.value.shop.bankOwnerName);

const order = ref<MyOrderDetail>({
    cancelIds: [],
    returnIds: [],
    exchangeIds: [],
    orderId: String(route.params.order_id || ''),
    orderedAt: '',
    packs: [],
    shippingAddressChangeable: false,
    receiptViewable: false,
    ordererInfo: {
        name: '',
        tel: '',
        email: '',
        personalClearanceCode: '',
    },
    shippingAddress: {
        name: '',
        tel: '',
        zipCode: '',
        baseAddress: '',
        detailAddress: '',
        message: '',
    },
    paymentInfo: {
        label: '',
        buyPoint: 0,
        exceptBuyPoint: 0,
    },
    paymentSummary: {
        totalGoodsPrice: 0,
        totalShippingPrice: 0,
        discounts: {
            member: 0,
            nightSale: 0,
            immediatelySale: 0,
        },
        usedCouponAmount: 0,
        usedPoints: 0,
        totalPrice: 0,
    },
});

const viewedClaimIds = ref<{
    cancelIds: string[]
    returnIds: string[]
    exchangeIds: string[]
}>({
    cancelIds: [],
    returnIds: [],
    exchangeIds: [],
});

// 배송지(반품수거지) 변경 기능
const { resetNewAddressData } = guestAddressEditModal(async (newVal) => {
    if (!newVal) {
        return;
    }

    try {
        await myOrderRepository.updateDeliveryAddressInfo(order.value.orderId, newVal);
        order.value.shippingAddress = {
            name: newVal.name,
            tel: newVal.tel,
            zipCode: newVal.zipCode,
            baseAddress: newVal.baseAddress,
            detailAddress: newVal.detailAddress,
            message: order.value.shippingAddress.message,
        }
    } catch (e) {
        defaultCatch(e)
    }
});

const { setPurchaseConfirmModalData } = usePurchaseConfirm();
const { setReceiptModalData } = useReceiptModal();
const { setGiveawayId } = useGiveawayTargetModal();
useEventListener('hashchange', async (event: HashChangeEvent) => {
    const before = event.oldURL.split('#')[1] ?? '';
    const after = event.newURL.split('#')[1] ?? '';

    if (before === 'PURCHASE_CONFIRM' && after === '') {
        await fetchOrderDetail();
    }
})

onMounted(async () => {
    mmon.loading.show();
    await fetchOrderDetail();
    if (order.value.returnIds.length > 0 || order.value.exchangeIds.length > 0) {
        await fetchDeliveryCompanies();
    }
    mmon.loading.hide();
})

onBeforeUnmount(() => {
    resetNewAddressData();
});

/**
 * 주문 상세 조회
 */
async function fetchOrderDetail() {
    try {
        order.value = await orderDetailRepository.get(String(route.params.id));
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
 * 수취 확인 처리
 * @param orderItemId 주문상품 ID
 */
function confirmReceipt(orderItemId: number) {
    mmon.bom.confirm('수취 확인 시 배송 완료 처리되며 되돌릴 수 없습니다. 수취 확인을 하시겠습니까?', async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }

        try {
            await myOrderRepository.confirmReceipt(orderItemId);
            await fetchOrderDetail();
        } catch (e) {
            defaultCatch(e);
        }
    })
}

/**
 * 반품 철회
 * @param returnId 반품주문 ID
 * @param returnTargetId 반품주문내 주문상품 식별값
 */
function cancelReturn(returnId: string, returnTargetId: number) {
    mmon.bom.confirm('반품 신청을 철회하시겠습니까?', async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }

        try {
            viewedClaimIds.value.returnIds = viewedClaimIds.value.returnIds.filter(originalClaimId => originalClaimId != returnId);
            await returnRepository.cancelReturn(returnId, returnTargetId);
            await fetchOrderDetail();
            viewedClaimIds.value.returnIds.push(returnId);
        } catch (e) {
            defaultCatch(e)
        }
    })
}

/**
 * 교환 철회
 * @param exchangeId 교환주문ID
 * @param exchangeTargetId 교환주문내 주문상품 식별값
 */
function cancelExchange(exchangeId: string, exchangeTargetId: number) {
    mmon.bom.confirm('교환 신청을 철회하시겠습니까?', async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }

        try {
            viewedClaimIds.value.exchangeIds = viewedClaimIds.value.exchangeIds.filter(originalClaimId => originalClaimId != exchangeId);
            await exchangeRepository.cancelExchange(exchangeId, exchangeTargetId);
            await fetchOrderDetail();
            viewedClaimIds.value.exchangeIds.push(exchangeId);
        } catch (e) {
            defaultCatch(e)
        }
    });
}
</script>