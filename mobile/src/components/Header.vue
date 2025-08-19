<template> 
    <header 
        ref="headerElement"
        class="mm_header"
        :class="[
            headerDesignType === 'A' ? 'T=ha' : 'T=hb', 
            { 'T=text-white': isHeaderFontWhite }
        ]"
    >
        <slot name="baseHeaderTitle" />
        <div v-if="!hideLSide && !$slots.customLSide" class="mm_lside">
            <template v-if="$route.meta.type === 'goods'">
                <a class="btn_back" href="#" @click.prevent="back()">
                    <i class="ico_history-back" /><b class="mm_ir-blind">이전으로</b>
                </a>
                <MMLink class="btn_home" :to="{ name : 'Main' }">
                    <i class="ico_home" /><b class="mm_ir-blind">홈</b>
                </MMLink>             
            </template>
            <template v-else>
                <a class="btn_back" href="#" @click.prevent="back()">
                    <i class="ico_history-back" /><b class="mm_ir-blind">이전으로</b>
                </a>
            </template>
        </div>
        <div v-else class="mm_lside">
            <slot name="customLSide" />
        </div>
        <slot name="search" />
        <div v-if="!hideRSide" class="mm_rside">
            <template v-if="['popup', 'side'].includes($route.meta.type) || isPopup">
                <button type="button" class="btn_popup-close" @click="back()">
                    <i class="ico_popup-close" /><b class="mm_ir-blind">팝업 닫기</b>
                </button>
            </template>
            <template v-else>
                <MMLink v-if="$route.meta.useRsideHome" class="btn_home" :to="{ name : 'Main' }">
                    <i class="ico_home" /><b class="mm_ir-blind">홈</b>
                </MMLink>    
                <MMLink :to="{ name: 'Search'}">
                    <b class="mm_ir-blind">검색하기</b><i class="ico_search" />
                </MMLink>
                <MMLink :to="{ name : 'Cart' }">
                    <i :class="headerDesignType === 'B' && isMain ? 'ico_pushcart' : 'ico_cart'" />
                    <strong class="text_badge">{{ inCartGoodsCount }}</strong>
                    <b class="mm_ir-blind">장바구니</b>
                </MMLink>            
            </template>
        </div>
        <slot name="extra" />
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { InitialSettings } from '$/@type/configs';
import { useRecentCart } from '$/composables/shoppingComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

withDefaults(defineProps<{
    hideRSide?: boolean
    hideLSide?: boolean
    isMain?: boolean
    isPopup?: boolean
}>(), {
    hideRSide: false,
    hideLSide: false,
    isMain: false,
    isPopup: false,
})
 
const { inCartGoodsCount } = useRecentCart();
const { router, route, globalConfigs }  = usePageContext();
const headerElement = ref<HTMLElement | null>(null);        
const isHeaderFontWhite = ref<boolean>(globalConfigs.value.design.useHeaderColor);     
const headerDesignType = ref<InitialSettings['design']['headerType']>(globalConfigs.value.design.headerType || 'A');

function back() {
    if (window.history.state.position === 0 && window.history.state.back == null && !location.hash) {
        return router.push("/");
    }

    route.meta.isBackPressed = true;
    router.go(-1);
}
</script>
