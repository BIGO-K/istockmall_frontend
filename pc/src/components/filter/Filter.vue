<template>
    <!--
        (D) 각 필터검색 항목 선택시 "선택된 필터 목록(mm_filter-selected)"에 추가 합니다.
        가격 영역의 가격 범위값 입력시 가격 입력 후 적용하기 버튼을 눌렀을 때만 선택된 필터 목록(mm_filter-selected)에 추가합니다.
        소카테고리 선택 시 소카테고리 내 모든 항목을 선택할 경우 선택된 필터 목록(mm_filter-selected)에는 이전에 선택한 소카테고리는 모두 삭제되고
        소카테고리 전체(ex. 원피스 전체, 신발 전체, 쥬얼리 전체)만 노출합니다.
    -->
    <div class="mm_filter">
        <div
            :class="['mm_dropdown', { 'S=on': filterOn} ]"
            data-dropdown
        >
            <button 
                type="button" 
                class="btn_dropdown" 
                title="펼쳐보기"
                @click="() => { filterOn = !filterOn }"
            >
                <i class="ico_filter" /><b>필터검색</b><i class="ico_dropdown T=sm" />
            </button>
            <div
                class="mm_dropdown-item"
                :style="filterOn ? { height: 'auto'} : {}"
            >
                <div class="mm_dropdown-item-inner">
                    <!-- 카테고리 -->
                    <section
                        v-if="categories.length > 0"
                        class="mm_filter-category"
                    >
                        <h5><span>아이템</span></h5>
                        <div class="mm_filter-category-main">
                            <ul>
                                <li
                                    v-for="category in categories"
                                    :key="category.code"
                                >
                                    <button 
                                        type="button" 
                                        :class="['btn_category', { 'S=category-on' : selectedDepth1Category?.code === category.code }]" 
                                        :title="selectedDepth1Category?.code === category.code ? '선택됨' : ''" 
                                        @click="depth1CategoryChange(category)"
                                    >
                                        <b>{{ category.name }}</b>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <!-- (D) 대카테고리 선택시 중카테고리 .mm_filter-category-main 요소에 S=category-on 클래스를 추가합니다. -->
                        <div :class="['mm_filter-category-main', { 'S=category-on' : selectedDepth1Category !== null } ]">
                            <ul v-if="selectedDepth1Category">
                                <li
                                    v-for="depth2Category in selectedDepth1Category.childCategoryList"
                                    :key="depth2Category.code"
                                >
                                    <button 
                                        type="button" 
                                        :class="['btn_category', { 'S=category-on' : selectedDepth2Category?.code === depth2Category.code }]" 
                                        :title="selectedDepth2Category?.code === depth2Category.code ? '선택됨' : ''" 
                                        @click="() => { selectedDepth2Category = depth2Category, initializeSelectedCategory(depth2Category) }"
                                    >
                                        <b>{{ depth2Category.name }}</b>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <!-- (D) 중카테고리 선택시 .mm_filter-category-sub 요소에 S=category-on 클래스를 추가합니다. -->
                        <div :class="['mm_filter-category-sub', { 'S=category-on' : selectedDepth2Category !== null }]">
                            <div class="mm_filter-list">
                                <div class="mm_scroller">
                                    <ul>  
                                        <template v-if="selectedDepth2Category && tempSelectedCategories[selectedDepth2Category.code]">
                                            <li>
                                                <label class="mm_form-check">
                                                    <input 
                                                        type="checkbox"
                                                        :checked="hasAllChildCategory(selectedDepth2Category.code)"
                                                        @click="depth3CategorySelectAll"
                                                    >
                                                    <b class="mm_block">
                                                        <span class="text_label">전체</span>
                                                    </b>
                                                </label>
                                            </li>
                                            <li
                                                v-for="depth3Category in selectedDepth2Category.childCategoryList || []"
                                                :key="depth3Category.code"
                                            >
                                                <label class="mm_form-check">
                                                    <input 
                                                        v-model="tempSelectedCategories[selectedDepth2Category.code].selectedDepth3Codes" 
                                                        type="checkbox"
                                                        :value="{
                                                            label: depth3Category.fullPath,
                                                            code: depth3Category.code
                                                        }"                                                        
                                                    >
                                                    <b class="mm_block">
                                                        <span class="text_label">{{ depth3Category.name }}</span>
                                                        <small>{{ depth3Category.goodsCount }}</small>
                                                    </b>
                                                </label>
                                            </li>
                                        </template>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                    <!--// 카테고리 -->
                    <!-- 브랜드 -->
                    <section
                        v-if="brands.length > 0"
                        class="mm_filter-brand"
                    >
                        <h5><b>브랜드</b></h5>
                        <div class="mm_filter-brand-search">
                            <MMInput 
                                v-model="searchBrandText"
                                :place-holder-text="'브랜드를 검색하세요'"
                                @keyup.enter="selectedBrandInitials = ''"
                            >
                                <template #extraButton>
                                    <button 
                                        type="button" 
                                        class="btn_search"
                                        @click="selectedBrandInitials = ''"
                                    >
                                        <i class="ico_search T=sm" /><b class="mm_ir-blind">검색하기</b>
                                    </button>    
                                </template>
                            </MMInput>
                            <!--
                                (D) 페이지 로드시 정렬버튼(ㄱ, ㄴ, ㄷ...)에 T=filter-on 클래스가 있는경우 해당 키워드의 브랜드 목록이 기본값으로 노출합니다.
                                브랜드 목록 정렬버튼 (ㄱ, ㄴ, ㄷ...) 클릭시 'T=filter-on' 클래스와 '선택됨' 타이틀을 추가합니다
                            -->
                            <ul>
                                <li
                                    v-for="initial in brandInitials"
                                    :key="initial"
                                >
                                    <button 
                                        type="button" 
                                        :class="{ 'T=filter-on' : selectedBrandInitials === initial }"
                                        data-filter="{ '_keyword': 'ㄱ' }" 
                                        @click="() => { selectedBrandInitials = initial }"
                                    >
                                        <b>{{ initial }}</b>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <!-- 필터 브랜드 목록 -->
                        <div class="mm_filter-list">
                            <div class="mm_scroller">
                                <!-- 브랜드 목록 -->
                                <!-- (D) 브랜드 정렬 버튼 클릭에 따라 키워드 매칭되는 브랜드의 li요소에 .T=filter-on 클래스를 추가합니다. -->
                                <ul v-if="initialsFilterBrands.length > 0">
                                    <li
                                        v-for="brand in initialsFilterBrands"
                                        :key="brand.id"
                                        class="T=filter-on"
                                    >
                                        <label
                                            class="mm_form-check"                                            
                                        >
                                            <input
                                                v-model="selectedFilters.brandIds" 
                                                type="checkbox"      
                                                :value="brand.id"
                                                data-check                                                
                                            >
                                            <b class="mm_block">
                                                <span class="text_label">{{ brand.name }}</span>
                                                <small>{{ MMFilters.formatNumber(brand.goodsCount) }}</small>
                                            </b>
                                        </label>
                                    </li>
                                </ul>
                                <!-- (D) 정렬 키워드에 속한 브랜드가 없는 경우 아래 .mm_text-none 요소가 노출됩니다.  -->
                                <p v-else class="mm_text-none T=sm">
                                    <i class="ico_text-none" />브랜드가 없습니다
                                </p>
                            </div>
                        </div>
                        <!--// 필터 브랜드 목록 -->
                    </section>
                    <!-- 가격 -->
                    <section>
                        <h5><b>가격</b></h5>
                        <div class="mm_filter-list">
                            <ul>
                                <li v-for="priceFilter in priceFilters" :key="priceFilter.label">
                                    <label class="mm_form-check">
                                        <input                                             
                                            v-model="selectedPrices" 
                                            name="priceFilter"
                                            type="checkbox" 
                                            :value="priceFilter"
                                            data-check                                            
                                        >
                                        <b class="mm_block">
                                            <span class="text_label">{{ priceFilter.label }}</span>
                                        </b>
                                    </label>
                                </li>                               
                            </ul>
                        </div>
                        <div class="mm_filter-range">
                            <MMInput 
                                v-model="minPriceText"
                                :data-type="'number'"
                                :place-holder-text="'최저금액'"
                            />
                            <span class="text_tilde">~</span>
                            <MMInput 
                                v-model="maxPriceText"
                                :data-type="'number'"
                                :place-holder-text="'최대금액'"
                            />
                            <button
                                type="button"
                                class="mm_btn T=square T=line T=lighter btn_price-apply"
                                @click="applyCustomPriceFilter()"
                            >
                                <b>적용</b>
                            </button>
                        </div>
                    </section>
                    <!--// 가격 -->
                    <!-- 별점 -->
                    <section class="mm_filter-star">
                        <h5><b>별점</b></h5>
                        <div class="mm_filter-list">
                            <ul>
                                <li v-for="rate in reviewRates" :key="rate">
                                    <label class="mm_form-check">
                                        <input
                                            v-model="selectedFilters.reviewRates"
                                            type="checkbox"
                                            :value="rate" 
                                            data-check
                                        >
                                        <b class="mm_block">
                                            <i class="ico_star" />
                                            <span class="text_label">{{ `${rate}.0` }}</span>
                                        </b>
                                    </label>
                                </li>                               
                            </ul>
                        </div>
                    </section>
                    <!--// 별점 -->
                    <!-- 혜택 -->
                    <section>
                        <h5><b>혜택</b></h5>
                        <div class="mm_filter-list">
                            <ul>
                                <li>
                                    <label class="mm_form-check">
                                        <input
                                            v-model="selectedFilters.onlyFreeDelivery"
                                            type="checkbox"
                                            data-check                                            
                                        >
                                        <b class="mm_block">
                                            <span class="text_label">무료배송</span>
                                        </b>
                                    </label>
                                </li>
                                <li>
                                    <label class="mm_form-check">
                                        <input
                                            v-model="selectedFilters.onlySale"
                                            type="checkbox"
                                            data-check
                                        >
                                        <b class="mm_block">
                                            <span class="text_label">할인상품</span>
                                        </b>
                                    </label>
                                </li>
                                <li>
                                    <label class="mm_form-check">
                                        <input
                                            v-model="selectedFilters.exceptSoldout"
                                            type="checkbox"
                                            data-check
                                        >
                                        <b class="mm_block">
                                            <span class="text_label">품절제외</span>
                                        </b>
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </section>
                    <!--// 혜택 -->
                    <!-- FIT -->
                    <section v-if="fitSizes.length > 0">
                        <h5><b>FIT</b></h5>
                        <div class="mm_filter-list">
                            <ul>
                                <li
                                    v-for="fit in fitSizes"
                                    :key="fit.id"
                                >
                                    <label class="mm_form-check">
                                        <input 
                                            v-model="selectedFilters.fitIds" 
                                            type="checkbox" 
                                            :value="fit.id" 
                                            data-check                                            
                                        >
                                        <b class="mm_block">
                                            <span class="text_label">{{ fit.label }}</span>
                                        </b>
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </section>
                    <!--/FIT -->
                    <!-- 슈즈 -->
                    <section v-if="shoesSizes.length > 0">
                        <h5><b>슈즈</b></h5>
                        <div class="mm_filter-list">
                            <ul>
                                <li
                                    v-for="shoes in shoesSizes"
                                    :key="shoes.id"
                                >
                                    <label class="mm_form-check">
                                        <input 
                                            v-model="selectedFilters.shoesSizeIds" 
                                            type="checkbox" 
                                            :value="shoes.id" 
                                            data-check
                                        >
                                        <b class="mm_block">
                                            <span class="text_label">{{ shoes.label }}</span>
                                        </b>
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </section>
                    <!--// 슈즈 -->
                    <!-- 색상 -->
                    <section
                        v-if="colors.length > 0"
                        class="mm_filter-color"
                    >
                        <h5><b>색상</b></h5>
                        <div class="mm_filter-list">
                            <ul>
                                <li
                                    v-for="color in colors"
                                    :key="color.code"
                                >
                                    <label class="mm_form-check">
                                        <input 
                                            v-model="selectedFilters.colorIds" 
                                            type="checkbox" 
                                            :value="color.id"
                                            data-check
                                        >
                                        <b class="mm_block">
                                            <i
                                                class="ico_check-color"
                                                :style="`background-color: ${color.code};`"
                                            />
                                            <span class="text_label">{{ color.label }}</span>
                                        </b>
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </section>
                    <!--// 색상 -->
                    <!-- 하단버튼 -->
                    <div class="mm_btn_box">
                        <button
                            type="button"
                            class="btn_reset"
                            @click="resetAllSelectedFilter"
                        >
                            <i class="ico_refresh" /><b>새로고침</b>
                        </button>
                        <button
                            type="button"
                            class="mm_btn T=primary"
                            @click="applyFilter()"
                        >
                            <b>적용하기</b>
                        </button>                        
                    </div>
                    <!--// 하단버튼 -->
                </div>
            </div>
        </div>
        <!-- 선택된 필터 목록 -->
        <div class="mm_filter-selected">
            <ul>
                <li 
                    v-for="selectedFilter in selectedFilterTags" 
                    :key="selectedFilter.key"
                >
                    <div class="mm_filter-selected-item">
                        <p
                            v-if="selectedFilter.type === 'reviewRate'"
                            class="text_label"
                        >
                            <i class="ico_star" /><span>{{ selectedFilter.label }}</span>
                        </p>
                        <span
                            v-else
                            class="text_label"
                        >{{ selectedFilter.label }}</span>
                        <button
                            type="button"
                            class="btn_filter-remove"
                            @click="removeSelectedLabel(selectedFilter.type, selectedFilter.value, selectedFilter.key)"
                        >
                            <!--  -->
                            <i class="ico_filter-remove" /><b class="mm_ir-blind">삭제</b>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    <!--// 선택된 필터 목록 -->
    </div>
</template>

<script setup lang='ts'>
import { 
    FilterBrand, 
    FilterCategory, 
    ChildFilterCategory, 
    CommonGoodsFilter, 
    FilterFit, 
    FilterShoesSize, 
    FilterColor, 
    Tag
} from '$/@type/searchFilter';
import { ref, toRefs, computed, watch } from 'vue';
import * as MMFilters from '$/filters';
import { useBrandFilter, useFilterHandler } from '$/composables/goods/filterComposable';

const props = defineProps<{
    categories: FilterCategory[],
    brands: FilterBrand[],
    fitSizes: FilterFit[],
    shoesSizes: FilterShoesSize[],
    colors: FilterColor[],
    searchForm: CommonGoodsFilter
}>();

const emit = defineEmits<{
    (e: 'applyFilter', filtersForm: CommonGoodsFilter): void
}>();

const { 
    categories,
    brands, 
    fitSizes,
    shoesSizes,
    colors,
    searchForm
} = toRefs(props);      

const { 
    searchBrandText,
    selectedBrandInitials,
    brandInitials,
    initialsFilterBrands,
} = useBrandFilter(brands)

const {
    tempSelectedCategories,   
    selectedPrices,
    reviewRates,
    priceFilters,
    customPriceLabel,
    selectedFilters,
    minPriceText,
    maxPriceText,
    // func
    removeSelectedLabel,
    resetAllFilter,    
    applyCustomPriceFilter
} = useFilterHandler(searchForm.value);


/**
 * 선택된 항목 처리  
*/
watch(categories, (to , from) => {
    if (categories.value.length > 0) {
        selectedDepth1Category.value = categories.value[0]
    }

    if (to !== from 
        && to.length > 0
        && selectedFilters.value.categoryCodes.length > 0
    ) {
        selectedDepth1Category.value = null;
        selectedDepth2Category.value = null;
        tempSelectedCategories.value = {};
        selectedFilters.value.categoryCodes.forEach((categoryCode) => {
            categories.value.find((cate1) => {
                cate1.childCategoryList.find((cate2) => {
                    if (cate2.code === categoryCode)  {        
                        return initializeSelectedCategory(cate2, true); 
                    }

                    cate2.childCategoryList?.find((cate3) => {                    
                        if (cate3.code === categoryCode) {
                            return updateSelectedCategories(cate2, cate3)
                        }
                    })
                })
            })        
        })
    }
})

const selectedCategories = computed<{
    label: string;
    value: string;
    key: string;
}[]>(() => {
    const keys = Object.keys(tempSelectedCategories.value);
    if (keys.length < 1) {
        return []
    }

    let selectedCategory = [];
    for (const depth2Code in tempSelectedCategories.value) {
        const cate = tempSelectedCategories.value[depth2Code];
        if (hasAllChildCategory(depth2Code)) {
            selectedCategory.push({
                label: cate.label,
                value: cate.code,
                key: cate.code
            })
        } else {
            cate.selectedDepth3Codes.forEach((depth3) => {
                selectedCategory.push({
                    label: depth3.label,
                    value: `${depth3.code}`,
                    key: `${cate.code}`
                })
            })
        }        
    }
    return selectedCategory;
})

const selectedBrands = computed(() => {
    if (selectedFilters.value.brandIds.length < 1) {
        return []
    }

    return brands.value.filter((brand) => {
        return selectedFilters.value.brandIds.includes(brand.id);
    })
});

const selectedFits = computed(() => {
    if (selectedFilters.value.fitIds.length < 1) {
        return []
    }

    return fitSizes.value.filter((fit) => {
        return selectedFilters.value.fitIds.includes(fit.id);
    })
});

const selectedShoes = computed(() => {
    if (selectedFilters.value.shoesSizeIds.length < 1) {
        return []
    }

    return shoesSizes.value.filter((shoes) => {
        return selectedFilters.value.shoesSizeIds.includes(shoes.id);
    })
});

const selectedColors = computed(() => {
    if (selectedFilters.value.colorIds.length < 1) {
        return []
    }

    return colors.value.filter((color) => {
        return selectedFilters.value.colorIds.includes(color.id);
    })
})

/**
 * 선택된 태그 처리  
*/
const selectedCategoriesTags = computed(() => {
    return selectedCategories.value.map((selectedCategory) => {
        return {
            label: selectedCategory.label,
            type: 'categories',
            value: selectedCategory.value,
            key: selectedCategory.key
        }
    })
})

const selectedBrandsTags = computed(() => {
    return selectedBrands.value.map((brand) => {
        return {
            label: brand.name,
            type: 'brand',
            value: `${brand.id}`,
            key: `${brand.id}`
        }
    }).reverse();
})

const selectedReviewRateTags = computed(() => {
    return selectedFilters.value.reviewRates.map((reviewRate) => {
        return {
            label:  `${reviewRate}점`,
            type: 'reviewRate',
            value: `${ reviewRate }`,
            key: `${ reviewRate}점`,
        }
    }).reverse();
})

const selectedPriceTags = computed(() => {
    if (customPriceLabel.value !== '') {
        return [
            {
                label: `${ customPriceLabel.value }`,
                type: 'price',
                value: `${ customPriceLabel.value }`,
                key: `${ customPriceLabel.value }`
            }
        ]
    }
    if (selectedPrices.value.length > 0) {
        return selectedPrices.value.map((price) => {
            return {
                label: price.label,
                type: 'price',
                value: price.label,
                key: price.label
            }
        });
    }

    return []
})

const selectedFitTags = computed(() => {
    return selectedFits.value.map((fit) => {
        return {
            label:  `${fit.label}`,
            type: 'fit',
            value: `${ fit.id }`,
            key: `fit_${ fit.id }`,
        }
    }).reverse()
})

const selectedShoesTags = computed(() => {
    return selectedShoes.value.map((shoes) => {
        return {
            label:  `${shoes.label}`,
            type: 'shoes',
            value: `${ shoes.id }`,
            key: `shoes${ shoes.id }`,
        }
    }).reverse();
})

const selectedColorTags = computed(() => {
    return selectedColors.value.map((color) => {
        return {
            label:  `${color.label}`,
            type: 'color',
            value: `${ color.id }`,
            key: `color${ color.id }`,
        }
    }).reverse();
})    

const selectedFilterTags = computed(() => {
    const base = ref<Tag[]>([]);

    if (selectedFilters.value.onlyFreeDelivery) {
        base.value = base.value.concat({
            label: '무료배송',
            type: 'free_delivery',
            value: 'free_delivery',
            key: 'free_delivery'
        })
    }
    if (selectedFilters.value.onlySale) {
        base.value = base.value.concat({
            label: '할인상품',
            type: 'sale',
            value: 'sale',
            key: 'sale'
        })
    }

    if (selectedFilters.value.exceptSoldout) {
        base.value = base.value.concat({
            label: '품절제외',
            type: 'except_sold_out',
            value: 'except_sold_out',
            key: 'except_sold_out'
        })
    }

    return base.value
        .concat(selectedCategoriesTags.value)
        .concat(selectedBrandsTags.value)
        .concat(selectedPriceTags.value)
        .concat(selectedReviewRateTags.value)
        .concat(selectedFitTags.value)
        .concat(selectedShoesTags.value)
        .concat(selectedColorTags.value)
})
/**
 * 태그 처리 END 
*/

/** VARIABLE */
const filterOn = ref(false);
const selectedDepth1Category = ref<FilterCategory|null>(null);
const selectedDepth2Category = ref<ChildFilterCategory|null>(null);

/** FUNCTION */
async function applyFilter() {
    selectedFilters.value.categoryCodes = [];
    selectedFilters.value.categoryCodes = selectedFilters.value.categoryCodes.concat(
        selectedCategories.value.map(selectedCategory => selectedCategory.value)
    )

    if (selectedPrices.value.length > 0) {
        selectedFilters.value.minPrice = selectedPrices.value[0].min;
        selectedFilters.value.maxPrice = selectedPrices.value[0].max;
    }
    emit('applyFilter', selectedFilters.value)
}

/**
 * 1뎁스 카테고리 처리 
 */
function depth1CategoryChange(depth1Category: FilterCategory) {
    selectedDepth1Category.value = depth1Category;
    selectedDepth2Category.value = null;
}


function initializeSelectedCategory(depth2Category: ChildFilterCategory, isChildAll?: boolean) {
    if (tempSelectedCategories.value[depth2Category.code]) {
        return;
    }

    tempSelectedCategories.value[depth2Category.code] = {
        code: depth2Category.code,
        label: `${depth2Category.fullPath} > 전체`,
        childCount: depth2Category.childCategoryList?.length || 0,
        selectedDepth3Codes: isChildAll ? (depth2Category.childCategoryList?.map((depth3) => {
            return {
                label: depth3.fullPath,
                code: depth3.code
            }
        }) || []) : []
    }
}

/**
 * 선택된 카테고리 처리 
 * @param depth2Category 
 * @param depth3Category 
 */
function updateSelectedCategories(depth2Category: ChildFilterCategory, depth3Category: ChildFilterCategory) {
    initializeSelectedCategory(depth2Category);
    tempSelectedCategories.value[depth2Category.code].selectedDepth3Codes = tempSelectedCategories.value[depth2Category.code].selectedDepth3Codes
        .filter((depth3) => {
            return depth3.code !== depth3Category.code
        })
        .concat({
            label: depth3Category.fullPath,
            code: depth3Category.code
        })
}

/**
 * 3뎁스 카테고리 전체 선택 함수 
*/
function depth3CategorySelectAll() {
    if (!selectedDepth2Category.value) {
        return 
    }    

    if (hasAllChildCategory(selectedDepth2Category.value.code)) {
        return tempSelectedCategories.value[selectedDepth2Category.value.code].selectedDepth3Codes = [];
    }

    tempSelectedCategories.value[selectedDepth2Category.value.code].selectedDepth3Codes = selectedDepth2Category.value.childCategoryList?.map((depth3) => {
        return {
            label: depth3.fullPath,
            code: depth3.code
        }
    }) || []
}

/**
 * 선택된 필터 리셋 처리  
*/
function resetAllSelectedFilter() {
    resetAllFilter();
    // 카테고리 있는 경우 
    // 카테고리 초기화 처리 후 기본값 생성 처리!
    if (categories.value.length > 0 && selectedDepth2Category.value) {
        initializeSelectedCategory(selectedDepth2Category.value)
    }
    applyFilter();
}

/**
 * 자식카테고리가 전체 있는지 확인
 * @param {string} categoryCode : 카테고리 코드
*/
function hasAllChildCategory(categoryCode: string) {
    if (!tempSelectedCategories.value[categoryCode]) {
        return false
    }

    return tempSelectedCategories.value[categoryCode].childCount === tempSelectedCategories.value[categoryCode].selectedDepth3Codes.length
}
/** VUE LIFE CYCLE */
</script>