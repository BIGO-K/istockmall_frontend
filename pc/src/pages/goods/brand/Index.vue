<template>
    <div class="mm_page-content">
        <!-- 브랜드샵 상단 영역 -->
        <!-- (D) 어드민에서 브랜드 상단 이미지를 등록하지 않았을 경우 data-lazyload의 _src 경로에 'null'을 넣어주세요. 예) data-lazyload="{ '_src': 'null' }" -->
        <div class="m_brand-head">
            <i
                v-lazyload="{ src: brandImageUrl, useErrorImage: false }"
                class="mm_bg-cover image_banner"
            />
            <div class="m_brand-head-explan">
                <h2 class="text_brand">
                    <b>{{ brandInfo?.name }}</b>
                </h2>
                <p
                    v-if="brandInfo?.mainText"
                    class="text_main"
                >
                    {{ brandInfo?.mainText }}
                </p>
                <p
                    v-if="brandInfo?.subText"
                    class="text_sub"
                >
                    {{ brandInfo?.subText }}
                </p>
            </div>
            <ul class="m_brand-head-private">
                <li>
                    <button
                        type="button"
                        :class="['btn_like', { 'S=switch-on' : isWishBrand }]"
                        data-switch
                        @click="toggleWishBrand"
                    >
                        <i class="ico_like" /><b class="mm_ir-blind">찜한 브랜드에 추가하기</b>
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        class="btn_sns-share"
                        @click="copyPath"
                    >
                        <i class="ico_share" /><b class="mm_ir-blind">클립보드 복사하기</b>
                    </button>
                </li>
            </ul>
        </div>
        <!--// 브랜드샵 상단 영역 -->
        <div class="mm_inner">
            <div class="m_brand-prod">
                <!-- 쇼케이스 -->
                <section
                    v-if="(brandInfo?.brandContents || []).length > 0"
                    class="m_brand-prod-showcase"
                >
                    <h3 class="mm_heading">
                        <b>SHOWCASE</b>
                    </h3>
                    <Carousel
                        :items="brandInfo?.brandContents"
                        :use-count="true"
                        :carousel-data="{ _autoDelay: 4 }"
                    >
                        <template #item="{ item }">
                            <MMLink :to="{ name: 'ShowcaseDetail', params: { id : item.id }}">
                                <figure>
                                    <i
                                        v-lazyload="{ src: item.imageUrl }"
                                        class="mm_bg-cover image_banner"
                                        :data-lazyload="`{ '_src':  '${item.imageUrl}' }`"
                                    />
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
                <section
                    v-if="curations.length > 0"
                    class="m_brand-prod-curation"
                >
                    <h3 class="mm_heading">
                        <b>BEST ITEM</b>
                    </h3>
                    <div class="mm_product-list">
                        <!--
                            (D) 찜한 아이템의 .btn_like 버튼에 'S=switch-on' 클래스와 '선택됨' 타이틀이 추가됩니다.
                            data-switch 속성에 onChange(1번째 파라미터로 true/false 전달) 값으로 콜백을 설정할 수 있습니다.
                            세일 상품이 아닐 경우 del 대신 빈 span 태그를 넣어주세요. (전체적으로 del이 안 들어갈 경우 del/span 모두 안 씀)
                        -->
                        <ul>
                            <li
                                v-for="curation, index in curations.slice(0,5)"
                                :key="`curation_${index}`"
                            >
                                <MmGoods 
                                    :goods="curation" 
                                    :use-liked-button="true" 
                                    :is-show-price="true" 
                                    :use-react-tag="true" 
                                />
                            </li>
                        </ul>
                    </div>
                </section>
                <!--// 큐레이션 -->
            </div>

            <!-- 필터검색 -->
            <Filter
                :search-form="searchForm"
                v-bind="filters"
                @apply-filter="changeFilter"
            />
            <FilteredGoods
                :goods-paginator="brandGoodsPaginator"                 
                :sorting="searchForm.sorting" 
                :is-loading="isLoading"
                :total-count="totalCount"
                :is-use-recommended="brandInfo?.isUseRecommendedGoods"
                @move-page="movePage" 
                @sort-update="sortUpdate"
            /> 
        </div>
    <!-- 현재 페이지 스크립트 -->
    </div>
</template>

<script setup lang='ts'>
import Filter from '@/components/filter/Filter.vue'
import FilteredGoods from '@/components/filter/FilteredGoods.vue'
import Carousel from '@/components/Carousel.vue';
import { CommonGoodsFilter } from '$/@type/searchFilter';
import { makePath } from '$/services/http';
import { defaultCatch } from '$/functions';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useRouteParams } from '@vueuse/router';
import { useToNumber } from '@vueuse/core';
import { useBrandShop } from '$/composables/goods/brandShopComposable';
import { watch } from 'vue';

/** VARIABLE */

const brandId = useToNumber(`${useRouteParams('id').value}`).value

const {
    route,
    router,
    isUser,
    mmon,
    usePageTitleSetting
} = usePageContext();

const {
    searchForm,
    filters,
    isLoading,
    isWishBrand,
    brandInfo,
    brandImageUrl,
    curations,
    brandGoodsPaginator,
    totalCount,
    brandWish,
    getBrandShopGoods,
    getBrandShopTotalGoodsCount
} = useBrandShop(brandId);

usePageTitleSetting(`브랜드샵`);

watch(() => brandInfo.value?.name, (brandShopName) => {
    if (!brandShopName) {
        return;
    }
    usePageTitleSetting(`${brandShopName} 브랜드샵`);
})

/**
 * 페이징 처리용 
*/
async function movePage(page: number) {
    searchForm.value.page = page;
    await fetchGoods();
}
/**
 * 정렬조건 변경 함수 
*/
async function sortUpdate(sorting: string) {
    searchForm.value.sorting = sorting;
    await movePage(1);
}

async function changeFilter(filterForm: CommonGoodsFilter) {
    searchForm.value = filterForm;
    await fetchGoods();
}

async function fetchGoods() {
    mmon.loading.show();
    try {
        await Promise.all([
            getBrandShopGoods(),
            getBrandShopTotalGoodsCount()
        ]);
        router.replace(makePath(route.path, searchForm.value));
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

/**
 * 브랜드 찜처리
*/
async function toggleWishBrand() {
    if (!isUser.value) {
        return mmon.bom.confirm("로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?", (flag: boolean) => {
            if (flag) {
                router.push({
                    name: "Login",
                    query: {
                        redirect_to_after: route.path,
                    },
                });
            }
        });
    }
    mmon.loading.show();
    try {
        await brandWish()
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

function copyPath() {
    mmon.copy(location.href);
}

/** FUNCTION */

/** VUE LIFE CYCLE */
</script>
