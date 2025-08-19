<template>
    <div class="m_category">
        <div class="mm_title">
            <h2><b>{{ category.name }}</b></h2>
        </div>

        <!-- 상단 배너 -->
        <div v-if="category.mainBanners.length" class="m_category-banner">
            <MMCarousel 
                :items="category.mainBanners"
                :use-custom-count="true"
                :carousel-data="{
                    _autoDelay: 4,
                    _effect: 'fade'
                }"
            >
                <template #item="{ item }">
                    <MMLink :to="item.link || ''">
                        <figure>
                            <i v-lazyload="{ src: item.imageUrl }" class="mm_bg-cover image_banner" :alt="item.alt" />
                            <figcaption :class="item.colorCode === '#000000' ? 'T=text-black' : ''">
                                <p v-if="!item.text1 && !item.text2 && !item.text3" class="mm_ir-blind">
                                    {{ item.alt }}
                                </p>
                                <template v-else>
                                    <p class="text_main">
                                        {{ item.text1 }}
                                    </p>
                                    <p class="text_main">
                                        {{ item.text2 }}
                                    </p>
                                    <p class="text_sub">
                                        {{ item.text3 }}
                                    </p>
                                </template>
                            </figcaption>
                        </figure>
                    </MMLink>
                </template>
                <template #count>
                    <p><strong class="text_carousel-index" /><i>/</i><span class="text_carousel-total" /></p>
                    <a 
                        class="btn_more"
                        href="#BANNER_LIST"
                        @click.capture="setBannersPopup('', '', (category.mainBanners || []))"
                    ><i class="ico_more T=plus" /><b>전체보기</b>
                    </a>
                </template>
            </MMCarousel>
        </div>
        <!--// 상단 배너 -->

        <!-- 탭메뉴 -->
        <div class="m_category-tab">
            <ul>
                <li v-for="childCategory in category.children" :key="childCategory.code">
                    <MMLink
                        :to="{
                            name : 'GoodsCategoryIndex',
                            params: { id: childCategory.code }
                        }"
                    >
                        <b>{{ childCategory.name }}</b>
                    </MMLink>
                </li>
            </ul>
        </div>
        <!--// 탭메뉴 -->

        <!-- 인기브랜드 메뉴 -->
        <div v-if="category.brandGroup != null && category.brandGroup.brands.length" class="m_category-brand-popular">
            <button type="button" class="mm_btn T=line T=dark T=xs btn_brand" @click="showBrandsPopup">
                <b>{{ category.brandGroup.title }}<i class="ico_link" /></b>
            </button>
            <div 
                ref="brandPopup"
                class="m...popular-popup"
                :class="isShowBrandsPopup ? 'S=on' : ''"
                :style="`z-index: ${isShowBrandsPopup ? '' : '-1'};`"
            >
                <div class="m...popular-popup-dim" />
                <div ref="brandPopupItem" class="m...popular-popup-item">
                    <div class="m...item-head">
                        <h5><b>{{ category.brandGroup.title }}</b></h5>
                        <button type="button" class="btn_close" @click="hideBrandPopup">
                            <b class="mm_ir-blind">닫기</b><i class="ico_popup-close" />
                        </button>
                    </div>
                    <div class="mm_scroller">
                        <ul>
                            <li v-for="brand in category.brandGroup.brands" :key="brand.id">
                                <MMLink :to="{ name: 'GoodsBrandIndex', params: { id: brand.id } }">
                                    <b>{{ brand.name }}</b><i class="ico_link" />
                                </MMLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!--// 인기브랜드 메뉴 -->

        <!-- 베스트 브랜드 -->
        <div class="m_category-brand-best">
            <h3><b>{{ category.brandBannerGroup?.title || '' }}</b></h3>
            <p v-if="category.brandBannerGroup == null || category.brandBannerGroup.banners.length <= 0" class="mm_text-none">
                <i class="ico_text-none" />등록된 내역이 없습니다
            </p>
            <ul v-else>
                <li v-for="banner in category.brandBannerGroup.banners" :key="banner.id">
                    <MMLink :to="banner.link || ''">
                        <figure>
                            <i v-lazyload="{ src: banner.imageUrl }" class="mm_bg-cover image_banner" :alt="banner.alt" />
                            <figcaption :class="banner.colorCode === '#000000' ? 'T=text-black' : ''">
                                <p class="text_title">
                                    {{ banner.text1 }}
                                </p>
                                <p class="text_main">
                                    {{ banner.text2 }}
                                </p>
                            </figcaption>
                        </figure>
                    </MMLink>
                </li>
            </ul>
        </div>
        <!--// 베스트 브랜드 -->
        <!-- MD 추천상품 -->
        <div class="m_category-recommend">
            <h3><b>{{ category.goodsGroup?.title }}</b></h3>
            <p v-if="category.goodsGroup == null || category.goodsGroup.goodsList.length <= 0" class="mm_text-none">
                <i class="ico_text-none" />등록된 내역이 없습니다
            </p>
            <div v-else class="mm_product-list T=card">
                <ul>
                    <li v-for="goods in category.goodsGroup.goodsList" :key="goods.id">
                        <MmGoods :goods="goods" :use-react-tag="true" />
                    </li>
                </ul>
            </div>
        </div>
        <!--// MD 추천상품 -->
    </div>
</template>
<script lang='ts'>
import { ExhibitCategory } from '$/@type/exhibit';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { chunk, defaultCatch } from '$/functions';
import { exhibitRepository } from '$/repository/exhibitRepository';
import { defineAsyncComponent, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { useBannersPopup } from '$/composables/blockComposable';
import gsap from "gsap";
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useExhibitCategory } from '$/composables/exhibit/categoryComposable';
declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        category: ExhibitCategory
    }
}
export default defineComponent({
    components: {
        MMCarousel: defineAsyncComponent(() => import('@/components/Carousel.vue'))
    },
    async beforeRouteEnter(to, from, next) {
        const { 
            exhibitCategoryPageInfo, 
            fetchExhibitCategory,
        } = useExhibitCategory(`${to.params.id}`);

        try {
            await fetchExhibitCategory();
        } catch (e) {
            return next()
        }

        if (exhibitCategoryPageInfo.value == null) {
            return next({
                name: 'GoodsCategoryIndex',
                params: { id: to.params.id }
            })
        }

        usePageTitleSetting(exhibitCategoryPageInfo.value.name);
        next()
    },
    setup() {
        const { route, router } = usePageContext() 
        const { setBannersPopup } = useBannersPopup();
        const category = ref<ExhibitCategory>({
            name: '',
            children: [],
            mainBanners: [],
            brandBannerGroup: {
                title: '',
                banners: [],
            },
            brandGroup: {
                title: '',
                brands: []
            },
            goodsGroup: {
                title: '',
                goodsList: [],
            },
        });
        const isShowBrandsPopup = ref<boolean>(false);
        const brandPopup = ref<HTMLElement>();
        const brandPopupItem = ref<HTMLElement>()
        function showBrandsPopup() {
            if (!brandPopup.value || !brandPopupItem.value) {
                return;
            }
            gsap.to(brandPopup.value, { opacity: 1, duration: 0.2 });
            gsap.to(brandPopupItem.value, { x: 0, duration: 0.2, ease: 'Power0.easeNone' });
            isShowBrandsPopup.value = true;
        }
        function hideBrandPopup() {
            if (!brandPopup.value || !brandPopupItem.value) {
                return;
            }
            
            gsap.to(brandPopup.value, { opacity: 0, duration: 0.2 });
            gsap.to(brandPopupItem.value, { 
                x: '100%', 
                duration: 0.2, 
                ease: 'Power0.easeNone',
                onComplete: () => {
                    isShowBrandsPopup.value = false;
                } 
            });
        }
        
        onMounted(async () => {
            const {
                exhibitCategoryPageInfo,
                fetchExhibitCategory,
            } = useExhibitCategory(`${route.params.id}`);

            try {
                await fetchExhibitCategory()
            } catch (e) {
                defaultCatch(e)
            }
            
            if (exhibitCategoryPageInfo.value == null) {
                return router.replace({
                    name: 'GoodsCategoryIndex',
                    params: { id: route.params.id }
                })
            }

            category.value = exhibitCategoryPageInfo.value;
            usePageTitleSetting(category.value?.name);
        });

        onBeforeUnmount(() => {
            useExhibitCategory(`${route.params.id}`).clearExhibitCategory();  
        })

        return {
            category,
            isShowBrandsPopup,
            brandPopup,
            brandPopupItem,
            showBrandsPopup,
            hideBrandPopup,
            setBannersPopup,
            chunk,
        }
    }
})
</script>