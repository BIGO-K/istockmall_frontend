<template>
    <BaseDetail
        v-if="goodsBasicInfo"
        :goods-id="goodsId"
        :goods-basic-info="goodsBasicInfo" 
        :goods-promotion="goodsPromotion" 
        :goods-options="goodsOptions"
        :goods-main-thumbnail-image="goodsMainThumbnailImage" 
        :installment-title="installMentTitle" 
        :is-soldout="isSoldout"
        :total-stock="totalStock"                        
        :is-joint-purchase="true"
        :joint-purchase="jointPurchase"
    >
        <template #rightSideHeadContents>
            <div :class="['m_prodetail-head-coopbuy', { 'S=coopbuy-complete' : jointPurchase.targetAchieveRate >= 100} , { 'S=coopbuy-fail' : jointPurchase.isEnd && jointPurchase.targetAchieveRate < 100 } ]">
                <p class="text_state">
                    <strong v-if="jointPurchase.targetAchieveRate >= 100">공동구매 목표 달성</strong>
                    <strong v-else-if="!jointPurchase.isEnd">공동구매 진행 중</strong>
                    <strong v-else>공동구매 목표 미달성</strong>
                    <b v-html="timerHtml" />                                
                </p>

                <div class="m...coopbuy-progress">
                    <p class="text_goal">
                        목표까지<b><strong>{{ MMFilters.formatNumber(jointPurchase.participantCount) }}<sub>명</sub></strong>/ {{ MMFilters.formatNumber(jointPurchase.targetCount) }}명</b>
                    </p>
                    <b class="m...coopbuy-progress-bar"><i
                        :style="`width:${jointPurchase.targetAchieveRate}%;`"
                        :title="`${jointPurchase.targetAchieveRate}%`"
                    /></b>
                </div>
            </div>
            <div class="m_prodetail-head-product">
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
                <p class="text_price">
                    <strong
                        v-if="jointPurchase.saleRate > 0"
                        class="text_sale"
                    >{{ `${jointPurchase.saleRate}%` }}</strong>
                    <strong>{{ MMFilters.formatNumber(goodsPromotion.baseDiscountedPrice - jointPurchase.discountedPrice) }}</strong>
                    <del v-if="jointPurchase.saleRate > 0">{{ MMFilters.formatNumber(goodsPromotion.price) }}</del>
                </p>
            </div>
        </template>
        <template #jointPurchaseProcessInfo>
            <div class="m_prodetail-coopbuy-process">
                <h4><strong>공동구매</strong><b>진행 단계</b></h4>
                <ol>
                    <li>
                        <i class="ico_coopbuy-join" />
                        <dl>
                            <dt>참여</dt>
                            <dd>'공동구매 참여' 버튼을<br> 클릭합니다.</dd>
                        </dl>
                    </li>
                    <li>
                        <i class="ico_coopbuy-goal" />
                        <dl>
                            <dt>달성</dt>
                            <dd>설정된 목표 수를<br> 달성하면</dd>
                        </dl>
                    </li>
                    <li>
                        <i class="ico_coopbuy-coupon" />
                        <dl>
                            <dt>발급</dt>
                            <dd>할인쿠폰이 자동으로<br> 발급됩니다.</dd>
                        </dl>
                    </li>
                    <li>
                        <i class="ico_coopbuy-buy" />
                        <dl>
                            <dt>구매</dt>
                            <dd>공동구매가로 상품을<br> 구매할 수 있습니다.</dd>
                        </dl>
                    </li>
                </ol>
            </div>
        </template>
    </BaseDetail>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, defineAsyncComponent, onBeforeUnmount } from 'vue';
import { GoodsBasicInfo, GoodsOptions, GoodsPricePromotion } from '$/@type/goods';
import { goodsRepository } from '$/repository/goodsRepository';
import { exhibitRepository } from '$/repository/exhibitRepository';
import { countdown, defaultCatch } from '$/functions';
import { jointPurchaseRepository } from '$/repository/jointPurchaseRepository';
import { padLeft, typeCastNumber } from '$/filters';
import { JointPurchaseDetail } from '$/@type/jointPurchase';
import { mmon } from '$/helper/mmon';
    
    declare module "@vue/runtime-core" { 
        interface ComponentCustomProperties {
            goodsBasicInfo: GoodsBasicInfo;
            goodsId: number;
            jointPurchase: JointPurchaseDetail;
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
                vm.goodsMainThumbnailImage = basicInfo.goods.thumbnailUrl;
                vm.installMentTitle = installmentsBenefit === null ? '' : installmentsBenefit.title;       
                vm.goodsOptions = options;
                vm.goodsPromotion = pricePromotion
                vm.totalStock = stock;
                vm.isSoldout = is_soldout;
            });
        } catch(error) {
            if (error.response === undefined) {
                mmon.bom.alert('공동구매 상품이 진열 상태가 아닙니다.');
            } 
            else {
                defaultCatch(error, {
                    404: '진행중인 공동 구매가 아닙니다.',
                    500: '공동구매 정보 조회에 실패하였습니다.'
                });
            }            

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
        const goodsMainThumbnailImage = ref('');
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
                },
                true);
            }
        });

        onBeforeUnmount(() => {
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
            goodsMainThumbnailImage,
            installMentTitle,
            timerHtml,
        }
    },
})
</script>