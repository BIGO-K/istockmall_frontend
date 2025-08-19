<template>
    <div class="mm_view L=popup L=search">
        <!-- 헤더 -->
        <MMHeader>
            <template #customLSide>
                <i class="ico_search"><b class="mm_ir-blind">검색</b></i>
            </template>
            <template #search>
                <MMInput
                    v-model="searchKeyword"
                    type="search"
                    :use-trim="false"
                    :placeholder="'검색어를 입력하세요'"
                    @keyup.prevent="searchAuto"
                    @keydown.enter.prevent="searchKeywordEnter"
                />
            </template>
        </MMHeader>
        <!--// 헤더 -->

        <!-- 내용 -->
        <div id="mm_body" class="mm_page">
            <!-- (D) 실제 내용을 추가하는 부분입니다. -->
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 상품 및 검색어 -->
                        <Carousel
                            v-if="isKeywordFetch"
                            :use-custom-pagination="true"
                            :use-pagination="true"
                            :is-force-update="true"
                            :use-count="false"
                            :use-copy="true"
                            :carousel-data="{
                                _index : carouseIndex,
                                _isMoreSide: true,
                                _autoDelay: 4,
                                onComplete : carouselIndexChange,
                            }"
                            class="m_popup-search"
                            :items="[]"
                        >
                            <template #additionalItem="additionalData">
                                <!-- 최근 본 상품 -->
                                <li 
                                    data-index="0"
                                    class="mm_carousel-item"
                                    :class="additionalData?.className"
                                    :tabindex="additionalData?.tabIndex"
                                >
                                    <section class="m_popup-search-list">
                                        <h3><b>최근 본 상품</b></h3>
                                        <template v-if="recentViewGoods.length > 0">
                                            <div class="mm_scroller">
                                                <div class="mm_product-list T=sm">
                                                    <ul>
                                                        <li v-for="goods in recentViewGoods" :key="goods.id">
                                                            <div class="mm_product-item">
                                                                <MMLink :to="{ name: 'GoodsDetail', params: { id : goods.id}}">
                                                                    <figure>
                                                                        <i
                                                                            v-lazyload="{ src: goods.thumbnailUrl}"
                                                                            :data-lazyload="`{ '_src': '${goods.thumbnailUrl}' }`"
                                                                            class="mm_bg-cover image_product"
                                                                        />
                                                                        <figcaption>
                                                                            <p class="text_product">
                                                                                {{ goods.name }}
                                                                            </p>
                                                                            <p class="text_price">
                                                                                <strong>{{ MMFilters.formatNumber(goods.baseDiscountedPrice) }}</strong>
                                                                            </p>
                                                                        </figcaption>
                                                                    </figure>
                                                                </MMLink>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="m...list-foot">
                                                <MMLink class="btn_more" :to="{ name: 'RecentViewGoods' }">
                                                    <b>최근 본 상품 더보기</b><i class="ico_link" />
                                                </MMLink>
                                            </div>
                                        </template>
                                        <p v-else class="mm_text-none">
                                            <i class="ico_text-none" />최근 본 상품이 없습니다
                                        </p>
                                    </section>
                                </li>
                                <!--// 최근 본 상품 -->
                                <!-- 최근 검색어 -->
                                <!-- (D) 최근 검색어 삭제 시 mm_carousel-item의 clone 요소에서도 항목을 삭제해야 합니다. -->
                                <li 
                                    data-index="1"
                                    class="mm_carousel-item"
                                    :class="additionalData?.className"
                                    :tabindex="additionalData?.tabIndex"
                                >
                                    <section class="m_popup-search-list">
                                        <h3><b>최근 검색어</b></h3>
                                        <template v-if="recentSearchRecords.length < 1">
                                            <p class="mm_text-none">
                                                <i class="ico_text-none" />최근 검색내역이 없습니다
                                            </p>
                                        </template>
                                        <template v-else>
                                            <div class="mm_scroller">
                                                <ul>
                                                    <li v-for="recentSearchRecord in recentSearchRecords" :key="recentSearchRecord.keyword">
                                                        <a href="#" @click.prevent="search(recentSearchRecord.keyword)"><b>{{ recentSearchRecord.keyword }}</b></a>
                                                        <button type="button" class="btn_remove" @click="removeRecentSearchRecord(recentSearchRecord.keyword)">
                                                            <i class="ico_remove" /><b class="mm_ir-blind">삭제</b>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="m...list-foot">
                                                <button type="button" class="btn_remove-all" @click="clearRecentSearchRecords">
                                                    <b>최근 검색어 전체삭제</b><i class="ico_remove-trash" />
                                                </button>
                                            </div>
                                        </template>
                                    </section>
                                </li>
                                <!--// 최근 검색어 -->
                                <!-- 인기 검색어 -->
                                <li 
                                    data-index="2"
                                    class="mm_carousel-item"
                                    :class="additionalData?.className"
                                    :tabindex="additionalData?.tabIndex"
                                >
                                    <section class="m_popup-search-list">
                                        <h3><b>인기 검색어</b></h3>
                                        <div class="mm_scroller">
                                            <ol>
                                                <li v-for="hotKeyword in hotKeywords" :key="hotKeyword.keyword">
                                                    <a href="#" @click.prevent="search(hotKeyword.keyword)">
                                                        <b>{{ hotKeyword.keyword === '' ? '-' : hotKeyword.keyword }}</b>
                                                        <template v-if="hotKeyword.changeType === 'U'">
                                                            <i class="ico_rank-up" title="상승" />
                                                            <b class="text_rank">{{ hotKeyword.changeRank }}</b>
                                                        </template>
                                                        <template v-else-if="hotKeyword.changeType === 'N'">
                                                            <i class="ico_rank-new" title="신규" />
                                                        </template>
                                                        <template v-else-if="hotKeyword.changeType==='D'">
                                                            <i class="ico_rank-down" title="하락" />
                                                            <b class="text_rank">{{ hotKeyword.changeRank }}</b>
                                                        </template>
                                                        <template v-else>
                                                            <i class="ico_rank-unchanged" title="변동없음" />
                                                        </template>
                                                    </a>
                                                </li>
                                            </ol>
                                        </div>
                                        <div class="m...list-foot">
                                            <p>{{ MMFilters.formatDate(hotKeywordsIndexedAt, 'YYYY.MM.DD HH:mm') }} 기준</p>
                                        </div>
                                    </section>
                                </li>
                                <!--// 인기 검색어 -->
                            </template>
                            <template #pagination>
                                <li>
                                    <button type="button" class="btn_carousel-page">
                                        <b class="mm_ir-blind">최근 본 상품</b>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="btn_carousel-page">
                                        <b class="mm_ir-blind">최근 검색어</b>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" class="btn_carousel-page">
                                        <b class="mm_ir-blind">인기 검색어</b>
                                    </button>
                                </li>
                            </template>
                        </Carousel>
                        <!--// 상품 및 검색어 -->
                        <!-- 검색어 자동완성 -->
                        <div
                            v-if="searchKeyword !== ''"
                            :class="['mm_full m_popup-search-auto', { 'S=auto-on': searchAutoOn }]"
                        >
                            <div class="mm_scroller">
                                <div v-if="autoCompleteBrands.length > 0" class="m...auto-brand">
                                    <ul>
                                        <li v-for="brand in autoCompleteBrands" :key="brand.id">
                                            <MMLink
                                                :to="{ 
                                                    name: 'GoodsBrandIndex', 
                                                    params: { id: brand.id } }
                                                "
                                            >
                                                <figure>
                                                    <i v-lazyload="{ src: brand.logoImageUrl }" class="mm_bg-contain" />
                                                    <figcaption>
                                                        <b v-html="MMFilters.wrap(brand.korName, searchKeyword, `<strong class='mm_text-variable'>`, '</strong>')" />
                                                        <small>{{ brand.engName }}</small>
                                                    </figcaption>
                                                </figure>
                                                <span>브랜드<i class="ico_link" /></span>
                                            </MMLink>
                                        </li>
                                    </ul>
                                </div>
                                <ul v-if="autoCompleteCategories.length > 0">
                                    <li v-for="category in autoCompleteCategories" :key="category.code">
                                        <MMLink
                                            :to="{
                                                name: 'GoodsCategoryIndex',
                                                params: { id: category.code },
                                            }"
                                        >
                                            <b v-html="categoryKeywordWrapper(category.fullPath)" />                                            
                                        </MMLink>
                                    </li>
                                </ul>
                                <ul v-if="autoCompleteKeywords.length > 0">
                                    <li v-for="keyword in autoCompleteKeywords" :key="keyword">
                                        <a href="#" @click.prevent="search(keyword)">
                                            <b v-html="MMFilters.wrap(keyword, searchKeyword, `<strong class='mm_text-variable'>`, '</strong>')" />
                                            <i class="ico_link-arrow" />
                                        </a>
                                    </li>
                                </ul>
                                <!-- (D) 일치하는 검색어가 없을 경우 아래 영역을 노출합니다. -->
                                <ul v-if="autoCompleteCategories.length + autoCompleteKeywords.length + autoCompleteBrands.length < 1">
                                    <li>
                                        <p>일치하는 검색어가 없습니다<i class="ico_link-arrow" /></p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!--// 검색어 자동완성 -->
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </div>
    <!--// 내용 -->
    </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, onMounted, ref } from 'vue';
import { AutoCompleteKeyword, HotKeyword } from '$/@type/front';
import { typeCastNumber, wrap } from '$/filters';
import { searchRepository } from '$/repository/searchRepository';
import { useRecentKeywords, useRecentViewGoods } from '$/composables/shoppingComposable';
import { useSearchPageContext } from '$/composables/searchComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        hotKeywords: HotKeyword[]
        hotKeywordsIndexedAt: string
    }
}

export default defineComponent({
    components: {
        Carousel: defineAsyncComponent(() => import('@/components/Carousel.vue')),
    },
    async beforeRouteEnter (to, from, next) {
        const { indexedAt, hotKeywords: hotKeywordList } = await searchRepository.getHotKeywords();
        next((vm) => {
            vm.hotKeywords = hotKeywordList;
            vm.hotKeywordsIndexedAt = indexedAt;
        });
    },
    setup() {
        const {
            router,
            usePageTitleSetting,
            mmon,
            clearPageContext
        } = usePageContext();

        usePageTitleSetting('검색');
        
        const searchKeyword = ref('')
        const searchAutoOn = ref(false)
        const autoCompleteKeywords = ref<string[]>([])
        const autoCompleteCategories = ref<
        {
            name: string
            fullPath: string
            depth: number
            code: string
        }[]
        >([])
        const autoCompleteBrands = ref<AutoCompleteKeyword['brands']>([])

        const autoKeywordLoading = ref(false);

        const {
            recentSearchRecords,
            addRecord,
            removeRecentSearchRecord,
            clearRecentSearchRecords
        } = useRecentKeywords();
        
        const {
            recentViewGoods
        } = useRecentViewGoods();

        const { searchPageContext, applyContext } = useSearchPageContext();

       
        const isHotKeywordOpen = ref(false);
        const hotKeywordsIndexedAt = ref('');
        const hotKeywords = ref<HotKeyword[]>([]);
        const isKeywordFetch = ref(false);
        const carouseIndex = ref(1);

        function carouselIndexChange(changed: boolean) {
            if (changed) {
                carouseIndex.value = typeCastNumber((document.querySelector('.mm_carousel-item.S\\=on') as HTMLElement).dataset.index, 0);
                router.replace({ query: { recent_type : carouseIndex.value } });
            }
        }

        /**
         * 자동완성 검색어 조회
         * @param event 
         */
        async function searchAuto(event: KeyboardEvent) {
            if (event.key.toLocaleLowerCase() === 'enter') {
                return
            }
            if (searchKeyword.value.trim().length < 1) {    // 공백만 입력 시 일치하는 검색어 X 노출
                autoCompleteCategories.value = [];
                autoCompleteKeywords.value = [];
                autoCompleteBrands.value = [];
                return
            }
            if (searchKeyword.value === '' && event.key.toLowerCase() === 'backspace') {
                return (searchAutoOn.value = false)
            }
            if (searchKeyword.value !== '' && autoKeywordLoading.value === false) {
                searchAutoOn.value = true
                autoKeywordLoading.value = true
                const { categories, keywords, brands } = await searchRepository.getAutoComplete(searchKeyword.value)
                autoCompleteBrands.value = brands
                autoCompleteCategories.value = categories
                autoCompleteKeywords.value = keywords
                autoKeywordLoading.value = false
            }
        }

        /**
         * 최근검색어 store 저장
         * @param keyword 
         */
        async function addRecentSearchRecord(keyword: string) {
            if (keyword === '') {
                return;
            }

            addRecord(keyword);
        }

        /**
         * 검색어 입력시 검색 처리
         * @param event 
         */
        async function searchKeywordEnter(event: KeyboardEvent) {
            if (event.isComposing) {
                return
            }

            if (searchKeyword.value.trim().length < 1) {
                return mmon.bom.alert('검색어를 입력하세요');
            }

            (event.target as HTMLElement).blur();

            search(searchKeyword.value);
        }

        /**
         * 검색 처리
         * @param keyword 검색어
         */
        async function search(keyword?: string) {
            addRecentSearchRecord(keyword || searchKeyword.value);
            // 검색어 입력 페이지의 현재 캐러셀 index 저장
            applyContext({
                recentType: carouseIndex.value,
                keyword: keyword || searchKeyword.value
            })

            // 검색 결과 페이지 이동
            router.replace({
                name: 'SearchResult',
                query: {
                    keyword: keyword || searchKeyword.value,
                }
            });
        }

        function categoryKeywordWrapper(categoryFullPath: string) {
            const categories = categoryFullPath.split('>')
            const splitText = ref('')
            const categoryDepthSplitText = categories.map((categoryName, index) => {
                return (splitText.value + `${categoryName}` + (index !== categories.length - 1 ? `<i class="ico_depth"></i>` : '')).trim()
            })

            return wrap(categoryDepthSplitText.join(''), searchKeyword.value, '<strong class="mm_text-variable">', '</strong>')
        }        
        
        onMounted(async()=> {
            carouseIndex.value = searchPageContext?.value.recentType || 1
            searchKeyword.value = searchPageContext.value.keyword || '';
            isKeywordFetch.value = true;
            clearPageContext('/search');
        })

        return {
            isHotKeywordOpen,
            recentSearchRecords,
            removeRecentSearchRecord,
            clearRecentSearchRecords,
            recentViewGoods,
            hotKeywords,
            hotKeywordsIndexedAt,
            isKeywordFetch,
            carouselIndexChange,
            carouseIndex,
            searchKeywordEnter,
            addRecentSearchRecord,
            searchKeyword,
            searchAuto,
            autoCompleteCategories,
            autoCompleteKeywords,
            autoCompleteBrands,
            searchAutoOn,
            categoryKeywordWrapper,            
            search
        }
    }
})
</script>
