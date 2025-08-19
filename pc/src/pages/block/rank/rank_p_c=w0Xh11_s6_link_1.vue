<template>
    <MMBlock
        block-name="rank_p_c=w0Xh11_s6_link_1"
        :required="{
            requiredValueList: [block.goodsGroup?.goodsList, block.title1, block.title2]
        }"
    >
        <div class="mui_inner">
            <MMTitle 
                :title1="block.title1"
                :title2="block.title2"
                :design-class-name="block.designTitleClassName"
            />
            <div class="m_ranking">
                <div v-if="activeGoods" class="m_ranking-active-item">
                    <MMRankingGoods :goods="activeGoods" :use-icon="true" :has-range="block.rankHasRange"/>
                    <a v-if="nextActiveGoods" id="ranking_next_active_item" ref="nextActiveElement" class="ranking_next_active_item">
                        <p class="text_rank" :class="nextActiveGoods.rank === 1 ? 'T=rank-first' : ''">
                            <strong>{{ nextActiveGoods.rank }}</strong>
                            <template v-if="block.rankHasRange">
                                <span v-if="nextActiveGoods.rankChangeType === 'U'" class="text_rank-up">
                                    <i class="uico_rank-up" title="상승" />{{ nextActiveGoods.rankChangeValue }}
                                </span>
                                <span v-else-if="nextActiveGoods.rankChangeType === 'D'" class="text_rank-down">
                                    <i class="uico_rank-down" title="하락" />{{ nextActiveGoods.rankChangeValue }}
                                </span>
                                <i v-else-if="nextActiveGoods.rankChangeType === 'N'" class="uico_rank-new" title="신규" />
                                <i v-else class="uico_rank-unchanged" title="변동없음" />
                            </template>
                        </p>
                        <figure>
                            <div class="mui_image-scale">
                                <i
                                    v-lazyload="{ src: nextActiveGoods.thumbnailUrl }"
                                    class="mui_bg-cover image_product"
                                    :data-lazyload="`{ '_src': '${nextActiveGoods.thumbnailUrl}' }`"
                                />
                            </div>
                            <figcaption>
                                <p class="text_brand">
                                    {{ nextActiveGoods.brandName }}
                                </p>
                                <p class="text_product">
                                    {{ nextActiveGoods.name }}
                                </p>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(nextActiveGoods.baseDiscountedPrice) }}</strong>
                                </p>
                                <!-- <p 
                                    v-if="nextActiveGoods.icon"
                                    class="text_tag"
                                    :style="{ 'background-color': nextActiveGoods.icon.backgroundColor, color: nextActiveGoods.icon.textColor }"
                                >
                                    {{ nextActiveGoods.icon.label }}
                                </p> -->
                            </figcaption>
                        </figure>
                    </a>
                </div>
                <div 
                    class="m_ranking-carousel"
                    data-ranking="{ '_autoDelay': 3 }" 
                    @mouseenter="clearCarousel" 
                    @mouseleave="startCarousel"
                >
                    <div class="m_ranking-carousel-inner" :style="`width: ${carouselInnerWidth}px;`">
                        <ul ref="carouselListElement" class="m_ranking-carousel-list" @mouseleave="stopSpread">
                            <li
                                v-if="cloneActiveGoods"
                                ref="cloneCarouselElement" 
                                class="m_ranking-carousel-item S=clone"
                            >
                                <MMRankingGoods :goods="cloneActiveGoods" :has-range="block.rankHasRange"/>
                            </li>
                            <template v-if="goodsList.length > 1">
                                <li 
                                    v-for="goods, goodsIndex in nonActiveGoodsList"
                                    :key="goods.id"
                                    class="m_ranking-carousel-item"
                                    @mouseenter="spreadItem(goodsIndex)"
                                >
                                    <MMRankingGoods :goods="goods" :has-range="block.rankHasRange"/>
                                </li>
                            </template>
                        </ul>
                    </div>
                    <template v-if="goodsList.length > 1">
                        <div class="m_ranking-carousel-control">
                            <button type="button" class="btn_carousel-prev" @click="changeActiveItem('prev')">
                                <i class="uico_control-prev" /><b class="mm_ir-blind">이전으로</b>
                            </button>
                            <button type="button" class="btn_carousel-next" @click="changeActiveItem('next')">
                                <i class="uico_control-next" /><b class="mm_ir-blind">다음으로</b>
                            </button>
                        </div>
                        <div class="m_ranking-carousel-count">
                            <strong class="text_carousel-index">{{ activeIndex + 1 }}</strong>
                            <i>/</i>
                            <span class="text_carousel-total">{{ (block.goodsGroup?.goodsList || []).length }}</span>
                        </div>
                    </template>
                </div>
            </div>
            <MMBlockLink :link="block.link || ''" :label="'랭킹 상품 더보기'" />
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from '$/@type/block'
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import MMBlock from '@/components/block/Block.vue'
import MMRankingGoods from '@/components/block/special/RankingGoods.vue'
import MMBlockLink from '@/components/block/Link.vue'
import MMTitle from '@/components/block/Title.vue'
import gsap from "gsap";

const props = defineProps<{ block: Block }>()
const { block } = toRefs(props)

/** VARIABLE */
// 랭킹상품 리스트
const goodsList = computed(() => block.value.goodsGroup?.goodsList || [])
const nonActiveGoodsList = computed(() => {
    const firstChunk = goodsList.value.slice(0, activeIndex.value + 1);
    const secondChunk = goodsList.value.slice(activeIndex.value + 1);
    return secondChunk.concat(firstChunk)
})
// active 영역 상품 
const activeGoods = computed<typeof goodsList.value[0] | null>(() => goodsList.value[activeIndex.value] || null);
const cloneActiveGoods = ref<typeof activeGoods.value | null>();
const nextActiveGoods = ref<typeof goodsList.value[0] | null>();
// 랭킹 캐러셀 방향
const carouselDirection = ref<'prev'|'next'>('next');

// active 영역 상품 index
const activeIndex = ref<number>(0);
const nextActiveIndex = computed<number>(() => {
    const lastIndex = goodsList.value.length - 1
    if (carouselDirection.value === 'prev') {
        return activeIndex.value > 0 ? activeIndex.value - 1 : lastIndex
    } else {
        return activeIndex.value < lastIndex ? activeIndex.value + 1 : 0
    }
})

// 랭킹 캐러셀 interval
const carouselInterval = ref<NodeJS.Timeout|null>()
const isCarouselChanging = ref<boolean>(false);

// 랭킹 캐러셀 element
const carouselListElement = ref<HTMLElement>();
const cloneCarouselElement = ref<HTMLElement>();
const nextActiveElement = ref<HTMLElement>();
// 펼쳐보기 > 이동할 elements
const spreadTargetItems = ref<HTMLElement[]>([]);
// 캐러셀 width(item 갯수 모자란경우 clone영역 미노출처리)
const carouselInnerWidth = computed<number>(() => {
    const initialWidth = 400;
    return initialWidth + (goodsList.value.length - 2) * 110;
});
/** // VARIABLE */

/** FUNCTION */
/**
 * 메인 랭킹상품 변경
 * @param direction 이동방향
 */
function changeActiveItem(direction: 'prev'|'next' = 'next') {
    carouselDirection.value = direction;
    if (isCarouselChanging.value || !carouselListElement.value) {
        return;
    }

    isCarouselChanging.value = true;

    if (direction === 'prev') {
        cloneActiveGoods.value = activeGoods.value
    }

    gsap.to(carouselListElement.value, { 
        x: (direction === `prev`) ? 0 : -220, 
        duration: 0.15, 
        ease: `sine.InOut`, 
        onComplete: () => {
            nextActiveGoods.value = goodsList.value[nextActiveIndex.value] || null;
        }   
    });

    const target = direction === 'prev' 
        ? cloneCarouselElement.value 
        : Array.from(carouselListElement.value.querySelectorAll('li:not(.S\\=clone):not(.S\\=on)'))[0];

    if (!target) {
        return;
    }

    gsap.to(target, { 
        x: (direction === `prev`) ? 0 : `-100%`, 
        duration: 0.6, 
        ease: `Sine.in`,
        onComplete: () => {
            if (!carouselListElement.value) {
                return;
            }
            gsap.set(carouselListElement.value, { x: -110 });
            
            if (direction == 'prev' && cloneCarouselElement.value) {
                gsap.set(target, { x: '-100%'})
                
            } else {
                gsap.set(target, { clearProps: 'all'});
            }
            activeIndex.value = nextActiveIndex.value
            if (direction === 'next') {
                cloneActiveGoods.value = activeGoods.value
            }
            isCarouselChanging.value = false
        } 
    })
    
}

/**
 * 캐러셀 시작
 */
function startCarousel() {
    const nonActiveItemElements:HTMLElement[] = Array.from(carouselListElement.value?.querySelectorAll('li:not(.S\\=clone):not(.S\\=on)') || []);
    gsap.to(nonActiveItemElements, {
        x: ``, 
        duration: 0.3, 
        ease: `sine.out`,
    });
    carouselInterval.value = setInterval(changeActiveItem, 3000)
}

/**
 * 캐러셀 중지
 */
function clearCarousel() {
    if (!carouselInterval.value) {
        return;
    }

    clearInterval(carouselInterval.value);
}

/**
 * 펼쳐보기
 */
function spreadItem(targetIndex: number) {
    if (!carouselListElement.value) {
        return
    }

    const nonActiveItemElements:HTMLElement[] = Array.from(carouselListElement.value.querySelectorAll('li:not(.S\\=clone):not(.S\\=on)')) || [];
    spreadTargetItems.value = [];
    for (let index = 0; index < nonActiveItemElements.length; index++) {
        if (index !== targetIndex) {
            spreadTargetItems.value.push(nonActiveItemElements[index]);
        } else {
            gsap.to(nonActiveItemElements[index], { x: ``, duration: 0.3 });
            break;
        }
    }
    
    if (spreadTargetItems.value.length < 1) {
        return;
    }

    gsap.to(spreadTargetItems.value, { x: -250, duration: 0.3, ease: `sine.out` });
}

/**
 * 펼쳐보기 중지
 */
function stopSpread() {
    if (spreadTargetItems.value.length < 1) {
        return;
    }

    gsap.to(spreadTargetItems.value, { 
        x: ``, 
        duration: 0.3, 
        ease: `sine.out`,
        onComplete: () => {
            spreadTargetItems.value = [];
        }
    });
}
/** // FUNCTION */

/** VUE LIFE CYCLE */
onMounted(() => {
    startCarousel();
    cloneActiveGoods.value = activeGoods.value
});

const carouselListUnwatch = watch(carouselListElement, (to) => {
    if (!to) {
        return;
    }
    gsap.set(to, { x: -110 });
    carouselListUnwatch();
})

const carouselCloneUnwatch = watch(cloneCarouselElement, (to) => {
    if (!to) {
        return;
    }
    gsap.set(to, { x: `-100%` });
    carouselCloneUnwatch();
})

watch(activeIndex, (to) => {
    setTimeout(() => {
        nextActiveGoods.value = null;
    }, 100); 
})

watch(nextActiveElement, (to) => {
    if (!to) {
        return;
    }
    
    gsap.to(to, { opacity: 1, duration: 0.3 });
})
/** // VUE LIFE CYCLE */

</script>
<style>
@import '@publish/css/block/specific/rank_p_c=w0Xh11_s6_link_1.css';

</style>
