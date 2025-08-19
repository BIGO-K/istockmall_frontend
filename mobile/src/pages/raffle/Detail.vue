<template>
    <BaseDetail
        v-if="goodsBasicInfo"
        :goods-id="goodsId"
        :goods-basic-info="goodsBasicInfo" 
        :goods-promotion="goodsPromotion" 
        :goods-options="goodsOptions"        
        :installment-title="installMentTitle" 
        :is-soldout="isSoldout"
        :total-stock="totalStock"                        
        :is-raffle="true"       
        :raffle="raffleDetail"      
    >
        <template #headContents>
            <!-- 래플 타이머 -->
            <div class="m_prodetail-head-raffle">
                <p class="text_time" v-html="timerHtml" />
                <p class="text_join" v-html="statusHtml" />
            </div>
            <!--// 래플 타이머  -->

            <!-- 상품정보 -->
            <div class="m_prodetail-head-product">
                <!-- 상품이미지 -->
                <Carousel
                    :use-pagination="true"
                    :items="goodsBasicInfo.goods.thumbnailUrls"
                    :carousel-data="{
                        _effect: 'cover',
                        _isMoreSide: true,
                        _isErrorRemove: true,
                    }"
                >
                    <template #item="{ item }">
                        <i v-lazyload="{ src: item }" class="mm_bg-contain" :data-lazyload="`{'_src': '${item}'}`" />
                    </template>
                </Carousel>
                <MMLink class="btn_raffle" :to="{name: 'Raffle'}">
                    <b>래플 메인으로 바로가기</b>
                    <i class="ico_link" />
                </MMLink> 
                <!--// 상품이미지 -->
                <div class="m...product-info">
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
                </div>
            </div>
        </template>
        <template #productInfoContents>
            <MMLink class="btn_brand" :to="{ name: 'GoodsBrandIndex', params: { id: goodsBasicInfo.goods.brandId }}">
                <b>{{ goodsBasicInfo.goods.brandName }}</b>
                <i class="ico_link" />
            </MMLink>
            <p class="text_product">
                <span v-if="goodsBasicInfo.goods.headline !== null" class="text_foreword">[{{ goodsBasicInfo.goods.headline }}]</span>
                {{ goodsBasicInfo.goods.name }}
            </p>
            <p class="text_price">
                <strong />
            </p>
        </template>
    </BaseDetail>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch, onBeforeMount, computed } from 'vue';
import { GoodsBasicInfo, GoodsOptions, GoodsPricePromotion } from '$/@type/goods';
import { goodsRepository } from '$/repository/goodsRepository';
import { exhibitRepository } from '$/repository/exhibitRepository';
import { countdown, defaultCatch } from '$/functions';
import { padLeft, typeCastNumber } from '$/filters';
import { RaffleDetail } from '$/@type/raffle';
import { raffleRepository } from '$/repository/raffleRepository';
import BaseDetail from '@/pages/goods/BaseDetail.vue';
import Carousel from '@/components/Carousel.vue';
import moment from 'moment';

    declare module "@vue/runtime-core" { 
        interface ComponentCustomProperties {
            goodsBasicInfo: GoodsBasicInfo;
            goodsId: number;
            raffleDetail: RaffleDetail;
            installMentTitle: string;
            goodsOptions: GoodsOptions[];
            goodsPromotion: GoodsPricePromotion;
            totalStock: number;
            isSoldout: boolean;
        }
    }

export default defineComponent({
    components: {
        BaseDetail,
        Carousel
    },
    async beforeRouteEnter (to, from, next) {
        try {
            const raffleId = typeCastNumber(to.params.id.toString());
            const raffleDetail = await raffleRepository.getDetail(raffleId);
            const goodsId = raffleDetail.goodsId;
            const basicInfo = await goodsRepository.detailBase(goodsId);
            const [options, pricePromotion, { stock, is_soldout }, installmentsBenefit ] = await Promise.all([
                goodsRepository.getOptions(goodsId),
                goodsRepository.promotionPrice(goodsId),
                goodsRepository.getStock(goodsId),
                exhibitRepository.cardBenefit()
            ])

            next((vm) => {
                vm.goodsId = goodsId;
                vm.goodsBasicInfo = basicInfo; 
                vm.raffleDetail = raffleDetail;                                       
                vm.installMentTitle = installmentsBenefit === null ? '' : installmentsBenefit.title;       
                vm.goodsOptions = options;
                vm.goodsPromotion = pricePromotion
                vm.totalStock = stock;
                vm.isSoldout = is_soldout;
            });
        } catch(error) {
            defaultCatch(error, {
                404: '진행중인 래플이 아닙니다.',
                500: '래플 정보 조회에 실패하였습니다.'
            });

            if (from.path === '/') {
                return next('/');
            } else {
                return next(false);
            }
        }
    },
    setup() {
        const goodsId = ref<number>(0);
        const goodsBasicInfo = ref<GoodsBasicInfo>();
        const totalStock = ref(500);
        const isSoldout = ref(false);            
        const installMentTitle = ref('');
        const raffleDetail = ref<RaffleDetail|null>(null);
        const countDownTimer = ref<null|NodeJS.Timeout>(null);
        const timerHtml = ref('');
        const statusHtml = computed(() => {
            if (raffleDetail.value == null) {
                return '';
            }

            if (raffleDetail.value.isStart === false) {
                return `<strong>Coming soon</strong>`;
            }

            if (raffleDetail.value.isEnd === false) {
                return `<span>${raffleDetail.value.participantCount}</span>명 참여중`;
            }

            return `<strong>${raffleDetail.value.participantCount}</strong>명 참여`;
        });
        const countDownFlag = ref(false);
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

        onMounted(() => {
            /**
             * 카운트 다운 처리를 위한 watch
             *
             * ex) 남은 시간이 0.5초 미만일 때,
             *   - 진행 예정 -> 진행중으로 전환 및 타이머 재시작
             *   - 진행중 -> 진행종료 전환 및 타이머 종료
             */
            watch(countDownFlag, () => {
                if (raffleDetail.value == null) {
                    return;
                }

                if (raffleDetail.value.isEnd) {
                    timerHtml.value = `00<span>:</span>00<span>:</span>00`;
                    return;
                }

                // 카운트 시작
                if (countDownTimer.value != null) {
                    clearInterval(countDownTimer.value);
                }
                const targetAt = moment(raffleDetail.value.isStart ? raffleDetail.value.endAt: raffleDetail.value.startAt).toString();
                countDownTimer.value = countdown(targetAt, 's', (ms, diff) => {
                    timerHtml.value =  `${padLeft(String(diff.hour), 2, '0')}
                        <span>:</span>${padLeft(String(diff.minute), 2, '0')}
                        <span>:</span>${padLeft(String(diff.second), 2, '0')}`;

                    // 남은 시간이 0.5초 미만일 경우..
                    if (ms > 500) {
                        return;
                    }

                    // 진행 예정 -> 진행중으로 정보 변경 및 타이머 재시작
                    if (raffleDetail.value?.isStart === false) {
                        raffleDetail.value.isStart = true;
                        countDownFlag.value = true;
                        return;
                    }

                    // 진행 종료 처리
                    if (raffleDetail.value?.isEnd === false) {
                        raffleDetail.value.isEnd = true;
                        timerHtml.value = `00<span>:</span>00<span>:</span>00`;
                        if (countDownTimer.value != null) {
                            clearInterval(countDownTimer.value);
                        }
                        return;
                    }
                }, true);
            }, {
                immediate: true
            });
        })

        onUnmounted(() => {
            if (countDownTimer.value !== null) {
                clearInterval(countDownTimer.value);
            }
        })

        return {
            goodsId,
            goodsBasicInfo,
            isSoldout,
            totalStock,
            goodsOptions,
            goodsPromotion,                                
            installMentTitle,
            timerHtml,
            raffleDetail,
            statusHtml
        }
    },
})
</script>