<template>
    <MMOptions                 
        :options="options" 
        :is-restock="true"
        :goods-price="goodsPrice"
        :selected-options="[]"                                 
        @add:options="selectedOption"
    />
    <div class="mm_foot">
        <div class="mm_btn_box">
            <button type="button" class="mm_btn T=line T=primary" @click="applyRestockNotify">
                <b>재입고 알림 신청하기</b>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { GoodsOptions } from '$/@type/goods';
import { SelectedOption } from '$/@type/front';
import { toRefs, ref } from 'vue'
import { goodsRepository } from '$/repository/goodsRepository';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { ModalCloseHandler } from '$/@type/Modal';
import MMOptions from '@/pages/goods/Options.vue'

const props = withDefaults(defineProps<{
    goodsId: number
    isSingleOption: boolean
    goodsPrice: number
    options: GoodsOptions[]
    closer: ModalCloseHandler<void>
}>(), {
    isSingleOption: false,
    options: () => []
});

/** VARIABLE */
const { goodsId } = toRefs(props);
const restockSelectedOption = ref<SelectedOption|null>(null);
/** // VARIABLE */

/** FUNCTION */
/**
 * 재입고 알림 신청
 */
async function applyRestockNotify() {
    if (restockSelectedOption.value === null) {
        return mmon.bom.alert('상품을 선택 해주세요.');
    }
    mmon.loading.show(); 
    try {
        await goodsRepository.applyNotify(goodsId.value, restockSelectedOption.value.code);
        mmon.bom.alert('재입고 알림 신청이 완료 되었습니다.', () => {
            props.closer()
        });                
    } catch(e) {
        defaultCatch(e)
    } finally {
        mmon.loading.hide();
    }
}

/**
 * 옵션 선택 처리
 * @param selectedOption 
 */
function selectedOption(selectedOption: SelectedOption) {            
    restockSelectedOption.value = selectedOption;
}
/** // FUNCTION */
</script>
