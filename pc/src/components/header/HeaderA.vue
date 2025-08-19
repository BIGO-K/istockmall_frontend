<template>
    <div
        ref="headerElement"
        :class="['mm_header T=ha', { 'S=header-sticky': needHeaderSticky, 'T=text-white': isFontWhite }]"
    >
        <div class="mm_inner">
            <h1>
                <router-link
                    :to="{ name: 'Main' }"
                    @click.prevent="mainPageReload"
                >
                    <b class="mm_ir-blind">{{ globalConfigs.shop.name }}</b>
                </router-link>
            </h1>
            <!-- 헤더 검색 -->
            <div
                class="mm_header-search"
                :class="{ 'S=search-on': isFocusingOnSearch }"
                @mouseenter="handleMouseEnter"
                @mouseleave="handleMouseLeave"
            >
                <!-- 검색영역 -->
                <div class="mm_header-search-form">
                    <div class="mm_form-text" :class="searchKeyword ? 'S=on' : ''">
                        <button
                            id="header_search_clear"
                            type="button"
                            class="btn_text-clear" 
                            @click="clearSearchKeyword"
                        >
                            <i class="ico_form-clear" /><b class="mm_ir-blind">지우기</b>
                        </button>
                        <label>
                            <input                                
                                ref="searchKeywordEl"
                                type="text"
                                class="textfield"
                                data-text
                                @input="autoComplete"
                                @keydown="handleSearchKeywordKeydownEvent"
                                @keyup="openSearchWord"
                                @click="(e) => {
                                    autoComplete(e)
                                    openSearchWord()
                                }"
                            >
                            <i class="bg_text" />
                            <span class="mm_ir-blind text_placeholder">검색어를 입력하세요</span>
                            <span
                                v-if="searchKeyword === '' && searchPlaceholder.text"
                                class="text_keyword"
                                v-text="`${searchPlaceholder.text}`"
                            />
                        </label>
                    </div>
                    <button type="button" class="btn_search" @click="keywordSearch">
                        <i class="ico_search" /><b class="mm_ir-blind">검색하기</b>
                    </button>
                    <input hidden>
                </div>
                <!-- 검색영역 -->

                <!-- 최근검색어 -->
                <div
                    ref="recentSearchKeywordEl"
                    :class="['mm_header-search-keyword', { 'S=search-on': isFocusingOnAutoCompletes }]"
                >
                    <h5><b>최근 검색어</b></h5>
                    <template v-if="recentSearchRecords.length > 0">
                        <ul>
                            <li v-for="(recentSearchRecord, index) in recentSearchRecords" :key="recentSearchRecord.keyword">
                                <MMLink
                                    :to="{
                                        name: 'SearchResult',
                                        query: { keyword: recentSearchRecord.keyword },
                                    }"
                                    :class="{
                                        'S=over': autoCompletes.focusOnRecentIndex == index,
                                    }"
                                    @click="() => {
                                        searchKeyword = recentSearchRecord.keyword;
                                        searchKeywordEl!.value = recentSearchRecord.keyword;
                                        closeSearchWord();
                                    }"
                                >
                                    <i class="ico_search T=sm" />
                                    <b v-text="recentSearchRecord.keyword" />
                                    <b class="text_date" v-text="MMFilters.formatDate(`${recentSearchRecord.recentSearchedAt}`, 'MM.DD')" />
                                </MMLink>
                                <button type="button" class="btn_remove" @click="removeRecentSearchRecord(recentSearchRecord.keyword)">
                                    <i class="ico_delete" />
                                    <b class="mm_ir-blind">삭제</b>
                                </button>
                            </li>
                        </ul>
                    </template>
                    <template v-else>
                        <!-- (D) 최근 검색어가 없을 경우 아래 내역 없음 문구를 노출합니 다. -->
                        <p class="mm_text-none">
                            <i class="ico_text-none" />최근 검색내역이 없습니다
                        </p>
                    </template>
                    <div class="mm_header...keyword-foot">
                        <button
                            v-if="recentSearchRecords.length > 0"
                            type="button"
                            class="btn_remove-all"
                            @click="clearRecentSearchRecords()"
                        >
                            <b>최근 검색어 전체삭제</b><i class="ico_delete" />
                        </button>
                        <button
                            type="button"
                            class="btn_close"
                            @click="closeSearchWord"
                        >
                            <b>닫기</b>
                            <i class="ico_close" />
                        </button>
                    </div>
                </div>
                <!--// 최근검색어 -->

                <!-- 추천 검색어 -->
                <div
                    ref="recommendSearchKeywordEl"
                    :class="[
                        'mm_header-search-auto',
                        { 'S=search-on': isFocusingOnAutoCompletes && searchKeyword !== '' }
                    ]"
                >
                    <template v-if="autoCompletes.categories.length + autoCompletes.keywords.length + autoCompletes.brands.length > 0">
                        <div v-if="autoCompletes.brands.length > 0" class="m...auto-brand">
                            <ul>
                                <li v-for="(brand, index) in autoCompletes.brands" :key="brand.id">
                                    <MMLink
                                        :to="{ name: 'GoodsBrandIndex', params: { id: brand.id } }"
                                        :class="{ 'S=over': autoCompletes.focusOnTab === 'brand' && autoCompletes.focusOnIndex === index }"
                                        @mouseover="autoCompletes.focusOnTab = 'brand'; autoCompletes.focusOnIndex = index"
                                        @mouseleave="autoCompletes.focusOnIndex = -1"
                                        @click="() => {
                                            searchKeywordEl!.value = '';
                                            closeSearchWord();
                                        }"
                                    >
                                        <figure>
                                            <i v-lazyload="{ src: brand.logoImageUrl }" class="mm_bg-contain" />
                                            <figcaption>
                                                <b v-html="MMFilters.wrap(brand.korName, searchKeyword, `<strong class='mm_text-variable'>`, '</strong>')" />
                                                <small>{{ brand.engName }}</small>
                                            </figcaption>
                                        </figure>
                                        <span>브랜드<i class="ico_link T=thick" /></span>
                                    </MMLink>
                                </li>
                            </ul>
                        </div>
                        <ul v-if="autoCompletes.categories.length > 0">
                            <li v-for="(category, index) in autoCompletes.categories" :key="index">
                                <MMLink
                                    :to="{ name: 'GoodsCategoryIndex', params: { id: category.code } }"
                                    :class="{ 'S=over': autoCompletes.focusOnTab === 'category' && autoCompletes.focusOnIndex === index }"
                                    @mouseover="autoCompletes.focusOnTab = 'category'; autoCompletes.focusOnIndex = index"
                                    @mouseleave="autoCompletes.focusOnIndex = -1"
                                    @click="() => {
                                        searchKeywordEl!.value = '';
                                        closeSearchWord();
                                    }"
                                >
                                    <b v-html="categoryKeywordWrapper(category.fullPath, category.depth)" />
                                </MMLink>
                            </li>
                        </ul>
                        <ul v-if="autoCompletes.keywords.length > 0">
                            <li v-for="(keyword, index) in autoCompletes.keywords" :key="index">
                                <MMLink
                                    :to="{ name: 'SearchResult', query: { keyword: keyword } }"
                                    :class="{ 'S=over': autoCompletes.focusOnTab === 'keyword' && autoCompletes.focusOnIndex === index }"
                                    @mouseover="autoCompletes.focusOnTab = 'keyword'; autoCompletes.focusOnIndex = index"
                                    @mouseleave="autoCompletes.focusOnIndex = -1"
                                    @mouseup="() => {
                                        searchKeyword = keyword;
                                        searchKeywordEl!.value = keyword;
                                        closeSearchWord();
                                    }"
                                >
                                    <b v-html="MMFilters.wrap(keyword, searchKeyword, `<strong class='mm_text-variable'>`, '</strong>')" />
                                </MMLink>
                            </li>
                        </ul>
                    </template>
                    <p v-else-if="searchKeyword !== ''" class="mm_text-none">
                        <i class="ico_text-none" />일치하는 검색어가 없습니다
                    </p>
                </div>
                <!--// 추천 검색어 -->
            </div>
            <!--// 헤더 검색 -->

            <!-- 인기 검색어 -->
            <div
                ref="hotKeywordElement"
                :class="['mm_header-popular', { 'S=switch-on' : isHotKeywordOpen}]"
            >
                <div 
                    class="mm_header-popular-inner"
                    @mouseleave="() => {
                        if (isHotKeywordOpen) {
                            hotKeywordCloseAndSetMotions();
                        }
                    }"
                >
                    <h4><b>인기검색어</b></h4>
                    <ol>
                        <li
                            v-for="hotKeyword in hotKeywords"
                            :key="hotKeyword.keyword"
                        >
                            <MMLink
                                :to="{ name: 'SearchResult', query: { keyword: hotKeyword.keyword }}"
                                @click="() => {
                                    addRecentSearchRecord(hotKeyword.keyword);
                                    hotKeywordCloseAndSetMotions();
                                    searchKeyword = hotKeyword.keyword;
                                    searchKeywordEl!.value = hotKeyword.keyword;
                                }"
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
                                    <b class="text_rank">{{ Math.abs(hotKeyword.changeRank) }}</b>
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
                    <p class="text_date">
                        {{ MMFilters.formatDate(hotKeywordsIndexedAt, 'YYYY.MM.DD HH:mm') }}기준
                    </p>
                    <button
                        type="button"
                        class="btn_more"
                        title="인기검색어 더보기"
                        @click="hotKeywordOpenAndKillMotions"
                    >
                        <i class="ico_dropdown" />
                    </button>
                    <button
                        type="button"
                        class="btn_close"
                        @click="hotKeywordCloseAndSetMotions"
                    >
                        <i class="ico_close" /><b class="mm_ir-blind">인기검색어 접기</b>
                    </button>
                </div>
            </div>
            <!--// 인기 검색어 -->

            <!-- 헤더 바로가기 -->
            <div class="mm_header-quick">
                <div class="mm_header-quick-menu">
                    <ul class="mm_flex">
                        <li>
                            <MMLink :to="{ name: 'BrandMap'}">
                                <strong>브랜드맵</strong>
                            </MMLink>
                        </li>
                    </ul>
                    <div class="mm_header...menu-member">
                        <ul class="mm_flex">
                            <li v-if="!isUser">
                                <MMLink :to="{ name : 'Join' }">
                                    <b>회원가입</b>
                                </MMLink>
                                <MMLink :to="{ name : 'Login' }">
                                    <b>로그인</b>
                                </MMLink>
                            </li>
                            <li v-else>
                                <a
                                    href="#"
                                    @click.prevent="logout"
                                >
                                    <b>로그아웃</b>
                                </a>
                            </li>
                            <li>
                                <MMLink :to="{ name: 'CsCenter' }">
                                    <b>고객센터</b>
                                </MMLink>
                            </li>
                        </ul>
                    </div>
                </div>
                        
                <ul>
                    <li>
                        <MMLink :to="{ name: 'Mypage' }">
                            <i class="ico_mypage" /><b class="mm_ir-blind">마이페이지</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink :to="{ name: 'Cart' }">
                            <i class="ico_cart" /><b class="mm_ir-blind">장바구니</b><strong class="text_count">{{ inCartGoodsCount }}</strong>                            
                        </MMLink>
                    </li>
                    <li>
                        <div
                            :class="['mm_header-quick-recent', recentViewGoodsClassSwitchOn ? switchOnClassName : '']"
                            @mouseenter="handleMouseEnter"
                            @mouseleave="handleMouseLeave"
                        >
                            <button
                                type="button"
                                class="mm_switch btn_recent"
                                title="펼쳐보기"
                                @click="recentViewGoodsClassSwitchOn = !recentViewGoodsClassSwitchOn"
                            >
                                <i
                                    class="mm_bg-cover image_recent"
                                    :class="[mostRecentGoodsThumbnailUrl !== '' ? 'S=loaded' : 'S=error']"
                                    :style="mostRecentGoodsThumbnailUrl !== '' ? `background-image: url(${mostRecentGoodsThumbnailUrl});` : ''"
                                />
                                <b class="mm_ir-blind">최근본상품</b>
                            </button>
                            <div class="mm_header...recent-list">
                                <ul
                                    v-if="recentViewGoodsRecords.length > 0"
                                    class="mm_scroller"
                                >
                                    <li
                                        v-for="recentViewGood in recentViewGoodsRecords"
                                        :key="recentViewGood.id"
                                        class="mm_product-item T=single T=sm"
                                    >
                                        <MMLink
                                            :to="{
                                                name : 'GoodsDetail',
                                                params: { id: recentViewGood.id }
                                            }"
                                        >
                                            <figure>
                                                <div class="mm_image-scale">
                                                    <i
                                                        v-lazyload="recentViewGood.thumbnailUrl"
                                                        class="mm_bg-cover image_product"
                                                    />
                                                </div>
                                                <figcaption>
                                                    <p class="text_brand">
                                                        {{ recentViewGood.brandName }}
                                                    </p>
                                                    <p class="text_product">
                                                        {{ recentViewGood.name }}
                                                    </p>
                                                    <p class="text_price">
                                                        <strong>{{ MMFilters.formatNumber(recentViewGood.baseDiscountedPrice ) }}</strong>
                                                    </p>
                                                </figcaption>
                                            </figure>
                                        </MMLink>
                                    </li>
                                </ul>
                                <!-- (D) 최근 본 상품이 없을경우 아래 내용없음 문구를 노출합니다. -->
                                <p
                                    v-else
                                    class="mm_text-none T=sm"
                                >
                                    <i class="ico_text-none" />최근 본 상품이 없습니다
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!--// 헤더 바로가기 -->
        </div>
        <div class="mm_gnb">
            <div class="mm_inner">
                <!-- 카테고리메뉴 -->
                <HeaderCategories />
                <!--// 카테고리메뉴 -->
                <!-- 메뉴 + 사이드메뉴-->
                <HeaderGnb />                
                <!--// 메뉴 + 사이드메뉴-->
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { computed, ref, onBeforeMount, watch } from 'vue'
import HeaderCategories from '@/components/header/HeaderCategories.vue'
import HeaderGnb from '@/components/header/HeaderGnb.vue'
import { gsap } from 'gsap'
import { SearchAutoComplete } from '$/@type/front'
import { searchRepository } from '$/repository/searchRepository'
import { wrap } from '$/filters'
import { useScroll } from '@vueuse/core';
import { useBasicKeywords } from '$/composables/searchComposable'
import { useLogout } from '$/composables/auth/userComposable';
import { useRecentShopping } from '$/composables/shoppingComposable'
import { useHotKeywords } from '$/composables/searchComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const props = withDefaults(defineProps<{
    basicSearchKeyword: { text: string, customLink: string},
    sideBarElement: HTMLElement,
    isFontWhite: boolean
}>(),{
    basicSearchKeyword: () => {
        return {
            text: '',
            customLink: '',
        }
    },
    isFontWhite: false
}); 
const headerElement = ref<HTMLElement | null>(null)
const {
    route,
    router,
    mmon,
    isUser,
    globalConfigs
} = usePageContext();
   
const { basicKeyword } = useBasicKeywords();        
const { 
    recentSearchRecords, 
    recentViewGoodsRecords,
    inCartGoodsCount,
    mostRecentGoodsThumbnailUrl,
    addRecentSearchRecord, 
    removeRecentSearchRecord, 
    clearRecentSearchRecords 
} = useRecentShopping();

const { hotKeywords, hotKeywordsIndexedAt, getHotKeywords } = useHotKeywords();
getHotKeywords();


const { x: windowX, y: windowY } = useScroll(window, { behavior: 'smooth' });
const wingBanner = ref<HTMLElement|null>(props.sideBarElement?.querySelector('.mm_sidebar-wing'));
const sidBarAnchorInner = ref<HTMLElement|null>(props.sideBarElement?.querySelector('.mm_sidebar-anchors-inner'));
const sideBarAnchors = ref<NodeListOf<HTMLElement>>(props.sideBarElement?.querySelectorAll('[class*="btn_anchor"]'));

const headerElementHight = computed(() => {
    if (!headerElement.value) {
        return 0
    }

    return headerElement.value.clientHeight
})

const needHeaderSticky = computed(() => {
    if (!headerElement.value) {
        return false
    }
    return windowY.value > headerElementHight.value
})

const needSideBarHandle = computed(() => {
    if (!props.sideBarElement) {
        return false
    }

    return windowY.value > headerElementHight.value
});


// watch(windowX, () => {
//     if (wingBanner.value) {
//         if (props.sideBarElement?.classList.contains('S=sidebar-sm') && windowX.value > 0)  {
//             wingBanner.value.style.left = `-${windowX.value}px`;
//         } else {
//             wingBanner.value.style.left = '';
//         }
//     }
// })

watch(needSideBarHandle, (to, from) => {
    if (to) {
        gsap.to(sidBarAnchorInner.value, { height: 124, duration: 0.3, ease: 'sine.out' })
        gsap.to(sideBarAnchors.value, {
            autoAlpha: 1,
            duration: 0.2,
            delay: 0.2,
            ease: 'sine.out',
        })

        if (wingBanner.value) {
            wingBanner.value.animate({
                transform: [
                    'translate(0px, -157px)'
                ]
            }, {
                duration: 300,
                fill: 'forwards',
            });
        }
    } else {
        gsap.to(sidBarAnchorInner.value, { height: 76, duration: 0.3, ease: 'sine.inOut' })
        gsap.to(sideBarAnchors.value, { autoAlpha: 0, duration: 0.2, ease: 'sine.out' })
        if (wingBanner.value) {
            wingBanner.value.animate({
                transform: [
                    'translate(0px, 0px)'
                ]
            }, {
                duration: 300,
                fill: 'forwards',
            });
        }
    }    
})


// 스위치 클래스
const switchOnClassName = 'S=switch-on'
/**
 * [START] 검색관련
 */
// 검색어
const searchKeyword = ref<string>('');
// 기본 검색어
const searchPlaceholder = computed(() => {
    return {
        text: basicKeyword.value?.text,
        customLink: basicKeyword.value?.customLink,
    }
})
        
const isHotKeywordOpen = ref(false)
const hotKeywordElement = ref<HTMLElement | null>(null)

// 검색 영역 돔
const searchKeywordEl = ref<HTMLInputElement | null>(null)
const hotSearchInterval = ref<NodeJS.Timeout>()
// 최근 검색어 돔
const recentSearchKeywordEl = ref(null)
// 추천 검색어 돔
const recommendSearchKeywordEl = ref(null)
// 검색어 입력부분 포커싱 여부
const isFocusingOnSearch = ref(false)
// 마우스 엑션 관련
const mouseActionTimeoutId = ref<NodeJS.Timeout>()
        
// 검색처리
function keywordSearch() {
    if (!searchKeyword.value) {
        if (isFocusingOnSearch.value) {
            return mmon.bom.alert('검색어를 입력해주세요.');
        }
        // 검색어가 없으면 기본 검색어 처리
        if (!searchPlaceholder.value.text) {
            return mmon.bom.alert('검색어를 입력해주세요.');
        }
        if (searchPlaceholder.value.customLink) {
            router.push({ path: searchPlaceholder.value.customLink })
        } else {
            router.push({
                name: 'SearchResult',
                query: {
                    keyword: searchPlaceholder.value.text,
                },
            })
        }

        return addRecentSearchRecord(searchPlaceholder.value.text)
    }
    router.push({
        name: 'SearchResult',
        query: {
            keyword: searchKeyword.value,
        },
    })
    addRecentSearchRecord(searchKeyword.value)
}

function handleMouseEnter() {
    if (mouseActionTimeoutId.value) {
        clearTimeout(mouseActionTimeoutId?.value || 0)
    }
}
/**
 * MouseLeave 이벤트 핸들러
*/
function handleMouseLeave() {
    mouseActionTimeoutId.value = setTimeout(() => {
        isFocusingOnSearch.value = false
        isFocusingOnAutoCompletes.value = false
        closeSearchWord();
        recentViewGoodsClassSwitchOn.value = false
        categoryMenuClassSwitchOn.value = false
    }, 300)
}

/**
 * 검색어 영역 OPEN
*/
function openSearchWord() {
    isFocusingOnSearch.value = true
    isFocusingOnAutoCompletes.value = true
    gsap.to(recentSearchKeywordEl.value, { alpha: 1, height: 550, duration: mmon.time.faster, ease: 'cubic.inOut' })
    gsap.to(recommendSearchKeywordEl.value, { alpha: 1, height: 550, duration: mmon.time.faster, ease: 'cubic.inOut' })
}

/**
 * 검색어 영역 CLOSE
*/
function closeSearchWord() {
    isFocusingOnSearch.value = false
    isFocusingOnAutoCompletes.value = false
    gsap.to(recentSearchKeywordEl.value, { alpha: 0, height: 0, duration: mmon.time.faster, ease: 'cubic.inOut' })
    gsap.to(recommendSearchKeywordEl.value, { alpha: 0, height: 0, duration: mmon.time.faster, ease: 'cubic.inOut' })
}

/**
* 카테고리 경로에 키워드 하이라이트 처리
* @param {string} categoryFullPath
* @param {number} depth
*/
function categoryKeywordWrapper(categoryFullPath: string, depth: number): string {
    const categories = categoryFullPath.split('>')
    const splitText = ref('')
    const categoryDepthSplitText = categories.map((categoryName, index) => {
        return (splitText.value + `${categoryName}` + (index !== categories.length - 1 ? `<i class="ico_depth"></i>` : '')).trim()
    })

    return wrap(categoryDepthSplitText.join(''), searchKeyword.value, '<strong class="mm_text-variable">', '</strong>')
}
/**
 * [END] 최근 검색어 목록 / 제거() / 초기화()
 */

// 자동완성 관련 값
const autoCompletes = ref<{
    categories: { name: string; fullPath: string; depth: number; code: string }[]
    brands: { id: number; korName: string; engName: string; logoImageUrl: string }[]
    keywords: string[]
    timeoutId: NodeJS.Timeout | null
    focusOnTab: 'category' | 'keyword' | 'recentKeyword' | 'brand' | null
    focusOnIndex: number
    focusOnRecentIndex: number
}>({
    categories: [],
    brands: [],
    keywords: [],
    timeoutId: null,
    focusOnTab: null,
    focusOnIndex: -1,
    focusOnRecentIndex: -1,
})

const isFocusingOnAutoCompletes = ref(false)
const focusedAutoCompleteItem = computed<SearchAutoComplete | null>(() => {
    if (isFocusingOnAutoCompletes.value === false) {
        return null
    }

    if (autoCompletes.value.focusOnTab == 'category') {
        return {
            type: autoCompletes.value.focusOnTab,
            value: autoCompletes.value.categories[autoCompletes.value.focusOnIndex],
        }
    } else if (autoCompletes.value.focusOnTab == 'keyword') {
        return {
            type: autoCompletes.value.focusOnTab,
            value: autoCompletes.value.keywords[autoCompletes.value.focusOnIndex],
        }
    } else if (autoCompletes.value.focusOnTab == 'brand') {
        return {
            type: autoCompletes.value.focusOnTab,
            value: autoCompletes.value.brands[autoCompletes.value.focusOnIndex],
        }
    } else if (recentSearchRecords.value.length > 0) {
        return {
            type: 'recentKeyword',
            value: recentSearchRecords.value[autoCompletes.value.focusOnRecentIndex]?.keyword || '',
        }
    } 

    return {
        type: autoCompletes.value.focusOnTab,
        value: {},
    }
})

/**
 * 검색어 입력부 keydown 핸들러
 * @param {KeyboardEvent} event
 */
function handleSearchKeywordKeydownEvent(event: KeyboardEvent) {
    const eventTargetElement = event.target as HTMLInputElement

    if (event.isComposing) {
        return
    }

    switch (event.key) {
    case 'Down':
    case 'ArrowDown':
        event.preventDefault()
        event.stopPropagation()

        let nextIndex = autoCompletes.value.focusOnIndex + 1

        if (autoCompletes.value.focusOnTab === 'category') {
            // 카테고리 마지막 -> 키워드 처음 연결
            if (nextIndex >= autoCompletes.value.categories.length) {
                if (autoCompletes.value.keywords.length > 0) {
                    autoCompletes.value.focusOnTab = 'keyword'
                }
                nextIndex = 0
            }
        } else if (autoCompletes.value.focusOnTab === 'keyword') {
            if (nextIndex >= autoCompletes.value.keywords.length) {
                nextIndex = autoCompletes.value.keywords.length - 1
            }
        } else if (autoCompletes.value.focusOnTab === 'brand') {
            // 브랜드 마지막 -> 카테고리 / 키워드 처음 연결
            if (nextIndex >= autoCompletes.value.brands.length) {
                nextIndex = autoCompletes.value.brands.length - 1
                if (autoCompletes.value.categories.length > 0) {
                    autoCompletes.value.focusOnTab = 'category'
                } else if (autoCompletes.value.keywords.length > 0) {
                    autoCompletes.value.focusOnTab = 'keyword'
                }
                nextIndex = 0
            }
        } else {
            // 검색어가 없었던 경우 최근 검색어 있는 경우 해당 검색어로 처리
            if (recentSearchRecords.value.length > 0) {
                autoCompletes.value.focusOnRecentIndex =
                autoCompletes.value.focusOnRecentIndex === recentSearchRecords.value.length - 1
                    ? 0
                    : autoCompletes.value.focusOnRecentIndex + 1
                eventTargetElement.value = recentSearchRecords.value[autoCompletes.value.focusOnRecentIndex]?.keyword || ''
            }
        }

        autoCompletes.value.focusOnIndex = nextIndex
        if (focusedAutoCompleteItem.value?.value !== undefined) {
            eventTargetElement.value =
                focusedAutoCompleteItem.value.type === 'category'
                    ? focusedAutoCompleteItem.value.value.fullPath
                    : focusedAutoCompleteItem.value.type === 'brand'
                        ? focusedAutoCompleteItem.value.value.korName
                        : focusedAutoCompleteItem.value.value
        }
        break
    case 'Up':
    case 'ArrowUp':
        event.preventDefault()
        event.stopPropagation()
        let prevIndex = autoCompletes.value.focusOnIndex - 1
        if (autoCompletes.value.focusOnTab == 'category') {
            // 카테고리 처음 -> 브랜드 마지막 연결
            if (prevIndex < 0) {
                if (autoCompletes.value.brands.length === 0) {
                    prevIndex = prevIndex + 1
                } else {
                    autoCompletes.value.focusOnTab = 'brand'
                    prevIndex = autoCompletes.value.brands.length - 1
                }
            }
        } else if (autoCompletes.value.focusOnTab == 'keyword') {
            // 키워드 처음 -> 카테고리 / 브랜드 마지막 연결
            if (prevIndex < 0) {
                if (autoCompletes.value.categories.length > 0) {
                    autoCompletes.value.focusOnTab = 'category'
                    prevIndex = autoCompletes.value.categories.length - 1
                } else if (autoCompletes.value.brands.length > 0) {
                    autoCompletes.value.focusOnTab = 'brand'
                    prevIndex = autoCompletes.value.brands.length - 1
                } else {
                    prevIndex = prevIndex + 1
                }
            }
        } else if (autoCompletes.value.focusOnTab == 'brand') {
            if (prevIndex < 0) {
                prevIndex = 0
            }
        } else if (recentSearchRecords.value.length > 0) {
            // 검색어가 없었던 경우 최근 검색어 있는 경우 해당 검색어로 처리
            autoCompletes.value.focusOnRecentIndex = autoCompletes.value.focusOnRecentIndex < 1 
                ? recentSearchRecords.value.length - 1 
                : autoCompletes.value.focusOnRecentIndex - 1
        }

        // 검색키워드
        autoCompletes.value.focusOnIndex = prevIndex
        if (focusedAutoCompleteItem.value?.value !== undefined) {
            eventTargetElement.value = focusedAutoCompleteItem.value.type === 'category'
                ? focusedAutoCompleteItem.value.value.fullPath
                : focusedAutoCompleteItem.value.type === 'brand'
                    ? focusedAutoCompleteItem.value.value.korName
                    : focusedAutoCompleteItem.value.value
        }
        break
    case 'Enter':
        if (focusedAutoCompleteItem.value && focusedAutoCompleteItem.value.value) {
            // 선택된 포커스 아이템이 있는 경우
            if (focusedAutoCompleteItem.value.type == 'category') {

                router.push({
                    name: 'GoodsCategoryIndex',
                    params: { id: focusedAutoCompleteItem.value.value.code },
                })
                eventTargetElement.value = ''
            } else if (focusedAutoCompleteItem.value.type == 'brand') {
                router.push({
                    name: 'GoodsBrandIndex',
                    params: { id: focusedAutoCompleteItem.value.value.id },
                })
                eventTargetElement.value = ''
            } else if (focusedAutoCompleteItem.value.type == 'keyword') {
                router.push({
                    name: 'SearchResult',
                    query: {
                        keyword: eventTargetElement.value,
                    },
                })
            } else if (recentSearchRecords.value.length > 0) {
                router.push({
                    name: 'SearchResult',
                    query: {
                        keyword: eventTargetElement.value,
                    },
                })
            }
        } else {
            // 선택된 포커스 아이템이 없는 경우 기본 검색실행
            keywordSearch()
        }
    case 'Esc':
    case 'Escape':
        eventTargetElement.blur()
        isFocusingOnSearch.value = false
        isFocusingOnAutoCompletes.value = false
        autoCompletes.value.focusOnRecentIndex = -1
        autoCompletes.value.focusOnIndex = -1
        break
    default:
        if (eventTargetElement.value.trim().length < 1) {
            autoCompletes.value.focusOnRecentIndex = -1
            autoCompletes.value.focusOnIndex = -1
            autoCompletes.value.focusOnTab = 'recentKeyword'
            searchKeyword.value = ''
        }
        break
    }
}

/**
 * 자동완성 컨텍스트 처리
 * @param {Event} event
 */
function autoComplete(event: Event) {
    const inputElement = event.target as HTMLInputElement

    // input입력 후 첫번째 keydown이벤트에 element.value 변경 없어도 input 이벤트 트리거되는 경우 존재
    // input 값 변경여부 검사
    if (inputElement.value == searchKeyword.value) {
        return;
    }

    if (inputElement.value.trim().length < 1) {
        searchKeyword.value = ''
        autoCompletes.value.focusOnTab = 'recentKeyword'
        return
    }

    if (autoCompletes.value.timeoutId) {
        clearTimeout(autoCompletes.value.timeoutId)
    }
    const keyword = (searchKeyword.value = inputElement.value)

    // 검색값이 없다면 최근 검색어 노출
    if (keyword.length < 1) {
        autoCompletes.value.focusOnTab = 'recentKeyword'
        autoCompletes.value.focusOnIndex = -1
        return
    }

    setTimeout(async () => {
        autoCompletes.value.focusOnIndex = -1
        const autoCompleted = await searchRepository.getAutoComplete(keyword)
        autoCompletes.value.categories = autoCompleted.categories.slice(0, 3)
        autoCompletes.value.brands = autoCompleted.brands.slice(0, 3)
        autoCompletes.value.keywords = Object.values(autoCompleted.keywords).slice(0, 10) as string[]

        if (autoCompletes.value.brands.length > 0) {
            autoCompletes.value.focusOnTab = 'brand'
            return     
        }
        autoCompletes.value.focusOnTab = autoCompletes.value.categories.length > 0 ? 'category' : 'keyword'
    }, 200)
}
/**
 * [END] 검색관련
 */
      
// 최근본 상품 스위치 여부
const recentViewGoodsClassSwitchOn = ref(false)
const categoryMenuClassSwitchOn = ref(false)

/**
 * 인기 검색어 영역 Open & 모션 제거
 *
 */
function hotKeywordOpenAndKillMotions() {
    const hotKeywordsElement = hotKeywordElement.value?.querySelectorAll('ol > li');
    if (hotKeywordsElement === undefined || hotSearchInterval.value === undefined) {
        return;
    }

    isHotKeywordOpen.value = true;
    gsap.killTweensOf(hotKeywordsElement);
    clearInterval(hotSearchInterval.value);
    hotKeywordsElement.forEach(item => {
        item.setAttribute('style', '')
    });
}

/**
 * 인기 검색어 영역 Close & SET 모션
 *
 */
function hotKeywordCloseAndSetMotions() {
    const hotKeywordsElement = hotKeywordElement.value?.querySelectorAll('ol > li');
    if (hotKeywordsElement === undefined) {
        return;
    }

    if (hotSearchInterval.value !== undefined) {
        gsap.killTweensOf(hotKeywordsElement)
        clearInterval(hotSearchInterval.value)
        hotKeywordsElement.forEach(item => {
            item.setAttribute('style', '')
        })
        hotKeywordPlayIndex.value = 0
    }

    isHotKeywordOpen.value = false
    hotSearchInterval.value = setInterval(function () {
        if (!hotKeywordsElement[hotKeywordPlayIndex.value]) {
            return;
        }
        gsap.fromTo(hotKeywordsElement[hotKeywordPlayIndex.value], { y: '0%' }, { y: '-100%', duration: 0.3, ease: 'sine.inOut' })
        hotKeywordPlayIndex.value = hotKeywordPlayIndex.value === hotKeywordsElement.length - 1 ? 0 : hotKeywordPlayIndex.value + 1
        gsap.fromTo(hotKeywordsElement[hotKeywordPlayIndex.value], { y: '100%' }, { y: '0', duration: 0.3, ease: 'sine.inOut' })
    }, 4000)
}

function mainPageReload() {
    if (route.path == '/') {
        router.go(0)
    }
    return
}

// 로그 아웃 처리
async function logout() {      
    if (router.currentRoute.value.name === 'Main') {
        return useLogout();
    }
            
    router.push({ name: 'Main' }).then(async()=> {
        useLogout();
    });
}

/**
 * 검색어 clear
 */
function clearSearchKeyword() {
    searchKeyword.value = ''; 
    if (searchKeywordEl.value) {
        searchKeywordEl.value.value = '';
    }
}
/** FUNCTION */

/** VUE LIFE CYCLE */

/**
 * Life cycle
 * - 이벤트, 인터벌 제거
*/
onBeforeMount(() => {
    if (hotSearchInterval.value) {
        clearInterval(hotSearchInterval.value);
    }
})

const hotKeywordPlayIndex = ref(0)

// 인기검색어
watch(
    [hotKeywords],
    () => { hotKeywordCloseAndSetMotions(); },
    { flush: 'post' }
)

// 기본검색어
watch(
    [searchKeywordEl],
    () => {
        const keyword = String(route.query.keyword ||'');
        if (searchKeywordEl.value !== null) {
            searchKeyword.value = keyword;
            searchKeywordEl.value.value = keyword;
        }
    },
)

// 페이지 이동시 검색어 clear
watch(route, (to) => {
    if (to.name == 'SearchResult') {
        return;
    }
    clearSearchKeyword();
})

</script>
<style>
:root {
    --header_height_base: 167px;
    --header_height_sm: 72px;
}
</style>