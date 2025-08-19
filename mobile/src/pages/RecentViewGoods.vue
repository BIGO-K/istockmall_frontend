<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>최근 본 상품</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-recent">
                            <p v-if="recentViewGoods.length < 1" class="mm_text-none">
                                <i class="ico_text-none" />등록된 상품이 없습니다
                            </p>
                            <div v-else class="mm_product-list T=sm">
                                <ul>
                                    <li v-for="recentViewGood in recentViewGoods" :key="recentViewGood.id">
                                        <div class="mm_product-item">
                                            <MMLink                                             
                                                :to="{ 
                                                    name : 'GoodsDetail', 
                                                    params: { id: recentViewGood.id }
                                                }"                                                
                                            >											
                                                <figure>
                                                    <i v-lazyload="{ src : recentViewGood.thumbnailUrl }" class="mm_bg-cover image_product" />
                                                    <figcaption>
                                                        <p class="text_brand">
                                                            {{ recentViewGood.brandName }}
                                                        </p>
                                                        <p class="text_product">
                                                            {{ recentViewGood.name }}
                                                        </p>
                                                        <p class="text_price">
                                                            <strong>{{ MMFilters.formatNumber(recentViewGood.baseDiscountedPrice ) }}</strong>
                                                        </p>
                                                    </figcaption>
                                                </figure>
                                            </MMLink>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>


<script setup lang='ts'>
import { useRecentViewGoods } from '$/composables/shoppingComposable';
import MMPopup from '@/components/layout/Popup.vue';

const {
    recentViewGoods 
} = useRecentViewGoods();
/** VARIABLE */

/** FUNCTION */

/** VUE LIFE CYCLE */

</script>