<template>
    <section class="mm_inner m_ranking-brand">
        <h3><b><strong>브랜드</strong>랭킹</b></h3>
        <template v-if="rankingBrand !== null">
            <p
                v-if="rankingBrand.hasRankRange"
                class="text_update"
            >
                <span>{{ rankingBrand.targetDate }}</span>기준
            </p>
            <template v-if="rankingBrand.brandList.length > 0">
                <div class="m_ranking-brand-list T=brand-autoplay">
                    <i ref="brandHighlightElement" class="ico_brand-highlight" />
                    <ol>
                        <li 
                            v-for="(brand, brandIndex) in rankingBrandList"
                            :key="brand.id"
                            :class="brandIndex === activeBrandIndex && !hoveredTargetElement ? onClassName : ''"
                        >
                            <MMLink
                                :to="{ name: 'GoodsBrandIndex', params: { id: brand.id } }"
                                :class="['btn_brand']"
                                @mouseenter.prevent="hover($event.target as HTMLElement)"
                                @mouseleave="unhover()"
                            >
                                <b>{{ brand.name }}</b>
                                <b class="text_rank">
                                    <template v-if="rankingBrand.hasRankRange">
                                        <span
                                            v-if="brand.changeType === 'U'"
                                            class="text_rank-up"
                                        ><i
                                            class="ico_rank-up"
                                            title="상승"
                                        />{{ brand.changeValue }}</span>
                                        <span
                                            v-else-if="brand.changeType === 'D'"
                                            class="text_rank-down"
                                        ><i
                                            class="ico_rank-down"
                                            title="하락"
                                        />{{ brand.changeValue }}</span>
                                        <i
                                            v-else-if="brand.changeType === 'N'"
                                            class="ico_rank-new"
                                            title="신규"
                                        />
                                        <i
                                            v-else
                                            class="ico_rank-unchanged"
                                            title="변동없음"
                                        />
                                    </template>
                                    <template v-else>
                                        <i class="ico_rank-unchanged" title="변동없음" />
                                    </template>
                                </b>
                            </MMLink>
                            <div class="mm_product-list">
                                <ul>
                                    <li v-for="goods in (brand.goodsList || [])?.slice(0,3)" :key="goods.id">
                                        <mm-ranking-simple-goods class="T=pa" :goods="goods" :show="['brandName', 'goodsName', 'saleRate']" />
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ol>
                </div>
                <div class="mm_foot">
                    <div class="mm_btn_box">
                        <MMLink 
                            :to="{ name: 'RankingBrand' }" 
                            :class="'mm_btn T=line btn_more'"
                        >
                            <b>BEST 브랜드 더보기</b><i class="ico_link" />
                        </MMLink>
                    </div>
                </div>
            </template>
            <template v-else>
                <p class="mm_text-none">
                    <i class="ico_text-none" />집계된 브랜드가 없습니다
                </p>
            </template>
        </template>
        <template v-else>
            <div class="m_ranking-brand-list T=brand-autoplay  T=skeleton">
                <ol>
                    <li v-for="i in 6" :key="i" :class="i == 1 ? onClassName : ''">
                        <a class="btn_brand" />
                        <div class="mm_product-list T=skeleton">
                            <ul>
                                <li v-for="j in 3" :key="j">
                                    <div class="mm_product-item">
                                        <i class="image_product" />
                                        <div class="mm_product-item-info">
                                            <p
                                                class="text_price"
                                                style="float: right;"
                                            />
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ol>
            </div>
        </template>
    </section>
</template>
<script setup lang='ts'>
import { RankingBrand } from '$/@type/ranking';
import MmRankingSimpleGoods from '@/components/ranking/SimpleGoods.vue';
import { computed, ref, toRefs, watch } from 'vue';
import { gsap } from 'gsap'

const props = defineProps<{
    rankingBrand: RankingBrand|null
}>();

/** VARIABLE */
const { rankingBrand } = toRefs(props);
const rankingBrandList = computed(() => (rankingBrand.value?.brandList || []).slice(0,6))
const activeBrandIndex = ref<number>(0);
const brandHighlightElement = ref<HTMLElement|null>();
const autoPlayInterval = ref<NodeJS.Timer>();
const hoveredTargetElement = ref<HTMLElement|null>();
const hoverClassName = 'S=brand-hover';
const onClassName = 'S=brand-on';
/** // VARIABLE */

/** FUNCTION */
function highlight() {
    if (!brandHighlightElement.value) {
        return;
    }
    gsap.fromTo(brandHighlightElement.value, 
        {
            y: `${(activeBrandIndex.value - 1) * 100}%`
        },
        {
            y: `${(activeBrandIndex.value) * 100}%`,
            duration: 0.3,
            ease: 'sine.inOut',
        },
    )
}

function autoPlay() {
    if (rankingBrandList.value.length <= 1) {
        return;
    }
    autoPlayInterval.value = setInterval(() => {
        activeBrandIndex.value = activeBrandIndex.value === (rankingBrandList.value || []).length - 1 
            ? 0 
            : activeBrandIndex.value + 1
        highlight();
    }, 4000)
}

function hover(target: HTMLElement) {
    hoveredTargetElement.value = target.closest('li');
    if (!hoveredTargetElement.value || hoveredTargetElement.value.classList.contains(onClassName)) {
        return hoveredTargetElement.value = null;
    }
    hoveredTargetElement.value.classList.add(hoverClassName);
    clearInterval(autoPlayInterval.value);
}

function unhover() {
    if (!hoveredTargetElement.value) {
        return;
    }
    hoveredTargetElement.value.classList.remove(hoverClassName)
    autoPlay();
    hoveredTargetElement.value = null;
}
/** // FUNCTION */

/** VUE LIFE CYCLE */
const unwatch = watch(rankingBrand, () => {
    if (!rankingBrand.value) {
        return;
    }
    highlight();
    autoPlay();
    unwatch();
})
/** // VUE LIFE CYCLE */
</script>
