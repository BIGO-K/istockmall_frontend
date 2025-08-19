<template>
    <div class="mm_page-content-body">
        <h3 class="mm_heading">
            <b>주문 취소</b>
        </h3>
        <div class="m_my-order-fin">
            <p v-if="includeApplyStatus">
                주문 취소 신청이 완료되었습니다
            </p>
            <p v-else>
                주문 취소가 완료되었습니다
            </p>
            <div class="mm_btn_box">
                <a
                    class="mm_btn T=line T=dark"
                    href="#"
                    @click.prevent="router.replace({ name: 'Main' })"
                ><b>메인으로 이동</b></a>
                <a
                    class="mm_btn T=primary"
                    href="#"
                    @click.prevent="router.replace({ name: 'MypageOrderCancelList' })"
                ><b>취소내역 확인</b></a>
            </div>
        </div>
        <!-- 주문 취소 내역 -->
        <div
            v-if="canceledOrderPacks.length"
            class="mm_order-item"
        >
            <MMCheck
                v-model="isAllChecked"
                label="전체 선택"
                :disabled="goodsOptionIds.length === 0"
            />
            <div class="mm_btn_box">
                <button
                    type="button"
                    class="mm_btn T=xs T=line btn_cart"
                    @click="addCart"
                >
                    <i class="ico_cart" /><b>장바구니 담기</b>
                </button>
            </div>
            <div
                v-for="pack in canceledOrderPacks"
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
                        v-for="itemSet in pack.orderItemSets"
                        :key="itemSet.id"
                    >
                        <div class="mm_flex">
                            <MMCheck
                                v-if="!itemSet.goods.isSoldout"
                                v-model="selectedGoodsOptionIds"
                                :value="itemSet.goods.optionId"
                                name="cart_goods"
                                :is-blind-label="true"
                                label="상품 선택"
                            />
                            <label v-else class="mm_form-check T=disabled">
                                <b class="mm_block">
                                    <i class="ico_form-check" />
                                    <span class="mm_ir-blind text_label">상품 선택</span>
                                </b>
                            </label>
                            <MMSimpleGoods
                                class="T=single"
                                :goods="itemSet.goods"
                                :show-soldout="true"
                            />
                            <p class="text_seller">
                                <i class="ico_shop" />{{ itemSet.sellerName }}
                            </p>
                            <p class="text_price">
                                <strong>{{ MMFilters.formatNumber(itemSet.totalPaidPrice + itemSet.totalPointUsed) }}</strong>
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
            <MMCheck
                v-model="isAllChecked"
                label="전체 선택"
                :disabled="goodsOptionIds.length === 0"
            />
            <div class="mm_btn_box">
                <button
                    type="button"
                    class="mm_btn T=xs T=line btn_cart"
                    @click="addCart"
                >
                    <i class="ico_cart" /><b>장바구니 담기</b>
                </button>
            </div>
        </div>
        <!--// 주문 취소 내역 -->

        <!-- 유의사항 -->
        <div class="mm_note">
            <ul>
                <li>판매자의 <strong>승인 전까지 주문은 실제로 취소되지 않으며,</strong> 사정에 따라 <strong>취소 거부</strong>가 될 수 있습니다.</li>
                <li>노출되는 가격 및 옵션은 현재와 다를 수 있습니다.</li>
                <li>품절 등 장바구니에 담을 수 없는 상품은 체크하실 수 없습니다.</li>
                <li>취소 수량과 별개로 장바구니에는 1개의 수량만 담깁니다.</li>
            </ul>
        </div>
    <!--// 유의사항 -->
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { defaultCatch, pluck } from '$/functions';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { mmon } from '$/helper/mmon';
import { CartOptions } from '$/@type/shopping';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import MMCheck from '@/components/input/Check.vue';
import { Goods } from '$/@type/goods';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useCanceledOrder } from '$/composables/mypage/order/claim/cancelComposable';

/** VARIABLE */
// 주문번호,  취소주문번호
const props = defineProps<{
    orderId: string
    cancelIds: string[]
}>()

usePageTitleSetting('취소 완료', ['주문 취소', '주문 관리', '마이페이지']);
const { router } = usePageContext();
const { canceledOrderPacks, includeApplyStatus } = useCanceledOrder(props.cancelIds);

// 상품옵션ID 리스트
const goodsOptionIds = computed<number[]>(() => {
    const goodsList: Goods[] = pluck(canceledOrderPacks.value, 'orderItemSets.goods');
    return pluck(goodsList.filter((goods) => !goods.isSoldout)|| [], 'optionId');
});
const selectedGoodsOptionIds = ref<number[]>([]);
const isAllChecked = computed({
    get: () => {
        return goodsOptionIds.value.length !== 0 && goodsOptionIds.value.every(optionId => {
            return selectedGoodsOptionIds.value.filter(selectedOptionId => String(selectedOptionId) == String(optionId)).length
        })
    },
    set: (val:boolean) => {
        selectedGoodsOptionIds.value = val ? goodsOptionIds.value : [];
    }
});
/** // VARIABLE */

/** FUNCTION */        
/**
 * 장바구니 담기
 */
async function addCart() {
    if (selectedGoodsOptionIds.value.length < 1) {
        return mmon.bom.alert('상품을 선택해주세요.');
    }
            
    try {
        const addCartOptions: CartOptions[] = [...new Set(selectedGoodsOptionIds.value)].map(optionId => {
            return {
                option_id: optionId,
                ea: 1
            }    
        });

        await shoppingRepository.addCart(addCartOptions);
        mmon.bom.confirm(
            '선택하신 상품을 장바구니에 담았습니다.\n장바구니로 이동하시겠습니까?', 
            (isConfirm: boolean) => {
                if (isConfirm) {
                    router.replace({
                        name: 'Cart',                        
                    })
                }
            },
            {
                closeButtonLabel: '장바구니 가기',
                cancelButtonLabel: '쇼핑 계속하기'                           
            }
        );
    } catch (e) {
        defaultCatch(e);
    }
}
/** // FUNCTION */   
</script>
