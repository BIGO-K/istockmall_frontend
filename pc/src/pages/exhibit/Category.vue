<template>
    <div class="mm_page-content">
        <div class="m_category">
            <h3 class="mm_title">
                <b>{{ category.name }}</b>
            </h3>

            <!-- 상단 배너 -->
            <div v-if="category.mainBanners.length" class="m_category-banner">
                <MMCarousel 
                    :items="chunk(category.mainBanners, 2)"
                    :use-control="true"
                    :use-custom-count="true"
                    :use-count="false"
                    :carousel-data="{
                        _autoDelay: 4
                    }"
                >
                    <template #item="{ item }: { item: ExhibitCategory['mainBanners'] }">
                        <ul class="mm_flex T=equal">
                            <li v-for="banner in item" :key="banner.id">
                                <MMLink :to="banner.link || ''">
                                    <figure>
                                        <i v-lazyload="{ src: banner.imageUrl }" class="mm_bg-cover image_banner" :alt="banner.alt" />
                                        <figcaption :class="banner.colorCode === '#000000' ? 'T=text-black' : ''">
                                            <p v-if="!banner.text1 && !banner.text2 && !banner.text3" class="mm_ir-blind">
                                                {{ banner.alt }}
                                            </p>
                                            <template v-else>
                                                <p class="text_main">
                                                    {{ banner.text1 }}
                                                </p>
                                                <p class="text_main">
                                                    {{ banner.text2 }}
                                                </p>
                                                <p class="text_sub">
                                                    {{ banner.text3 }}
                                                </p>
                                            </template>
                                        </figcaption>
                                    </figure>
                                </MMLink>
                            </li>
                            <li v-if="item.length < 2" />
                        </ul>
                    </template>
                    <template #count>
                        <strong class="text_carousel-index" /><i /><span class="text_carousel-total" />
                        <button type="button" class="btn_more" @click="showMainBannerModal = true">
                            <b><i class="ico_more" />전체보기</b>
                        </button>
                    </template>
                </MMCarousel>
                <!-- 캐러셀 전체보기 팝업 -->
                <div v-if="showMainBannerModal" class="m_category-banner-popup S=on">
                    <div class="m...popup-dim" />
                    <div class="m...popup-item">
                        <div class="mm_scroller">
                            <ul>
                                <li v-for="banner in category.mainBanners" :key="banner.id">
                                    <MMLink :to="banner.link || ''">
                                        <figure>
                                            <i v-lazyload="{ src: banner.imageUrl }" class="mm_bg-cover image_banner" :alt="banner.alt" />
                                            <figcaption :class="banner.colorCode === '#000000' ? 'T=text-black' : ''">
                                                <p v-if="!banner.text1 && !banner.text2 && !banner.text3" class="mm_ir-blind">
                                                    이미지 대체텍스트
                                                </p>
                                                <template v-else>
                                                    <p class="text_main">
                                                        {{ banner.text1 }}
                                                    </p>
                                                    <p class="text_main">
                                                        {{ banner.text2 }}
                                                    </p>
                                                    <p class="text_sub">
                                                        {{ banner.text3 }}
                                                    </p>
                                                </template>
                                            </figcaption>
                                        </figure>
                                    </MMLink>
                                </li>
                            </ul>
                        </div>
                        <button type="button" class="btn_close" @click="showMainBannerModal = false">
                            <i class="ico_popup-close" /><b class="mm_ir-blind">닫기</b>
                        </button>
                    </div>
                </div>
            <!--// 캐러셀 전체보기 팝업 -->
            </div>
            <!--// 상단 배너 -->

            <div class="mm_inner">
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

                <!-- 베스트 브랜드 -->
                <div 
                    v-if="
                        category.brandBannerGroup != null 
                            && (category.brandBannerGroup.banners.length > 0 || category.brandBannerGroup.title)
                    "
                    class="m_category-brand-best"
                >
                    <h4><b>{{ category.brandBannerGroup.title }}</b></h4>
                    <ul>
                        <li v-for="banner in category.brandBannerGroup.banners" :key="banner.id">
                            <MMLink :to="banner.link || ''">
                                <figure>
                                    <i v-lazyload="{ src: banner.imageUrl }" class="mm_bg-cover image_banner" :alt="banner.alt" />
                                    <figcaption :class="banner.colorCode === '#000000' ? 'T=text-black' : ''">
                                        <p class="text_main">
                                            {{ banner.text1 }}
                                        </p>
                                        <p class="text_sub">
                                            {{ banner.text2 }}
                                        </p>
                                    </figcaption>
                                </figure>
                            </MMLink>
                        </li>
                    </ul>
                </div>
                <!--// 베스트 브랜드 -->
                <!-- 인기브랜드 메뉴 -->
                <div 
                    v-if="category.brandGroup != null && (category.brandGroup.brands.length > 0 || category.brandGroup.title)"
                    class="m_category-brand-popular"
                >
                    <h4><b>{{ category.brandGroup.title }}</b></h4>
                    <ul>
                        <li v-for="brand in category.brandGroup.brands" :key="brand.id">
                            <MMLink :to="{ name: 'GoodsBrandIndex', params: { id: brand.id } }">
                                <b>{{ brand.name }}</b><i class="ico_link" />
                            </MMLink>
                        </li>
                    </ul>
                </div>
                <!--// 인기브랜드 메뉴 -->
                <!-- MD 추천상품 -->
                <div 
                    v-if="category.goodsGroup && (category.goodsGroup.goodsList.length > 0 || category.goodsGroup.title)"
                    class="m_category-recommend"
                >
                    <h4><b>{{ category.goodsGroup.title }}</b></h4>
                    <div class="mm_product-list">
                        <ul>
                            <li v-for="goods in category.goodsGroup.goodsList" :key="goods.id">
                                <MmGoods :goods="goods" :use-react-tag="true" />
                            </li>
                        </ul>
                    </div>
                </div>
            <!--// MD 추천상품 -->
            </div>
        </div>
    </div>
</template>
<script lang='ts'>
import { ExhibitCategory } from '$/@type/exhibit';
import { useExhibitCategory } from '$/composables/exhibit/categoryComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { chunk, defaultCatch } from '$/functions';
import { defineAsyncComponent, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
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
        const category = ref<ExhibitCategory>({
            name: '',
            children: [],
            mainBanners: [],
            brandBannerGroup: {
                title: '',
                banners: []
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
        
        const showMainBannerModal = ref<boolean>(false);
        
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
            showMainBannerModal,
            chunk,
        }
    }
})
</script>