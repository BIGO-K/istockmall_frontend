<template>
    <div :class="['mm_view', $route.meta.layouts]">
        <!-- 앱으로 보기 상단 배너 -->
        <div v-if="!isApp" ref="appViewBannerElement" class="m_main-app-view">
            <a href="#" @click.prevent="appStoreLink()">
                <b>앱으로 더 편리하게 쇼핑해보세요</b><i>앱으로 보기</i>
            </a>
        </div>
        <!--// 앱으로 보기 상단 배너 -->
        <TopBanner
            v-if="topBannerType === 'custom'" 
            :banner="banner"
        />
        <MMHeader :hide-l-side="true" :is-main="true">
            <template #baseHeaderTitle>
                <h1>
                    <a href="/">
                        <i class="image_logo" /><b class="mm_ir-blind">{{ globalConfigs.shop.name }}</b>
                    </a>
                </h1>
            </template>
        </MMHeader>
        <div id="mm_body" class="mm_page">
            <PullToRefresh 
                v-if="$route.name === 'Main'" 
                :main-page="true"                 
            />
            <div ref="contentScroller" class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- GNB -->
                        <div class="mm_gnb">
                            <div class="mm_gnb-inner">
                                <div ref="gnbScroller" class="mm_scroller T=x">
                                    <ul>
                                        <li>
                                            <a
                                                id="Main"
                                                class="btn_home" 
                                                href="#"
                                                :title="$route.name === 'Main' ? '선택됨' : ''"
                                                @click.prevent="goMain()"
                                            >
                                                <b>홈</b>
                                            </a>
                                        </li>
                                        <!-- <li>
                                            <MMLink                                                
                                                id="LiveCommerce"
                                                :to="{ name: 'LiveCommerce' }"
                                                :title="$route.name === 'LiveCommerce' ? '선택됨' : ''"
                                            >
                                                <b>LIVE</b>
                                            </MMLink>                                            
                                        </li> -->
                                        <li v-if="isUseRanking">
                                            <MMLink
                                                id="Ranking"
                                                :to="{ name: 'RankingItem' }"
                                                :title="$route.meta.isRankingChild ? '선택됨' : ''"
                                            >
                                                <b>랭킹</b>
                                            </MMLink>
                                        </li>
                                        <li v-else>
                                            <MMLink
                                                id="Best"
                                                :to="{ name: 'Best' }"
                                                :title="$route.name === 'Best' ? '선택됨' : ''"
                                            >
                                                <b>베스트</b>
                                            </MMLink>
                                        </li>
                                        <li v-for="spotTheme in spotThemes" :key="spotTheme.id">
                                            <MMLink
                                                v-if="!spotTheme.isUseUrl"
                                                :id="`SpotTheme_${spotTheme.id}`"
                                                class="T=gnb-highlight"
                                                :to="{ name: 'SpotTheme', params: { id: spotTheme.id } }"
                                                :title="$route.name === 'SpotTheme' && $route.params.id === `${spotTheme.id}` ? '선택됨' : ''"
                                            >
                                                <b>{{ spotTheme.name }}</b>
                                            </MMLink>
                                            <MMLink
                                                v-else
                                                :to="spotTheme.url"
                                            >
                                                <b>{{ spotTheme.name }}</b>
                                            </MMLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div> 
                        <TopBanner v-if="topBannerType !== 'custom'" :banner="banner" />
                        <router-view @sns-shared-toggle="sharedToggle" />
                    </div>
                    <!--// 본문 -->
                    <!-- 푸터 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>
            <!-- SNS 공유하기 -->
            <SharedDim v-if="isShowSharedSns" @close="isShowSharedSns = false" />
            <!-- // SNS 공유하기 -->
            <TimeDealToastBanner v-if="$route.name === 'Main' && isTimeDealShow" v-show="needToastShow" />
            <ScrollTop />
        </div>
        <MMToolbar />
    </div>
</template>

<script setup lang='ts'>
import { computed, onBeforeMount, ref, onMounted, watch } from 'vue';
import { horizontalScrollMove, isMobile } from '$/functions';
import { nativeAppRepository } from '$/repository/nativeAppRepository';
import MMFooter from '@/components/Footer.vue'
import MMToolbar from '@/components/Toolbar.vue';
import TimeDealToastBanner from '@/components/timeDeal/Index.vue';
import SharedDim from '@/components/SharedDim.vue';
import PullToRefresh from '@/components/PullToRefresh.vue';
import TopBanner from '@/components/TopBanner.vue';
import { InitialSettings } from '$/@type/configs';
import { useScroll } from '@vueuse/core';
import { useTopBanner, useTopBannerHide } from '$/composables/exhibit/bannerComposable';
import { getOutIntentPath } from '$/filters';
import { useUserAgent } from '$/composables/commonComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

/** VARIABLE */
const {
    route, 
    router, 
    globalConfigs,
} = usePageContext();
const gnbScroller = ref<HTMLElement | null>(null);
const contentScroller = ref<HTMLElement|null>(null);
const appViewBannerElement = ref<HTMLElement|null>(null);
const isShowSharedSns = ref(false)  ;      
// 유료기능 사용여부        
const isUseCodyShot = ref<boolean>(globalConfigs.value.paidFeatures.codyShot);
const isUseShowcase = ref<boolean>(globalConfigs.value.paidFeatures.showcase);
const isUseSpecialEvent = ref<boolean>(globalConfigs.value.paidFeatures.specialEvent);        
const isUseRanking = ref<boolean>(globalConfigs.value.paidFeatures.ranking);      
const isUseJointPurchase = ref<boolean>(globalConfigs.value.gnb.jointPurchase);
const isUseRaffle = ref<boolean>(globalConfigs.value.gnb.raffle);
const isTimeDealShow = ref<boolean>(globalConfigs.value.paidFeatures.timeDeal);
const spotThemes = ref<InitialSettings['gnb']['spotThemes']>(globalConfigs.value.gnb.spotThemes);

const needToastShow = ref<boolean>(isTimeDealShow.value);
const isApp = computed<boolean>(() => isMobile('app'));
const appUpdateLink = ref<string>('');
const topBannerType = ref<InitialSettings['design']['mobileTopBannerType']>(globalConfigs.value.design.mobileTopBannerType);
const { topBanner: banner, getBanner } = useTopBanner();
const { isHide } = useTopBannerHide();
if (!isHide.value) {
    getBanner();
}

const footerOffsetHeight = ref<number>(148);
const { arrivedState } = useScroll(contentScroller, { 
    offset: { bottom: footerOffsetHeight.value }
})

const {
    isIosUser,
    isAndroidUser,    
} = useUserAgent();

watch(arrivedState, (to) => {
    if (to.bottom) {
        needToastShow.value = false;
    } else {
        needToastShow.value = true;
    }
})

/** FUNCTION */
function sharedToggle() {
    isShowSharedSns.value = true;
}
function gnbSelectedHandler() {
    const routeName = route.meta.isRankingChild ? 'Ranking' : `${route.name?.toString()}`
    const routeId = route.params ? route.params.id : ''
    if (gnbScroller.value) {
        gnbScroller.value.querySelector('.S\\=gnb-on')?.classList.remove('S=gnb-on');        

        const duplicateGnbElement = gnbScroller.value.querySelectorAll(`[id^=${routeName}]`);
        const gnbElement = (duplicateGnbElement.length > 1 || routeId !== undefined) ? gnbScroller.value.querySelector(`#${routeName}_${routeId}`) : gnbScroller.value.querySelector(`#${routeName}`);
        if (gnbElement) {
            gnbElement.classList.add('S=gnb-on')
            horizontalScrollMove(gnbScroller.value, gnbElement);
        }                
    }
}
function goMain() {
    if (router.currentRoute.value.path === '/') {
        router.go(0);
    }

    router.push('/');
}
        
function appStoreLink() {
    // if (!appUpdateLink.value) {
    //     return;
    // }
    
    if (isIosUser) {
        return window.open('itms-apps://itunes.apple.com/kr/app/apple-store/id6446163570', '_blank');
    } else if (isAndroidUser) {
        return window.open(getOutIntentPath('http://play.google.com/store/apps/details?id=kr.co.stockcompany.istockmall'), '_blank');
    } else {
        return;
    }
}

/** VUE LIFE CYCLE */
router.afterEach(() => {
    gnbSelectedHandler();
})

onMounted(async () => {            
    const footerElement = document.querySelector('.mm_footer');
    if (footerElement && footerElement instanceof HTMLElement) {
        footerOffsetHeight.value = footerElement.offsetHeight  
    }
           
    setTimeout(() => {
        gnbSelectedHandler();
    }, 200);
});      

onBeforeMount(async () => {        
    try {
        const appInfo = await nativeAppRepository.getAppInfo();
        appUpdateLink.value = appInfo.appUpdateLink;
    } catch (e) {
        console.error(e)
    }
})     
</script>
