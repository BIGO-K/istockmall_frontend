<template>
    <UnderMaintenance v-if="isUnderMaintenance" />
    <ErrorView v-else-if="hasApplicationError" :error="applicationError!" />
    <template v-else>
        <!-- 스킵 -->
        <nav class="mm_skip">
            <ul>
                <li>
                    <a href="#mm_body" data-href="{ '_type': 'anchor' }">
                        본문바로가기
                    </a>
                </li>
            </ul>
        </nav>
        <!-- 스킵 -->
        <!--
            transition 구조는 하나의 root만 들어갈 수 있기 때문에
            mm_view 부터 다 컴포넌트 내에서 구현해준다
        -->
        <transition-group
            name="popup_group"
            @before-enter="(el) => {
                popupGroupBeforeEnter(el as HTMLElement)
            }"
            @before-leave="(el) => {
                // ios에서 제스처로 뒤로가기 실행시 leave 요소 제거
                if (route.meta.hideTransition === true) {
                    el.remove()
                }                                        
            }"
        >
            <component
                :is="component"                
                v-for="component in modalPopupComponents"
                :key="component"
                class="mm_popup_group"
            />
        </transition-group>
        <router-view v-slot="{ Component, route }" :data-path="route.path">
            <transition
                appear                
                :name="route.meta.hideTransition ? 'mm_layout none' : `mm_layout ${route.meta.transition}`"
                @after-enter="mmLayoutAfterEnter"
                @before-leave="(el: Element) => {
                    // ios에서 제스처로 뒤로가기 실행시 leave 요소 제거
                    if (route.meta.hideTransition === true) {
                        el.remove()
                    }
                    savePosition(route.path)
                }"
            >
                <component
                    :is="Component"
                    :key="route.meta.usePathKey ? route.path : ''"
                />
            </transition>
        </router-view>
    </template>
    <div v-if="needLoadingBar" class="mm_loading">
        <div class="mm_loading-inner">
            <i class="ico_loading S=ani-spin" />
            <p class="mm_ir-blind">
                Loading...
            </p>
        </div>
    </div>

    <div v-if="hasMonsAlert" class="mm_bom" :style="alertStyle">
        <div class="mm_bom-items">
            <MonsAlert 
                v-for="monsAlert in monsAlerts"
                :key="monsAlert.uuid"
                :mons-alert="monsAlert"
            />
        </div>
    </div>
    <AppPopup v-if="isAppFirstUser && $route.name === 'Main'" />
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
    <MainPopup v-if="isMainPopupShow && $route.name === 'Main'" @main-popup-handler="mainPopupHandler" />
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

import { computed, watch, defineComponent, onMounted, ref, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { MODAL_COMPONENTS } from "@/modalComponent";
import { useAffiliate, useInitialize } from "$/composables/globalConfigComposable";
import { useMarketingInitialize } from '$/composables/marketingComposable';
import { useGenerateUuid } from '$/composables/shoppingComposable';
import { useErrorState, usePageContext, useMaintenanceState } from '$/composables/pageHandler/contextComposable';
import { useUserAgent } from '$/composables/commonComposable';
import { useFireBase } from '$/composables/appBridgeComposable';
import { useModalState, useModalPopup } from '$/composables/pageHandler/modalComposable';
import { useClosePopup } from '$/composables/popupComposable'
import { useRouteQueryCast } from '$/composables/commonComposable';
import '@publish/src/script/app/app.ts'

export default defineComponent({    
    components: {
        ErrorView: defineAsyncComponent(() => import('@/pages/ErrorView.vue')),
        MonsAlert: defineAsyncComponent(() => import('@/components/Alert.vue')),
        MainPopup: defineAsyncComponent(() => import('@/components/modal/MainPopup.vue')),
        AppPopup: defineAsyncComponent(() => import('@/components/layout/AppPopup.vue')),
        BaseModal: defineAsyncComponent(() => import('@/components/modal/BaseModal.vue')),
        UnderMaintenance: defineAsyncComponent(() => import('@/pages/UnderMaintenance.vue')),
    },
    setup() {       
        const route = useRoute();      
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
            hasOpenedModalPopup, 
            lastOpened, 
            modalPopupStacks,
            isOpened,
            openModalPopup, 
            closeModalPopup, 
            clearModalPopup,
        } = useModalPopup();

        const { isUnderMaintenance } = useMaintenanceState();
        
        const {
            isModalOn,
            modalLayers
        } = useModalState();

        const { isAppFirstUser, isIosUser, isAppUser } = useUserAgent();
        const { setPageContext, currentPageContextTop, mmon } = usePageContext();
        const { setAffiliate } = useAffiliate();        
        const { isShowPopup } = useClosePopup()
        useFireBase();

        window.addEventListener('hashchange', e => {
            const before = e.oldURL.split('#')[1] ?? '';
            const after = e.newURL.split('#')[1] ?? '';
            handleHashChange(before, after);
        });
        
        // 팝업 노출 여부 조회                
        const isMainPopupShow = ref<boolean>(isShowPopup('IS_MAIN_POPUP_HIDE') === true ? false : true);   
        
        // 레이아웃 클래스명 리스트
        const viewLayoutClassName = ref<string[]>();        
        const alertZIndex = ref<number>(1000);

        const handleHashChange = (before: string, after: string) => {
            if (!hasOpenedModalPopup.value) {
                return modalPopupOpen(after)
            }

            if (!after) {
                return modalPopupClose(before);
            }

            if (!isOpened(after)) {
                return modalPopupOpen(after)
            }

            if (lastOpened.value == before) {
                return modalPopupClose(lastOpened.value);
            }

            return modalPopupOpen(after);
        }

        /**
         * 모달 팝업 열기
         * @param componentName 
         */
        function modalPopupOpen(componentName: string) {
            if (!MODAL_COMPONENTS[componentName]) {
                return
            }
            removeDocumentClassName(route.meta.layouts);
            openModalPopup(componentName)
        }

        /**
         * 모달 팝업 닫기
         * @param componentName 
         */
        function modalPopupClose(componentName: string) {
            closeModalPopup(componentName)
            if (modalPopupComponents.value.length === 0) {
                setTimeout(() => {
                    if (route.meta.layouts && route.meta.layouts.length > 0)
                    {
                        viewLayoutClassName.value = route.meta.layouts;     
                        addRouteLayouts();
                    } 
                }, 300);
            }
        }        

        function addDocumentClassName(classNames: string[]) {
            document.documentElement.classList.add(...classNames);
        }

        function removeDocumentClassName(classNames: string[]) {
            document.documentElement.classList.remove(...classNames);
        }

        const modalPopupComponents = computed(() => {
            const componentStacks = modalPopupStacks.value;
            if (componentStacks.length < 1 || route.hash === '') {
                return [];
            }

            return componentStacks.map((componentName: string) => {
                return MODAL_COMPONENTS[componentName];
            })
        });

        /**
         * 스크롤 위치 변경
         */
        function applyPosition(pageScroller: HTMLElement) {
            const contents$ = pageScroller.querySelector('.mm_page-content')            
            if (contents$ && currentPageContextTop.value !== 0) {
                (contents$ as HTMLElement).style.minHeight = `${currentPageContextTop.value + window.innerHeight}px`;
            }

            let tryCount = 0
            const setScrollInterval = setInterval(() => {
                if (tryCount > 10) {
                    if (contents$) {
                        (contents$ as HTMLElement).style.minHeight = ``;
                    }
                    clearInterval(setScrollInterval)
                    return
                }

                pageScroller.scrollTop = currentPageContextTop.value;  
                tryCount++
            }, 30)
        }

        function mainPopupHandler() {
            isMainPopupShow.value = false;
        }

        function addRouteLayouts() {
            if(viewLayoutClassName.value !== undefined && viewLayoutClassName.value?.length > 0) {
                addDocumentClassName(viewLayoutClassName.value);                        
            }
        }

        /**
         * 기존 스크롤 위치 저장 처리 
         */
        async function savePosition(path: string) {
            const pageScroller = document.querySelector(`[data-path="${path}"] #mm_body > .mm_scroller`)
            if (pageScroller) {
                await setPageContext(path, pageScroller.scrollTop)
            }
        }
        
        /**
         * VUE LIFE CYCLE
        */
        watch(route, async (to, from) => {       
            if (route.hash === '' && modalPopupStacks.value.length > 0) {
                clearModalPopup();
                viewLayoutClassName.value = route.meta.layouts || []
                addRouteLayouts();
            }

            if (route.query.affiliate) {
                setAffiliate(route.query.affiliate.toString(), route.query);
            }     
        });

        useMarketingInitialize();
        
        onMounted(async () => {            
            if (isAppUser) {
                addDocumentClassName(['S=app']);
            }

            if (isIosUser) {
                addDocumentClassName(['S=ios']);
            }

            // 모달 없는데 해시만 있는 경우 해시 초기화
            if (!hasOpenedModalPopup.value && location.hash !== '') {                
                return router.replace( {hash: undefined });
            }
            console.log(' 기업가치를 높이는 IT기술 \n Solution developed by 엠몬스타(https://www.mmonstar.co.kr)\n' + '%c M.MONSTAR!', 'font-weight: bold; font-size: 16px; color: rgba(0, 139, 148, 1); text-shadow: 1px 1px 0 rgba(201, 255, 154, 1) , 2px 2px 1px rgba(19, 169, 132, 1)');
        });

        /**
         * ROUTE HANDLER
        */
        const router = useRouter();
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


            const scroller = ref<HTMLElement | null>(null)

            const findScroller = () => {
                scroller.value = document.querySelector(`[data-path="${to.path}"] #mm_body > .mm_scroller`)
                if (!scroller.value) {
                    requestAnimationFrame(findScroller)
                    return
                }

                cancelAnimationFrame(findScrollId)
                // 링크를 통해 다음 페이지로 이동한 경우 스크롤 위치 0 처리
                if (from.meta.isForward) {
                    return scroller.value.scrollTop = 0;
                }
                applyPosition(scroller.value)
            }
            const findScrollId = requestAnimationFrame(findScroller)
        })
         
        window.addEventListener('beforeunload', (event) => {
            savePosition(location.pathname)
        });


        /**
         * mm_layout(transition)의 on-after-enter에서 실행할 함수
         *
         * @param {HTMLElement} elementEl
         */
        function mmLayoutAfterEnter(elementEl: Element) {
            // onEnter 종료후 leave 컴포넌트가 남아있을 경우 깜빡임 발생방지를 위해 제거
            const siblingEl = elementEl.previousElementSibling?.closest('.mm_layout');
            siblingEl?.remove();

            document.documentElement.classList.remove('S=hide');
            viewLayoutClassName.value != undefined
                ? removeDocumentClassName(viewLayoutClassName.value)
                : "";
            

            const currentRouteMetaLayouts = route.meta.layouts;
            if (currentRouteMetaLayouts && currentRouteMetaLayouts.length > 0) {
                viewLayoutClassName.value = currentRouteMetaLayouts;                        
                addRouteLayouts();
            } else {
                viewLayoutClassName.value = [];
            }
        }

        /**
         * popupGroup(transitionGroup)의 on-before-enter에서 실행할 함수
         * (팝업 & 알럿의 z-index값 set)
         *
         * @param {HTMLElement} element
        */
        const alertStyle = computed(() => {
            if (modalPopupComponents.value.length < 1) {
                return {}
            }

            return {
                'z-index':  alertZIndex.value
            }
        })
        
        function popupGroupBeforeEnter(element: HTMLElement) {
            if (modalPopupComponents.value.length < 1) {
                return;
            }
            // 팝업 열릴때 헤더 사라지는 이슈             
            removeDocumentClassName(['S=hide']);     
            element.style.zIndex = `${modalPopupComponents.value.length * 10000}`
            alertZIndex.value = (modalPopupComponents.value.length + 1) * 10000
        }

        window.bom = mmon.bom;

        return {
            modalPopupComponents,
            route,
            hasMonsAlert,
            monsAlerts,
            hasApplicationError, 
            applicationError,
            needLoadingBar,
            alertZIndex,
            isModalOn,
            modalLayers,
            savePosition,
            isMainPopupShow,      
            mainPopupHandler,            
            isAppFirstUser,            
            addRouteLayouts,
            mmLayoutAfterEnter,
            popupGroupBeforeEnter,
            alertStyle,
            isUnderMaintenance
        };
    },
});
</script>
<style lang="scss">
[v-cloak] {
    opacity: 0;
}

//----------- (mm_layout) -----------

.mm_layout {
    transition: transform 200ms ease 100ms;

    &.slide-up-enter-active,
    &.slide-left-enter-active,
    &.slide-right-enter-active,
    &[class*='reverse-leave-active'] 
    {
        position: fixed;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
        z-index: 20000;
    }
    &[class*='leave-active'] 
    {
        position: fixed;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;        
    }
    &[class*='reverse-enter-active'] 
    {
        position: fixed;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10000;
    }
    

    &.slide-up-enter-from,
    &.slide-up-reverse-leave-to {
        transform: translateY(100%);
    }
    &.slide-right-enter-from,
    &.slide-right-reverse-leave-to {
        transform: translateX(100%);
    }

    &.slide-left-enter-from,
    &.slide-left-reverse-leave-to {
        transform: translateX(-100%);
    }
}

//----------- (mm_popup_group) -----------
.mm_view {
    &.mm_popup_group {
        position: absolute;
        width: 100%;
        height: 100%;

        &.popup_group-enter-from,
        &.popup_group-leave-to {
            transform: translateY(100%);
        }
        &.popup_group-enter-active,
        &.popup_group-leave-active {
            transition: transform .25s;
        }
    }
}

.m_product-clone {
    background: linear-gradient(#fff, #fff, rgba(255,255,255,0.7));
}

//< 레이지로드
%loadBefore {
    opacity: 0;
}
%loadAfter {
	opacity: 1;
    transition: opacity 300ms;
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