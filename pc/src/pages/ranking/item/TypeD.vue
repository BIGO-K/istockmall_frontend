<template>
    <div v-stickyRankingCategory class="m_ranking-category">
        <div class="m_ranking-category-inner">
            <div class="mm_inner">
                <Slider
                    v-if="categories.length > 0"
                    :items="categories"
                    :use-control="true"
                >
                    <template #additionalItem>
                        <li class="mm_slider-item">
                            <button 
                                :class="{ 'S=category-on' : selectedCategoryCode === '' }"
                                :title="selectedCategoryCode === '' ? '선택됨' : ''"
                                type="button"
                                @click="fetchRankingItem(selectedRankRange, '')"
                            >
                                <b>ALL</b>
                            </button>
                        </li>
                    </template>
                    <template #item="{ item }">
                        <button 
                            :class="{ 'S=category-on' : selectedCategoryCode === item.code }" 
                            :title="selectedCategoryCode === item.code ? '선택됨' : ''"
                            type="button"
                            @click="fetchRankingItem(selectedRankRange, item.code)"
                        >
                            <i
                                v-lazyload="{ src: item.imageUrl }"
                                class="mm_bg-cover image_category"
                            /><b>{{ item.name }}</b>
                        </button>                                           
                    </template>
                </Slider>
            </div>
        </div>
    </div>
    <template v-if="rankingItem !== null && rankingItem.goodsList">
        <div class="mm_inner m_ranking-item T=custom">
            <div class="m_ranking-head">
                <template v-if="rankingItem.hasRankRange">
                    <!-- (D) 현재 페이지에 맞는 정렬 button에 'S=on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                    <ul class="m_ranking-head-sort">
                        <li>
                            <button 
                                :class="['btn_sort' , { 'S=on' : selectedRankRange === 'D' }]" 
                                :title="selectedRankRange === 'D' ? '선택됨' : ''" 
                                type="button" 
                                @click="fetchRankingItemByRange('D')"
                            >
                                <b>일간</b>
                            </button>
                        </li>
                        <li>
                            <button 
                                :class="['btn_sort' , { 'S=on' : selectedRankRange === 'W' }]" 
                                :title="selectedRankRange === 'W' ? '선택됨' : ''" 
                                type="button" 
                                @click="fetchRankingItemByRange('W')"
                            >
                                <b>주간</b>
                            </button>
                        </li>
                        <li>
                            <button 
                                :class="['btn_sort' , { 'S=on' : selectedRankRange === 'M' }]" 
                                :title="selectedRankRange === 'M' ? '선택됨' : ''" 
                                type="button"
                                @click="fetchRankingItemByRange('M')"
                            >
                                <b>월간</b>
                            </button>
                        </li>
                    </ul>
                    <div class="m_ranking-head-update">
                        <!-- (D) btn_help 클릭시 .m...head-update에 'S=switch-on' 클래스가 추가되고 .m...update-tooltip 요소가 노출됩니다. -->
                        <p class="text_update">
                            <span>{{ rankingItem.targetDate }}</span>기준
                        </p>
                        <button 
                            :class="['btn_help', { 'S=switch-on' : isActive}]" 
                            data-switch="{ '_isParent': true }" 
                            type="button"
                            @click="isActive = !isActive" 
                        >
                            <i class="ico_tooltip" />
                        </button>
                        <div
                            class="m...update-tooltip"
                            :style="isActive ? { display: 'block'} : {}"
                        >
                            <p>전일 기준으로 랭킹 산정(매일 0시 기준, 일 1회 집계)</p>
                            <p>한 브랜드당 최대 10개의 상품만 노출됩니다.</p>
                            <p>산정기간: {{ rankingItem.rankPeriod }}</p>
                            <button
                                type="button"
                                class="btn_close"
                                onclick="this.parentElement.previousElementSibling.click();"
                            >
                                <i class="ico_close" /><b class="mm_ir-blind">닫기</b>
                            </button>
                        </div>
                    </div>
                    <!-- 상품리스트 -->
                    <!-- 아이템 랭킹 상품 -->
                </template>
            </div>
            <div v-if="rankingItem.goodsList.length > 0" class="mm_product-list">
                <ol>
                    <li
                        v-for="goods in rankingItem.goodsList"
                        :key="goods.id"
                    >
                        <mm-ranking-goods 
                            class="T=pb"
                            :use-rank-tag="true" 
                            :goods="goods" 
                            :has-rank-range="rankingItem.hasRankRange" 
                            :use-liked-button="true" 
                        />                         
                    </li>
                </ol>
            </div>
            <p v-else class="mm_text-none">
                <i class="ico_text-none" />집계된 상품이 없습니다
            </p>
        </div>
    </template>
    <template v-else>
        <div class="mm_inner m_ranking-item">
            <div class="m_ranking-head" />
            <div class="mm_product-list T=skeleton">
                <ol>
                    <li v-for="i in 100" :key="i">
                        <div class="mm_product-item T=pb">
                            <i class="image_product" />
                            <div class="mm_product-item-info">
                                <p class="text_brand" />
                                <p class="text_product" />
                                <p class="text_price" />
                            </div>
                        </div>
                    </li>
                </ol>
            </div>
        </div>
    </template>
</template>

<script setup lang='ts'>
import Slider from '@/components/Slider.vue';
import MmRankingGoods from '@/components/ranking/Goods.vue';
import { ref, watch } from 'vue';
import { Category } from '$/@type/category';
import { useItemRanking } from '$/composables/rankingComposable';
import { stickyRankingCategory as vStickyRankingCategory } from '$/directives';

defineProps<{
    categories: Category[],
}>();

const { 
    selectedCategoryCode,
    selectedRankRange,
    rankingItem,
    fetchRankingItem,
    fetchRankingItemByRange,
} = useItemRanking();

watch(selectedCategoryCode, (to, from) => {
    if (to !== from) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
})

const isActive = ref(false);

</script>
