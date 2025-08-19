<template>
    <div
        v-if="showcase"
        class="mm_page-content"
    >
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="m_showcase-detail">
            <h3 class="mm_title">
                <b>쇼케이스</b>
            </h3>
            <!-- 상세 타이틀 -->
            <div class="mm_event-head">
                <div class="mm_inner">
                    <h4><b>{{ showcase.title }}</b></h4>
                    <MMLink
                        :to="{ name: 'Showcase', params: { sortId: '0' } }"
                        class="btn_home"
                    >
                        <i class="ico_back" />
                        <b>쇼케이스 Main</b>
                    </MMLink>
                    <p class="text_date">
                        {{ MMFilters.formatDate(showcase.createdAt, "YYYY/MM/DD") }}
                    </p>
                </div>
            </div>
            <!--// 상세 타이틀 -->
            <div class="mm_inner">
                <!-- 쇼케이스 배너, 상세설명 -->
                <i class="image_banner">
                    <img 
                        v-lazyload="{ src: showcase.pcBannerUrl }" 
                        src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" 
                        :alt="showcase.pcBannerAlt"
                    >
                </i>
                <p class="text_detail">
                    {{ showcase.details }}
                </p>
                <!--// 쇼케이스 배너, 상세설명 -->

                <!-- 동영상 -->
                <div
                    v-if="showcase.isVideo"
                    class="m_showcase-detail-media"
                    v-html="showcase.videoUrl"
                />
                <!--// 동영상 -->

                <!-- 상품그룹1 -->
                <div
                    v-for="group in showcase.groups"
                    :key="group.id"
                    class="m_showcase-detail-product"
                >
                    <i class="image_banner">
                        <img 
                            v-lazyload="{ src: group.pcImageUrl }" 
                            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                            :alt="group.pcImageAlt"
                        >
                    </i>
                    <div
                        v-if="group.goodsList.length > 0"
                        class="mm_product-list"
                    >
                        <Slider
                            class="T=list-full"
                            :items="group.goodsList"
                            :use-control="true"
                            :use-control-small-icon="true"
                        >
                            <template #item="{ item }">
                                <MmGoods
                                    :goods="item"
                                    :is-show-price="true"
                                    :is-show-sell-rate="true"
                                    :use-react-tag="true"
                                    :use-liked-button="true"
                                />                                    
                            </template>
                        </Slider>
                    </div>
                </div>
                <!--// 상품그룹1 -->

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
                        :to="{ name: 'GoodsBrandIndex', params: { id: showcase.brandId} }"
                        class="mm_btn T=sm T=light btn_shop"
                    >
                        <b>브랜드샵 가기</b><i class="ico_link T=xs" />
                    </MMLink>
                </div>
                <!--// 브랜드샵 -->

                <!-- View More -->
                <section
                    v-if="anotherShowcase.length > 0"
                    class="m_showcase-detail-more"
                >
                    <h6><b>View More</b></h6>
                    <Slider
                        :items="anotherShowcase"
                        :use-control="true"
                        :use-control-small-icon="true"
                    > 
                        <template #item="{ item }">
                            <MMLink :to="{ name: 'ShowcaseDetail', params: { id: item.id } }">
                                <figure>
                                    <i
                                        v-lazyload="{ src: item.thumbnailUrl }"
                                        class="mm_bg-cover image_banner"
                                    />
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
                    </Slider>
                </section>
                <!--// View More -->

                <!-- 하단 버튼 -->
                <div class="mm_foot">
                    <div class="mm_btn_box">
                        <MMLink
                            :to="{ name: 'Showcase', params: { sortId: '0' } }"
                            class="mm_btn T=line T=dark"
                        >
                            <b>쇼케이스 메인으로 이동</b>
                            <i class="ico_link" />
                        </MMLink>
                    </div>
                </div>
                <!--// 하단 버튼 -->
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ShowcaseDetail, AnotherShowcase } from '$/@type/showcase';
import { showcaseRepository } from '$/repository/showcaseRepository';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { wishRepository } from '$/repository/member/wishRepository';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import MMLink from '@/components/MMLink.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import Slider from '@/components/Slider.vue';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
    
const { route, router, isUser } = usePageContext();
const isWishBrand = ref(false);
// 쇼케이스 상세
const showcase = ref<ShowcaseDetail | null>(null);

// 다른 쇼케이스
const anotherShowcase = ref<AnotherShowcase[]>([]);

onMounted(async() => {
    await fetch();
    usePageTitleSetting(showcase.value?.title);
});

async function fetch() {
    mmon.loading.show();
    try {
        const [showcaseDetail, anotherShowcaseList] = await Promise.all([
            showcaseRepository.getShowcaseDetails(Number(route.params.id)),
            showcaseRepository.getAnotherShowcaseList(Number(route.params.id))
        ]);

        showcase.value = showcaseDetail;                // 쇼케이스 상세
        anotherShowcase.value = anotherShowcaseList;    // 다른 쇼케이스 리스트
        
        // 상품의 좋아요 여부
        showcase.value.groups.forEach((group) => {
            shoppingRepository.getRelationLikedGoods(group.goodsList.map(goods => {
                return goods.id
            }));
        });
        
        // 브랜드의 좋아요 여부
        isWishBrand.value = (await wishRepository.getWishBrandRelation([showcase.value.brandId]))[0].liked;
    } catch (e) {
        console.log(e);
    } finally {
        mmon.loading.hide();
    }
}

/**
     * 브랜드 찜처리
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
</script>
