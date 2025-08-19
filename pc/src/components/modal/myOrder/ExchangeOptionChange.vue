
<template>
    <div class="m...option-inner">
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
                            <MMSimpleGoods
                                :goods="orderItem.goods"
                                :without-link="true"
                                class="T=single T=sm"
                            />
                            <MMSelect
                                v-model="selectedOptions[orderItem.id]"
                                class="T=short"
                            >
                                <option value="">
                                    옵션을 선택하세요
                                </option>
                                <option 
                                    v-for="option in orderItem.exchangeableOptions" 
                                    :key="option.id" 
                                    :value="option.id"
                                    :disabled="(option.stock || 0) < 1 || (option.id == orderItem.goods.optionId && !isSameOptionSelectable)"
                                >
                                    {{ `${option.label1}/${option.label2}` }}
                                </option>
                            </MMselect>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        
        <!-- 하단버튼 -->
        <div class="mm_foot">
            <div class="mm_btn_box T=equal">
                <button
                    type="button"
                    class="mm_btn T=primary"
                    @click="changeOption"
                >
                    <b>적용하기</b>
                </button>
            </div>
        </div>
    <!--// 하단버튼 -->
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { mmon } from '$/helper/mmon';
// types
import { ExchangeableOrderItem } from '$/@type/myOrder/item';
// components
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import MMSelect from '@/components/input/Select.vue';
import { ModalCloseHandler } from '$/@type/Modal';

const props = defineProps<{
  orderItems: ExchangeableOrderItem[],
  sellerName: string,
  isSameOptionSelectable: boolean,
  closer: ModalCloseHandler<{ [orderItemId: number]: number|string }>      
}>();
  
/** VARIABLE */
const selectedOptions = ref<{ [orderItemId: number]: number|string }>({});   // 주문상품별 선택한 옵션 ID

// 기존 선택 옵션 선택처리
props.orderItems.forEach(orderItem => {
    if (orderItem.exchangeOption) {
        selectedOptions.value[orderItem.id] = orderItem.exchangeOption.id;
    }
})
/** FUNCTION */
// 선택 옵션 적용
function changeOption() {
    if (Object.keys(selectedOptions.value).length < props.orderItems.length || Object.values(selectedOptions.value).indexOf('') > -1) {
        return mmon.bom.alert('옵션을 설정해주세요.');
    }

    props.orderItems.forEach(orderItem => {
        orderItem.exchangeOption = orderItem.exchangeableOptions?.find(option => option.id == selectedOptions.value[orderItem.id]);
    });

    props.closer(selectedOptions.value);
}

/** VUE LIFE CYCLE */

</script>
