<template>
    <!-- 카테고리 -->
    <div 
        ref="rankingCategory"
        class="m_ranking-category"
        :class="isStickyCategory ? stickyClassList.category : ''"
    >
        <div class="m_ranking-category-inner">
            <div ref="categoryScroller" class="mm_scroller T=x">
                <!-- (D) 선택된 카테고리에 'S=category-on' 클래스와 '선택됨' 타이틀을 추가합니다 -->
                <ul>
                    <li>
                        <button 
                            type="button"
                            :class="{ 'S=category-on' : selectedCategoryCode === '' }" 
                            :title="selectedCategoryCode === '' ? '선택됨' : ''"
                            @click="resetRankingItem(); setCategory('')"
                        >
                            <b>ALL</b>
                        </button>
                    </li>
                    <li v-for="category in categories" :key="category.code">
                        <button 
                            type="button"
                            :class="{ 'S=category-on' : selectedCategoryCode === category.code }" 
                            :title="selectedCategoryCode === category.code ? '선택됨' : ''" 
                            @click="resetRankingItem(); setCategory(category.code)"
                        >
                            <b>{{ category.name }}</b>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!--// 카테고리 -->
    <!-- VIEW 랭킹 -->
    <template v-if="rankingItem !== null">
        <div class="mm_inner m_ranking-view">
            <div class="m_ranking-head">
                <template v-if="rankingItem.hasRankRange">
                    <div class="m_ranking-head-update">
                        <!-- (D) btn_help 클릭시 .m...head-update에 'S=switch-on' 클래스가 추가되고 .m...update-tooltip 요소가 노출됩니다. -->
                        <p class="text_update">
                            <span>{{ rankingItem.targetDate }}</span>기준
                        </p>
                        <button
                            :class="['btn_help', { 'S=switch-on': isActive }]"
                            type="button"
                            @click="isActive = !isActive"
                        >
                            <i class="ico_tooltip" />
                        </button>
                        <div class="m...update-tooltip" :style="isActive ? { display: 'block' } : {}">
                            <p>전일 기준으로 랭킹 산정(매일 0시 기준, 일 1회 집계)</p>
                            <p>한 브랜드당 최대 10개의 상품만 노출됩니다.</p>
                            <p>산정기간: {{ rankingItem.rankPeriod }}</p>
                            <button type="button" class="btn_close" onclick="this.parentElement.previousElementSibling.click();">
                                <i class="ico_tooltip-close" /><b class="mm_ir-blind">닫기</b>
                            </button>
                        </div>
                    </div>
                    <div class="m_ranking-head-sort">
                        <MMSelect 
                            v-model="selectedRankRange" 
                            @change="setPeriod(selectedRankRange)"
                        >
                            <option v-for="period in periods" :key="period.code" :value="period.code">
                                {{ period.label }}
                            </option>
                        </MMSelect>
                    </div>
                </template>
            </div>
            <template v-if="rankingItem.goodsList">
                <div v-if="rankingItem.goodsList.length > 0" class="mm_product-list T=card">
                    <ol>
                        <li v-for="goods in rankingItem.goodsList" :key="goods.id">
                            <mm-ranking-goods 
                                class="T=pb"
                                :goods="goods"
                                :has-rank-range="rankingItem.hasRankRange"
                                :is-show-price="false"
                            />
                        </li>
                    </ol>
                </div>
                <p v-else class="mm_text-none">
                    <i class="ico_text-none" />집계된 상품이 없습니다
                </p>
            </template>
        </div>
    </template>
    <template v-else>
        <div class="mm_inner m_ranking-view">
            <div class="m_ranking-head" />
            <div class="mm_product-list T=card T=skeleton">
                <ol>
                    <li v-for="i in 10" :key="i">
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
    <!--// VIEW 랭킹 -->
</template>

<script setup lang='ts'>
import { ref, onMounted, nextTick } from 'vue';
import { Category } from '$/@type/category';
import MmRankingGoods from '@/components/ranking/Goods.vue';
import MMSelect from '@/components/input/Select.vue';
import { mmon } from '$/helper/mmon';
import { horizontalScrollMove } from '$/functions';
import { useItemRankingMobile } from '$/composables/rankingComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useEventListener } from '@vueuse/core';

defineProps<{
    categories: Category[],
}>();

/** VARIABLE */
const categoryScroller = ref<HTMLElement|null>(null);
const isActive = ref(false);

const { 
    periods,
    selectedRankRange,
    selectedCategoryCode,
    rankingItem,
    setCategory,
    setPeriod,
} = useItemRankingMobile('goods-view');

const { header } = usePageContext();
const gnb = ref<HTMLElement|null>(document.querySelector('.mm_gnb'))
const rankingGnb = ref<HTMLElement|null>(document.querySelector('.m_ranking-gnb'))
const rankingGnbInner = ref<HTMLElement|null>(document.querySelector('.m_ranking-gnb-inner'))
const rankingCategory = ref<HTMLElement|null>();
const isStickyCategory = ref<boolean>(false);
const stickyClassList = {
    gnb: 'S=gnb-sticky',
    category: 'S=category-sticky',
    sub: 'S=sticky-cate',
}
/** // VARIABLE */

/** FUNCTION */

async function scrollMove() {
    await nextTick();

    mmon.scroll.find().scrollTo(0, 0);

    if (categoryScroller.value) {
        const element = categoryScroller.value.querySelector('.S\\=category-on');
        horizontalScrollMove(categoryScroller.value, element, false);
    }
}

function resetRankingItem() {
    rankingItem.value = null;
    scrollMove();
}
/** // FUNCTION */
    

onMounted(async() => {
    scrollMove();
    const scroller = mmon.scroll.find();
    useEventListener(scroller, 'scroll', () => {
        if (!rankingCategory.value) {
            return;
        }

        if (!rankingGnb.value) {
            return rankingGnb.value = document.querySelector('.m_ranking-gnb');
        }

        if (!gnb.value) {
            return gnb.value = document.querySelector('.mm_gnb');
        }

        if (!rankingGnbInner.value) {
            return rankingGnbInner.value = document.querySelector('.m_ranking-gnb-inner');
        }

        if (header.element.value == null) {
            return header.refresh();
        }

        const offsetTop = mmon.scroll.position(header.element.value).top 
            + header.element.value.offsetHeight 
            + rankingGnbInner.value.offsetHeight;
        const position = rankingCategory.value.getBoundingClientRect().top 
            + rankingCategory.value.offsetHeight;
        
        isStickyCategory.value = position < offsetTop && (rankingGnb.value.classList.contains("S=gnb-sticky"));
        if (position < offsetTop) {
            rankingGnb.value.classList.add(stickyClassList.sub)
        } else {
            rankingGnb.value.classList.remove(stickyClassList.sub)
        }
    })
})
</script>