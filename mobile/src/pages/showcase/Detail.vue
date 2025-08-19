<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>쇼케이스</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div v-if="showcase" class="mm_page-content">
                        <!-- 쇼케이스 상단 -->
                        <div class="m_showcase-detail-head">
                            <i class="image_banner">
                                <img 
                                    v-lazyload="{ src: showcase.mobileBannerUrl }" 
                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                    :alt="showcase.mobileBannerAlt"
                                >
                            </i>
                            <div class="mm_inner">
                                <p class="text_title">
                                    <b>{{ showcase.title }}</b>
                                </p>
                                <p class="text_date">
                                    {{ MMFilters.formatDate(showcase.createdAt, "YYYY/MM/DD") }}
                                </p>
                                <p class="text_detail">
                                    {{ showcase.details }}
                                </p>
                            </div>
                        </div>
                        <!--// 쇼케이스 상단 -->

                        <!-- 동영상 -->
                        <div v-if="showcase.isVideo" class="m_showcase-detail-media" v-html="showcase.videoUrl" />
                        <!--// 동영상 -->

                        <!-- 상품그룹-->
                        <ShowcaseGroup
                            v-if="showcase.groups.length > 0"
                            :groups="showcase.groups"
                        />
                        <!--// 상품그룹 -->

                        <!-- 브랜드샵 -->
                        <div class="m_showcase-detail-brand">
                            <button
                                type="button"
                                :class="['btn_like', { 'S=switch-on': isWishBrand }]" 
                                data-switch 
                                @click="toggleWishBrand"
                            >
                                <i class="ico_like-brand" />
                                <b class="mm_ir-blind">찜한 브랜드에 추가하기</b>
                            </button>
                            <p class="text_brand">
                                {{ showcase.brandName }}
                            </p>
                            <MMLink
                                :to="{ name: 'GoodsBrandIndex', params: { id: showcase.brandId } }"
                                class="mm_btn T=xs T=primary btn_shop"
                            >
                                <b>SHOP NOW</b>
                                <i class="ico_link T=sm" />
                            </MMLink>
                        </div>
                        <!--// 브랜드샵 -->

                        <!-- View More -->
                        <section v-if="anotherShowcase.length > 0" class="mm_inner m_showcase-detail-more">
                            <h5><b>View More</b></h5>
                            <Carousel 
                                :items="anotherShowcase" 
                                :use-pagination="true"
                                :carousel-data="{ _isMoreSide: true, _autoDelay: 4 }"
                            >
                                <template #item="{ item }">
                                    <MMLink :to="{ name: 'ShowcaseDetail', params: { id: item.id } }">
                                        <figure>
                                            <i v-lazyload="{ src: item.thumbnailUrl }" class="mm_bg-cover image_banner" :data-lazyload="`{ '_src':  '${item.thumbnailUrl}' }`" />
                                            <figcaption>
                                                <p class="text_category">
                                                    {{ item.sortName }}
                                                </p>
                                                <p class="text_title">
                                                    {{ item.title }}
                                                </p>
                                            </figcaption>
                                        </figure>
                                    </MMLink>
                                </template>
                            </Carousel>
                        </section>
                        <!--// View More -->

                        <!-- 하단 버튼 -->
                        <div class="mm_foot">
                            <div class="mm_btn_box">
                                <MMLink :to="{ name: 'Showcase', params: { sortId: '0' } }" class="mm_btn T=line T=dark">
                                    <b>쇼케이스 메인으로 이동</b>
                                    <i class="ico_link" />
                                </MMLink>
                            </div>
                        </div>
                        <!--// 하단 버튼 -->
                    </div>
                    <!--// 본문 -->

                    <!-- 푸터 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>
        </template>
    </MMSub>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, defineAsyncComponent } from 'vue';
import { ShowcaseDetail, AnotherShowcase } from '$/@type/showcase';
import { useRoute, useRouter } from 'vue-router';
import { showcaseRepository } from '$/repository/showcaseRepository';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { wishRepository } from '$/repository/member/wishRepository';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useUserState } from '$/composables/auth/userComposable';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        showcase: ShowcaseDetail|null;
        anotherShowcase: AnotherShowcase[];
    }
}
export default defineComponent({
    components: {
        MMSub: defineAsyncComponent(() => import('@/components/layout/Sub.vue')),
        ShowcaseGroup: defineAsyncComponent(() => import('@/pages/showcase/GoodsGroup.vue')),
        MMFooter: defineAsyncComponent(() => import('@/components/Footer.vue')),        
        Carousel: defineAsyncComponent(() => import('@/components/Carousel.vue')),
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const [showcaseDetail, anotherShowcaseList] = await Promise.all([
                showcaseRepository.getShowcaseDetails(Number(to.params.id)),
                showcaseRepository.getAnotherShowcaseList(Number(to.params.id))
            ]);

            next((vm) => {
                vm.showcase = showcaseDetail;
                vm.anotherShowcase = anotherShowcaseList;
            })
        } catch (e) {
            console.log(e)
            next();
        }
           
    },
    setup() {
        // 라우터
        const route = useRoute();
        const router = useRouter();
        // 회원 관련
        const { isUser } = useUserState();
        const isWishBrand = ref(false);
        // 쇼케이스 상세
        const showcase = ref<ShowcaseDetail | null>(null);
        // 다른 쇼케이스
        const anotherShowcase = ref<AnotherShowcase[]>([]);

        async function fetch() {
            try {
                const [showcaseDetail, anotherShowcaseList] = await Promise.all([
                    showcaseRepository.getShowcaseDetails(Number(route.params.id)),
                    showcaseRepository.getAnotherShowcaseList(Number(route.params.id))
                ]);

                showcase.value = showcaseDetail;                // 쇼케이스 상세
                anotherShowcase.value = anotherShowcaseList;    // 다른 쇼케이스 리스트                
            } catch (e) {
                console.log(e);
            }
        }

        /**
         * 브랜드 좋아요 처리
         */
        async function toggleWishBrand() {
            if (!isUser.value) {
                return mmon.bom.confirm("로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?", (flag: boolean) => {
                    if (flag) {
                        router.push({
                            name: "Login",
                            query: {
                                redirect_to_after: route.path,
                            },
                        });
                    }
                });
            }

            if (showcase.value === null) return;

            mmon.loading.show();
            try {
                if (isWishBrand.value) {
                    await wishRepository.deleteBrand(showcase.value.brandId);
                    isWishBrand.value = false;
                } else {
                    await wishRepository.addWishBrand(showcase.value.brandId);
                    isWishBrand.value = true;
                }
                    
            } catch (e) {
                defaultCatch(e);
            } finally {
                mmon.loading.hide();
            }
        }
        
        onMounted(async() => {            
            if (showcase.value === null) {
                await fetch();
            }

            if (showcase.value) {
                // 상품의 좋아요 여부
                showcase.value.groups.forEach((group) => {
                    shoppingRepository.getRelationLikedGoods(group.goodsList.map(goods => {
                        return goods.id
                    }));
                });
                // 브랜드의 좋아요 여부
                isWishBrand.value = (await wishRepository.getWishBrandRelation([showcase.value.brandId]))[0].liked;
            }
            
            usePageTitleSetting(showcase.value?.title);
        });

        return {
            anotherShowcase,                        
            isWishBrand,
            showcase,
            toggleWishBrand,
        }
    },
})
</script>