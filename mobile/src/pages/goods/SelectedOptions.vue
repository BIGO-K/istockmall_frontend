<!-- @format -->

<template>
    <!-- 선택된 옵션 목록 -->
    <!--
        (D) 옵션을 4개이상 선택하여 ".m_product-option-selected" 요소에 스크롤이 생기는 경우 'S=selected-scroll' 클래스를 추가합니다.
            선택된 상품이 없을경우 .m_product-option-selected 요소를 노출하지 않습니다.
    -->
    <div
        v-if="selectedOptions.length > 0"
        class="mm_scroller m_product-option-selected"
    >
        <ul>
            <li v-for="selectedOption in selectedOptions" :key="selectedOption.code">
                <div class="m...selected-info">
                    <p class="text_product">
                        {{ goodsName }}
                    </p>
                    <p class="text_option">
                        {{ optionLabel(selectedOption) }}
                    </p>
                    <span v-if="selectedOption.stock < 6" class="text_stock">남은 수량 {{ selectedOption.stock }}개</span>
                </div>
                <div class="mm_stepper" data-stepper="{ '_max': 99 }">
                    <div class="mm_form-text">
                        <label>
                            <input
                                v-model="selectedOption.buyAmount"
                                type="text"
                                class="textfield text_stepper"
                                data-text
                                :disabled="isJointPurchase"
                                @input="handleBuyAmount(selectedOption)"
                                @focusout="handleFocusOutAmount(selectedOption)"
                            >
                            <i class="bg_text" />
                            <span class="mm_ir-blind text_placeholder">수량</span>
                        </label>
                    </div>
                    <button
                        type="button"
                        :disabled="selectedOption.buyAmount === 1 || isJointPurchase"
                        class="btn_stepper-subtract"
                        @click="minusAmount(selectedOption)"
                    >
                        <i class="ico_stepper-subtract" />
                        <b class="mm_ir-blind">수량 빼기</b>
                    </button>
                    <button
                        type="button"
                        :disabled="selectedOption.buyAmount >= selectedOption.stock || isJointPurchase"
                        class="btn_stepper-add"
                        @click="plusAmount(selectedOption)"
                    >
                        <i class="ico_stepper-add" />
                        <b class="mm_ir-blind">수량 더하기</b>
                    </button>
                </div>
                <p class="text_price">
                    <strong> {{ MMFilters.formatNumber(selectedOption.goodsPrice * selectedOption.buyAmount) }}</strong>
                </p>
                <button
                    v-if="!isSingleOption"
                    type="button"
                    class="btn_option-remove"
                    @click="removeOption(selectedOption.code)"
                >
                    <i class="ico_option-remove" />
                    <b class="mm_ir-blind">옵션삭제</b>
                </button>
            </li>
        </ul>
    </div>   
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { SelectedOption } from "$/@type/front";

const props = withDefaults(defineProps<{
    selectedOptions: SelectedOption[]
    isSingleOption: boolean
    goodsName: string
    isJointPurchase: boolean
}>(), {
    selectedOptions: () => [],
    isSingleOption: false,
    goodsName: '',
    isJointPurchase: false,
})

const emit = defineEmits(['remove:options'])

const { selectedOptions, isSingleOption, isJointPurchase } = toRefs(props);


function optionLabel(option: SelectedOption) {
    if (option.optionName === "-") {
        return option.subOptionName;
    } else if (option.subOptionName === "-") {
        return option.optionName;
    }

    return `${option.optionName}/${option.subOptionName}`;
}
function plusAmount(selectedOption: SelectedOption) {
    selectedOption.buyAmount = Number(selectedOption.buyAmount) + 1;
}

function minusAmount(selectedOption: SelectedOption) {
    selectedOption.buyAmount = Number(selectedOption.buyAmount) - 1;
}

function handleBuyAmount(selectedOption: SelectedOption) {
    if (selectedOption.buyAmount > selectedOption.stock) {
        selectedOption.buyAmount = selectedOption.stock;
    }

    if (`${selectedOption.buyAmount}` === "0") {
        selectedOption.buyAmount = 1;
    }
}

function removeOption(optionCode: number) {
    emit("remove:options", optionCode);
}

function handleFocusOutAmount(selectedOption: SelectedOption) {
    if (`${selectedOption.buyAmount}` === "") {
        selectedOption.buyAmount = 1;
    }
}

</script>
