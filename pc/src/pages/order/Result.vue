<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->        
        <div
            v-if="isOrderSuccess"
            class="mm_inner m_order"
        >
            <section class="m_order-fin">
                <h2><b>주문이 완료되었습니다</b></h2>
                <p>주문번호: {{ orderId }}</p>
                <!-- (D) 결제방법을 '무통장 입금'으로 선택한 경우 .m_order-fin-deposit 요소를 노출합니다. -->
                <div
                    v-if="orderResult?.paymentInfo.engLabel === 'virtual_account'"
                    class="m_order-fin-deposit"
                >
                    <div class="m...deposit-inner">
                        <dl>
                            <dt>입금계좌</dt>
                            <dd>{{ orderResult?.paymentInfo.bankLabel }} {{ orderResult?.paymentInfo.bankAccountNumber }}</dd>
                        </dl>
                        <dl>
                            <dt>입금기한</dt>
                            <dd><strong class="mm_text-secondary">{{ MMFilters.formatDate(orderResult?.paymentInfo.bankInputExpireDate, 'YYYY-MM-DD 23:59:59') }}까지</strong></dd>
                        </dl>
                    </div>
                </div>
                <div class="mm_foot">
                    <div class="mm_btn_box T=equal">
                        <MMLink
                            class="mm_btn T=line T=dark"
                            :to="{ name: 'MypageOrder'}"
                            replace
                        >
                            <b>구매내역 보기</b>
                        </MMLink>
                        <MMLink
                            class="mm_btn T=primary"
                            :to="{ name: 'Main' }"
                            replace
                        >
                            <b>쇼핑 홈 가기</b>
                        </MMLink>
                    </div>
                </div>
            </section>
            <!-- 상품 정보 -->
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
                    <ul>
                        <template v-for="group, groupIndex in pack.groupItems" :key="groupIndex">
                            <li>
                                <div class="mm_flex">
                                    <div class="mm_product-item T=single">
                                        <router-link :to="{ name: 'GoodsDetail', params: { id: group.goodsId }}" replace>
                                            <figure>
                                                <div class="mm_image-scale">
                                                    <i
                                                        v-lazyload="{ src: group.goodsThumbnailUrl }"
                                                        class="mm_bg-cover image_product"
                                                    />
                                                </div>
                                                <figcaption>
                                                    <p class="text_brand">
                                                        {{ group.brandName }}
                                                    </p>
                                                    <p class="text_product">
                                                        {{ group.goodsName }}
                                                    </p>
                                                    <p class="text_option">
                                                        {{ group.optionName.replace('/', '') }} / {{ group.items.length }}개
                                                    </p>
                                                </figcaption>
                                            </figure>
                                        </router-link>
                                    </div>
                                    <p class="text_seller">
                                        <i class="ico_shop" />{{ group.sellerName }}
                                    </p>
                                    <div class="mm...order-price">
                                        <p class="text_price">
                                            <strong>{{ MMFilters.formatNumber(groupItemsSummary[packIndex][groupIndex].paidPrice) }}</strong>
                                        </p>
                                        <p class="text_point">
                                            사용 적립금
                                            <b>
                                                <strong>{{ MMFilters.formatNumber(groupItemsSummary[packIndex][groupIndex].usedPointAmount) }}</strong>
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
            <!--// 상품 정보 -->
            <!-- 사은품 정보 -->
            <div
                v-if="orderResult.giveaways.length > 0"
                class="m_order-gift"
            >
                <h4 class="mm_strapline T=line">
                    <b>사은품 정보</b>
                </h4>
                <div class="mm_gift-list">
                    <ul>
                        <li
                            v-for="giveaway in orderResult.giveaways"
                            :key="giveaway.id"
                        >
                            <div class="mm_gift-item">
                                <figure>
                                    <i
                                        v-lazyload="{ src: giveaway.imageUrl }"
                                        class="mm_bg-cover image_gift"
                                    />
                                    <figcaption>
                                        <p class="text_name">
                                            {{ giveaway.name }}
                                        </p>
                                        <p class="text_condition">
                                            {{ giveaway.conditionLabel }}
                                        </p>
                                    </figcaption>
                                </figure>
                                <a
                                    class="btn_gift-info"
                                    href="#"
                                    @click.prevent="giveAwayModalOpen(giveaway.id)"
                                ><b>지급대상확인</b><i class="ico_link T=sm" /></a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!--// 사은품 정보 -->


            <!-- 배송지 정보 -->
            <section class="mm_order-info">
                <h4 class="mm_strapline T=line">
                    <b>배송지 정보</b>
                </h4>
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
            </section>
            <!--// 배송지 정보 -->
            <div class="m_order-payment">
                <!-- 결제 정보 -->
                <section class="mm_order-info">
                    <h4 class="mm_strapline T=line">
                        <b>결제 정보</b>
                    </h4>
                    <table>
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <b>결제수단</b>
                                </th>
                                <td>{{ orderResult?.paymentInfo.label }}</td>
                            </tr>
                            <template v-if="orderResult?.paymentInfo.engLabel === 'credit_card'">
                                <tr>
                                    <th scope="row">
                                        <b>카드사</b>
                                    </th>
                                    <td>{{ orderResult?.paymentInfo.cardLabel }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>카드번호</b>
                                    </th>
                                    <td>{{ orderResult?.paymentInfo.cardMaskingNumber }}</td>
                                </tr>                               
                            </template>
                            <template v-if="orderResult?.paymentInfo.engLabel === 'virtual_account' || orderResult?.paymentInfo.engLabel === 'escrow'">
                                <tr>
                                    <th scope="row">
                                        <b>이체은행</b>
                                    </th>
                                    <td>{{ orderResult?.paymentInfo.bankLabel }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>예금주</b>
                                    </th>
                                    <td>{{ bankOwnerName }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>계좌번호</b>
                                    </th>
                                    <td>{{ orderResult?.paymentInfo.bankAccountNumber }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>입금기한</b>
                                    </th>
                                    <td>{{ MMFilters.formatDate(orderResult?.paymentInfo.bankInputExpireDate, 'YYYY-MM-DD 23:59:59') }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>입금액</b>
                                    </th>
                                    <td>{{ MMFilters.formatNumber(summaryPrice.paymentPrice) }}원</td>
                                </tr>
                            </template>
                            <tr v-if="orderResult?.paymentInfo.engLabel !== 'virtual_account' && orderResult?.paymentInfo.engLabel !== 'escrow'">
                                <th scope="row">
                                    <b>결제승인일</b>
                                </th>
                                <td>{{ MMFilters.formatDate(orderResult?.paymentInfo.approveAt, 'YYYY.MM.DD hh:mm:ss') }}</td>
                            </tr>
                            <tr v-if="isUser">
                                <th scope="row">
                                    <b>구매 적립</b>
                                </th>
                                <td>
                                    <p class="text_save">
                                        +{{ MMFilters.formatNumber(orderResult?.paymentInfo.buyPoint) }}원
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <!--// 결제 정보 -->

                <!-- 최종 결제금액 -->
                <section>
                    <h4 class="mm_strapline T=line">
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
                </section>
                <!--// 최종 결제금액 -->
            </div>
        </div>

        <div
            v-else
            class="mm_inner m_order"
        >
            <p class="mm_text-none">
                <i class="ico_text-none" />결제 승인에 실패했습니다<br> {{ failMessage }}
            </p>
            <div class="mm_btn_box T=equal">
                <a
                    class="mm_btn T=line T=dark"
                    href="#"
                    @click.prevent="reOrder"
                ><b>주문서로 가기</b></a>
                <MMLink
                    class="mm_btn T=primary"
                    :to="{ name: 'Main' }"
                >
                    <b>쇼핑 홈 가기</b>
                </MMLink>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { OrderResult, SummaryPrice } from '$/@type/order/order';
import { orderRepository } from '$/repository/order/orderRepository';
import { mmon } from '$/helper/mmon';
import { useOrderReceipted } from '$/composables/marketingComposable'
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useTempOrder, useOrderFinish } from '$/composables/orderComposable';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { shoppingRepository } from '$/repository/shoppingRepository';
import GiveawayDetail from '@/components/modal/order/GiveawayDetail.vue';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {        
		orderResult: OrderResult,
        summaryPrice: SummaryPrice
		isOrderSuccess: boolean,
        failMessage: string
    }
}
export default defineComponent({
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
        } catch (e) {
            next(async (vm) => {
                vm.isOrderSuccess = false;
                vm.failMessage = e.response.data.message;
            })
        }
        
    },
    setup() {
        const {
            route,
            router,
            isUser,
            usePageTitleSetting,
            globalConfigs 
        } = usePageContext();
        const bankOwnerName = computed(() => globalConfigs.value.shop.bankOwnerName)
        const { tempOrderOptions } = useTempOrder();
        usePageTitleSetting('주문완료', ['주문/결제']);
        
        const orderId = route.params.id.toString();
        const isOrderSuccess = ref(false);                
        const orderResult = ref<OrderResult|null>(null);

        watch(isOrderSuccess, () => {
            if (orderResult.value) {
                useOrderFinish(orderId, isOrderSuccess.value);
            }
        })

        const failMessage = ref('');
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
                            // group.goodsBaseDiscountedPrice - group.nightSaleAmount - group.registCouponAmount - group.immediatelySaleAmount
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

        function giveAwayModalOpen(giveAwayId: number) {
            useModal().open(GiveawayDetail, {
                title: '사은품 지급 대상',
                name: 'GiveAwayDetail',
                props: async() => {
                    const [ giveAway, giveAwayGoodsPaginator ] = await Promise.all([
                        shoppingRepository.getGiveawayDetail(giveAwayId),
                        shoppingRepository.getGiveawayOnGoods(
                            giveAwayId, 
                            1, 
                            5
                        )
                    ])

                    return {
                        giveAway,
                        giveAwayGoodsPaginator
                    }
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
                    orderId: orderId,
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
            reOrder,
            isUser,
            failMessage,
            isOrderSuccess,
            orderId,
            orderResult,            
            summaryPrice,            
            giveAwayModalOpen,
            groupItemsSummary,
            bankOwnerName
        }
    },
})
</script>
