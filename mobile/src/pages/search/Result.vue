<template>
    <div class="mm_view L=popup L=search">
        <!-- 헤더 -->
        <MMHeader>
            <template #customLSide>
                <i class="ico_search"><b class="mm_ir-blind">검색</b></i>
            </template>
            <template #search>
                <MMInput
                    v-model="keyword"
                    readonly
                    type="text"
                    :use-trim="false"
                    :placeholder="'검색어를 입력하세요'"
                    @click="toSearchReady"
                />
            </template>
        </MMHeader>
        <!--// 헤더 -->
        <!-- 내용 -->
        <div id="mm_body" class="mm_page">
            <!-- (D) 실제 내용을 추가하는 부분입니다. -->

            <!-- (D) 검색 팝업은 html, mm_view 태그에 'L=popup L=search' 클래스를 추가합니다. -->
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-search-result">
                            <!-- 결과없음 -->
                            <template v-if="isEmptySearchResult && !isLoading">
                                <p class="mm_text-none">
                                    <i class="ico_text-none" />검색 결과가 없습니다
                                </p>
                                <div class="mm_note">
                                    <ul>
                                        <li>정확한 검색어를 입력하셨는지 확인해 주세요.</li>
                                        <li>다른 검색어를 입력해 주세요.</li>
                                        <li>노출이 제한된 상품일 수 있습니다.</li>
                                    </ul>
                                </div>
                                <!--// 결과없음 -->
                                <!-- 인기 검색어 -->
                                <div class="mm_inner">
                                    <section class="m_popup-search-list">
                                        <h3><b>인기 검색어</b></h3>
                                        <div class="mm_scroller">                                
                                            <ol>
                                                <li
                                                    v-for="hotKeyword in hotKeywords"
                                                    :key="hotKeyword.keyword"
                                                >
                                                    <a
                                                        href="#"
                                                        @click.prevent="searchStart(hotKeyword.keyword)"
                                                    >
                                                        <b>{{ hotKeyword.keyword === '' ? '-' : hotKeyword.keyword }}</b>
                                                        <template v-if="hotKeyword.changeType === 'U'">
                                                            <i
                                                                class="ico_rank-up"
                                                                title="상승"
                                                            />
                                                            <b class="text_rank">{{ hotKeyword.changeRank }}</b>
                                                        </template>
                                                        <template v-else-if="hotKeyword.changeType === 'N'">
                                                            <i
                                                                class="ico_rank-new"
                                                                title="신규"
                                                            />
                                                        </template>
                                                        <template v-else-if="hotKeyword.changeType==='D'">
                                                            <i
                                                                class="ico_rank-down"
                                                                title="하락"
                                                            />
                                                            <b class="text_rank">{{ hotKeyword.changeRank }}</b>
                                                        </template>
                                                        <template v-else>
                                                            <i
                                                                class="ico_rank-unchanged"
                                                                title="변동없음"
                                                            />
                                                        </template>
                                                    </a>
                                                </li>
                                            </ol>
                                        </div>
                                        <div class="m...list-foot">
                                            <p>{{ MMFilters.formatDate(hotKeywordsIndexedAt, 'YYYY.MM.DD HH:mm') }} 기준</p>
                                        </div>
                                    </section>
                                </div>
                                <!--// 인기 검색어 -->
                                <!-- best 아이템 -->
                                <section v-if="bestGoods.length > 0" class="m...result-best">
                                    <h3><b>BEST 아이템</b></h3>
                                    <div class="mm_scroller T=x">
                                        <div class="mm_product-list T=card">
                                            <ul>
                                                <li v-for="goods in bestGoods" :key="goods.id">
                                                    <MmGoods 
                                                        :goods="goods" 
                                                        :use-react-tag="true" 
                                                        :use-liked-button="true" 
                                                    />
                                                </li>  
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                                <!--// best 아이템 -->
                            </template>
                            <template v-else>
                                <div v-if="isCorrected" class="m...result-offer">
                                    <p><strong>{{ correctedKeyword }}</strong>(으)로 자동 변환된<br>검색 결과입니다</p>
                                    <a href="#" @click.prevent="loadNotCorrectedKeyword"><strong class="mm_text-variable">'{{ keyword }}'</strong><b>검색 결과 보기</b><i class="ico_link" /></a>
                                </div>
                                <!-- 연관 검색어 -->
                                <div v-if="relatedKeywords.length > 0" class="m...result-keyword">
                                    <div class="mm_scroller T=x">
                                        <ul>
                                            <li v-for="relatedKeyword in relatedKeywords" :key="relatedKeyword">
                                                <button type="button" @click="relatedKeywordSearch(relatedKeyword)">
                                                    <b>{{ relatedKeyword }}</b>
                                                </button>
                                            </li>                                
                                        </ul>
                                    </div>
                                </div>
                                <!--// 연관 검색어 -->
                                <MMLink
                                    v-if="searchKeywordRelationBrand !== null"
                                    class="btn_brandshop"
                                    :to="{ name: 'GoodsBrandIndex', params: { id: searchKeywordRelationBrand.id }}"
                                >
                                    <strong>{{ searchKeywordRelationBrand.name }}</strong><b>브랜드샵 가기<i class="ico_link" /></b>
                                </MMLink>

                                <FilteredGoods
                                    :goods-list="goodsList" 
                                    :sorting="searchFilters.sorting" 
                                    :is-loading="isLoading"
                                    :total-count="totalCount"
                                    :init-page="initPage"
                                    :is-page-ready="isPageReady"
                                    :per-page="searchFilters.perPage"
                                    :search-keyword="keyword"
                                    v-bind="filter"                                    
                                    @query-sync="querySync"
                                    @apply-filter="changeFilter"
                                    @change-sort="changeSort"
                                    @page-required="loadPage"
                                    @page-on-view-changed="setPageOnView"
                                />
                            </template>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </div>
    <!--// 내용 -->
    </div>
</template>

<script lang="ts">
import { Paginator } from '$/@type';
import { Goods } from '$/@type/goods';
import { FilterCategory, FilterBrand, CommonGoodsFilter, CommonFilter } from '$/@type/searchFilter';
import { mmon } from '$/helper/mmon';
import { searchRepository } from '$/repository/searchRepository';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { defineComponent, ref, onMounted, computed } from 'vue';
import FilteredGoods from '@/components/goods/FilteredGoods.vue';
import { useRoute, useRouter } from 'vue-router';
import { makePath } from '$/services/http';
import { defaultCatch } from '$/functions';
import { HotKeyword } from '$/@type/front';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useViewGoodsList } from '$/composables/marketingComposable'
import { useSearchPageContext } from '$/composables/searchComposable';
import { useRecentKeywords } from '$/composables/shoppingComposable';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        keyword: string
    }
}

export default defineComponent({
    components: {
        FilteredGoods,        
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.keyword = `${to.query.keyword}`
        })
    },    
    setup() {
        const { clearContext } = useSearchPageContext();
        const { addRecord } = useRecentKeywords();

        const route = useRoute();
        const router = useRouter();
        usePageTitleSetting(`'${route.query.keyword}' 검색결과`);
        
        const categories = ref<FilterCategory[]>([]);
        const brands = ref<FilterBrand[]>([]);
        const isEmptySearchResult = computed(() => {
            return goodsList.value.length < 1 && !isFilterChanged.value
        })
        const hotKeywordsIndexedAt = ref('');
        const hotKeywords = ref<HotKeyword[]>([]);

        const isCorrected = ref(false);
        const relatedKeywords = ref<string[]>([]);
        const correctedKeyword = ref('');
        const doNotCorrect = ref(false);
        const searchKeywordRelationBrand = ref<{
            id: number;
            name: string;
            korName: string;
            engName: string;
        }|null>(null);
        
        const keyword = ref('');
        const isFilterChanged = ref(false);
        const isLoading = ref(true);
        const totalCount = ref(0);

        const isPageReady = ref(false)
        const initPage = ref(1)

        const itemsByPage = ref<Array<(Goods|null)[]>>([])
        const goodsList = computed(() => {
            /**
             * 평탄화된 상품 배열
             */
            return itemsByPage.value.flatMap((itemsInPage) => {
                return itemsInPage
            })
        })

        const loadingPages = ref<number[]>([]); 
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
                await Promise.all(
                    pagesNeedLoad.map(async page => {
                        const filterForSearch = {...searchFilters.value}
                        filterForSearch.page = page;

                        const { 
                            paginator, 
                            goodsIds, 
                            bestGoods: fetchedBestGoods, 
                            filters,
                            isCorrected: is_corrected,
                            relatedKeywords: related_keywords,
                            correctedKeyword: corrected_keyword,
                            brand
                        } = await searchRepository.searchKeyword(
                            keyword.value, 
                            filterForSearch,
                            doNotCorrect.value
                        );

                        itemsByPage.value[page] = paginator.data
                        totalCount.value = paginator.total
                        await shoppingRepository.getRelationLikedGoods(goodsIds)
                        bestGoods.value = fetchedBestGoods
                        if (filterPropertyNeedChange.value) {
                            filter.value = filters;
                            filterPropertyNeedChange.value = false;
                        }
                        
                        isCorrected.value = is_corrected;
                        relatedKeywords.value = related_keywords;
                        correctedKeyword.value = corrected_keyword;
                        searchKeywordRelationBrand.value = brand;
                    })
                )
            } catch (e) {
                defaultCatch(e)
            } finally {
                isLoading.value = false
                loadingPages.value = loadingPages.value.filter(lp => !pagesNeedLoad.some(needLoadPage => needLoadPage === lp))
            }
        }

        /** 
         * 필터 처리 
         */
        const filter = ref<CommonFilter>({
            categories: [],
            brands: [],
            fitSizes: [],
            shoesSizes: [],
            colors: [],            
            gender: 'N'    
        })
    
        interface SearchGoodsFilter extends CommonGoodsFilter
        {
            keyword: string
        }
        const searchFilters = ref<SearchGoodsFilter>({
            page: 1,
            perPage: 100,
            sorting: 'selling',
            categoryCodes: [],
            brandIds: [],
            minPrice: 0,
            maxPrice: 0,
            reviewRates: [],
            colorIds: [],            
            fitIds: [],
            shoesSizeIds: [],
            onlyFreeDelivery: false,
            onlySale: false,
            exceptSoldout: false,
            keyword: keyword.value,
        });    
            
        const searchGoodsPaginator = ref<Paginator<Goods>>({
            total: 0,
            currentPage: 1,
            perPage: 100,
            data: []
        });

        const bestGoods = ref<Goods[]>([]);
        const filterPropertyNeedChange = ref(true);

        async function changeFilter(filter: CommonGoodsFilter) {
            const filterForSearch: SearchGoodsFilter = {...filter, keyword: keyword.value}            
            searchFilters.value = filterForSearch
            searchFilters.value.page = 1

            itemsByPage.value = []
            await loadPage(1)
            isFilterChanged.value = true;
            router.replace(makePath(route.path, searchFilters.value))
        }

        function setPageOnView(currentPage: number, oldPage: number) {
            /**
             * page on view 를 갱신 (단순 쿼리스트링 처리용)
             */
            const filter = {...searchFilters.value}
            filter.page = currentPage
            router.replace(makePath(route.path, filter));
        }
    
        async function querySync(searchFilter: CommonGoodsFilter) {            
            const initFilter: SearchGoodsFilter = {...searchFilter, keyword: keyword.value}
            searchFilters.value = initFilter;

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

            await loadPage([
                initPage.value - 1,
                initPage.value
            ].filter(page => page > 0))
            isPageReady.value = true

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
                searchWord: keyword.value,
            })
        }
    
        async function changeSort(sorting: string) {
            searchFilters.value.sorting = sorting
            searchFilters.value.page = 1

            itemsByPage.value = []
            await loadPage(1)
            router.replace(makePath(route.path, searchFilters.value))
        }

        async function searchStart(searchKeyword: string) {                
            if (searchKeyword === '') {
                return mmon.bom.alert('검색어를 입력하세요');
            }
                
            keyword.value = searchKeyword;
            if (isLoading.value === true)  {
                return;
            }

            resetFilter();
            addRecentKeyword();
                
            itemsByPage.value = []
            await loadPage(1)
            router.replace({ query: { keyword: searchKeyword } });  
        }

        function addRecentKeyword() {
            addRecord(keyword.value);                
        }

        function resetFilter() {
            searchFilters.value = {
                page: 1,
                perPage: 100,
                sorting: 'selling',
                categoryCodes: [],
                brandIds: [],
                minPrice: 0,
                maxPrice: 0,
                reviewRates: [],
                colorIds: [],            
                fitIds: [],
                shoesSizeIds: [],
                onlyFreeDelivery: false,
                onlySale: false,
                exceptSoldout: false,
                keyword: keyword.value,
            };    
        }

        async function loadNotCorrectedKeyword() {
            doNotCorrect.value = true;
            itemsByPage.value = [];
            await loadPage(1);
        }

        async function relatedKeywordSearch(relatedKeyword: string) {
            resetFilter();
            itemsByPage.value = [];
            keyword.value = relatedKeyword;            
            await loadPage(1);
            addRecentKeyword();
        }

        /**
         * 검색어 입력 페이지로 이동
         */
        function toSearchReady() {            
            router.replace({
                name: 'Search',
            });
        }
        
        onMounted(async() => {       
            //     
            const { indexedAt, hotKeywords: hotKeywordList } = await searchRepository.getHotKeywords();
            hotKeywordsIndexedAt.value = indexedAt;
            hotKeywords.value = hotKeywordList;
        });

        return {
            isEmptySearchResult,
            searchGoodsPaginator,
            goodsList,
            bestGoods,
            searchFilters,                        
            categories,
            brands,
            querySync,            
            changeFilter,
            changeSort,
            filter,
            totalCount,
            keyword,
            searchStart,
            setPageOnView,
            isPageReady,
            loadPage,
            initPage,
            isLoading,
            hotKeywords,
            hotKeywordsIndexedAt,
            isCorrected,
            relatedKeywords,
            correctedKeyword,
            loadNotCorrectedKeyword,
            relatedKeywordSearch,
            searchKeywordRelationBrand,
            toSearchReady,
        }
    }
})
</script>
