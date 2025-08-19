<template>
    <div :class="['mm_product-item', attrs.class ]">
        <MMLink
            :to="withoutLink ? '' : 
                goods.isOnlyAdult && needCertificateAge 
                    ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${goods.id}`, is_need_adult_certification :'Y' }} 
                    : { name:'GoodsDetail', params: { id: goods.id }}"
        > 
            <figure>
                <i v-lazyload="{ src: goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                <p v-if="showSoldout && goods.stock && goods.stock < 6" class="text_product-status">
                    품절임박
                </p>
                <p v-if="goods.isOnlyAdult && needCertificateAge" class="text_adult">
                    <b class="mui_ir-blind">미성년자 구매불가</b><i class="ico_adult" />
                </p>
                <p
                    v-if="showIcon && goods.icon" 
                    class="text_tag" 
                    :style="{ 'background-color': goods.icon.backgroundColor, color: goods.icon.textColor }"
                >
                    {{ goods.icon.label }}
                </p>
                <figcaption>
                    <p class="text_price">
                        <strong>{{ MMFilters.formatNumber(goods.baseDiscountedPrice) }}</strong>
                    </p>
                </figcaption>
            </figure>
        </MMLink>
    </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { RankingBrandGoods } from '$/@type/ranking';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

withDefaults(defineProps<{
    goods: RankingBrandGoods
    withoutLink?: boolean
    showSoldout?: boolean
    showIcon?: boolean
}>(), {
    withoutLink: false,
    showIcon: true,
    showSoldout: false,
})
const attrs = useAttrs();

const {
    isUser,
    needCertificateAge,
} = usePageContext();
const pathCertificate = isUser.value ? 'AdultCertification' : 'Login';
</script>