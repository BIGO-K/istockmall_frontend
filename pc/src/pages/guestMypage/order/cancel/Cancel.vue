<template>
    <div class="mm_page-content-body">
        <h3 class="mm_heading">
            <b>주문 취소</b>
        </h3>
        <div class="m_my-order">
            <!-- 주문 취소 내역 -->
            <article class="mm_order-item">
                <h5><b>{{ MMFilters.formatDate(cancelableOrder.orderedAt, "YYYY.MM.DD") }}</b><strong>주문번호: {{ cancelableOrder.orderId }}</strong></h5>
                <div
                    v-for="pack in cancelableOrder.packs"
                    :key="pack.shippingRuleId"
                    class="mm_order-item-seller"
                >
                    <div class="mm_order...seller-head">
                        <p class="text_ship">
                            <i class="ico_ship" />
                            <span v-if="pack.paidShippingPrice === 0">무료배송</span>
                            <span
                                v-else
                                class="text_price"
                            ><strong>{{ MMFilters.formatNumber(pack.paidShippingPrice) }}</strong></span>
                        </p>
                    </div>
                    <ul>
                        <li
                            v-for="orderItemSet in pack.orderItemSets"
                            :key="orderItemSet.id"
                        >
                            <div class="mm_flex">
                                <!-- 부분취소 가능시 노출 -->
                                <template v-if="cancelableOrder.isPaid">
                                    <MMCheck
                                        v-model="checkedOrderItemSetIds"
                                        :value="orderItemSet.id"
                                        label="상품 선택"
                                        :is-blind-label="true"
                                    />
                                </template>
                                <!--// 부분취소 가능시 노출 -->
                                
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
                                        <strong>{{ MMFilters.formatNumber(orderItemSet.totalPaidPrice) }}</strong>
                                    </p>
                                </div>
                                <!-- 부분취소 가능시 노출 -->
                                <template v-if="cancelableOrder.isPaid">
                                    <dl><dt>취소 수량</dt><dd>{{ getPartialSelectedItems(orderItemSet.id).length }}개</dd></dl>
                                    <div class="mm_btn_box">
                                        <div class="mm_block">
                                            <a 
                                                class="mm_btn T=sm T=line T=light" 
                                                :href="orderItemSet.items.length <= 1 ? undefined : '#'" 
                                                @click.prevent="openCancelSelectModal(orderItemSet, orderItemSet.sellerName)"
                                            >
                                                <b>부분 선택</b>
                                            </a>
                                        </div>
                                    </div>
                                </template>
                                <!-- // 부분취소 가능시 노출 -->
                            </div>
                        </li>
                    </ul>
                </div>
            </article>
            <!--// 주문 취소 내역 -->

            <!-- 취소 사유 선택 -->
            <section class="mm_order-form">
                <h5 class="mm_strapline T=line">
                    <b>취소 사유 선택</b>
                </h5>
                <div class="mm_radio-list T=chain">
                    <ul>
                        <li
                            v-for="reason in cancelReasons"
                            :key="reason.code"
                        >
                            <div
                                v-if="reason.requireDetail"
                                class="mm_form_mix-linked"
                            >
                                <MMRadio
                                    v-model="cancelForm.reason"
                                    :value="reason.code"
                                    name="reason_code"
                                >
                                    <b class="mm_block">
                                        <i class="ico_form-radio" />
                                        <span class="text_label">{{ reason.label }}</span>
                                    </b>
                                </MMRadio>
                                <MMTextarea 
                                    v-model="cancelForm.reasonDetail"
                                    :place-holder-text="'기타 사유를 입력하세요'"
                                    :disabled="cancelForm.reason != reason.code"
                                />
                            </div>
                            <MMRadio
                                v-else
                                v-model="cancelForm.reason"
                                :value="reason.code"
                                name="reason_code"
                            >
                                <b class="mm_block">
                                    <i class="ico_form-radio" />
                                    <span class="text_label">{{ reason.label }}</span>
                                </b>
                            </MMRadio>
                        </li>
                    </ul>
                </div>
            </section>
            <!--// 취소 사유 선택 -->

            <!-- 환불 정보 -->
            <section
                v-if="cancelableOrder.isPaid"
                class="mm_order-info"
            >                
                <h5 class="mm_strapline T=line">
                    <b>환불 정보</b>
                </h5>
                <table>
                    <tbody>                        
                        <tr>
                            <th scope="row">
                                <strong>{{ cancelableOrder.paymentMethodLabel }} 환불</strong>
                            </th>
                            <td>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(totalRefundAmount) }}</strong>
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
                                <strong>예상 환불금액</strong>
                            </th>
                            <td>
                                <p class="text_price mm_text-variable">
                                    <strong>{{ MMFilters.formatNumber(refundInfo.refundPrice) }}</strong>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div
                    v-if="refundInfo.calculateDetails.length > 0"
                    class="mm_note"
                >
                    <ul v-if="refundInfo.calculateDetails[0].isSubtracted">
                        <li>조건부 무료배송비(면제배송비)는 적립금을 제외한 결제금액에서 차감 됩니다.</li>
                        <li>조건부 무료배송비가 결제한 금액보다 큰 금액일 시 부분 주문취소가 불가 합니다.</li>
                    </ul>
                    <ul v-else>
                        <li>조건부 무료배송비(면제배송비)를 차감한 내역이 있습니다.</li>
                        <li>배송 전 전체 취소의 경우 배송비도 같이 환불 진행 됩니다.</li>
                    </ul>
                </div>           
            </section>
            <!--// 환불 정보 -->

            <!-- 환불 계좌 입력 -->
            <section
                v-if="cancelableOrder.isPaid"
                class="mm_order-form"
            >
                <h5 class="mm_strapline T=line">
                    <b>환불 계좌 입력</b>
                </h5>
                <table>
                    <tbody>
                        <tr>
                            <th scope="row">
                                <b>예금주</b>
                            </th>
                            <td>
                                <MMInput
                                    v-model="cancelForm.refundAccount.ownerName"
                                    place-holder-text="예금주명을 입력하세요"
                                    form-class="mm_form-text T=short"
                                    maxlength="50"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <b>환불 은행</b>
                            </th>
                            <td>
                                <MMSelect
                                    v-model="cancelForm.refundAccount.bankCode"
                                    class="T=short"
                                >
                                    <option value="">
                                        은행을 선택하세요
                                    </option>
                                    <option
                                        v-for="bankCode in bankCodes"
                                        :key="bankCode.code" 
                                        :value="bankCode.code"
                                    >
                                        {{ bankCode.label }}
                                    </option>
                                </MMSelect>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <b>환불 계좌</b>
                            </th>
                            <td>
                                <MMInput 
                                    v-model="cancelForm.refundAccount.accountNumber"
                                    :place-holder-text="'계좌번호를 입력하세요'"
                                    maxlength="20"
                                    data-type="number"
                                    form-class="mm_form-text T=short"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <!--// 환불 계좌 입력 -->

            <!-- 하단 버튼 -->
            <div class="mm_foot">
                <div class="mm_btn_box">
                    <button
                        type="button"
                        class="mm_btn T=primary"
                        :disabled="!isCancelAppliable"
                        @click="cancelApply"
                    >
                        <b>취소 신청하기</b>
                    </button>
                </div>
            </div>
            <!--// 하단 버튼 -->

            <!-- 유의사항 -->
            <section class="mm_note">
                <h6 class="text_title">
                    <i class="ico_note" /><b>취소 유의사항</b>
                </h6>
                <ul>
                    <li>무통장 입금을 제외한 나머지 결제 수단의 경우 원 결제 수단 취소로 진행됩니다.</li>
                    <li>휴대폰 주문은 결제한 당월이 지날 경우 원 결제 취소가 불가합니다.</li>
                    <li>에스크로 결제 건은 부분 취소가 불가능하고, 전체 취소만 가능합니다.</li>
                </ul>
            </section>
            <!--// 유의사항 -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { mmon } from '$/helper/mmon';
import { defaultCatch, pluck } from '$/functions';
import { CancelableOrderItem, OrderItemSet } from '$/@type/myOrder/item';
import { useBankCodes } from '$/composables/globalConfigComposable';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import MMCheck from '@/components/input/Check.vue';
import MMRadio from '@/components/input/Radio.vue';
import MMTextarea from '@/components/input/Textarea.vue';
import MMSelect from '@/components/input/Select.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import OrderItemSelect from '@/components/modal/myOrder/OrderItemSelect.vue'
import { useModal } from '$/composables/pageHandler/modalComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useCancelOrder } from '$/composables/mypage/order/claim/cancelComposable';
import { useCancelOrderItemSelect } from '$/composables/mypage/order/orderItemSelectComposable';

// 주문번호,  주문상품번호
const props = defineProps<{
    orderId: string
    orderItemId: number
}>()

const { router } = usePageContext();
usePageTitleSetting('주문 취소', ['주문 관리', '마이페이지']);

// 주문취소
const { 
    cancelableOrder,
    cancelForm,
    cancelReasons, 
    refundInfo,
    totalRefundAmount,
    cancelIds,
    applyCancel,
} = useCancelOrder(
    props.orderId
)

// 주문상품선택 COMPOSABLE
const {
    checkedOrderItemSetIds,
    selectedOrderItemIds,
    getPartialSelectedItems,
    setSelectedOrderItemIds,
} = useCancelOrderItemSelect();

const { bankCodes } = useBankCodes();

// 취소신청 가능여부 (적립금 제외 환불금액 0원 이상 or 입금대기주문)
const isCancelAppliable = computed<boolean>(() => {
    return refundInfo.value.refundPrice >= 0 || !cancelableOrder.value.isPaid;
});

/**
 * 취소 주문상품 부분선택 모달 open
 * @param orderItem 취소주문상품
 */
function openCancelSelectModal(orderItemSet: OrderItemSet<CancelableOrderItem>, sellerName: string) {
    if (orderItemSet.items.length < 2) {
        return;
    }
    // 부분선택 모달 데이터 세팅
    useModal().open(OrderItemSelect, {
        title: '부분선택',
        name: 'OrderItemSelect',
        itemClass: 'm_modal-myorder-option',
        props: {
            orderItems: orderItemSet.items,
            orderItemSetId: orderItemSet.id,
            sellerName: sellerName,
            selectedOrderItemIds: getPartialSelectedItems(orderItemSet.id) || []
        },
        onClose: (changeItems: { selected: number[], orderItemSetId: number }) => {
            setSelectedOrderItemIds(changeItems.orderItemSetId, changeItems.selected)
        }
    })  
}

/**
 * 취소 신청
 */
async function cancelApply() {
    if (!isCancelAppliable.value) {
        return mmon.bom.alert('적립금을 제외한 환불금액이 0원 이하일 경우 취소 신청이 불가합니다.');
    }

    try {
        await cancelForm.value.validate();
    } catch (e) {
        return defaultCatch(e);
    }

    mmon.bom.confirm('주문 취소를 진행하시겠습니까?', async (isConfirmed: boolean) => {
        if (!isConfirmed) {
            return;
        }

        try {
            await applyCancel();
            // 취소완료페이지 이동
            router.replace({ 
                name: 'GuestMyPageCancelComplete', 
                params: { 
                    order_id: cancelableOrder.value.orderId,
                    cancel_ids: cancelIds.value, 
                } 
            });
        } catch (e) {
            defaultCatch(e);
        }
    });
}


// 주문상품 선택변경시 주문취소FORM 적용
watch(selectedOrderItemIds, () => {
    cancelForm.value.orderItemIds = selectedOrderItemIds.value
})

// 주문상품 default 선택처리
const unwatch = watch(cancelableOrder, (to) => {
    if (to.packs.length < 1 || !cancelableOrder.value.isPaid) {
        return;
    }
        
    // //주문상품 default 선택처리
    cancelableOrder.value.packs.forEach(pack => {
        pack.orderItemSets.forEach(orderItemSet => {
            
            const orderItemIds = pluck(orderItemSet.items, 'id');
            // 리스트에서 선택한 아이템 선택 처리
            if (orderItemIds.includes(props.orderItemId)) {
                checkedOrderItemSetIds.value.push(orderItemSet.id);
                setSelectedOrderItemIds(orderItemSet.id, [props.orderItemId])
                return;
            }
    
            // 주문상품묶음에 주문상품이 하나인 경우
            if (orderItemSet.items.length == 1) {
                setSelectedOrderItemIds(orderItemSet.id, [orderItemSet.items[0].id])
                return;
            }
        })
    });

    unwatch();
})

</script>