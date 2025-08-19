<template>
    <BaseDetail 
        v-if="goodsBasicInfo"
        ref="childComponentRef"
        :goods-id="goodsId"
        :goods-basic-info="goodsBasicInfo" 
        :goods-promotion="goodsPromotion" 
        :goods-options="goodsOptions"
        :goods-main-thumbnail-image="goodsMainThumbnailImage" 
        :installment-title="installMentTitle" 
        :is-soldout="isSoldout"
        :total-stock="totalStock"                        
        :is-joint-purchase="false"
        :is-time-deal="isTimeDeal"
        :aggregate-info="aggregateInfo"
        :optional-review-info="optionalReviewInfo"
        :max-orderable-count="isTimeDeal ? timeDealInfo?.maxOrderAbleCount : 0"
    >
        <template #rightSideHeadContents>
            <!-- 상품정보 -->
            <!-- 타임특가(유료) -->
            <div
                v-if="isTimeDeal"
                class="m_prodetail-head-timesale"
            >
                <i class="ico_clock" />
                <p
                    class="text_time"
                    v-html="timerHtml"
                />
                <p class="text_stock">
                    남은수량<strong>{{ MMFilters.formatNumber(totalStock) }}</strong>
                </p>
            </div>
            <!--// 타임특가(유료) -->
            <div class="m_prodetail-head-product">
                <p
                    class="text_star"
                    :style="aggregateInfo.totalReviewCount < 1 ? { opacity : 0 } : {}"
                >
                    <i
                        class="ico_star"
                        title="별점"
                    />
                    <span>{{ aggregateInfo.reviewAverageStars }}</span>
                    <button
                        type="button"
                        class="btn_review"
                    >
                        <b>리뷰 {{ aggregateInfo.totalReviewCount }}개 보기</b>
                    </button>
                </p>
                <MMLink
                    class="btn_brand"
                    :to="{ name: 'GoodsBrandIndex', params: { id : goodsBasicInfo.goods.brandId}}"
                >
                    <b>{{ goodsBasicInfo.goods.brandName }}</b><i class="ico_link" />
                </MMLink>
                <p class="text_product">
                    <span
                        v-if="goodsBasicInfo.goods.headline !== null"
                        class="text_foreword"
                    >[{{ goodsBasicInfo.goods.headline }}]</span>
                    {{ goodsBasicInfo.goods.name }}
                </p>
                <p
                    v-if="goodsPromotion"
                    class="text_price"
                >
                    <strong
                        v-if="goodsPromotion.saleRate > 0"
                        class="text_sale"
                    >{{ `${goodsPromotion.saleRate}%` }}</strong>
                    <strong>{{ MMFilters.formatNumber(goodsPromotion.baseDiscountedPrice) }}</strong>
                    <del v-if="goodsPromotion.saleRate > 0">{{ MMFilters.formatNumber(goodsPromotion.price) }}</del>
                </p>
            </div>
            <!--// 상품정보 -->
        </template>

        <!-- 추천 아이템: 세트상품리스트 -->
        <template #packageGoods>
            <section
                v-if="packageGoodsGroup.length > 0"
                class="m_prodetail-recommend"
            >
                <h4><small>With Item</small><b>이런 아이템은 어떠세요?</b></h4>
                <Carousel
                    :items="packageGoodsGroup"
                    :use-control="true"
                    :carousel-data="{ _autoDelay: 4 }"
                >
                    <template #item="{ item }">
                        <div
                            v-for="goods in item"
                            :key="goods.id"
                            class="mm_product-item T=single T=sm"
                        >
                            <MMLink :to="{ name: 'GoodsDetail', params: { id: goods.id }}">
                                <figure>
                                    <div class="mm_image-scale">
                                        <i 
                                            v-lazyload="{ src : goods.thumbnailUrl }" 
                                            class="mm_bg-cover image_product" 
                                        />
                                    </div>
                                    <p
                                        v-if="goods.isSoldout"
                                        class="text_soldout"
                                    >
                                        SOLD OUT
                                    </p>
                                    <figcaption>
                                        <p class="text_brand">
                                            {{ goods.brandName }}
                                        </p>
                                        <p class="text_product">
                                            {{ goods.name }}
                                        </p>
                                        <p class="text_price">
                                            <strong>{{ MMFilters.formatNumber(goods.baseDiscountedPrice) }}</strong>
                                        </p>
                                    </figcaption>
                                </figure>
                            </MMLink>
                        </div>
                    </template>
                </Carousel>
            </section>
        </template>        
        <!--// 추천 아이템 -->

        <template #prodDetailFoot>
            <div v-if="mainCategoryBestGoods.length > 0 || brandBestGoods.length > 0" class="m_prodetail-foot">
                <!-- 인기상품 -->
                <section v-if="brandBestGoods.length > 0">
                    <h4><b>{{ goodsBasicInfo.goods.brandName }} 베스트 상품</b></h4>
                    <div class="mm_product-list">
                        <Slider
                            :items="brandBestGoods"
                            :use-control="true"
                        >
                            <template #item="{ item }">
                                <MmGoods
                                    :key="item.id" 
                                    :goods="item" 
                                    :is-show-price="false" 
                                    :use-liked-button="true"
                                />                                            
                            </template>
                        </Slider>
                    </div>
                </section>
                <!--// 인기상품 -->
                <!-- 추천상품 -->
                <section v-if="mainCategoryBestGoods.length > 0">
                    <h4><b>{{ depth3CategoryName }} 베스트 상품</b></h4>
                    <div class="mm_product-list">
                        <Slider
                            :items="mainCategoryBestGoods"
                            :use-control="true"
                        >
                            <template #item="{ item }">
                                <MmGoods
                                    :key="item.id" 
                                    :goods="item" 
                                    :is-show-price="false" 
                                    :use-liked-button="true"
                                />                                                  
                            </template>
                        </Slider>
                    </div>
                </section>
                <!--// 추천상품 -->
            </div>
        </template>
    </BaseDetail>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, defineAsyncComponent, computed, onBeforeUnmount } from 'vue';
import { AggregateReviewAndQna, BaseGoods, GoodsBasicInfo, GoodsOptions, GoodsPricePromotion, OptionalReviewStatistics, TimeDeal } from '$/@type/goods';
import { goodsRepository } from '$/repository/goodsRepository';
import { exhibitRepository } from '$/repository/exhibitRepository';
import { countdown, defaultCatch } from '$/functions';
import { formatDate, padLeft, typeCastNumber } from '$/filters';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { mmon } from '$/helper/mmon';
import { EpCoupon } from '$/@type/coupon';
import EpCouponModal from '@/components/modal/goods/EpCoupon.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { useClosePopup } from '$/composables/popupComposable'
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import moment from 'moment';

declare module "@vue/runtime-core" { 
interface ComponentCustomProperties {
        goodsBasicInfo: GoodsBasicInfo;
        goodsId: number;
        goodsMainThumbnailImage: string;
        installMentTitle: string;
        goodsOptions: GoodsOptions[];
        goodsPromotion: GoodsPricePromotion;
        totalStock: number;
        isSoldout: boolean;
    }
}
export default defineComponent({
    components: {
        BaseDetail: defineAsyncComponent(() => import('@/pages/goods/BaseDetail.vue')),
        Carousel: defineAsyncComponent(() => import("@/components/Carousel.vue")),
        Slider: defineAsyncComponent(() => import("@/components/Slider.vue")),
    },
    async beforeRouteEnter (to, from, next) {
        try {
            const goodsId = typeCastNumber(to.params.id.toString());
            const basicInfo = await goodsRepository.detailBase(goodsId);
            if (basicInfo.raffle !== null && basicInfo.raffle.id) {
                return next({
                    name: 'RaffleDetail',
                    params: {
                        id: basicInfo.raffle.id
                    }
                })
            }

            if (basicInfo.jointPurchase !== null && basicInfo.jointPurchase.id) {
                return next({
                    name: 'JointPurchaseDetail',
                    params: {
                        id: basicInfo.jointPurchase.id
                    }
                })
            }
                
            const [options, pricePromotion, { stock, is_soldout }, installmentsBenefit ] = await Promise.all([
                goodsRepository.getOptions(goodsId),
                goodsRepository.promotionPrice(goodsId),
                goodsRepository.getStock(goodsId),
                exhibitRepository.cardBenefit()
            ])

            next((vm) => {
                vm.goodsId = goodsId;
                vm.goodsBasicInfo = basicInfo;
                vm.goodsMainThumbnailImage = basicInfo.goods.thumbnailUrl;
                vm.installMentTitle = installmentsBenefit === null ? '' : installmentsBenefit.title;       
                vm.goodsOptions = options;
                vm.goodsPromotion = pricePromotion
                vm.totalStock = stock;
                vm.isSoldout = is_soldout;
            });
        } catch(error) {
            defaultCatch(error, {
                404: '판매중인 상품이 아닙니다.',
                500: '상품 조회에 실패하였습니다.'
            });
            if (from.path === '/') {
                return next('/');
            } else {
                return next(false);
            }
        }
    },    
    setup() {
        const childComponentRef = ref();
        // 회원 정보 
        const { route, isUser, router } = usePageContext();
        const goodsId = ref<number>(typeCastNumber(`${route.params.id}`));

        const goodsBasicInfo = ref<GoodsBasicInfo>();
        const timeDealInfo = ref<TimeDeal|null>(null);
        const totalStock = ref(500);
        const isSoldout = ref(false);
        const goodsMainThumbnailImage = ref('');
        const installMentTitle = ref('');
        const packageGoodsGroup = ref<BaseGoods[][]>([]);
        const countDownTimer = ref<null|NodeJS.Timeout>(null);
        const isTimeDeal = computed(() => {
            return goodsBasicInfo.value?.goods.type === 'TS';
        })        

        const { isShowPopup } = useClosePopup()
        /**
         * EP 쿠폰 
        */
        const epCoupon = ref<EpCoupon|null>(null);
        const timerHtml = ref('');
        const mainCategoryBestGoods = ref<BaseGoods[]>([]);
        const brandBestGoods = ref<BaseGoods[]>([]);
        const goodsOptions = ref<GoodsOptions[]>([]);
        const goodsPromotion = ref<GoodsPricePromotion>({
            sellPrice: 0,
            baseDiscountedPrice: 0,
            saleRate: 0,
            price: 0,
            immediatelyDiscountedPrice :0,
            nightDiscountedPrice: 0,
            couponDiscountedPrice: 0,
            isDownloadAbleCoupon: false,
            maxDiscountedPrice: 0,                                
            timeSaleDiscountedPrice: 0,
            purchaseAble: false            
        }); 

        const aggregateInfo = ref<AggregateReviewAndQna>({
            totalQnaCount: 0,
            totalReviewCount: 0,
            reviewAverageStars: 0,
            reviewerCount: 0,
            satisfaction: 50,
            totalWishCount: 0,
        });

        const optionalReviewInfo = ref<OptionalReviewStatistics[]>([]);         
        
        const depth3CategoryName = computed(() => {
            return goodsBasicInfo.value?.goods.category.fullLabel.split('>')[2]  ?? '카테고리' ;
        })
            
        async function baseGoodsDataSet() {
            mmon.loading.show();
            const [basicInfo, options, pricePromotion, { stock, is_soldout }, installmentsBenefit ] = await Promise.all([
                goodsRepository.detailBase(goodsId.value),
                goodsRepository.getOptions(goodsId.value),
                goodsRepository.promotionPrice(goodsId.value),
                goodsRepository.getStock(goodsId.value),
                exhibitRepository.cardBenefit()
            ])

            goodsBasicInfo.value = basicInfo;
            goodsMainThumbnailImage.value = goodsBasicInfo.value.goods.thumbnailUrl;
            installMentTitle.value = installmentsBenefit === null ? '' : installmentsBenefit.title;       
            goodsOptions.value = options;
            goodsPromotion.value = pricePromotion
            totalStock.value = stock;
            isSoldout.value = is_soldout;        
            mmon.loading.hide();
        }

        function goReviewTab() {
            childComponentRef.value.focusReviewTab();                
        }

        

        onMounted(async () => {   
            if (goodsBasicInfo.value === undefined) {
                goodsId.value = typeCastNumber(route.params.id.toString());
                await baseGoodsDataSet();
            } else {
                goodsId.value = goodsBasicInfo.value.goods.id;                        
            }  


            if (isTimeDeal.value) {
                timeDealInfo.value = await goodsRepository.getTimeDealInfo(goodsId.value);
                if (moment().diff(timeDealInfo.value.sellStartAt, 'seconds') < -60) {
                    return mmon.bom.alert(`${formatDate(timeDealInfo.value.sellStartAt, 'MM.DD(ddd) HH시 mm분', true)}에 진행되는 타임딜 입니다.`, () => {                        
                        if (window.history.state.position === 0 && window.history.state.back == null && !location.hash) {
                            return router.replace("/");
                        }

                        router.go(-1);
                    })
                }

                const hour = ref('')
                countDownTimer.value = countdown(`${timeDealInfo.value.sellEndAt}`, 's', (ms, diff) => {
                    hour.value = String(diff.hour); 
                    timerHtml.value = `<strong> ${padLeft(hour.value, 2, '0')}<span>:</span>${padLeft(`${diff.minute}`, 2, '0')}<span>:</span>${padLeft(`${diff.second}`, 2, '0')}</strong>`;
                }, 
                true);
            }

            /**
             * 메인화면 밖 항목들 
            */
            if (!isSoldout.value) {
                (async () => {
                    epCoupon.value = await goodsRepository.getEpCoupon(goodsId.value);
                    if (epCoupon.value !== null && isShowPopup(`IS_${epCoupon.value.siteCode}_${goodsId.value}`) !== true) {
                        useModal().open(EpCouponModal, {
                            title: `${epCoupon.value.siteLabel}`,
                            props: {
                                epCoupon: epCoupon.value,
                                goodsId: goodsId.value,
                                isUser: isUser.value
                            }
                        })
                    }
                })()                    
            }       
            const [packGoods, aggregate, optionalReview] = await Promise.all([
                goodsRepository.packageGoods(goodsId.value), 
                goodsRepository.aggregateReviewAndQna(goodsId.value),
                goodsRepository.optionalReviewStatistics(goodsId.value),
            ]);

            for (let i = 0; i < packGoods.length; i+=3) {
                packageGoodsGroup.value.push(packGoods.slice(i, i+3));
            }
            aggregateInfo.value = aggregate;
            optionalReviewInfo.value = optionalReview;

            const [bestCategoryGoods, bestBrandGoods] = await Promise.all(
                [
                    goodsRepository.bestOfMainCategory(goodsId.value), 
                    goodsRepository.bestOfBrand(goodsId.value)
                ]
            );

            mainCategoryBestGoods.value = bestCategoryGoods;
            brandBestGoods.value = bestBrandGoods;

            await shoppingRepository.getRelationLikedGoods(mainCategoryBestGoods.value.map((goods) => goods.id));
            await shoppingRepository.getRelationLikedGoods(brandBestGoods.value.map((goods) => goods.id), false);

                    
            if (goodsBasicInfo.value !== undefined) {
                shoppingRepository.addRecentViewGood({
                    id: goodsId.value,
                    thumbnailUrl: goodsBasicInfo.value.goods.thumbnailUrl,
                    name: goodsBasicInfo.value.goods.name,
                    baseDiscountedPrice: goodsPromotion.value.baseDiscountedPrice,
                    saleRate: goodsPromotion.value.saleRate,
                    brandName:goodsBasicInfo.value.goods.brandName,
                    isSoldout: isSoldout.value,
                    sellPrice: goodsPromotion.value.sellPrice,
                    price: goodsPromotion.value.price,
                }, isUser.value)
            }
        });

        onBeforeUnmount(() => {
            if (countDownTimer.value !== null) {
                clearInterval(countDownTimer.value);
            }
        })

        return {
            goodsId,
            goodsBasicInfo,
            goodsPromotion,
            goodsOptions,
            isSoldout,
            totalStock,
            aggregateInfo,
            optionalReviewInfo,
            goodsMainThumbnailImage,
            installMentTitle,
            packageGoodsGroup,
            brandBestGoods,
            mainCategoryBestGoods,
            childComponentRef,
            goReviewTab,
            timerHtml,
            isTimeDeal,            
            timeDealInfo,
            depth3CategoryName
        }
    },
})
</script>