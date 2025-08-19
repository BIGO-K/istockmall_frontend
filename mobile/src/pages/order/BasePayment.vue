<template>
    <!-- 결제수단 목록 -->
    <div class="m...payment-method">
        <ul>
            <li v-for="payMethod in payMethods" :key="payMethod.label">
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
    <!--// 결제수단 목록 -->

    <!-- 신용/체크카드 -->
    <div :class="['mm_syncer-method-card', { 'S=radio-use': copyPaymentForm.payMethodEngLabel === 'credit_card' }]">
        <MMSelect 
            v-model.number="copyPaymentForm.cardCode"
            @change="() => {
                copyPaymentForm.installMentMonth = 0;
                $emit('updatePayment', copyPaymentForm)
            }"
        >
            <option value="0">
                카드를 선택하세요
            </option>
            <option v-for="creditCard in creditCards" :key="creditCard.code" :value="creditCard.code">
                {{ creditCard.label }}
            </option>
        </MMSelect>
        <MMSelect 
            v-model="copyPaymentForm.installMentMonth"
            @change="$emit('updatePayment', copyPaymentForm)"
        > 
            <option
                v-for="installMent in installMents" 
                :key="installMent.label" 
                :disabled="installMent.disabled"
                :value="installMent.value"
            >
                {{ installMent.label }}
            </option>                                              
        </MMSelect>	
        <a class="btn_card-info" href="#CARD_BENEFIT"><b>무이자할부 안내</b><i class="ico_link" /></a>
    </div>
    <!--// 신용/체크카드 -->

    <!-- 무통장 입금 -->
    <div :class="['mm_syncer-method-deposit', { 'S=radio-use': copyPaymentForm.payMethodEngLabel === 'virtual_account' }]">
        <div class="mm_inner">
            <MMSelect
                v-model.number="copyPaymentForm.bankCode"
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
            <MMInput                                                     
                v-model="copyPaymentForm.depositorName"
                :placeholder="'입금자명을 입력하세요'"
                @change="$emit('updatePayment', copyPaymentForm)"
            />
            <p>입금기한: <strong class="mm_text-secondary">{{ bankDepositExpireDate }}까지</strong></p>
        </div>
        <section class="m...payment-receipt">
            <h6 class="mm_strapline">
                <b>현금영수증 발급신청</b>
            </h6>
            <ul class="mm_flex T=equal">
                <li>
                    <label class="mm_form-radio">
                        <input 
                            v-model="copyPaymentForm.cashReceiptApplyType"
                            type="radio"
                            value="1"
                            name="cache_receipt"
                            data-radio="{ 'syncer': '.mm_syncer-receipt-income'}"
                            checked
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
                            name="cache_receipt"
                            data-radio="{ 'syncer': '.mm_syncer-receipt-expense'}"
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
                            name="cache_receipt"
                            data-radio
                            @change="$emit('updatePayment', copyPaymentForm)"
                        >
                        <b class="mm_block">
                            <span class="text_label">신청안함</span>
                        </b>
                    </label>
                </li>
            </ul>
            <div :class="['mm_syncer-receipt-income', { 'S=radio-use': copyPaymentForm.cashReceiptApplyType == 1 }]">
                <MMInput
                    v-model="copyPaymentForm.cashReceiptApplyPhone"
                    :data-type="'number'"
                    maxlength="11"
                    :placeholder="'휴대폰 번호(숫자만 입력하세요)'"
                    @change="$emit('updatePayment', copyPaymentForm)"
                />
            </div>
            <div :class="['mm_syncer-receipt-expense', { 'S=radio-use': copyPaymentForm.cashReceiptApplyType == 2 }]">
                <MMInput
                    v-model="copyPaymentForm.cashReceiptApplyBusinessNumber"
                    :data-type="'number'"
                    maxlength="10"
                    :placeholder="'사업자 등록번호(숫자만 입력하세요)'"
                    @change="$emit('updatePayment', copyPaymentForm)"
                />
            </div>
        </section>
        <MMRefundAccount 
            v-if="copyPaymentForm.payMethodEngLabel === 'virtual_account'" 
            :account="refundAccount"
            @fetch-refund-account="fetchRefundAccount"
        />
    </div>
    <!--// 무통장 입금 -->

    <!-- 에스크로 -->
    <div :class="['mm_syncer-method-escrow', { 'S=radio-use': copyPaymentForm.payMethodEngLabel === 'escrow' }]">
        <div class="mm_note">
            <ul>
                <li>에스크로 결제 건은 부분 취소가 불가능하고, 전체 취소만 가능합니다.</li>
            </ul>
        </div>
        <hr class="mm_line">
        <MMRefundAccount
            v-if="copyPaymentForm.payMethodEngLabel === 'escrow'" 
            :account="refundAccount"
            @fetch-refund-account="fetchRefundAccount"
        />
    </div>
    <!--// 에스크로 -->

    <!-- 네이버 페이 -->
    <div :class="['mm_syncer-method-naverpay', { 'S=radio-use': copyPaymentForm.payMethodEngLabel === 'naverpay' }]">
        <div class="mm_note">
            <ul>
                <li>네이버페이는 네이버ID로 신용카드 또는 은행계좌 정보를 등록하여 결제할 수 있는 간편결제 서비스입니다.</li>
                <li>주문 변경 시 카드사 혜택 및 할부 적용 여부는 해당 카드사 정책에 따라 변경될 수 있습니다.</li>
                <li>지원 가능 결제수단: 네이버페이 결제창 내 노출되는 모든 카드/계좌</li>
            </ul>
        </div>
    </div>

    <!-- 페이코 -->
    <div :class="['mm_syncer-method-payco', { 'S=radio-use': copyPaymentForm.payMethodEngLabel === 'payco' }]">
        <div class="mm_note">
            <ul>
                <li>페이코는 온/오프라인 쇼핑은 물론 송금, 멤버십 적립까지 가능한 통합 서비스입니다.</li>
                <li>휴대폰과 카드 명의자가 동일해야 결제 가능하며 결제금액 제한은 없습니다.(지원카드 : 모든 국내 신용/체크 카드)</li>
            </ul>
        </div>
    </div>
    <!--// 페이코 -->
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, toRefs, watch } from 'vue';
import moment from 'moment';
import { InstallMentInfo, PaymentForm, PayMethod } from '$/@type/order/order';
import { RefundAccount } from '$/@type/member/refundAccount';
import MMSelect from '@/components/input/Select.vue';

const MMRefundAccount = defineAsyncComponent(() => import('@/pages/order/RefundAccount.vue'))

const props = withDefaults(defineProps<{
    paymentForm: PaymentForm
    refundAccount: RefundAccount|null,
    payMethods: PayMethod[],
    installMents: InstallMentInfo[],
    needPaymentUpdate?: boolean,
}>(), {
    refundAccount: () => { return null },
    payMethods: () => [],
    installMents: () => [],
    needPaymentUpdate: false,
}) 
const emit = defineEmits(['fetchRefundAccount', 'updatePayment']);

const { paymentForm, payMethods, needPaymentUpdate } = toRefs(props);

const copyPaymentForm = ref<PaymentForm>(Object.assign({},  paymentForm.value));
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

watch(needPaymentUpdate, (to) => {
    if (to) {
        emit('updatePayment', copyPaymentForm.value);
    }
})
</script>
