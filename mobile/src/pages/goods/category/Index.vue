<template>
    <div :class="['mm_view', $route.meta.layouts]">
        <MMHeader :class="['mm_header', { 'S=category-on': categoryHeaderOpen }]">
            <template #baseHeaderTitle>
                <h1>
                    <button
                        type="button"
                        class="btn_category"
                        :title="categoryHeaderOpen ? '접어보기' : '펼쳐보기'"
                        @click="
                            () => {
                                categoryHeaderOpen = !categoryHeaderOpen
                            }
                        "
                    >
                        <b>{{ currentCategory1?.name }}</b>
                        <i class="ico_dropdown" />
                    </button>
                </h1>
            </template>
            <template #extra>
                <!-- 대카테고리 -->
                <div class="mm_header-category">
                    <div class="mm_header-category-dim" onclick="this.closest('.mm_header').classList.remove('S=category-on');" />
                    <div class="mm_scroller">
                        <ul>
                            <li v-for="depth1Category in categories" :key="depth1Category.code">
                                <a
                                    href="#"
                                    :class="{ 'S=category-on': currentCategory1?.code === depth1Category.code }"
                                    :title="currentCategory1?.code === depth1Category.code ? '선택됨' : ''"
                                    @click.prevent="
                                        () => {
                                            categoryChange(depth1Category)
                                        }
                                    "
                                >
                                    <b>{{ depth1Category.name }}</b>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            <!--// 대카테고리 -->
            </template>
        </MMHeader>
        <!--// 헤더 -->
        <!-- 내용 -->
        <div id="mm_body" class="mm_page">
            <PullToRefresh />
            <!-- (D) 실제 내용을 추가하는 부분입니다. -->
            <div ref="productScroller" class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- (D) 카테고리 선택 시 새로고침 되지 않고 페이지 내에서 카테고리 아래로 내용만 변경됩니다 -->
                        <!-- 카테고리 -->
                        <div class="m_product-category">
                            <!-- 중카테고리 -->
                            <div class="m_product-category-list">
                                <div ref="mediumCategoryScroller" class="mm_scroller T=x">
                                    <!-- (D) 선택된 카테고리에 'S=category-on' 클래스와 '선택됨' 타이틀을 추가합니다 -->
                                    <ul>
                                        <li>
                                            <a
                                                :class="{ 'S=category-on': currentCategory2 === undefined }"
                                                href="#"
                                                :title="currentCategory2 === undefined ? '선택됨' : ''"
                                                @click.prevent="
                                                    () => {
                                                        categoryChange(currentCategory1)
                                                    }
                                                "
                                            >
                                                <b>전체</b>
                                            </a>
                                        </li>
                                        <li v-for="depth2Category in currentCategory1?.childCategoryList" :key="depth2Category.code">
                                            <a
                                                href="#"
                                                :class="{ 'S=category-on': currentCategory2?.code === depth2Category.code }"
                                                :title="currentCategory2?.code === depth2Category.code ? '선택됨' : ''"
                                                @click.prevent="
                                                    () => {
                                                        categoryChange(currentCategory1, depth2Category)
                                                    }
                                                "
                                            >
                                                <b>{{ depth2Category.name }}</b>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <!--// 중카테고리 -->

                            <!-- 소카테고리 -->
                            <div class="m_product-category-list">
                                <div ref="smallCategoryScroller" class="mm_scroller T=x">
                                    <!-- (D) 선택된 카테고리에 'S=category-on' 클래스와 '선택됨' 타이틀을 추가합니다 -->
                                    <ul>
                                        <li>
                                            <a
                                                :class="{ 'S=category-on': currentCategory3 === undefined }"
                                                href="#"
                                                :title="currentCategory3 === undefined ? '선택됨' : ''"
                                                @click.prevent="
                                                    () => {
                                                        categoryChange(currentCategory1, currentCategory2)
                                                    }
                                                "
                                            >
                                                <b>전체</b>
                                            </a>
                                        </li>
                                        <template v-if="currentCategory2 !== undefined">
                                            <li v-for="depth3Category in currentCategory2?.childCategoryList" :key="depth3Category.code">
                                                <a
                                                    href="#"
                                                    :class="{ 'S=category-on': currentCategory3?.code === depth3Category.code }"
                                                    :title="currentCategory3?.code === depth3Category.code ? '선택됨' : ''"
                                                    @click.prevent="
                                                        () => {
                                                            categoryChange(currentCategory1, currentCategory2, depth3Category)
                                                        }
                                                    "
                                                >
                                                    <b>{{ depth3Category.name }}</b>
                                                </a>
                                            </li>
                                        </template>
                                    </ul>
                                </div>
                            </div>
                            <!--// 소카테고리 -->

                            <!-- 소카테고리 드롭다운 -->
                            <div :class="['mm_dropdown', { 'S=on': dropdownOn }]" data-dropdown>
                                <button
                                    type="button"
                                    class="btn_dropdown"
                                    :title="dropdownOn ? '접어놓기' : '펼쳐보기'"
                                    @click="
                                        () => {
                                            dropdownOn = !dropdownOn
                                        }
                                    "
                                >
                                    <i class="ico_category" /><b class="mm_ir-blind">소 카테고리</b>
                                </button>
                                <div class="mm_dropdown-item" :style="dropdownOn ? { height: 'auto' } : {}">
                                    <div class="mm_dropdown-item-inner">
                                        <!-- (D) 선택된 카테고리에 'S=category-on' 클래스와 '선택됨' 타이틀을 추가합니다 -->
                                        <div class="mm_scroller">
                                            <ul>
                                                <li>
                                                    <a
                                                        :class="{ 'S=category-on': currentCategory3 === undefined }"
                                                        href="#"
                                                        :title="currentCategory3 === undefined ? '선택됨' : ''"
                                                        @click.prevent="
                                                            () => {
                                                                categoryChange(currentCategory1, currentCategory2)
                                                            }
                                                        "
                                                    >
                                                        <b>전체</b>
                                                    </a>
                                                </li>
                                                <template v-if="currentCategory2 !== undefined">
                                                    <li v-for="depth3Category in currentCategory2.childCategoryList" :key="depth3Category.code">
                                                        <a
                                                            href="#"
                                                            :class="{ 'S=category-on': currentCategory3?.code === depth3Category.code }"
                                                            :title="currentCategory3?.code === depth3Category.code ? '선택됨' : ''"
                                                            @click.prevent="
                                                                () => {
                                                                    categoryChange(currentCategory1, currentCategory2, depth3Category)
                                                                }
                                                            "
                                                        >
                                                            <b>{{ depth3Category.name }}</b>
                                                        </a>
                                                    </li>
                                                </template>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--// 소카테고리 드롭다운 -->
                        </div>
                        <!--// 카테고리 -->

                        <!-- 상품리스트 -->
                        <filtered-goods
                            :goods-list="goodsList"
                            :sorting="searchFilters.sorting"
                            :is-loading="isLoading"
                            :total-count="totalCount"
                            :init-page="initPage"
                            :is-page-ready="isPageReady"
                            :per-page="searchFilters.perPage"
                            v-bind="filter"
                            @query-sync="querySync"
                            @apply-filter="changeFilter"
                            @change-sort="changeSort"
                            @page-required="loadPage"
                            @page-on-view-changed="setPageOnView"
                        >
                            <template v-if="currentCategory !== undefined && currentCategory.mobileBannerImageUrl !== ''" #banner>
                                <div class="m_product-category-banner">
                                    <i class="image_banner">
                                        <img
                                            v-lazyload="{src : currentCategory?.mobileBannerImageUrl}" 
                                            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" 
                                            :alt="currentCategory?.mobileBannerAlt"
                                        >
                                    </i>
                                </div>
                            </template>
                        </filtered-goods>
                        <!--// 상품리스트 -->
                    </div>
                    <!--// 본문 -->

                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>
            <ScrollTop />
        </div>
        <!--// 내용 -->
        <!-- 툴바 -->
        <MMToolbar />
    <!--// 툴바 -->
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRefs, nextTick } from 'vue';
import { categoryRepository } from '$/repository/category/categoryRepository'
import { Category } from '$/@type/category'
import { Goods } from '$/@type/goods'
import { CommonFilter, CommonGoodsFilter } from '$/@type/searchFilter'
import { shoppingRepository } from '$/repository/shoppingRepository'
import { makePath } from '$/services/http'
import { defaultCatch } from '$/functions'
import MMToolbar from '@/components/Toolbar.vue'
import MMFooter from '@/components/Footer.vue'
import FilteredGoods from '@/components/goods/FilteredGoods.vue'
import { useRoute, useRouter } from 'vue-router'
import PullToRefresh from '@/components/PullToRefresh.vue'
import { usePageTitleSetting } from '$/composables/seoComposable'
import { horizontalScrollMove } from '$/functions';
import { useViewGoodsList } from '$/composables/marketingComposable'
import { useExhibitCategory } from '$/composables/exhibit/categoryComposable';

export default defineComponent({
    components: {
        MMToolbar,
        MMFooter,
        FilteredGoods,
        PullToRefresh,
    },
    async beforeRouteEnter(to, from, next) {
        const categories = await categoryRepository.getAllCategoryList();
        const categoryCode = to.params.id;
        const currentCategory1 = categories.find(
            category1 => 
                category1.code == categoryCode
            || category1.childCategoryList?.some(
                category2 => category2.code == categoryCode
            || category2.childCategoryList?.some(category3 => category3.code == categoryCode)
            )
        )

        const currentCategory2 = currentCategory1?.childCategoryList?.find(
            category2 => category2.code == categoryCode
            || category2.childCategoryList?.some(category3 => category3.code == categoryCode)
        )
        
        if (!currentCategory2) {
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

        const currentCategory3 = currentCategory2?.childCategoryList?.find(category3 => category3.code == categoryCode)

        next(vm => {
            vm.categories = categories;
            vm.currentCategory1 = currentCategory1;
            vm.currentCategory2 = currentCategory2;
            vm.currentCategory3 = currentCategory3;
        })
    },
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    setup(props, { emit }) {
        const { id: categoryCode } = toRefs(props)
        // 전체 카테고리 리스트
        const categories = ref<Category[]>([])
        const currentCategory1 = ref<Category | undefined>(undefined);
        const currentCategory2 = ref<Category | undefined>(undefined);
        const currentCategory3 = ref<Category | undefined>(undefined);        
        const isLoading = ref(true)

        const router = useRouter()
        const route = useRoute()

        const productScroller = ref<HTMLElement | null>(null)
        const isFilterEmpty = ref(true)
        const isResetItems = ref(false)

        const isPageReady = ref(false)
        const initPage = ref(1)

        /**
         * 필터 처리
         */
        const filter = ref<CommonFilter>({
            categories: [],
            brands: [],
            fitSizes: [],
            shoesSizes: [],
            colors: [],
            gender: 'N',
        })

        const searchFilters = ref<CommonGoodsFilter>({
            page: 1,
            perPage: 100,
            sorting: 'selling',
            categoryCodes: [],
            brandIds: [],
            minPrice: 0,
            maxPrice: 0,
            reviewRates: [],
            fitIds: [],
            shoesSizeIds: [],
            colorIds: [],
            onlyFreeDelivery: false,
            onlySale: false,
            exceptSoldout: false,
        })

        const totalCount = ref(0)

        const itemsByPage = ref<Array<(Goods|null)[]>>([])
        const goodsList = computed(() => {
            /**
             * 평탄화된 상품 배열
             */
            return itemsByPage.value.flatMap((itemsInPage) => {
                return itemsInPage
            })
        })

        const mediumCategoryScroller = ref<HTMLElement|null>(null);
        const smallCategoryScroller = ref<HTMLElement|null>(null);

        const loadingPages = ref<number[]>([]) 
        async function loadPage(page: number|number[]) {
            const pages = Array.isArray(page) ? page.concat([]) : [page]
            const pagesNeedLoad = pages.filter(page => {
                if (
                    loadingPages.value.some(lp => lp === page)
                || (itemsByPage.value[page] && itemsByPage.value[page].some(item => item === null) === false)
                ) {
                    return false;
                }

                return true;
            })

            if (pagesNeedLoad.length < 1) {
                return;
            }

            /**
             * 페이지에 해당하는 상품 목록 조회
             */
            isLoading.value = true;
            loadingPages.value = loadingPages.value.concat(pagesNeedLoad)

            try {
                await Promise.all(pagesNeedLoad.map(async page => {
                    const filter = {...searchFilters.value}
                    filter.page = page;

                    const { paginator } = await categoryRepository.filteredGoods(
                        selectedCategoryCode.value, 
                        filter
                    )

                    itemsByPage.value[page] = paginator.data
                    await shoppingRepository.getRelationLikedGoods(paginator.data.map((goods) => {
                        return goods.id
                    }))
                } ))
            } catch (e) {
                defaultCatch(e)
            } finally {
                isLoading.value = false
                loadingPages.value = loadingPages.value.filter(lp => !pagesNeedLoad.some(needLoadPage => needLoadPage === lp))
            }
        }

        const dropdownOn = ref(false)
        const categoryHeaderOpen = ref(false)
        const selectedCategoryCode = computed<string>(() => {
            /**
             * 현재 활성화된 카테고리 코드
             */
            return currentCategory3.value?.code || currentCategory2.value?.code || currentCategory1.value?.code || categoryCode.value || ''
        })

        /**
         * 최초 진입시 쿼리와 동기화 처리
         * @param {CommonGoodsFilter} searchFilter: 상품 필터
         */
        async function querySync(searchFilter: CommonGoodsFilter) {
            searchFilters.value = searchFilter
            const pageInQuery = route.query.page;
            initPage.value = pageInQuery ? Number.parseInt(pageInQuery.toString()) : 1;
            if (pageInQuery && Number.parseInt(pageInQuery.toString()) > 1) {
                for (let page = 1; page <= Number.parseInt(pageInQuery.toString()); page++) {
                    itemsByPage.value[page] = []
                    for (let itemIndex = 0; itemIndex < searchFilters.value.perPage; itemIndex++) {
                        itemsByPage.value[page][itemIndex] = null
                    }
                }
            }

            const [ fetchedTotalCount ] = await Promise.all([
                categoryRepository.filteredGoodsTotalCount(selectedCategoryCode.value, searchFilters.value),
                loadPage([
                    initPage.value - 1,
                    initPage.value,
                ].filter(page => page > 0))
            ])

            totalCount.value = fetchedTotalCount

            isPageReady.value = true

            filter.value = await categoryRepository.commonFilter(selectedCategoryCode.value)

            // 마케팅
            useViewGoodsList({
                account: 'base',
                isMobile: true,
                isTablet: false,
                isDesktop: false,
                goodsIds: goodsList.value
                    .filter(goods => goods !== null)
                    .slice(0, 3)
                    .map(goods => goods?.id ?? 0),
                categoryCode: currentCategory.value?.code,
                categoryName: currentCategory.value?.name,
                categoryFullPath: currentCategory.value?.fullPath,
            })
        }

        function searchFilterReset() {
            searchFilters.value = {
                page: 1,
                perPage: 100,
                sorting: searchFilters.value.sorting ? searchFilters.value.sorting : 'selling',
                categoryCodes: [],
                brandIds: [],
                minPrice: 0,
                maxPrice: 0,
                reviewRates: [],
                fitIds: [],
                shoesSizeIds: [],
                colorIds: [],
                onlyFreeDelivery: false,
                onlySale: false,
                exceptSoldout: false,
            }
        }

        async function changeSort(sorting: string) {
            searchFilters.value.sorting = sorting
            searchFilters.value.page = 1

            itemsByPage.value = []
            await loadPage(1)
            router.replace(makePath(route.path, searchFilters.value))
        }

        const currentCategory = computed(() => {
            if (currentCategory3.value !== undefined) {
                return currentCategory3.value
            }

            if (currentCategory2.value !== undefined) {
                return currentCategory2.value
            }

            return currentCategory1.value;
        })

        async function categoryChange(depth1Category?: Category, depth2Category?: Category, depth3Category?: Category) {
            currentCategory1.value = depth1Category ?? undefined
            currentCategory2.value = depth2Category ?? undefined
            currentCategory3.value = depth3Category ?? undefined
            
            // 2뎁스 전체 선택시 1뎁스카테고리 전시페이지로 이동
            if (currentCategory2.value == undefined) {
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
            
            await scrollMove();

            categoryHeaderOpen.value = false
            isFilterEmpty.value = true
            searchFilterReset()

            router.push({
                name: 'GoodsCategoryIndex',
                params: {
                    id: selectedCategoryCode.value,
                },
            })

            searchFilters.value.page = 1
            productScroller.value?.scrollTo(0, 0)
            filter.value = await categoryRepository.commonFilter(selectedCategoryCode.value)

            usePageTitleSetting(currentCategory.value?.fullPath?.split('>').reverse().join(' < '));
        }

        async function changeFilter(filter: CommonGoodsFilter) {
            searchFilters.value = filter
            searchFilters.value.page = 1
            await newContext()
            router.replace(makePath(route.path, searchFilters.value))
        }

        async function newContext() {
            isLoading.value = true
            try {
                itemsByPage.value = [];
                const [ fetchedTotalCount ] = await Promise.all([
                    categoryRepository.filteredGoodsTotalCount(selectedCategoryCode.value, searchFilters.value),
                    loadPage(1)
                ])

                totalCount.value = fetchedTotalCount
            } catch (error) {
                defaultCatch(error)
            } finally {
                isLoading.value = false
            }
        }

        function setPageOnView(currentPage: number, oldPage: number) {
            /**
             * page on view 를 갱신 (단순 쿼리스트링 처리용)
             */
            const filter = {...searchFilters.value}
            filter.page = currentPage
            router.replace(makePath(route.path, filter));
        }

        onMounted(async () => {
            usePageTitleSetting(currentCategory.value?.fullPath?.split('>').reverse().join(' < '));
            await scrollMove();
        });

        async function scrollMove() {
            await nextTick();

            if (mediumCategoryScroller.value) {
                const element = mediumCategoryScroller.value.querySelector('.S\\=category-on');
                horizontalScrollMove(mediumCategoryScroller.value, element);
            }

            if (smallCategoryScroller.value) {
                const element = smallCategoryScroller.value.querySelector('.S\\=category-on');
                horizontalScrollMove(smallCategoryScroller.value, element);
            }
        }

        return {
            dropdownOn,            
            categories,
            categoryHeaderOpen,
            filter,
            totalCount,
            searchFilters,
            isLoading,
            // movePage,
            changeSort,
            goodsList,
            querySync,
            changeFilter,
            categoryChange,
            productScroller,            
            isResetItems,
            loadPage,
            isPageReady,
            initPage,
            setPageOnView,
            ///
            currentCategory,
            currentCategory1,
            currentCategory2,
            currentCategory3,
            mediumCategoryScroller,
            smallCategoryScroller,
            scrollMove,
        }
    },
})
</script>
