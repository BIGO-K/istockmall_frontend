<template>
    <div v-if="cancelDetail" class="mm_tab-item">
        <!-- 취소 상품 -->
        <div class="m...detail-product">
            <h5 class="mm_strapline T=line">
                <b>취소 상품</b>
            </h5>
            <div
                v-for="pack in cancelDetail.packs"
                :key="pack.shippingRuleId"
                class="mm_order-item-seller"
            >
                <div class="mm_order...seller-head">
                    <p class="text_ship">
                        <i class="ico_ship" />
                        <span v-if="pack.paidShippingPrice === 0">무료배송</span>
                        <span
                            v-else
                            class="text_price"
                        ><strong>{{ MMFilters.formatNumber(pack.paidShippingPrice) }}</strong></span>
                    </p>
                </div>
                <ul>
                    <li
                        v-for="orderItem in pack.orderItems"
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
                                    <strong>{{ MMFilters.formatNumber(orderItem.paidPrice) }}</strong>
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!--// 취소 상품 -->

        <!-- 취소 사유 -->
        <section
            v-if="cancelDetail.reason"
            class="mm_order-form"
        >
            <h5 class="mm_strapline T=line">
                <b>취소 사유</b>
            </h5>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>취소 사유</b>
                        </th>
                        <td>
                            <div class="mm_form-select T=short">
                                <label>
                                    <span class="text_readonly">{{ cancelDetail.reason.label }}</span>
                                    <i class="ico_form-select" />
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="cancelDetail.reason.detail">
                        <th scope="row">
                            <b>상세 사유</b>
                        </th>
                        <td>
                            <div class="mm_form-textarea">
                                <label>
                                    <span
                                        class="textfield text_readonly"
                                        v-html="MMFilters.nlToBr(cancelDetail.reason.detail)"
                                    />
                                    <i class="bg_text" />
                                </label>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 취소 사유 -->

        <!-- 환불 계좌정보 -->
        <section
            v-if="cancelDetail.refundAccount"
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
                        <td>{{ cancelDetail.refundAccount.ownerName }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>환불 은행</b>
                        </th>
                        <td>{{ cancelDetail.refundAccount.bankName }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>환불 계좌</b>
                        </th>
                        <td>{{ cancelDetail.refundAccount.accountNumber }}</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 환불 계좌정보 -->

        <!-- 환불 예상금액 -->
        <section
            v-if="cancelDetail.refundInfo && !cancelDetail.isCancelBeforePaid"
            class="mm_order-info"
        >
            <h5 class="mm_strapline T=line">
                <b>환불 예상금액</b>
            </h5>
            <table>
                <tbody>
                    <tr>
                        <th scope="row">
                            <strong>{{ payMethodLabel }} 환불</strong>
                        </th>
                        <td>
                            <p class="text_price">
                                <strong>{{ MMFilters.formatNumber(cancelDetail.refundInfo.refundPrice - sumOfRefundCalculateDetail) }}</strong>
                            </p>
                        </td>
                    </tr>
                    <tr
                        v-for="detail in cancelDetail.refundInfo.calculateDetails"
                        :key="detail.label"
                    >
                        <template v-if="detail.amount !== 0">
                            <th scope="row">
                                <strong>{{ detail.label }}</strong>
                            </th>
                            <td>
                                <p class="text_price">
                                    {{ detail.isSubtracted ? '-' : '+' }}
                                    <strong>{{ MMFilters.formatNumber(detail.amount) }}</strong>
                                </p>
                            </td>
                        </template>
                    </tr>
                    <tr>
                        <th scope="row">
                            <strong>환불 예상금액</strong>
                        </th>
                        <td>
                            <p class="text_price mm_text-variable">
                                <strong>{{ MMFilters.formatNumber(cancelDetail.refundInfo.refundPrice) }}</strong>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="mm_note">
                <ul>
                    <li>입력하신 계좌 정보는 환불 목적으로만 이용되고 있습니다.</li>
                </ul>
            </div>
        </section>
    <!--// 환불 예상금액 -->
    </div>
</template>
<script lang="ts" setup>
import { orderDetailRepository } from '$/repository/myOrder/detailRepository';
import { defaultCatch } from '$/functions';
import { ref, onMounted, computed } from 'vue';
import { CancelDetail } from '$/@type/myOrder/detail';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';

const props = defineProps<{
    cancelId: string
    payMethodLabel: string
}>();

const cancelDetail = ref<CancelDetail>({
    isCancelBeforePaid: false,
    packs: [],
    reason: {
        label: '',
        detail: '',
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

// 환불금액 상세 합계
const sumOfRefundCalculateDetail = computed(() => {
    let sum = 0;
    if (cancelDetail.value.refundInfo.calculateDetails.length < 1) {
        return sum;
    }
    cancelDetail.value.refundInfo.calculateDetails.forEach((detail) => {
        sum += detail.isSubtracted ? -Number(detail.amount) : Number(detail.amount);
    })

    return sum;
})

onMounted(async () => {
    try {
        cancelDetail.value = await orderDetailRepository.getCancelDetail(props.cancelId);
    } catch (e) {
        defaultCatch(e);
    }
});
</script>