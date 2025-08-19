<template>
    <div class="mm_page-content">
        <div class="mm_inner">
            <h3 class="mm_title">
                <b>코디샷</b>
            </h3>

            <template v-if="recentCodyShots.length > 0">
                <!-- 신규 코디샷 -->
                <section class="m_codyshot-new">
                    <h4 class="mm_heading">
                        <b>신규 코디샷</b>
                    </h4>
                    <Slider
                        :use-control="true"
                        :use-control-small-icon="true"
                        :items="recentCodyShots"
                    >
                        <template #item="{ item: codyShot }">
                            <div class="m_codyshot-item">
                                <MMLink :to="{ name: 'CodyShotDetail', params: { id: codyShot.id } }">
                                    <figure>
                                        <i
                                            v-lazyload="codyShot.thumbnailUrl"
                                            class="mm_bg-cover image_banner"
                                        />
                                        <figcaption>
                                            <p class="text_brand">
                                                {{ codyShot.brandName }}
                                            </p>
                                            <p class="text_title">
                                                {{ codyShot.title }}
                                            </p>
                                        </figcaption>
                                    </figure>
                                </MMLink>
                            </div>
                        </template>
                    </Slider>
                </section>
                <!--// 신규 코디샷 -->
            </template>

            <!-- 탭메뉴 -->
            <div v-if="categoryCompleteLoading" class="mm_tab_menu T=slider">
                <Slider
                    :use-control="true"
                    :use-control-small-icon="true"
                    :items="codyShotCategories"
                >
                    <template #item="{ item: category }">
                        <a
                            href="#"
                            :class="{ 'S=tab-on': categoryId === category.id }"
                            :title="categoryId === category.id ? '선택됨' : ''"
                            @click.prevent="selectCategory(category.id)"
                        >
                            <b>{{ category.name }}</b>
                        </a>
                    </template>
                </Slider>
            </div>
            <!--// 탭메뉴 -->

            <!-- 코디샷 목록 (로딩 완료) -->
            <template v-if="isCompleteLoading">
                <p
                    v-if="codyShotsPaginator.total < 1"
                    class="mm_text-none"
                >
                    <i class="ico_text-none" />등록된 코디샷이 없습니다
                </p>
                <div
                    v-else
                    class="m_codyshot-list"
                >
                    <ul>
                        <li v-for="codyShot in codyShotsPaginator.data" :key="codyShot.id">
                            <div class="m_codyshot-item">
                                <MMLink :to="{ name: 'CodyShotDetail', params: { id: codyShot.id } }">
                                    <figure>
                                        <i
                                            v-lazyload="codyShot.thumbnailUrl"
                                            class="mm_bg-cover image_banner"
                                        />
                                        <figcaption>
                                            <p class="text_brand">
                                                {{ codyShot.brandName }}
                                            </p>
                                            <p class="text_title">
                                                {{ codyShot.title }}
                                            </p>
                                        </figcaption>
                                    </figure>
                                </MMLink>
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- 페이지네이션 -->
                <MMPaginator
                    :page-block-type="'group'"
                    :page-block-count="10"
                    :current-page="codyShotsPaginator.currentPage"
                    :items-per-page="codyShotsPaginator.perPage"
                    :total-count="codyShotsPaginator.total"
                    @movePageTo="movePageTo"
                />
                <!--// 페이지네이션 -->
            </template>
            <!--// 코디샷 목록 (로딩 완료) -->
            <template v-else>
                <!-- 코디샷 목록 (로딩 미완료) -->
                <div class="m_codyshot-list T=skeleton">
                    <ul>
                        <li v-for="i in 10" :key="i">
                            <i class="image_banner" />
                            <p class="text_brand" />
                            <p class="text_title" />
                        </li>
                    </ul>
                </div>
                <!--// 코디샷 목록 (로딩 미완료) -->
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { codyShotRepository } from '$/repository/codyShotRepository';
import { SimpleCodyShot, CodyShotCategory } from '$/@type/codyShot';
import { ref } from 'vue';
import { defaultCatch } from "$/functions";
import { Paginator } from '$/@type';
import MMPaginator from '@/components/Paginator.vue';
import Slider from '@/components/Slider.vue';
import { useRoute, useRouter } from 'vue-router';
import { makePath } from '$/services/http';
import { usePageTitleSetting } from '$/composables/seoComposable'
import { typeCastNumber } from '$/filters'

const route = useRoute();
const router = useRouter();
usePageTitleSetting('코디샷');

const categoryId = ref(typeCastNumber(`${route.query.category_id || 0}`));
const page = ref(typeCastNumber(`${route.query.page || 1}`));

const codyShotCategories = ref<CodyShotCategory[]>([{id: 0, name: "전체 보기"}]);
const recentCodyShots = ref<SimpleCodyShot[]>([]);
const codyShotsPaginator = ref<Paginator<SimpleCodyShot>>({
    total: 0,
    currentPage: 1,
    perPage: 20,
    data: [],
});
const isCompleteLoading = ref<boolean>(false);
const categoryCompleteLoading = ref<boolean>(false);

(async() => {
    try {
        const [resultCategories, resultRecentCodyShots, resultCategoryCodyShots] = await Promise.all([
            codyShotRepository.getCodyShotCategories(),
            codyShotRepository.getRecentCodyShots(),
            codyShotRepository.getCodyShotPaginator(categoryId.value, page.value),
        ])

        codyShotCategories.value = [...codyShotCategories.value, ...resultCategories];
        recentCodyShots.value = resultRecentCodyShots;
        codyShotsPaginator.value = resultCategoryCodyShots;
    } catch(e) {
        console.log(e)
    } finally {
        categoryCompleteLoading.value = true;
        isCompleteLoading.value = true;
    }
})();

async function fetchCodyShot() {
    try {
        isCompleteLoading.value = false
        codyShotsPaginator.value = await codyShotRepository.getCodyShotPaginator(categoryId.value, page.value);

        router.replace(makePath(route.path, {
            category_id: categoryId.value,
            page: page.value
        }))
    } catch (error) {
        defaultCatch(error)
    } finally {
        isCompleteLoading.value = true
    }
}

/**
 * 페이지 이동시 데이터 조회
 *
 * @param {number} movePage
 */
async function movePageTo(movePage = 1) {
    page.value = movePage;
    fetchCodyShot();
}

/**
 * 카테고리 선택시 데이터 조회
 *
 * @param {number} selectedCategoryId
 */
async function selectCategory(selectedCategoryId: number) {
    categoryId.value = selectedCategoryId
    page.value = 1
    fetchCodyShot();
}
</script>