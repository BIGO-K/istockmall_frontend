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
                                            <strong>{{ MMFilters.formatNumber(refundInfo.refundPrice + refundInfo.refundPoint) }}</strong>
                                        </p>
                                        <b>
                                            ({{ exchangeToReturnableOrder.paymentMethodLabel }} 환불 {{ MMFilters.formatNumber(refundInfo.refundPrice) }}원 + 
                                            {{ pointLabel.name }} 환불 {{ MMFilters.formatNumber(refundInfo.refundPoint) }}{{ pointLabel.suffix }})
                                        </b>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
                                            <b>등록하기</b>
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
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { makeValidator } from '$/validator';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { ExchangeToReturnableOrder } from '$/@type/myOrder/order';
import { RefundInfo, ExchangeToReturnForm } from '$/@type/myOrder';
import { ReturnReason, ChosenClaimReason } from '$/@type/myOrder/claimReason';
import { OrderItemSet, ExchangeToReturnableOrderItem } from '$/@type/myOrder/item';
import { PointLabel } from '$/@type/member/point';
import { RefundAccount } from '$/@type/member/refundAccount';
import { exchangeRepository } from '$/repository/myOrder/exchangeRepository';
import { returnRepository } from '$/repository/myOrder/returnRepository';
import { refundAccountRepository } from '$/repository/member/refundAccountRepository';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import MMCheck from '@/components/input/Check.vue';
import { useBankCodes, useGlobalConfigs } from '$/composables/globalConfigComposable';
import OrderItemSelect from '@/components/modal/myOrder/OrderItemSelect.vue'
import { useModal } from '$/composables/pageHandler/modalComposable';
import RefundAccountModal from '@/components/modal/RefundAccount.vue';

const router = useRouter();
const route = useRoute();
usePageTitleSetting('반품 전환', ['교환 관리', '주문 관리', '마이페이지']);

const { globalConfigs } = useGlobalConfigs();
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);        
const returnReasons = ref<ReturnReason[]>([]);  // 반품사유 리스트
const refundAccount = ref<RefundAccount>(); // 환불계좌
const exchangeId = String(route.params.exchange_id);
// 주문
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
 * 환불계좌 조회
 */
async function fetchRefundAccount() {
    try {
        refundAccount.value = await refundAccountRepository.get();
        if (refundAccount.value) {
            switchReturnForm.refundAccount = {
                ownerName: refundAccount.value.ownerName,
                bankCode: refundAccount.value.bankCode,
                accountNumber: refundAccount.value.accountNumber,
            }
        }
    } catch (e) {
        defaultCatch(e);
    }
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
                    name: 'MypageOrderExchangeToReturnComplete', 
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
        }
    })
}

onMounted(async () => {
    mmon.loading.show();
    await Promise.all([fetchSwitchReturnables(), fetchReturnReasons(), fetchRefundAccount()]);
    
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
</script>