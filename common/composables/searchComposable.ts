import { HotKeyword, SearchPageContext, SearchResult } from "$/@type/front";
import { computed, ref, watch } from 'vue';
import { searchRepository } from '$/repository/searchRepository'
import { shoppingRepository } from "$/repository/shoppingRepository";
import { useSearchStore } from "$/store/search";
import { storeToRefs } from "pinia";
import { Paginator } from "$/@type";
import { Goods } from "$/@type/goods";
import { onBeforeRouteLeave } from "vue-router";
import { useFilterForm } from "$/composables/goods/filterComposable";
import { defaultCatch } from '$/functions';

/**
 * 인기 검색어 컴포저블 함수
 * @returns 
 */
export function useHotKeywords() {
    const hotKeywordsIndexedAt = ref('');
    const hotKeywords = ref<HotKeyword[]>([]);
    // const isFetched = ref(false);
    
    async function fetch() {
        const { indexedAt: indexed, hotKeywords: hotKeywordList } = await searchRepository.getHotKeywords();
        hotKeywordsIndexedAt.value = indexed;
        hotKeywords.value  = hotKeywordList;
       //  isFetched.value = true;
        return {
            hotKeywordsIndexedAt,
            hotKeywordList
        }
    }
  
    return {
        getHotKeywords: fetch,
        hotKeywordsIndexedAt,
        hotKeywords        
    }
}

/**
 * 검색용 함수
 */
export function useSearch() {

    const { searchForm, filters } = useFilterForm();
    const searchResult = ref<SearchResult|null>(null);
    const isNotNeedKeywordCorrected = false;
    const isSearchLoading = ref(false);
    const bestGoods = ref<Goods[]>([]);

    

    // 검색시 사용된 검색어 
    const searchKeyword = ref('');
    const searchGoodsPaginator = ref<Paginator<Goods>>({
        total: 0,
        currentPage: 1,
        perPage: 100,
        data: []
    })
    
    /*
        * 검색처리
        * @param {boolean} isFilterNeedSet : 필터 신규 여부
        * @param {boolean} isNotNeedKeywordCorrected : 검색어 보정 미사용 여부
    */
    async function search(needFilterChange: boolean) {
        try {
            searchResult.value = await searchRepository.searchKeyword(
                searchKeyword.value, 
                searchForm.value, 
                isNotNeedKeywordCorrected
            );
                
            
            if (needFilterChange) {
                filters.value = searchResult.value.filters;          
            }
            searchGoodsPaginator.value = searchResult.value.paginator;
            bestGoods.value = searchResult.value.bestGoods;
            const goodsIds = searchGoodsPaginator.value.data.map((data) => {
                return data.id
            })
            shoppingRepository.getRelationLikedGoods(goodsIds);
            
        } catch (e) {
            defaultCatch(e);
        } 
    }

    async function changeSearchKeyword(keyword: string) {
        // 초기 검색이 아닌 경우에만 필터폼 리셋 처리 
        if (searchKeyword.value !== '')  {
            filterFormReset();
        }
        searchKeyword.value = keyword;
        await search(true);
    }

    function filterFormReset() {
        filters.value = {
            categories: [],
            brands: [],
            fitSizes: [],
            shoesSizes: [],
            colors: [],            
            gender: 'N'    
        }

        searchForm.value = {
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
            exceptSoldout: false
        }
    }

    return {
        searchGoodsPaginator,
        bestGoods,
        searchForm,
        filters,
        searchResult,
        isSearchLoading,
        search,
        changeSearchKeyword
    }
}

/**
 * 기본 검색어 조회 
 * @returns 
*/
export function useBasicKeywords() {
    /** STORE **/
    const searchStore = useSearchStore();
    const { needRefreshBasicKeyword, basicKeywords } = storeToRefs(searchStore);
    /** //STORE **/

    /** VARIABLE **/   
    const basicKeyword = computed(() => {
        if (basicKeywords.value.length < 1) {
            return {
                text: '',
                customLink: null
            }
        }
        return basicKeywords.value[Math.floor(Math.random()* basicKeywords.value.length)]
    })
    /** //VARIABLE **/

    /** FUNC **/
    async function getBasicKeywords() {
        try {
            const basicKeywords = await searchRepository.fetchBasicSearchKeywords();
            searchStore.setBasicKeywords(basicKeywords);
        } catch(e) {
            console.error(e);
        }
    }
    /** //FUNC **/

    watch((needRefreshBasicKeyword), async(to, from) => {
        if (to) {
            await getBasicKeywords();
        }
    }, {
        immediate: true
    })

    return {
        basicKeyword        
    }
}

export function useSearchPageContext() {
    /** STORE **/
    const searchStore = useSearchStore();
    /** //STORE **/

    /** VARIABLE **/
    const searchPageContext = computed(() => {
        return searchStore.searchPageContext === null ? 
            {
                recentType: 1,
                keyword: ''
            } 
            : searchStore.searchPageContext
    })

    /** //VARIABLE **/

    /** FUNC **/
    function applyContext(context: SearchPageContext) {
        searchStore.applySearchPageContext(context)
    }

    function clearContext() {
        searchStore.applySearchPageContext(null);
    }
    /** //FUNC **/

    /** VUE LIFE CYCLE */
    onBeforeRouteLeave((to, from) => {
        if (to.name !== 'Search' && to.name !== 'SearchResult') {
            searchStore.applySearchPageContext(null);
        }
    });


    return {
        searchPageContext,
        applyContext,
        clearContext
    }
}