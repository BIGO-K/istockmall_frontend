<template>
    <!--
        (D) 옵션1 또는 옵션2의 갯수가 6개 이하인 경우 버튼형 옵션을 사용하고, 7개 이상인 경우 셀렉트형 옵션을 사용합니다.
        모든 옵션은 옵션의 순서와 무관하게 우선 선택이 가능합니다(예: 옵션2부터 선택가능)
        옵션1, 2모두 1개의 옵션만 있을 경우 옵션 선택없이 수량만 선택 가능합니다. 이 때, .m_product-option-select 요소는 삭제하지 않고 하위에 있는 section만 비노출합니다.
    -->
    <!-- (D) 버튼형 옵션 + 옵션1, 2 선택 상태 -->
    <div v-if="!isSingleOption" class="m_product-option-select">
        <!-- 셀렉트-->
        <template v-if="isOptionUseSelectBox">
            <div
                :class="[
                    'mm_dropdown', 
                    { 'S=option-selected' : optionSelected }, 
                    {'S=on' : optionShow }
                ]"
            >
                <h6 class="mm_strapline">
                    <b>옵션1</b>
                </h6>
                <button 
                    type="button" 
                    class="btn_dropdown" 
                    :title="optionShow ? '펼쳐보기' : '접어놓기'" 
                    @click="() => { optionShow = !optionShow; subOptionShow = false }" 
                >
                    <b>{{ optionSelected ? selectedOption.optionName : '옵션명1' }}</b><i class="ico_dropdown T=bold" />
                </button>
                <div class="mm_dropdown-item" :style="optionShow ? { height : 'auto'} : {}">
                    <div class="mm_dropdown-item-inner">
                        <div class="mm_scroller">
                            <ul>
                                <!-- (D) 옵션이 선택된 경우 btn_option 요소에 S=option-select 클래스와 '선택됨' 타이틀을 추가합니다. -->
                                <li v-for="option in filteredDepth1Options" :key="option.name">
                                    <button 
                                        v-if="option.isSelectAble"
                                        type="button"                                         
                                        :class="['btn_option', { 'S=option-select': selectedOption.optionName === option.name }]"
                                        title="선택됨"                            
                                        @click="() => { handleOptionTypeSelect(option.name); } "
                                    >
                                        <b>{{ option.name }}</b>
                                    </button>
                                    <span v-else class="mm_flex btn_option" title="품절"><b>{{ option.name }}</b><b>(품절)</b></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div :class="['mm_dropdown', {'S=on' : subOptionShow }]" data-dropdown>
                <h6 class="mm_strapline">
                    <b>옵션2</b>
                </h6>
                <button 
                    type="button" 
                    class="btn_dropdown" 
                    :title="subOptionShow ? '펼쳐보기' : '접어놓기'" 
                    @click="() => { subOptionShow = !subOptionShow }"
                >
                    <b>{{ subOptionSelected ? selectedOption.subOptionName : '옵션명2' }}</b><i class="ico_dropdown T=bold" />
                </button>
                <div class="mm_dropdown-item" :style="subOptionShow ? { height: 'auto'} : {}">
                    <div class="mm_dropdown-item-inner">
                        <div class="mm_scroller">
                            <ul v-if="selectedOption.optionName === ''">
                                <li v-for="subOption in allSubOptions" :key="subOption">
                                    <button                                                             
                                        type="button"          
                                        :class="['btn_option', { 'S=option-select': selectedOption.subOptionName === subOption }]"
                                        @click="() => { selectedOption.subOptionName = selectedOption.subOptionName === subOption ? '' : subOption; optionShow = true; subOptionShow = false }"                  
                                    >
                                        <b>{{ subOption }}</b>
                                    </button>                            
                                </li>
                            </ul>
                            <ul v-else>
                                <li v-for="subOption in currentSubOptions" :key="subOption.id">
                                    <button 
                                        v-if="subOption.isSelectAble" 
                                        type="button"
                                        class="btn_option"                                    
                                        @click="() => { selectedOption.subOptionName = selectedOption.subOptionName === subOption.name ? '' : subOption.name; handleSubOptionTypeSelect()}"
                                    >
                                        <b>{{ subOption.name }}</b>
                                        <b v-if="subOption.stock < 6 && optionSelected">({{ subOption.stock }}개)</b>
                                    </button>
                                    <span v-else class="mm_flex btn_option" title="품절"><b>{{ subOption.name }}</b><b>(품절)</b></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <!-- 박스 형태 -->
        <template v-else>
            <section :class="{'S=option-selected' : optionSelected }">
                <h6 class="mm_strapline">
                    <b>옵션1</b>
                </h6>
                <div class="mm_scroller T=x">
                    <ul>
                        <li v-for="option in filteredDepth1Options" :key="option.name">
                            <button 
                                v-if="option.isSelectAble"
                                type="button" 
                                :class="['btn_option', { 'S=option-select': selectedOption.optionName === option.name }]"                            
                                @click="handleOptionTypeButton(option.name)"
                            >
                                <b>{{ option.name }}</b>
                            </button>
                            <span v-else class="btn_option" title="품절">
                                <b>{{ option.name }}</b>
                                <svg><line x1="0" y1="100%" x2="100%" y2="0" stroke="#cdcdcd" stroke-width="1" /></svg>
                            </span>
                        </li> 
                    </ul>
                </div>
            </section>
            <section>
                <h6 class="mm_strapline">
                    <b>옵션2</b>
                </h6>
                <div class="mm_scroller T=x">
                    <ul v-if="selectedOption.optionName === ''">
                        <li v-for="subOption in allSubOptions" :key="subOption">
                            <button                                                             
                                type="button"          
                                :class="['btn_option', { 'S=option-select': selectedOption.subOptionName === subOption }]"
                                @click="() => { selectedOption.subOptionName = selectedOption.subOptionName === subOption ? '' : subOption }"                  
                            >
                                <b>{{ subOption }}</b>
                            </button>                            
                        </li>   
                    </ul>
                    <ul v-else>
                        <li v-for="subOption in currentSubOptions" :key="subOption.id">
                            <button 
                                v-if="subOption.isSelectAble || selectedOption.optionName === ''" 
                                type="button"
                                :class="['btn_option', { 'S=option-select': selectedOption.subOptionName === subOption.name }]" 
                                @click="() => { selectedOption.subOptionName = selectedOption.subOptionName === subOption.name ? '' : subOption.name; handleSubOptionTypeButton(); }"
                            >
                                <b>{{ subOption.name }}</b>
                            </button>
                            <span v-else class="btn_option" title="품절">
                                <b>{{ subOption.name }}</b>
                                <svg><line x1="0" y1="100%" x2="100%" y2="0" stroke="#cdcdcd" stroke-width="1" /></svg>
                            </span>                        
                        </li>                     
                    </ul>
                </div>
            </section>
        </template>
    </div>
    <div class="m_cart-option-quantity">
        <div class="mm_stepper" data-stepper="{ '_max': 99 }">
            <div class="mm_form-text">
                <label>
                    <input 
                        v-model="selectedOption.buyAmount" 
                        type="text" 
                        class="textfield text_stepper"
                        data-text
                        @input="validateBuyAmount"
                    >
                    <i class="bg_text" />
                    <span class="mm_ir-blind text_placeholder">수량</span>
                </label>
            </div>
            <button 
                type="button" 
                class="btn_stepper-subtract"
                :disabled="selectedOption.buyAmount === 1" 
                @click="() => { selectedOption.buyAmount -= 1 }" 
            >
                <i class="ico_stepper-subtract" />
                <b class="mm_ir-blind">수량 빼기</b>
            </button>
            <button 
                type="button" 
                class="btn_stepper-add"
                :disabled="selectedOption.buyAmount >= selectedOption.stock"  
                @click="() => { selectedOption.buyAmount += 1 }"
            >
                <i class="ico_stepper-add" />
                <b class="mm_ir-blind">수량 더하기</b>
            </button>
        </div>
        <!-- (D) 선택 옵션의 구매가능 수량이 5개 이하인 경우에만 text_stock 요소를 노출합니다 -->
        <span v-if="selectedOption.stock <= 5 && selectedOption.stock > 0" class="text_stock">구매가능 수량 {{ selectedOption.stock }}개</span>
    </div>
    <div class="mm_btn_box">
        <div class="mm_flex T=equal">
            <button type="button" class="mm_btn T=sm T=line T=light" @click="$emit('close')">
                <b>취소</b>
            </button>
            <button 
                type="button" 
                class="mm_btn T=sm T=dark"
                :disabled="(selectedOption.optionName === '' || selectedOption.subOptionName === '') && !isSingleOption"
                @click="cartOptionsChange"
            >
                <b>변경</b>
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { SelectedOption } from '$/@type/front';
import { GoodsOptions, SelectAbleOption } from '$/@type/goods';
import { CartPack } from '$/@type/shopping';
import { mmon } from '$/helper/mmon';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { computed, ref, toRefs } from 'vue';
import { defaultCatch } from '$/functions';

const props = withDefaults(defineProps<{
    options: GoodsOptions[]
    goodsPrice: number
    selectedItem: CartPack
}>(), {
    options: () => [],
    goodsPrice: 0,
});

const emit = defineEmits(['reFetch', 'close']);

/** VARIABLE */
const { options, selectedItem } = toRefs(props);
const optionShow = ref(false);
const subOptionShow = ref(false);

/**
 * 선택 옵션 데이터 
 */ 
const selectedOption = ref<SelectedOption>({
    optionName: selectedItem.value.optionStock > 0 ? selectedItem.value.optionName.split('/')[0].trim() : '',             
    code: selectedItem.value.optionId,
    stock: selectedItem.value.optionStock,
    subOptionName: selectedItem.value.optionStock > 0 ? selectedItem.value.optionName.split('/')[1].trim() : '',
    buyAmount: selectedItem.value.ea,
    optionPrice: 0,
    goodsPrice: 0
});     

// 단일 옵션 여부
const isSingleOption = options.value.length === 1  && options.value[0].subOptions.length === 1;

/**
 * 옵션 셀렉트 박스 사용 여부 
 */
const isOptionUseSelectBox = computed(() => {
    if (options.value.length > 6) {
        return true;
    }            
            
        
    const optionMoreThenSix = options.value.find(function (option) {
        return option.subOptions.length > 6                
    });

    if (optionMoreThenSix === undefined) {
        return false;
    }
            
    return true;              
});

const allSubOptions = computed(() => {
    return [...new Set(options.value.flatMap((option) => option.subOptions).map(sub => sub.name))]
})

const filteredDepth1Options = computed(() => {
    if (selectedOption.value.subOptionName === '') {
        return options.value;
    }
            
    if (isOptionUseSelectBox.value) {                
        return options.value;
    }

    return options.value.filter(function (option) {                
        const filteredSubOptions = option.subOptions.filter(function (subOptions) {
            if (subOptions.name === selectedOption.value.subOptionName) {
                option.isSelectAble = subOptions.stock < 1 ? false : true
                return subOptions;
            } 
        })
        if (filteredSubOptions.length > 0) {
            return {
                option,
                filteredSubOptions
            }
        }
    });
})

const optionSelected = computed(() => {
    return selectedOption.value.optionName !== '';
})

const subOptionSelected = computed(() => {
    return selectedOption.value.subOptionName !== '';
})

const isOptionUseOne = computed(() => {
    if (options.value.length < 1) {
        return false;
    }
    // '여기를 '-' 으로 변경 FREE 에서'
    if (
        (options.value.length === 1 && options.value[0].name === '-') 
                || (allSubOptions.value.length === 1 && allSubOptions.value[0] === '-')
    ) {
        return true;
    }

    return false;
})

const nowSelectedSubOption = computed(() => {
    if (selectedOption.value.optionName === '' && !isOptionUseOne.value) {
        return undefined
    }
    return currentSubOptions.value.find(function (sub) {
        return sub.name === selectedOption.value.subOptionName
    })
})

const currentSubOptions = computed<SelectAbleOption[]>(() => {
    if (isOptionUseOne.value) {
        if (options.value.length === 1) {
            return options.value[0].subOptions.map((subOption) => {
                return {
                    name: subOption.name,
                    id: subOption.id,
                    stock: subOption.stock,
                    isSelectAble: subOption.stock < 1 ? false: true,
                    price: subOption.price
                }
            })
        } else {
            return options.value.map(function (option) {
                return {
                    name: option.name,
                    id: option.subOptions[0].id,
                    stock: option.subOptions[0].stock,
                    isSelectAble: option.subOptions[0].stock < 1 ? false : true,
                    price: 0
                }
            })
        }
    }
    return options.value.find(function (option) {
        if (selectedOption.value.optionName === '') {                    
            return option.subOptions;
        } else {
            return option.name === selectedOption.value.optionName;
        }
    })?.subOptions || [];
})

/**
 * 셀렉트 옵션1 핸들링 함수
 * @param optionName 
 */
function handleOptionTypeSelect(optionName: string) {
    if (selectedOption.value.optionName !== optionName) {
        selectedOption.value.subOptionName = '';
    }

    selectedOption.value.optionName = optionName;
    // 옵션1 셀렉트 박스 닫힘 처리 
    optionShow.value = false;            
    // 옵션 2 선택된 경우 선택된 옵션 추가 처리 
    if (subOptionSelected.value === false) {
        return subOptionShow.value = true;
    }

    subOptionShow.value = false;
    handleSubOptionTypeSelect();
    addOptions();
}

/**
         * 셀렉트 옵션2 선택시 실행 함수 
         * @param subOption 
         */
function handleSubOptionTypeSelect() {
    if (optionSelected.value === false || nowSelectedSubOption.value === undefined) {
        return;
    }
    subOptionShow.value = false;
    selectedOption.value.code = nowSelectedSubOption.value.id;
    selectedOption.value.stock = nowSelectedSubOption.value.stock;
    addOptions();         
}

/** 
 * 버튼형 옵션1 선택시 실행되는 함수         
 * @param optionName 
 */
function handleOptionTypeButton(optionName: string) {
    if (selectedOption.value.optionName !== optionName) {
        selectedOption.value.subOptionName = '';
    }
    // 옵션1 선택 처리
    selectedOption.value.optionName = selectedOption.value.optionName === optionName ? '' : optionName;
    // 옵션 2 선택된 경우 선택된 옵션 추가 처리 
    if (subOptionSelected.value) {  
        handleSubOptionTypeButton();
        addOptions();
    }            
}

/**
 * 버튼형 옵션2 선택시 실행 함수 
 * @param subOption 
 */
function handleSubOptionTypeButton() {
    if(
        (optionSelected.value === false && isOptionUseOne.value === false)
                || nowSelectedSubOption.value === undefined
    ) {
        return;
    }
    // 2번 옵션 관련 코드 설정
    selectedOption.value.code = nowSelectedSubOption.value.id;
    selectedOption.value.stock = nowSelectedSubOption.value.stock;
    addOptions();
}

function addOptions() {
    if (selectedOption.value.buyAmount > selectedOption.value.stock) {
        selectedOption.value.buyAmount = selectedOption.value.stock
    }
}

/**
 * 구매가능 수량 검증
 */
function validateBuyAmount() {
    selectedOption.value.buyAmount = selectedOption.value.stock < selectedOption.value.buyAmount 
        ? selectedOption.value.stock 
        : selectedOption.value.buyAmount
}

/**
 * 카트 옵션 변경 처리
 */
async function cartOptionsChange() {
    mmon.loading.show();
    try {
        await shoppingRepository.updateCartGoodsOption(
            selectedItem.value.cartId, 
            selectedOption.value.code, 
            selectedOption.value.buyAmount
        );
        mmon.bom.alert('옵션이 변경 되었습니다', () => {
            emit('reFetch');
        });
    } catch(error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}
/** // FUNCTION */
</script>
