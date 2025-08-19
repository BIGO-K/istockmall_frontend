<template>
    <div v-if="!isHide && banner && !$route.meta.isTopBannerHide" class="m_topbanner T=ta">
        <div class="m_topbanner-ribbon">
            <div ref="ribbonBannerElement" class="m_topbanner-ribbon-inner">
                <a href="#" @click.prevent="openCurtainBanner">
                    <i v-lazyload="{ 'src': banner.imageUrl }" class="image_banner" />
                    <b class="mm_ir-blind">{{ banner.title }}</b>
                </a>
                <button ref="ribbonBannerCloseButton" type="button" class="btn_close" @click="closeRibbonBanner">
                    <b class="mm_ir-blind">닫기</b><i class="ico_close" />
                </button>
            </div>
        </div>
        <div v-if="banner.curtainBannerImageUrl" class="m_topbanner-curtain">
            <div ref="curtainBannerElement" class="m_topbanner-curtain-inner">
                <a :href="banner.link">
                    <i v-lazyload="{ 'src': banner.curtainBannerImageUrl }" class="mm_bg-cover image_banner" />
                    <b class="mm_ir-blind">{{ banner.title }}</b>
                </a>
                <button type="button" class="btn_close" @click="closeCurtainBanner">
                    <b class="mm_ir-blind">닫기</b><i class="ico_close" />
                </button>
            </div>
        </div>
    </div>   
</template>
<script setup lang='ts'>
import { useTopBanner, useTopBannerHide } from '$/composables/exhibit/bannerComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { ref } from 'vue';
import gsap from "gsap";

const { router } = usePageContext();
const { topBanner: banner, getBanner } = useTopBanner();
const { isHide, hide } = useTopBannerHide();
/** VARIABLE */
const ribbonBannerElement = ref<HTMLElement|null>(null);
const ribbonBannerCloseButton = ref<HTMLElement|null>(null);
const curtainBannerElement = ref<HTMLElement|null>(null);

/**
 * 탑배너 조회
 */
if (!isHide.value) {
    getBanner();
}
/** // VARIABLE */


/** FUNCTION */

/**
 * 리본배너 닫기
 */
function closeRibbonBanner() {
    gsap.to(ribbonBannerElement.value, { height: 0 });
    gsap.to(ribbonBannerCloseButton.value, 0.2 , { autoAlpha: 0 });
    hide();
}

/**
 * 커튼배너 열기
 */
function openCurtainBanner() {
    if (!banner.value) {
        return;
    }

    if (!banner.value.curtainBannerImageUrl) {
        return router.push(banner.value.link)
    }

    gsap.to(ribbonBannerElement.value, { height: 0, ease: 'cubic.out' });
    gsap.to(ribbonBannerCloseButton.value, 0.2, { autoAlpha: 0 });
    gsap.to(curtainBannerElement.value, { height: 'auto', ease: 'cubic.out', delay: 0.5 });

}

/**
 * 커튼배너 닫기
 */
function closeCurtainBanner() {
    gsap.to(curtainBannerElement.value, { height: 0 });
    gsap.to(ribbonBannerElement.value, { height: 'auto', delay: 0.5, ease: 'cubic.out' });
    gsap.to(ribbonBannerCloseButton.value, { autoAlpha: 1, delay: 0.5 });
}
/** // FUNCTION */

</script>
