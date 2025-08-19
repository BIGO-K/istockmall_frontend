<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>주문완료</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div v-if="isOrderSuccess" class="mm_page-content">
                        <div class="m_popup-order-fin">
                            <div class="mm_inner">
                                <h3 class="mm_title">
                                    <b>주문이 완료되었습니다</b>
                                </h3>
                                <p>주문번호: {{ orderId }}</p>
                                <!-- (D) 결제방법이 무통장입금인 경우 'm...fin-deposit' 영역을 노출합니다 -->
                                <div v-if="orderResult?.paymentInfo.engLabel === 'virtual_account'" class="m...fin-deposit">
                                    <p class="text_deadline">
                                        입금기한: {{ MMFilters.formatDate(orderResult?.paymentInfo.bankInputExpireDate, 'YYYY-MM-DD') }}<span>23:59:59</span>까지
                                    </p>
                                    <p>입금계좌: {{ orderResult?.paymentInfo.bankLabel }} {{ orderResult?.paymentInfo.bankAccountNumber }}</p>
                                </div>
                                <div class="mm_btn_box">
                                    <div class="mm_flex T=equal">
                                        <MMLink class="mm_btn T=line T=dark" :to="{ name: 'MypageOrder'}" replace>
                                            <b>구매내역 보기</b>
                                        </MMLink>
                                        <MMLink class="mm_btn T=primary" :to="{ name: 'Main' }" replace>
                                            <b>쇼핑 홈 가기</b>
                                        </MMLink>
                                    </div>
                                </div>
                            </div>
                            <!-- 주문 상품 -->
                            <div class="mm_order-item">
                                <div 
                                    v-for="pack, packIndex in orderResult?.packs"
                                    :key="`${packIndex}_${pack.shippingPrice}`"
                                    class="mm_order-item-seller"
                                >
                                    <div class="mm_order...seller-head">
                                        <p class="text_ship">
                                            <i class="ico_ship" />
                                            <span v-if="pack.shippingPrice < 1">무료배송</span>
                                            <span v-else class="text_price"><strong>{{ MMFilters.formatNumber(pack.shippingPrice) }}</strong></span>
                                        </p>
                                    </div>
                                    <div class="mm_product-list T=sm">
                                        <ul>
                                            <template v-for="group,index in pack.groupItems" :key="group.goodsId">
                                                <li>
                                                    <p class="text_seller">
                                                        <i class="ico_shop" />{{ group.sellerName }}
                                                    </p>
                                                    <div class="mm_product-item">
                                                        <router-link :to="{ name: 'GoodsDetail', params: { id: group.goodsId }}" replace>
                                                            <figure>
                                                                <i v-lazyload="{ src: group.goodsThumbnailUrl }" class="mm_bg-cover image_product" />
                                                                <figcaption>
                                                                    <p class="text_brand">
                                                                        {{ group.brandName }}
                                                                    </p>
                                                                    <p class="text_product">
                                                                        {{ group.goodsName }}
                                                                    </p>
                                                                    <p class="text_price">
                                                                        <strong>{{ MMFilters.formatNumber(groupItemsSummary[packIndex][index].paidPrice) }}</strong>
                                                                    </p>
                                                                    <p class="text_option">
                                                                        {{ group.optionName.replace('/', '') }} / {{ group.items.length }}개
                                                                    </p>
                                                                </figcaption>
                                                            </figure>
                                                        </router-link>
                                                        <div class="mm_product-item-footer">
                                                            <p class="text_point">
                                                                사용 적립금
                                                                <b>
                                                                    <strong>{{ MMFilters.formatNumber(groupItemsSummary[packIndex][index].usedPointAmount) }}</strong>
                                                                    <sub>원</sub>
                                                                </b>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </template>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!--// 주문상품 -->
                            <hr class="mm_line">                            
                            <div class="mm_inner">
                                <!-- 사은품 정보 -->
                                <section v-if="orderResult.giveaways.length > 0">
                                    <h4 class="mm_strapline">
                                        <b>사은품 정보</b>
                                    </h4>
                                    <ul class="mm_gift-list">
                                        <li v-for="giveaway in orderResult.giveaways" :key="giveaway.id">
                                            <div class="mm_gift-item">
                                                <figure>
                                                    <i v-lazyload="{ src: giveaway.imageUrl }" class="mm_bg-cover image_gift" />
                                                    <figcaption>
                                                        <p class="text_name">
                                                            {{ giveaway.name }}
                                                        </p>
                                                        <p class="text_condition">
                                                            {{ giveaway.conditionLabel }}
                                                        </p>
                                                    </figcaption>
                                                </figure>
                                                <div class="mm_btn_box">
                                                    <div class="mm_rside">
                                                        <a class="btn_gift-info" href="#GIVE_AWAY_TARGET" @click="setGiveawayId(giveaway.id)"><b>지급대상확인</b><i class="ico_link T=xs" /></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </section>
                                <!--// 사은품 정보 -->
                                <!-- 배송지 정보 -->
                                <section>
                                    <h4 class="mm_strapline">
                                        <b>배송지 정보</b>
                                    </h4>
                                    <div class="mm_order-info">
                                        <table>
                                            <tbody>
                                                <tr v-if="isUser">
                                                    <th scope="row">
                                                        <b>배송지명</b>
                                                    </th>
                                                    <td>{{ orderResult?.receiveAddress.shippingName }}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>받는 사람</b>
                                                    </th>
                                                    <td>{{ orderResult?.receiveAddress.name }}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>휴대폰 번호</b>
                                                    </th>
                                                    <td>{{ orderResult?.receiveAddress.tel }}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>주소</b>
                                                    </th>
                                                    <td><span class="text_postcode">{{ orderResult?.receiveAddress.zipCode }}</span><b>{{ orderResult?.receiveAddress.baseAddress }}{{ orderResult?.receiveAddress.detailAddress }}</b></td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>배송메모</b>
                                                    </th>
                                                    <td>{{ orderResult?.receiveAddress.message }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                                <!--// 배송지 정보 -->

                                <!-- 최종 결제금액 -->
                                <section class="mm_costbox">
                                    <h4 class="mm_strapline">
                                        <b>최종 결제금액</b>
                                    </h4>
                                    <div class="mm_cost">
                                        <table>
                                            <tbody>
                                                <template v-if="isUser">
                                                    <tr>
                                                        <th scope="row">
                                                            <b>총 상품금액</b>
                                                        </th>
                                                        <td>
                                                            <p class="text_price">
                                                                <strong>{{ MMFilters.formatNumber(summaryPrice.totalGoodsPrice) }}</strong>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">
                                                            <b>배송비</b>
                                                        </th>
                                                        <td>
                                                            <p class="text_price">
                                                                + <strong>{{ MMFilters.formatNumber(summaryPrice.shippingPrice) }}</strong>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="summaryPrice.memberDiscountedPrice > 0">
                                                        <th scope="row">
                                                            <b>회원할인</b>
                                                        </th>
                                                        <td>
                                                            <p class="text_price">
                                                                - <strong>{{ MMFilters.formatNumber(summaryPrice.memberDiscountedPrice) }}</strong>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="summaryPrice.nightSaleAmount > 0">
                                                        <th scope="row">
                                                            <b>심야할인</b>
                                                        </th>
                                                        <td>
                                                            <p class="text_price">
                                                                - <strong>{{ MMFilters.formatNumber(summaryPrice.nightSaleAmount) }}</strong>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="summaryPrice.registCouponAmount > 0">
                                                        <th scope="row">
                                                            <b>쿠폰할인</b>
                                                        </th>
                                                        <td>
                                                            <p class="text_price">
                                                                - <strong>{{ MMFilters.formatNumber(summaryPrice.registCouponAmount) }}</strong>
                                                            </p>
                                                        </td>
                                                    </tr>   
                                                    <tr v-if="summaryPrice.immediatelySaleAmount > 0">
                                                        <th scope="row">
                                                            <b>즉시할인</b>
                                                        </th>
                                                        <td>
                                                            <p class="text_price">
                                                                - <strong>{{ MMFilters.formatNumber(summaryPrice.immediatelySaleAmount) }}</strong>
                                                            </p>
                                                        </td>
                                                    </tr>                                                 
                                                    <tr v-if="summaryPrice.usedPointAmount > 0">
                                                        <th scope="row">
                                                            <b>적립금 사용</b>
                                                        </th>
                                                        <td>
                                                            <p class="text_point">
                                                                - <strong>{{ MMFilters.formatNumber(summaryPrice.usedPointAmount) }}</strong>
                                                                <sub>원</sub>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </template>
                                                <template v-else>
                                                    <tr>
                                                        <th scope="row">
                                                            <b>총 상품금액</b>
                                                        </th>
                                                        <td>
                                                            <p class="text_price">
                                                                <strong>{{ MMFilters.formatNumber(summaryPrice.totalGoodsPrice) }}</strong>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">
                                                            <b>배송비</b>
                                                        </th>
                                                        <td>
                                                            <p class="text_price">
                                                                + <strong>{{ MMFilters.formatNumber(summaryPrice.shippingPrice) }}</strong>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </template>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th scope="row">
                                                        <b>최종 결제금액</b>
                                                    </th>
                                                    <td>
                                                        <p class="text_price mm_text-variable">
                                                            <strong>{{ MMFilters.formatNumber(summaryPrice.paymentPrice) }}</strong>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div class="mm_costbox-unit">
                                        <p>결제수단: {{ orderResult?.paymentInfo.label }}</p>
                                        <template v-if="orderResult?.paymentInfo.engLabel === 'credit_card'">
                                            <p>카드사: {{ orderResult?.paymentInfo.cardLabel }}</p>
                                            <p>카드번호: {{ orderResult?.paymentInfo.cardMaskingNumber }}</p>
                                        </template>
                                        <template v-if="orderResult?.paymentInfo.engLabel === 'virtual_account' || orderResult?.paymentInfo.engLabel === 'escrow'">
                                            <p>이체은행: {{ orderResult?.paymentInfo.bankLabel }}</p>
                                            <p>예금주: {{ bankOwnerName }}</p>
                                            <p>계좌번호: {{ orderResult?.paymentInfo.bankAccountNumber }}</p>
                                            <p>입금기한: {{ MMFilters.formatDate(orderResult?.paymentInfo.bankInputExpireDate, 'YYYY-MM-DD 23:59:59') }}</p>
                                            <p>입금액: {{ MMFilters.formatNumber(summaryPrice.paymentPrice) }}원</p>
                                        </template>
                                        <p v-if="orderResult?.paymentInfo.engLabel !== 'virtual_account' && orderResult?.paymentInfo.engLabel !== 'escrow'">
                                            결제승인일:{{ MMFilters.formatDate(orderResult?.paymentInfo.approveAt, 'YYYY.MM.DD') }}<span class="text_time">{{ MMFilters.formatDate(orderResult?.paymentInfo.approveAt, 'hh:mm:ss') }}</span>
                                        </p>
                                    </div>
                                </section>
                                <!--// 최종 결제금액 -->
                            </div>
                        </div>
                    </div>

                    <div v-else class="mm_page-content">
                        <div class="m_popup-order-fin">
                            <div class="mm_inner">
                                <p class="mm_text-none">
                                    <i class="ico_text-none" />결제 승인에 실패했습니다<br>{{ failMessage }}
                                </p>
                                <div class="mm_btn_box">
                                    <div class="mm_flex T=equal">
                                        <button class="mm_btn T=line T=dark" @click.prevent="reOrder">
                                            <b>주문서로 가기</b>
                                        </button>
                                        <MMLink class="mm_btn T=primary" :to="{ name: 'Main' }">
                                            <b>쇼핑 홈 가기</b>
                                        </MMLink>                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch, onMounted } from 'vue';
import MMPopup from '@/components/layout/Popup.vue';
import { orderRepository } from '$/repository/order/orderRepository';
import { OrderResult, SummaryPrice } from '$/@type/order/order';
import { mmon } from '$/helper/mmon';
import { useGiveawayTargetModal, useOrderFinish, useTempOrder } from '$/composables/orderComposable';
import { useOrderReceipted } from '$/composables/marketingComposable'
import { usePageContext } from '$/composables/pageHandler/contextComposable';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
		orderResult: OrderResult,
        summaryPrice: SummaryPrice
		isOrderSuccess: boolean
        failMessage: string
    }
}
export default defineComponent({
    components: {
        MMPopup
    },    
    /**
     * 라우트 진입
     */
    async beforeRouteEnter(to, from, next) {
        try {
            const orderResult = await orderRepository.result(to.params.id.toString());            
            next(async (vm) => {
                vm.isOrderSuccess = true;
                vm.orderResult = orderResult;
            })
        } catch (error) {
            next(async (vm) => {
                vm.isOrderSuccess = false;
                vm.failMessage = error.response.data.message;
            })
        }
        
    },
    props: {
        id: {
            type: String,
            required: true            
        },
    },
    setup(props) {
        const { id : orderId } = toRefs(props);
        const { setGiveawayId } = useGiveawayTargetModal();
        const { tempOrderOptions } = useTempOrder();
        // 회원 관련
        const {
            isUser,
            router,
            globalConfigs,
            usePageTitleSetting
        } = usePageContext();
        const bankOwnerName = computed(() => globalConfigs.value.shop.bankOwnerName)
        usePageTitleSetting('주문완료', ['주문/결제']);
        const isOrderSuccess = ref(false);
        const failMessage = ref('');
        const orderResult = ref<OrderResult|null>(null);

        watch(isOrderSuccess, () => {
            if (orderResult.value) {
                useOrderFinish(orderId.value, isOrderSuccess.value);
            }
        })

        const summaryPrice = computed(() => {
            if (orderResult.value === null) {
                return {
                    totalGoodsPrice: 0,
                    memberDiscountedPrice:0,
                    registCouponAmount: 0,
                    nightSaleAmount: 0,
                    immediatelySaleAmount: 0,
                    usedPointAmount: 0,
                    shippingPrice:0,
                    paymentPrice: 0
                };
            }

            const total = orderResult.value.packs.map((pack) => {
                return {
                    goodsPrice: pack.items.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.goodsSellPrice;
                    }, 0),
                    memberDiscountedPrice: pack.items.reduce((accumulator, currentValue) => {
                        return accumulator + (currentValue.goodsSellPrice - currentValue.goodsBaseDiscountedPrice);
                    }, 0),
                    nightSaleAmount: pack.items.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.nightSaleAmount;
                    }, 0),
                    registCouponAmount: pack.items.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.registCouponAmount;
                    }, 0),
                    immediatelySaleAmount: pack.items.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.immediatelySaleAmount;
                    }, 0),
                    usedPointAmount: pack.items.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.usedPointAmount;
                    }, 0)                    
                }            
            });

            const totalGoodsPrice = total.reduce((acc, cur) => {
                return acc + cur.goodsPrice
            }, 0);
            const memberDiscountedPrice = total.reduce((acc, cur) => {
                return acc + cur.memberDiscountedPrice
            }, 0);
            const shippingPrice = orderResult.value.packs.reduce((acc, cur) => {
                return acc + cur.shippingPrice
            }, 0);
            const nightSaleAmount = total.reduce((acc, cur) => {
                return acc + cur.nightSaleAmount
            }, 0);
            const registCouponAmount = total.reduce((acc, cur) => {
                return acc + cur.registCouponAmount
            }, 0);
            const immediatelySaleAmount = total.reduce((acc, cur) => {
                return acc + cur.immediatelySaleAmount
            }, 0);

            const usedPointAmount = total.reduce((acc, cur) => {
                return acc + cur.usedPointAmount
            }, 0);

            return {
                totalGoodsPrice,
                memberDiscountedPrice,
                shippingPrice,
                nightSaleAmount,
                registCouponAmount,
                immediatelySaleAmount,
                usedPointAmount,
                paymentPrice: totalGoodsPrice - memberDiscountedPrice + shippingPrice - nightSaleAmount - registCouponAmount - immediatelySaleAmount - usedPointAmount
            }
        })

        const groupItemsSummary = computed<{
            usedPointAmount: number;
            paidPrice: number;
        }[][]>(() => {
            if (orderResult.value === null) {
                return [];
            }

            return orderResult.value.packs.map((pack) => {
                return pack.groupItems.map((group) => {
                    return {
                        usedPointAmount : group.items.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.usedPointAmount;
                        }, 0),
                        paidPrice: group.items.reduce((acc, cur) => {
                            return acc + (cur.goodsBaseDiscountedPrice - cur.nightSaleAmount - cur.registCouponAmount - cur.immediatelySaleAmount)
                        }, 0)
                    }
                });

                
            })
        })


        async function reOrder() {            
            if (tempOrderOptions.value.length  < 1 ) {
                return mmon.bom.alert('주문정보가 없습니다.\n 메인으로 이동됩니다', () => {
                    router.replace({
                        name: 'Main'                        
                    })
                });
            }
            const tempOrderId = await orderRepository.tempOrderMake(tempOrderOptions.value);
            const routerName = isUser.value ? 'OrderIndex' : 'GuestOrderIndex';
            router.replace({
                name: routerName,
                params : { 
                    id: tempOrderId
                }
            })            
        }

        onMounted(() => {
            // 마케팅         
            if (isOrderSuccess.value && orderResult.value) {
                useOrderReceipted({
                    account: 'base',
                    isMobile: true,
                    isTablet: false,
                    isDesktop: false,
                    orderId: orderId.value,
                    paymentPrice: summaryPrice.value.paymentPrice,
                    orderedItems: orderResult.value.packs
                        .map(p => p.groupItems)
                        .flat()
                        .map(groupPack => {
                            return {
                                goodsId: groupPack.goodsId,
                                optionId: groupPack.optionId,
                                goodsName: groupPack.goodsName,
                                optionName: groupPack.optionName,
                                quantity: groupPack.items.length,
                                price: groupPack.goodsSellPrice + groupPack.optionExtraAmount,
                                paidPrice: groupPack.goodsSellPrice + groupPack.optionExtraAmount,
                            }
                        })
                })
            }
        })

        return {
            orderId,
            summaryPrice,
            orderResult,
            isUser,
            reOrder,
            isOrderSuccess,
            failMessage,
            setGiveawayId,
            groupItemsSummary,
            bankOwnerName
        }
    }
})
</script>
