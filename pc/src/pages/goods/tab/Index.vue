<template>
    <div
        ref="tabContainer"
        class="m_prodetail-tab"
        :class="tabClass"
    >
        <div
            v-if="activeGoodsInfoTabs.length > 1"
            class="m_prodetail-tab-menu"
        >
            <div class="mm_tab_menu">
                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
                <ul                    
                    class="mm_flex T=equal"
                >
                    <li v-for="tab, index in activeGoodsInfoTabs" :key="index">
                        <button 
                            type="button"  
                            :class="['btn_tab', { 'S=tab-on' : goodsInfoTabIndex === index }]" 
                            :title="goodsInfoTabIndex === index ? '선택됨' : ''"
                            @click="tabChange(index)"
                        >
                            <b>{{ tab.name }}</b>
                        </button>
                    </li>                               
                </ul>
            </div>
        </div>
        
        <KeepAlive>
            <component
                :is="currentTabComponent.component"
                v-scrollTabSticky
                :goods-id="goodsBasicInfo.goods.id"
                v-bind="currentTabComponent.props"
            />
        </KeepAlive>
        <!-- 상세정보 탭 -->
    </div>
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent, computed, onMounted } from 'vue';
import { AggregateReviewAndQna, GoodsBasicInfo, OptionalReviewStatistics } from '$/@type/goods';
import { useRoute } from 'vue-router';
import { useEventListener } from '@vueuse/core';
import Information from '@/pages/goods/tab/Information.vue';


const props = withDefaults(defineProps<{
    goodsBasicInfo: GoodsBasicInfo,
    aggregateInfo?: AggregateReviewAndQna,
    optionalReviewInfo?: OptionalReviewStatistics[],
    isWritableReview: boolean,
    handleBuyButton: (flag: boolean) => void
}>(), {
    aggregateInfo: undefined,
    optionalReviewInfo: () => [],
});

const needTabElementSticky = ref(false);

const vScrollTabSticky = {
    mounted: (element: HTMLElement) => {
        const config = {
            root: null,
            threshold: 0, 
            rootMargin: `0px 0px -${document.documentElement.clientHeight - 72 - 67}px`,
        }
        const sidebarOptionUpClass = 'S=sidebar-up';
        const sideBar = document.querySelector('.mm_sidebar') as HTMLElement;
        const tabElementObserverEvent = new IntersectionObserver((entries, observer) => {                        
            entries.forEach((entry) => {  
                if (entry.isIntersecting) {
                    needTabElementSticky.value = true;
                    props.handleBuyButton(true);
                    sideBar.classList.add(sidebarOptionUpClass);
                }  else {
                    needTabElementSticky.value = false;
                    if (entry.boundingClientRect.y > 0) {
                        props.handleBuyButton(false);
                        sideBar.classList.remove(sidebarOptionUpClass);
                    }
                }
            });
        }, config);

        tabElementObserverEvent.observe(element);
    },
}

const tabClass = computed(() => {
    if (needTabElementSticky.value) {
        return 'S=tab-sticky';
    }
    return 'S=tab-stickyEnd';
});

const tabContainer = ref<HTMLElement|null>(null);        

const route = useRoute();
const goodsBasicInfo = computed(() => props.goodsBasicInfo);
const aggregateInfo = computed(() => props.aggregateInfo);
const isWritableReview = computed(() => props.isWritableReview);
const goodsInfoTabIndex = ref(0);

const goodsInfoTabs = computed(() => {
    return [
        {
            name: '상세정보',        
            componentName: 'Information',
            component : Information,
            isActive: true,
            props: {
                brandName : goodsBasicInfo.value.goods.brandName
            }
        },
        {
            name: (aggregateInfo?.value?.totalQnaCount || 0) > 0 ? `상품 Q&A(${aggregateInfo?.value?.totalQnaCount})`: '상품 Q&A',
            componentName: 'Qna',        
            component : defineAsyncComponent(() => import('@/pages/goods/tab/Qna.vue')),
            isActive: route.name === 'GoodsDetail' || route.name === 'RaffleDetail',
            props: {
                brandName: goodsBasicInfo.value?.goods.brandName || '',
                brandTel : goodsBasicInfo.value?.returnDeliveryInfo.tel || '',
                goods: {
                    name: goodsBasicInfo.value?.goods.name || '',
                    thumbnailUrl : goodsBasicInfo.value?.goods.thumbnailUrl || '',
                }
            }        
        },
        {
            name: (aggregateInfo.value !== undefined && aggregateInfo.value.totalReviewCount > 0) ? `리뷰(${aggregateInfo.value.totalReviewCount})` : '리뷰',
            componentName: 'Review',
            isActive: route.name === 'GoodsDetail',
            component : defineAsyncComponent(() => import('@/pages/goods/tab/Review.vue')),
            props: {
                aggregateInfo : aggregateInfo.value,
                isWritableReview: isWritableReview.value,
                optionalReviewInfo: props.optionalReviewInfo
            },
        },
        {
            name: '판매자 정보',
            componentName: 'SellerInfo',
            isActive: route.name === 'GoodsDetail' || route.name === 'RaffleDetail',
            component : defineAsyncComponent(() => import('@/pages/goods/tab/SellerInfo.vue')),
            props:  {
                deliveryInfo: goodsBasicInfo.value?.deliveryInfo,
                returnDeliveryInfo : goodsBasicInfo.value?.returnDeliveryInfo,
                brandName: goodsBasicInfo.value?.goods.brandName || '',
            }
        }
    ]
});

const activeGoodsInfoTabs = computed(() => {
    return goodsInfoTabs.value.filter(tab => tab.isActive)
}) 


const currentTabComponent = computed(() => {
    return activeGoodsInfoTabs.value[goodsInfoTabIndex.value];
})

/** VARIABLE */
/** FUNCTION */
function tabChange(index: number) {
    goodsInfoTabIndex.value = index;
    if(tabContainer.value && tabContainer.value.parentElement) {
        window.scrollTo(0, tabContainer.value.parentElement.offsetTop);
    }         
}

/** VUE LIFE CYCLE */

onMounted(() => {
    const reviewMoreElement = document.querySelector('.btn_review');

    if (reviewMoreElement) {
        useEventListener(reviewMoreElement, 'click', () => {
            const reviewComponentIndex = activeGoodsInfoTabs.value.findIndex((tab) => tab.componentName === 'Review') || 0;
            if (reviewComponentIndex < 1) {
                return;
            }

            tabChange(reviewComponentIndex);
        })
    }
    
})
</script>