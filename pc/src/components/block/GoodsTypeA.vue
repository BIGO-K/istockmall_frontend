<template>
    <div :class="['mui_product-item', attrs.class]">
        <template v-if="goods.isSoldout">
            <MMLink
                :to="
                    goods.isOnlyAdult && needCertificateAge
                        ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${goods.id}`, is_need_adult_certification: 'Y' } }
                        : { name: 'GoodsDetail', params: { id: goods.id } }
                "
            >
                <figure>
                    <div class="mui_image-scale">
                        <i 
                            v-lazyload="{ src: `${goods.thumbnailUrl}`}"
                            class="mui_bg-cover image_product"
                            :data-lazyload="`{ '_src': '${goods.thumbnailUrl}' }`"
                        />
                        <i
                            v-if="goods.mouseOverImageUrl"
                            v-lazyload="{ src: goods.mouseOverImageUrl }"
                            class="mui_bg-cover image_product"
                        />
                    </div>
                    <p v-if="useMultiangleIcon" class="text_multiangle">
                        <i class="uico_multiangle" /><b class="mui_ir-blind">360도 뷰</b>
                    </p>
                    <p v-if="goods.isSoldout" class="text_soldout">
                        SOLD OUT
                    </p>
                    <p v-if="goods.isUseStockNotify" class="text_product-status">
                        재입고 예정
                    </p>
                    <p v-if="goods.isOnlyAdult && needCertificateAge" class="text_adult">
                        <b class="mui_ir-blind">미성년자 구매불가</b><i class="uico_adult" />
                    </p>
                    <figcaption>
                        <p class="text_brand">
                            {{ goods.brandName }}
                        </p>
                        <p class="text_product">
                            <span v-if="goods.headline !== undefined && goods.headline !== null" class="text_foreword">[{{ goods.headline }}]</span>
                            {{ goods.name }}
                        </p>
                        <p v-if="isShowSellRate && goods.saleRate > 0" class="text_sale">
                            {{ goods.saleRate }}%
                        </p>
                        <p class="text_price">
                            <strong>{{ MMFilters.formatNumber(goods.baseDiscountedPrice) }}</strong>
                            <del v-if="isShowPrice && goods.saleRate > 0">{{ MMFilters.formatNumber(goods.price) }}</del>
                        </p>
                        <div v-if="useReactTag" class="mui_product-item-react">
                            <p v-if="goods.reviewScoreAverage !== undefined && goods.reviewScoreAverage > 0" class="text_star">
                                <i class="uico_star" /><span>{{ goods.reviewScoreAverage }}</span>
                            </p>
                            <p v-if="goods.reviewCount !== undefined && goods.reviewCount > 0" class="text_review">
                                <i class="uico_review" /><span>{{ goods.reviewCount }}</span>
                            </p>
                            <p v-if="goods.wishCount !== undefined && goods.wishCount > 0" class="text_like">
                                <i class="uico_like-fill" /><span>{{ goods.wishCount ? (goods.wishCount > 1000 ? '999+' : goods.wishCount) : 0 }}</span>
                            </p>
                        </div>
                        <div v-if="useBadges && goodsBadges.length" class="mui_tag-list">
                            <b v-for="badge in goodsBadges" :key="badge" class="mui_tag">{{ badge }}</b>
                        </div>
                    </figcaption>
                </figure>
            </MMLink>
        </template>
        <template v-else>
            <MMLink
                :to="
                    goods.isOnlyAdult && needCertificateAge
                        ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${goods.id}`, is_need_adult_certification: 'Y' } }
                        : { name: 'GoodsDetail', params: { id: goods.id } }
                "
            >
                <figure>
                    <div class="mui_image-scale">
                        <i 
                            v-lazyload="{ src: `${goods.thumbnailUrl}`}"
                            class="mui_bg-cover image_product"
                            :data-lazyload="`{ '_src': '${goods.thumbnailUrl}' }`"
                        />
                        <i
                            v-if="goods.mouseOverImageUrl"
                            v-lazyload="{ src: goods.mouseOverImageUrl }"
                            class="mui_bg-cover image_product"
                        />
                    </div>
                    <p v-if="useMultiangleIcon" class="text_multiangle">
                        <i class="uico_multiangle" /><b class="mui_ir-blind">360도 뷰</b>
                    </p>
                    <p v-if="goods.stock !== undefined && goods.stock < 6" class="text_product-status">
                        품절임박
                    </p>
                    <p v-if="goods.isOnlyAdult && needCertificateAge" class="text_adult">
                        <b class="mui_ir-blind">미성년자 구매불가</b><i class="uico_adult" />
                    </p>
                    <p v-if="goods.icon" class="text_tag" :style="{ 'background-color': goods.icon.backgroundColor, color: goods.icon.textColor }">
                        {{ goods.icon.label }}
                    </p>
                    <figcaption>
                        <p class="text_brand">
                            {{ goods.brandName }}
                        </p>
                        <p class="text_product">
                            <span v-if="goods.headline !== undefined && goods.headline !== null" class="text_foreword">[{{ goods.headline }}]</span>
                            {{ goods.name }}
                        </p>
                        <p v-if="isShowSellRate && goods.saleRate > 0" class="text_sale">
                            {{ goods.saleRate }}%
                        </p>
                        <p class="text_price">
                            <strong>{{ MMFilters.formatNumber(goods.baseDiscountedPrice) }}</strong>
                            <del v-if="isShowPrice && goods.saleRate > 0">{{ MMFilters.formatNumber(goods.price) }}</del>
                        </p>
                        <div v-if="useReactTag" class="mui_product-item-react">
                            <p v-if="goods.reviewScoreAverage !== undefined && goods.reviewScoreAverage > 0" class="text_star">
                                <i class="uico_star" /><span>{{ goods.reviewScoreAverage }}</span>
                            </p>
                            <p v-if="goods.reviewCount !== undefined && goods.reviewCount > 0" class="text_review">
                                <i class="uico_review" /><span>{{ goods.reviewCount }}</span>
                            </p>
                            <p v-if="goods.wishCount !== undefined && goods.wishCount > 0" class="text_like">
                                <i class="uico_like-fill" /><span>{{ goods.wishCount ? (goods.wishCount > 1000 ? '999+' : goods.wishCount) : 0 }}</span>
                            </p>
                        </div>
                        <div v-if="useBadges && goodsBadges.length" class="mui_tag-list">
                            <b v-for="badge in goodsBadges" :key="badge" class="mui_tag">{{ badge }}</b>
                        </div>
                        <slot name="extra_goods_data" />
                    </figcaption>
                </figure>
            </MMLink>
        </template>
        <button
            v-if="useLikedButton"
            type="button"
            :class="['mui_switch btn_like', { 'S=switch-on': isLiked }]"
            data-switch
            @click="toggleLiked()"
        >
            <i class="uico_like" /><b class="mui_ir-blind">찜한 아이템에 추가하기</b>
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, PropType, computed } from 'vue'
import type { Goods } from '$/@type/goods'
import { mmon } from '$/helper/mmon'
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useLikedGoods } from '$/composables/shoppingComposable';
import { defaultCatch } from '$/functions';
import AddWished from '@/components/modal/goods/AddWished.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { useGoodsWish } from '$/composables/goods/useGoodsWish';

export default defineComponent({
    inheritAttrs: false,
    props: {
        goods: {
            type: Object as PropType<Goods>,
            required: true,
        },
        isShowPrice: {
            type: Boolean,
            default: true,
        },
        isShowSellRate: {
            type: Boolean,
            default: true,
        },
        useLikedButton: {
            type: Boolean,
            default: false,
        },
        useReactTag: {
            type: Boolean,
            default: false,
        },
        useRankTag: {
            type: Boolean,
            default: false,
        },
        useBadges: {
            type: Boolean,
            default: false,
        },
        useMultiangleIcon: {
            type: Boolean,
            default: false,
        }
    },
    setup(props, { attrs }) {
        const { goods } = toRefs(props);
        const { getFolders } = useGoodsWish();
        const {
            route,
            router,        
            isUser,
            needCertificateAge
        } = usePageContext();
        
        const {
            isLiked,            
            removeLiked
        } = useLikedGoods(goods.value.id);

        const pathCertificate = isUser.value ? 'AdultCertification' : 'Login'
        const goodsBadges = computed<string[]>(() => {
            return (goods.value.badges || []).slice(0, 2)
        });

        // 상품 좋아요 여부 토글
        async function toggleLiked() {
            if (isUser.value === false) {
                return mmon.bom.confirm('로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?', (isOn: boolean) => {
                    if (!isOn) {
                        return
                    }

                    router.push({
                        name: 'Login',
                        query: {
                            redirect_to_after: route.fullPath,
                        },
                    })
                })
            }

            // 좋아요 안한 상태라면 좋아요 폴더 모달 open
            if (isLiked.value === false) {
                return useModal().open(AddWished, {
                    name: 'like',
                    title: '폴더 선택하기',        
                    props: async () => {
                        return {
                            goodsId: goods.value.id,
                            folders: await getFolders()
                        }
                    },
                })
            }

            try {
                removeLiked();
            } catch (e) {
                defaultCatch(e);
            }
        }

        return {
            attrs,
            isLiked,
            goodsBadges,
            pathCertificate,
            needCertificateAge,   
            toggleLiked,        
        }
    },
})
</script>
