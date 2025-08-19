<template>
    <div
        class="mm_product-select"
        :class="selected ? 'S=selected-complete' : ''"
    >
        <div
            :class="['mm_dropdown', { 'S=on': dropdownOn }]"
            data-dropdown
        >
            <button 
                type="button" 
                class="btn_dropdown"
                :title="dropdownOn ? '접어놓기' : '펼쳐보기'" 
                @click="() => { dropdownOn = !dropdownOn }"
            >
                <b>{{ label }}</b>
                <i class="ico_dropdown T=bold" />
            </button>
            <div
                class="mm_dropdown-item"
                :style="dropdownOn ? { height: 'auto'} : {}"
            >
                <div class="mm_dropdown-item-inner">
                    <div class="mm_scroller">
                        <ul>
                            <li
                                v-for="(orderItem, index) in orderItems"
                                :key="`${index}_${orderItem.goods.id}`"
                                @click="selectOrderItem(orderItem)"
                            >
                                <MMSimpleGoods
                                    class="T=single"
                                    :goods="orderItem.goods"
                                    :without-link="true"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- (D) 선택된 상품이 노출됩니다. -->
        <div class="mm_product-select-complete">
            <template v-if="selected">
                <MMSimpleGoods
                    class="T=single"
                    :goods="selected.goods"
                    :without-link="true"
                />
                <button
                    type="button"
                    class="btn_remove"
                    @click="selected = undefined; $emit('apply', selected)"
                >
                    <i class="ico_remove" /><b class="mm_ir-blind">삭제하기</b>
                </button>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SellerQnaOrderItem } from '$/@type/cs/inquiry/sellerQna';
import { ReviewableOrderItem } from '$/@type/member/review';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';

withDefaults(defineProps<{
    orderItems: SellerQnaOrderItem[]|ReviewableOrderItem[]
    label?: string
}>(), {
    orderItems: () => [],
    label: '상품을 선택해주세요.',
})
const emit = defineEmits(['apply']);

const selected = ref<SellerQnaOrderItem|ReviewableOrderItem|undefined>();
const dropdownOn = ref(false);

function selectOrderItem(orderItem: SellerQnaOrderItem|ReviewableOrderItem) {
    dropdownOn.value = false;
    selected.value = orderItem;
    emit('apply', orderItem);
}
</script>
