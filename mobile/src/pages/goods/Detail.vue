<template>
    <BaseDetail 
        v-if="goodsBasicInfo"
        ref="childComponentRef"
        :goods-id="goodsId"
        :goods-basic-info="goodsBasicInfo" 
        :goods-promotion="goodsPromotion" 
        :goods-options="goodsOptions"
        :installment-title="installMentTitle" 
        :is-soldout="isSoldout"
        :total-stock="totalStock"                        
        :is-joint-purchase="false"
        :is-time-deal="isTimeDeal"
        :aggregate-info="aggregateInfo"
        :optional-review-info="optionalReviewInfo"        
    >
        <template #productInfoContents>
            <!-- 상품정보 -->
            <MMLink class="btn_brand" :to="{ name: 'GoodsBrandIndex', params: { id : goodsBasicInfo.goods.brandId}}">
                <b>{{ goodsBasicInfo.goods.brandName }}</b><i class="ico_link" />
            </MMLink>
            <p class="text_product">
                <span v-if="goodsBasicInfo.goods.headline !== null" class="text_foreword">[{{ goodsBasicInfo.goods.headline }}]</span>
                {{ goodsBasicInfo.goods.name }}
            </p>
            <p class="text_price">
                <span v-if="goodsPromotion.saleRate > 0" class="text_sale">{{ goodsPromotion.saleRate }}%</span>
                <strong>
                    {{ MMFilters.formatNumber(goodsPromotion.baseDiscountedPrice) }}
                </strong>
                <del v-if="goodsPromotion.saleRate > 0">
                    {{ MMFilters.formatNumber(goodsPromotion.price) }}
                </del>
            </p>
            <!--// 상품정보 -->
        </template>

        <!-- 추천 아이템: 세트상품리스트 -->
        <template #packageGoods>
            <!-- 추천 아이템 -->
            <section v-if="packageGoods.length > 0" class="m_prodetail-head-recommend">
                <h3 class="m_prodetail-strapline">
                    <b>이런 아이템은 어떠세요?</b>
                </h3>
                <div class="mm_scroller T=x">
                    <div class="mm_product-list T=card">
                        <ul>
                            <li v-for="goods in packageGoods" :key="`package_${goods.id}`">
                                <MmGoods 
                                    :goods="goods"
                                    :is-show-price="false"
                                    :use-liked-button="true"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <!--// 추천 아이템 -->
        </template>        
        <!--// 추천 아이템 -->
        <template #brandBestGoods>
            <!-- 인기상품 -->
            <section v-if="brandBestGoods.length > 0">
                <h3 class="m_prodetail-strapline">
                    <b>{{ goodsBasicInfo.goods.brandName }} 베스트 상품</b>
                </h3>
                <div class="mm_scroller T=x">
                    <div class="mm_product-list T=card">
                        <ul>
                            <li
                                v-for="brandGoods in brandBestGoods"
                                :key="`category_best_${brandGoods.id}`"
                            >
                                <MmGoods
                                    :goods="brandGoods"
                                    :is-show-price="false"
                                    :use-liked-button="true"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <!--// 인기상품 -->
        </template>     
        <template #categoryBestGoods>
            <!-- 추천상품 -->
            <section v-if="mainCategoryBestGoods.length > 0">
                <h3 class="m_prodetail-strapline">
                    <b>{{ depth3CategoryName }} 베스트 상품</b>
                </h3>
                <div class="mm_scroller T=x">
                    <div class="mm_product-list T=card">
                        <ul>
                            <li
                                v-for="categoryBestGoods in mainCategoryBestGoods"
                                :key="`category_best_${categoryBestGoods.id}`"
                            >
                                <MmGoods
                                    :goods="categoryBestGoods"
                                    :is-show-price="false"
                                    :use-liked-button="true"
                                />                                                                    
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <!--// 추천상품 -->
        </template>
    </BaseDetail>            
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, defineAsyncComponent, computed, onUnmounted } from 'vue';
import { AggregateReviewAndQna, BaseGoods, GoodsBasicInfo, GoodsOptions, GoodsPricePromotion, OptionalReviewStatistics, TimeDeal } from '$/@type/goods';
import { goodsRepository } from '$/repository/goodsRepository';
import { exhibitRepository } from '$/repository/exhibitRepository';
import { defaultCatch } from '$/functions';
import { typeCastNumber } from '$/filters';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { useRoute } from 'vue-router';
import { mmon } from '$/helper/mmon';
import { useUserState } from '$/composables/auth/userComposable';
    
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
            const cloneImage = document.querySelector('.m_product-clone');
            if (cloneImage !== null) {
                cloneImage.remove();
            }
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
        const route = useRoute();
        const childComponentRef = ref();
        // 회원 관련
        const { isUser } = useUserState();
        const goodsId = ref<number>(typeCastNumber(`${route.params.id}`));
        const goodsBasicInfo = ref<GoodsBasicInfo>();        
        const totalStock = ref(500);
        const isSoldout = ref(false);
        const goodsMainThumbnailImage = ref('');
        const installMentTitle = ref('');
        const packageGoods = ref<BaseGoods[]>([]);
        const countDownTimer = ref<null|NodeJS.Timeout>(null);

        const isTimeDeal = computed(() => {
            return goodsBasicInfo.value?.goods.type === 'TS';
        })
            
        const timerHtml = ref('');
        const mainCategoryBestGoods = ref<BaseGoods[]>([]);
        const brandBestGoods = ref<BaseGoods[]>([]);
        const goodsOptions = ref<GoodsOptions[]>([]);
        const depth3CategoryName = computed(() => {
            return goodsBasicInfo.value?.goods.category.fullLabel.split('>')[2]  ?? '카테고리' ;
        })
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
            totalWishCount: 0
        });

        const optionalReviewInfo = ref<OptionalReviewStatistics[]>([]);
            
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
            if (childComponentRef.value) {
                childComponentRef.value.focusReviewTab();                
            }
        }

        onMounted(async () => {   
            if (goodsBasicInfo.value === undefined) {
                goodsId.value = typeCastNumber(route.params.id.toString());
                await baseGoodsDataSet();
            } else {
                goodsId.value = goodsBasicInfo.value.goods.id;                        
            }  
            /**
             * 메인화면 밖 항목들 
            */
            const [packGoods, aggregate, optionalReview] = await Promise.all([
                goodsRepository.packageGoods(goodsId.value), 
                goodsRepository.aggregateReviewAndQna(goodsId.value),
                goodsRepository.optionalReviewStatistics(goodsId.value),
            ]);

            packageGoods.value = packGoods;
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

            const categoryBestGoodsIds = mainCategoryBestGoods.value.map((goods) => goods.id)
            const brandBestGoodsIds = brandBestGoods.value.map((goods) => goods.id)
            shoppingRepository.getRelationLikedGoods(categoryBestGoodsIds.concat(brandBestGoodsIds));
                    
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
        
        onUnmounted(() => {
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
            packageGoods,
            brandBestGoods,
            mainCategoryBestGoods,
            childComponentRef,
            goReviewTab,
            timerHtml,
            isTimeDeal,                       
            depth3CategoryName
        }
    },
})
</script>