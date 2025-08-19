<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="mm_inner">
            <h3 class="mm_title">
                <b>판매자샵</b>
            </h3>
            <div class="m_product-seller">
                <!-- BEST 아이템 -->
                <section v-if="bestGoods.length > 0">
                    <h4 class="mm_strapline">
                        <strong>BEST</strong><b>아이템</b>
                    </h4>
                    <div class="mm_product-list">
                        <Slider
                            class="T=list-full"
                            :items="bestGoods"
                            :use-control="true"
                        >
                            <template #item="{ item }">
                                <MmGoods
                                    :goods="item"
                                    :use-liked-button="true"
                                />
                            </template>
                        </Slider>
                    </div>
                </section>
                <!--// BEST 아이템 -->

                <!-- NEW 아이템 -->
                <section v-if="newGoods.length > 0">
                    <h4 class="mm_strapline">
                        <strong>NEW</strong><b>IN</b>
                    </h4>
                    <div class="mm_product-list">
                        <Slider
                            class="T=list-full"
                            :items="newGoods"
                            :use-control="true"
                        > 
                            <template #item="{ item }">
                                <MmGoods
                                    :goods="item"
                                    :use-liked-button="true"
                                />
                            </template>
                        </Slider>
                    </div>
                </section>
                <!--// NEW 아이템 -->
            </div>

            <!-- 필터검색 -->           
            <Filter
                :search-form="searchForm"
                v-bind="filters"
                @apply-filter="changeFilter"
            />
            <!--// 필터검색 -->
            <FilteredGoods
                :goods-paginator="goodsPaginator"
                :sorting="searchForm.sorting" 
                :is-loading="isLoading"
                :total-count="totalCount"
                @move-page="movePage" 
                @sort-update="sortUpdate"
            />
        </div>
    </div>
</template>


<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { sellerShopRepository } from '$/repository/goods/sellerShopRepository';
import { Goods } from '$/@type/goods';
import Filter from '@/components/filter/Filter.vue'
import Slider from '@/components/Slider.vue';
import FilteredGoods from '@/components/filter/FilteredGoods.vue'
import { shoppingRepository } from '$/repository/shoppingRepository';
import { CommonGoodsFilter } from '$/@type/searchFilter';
import { makePath } from '$/services/http';
import { defaultCatch } from '$/functions';
import { SimplePaginator } from '$/@type';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useSellerShop } from '$/composables/goods/useSellerShop';

/** VARIABLE */
const {
    route,
    router,
    usePageTitleSetting,
} = usePageContext();

const sellerId = ref<number>(Number(route.params.id.toString()));

const  { 
    sellerName,
    bestGoods,
    newGoods,
    searchForm, 
    filters 
} = useSellerShop(sellerId.value);

usePageTitleSetting('판매자샵')

const isLoading = ref(true);
const totalCount = ref(0);
const goodsPaginator = ref<SimplePaginator<Goods>>({            
    currentPage: 1,
    perPage: 100,
    data: []
})

function changeFilter(filter: CommonGoodsFilter) {            
    searchForm.value = filter;
    router.replace(makePath(route.path, searchForm.value));
    Promise.all([movePage(1), fetchTotalCount()]);
}

/**
 * 필터링된 판매자 상품 + 전체 카운트 조회 
*/
async function filteringGoodsFetch() {
    isLoading.value = true;            
    try {
        const { paginator, goodsIds } = await sellerShopRepository.filteringGoods(sellerId.value, searchForm.value);           
        goodsPaginator.value = paginator;
        shoppingRepository.getRelationLikedGoods(goodsIds);            
        isLoading.value = false;
                
    } catch(e) {
        console.log(e);
        defaultCatch(e)
    }
    router.replace(makePath(route.path, searchForm.value));
}

async function fetchTotalCount() {
    totalCount.value = await sellerShopRepository.filteredGoodsTotalCount(sellerId.value, searchForm.value);            
}

async function movePage(page: number) {
    searchForm.value.page = page;
    await filteringGoodsFetch();
}

async function sortUpdate(sorting: string) {
    searchForm.value.sorting = sorting;
    router.replace(makePath(route.path, searchForm.value));
    await movePage(1);
}

/** FUNCTION */
/** VUE LIFE CYCLE */
onMounted(async() => {
    try {
        const [filter] = await Promise.all([
            sellerShopRepository.commonFilter(sellerId.value),
            fetchTotalCount(),
            filteringGoodsFetch(),               
        ]);
        
        filters.value = filter;
        shoppingRepository.getRelationLikedGoods(
            bestGoods.value.map(goods => goods.id).concat(
                newGoods.value.map(goods => goods.id)
            )
        )
    } catch(e) {
        defaultCatch(e);
    }
})
</script>