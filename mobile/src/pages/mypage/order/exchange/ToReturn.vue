<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>반품 전환</b></h1>
        </template>

        <template #contents>
            <div v-if="process.orderItemSelect" class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 주문목록 -->
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
                                            <MMOrderGoods :goods="orderItemSet.goods" :price="orderItemSet.totalPaidPrice + orderItemSet.totalPointUsed">
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
                                                <li>반품 전환의 경우 수량 부분 선택이 불가능합니다.</li>
                                                <li>반품 전환하신 상품은 바로 반품 완료 처리가 진행됩니다.</li>
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
                                                <label class="mm_form-radio">
                                                    <input 
                                                        type="radio"
                                                        name="dev_radio-reason" 
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
                                        <div class="mm_syncer-reason" :class="isReasonDetailShow ? 'S=radio-use' : ''">
                                            <h6 class="mm_strapline">
                                                <b>상세사유</b><strong>(필수입력)</strong>
                                            </h6>
                                            <div class="mm_form-textarea">
                                                <label>
                                                    <span class="textfield text_disabled">{{ chosenExchangeReason?.detail }}</span>
                                                    <i class="bg_text" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <div class="mm_flex T=auto">
                                                <a class="mm_btn T=line T=light btn_back" href="#" @click.prevent="toOrderItemSelect">
                                                    <i class="ico_page-prev" /><b>이전으로</b>
                                                </a>
                                                <button type="button" class="mm_btn T=primary" @click="toRefundInfo">
                                                    <b>다음 단계로</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mm_note">
                                        <div v-dropdown="{ isOn: true }" class="mm_dropdown">
                                            <button type="button" class="btn_dropdown" title="접어놓기">
                                                <i class="ico_info" /><b>반품사유 선택 주의사항</b><i class="ico_dropdown T=box" />
                                            </button>
                                            <div class="mm_dropdown-item">
                                                <div class="mm_dropdown-item-inner">
                                                    <ul>
                                                        <li>반품 전환의 경우 최초 교환 접수시 설정했던 사유가 선택되며, 변경 불가합니다.</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 반품사유 -->

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
                                                        <b>반품 상품 주문 금액</b>
                                                    </th>
                                                    <td>
                                                        <p class="text_price">
                                                            <strong>{{ MMFilters.formatNumber(refundInfo.totalPaidPrice) }}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr v-for="detail in refundInfo.calculateDetails" :key="detail.label">
                                                    <th scope="row">
                                                        {{ detail.label }}
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
                                    <h6 class="mm_strapline">
                                        <b>환불 정보</b>
                                    </h6>
                                    <div class="mm_cost">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">
                                                        <b>{{ exchangeToReturnableOrder.paymentMethodLabel }} 환불</b>
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
                                                    @click="toReasonSelect"
                                                >
                                                    <i class="ico_page-prev" /><b>이전으로</b>
                                                </button>
                                                <button type="button" class="mm_btn T=primary" @click="toReturn">
                                                    <b>반품 전환하기</b>
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
import { makeValidator } from '$/validator';
import { PointLabel } from '$/@type/member/point';
import { RefundInfo, ExchangeToReturnForm } from '$/@type/myOrder';
import { ReturnReason, ChosenClaimReason } from '$/@type/myOrder/claimReason';
import { ExchangeToReturnableOrder } from '$/@type/myOrder/order';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { refundAccountRepository } from '$/repository/member/refundAccountRepository';
import { exchangeRepository } from '$/repository/myOrder/exchangeRepository';
import { returnRepository } from '$/repository/myOrder/returnRepository';
import MMPopup from '@/components/layout/Popup.vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import { dropdown as vDropdown } from '$/directives'
import MMCheck from '@/components/input/Check.vue';
import { ExchangeToReturnableOrderItem, OrderItemSet } from '$/@type/myOrder/item';
import { useOrderItemSelect } from '$/composables/mypage/order/myOrderComposable';
import { useRefundAccountEdit } from '$/composables/mypage/refundAccountComposable';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';

const router = useRouter();
const route = useRoute();
usePageTitleSetting('반품 전환');

const { globalConfigs } = useGlobalConfigs();
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);


const returnReasons = ref<ReturnReason[]>([]);  // 반품사유 리스트

//주문상품 선택기능
const {
    orderItemSelectModalData,
    selectedOrderItemIds
} = useOrderItemSelect();
// 환불계좌 수정 기능
const { 
    refundAccountModalData: {
        refundAccount
    }
} = useRefundAccountEdit();

// 반품 단계
const process = ref<Record<'orderItemSelect'|'reasonSelect'|'refundInfo', boolean>>({
    orderItemSelect: false,
    reasonSelect: false,
    refundInfo: false,
});

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

// 기존 교환신청시 선택한 사유
const chosenExchangeReason = ref<ChosenClaimReason>();
// 상세사유 노출 여부 (교환시 선택한 사유가 상세사유 필수인 경우 노출)
const isReasonDetailShow = computed<boolean>(() => {
    return returnReasons.value.find(reason => chosenExchangeReason.value?.engLabel == reason.engLabel)?.requireDetail || false
})
//선택된 주문상품
const checkedOrderItemSetIds = ref<number[]>([]);   // 선택된 주문상품 묶음 ID

//환불금액정보
const refundInfo = ref<RefundInfo>({
    totalPaidPrice: 0,
    refundPrice: 0,
    refundPoint: 0,
    calculateDetails: []
});

// 반품전환신청 Form
const switchReturnForm = reactive<ExchangeToReturnForm>({
    exchangeTargetIds: [],
    refundAccount: {
        ownerName: '',
        accountNumber: '',
        bankCode: '',
    }
});

onMounted(async () => {
    mmon.loading.show();
    await Promise.all([fetchSwitchReturnables(), fetchReturnReasons(), fetchRefundAccount()]);
    mmon.loading.hide();
    
    // 부분선택 디폴트 체크
    exchangeToReturnableOrder.value.packs.forEach(pack => {
        pack.orderItemSets.forEach(orderItemSet => {
            selectedOrderItemIds.value[orderItemSet.id] = []
            orderItemSet.items.forEach(item => {
                if (orderItemSet.items.length == 1) {
                    selectedOrderItemIds.value[orderItemSet.id].push(item.exchangeTargetId);
                }
            });
        })
    });

    applySelectedToFormData();

    // 주문상품 선택 페이지 노출
    process.value.orderItemSelect = true;

    // hash change 이벤트 (모달)
    window.addEventListener('hashchange', orderItemSelectedModalClose);
    window.addEventListener('hashchange', refundAccountEditModalClose);
});

/**
 * 상품 선택모달 닫힐시 form에 선택한 orderItemId 적용
 * @param event 
 */
function orderItemSelectedModalClose(event: HashChangeEvent) {
    const before = event.oldURL.split('#')[1] ?? '';
    const after = event.newURL.split('#')[1] ?? '';
    if (before == 'ORDER_ITEM_SELECT' && after === '') {
        applySelectedToFormData()
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
        switchReturnForm.refundAccount = refundAccount.value;
    }
}

/**
 * 선택상품 form 에 적용
 */
function applySelectedToFormData() {
    let selected: number[] = [];
    checkedOrderItemSetIds.value.forEach(itemId => {
        selected = selected.concat(selectedOrderItemIds.value[itemId]);
    });
    switchReturnForm.exchangeTargetIds = selected;
}

/**
 * 주문상품 부분선택 모달 open
 * @param orderItem 취소주문상품
 */
function openOrderItemSelectModal(orderItemSet: OrderItemSet<ExchangeToReturnableOrderItem>, sellerName: string) {
    if (orderItemSet.items.length < 2) {
        return;
    }
    // 부분선택 모달 데이터 세팅
    orderItemSelectModalData.orderItems.value = orderItemSet.items; 
    orderItemSelectModalData.orderItemSetId.value = orderItemSet.id; 
    orderItemSelectModalData.sellerName.value = sellerName;
    orderItemSelectModalData.valueKeyName.value = "exchangeTargetId"
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
    applySelectedToFormData();
    if (switchReturnForm.exchangeTargetIds.length < 1) {
        return mmon.bom.alert('상품을 선택해주세요.');
    }

    (Object.keys(process.value) as (keyof typeof process.value)[])
        .forEach(processKey => process.value[processKey] = false);
    process.value.reasonSelect = true;
}

/**
 * 환불정보 조회 단계로 이동
 */
async function toRefundInfo() {
    try {
        // 환불정보 조회
        await fetchRefundInfo(switchReturnForm.exchangeTargetIds);

        (Object.keys(process.value) as (keyof typeof process.value)[])
            .forEach(processKey => process.value[processKey] = false);
        process.value.refundInfo = true;
    } catch (e) {
        defaultCatch(e)
    }
}

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
            switchReturnForm.refundAccount = refundAccount.value;
        }
    } catch (e) {
        defaultCatch(e);
    }
}

// 반품전환 신청
async function toReturn() {
    applySelectedToFormData();
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
</script>
