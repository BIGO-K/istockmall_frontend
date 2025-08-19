<template>
    <div class="mm_page-content">
        <div class="mm_inner">
            <!-- 검색결과 -->
            <div class="m_searched-head">
                <h3><strong>‘{{ keyword }}’</strong><b>검색완료</b><span v-if="!isSearchLoading">{{ MMFilters.formatNumber(searchGoodsPaginator.total) }}</span></h3>
                <template v-if="searchGoodsPaginator.total > 0">
                    <!-- 검색어 제안 -->
                    <div v-if="searchResult?.isCorrected" class="m_searched-head-offer">
                        <p><strong>{{ searchResult.correctedKeyword }}</strong>(으)로 자동 변환된 검색 결과입니다</p>
                        <a href="#" @click.prevent="getSearchResult(true)"><strong class="mm_text-variable">‘{{ keyword }}’</strong><b>검색결과 보기</b><i class="ico_link T=sm" /></a>
                    </div>
                    <!--// 검색어 제안 -->
                    <!-- 브랜드샵 -->
                    <MMLink
                        v-if="searchResult?.brand !== null && searchResult?.brand.id"
                        class="mm_btn T=xs T=line T=dark btn_brandshop"
                        :to="{ name: 'GoodsBrandIndex', params: { id: searchResult?.brand.id }}"
                    >
                        <i class="ico_shop" /><b>{{ searchResult?.brand.name }} 브랜드샵 가기</b><i class="ico_link T=sm" />
                    </MMLink>
                
                    <!--// 브랜드샵 -->
                    <!-- 연관검색어 -->
                    <section v-if="searchResult?.relatedKeywords && searchResult?.relatedKeywords.length > 0" class="m_searched-head-keyword">
                        <h4><b>연관검색어</b></h4>
                        <ul>
                            <li v-for="relatedKeyword in searchResult?.relatedKeywords" :key="relatedKeyword">
                                <a href="#" @click.prevent="relatedFetch(relatedKeyword)">
                                    {{ relatedKeyword }}
                                </a>                            
                            </li>                      
                        </ul>
                    </section>
                    <!--// 연관검색어 -->
                </template>
            </div>
            <!--// 검색결과 -->
            <template v-if="needHotKeywords">
                <!-- 결과 없음 -->
                <div class="m_searched-none">
                    <!-- 인기 검색어 -->
                    <section class="m_searched-none-popular">
                        <h5><b>인기 검색어</b></h5>
                        <ol>
                            <li
                                v-for="hotKeyword in hotKeywords"
                                :key="hotKeyword.keyword"
                            >
                                <MMLink
                                    :to="{ name: 'SearchResult', query: { keyword: hotKeyword.keyword }}"
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
                                </MMLink>
                            </li>
                        </ol>
                        <p class="text_update">
                            <span>{{ MMFilters.formatDate(hotKeywordsIndexedAt, 'YYYY.MM.DD HH:mm') }}</span>기준
                        </p>
                    </section>
                    <!--// 인기 검색어 -->
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
                </div>
                <!--// 결과 없음 -->

                <!-- best 아이템 -->
                <section
                    v-if="bestGoods.length > 0"
                    class="m_searched-best"
                >
                    <h5><b>BEST 아이템</b></h5>
                    <div class="mm_product-list">
                        <component 
                            :is="Slider"
                            :items="bestGoods"
                            :use-control="true"
                        >
                            <template #item="{ item }">
                                <MmGoods
                                    :goods="item"
                                    :use-react-tag="true"                                    
                                    :use-liked-button="true"                                    
                                />                                                                                    
                            </template>
                        </component>
                    </div>
                    <!-- <a href="#" class="btn_more"><b>더보기</b><i class="ico_more"></i></a> -->
                </section>
                <!--// best 아이템 -->
            </template>
            <template v-else>
                <Filter
                    v-bind="filters"
                    :search-form="searchForm"
                    @apply-filter="applyFilter"                    
                />

                <!--// 필터검색 -->
                <filtered-goods 
                    :goods-paginator="searchGoodsPaginator" 
                    :sorting="searchForm.sorting" 
                    :is-loading="isSearchLoading"
                    :total-count="searchGoodsPaginator.total"
                    :search-keyword="keyword"
                    @move-page="movePage" 
                    @sort-update="sortUpdate"
                />
            </template>
        </div>
    </div>
</template>


<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';
import { ref, watch, watchEffect } from 'vue';
import Filter from '@/components/filter/Filter.vue'
import FilteredGoods from '@/components/filter/FilteredGoods.vue';
import Slider from '@/components/Slider.vue';
import { useViewGoodsList } from '$/composables/marketingComposable';
import { searchRepository } from '$/repository/searchRepository';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { CommonGoodsFilter } from '$/@type/searchFilter';
import { onBeforeRouteLeave } from 'vue-router';
import { makePath } from '$/services/http';
import { useHotKeywords, useSearch } from '$/composables/searchComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { defaultCatch } from '$/functions';

/**
 * VARIABLE
 */
const keyword = useRouteQuery<string>('keyword', '');

// 상품 검색어에 대한 결과처리 
const needHotKeywords = ref<boolean>(false);
const isSearchLoading = ref(false);
const {
    router,
    route,
    mmon
} = usePageContext();


const { 
    bestGoods,
    searchResult, 
    searchForm,
    filters,
    searchGoodsPaginator, 
    changeSearchKeyword,
    search
} = useSearch();

const { hotKeywordsIndexedAt, hotKeywords, getHotKeywords } = useHotKeywords();


async function getSearchResult(isFilterNeedSet: boolean) {
    isSearchLoading.value = true;
    mmon.loading.show();
    try {
        if (isFilterNeedSet) {
            await changeSearchKeyword(keyword.value);
        } else {
            await search(false);
        }
        
        if (searchGoodsPaginator.value.total > 0) {
            needHotKeywords.value = false;
        }

        isSearchLoading.value = false;
        // 마케팅
        useViewGoodsList({
            account: 'base',
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            goodsIds: searchGoodsPaginator.value.data.slice(0, 3).map(goods => goods.id),
            searchWord: keyword.value,
        })

        router.replace(makePath(
            route.path, 
            Object.assign({ keyword: keyword.value }, searchForm.value))
        );

    } catch(e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}
/**
 * 연관검색어 검색 이벤트 
 * @param relateKeyword 
 */
async function relatedFetch(relateKeyword: string) {
    keyword.value = relateKeyword;
}

/**
 * 필터 적용 이벤트 
* @param filter 
*/
async function applyFilter(filter: CommonGoodsFilter) {
    searchForm.value = filter;
    movePage(1);
    
}

async function movePage(page: number) {
    searchForm.value.page = page;
    await getSearchResult(false);
}

async function sortUpdate(sorting: string) {
    searchForm.value.sorting = sorting;
    searchForm.value.page = 1;
    
    mmon.loading.show()
    try {
        searchResult.value = await searchRepository.searchKeyword(keyword.value, searchForm.value);            
        searchGoodsPaginator.value = searchResult.value.paginator;
        shoppingRepository.getRelationLikedGoods(searchResult.value.goodsIds);        
        router.replace(makePath(router.currentRoute.value.path, Object.assign({
            keyword: keyword.value
        }, searchForm.value)));
    } catch (e) {
        
    } finally {
        mmon.loading.hide();
    }
}

/**
 * VUE LIFE CYCLE
*/
watch(() => route.query.keyword, async() => {
    if (!route.query.keyword) {
        return;
    }
    keyword.value = `${route.query.keyword}`
    await getSearchResult(true);
    if (searchGoodsPaginator.value.total < 1) {
        needHotKeywords.value = true;
        getHotKeywords();
    }
});


const initializeWatcher = watchEffect(async() => {
    await getSearchResult(true);
    if (searchGoodsPaginator.value.total < 1) {
        needHotKeywords.value = true;
        getHotKeywords();
    }
})

initializeWatcher();

onBeforeRouteLeave(() => {
    const headerSearchClearButton = document.getElementById('header_search_clear');
    if (!headerSearchClearButton) {
        return
    }
    headerSearchClearButton.click();
});
    
</script>