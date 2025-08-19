<template>
    <!-- 카테고리 -->
    <div v-stickyCategory class="m_ranking-category">
        <div class="m_ranking-category-list">
            <div ref="categoryScroller" class="mm_scroller T=x">
                <ul>
                    <li>
                        <a 
                            href="#" 
                            :class="{ 'S=category-on' : selectedCategoryCode === '' }" 
                            :title="selectedCategoryCode === '' ? '선택됨' : ''"
                            @click="resetRankingItem(); setCategory('')"
                        >
                            <i class="ico_category-all" /><b>전체</b>
                        </a>
                    </li>
                    <li v-for="category in categories" :key="category.code">
                        <a
                            href="#" 
                            :class="{ 'S=category-on' : selectedCategoryCode === category.code }" 
                            :title="selectedCategoryCode === category.code ? '선택됨' : ''" 
                            @click="resetRankingItem(); setCategory(category.code)"
                        >
                            <i v-lazyload="{ src: category.imageUrl }" class="mm_bg-cover image_category" /><b>{{ category.name }}</b>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!--// 카테고리 -->
    <!-- 아이템 랭킹 -->
    <template v-if="rankingItem !== null">
        <div class="mm_inner m_ranking-item">
            <div class="m_ranking-head">
                <template v-if="rankingItem.hasRankRange">
                    <div class="m_ranking-head-update">
                        <p class="text_update">
                            <span>{{ rankingItem.targetDate }}</span>기준
                        </p>
                        <button 
                            :class="['btn_help', { 'S=switch-on' : isActive}]" 
                            type="button" 
                            data-switch="{ '_isParent': true }"
                            @click="isActive = !isActive" 
                        >
                            <i class="ico_tooltip" />
                        </button>
                        <div class="m...update-tooltip" :style="isActive ? { display: 'block'} : {}">
                            <p>전일 기준으로 랭킹 산정(매일 0시 기준, 일 1회 집계)</p>
                            <p>산정기간: {{ rankingItem.rankPeriod }}</p>
                            <button type="button" class="btn_close" onclick="this.parentElement.previousElementSibling.click();">
                                <i class="ico_tooltip-close" /><b class="mm_ir-blind">닫기</b>
                            </button>
                        </div>
                    </div>
                    <MMSelect 
                        v-model="selectedRankRange" 
                        :class="'T:sm'" 
                        @change="setPeriod(selectedRankRange)"
                    >
                        <option v-for="period in periods" :key="period.code" :value="period.code">
                            {{ period.label }}
                        </option>
                    </MMSelect>
                </template>
            </div>
            <template v-if="rankingItem.goodsList">
                <div v-if="rankingItem.goodsList.length > 0" class="mm_product-list T=card">
                    <!--
                        (D) 찜한 아이템의 .btn_like 버튼에 'S=switch-on' 클래스와 '선택됨' 타이틀이 추가됩니다.
                        data-switch 속성에 onChange(1번째 파라미터로 true/false 전달) 값으로 콜백을 설정할 수 있습니다.
                    -->
                    <ol>
                        <li v-for="goods, goodsIndex in rankingItem.goodsList" :key="goods.id">
                            <mm-ranking-goods 
                                :class="goodsIndex < 3 ? 'T=single' : 'T=pa'" 
                                :use-rank-tag="true" 
                                :has-rank-range="rankingItem.hasRankRange" 
                                :goods="goods" 
                                :use-liked-button="true" 
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
        <div class="mm_inner m_ranking-item">
            <div class="m_ranking-head" />
            <div class="mm_product-list T=card T=skeleton">
                <ol>
                    <li v-for="i in 3" :key="i">
                        <div class="mm_product-item T=single">
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
    <!--// 아이템 랭킹 -->
</template>

<script setup lang='ts'>
import { ref, onMounted, nextTick } from 'vue';
import { Category } from '$/@type/category';
import MmRankingGoods from '@/components/ranking/goods/TypeA.vue';
import MMSelect from '@/components/input/Select.vue';
import { mmon } from '$/helper/mmon';
import { horizontalScrollMove } from '$/functions';
import { useItemRankingMobile } from '$/composables/rankingComposable';

defineProps<{
    categories: Category[],
}>();

const categoryScroller = ref<HTMLElement|null>(null);
const isActive = ref(false);

const { 
    periods,
    selectedRankRange,
    selectedCategoryCode,
    rankingItem,
    setCategory,
    setPeriod,
} = useItemRankingMobile('goods-order');

const vStickyCategory = {
    mounted: (element: HTMLElement) => {
        const categoryHeight:number = parseFloat(`${element.offsetHeight}`);
        const header:HTMLElement|null = document.querySelector('.mm_header');

        element.style['height'] = `${element.offsetHeight}`;

        const scroller = mmon.scroll.find();
        const category: HTMLElement = element as HTMLElement;
        const stickyClassName = 'S=sticky-on';

        // sticky처리
        (scroller).addEventListener('scroll', () => {
            const offsetTop = element.getBoundingClientRect().top || 0
            const headerOffsetTop = header?.getBoundingClientRect().top || 0

            if (offsetTop - categoryHeight - headerOffsetTop < 0) {
                category.classList.add(stickyClassName);
            } else {
                category.classList.remove(stickyClassName);
            }
        }, false);
    }
}

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
    

onMounted(async() => {
    scrollMove();
})
</script>
