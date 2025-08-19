<template>
    <div class="mm_page-content-body">
        <div class="m_mymain">
            <!-- 진행중인 주문 -->
            <section class="m_mymain-order">
                <h5 class="mm_strapline">
                    <b>진행중인 주문</b><small>최근 3주 기준</small>
                </h5>
                <!-- (D) 진행중인 주문건이 1건 이상인 경우 strong 태그에 mm_text-variable 클래스를 추가합니다. -->
                <div class="m_mymain-order-inner">
                    <ol>
                        <li>
                            <MMLink :to="{ name: 'MypageOrderList', query: { status_code: orderAggregates.payReady.statusCode } }">
                                <strong :class="{ 'mm_text-variable': orderAggregates.payReady.count > 0 }">{{ orderAggregates.payReady.count }}</strong>
                                <b>입금 대기</b>
                            </MMLink>
                        </li>
                        <li>
                            <MMLink :to="{ name: 'MypageOrderList', query: { status_code: orderAggregates.paid.statusCode }}">
                                <strong :class="{ 'mm_text-variable': orderAggregates.paid.count > 0 }">{{ orderAggregates.paid.count }}</strong>
                                <b>결제완료</b>
                            </MMLink>
                        </li>
                        <li>
                            <MMLink :to="{ name: 'MypageOrderList', query: { status_code: orderAggregates.deliveryReady.statusCode }}">
                                <strong :class="{ 'mm_text-variable': orderAggregates.deliveryReady.count > 0 }">{{ orderAggregates.deliveryReady.count }}</strong>
                                <b>배송준비</b>
                            </MMLink>
                        </li>
                        <li>
                            <MMLink :to="{ name: 'MypageOrderList', query: { status_code: orderAggregates.deliveryIng.statusCode }}">
                                <strong :class="{ 'mm_text-variable': orderAggregates.deliveryIng.count > 0 }">{{ orderAggregates.deliveryIng.count }}</strong>
                                <b>배송중</b>
                            </MMLink>
                        </li>
                        <li>
                            <MMLink :to="{ name: 'MypageOrderList', query: { status_code: orderAggregates.deliveryComplete.statusCode }}">
                                <strong :class="{ 'mm_text-variable': orderAggregates.deliveryComplete.count > 0 }">{{ orderAggregates.deliveryComplete.count }}</strong>
                                <b>배송완료</b>
                            </MMLink>
                        </li>
                        <li>
                            <MMLink :to="{ name: 'MypageOrderList', query: { status_code: orderAggregates.purchaseConfirmed.statusCode }}">
                                <strong :class="{ 'mm_text-variable': orderAggregates.purchaseConfirmed.count > 0 }">{{ orderAggregates.purchaseConfirmed.count }}</strong>
                                <b>구매확정</b>
                            </MMLink>
                        </li>
                    </ol>
                    <!-- (D) 취소, 반품, 교환이 1건 미만인 경우 <b> 태그, 1건 이상인 경우에는 <strong> 태그로 감싸줍니다. -->
                    <ul>
                        <li>
                            <MMLink :to="{ name: 'MypageOrderCancelList' }">
                                <b>취소</b>
                                <strong v-if="orderAggregates.cancelCount > 0">{{ orderAggregates.cancelCount }}</strong>
                                <b v-else>0</b>
                            </MMLink>
                        </li>
                        <li>
                            <MMLink :to="{ name: 'MypageOrderReturnList' }">
                                <b>반품</b>
                                <strong v-if="orderAggregates.returnCount > 0">{{ orderAggregates.returnCount }}</strong>
                                <b v-else>0</b>
                            </MMLink>
                        </li>
                        <li>
                            <MMLink :to="{ name: 'MypageOrderExchangeList' }">
                                <b>교환</b>
                                <strong v-if="orderAggregates.exchangeCount > 0">{{ orderAggregates.exchangeCount }}</strong>
                                <b v-else>0</b>
                            </MMLink>
                        </li>
                    </ul>
                </div>
            </section>
            <!--// 진행중인 주문 -->

            <!-- 최근 본 상품 -->
            <section class="m_mymain-list">
                <h5 class="mm_strapline">
                    <b>최근 본 상품</b><strong class="mm_text-variable">{{ recentViewGoods.length }}</strong>
                </h5>
                <div class="mm_product-list">
                    <p
                        v-if="recentViewGoods.length <= 0"
                        class="mm_text-none T=sm"
                    >
                        <i class="ico_text-none" />최근 본 상품이 없습니다
                    </p>
                    <ul v-else>
                        <li
                            v-for="(goods, index) in recentViewGoods.slice(0,5)"
                            :key="goods.id"
                        >
                            <div class="mm_product-item">
                                <MMLink
                                    :to="
                                        (index + 1) >= 5 && recentViewGoods.length > 5 
                                            ? { name: 'MypageRecentView' } 
                                            : { name: 'GoodsDetail', params: { id: goods.id }}"
                                >
                                    <figure>
                                        <div class="mm_image-scale">
                                            <i
                                                v-lazyload="goods.thumbnailUrl"
                                                class="mm_bg-cover image_product"
                                            />
                                        </div>
                                        <figcaption class="mm_ir-blind">
                                            <p class="text_brand">
                                                {{ goods.brandName }}
                                            </p>
                                            <p class="text_product">
                                                {{ goods.name }}
                                            </p>
                                        </figcaption>
                                    </figure>
                                    <b v-if="(index + 1) >= 5 && recentViewGoods.length > 5">더보기</b>
                                </MMLink>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
            <!--// 최근 본 상품 -->

            <!-- 최근 본 기획전 -->
            <section class="m_mymain-event">
                <h5 class="mm_strapline">
                    <b>최근 본 기획전</b><strong class="mm_text-variable">{{ recentViewPlannings.length }}</strong>
                </h5>
                <p
                    v-if="recentViewPlannings.length < 1"
                    class="mm_text-none T=sm"
                >
                    <i class="ico_text-none" />최근 본 기획전이 없습니다
                </p>
                <div
                    v-else
                    class="mm_list"
                >
                    <ul>
                        <li
                            v-for="planning in recentViewPlannings.slice(0,4)"
                            :key="planning.id"
                        >
                            <MMLink :to="{ name: 'PlanningDetail', params: { id: planning.id } }">
                                <b
                                    v-if="planning.isEnded"
                                    class="mm_tag T=round T=gray"
                                >종료</b>
                                <b
                                    v-else
                                    class="mm_tag T=round T=primary"
                                >진행중</b>
                                <b>{{ planning.title }}</b>
                            </MMLink>
                        </li>
                    </ul>
                </div>
                <MMLink
                    :to="{ name: 'MypageRecentView' }"
                    class="btn_more"
                >
                    <b>더보기</b><i class="ico_more" />
                </MMLink>
            </section>
            <!--// 최근 본 기획전 -->

            <!-- 찜한 아이템 -->
            <section class="m_mymain-list">
                <h5 class="mm_strapline">
                    <b>찜한 아이템</b><strong class="mm_text-variable">{{ wishGoods.total }}</strong>
                </h5>
                <div class="mm_product-list">
                    <p
                        v-if="wishGoods.total <= 0"
                        class="mm_text-none T=sm"
                    >
                        <i class="ico_text-none" />찜한 아이템이 없습니다
                    </p>
                    <ul v-else>
                        <li
                            v-for="(goods, index) in wishGoods.data"
                            :key="goods.id"
                        >
                            <div class="mm_product-item">
                                <MMLink
                                    :to="
                                        (index + 1) >= 5 && wishGoods.total > 5 
                                            ? { name: 'MypageWishGoods' } 
                                            : { name: 'GoodsDetail', params: { id: goods.id }}
                                    "
                                >
                                    <figure>
                                        <div class="mm_image-scale">
                                            <i
                                                v-lazyload="goods.thumbnailUrl"
                                                class="mm_bg-cover image_product"
                                            />
                                        </div>
                                        <figcaption class="mm_ir-blind">
                                            <p class="text_brand">
                                                {{ goods.brandName }}
                                            </p>
                                            <p class="text_product">
                                                {{ goods.name }}
                                            </p>
                                        </figcaption>
                                    </figure>
                                    <b v-if="(index + 1) >= 5 && wishGoods.total > 5">더보기</b>
                                </MMLink>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>
            <!--// 찜한 아이템 -->

            <!-- 찜한 브랜드 -->
            <section class="m_mymain-brand">
                <h5 class="mm_strapline">
                    <b>찜한 브랜드</b><strong class="mm_text-variable">{{ wishBrands.total }}</strong>
                </h5>
                <p
                    v-if="wishBrands.total <= 0"
                    class="mm_text-none T=sm"
                >
                    <i class="ico_text-none" />찜한 브랜드가 없습니다
                </p>
                <ul v-else>
                    <li
                        v-for="brand in wishBrands.data"
                        :key="brand.id"
                    >
                        <MMLink :to="{ name: 'GoodsBrandIndex', params: { id : brand.id }}">
                            <i
                                v-lazyload="{ src: brand.logoImageUrl, isRatio: true, useErrorImage: false }"
                                class="mm_bg-contain image_logo"
                                :title="brand.name"
                            />
                        </MMLink>
                    </li>
                </ul>
                <MMLink
                    :to="{ name: 'MypageWishBrands' }"
                    class="btn_more"
                >
                    <b>더보기</b><i class="ico_more" />
                </MMLink>
            </section>
            <!--// 찜한 브랜드 -->
        </div>
    </div>  
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { OrderAggregates } from '$/@type/member/aggregates';
import { Paginator } from '$/@type';
import { WishGoods } from '$/@type/member/wish';
import { RecentViewPlanning } from '$/@type/member/recentViews';
import { WishBrand } from '$/@type/member/wish';
import { wishRepository } from '$/repository/member/wishRepository';
import { memberAggregateRepository } from '$/repository/member/aggregateRepository';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useRecentViewGoods } from '$/composables/shoppingComposable';

usePageTitleSetting('마이페이지');
const orderAggregates = ref<OrderAggregates>({
    payReady: {
        count: 0,
        statusCode: 0
    },           // 입금대기
    paid: {
        count: 0,
        statusCode: 0
    },               // 결제완료
    deliveryReady: {
        count: 0,
        statusCode: 0
    },      // 배송준비
    deliveryIng: {
        count: 0,
        statusCode: 0
    },        // 배송중
    deliveryComplete: {
        count: 0,
        statusCode: 0
    },   // 배송완료
    purchaseConfirmed: {
        count: 0,
        statusCode: 0
    },    // 구매확정
    cancelCount: 0,             // 취소
    returnCount: 0,             // 반품
    exchangeCount: 0,           // 교환
    refundCount: 0              // 환불
});

// 찜한 상품/기획전
const wishGoods = ref<Paginator<WishGoods>>({
    total: 0,
    perPage: 0,
    currentPage: 0,
    data: []
});
const wishBrands = ref<Paginator<WishBrand>>({
    total: 0,
    perPage: 0,
    currentPage: 0,
    data: []
});


// 최근 본 상품/기획전
const { recentViewGoods } = useRecentViewGoods();
const recentViewPlannings = ref<RecentViewPlanning[]>([]);

onMounted(async () => {
    mmon.loading.show();
    await Promise.all([
        fetchOrderAggregates(),
        fetchWishGoods(),
        fetchWishBrands(),
        fetchRecentViewPlannings(),
    ])
    mmon.loading.hide();
});

// 주문집계 조회
async function fetchOrderAggregates() {
    try {
        orderAggregates.value = await memberAggregateRepository.getOrderInfo();
    } catch (e) {
        console.log(e);
    }
}

// 찜한상품 조회
async function fetchWishGoods() {
    try {
        wishGoods.value = await wishRepository.getWishGoods(1, undefined, 5);
    } catch (e) {
        console.log(e);
    }
}

// 찜한브랜드 조회
async function fetchWishBrands() {
    try {
        wishBrands.value = await wishRepository.getBrands(1, 6);
    } catch (e) {
        console.log(e);
    }
}

// 최근 본 기획전 조회
async function fetchRecentViewPlannings() {
    try {
        recentViewPlannings.value = await shoppingRepository.getRecentViewPlannings();
    } catch (e) {
        console.log(e);
    }
}
</script>


