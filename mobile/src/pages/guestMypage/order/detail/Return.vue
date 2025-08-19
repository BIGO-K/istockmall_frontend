<template>
    <div v-if="returnDetail?.pack" class="mm_dropdown-item-inner">
        <!-- 반품상품 -->
        <div class="mm_order-item">
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
                <div class="mm_product-list T=sm">
                    <ul>
                        <li v-for="orderItem in returnDetail.pack.orderItems" :key="orderItem.id">
                            <p class="text_seller">
                                <i class="ico_shop" />{{ orderItem.sellerName }}
                            </p>
                            <MMOrderGoods :goods="orderItem.goods" :price="orderItem.paidPrice" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--// 반품상품 -->

        <!-- 반품정보 -->
        <div class="mm_inner m_myorder-detail-claim">
            <h4 class="mm_strapline">
                <b>반품 사유 및 회수 방법</b>
            </h4>
            <div class="m...claim-collect">
                <h5 class="mm_strapline">
                    <b>반품 사유</b>
                </h5>
                <div class="mm_form-select">
                    <label>
                        <span class="text_readonly">{{ returnDetail.reason.label }}</span>
                        <i class="ico_form-select" />
                    </label>
                </div>
                <template v-if="returnDetail.reason.detail">
                    <h5 class="mm_strapline">
                        <b>상세 사유</b>
                    </h5>
                    <div class="mm_form-textarea">
                        <label>
                            <span class="textfield text_readonly" v-html="MMFilters.nlToBr(returnDetail.reason.detail)" />
                            <i class="bg_text" />
                        </label>
                    </div>
                </template>
                <section>
                    <!-- (D) 반품 신청 시 상품을 발송하지 않았을 경우에는 '입력하기' 버튼만 노출합니다. -->
                    <h5 class="mm_strapline">
                        <b>반품 송장번호</b>
                    </h5>
                    <div v-if="!returnDetail.retrieveInvoice" class="mm_btn_box">
                        <a 
                            class="mm_btn T=sm T=line T=primary"
                            href="#" 
                            @click.prevent="openRetrieveInvoiceEditPrompt(
                                returnDetail.retrieveInvoice?.deliveryCompanyCode || '',
                                returnDetail.retrieveInvoice?.invoiceNumber || ''
                            )"
                        >
                            <b>입력하기</b>
                        </a>
                    </div>
                    <template v-else>
                        <div class="mm_form-text">
                            <label>
                                <span class="textfield text_readonly">{{ returnDetail.retrieveInvoice.deliveryCompanyName }}</span>
                                <i class="bg_text" />
                            </label>
                        </div>
                        <div class="mm_form-text">
                            <label>
                                <span class="textfield text_readonly">{{ returnDetail.retrieveInvoice.invoiceNumber }}</span>
                                <i class="bg_text" />
                            </label>
                        </div>
                        <a 
                            class="mm_btn T=xs T=line btn_modify"
                            href="#" 
                            @click.prevent="openRetrieveInvoiceEditPrompt(
                                returnDetail.retrieveInvoice?.deliveryCompanyCode || '',
                                returnDetail.retrieveInvoice?.invoiceNumber || ''
                            )"
                        >
                            <b>수정하기</b>
                        </a>
                    </template>
                </section>
            </div>
            <template v-if="returnDetail.retrieveAddress">
                <h4 class="mm_strapline">
                    <b>반품 수거지 정보</b>
                </h4>
                <div class="mm_order-info">
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
                                    {{ returnDetail.retrieveAddress.zipCode }}<br>
                                    {{ returnDetail.retrieveAddress.baseAddress }} {{ returnDetail.retrieveAddress.detailAddress }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            
            <template v-if="returnDetail.refundAccount">
                <h4 class="mm_strapline">
                    <b>환불 계좌정보</b>
                </h4>
                <div class="mm_order-info">
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
                </div>
            </template>
            <template v-if="returnDetail.refundInfo">
                <h4 class="mm_strapline">
                    <b>환불 예상 금액</b>
                </h4>
                <div class="mm_cost">
                    <table>
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <b>총 결제금액</b>
                                </th>
                                <td>
                                    <p class="text_price">
                                        <strong>{{ MMFilters.formatNumber(returnDetail.refundInfo.totalPaidPrice) }}</strong>
                                    </p>
                                </td>
                            </tr>
                            <tr v-for="detail in returnDetail.refundInfo.calculateDetails" :key="detail.label">
                                <th scope="row">
                                    <b>{{ detail.label }}</b>
                                </th>
                                <td>
                                    <p class="text_price">
                                        {{ detail.isSubtracted ? '-' : '+' }} <strong>{{ MMFilters.formatNumber(detail.amount) }}</strong>
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
                                        <strong>{{ MMFilters.formatNumber(returnDetail.refundInfo.refundPrice) }}</strong>
                                    </p>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="mm_note">
                    <ul>
                        <li>환불 예상금액과 최종적으로 환불 받으실 금액은 상이할 수 있습니다.</li>
                    </ul>
                </div>
                <h4 class="mm_strapline">
                    <b>환불 정보</b>
                </h4>
                <div class="mm_cost">
                    <table>
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <b>{{ payMethodLabel }} 환불</b>
                                </th>
                                <td>
                                    <p class="text_price">
                                        <strong>{{ MMFilters.formatNumber(returnDetail.refundInfo.refundPrice) }}</strong>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </div>
        <!--// 반품정보 -->
    </div>
</template>

<script setup lang='ts'>
import { makeValidator } from '$/validator';
import { DeliveryCompany } from '$/@type/configs';
import { ReturnDetail } from '$/@type/myOrder/detail';
import { onMounted, ref } from 'vue';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import { mmon } from '$/helper/mmon';
import { returnRepository } from '$/repository/myOrder/returnRepository';
import { defaultCatch } from '$/functions';
import { orderDetailRepository } from '$/repository/myOrder/detailRepository';

const props = withDefaults(defineProps<{
    returnId: string
    payMethodLabel: string
    deliveryCompanies: DeliveryCompany[]
}>(), {
    deliveryCompanies: () => []
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
                await returnRepository.updateRetrieveInvoice(
                    props.returnId, 
                    formData.delivery_company_code, 
                    formData.invoice_number
                );
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
        }
    )
}
</script>
