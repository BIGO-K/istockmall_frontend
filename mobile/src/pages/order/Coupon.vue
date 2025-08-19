<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>쿠폰 적용</b></h1>
        </template>
        <template #contents>
            <div v-if="isLoad" class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-order-coupon">
                            <div class="mm_order-item">
                                <!-- <h5><i class="ico_shop" /><b>{{ pack.sellerName }}</b></h5> -->
                                <div class="mm_product-list T=sm">
                                    <ul v-for="pack, packIndex in orderPacks" :key="pack.shippingRuleId">
                                        <li v-for="goods, index in pack.orderGoods" :key="`${goods.goodsId}_${index}`">
                                            <div v-if="appliedCouponWithImmediatelySalePacks[packIndex]" class="mm_product-item">
                                                <a>
                                                    <figure>
                                                        <i v-lazyload="{ src: goods.goodsThumbnailUrl }" class="mm_bg-cover image_product" />
                                                        <figcaption>
                                                            <p class="text_brand">{{ goods.brandName }}</p>
                                                            <p class="text_product">{{ goods.goodsName }}</p>
                                                            <p class="text_price"><strong>{{ MMFilters.formatNumber(
                                                                goods.goodsBaseDiscountedPrice 
                                                                    - goods.nightSaleAmount 
                                                                    - appliedCouponWithImmediatelySalePacks[packIndex].items[index].tempCouponAmount
                                                                    - appliedCouponWithImmediatelySalePacks[packIndex].items[index].immediatelySaleAmount                                                                        
                                                            ) }}</strong></p>
                                                            <p class="text_option">{{ goods.optionName.replace('/', '') }} / 1개</p>
                                                        </figcaption>
                                                    </figure>
                                                </a>
                                                <div class="mm_product-item-footer">
                                                    <MMSelect
                                                        v-model="goods.tempCouponId" 
                                                        class="T=sm" 
                                                        @change="couponValidate(goods.tempCouponId, goods.sequence)"
                                                    >
                                                        <option value="0">
                                                            쿠폰을 선택하세요
                                                        </option>
                                                        <option
                                                            v-for="coupon in goods.usableCouponRegists"
                                                            :key="coupon.registId"
                                                            :value="coupon.registId"
                                                            :disabled="checkedCouponUsed(coupon.registId, goods.sequence)"
                                                        >
                                                            ~[{{ MMFilters.formatDate(coupon.coupon.expireAt, 'YYYY/MM/DD') }}]
                                                            {{ coupon.coupon.title }}
                                                        </option>                                    
                                                    </MMSelect>   
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="mm_foot">
                                    <div class="mm_inner">
                                        <div class="mm_btn_box">
                                            <button type="button" class="mm_btn T=primary" @click="applyCoupon">
                                                <b>적용하기</b>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { AppliedSalePacks, GroupOrders, OrderGoods, Pack } from '$/@type/order/order';
import MMSelect from '@/components/input/Select.vue';
import { useOrderCoupon } from '$/composables/orderComposable';
import { useRouter } from 'vue-router';
import { orderRepository } from '$/repository/order/orderRepository';
import { useCalculateDiscountAmount } from '$/composables/order/useCalculateDiscoutAmount';

const router = useRouter();
const orderPacks = ref<Pack[]>([]);
const isLoad = ref(false);
const appliedCouponWithImmediatelySalePacks = ref<AppliedSalePacks[]>([]);
const flatItems = computed(() => orderPacks.value.flatMap((item) => item.orderGoods))

function checkedCouponUsed(couponId: number, sequence: number) {
    return usedCoupons.value.find((usedCoupon) =>  usedCoupon.sequence !== sequence && usedCoupon.registId == couponId) 
        ? true 
        : false;
}

const usedCoupons = computed(() => {
    return flatItems.value.filter((item) => item.tempCouponId).map(coupon => {
        return {
            registId: coupon.tempCouponId,
            sequence: coupon.sequence
        }
    })
});
       
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
const { orderPacks: pack, setUsedCoupon, appliedCouponRegist } = useOrderCoupon()
onMounted(async() => {
    orderPacks.value = [];
    orderPacks.value = pack.value;
    appliedCouponWithImmediatelySalePacks.value = orderPacks.value.map((pack) => {
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
                    const baseDiscounted = item.goodsBaseDiscountedPrice - item.nightSaleAmount - appliedCouponAmountPrice.value
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

    isLoad.value = true;
})

function applyCoupon() {
    const applyForm = { ...appliedCouponRegist.value };

    orderPacks.value.forEach((pack: Pack) => {
        pack.orderGoods.forEach((orderGoods: OrderGoods) => {
            if (orderGoods.tempCouponId) {
                const usedCoupon = orderGoods.usableCouponRegists.find(coupon => coupon.registId == orderGoods.tempCouponId);
                applyForm[orderGoods.uuid] = usedCoupon;
            }
            orderGoods.registCouponId = orderGoods.tempCouponId;
        });
    })
    setUsedCoupon(applyForm);
    
    router.go(-1);
}
</script>
