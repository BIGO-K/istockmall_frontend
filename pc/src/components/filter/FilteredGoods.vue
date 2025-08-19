<template>
    <div v-if="totalCount > 0 || isLoading" :class="['mm_product-list', { 'T=skeleton': isLoading }]">
        <div class="mm_product-list-head">
            <div class="mm_lside">
                <span class="text_total">
                    <strong>{{ MMFilters.formatNumber(totalCount) }}</strong>개
                </span>
            </div>
            <div class="mm_rside">
                <ul>
                    <li v-if="isUseRecommended">
                        <a
                            href="#"
                            :class="{ 'S=sort-on': sorting === 'brand_recommend' }"
                            @click.prevent="
                                () => {
                                    sortChange('brand_recommend')
                                }
                            "
                        >
                            <b>추천순</b>
                        </a>
                    </li>
                    <li v-for="sortFilter in sortFilterOptions" :key="sortFilter.label">
                        <a
                            href="#"
                            :class="{ 'S=sort-on': sorting === sortFilter.value }"
                            @click.prevent="
                                () => {
                                    sortChange(sortFilter.value)
                                }
                            "
                        >
                            <b>{{ sortFilter.label }}</b>
                        </a>
                    </li>
                </ul>
            </div>
        </div>      
        <ul v-if="isLoading">
            <li v-for="i in goodsPaginator.perPage" :key="i">
                <div class="mm_product-item">
                    <i class="image_product" />
                    <div class="mm_product-item-info">
                        <p class="text_brand" />
                        <p class="text_product" />
                        <p class="text_price" />
                    </div>
                </div>
            </li>
        </ul>
        <ul v-else>
            <li v-for="goods in goodsPaginator.data" :key="goods.id">
                <mm-goods 
                    :search-keyword="searchKeyword" 
                    :goods="goods" 
                    :use-react-tag="true" 
                    :use-liked-button="true"
                />
            </li>
        </ul>
    </div>
    <p v-else class="mm_text-none">
        <i class="ico_text-none" />등록된 상품이 없습니다
    </p>
    
    <!-- 페이지네이션 -->
    <MMPaginator
        :page-block-type="'group'"
        :page-block-count="10"
        :current-page="goodsPaginator.currentPage"
        :items-per-page="goodsPaginator.perPage"
        :total-count="totalCount"
        @move-page-to="movePage"
    />
</template>

<script setup lang='ts'>
import { PropType, toRefs } from 'vue'
import { SimplePaginator } from '$/@type'
import { Goods } from '$/@type/goods'
import MMPaginator from '@/components/Paginator.vue'

const props = defineProps({
    goodsPaginator: {
        type: Object as PropType<SimplePaginator<Goods>>,
        required: true,
    },
    sorting: {
        type: String,
        default: 'selling',
    },
    isLoading: {
        type: Boolean,
        default: true,
    },
    totalCount: {
        type: Number,
        default: 0,
    },
    searchKeyword: {
        type: String,
        default: ''
    },
    isUseRecommended: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits<{
    (e: 'movePage', page: number): void,
    (e: 'sortUpdate', sorting: string): void
}>();
/** VARIABLE */

const { searchKeyword } = toRefs(props);
const sortFilterOptions = [
    {
        label: '판매순',
        value: 'selling',
    },
    {
        label: '신상품순',
        value: 'recent',
    },
    {
        label: '낮은 가격순',
        value: 'lowprice',
    },
    {
        label: '높은 가격순',
        value: 'highprice',
    },
    {
        label: '할인율 높은순',
        value: 'salerate',
    },
    {
        label: '리뷰 많은순',
        value: 'review_count',
    },
]

/** FUNCTION */

/**
 * 페이지 이동 함수(페이지 네이션-> 컴포넌트 -> 부모 컴포넌트 함수 호출)
 */
async function movePage(page: number) {
    emit('movePage', page)
}
function sortChange(sorting: string) {
    emit('sortUpdate', sorting)
}
/** VUE LIFE CYCLE */

</script>
