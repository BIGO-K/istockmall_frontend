<template>
    <div :class="['mm_product-item', attrs.class ]">
        <MMLink
            :to="withoutLink ? '' : 
                goods.isOnlyAdult && needCertificateAge 
                    ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${goods.id}`, is_need_adult_certification :'Y' }} 
                    : { name:'GoodsDetail', params: { id: goods.id }}"
        > 
            <figure>
                <div class="mm_image-scale">
                    <i
                        v-lazyload="{ src: goods.thumbnailUrl }"
                        class="mm_bg-cover image_product"
                    />
                    <!-- (D) 마우스 오버용 리스트 이미지 -->
                    <i
                        v-if="goods.mouseOverImageUrl"
                        v-lazyload="{ src: goods.mouseOverImageUrl }"
                        class="mm_bg-cover image_product"
                    />
                </div>
                <p
                    v-if="show.includes('soldout') && goods.stock && goods.stock < 6"
                    class="text_product-status"
                >
                    품절임박
                </p>
                <p v-if="goods.isOnlyAdult && needCertificateAge" class="text_adult">
                    <b class="mui_ir-blind">미성년자 구매불가</b><i class="ico_adult" />
                </p>
                <p
                    v-if="show.includes('icon') && goods.icon" 
                    class="text_tag" 
                    :style="{ 'background-color': goods.icon.backgroundColor, color: goods.icon.textColor }"
                >
                    {{ goods.icon.label }}
                </p>
                <figcaption>
                    <p v-if="show.includes('brandName') && goods.brandName" class="text_brand">
                        {{ goods.brandName }}
                    </p>
                    <p v-if="show.includes('goodsName') && goods.name" class="text_product">
                        {{ goods.name }}
                    </p>
                    <p v-if="show.includes('saleRate') && goods.saleRate" class="text_sale">
                        {{ goods.saleRate }}%
                    </p>
                    <p class="text_price">
                        <strong>{{ MMFilters.formatNumber(goods.baseDiscountedPrice) }}</strong>
                    </p>
                </figcaption>
            </figure>
        </MMLink>
    </div>
</template>

<script setup lang="ts" inherit-attrs="false">
import { useAttrs } from 'vue'
import { RankingBrandGoods } from '$/@type/ranking';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

withDefaults(defineProps<{
    goods: RankingBrandGoods
    withoutLink?: boolean
    show?: ('soldout'|'brandName'|'goodsName'|'saleRate'|'soldout'|'icon')[]
}>(), {
    withoutLink: false,
    show: () => []
})
const attrs = useAttrs();

const {
    isUser,
    needCertificateAge,
} = usePageContext();
const pathCertificate = isUser.value ? 'AdultCertification' : 'Login';

</script>
