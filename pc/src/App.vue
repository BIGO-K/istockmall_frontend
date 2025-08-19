<template>
    <template v-if="isUnderMaintenance">
        <div class="mm_view L=error">
            <div id="mm_body" class="mm_page">
                <UnderMaintenance :error="applicationError!" />
            </div>
        </div>
    </template>
    <template v-else-if="hasApplicationError">
        <div class="mm_view L=error">
            <div id="mm_body" class="mm_page">
                <ErrorView :error="applicationError!" />
            </div>
        </div>
    </template>
    <template v-else>
        <nav class="mm_skip">
            <ul>
                <li>
                    <a
                        href="#mm_body"
                        data-href="{ '_type': 'anchor' }"
                    >본문바로가기</a>
                </li>
            </ul>
        </nav>
        <TopBanner v-if="route.name !== 'NotFound'" />
        <div
            class="mm_view"
            :class="$route.meta.layout"
        >
            <template v-if="$route.meta.isShowGlobalHeader">
                <component 
                    :is="headerComponent"
                    :side-bar-element="sideBarContainer"
                    :is-font-white="globalConfigs.design.useHeaderColor"
                    :basic-search-keyword="basicSearchKeyword"
                />
            </template>
            <div
                id="mm_body"
                class="mm_page"
            >
                <div
                    v-if="$route.meta.layout !== 'L=error'"
                    ref="sideBarContainer"
                    class="mm_sidebar"
                >
                    <div class="mm_sidebar-anchors">
                        <div class="mm_sidebar-anchors-inner">
                            <a
                                class="btn_anchor-up"
                                href="#app"
                                title="페이지 처음으로"
                                @click.prevent="scrollTop"
                            >
                                <i class="ico_anchor-up" />
                            </a>
                            <a
                                class="btn_anchor-down"
                                href="#mm_footer"
                                title="페이지 마지막으로"
                                @click.prevent="scrollBottom"
                            ><i class="ico_anchor-down" /></a>
                        </div>
                    </div>
                    <WingBanner />
                </div>
                <router-view v-slot="{ Component, route: currentRoute }">
                    <component
                        :is="Component"
                        :key="currentRoute.meta.usePathKey ? currentRoute.path : undefined"
                    />
                </router-view>
            </div>
            <MMFooter v-if="$route.meta.isShowFooter" />
            <div                
                id="modal_area" 
                :class="{ 'mm_modal' : isModalOn }"
            >   
                <template v-if="isModalOn">
                    <div class="mm_modal-items">
                        <BaseModal
                            v-for="layer in modalLayers"                     
                            :key="layer.name"
                            :layer="layer"
                        />
                    </div>
                </template>
            </div>
        </div>
        <div
            v-if="needLoadingBar"
            class="mm_loading"
        >
            <div class="mm_loading-inner">
                <i class="ico_loading S=ani-spin" />
                <p class="mm_ir-blind">
                    Loading...
                </p>
            </div>
        </div>
        <transition
            name="mons_custom fade"            
        >
            <div v-if="hasMonsAlert" class="mm_bom">
                <div class="mm_bom-items">                    
                    <MonsAlert 
                        v-for="monsAlert in monsAlerts"
                        :key="monsAlert.uuid"
                        :mons-alert="monsAlert"
                    />
                </div>
            </div>
        </transition>
        <template v-if="route.name === 'Main'">
            <component 
                :is="mainPopupComponent"
                v-if="mainPopupInfo.show && mainPopupInfo.banners.length > 0"
                :banners="mainPopupInfo.banners"
                @close="mainPopupClose"
            />            
            <TimeDeal v-if="globalConfigs.paidFeatures.timeDeal" />
        </template>
    </template>
</template>

<script lang="ts">
if (![].at) {
    Array.prototype.at = function(findIndex) { 
        if (findIndex === -1) {
            return this.slice(findIndex)[0]
        }
        return this.slice(findIndex, findIndex + 1)[0] 
    }
}
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useMarketingInitialize } from '$/composables/marketingComposable'
import { useErrorState, usePageContext, useMaintenanceState } from '$/composables/pageHandler/contextComposable';
import { useGenerateUuid } from '$/composables/shoppingComposable'
import { useEventListener } from '@vueuse/core'
import { useInitialize } from '$/composables/globalConfigComposable';
import { useMainBanner } from '$/composables/exhibit/bannerComposable';
import '@publish/src/script/app/app.ts'
import { useAffiliate } from '$/composables/globalConfigComposable';
import { useModalState } from '$/composables/pageHandler/modalComposable'
import { useClosePopup } from '$/composables/popupComposable'
import WingBanner from '@/components/WingBanner.vue'

export default {
    components: {
        ErrorView: defineAsyncComponent(() => import('@/pages/support/ErrorView.vue')),
        MMFooter: defineAsyncComponent(() => import('@/components/Footer.vue')),
        MonsAlert: defineAsyncComponent(() => import('@/components/Alert.vue')),
        TimeDeal: defineAsyncComponent(() => import('@/components/modal/timeDeal/Index.vue')),
        BaseModal: defineAsyncComponent(() => import('@/components/modal/BaseModal.vue')),
        TopBanner: defineAsyncComponent(() => import('@/components/TopBanner.vue')),
        UnderMaintenance: defineAsyncComponent(() => import('@/pages/UnderMaintenance.vue')),
        WingBanner,
    },
    setup() {
        const sideBarContainer = ref<HTMLElement | null>(null)        
        const { setPopupContext } = useClosePopup() 
        const { 
            route,
            router, 
            setPageContext, 
            currentPageContextTop,
            mmon,
            globalConfigs
        } = usePageContext();
        
        useGenerateUuid();        
        useInitialize();       
        
        const { 
            hasMonsAlert,
            hasApplicationError, 
            applicationError,
            needLoadingBar,
            monsAlerts
        } = useErrorState();
      
        const {
            isModalOn,
            modalLayers
        } = useModalState();

        const { isUnderMaintenance } = useMaintenanceState();
        watch(hasApplicationError, (to, from) => {
            to ? document.documentElement.classList.add('L=error') : document.documentElement.classList.remove('L=error') 
        })
        watch(isModalOn, (to, from)=> {
            to ? document.documentElement.classList.add('S=noscroll') : document.documentElement.classList.remove('S=noscroll') 
        })
        
        const { setAffiliate, affiliateCode } = useAffiliate();        
        const { mainPopupInfo } = useMainBanner();
        
        useEventListener(sideBarContainer.value, 'load', sideBarIconHandler )
        useEventListener(window, 'resize', sideBarIconHandler )
        useEventListener(window, 'beforeunload', beforeUnloadHandler)       
        
        const headerComponent = computed(() => {
            if ((globalConfigs.value.design.headerType || 'A') === 'A') {
                return defineAsyncComponent(() => import('@/components/header/HeaderA.vue'));   
            }
            return defineAsyncComponent(() => import('@/components/header/HeaderB.vue'))
        })        
        
        const mainPopupComponent = computed(() => {
            if (mainPopupInfo.value.version === 'A') {
                if (mainPopupInfo.value.type === 'floating') {
                    return defineAsyncComponent(() => import(`@/components/modal/mainPopup/FloatingA.vue`));
                }
                return defineAsyncComponent(() => import(`@/components/modal/mainPopup/NormalA.vue`));
            }
            return defineAsyncComponent(() => import(`@/components/modal/mainPopup/NormalB.vue`))
        })
        
        const viewLayoutClassName = ref('')
        // 기본 검색어
        const basicSearchKeyword = ref({
            text: '',
            customLink: '',
        })  
  
        watch(route, (to, from) => {
            if (to.meta.layout) {
                viewLayoutClassName.value = to.meta.layout
                addDocumentClassName(viewLayoutClassName.value)
            } else {
                viewLayoutClassName.value != '' ? removeDocumentClassName(viewLayoutClassName.value) : ''
            }

            if (to.meta.layout !== 'L=error') {
                removeDocumentClassName('L=error')
            }
            // affiliateCode 확인       
            if (route.query.affiliate) {
                setAffiliate(route.query.affiliate.toString(), route.query);
            }
        })
  
  
        function addDocumentClassName(className: string) {
            document.documentElement.classList.add(className)
        }
  
        function removeDocumentClassName(className: string) {
            document.documentElement.classList.remove(className)
            viewLayoutClassName.value = ''
        }
  
        function scrollTop() {
            mmon.scroll.to(document.querySelector('#app') as Element, {
                margin: 0,
            })
        }
  
        function scrollBottom() {
            mmon.scroll.to(document.querySelector('#mm_footer') as Element, {
                margin: 0,
            })
        }
        /**
         * 기존 스크롤 위치 저장 처리 
         */        
        async function savePosition(path: string) {
            await setPageContext(path, window.scrollY)
        }

        const isNeedSetAffiliate = ref<boolean>(false);
        router.beforeEach(async (to, from, next) => {
            if (!isNeedSetAffiliate.value) {
                const currentAffiliate = to.query.affiliate ? `${to.query.affiliate}` : undefined;
                setAffiliate(currentAffiliate, to.query);
                isNeedSetAffiliate.value = true;
            }      
            await savePosition(from.path)
            return next()
        })

        router.afterEach(async (to, from) => {
            if (to.meta.scrollSelfHandling) {
                return
            }

            if (from.path == to.path) {
                return
            }

            const contents$ = ref<HTMLElement | null>(null)
            const findScroller = async () => {
                contents$.value = document.querySelector('.mm_page-content')
                if (!contents$.value) {
                    requestAnimationFrame(findScroller)
                    return
                }

                cancelAnimationFrame(findScrollId)
                applyPosition()
            }
            const findScrollId = requestAnimationFrame(findScroller)
        })
        
        function beforeUnloadHandler() {
            savePosition(location.pathname)
        }
        
        /**
         * 스크롤 위치 변경
        */
        async function applyPosition() {            
            const contents$ = document.querySelector('.mm_page-content')
            if (contents$) {
                (contents$ as HTMLElement).style.minHeight = `${currentPageContextTop.value + window.innerHeight}px`;
            }

            let tryCount = 0
            window.scrollTo(0, currentPageContextTop.value);
            const setScrollInterval = setInterval(() => {
                if (window.scrollY == currentPageContextTop.value || tryCount > 15) {
                    if (contents$) {
                        (contents$ as HTMLElement).style.minHeight = ``;
                    }
                    clearInterval(setScrollInterval)
                    setTimeout(() => {
                        window.scrollTo(0, currentPageContextTop.value)
                    }, 100)
                    return
                }

                window.scrollTo(0, currentPageContextTop.value)
                tryCount++
            }, 30)
        }

        function sideBarIconHandler() {
            if (sideBarContainer.value === null) {
                return;
            }

            if (window.innerWidth <= 1360 + 106) {
                (sideBarContainer.value as HTMLElement).classList.add('S=sidebar-sm')
            } else {
                (sideBarContainer.value as HTMLElement).classList.remove('S=sidebar-sm')
            }
        }        
        /**
         * 메인 팝업 닫기
         */
        function mainPopupClose(checkMainPopupHide: boolean) {
            // [오늘 하루 그만보기] 여부 쿠키 저장
            if (checkMainPopupHide) {
                setPopupContext('IS_MAIN_POPUP_HIDE', true)
            }
            document.documentElement.classList.remove('S=noscroll');
            const bodyElement = document.querySelector('body');
            if (bodyElement) {
                bodyElement.style.overflow = '';
            }
            mainPopupInfo.value.show = false
        }

        useMarketingInitialize(); 
        
        onMounted(() => {
            console.log(' 기업가치를 높이는 IT기술 \n Solution developed by 엠몬스타(https://www.mmonstar.co.kr)\n' + '%c M.MONSTAR!', 'font-weight: bold; font-size: 16px; color: rgba(0, 139, 148, 1); text-shadow: 1px 1px 0 rgba(201, 255, 154, 1) , 2px 2px 1px rgba(19, 169, 132, 1)');
        })
        return {
            route,
            headerComponent,
            hasApplicationError,
            applicationError,
            hasMonsAlert,
            globalConfigs,
            basicSearchKeyword,
            needLoadingBar,
            sideBarContainer,
            scrollTop,
            scrollBottom,            
            mainPopupComponent,
            mainPopupInfo,
            mainPopupClose,
            isModalOn,
            modalLayers,
            monsAlerts,
            isUnderMaintenance
        }
    },
}
</script>
  
<style lang="scss">
  [v-cloak] {
    opacity: 0;
  }

  .mons_custom {
    transition: transform 400ms ease 100ms;
        &.fade-enter-active,
        &.fade-leave-active {
            transition: opacity 250ms ease;
        }
        &.fade-enter-from,
        &.fade-leave-to {
            opacity: 0;
        }
    }


//< 레이지로드
%loadBefore {
    opacity: 0;
}
%loadAfter {
	opacity: 1;
    transition: opacity 0.4s;
}

[v-lazyload] {
    &:not(iframe) {
        @extend %loadBefore;

        &.S\=loaded,
        &.S\=error {
            @extend %loadAfter;
        }
    }
}
</style>