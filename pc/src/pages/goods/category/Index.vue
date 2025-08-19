<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="mm_inner">
            <h3 class="mm_title">
                <b>{{ selectedCategory?.name }}</b>
            </h3>
            <!-- 카테고리 브래드크럼 -->
            <div class="mm_breadcrumb">
                <ol>
                    <li>
                        <MMSelect
                            v-model="depth1CategoryCode"
                            @change="() => {
                                depth2CategoryCode = ''; 
                                depth3CategoryCode = ''; 
                                categoryChange() 
                            }"
                        >
                            <option v-if="depth1CategoryCode === ''" />
                            <option
                                v-for="depth1Category in categories"
                                :key="depth1Category.code"
                                :value="depth1Category.code"
                            >
                                {{ depth1Category.name }}
                            </option>                            
                        </MMSelect>
                    </li>
                    <li>
                        <MMSelect
                            v-model="depth2CategoryCode"
                            @change="() => { depth3CategoryCode = ''; categoryChange()}"
                        >
                            <option value="">
                                전체
                            </option>
                            <option
                                v-for="depth2Category in currentCategory1?.childCategoryList"
                                :key="depth2Category.code"
                                :value="depth2Category.code"
                            >
                                {{ depth2Category.name }}
                            </option>                            
                        </MMSelect>
                    </li>
                    <li>
                        <MMSelect
                            v-model="depth3CategoryCode"
                            @change="categoryChange()"
                        >
                            <option value="">
                                전체
                            </option>
                            <option
                                v-for="depth3Category in currentCategory2?.childCategoryList"
                                :key="depth3Category.code"
                                :value="depth3Category.code"
                            >
                                {{ depth3Category.name }}
                            </option>                            
                        </MMSelect>
                    </li>
                </ol>
            </div>
            <!--// 카테고리 브래드크럼 -->
            <!-- 카테고리 배너 -->
            <div v-if="selectedCategory?.pcBannerImageUrl" class="m_product-category-banner">
                <i class="image_banner">
                    <img
                        v-lazyload="{ src: selectedCategory?.pcBannerImageUrl, useErrorImage: false }"
                        src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                        :alt="selectedCategory?.pcBannerAlt"
                    >
                </i>
            </div>
            <!--// 카테고리 배너 -->
            <!-- 필터검색 -->           
            <Filter
                :search-form="searchForm"
                v-bind="filters"
                @apply-filter="changeFilter"
            />
            <!--// 필터검색 -->
            <filtered-goods 
                :goods-paginator="categoryGoodsPaginator" 
                :sorting="searchForm.sorting" 
                :is-loading="isLoading"
                :total-count="totalCount"
                @move-page="movePage" 
                @sort-update="sortUpdate"
            />
        </div>        
    </div>
</template>

<script setup lang='ts'>
import { ref, computed, defineComponent } from 'vue';
import Filter from '@/components/filter/Filter.vue'
import FilteredGoods from '@/components/filter/FilteredGoods.vue'
import MMSelect from '@/components/input/Select.vue'
import { categoryRepository } from '$/repository/category/categoryRepository';
import { SimplePaginator } from '$/@type';
import { Goods } from '$/@type/goods';
import { makePath } from '$/services/http';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { defaultCatch } from '$/functions';
import { useViewGoodsList } from '$/composables/marketingComposable'
import { useCategoryShop } from '$/composables/goods/categoryComposable';
import { CommonGoodsFilter } from '$/@type/searchFilter';
import { useRouteParams } from '@vueuse/router';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useExhibitCategory } from '$/composables/exhibit/categoryComposable';

/** VARIABLE */
const {
    route,
    router,
    mmon,
    usePageTitleSetting,
    setPageContext
} = usePageContext();

const { 
    searchForm, 
    filters,
    categories    
} = useCategoryShop();

const categoryCode = useRouteParams<string>('id').value;

const depth1CategoryCode = ref('');
const depth2CategoryCode = ref('');        
const depth3CategoryCode = ref(''); 
const totalCount = ref(0);
const isLoading = ref(true);

const categoryGoodsPaginator = ref<SimplePaginator<Goods>>({            
    currentPage: 1,
    perPage: 100,
    data: []
})

const currentCategory1 = computed(() => {
    return categories.value.find((category) => {
        return category.code === depth1CategoryCode.value
    })
})

const currentCategory2 = computed(() => {
    return currentCategory1.value?.childCategoryList?.find((category2) => {
        return category2.code === depth2CategoryCode.value
    })
})

const currentCategory3 = computed(() => {
    return currentCategory2?.value?.childCategoryList?.find(category3 => category3.code === depth3CategoryCode.value);
})


const selectedCategoryCode = computed(() => {
    if (selectedCategory.value) {
        return selectedCategory.value.code
    }

    return categoryCode
})

const selectedCategory = computed(() => {
    return currentCategory3.value || currentCategory2.value || currentCategory1.value
})

async function changeFilter(filterForm: CommonGoodsFilter) {
    searchForm.value = filterForm;
    await Promise.all([
        getTotalCount(),
        getFilteredCategoryGoods()
    ]);
}

/**
* 카테고리 정보 & 카테고리에 속한 필터 정보 조회 
*/
async function getCategoryInfo() {
    try {
        const categoryInfo = await categoryRepository.categoryInfo(selectedCategoryCode.value);        
        depth1CategoryCode.value = categoryInfo.depth1CategoryCode;
        depth2CategoryCode.value = categoryInfo.depth2CategoryCode;
        depth3CategoryCode.value = categoryInfo.depth3CategoryCode; 
        usePageTitleSetting(selectedCategory.value?.fullPath?.split('>').reverse().join(' < '));
    } catch (e) {
        if (e.response?.data?.message === '미사용 처리 진행중 인 카테고리 입니다. 다른 카테고리를 이용해주세요.') {
            return mmon.bom.alert(e.response?.data?.message, () => {
                router.go(-1);
            });
        }        
    }
}

/**
 *  필터정보 조회 
*/
async function getFilters() {
    try {
        filters.value = await categoryRepository.commonFilter(selectedCategoryCode.value);
    } catch(e) {
        defaultCatch(e);
    }
}

/**
 * 필터링된 카테고리 상품 + 전체 카운트 조회 
 */
async function getFilteredCategoryGoods() {
    isLoading.value = true;            
    try {
        const { paginator } = await categoryRepository.filteredGoods(selectedCategoryCode.value, searchForm.value);           
        categoryGoodsPaginator.value = paginator;

        shoppingRepository.getRelationLikedGoods(paginator.data.map((goods) => {
            return goods.id
        }));
        
        isLoading.value = false;
        router.replace(makePath(route.path, searchForm.value));  
        // 마케팅
        useViewGoodsList({
            account: 'base',
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            goodsIds: categoryGoodsPaginator.value.data.slice(0, 3).map(goods => goods.id),
            categoryCode: selectedCategory.value?.code,
            categoryName: selectedCategory.value?.name,
            categoryFullPath: selectedCategory.value?.fullPath,
        })
    } catch(e) {
        defaultCatch(e)
    }
}

async function movePage(page: number) {            
    searchForm.value.page = page;
    await getFilteredCategoryGoods();
}

async function sortUpdate(sorting: string) {
    searchForm.value.sorting = sorting;
    searchForm.value.page = 1;
    router.replace(makePath(route.path, searchForm.value));
    await getFilteredCategoryGoods();
}
        
async function categoryChange() {
    // 2뎁스 전체 선택시 1뎁스카테고리 전시페이지로 이동
    if (depth2CategoryCode.value == '') {
        
        const { 
            isPageExists,
            fetchExhibitCategory, 
            clearExhibitCategory 
        } = useExhibitCategory(`${selectedCategoryCode.value}`);
        
        try {
            await fetchExhibitCategory();
        } catch (e) {
            // 
        }
        
        if (isPageExists.value) {
            clearExhibitCategory();
            router.push({
                name: 'ExhibitCategoryIndex',
                params: {
                    id: selectedCategoryCode.value,
                }
            })
            return;
        }
    }

    isLoading.value = true;
    router.push({
        name: 'GoodsCategoryIndex',
        params: {
            id: selectedCategoryCode.value,
        }
    }).then(() => {
        // 카테고리 변경될때 스크롤 위치 초기화
        setPageContext(route.path, 0)
    });        
}

/**
 *  상품 전체 카운트 조회 
 */
async function getTotalCount() {
    totalCount.value = await categoryRepository.filteredGoodsTotalCount(selectedCategoryCode.value, searchForm.value);            
}

/** FUNCTION */

/** VUE LIFE CYCLE */
(async () => {
    try {
        await Promise.all([
            getFilters(),
            getTotalCount(),
            getFilteredCategoryGoods()
        ]);

        if (!depth1CategoryCode.value) {
            await getCategoryInfo();
        } else {
            usePageTitleSetting(selectedCategory.value?.fullPath?.split('>').reverse().join(' < '));
        }
    } catch(error) {                 
        defaultCatch(error);
    }
})();

defineExpose({
    depth1CategoryCode,
    depth2CategoryCode,
    depth3CategoryCode,
})
</script>

<script lang="ts">
    declare module "@vue/runtime-core" { 
        interface ComponentCustomProperties {
            depth1CategoryCode: string
            depth2CategoryCode: string
            depth3CategoryCode: string
        }
    }
    
export default defineComponent({
    async beforeRouteEnter(to, from, next) {
        try {
            const categoryInfo = await categoryRepository.categoryInfo(to.params.id.toString());
            if (!categoryInfo.depth2CategoryCode) {
                const { 
                    isPageExists, 
                    fetchExhibitCategory, 
                    clearExhibitCategory 
                } = useExhibitCategory(`${to.params.id}`);

                try {
                    await fetchExhibitCategory();
                } catch (e) {
                    //
                }
                
                if (isPageExists.value) {
                    return next({ 
                        name: 'ExhibitCategoryIndex',
                        params: {
                            id: to.params.id,
                        }
                    })   
                }
                clearExhibitCategory();
            }
            next((vm) => {
                vm.depth1CategoryCode = categoryInfo.depth1CategoryCode;
                vm.depth2CategoryCode = categoryInfo.depth2CategoryCode;
                vm.depth3CategoryCode = categoryInfo.depth3CategoryCode;
            })
        } catch (e) {
            if (e.response?.data?.message === '미사용 처리 진행중 인 카테고리 입니다. 다른 카테고리를 이용해주세요.') {
                return mmon.bom.alert(e.response?.data?.message, () => {
                    next(from.path)
                });
            } else {
                next('/');
            }
        }
    }
})
</script>