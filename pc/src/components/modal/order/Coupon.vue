<template>
    <div class="m...coupon-product-list">
        <div class="mm_scroller">
            <ul
                v-for="pack, packIndex in orderPacks"
                :key="pack.shippingRuleId"       
            >
                <li 
                    v-for="goods, index in pack.orderGoods" 
                    :key="goods.goodsId"
                >
                    <div class="mm_flex">
                        <div
                            v-if="orderPacksAppliedCouponWithImmediatelySale"
                            class="mm_product-item T=single T=sm"
                        >
                            <a>
                                <figure>
                                    <div class="mm_image-scale">
                                        <i
                                            v-lazyload="{ src : goods.goodsThumbnailUrl }"
                                            class="mm_bg-cover image_product"
                                        />
                                    </div>
                                    <figcaption>
                                        <p class="text_brand">
                                            {{ goods.brandName }}
                                        </p>
                                        <p class="text_product">
                                            {{ goods.goodsName }}
                                        </p>
                                        <p class="text_option">
                                            {{ goods.optionName.replace('/', '') }} / 1개
                                        </p>
                                        <p class="text_price">
                                            <strong>
                                                {{ MMFilters.formatNumber(
                                                    goods.goodsBaseDiscountedPrice 
                                                        + goods.optionExtraAmount
                                                        - goods.nightSaleAmount 
                                                        - orderPacksAppliedCouponWithImmediatelySale[packIndex].items[index].tempCouponAmount 
                                                        - orderPacksAppliedCouponWithImmediatelySale[packIndex].items[index].immediatelySaleAmount
                                                ) 
                                                }}
                                            </strong>
                                        </p>
                                    </figcaption>
                                </figure>
                            </a>
                        </div>
                        <MMSelect
                            v-model="goods.tempCouponId"
                            class="T=short"
                            @change="couponValidate(goods.tempCouponId, goods.sequence)"
                        >
                            <option value="0">
                                쿠폰을 선택하세요
                            </option>
                            <option
                                v-for="coupon in goods.usableCouponRegists"
                                :key="coupon.registId"
                                :value="coupon.registId"
                                :disabled="checkedCouponUsed(coupon.registId, goods.uuid)"
                            >
                                ~[{{ MMFilters.formatDate(`${coupon.coupon.expireAt}`, 'YYYY/MM/DD') }}]
                                {{ coupon.coupon.title }}
                            </option>                                    
                        </MMSelect>                               
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div class="mm_foot">
        <div class="mm_btn_box T=equal">
            <button
                type="button"
                class="mm_btn T=primary"
                @click="applyCoupon"
            >
                <b>적용하기</b>
            </button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { toRefs, computed, ref } from 'vue'
import MMSelect from '@/components/input/Select.vue';
import {  Pack, GroupOrders, OrderGoods, AppliedSalePacks, OrderSheetAppliedCouponRegist } from '$/@type/order/order';
import { orderRepository } from '$/repository/order/orderRepository';
import { ModalCloseHandler } from '$/@type/Modal';
import { useCalculateDiscountAmount } from '$/composables/order/useCalculateDiscoutAmount';

const props = defineProps<{
    orderPacks: Pack[],
    appliedCouponRegist: OrderSheetAppliedCouponRegist
    closer: ModalCloseHandler<OrderSheetAppliedCouponRegist>,
}>();

/** VARIABLE */
const { orderPacks } = toRefs(props);
const orderPacksAppliedCouponWithImmediatelySale = ref<AppliedSalePacks[]>([]);

const flatItems = computed(() => orderPacks.value.flatMap((item) => item.orderGoods))

function checkedCouponUsed(couponId: number, uuid: string) {
    return usedCoupons.value.find((usedCoupon) =>  usedCoupon.uuid !== uuid && usedCoupon.registId == couponId) 
        ? true 
        : false;
}

const usedCoupons = computed(() => {
    return flatItems.value.filter((item) => item.tempCouponId).map((orderGoods) => {
        return {
            registId: orderGoods.tempCouponId,
            uuid: orderGoods.uuid
        }
    })    
});

        
orderPacksAppliedCouponWithImmediatelySale.value = orderPacks.value.map((pack) => {
    const items = pack.orderGoods.map((item) => {
        item.tempCouponId = item.registCouponId;
        const appliedCouponAmountPrice = computed<number>(() => {
            if (item.tempCouponId == 0 || item.tempCouponId == null || item.tempCouponId == undefined ) {
                return 0;
            }
            const appliedCoupon = item.usableCouponRegists.find((usable) => {
                return usable.registId == item.tempCouponId;
            });

            if (appliedCoupon) {
                const beforeCouponPrice = item.goodsBaseDiscountedPrice
                    + item.optionExtraAmount
                    - item.nightSaleAmount;                        
            
                return useCalculateDiscountAmount(beforeCouponPrice, appliedCoupon.coupon);
            }

            return 0;                                                        
        });
                    
        return {
            brandId: item.brandId,
            goodsId: item.goodsId,   
            optionId: item.optionId,
            optionExtraAmount: item.optionExtraAmount,
            nightSaleId: item.nightSaleId,
            goodsListPrice: item.goodsListPrice,
            goodsBaseDiscountedPrice: item.goodsBaseDiscountedPrice,
            nightSaleAmount: item.nightSaleAmount,                           
            immediatelySaleId: item.immediatelySaleId,
            tempCouponAmount : appliedCouponAmountPrice,
            tempCouponId: computed<number>(() => {
                return item.tempCouponId
            }),
            immediatelySaleAmount: computed<number>(() => {
                let immediatelySale = 0;
                const baseDiscounted = item.goodsBaseDiscountedPrice + item.optionExtraAmount - item.nightSaleAmount - appliedCouponAmountPrice.value
                if (item.appliableImmediatelySale) {
                    immediatelySale = useCalculateDiscountAmount(baseDiscounted, item.appliableImmediatelySale)                            
                }
                return immediatelySale;
            }),
        }
    })
                
    const group: GroupOrders[] = Object.values(orderRepository.groupingPackItemsByOptionId(items, 'optionId'));

    return {
        chargedShippingPrice: pack.chargedShippingPrice,
        extraShippingPrice: pack.extraShippingPrice,
        shippingRuleId: pack.shippingRuleId,
        items: items,
        group: group.map((groupItem) => {
            return {
                couponCount: computed<number>(() => {
                    return groupItem.items.reduce((accumulator, currentValue) => {
                        return accumulator + (currentValue.tempCouponAmount.value > 0 ? 1 : 0)
                    }, 0);
                }),
                appliedAllDiscountPrice: computed<number>(() => {
                    return groupItem.items.reduce((accumulator, currentValue) => {
                        return accumulator + 
                            (
                                currentValue.goodsBaseDiscountedPrice 
                                - (currentValue.nightSaleAmount + currentValue.tempCouponAmount.value + currentValue.immediatelySaleAmount.value)
                            );
                    }, 0);
                }),
            }
        })
    }
});

/** FUNCTION */
function couponValidate(registCouponId: number, sequence: number) {                       
    if (registCouponId == 0) {
        return;
    }
    
    orderPacks.value.find(function (pack) {   
        return pack.groupOrders.find(function (groupOrder) {
            return groupOrder.items.find(function (item) {
                if (item.tempCouponId == registCouponId && sequence != item.sequence) {
                    item.tempCouponId = 0;
                }                        
            })
        })
    });
}

function applyCoupon() {
    const applyForm = { ...props.appliedCouponRegist }

    orderPacks.value.forEach((pack: Pack) => {
        pack.orderGoods.forEach((orderGoods: OrderGoods) => {
            if (orderGoods.tempCouponId) {
                const usedCoupon = orderGoods.usableCouponRegists.find(coupon => coupon.registId == orderGoods.tempCouponId);
                applyForm[orderGoods.uuid] = usedCoupon;
            }
            orderGoods.registCouponId = orderGoods.tempCouponId;
        });
    })

    props.closer(applyForm);
}
/** VUE LIFE CYCLE */


</script>
