<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>주문 취소</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 주문목록 -->
                        <!-- (D) '입금 대기' 상태일 경우 상단에 상품선택 체크박스는 노출하지 않습니다. -->
                        <article class="mm_order-item">
                            <h5>
                                <b>{{ MMFilters.formatDate(cancelableOrder.orderedAt, "YYYY.MM.DD") }}</b>
                                <strong>주문번호: {{ cancelableOrder.orderId }}</strong>
                            </h5>
                            <div 
                                v-for="pack in cancelableOrder.packs"
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
                                                v-if="cancelableOrder.isPaid"
                                                v-model="checkedOrderItemSetIds"
                                                :value="orderItemSet.id"
                                                label="상품 선택"
                                                :is-blind-label="true"
                                            />
                                            <p class="text_seller">
                                                <i class="ico_shop" />{{ orderItemSet.sellerName }}
                                            </p>
                                            <MMOrderGoods :goods="orderItemSet.goods" :price="orderItemSet.totalPaidPrice + orderItemSet.totalPointUsed">
                                                <template #order-status>
                                                    <p class="text_status">
                                                        {{ orderItemSet.orderStatusLabel }}
                                                    </p>
                                                </template>
                                                <template #footer>
                                                    <div v-if="cancelableOrder.isPaid && orderItemSet.items.length > 1" class="mm_product...footer-indent">
                                                        <p>취소 수량: {{ getPartialSelectedItems(orderItemSet.id).length }}개</p>
                                                        <a 
                                                            class="mm_btn T=sm T=line T=primary" 
                                                            href="#CANCEL_ORDER_ITEM_SELECT" 
                                                            @click.capture="setOrderItemSelectModalData(orderItemSet, orderItemSet.sellerName)"
                                                        >
                                                            <b>부분 선택</b>
                                                        </a>
                                                    </div>
                                                    <p class="text_point">
                                                        사용 {{ pointLabel.name }}
                                                        <b>
                                                            <strong>{{ MMFilters.formatNumber(orderItemSet.totalPointUsed || 0) }}</strong>
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

                        <!-- 취소신청 -->
                        <div class="mm_inner m_popup-myclaim-cancel">
                            <h6 class="mm_strapline">
                                <b>취소 사유</b>
                            </h6>
                            <MMSelect v-model="cancelForm.reason">
                                <option value="">
                                    취소 사유를 선택하세요
                                </option>
                                <option v-for="reason in cancelReasons" :key="reason.code" :value="reason.code">
                                    {{ reason.label }}
                                </option>
                            </MMSelect>
                            <div v-if="reasonDetailRequired" class="mm_syncer-reason S=option-use">
                                <MMTextarea 
                                    v-model="cancelForm.reasonDetail"
                                    :place-holder-text="'기타 사유를 입력하세요'"
                                />
                            </div>
                            <h6 class="mm_strapline">
                                <b>환불 정보</b>
                            </h6>
                            <div class="mm_cost">
                                <table>
                                    <tbody>
                                        <tr>
                                            <th scope="row">
                                                <b>{{ cancelableOrder.paymentMethodLabel }} 환불</b>
                                            </th>
                                            <td>
                                                <p class="text_price">
                                                    <strong>{{ MMFilters.formatNumber(totalRefundAmount) }}</strong>
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
                                        <tr>
                                            <th scope="row">
                                                <b>환불 예상금액</b>
                                            </th>
                                            <td>
                                                <p class="text_price mm_text-variable">
                                                    <strong>{{ MMFilters.formatNumber(refundInfo.refundPrice + refundInfo.refundPoint) }}</strong>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <h6 class="mm_strapline">
                                <b>환불 계좌 관리</b>
                            </h6>
                            <div v-if="refundAccount" class="mm_order-refund">
                                <p class="text_bank">
                                    {{ refundAccount.bankName }}
                                </p>
                                <p class="text_name">
                                    {{ refundAccount.ownerName }}
                                </p>
                                <p>{{ refundAccount.accountNumber }}</p>
                                <a class="mm_btn T=xs T=dark" href="#CANCEL_REFUND_ACCOUNT"><b>변경하기</b><i class="ico_link T=sm" /></a>
                            </div>
                            <!-- (D) 등록된 계좌가 없을 경우 노출합니다. -->
                            <div v-else class="mm_order-refund-none">
                                <p>환불 계좌를 등록하세요</p>
                                <a class="mm_btn T=dark" href="#CANCEL_REFUND_ACCOUNT"><b>환불 계좌 등록하기</b></a>
                            </div>
                            <div class="mm_note">
                                <ul>
                                    <li>입력하신 계좌 정보는 환불 목적으로만 이용되고 있습니다.</li>
                                </ul>
                            </div>
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=primary" :disabled="!isCancelAppliable" @click="cancelOrder">
                                        <b>취소 신청하기</b>
                                    </button>
                                </div>
                            </div>
                            <div class="mm_note">
                                <div v-dropdown="{ isOn: true }" class="mm_dropdown">
                                    <button type="button" class="btn_dropdown" title="접어놓기">
                                        <i class="ico_info" /><b>주문 취소 주의사항</b><i class="ico_dropdown T=box" />
                                    </button>
                                    <div class="mm_dropdown-item" style="height: auto;">
                                        <div class="mm_dropdown-item-inner">
                                            <ul>
                                                <li>무통장 입금을 제외한 나머지 결제 수단의 경우 원 결제 수단 취소로 진행됩니다.</li>
                                                <li>휴대폰 주문은 결제한 당월이 지날 경우 원 결제 취소가 불가합니다.</li>
                                                <li>에스크로 결제 건은 부분 취소가 불가능하고, 전체 취소만 가능합니다.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--// 취소신청 -->
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { useCancelOrder } from '$/composables/mypage/order/claim/cancelComposable';
import MMPopup from '@/components/layout/Popup.vue';
import MMCheck from '@/components/input/Check.vue';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import MMSelect from '@/components/input/Select.vue'
import MMTextarea from '@/components/input/Textarea.vue';
import { dropdown as vDropdown } from '$/directives'
import { computed, ref, watch } from 'vue';
import { PointLabel } from '$/@type/member/point';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useCancelOrderItemSelect, useOrderItemSelectModal } from '$/composables/mypage/order/orderItemSelectComposable';
import { mmon } from '$/helper/mmon';
import { useRefundAccount } from '$/composables/mypage/cancelRefundAccountComposable';
import { defaultCatch, pluck } from '$/functions';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

// 주문번호,  주문상품번호
const props = defineProps<{
    orderId: string
    orderItemId: number
}>()

/** VARIABLE **/
const { router } = usePageContext();
usePageTitleSetting('주문 취소');

//global config
const { globalConfigs } = useGlobalConfigs();
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);

// 주문취소
const { 
    cancelableOrder,
    cancelForm,
    cancelReasons, 
    refundInfo,
    totalRefundAmount,
    reasonDetailRequired,
    cancelIds,
    applyCancel,
} = useCancelOrder(
    props.orderId,
)

// 주문상품선택 COMPOSABLE
const {
    checkedOrderItemSetIds,
    selectedOrderItemIds,
    getPartialSelectedItems,
    setSelectedOrderItemIds,
} = useCancelOrderItemSelect();

//주문상품 선택모달
const { setOrderItemSelectModalData } = useOrderItemSelectModal();

// 환불계좌 모달
const { refundAccount } = useRefundAccount();

// 취소신청 가능여부 (입금대기주문 or 적립금 제외 환불금액 0원 이상)
const isCancelAppliable = computed<boolean>(() => {
    return !cancelableOrder.value.isPaid || refundInfo.value.refundPrice >= 0;
});

/** //VARIABLE **/


/** FUNCTION **/

/**
 * 취소 신청 시작
 */
async function cancelOrder() {
    if (!isCancelAppliable.value) {
        return mmon.bom.alert('적립금을 제외한 환불금액이 0원 이하일 경우 취소 신청이 불가합니다.');
    }
    
    try {
        await cancelForm.value.validate();
    } catch (e) {
        return defaultCatch(e)
    }
    
    mmon.bom.confirm('주문 취소를 진행하시겠습니까?', async (isConfirmed: boolean) => {
        if (!isConfirmed) {
            return;
        }
        try {
            await applyCancel();
            router.replace({
                name: 'MypageOrderCancelComplete',
                params: { 
                    order_id: cancelableOrder.value.orderId,
                    cancel_ids: cancelIds.value, 
                } 
            })
        } catch (e) {
            defaultCatch(e);
        }
            
    });
}
/** //FUNCTION **/


/** VUE LIFE CYCLE **/

// 환불계좌정보 변경시 주문취소FORM 적용
watch(refundAccount, (newRefundAccount) => {
    if (!newRefundAccount) {
        return;
    }

    cancelForm.value.refundAccount = {
        ownerName: newRefundAccount.ownerName,
        accountNumber: newRefundAccount.accountNumber,
        bankCode: newRefundAccount.bankCode,
        bankName: newRefundAccount.bankName,
    }
})

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

// 주문상품 선택변경시 주문취소FORM 적용
watch(selectedOrderItemIds, () => {
    cancelForm.value.orderItemIds = selectedOrderItemIds.value
})

/** //VUE LIFE CYCLE **/

</script>