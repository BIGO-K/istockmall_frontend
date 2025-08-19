<template>
    <MMLink
        :to="
            goods.isOnlyAdult && needCertificateAge
                ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${goods.id}`, is_need_adult_certification: 'Y' } }
                : { name: 'GoodsDetail', params: { id: goods.id } }
        "
    >
        <p class="text_rank" :class="goods.rank === 1 ? 'T=rank-first' : ''">
            <strong>{{ goods.rank }}</strong>
            <template v-if="hasRange">
                <span v-if="goods.rankChangeType === 'U'" class="text_rank-up">
                    <i class="uico_rank-up" title="상승" />{{ goods.rankChangeValue }}
                </span>
                <span v-else-if="goods.rankChangeType === 'D'" class="text_rank-down">
                    <i class="uico_rank-down" title="하락" />{{ goods.rankChangeValue }}
                </span>
                <i v-else-if="goods.rankChangeType === 'N'" class="uico_rank-new" title="신규" />
                <i v-else class="uico_rank-unchanged" title="변동없음" />
            </template>
        </p>
        <figure>
            <div class="mui_image-scale">
                <i
                    v-lazyload="{ src: goods.thumbnailUrl }"
                    class="mui_bg-cover image_product"
                    :data-lazyload="`{ '_src': '${goods.thumbnailUrl}' }`"
                />
            </div>
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
                <p v-if="useIcon && goods.icon" class="text_tag" :style="{ 'background-color': goods.icon.backgroundColor, color: goods.icon.textColor }">
                    {{ goods.icon.label }}
                </p>
                <ul v-if="(useBadges && goods.badges?.length) || (goods.stock && goods.stock < 6)">
                    <li v-for="badge in goods.badges" :key="badge">
                        <b>{{ badge }}</b>
                    </li>
                    <li v-if="goods.icon">
                        <p :style="{ 'background-color': goods.icon.backgroundColor, color: goods.icon.textColor }">
                            {{ goods.icon.label }}
                        </p>
                    </li>
                    <li v-if="goods.stock && goods.stock < 6">
                        <strong>품절임박</strong>
                    </li>
                </ul>
            </figcaption>
        </figure>
    </MMLink>
</template>

<script setup lang='ts'>
import { GoodsGroup } from '$/@type/block/partition';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

withDefaults(defineProps<{
    goods: GoodsGroup['goodsList'][0]
    useIcon?: boolean
    hasRange?: boolean
    useBadges?: boolean
}>(), {
    useIcon: false,
    hasRange: true,
    useBadges: false,
})

const {   
    isUser,
    needCertificateAge
} = usePageContext();
const pathCertificate = isUser.value ? 'AdultCertification' : 'Login'

</script>
