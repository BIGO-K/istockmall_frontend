<template>
    <div v-if="show" class="mm_filter-head">
        <h2><b>필터</b></h2>
        <button type="button" class="btn_filter-close" @click="closeFilter">
            <b class="mm_ir-blind">필터 닫기</b><i class="ico_filter-close" />
        </button>
    </div>
    <div v-if="show" class="mm_filter-content">
        <div class="mm_filter-content-inner">
            <!-- 필터상단 -->
            <div class="mm_filter-unit">
                <div class="mm_scroller T=x">
                    <div class="mm_btn_box">
                        <div class="mm_inline">
                            <!-- (D) 선택한 버튼에 'S=btn-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                            <button 
                                type="button" 
                                :class="['mm_btn T=sm T=line', { 'S=btn-on' : onlyFreeDelivery }]"
                                :title="onlyFreeDelivery ? '선택됨' : ''"
                                @click="() => { onlyFreeDelivery = !onlyFreeDelivery}"
                            >
                                <b>무료배송</b>
                            </button>
                            <button 
                                type="button" 
                                :class="['mm_btn T=sm T=line', { 'S=btn-on' : onlySale }]"
                                :title="onlySale ? '선택됨' : ''"
                                @click="() => { onlySale = !onlySale}"
                            >
                                <b>할인상품</b>
                            </button>
                            <button 
                                type="button" 
                                :class="['mm_btn T=sm T=line', { 'S=btn-on' : exceptSoldout }]"
                                :title="exceptSoldout ? '선택됨' : ''"
                                @click="() => { exceptSoldout = !exceptSoldout}"
                            >
                                <b>품절제외</b>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!--// 필터상단 -->

            <!-- 필터영역 -->
            <div class="mm_filter-tab">
                <div class="mm_tab" data-tab>
                    <!-- 탭메뉴 -->
                    <div class="mm_tab_menu">
                        <div class="mm_scroller">
                            <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
                            <ul>
                                <li v-for="usableFilter, index in usableFilterTypes" :key="usableFilter.type">
                                    <a 
                                        :class="['btn_tab', { 'S=tab-on' : selectedFilterType === usableFilter.type }]" 
                                        href="#" 
                                        :title="selectedFilterType === usableFilter.type ? '선택됨' : ''"
                                        @click.prevent="() => { selectedFilterType = usableFilter.type }"
                                    >
                                        <b>{{ usableFilter.label }}</b>
                                    </a>
                                </li>                              
                            </ul>
                        </div>
                    </div>
                    <!--// 탭메뉴 -->

                    <!-- 카테고리 -->
                    <div :class="['mm_tab-item', {'S=tab-on' : selectedFilterType === 'category'}]">
                        <div ref="filterCategoryScroller" class="mm_scroller">
                            <div class="mm_filter-tab-category">
                                <div class="mm_accordion">
                                    <!--
                                        (D) 전체체크를 위해서 각 카테고리 영역에 맞게 체크박스의 '_group' 명을 맞춰줍니다.
                                            체크박스 옵션에 '_group' 명이 두개 들어가는 경우엔 1depth '_group' 명을 먼저 작성하시고, 2depth '_group' 명은 그 다음에 작성해주세요.
                                    -->
                                    <ul>
                                        <li v-for="category, index in categories" :key="category.code">
                                            <dl 
                                                :class="['mm_dropdown S=before', { 'S=on' : nowSelectedDepth1Category?.code === category.code }]"                                                 
                                                data-dropdown="{ '_group': 'dev_accordion-category', '_time': 'auto', 'onChange': 'categoryAnchor' }"
                                            >
                                                <dt 
                                                    class="btn_dropdown"
                                                    tabindex="0"
                                                    title="펼쳐보기"
                                                    @click.prevent="depth1CategoryHandle(category, $event)"
                                                >
                                                    <p>{{ category.name }}</p>
                                                    <!-- 선택된 필터 카운트 -->
                                                    <b :class="['text_count', { 'S=count-on' : allCategoriesSelectedCount[index].selectedDepth3CategoryCount > 0 }]">                                                        
                                                        <template v-if="allCategoriesSelectedCount[index].selectedDepth3CategoryCount === allCategoriesSelectedCount[index].depth3CategoryCount && allCategoriesSelectedCount[index].selectedDepth3CategoryCount > 0">
                                                            전체
                                                        </template>                                                        
                                                        <template v-else>
                                                            <span data-check="{ '_group': 'dev_check-women' }">{{ allCategoriesSelectedCount[index].selectedDepth3CategoryCount }}</span>개
                                                        </template>
                                                    </b>
                                                    <i class="ico_dropdown" />
                                                </dt>
                                                <dd
                                                    class="mm_dropdown-item" 
                                                    :style="nowSelectedDepth1Category?.code === category.code ? { height: 'auto' } : { height: '0px' }"
                                                >
                                                    <div class="mm_dropdown-item-inner">
                                                        <!-- 카테고리 2depth -->
                                                        <div class="mm_filter...sub">
                                                            <label class="mm_form-check">
                                                                <input 
                                                                    type="checkbox"
                                                                    :checked="allCategoriesSelectedCount[index].selectedDepth2CategoryCount === allCategoriesSelectedCount[index].depth2CategoryCount" 
                                                                    data-check="{ '_type': 'check_all', '_group': 'dev_check-women' }"
                                                                    @click="depth2CategoryAll($event)"                                                                    
                                                                >
                                                                <b class="mm_inline">
                                                                    <b class="mm_flex">
                                                                        <span class="text_label">전체</span>
                                                                        <small>{{ MMFilters.formatNumber(category.goodsCount ) }}</small>
                                                                    </b>
                                                                </b>
                                                            </label>
                                                            <ul v-if="nowSelectedDepth1Category">
                                                                <li v-for="depth2Category in nowSelectedDepth1Category.childCategoryList" :key="depth2Category.code">
                                                                    <dl 
                                                                        :class="['mm_dropdown', { 'S=on' : nowSelectedDepth2Category?.code === depth2Category.code }, { 'S=use' : depth2CategoryAllChecked[depth2Category.code] }]"                                                                         
                                                                        data-dropdown="{ '_group': 'dev_accordion-category-women', '_time': 'auto', 'onChange': 'categoryHeight' }"
                                                                    >
                                                                        <dt 
                                                                            class="btn_dropdown" 
                                                                            tabindex="0"
                                                                            title="펼쳐보기"
                                                                            @click.prevent="depth2CategoryHandle(depth2Category)"
                                                                        >
                                                                            <p>
                                                                                <b class="mm_flex">
                                                                                    <span>{{ depth2Category.name }}</span>
                                                                                    <small>{{ MMFilters.formatNumber(depth2Category.goodsCount ) }}</small>
                                                                                </b>
                                                                            </p>
                                                                            <i class="ico_dropdown" />
                                                                        </dt>
                                                                        <dd
                                                                            class="mm_dropdown-item"
                                                                            :style="nowSelectedDepth2Category?.code === depth2Category.code ? { height: 'auto' } : {}"
                                                                        >
                                                                            <div class="mm_dropdown-item-inner">
                                                                                <!-- 카테고리 3depth -->
                                                                                <div class="mm_check-list">
                                                                                    <label class="mm_form-check">
                                                                                        <input 
                                                                                            type="checkbox" 
                                                                                            :checked="depth2CategoryAllChecked[depth2Category.code]"
                                                                                            data-check="{ '_type': 'check_all', '_group': 'dev_check-women dev_check-women01' }"
                                                                                            @click="allChildCategorySelect($event)"
                                                                                        >
                                                                                        <b class="mm_inline">
                                                                                            <b class="mm_flex">
                                                                                                <span class="text_label">전체</span>
                                                                                                <small>{{ MMFilters.formatNumber(depth2Category.goodsCount ) }}</small>
                                                                                            </b>
                                                                                        </b>
                                                                                    </label>
                                                                                    <ul>
                                                                                        <li v-for="depth3Category in nowSelectedDepth2Category?.childCategoryList || []" :key="depth3Category.code">
                                                                                            <label class="mm_form-check">
                                                                                                <input 
                                                                                                    v-model="selectedCategories"
                                                                                                    type="checkbox"
                                                                                                    :value="depth3Category"  
                                                                                                    data-check="{ '_group': 'dev_check-women dev_check-women01' }"                                                                 
                                                                                                    @change="toggleCategoryFilter(depth3Category)"
                                                                                                >
                                                                                                <b class="mm_inline">
                                                                                                    <b class="mm_flex">
                                                                                                        <span class="text_label">{{ depth3Category.name }}</span>
                                                                                                        <small>{{ MMFilters.formatNumber(depth3Category.goodsCount ) }}</small>
                                                                                                    </b>
                                                                                                </b>
                                                                                            </label>
                                                                                        </li>
                                                                                    </ul>
                                                                                </div>
                                                                                <!--// 카테고리 3depth -->
                                                                            </div>
                                                                        </dd>
                                                                    </dl>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <!--// 카테고리 2depth -->
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--// 카테고리 -->

                    <!-- 브랜드 -->
                    <div :class="['mm_tab-item', {'S=tab-on' : selectedFilterType === 'brand'}]">
                        <div class="mm_filter-tab-brand">
                            <!-- 브랜드검색 -->
                            <div class="mm_filter...search">
                                <MMInput 
                                    v-model="searchBrandText"
                                    type="search"
                                    :place-holder-text="'브랜드를 검색하세요'"
                                    @keyup.enter="brandSearchOn = true; selectedBrandInitials = '';"
                                >
                                    <template #extraTopButton>
                                        <button type="button" class="btn_search" @click="brandSearchOn = true; selectedBrandInitials ='';">
                                            <i class="ico_search" /><b class="mm_ir-blind">검색하기</b>
                                        </button>
                                    </template>
                                </MMInput>
                            </div>
                            <!--// 브랜드검색 -->

                            <!-- 브랜드목록 -->
                            <div class="mm_filter...list">
                                <!-- 검색된브랜드목록 -->
                                <div class="mm_scroller T=brand-search">
                                    <div v-if="initialsFilterBrands.length > 0" class="mm_check-list">
                                        <ul>
                                            <li v-for="brand in initialsFilterBrands" :key="brand.id">
                                                <label class="mm_form-check">
                                                    <!-- @change="toggleBrandFilter(brand, ($event.target as HTMLInputElement).checked)"       -->
                                                    <input
                                                        v-model="selectedBrandIds"                                                         
                                                        type="checkbox" 
                                                        :value="brand.id" 
                                                        data-check
                                                    >
                                                    <b class="mm_inline">
                                                        <b class="mm_flex">
                                                            <span class="text_label">{{ brand.name }}</span>
                                                            <small>{{ MMFilters.formatNumber(brand.goodsCount) }}</small>
                                                        </b>
                                                    </b>
                                                </label>
                                            </li>                                            
                                        </ul>
                                    </div>
                                    <!-- (D) 정렬 키워드에 속한 브랜드가 없는 경우 '.mm_text-none' 요소를 노출합니다. -->
                                    <p v-else class="mm_text-none">
                                        <i class="ico_text-none" />브랜드가 없습니다
                                    </p>
                                </div>
                                <!--// 검색된브랜드목록 -->
                                <!-- 자음목록 -->
                                <div class="mm_scroller T=brand-sort">
                                    <!-- (D) 현재페이지에 적용되어 있는 버튼에 'S=btn-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                                    <ul>
                                        <li v-for="initial in brandInitials" :key="initial">
                                            <button 
                                                type="button" 
                                                :class="{ 'S=btn-on' : selectedBrandInitials === initial }"
                                                :title="selectedBrandInitials === initial ? '선택됨' : ''" 
                                                @click="() => { selectedBrandInitials = initial; brandSearchOn = false; }"
                                            >
                                                <b>{{ initial }}</b>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <!--// 자음목록 -->
                            </div>
                            <!--// 브랜드목록 -->
                        </div>
                    </div>
                    <!--// 브랜드 -->

                    <!-- 가격 -->
                    <div :class="['mm_tab-item', {'S=tab-on' : selectedFilterType === 'price'}]">
                        <div class="mm_filter-tab-price">
                            <div class="mm_scroller">
                                <div class="mm_check-list">
                                    <ul>
                                        <li v-for="priceFilter in priceFilters" :key="priceFilter.value">
                                            <label class="mm_form-check">
                                                <input 
                                                    v-model="selectedPrices" 
                                                    type="checkbox" 
                                                    :value="priceFilter.value"
                                                    data-check 
                                                    @change="priceFilterChange(priceFilter.value, ($event.target as HTMLInputElement).checked)"
                                                >
                                                <b class="mm_block">
                                                    <span class="text_label">{{ priceFilter.label }}</span>
                                                </b>
                                            </label>
                                        </li> 
                                    </ul>
                                </div>
                                <div class="mm_form_mix-linked">
                                    <MMInput 
                                        v-model="minPriceText"
                                        :data-type="'number'"
                                        :place-holder-text="'최저금액'"
                                        @click="selectedPrices = []"
                                        @on-clear="selectedPrices = []"
                                    />
                                    <span class="text_tilde">~</span>
                                    <MMInput 
                                        v-model="maxPriceText"
                                        :data-type="'number'"
                                        :place-holder-text="'최대금액'"
                                        @click="selectedPrices = []"
                                        @on-clear="selectedPrices = []"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--// 가격 -->

                    <!-- 별점 -->
                    <div :class="['mm_tab-item', {'S=tab-on' : selectedFilterType === 'star'}]">
                        <div class="mm_filter-tab-star">
                            <div class="mm_scroller">
                                <div class="mm_check-list">
                                    <ul>
                                        <li v-for="rate in reviewRates" :key="rate">
                                            <label class="mm_form-check">
                                                <input
                                                    v-model="selectedReviewRates" 
                                                    type="checkbox" 
                                                    :value="rate" 
                                                >
                                                <b class="mm_block">
                                                    <i class="ico_star" />
                                                    <span class="text_label"><i class="ico_star-fill" />{{ `${rate}.0` }}</span>
                                                </b>
                                            </label>
                                        </li> 
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--// 별점 -->

                    <!-- FIT -->
                    <div :class="['mm_tab-item', {'S=tab-on' : selectedFilterType === 'fit'}]">
                        <div class="mm_filter-tab-fit">
                            <div class="mm_scroller">
                                <div class="mm_check-list">
                                    <ul>
                                        <li v-for="fit in fitSizes" :key="fit.id">
                                            <label class="mm_form-check">
                                                <input 
                                                    v-model="selectedFitIds" 
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
                            </div>
                        </div>
                    </div>
                    <!--// FIT -->
                    
                    <!-- 슈즈 -->
                    <div :class="['mm_tab-item', {'S=tab-on' : selectedFilterType === 'shoes'}]">
                        <div class="mm_filter-tab-shoes">
                            <div class="mm_scroller">
                                <div class="mm_check-list">
                                    <ul>
                                        <li v-for="shoes in shoesSizes" :key="shoes.id">
                                            <label class="mm_form-check">
                                                <input 
                                                    v-model="selectedShoeSizeIds" 
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
                            </div>
                        </div>
                    </div>
                    <!--// 슈즈 -->
                    <!-- 색상 -->
                    <div :class="['mm_tab-item', {'S=tab-on' : selectedFilterType === 'color'}]">
                        <div class="mm_filter-tab-color">
                            <div class="mm_scroller">
                                <div class="mm_check-list">
                                    <ul v-for="colorGroup, index in colorGroups" :key="index">
                                        <li v-for="color in colorGroup" :key="color.code">
                                            <label class="mm_form-check">
                                                <input 
                                                    v-model="selectedColorIds" 
                                                    type="checkbox" 
                                                    :value="color.id" 
                                                    data-check
                                                >
                                                <b class="mm_block">
                                                    <i class="ico_check-color">
                                                        <span :style="`background-color: ${color.code};`" />
                                                    </i>
                                                    <span class="text_label">{{ color.label }}</span>
                                                </b>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--// 색상 -->
                </div>
            </div>
            <!--// 필터영역 -->
        </div>
        <!-- 하단고정버튼 -->
        <div class="mm_btn_box T=fixed">
            <div class="mm_flex">
                <button type="button" class="btn_filter-reset" @click="resetAllFilter">
                    <i class="ico_reload" /><b class="mm_ir-blind">초기화</b>
                </button>
                <button type="button" @click="filterChange">
                    <b>적용하기</b>
                </button>
            </div>
        </div>
        <!--// 하단고정버튼 -->
    </div>
</template>

<script lang="ts">
import { FilterCategory, FilterBrand, ChildFilterCategory, PriceTag, Tag, FilterFit, FilterColor, FilterShoesSize } from '$/@type/searchFilter';
import { computed, defineComponent, onMounted, PropType, ref, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as MMFilters from '$/filters';
import { mmon } from '$/helper/mmon';
import { typeCastNumber } from '$/filters';

export default defineComponent({
    props: {
        show: {
            type: Boolean,
            default: false
        },
        categories: {
            type: Array as PropType<FilterCategory[]>,
            default: () => [],
        },
        brands: {
            type: Array as PropType<FilterBrand[]>,
            default: () => [],
        },
        fitSizes: {
            type: Array as PropType<FilterFit[]>,
            default: () => [],
        },
        shoesSizes: {
            type: Array as PropType<FilterShoesSize[]>,
            default: () => [],
        },
        colors: {
            type: Array as PropType<FilterColor[]>,
            default: () => [],
        },
        gender: {
            type: String,
            default: 'N'
        },
    },
    emits: ['close', 'changeFilter', 'querySync'],  
    setup(props, { emit }) {
        const filterCategoryScroller = ref<HTMLElement>();

        const { show, categories, brands, fitSizes, shoesSizes, colors  } = toRefs(props);
        const colorGroups = computed(() => {
            const coloGroup = [];
            for (let i = 0; i < colors.value.length; i+=3) {
                coloGroup.push(colors.value.slice(i, i+3));
            }

            return coloGroup;
        })
        function closeFilter() {
            selectedFilterTypeName.value = '';            
            router.go(-1);
            emit('close');
        }

        // 선택된 가격 범위 체크 박스 체크
        function setSelectedPrice(minPrice: string, maxPrice: string) {
            minPriceText.value = typeCastNumber(minPrice).toString();
            maxPriceText.value = typeCastNumber(maxPrice).toString();
            selectedPrices.value[0] = minPriceText.value + '~' + maxPriceText.value;
        }

        function filterChange() {
            applyFilter();
            router.go(-1);
        }
        
        function applyFilter() {
            if (selectedPrices.value.length > 0) {
                setSelectedPrice(selectedPrices.value[0].split('~')[0], selectedPrices.value[0].split('~')[1]);
            } else {
                setSelectedPrice(minPriceText.value, maxPriceText.value);
            }
            emit('changeFilter', filters.value);            
            emit('close');
        }
        
        watch(show, () => {
            if (show.value) {
                document.getElementById('filter_area')?.classList.add('S=on');
            } else {
                document.getElementById('filter_area')?.classList.remove('S=on');
            }
        });

        const route = useRoute();
        const router = useRouter();
        const parameters = MMFilters.getQueryParams(route.fullPath.split('?')[1] === undefined ? '' : route.fullPath.split('?')[1] );

        // 카테고리 변경 시 (가격 필터/필터 타입) 초기화
        watch(router.currentRoute, (currentRouter, beforeRouter) => {
            if (beforeRouter.name === currentRouter.name && 
                currentRouter.params.id !== beforeRouter.params.id
            ) {
                
                resetAllFilter();
                setSelectedPrice('0', '0');
                selectedFilterTypeName.value = '';
            }

            if(!currentRouter.hash) {
                emit('close');
            }
        })

        const minPriceText = ref('');
        const maxPriceText = ref('');
        /**
         * 실제 검색에 사용될 필터 객체
         */
        const filters = ref({
            categoryCodes : computed(() => {                
                if (onQuerySync.value) {
                    return selectedCategoryIds.value
                }

                return selectedCategories.value.map((cate) => {
                    return cate.code
                })
            }),
            brandIds: computed(() => {
                return selectedBrandIds.value
            }),
            fitIds: computed(() => {
                return selectedFitIds.value.length < 1 ? [] : selectedFitIds.value;
            }),
            shoesSizeIds: computed(() => {
                return selectedShoeSizeIds.value.length < 1 ? [] : selectedShoeSizeIds.value;
            }),
            colorIds: computed(() => {
                return selectedColorIds.value.length < 1 ? [] : selectedColorIds.value;
            }),
            maxPrice: computed(() => {
                const maxPriceInputValue = typeCastNumber(maxPriceText.value);
                const minPriceInputValue = typeCastNumber(minPriceText.value);
                if (maxPriceInputValue !== 0 || selectedPrices.value.length < 1 || minPriceInputValue !== 0) {
                    return maxPriceInputValue;
                }
                
                return selectedPrices.value[0].split('~')[1];
            }),
            minPrice: computed(() => {
                const minPriceInputValue = typeCastNumber(minPriceText.value);
                const maxPriceInputValue = typeCastNumber(maxPriceText.value);
                if (minPriceInputValue !== 0 || selectedPrices.value.length < 1 || maxPriceInputValue !== 0) {
                    return minPriceInputValue;
                }
                
                return selectedPrices.value[0].split('~')[0];
            }),
            reviewRates: computed(() => { return selectedReviewRates.value}),
            onlyFreeDelivery: computed(() => { return onlyFreeDelivery.value }),
            onlySale: computed(() => { return onlySale.value }),
            exceptSoldout: computed(() => { return exceptSoldout.value }),
            sorting: 'selling',
            page: parameters && parameters.page ? parameters.page : 1,
            perPage: parameters.page_size ? parameters.page_size : 100,     
        });

        /**
         * 카테고리 필터 관련 (자식 뎁스 처리용)
         */  
        const nowSelectedDepth1Category = ref<FilterCategory|null>(null);
        const nowSelectedDepth2Category = ref<ChildFilterCategory|null>(null);
        
        /**
         * 선택된 다중 필터 항목
         */
        const depth2CategoryIds = ref<number[]>([]);
        const selectedCategories = ref<ChildFilterCategory[]>([]);
        const selectedCategoryIds = ref<string[]>([]);
        const selectedBrandIds = ref<number[]>([]);
        const selectedFitIds = ref<number[]>([]);
        const selectedShoeSizeIds = ref<number[]>([]);
        const selectedColorIds = ref<number[]>([]);
        const selectedPrices = ref<string[]>([]);
        const selectedReviewRates = ref<number[]>([]);
        const onQuerySync = ref(false);
        
        /**
         * 선택된 개별 필터 항목
         */
        const onlyFreeDelivery = ref(false);
        const onlySale = ref(false);
        const exceptSoldout = ref(false);

        /**
         * 필터 관련 상수항목 처리 
         */
        const reviewRates = [5, 4, 3, 2, 1];
        const priceFilters: PriceTag[] = [
            {
                label:  '~ 5만원',
                value: '0~50000',
                min: 0,
                max: 50000
            },
            {
                label:  '5만원 ~ 10만원',
                value: '50000~100000',
                min: 50000,
                max: 100000
            },
            {
                label:  '10만원 ~ 50만원',
                value: '100000~500000',
                min: 100000,
                max: 500000
            },
            {
                label:  '50만원 ~ 100만원',
                value: '500000~1000000',
                min: 500000,
                max: 1000000
            },
            {
                label:  '100만원~',
                value: '1000000~0',
                min: 1000000,
                max: 0
            }
        ]
        
        const usableFilters = [
            {
                type: 'category',
                usable: computed(() => {
                    return categories.value.length > 0;
                }),
                label: '아이템'
            },
            {
                type: 'brand',
                usable: computed(() => {
                    return brands.value.length > 0;
                }),
                label: '브랜드'
            },
            {
                type: 'price',
                usable: computed(() => {
                    return true
                }),
                label: '가격'
            },
            {
                type: 'star',
                usable: computed(() => {
                    return true
                }),
                label: '별점'
            },
            {
                type: 'fit',
                usable: computed(() => {
                    return fitSizes.value.length > 0;
                }),
                label: 'FIT'
            },
            {
                type: 'shoes',
                usable: computed(() => {
                    return shoesSizes.value.length > 0;
                }),
                label: '슈즈'
            },
            {
                type: 'color',
                usable: computed(() => {
                    return colors.value.length > 0;
                }),
                label: '색상'
            }
        ];

        const usableFilterTypes = computed(() => {
            return usableFilters.filter((filter) => {
                return filter.usable.value 
            });
        });

        const selectedFilterTypeName = ref('');

        const selectedFilterType = computed({
            get: () => {
                return selectedFilterTypeName.value === '' ? usableFilterTypes.value[0].type : selectedFilterTypeName.value
            },
            set: (type: string) => {
                selectedFilterTypeName.value = type
            }
        })

        /**
         * 브랜드 필터를 위한 초성 항목 배열 
         */
        const brandInitials = [            
            '전체',
            'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
            'ABC',
            '123'
        ];
        
        const selectedBrandInitials = ref('전체');
        const searchBrandText = ref('');
        const brandSearchOn = ref(false);
        /**
        * 이니셜로 필터링된 브랜드 항목
        */

        const sortingBrands = computed(() => {
            return [...brands.value].sort((a,b) => {
                return a.name.localeCompare(b.name, 'kor')
            });
        })
        const initialsFilterBrands = computed<FilterBrand[]>(() => {
            if (selectedBrandInitials.value === '전체') {
                return sortingBrands.value
            }

            if(selectedBrandInitials.value === '123') {
                return brands.value.filter((brand) => {
                    return /^[0-9]/.test(brand.name) ||  (/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g).test(brand.name);
                }) 
            }

            if (selectedBrandInitials.value === 'ABC') {
                return sortingBrands.value.filter((brand) => {
                    return /^[a-zA-Z]/.test(brand.name);
                })
            }

            if (/[ㄱ-ㅎ]/.test(selectedBrandInitials.value)) {
                return sortingBrands.value.filter((brand) => {
                    return (new RegExp('^[' + selectedBrandInitials.value + ']')).test(getKoreanInitial(brand.name, true));
                })

            }

            if (searchBrandText.value !== '' && brandSearchOn.value ) {
                return sortingBrands.value.filter((brand) => {
                    return brand.name.indexOf(searchBrandText.value) > -1;
                })
            }

            return []
        })

        function getKoreanInitial(str: string, noDouble?: boolean /* 된소리 순화 */) {
            noDouble = noDouble || false;
            var initials = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
            var result = '';
            for(var i = 0; i < str.length; i++) {
                var code = str.charCodeAt(i) - 44032;
                var initial = str[i];
                if (code > -1 && code < 11172) {
                    initial = initials[Math.floor(code / 588)];
                }

                if (noDouble === true) {
                    if (initial == 'ㄲ') {
                        initial = 'ㄱ';
                    } else if (initial == 'ㄸ') {
                        initial = 'ㄷ';
                    } else if (initial == 'ㅃ') {
                        initial = 'ㅂ';
                    } else if (initial == 'ㅆ') {
                        initial = 'ㅅ';
                    } else if (initial == 'ㅉ') {
                        initial = 'ㅈ';
                    }
                }

                result += initial;
            }
            return result;
        }

        /**
         * 선택된 필터 태그 항목
        */
        const selectedFilterTags = ref<Tag[]>([]);

        /**
         * 필터 초기화
         */
        function resetAllFilter() {
            selectedFilterTags.value = [];            
            selectedCategories.value = [];
            depth2CategoryAllChecked.value = {};
            selectedBrandIds.value = [];
            selectedPrices.value = [];
            selectedReviewRates.value = [];
            onlyFreeDelivery.value = false;
            onlySale.value = false;
            exceptSoldout.value = false;
            selectedFitIds.value = [];
            selectedColorIds.value = [];
            selectedShoeSizeIds.value = [];
            minPriceText.value = '';
            maxPriceText.value = '';
            applyFilter();
        }   

        const depth2MarginTop = ref(0);

        watch(categories, () => {
            if (categories.value.length > 0) {
                nowSelectedDepth1Category.value = categories.value[0]
            }

            if (parameters.categoryCodes && parameters.categoryCodes.length > 0 && parameters.categoryCodes[0] !== '') {
                parameters.categoryCodes.forEach((depth3CategoryCode: string) => {
                    return categories.value.find((depth1) => {
                        return depth1.childCategoryList.find((depth2) => {
                            nowSelectedDepth2Category.value = depth2;
                            return depth2.childCategoryList?.find((depth3) => {
                                if(depth3.code == depth3CategoryCode) {
                                    selectedCategories.value.push(depth3);
                                    toggleCategoryFilter(depth3);                                       
                                    return;
                                }             
                            });                            
                        })
                    })
                });
                nowSelectedDepth2Category.value = null;
            } else {                
                selectedCategories.value = [];
                depth2CategoryAllChecked.value = {};
            }
        });
        
        function depth1CategoryHandle(category: FilterCategory, event: Event) {      
            const target = ref<HTMLElement>(event.target as HTMLElement);
            if (target.value.tagName === 'I') {
                target.value = target.value.parentElement as HTMLElement;
            }

            if (nowSelectedDepth1Category.value !== null && nowSelectedDepth1Category.value === category) {                
                return nowSelectedDepth1Category.value = null;
            }
            
            if (nowSelectedDepth2Category.value !== null) {
                nowSelectedDepth2Category.value = null;
            }
            
            nowSelectedDepth1Category.value = category;
            const parentDlElement = target.value.parentElement as HTMLElement;

            setTimeout(() => {
                depth2MarginTop.value = parentDlElement.querySelector('dd')?.offsetHeight ?? 0;
                if (parentDlElement.querySelector('dd') !== undefined && (parentDlElement.querySelector('dd') as HTMLElement).offsetHeight > 0) {
                    parentDlElement.querySelector('dd')?.style.setProperty('height', `${(parentDlElement.querySelector('dd') as HTMLElement).offsetHeight}px`);
                    mmon.scroll.to(parentDlElement, {
                        margin: 0,
                        scroller: filterCategoryScroller.value
                    });
                }
            }, 100);
        }

        
        const depth2CategoryAllChecked = ref<{
            [key: string] : boolean
        }>({});      


        /**
         * 선택된 카테고리 및 자식 카테고리 계산 처리 
         */
        const allCategoriesSelectedCount = computed(() => {
            return categories.value.map((category) => {
                const depth2CategoryCount = ref(0);
                const depth3CategoryCount = ref(0);
                const selectedDepth2CategoryCount = ref(0);
                const selectedDepth3CategoryCount = ref(0);

                depth2CategoryCount.value =  depth2CategoryCount.value + (category.childCategoryList?.length || 0);
                
                category.childCategoryList.forEach((depth2Category) => {                    
                    if (depth2CategoryAllChecked.value[depth2Category.code] !== undefined && depth2CategoryAllChecked.value[depth2Category.code]) {
                        selectedDepth2CategoryCount.value = ++selectedDepth2CategoryCount.value;
                    }
                    depth3CategoryCount.value = depth3CategoryCount.value + (depth2Category.childCategoryList?.length || 0);

                    depth2Category.childCategoryList?.forEach((dept3CategoryCode) => {
                        if(filters.value.categoryCodes.includes(dept3CategoryCode.code)) {
                            selectedDepth3CategoryCount.value = ++selectedDepth3CategoryCount.value;
                        }
                    });                    
                })
                
                return {
                    depth2CategoryCount: depth2CategoryCount.value,
                    depth3CategoryCount : depth3CategoryCount.value,
                    selectedDepth2CategoryCount: selectedDepth2CategoryCount.value,
                    selectedDepth3CategoryCount: selectedDepth3CategoryCount.value
                }
            })
        })
        
        /**
         * 2뎁스 카테고리 전체 선택 함수 
         */
        function depth2CategoryAll(event: MouseEvent) {
            const target = event.target as HTMLInputElement;
            
            if (nowSelectedDepth1Category.value === undefined || nowSelectedDepth1Category.value === null) { 
                return;
            }

            if (target.checked) {                
                nowSelectedDepth1Category.value.childCategoryList.forEach((depth2Category) => {
                    depth2CategoryAllChecked.value[depth2Category.code] = true;
                    depth2Category.childCategoryList?.forEach((depth3Category) => {
                        if (!filters.value.categoryCodes.includes(depth3Category.code)) {
                            selectedCategories.value.push(depth3Category);
                        }                     
                    })         
                })
            } else {
                nowSelectedDepth1Category.value.childCategoryList.forEach((depth2Category) => {
                    depth2CategoryAllChecked.value[depth2Category.code] = false;
                    depth2Category.childCategoryList?.forEach((depth3Category) => {
                        selectedCategories.value = selectedCategories.value.filter((selected) => {
                            return depth3Category !== selected;
                        }) ;
                    })         
                })
            }
        }

        /**
         * 1뎁스 카테고리 자식 전체 선택
         */
        function allChildCategorySelect(event: Event) {
            if (nowSelectedDepth2Category.value === null) {
                return;
            }
            const target = event.target as HTMLInputElement;
            depth2CategoryAllChecked.value[nowSelectedDepth2Category.value.code] = target.checked;
            
            // 선택된 경우 모든 카테고리 처리 
            if (target.checked) {
                nowSelectedDepth2Category.value.childCategoryList?.forEach((depth3Category) => {
                    if (!filters.value.categoryCodes.includes(depth3Category.code)) {
                        selectedCategories.value.push(depth3Category);
                    }
                })                   
            } else {
                // 3뎁스 싹다 필터처리 
                nowSelectedDepth2Category.value.childCategoryList?.forEach((depth3Category) => {
                    selectedCategories.value = selectedCategories.value.filter((selected) => {
                        return depth3Category !== selected;
                    }) ;
                })    
            }
        }

        // 2뎁스 카테고리 클릭시 핸들링 함수 
        function depth2CategoryHandle(category: ChildFilterCategory) {
            if (nowSelectedDepth2Category.value !== null && nowSelectedDepth2Category.value === category) {
                return nowSelectedDepth2Category.value = null;
            }
            nowSelectedDepth2Category.value = category;
        }

        /**
         * 3뎁스 카테고리 토글 함수 
         */
        function toggleCategoryFilter(depth3Category: ChildFilterCategory) {
            const sameParentCategories = selectedCategories.value.filter((selected) => {
                return selected.parentCode === depth3Category.parentCode;
            });
            const isAllChildCategorySelected = nowSelectedDepth2Category.value?.childCategoryList?.length === sameParentCategories.length;
            depth2CategoryAllChecked.value[depth3Category.parentCode] = isAllChildCategorySelected;
        }

        async function queryParamSync() {    
            if (parameters.sorting) {
                filters.value.sorting = parameters.sorting
            }
            
            if ((parameters.reviewRates?.length || 0) > 0 && parameters.reviewRates[0] !== '') {
                selectedReviewRates.value = parameters.reviewRates;
            }

            if ((parameters.brandIds?.length || 0) > 0 && parameters.brandIds[0] !== '') {
                selectedBrandIds.value = parameters.brandIds;                    
            }

            if ((parameters.categoryCodes?.length || 0) > 0 && parameters.categoryCodes[0] !== '') {
                selectedCategoryIds.value = parameters.categoryCodes;                    
            }

            if (parameters.colorIds && parameters.colorIds.length > 0 && parameters.colorIds[0] !== '') {
                selectedColorIds.value = parameters.colorIds;                
            }    

            if (parameters.fitIds && parameters.fitIds.length > 0 && parameters.fitIds[0] !== '') {
                selectedFitIds.value = parameters.fitIds;
            }
            if (parameters.shoesSizeIds && parameters.shoesSizeIds.length > 0 && parameters.shoesSizeIds[0] !== '') {
                selectedShoeSizeIds.value = parameters.shoesSizeIds;
            }
                
            exceptSoldout.value = parameters.exceptSoldout;
            onlyFreeDelivery.value = parameters.onlyFreeDelivery;
            onlySale.value = parameters.onlySale;
            onQuerySync.value = true;
        }

        function priceFilterChange(priceRange: string) {
            minPriceText.value = priceRange.split('~')[0];
            maxPriceText.value = priceRange.split('~')[1];

            const findItem = selectedPrices.value.find((price) => {
                return price === priceRange
            });

            if (findItem !== undefined) {
                selectedPrices.value = [findItem];
            }

            minPriceText.value = '';
            maxPriceText.value = '';
        }

        onMounted(async() => {
            setSelectedPrice(route.query.minPrice?.toString() ?? '0', route.query.maxPrice?.toString() ?? '0');

            await queryParamSync();                  
            emit('querySync', filters.value);            
            onQuerySync.value = false;
        });

        return {
            depth1CategoryHandle,
            depth2CategoryHandle,
            closeFilter,
            onlyFreeDelivery,
            onlySale,
            exceptSoldout,
            usableFilterTypes,
            allCategoriesSelectedCount,
            selectedCategories,
            depth2CategoryIds,
            nowSelectedDepth1Category,
            nowSelectedDepth2Category,
            depth2CategoryAllChecked,
            allChildCategorySelect,   
            toggleCategoryFilter,   
            depth2CategoryAll,
            depth2MarginTop,
            filterCategoryScroller,   

            brandSearchOn,
            initialsFilterBrands,
            searchBrandText,
            selectedBrandIds,
            selectedBrandInitials,
            brandInitials,        
            selectedFitIds,
            selectedShoeSizeIds,
            selectedColorIds,

            
            resetAllFilter,
            priceFilters,
            selectedPrices,
            minPriceText,
            maxPriceText,
            priceFilterChange,

            reviewRates,
            selectedReviewRates,

            filters,
            applyFilter,
            filterChange,
            selectedFilterType,  
            colorGroups,
        }
    }
})
</script>
