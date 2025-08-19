<template>
    <div
        ref="container$"
        :style="{ minHeight: `${minHeight}px`}"
    >
        <ul
            ref="itemContainer$"
            :class="[attrs.class]"
            :style="{
                paddingTop: `${paddingTop}px`,
                paddingBottom: `${paddingBottom}px`,
            }"
        >
            <template
                v-for="itemWrapper in itemWrappersForDisplay"
                :key="itemWrapper._index"
            >
                <slot name="item" :item="itemWrapper.item" :index="itemWrapper._index" />
            </template>
            <template v-if="isLoading">
                <slot v-for="i in itemsPerPage" :key="i" name="skeleton" />
            </template>
        </ul>

        <div class="mm_inner">
            <div class="mm_foot">
                <div v-if="totalCount > itemsPerPage" class="mm_btn_box">
                    <p v-if="items.length === totalCount" id="text_last" class="mm_btn T=sm T=line">
                        마지막 페이지입니다
                    </p>
                    <button v-if="!virtualScrollOn" type="button" class="mm_btn T=line T=dark btn_more" @click="scrollEventStart">
                        <b>더보기</b><i class="ico_more" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, toRefs, ref, computed, watch, useAttrs } from 'vue';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

console.log("virtual scroller add show")

// 실제로 보여질 아이템
interface ItemWrapper {
    _index: number,
    _isEmptyItem: boolean,
    item: any,
}

const props = withDefaults(defineProps<{
    items: unknown[]
    isPageReady: boolean
    initPage: number
    itemsPerPage: number
    totalCount: number
    isLoading: boolean
    heightPxPerItem: number
    padCount?: number
}>(), {
    items: () => [],
    isPageReady: false,
    initPage: 1,
    itemsPerPage: 100,
    isLoading: true,
    heightPxPerItem: 0,
    padCount: 6
})
const emit = defineEmits([
    'pageMoved', 
    'showNextPage', 
    'touchEmptyPage', 
    'snsShare', 
    'kakaoShare', 
    'pageRequired', 
    'pageOnViewChanged'
])
const attrs = useAttrs();
const {
    currentPageContextTop
} = usePageContext();

/** VARIABLE */
const { items, itemsPerPage } = toRefs(props);
const offsetTopToItemContainer = ref(608);
const minHeight = ref(currentPageContextTop.value + (window.visualViewport?.height || 0));
const pageOnView = ref(props.initPage);
const scrollFinished = ref(false);

// 컨테이너 돔
const itemContainer$ = ref<HTMLUListElement|null>(null);
const container$ = ref<HTMLElement|null>(null);
const scroller = ref<HTMLElement|null>(null);

const virtualScrollOn = ref<boolean>(false);

const earlyFetchPx = computed(() => {
    return window.visualViewport?.height;
});

// 앞뒤로 쿠션을 채울 아이템 수
const padItemCount = ref(props.padCount);

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
    return Math.max(itemIndexStartDisplay.value - padItemCount.value, 0);
});

// 뒤 쿠션을 반영한 종료 아이템 인덱스
const itemIndexEndPadded = computed(() => {
    return Math.min(itemIndexEndDisplay.value + padItemCount.value, items.value.length);
});

// 쿠션이 반영되지 않은 시작 아이템 인덱스(순수 뷰 화면에 보여질 대상)
const itemIndexStartDisplay = computed(() => {
    const rawIndex = Math.floor(
        Math.max(viewStart.value - offsetTopToItemContainer.value, 0) / props.heightPxPerItem
    );
            
    return rawIndex
});

// 쿠션이 반영되지 않은 종료 아이템 인덱스(순수 뷰 화면에 보여질 대상)
const itemIndexEndDisplay = computed(() => {
    const rawIndex = Math.ceil(
        Math.max(viewEnd.value - offsetTopToItemContainer.value, 0) / props.heightPxPerItem
    );

    return rawIndex
});

// 뷰 영역의 시작 Y축 값
const viewStart = ref(0);

// 뷰 영역의 종료 Y축 값
const viewEnd = computed(() => {            
    return viewStart.value + window.innerHeight;
});

// 쿠션 픽셀값
const paddingTop = computed(() => {
    return props.heightPxPerItem * itemIndexStartPadded.value;
});

const paddingBottom = computed(() => {
    return props.heightPxPerItem * (items.value.length - itemIndexEndPadded.value);
});

const watchOffsetTopToItemContainerInterval = setInterval(getTopToItemContainer, 1000);

// 스크롤 이벤트 핸들링중 여부
const isOnScrollEventHandling = ref(false);

// 스크롤 방향(up/down)
const scrollDirection = ref('none');

/** FUNCTION */
function getOffsetFromParent(el: Element|null): number {
    if (!el || !(el instanceof HTMLElement)) {
        return 0
    }
    return getOffsetFromParent(el.offsetParent) + el.offsetTop
}

function getTopToItemContainer() {
    if (!itemContainer$.value) {
        return
    }
    offsetTopToItemContainer.value = getOffsetFromParent(itemContainer$.value)
}

async function scrollHandler(target: HTMLElement) {
    isOnScrollEventHandling.value = true;
    viewStart.value = target.scrollTop;

    /**
     * 화면상의 페이지를 유추
     * 사용자가 보고있다고 '판단하는' 페이지
     * 
     * 화면 하단 기준으로 계산(2페이지의 상단 끄트머리만 보여도 2페이지로 취급)
     */
    pageOnView.value = Math.max(
        Math.ceil(
            (target.scrollTop - offsetTopToItemContainer.value + window.innerHeight) / (props.heightPxPerItem * itemsPerPage.value)
        ),
        1
    );

    if (!virtualScrollOn.value) {
        /**
         * 가상스크롤 시작이 되지 않았으면 1페이지로 침
         */
        pageOnView.value = 1;
    }

    if (
        !props.isLoading &&
                scrollDirection.value == 'down' &&                
                window.innerHeight + target.scrollTop + (earlyFetchPx.value || 0) >= target.scrollHeight
    ) {
        /**
         * 하단 데이터 필요 판정
         */
        if (virtualScrollOn.value) {
            emit('pageRequired', pageOnView.value);
        }
    }

    if (scrollDirection.value === 'up') {
        /**
         * up 진행시 empty page touch 타이밍을 조기처리
         */
        const targetIndex = itemIndexStartPadded.value - padItemCount.value;
        const emptyItemWrapper = items.value[targetIndex];

        if (emptyItemWrapper === null) {
            emit(
                'pageRequired',
                Math.floor(targetIndex / itemsPerPage.value + 1)
            );
        }
    }

    isOnScrollEventHandling.value = false;
}

// 스크롤 핸들링
async function onScroll(event: Event) {            
    const target = event.target as HTMLElement;  

    if (isOnScrollEventHandling.value) {
        return;
    }

    scrollHandler(target);
}

function scrollEventStart() {
    virtualScrollOn.value = true;
    emit('pageRequired', 2);
}

/** VUE LIFE CYCLE */
onMounted(async () => {
    getTopToItemContainer();

    if (container$.value !== null) {
        scroller.value = container$.value.closest('.mm_scroller');   
        if (scroller.value) {
            /**
             * 초기렌더링을 약간 더 자연스럽게 만들기 위해 일단 스크롤을 내려둠
             */
            scroller.value.scrollTop = currentPageContextTop.value;   
        }
    }

    const initializer = () => {
        if (props.isPageReady !== true) {
            initRequestAnimationFrameId.value = requestAnimationFrame(initializer);
            return;
        }

        if (!scroller.value) {
            initRequestAnimationFrameId.value = requestAnimationFrame(initializer);
            return;
        }

        scroller.value.scrollTop = currentPageContextTop.value;
        viewStart.value = scroller.value.scrollTop;
        virtualScrollOn.value = props.initPage > 1 || items.value.length > itemsPerPage.value;

        if (
            virtualScrollOn.value &&             
                window.innerHeight + scroller.value.scrollTop + (earlyFetchPx.value || 0) >= scroller.value.scrollHeight
        ) {
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
                
        if (scroller.value) {
            scroller.value.addEventListener('scroll', onScroll, { passive: true }); 
        }

        watch(viewStart, (to, from) => {
            /**
             * 스크롤 방향 탐지
             */
            scrollDirection.value = to > from ? 'down' : 'up';
        });

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
        });

        watch (pageOnView, (currentPage, oldPage) => emit('pageOnViewChanged', currentPage, oldPage));

        if (initRequestAnimationFrameId.value) {
            cancelAnimationFrame(initRequestAnimationFrameId.value)
        }
    };

    const initRequestAnimationFrameId = ref<number | null>(
        requestAnimationFrame(initializer)
    );
});

onBeforeUnmount(() => {
    if (scroller.value) {
        scroller.value.removeEventListener('scroll', onScroll);
    }
    clearInterval(watchOffsetTopToItemContainerInterval);
});
</script>