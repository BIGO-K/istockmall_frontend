<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>부분 선택</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-myorder-option">
                            <div class="mm_order-item">
                                <MMCheck
                                    v-model="isAllChecked"
                                    label="전체 선택"
                                />
                                <div class="mm_order-item-seller">
                                    <div class="mm_order...seller-head">
                                        <h5><i class="ico_shop" /><b>{{ sellerName }}</b></h5>
                                    </div>
                                    <div class="mm_product-list T=sm">
                                        <ul>
                                            <li v-for="orderItem in orderItems" :key="orderItem.id">
                                                <MMCheck
                                                    v-model="selected"
                                                    :value="orderItem[valueKeyName || 'id']"
                                                    :is-blind-label="true"
                                                />
                                                <MMOrderGoods :goods="orderItem.goods" :price="orderItem.paidPrice + orderItem.pointUsed">
                                                    <template #footer>
                                                        <div v-if="orderItem.usedCouponTitle" class="mm_form-select T=sm">
                                                            <label>
                                                                <span class="text_readonly">{{ orderItem.usedCouponTitle }}</span>
                                                                <i class="ico_form-select" />
                                                            </label>
                                                        </div>
                                                    </template>
                                                </MMOrderGoods>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="mm_foot">
                                <div class="mm_inner">
                                    <div class="mm_btn_box">
                                        <button type="button" class="mm_btn T=primary" @click="applySelected">
                                            <b>적용하기</b>
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
import { useOrderItemSelect } from '$/composables/mypage/order/myOrderComposable';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import MMCheck from '@/components/input/Check.vue';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { mmon } from '$/helper/mmon';

const router = useRouter();
const {
    orderItemSelectModalData: {
        orderItems,
        orderItemSetId,
        sellerName,
        valueKeyName,
    },
    selectedOrderItemIds,
} = useOrderItemSelect();

//전체선택 여부
const isAllChecked = computed({
    get: () => orderItems.value.every(orderItem => {
        return selected.value.filter(selectedItem => String(selectedItem) == String(orderItem[valueKeyName.value || 'id'])).length
    }),
    set: (val:boolean) => {
        selected.value = val ? orderItems.value.map(orderItem => orderItem[valueKeyName.value || 'id'] as number) : [];
    }
});

const selected = ref<number[]>([]);

onMounted(() => {
    if (!orderItems.value || Object.keys(orderItems.value).length === 0) {
        router.go(-1)
    }
    selected.value = selectedOrderItemIds.value[orderItemSetId.value] || [];
});

// 선택 옵션 적용
function applySelected() {
    if (selected.value.length < 1) {
        return mmon.bom.alert('상품을 선택해주세요.');
    }
    
    selectedOrderItemIds.value[orderItemSetId.value] = selected.value;
    mmon.bom.alert('수량에 적용되었습니다.', () => {
        router.go(-1);
    });
}

</script>
