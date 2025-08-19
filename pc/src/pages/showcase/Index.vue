<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="mm_inner">
            <div class="m_showcase">
                <h3 class="mm_title">
                    <b>쇼케이스</b>
                </h3>
                <!-- 카테고리 -->
                <div class="mm_tab_menu T=slider">
                    <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                    <Slider :items="sortList" :use-control-small-icon="true">
                        <template #additionalItem>
                            <li class="mm_slider-item">
                                <a
                                    href="#"
                                    :class="sortId === 0 ? 'S=tab-on' : ''"
                                    :title="sortId === 0 ? '선택됨' : ''"
                                    @click.prevent="() => sortClick(0)"
                                >
                                    <b>전체보기</b>
                                </a>
                            </li>
                        </template>
                        <template #item="{ item }">
                            <a
                                href="#"
                                :class="sortId === item.id ? 'S=tab-on' : ''"
                                :title="sortId === item.id ? '선택됨' : ''"
                                @click.prevent="() => sortClick(item.id)"
                            >
                                <b>{{ item.name }}</b>
                            </a>
                        </template>
                    </Slider>
                </div>
                <!--// 카테고리 -->

                <!-- 쇼케이스 리스트 -->
                <div :class="['m_showcase-list', { 'T=skeleton': isLoading }]">
                    <ul v-if="isLoading">
                        <li v-for="i in 20" :key="i">
                            <i class="image_banner" />
                            <div>
                                <p class="text_category" />
                                <p class="text_title" />
                                <p class="text_main" />
                            </div>
                        </li>
                    </ul>

                    <template v-else>
                        <p v-if="showcaseList.total < 1" class="mm_text-none">
                            <i class="ico_text-none" />등록된 쇼케이스가 없습니다.
                        </p>
                        <ul v-else>
                            <li v-for="showcase in showcaseList.data" :key="showcase.id">
                                <MMLink :to="{ name: 'ShowcaseDetail', params: { id: showcase.id } }">
                                    <figure>
                                        <i v-lazyload="{ src: showcase.thumbnailUrl }" class="mm_bg-cover image_banner" />
                                        <figcaption>
                                            <p class="text_category">
                                                {{ showcase.sortName }}
                                            </p>
                                            <p class="text_title">
                                                {{ showcase.title }}
                                            </p>
                                            <p class="text_main">
                                                {{ showcase.firstWords }}
                                            </p>
                                            <p class="text_main">
                                                {{ showcase.secondWords }}
                                            </p>
                                            <b>자세히 보기<i class="ico_link T=xs" /></b>
                                        </figcaption>
                                    </figure>
                                </MMLink>
                            </li>
                        </ul>
                    </template>
                </div>
                <!--// 쇼케이스 리스트 -->

                <!-- 페이지네이션 -->
                <MMPaginator
                    :page-block-type="'group'"
                    :page-block-count="10"
                    :current-page="showcaseList.currentPage"
                    :items-per-page="showcaseList.perPage"
                    :total-count="showcaseList.total"
                    @movePageTo="movePage"
                />
                <!--// 페이지네이션 -->
            </div>
        </div>
    </div>
    <!--// 본문 -->
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Showcase, ShowcaseSort } from '$/@type/showcase'
import { useRoute, useRouter } from 'vue-router';
import { showcaseRepository } from '$/repository/showcaseRepository'
import { typeCastNumber } from '$/filters';
import { Paginator } from '$/@type'
import MMPaginator from '@/components/Paginator.vue'
import MMLink from '@/components/MMLink.vue'
import { usePageTitleSetting } from '$/composables/seoComposable';
import Slider from '@/components/Slider.vue';

const route = useRoute();
const router = useRouter();
usePageTitleSetting('쇼케이스');

const queryPage = route.query.page;
const hasInitializePage = queryPage !== undefined && !isNaN(typeCastNumber(queryPage?.toString()));
const page = hasInitializePage ? ref(typeCastNumber(queryPage?.toString())) : ref(1);
const perPage = ref(12);

const isLoading = ref<boolean>(false); // 로딩 중인지 체크

const showcaseList = ref<Paginator<Showcase>>({
    total: 0,
    currentPage: 1,
    perPage: 12,
    data: [],
});

const sortChange = ref<boolean>(false);

const sortList = ref<ShowcaseSort[]>([]);
const sortId = ref<number>(0);

onMounted(async () => {
    fetch(typeCastNumber(router.currentRoute.value.params.sortId.toString()));
});

// 쇼케이스 조회 (구분, 리스트)
async function fetch(sortCode = 0) {
    sortId.value = sortCode;

    isLoading.value = true

    try {
        page.value = (!sortChange.value && queryPage) ? typeCastNumber(queryPage?.toString()) : 1;

        const [sorts, showcases] = await Promise.all([
            showcaseRepository.getSorts(),
            showcaseRepository.getShowcases(page.value, sortCode === 0 ? null : sortCode, perPage.value),
        ])

        sortList.value = sorts;
        showcaseList.value = showcases;

        if (page.value === 1) {
            router.replace({
                name: 'Showcase',
                params: {
                    sortId: sortCode,
                },
            });
        } else {
            router.replace({
                name: 'Showcase',
                params: {
                    sortId: sortCode,
                },
                query: {
                    page: page.value,
                },
            });
        }
    } catch (e) {
        console.log(e);
    } finally {
        sortChange.value = false;
        isLoading.value = false;
    }
}

// 페이지 이동
async function movePage(nextPage: number) {
    isLoading.value = true;
    page.value = nextPage;

    try {
        showcaseList.value = await showcaseRepository.getShowcases(page.value, sortId.value === 0 ? null : sortId.value);

        router.replace({
            name: 'Showcase',
            params: {
                sortId: sortId.value,
            },
            query: {
                page: page.value,
            },
        })
    } catch (e) {
        console.log(e);
    } finally {
        isLoading.value = false;
    }
}

function sortClick(sortCode: number) {
    if (sortId.value === sortCode) {
        return;
    }

    sortId.value = sortCode;
    page.value = 1;
    sortChange.value = true;

    fetch(sortId.value);
}
</script>
