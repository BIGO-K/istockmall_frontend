<template>
    <section id="m_ranking-brand" class="mm_inner m_ranking-brand">
        <h3><b><strong>브랜드</strong>랭킹</b></h3>
        <template v-if="rankingBrand !== null && rankingBrand.brandList.length > 0">
            <!-- 브랜드리스트 -->
            <div ref="listElement" class="m_ranking-brand-list">
                <ol>
                    <li 
                        v-for="(brand, brandIndex) in rankingBrand.brandList.slice(0,6)"
                        :key="brand.id"
                        :class="brand.id === activeBrandId ? onClassName : ''"
                    >
                        <button
                            type="button"
                            :class="['btn_brand']"
                            @click.prevent="changeIndex(brandIndex)"
                        >
                            <b class="text_rank">
                                <template v-if="rankingBrand.hasRankRange">
                                    <span v-if="brand.changeType === 'U'" class="text_rank-up"><i class="ico_rank-up" title="상승" />{{ brand.changeValue }}</span>
                                    <span v-else-if="brand.changeType === 'D'" class="text_rank-down"><i class="ico_rank-down" title="하락" />{{ brand.changeValue }}</span>
                                    <i v-else-if="brand.changeType === 'N'" class="ico_rank-new" title="신규" />
                                    <i v-else class="ico_rank-unchanged" title="변동없음" />
                                </template>
                                <template v-else>
                                    <i class="ico_rank-unchanged" title="변동없음" />
                                </template>
                            </b>
                            <b>{{ brand.name }}</b>
                        </button>
                        <div class="mm_product-list">
                            <ol class="mm_flex T=equal">
                                <li v-for="goods in brand.goodsList?.slice(0,3)" :key="goods.id">
                                    <mm-ranking-simple-goods :goods="goods" />
                                </li>
                            </ol>
                        </div>
                    </li>
                </ol>
            </div>
            <!--// 브랜드리스트 -->
            <div class="mm_foot">
                <div class="mm_btn_box">
                    <div class="mm_inline">
                        <MMLink 
                            :to="{ name: 'RankingBrand' }" 
                            :class="'mm_btn T=sm T=line btn_more'"
                        >
                            <b>BEST 브랜드 더보기</b><i class="ico_link" />
                        </MMLink>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <p class="mm_text-none">
                <i class="ico_text-none" />집계된 브랜드가 없습니다
            </p>
        </template>
    </section>
</template>
<script setup lang='ts'>
import { RankingBrand } from '$/@type/ranking';
import MmRankingSimpleGoods from '@/components/ranking/SimpleGoods.vue';
import { ref, toRefs, watch } from 'vue';
import { gsap } from 'gsap'

const props = defineProps<{
    rankingBrand: RankingBrand|null
}>();

/** VARIABLE */
const { rankingBrand } = toRefs(props);
const activeBrandId = ref<number>(0);
const activeBrandIndex = ref<number>(0);
const previousBrandIndex = ref<number>(0);
const autoPlayInterval = ref<NodeJS.Timer>();

const listElement = ref<HTMLElement|null>();

const onClassName = 'S=brand-on';
/** // VARIABLE */

/** FUNCTION */

function autoPlay() {
    if ((rankingBrand.value?.brandList || []).length <= 1) {
        return;
    }
    autoPlayInterval.value = setInterval(() => {
        previousBrandIndex.value = activeBrandIndex.value
        activeBrandIndex.value = activeBrandIndex.value === (rankingBrand.value?.brandList || []).length - 1 
            ? 0 
            : activeBrandIndex.value + 1
        changeBrand();
    }, 4000)
}

function changeIndex(brandIndex: number) {
    if (activeBrandIndex.value === brandIndex && activeBrandIndex.value !== 0) {
        return;
    }

    if (autoPlayInterval.value) {
        clearInterval(autoPlayInterval.value);
    }
    previousBrandIndex.value = activeBrandIndex.value
    activeBrandIndex.value = brandIndex
    changeBrand();
    autoPlay();
}

function changeBrand() {
    if (!listElement.value) {
        return;
    }
    
    const brandItemsElement = listElement.value.querySelectorAll('ol:not(.mm_flex) > li');

    const nextItemElement = brandItemsElement[activeBrandIndex.value];
    const previousItemElement = brandItemsElement[previousBrandIndex.value];
    const nextProductList = nextItemElement?.querySelector(".mm_product-list");
    const previousProductList = previousItemElement?.querySelector(".mm_product-list");
    
    if (!nextProductList || (!previousProductList && activeBrandIndex.value === 0)) {
        return;
    }

    gsap.to(previousProductList, {
        height: '0', 
        ease: 'cubic.out', 
        duration: 0.4,
        onComplete: function () {
            gsap.set(previousProductList, { height: '' });
        }
    })
    gsap.to(nextProductList, {
        height: 'auto', 
        ease: 'cubic.out', 
        duration: 0.4,
        onComplete: function () {
            activeBrandId.value = (rankingBrand.value?.brandList || [])[activeBrandIndex.value]?.id || 0;
        }
    })

}
/** // FUNCTION */

/** VUE LIFE CYCLE */
const unwatch = watch(listElement, (to) => {
    if (!to) {
        return;
    }
    changeIndex(0);
    unwatch();
})

/** // VUE LIFE CYCLE */
</script>
