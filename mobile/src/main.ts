import { createApp, defineAsyncComponent } from 'vue';
import App from './App.vue'
import VueGtag from 'vue-gtag'
import router from './router'
import pinia from '$/store/index'
import * as filters from '$/filters'
import { lazyload }from '$/directives'
import MMLink from '@/components/MMLink.vue'
import MMHeader from '@/components/Header.vue'
import ScrollTop from '@/components/ScrollTop.vue'
import '@publish/css/app.css'
import { useErrorState } from '$/composables/pageHandler/contextComposable';
import ApplicationError from '$/errors/ApplicationError';
import { mmon } from '$/helper/mmon';
import GoodsTypeB from '@/components/goods/GoodsTypeB.vue';
// import GoodsTypeA from '@/components/goods/GoodsTypeA.vue';
// import BlockGoodsTypeA from '@/components/block/GoodsTypeA.vue';
import BlockGoodsTypeB from '@/components/block/GoodsTypeB.vue';

if(window.navigator && navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations()
        .then((registrations) => {
            for(const registration of registrations) {
                registration.unregister();
            }
        });
}

// array.at 대응용 IOS <= 15.3
if (![].at) {
    Array.prototype.at = function(findIndex) { 
        if (findIndex === -1) {
            return this.slice(findIndex)[0]
        }

        return this.slice(findIndex, findIndex + 1)[0] 
    }
}

const app = createApp(App)
app.config.errorHandler = (err, exposedInstance, errorInfo) => {
    if (import.meta.env.DEV) {
        console.error('error on vue error handler', err, exposedInstance, errorInfo)
    }
    
    // 블록 컴포넌트 내 오류 발생한 경우 해당 컴포넌트 미노출, 에러페이지 노출하지 않음
    if ('block' in (exposedInstance || {})) {
        return
    }
    
    const applicationError = err instanceof ApplicationError 
        ? err 
        : new ApplicationError(err.response?.data?.message || err.message)
    const { applyError } = useErrorState();
    applyError(applicationError)
}

// filter
app.config.globalProperties.MMFilters = filters

// lazyload custom directive
app.directive('lazyload', lazyload)
app
    .use(router)
    .use(pinia)
    .use(
        VueGtag,
        {
            bootstrap: false,
        },
        router,
    )
    .component('MMLink', MMLink)
    .component('MMInput', defineAsyncComponent(() => import('@/components/input/Text.vue')))
    .component('MMHeader', MMHeader)
    .component('ScrollTop', ScrollTop)
    .component('MmGoods', GoodsTypeB)
    .component('MMBlockGoods', BlockGoodsTypeB)
    .mount('#app')

    
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    MMFilters: typeof filters
  }
}



declare global {
  interface Window {
    Kakao: any,
    Android: { [key : string] :  any },
    bom: typeof mmon.bom
  }
}
