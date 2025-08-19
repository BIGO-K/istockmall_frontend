<template>
    <div class="m...option-inner">
        <MMCheck
            v-model="isAllChecked"
            label="전체 선택"
        />
        <div class="mm_scroller">
            <div class="mm_order-item-seller">
                <div class="mm_order...seller-head">
                    <h5><i class="ico_shop" /><b>{{ sellerName }}</b></h5>
                </div>
                <ul>
                    <li
                        v-for="orderItem in (orderItems || [])"
                        :key="orderItem.id"
                    >
                        <div class="mm_flex">
                            <MMCheck
                                v-model="selectedItems"
                                :value="orderItem[valueKeyName || 'id']"
                                :is-blind-label="true"
                            />
                            <MMSimpleGoods
                                :goods="orderItem.goods"
                                class="T=single T=sm"
                                :without-link="true"
                                :price="orderItem.paidPrice + orderItem.pointUsed"
                            />
                            <div
                                v-if="orderItem.usedCouponTitle"
                                class="mm_form-select T=short"
                            >
                                <label>
                                    <span class="text_readonly">{{ orderItem.usedCouponTitle }}</span>
                                    <i class="ico_form-select" />
                                </label>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!-- 하단버튼 -->
    <div class="mm_foot">
        <div class="mm_btn_box T=equal">
            <button
                type="button"
                class="mm_btn T=primary"
                @click="apply"
            >
                <b>적용하기</b>
            </button>
        </div>
    </div>
    <!--// 하단버튼 -->
</template>

<script setup lang='ts'>
import { ref,computed } from 'vue';
import { ClaimableOrderItem, ExchangeToReturnableOrderItem } from '$/@type/myOrder/item';
import MMCheck from '@/components/input/Check.vue';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import { ModalCloseHandler } from '$/@type/Modal';
import { mmon } from '$/helper/mmon';

const props = withDefaults(defineProps<{
    orderItems: ClaimableOrderItem[]
    valueKeyName?: keyof ClaimableOrderItem|keyof ExchangeToReturnableOrderItem
    selectedOrderItemIds: number[]
    orderItemSetId: number
    sellerName: string
    closer: ModalCloseHandler<{selected: number[], orderItemSetId: number}>
}>(), {
    orderItems: () => [],
    orderItemSetId: 0,
    sellerName: '',
    selectedOrderItemIds: () => [],
    valueKeyName: 'id'
})

/** VARIABLE */
const selectedItems = ref<number[]>(props.selectedOrderItemIds);
        

//전체선택 여부
const isAllChecked = computed({
    get: () => props.orderItems.every(orderItem => {
        return selectedItems.value.filter(selectedItem => String(selectedItem) == String(orderItem[props.valueKeyName || 'id'])).length
    }),
    set: (val:boolean) => {
        selectedItems.value = val ? props.orderItems.map(orderItem => orderItem[props.valueKeyName || 'id'] as number) : [];
    }
});
/** FUNCTION */

function apply() {
    if (selectedItems.value.length < 1) {
        return mmon.bom.alert('상품을 선택해주세요.');
    }
    mmon.bom.alert('수량 적용되었습니다.', () => {
        props.closer({
            selected: selectedItems.value,
            orderItemSetId: props.orderItemSetId
        })
    });
}
/** //FUNCTION **/
</script>