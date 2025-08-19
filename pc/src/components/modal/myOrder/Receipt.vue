<template>
    <div class="m_modal-receipt-head">
        <MMSelect v-model="receiptType">
            <option value="all">
                전체
            </option>
            <option value="approve">
                승인
            </option>
            <template v-if="receipt.cancels.length > 1">
                <option
                    v-for="(cancelDetail, index) in receipt.cancels"
                    :key="index"
                    :value="`cancel_${index}`"
                >
                    부분취소({{ index + 1 }})
                </option>
            </template>
            <option
                v-else-if="receipt.cancels.length > 0"
                value="cancel_0"
            >
                취소
            </option>
        </MMSelect>
        <div class="mm_btn_box">
            <a
                class="mm_btn T=sm T=line btn_email"
                href="#"
                @click.prevent="openEmailInputPrompt"
            ><i class="ico_email" /><b>메일발송</b></a>
            <button
                type="button"
                class="mm_btn T=sm T=light btn_print"
                onclick="window.print();"
            >
                <i class="ico_print" /><b>인쇄</b>
            </button>
        </div>
    </div>
    <!-- 인쇄영역 -->
    <div
        v-if="currentReceipt"
        class="mm_print"
    >
        <!-- 주문 정보 -->
        <section>
            <h3><b>주문 정보</b></h3>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>주문번호</b>
                        </th>
                        <td>{{ props.orderId }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>주문자명</b>
                        </th>
                        <td>{{ maskedOrdererName }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>상품명</b>
                        </th>
                        <td>{{ props.goodsName }}</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 주문 정보 -->

        <!-- 결제 정보 -->
        <section>
            <h3><b>결제 정보</b></h3>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>결제수단</b>
                        </th>
                        <td>{{ currentReceipt.payMethodName }}</td>
                        <th scope="row">
                            <b>거래상태</b>
                        </th>
                        <td>{{ currentReceipt.status }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>거래일시</b>
                        </th>
                        <td>{{ MMFilters.formatDate(currentReceipt.paidAt, 'YYYY/MM/DD HH:mm:ss') }}</td>
                        <th scope="row">
                            <b>취소일시</b>
                        </th>
                        <td>{{ MMFilters.formatDate(currentReceipt.canceledAt || '', 'YYYY/MM/DD HH:mm:ss') }}</td>
                    </tr>
                    <template v-if="currentReceipt.card">
                        <tr>
                            <th scope="row">
                                <b>결제카드</b>
                            </th>
                            <td>{{ currentReceipt.card.name }}</td>
                            <th scope="row">
                                <b>카드번호</b>
                            </th>
                            <td>{{ currentReceipt.card.maskedNumber }}</td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <b>할부개월</b>
                            </th>
                            <td>{{ currentReceipt.card.installment }}</td>
                            <th scope="row">
                                <b>승인번호</b>
                            </th>
                            <td>{{ currentReceipt.card.tid }}</td>
                        </tr>
                    </template>
                    <template v-else-if="currentReceipt.virtualBank">
                        <tr>
                            <th scope="row">
                                <b>결제은행</b>
                            </th>
                            <td>{{ currentReceipt.virtualBank.bankName }}</td>
                            <th scope="row">
                                <b>가상계좌번호</b>
                            </th>
                            <td>{{ currentReceipt.virtualBank.virtualAccountNumber }}</td>
                        </tr>
                    </template>

                    <template v-if="receiptType === 'all'">
                        <tr>
                            <th scope="row">
                                <b>승인금액</b>
                            </th>
                            <td>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(currentReceipt.paymentPrice) }}</strong>
                                </p>
                            </td>
                            <th scope="row">
                                <b>취소금액</b>
                            </th>
                            <td>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(currentReceipt.canceledPrice) }}</strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <b>잔액</b>
                            </th>
                            <td>
                                <p class="text_price mm_text-primary">
                                    <strong>{{ MMFilters.formatNumber(currentReceipt.balancePrice) }}</strong>
                                </p>
                            </td>
                            <th scope="row" />
                            <td />
                        </tr>
                    </template>
                    <template v-else-if="receiptType === 'approve'">
                        <tr>
                            <th scope="row">
                                <b>승인금액</b>
                            </th>
                            <td>
                                <p class="text_price mm_text-variable">
                                    <strong>{{ MMFilters.formatNumber(currentReceipt.paymentPrice) }}</strong>
                                </p>
                            </td>
                            <th scope="row">
                                <b>과세금액</b>
                            </th>
                            <td>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(currentReceipt.taxPrice) }}</strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" />
                            <td />
                            <th scope="row">
                                <b>부가세</b>
                            </th>
                            <td>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(currentReceipt.surtaxPrice) }}</strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" />
                            <td />
                            <th scope="row">
                                <b>면세금액</b>
                            </th>
                            <td>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(currentReceipt.taxFreePrice) }}</strong>
                                </p>
                            </td>
                        </tr>
                    </template>
                    <template v-else-if="receiptType.includes('cancel')">
                        <tr>
                            <th scope="row">
                                <b>승인금액</b>
                            </th>
                            <td>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(currentReceipt.paymentPrice) }}</strong>
                                </p>
                            </td>
                            <th scope="row">
                                <b>과세금액</b>
                            </th>
                            <td>
                                <p class="text_price">
                                    -<strong>{{ MMFilters.formatNumber(currentReceipt.taxPrice) }}</strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <b>기취소금액</b>
                            </th>
                            <td>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(currentReceipt.canceledPrice) }}</strong>
                                </p>
                            </td>
                            <th scope="row">
                                <b>부가세</b>
                            </th>
                            <td>
                                <p class="text_price">
                                    -<strong>{{ MMFilters.formatNumber(currentReceipt.surtaxPrice) }}</strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <b>취소금액</b>
                            </th>
                            <td>
                                <p class="text_price mm_text-variable">
                                    <strong>{{ MMFilters.formatNumber(currentReceipt.cancelPrice) }}</strong>
                                </p>
                            </td>
                            <th scope="row">
                                <b>면세금액</b>
                            </th>
                            <td>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(currentReceipt.taxFreePrice) }}</strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <b>잔액</b>
                            </th>
                            <td>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(currentReceipt.balancePrice) }}</strong>
                                </p>
                            </td>
                            <th scope="row" />
                            <td />
                        </tr>
                    </template>
                </tbody>
            </table>
        </section>
        <!--// 결제 정보 -->
        <!-- 현금영수증 정보 -->
        <section v-if="currentReceipt.cashReceipt">
            <h3><b>현금영수증 정보</b></h3>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>결제수단</b>
                        </th>
                        <td>현금영수증</td>
                        <th scope="row">
                            <b>거래상태</b>
                        </th>
                        <td>{{ currentReceipt.cashReceipt.status }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>공급자사업자번호</b>
                        </th>
                        <td>{{ shopInfo?.businessNumber }}</td>
                        <th scope="row">
                            <b>현금영수증용도</b>
                        </th>
                        <td>{{ currentReceipt.cashReceipt.useType }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>현금영수증발급상태</b>
                        </th>
                        <td>구매자요청발급</td>
                        <th scope="row">
                            <b>현금영수증인증값</b>
                        </th>
                        <td>{{ currentReceipt.cashReceipt.maskedRequestNumber }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>현금영수증승인번호</b>
                        </th>
                        <td>{{ currentReceipt.cashReceipt.authCode }}</td>
                        <th scope="row" />
                        <td />
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 현금영수증 정보 -->
        <!-- 공급자 정보 -->
        <section>
            <h3><b>공급자 정보</b></h3>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>상호</b>
                        </th>
                        <td>{{ shopInfo?.nameInBusiness || shopInfo?.name }}</td>
                        <th scope="row">
                            <b>사업자번호</b>
                        </th>
                        <td>{{ shopInfo?.businessNumber }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>대표자명</b>
                        </th>
                        <td>{{ shopInfo?.ceo }}</td>
                        <th scope="row">
                            <b>연락처</b>
                        </th>
                        <td>{{ shopInfo?.phone }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>주소</b>
                        </th>
                        <td colspan="3">
                            {{ shopInfo?.baseAddress }} {{ shopInfo?.detailAddress }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>홈페이지</b>
                        </th>
                        <td colspan="3">
                            {{ shopInfo?.homepageUrl }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 공급자 정보 -->

        <!-- 결제대행사 정보 -->
        <section>
            <h3><b>결제대행사 정보</b></h3>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>상호</b>
                        </th>
                        <td>{{ receipt.paymentCompanyInfo.name }}</td>
                        <th scope="row">
                            <b>사업자번호</b>
                        </th>
                        <td>{{ receipt.paymentCompanyInfo.businessNumber }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>대표자명</b>
                        </th>
                        <td>{{ receipt.paymentCompanyInfo.ceo }}</td>
                        <th scope="row">
                            <b>연락처</b>
                        </th>
                        <td>{{ receipt.paymentCompanyInfo.phone }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>주소</b>
                        </th>
                        <td colspan="3">
                            {{ receipt.paymentCompanyInfo.address }}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>홈페이지</b>
                        </th>
                        <td colspan="3">
                            {{ receipt.paymentCompanyInfo.homepageUrl }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 결제대행사 정보 -->

        <!-- 유의사항 -->
        <div class="mm_note">
            <ul>
                <li>신용카드 청구서에는 ‘한국정보통신(주)’로 표기됩니다.</li>
                <li>부가세세법시행령 제57조 2항에 따라 결제대행업체를 통한 신용카드 매출전표는 사업자가 별도의 세금계산서를 교부하지 아니한 경우, 매입세금계산서로 사용하실 수 있습니다.</li>
            </ul>
        </div>
        <!--// 유의사항 -->
    </div>
    <!--// 인쇄영역 -->
    <div class="mm_foot">
        <div class="mm_btn_box">
            <button
                type="button"
                class="mm_btn T=xl T=primary btn_print"
                onclick="window.print();"
            >
                <b>인쇄하기</b>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { BaseReceiptDetail, Receipt } from '$/@type/myOrder/receipt';
import { myOrderRepository } from '$/repository/myOrder/orderRepository';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import MMSelect from '@/components/input/Select.vue'
import { ShopInfo } from '$/@type/configs';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { useEventListener } from '@vueuse/core'
import { ModalCloseHandler } from '$/@type/Modal';

const props = defineProps<{
    orderId: string,
    receipt: Receipt,
    ordererName: string, 
    goodsName: string,
    closer: ModalCloseHandler<void>
}>();

const { globalConfigs } = useGlobalConfigs();

useEventListener(window, 'beforeprint', beforePrint);
useEventListener(window, 'afterprint', afterPrint); 

const shopInfo = ref<ShopInfo>(globalConfigs.value.shop);

const { receipt } = toRefs(props);

const maskedOrdererName = computed<string>(() => {
    return props.ordererName.replace(/.(?=.$)/u, '*')
})

const receiptType = ref<'all'|'approve'|`cancel_${number}`>('all');

const currentReceipt = computed<BaseReceiptDetail|undefined>(() => {
    if (receiptType.value == 'all' || receiptType.value == 'approve') {
        return receipt.value?.[receiptType.value]
    }

    if (receiptType.value.includes('cancel_')) {
        const cancelIndex = Number(receiptType.value.replace('cancel_', ''));
        return receipt.value?.['cancels'][cancelIndex];
    }

    return undefined
})

   

function beforePrint() {
    const parentBody = document.getElementById('mm_body');
    if (!parentBody) {
        return; 
    }
    parentBody.style.display = 'none'
}
function afterPrint() {
    const parentBody = document.getElementById('mm_body');
    if (!parentBody) {
        return; 
    }
    parentBody.style.display = ''
}

/**
 * 영수증 이메일 전송
 */
function openEmailInputPrompt() {
    mmon.bom.prompt(
        '이메일 주소를 입력해주세요.',
        async (flag: boolean, formData: { email: string }) => {
            if (!flag) {
                return
            }

            if (!formData.email) {
                return mmon.bom.alert('이메일을 입력해주세요.')
            }

            const isValidEmail = /^.+@.+(.com|.net|.co.kr)$/.test(formData.email);
            if (!isValidEmail) {
                return mmon.bom.alert('정상적인 이메일 주소를 입력해주세요.')
            }

            const type:'all'|'approve'|'cancel'  = receiptType.value == 'approve' || receiptType.value == 'all' ? receiptType.value : 'cancel';
            const refundId: string|undefined = receiptType.value.includes('cancel') ? currentReceipt.value?.refundId : undefined;
            
            try {
                await myOrderRepository.sendReceiptToEmail(props.orderId, formData.email, type, refundId);
                mmon.bom.alert('이메일이 정상적으로 발송되었습니다.')
            } catch (e) {
                defaultCatch(e);
            }
        },
        {
            title: '메일 발송',
            forms: [
                {
                    type : 'text',
                    name: 'email',
                    value: '',
                    placeholder: '‘@’를 포함하여 50자 이하 입력',
                    maxLength: 50
                }
            ]
        }
    );
}
</script>