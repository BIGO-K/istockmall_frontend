<template>
    <div class="m_modal-my-confirm">
        <strong>구매 확정 이후로는 반품 및 교환이 불가하므로<br> 상품을 받으신 후 진행해주세요</strong>
        <!-- 구매확정목록 -->
        <div class="mm_order-item-seller">
            <div class="mm_order...seller-head">
                <h5><i class="ico_shop" /><b>{{ sellerName }}</b></h5>
            </div>
            <ul>
                <li>
                    <div class="mm_flex">
                        <MMSimpleGoods
                            class="T=single"
                            :goods="orderItem.goods"
                        />
                    </div>
                </li>
            </ul>
        </div>
        <!--// 구매확정목록 -->
        <p v-if="pointLabel">
            구매 확정 시 {{ pointLabel.name }} 
            <b>
                <strong>{{ MMFilters.formatNumber(orderItem.earnablePoint) }}</strong>
                <sub>{{ pointLabel.suffix }}</sub>
            </b> 
            적립
        </p>
        <!-- 하단버튼 -->
        <div class="mm_foot">
            <div class="mm_btn_box">
                <button
                    type="button"
                    class="mm_btn T=primary"
                    @click="confirmPurchase(orderItem.id)"
                >
                    <b>구매확정</b>
                </button>
            </div>
        </div>
        <!--// 하단버튼 -->
    </div>
</template>

<script setup lang='ts'>
import { NormalOrderItem } from '$/@type/myOrder/item'
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { myOrderRepository } from '$/repository/myOrder/orderRepository';
import { PointLabel } from '$/@type/member/point';
import { ModalCloseHandler } from '$/@type/Modal';
import { useRouter } from 'vue-router';

const props = defineProps<{
    orderItem: NormalOrderItem,
    sellerName: string,
    orderStatusCode: string,
    pointLabel?: PointLabel,
    closer: ModalCloseHandler<void>,
}>();

/** VARIABLE */
const router = useRouter();


/** FUNCTION */
/**
 * 구매확정 처리
 */
function confirmPurchase(orderItemId: number) {
    mmon.bom.confirm('구매 확정 시 반품/교환 신청하실 수 없습니다.\n 구매 확정을 하시겠습니까?', async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }

        try {
            await myOrderRepository.confirmPurchase(orderItemId);
            if (!props.orderStatusCode) {
                return props.closer();                
            }

            mmon.bom.confirm('리뷰 작성이 가능합니다.\n 리뷰 작성 페이지로 이동 하시겠습니까?', (flag: boolean) => {
                if(!flag) {
                    return  props.closer();
                }

                router.push({
                    name: 'MypageReviewWritable'
                })

            })
        } catch(e) {
            defaultCatch(e);
        }
    });
   
}
/** VUE LIFE CYCLE */

</script>