<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>구매 확정</b></h1>
        </template>

        <template #contents>
            <div v-if="orderItem" class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-myconfirm">
                            <h3 class="mm_heading">
                                <b>구매 확정 이후로는 반품 및 교환이 불가하므로<br> 상품을 받으신 후 진행해주세요</b>
                            </h3>
                            <!-- 구매확정상품 -->
                            <div class="mm_order-item">
                                <div class="mm_order-item-seller">
                                    <div class="mm_order...seller-head">
                                        <h5><i class="ico_shop" /><b>{{ sellerName }}</b></h5>
                                    </div>
                                    <div class="mm_product-list T=sm">
                                        <ul>
                                            <li>
                                                <MMOrderGoods :goods="orderItem.goods" />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!--// 구매확정상품 -->
                            <div class="mm_inner">
                                <p class="text_point">
                                    구매 확정 시 {{ pointLabel.name }} 
                                    <b>
                                        <strong>{{ MMFilters.formatNumber(orderItem.earnablePoint) }}</strong>
                                        <sub>{{ pointLabel.suffix }}</sub>
                                    </b> 
                                    적립
                                </p>
                                <div class="mm_foot">
                                    <div class="mm_btn_box">
                                        <button type="button" class="mm_btn T=primary" @click="confirmPurchase">
                                            <b>구매 확정하기</b>
                                        </button>
                                    </div>
                                </div>
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
import ModalPopup from '@/components/layout/ModalPopup.vue';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import { usePurchaseConfirm } from '$/composables/mypage/order/myOrderComposable';
import { myOrderRepository } from '$/repository/myOrder/orderRepository';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { useRouter } from 'vue-router';
import { PointLabel } from '$/@type/member/point';
import { onMounted, ref } from 'vue';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';

const router = useRouter();
const { 
    purchaseConfirmModalData: {
        orderItem,
        sellerName,
        needConfirm
    } 
} = usePurchaseConfirm();
const { globalConfigs } = useGlobalConfigs();
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);


onMounted(async () => {
    if (!orderItem.value || Object.keys(orderItem.value).length === 0) {
        router.go(-1);
    } 
})

/**
 * 구매확정 처리
 */
function confirmPurchase() {
    if (!orderItem) {
        return mmon.bom.alert('주문상품을 찾을 수 없습니다. \n창을 새로고침 해주세요.');
    }
    
    mmon.bom.confirm('구매 확정 시 반품/교환 신청하실 수 없습니다.\n 구매 확정을 하시겠습니까?', async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }

        try {
            await myOrderRepository.confirmPurchase(orderItem.value.id);
            if (!needConfirm.value) {
                return router.go(-1);
            } 

            mmon.bom.confirm('리뷰 작성이 가능합니다.\n 리뷰 작성 페이지로 이동 하시겠습니까?', (flag: boolean) => {
                if(!flag) {
                    return router.go(-1);
                }
                router.push({
                    name: 'MypageReviewWritable',
                    replace: true
                })
            })
            

            
        } catch(e) {
            defaultCatch(e)
        }
    });
}

</script>
