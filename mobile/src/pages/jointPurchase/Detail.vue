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
        :is-joint-purchase="true"
        :joint-purchase="jointPurchase"
    >
        <template #productInfoContents>
            <!-- (D) 공동구매 목표 달성 시 '.m...product-coopbuy' 영역에 'S=coopbuy-complete' 클래스를 추가하고, 목표 미달성 시 'S=coopbuy-fail' 클래스를 추가합니다 -->
            <div :class="['m...product-coopbuy', { 'S=coopbuy-complete' : jointPurchase.targetAchieveRate >= 100} , { 'S=coopbuy-fail' : jointPurchase.isEnd && jointPurchase.targetAchieveRate < 100 } ]">
                <!-- (D) 공동구매 목표 진행 시 노출합니다 -->
                <template v-if="!jointPurchase.isEnd">
                    <p class="mm_flex text_state">
                        <strong v-if="jointPurchase.targetAchieveRate >= 100">목표 달성</strong>
                        <strong v-else-if="!jointPurchase.isEnd">진행 중</strong>
                        <strong v-else>목표 미달성</strong>
                        <b v-html="timerHtml" />                                
                    </p>
                    <div class="m...product-coopbuy-progress">
                        <p class="text_goal">
                            목표까지<b><strong>{{ MMFilters.formatNumber(jointPurchase.participantCount) }}<sub>명</sub></strong>/ {{ MMFilters.formatNumber(jointPurchase.targetCount) }}명</b>
                        </p>
                        <b class="m...progress-bar"><i :style="`width:${jointPurchase.targetAchieveRate}%;`" :title="`${jointPurchase.targetAchieveRate}%`" /></b>
                    </div>
                </template>
                <template v-else>
                    <!-- (D) 공동구매 종료일 다음날 부터는 목표 달성 상태에 맞춰 '.text_state-off' 요소만 노출합니다. -->
                    <p class="text_state-off">
                        {{ jointPurchase.targetAchieveRate >= 100 ? '목표 달성' : '목표 미달성' }}<span>/</span>
                        <strong>{{ MMFilters.formatNumber(jointPurchase.participantCount) }}</strong>명 참여
                    </p>
                </template>
            </div>

            <MMLink class="btn_brand" :to="{ name: 'GoodsBrandIndex', params: { id: goodsBasicInfo.goods.brandId }}">
                <b>{{ goodsBasicInfo.goods.brandName }}</b>
                <i class="ico_link" />
            </MMLink>
            <p class="text_product">
                <span v-if="goodsBasicInfo.goods.headline !== null" class="text_foreword">[{{ goodsBasicInfo.goods.headline }}]</span>
                {{ goodsBasicInfo.goods.name }}
            </p>
            <p class="text_price">
                <span v-if="jointPurchase.saleRate > 0" class="text_sale">{{ jointPurchase.saleRate }}%</span>
                <strong>
                    {{ MMFilters.formatNumber(goodsPromotion.baseDiscountedPrice - jointPurchase.discountedPrice) }}
                </strong>
                <del v-if="jointPurchase.saleRate > 0">
                    {{ MMFilters.formatNumber(goodsPromotion.price) }}
                </del>
            </p>
        </template>
    </BaseDetail>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, defineAsyncComponent, onUnmounted } from 'vue';
import { GoodsBasicInfo, GoodsOptions, GoodsPricePromotion } from '$/@type/goods';
import { goodsRepository } from '$/repository/goodsRepository';
import { exhibitRepository } from '$/repository/exhibitRepository';
import { countdown, defaultCatch } from '$/functions';
import { jointPurchaseRepository } from '$/repository/jointPurchaseRepository';
import { padLeft, typeCastNumber } from '$/filters';
import { JointPurchaseDetail } from '$/@type/jointPurchase';
    
    declare module "@vue/runtime-core" { 
        interface ComponentCustomProperties {
            goodsBasicInfo: GoodsBasicInfo;
            goodsId: number;
            jointPurchase: JointPurchaseDetail;            
            installMentTitle: string;
            goodsOptions: GoodsOptions[];
            goodsPromotion: GoodsPricePromotion;
            totalStock: number;
            isSoldout: boolean;
        }
    }

export default defineComponent({
    components: {
        BaseDetail: defineAsyncComponent(() => import('@/pages/goods/BaseDetail.vue'))
    },
    async beforeRouteEnter (to, from, next) {
        try {
            const jointPurchaseId = typeCastNumber(to.params.id.toString());
            const jointPurchaseDetail = await jointPurchaseRepository.getDetail(jointPurchaseId);
            const goodsId = jointPurchaseDetail.goodsId;
            const basicInfo = await goodsRepository.detailBase(goodsId);
            const [options, pricePromotion, { stock, is_soldout }, installmentsBenefit ] = await Promise.all([
                goodsRepository.getOptions(goodsId),
                goodsRepository.promotionPrice(goodsId),
                goodsRepository.getStock(goodsId),
                exhibitRepository.cardBenefit()
            ])

            next((vm) => {
                vm.goodsId = goodsId;
                vm.jointPurchase = jointPurchaseDetail;
                vm.goodsBasicInfo = basicInfo;                    
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
                404: '진행중인 공동 구매가 아닙니다.',
                500: '공동구매 정보 조회에 실패하였습니다.'
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
        const jointPurchase = ref<JointPurchaseDetail>();        
        const day = ref('');
        const hour = ref('');
        const timerHtml = ref('');
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
        const countDownTimer = ref<null|NodeJS.Timeout>(null);

        onMounted(async () => {                
            if (jointPurchase.value !== undefined) {        
                goodsId.value = jointPurchase.value.goodsId;
                if (jointPurchase.value.isEnd) {
                    return timerHtml.value = `D<span>-</span>0<strong>00<span>:</span>00<span>:</span>00</strong>`;
                }

                countDownTimer.value = countdown(jointPurchase.value.endAt, 's', (ms, diff) => {
                    day.value = String(Math.floor(diff.hour / 24));
                    hour.value = String(diff.hour % 24);                    
                    timerHtml.value = `D<span>-</span>${day.value}<strong> ${padLeft(hour.value, 2, '0')}<span>:</span>${padLeft(`${diff.minute}`, 2, '0')}<span>:</span>${padLeft(`${diff.second}`, 2, '0')}</strong>`;
                }, true);
            }
        });

        onUnmounted(() => {
            if (countDownTimer.value !== null) {
                clearInterval(countDownTimer.value);
            }
        })

        // 주소 복사

        return {
            goodsId,
            jointPurchase,
            goodsBasicInfo,
            isSoldout,
            totalStock,
            goodsOptions,
            goodsPromotion,                                
            installMentTitle,
            timerHtml,
        }
    },
})
</script>