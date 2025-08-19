import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '$/store/index'
import ApplicationError from '$/errors/ApplicationError'
import * as filters from '$/filters'
import { lazyload } from '$/directives'
import MMLink from '@/components/MMLink.vue'
import MMInput from '@/components/input/Text.vue'
import GoodsTypeB from '@/components/goods/GoodsTypeB.vue';
// import GoodsTypeA from '@/components/goods/GoodsTypeA.vue';
// import BlockGoodsTypeA from '@/components/block/GoodsTypeA.vue';
import BlockGoodsTypeB from '@/components/block/GoodsTypeB.vue';
import '@publish/css/common.css'
import '@publish/css/style.css'
import { registerSW } from 'virtual:pwa-register'
import { useErrorState } from '$/composables/pageHandler/contextComposable'

const intervalS = 1000 * 60
const updateSW = registerSW({
    onRegistered(reg) {
        reg && setInterval(() => {
            reg.update()
        }, intervalS)
    },
    onNeedRefresh() {},
    onOfflineReady() {},
})

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
    .component('MMInput', MMInput)
    .component('MMLink', MMLink)
    .component('MmGoods', GoodsTypeB)
    .component('MMBlockGoods', BlockGoodsTypeB)
    .mount('#app')



declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    MMFilters: typeof filters
  }
}