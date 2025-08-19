<template>
    <div class="m...method-type">
        <ul>
            <li v-for="payMethod in payMethods" :key="payMethod.code">
                <label
                    :class="[
                        'mm_form-radio',
                        { 'T=payment-toss': payMethod.engLabel === 'toss' },
                        { 'T=payment-naverpay': payMethod.engLabel === 'naverpay' },
                        { 'T=payment-kakaopay': payMethod.engLabel === 'kakaopay' },
                        { 'T=payment-payco': payMethod.engLabel === 'payco' },
                    ]"
                >
                    <input
                        v-model="copyPaymentForm.payMethod" 
                        type="radio"
                        :value="payMethod.code"
                        :checked="copyPaymentForm.payMethod === payMethod.code"
                        data-radio="{ 'syncer': '.mm_syncer-method-card' }"
                        @change="() => { 
                            copyPaymentForm.payMethodEngLabel = payMethod.engLabel 
                            $emit('updatePayment', copyPaymentForm);
                        }"
                    >
                    <b class="mm_block">
                        <i :class="`ico_${payMethod.engLabel.replace('_', '-')}`" />
                        <span class="text_label">{{ payMethod.label }}</span>
                    </b>
                </label>
            </li>
        </ul>
    </div>
    <!-- 신용/체크카드 -->
    <div :class="['mm_syncer-method-card', { 'S=radio-use' : copyPaymentForm.payMethodEngLabel === 'credit_card' }]">
        <div class="mm_order-form">
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>결제 수단</b>
                        </th>
                        <td>
                            <MMSelect
                                v-model.number="copyPaymentForm.cardCode"
                                class="T=short"
                                @change="() => {
                                    copyPaymentForm.installMentMonth = 0;
                                    $emit('updatePayment', copyPaymentForm)
                                }"
                            >
                                <option value="0">
                                    카드를 선택하세요
                                </option>
                                <option
                                    v-for="creditCard in creditCards"
                                    :key="creditCard.code"
                                    :value="creditCard.code"
                                >
                                    {{ creditCard.label }}
                                </option>
                            </MMSelect>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>할부 선택</b>
                        </th>
                        <td>
                            <MMSelect
                                v-model="copyPaymentForm.installMentMonth"
                                class="T=short"
                                @change="$emit('updatePayment', copyPaymentForm)"
                            > 
                                <option
                                    v-for="installMent in installMents"
                                    :key="installMent.value"
                                    :disabled="installMent.disabled"
                                    :value="installMent.value"
                                >
                                    {{ installMent.label }}
                                </option>                                              
                            </MMSelect>
                            <a
                                class="btn_card-guide" 
                                href="#" 
                                @click.prevent="installMentModalOpen()"
                            >
                                <b>무이자할부 안내</b><i class="ico_link" />
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <!--// 신용/체크카드 -->

    <!-- 무통장 입금 -->
    <div :class="['mm_syncer-method-account m...method-account', { 'S=radio-use' : copyPaymentForm.payMethodEngLabel === 'virtual_account' }]">
        <div class="mm_order-form">
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>은행 선택</b>
                        </th>
                        <td>
                            <MMSelect
                                v-model.number="copyPaymentForm.bankCode"
                                class="T=short"
                                @change="$emit('updatePayment', copyPaymentForm)"
                            >
                                <option value="0">
                                    은행을 선택하세요
                                </option>
                                <option
                                    v-for="bank in banks"
                                    :key="bank.code"
                                    :value="bank.code"
                                >
                                    {{ bank.label }}
                                </option>
                            </MMSelect>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>입금자명</b>
                        </th>
                        <td>
                            <div class="mm_form_mix-linked">
                                <MMInput                                                     
                                    v-model="copyPaymentForm.depositorName"
                                    :form-class="'mm_form-text T=short'"
                                    :placeholder="'입금자명을 입력하세요'"
                                    @change="$emit('updatePayment', copyPaymentForm)"
                                />
                                <p class="text_period">
                                    입금기한<strong>{{ bankDepositExpireDate }}까지</strong>
                                </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 현금영수증 발급 신청 -->
        <div class="mm_order-form m...method-account-receipt">
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>현금영수증 발급신청</b>
                        </th>
                        <td>
                            <div class="mm_radio-list">
                                <ul>
                                    <li>
                                        <label class="mm_form-radio">
                                            <input
                                                v-model="copyPaymentForm.cashReceiptApplyType"
                                                type="radio"
                                                value="1"
                                                name="cach_receipt"
                                                data-radio="{ 'syncer': '.mm_syncer-receipt-income' }"
                                                @change="$emit('updatePayment', copyPaymentForm)"
                                            >
                                            <b class="mm_block">
                                                <span class="text_label">소득공제용</span>
                                            </b>
                                        </label>
                                    </li>
                                    <li>
                                        <label class="mm_form-radio">
                                            <input
                                                v-model="copyPaymentForm.cashReceiptApplyType"
                                                type="radio"
                                                value="2"
                                                name="cach_receipt"
                                                data-radio="{ 'syncer': '.mm_syncer-receipt-expense' }"
                                                @change="$emit('updatePayment', copyPaymentForm)"
                                            >
                                            <b class="mm_block"> 
                                                <span class="text_label">지출증빙용</span>
                                            </b>
                                        </label>
                                    </li>
                                    <li>
                                        <label class="mm_form-radio">
                                            <input
                                                v-model="copyPaymentForm.cashReceiptApplyType"
                                                type="radio"
                                                value="3"
                                                name="cach_receipt"
                                                data-radio
                                                @change="$emit('updatePayment', copyPaymentForm)"
                                            >
                                            <b class="mm_block">
                                                <span class="text_label">신청안함</span>
                                            </b>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                            <!-- 소득공제용 -->
                            <div :class="['mm_syncer-receipt-income', { 'S=radio-use' : copyPaymentForm.cashReceiptApplyType == 1 }]">
                                <MMInput
                                    v-model="copyPaymentForm.cashReceiptApplyPhone"
                                    :form-class="'mm_form-text T=short'"
                                    :data-type="'number'"
                                    maxlength="11"
                                    :placeholder="'휴대폰 번호(숫자만 입력하세요)'"
                                    @change="$emit('updatePayment', copyPaymentForm)"
                                />
                            </div>
                            <!--// 소득공제용 -->

                            <!-- 지출증빙용 -->
                            <div :class="['mm_syncer-receipt-expense', { 'S=radio-use' : copyPaymentForm.cashReceiptApplyType == 2 }]">
                                <MMInput
                                    v-model="copyPaymentForm.cashReceiptApplyBusinessNumber"
                                    :form-class="'mm_form-text T=short'"
                                    :data-type="'number'"
                                    maxlength="10"
                                    :placeholder="'사업자 등록번호(숫자만 입력하세요)'"
                                    @change="$emit('updatePayment', copyPaymentForm)"
                                />
                            </div>
                            <!--// 지출증빙용 -->
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!--// 현금영수증 발급 신청 -->
        <!-- 환불 계좌 관리 -->
        <OrderRefundAccount
            v-if="copyPaymentForm.payMethodEngLabel === 'virtual_account'" 
            :account="refundAccount"
            @fetch-refund-account="fetchRefundAccount"
        />
        <!--// 환불 계좌 관리 -->
    </div>
    <!--// 무통장 입금 -->

    <!-- 에스크로 결제 -->
    <div :class="['mm_syncer-method-escrow', { 'S=radio-use' : copyPaymentForm.payMethodEngLabel === 'escrow' }]">
        <div class="mm_note">
            <ul>
                <li>에스크로 결제 건은 부분 취소가 불가능하고, 전체 취소만 가능합니다.</li>
            </ul>
        </div>
        <!-- 환불 계좌 관리 -->
        <OrderRefundAccount 
            v-if="copyPaymentForm.payMethodEngLabel === 'escrow'" 
            :account="refundAccount"
            @fetch-refund-account="fetchRefundAccount"
        />
        <!--// 환불 계좌 관리 -->
    </div>
    <!--// 에스크로 결제 -->
    <!-- 네이버 페이 -->
    <div :class="['mm_syncer-method-naverpay', { 'S=radio-use' : copyPaymentForm.payMethodEngLabel === 'naverpay' }]">
        <div class="mm_note">
            <ul>
                <li>네이버페이는 네이버ID로 신용카드 또는 은행계좌 정보를 등록하여 결제할 수 있는 간편결제 서비스입니다.</li>
                <li>주문 변경 시 카드사 혜택 및 할부 적용 여부는 해당 카드사 정책에 따라 변경될 수 있습니다.</li>
                <li>지원 가능 결제수단: 네이버페이 결제창 내 노출되는 모든 카드/계좌</li>
            </ul>
        </div>
    </div>
    <!--// 네이버 페이 -->
    <!-- 페이코 -->
    <div :class="['mm_syncer-method-payco', { 'S=radio-use' : copyPaymentForm.payMethodEngLabel === 'payco' }]">
        <div class="mm_note">
            <ul>
                <li>페이코는 온/오프라인 쇼핑은 물론 송금, 멤버십 적립까지 가능한 통합 서비스입니다.</li>
                <li>휴대폰과 카드 명의자가 동일해야 결제 가능하며 결제금액 제한은 없습니다.(지원카드 : 모든 국내 신용/체크 카드)</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue';
import moment from 'moment';
import { InstallMentInfo, PaymentForm, PayMethod } from '$/@type/order/order';
import { RefundAccount } from '$/@type/member/refundAccount';
import CardBenefit from '@/components/modal/CardBenefit.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { exhibitRepository } from '$/repository/exhibitRepository';
import OrderRefundAccount from '@/pages/order/RefundAccount.vue';
import MMSelect from '@/components/input/Select.vue';

const props = withDefaults(defineProps<{
    paymentForm: PaymentForm,
    refundAccount: RefundAccount|null,
    payMethods: PayMethod[],
    installMents: InstallMentInfo[],
    needPaymentUpdate?: boolean,
}>(),{
    refundAccount: () => { return null },
    payMethods: () => [],
    installMents: () => [],
    needPaymentUpdate: false,
});

const emit = defineEmits<{
    (e: 'fetchRefundAccount'): void,
    (e: 'updatePayment', paymentForm: PaymentForm): void
}>();

const { paymentForm, payMethods, needPaymentUpdate } = toRefs(props);
const copyPaymentForm = ref<PaymentForm>(Object.assign({}, paymentForm.value));
copyPaymentForm.value.isDirectPay = false;
const bankDepositExpireDate = moment().add(1, 'day').format('YYYY.MM.DD 23:59:59');

const creditCards = computed(() => {
    return payMethods.value.find((payMethod) => {
        return payMethod.engLabel === 'credit_card';
    })?.childMethods || []
});

const banks = computed(() => {
    return payMethods.value.find((payMethod) => {
        return payMethod.engLabel === 'virtual_account';
    })?.childMethods || []
})

function fetchRefundAccount() {
    emit('fetchRefundAccount');
}

function installMentModalOpen() {
    useModal().open(CardBenefit, {
        title: '카드사별 혜택',
        name: 'CardBenefitVue',
        props: async() => {
            const cardBenefits = await exhibitRepository.cardBenefit();
            return {
                cardBenefits
            }
        }             
    })
}

watch(needPaymentUpdate, (to) => {
    if (to) {
        emit('updatePayment', copyPaymentForm.value);
    }
})
</script>