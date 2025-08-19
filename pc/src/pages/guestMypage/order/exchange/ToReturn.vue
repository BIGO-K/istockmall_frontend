<template>
    <div class="mm_page-content-body">
        <h3 class="mm_heading">
            <b>반품 전환</b>
        </h3>
        <div class="m_my-order">
            <!--
                (D) 반품 전환 상품 선택 후 '선택 완료' 버튼 클릭 시 'S=process-on' 클래스가 추가됩니다.
                    'S=process-on'클래스가 추가될 경우 'm_my-order-process'가 노출됩니다
                    '상품 재선택' 버튼 클릭 시 'S=process-on' 클래스가 삭제되고, 반품 전환 상품을 다시 선택할 수 있습니다
            -->
            <div
                class="m_my-order-process"
                :class="isOrderItemSelectComplete ? 'S=process-on' : ''"
            >
                <!-- 반품 전환 신청 내용 -->
                <div class="m...process-apply">
                    <!-- 반품 사유 선택 -->
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
                                    <label class="mm_form-radio">
                                        <input
                                            type="radio"
                                            name="dev_radio-reason"
                                            data-radio
                                            :checked="chosenExchangeReason?.engLabel === reason.engLabel"
                                            disabled
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
                                    </label>
                                </li>
                            </ul>
                            <div
                                class="mm_syncer-reason"
                                :class="isReasonDetailShow ? 'S=radio-use' : ''"
                            >
                                <div class="mm_form-textarea">
                                    <label>
                                        <span class="textfield text_disabled">{{ chosenExchangeReason?.detail }}</span>
                                        <i class="bg_text" />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <!--// 반품 사유 선택 -->
                        <section class="mm_note">
                            <h6 class="text_title">
                                <i class="ico_note" />
                                <b>반품 사유 선택 주의사항</b>
                            </h6>
                            <ul>
                                <li>반품 전환의 경우 최초 교환 접수시 설정했던 사유가 선택되며, 변경 불가합니다.</li>
                            </ul>
                        </section>
                    </section>
                    <!--// 반품 사유 선택 -->

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
                                            {{ detail.isSubtracted ? '-' : '+' }}<strong>{{ MMFilters.formatNumber(detail.amount) }}</strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <strong>환불 예상금액</strong>
                                    </th>
                                    <td>
                                        <p class="text_price mm_text-variable">
                                            <strong>{{ MMFilters.formatNumber(refundInfo.refundPrice) }}</strong>
                                        </p>
                                        <b>
                                            ({{ exchangeToReturnableOrder.paymentMethodLabel }} 환불 {{ MMFilters.formatNumber(refundInfo.refundPrice) }}원)
                                        </b>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <!--// 환불 예상금액 -->

                    <!-- 환불 계좌 입력 -->
                    <section class="mm_order-form">
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
                                            v-model="switchReturnForm.refundAccount.ownerName"
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
                                            v-model="switchReturnForm.refundAccount.bankCode"
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
                                    <MMInput 
                                        v-model="switchReturnForm.refundAccount.accountNumber"
                                        :place-holder-text="'계좌번호를 입력하세요'"
                                        maxlength="20"
                                        data-type="number"
                                        form-class="mm_form-text T=short"
                                    />
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <!--// 환불 계좌 입력 -->

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
                                @click="toReturn"
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
                            <li>반품 전환의 경우 수량 부분 선택이 불가능합니다.</li>
                            <li>반품 전환하신 상품은 바로 반품 완료 처리가 진행됩니다.</li>
                        </ul>
                    </section>
                    <!--// 유의사항 -->
                </div>
                <!--// 반품 전환 신청 내용 -->

                <!-- 반품 전환 상품 선택 -->
                <div class="m...process-product">
                    <!-- 반품 전환 내역 -->
                    <article class="mm_order-item">
                        <h5>
                            <b>{{ MMFilters.formatDate(exchangeToReturnableOrder.orderedAt, "YYYY.MM.DD") }}</b>
                            <strong>주문번호: {{ exchangeToReturnableOrder.orderId }}</strong>
                        </h5>
                        <div
                            v-for="pack in exchangeToReturnableOrder.packs"
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
                                                <strong>{{ MMFilters.formatNumber(orderItemSet.totalPaidPrice) }}</strong>
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
                    <!--// 반품 전환 내역 -->

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
                            <li>반품 전환의 경우 수량 부분 선택이 불가능합니다.</li>
                            <li>반품 전환하신 상품은 바로 반품 완료 처리가 진행됩니다.</li>
                        </ul>
                    </section>
                    <!--// 유의사항 -->
                </div>
                <!--// 반품 전환 상품 선택 -->
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>

import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import MMCheck from '@/components/input/Check.vue';
import MMSelect from '@/components/input/Select.vue';
import { globalConfigsRepository } from '$/repository/globalConfigsRepository';
import { defaultCatch } from '$/functions';
import { BankCode } from '$/@type/configs';
import { reactive, ref, computed, onMounted, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChosenClaimReason, ReturnReason } from '$/@type/myOrder/claimReason';
import { ExchangeToReturnableOrderItem, OrderItemSet } from '$/@type/myOrder/item';
import { ExchangeToReturnableOrder } from '$/@type/myOrder/order';
import { ExchangeToReturnForm, RefundInfo } from '$/@type/myOrder/index';
import { mmon } from '$/helper/mmon';
import { exchangeRepository } from '$/repository/myOrder/exchangeRepository';
import { makeValidator } from '$/validator';
import { returnRepository } from '$/repository/myOrder/returnRepository';
import { usePageTitleSetting } from '$/composables/seoComposable';
import OrderItemSelect from '@/components/modal/myOrder/OrderItemSelect.vue'
import { useModal } from '$/composables/pageHandler/modalComposable';

const router = useRouter();
const route = useRoute();
usePageTitleSetting('반품 전환', ['교환 관리', '주문 관리', '마이페이지']);

const returnReasons = ref<ReturnReason[]>([]);  // 반품사유 리스트
const bankCodes = ref<BankCode[]>([]);
const exchangeId = String(route.params.exchange_id);
// 교환 > 반품전환 가능 주문
const exchangeToReturnableOrder = ref<ExchangeToReturnableOrder>({
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
// 기존 교환신청시 선택한 사유
const chosenExchangeReason = ref<ChosenClaimReason>();
//선택된 주문상품
const checkedOrderItemSetIds = ref<number[]>([]);   // 선택된 주문상품 묶음 ID
const checkedPartialOrderItemIds = reactive<{ [key: number]: number[] }>({});   // 부분선택된 주문상품 ID

//환불금액정보
const refundInfo = ref<RefundInfo>({
    totalPaidPrice: 0,
    refundPrice: 0,
    refundPoint: 0,
    calculateDetails: []
});

// 반품전환신청 Form
const switchReturnForm = reactive<ExchangeToReturnForm>({
    exchangeTargetIds: computed<number[]>(() => {
        let selected: number[] = [];

        checkedOrderItemSetIds.value.forEach(itemId => {
            selected = selected.concat(checkedPartialOrderItemIds[itemId]);
        });
        return selected;
    }),
    refundAccount: {
        ownerName: '',
        accountNumber: '',
        bankCode: '',
    }
});

// 상세사유 노출 여부 (교환시 선택한 사유가 상세사유 필수인 경우 노출)
const isReasonDetailShow = computed<boolean>(() => {
    return returnReasons.value.find(reason => chosenExchangeReason.value?.engLabel == reason.engLabel)?.requireDetail || false
})


onMounted(async () => {
    mmon.loading.show();
    await Promise.all([fetchSwitchReturnables(), fetchReturnReasons(), fetchBankCodes()]);
    
    // 부분선택 디폴트 체크
    exchangeToReturnableOrder.value.packs.forEach(pack => {
        pack.orderItemSets.forEach(orderItemSet => {
            checkedPartialOrderItemIds[orderItemSet.id] = []
            orderItemSet.items.forEach(item => {
                if (orderItemSet.items.length == 1) {
                    checkedPartialOrderItemIds[orderItemSet.id].push(item.exchangeTargetId);
                }
            });
        })
    });
    mmon.loading.hide();
});

/**
 * 취소사유, 주문상품선택완료 여부 따라 환불정보 조회
 */
watchEffect(() => {
    if (!isOrderItemSelectComplete.value) {
        return;
    }

    fetchRefundInfo(switchReturnForm.exchangeTargetIds);
})

/**
 * 반품전환 가능 주문상품 조회
 */
async function fetchSwitchReturnables() {
    try {
        const returnable = await exchangeRepository.getSwitchReturnable(exchangeId);
        exchangeToReturnableOrder.value = returnable.order;
        chosenExchangeReason.value = returnable.chosenExchangeReason;
    } catch (e) {
        defaultCatch(e);
    }
}


/**
 * 은행 코드 조회
 */
async function fetchBankCodes() {
    try {
        bankCodes.value = await globalConfigsRepository.getBankCodes();
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
 * 환불정보 조회
 * @param orderItemIds 선택된 주문상품 id 리스트
 */
async function fetchRefundInfo(orderItemIds: number[]) {
    try {
        refundInfo.value = await exchangeRepository.getSwitchReturnRefundInfo(exchangeId, orderItemIds);
    } catch (e) {
        defaultCatch(e);
    }
}

/**
 * 주문상품 선택 완료 처리
 */
function completeOrderItemSelect() {
    if (switchReturnForm.exchangeTargetIds.length < 1) {
        return mmon.bom.alert('반품할 상품을 선택해주세요.');   
    }
    isOrderItemSelectComplete.value = true;
}

/**
 * 주문상품 부분선택 모달 open
 * @param orderItem 취소주문상품
 */
function openOrderItemSelectModal(orderItemSet: OrderItemSet<ExchangeToReturnableOrderItem>, sellerName: string) {
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
            selectedOrderItemIds: checkedPartialOrderItemIds[orderItemSet.id] || [],
            valueKeyName: 'exchangeTargetId'
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
    // 부분선택 모달 데이터 세팅
}

// 반품 전환 신청
async function toReturn() {
    if (refundInfo.value.refundPrice <= 0) {
        return mmon.bom.alert('적립금을 제외한 환불 금액이 0원 이하일 경우 반품 전환이 불가합니다.');
    }

    const validator = makeValidator(switchReturnForm)
        .setRules({
            'exchangeTargetIds(반품전환하실 상품)': [ 'required' ],
            // 환불계좌 정보
            'refundAccount.ownerName(환불계좌)': [ 'required' ],
            'refundAccount.bankCode(환불계좌)': [ 'required' ],
            'refundAccount.accountNumber(환불계좌)': [ 'required' ],
        })
        .setMessages({
            'exchangeTargetIds.required': ':param(을/를) 선택해주세요.',
            'refundAccount.ownerName.required': ':param(을/를) 등록해주세요.',
            'refundAccount.bankCode.required': ':param(을/를) 등록해주세요.',
            'refundAccount.accountNumber.required': ':param(을/를) 등록해주세요.',
        });

    try {
        await validator.run();
        mmon.bom.confirm('반품 전환을 진행하시겠습니까?', async (isConfirm: boolean) => {
            if (!isConfirm) {
                return;
            }

            if (refundInfo.value.refundPrice <= 0) {
                return mmon.bom.alert('환불 예상 금액이 0원 이하일 경우 반품 신청이 불가합니다.');
            }

            try {
                const returnId = await exchangeRepository.switchToReturn(exchangeId, switchReturnForm);
                router.replace({ 
                    name: 'GuestMyPageExchangeToReturnComplete', 
                    params: { 
                        exchange_id: exchangeId,
                        return_id: returnId,
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