<template>
    <div v-if="cancelDetail" class="mm_dropdown-item-inner">
        <!-- 취소상품 -->
        <div class="mm_order-item">
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
                <div class="mm_product-list T=sm">
                    <ul>
                        <li v-for="orderItem in pack.orderItems" :key="orderItem.id">
                            <p class="text_seller">
                                <i class="ico_shop" />{{ orderItem.sellerName }}
                            </p>
                            <MMOrderGoods :goods="orderItem.goods" :price="orderItem.paidPrice" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--// 취소상품 -->

        <!-- 취소정보 -->
        <div class="mm_inner m_myorder-detail-claim">
            <h4 class="mm_strapline">
                <b>취소 사유</b>
            </h4>
            <div class="mm_form-select">
                <label>
                    <span class="text_readonly">{{ cancelDetail.reason.label }}</span>
                    <i class="ico_form-select" />
                </label>
            </div>
            <div v-if="cancelDetail.reason.detail" class="mm_form-textarea">
                <label>
                    <span class="textfield text_readonly" v-html="MMFilters.nlToBr(cancelDetail.reason.detail)" />
                    <i class="bg_text" />
                </label>
            </div>
            <template v-if="cancelDetail.refundAccount">
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
                </div>
            </template>
            <template v-if="cancelDetail.refundInfo && !cancelDetail.isCancelBeforePaid">
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
                                        <strong>{{ MMFilters.formatNumber(cancelDetail.refundInfo.refundPrice - sumOfRefundCaculateDetail) }}</strong>
                                    </p>
                                </td>
                            </tr>
                            <tr v-for="detail in cancelDetail.refundInfo.calculateDetails" :key="detail.label">
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
                                    <b>환불 예상금액</b>
                                </th>
                                <td>
                                    <p class="text_price mm_text-variable">
                                        <strong>{{ MMFilters.formatNumber(cancelDetail.refundInfo.refundPrice) }}</strong>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </div>
        <!--// 취소정보 -->
    </div>
</template>

<script setup lang='ts'>
import { CancelDetail } from '$/@type/myOrder/detail';
import { defaultCatch } from '$/functions';
import { orderDetailRepository } from '$/repository/myOrder/detailRepository';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
    cancelId: string
    payMethodLabel: string
}>();

const cancelDetail = ref<CancelDetail|undefined>();
// 환불금액 상세 합계
const sumOfRefundCaculateDetail = computed(() => {
    let sum = 0;
    if ((cancelDetail.value?.refundInfo.calculateDetails.length || []) < 1) {
        return sum;
    }
    cancelDetail.value?.refundInfo.calculateDetails.forEach((detail) => {
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
