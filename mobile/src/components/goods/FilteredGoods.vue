<template>
    <div class="mm_inner">
        <slot name="banner" />
        <VirtualScroller
            :class="['mm_product-list T=skeleton' , { 'T=card' : isDisplayTypeCard }]"
            :items="goodsList"
            :is-display-type-card="isDisplayTypeCard"
            :total-count="totalCount"
            :is-page-ready="isPageReady"
            :init-page="initPage"
            :items-per-page="perPage"
            :is-loading="isLoading"
            @page-required="loadPage"
            @page-on-view-changed="pageOnViewChanged"
        >
            <template #header>
                <p class="text_total">
                    <strong>{{ MMFilters.formatNumber(totalCount) }}</strong>개
                </p>                
                <MmSelect v-model="sort">
                    <option v-if="isUseRecommended" value="brand_recommend">
                        추천순
                    </option>
                    <option 
                        v-for="sortFilter in sortFilterOptions" 
                        :key="sortFilter.label" 
                        :value="sortFilter.value" 
                    >
                        {{ sortFilter.label }}                                
                    </option>
                </MmSelect>
                <button 
                    type="button" 
                    class="btn_array" 
                    data-switch="{ '_classOn': 'T=card', '_isParent': true, '_parentSelector': '.mm_product-list', 'onChange': 'toggleStyleProduct' }"
                    @click="() => isDisplayTypeCard = !isDisplayTypeCard"
                >
                    <i :class="['ico_array', isDisplayTypeCard ? 'T=wide' : 'T=card']" /><b class="mm_ir-blind">상품 정렬 변경</b>
                </button>
                <a href="#" class="btn_filter" @click.prevent="openFilter"><i class="ico_filter" /><b>필터</b></a>
            </template>
            <template #item="{ item }">
                <li v-if="item">
                    <mm-goods :search-keyword="searchKeyword" :goods="item" :use-react-tag="true" :use-liked-button="true" />
                </li>
            </template>            
        </VirtualScroller>
        <Teleport to="#filter_area">
            <component                                 
                :is="filterComponent"
                :show="filterShow"
                :categories="categories"
                :brands="brands"
                :fit-sizes="fitSizes"
                :shoes-sizes="shoesSizes"
                :colors="colors" 
                @close="closeFilter"
                @query-sync="applyQueryParams"
                @change-filter="filterUpdate"
            />
        </Teleport>
    </div>
</template>


<script lang="ts">
import { defineComponent, PropType, ref, toRefs, defineAsyncComponent, watch, onMounted, onBeforeUnmount } from 'vue';
import { Goods } from '$/@type/goods';
import MMPaginator from '@/components/Paginator.vue'
import MmSelect from '@/components/input/Select.vue';
import VirtualScroller from '@/components/VirtualScrollerProduct.vue';
import { CommonGoodsFilter, FilterBrand, FilterCategory, FilterColor, FilterFit, FilterShoesSize } from '$/@type/searchFilter';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    components: {
        MMPaginator,
        MmSelect,
        VirtualScroller,
    },
    props: {
        goodsList: {
            type: Array as PropType<(Goods|null)[]>,
            required: true
        },
        sorting: {
            type: String,
            default: 'selling'
        },
        isLoading: {
            type: Boolean,
            default: true
        },
        isPageReady: {
            type: Boolean,
            default: false,
        },
        initPage: {
            type: Number,
            default: 1,
        },
        totalCount: {
            type: Number,
            default: 0
        },
        categories: {
            type: Array as PropType<FilterCategory[]>,
            default: () => []
        },
        brands: {
            type: Array as PropType<FilterBrand[]>,
            default: () => []
        },
        fitSizes: {
            type: Array as PropType<FilterFit[]>,
            default: () => []
        },
        shoesSizes: {
            type: Array as PropType<FilterShoesSize[]>,
            default: () => []
        },
        colors: {
            type: Array as PropType<FilterColor[]>,
            default: () => []
        },   
        perPage: {
            type: Number,
            default: 100
        },
        searchKeyword: {
            type: String,
            default: ''
        },
        isUseRecommended: {
            type: Boolean,
            default: false
        }
    },    
    emits: ['changeSort', 'applyFilter', 'querySync', 'pageRequired', 'pageOnViewChanged'],
    setup(props, { emit }) {
        const route = useRoute();
        const router = useRouter();
        const filterShow = ref(false);
        const isDisplayTypeCard = ref(route.query.displayType?.toString() !== 'all' ?? true);
        const currentGoodsId = ref<number>(0);
        const { sorting, searchKeyword } = toRefs(props);            
        const sort = ref('');
        const sortFilterOptions = [
            {
                label: '판매순',
                value: 'selling'
            },
            {
                label: '신상품순',
                value: 'recent'
            },
            {
                label: '낮은 가격순',
                value: 'lowprice'
            },
            {
                label: '높은 가격순',
                value: 'highprice'
            },
            {
                label: '할인율 높은순',
                value: 'salerate'
            },
            {
                label: '리뷰 많은순',
                value: 'review_count'
            }
        ];       

        watch(sort, (to, from) => {
            if (to && from) {
                emit('changeSort', to);
            }
        });


        watch(sorting, () => {
            sort.value = sorting.value;
        })


        const filterComponent = defineAsyncComponent(() => import('@/components/goods/Filter.vue'));        

        function filterUpdate(filter: CommonGoodsFilter) {
            emit('applyFilter', filter)
        }

        async function applyQueryParams(filter?: CommonGoodsFilter) {
            sort.value = filter?.sorting || 'selling';
            emit('querySync', filter);
        }
        
        function loadPage(page: number|number[]) {
            emit('pageRequired', page)
        }

        function pageOnViewChanged(currentPage: number, oldPage: number) {
            emit('pageOnViewChanged', currentPage, oldPage)
        }

        function openFilter() {
            router.push({
                hash: '#FILTER'
            })
            filterShow.value = true;
        }
        
        function closeFilter() {
            filterShow.value = false
        }

        function hashChangeHandler(event: HashChangeEvent) {
            const before = event.oldURL.split('#')[1] ?? '';
            const after = event.newURL.split('#')[1] ?? '';
            // 응모한 경우             
            if (before === 'FILTER') { 
                document.getElementById('filter_area')?.classList.remove('S=on');
                router.replace({
                    hash: ''
                });
                filterShow.value = false;                
            } 
            if (after === 'FILTER') {
                filterShow.value = true;
            }
        }

        onMounted(() => {
            window.addEventListener('hashchange', hashChangeHandler);
        })
        

        onBeforeUnmount(() => {
            document.getElementById('filter_area')?.classList.remove('S=on');
            window.removeEventListener('hashchange', hashChangeHandler);
        })

        return {
            applyQueryParams,
            isDisplayTypeCard,            
            currentGoodsId,
            sortFilterOptions,     
            sort,
            filterComponent,
            filterShow,            
            filterUpdate,
            loadPage,
            pageOnViewChanged,            
            openFilter,
            closeFilter
        }
    },
})
</script>
