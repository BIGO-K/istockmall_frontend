<template>
    <div class="m_codyshot">
        <div v-if="recentCodyShots.length > 0" class="m_codyshot-new">
            <h2><b>신규 코디샷</b></h2>
            <div class="mm_scroller T=x">
                <ul>
                    <li v-for="(codyShot, index) in recentCodyShots" :key="index">
                        <div class="m_codyshot-item">
                            <MMLink :to="{ name: 'CodyShotDetail', params: { id: codyShot.id } }">
                                <figure>
                                    <i v-lazyload="codyShot.thumbnailUrl" class="mm_bg-cover image_banner" />
                                    <figcaption>
                                        <p class="text_brand">
                                            {{ codyShot.brandName }}
                                        </p>
                                        <p class="text_main">
                                            {{ codyShot.title }}
                                        </p>
                                    </figcaption>
                                </figure>
                            </MMLink>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <hr v-if="recentCodyShots.length > 0" class="mm_line">
        <div class="mm_inner">
            <MMSelect
                v-model="selectedCategoryId"
                @change="fetch"
            >
                <option value="">
                    전체 코디샷
                </option>
                <option v-for="category in codyShotCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </MMSelect>
            <ul v-if="!isCompleteLoading" class="m_codyshot-list T=skeleton">
                <li v-for="index in 6" :key="index">
                    <i class="image_banner" />
                    <p class="text_brand" />
                    <p class="text_main" />
                </li>
            </ul>
            <ul v-else-if="isCompleteLoading && codyShots.length > 0" class="m_codyshot-list">
                <li v-for="codyShot in codyShots" :key="codyShot.id">
                    <div class="m_codyshot-item">
                        <MMLink :to="{ name: 'CodyShotDetail', params: { id: codyShot.id } }">
                            <figure>
                                <i v-lazyload="codyShot.thumbnailUrl" class="mm_bg-cover image_banner" />
                                <figcaption>
                                    <p class="text_brand">
                                        {{ codyShot.brandName }}
                                    </p>
                                    <p class="text_main">
                                        {{ codyShot.title }}
                                    </p>
                                </figcaption>
                            </figure>
                        </MMLink>
                    </div>
                </li>
            </ul>
            <p v-else class="mm_text-none">
                <i class="ico_text-none" />등록된 상품이 없습니다
            </p>
            <div v-if="codyShots.length < totalCodyShots && isShowViewMoreBtn" class="mm_foot">
                <div class="mm_btn_box">
                    <button type="button" class="mm_btn T=line T=dark btn_more" @click="e => addScrollHandler(e)">
                        <b>더보기</b><i class="ico_more" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from "$/functions";
import { codyShotRepository } from '$/repository/codyShotRepository';
import { SimpleCodyShot, CodyShotCategory } from '$/@type/codyShot';
import MMLink from '@/components/MMLink.vue';
import MMSelect from '@/components/input/Select.vue';
import { useRoute, useRouter } from 'vue-router';
import { makePath } from '$/services/http';
import { usePageTitleSetting } from '$/composables/seoComposable';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        codyShotCategories: CodyShotCategory[]
        recentCodyShots: SimpleCodyShot[]
        codyShots: SimpleCodyShot[]
        selectedCategoryId: number
    }
}

export default defineComponent({
    components: {
        MMLink,
        MMSelect
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const categoryId = to.query.category_id 
                ? Number.parseInt(`${to.query.category_id}`) 
                : 0

            const [resultCategories, resultRecentCodyShots, resultCategoryCodyShots] = await Promise.all([
                codyShotRepository.getCodyShotCategories(),
                codyShotRepository.getRecentCodyShots(),
                codyShotRepository.getCodyShotPaginator(categoryId),
            ]);

            next(vm => {
                vm.codyShotCategories =  resultCategories
                vm.recentCodyShots = resultRecentCodyShots
                vm.codyShots = resultCategoryCodyShots.data
                vm.selectedCategoryId = categoryId
            })
        } catch (e) {
            next();
        }
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        usePageTitleSetting('코디샷');

        // 코디샷 카테고리 목록
        const codyShotCategories = ref<CodyShotCategory[]>([]);
        // 선택한 카테고리 id
        const selectedCategoryId = ref<number>(0);
        // 최근 등록한 코디샷 목록(최대 10개)
        const recentCodyShots = ref<SimpleCodyShot[]>([]);
        // 로딩 완료 여부
        const isCompleteLoading = ref<boolean>(true);
        // 코디샷 목록
        const codyShots = ref<SimpleCodyShot[]>([]);
        const currentPage = ref<number>(1);
        const totalCodyShots = ref<number>(1);
        // 더보기 버튼 노출 여부(1회만 노출, 그 이후에는 무한 스크롤 처리)
        const isShowViewMoreBtn = ref<boolean>(true);
        const scrollAreas = ref<Element|null>();

        /**
         * 무한 스크롤 핸들러 추가
         * (더보기 버튼 클릭시 추가)
         */
        function addScrollHandler(event: Event) {
            if (!(event.target instanceof HTMLElement)) return;

            // 더보기 버튼과 가까운 scroll 요소
            scrollAreas.value = event.target.closest('.mm_scroller');
            if (!scrollAreas.value) return;

            // 더보기 버튼 클릭시 노출x
            isShowViewMoreBtn.value = false;
            // 해당 요소에 스크롤 이벤트 리스터 추가
            scrollAreas.value.addEventListener('scroll', handleScroll);

        }

        /**
         * 무한 스크롤 핸들러 (삭제예정)
         */
        async function handleScroll() {
            if (!scrollAreas.value) return;

            // 페이지에 노출된 코디샷 개수와 총 개수가 같다면 스크롤 핸들러 제거
            if (codyShots.value.length === totalCodyShots.value ) removeHandleScroll();

            // 스크롤 위치가 페이지 하단에까지 내려올 때, 코디샷 추가
            if (scrollAreas.value.scrollTop + window.innerHeight < scrollAreas.value.scrollHeight - 50) return;

            try {
                mmon.loading.show();

                const addCodyShots = await codyShotRepository.getCodyShotPaginator(selectedCategoryId.value, ++currentPage.value);
                codyShots.value = [...codyShots.value, ...addCodyShots.data];
            } catch (error) {
                defaultCatch(error);
            } finally {
                mmon.loading.hide();
            }
        }

        /**
         * 카테고리 선택시 코디샷 fetch
         */
        async function fetch() {
            try {
                isCompleteLoading.value = false;
                currentPage.value = 1; // 1페이지로 초기화
                isShowViewMoreBtn.value = true; // 더보기 버튼 노출여부 초기화
                removeHandleScroll(); // 새로운 카테고리 클릭시 스크롤 핸들러 제거
                const codyShotPaginator = await codyShotRepository.getCodyShotPaginator(selectedCategoryId.value, currentPage.value);
                codyShots.value = codyShotPaginator.data;
                totalCodyShots.value = codyShotPaginator.total;

                router.replace(makePath(route.path, {
                    category_id: selectedCategoryId.value,
                }))
            } catch (error) {
                defaultCatch(error);
            } finally {
                isCompleteLoading.value = true;
            }
        }

        /**
         * 스크롤 핸들러 제거
         */
        function removeHandleScroll() {
            if (scrollAreas.value instanceof Element) {
                scrollAreas.value.removeEventListener('scroll', handleScroll)
            }
        }

        return {
            codyShotCategories,
            selectedCategoryId,
            recentCodyShots,
            isCompleteLoading,
            addScrollHandler,
            codyShots,
            totalCodyShots,
            isShowViewMoreBtn,
            fetch,
            Element
        }
    }
});
</script>