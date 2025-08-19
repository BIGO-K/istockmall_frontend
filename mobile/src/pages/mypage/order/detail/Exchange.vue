<template>
    <div v-if="exchangeDetail?.pack" class="mm_dropdown-item-inner">
        <!-- 교환상품 -->
        <div class="mm_order-item">
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
                <div class="mm_product-list T=sm">
                    <ul>
                        <li v-for="orderItem in exchangeDetail.pack.orderItems" :key="orderItem.id">
                            <p class="text_seller">
                                <i class="ico_shop" />{{ orderItem.sellerName }}
                            </p>
                            <MMOrderGoods :goods="orderItem.goods" :price="orderItem.paidPrice + orderItem.pointUsed">
                                <template #footer>
                                    <p class="text_changed">
                                        <strong class="mm_text-variable">변경된 옵션</strong>
                                        <span>{{ orderItem.exchangedOptionName }} / 1개</span>
                                    </p>
                                    <p class="text_point">
                                        사용 적립금
                                        <b>
                                            <strong>{{ MMFilters.formatNumber(orderItem.pointUsed) }}</strong>
                                            <sub>원</sub>
                                        </b>
                                    </p>
                                </template>
                            </MMOrderGoods>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--// 교환상품 -->

        <!-- 교환정보 -->
        <div class="mm_inner m_myorder-detail-claim">
            <h4 class="mm_strapline">
                <b>교환 사유 및 회수 방법</b>
            </h4>
            <div class="m...claim-collect">
                <h5 class="mm_strapline">
                    <b>교환 사유</b>
                </h5>
                <div class="mm_form-select">
                    <label>
                        <span class="text_readonly">{{ exchangeDetail.reason.label }}</span>
                        <i class="ico_form-select" />
                    </label>
                </div>
                <template v-if="exchangeDetail.reason.detail">
                    <h5 class="mm_strapline">
                        <b>상세 사유</b>
                    </h5>
                    <div class="mm_form-textarea">
                        <label>
                            <span class="textfield text_readonly">나중에 사려구요</span>
                            <i class="bg_text" />
                        </label>
                    </div>
                </template>
                <div v-if="exchangeDetail.exchangeAddress" class="mm_form_mix-address">
                    <h5 class="mm_strapline">
                        <b>교환 상품 받을 주소</b>
                    </h5>
                    <div class="mm_form_mix-linked">
                        <div class="mm_form-text">
                            <label>
                                <span class="textfield text_readonly">{{ exchangeDetail.exchangeAddress.zipCode }}</span>
                                <i class="bg_text" />
                            </label>
                        </div>
                    </div>
                    <div class="mm_form-textarea">
                        <label>
                            <span class="textfield text_readonly">{{ exchangeDetail.exchangeAddress.baseAddress }}</span>
                            <i class="bg_text" />
                        </label>
                    </div>
                    <div class="mm_form-textarea">
                        <label>
                            <span class="textfield text_readonly">{{ exchangeDetail.exchangeAddress.detailAddress }}</span>
                            <i class="bg_text" />
                        </label>
                    </div>
                </div>
                <section>
                    <h5 class="mm_strapline">
                        <b>교환 송장번호</b>
                    </h5>
                    <div v-if="!exchangeDetail.retrieveInvoice" class="mm_btn_box">
                        <a 
                            class="mm_btn T=sm T=line T=primary"
                            href="#" 
                            @click.prevent="openRetrieveInvoiceEditPrompt(
                                exchangeDetail.retrieveInvoice?.deliveryCompanyCode || '',
                                exchangeDetail.retrieveInvoice?.invoiceNumber || ''
                            )"
                        >
                            <b>입력하기</b>
                        </a>
                    </div>
                    <template v-else>
                        <div class="mm_form-text">
                            <label>
                                <span class="textfield text_readonly">{{ exchangeDetail.retrieveInvoice.deliveryCompanyName }}</span>
                                <i class="bg_text" />
                            </label>
                        </div>
                        <div class="mm_form-text">
                            <label>
                                <span class="textfield text_readonly">{{ exchangeDetail.retrieveInvoice.invoiceNumber }}</span>
                                <i class="bg_text" />
                            </label>
                        </div>
                        <a 
                            class="mm_btn T=xs T=line btn_modify"
                            href="#" 
                            @click.prevent="openRetrieveInvoiceEditPrompt(
                                exchangeDetail.retrieveInvoice?.deliveryCompanyCode || '',
                                exchangeDetail.retrieveInvoice?.invoiceNumber || ''
                            )"
                        >
                            <b>수정하기</b>
                        </a>
                    </template>
                </section>
            </div>
            <template v-if="exchangeDetail.retrieveAddress">
                <h4 class="mm_strapline">
                    <b>교환 수거지 정보</b>
                </h4>
                <div class="mm_order-info">
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
                                    <b>휴대폰</b>
                                </th>
                                <td>{{ exchangeDetail.retrieveAddress.tel }}</td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <b>주소</b>
                                </th>
                                <td>
                                    {{ exchangeDetail.retrieveAddress.zipCode }}<br>
                                    {{ exchangeDetail.retrieveAddress.baseAddress }} {{ exchangeDetail.retrieveAddress.detailAddress }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            
            <section v-if="exchangeDetail.additionalPaymentPrice" class="mm_costbox">
                <h4 class="mm_strapline">
                    <b>추가 결제정보</b>
                </h4>
                <div class="mm_cost">
                    <table>
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <b>결제방법</b>
                                </th>
                                <td>{{ exchangeDetail.additionalPaymentPrice.payTypeLabel }}</td>
                            </tr>
                            <tr v-for="detail in exchangeDetail.additionalPaymentPrice.calculateDetails" :key="detail.label">
                                <th scope="row">
                                    <strong>{{ detail.label }}</strong>
                                </th>
                                <td>
                                    <p class="text_price">
                                        + <strong>{{ MMFilters.formatNumber(detail.amount) }}</strong>
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
                                        <strong>{{ MMFilters.formatNumber(exchangeDetail.additionalPaymentPrice.totalPrice) }}</strong>
                                    </p>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div v-if="exchangeDetail.paymentInfo" class="mm_costbox-unit">
                    <p>결제수단: {{ exchangeDetail.paymentInfo.label }}</p>
                    <p>카드사: {{ exchangeDetail.paymentInfo.card.label }}</p>
                    <p>카드번호: {{ exchangeDetail.paymentInfo.card.maskingNumber }}</p>
                </div>
            </section>
        </div>
        <!--// 교환정보 -->
    </div>
</template>

<script setup lang='ts'>
import { makeValidator } from '$/validator';
import { DeliveryCompany } from '$/@type/configs';
import { ExchangeDetail } from '$/@type/myOrder/detail';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { orderDetailRepository } from '$/repository/myOrder/detailRepository';
import { onMounted, ref } from 'vue';
import { exchangeRepository } from '$/repository/myOrder/exchangeRepository';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';

const props = withDefaults(defineProps<{
    exchangeId: string
    payMethodLabel: string
    deliveryCompanies: DeliveryCompany[]
}>(), {
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

onMounted(async () => {
    mmon.loading.show();
    await fetchExchangeDetail();
    mmon.loading.hide();
});

async function fetchExchangeDetail () {
    try {
        exchangeDetail.value = await orderDetailRepository.getExchangeDetail(props.exchangeId);
    } catch (e) {
        defaultCatch(e);
    }
}

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
                mmon.bom.alert('송장정보가 적용되었습니다.')
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
