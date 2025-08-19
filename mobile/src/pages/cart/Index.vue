<template>
    <div :class="['mm_view', $route.meta.layouts]" :style="{ backgroundColor: 'white' }">
        <MMHeader :hide-r-side="true">
            <template #baseHeaderTitle>
                <h1><b>장바구니</b></h1>
            </template>
        </MMHeader>
        <div id="mm_body" class="mm_page">
            <template v-if="cartList.length > 0">
                <PullToRefresh />
                <div class="mm_scroller">
                    <div class="mm_page-inner">
                        <!-- 본문 -->
                        <div class="mm_page-content">
                            <div class="m_cart">
                                <!-- 장바구니 품목 -->
                                <div class="mm_order-item">
                                    <label class="mm_form-check">
                                        <input type="checkbox" :checked="maxCheckedCount !== 0 && maxCheckedCount === checkedCartIds.length" @change="appliedAllCart">
                                        <b class="mm_block">
                                            <i class="ico_form-check" />
                                            <span class="text_label">선택상품(<span>{{ checkedCartIds.length }}</span>)</span>
                                        </b>
                                    </label>
                                    <button type="button" class="btn_remove" @click="removeSelectedCartItems">
                                        <i class="ico_remove-trash" /><b>선택삭제</b>
                                    </button>
                                    <div v-for="pack, packIndex in cartList" :key="packIndex" class="mm_order-item-seller">
                                        <div class="mm_order...seller-head">
                                            <p class="text_ship">
                                                <i class="ico_ship" />
                                                <span v-if="packsPrice[packIndex].shippingPrice < 1">무료배송</span>
                                                <span v-else class="text_price"><strong>{{ MMFilters.formatNumber(packsPrice[packIndex].shippingPrice) }}</strong></span>
                                            </p>
                                        </div>
                                        <div class="mm_product-list T=sm">
                                            <ul>
                                                <li v-for="item in pack.items" :key="item.cartId">
                                                    <label class="mm_form-check">
                                                        <input v-model="checkedCartIds" type="checkbox" :value="item.cartId" data-check="{ '_group': 'dev_check-product' }" @change="validateStock(item)">
                                                        <b class="mm_block">
                                                            <i class="ico_form-check" />
                                                            <span class="mm_ir-blind text_label">상품 선택</span>
                                                        </b>
                                                    </label>
                                                    <p class="text_seller">
                                                        <i class="ico_shop" />{{ item.sellerName }}
                                                    </p>
                                                    <div class="mm_product-item">
                                                        <MMLink :to="{name: 'GoodsDetail', params: { id: item.goodsId}}">
                                                            <figure>
                                                                <i v-lazyload="{ src: item.goodsThumbnailUrl }" class="mm_bg-cover image_product" />
                                                                <p v-if="item.isSoldout" class="text_soldout">
                                                                    품절
                                                                </p>
                                                                <figcaption>
                                                                    <p class="text_brand">
                                                                        {{ item.brandName }}
                                                                    </p>
                                                                    <p class="text_product">
                                                                        <span v-if="item.goodsHeadline !== null" class="text_foreword">[{{ item.goodsHeadline }}]</span>
                                                                        {{ item.goodsName }}
                                                                    </p>
                                                                    <p class="text_price">
                                                                        <strong>{{ MMFilters.formatNumber(isUser ? item.goodsBaseDiscountedPrice : item.goodsSellPrice) }}</strong>
                                                                    </p>
                                                                    <p v-if="item.optionStock < 1" class="text_option S=option-soldout">
                                                                        {{ item.optionName.replace('/', '') }}/ {{ item.ea }}개<br>선택한 옵션이 품절되었습니다
                                                                    </p>
                                                                    <p
                                                                        v-else-if="item.ea > item.optionStock"
                                                                        class="text_option S=option-soldout"
                                                                    >
                                                                        {{ item.optionName.replace('/', '') }}/ {{ item.ea }}개<br>수량을 확인 해주세요
                                                                    </p>
                                                                    <p v-else class="text_option">
                                                                        {{ item.optionName.replace('/', '') }}/ {{ item.ea }}개
                                                                    </p>

                                                                    <!-- <p class="text_option">{{ item.optionName.replace('/', '') }} / {{ item.ea }}개</p> -->
                                                                </figcaption>
                                                            </figure>
                                                        </MMLink>
                                                        
                                                        <div :class="['mm_product-item-footer', { 'S=switch-on': currentCartId === item.cartId }]">
                                                            <div class="mm_btn_box">
                                                                <div class="mm_flex T=equal">
                                                                    <button
                                                                        type="button"
                                                                        :class="['btn_like', { 'S=switch-on' : likedGoodsIds.includes(item.goodsId) }]"                                                                         
                                                                        @click="toggleWished(item.goodsId)"
                                                                    >
                                                                        <i class="ico_like" />
                                                                        <b class="mm_ir-blind">찜한 아이템에 추가하기</b>
                                                                    </button>
                                                                    <template v-if="item.isSoldout">
                                                                        <p class="text_cart-soldout">
                                                                            상품이 품절되었어요
                                                                        </p>
                                                                    </template>
                                                                    <template v-else>
                                                                        <button 
                                                                            type="button" 
                                                                            class="mm_btn T=sm T=line btn_option-change" 
                                                                            @click="optionLayerOpen(item)"
                                                                        >
                                                                            <b>옵션/수량 변경</b><i class="ico_toggle" />
                                                                        </button>
                                                                        <button type="button" class="mm_btn T=sm T=line T=primary" @click="buy(item)">
                                                                            <b>바로구매</b>
                                                                        </button>
                                                                    </template>
                                                                </div>
                                                            </div>
                                                            <div :class="['m_cart-option', { 'S=option-soldout' : item.optionStock < 1 } ]">
                                                                <!-- <a class="btn_size" href="#SIZE_GUIDE_IMAGES" @click="setSellerId(item.sellerId)">
                                                                    <i class="ico_size" /><b>사이즈 가이드</b>
                                                                </a> -->
                                                                <MmOptions
                                                                    v-if="currentCartId === item.cartId"
                                                                    :options="currentGoodsOptions" 
                                                                    :goods-price="item.goodsBaseDiscountedPrice"
                                                                    :selected-item="item"  
                                                                    @close="currentCartId = 0"                               
                                                                    @re-fetch="fetchCarts(); currentCartId = 0"
                                                                />                                                        
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button type="button" class="btn_remove" @click="removeCartItems([item.cartId])">
                                                        <i class="ico_remove" /><b class="mm_ir-blind">상품 삭제</b>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                        <p class="text_purchase-price">
                                            {{ MMFilters.formatNumber(packsPrice[packIndex].goodsPrice - packsPrice[packIndex].memberDiscountedPrice) }}원 
                                            + 배송비{{ MMFilters.formatNumber(packsPrice[packIndex].goodsPrice > 0 ? packsPrice[packIndex].shippingPrice : 0) }}원                                        
                                            = <strong>{{ MMFilters.formatNumber(packsPrice[packIndex].goodsPrice - packsPrice[packIndex].memberDiscountedPrice + (packsPrice[packIndex].goodsPrice > 0 ? packsPrice[packIndex].shippingPrice : 0)) }}</strong>원
                                            <template v-if="pack.conditionalFreeFrom > 0">
                                                <br>{{ MMFilters.formatNumber(pack.conditionalFreeFrom) }}원 이상 무료배송 {{ pack.isChargeOnEach ? '(개별부과)' : '' }}
                                            </template>
                                        </p>
                                    </div>
                                </div>
                                <!--// 장바구니 품목 -->
                                <hr class="mm_line">
                                <!-- 결제금액 -->
                                <div class="mm_cost">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th scope="row">
                                                    <b>총 상품금액</b>
                                                </th>
                                                <td>
                                                    <p class="text_price">
                                                        <strong>{{ MMFilters.formatNumber(allPacksPriceSummary.goodsPrice) }}</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>배송비</b>
                                                </th>
                                                <td>
                                                    <p class="text_price">
                                                        + <strong>{{ MMFilters.formatNumber(allPacksPriceSummary.shippingPrice) }}</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">
                                                    <b>회원할인</b>
                                                </th>
                                                <td>
                                                    <p class="text_price">
                                                        - <strong>{{ MMFilters.formatNumber(allPacksPriceSummary.memberDiscountedPrice) }}</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th scope="row">
                                                    <b>최종 결제금액</b>
                                                </th>
                                                <td>
                                                    <p class="text_price mm_text-variable">
                                                        <strong>{{ MMFilters.formatNumber(allPacksPriceSummary.goodsPrice - allPacksPriceSummary.memberDiscountedPrice + allPacksPriceSummary.shippingPrice) }}</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <!--// 결제금액 -->

                                <!-- 추가할인 안내문구 -->
                                <div class="m_cart-popover">
                                    <p><strong>추가할인</strong>은 주문 시 적용됩니다</p>
                                    <button 
                                        type="button" 
                                        class="btn_close" 
                                        onclick="this.closest('.m_cart-popover').classList.add('S=popover-hide');"
                                    >
                                        <i class="ico_popover-close" />
                                        <b class="mm_ir-blind">닫기</b>
                                    </button>
                                </div>
                                <!--// 추가할인 안내문구 -->
                            </div>
                        </div>
                        <!--// 본문 -->
                    </div>
                </div>
                <!-- 하단고정버튼 -->
                <div class="mm_btn_box T=fixed">
                    <button type="button" class="mm_flex T=auto btn_order" @click="buyCheckedAllCart">
                        <b class="text_total">총 <strong>{{ checkedCartIds.length }}</strong>개</b>
                        <b class="text_order">
                            <strong>
                                {{ MMFilters.formatNumber
                                    (
                                        allPacksPriceSummary.goodsPrice 
                                            - allPacksPriceSummary.memberDiscountedPrice 
                                            + allPacksPriceSummary.shippingPrice
                                    ) 
                                }}
                            </strong>원 주문하기
                        </b>
                    </button>
                </div>
            </template>
            <template v-else>
                <div class="mm_scroller">
                    <div class="mm_page-inner">
                        <!-- 본문 -->
                        <div class="mm_page-content">
                            <div class="m_cart">
                                <p class="mm_text-none">
                                    <i class="ico_text-none" />장바구니에 담긴 상품이 없습니다.<br> 원하는 상품을 장바구니에 담아보세요!
                                </p>
                                <div class="mm_btn_box">
                                    <div class="mm_inline">
                                        <button type="button" class="mm_btn T=primary" @click="$router.push({ name : 'Main'})">
                                            <b>쇼핑하러 가기</b>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--// 본문 -->
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { defaultCatch } from '$/functions';
import { computed, defineComponent, ref, onMounted } from 'vue';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { Cart, CartPack } from '$/@type/shopping';
import { mmon } from '$/helper/mmon';
import { orderRepository } from '$/repository/order/orderRepository';
import { useRouter } from 'vue-router';
import { GoodsOptions } from '$/@type/goods';
import { goodsRepository } from '$/repository/goodsRepository';
import MmOptions from '@/pages/cart/Option.vue';
import MMLink from '@/components/MMLink.vue';
import { wishRepository } from '$/repository/member/wishRepository';
import PullToRefresh from '@/components/PullToRefresh.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useLikedGoods, useSellerSizeChart, useWishedGoods } from "$/composables/shoppingComposable";
import { useUserState } from '$/composables/auth/userComposable';
import { useTempOrder } from '$/composables/orderComposable';
import { useViewCart } from '$/composables/marketingComposable';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        cartList: Cart[];
        appliedAllCart: () => void;
    }
}
export default defineComponent({
    components: {
        MmOptions,
        MMLink,
        PullToRefresh,
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const cartData = await shoppingRepository.getCartList();    
            next(async (vm) => {
                vm.cartList = cartData.cartList;
                vm.appliedAllCart();
                shoppingRepository.getRelationLikedGoods(cartData.fetchLikedGoodsIdList);
            })
        } catch (e) {
            next();
        }
    },
    setup() {
        const router = useRouter();
        usePageTitleSetting('장바구니');

        const cartList = ref<Cart[]>([]);
        const { likedGoodsIds } = useLikedGoods([]);
        // 회원 관련
        const { user, isUser } = useUserState();
        const { setSellerId } = useSellerSizeChart();

        const maxCheckedCount = computed<number>(() => {
            const cartItemsCount = ref(0);
            cartList.value.forEach((cart) => {
                const items = cart.items.filter((item) => {    
                    if (!item.isSoldout && item.optionStock > 0) {
                        return item;
                    }
                })
                cartItemsCount.value += items.length;
            });
            return cartItemsCount.value;
        })
        const currentGoodsOptions = ref<GoodsOptions[]>([]);
        const currentCartId = ref(0);
        /**
         * 카트 데이터 조회 함수
         */
        async function fetchCarts() {             
            const fetchResult = await shoppingRepository.getCartList();        
            cartList.value = fetchResult.cartList;
            if (fetchResult.fetchLikedGoodsIdList.length > 1)  {
                shoppingRepository.getRelationLikedGoods(fetchResult.fetchLikedGoodsIdList);
            }
        }

        /**
         * 선택 가능한 카트 아이디 조회 
         */
        const availableCartIds = computed(() => {
            const cartIds = ref<number[]>([]);
            cartList.value.forEach((cart) => {
                cart.items.filter((item) => {                    
                    if (!item.isSoldout && item.optionStock > 0 && item.goodsStock > 0) {
                        return cartIds.value.push(item.cartId);
                    }
                });
            })

            return cartIds.value;
        })
        /**
         * 전체 상품 선택처리
         */
        async function appliedAllCart() {            
            // 선택된 항목 초기화 
            if (checkedCartIds.value.length === maxCheckedCount.value) {
                return checkedCartIds.value = [];
            }
            return checkedCartIds.value = availableCartIds.value;
        }

        /**
         * 선택된 카트 아이디 항목들
         */
        const checkedCartIds = ref<number[]>([]);
		
        /**
         * 가격 계산 처리 
         */
        const packsPrice = computed(() => {
            return cartList.value.map((cart) => {     
                const goodsPrice = computed(() => {
                    return cart.items.reduce((accumulator, currentValue) => {
                        if (checkedCartIds.value.includes(currentValue.cartId)) {
                            return accumulator + (currentValue.goodsSellPrice * currentValue.ea)
                        }
                        return accumulator
                    }, 0);
                })

                const memberDiscountedPrice = computed(() => {
                    if (isUser.value === false) {
                        return 0;
                    }
                    return cart.items.reduce((accumulator, currentValue) => {
                        if (checkedCartIds.value.includes(currentValue.cartId)) {
                            return accumulator + ((currentValue.goodsSellPrice - currentValue.goodsBaseDiscountedPrice ) * currentValue.ea)
                        }
                        return accumulator
                    }, 0);
                })
                
                const shippingPrice = computed<number>(() => {
                    if (cart.shippingPricePolicy == 0) {
                        return 0;
                    } 
                    if (cart.shippingPricePolicy == 1) {
                        return cart.shippingPrice;
                    }
                    if (cart.isChargeOnEach) {
                        return cart.conditionalFreeFrom > (goodsPrice.value / cart.items[0].ea) 
                            ? (cart.shippingPrice * cart.items[0].ea) 
                            : 0   
                    }
                    return cart.conditionalFreeFrom > goodsPrice.value ? cart.shippingPrice : 0
                });

                return {
                    goodsPrice: goodsPrice.value,
                    memberDiscountedPrice: memberDiscountedPrice.value,
                    shippingPrice: shippingPrice.value
                }
            })
        });   
        
        const allPacksPriceSummary = computed(() => {
            return {
                goodsPrice: packsPrice.value.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.goodsPrice
                }, 0),
                memberDiscountedPrice: packsPrice.value.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.memberDiscountedPrice
                }, 0),
                shippingPrice: packsPrice.value.reduce((accumulator, currentValue) => {
                    return accumulator + (currentValue.goodsPrice > 0 ? currentValue.shippingPrice : 0)
                }, 0),
            }
        });

        /**
         * 카트 아이템 삭제처리 
         * @param {number[]} cartIds : 카트 아이템 ID 배열 
         */
        async function removeCartItems(cartIds: number[]) {
            if (cartIds.length < 1) {
                return mmon.bom.alert('삭제 항목이 없습니다');
            }
            mmon.bom.confirm('선택한 상품을 삭제하시겠습니까?', async(flag: boolean) => {
                if (flag) {
                    mmon.loading.show();
                    try {
                        await shoppingRepository.removeCartItems(cartIds);
                        await fetchCarts();
                        // 장바구니 총 선택상품 개수 수정
                        checkedCartIds.value = checkedCartIds.value.filter(id => !cartIds.includes(id));
                        return mmon.bom.alert('삭제 되었습니다');
                    } catch (e) {
                        defaultCatch(e);
                    } finally {
                        mmon.loading.hide();
                    }
                }
            })
        }

        /**
         * 선택된 장바구니 구매 
         */
        async function buyCheckedAllCart() {
            const orderData: {
                option_id: number,
                ea: number
                cartId: number
            }[] = [];

            let errorMessage = '';

            cartList.value.forEach((cart) => {
                cart.items.filter((item) => {
                    if(checkedCartIds.value.includes(item.cartId)) {
                        if (item.optionStock < 1 || item.ea > item.optionStock) {
                            return errorMessage = '옵션 재고 수량이 부족합니다.';
                        }
                        return orderData.push({
                            option_id: item.optionId,
                            ea: item.ea,
                            cartId: item.cartId
                        })
                    }
                });
            });

            if (errorMessage !== '') {
                return mmon.bom.alert(errorMessage);
            }
            
            orderProcess(orderData);
        }

        const { setTempOrder } = useTempOrder();
        /**
         * 주문 프로세스 시작 
         * @param orderData 
         */
        async function orderProcess(orderData: {option_id: number, ea: number, cartId: number}[]) {
            if (orderData.length < 1) {
                return mmon.bom.alert('주문할 상품을 선택해주세요.');
            }

            if (!isUser.value) {
                setTempOrder(orderData);
                return mmon.bom.confirm('로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?', (flag: boolean) => {
                    if (flag) {
                        router.push({
                            name: 'Login',
                            query: {
                                redirect_to_after: 'order'
                            }
                        })
                    }
                });
            }

            if(user.value && user.value.isCertificated === false) {
                setTempOrder(orderData);
                return router.push({
                    name: "CertificationNeed",
                    query: {
                        redirect_to_after: "order",
                    },
                });
            }

            mmon.loading.show();

            try {
                const tempOrderId = await orderRepository.tempOrderMake(orderData);                
                router.push({
                    name: 'OrderIndex',
                    params : { 
                        id: tempOrderId
                    }
                })
            } catch (e) {
                console.log(e);
            } finally {
                mmon.loading.hide();
            }
        }

        /**
         * 옵션레이어 오픈 함수 
         * @param cartItem 
         */
        async function optionLayerOpen(cartItem: CartPack) {
            if (currentCartId.value === cartItem.cartId)  {
                return currentCartId.value = -1
            }
            // 햔제 
            currentGoodsOptions.value = await fetchOptions(cartItem.goodsId);
            currentCartId.value = cartItem.cartId;            
        }

        /**
         * 옵션 패치 함수 
         * @param goodsId 
         */
        async function fetchOptions(goodsId: number) {
            return await goodsRepository.getOptions(goodsId);            
        }

        /**
         * 카트 선택된 항목 삭제 처리
         */
        async function removeSelectedCartItems() {
            await removeCartItems(checkedCartIds.value);
        }

        /**
         * 카트 아이템 구매 처리 
         * @param {CartPack} item 
         */
        async function buy(item: CartPack) {
            const orderData  = [{
                option_id: item.optionId,
                ea: item.ea,             
                cartId: item.cartId   
            }];          
            
            if (item.optionStock < 1 || item.ea > item.optionStock) {
                return mmon.bom.alert('옵션 재고 수량이 부족합니다.')
            }
            
            orderProcess(orderData);
        }

        const { setWishedGoodsId } = useWishedGoods();
        /**
         * 좋아요 토글함수 
         */
        async function toggleWished(goodsId: number) {
            if (isUser.value === false) {
                return mmon.bom.confirm('로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?', (isOn: boolean) => {
                    if (isOn) {
                        router.push({
                            name: 'Login',
                            query: {
                                redirect_to_after: router.currentRoute.value.path                                
                            }
                        })               
                    }
                })    
            }

            if (!likedGoodsIds.value.includes(goodsId)) {
                setWishedGoodsId(goodsId);
                window.location.hash = '#WISHED_FOLDER';    
                return;
            } 

            // 좋아요 삭제 처리 
            await wishRepository.deleteWishGoods([goodsId]);
        }

        /**
         * 장바구니 선택시 재고 수량 체크
         */
        function validateStock(cartItem: CartPack) {
            if (cartItem.optionStock < 1) {
                checkedCartIds.value = checkedCartIds.value.filter((cartId) => {
                    return cartId !== cartItem.cartId;
                })
                return mmon.bom.alert('옵션 재고 수량이 부족합니다.');
            }
        }        

        onMounted(() => {
            useViewCart({
                account: 'base',
                isMobile: true,
                isTablet: false,
                isDesktop: false,
                cartItems: cartList.value
                    .map(c => c.items)
                    .flat()
                    .map(cartPack => {
                        return {
                            goodsId: cartPack.goodsId,
                            optionId: cartPack.optionId,
                            goodsName: cartPack.goodsName,
                            optionName: cartPack.optionName,
                            quantity: cartPack.ea,
                            price: cartPack.goodsSellPrice + cartPack.optionExtraAmount,
                            discountedPrice: cartPack.goodsSellPrice + cartPack.optionExtraAmount
                        }
                    })
            });
        })

        return {
            currentGoodsOptions,
            likedGoodsIds,
            fetchCarts,
            currentCartId,            
            fetchOptions,
            optionLayerOpen,
            removeCartItems,
            cartList,            
            appliedAllCart,
            isUser,            
            packsPrice,
            allPacksPriceSummary,
            checkedCartIds,
            buyCheckedAllCart,
            maxCheckedCount,
            removeSelectedCartItems,
            toggleWished,
            buy,
            validateStock,
            setSellerId
        }
    }
})
</script>