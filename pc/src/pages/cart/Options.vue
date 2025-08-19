<template>
    <div
        v-if="!isSingleOption"
        :class="['m_product-option-select', { 'T=select-button' : !isOptionUseSelectBox }]"
    >
        <template v-if="isOptionUseSelectBox">
            <div
                class="mm_dropdown"
                :class="[{ 'S=option-selected' : optionSelected }, {'S=on' : optionShow }]"
            >
                <h6><b>옵션1</b></h6>
                <!-- (D) 옵션을 선택하면 'btn_dropdown > b' 요소의 텍스트를 "옵션명" 에서 선택한 옵션명으로 변경합니다 -->
                <button 
                    type="button" 
                    class="btn_dropdown"
                    :title="optionShow ? '펼쳐보기' : '접어두기'" 
                    @click="() => { optionShow = !optionShow; subOptionShow = false }"
                >
                    <b>{{ optionSelected ? selectedOption.optionName : '옵션명1' }}</b><i class="ico_dropdown T=bold" />
                </button>            
                <div
                    class="mm_dropdown-item"
                    :style="optionShow ? { height: 'auto'} : {}"
                >
                    <div class="mm_dropdown-item-inner">
                        <div class="mm_scroller">
                            <ul>
                                <li v-for="option in tempOptions" :key="option.name">
                                    <button 
                                        v-if="option.isSelectAble"
                                        type="button" 
                                        :class="['btn_option', { 'S=option-select': selectedOption.optionName === option.name }]"                            
                                        @click="() => { handleOptionTypeSelect(option.name); } "
                                    >
                                        <b>{{ option.name }}</b>
                                    </button>
                                    <span
                                        v-else
                                        class="mm_flex btn_option"
                                        title="품절"
                                    ><b>{{ option.name }}</b><b>(품절)</b></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div
                :class="['mm_dropdown', {'S=on' : subOptionShow }]"
            >
                <h6><b>옵션2</b></h6>
                <button 
                    type="button" 
                    class="btn_dropdown"
                    :title="subOptionShow ? '펼쳐보기' : '접어두기'"
                    @click="() => { subOptionShow = !subOptionShow }"
                >
                    <b>{{ subOptionSelected ? selectedOption.subOptionName : '옵션명2' }}</b><i class="ico_dropdown T=bold" />
                </button>  
                <div
                    class="mm_dropdown-item"
                    :style="subOptionShow ? { height: 'auto'} : {}"
                >
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
                                <li v-for="subOption in currentSubOptions" :key="subOption.name">
                                    <button 
                                        v-if="subOption.isSelectAble" 
                                        type="button"
                                        class="btn_option"                                    
                                        @click="() => { selectedOption.subOptionName = selectedOption.subOptionName === subOption.name ? '' : subOption.name; handleSubOptionTypeSelect()}"
                                    >
                                        <b>{{ subOption.name }}</b>
                                        <b v-if="subOption.stock < 6 && optionSelected">({{ subOption.stock }}개)</b>
                                    </button>
                                    <span
                                        v-else
                                        class="mm_flex btn_option"
                                        title="품절"
                                    ><b>{{ subOption.name }}</b><b>(품절)</b></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <template v-if="isOptionUseOne">
                <section>
                    <h6><b>옵션</b></h6>
                    <ul>
                        <li v-for="subOption in currentSubOptions" :key="subOption.name ">
                            <button 
                                v-if="subOption.isSelectAble || selectedOption.optionName === ''" 
                                type="button"
                                :class="['btn_option', { 'S=option-select': selectedOption.code === subOption.id }]" 
                                @click="() => { selectedOption.subOptionName = selectedOption.subOptionName === subOption.name ? '' : subOption.name; handleSubOptionTypeButton() }"
                            >
                                <b>{{ subOption.name }}</b>
                            </button>
                            <span
                                v-else
                                class="btn_option"
                                title="품절"
                            ><b>{{ subOption.name }}</b><svg><line
                                x1="0"
                                y1="100%"
                                x2="100%"
                                y2="0"
                                stroke="#cdcdcd"
                                stroke-width="1"
                            /></svg></span>                        
                        </li>      
                    </ul>
                </section>
            </template>       
            <template v-else>
                <section :class="{'S=option-selected' : optionSelected }">
                    <h6><b>옵션1</b></h6>
                    <ul>
                        <li v-for="option in tempOptions" :key="option.name">
                            <button 
                                v-if="option.isSelectAble"
                                type="button" 
                                :class="['btn_option', { 'S=option-select': selectedOption.optionName === option.name }]"                            
                                @click="handleOptionTypeButton(option.name)"
                            >
                                <b>{{ option.name }}</b>
                            </button>
                            <span
                                v-else
                                class="btn_option"
                                title="품절"
                            >
                                <b>{{ option.name }}</b>
                                <svg>
                                    <line
                                        x1="0"
                                        y1="100%"
                                        x2="100%"
                                        y2="0"
                                        stroke="#cdcdcd"
                                        stroke-width="1"
                                    />
                                </svg>
                            </span>
                        </li>                    
                    </ul>
                </section>
                <section>
                    <h6><b>옵션2</b></h6>
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
                        <li v-for="subOption in currentSubOptions" :key="subOption.name ">
                            <button 
                                v-if="subOption.isSelectAble || selectedOption.optionName === ''" 
                                type="button"
                                :class="['btn_option', { 'S=option-select': selectedOption.subOptionName === subOption.name }]" 
                                @click="() => { selectedOption.subOptionName = selectedOption.subOptionName === subOption.name ? '' : subOption.name; handleSubOptionTypeButton(); }"
                            >
                                <b>{{ subOption.name }}</b>
                            </button>
                            <span
                                v-else
                                class="btn_option"
                                title="품절"
                            >
                                <b>{{ subOption.name }}</b>
                                <svg>
                                    <line
                                        x1="0"
                                        y1="100%"
                                        x2="100%"
                                        y2="0"
                                        stroke="#cdcdcd"
                                        stroke-width="1"
                                    />
                                </svg>
                            </span>                        
                        </li>                     
                    </ul>
                </section>
            </template>
        </template>
    </div>
    <!--// 옵션 목록 -->
    <!-- 수량선택 -->
    <div class="m_cart-option-quantity">
        <h6><b>수량선택</b></h6>
        <div class="mm_stepper">
            <div class="mm_form-text">
                <label>
                    <input
                        v-model="selectedOption.buyAmount" 
                        type="text"                         
                        class="textfield text_stepper"
                        data-text
                    >
                    <i class="bg_text" />
                    <span class="mm_ir-blind text_placeholder">수량</span>
                </label>
            </div>
            <button
                type="button"
                :disabled="selectedOption.buyAmount === 1"
                class="btn_stepper-subtract"
                @click="() => { selectedOption.buyAmount -= 1 }"
            >
                <i class="ico_stepper-subtract" /><b class="mm_ir-blind">수량 빼기</b>
            </button>
            <button
                type="button"
                :disabled="selectedOption.buyAmount >= selectedOption.stock"
                class="btn_stepper-add"
                @click="() => { selectedOption.buyAmount += 1 }"
            >
                <i class="ico_stepper-add" /><b class="mm_ir-blind">수량 더하기</b>
            </button>
        </div>
        <span
            v-if="selectedOption.stock < 6 && selectedOption.stock > 0"
            class="text_stock"
        >구매가능 수량 {{ selectedOption.stock }}개</span>
    </div>
    <!--// 수량선택 -->

    <!-- 하단버튼 -->
    <div class="mm_foot">
        <div class="mm_btn_box">
            <button 
                type="button" 
                class="mm_btn T=primary"
                :disabled="(selectedOption.optionName === '' || selectedOption.subOptionName === '') && !isSingleOption"
                @click="cartOptionsChange()" 
            >
                <b>변경</b>
            </button>
        </div>
    </div>
    <!--// 하단버튼 -->
</template>

<script setup lang="ts">
import { GoodsOptions, SelectAbleOption } from '$/@type/goods';
import { SelectedOption } from '$/@type/front';
import { toRefs, ref, computed } from 'vue'
import { mmon } from '$/helper/mmon';
import { CartPack } from '$/@type/shopping';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { defaultCatch } from '$/functions';

const props = withDefaults(defineProps<{
    options: GoodsOptions[],
    goodsPrice: number,
    selectedItem: CartPack,
}>(), {
    options: () => [],
    goodsPrice: 0,
});

const emit = defineEmits<{
    (e: 'reFetch'): void,
}>();

const { options, selectedItem } = toRefs(props);        
const optionShow = ref(false);
const subOptionShow = ref(false);           
// 단일 옵션 여부
const isSingleOption = options.value.length === 1  && options.value[0].subOptions.length === 1;

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
})


const allSubOptions = computed(() => {
    return [...new Set(options.value.flatMap((option) => option.subOptions).map(sub => sub.name))]
})

const selectedOption = ref<SelectedOption>({
    optionName: selectedItem.value.optionStock > 0 ? selectedItem.value.optionName.split('/')[0].trim() : '',
    code: selectedItem.value.optionId,
    stock: selectedItem.value.optionStock,
    subOptionName: selectedItem.value.optionStock > 0 ? selectedItem.value.optionName.split('/')[1].trim() : '',
    buyAmount: selectedItem.value.ea,
    optionPrice: 0,
    goodsPrice: 0
})

const optionSelected = computed(() => {
    return selectedOption.value.optionName !== '';
})

const subOptionSelected = computed(() => {
    return selectedOption.value.subOptionName !== '';
})

const nowSelectedSubOption = computed(() => {
    if (selectedOption.value.optionName === '' && !isOptionUseOne.value) {
        return undefined
    }
    return currentSubOptions.value.find(function (sub) {
        return sub.name === selectedOption.value.subOptionName
    })
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
    // 2번 옵션 관련 코드 설정
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
    // 2번 옵션 관련 코드 설정
    if ((optionSelected.value || isOptionUseOne.value) && nowSelectedSubOption.value !== undefined) {
        selectedOption.value.code = nowSelectedSubOption.value.id;
        selectedOption.value.stock = nowSelectedSubOption.value.stock;
        addOptions();
    }
}

function addOptions() {
    if (selectedOption.value.buyAmount > selectedOption.value.stock) {
        selectedOption.value.buyAmount = selectedOption.value.stock
    }
}        

async function cartOptionsChange() {      
    try {               
        await shoppingRepository.updateCartGoodsOption(
            selectedItem.value.cartId, 
            selectedOption.value.code, 
            selectedOption.value.buyAmount
        );
        mmon.bom.alert('옵션이 변경 되었습니다', () => {
            emit('reFetch');
        });
    } catch (e) {
        defaultCatch(e);
    }
}

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

const tempOptions = computed(() => {
    if (selectedOption.value.subOptionName === '') {
        return options.value;
    }

    if (isOptionUseSelectBox.value) {                
        return options.value;
    }

    return options.value.filter((option) => {
        const filteredSubOptions = option.subOptions.filter((subOption) => {
            if (subOption.name === selectedOption.value.subOptionName) {
                option.isSelectAble = subOption.stock < 1 ? false : true
                return subOption;
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
            return options.value.map((option) => {
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
</script>
