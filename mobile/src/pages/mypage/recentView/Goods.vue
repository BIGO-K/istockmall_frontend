<template>
    <p v-if="recentViewGoods.length < 1" class="mm_text-none">
        <i class="ico_text-none" />최근 본 상품이 없습니다
    </p>
    <template v-else>
        <p class="m_myrecent-note">
            * 2주 후 자동 삭제
        </p>
        <div class="mm_product-list T=sm">
            <ul>
                <li v-for="goods in recentViewGoods" :key="goods.id">
                    <div class="mm_product-item">
                        <MMLink :to="{ name: 'GoodsDetail', params: { id: goods.id }}">
                            <figure>
                                <i v-lazyload="{ src: goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                <figcaption>
                                    <p class="text_brand">
                                        {{ goods.brandName }}
                                    </p>
                                    <p class="text_product">
                                        {{ goods.name }}
                                    </p>
                                    <p class="text_price">
                                        <strong>{{ MMFilters.formatNumber(goods.baseDiscountedPrice) }}</strong>
                                    </p>
                                </figcaption>
                            </figure>
                        </MMLink>
                    </div>
                </li>
            </ul>
        </div>
    </template>
</template>

<script setup lang='ts'>
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useRecentViewGoods } from '$/composables/shoppingComposable';

usePageTitleSetting('최근 본 상품', ['최근 본 쇼핑정보', '마이페이지']);

const { recentViewGoods } = useRecentViewGoods();

</script>
