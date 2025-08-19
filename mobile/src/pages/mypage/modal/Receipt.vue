<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>{{ currentReceipt?.payMethodName || '' }} 영수증</b></h1>
        </template>

        <template #contents>
            <div v-if="receipt" class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-receipt">
                            <div class="m_popup-receipt-head">
                                <MMSelect v-model="receiptType" class="T=sm T=short">
                                    <option value="all">
                                        전체
                                    </option>
                                    <option value="approve">
                                        승인
                                    </option>
                                    <template v-if="receipt.cancels.length > 1">
                                        <option v-for="(cancelDetail, index) in receipt?.cancels" :key="index" :value="`cancel_${index}`">
                                            부분취소({{ index + 1 }})
                                        </option>
                                    </template>
                                    <option v-else-if="receipt?.cancels?.length" value="cancel_0">
                                        취소
                                    </option>
                                </MMSelect>
                                <button type="button" class="mm_btn T=sm T=line T=primary btn_send" @click="openEmailInputPrompt">
                                    <i class="ico_email" /><b>발송</b>
                                </button>
                            </div>
                            <div v-if="currentReceipt" class="m_popup-receipt-inner">
                                <section>
                                    <h3><b>주문 정보</b></h3>
                                    <table>
                                        <colgroup>
                                            <col style="width:121px;">
                                            <col>
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <th scope="row">
                                                    <b>주문번호</b>
                                                </th>
                                                <td>{{ orderId }}</td>
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
                                                <td>{{ goodsName }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </section>
                                <section>
                                    <h3><b>결제 정보</b></h3>
                                    <table>
                                        <colgroup>
                                            <col style="width:121px;">
                                            <col>
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <th scope="row">
                                                    <b>결제수단</b>
                                                </th>
                                                <td>{{ currentReceipt.payMethodName }}</td>
                                            </tr>
                                            <tr>
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
                                            </tr>
                                            <tr>
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
                                                </tr>
                                                <tr>
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
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>승인번호</b>
                                                    </th>
                                                    <td>{{ currentReceipt.card.tid }}</td>
                                                </tr>
                                            </template>
                                            <template v-if="currentReceipt.virtualBank">
                                                <tr>
                                                    <th scope="row">
                                                        <b>결제은행</b>
                                                    </th>
                                                    <td>{{ currentReceipt.virtualBank.bankName }}</td>
                                                </tr>
                                                <tr>
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
                                                </tr>
                                                <tr>
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
                                                        <p class="text_price">
                                                            <strong>{{ MMFilters.formatNumber(currentReceipt.balancePrice) }}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </template>
                                            <template v-else-if="receiptType === 'approve'">
                                                <tr>
                                                    <th scope="row">
                                                        <b>승인금액</b>
                                                    </th>
                                                    <td>
                                                        <p class="text_price">
                                                            <strong>{{ MMFilters.formatNumber(currentReceipt.paymentPrice) }}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
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
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>과세금액</b>
                                                    </th>
                                                    <td>
                                                        <p class="text_price">
                                                            <strong>-{{ MMFilters.formatNumber(currentReceipt.taxPrice) }}</strong>
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
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>부가세</b>
                                                    </th>
                                                    <td>
                                                        <p class="text_price">
                                                            <strong>-{{ MMFilters.formatNumber(currentReceipt.surtaxPrice) }}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>취소금액</b>
                                                    </th>
                                                    <td>
                                                        <p class="mm_text-variable text_price">
                                                            <strong>{{ MMFilters.formatNumber(currentReceipt.cancelPrice) }}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
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
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                </section>
                                <section v-if="currentReceipt.cashReceipt">
                                    <h3><b>현금영수증 정보</b></h3>
                                    <table>
                                        <colgroup>
                                            <col style="width:121px;">
                                            <col>
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <th scope="row">
                                                    <b>결제수단</b>
                                                </th>
                                                <td>현금영수증</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>거래상태</b>
                                                </th>
                                                <td>{{ currentReceipt.cashReceipt.status }}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>공급자사업자번호</b>
                                                </th>
                                                <td>116-81-19948</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>현금영수증용도</b>
                                                </th>
                                                <td>소득공제</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>현금영수증발급형태</b>
                                                </th>
                                                <td>구매자요청발급</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>현금영수증인증값</b>
                                                </th>
                                                <td>0101234****</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>현금영수증승인번호</b>
                                                </th>
                                                <td>123456789</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </section>
                                <section>
                                    <h3><b>공급자 정보</b></h3>
                                    <table>
                                        <colgroup>
                                            <col style="width:121px;">
                                            <col>
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <th scope="row">
                                                    <b>상호</b>
                                                </th>
                                                <td>{{ shopInfo?.nameInBusiness || shopInfo?.name }}</td>
                                            </tr>
                                            <tr>
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
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>연락처</b>
                                                </th>
                                                <td>{{ shopInfo?.phone }}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>주소</b>
                                                </th>
                                                <td>{{ shopInfo?.baseAddress }} {{ shopInfo?.detailAddress }}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>홈페이지</b>
                                                </th>
                                                <td>{{ shopInfo?.homepageUrl }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </section>
                                <section>
                                    <h3><b>결제대행사 정보</b></h3>
                                    <table>
                                        <colgroup>
                                            <col style="width:121px;">
                                            <col>
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <th scope="row">
                                                    <b>상호</b>
                                                </th>
                                                <td>{{ receipt.paymentCompanyInfo.name }}</td>
                                            </tr>
                                            <tr>
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
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>연락처</b>
                                                </th>
                                                <td>{{ receipt.paymentCompanyInfo.phone }}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>주소</b>
                                                </th>
                                                <td>{{ receipt.paymentCompanyInfo.address }}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>홈페이지</b>
                                                </th>
                                                <td>{{ receipt.paymentCompanyInfo.homepageUrl }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="mm_note">
                                        <ul>
                                            <li>신용카드 청구서에는 ‘한국정보통신(주)’로 표기됩니다.</li>
                                            <li>부가세세법시행령 제57조 2항에 따라 결제대행업체를 통한 신용 카드 매출전표는 사업자가 별도의 세금계산서를 교부하지 아니한 경우, 매입세금계산서로 사용하실 수 있습니다.</li>
                                        </ul>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { ShopInfo } from '$/@type/configs';
import { Receipt, BaseReceiptDetail } from '$/@type/myOrder/receipt';
import { useReceiptModal } from '$/composables/mypage/order/myOrderComposable';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { myOrderRepository } from '$/repository/myOrder/orderRepository';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { computed, onMounted, ref } from 'vue';
import MMSelect from '@/components/input/Select.vue'
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { useRouter } from 'vue-router';

const { 
    receiptModalData: {
        orderId,
        ordererName,
        goodsName
    }
} = useReceiptModal();
const maskedOrdererName = computed<string>(() => {
    return ordererName.value.replace(/.(?=.$)/u, '*')
})

const router = useRouter();
const { globalConfigs } = useGlobalConfigs();

const shopInfo = ref<ShopInfo>(globalConfigs.value.shop);
const receipt = ref<Receipt>();
const receiptType = ref<'all'|'approve'|`cancel_${number}`>('all');
const currentReceipt = computed<BaseReceiptDetail|undefined>(() => {
    let receiptDetail: BaseReceiptDetail|undefined = undefined;
    if (receiptType.value == 'all' || receiptType.value == 'approve') {
        receiptDetail = receipt.value?.[receiptType.value]
    }

    if (receiptType.value.includes('cancel_')) {
        const cancelIndex = Number(receiptType.value.replace('cancel_', ''));
        receiptDetail = receipt.value?.['cancels'][cancelIndex];
    }
    return receiptDetail;
});


onMounted(async () => {
    if (!orderId.value) {
        router.go(-1);
        return;
    }
    mmon.loading.show();
    await getReceipt();    
    mmon.loading.hide();
});

/**
 * 영수증 조회
 */
async function getReceipt() {
    if (!orderId.value) {
        return;
    }
    try {
        receipt.value = await myOrderRepository.getReceipt(orderId.value)
    } catch (e) {
        defaultCatch(e);
    }
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
                myOrderRepository.sendReceiptToEmail(orderId.value, formData.email, type, refundId);
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
    )
}
</script>
