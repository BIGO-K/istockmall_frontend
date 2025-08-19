<template>
    <mm-options                 
        :options="options" 
        :is-restock="true"
        :goods-price="goodsPrice"
        :selected-options="[]"                                 
        @add:options="selectedOption"
    />
    <div class="mm_foot">
        <div class="mm_btn_box">
            <button
                type="button"
                class="mm_btn T=primary"
                @click="applyRestockNotify"
            >
                <b>재입고 알림 받기</b>
            </button>
        </div>
    </div>
</template>


<script setup lang='ts'>
import { GoodsOptions } from '$/@type/goods';
import { SelectedOption } from '$/@type/front';
import { ref } from 'vue'
import { goodsRepository } from '$/repository/goodsRepository';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import MmOptions from '@/pages/goods/Options.vue';
import { ModalCloseHandler } from '$/@type/Modal';

const props = defineProps<{
    goodsId: number,
    isSingleOption: boolean,
    goodsPrice: number,
    options: GoodsOptions[],
    closer: ModalCloseHandler<void>
}>();

/** VARIABLE */
const restockSelectedOption = ref<SelectedOption|null>(null);
/** FUNCTION */
async function applyRestockNotify() {
    if (restockSelectedOption.value === null) {
        return mmon.bom.alert('상품을 선택 해주세요.');
    }
    mmon.loading.show(); 
    try {
        await goodsRepository.applyNotify(props.goodsId, restockSelectedOption.value.code);                
        mmon.bom.alert('재입고 알림 신청이 완료 되었습니다.', () => {
            props.closer();
        });
    } catch(e) {
        defaultCatch(e)
    } finally {
        mmon.loading.hide();
    }
}

function selectedOption(selectedOption: SelectedOption) {            
    restockSelectedOption.value = selectedOption;
}
/** VUE LIFE CYCLE */
</script>

