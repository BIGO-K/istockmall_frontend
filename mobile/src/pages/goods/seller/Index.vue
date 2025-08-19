<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>판매자샵</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div v-if="bestGoods.length > 0 || newGoods.length > 0 " class="m_product-seller">
                            <!-- BEST ITEM -->
                            <section v-if="bestGoods.length > 0">
                                <h3 class="mm_strapline">
                                    <b>BEST ITEM</b>
                                </h3>
                                <div class="mm_scroller T=x">
                                    <div class="mm_product-list T=card">
                                        <ul>
                                            <li v-for="goods in bestGoods" :key="`best_${goods.id}`">
                                                <MmGoods 
                                                    :goods="goods" 
                                                    :use-liked-button="true" 
                                                />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                            <!--// BEST ITEM -->

                            <!-- NEW IN -->
                            <section v-if="newGoods.length > 0">
                                <h3 class="mm_strapline">
                                    <b>NEW IN</b>
                                </h3>
                                <div class="mm_scroller T=x">
                                    <div class="mm_product-list T=card">
                                        <ul>
                                            <li v-for="goods in newGoods" :key="`new_${goods.id}`">
                                                <MmGoods 
                                                    :goods="goods" 
                                                    :use-liked-button="true" 
                                                />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                            <!--// NEW IN -->
                        </div>
                        <!-- 상품리스트 -->
                        <FilteredGoods 
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
                        />
                        <!--// 상품리스트 -->
                    </div>
                    <!--// 본문 -->

                    <MMFooter />
                </div>
            </div>
        </template>
    </MMSub>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, defineAsyncComponent, computed } from 'vue';
import MMSub from '@/components/layout/Sub.vue';
import MMFooter from '@/components/Footer.vue';
import { BaseGoods, Goods } from '$/@type/goods';
import { CommonFilter, CommonGoodsFilter } from '$/@type/searchFilter';
import { LikedGoods } from '$/@type/shopping';
import { defaultCatch } from '$/functions';
import { sellerShopRepository } from '$/repository/goods/sellerShopRepository';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { makePath } from '$/services/http';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    components: {
        MMSub,
        MMFooter,
        FilteredGoods: defineAsyncComponent(() => import('@/components/goods/FilteredGoods.vue'))
    },
    async beforeRouteEnter(to, from, next) {
        
        const curations = await sellerShopRepository.getCurations(Number(to.params.id.toString()));
        await shoppingRepository.getRelationLikedGoods(
            curations.bestGoods.map(goods => goods.id)
                .concat(curations.newGoods.map(goods => goods.id))
        )

        next(vm => {
            vm.bestGoods = curations.bestGoods
            vm.newGoods = curations.newGoods
        })

    },
    setup(props, { emit }) {
        const route = useRoute();
        const router = useRouter();
        const sellerId = ref<number>(Number(route.params.id.toString()));        
        const bestGoods = ref<BaseGoods[]>([]);
        const newGoods = ref<BaseGoods[]>([]);
        const newGoodsLikedRelation = ref<LikedGoods[]>([]);
        const bestGoodsLikedRelation = ref<LikedGoods[]>([]);

        const isLoading = ref(true);

        const isPageReady = ref(false)
        const initPage = ref(1)

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

                    const { paginator, goodsIds } = await sellerShopRepository.filteringGoods(
                        sellerId.value, 
                        filter
                    )

                    itemsByPage.value[page] = paginator.data
                    await shoppingRepository.getRelationLikedGoods(goodsIds)
                } ))
            } catch (e) {
                defaultCatch(e)
            } finally {
                isLoading.value = false
                loadingPages.value = loadingPages.value.filter(lp => !pagesNeedLoad.some(needLoadPage => needLoadPage === lp))
            }
        }

        const filter = ref<CommonFilter>({
            categories: [],
            brands: [],
            fitSizes: [],
            shoesSizes: [],
            colors: [],            
            gender: 'N'    
        })

        const searchFilters = ref<CommonGoodsFilter>({
            page: 1,
            perPage: 100,
            sorting: 'selling',
            categoryCodes: [],
            brandIds: [],
            // priceRanges: [],
            minPrice: 0,
            maxPrice: 0,
            reviewRates: [],
            fitIds: [],
            shoesSizeIds: [],
            colorIds: [],
            onlyFreeDelivery: false,
            onlySale: false,
            exceptSoldout: false
        });
        
        async function changeFilter(filter: CommonGoodsFilter) {
            searchFilters.value = filter
            searchFilters.value.page = 1
            await newContext()
            router.replace(makePath(route.path, searchFilters.value))
        }

        async function changeSort(sorting: string) {
            searchFilters.value.sorting = sorting
            searchFilters.value.page = 1

            itemsByPage.value = []
            await loadPage(1)
            router.replace(makePath(route.path, searchFilters.value))
        }

        async function newContext() {
            isLoading.value = true
            try {
                itemsByPage.value = [];
                const [ fetchedTotalCount ] = await Promise.all([
                    sellerShopRepository.filteredGoodsTotalCount(sellerId.value, searchFilters.value),
                    loadPage(1)
                ])

                totalCount.value = fetchedTotalCount
            } catch (error) {
                defaultCatch(error)
            } finally {
                isLoading.value = false
            }
        }

        /**
         * 최초 진입시 쿼리와 동기화 처리 
         * @param {CommonGoodsFilter} searchFilter: 상품 필터  
         */
        async function querySync(searchFilter: CommonGoodsFilter)  {
            searchFilters.value = searchFilter;

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
                sellerShopRepository.filteredGoodsTotalCount(sellerId.value, searchFilters.value),
                loadPage([
                    initPage.value - 1,
                    initPage.value,
                ].filter(page => page > 0))
            ])

            totalCount.value = fetchedTotalCount

            isPageReady.value = true

            filter.value = await sellerShopRepository.commonFilter(sellerId.value)
        }

        function setPageOnView(currentPage: number, oldPage: number) {
            /**
             * page on view 를 갱신 (단순 쿼리스트링 처리용)
             */
            const filter = {...searchFilters.value}
            filter.page = currentPage
            router.replace(makePath(route.path, filter));
        }

        onMounted(async() => {
            //                    
        });

        return {
            bestGoods,
            bestGoodsLikedRelation,
            newGoods,
            newGoodsLikedRelation,
            filter,
            changeFilter,
            querySync,
            searchFilters,
            isLoading,
            totalCount,
            changeSort,
            goodsList,
            loadPage,
            isPageReady,
            setPageOnView,
            initPage,
        }
    }
})
</script>
