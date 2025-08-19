<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>브랜드샵</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 브랜드샵 상단 영역 -->
                        <div class="m_brand-head">
                            <h3 class="text_brand">
                                <i v-lazyload="{ src: brandImageUrl, useErrorImage: false }" class="mm_bg-cover image_banner" />
                                <b>{{ brandInfo?.name }}</b>
                            </h3>
                            <p v-if="brandInfo?.mainText" class="text_main">
                                {{ brandInfo?.mainText }}
                            </p>
                            <p v-if="brandInfo?.subText" class="text_sub">
                                {{ brandInfo?.subText }}
                            </p>
                            <div class="m_brand-head-private">
                                <ul>
                                    <li>
                                        <button type="button" :class="['btn_like', { 'S=switch-on' : isWishBrand }]" @click="toggleWishBrand">
                                            <i class="ico_like" /><b>좋아요</b>
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" class="btn_sns-share" @click="handleSharedDim">
                                            <i class="ico_share" /><b>공유하기</b>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!--// 브랜드샵 상단 영역 -->

                        <!-- 쇼케이스 -->
                        <section v-if="(brandInfo?.brandContents || []).length > 0" class="m_brand-showcase">
                            <h4><b>SHOWCASE</b></h4>
                            <Carousel
                                :items="brandInfo?.brandContents"
                                :use-control="true"
                                :carousel-data="{
                                    _autoDelay: 4,
                                    _isMoreSide: true,
                                    _effect: 'cover'
                                }"
                            >
                                <template #item="{ item }">
                                    <MMLink :to="{ name: 'ShowcaseDetail', params: { id : item.id}}">
                                        <figure>
                                            <i v-lazyload="{ src: item.imageUrl }" class="mm_bg-cover image_banner" :data-lazyload="`{ '_src':  '${item.imageUrl}' }`" />
                                            <figcaption>
                                                <p class="text_title">
                                                    {{ item.title }}
                                                </p>
                                                <p class="text_main">
                                                    {{ item.mainText1 }}
                                                </p>
                                                <p class="text_main">
                                                    {{ item.mainText2 }}
                                                </p>
                                            </figcaption>
                                        </figure>
                                    </MMLink>
                                </template>
                            </Carousel>
                        </section>
                        <!--// 쇼케이스 -->

                        <!-- 큐레이션 -->
                        <section v-if="curationGroupGoods.length > 0" class="m_brand-curation">
                            <h4><b>BEST ITEM</b></h4>
                            <mm-goods
                                class="T=single" 
                                :goods="nowDisplayCurationGoods.mainCuration"
                                :use-react-tag="false"
                                :use-badges="false"
                                :is-show-price="false"
                                :use-liked-button="true"
                            />
                            <div class="mm_product-list T=card">
                                <!--
                                    (D) 찜한 아이템의 .btn_like 버튼에 'S=switch-on' 클래스와 '선택됨' 타이틀이 추가됩니다.
                                    data-switch 속성에 onChange(1번째 파라미터로 true/false 전달) 값으로 콜백을 설정할 수 있습니다.
                                -->
                                <ul>
                                    <li v-for="goods in nowDisplayCurationGoods.remain" :key="goods.name">
                                        <mm-goods
                                            :goods="goods"
                                            :hide-brand-name="true"
                                            :use-react-tag="false"
                                            :is-show-price="false"
                                            :use-badges="false"
                                            :use-liked-button="true"
                                        />
                                    </li>
                                </ul>
                            </div>
                            <div v-if="curationGroupGoods.length > 1" class="mm_btn_box">
                                <div class="mm_inline">
                                    <button type="button" class="mm_btn T=sm T=line T=dark" @click="curationMore">
                                        <b>새로운 상품 더보기</b><i class="ico_more-load" />
                                    </button>
                                </div>
                            </div>
                        </section>
                        <!--// 큐레이션 -->

                        <!-- 상품리스트 -->
                        <filtered-goods 
                            :goods-list="goodsList" 
                            :sorting="searchFilters.sorting" 
                            :is-loading="isLoading"
                            :total-count="totalCount"
                            :init-page="initPage"
                            :is-page-ready="isPageReady"
                            :per-page="searchFilters.perPage"
                            :is-use-recommended="brandInfo?.isUseRecommendedGoods"
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

                    <!-- 푸터 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>
            <!-- SNS 공유하기 -->
            <SharedDim v-if="sharedDimShow" @close="sharedDimShow = false" />
            <!-- // SNS 공유하기 -->
        </template>      
    </MMSub>
</template>

<script lang="ts">
import { computed, defineComponent, ref, defineAsyncComponent, watch } from 'vue';
import MMSub from '@/components/layout/Sub.vue';
import MMFooter from '@/components/Footer.vue';
import FilteredGoods from '@/components/goods/FilteredGoods.vue';
import { BrandShopInfo } from '$/@type/brand';
import { brandShopRepository } from '$/repository/goods/brandShopRepository';
import { wishRepository } from '$/repository/member/wishRepository';
import { CommonFilter, CommonGoodsFilter } from '$/@type/searchFilter';
import { typeCastNumber } from '$/filters';
import { useRoute, useRouter } from 'vue-router';
import { SimplePaginator } from '$/@type';
import { BaseGoods, Goods } from '$/@type/goods';
import { mmon } from '$/helper/mmon';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { defaultCatch } from '$/functions';
import { makePath } from '$/services/http';
import SharedDim from '@/components/SharedDim.vue';
import { useSnsShared } from '$/composables/shoppingComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useUserState } from '$/composables/auth/userComposable';

export default defineComponent({
    components: {
        MMSub,
        MMFooter,
        FilteredGoods,
        SharedDim,
        Carousel: defineAsyncComponent(() => import("@/components/Carousel.vue")),
    },
    async beforeRouteEnter(to, from, next) {
        const brandId = Number.parseInt(`${to.params.id}`);

        const [brand, likeRelations] = await Promise.all([
            brandShopRepository.brandInfo(brandId),
            wishRepository.getWishBrandRelation([brandId])
        ])

        next(vm => {
            vm.brandInfo = brand
            vm.isWishBrand = likeRelations.some(rel => rel.brandId == brandId && rel.liked)

            for (let i = 0; i < (brand.curations || []).length; i+=3) {
                vm.curationGroupGoods.push(brand.curations.slice(i, i+4));                    
            }
        })
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        usePageTitleSetting('브랜드샵');
        const sharedDimShow = ref(false);
        /**
         * 브랜드 정보
         */
        const brandId = typeCastNumber(`${route.params.id}`);
        const brandInfo = ref<BrandShopInfo>();
        const isWishBrand = ref(false);
        const brandImageUrl = computed(() => {
            return brandInfo.value?.topMobileImageUrl == undefined ? null : brandInfo.value.topMobileImageUrl;
        });
        /**
         * 회원 관련
         */
        const { isUser } = useUserState();
        /**
         * 상품 리스트 관련
         */
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

                    const { paginator, goodsIds } = await brandShopRepository.brandShopGoods(
                        brandId, 
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

        const brandGoodsPaginator = ref<SimplePaginator<Goods>>({            
            currentPage: 1,
            perPage: 100,
            data: []
        });

        /**
         * 큐레이션 상품 처리용
         */
        const selectedCurationIndex = ref(0);
        const nowDisplayCurationGoods = computed(() => {
            if (curationGroupGoods.value.length < 1) {
                return [];
            }

            return {
                mainCuration: curationGroupGoods.value[selectedCurationIndex.value][0],
                remain: curationGroupGoods.value[selectedCurationIndex.value].length > 1 
                    ? curationGroupGoods.value[selectedCurationIndex.value].slice(1, (curationGroupGoods.value[selectedCurationIndex.value].length)) 
                    : [],
            }
        });

        function curationMore() {
            mmon.loading.show();            
            if (selectedCurationIndex.value === curationGroupGoods.value.length - 1) {
                selectedCurationIndex.value = 0;
            } else {
                selectedCurationIndex.value = selectedCurationIndex.value + 1;
            }
            mmon.loading.hide();
        }

        /**
         * 정렬조건 변경 함수 
         */
        async function changeSort(sorting: string) {
            searchFilters.value.sorting = sorting
            searchFilters.value.page = 1

            itemsByPage.value = []
            await loadPage(1)
            router.replace(makePath(route.path, searchFilters.value))
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
                    brandShopRepository.filteredGoodsTotalCount(brandId, searchFilters.value),
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
         * 쿼리스트링과 동기화 처리
         * @param{CommonGoodsFilter} searchFilter : 필터정보
         */
        async function querySync(searchFilter: CommonGoodsFilter) {
            searchFilters.value = searchFilter;   

            if (brandInfo.value?.isUseRecommendedGoods) {
                if (route.query.sorting === 'brand_recommend' || !route.query.sorting) {
                    searchFilters.value.sorting = 'brand_recommend'
                }
            } else {
                if (route.query.sorting === 'brand_recommend') {
                    searchFilters.value.sorting = 'selling'
                }
            }
            
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
                brandShopRepository.filteredGoodsTotalCount(brandId, searchFilters.value),
                loadPage([
                    initPage.value - 1,
                    initPage.value,
                ].filter(page => page > 0))
            ])

            totalCount.value = fetchedTotalCount

            isPageReady.value = true

            filter.value = await brandShopRepository.commonFilter(brandId)
        }

        /**
         * 브랜드 찜처리
         */
        async function toggleWishBrand() {
            if (!isUser.value) {
                return mmon.bom.confirm("로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?", (flag: boolean) => {
                    if (!flag) {
                        return;
                    }

                    router.push({
                        name: "Login",
                        query: {
                            redirect_to_after: route.path,
                        },
                    });
                });
            }

            mmon.loading.show();
            try {
                if (isWishBrand.value) {
                    await wishRepository.deleteBrand(brandId);
                    isWishBrand.value = false;
                } else {
                    await wishRepository.addWishBrand(brandId);
                    isWishBrand.value = true;
                }
                
            } catch (e) {
                defaultCatch(e);
            } finally {
                mmon.loading.hide();
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

        const curationGroupGoods = ref<BaseGoods[][]>([]);

        const { shareDimOpen } = useSnsShared();
            
        function handleSharedDim(event: MouseEvent) {
            if (!brandInfo.value) {
                return
            }

            shareDimOpen(event, brandInfo.value.name, `${brandInfo.value.mainText ?? ''}#브랜드샵`, brandInfo.value.topMobileImageUrl);
            sharedDimShow.value = true;
        }
        

        watch(() => brandInfo.value?.name, (brandShopName) => {
            if (!brandShopName) {
                return;
            }
            usePageTitleSetting(`${brandShopName} 브랜드샵`);
        })

        return {
            brandInfo,
            isWishBrand,
            brandImageUrl,
            brandGoodsPaginator,
            searchFilters,
            isLoading,
            totalCount,
            changeFilter,
            changeSort,
            filter,
            toggleWishBrand,
            goodsList,
            curationGroupGoods,
            nowDisplayCurationGoods,
            curationMore,
            selectedCurationIndex,
            querySync,
            sharedDimShow,
            handleSharedDim,
            setPageOnView,
            loadPage,

            initPage,
            isPageReady,
        }
    }
})
</script>


