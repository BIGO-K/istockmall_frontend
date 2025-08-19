<template>
    <div class="m_showcase">
        <!-- 탭메뉴 -->
        <div v-if="sortList.length > 0" class="mm_tab_menu T=scroll">
            <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
            <div ref="menuScroller" class="mm_scroller T=x">
                <ul>
                    <li>
                        <a
                            :class="sortId === 0 ? 'S=tab-on' : ''" 
                            :title="sortId === 0 ? '선택됨' : ''"
                            @click="setSort(null);"
                        >
                            <b>전체보기</b>
                        </a>
                    </li>
                    <li v-for="sort in sortList" :key="sort.id">
                        <a
                            :class="sortId === sort.id ? 'S=tab-on' : ''"
                            :title="sortId === sort.id ? '선택됨' : ''"
                            @click="setSort(sort);"
                        >
                            <b>{{ sort.name }}</b>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!--// 탭메뉴 -->

        <p v-if="totalCount === 0 && !isLoading" class="mm_text-none">
            <i class="ico_text-none" />등록된 쇼케이스가 없습니다
        </p>
        <VirtualScroller
            v-else
            :class="['m_showcase-list']"
            :items="showcases"
            :items-per-page="perPage"
            :is-page-ready="isPageReady"
            :height-px-per-item="heightPxPerItem"
            :init-page="initPage"
            :total-count="totalCount"
            :is-loading="isLoading"
            @page-required="loadPage"
            @page-on-view-changed="setPageOnView"
        >
            <template #item="{ item, index }">
                <li v-if="item" :class="{'T=showcase-left': (index + 1) % 4 === 3 || (index + 1) % 4 === 0}">
                    <MMLink :to="{ name: 'ShowcaseDetail', params: { id: item.id } }">
                        <figure>
                            <i v-lazyload="{ src: item.thumbnailUrl }" class="mm_bg-cover image_banner" />
                            <figcaption>
                                <p class="text_side">
                                    {{ item.sortName }}
                                </p>
                                <p class="text_title">
                                    {{ item.title }}
                                </p>
                                <p class="text_main1">
                                    {{ item.firstWords }}
                                </p>
                                <p class="text_main2">
                                    {{ item.secondWords }}
                                </p>
                                <b>자세히 보기<i class="ico_link T=sm" /></b>
                            </figcaption>
                        </figure>
                    </MMLink>
                </li>
            </template>

            <template #skeleton>
                <li data-skeleton>
                    <i class="image_banner" />
                    <p class="text_side" />
                    <p class="text_title" />
                    <p class="text_main" />
                </li>
            </template>
        </VirtualScroller>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, nextTick, watch, onMounted, onUpdated } from 'vue';
import { Showcase, ShowcaseSort } from '$/@type/showcase';
import { useRoute, useRouter } from 'vue-router';
import { showcaseRepository } from '$/repository/showcaseRepository';
import { typeCastNumber } from '$/filters';
import VirtualScroller from '@/components/VirtualScrollerAddShow.vue';
import { defaultCatch } from '$/functions';
import { makePath } from '$/services/http';
import { computed } from 'vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { horizontalScrollMove } from '$/functions';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        sortList: ShowcaseSort[]
    }
}
export default defineComponent({
    components: {
        VirtualScroller,
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const sortList = await showcaseRepository.getSorts()
            next(vm => {
                vm.sortList = sortList
            })
        } catch (e) {
            next();
        }
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        usePageTitleSetting('쇼케이스');
        
        const perPage = ref(12);
        const heightPxPerItem = ref(545);
        const showSkeleton = ref(false);
        const isLoading = ref<boolean>(false);                              // 로딩 중인지 체크
        const sortId = ref<number>(typeCastNumber(route.params.sortId));    // 구분 ID
        const sortList = ref<ShowcaseSort[]>([]);                           // 구분 리스트
        const totalCount = ref<number>(0);                                  // 쇼케이스 총 개수
        const itemsByPage = ref<Array<(Showcase|null)[]>>([]);
        const showcases = computed(() => {
            /**
             * 평탄화된 쇼케이스 배열
             */
            return itemsByPage.value.flatMap((itemsInPage) => {
                return itemsInPage;
            })
        });

        const isPageReady = ref(false);
        const initPage = ref(typeCastNumber(route.query.page, 1));

        const menuScroller = ref<HTMLElement|null>(null);

        onBeforeMount(async () => {
            if (initPage.value > 1) {
                for (let page = 1; page <= initPage.value; page++) {
                    itemsByPage.value[page] = [];

                    for (let itemIndex = 0; itemIndex < perPage.value; itemIndex++) {
                        itemsByPage.value[page][itemIndex] = null;
                    }
                }
            }            

            await loadPage([
                typeCastNumber(route.query.page, 1) - 1,
                typeCastNumber(route.query.page, 1)
            ].filter(p => p > 0))

            isPageReady.value = true;

            // 메인 페이지에서 쇼케이스 전체보기 클릭 시
            if (route.params.sortId === '') {
                router.replace({
                    name: 'Showcase',
                    params: {
                        sortId: 0,
                    },
                });
            }
        });

        onMounted(async () => {
            await scrollMove();
        });

        watch(showcases, async (to) => {
            if (to.length > 0) {
                await nextTick();
                const el = document.querySelector('.m_showcase-list > li:not([data-skeleton])') as HTMLElement;

                if (el) {
                    heightPxPerItem.value = el.offsetHeight + typeCastNumber(window.getComputedStyle(el).marginBottom.replace(/px$/, ''), 0);
                }
            }
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
            });

            if (pagesNeedLoad.length < 1) {
                return;
            }

            /**
             * 페이지에 해당하는 쇼케이스 목록 조회
             */
            isLoading.value = true;
            loadingPages.value = loadingPages.value.concat(pagesNeedLoad);

            try {
                await Promise.all(pagesNeedLoad.map(async page => {
                    const paginator = await showcaseRepository.getShowcases(
                        page, 
                        `${route.params.sortId}` === '0' || `${route.params.sortId}` === '' ? null : typeCastNumber(route.params.sortId), 
                        perPage.value
                    );

                    itemsByPage.value[page] = paginator.data;
                    totalCount.value = paginator.total;
                } ));
            } catch (e) {
                defaultCatch(e);
            } finally {
                isLoading.value = false;
                loadingPages.value = loadingPages.value.filter(lp => !pagesNeedLoad.some(needLoadPage => needLoadPage === lp));
            }
        }

        function setPageOnView(currentPage: number, oldPage: number) {
            /**
             * page on view 를 갱신 (단순 쿼리스트링 처리용)
             */
            router.replace(makePath(route.path, {
                page: currentPage,
            }));
        }
        
        async function setSort(sort: ShowcaseSort|null) {
            showSkeleton.value = true;
            itemsByPage.value = [];
            
            await router.replace({
                name: 'Showcase',
                params: {
                    sortId: sort?.id || 0,
                },
                query: {
                    page: 1,
                },
            });

            sortId.value = sort?.id || 0;

            await scrollMove();
            await loadPage(1);

            showSkeleton.value = false;

        }

        async function scrollMove() {
            await nextTick();

            if (menuScroller.value) {
                const element = menuScroller.value.querySelector('.S\\=tab-on');
                horizontalScrollMove(menuScroller.value, element);
            }
        }

        return {
            heightPxPerItem,
            totalCount,
            isLoading,
            sortList,
            perPage,
            sortId,

            isPageReady,
            initPage,
            loadPage,
            setPageOnView,
            
            setSort,
            showcases,
            showSkeleton,

            menuScroller,
        }
    },
})
</script>