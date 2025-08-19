<template>
    <div class="mm_page-content">
        <div class="mm_inner m_cart">
            <h3 class="mm_title">
                <b>장바구니</b>
            </h3>
            <template v-if="cartList.length > 0">
                <!-- 상품 정보 -->
                <section>
                    <h4 class="mm_strapline T=line">
                        <b>상품 정보</b>
                    </h4>
                    <div class="mm_order-item">
                        <label class="mm_form-check">
                            <input
                                type="checkbox"
                                :checked="maxCheckedCount !== 0 && maxCheckedCount === checkedCartIds.length"
                                @change="appliedAllCart"
                            >
                            <b class="mm_block">
                                <i class="ico_form-check" />
                                <span class="text_label">선택상품<strong>{{ checkedCartIds.length }}</strong></span>
                            </b>
                        </label>
                        <button
                            type="button"
                            class="btn_delete"
                            @click="removeSelectedCartItems"
                        >
                            <i class="ico_delete" /><b>선택삭제</b>
                        </button>
                        <div
                            v-for="pack, packIndex in cartList"
                            :key="packIndex"
                            class="mm_order-item-seller"
                        > 
                            <div class="mm_order...seller-head">
                                <p class="text_ship">
                                    <i class="ico_ship" />
                                    <span v-if="packsPrice[packIndex].shippingPrice < 1">무료배송</span>
                                    <span
                                        v-else
                                        class="text_price"
                                    ><strong>{{ MMFilters.formatNumber(packsPrice[packIndex].shippingPrice) }}</strong></span>
                                </p>
                            </div>
                            <ul>
                                <li v-for="item in pack.items" :key="item.cartId">
                                    <div
                                        v-if="item.isSoldout"
                                        class="mm_flex"
                                    >
                                        <label class="mm_form-check">
                                            <input
                                                type="checkbox"
                                                disabled
                                                data-check="{ '_group': 'dev_check-product' }"
                                            >
                                            <b class="mm_block">
                                                <i class="ico_form-check" />
                                                <span class="mm_ir-blind text_label">상품 선택</span>
                                            </b>
                                        </label>
                                        <div class="mm_product-item T=single">
                                            <MMLink :to="{ name: 'GoodsDetail', params: { id: item.goodsId }}">
                                                <figure>
                                                    <div class="mm_image-scale">
                                                        <i
                                                            v-lazyload="{ src: item.goodsThumbnailUrl }"
                                                            class="mm_bg-cover image_product"
                                                        />
                                                    </div>
                                                    <p
                                                        v-if="item.isSoldout"
                                                        class="text_soldout"
                                                    >
                                                        SOLD OUT
                                                    </p>
                                                    <figcaption>
                                                        <p class="text_brand">
                                                            {{ item.brandName }}
                                                        </p>
                                                        <p class="text_product">
                                                            <span
                                                                v-if="item.goodsHeadline !== null"
                                                                class="text_foreword"
                                                            >[{{ item.goodsHeadline }}]</span>
                                                            {{ item.goodsName }}
                                                        </p>
                                                        <p class="text_option">
                                                            {{ item.optionName.replace('/', '') }}/ {{ item.ea }}개
                                                        </p>
                                                    </figcaption>
                                                </figure>
                                            </MMLink>
                                        </div>
                                        <button 
                                            type="button" 
                                            :class="['btn_like', {'S=switch-on' : false }]" 
                                            data-switch
                                        >
                                            <i class="ico_like" /><b class="mm_ir-blind">찜한 아이템에 추가하기</b>
                                        </button>
                                        <p class="text_seller">
                                            <i class="ico_shop" />{{ item.sellerName }}
                                        </p>
                                        <div class="m_cart-option" />
                                        <p class="text_price">
                                            <strong>{{ MMFilters.formatNumber(isUser ? item.goodsBaseDiscountedPrice : item.goodsSellPrice) }}</strong>
                                        </p>
                                        <div class="mm_btn_box">
                                            <button
                                                type="button"
                                                class="btn_delete"
                                                @click="removeCart([item.cartId])"
                                            >
                                                <i class="ico_delete" /><b>삭제</b>
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        v-else
                                        class="mm_flex"
                                    >
                                        <label class="mm_form-check">                                            
                                            <input
                                                v-model="checkedCartIds"
                                                :value="item.cartId"
                                                type="checkbox"
                                                data-check="{ '_group': 'dev_check-product' }"
                                                @change="validateStock(item)"
                                            >
                                            <b class="mm_block">
                                                <i class="ico_form-check" />
                                                <span class="mm_ir-blind text_label">상품 선택</span>
                                            </b>
                                        </label>
                                        <div class="mm_product-item T=single">
                                            <MMLink :to="{ name: 'GoodsDetail', params: { id: item.goodsId }}">
                                                <figure>
                                                    <div class="mm_image-scale">
                                                        <i
                                                            v-lazyload="{ 'src': item.goodsThumbnailUrl }"
                                                            class="mm_bg-cover image_product"
                                                        />
                                                    </div>
                                                    <p
                                                        v-if="item.goodsStock < 6"
                                                        class="text_product-status"
                                                    >
                                                        품절임박
                                                    </p>
                                                    <figcaption>
                                                        <p class="text_brand">
                                                            {{ item.brandName }}
                                                        </p>
                                                        <p class="text_product">
                                                            <span
                                                                v-if="item.goodsHeadline !== null"
                                                                class="text_foreword"
                                                            >[{{ item.goodsHeadline }}]</span>
                                                            {{ item.goodsName }}
                                                        </p>
                                                        <p
                                                            v-if="item.optionStock < 1"
                                                            class="text_option S=soldout"
                                                        >
                                                            {{ item.optionName.replace('/', '') }}/ {{ item.ea }}개<br>선택한 옵션이 품절되었습니다
                                                        </p>
                                                        <p
                                                            v-else-if="item.ea > item.optionStock"
                                                            class="text_option S=soldout"
                                                        >
                                                            {{ item.optionName.replace('/', '') }}/ {{ item.ea }}개<br>수량을 확인 해주세요
                                                        </p>
                                                        <p
                                                            v-else
                                                            class="text_option"
                                                        >
                                                            {{ item.optionName.replace('/', '') }}/ {{ item.ea }}개
                                                        </p>
                                                    </figcaption>
                                                </figure>
                                            </MMLink>
                                        </div>
                                        <button
                                            type="button"
                                            :class="['btn_like', { 'S=switch-on' : likedGoodsIds.includes(item.goodsId) }]" 
                                            data-switch 
                                            @click="toggleWished(item.goodsId)"
                                        >
                                            <i class="ico_like" /><b class="mm_ir-blind">찜한 아이템에 추가하기</b>
                                        </button>
                                        <p class="text_seller">
                                            <i class="ico_shop" />{{ item.sellerName }}
                                        </p>
                                        <div class="m_cart-option">
                                            <button 
                                                type="button"   
                                                class="mm_btn T=xs T=line btn_option-change" 
                                                @click="optionLayerOpen(item)"
                                            >
                                                <b>옵션/수량 변경</b><i class="ico_dropdown T=xs" />
                                            </button>
                                            <!-- 옵션 변경 레이어 -->
                                            <div :class="['mm_layer', { 'S=on' : currentCartId === item.cartId }]">
                                                <div class="mm_layer-head">
                                                    <h5 class="text_title">
                                                        <b>옵션 변경</b>
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        class="btn_layer-close"
                                                        @click="() => { currentCartId = 0 }"
                                                    >
                                                        <i class="ico_close" /><b class="mm_ir-blind">옵션 변경 닫기</b>
                                                    </button>
                                                </div>
                                                <div class="mm_layer-content">
                                                    <!-- <a 
                                                        class="btn_size" 
                                                        href="#"
                                                        @click.prevent="sellerSizeModalOpen(item.sellerId)"
                                                    >
                                                        <i class="ico_size" /><b>사이즈 가이드</b><i class="ico_link" />
                                                    </a> -->
                                                    <!-- 옵션 목록 -->                            
                                                    <MMOptions
                                                        v-if="currentCartId === item.cartId"
                                                        :options="currentGoodsOptions" 
                                                        :goods-price="item.goodsBaseDiscountedPrice"
                                                        :selected-item="item"                                 
                                                        @re-fetch="optionChanged();"
                                                    />                                               
                                                    <!--// 옵션 목록 -->                                                   
                                                </div>
                                            </div>
                                            <!--// 옵션 변경 레이어 -->
                                        </div>
                                        <p class="text_price">
                                            <strong>{{ MMFilters.formatNumber((isUser ? item.goodsBaseDiscountedPrice : item.goodsSellPrice) * item.ea) }}</strong>
                                        </p>
                                        <div class="mm_btn_box">
                                            <div class="mm_block">
                                                <button
                                                    type="button"
                                                    class="mm_btn T=sm T=primary"
                                                    @click="buy(item)"
                                                >
                                                    <b>바로구매</b>
                                                </button>
                                                <button
                                                    type="button"
                                                    class="btn_delete"
                                                    @click="removeCart([item.cartId])"
                                                >
                                                    <i class="ico_delete" /><b>삭제</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <!-- 셀러별 상품금액 합계 -->
                            <p class="text_total-price">
                                {{ MMFilters.formatNumber(packsPrice[packIndex].goodsPrice - packsPrice[packIndex].memberDiscountedPrice) }}원 + 배송비 {{ MMFilters.formatNumber(packsPrice[packIndex].goodsPrice > 0 ? packsPrice[packIndex].shippingPrice : 0) }}원 = 
                                <strong>{{ MMFilters.formatNumber(packsPrice[packIndex].goodsPrice - packsPrice[packIndex].memberDiscountedPrice + (packsPrice[packIndex].goodsPrice > 0 ? packsPrice[packIndex].shippingPrice : 0) ) }}</strong>원
                                <span v-if="pack.conditionalFreeFrom > 0">{{ MMFilters.formatNumber(pack.conditionalFreeFrom) }}원 이상 무료배송 {{ pack.isChargeOnEach ? '(개별부과)' : '' }}</span>
                            </p>
                            
                            <!--// 셀러별 상품금액 합계 -->
                        </div>                    
                    </div>
                </section>
                <!--// 상품 정보 -->

                <!-- 최종 결제금액 -->
                <section class="m_cart-total">
                    <h4 class="mm_strapline T=line">
                        <b>최종 결제금액</b>
                    </h4>
                    <div class="mm_flex T=auto m_cart-total-list">
                        <dl class="mm_flex">
                            <dt>총 상품금액</dt><dd>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(allPacksPriceSummary.goodsPrice) }}</strong>
                                </p>
                            </dd>
                        </dl>
                        <dl class="mm_flex">
                            <dt><i class="ico_total-plus" />배송비</dt><dd>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(allPacksPriceSummary.shippingPrice) }}</strong>
                                </p>
                            </dd>
                        </dl>
                        <dl class="mm_flex">
                            <dt><i class="ico_total-minus" />회원할인</dt><dd>
                                <p class="text_price">
                                    <strong>{{ MMFilters.formatNumber(allPacksPriceSummary.memberDiscountedPrice) }}</strong>
                                </p>
                            </dd>
                        </dl>
                        <dl class="mm_flex">
                            <dt><i class="ico_total-equal" />최종 결제금액</dt><dd>
                                <p class="text_price mm_text-variable">
                                    <strong>{{ MMFilters.formatNumber(allPacksPriceSummary.goodsPrice - allPacksPriceSummary.memberDiscountedPrice + allPacksPriceSummary.shippingPrice) }}</strong>
                                </p>
                            </dd>
                        </dl>
                    </div>
                </section>
                <!--// 최종 결제금액 -->

                <!-- 하단버튼 -->
                <div class="mm_foot">
                    <div :class="['m_cart-tooltip', { 'S=tooltip-hide': !tooltipShow }]">
                        <p><strong class="mm_text-secondary">추가할인</strong>은 주문 시 적용됩니다</p>
                        <button
                            type="button"
                            class="btn_close"
                            data-switch="{ '_isParent': true, '_classOn': 'S=tooltip-hide' }"
                            @click="() => { tooltipShow = false }"
                        >
                            <i class="ico_close" /><b class="mm_ir-blind">닫기</b>
                        </button>
                    </div>
                    <div class="mm_btn_box">
                        <button
                            type="button"
                            class="mm_btn T=lg T=primary btn_order"
                            @click="buyCheckedAllCart"
                        >
                            <b>총 <strong>{{ checkedCartIds.length }}</strong>개</b><b><strong>{{ MMFilters.formatNumber(allPacksPriceSummary.goodsPrice - allPacksPriceSummary.memberDiscountedPrice + allPacksPriceSummary.shippingPrice) }}</strong>원 주문하기</b><i class="ico_link T=xs" />
                        </button>
                    </div>
                </div>
                <!--// 하단버튼 -->                
            </template>
            <template v-else>
                <section>
                    <h4 class="mm_strapline T=line">
                        <b>상품 정보</b>
                    </h4>
                    <p class="mm_text-none">
                        <i class="ico_text-none" />장바구니에 담긴 상품이 없습니다.<br> 원하는 상품을 장바구니에 담아보세요!
                    </p>
                    <div class="mm_btn_box">
                        <MMLink
                            class="mm_btn T=primary"
                            :to="{ name: 'Main' }"
                        >
                            <b>쇼핑하러 가기</b>
                        </MMLink>                        
                    </div>
                </section>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { shoppingRepository } from '$/repository/shoppingRepository';
import { Cart, CartPack, LikedGoods } from '$/@type/shopping';
import { defineComponent, defineAsyncComponent, ref, computed, onMounted } from 'vue';
import { goodsRepository } from '$/repository/goodsRepository';
import { GoodsOptions } from '$/@type/goods';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { orderRepository } from '$/repository/order/orderRepository';
import { wishRepository } from '$/repository/member/wishRepository';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useViewCart } from '$/composables/marketingComposable'
import SellerSizeChart from '@/components/modal/SellerSizeChart.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { useGoodsWish } from '$/composables/goods/useGoodsWish';
import AddWished from '@/components/modal/goods/AddWished.vue';
import CertificateNeed from '@/components/modal/CertificateNeed.vue';
import { useTempOrder } from '$/composables/orderComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useLikedGoods } from '$/composables/shoppingComposable';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        cartList: Cart[];
        appliedAllCart: () => void;
        relationLiked: LikedGoods[];
    }
}
export default defineComponent({
    components : {                
        MMOptions: defineAsyncComponent(() => import("@/pages/cart/Options.vue")),
    },
    /**
     * 라우트 진입
     */
    async beforeRouteEnter(to, from, next) {
        const cartData = await shoppingRepository.getCartList();    
        next(async (vm) => {
            vm.cartList = cartData.cartList;
            await vm.appliedAllCart();
            await shoppingRepository.getRelationLikedGoods(cartData.fetchLikedGoodsIdList);
        })
    },

    setup() {
        usePageTitleSetting('장바구니');
        const { getFolders } = useGoodsWish();
        const { likedGoodsIds } = useLikedGoods([]);
        
        const cartList = ref<Cart[]>([]);
        const currentCartId = ref(0);
        const { router, user, isUser } = usePageContext();

        const tooltipShow = ref(true);
        
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

        const wishedGoodsModalShow = ref(false);
        
        const currentGoodsOptions = ref<GoodsOptions[]>([]);

        async function fetchOptions(goodsId: number) {
            return await goodsRepository.getOptions(goodsId);
        }

        /**
         * 옵션 레이어 여는 함수
         */
        async function optionLayerOpen(cartItem: CartPack) {
            currentGoodsOptions.value = await fetchOptions(cartItem.goodsId);
            currentCartId.value = cartItem.cartId;            
        }

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
         * 카트 데이터 조회 함수
         */
        async function fetchCarts() {                        
            const fetchResult = await shoppingRepository.getCartList();        
            cartList.value = fetchResult.cartList;
            await shoppingRepository.getRelationLikedGoods(fetchResult.fetchLikedGoodsIdList);
        }

        async function optionChanged() {
            const fetchResult = await shoppingRepository.getCartList();        
            cartList.value = fetchResult.cartList;
            currentCartId.value = 0
        }

        /**
         * 좋아요 토글함수 
         */
        async function toggleWished(goodsId: number) {
            if (!isUser.value) {
                return mmon.bom.confirm("로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?", (flag: boolean) => {
                    if (flag) {
                        router.push({
                            name: "Login",
                            query: {
                                redirect_to_after: router.currentRoute.value.path
                            },
                        });
                    }
                });
            }
            
            if (!likedGoodsIds.value.includes(goodsId)) {
                return useModal().open(AddWished, {
                    name: 'like',
                    title: '폴더 선택하기',        
                    props: async () => {
                        return {
                            goodsId: goodsId,
                            folders: await getFolders()
                        }
                    }
                })
            } else {
                await wishRepository.deleteWishGoods([goodsId]);
            }
        }
        
        /**
         * 선택된 카트 아이디 항목들
         */        
        const checkedCartIds = ref<number[]>([]);

        /**
         * 카트 선택된 항목 삭제 처리
         */
        async function removeSelectedCartItems() {
            await removeCart(checkedCartIds.value);
        }
        /**
         * 카트 삭제 처리 함수
         */
        async function removeCart(cartIds: number[]) {
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
         * 구매처리 함수
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

        const { setTempOrder } = useTempOrder();
        async function orderProcess(orderData: {option_id: number, ea: number, cartId: number}[]) {
            if (orderData.length < 1) {
                mmon.bom.alert('주문할 상품을 선택해주세요.');
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
                return useModal().open(CertificateNeed, {
                    title: '본인인증',
                    onClose: async() => {
                        orderProcess(orderData);
                    }
                })
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

        async function buyCheckedAllCart() {
            const orderData: {
                option_id: number,
                ea: number,
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

        function sellerSizeModalOpen(sellerId: number) {
            useModal().open(SellerSizeChart, {
                title: '사이즈 가이드',
                name: 'SellerSizeChart',
                itemClass: 'm_modal-size',
                props: async() => {
                    const sizeModelImageList = await shoppingRepository.sizeGuidImages(sellerId);
                    return {
                        sizeModelImageList
                    }
                }
            })
        }

        onMounted(()=> {
            shoppingRepository.cartCountSync();
            useViewCart({
                account: 'base',
                isMobile: false,
                isTablet: false,
                isDesktop: true,
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
                            discountedPrice: cartPack.goodsBaseDiscountedPrice + cartPack.optionExtraAmount,
                        }
                    })
            })
            
        })
        
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

        return {                     
            appliedAllCart,
            buy,
            buyCheckedAllCart,
            likedGoodsIds,
            maxCheckedCount,            
            allPacksPriceSummary,
            isUser,
            currentCartId,
            cartList,
            optionLayerOpen,
            currentGoodsOptions,            
            checkedCartIds,
            packsPrice,       
            removeCart,
            removeSelectedCartItems,
            fetchCarts,
            optionChanged,                        
            tooltipShow,
            wishedGoodsModalShow,
            toggleWished,            
            validateStock,
            sellerSizeModalOpen
        }
    },
})
</script>


