<template>
    <!-- 교환 주문상세 -->
    <div v-if="exchangeDetail?.pack" class="mm_tab-item">
        <!-- 교환 상품 -->
        <div class="m...detail-product">
            <h5 class="mm_strapline T=line">
                <b>교환 상품</b>
            </h5>
            <div class="mm_order-item-seller">
                <div class="mm_order...seller-head">
                    <p class="text_ship">
                        <i class="ico_ship" />
                        <span v-if="exchangeDetail.pack.paidShippingPrice === 0">무료배송</span>
                        <span v-else class="text_price">
                            <strong>{{ MMFilters.formatNumber(exchangeDetail.pack.paidShippingPrice) }}</strong>
                        </span>
                    </p>
                </div>
                <ul>
                    <li
                        v-for="orderItem in exchangeDetail.pack.orderItems"
                        :key="orderItem.id"
                    >
                        <div class="mm_flex">
                            <MMSimpleGoods
                                :goods="orderItem.goods"
                                class="T=single"
                            />
                            <p class="text_seller">
                                <i class="ico_shop" />{{ orderItem.sellerName }}
                            </p>
                            <!-- (D) 회원 일 경우에 사용 적립금 관련 내용이 노출됩니다 -->
                            <div class="mm...order-price">
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(orderItem.paidPrice + orderItem.pointUsed) }}</strong>
                                </p>
                                <p class="text_point">
                                    사용 적립금
                                    <b>
                                        <strong>{{ MMFilters.formatNumber(orderItem.pointUsed) }}</strong>
                                        <sub>원</sub>
                                    </b>
                                </p>
                            </div>
                        </div>
                        <p class="text_changed">
                            <span>변경한 옵션</span><strong>{{ orderItem.exchangedOptionName }} / 1개</strong>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
        <!--// 교환 상품 -->

        <!-- 교환 사유 및 회수 방법 -->
        <section
            v-if="exchangeDetail.reason"
            class="mm_order-form"
        >
            <h5 class="mm_strapline T=line">
                <b>교환 사유 및 회수 방법</b>
            </h5>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>교환 사유</b>
                        </th>
                        <td>
                            <div class="mm_form-select T=short">
                                <label>
                                    <span class="text_readonly">{{ exchangeDetail.reason.label }}</span>
                                    <i class="ico_form-select" />
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="exchangeDetail.reason.detail">
                        <th scope="row">
                            <b>상세 사유</b>
                        </th>
                        <td>
                            <div class="mm_form-textarea">
                                <label>
                                    <span
                                        class="textfield text_readonly"
                                        v-html="MMFilters.nlToBr(exchangeDetail.reason.detail)"
                                    />
                                    <i class="bg_text" />
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="exchangeDetail.exchangeAddress">
                        <th scope="row">
                            <b>교환 상품 받을 주소</b>
                        </th>
                        <td>
                            <div class="mm_form_mix-address">
                                <div class="mm_form_mix-linked">
                                    <div class="mm_form-text">
                                        <label>
                                            <span class="textfield text_readonly">{{ exchangeDetail.exchangeAddress.zipCode }}</span>
                                            <i class="bg_text" />
                                        </label>
                                    </div>
                                </div>
                                <div class="mm_form-text">
                                    <label>
                                        <span class="textfield text_readonly">{{ exchangeDetail.exchangeAddress.baseAddress }}</span>
                                        <i class="bg_text" />
                                    </label>
                                </div>
                                <div class="mm_form-text">
                                    <label>
                                        <span class="textfield text_readonly">{{ exchangeDetail.exchangeAddress.detailAddress }}</span>
                                        <i class="bg_text" />
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>회수 방법</b>
                        </th>
                        <td>
                            <template v-if="exchangeDetail.retrieveInvoice">
                                <div class="mm_form_mix-linked">
                                    <div class="mm_form-select T=short">
                                        <label>
                                            <span class="text_readonly">{{ exchangeDetail.retrieveInvoice.deliveryCompanyName }}</span>
                                            <i class="ico_form-select" />
                                        </label>
                                    </div>
                                    <div class="mm_form-text T=short">
                                        <label>
                                            <span class="textfield text_readonly">{{ exchangeDetail.retrieveInvoice.invoiceNumber }}</span>
                                            <i class="bg_text" />
                                        </label>
                                    </div>
                                    <a 
                                        class="mm_btn T=line btn_entry"
                                        href="#" 
                                        @click.prevent="openRetrieveInvoiceEditPrompt(
                                            exchangeDetail.retrieveInvoice?.deliveryCompanyCode || '',
                                            exchangeDetail.retrieveInvoice?.invoiceNumber || ''
                                        )"
                                    >
                                        <b>수정하기</b>
                                    </a>
                                </div>
                            </template>
                            <!-- (D) 교환 신청 시 상품을 발송하지 않았을 경우에는 '입력하기' 버튼만 노출합니다. -->
                            <a 
                                v-else 
                                class="mm_btn T=line T=primary btn_entry"
                                href="#" 
                                @click.prevent="openRetrieveInvoiceEditPrompt(
                                    exchangeDetail.retrieveInvoice?.deliveryCompanyCode || '',
                                    exchangeDetail.retrieveInvoice?.invoiceNumber || ''
                                )"
                            >
                                <b>입력하기</b>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 교환 사유 및 회수 방법 -->

        <!-- 교환 수거지 정보 -->
        <section
            v-if="exchangeDetail.retrieveAddress"
            class="mm_order-info"
        >
            <h5 class="mm_strapline T=line">
                <b>교환 수거지 정보</b>
            </h5>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>보내는 분</b>
                        </th>
                        <td>{{ exchangeDetail.retrieveAddress.name }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>휴대폰 번호</b>
                        </th>
                        <td>{{ exchangeDetail.retrieveAddress.tel }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>주소</b>
                        </th>
                        <td>
                            <span class="text_postcode">{{ exchangeDetail.retrieveAddress.zipCode }}</span>
                            <b>{{ exchangeDetail.retrieveAddress.baseAddress }} {{ exchangeDetail.retrieveAddress.detailAddress }}</b>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 교환 수거지 정보 -->

        <!-- 추가 결제 금액 -->
        <section class="mm_order-info">
            <h5 class="mm_strapline T=line">
                <b>추가 결제 금액</b>
            </h5>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <strong>결제수단</strong>
                        </th>
                        <td>
                            <p class="text_payment">
                                <strong>{{ exchangeDetail.additionalPaymentPrice.payTypeLabel }}</strong>
                            </p>
                        </td>
                    </tr>
                    <tr
                        v-for="detail in exchangeDetail.additionalPaymentPrice.calculateDetails"
                        :key="detail.label"
                    >
                        <th scope="row">
                            <strong>{{ detail.label }}</strong>
                        </th>
                        <td>
                            <p class="text_price">
                                + <strong>{{ MMFilters.formatNumber(detail.amount) }}</strong>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <strong>추가 결제 금액</strong>
                        </th>
                        <td>
                            <p class="text_price mm_text-variable">
                                <strong>{{ MMFilters.formatNumber(exchangeDetail.additionalPaymentPrice.totalPrice) }}</strong>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 추가 결제 금액 -->

        <!-- 추가 결제 정보 -->
        <section
            v-if="exchangeDetail.paymentInfo"
            class="mm_order-info"
        >
            <h5 class="mm_strapline T=line">
                <b>추가 결제 정보</b>
            </h5>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>결제수단</b>
                        </th>
                        <td>{{ exchangeDetail.paymentInfo.label }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>카드사</b>
                        </th>
                        <td>{{ exchangeDetail.paymentInfo.card.label }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>카드번호</b>
                        </th>
                        <td>{{ exchangeDetail.paymentInfo.card.maskingNumber }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>결제승인일</b>
                        </th>
                        <td>{{ MMFilters.formatDate(exchangeDetail.paymentInfo.card.approvedAt, "YYYY.MM.DD HH:mm:ss") }}</td>
                    </tr>
                </tbody>
            </table>
        </section>
    <!--// 추가 결제 정보 -->
    </div>
    <!--// 교환 주문상세 -->
</template>
<script setup lang="ts">
import { makeValidator } from '$/validator';
import { orderDetailRepository } from '$/repository/myOrder/detailRepository';
import { defaultCatch } from '$/functions';
import { ref, onMounted } from 'vue';
import { ExchangeDetail } from '$/@type/myOrder/detail';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import { DeliveryCompany } from '$/@type/configs';
import { mmon } from '$/helper/mmon';
import { exchangeRepository } from '$/repository/myOrder/exchangeRepository';

const props = withDefaults(defineProps<{
    exchangeId: string
    payMethodLabel: string
    deliveryCompanies: DeliveryCompany[]
}>(),{
    deliveryCompanies: () => []
});

const exchangeDetail = ref<ExchangeDetail>({
    pack: {
        shippingRuleId: 0,
        paidShippingPrice: 0,
        orderItems: [],
    },
    reason: {
        label: '',
        detail: '',
    },
    retrieveAddress: {
        name: '',
        tel: '',
        zipCode: '',
        baseAddress: '',
        detailAddress: '',
    },
    retrieveInvoice: {
        deliveryCompanyCode: '',
        deliveryCompanyName: '',
        invoiceNumber: '',
    },
    exchangeAddress: {
        name: '',
        tel: '',
        zipCode: '',
        baseAddress: '',
        detailAddress: '',
    },
    additionalPaymentPrice: {
        totalPrice: 0,
        calculateDetails: [],
    },
    paymentInfo: {
        label: '',
        card: {
            label: '',
            maskingNumber: '',
            approvedAt: '',
        }
    }
});

async function fetchExchangeDetail () {
    try {
        exchangeDetail.value = await orderDetailRepository.getExchangeDetail(props.exchangeId);
    } catch (e) {
        defaultCatch(e);
    }
}
onMounted(async () => {
    mmon.loading.show();
    await fetchExchangeDetail();
    mmon.loading.hide();
});

function openRetrieveInvoiceEditPrompt(deliveryCompanyCode: string, invoiceNumber: string) {
    mmon.bom.prompt(
        '회수 시 발급된 송장번호를 입력하세요.', 
        async (flag: boolean, formData: { delivery_company_code: string; invoice_number: string }) => {
            if (!flag) {
                return
            }

            const validator = makeValidator({
                deliveryCompanyCode: formData.delivery_company_code,
                invoiceNumber: formData.invoice_number,
            })
                .setRules({
                    'deliveryCompanyCode(택배사)': ['required'],
                    'invoiceNumber(송장번호)': ['required'],
                })
                .setMessages({
                    'deliveryCompanyCode.required': ':param(을/를) 선택해주세요.',
                    'invoiceNumber.required': ':param(을/를) 입력해주세요.',
                });

            try {
                mmon.loading.show()
                await validator.run()
                await exchangeRepository.updateRetrieveInvoice(
                    props.exchangeId, 
                    formData.delivery_company_code, 
                    formData.invoice_number
                );
                await fetchExchangeDetail();
                mmon.bom.alert('송장정보가 적용되었습니다.');
            } catch (e) {
                defaultCatch(e, undefined, () => {
                    openRetrieveInvoiceEditPrompt(formData.delivery_company_code, formData.invoice_number);
                });
            } finally {
                mmon.loading.hide();
            }
        },
        {
            title: '송장번호 입력',
            forms: [
                {
                    type : 'select',
                    name: 'delivery_company_code',
                    value: deliveryCompanyCode,
                    options: [
                        {
                            text: '택배사를 선택해주세요.',
                            value: ''
                        }
                    ].concat((props.deliveryCompanies || []).map((deliveryCompany) => {
                        return {
                            text: deliveryCompany.name,
                            value: deliveryCompany.code,
                        }
                    }))
                },
                {
                    type : 'text',
                    name: 'invoice_number',
                    value: invoiceNumber || '',
                    placeholder: '송장번호를 입력하세요.',
                    maxLength: 50
                }
            ]
        }
    );
}

</script>