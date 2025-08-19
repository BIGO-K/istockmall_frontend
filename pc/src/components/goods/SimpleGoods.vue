<template>
    <div :class="['mm_product-item', attrs.class ]">
        <component
            :is="withoutLink ? 'a' : MMLink"
            :to="withoutLink ? null : { name: 'GoodsDetail', params: { id: goods.id }}"
        > 
            <figure>
                <div class="mm_image-scale">
                    <i
                        v-lazyload="{ src: goods.thumbnailUrl }"
                        class="mm_bg-cover image_product"
                    />
                </div>
                <p
                    v-if="showSoldout && goods.isSoldout"
                    class="text_soldout"
                >
                    SOLD OUT
                </p>
                <figcaption>
                    <p class="text_brand">
                        {{ goods.brandName }}
                    </p>
                    <p class="text_product">
                        {{ goods.name }}
                    </p>
                    <p
                        v-if="goods.optionName"
                        class="text_option"
                    >
                        {{ goods.optionName }}{{ goods.ea ? ` / ${goods.ea}개` : '' }}
                    </p>
                    <p v-if="price" class="text_price">
                        <strong>{{ MMFilters.formatNumber(price) }}</strong>
                    </p>
                </figcaption>
            </figure>
        </component>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, defineAsyncComponent } from 'vue'
import type { SimpleGoods } from '$/@type/goods';

export default defineComponent({
    inheritAttrs: false,
    props: {
        goods: {
            type: Object as PropType<SimpleGoods>,
            required: true
        },
        withoutLink: {
            type: Boolean,
            default: false,
        },
        showSoldout: {
            type: Boolean,
            default: false
        },
        price: {
            type: Number,
            default: 0,
        }
    },
    setup(props, { attrs }) {
        const MMLink = defineAsyncComponent(() => import('@/components/MMLink.vue'));
        return {
            attrs,
            MMLink
        }        
    },
})
</script>
