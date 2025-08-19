<!--주문형 상품리스트-->
<template>
<div class="mm_product-item">
    <component :is="withoutLink ? 'a' : MMLink" :to="withoutLink ? null : { name: 'GoodsDetail', params: { id: goods.id }}"> 
        <figure>
            <i class="mm_bg-cover image_product" v-lazyload="{ src: goods.thumbnailUrl }"></i>
            <p v-if="showSoldout && goods.isSoldout" class="text_soldout">품절</p>
            <figcaption>
                <slot name="order-status"/>
                <p class="text_brand">{{ goods.brandName }}</p>
                <p class="text_product">{{ goods.name }}</p>
                <p v-if="price !== undefined" class="text_price"><strong>{{ MMFilters.formatNumber(price) }}</strong></p>
                <p v-if="goods.optionName" class="text_option">{{ goods.optionName }}{{ goods.ea ? ` / ${goods.ea}개` : ''}}</p>
            </figcaption>
        </figure>
    </component>
    <div v-if="slots.footer" class="mm_product-item-footer">
        <slot name="footer"/>
    </div>
</div>
</template>

<script setup lang='ts'>
import MMLink from '@/components/MMLink.vue';
import { SimpleGoods } from '$/@type/goods';
import { useSlots } from 'vue';

const slots = useSlots();
const props = defineProps<{
    goods: SimpleGoods
    price?: number
    showSoldout?: boolean
    withoutLink?: boolean
}>();

</script>
