<template>
    <!-- 반품 주문상세 -->
    <div 
        v-if="returnDetail"
        class="mm_tab-item"
        :class="tabOn ? 'S=tab-on' : ''"
    >
        <!-- 반품 상품 -->
        <div class="m...detail-product">
            <h5 class="mm_strapline T=line">
                <b>반품 상품</b>
            </h5>
            <div class="mm_order-item-seller">
                <div class="mm_order...seller-head">
                    <p class="text_ship">
                        <i class="ico_ship" />
                        <span v-if="returnDetail.pack.paidShippingPrice === 0">무료배송</span>
                        <span v-else class="text_price">
                            <strong>{{ MMFilters.formatNumber(returnDetail.pack.paidShippingPrice) }}</strong>
                        </span>
                    </p>
                </div>
                <ul>
                    <li
                        v-for="orderItem in returnDetail.pack.orderItems"
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
                    </li>
                </ul>
            </div>
        </div>
        <!--// 반품 상품 -->

        <!-- 반품 사유 및 회수 방법 -->
        <section class="mm_order-form">
            <h5 class="mm_strapline T=line">
                <b>반품 사유 및 회수 방법</b>
            </h5>
            <table>
                <tbody>
                    <tr v-if="returnDetail.reason">
                        <th scope="row">
                            <b>반품 사유</b>
                        </th>
                        <td>
                            <div class="mm_form-select T=short">
                                <label>
                                    <span class="text_readonly">{{ returnDetail.reason.label }}</span>
                                    <i class="ico_form-select" />
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="returnDetail.reason.detail">
                        <th scope="row">
                            <b>상세 사유</b>
                        </th>
                        <td>
                            <div class="mm_form-textarea">
                                <label>
                                    <span
                                        class="textfield text_readonly"
                                        v-html="MMFilters.nlToBr(returnDetail.reason.detail)"
                                    />
                                    <i class="bg_text" />
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>반품 송장번호</b>
                        </th>
                        <td>
                            <template v-if="returnDetail.retrieveInvoice">
                                <div class="mm_form_mix-linked">
                                    <div class="mm_form-select T=short">
                                        <label>
                                            <span class="text_readonly">{{ returnDetail.retrieveInvoice.deliveryCompanyName }}</span>
                                            <i class="ico_form-select" />
                                        </label>
                                    </div>
                                    <div class="mm_form-text T=short">
                                        <label>
                                            <span class="textfield text_readonly">{{ returnDetail.retrieveInvoice.invoiceNumber }}</span>
                                            <i class="bg_text" />
                                        </label>
                                    </div>
                                    <a 
                                        class="mm_btn T=line btn_entry"
                                        href="#" 
                                        @click.prevent="openRetrieveInvoiceEditPrompt(
                                            returnDetail.retrieveInvoice?.deliveryCompanyCode || '',
                                            returnDetail.retrieveInvoice?.invoiceNumber || ''
                                        )"
                                    >
                                        <b>수정하기</b>
                                    </a>
                                </div>
                            </template>
                            <!-- (D) 반품 신청 시 상품을 발송하지 않았을 경우에는 '입력하기' 버튼만 노출합니다. -->
                            <a 
                                v-else 
                                class="mm_btn T=line T=primary btn_entry"
                                href="#" 
                                @click.prevent="openRetrieveInvoiceEditPrompt('', '')"
                            >
                                <b>입력하기</b>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 반품 사유 및 회수 방법 -->

        <!-- 반품 수거지 정보 -->
        <section
            v-if="returnDetail.retrieveAddress"
            class="mm_order-info"
        >
            <h5 class="mm_strapline T=line">
                <b>반품 수거지 정보</b>
            </h5>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>보내는 분</b>
                        </th>
                        <td>{{ returnDetail.retrieveAddress.name }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>휴대폰 번호</b>
                        </th>
                        <td>{{ returnDetail.retrieveAddress.tel }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>주소</b>
                        </th>
                        <td>
                            <span class="text_postcode">{{ returnDetail.retrieveAddress.zipCode }}</span>
                            <b>{{ returnDetail.retrieveAddress.baseAddress }} {{ returnDetail.retrieveAddress.detailAddress }}</b>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 반품 수거지 정보 -->

        <!-- 환불 계좌정보 -->
        <section
            v-if="returnDetail.refundAccount"
            class="mm_order-info"
        >
            <h5 class="mm_strapline T=line">
                <b>환불 계좌 정보</b>
            </h5>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>예금주</b>
                        </th>
                        <td>{{ returnDetail.refundAccount.ownerName }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>환불 은행</b>
                        </th>
                        <td>{{ returnDetail.refundAccount.bankName }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>환불 계좌</b>
                        </th>
                        <td>{{ returnDetail.refundAccount.accountNumber }}</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 환불 계좌정보 -->

        <!-- 환불 예상금액 -->
        <section
            v-if="returnDetail.refundInfo"
            class="mm_order-info"
        >
            <h5 class="mm_strapline T=line">
                <b>환불 예상금액</b>
            </h5>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <strong>총 결제금액</strong>
                        </th>
                        <td>
                            <p class="text_price">
                                <strong>{{ MMFilters.formatNumber(returnDetail.refundInfo.totalPaidPrice + returnDetail.refundInfo.refundPoint) }}</strong>
                            </p>
                        </td>
                    </tr>
                    <tr
                        v-for="detail in returnDetail.refundInfo.calculateDetails"
                        :key="detail.label"
                    >
                        <th scope="row">
                            <strong>{{ detail.label }}</strong>
                        </th>
                        <td>
                            <p class="text_price">
                                {{ detail.isSubtracted ? '-' : '+' }} <strong>{{ MMFilters.formatNumber(detail.amount) }}</strong>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <strong>환불 예상금액</strong>
                        </th>
                        <td>
                            <p class="text_price mm_text-variable">
                                <strong>{{ MMFilters.formatNumber(returnDetail.refundInfo.refundPoint + returnDetail.refundInfo.refundPrice) }}</strong>
                            </p>
                            <b>
                                (
                                {{ payMethodLabel }} 환불 {{ MMFilters.formatNumber(returnDetail.refundInfo.refundPrice) }}원 
                                + {{ pointLabel.name }} 환불 {{ MMFilters.formatNumber(returnDetail.refundInfo.refundPoint) }} {{ pointLabel.suffix }}
                                )
                            </b>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="mm_note">
                <ul>
                    <li>환불 예상금액과 최종적으로 환불 받으실 금액은 상이할 수 있습니다.</li>
                </ul>
            </div>
        </section>
    <!--// 환불 예상금액 -->
    </div>
    <!--// 반품 주문상세 -->
</template>
<script setup lang="ts">
import { makeValidator } from '$/validator';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import { PointLabel } from '$/@type/member/point';
import { mmon } from '$/helper/mmon';
import { onMounted, ref } from 'vue';
import { orderDetailRepository } from '$/repository/myOrder/detailRepository';
import { ReturnDetail } from '$/@type/myOrder/detail';
import { defaultCatch } from '$/functions';
import { DeliveryCompany } from '$/@type/configs';
import { returnRepository } from '$/repository/myOrder/returnRepository';

const props = withDefaults(defineProps<{
    returnId: string
    payMethodLabel: string
    pointLabel: PointLabel
    deliveryCompanies: DeliveryCompany[]
    tabOn: boolean
}>(), {
    pointLabel: () => {
        return {
            name: '포인트',
            suffix: '원'
        }
    },
    deliveryCompanies: () => [],
    tabOn: false,
});

const returnDetail = ref<ReturnDetail>({
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
    refundAccount: {
        ownerName: '',
        accountNumber: '',
        bankCode: '',
        bankName: '',
    },
    refundInfo: {
        totalPaidPrice: 0,
        refundPrice: 0,
        refundPoint: 0,
        calculateDetails: [],
    }
});

onMounted(async () => {
    mmon.loading.show();
    await fetchReturnDetail()
    mmon.loading.hide();
})

// 반품상세 조회
async function fetchReturnDetail() {
    try {
        returnDetail.value = await orderDetailRepository.getReturnDetail(props.returnId);
    } catch (e) {
        defaultCatch(e);
    }
}

/**
 * 반품송장번호 수정 prompt 열기
 */
function openRetrieveInvoiceEditPrompt(deliveryCompanyCode: string, invoiceNumber: string) {
    mmon.bom.prompt('회수 시 발급된 송장번호를 입력하세요.', 
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
                await validator.run();
                await returnRepository.updateRetrieveInvoice(props.returnId, formData.delivery_company_code, formData.invoice_number);
                await fetchReturnDetail();
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
        })
}
</script>