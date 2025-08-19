<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>옵션 변경</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-myorder-option">
                            <div class="mm_order-item">
                                <div class="mm_order-item-seller">
                                    <div class="mm_order...seller-head">
                                        <h5><i class="ico_shop" /><b>{{ sellerName }}</b></h5>
                                    </div>
                                    <div class="mm_product-list T=sm">
                                        <ul>
                                            <li v-for="orderItem in orderItems" :key="orderItem.id">
                                                <MMOrderGoods 
                                                    :goods="orderItem.goods" 
                                                    :price="orderItem.paidPrice + orderItem.pointUsed" 
                                                    :without-link="true"
                                                >
                                                    <template #footer>
                                                        <MMSelect v-model="selectedOptions[orderItem.id]">
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
                                        <button type="button" class="mm_btn T=primary" @click="applySelectedOptions">
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
import { useExchangeOptionChange } from '$/composables/mypage/order/claim/exchangeComposable';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import MMOrderGoods from '@/components/goods/OrderGoods.vue';
import MMSelect from '@/components/input/Select.vue';
import { onMounted, ref } from 'vue';
import { mmon } from '$/helper/mmon';
import { useRouter } from 'vue-router';

const router = useRouter();
const { 
    exchangeOptionChangeModalData: {
        orderItems,
        sellerName,
        isSameOptionSelectable,
    },
    selectedOptionList
} = useExchangeOptionChange();

const selectedOptions = ref<{ [orderItemId: number]: number|string }>({});

// 선택 옵션 적용
function applySelectedOptions() {
    if (Object.keys(selectedOptions.value).length < orderItems.value.length || Object.values(selectedOptions.value).indexOf('') > -1) {
        return mmon.bom.alert('옵션을 설정해주세요.');
    }

    orderItems.value.forEach(orderItem => {
        orderItem.exchangeOption = orderItem.exchangeableOptions.find(option => option.id == selectedOptions.value[orderItem.id]);
    });
    
    selectedOptionList.value = Object.assign(selectedOptionList.value, selectedOptions.value)
    router.go(-1);
}

onMounted(() => {
    if (!orderItems.value || Object.keys(orderItems.value).length === 0) {
        router.go(-1)
    }
    
    // 기존 선택 옵션 선택처리
    orderItems.value.forEach(orderItem => {
        if (orderItem.exchangeOption) {
            selectedOptions.value[orderItem.id] = orderItem.exchangeOption.id;
        }
    })
});
</script>
