<template>
    <!-- 옵션 목록 -->
    <!--
        (D) 옵션1 또는 옵션2의 갯수가 6개 이하인 경우 버튼형 옵션을 사용하고, 7개 이상인 경우 셀렉트형 옵션을 사용합니다.
        (D) 모든 옵션은 옵션의 순서와 무관하게 우선 선택이 가능합니다(예: 옵션2부터 선택가능)
        (D) 옵션1, 2가 1개의 옵션만 있을 경우 별도의 옵션 선택 동작 없이 옵션이 선택된 상태로 노출되며, 수량 변경만 가능합니다.
        (D) 옵션1 혹은 옵션2만 등록한 단일옵션의 경우 1개의 옵션만 선택하게 됩니다. 이 때 옵션의 'h6' 요소는 옵션1 또는 옵션2의 명칭이 아닌 '옵션' 명칭을 사용합니다.
        (D) 셀렉트형 옵션인 경우 옵션선택 레이어 오픈 시 옵션1의 dropdown 요소에 'S=on' 클래스를 추가하여 옵션1을 바로 선택 가능하도록 합니다.
        (D) 옵션이 선택된 경우 'btn_option' 요소에 S=option-select 클래스와 '선택됨' 타이틀을 추가합니다.
    -->
    <div class="m_product-option-select">
        <template v-if="isOptionUseSelectBox">
            <!-- // 셀렉트 단일 옵션 -->
            <template v-if="isOptionUseOne">
                <section :class="['mm_dropdown', { 'S=on' : optionShow }]">
                    <h6 class="mm_strapline">
                        <b>옵션</b>
                    </h6>
                    <button 
                        type="button" 
                        class="btn_dropdown" 
                        :title="optionShow ? '펼쳐보기' : '접어두기'" 
                        @click="() => { optionShow = !optionShow; subOptionShow = false }"
                    >
                        <b>선택하세요</b><i class="ico_dropdown T=bold" />
                    </button>
                    <div class="mm_dropdown-item" :style="optionShow ? { height: 'auto'} : {}">
                        <div class="mm_dropdown-item-inner">
                            <div class="mm_scroller">
                                <ul>
                                    <li v-for="subOption in currentSubOptions" :key="`select_one_${subOption.name}`">
                                        <button 
                                            v-if="subOption.isSelectAble" 
                                            type="button"
                                            :class="['btn_option', { 'S=option-select': selectedOption.code === subOption.id }]" 
                                            @click="selectedOptionAdd(subOption.name)"
                                        >
                                            <b>{{ subOption.name }}</b>
                                        </button>
                                        <span v-else class="btn_option" title="품절"><b>{{ subOption.name }}</b></span>                        
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </template>
            <!-- 셀렉트 기본 -->
            <template v-else>
                <section 
                    class="mm_dropdown" 
                    :class="[{ 'S=option-selected' : optionSelected }, {'S=on' : optionShow }]"
                >
                    <h6 class="mm_strapline">
                        <b>옵션1</b>
                    </h6>
                    <button 
                        type="button" 
                        class="btn_dropdown" 
                        :title="optionShow ? '펼쳐보기' : '접어두기'" 
                        @click="() => { optionShow = !optionShow; subOptionShow = false }"
                    >
                        <b>{{ optionSelected ? selectedOption.optionName : '선택하세요' }}</b><i class="ico_dropdown T=bold" />
                    </button>
                    <div class="mm_dropdown-item" :style="optionShow ? { height: 'auto'} : {}">
                        <div class="mm_dropdown-item-inner">
                            <div class="mm_scroller">
                                <ul>
                                    <li v-for="option in tempOptions" :key="option.name">
                                        <button 
                                            v-if="option.isSelectAble || isRestock"
                                            type="button" 
                                            :class="['btn_option', { 'S=option-select': selectedOption.optionName === option.name }]"                            
                                            @click="() => { handleOptionTypeSelect(option.name); } "
                                        >
                                            <b>{{ option.name }}</b>
                                        </button>
                                        <span v-else class="btn_option" title="품절"><b>{{ option.name }}</b><b>(품절)</b></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <section 
                    class="mm_dropdown" 
                    :class="{'S=on' : subOptionShow }"                    
                >
                    <h6 class="mm_strapline">
                        <b>옵션2</b>
                    </h6>
                    <button 
                        type="button" 
                        class="btn_dropdown" 
                        :title="subOptionShow ? '펼쳐보기' : '접어두기'" 
                        @click="() => { subOptionShow = !subOptionShow }"
                    >
                        <b>{{ subOptionSelected ? selectedOption.subOptionName : '선택하세요' }}</b><i class="ico_dropdown T=bold" />
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
                                            v-if="subOption.isSelectAble || isRestock" 
                                            type="button"
                                            class="btn_option"                                    
                                            @click="() => { selectedOption.subOptionName = selectedOption.subOptionName === subOption.name ? '' : subOption.name; handleSubOptionTypeSelect()}"
                                        >
                                            <b>{{ subOption.name }}</b>
                                            <b v-if="subOption.stock < 6 && optionSelected && !isRestock">({{ subOption.stock }}개)</b>
                                        </button>
                                        <span v-else class="btn_option" title="품절"><b>{{ subOption.name }}</b><b>(품절)</b></span>
                                    </li>                                
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </template>
            <!--// 셀렉트 기본 -->
        </template>
        <template v-else>
            <template v-if="isOptionUseOne">
                <section>
                    <h6 class="mm_strapline">
                        <b>옵션</b>
                    </h6>
                    <ul>
                        <li v-for="subOption in currentSubOptions" :key="subOption.id">
                            <button
                                v-if="subOption.isSelectAble"
                                type="button"
                                :class="[
                                    'btn_option',
                                    {
                                        'S=option-select':
                                            selectedOption.code ===
                                            subOption.id,
                                    },
                                ]"
                                @click="
                                    () => {
                                        selectedOption.subOptionName =
                                            selectedOption.subOptionName ===
                                            subOption.name
                                                ? ''
                                                : subOption.name;
                                        handleSubOptionTypeButton();
                                    }
                                "
                            >
                                <b>{{ subOption.name }}</b>
                            </button>
                            <span v-else class="btn_option" title="품절">
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
            <template v-else>
                <section :class="{'S=option-selected' : optionSelected }">
                    <h6 class="mm_strapline">
                        <b>옵션1</b>
                    </h6>
                    <div class="mm_scroller T=x">
                        <ul>
                            <li v-for="option in tempOptions" :key="option.name">
                                <button
                                    v-if="option.isSelectAble"
                                    type="button"
                                    :class="[
                                        'btn_option',
                                        {
                                            'S=option-select':
                                                selectedOption.optionName ===
                                                option.name,
                                        },
                                    ]"
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
                                    :class="[
                                        'btn_option',
                                        {
                                            'S=option-select':
                                                selectedOption.subOptionName ===
                                                subOption,
                                        },
                                    ]"
                                    @click="
                                        () => {
                                            selectedOption.subOptionName =
                                                selectedOption.subOptionName ===
                                                subOption
                                                    ? ''
                                                    : subOption;
                                        }
                                    "
                                >
                                    <b>{{ subOption }}</b>
                                </button>
                            </li>
                        </ul>
                        <ul v-else>
                            <li v-for="subOption in currentSubOptions" :key="subOption.id">
                                <button
                                    v-if="
                                        subOption.isSelectAble ||
                                            selectedOption.optionName === ''
                                    "
                                    type="button"
                                    :class="[
                                        'btn_option',
                                        {
                                            'S=option-select':
                                                selectedOption.subOptionName ===
                                                subOption.name,
                                        },
                                    ]"
                                    @click="
                                        () => {
                                            selectedOption.subOptionName =
                                                selectedOption.subOptionName ===
                                                subOption.name
                                                    ? ''
                                                    : subOption.name;
                                            handleSubOptionTypeButton();
                                        }
                                    "
                                >
                                    <b>{{ subOption.name }}</b>
                                </button>
                                <span v-else class="btn_option" title="품절">
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
                    </div>
                </section>                
            </template>
        </template>
        <a v-if="isPartialSoldout && useRestockNotify" class="mm_btn T=2xs T=line btn_restock" href="#" @click.prevent="$emit('restockModalOpen')"><i class="ico_alarm" /><b>재입고 알림받기</b></a>
    </div>
    <!--// 옵션 목록 -->
</template>

<script setup lang="ts">
import { GoodsOptions, SelectAbleOption } from "$/@type/goods";
import { SelectedOption } from "$/@type/front";
import { toRefs, ref, computed,} from "vue";
import { mmon } from "$/helper/mmon";

const props = withDefaults(defineProps<{
    options: GoodsOptions[]
    goodsPrice: number
    selectedOptions: SelectedOption[]
    isRestock?: boolean
    isPartialSoldout?: boolean
    useRestockNotify?: boolean
}>(), {
    options: () => [],
    goodsPrice: 0,
    selectedOptions: () => [],
    isRestock: false,
    isPartialSoldout: false,
    useRestockNotify: false,
})

const emit = defineEmits(['restockModalOpen', 'add:options'])

/** VARIABLE */
const { options, selectedOptions, goodsPrice, isRestock, isPartialSoldout } = toRefs(props);
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
});

const allSubOptions = computed(() => {
    const tempArray: string[] = [];
    options.value.filter(function (option) {
        option.subOptions.filter(function (subOption) {
            tempArray.push(subOption.name);
        });
    });
    return [...new Set(tempArray)];
});

const selectedOption = ref<SelectedOption>({
    optionName: "",
    code: 0,
    stock: 0,
    subOptionName: "",
    buyAmount: 1,
    optionPrice: 0,
    goodsPrice: 0,
});

const optionSelected = computed(() => {
    return selectedOption.value.optionName !== "";
});

const subOptionSelected = computed(() => {
    return selectedOption.value.subOptionName !== "";
});

const nowSelectedSubOption = computed(() => {
    if (
        selectedOption.value.optionName === "" 
        &&!isOptionUseOne.value
    ) {
        return undefined;
    }

    return currentSubOptions.value.find(function (sub) {
        return sub.name === selectedOption.value.subOptionName;
    });
});

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
 * 버튼형 옵션2 선택시 실행 함수
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
    // 옵션1 선택 처리
    selectedOption.value.optionName =
        selectedOption.value.optionName === optionName
            ? ""
            : optionName;
    // 옵션 2 선택된 경우 선택된 옵션 추가 처리
    if (subOptionSelected.value) {
        handleSubOptionTypeButton();
        addOptions();
    }
}
/**
 * 버튼형 옵션2 선택시 실행 함수
 */
function handleSubOptionTypeButton() {
    // 2번 옵션 관련 코드 설정
    if (
        (optionSelected.value || isOptionUseOne.value) 
        &&nowSelectedSubOption.value !== undefined
    ) {
        selectedOption.value.code = nowSelectedSubOption.value.id;
        selectedOption.value.stock = nowSelectedSubOption.value.stock;
        addOptions();
    }
}

function addOptions() {
    if (
        selectedOption.value.code !== 0 
        && selectedOption.value.subOptionName !== "" 
        && (isOptionUseOne.value || selectedOption.value.optionName !== "")
    ) {
        const isExist = selectedOptions.value.find((option: SelectedOption) => {
            return option.code === selectedOption.value.code;
        });

        if (isExist) {
            resetSelectedOption();
            return mmon.bom.alert("이미 선택된 옵션입니다");
        }

        selectedOption.value.goodsPrice = goodsPrice.value;
        emit("add:options", selectedOption.value, isOptionUseSelectBox.value);

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
        optionName: "",
        code: 0,
        stock: 0,
        subOptionName: "",
        buyAmount: 1,
        optionPrice: 0,
        goodsPrice: 0,
    };
}

const isOptionUseOne = computed(() => {
    if (options.value.length < 1) {
        return false;
    }
    // '여기를 '-' 으로 변경 FREE 에서'
    if (
        (options.value.length === 1 && options.value[0].name === "-") 
        || (allSubOptions.value.length === 1 && allSubOptions.value[0] === "-")
    ) {
        return true;
    }

    return false;
});

const tempOptions = computed(() => {
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
});

const currentSubOptions = computed<SelectAbleOption[]>(() => {
    if (isOptionUseOne.value) {
        if (options.value.length === 1) {
            return options.value.map(function (option) {
                return option.subOptions[0];
            });
        } else {
            return options.value.map(function (option) {
                return {
                    name: option.name,
                    id: option.subOptions[0].id,
                    stock: option.subOptions[0].stock,
                    isSelectAble: option.subOptions[0].stock < 1 ? false : true,
                    price: 0,
                };
            });
        }
    }

    return (
        options.value.find(function (option) {
            if (selectedOption.value.optionName === "") {
                return option.subOptions;
            } 
            return option.name === selectedOption.value.optionName;
        })?.subOptions || []
    );
});
</script>
