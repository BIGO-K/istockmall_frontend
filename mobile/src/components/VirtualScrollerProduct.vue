<template>
    <div
        ref="container$"
        :class="[attrs.class]"
        :style="{
            minHeight: `${minHeight}px`
        }"
    >
        <div class="mm_product-list-head">
            <slot name="header" />
        </div>
        <p v-if="totalCount === 0 && !isLoading" class="mm_text-none">
            <i class="ico_text-none" />등록된 상품이 없습니다.
        </p>
        <ul
            ref="itemContainer$"
            :style="{
                paddingTop: `${paddingTop}px`,
                paddingBottom: `${paddingBottom}px`,
                opacity: !scrollFinished ? 0.75 : 1
            }"
        >
            <template
                v-for="itemWrapper, index in itemWrappersForDisplay"
                :key="itemWrapper._index"                    
            >
                <slot name="item" :item="itemWrapper.item" :index="index" />
            </template>

            <template v-if="isLoading">
                <li v-for="i in 8" :key="i">
                    <div class="mm_product-item" data-skeleton>
                        <i class="image_product" />
                        <div class="mm_product-item-info">
                            <p class="text_brand" />
                            <p class="text_product" />
                            <p class="text_price" />
                        </div>
                    </div>
                </li>
            </template>
        </ul>        
    </div>
    <div v-if="totalCount > 0" class="mm_foot">
        <div class="mm_btn_box">
            <div class="mm_inline">
                <p v-if="items.length == totalCount" id="text_last" class="mm_btn T=sm T=line">
                    마지막 상품입니다
                </p>
                <button v-if="!virtualScrollOn && totalCount > itemsPerPage" type="button" class="mm_btn T=sm T=line btn_more" @click="scrollEventStart">
                    <b>상품 리스트 더보기</b><i class="ico_more" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { Goods } from '$/@type/goods';
import { ref, computed, onMounted, toRefs, watch, onBeforeUnmount, nextTick, useAttrs } from 'vue';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useScroll } from '@vueuse/core';


const attrs = useAttrs();
const props = withDefaults(defineProps<{
    items?: [],
    totalCount: number
    isLoading: boolean,
    isDisplayTypeCard?: boolean,
    isPageReady?: boolean,
    initPage?: number
    itemsPerPage?: number,
}>(), {
    items: () =>  [],
    isPageReady: false,
    initPage: 1,
    itemsPerPage: 100,
    isDisplayTypeCard: true
})

const emit = defineEmits<{
    (e: 'pageRequired', page: number|number[]): void,
    (e: 'pageOnViewChanged', currentPage: number, oldPage: number): void
}>()

/** VARIABLE */
const { items, itemsPerPage, isDisplayTypeCard } = toRefs(props);

const {
    currentPageContextTop
} = usePageContext();


function setHeightPxPerItem() {
    const itemElement = document.querySelector('.mm_inner li div.mm_product-item:not([data-skeleton])');
    
    if (!itemElement) {
        return
    }

    heightPxPerItem.value = itemElement.getBoundingClientRect().height;    
}

// 해상도 가변높이 대응
watch(items, async () => {
    await nextTick()
    setHeightPxPerItem()
})
watch(isDisplayTypeCard, async () => {
    await nextTick()
    setHeightPxPerItem()
})

function getOffsetFromParent(el: Element|null): number {
    if (!el || !(el instanceof HTMLElement) || el.id == 'mm_body') {
        return 0
    }

    return getOffsetFromParent(el.offsetParent) + el.offsetTop
}

const offsetTopToItemContainer = ref(202)
const getTopToItemContainer = () => {
    if (!itemContainer$.value) {
        return
    }
    offsetTopToItemContainer.value = getOffsetFromParent(itemContainer$.value)
}
const watchOffsetTopToItemContainerInterval = setInterval(getTopToItemContainer, 1000)

const heightPxPerItem = ref<number>(353);
const minHeight = ref(currentPageContextTop.value + (window.visualViewport?.height || 0))

const pageOnView = ref(props.initPage);
// 아이템 높이 + 뱃지 아이콘의 여백
const heightPxPerItemWithSpace = computed(() => {
    return (heightPxPerItem.value) + (isDisplayTypeCard.value ? 25 : 8)
})

// 컨테이너 돔
const itemContainer$ = ref<HTMLUListElement|null>(null);
const container$ = ref<HTMLElement|null>(null);
const scroller = ref<HTMLElement|null>(null);

const virtualScrollOn = ref<boolean>(false);

const earlyFetchPx = computed(() => {
    return window.visualViewport?.height;
});

// 앞뒤로 쿠션을 채울 아이템 수
const padItemCount = ref(6);

// 실제로 보여질 아이템
interface ItemWrapper {
    _index: number,
    _isEmptyItem: boolean,
    item: Goods|null,
}
const itemWrappersForDisplay = computed<ItemWrapper[]>(() => {
    return items.value
        .map((item, index) => {
            return ({
                _index: index,
                _isEmptyItem: item == null || item == undefined,
                item,
            }) as ItemWrapper;
        })
        .slice(itemIndexStartPadded.value, itemIndexEndPadded.value);
});

// 앞 쿠션을 반영한 시작 아이템 인덱스
const itemIndexStartPadded = computed(() => {
    return Math.max(itemIndexStartDisplay.value - padItemCount.value, 0)
});

// 뒤 쿠션을 반영한 종료 아이템 인덱스
const itemIndexEndPadded = computed(() => {
    return Math.min(itemIndexEndDisplay.value + padItemCount.value, items.value.length);
});

// 쿠션이 반영되지 않은 시작 아이템 인덱스(순수 뷰 화면에 보여질 대상)
const itemIndexStartDisplay = computed(() => {
    const rawIndex = Math.floor(
        Math.max(viewStart.value - offsetTopToItemContainer.value, 0) / heightPxPerItemWithSpace.value * (isDisplayTypeCard.value ? 2 : 1)
    )

    const calcIndex = rawIndex - (isDisplayTypeCard.value ? rawIndex % 2 : 0)
    return calcIndex - (calcIndex % 10)
});

// 쿠션이 반영되지 않은 종료 아이템 인덱스(순수 뷰 화면에 보여질 대상)
const itemIndexEndDisplay = computed(() => {
    const rawIndex = Math.ceil(
        Math.max(viewEnd.value - offsetTopToItemContainer.value, 0) / heightPxPerItemWithSpace.value * (isDisplayTypeCard.value ? 2 : 1)
    )

    const calcIndex = rawIndex + (isDisplayTypeCard.value ? rawIndex % 2 : 0)
    return calcIndex + (10 -(calcIndex % 10))
});

// 뷰 영역의 시작 Y축 값
const viewStart = computed(() => scrollYPosition.value);

// 뷰 영역의 종료 Y축 값
const viewEnd = computed(() => {            
    return viewStart.value + window.innerHeight;
});

// 쿠션 픽셀값
const paddingTop = computed(() => {
    return heightPxPerItemWithSpace.value * Math.floor(
        (
            itemIndexStartPadded.value
        ) / (isDisplayTypeCard.value ? 2 : 1)
    )
});
const paddingBottom = computed(() => {
    return heightPxPerItemWithSpace.value * Math.floor(
        (items.value.length - itemIndexEndPadded.value) / (isDisplayTypeCard.value ? 2 : 1)
    );
})


const { y: scrollYPosition, directions } = useScroll(scroller);

const scrollerHeight = computed(() => {
    if (!scroller.value) {
        return window.innerHeight
    }

    return scroller.value.scrollHeight
})
const { top, bottom } = toRefs(directions);


watch(scrollYPosition, (to) => {
    pageOnView.value = Math.max(
        Math.ceil(
            (to - offsetTopToItemContainer.value + window.innerHeight) / (heightPxPerItemWithSpace.value * itemsPerPage.value / (isDisplayTypeCard.value ? 2 : 1))
        ),
        1
    )
    
    if (!virtualScrollOn.value) {
        /**
         * 가상스크롤 시작이 되지 않았으면 1페이지로 침
         */
        pageOnView.value = 1;
    }

    if (
        !props.isLoading &&
        bottom.value &&                
            window.innerHeight + to + (earlyFetchPx.value || 0) >= scrollerHeight.value
    ) {
        /**
         * 하단 데이터 필요 판정
         */
        if (virtualScrollOn.value) {
            emit('pageRequired', pageOnView.value);
        }
    }

    if (top.value) {
        /**
                 * up 진행시 empty page touch 타이밍을 조기처리
                 */
        const targetIndex = itemIndexStartPadded.value - 10
        const emptyItemWrapper = items.value[targetIndex];
        if (emptyItemWrapper === null) {
            emit(
                'pageRequired',
                Math.floor(targetIndex / itemsPerPage.value + 1)
            );
        }
    }
})

const scrollFinished = ref(false)
onMounted(async () => {
    getTopToItemContainer();
    if (container$.value !== null) {
        scroller.value = container$.value.closest('.mm_scroller');   
        if (scroller.value) {
            /**
             * 초기렌더링을 약간 더 자연스럽게 만들기 위해 일단 스크롤을 내려둠
             */
            scrollYPosition.value = currentPageContextTop.value    
            // scroller.value.scrollTop = currentPageContextTop.value    
        }
    }

    const initializer = () => {
        if (props.isPageReady !== true) {
            initRequestAnimationFrameId.value = requestAnimationFrame(initializer)
            return;
        }

        if (!scroller.value) {
            initRequestAnimationFrameId.value = requestAnimationFrame(initializer)
            return;
        }

        // scroller.value.scrollTop = currentPageContextTop.value
        // viewStart.value = scroller.value.scrollTop

        scrollYPosition.value = currentPageContextTop.value    
        // viewStart.value = currentPageContextTop.value 

        virtualScrollOn.value = props.initPage > 1 || items.value.length > itemsPerPage.value;

        // if (
        //     virtualScrollOn.value &&             
        //             window.innerHeight + scroller.value.scrollTop + (earlyFetchPx.value || 0) >= scroller.value.scrollHeight
        // )
        if (
            virtualScrollOn.value &&             
                    window.innerHeight + scrollYPosition.value + (earlyFetchPx.value || 0) >= scroller.value.scrollHeight
        )
        {
            /**
             * 하단 데이터 필요 판정
             */
            if (virtualScrollOn.value) {
                emit('pageRequired', props.initPage + 1);
            }
        }
                
        /**
         * 초기화 작업이 완료되면 스크롤 이벤트/관련 watch 거치
         */
        scrollFinished.value = true;

        /**
         * minHeight unset
         */
        minHeight.value = 0;

        watch(itemWrappersForDisplay, (newValue) => {
            /**
             * 노출대상 래퍼 중에 빈 래퍼가 포함되어있으면 요청
             */
            const emptyItemWrapper = newValue.find(
                (itemWrapper) => itemWrapper._isEmptyItem
            );

            if (emptyItemWrapper) {
                emit(
                    'pageRequired',
                    Math.floor(emptyItemWrapper._index / itemsPerPage.value + 1)
                );
            }
        })

        watch (pageOnView, (currentPage, oldPage) => {
            emit('pageOnViewChanged', currentPage, oldPage)
        }) 
        
        if (initRequestAnimationFrameId.value) {
            cancelAnimationFrame(initRequestAnimationFrameId.value)
        }
    };
    const initRequestAnimationFrameId = ref<number | null>(
        requestAnimationFrame(initializer)
    )      
});

onBeforeUnmount(() => {

    clearInterval(watchOffsetTopToItemContainerInterval)
});

function scrollEventStart() {
    virtualScrollOn.value = true;
    emit('pageRequired', 2);
}

/** FUNCTION */

/** VUE LIFE CYCLE */

</script>