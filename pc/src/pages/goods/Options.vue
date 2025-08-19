<template>
    <div :class="['m_product-option-select', { 'T=select-button' : !isOptionUseSelectBox }]">
        <template v-if="isOptionUseSelectBox">
            <!-- 셀렉트 단일 옵션 -->
            <template v-if="isOptionUseOne">
                <div
                    class="mm_dropdown"
                    :class="[{'S=on' : optionShow }]" 
                >
                    <h6><b>옵션1</b></h6>
                    <!-- (D) 옵션을 선택하면 'btn_dropdown > b' 요소의 텍스트를 "옵션명" 에서 선택한 옵션명으로 변경합니다 -->
                    <button 
                        type="button" 
                        class="btn_dropdown"
                        :title="optionShow ? '펼쳐보기' : '접어두기'" 
                        @click="() => { optionShow = !optionShow }"
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
                                    <li
                                        v-for="subOption in currentSubOptions"
                                        :key="`select_one_${subOption.name}`"
                                    >
                                        <button 
                                            v-if="subOption.isSelectAble || isRestock"
                                            type="button" 
                                            :class="['btn_option', { 'S=option-select': selectedOption.code === subOption.id }]"
                                            @click="selectedOptionAdd(subOption.name)"
                                        >
                                            <b>{{ subOption.name }}</b>
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
            <!-- 셀렉트 옵션 2개 -->
            <template v-else>
                <div
                    :class="[
                        'mm_dropdown', 
                        { 'S=option-selected' : optionSelected }, 
                        {'S=on' : optionShow }
                    ]"
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
                                    <li v-for="option in filteredDepth1Options" :key="option.name">
                                        <button 
                                            v-if="option.isSelectAble || isRestock"
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
                                    <li v-for="subOption in currentSubOptions" :key="subOption.id">
                                        <button 
                                            v-if="subOption.isSelectAble || isRestock" 
                                            type="button"
                                            class="btn_option"                                    
                                            @click="() => { selectedOption.subOptionName = selectedOption.subOptionName === subOption.name ? '' : subOption.name; handleSubOptionTypeSelect()}"
                                        >
                                            <b>{{ subOption.name }}</b>
                                            <b v-if="subOption.stock < 6 && optionSelected && !isRestock">({{ subOption.stock }}개)</b>
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
        </template>
        <template v-else>
            <template v-if="isOptionUseOne">
                <section>
                    <h6><b>옵션</b></h6>
                    <ul>
                        <li v-for="subOption in currentSubOptions" :key="subOption.id">
                            <button 
                                v-if="subOption.isSelectAble" 
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
                        <li v-for="option in filteredDepth1Options" :key="option.name">
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
                            ><b>{{ option.name }}</b><svg><line
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
                        <li v-for="subOption in currentSubOptions" :key="subOption.id">
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
</template>

<script setup lang="ts">
import { GoodsOptions, SelectAbleOption } from '$/@type/goods';
import { SelectedOption } from '$/@type/front';
import { toRefs, ref, computed } from 'vue'
import { mmon } from '$/helper/mmon';

const props = defineProps<{
    options: GoodsOptions[],
    goodsPrice: number,
    selectedOptions: SelectedOption[],
    isRestock?: boolean,
}>();

const emit = defineEmits<{
    (e: 'add:options', selectedOption: SelectedOption): void
}>();

const { options, selectedOptions, goodsPrice, isRestock } = toRefs(props);
const optionShow = ref(false);
const subOptionShow = ref(false);        

const isOptionUseSelectBox = computed(() => {
    if (options.value.length > 6 || isRestock.value) {
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
    const tempArray: string[] = [];
    options.value.filter(function (option) {
        option.subOptions.filter(function (subOption) {
            tempArray.push(subOption.name);
        });
    })         
    return [...new Set(tempArray)];
})

const selectedOption = ref<SelectedOption>({
    optionName: '',
    code: 0,
    stock: 0,
    subOptionName: '',
    buyAmount: 1,
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

    selectedOption.value.optionName = selectedOption.value.optionName === optionName ? '' : optionName;
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
    * 버튼형 옵션2 선택시 실행 함수 
    * @param subOption 
    */
function handleSubOptionTypeSelect() {
    if (optionSelected.value === false || nowSelectedSubOption.value === undefined) {
        return;
    }
    // 2번 옵션 관련 코드 설정
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
    if (selectedOption.value.code !== 0 && selectedOption.value.subOptionName !== '' && (isOptionUseOne.value || selectedOption.value.optionName !== '')) {
        const isExist = selectedOptions.value.find(function (option: SelectedOption) {                    
            return option.code === selectedOption.value.code
        });
        
        if (isExist) {
            resetSelectedOption();
            return mmon.bom.alert('이미 선택된 옵션입니다');                     
        }
        
        selectedOption.value.goodsPrice = goodsPrice.value;
        emit('add:options', selectedOption.value);
        if (!isRestock.value) {
            resetSelectedOption();
        }
    }
}

function selectedOptionAdd(optionName: string) {
    optionShow.value = false; 
    selectedOption.value.subOptionName = selectedOption.value.subOptionName === optionName
        ? '' 
        :  optionName; 
    handleSubOptionTypeButton()
}

/**
    * 선택된 옵션 초기화 처리
    */
function resetSelectedOption() {
    selectedOption.value = {
        optionName : '',
        code: 0,
        stock: 0,
        subOptionName: '',
        buyAmount: 1,
        optionPrice: 0,
        goodsPrice: 0
    };
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
                    price: option.subOptions[0].price
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
