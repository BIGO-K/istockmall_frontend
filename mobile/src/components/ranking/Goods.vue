<template>
    <div :class="['mm_product-item', attrs.class ]">
        <template v-if="goods.isSoldout">
            <MMLink
                :to="goods.isOnlyAdult && needCertificateAge 
                    ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${goods.id}`, is_need_adult_certification :'Y' }} 
                    : { name:'GoodsDetail', params: { id: goods.id }}"
            >
                <p class="text_rank">
                    <template v-if="hasRankRange">
                        <span v-if="goods.changeType === 'U'" class="text_rank-up"><i class="ico_rank-up" title="상승" />{{ goods.changeValue }}</span>
                        <span v-else-if="goods.changeType === 'D'" class="text_rank-down"><i class="ico_rank-down" title="하락" />{{ goods.changeValue }}</span>
                        <i v-else-if="goods.changeType === 'N'" class="ico_rank-new" title="신규" />
                        <i v-else class="ico_rank-unchanged" title="변동없음" />
                    </template>
                    <template v-else>
                        <i class="ico_rank-unchanged" title="변동없음" />
                    </template>
                </p>
                <figure>
                    <div class="mm_image-scale">
                        <i v-lazyload="{ src: goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                    </div>
                    <p class="text_soldout">
                        SOLD OUT
                    </p>
                    <p v-if="goods.isUseStockNotify" class="text_product-status">
                        재입고 예정
                    </p>                    
                    <figcaption>
                        <p v-if="isShowBrandName" class="text_brand">
                            {{ goods.brandName }}
                        </p>
                        <p class="text_product">
                            <span v-if="goods.headline !== undefined && goods.headline !== null" class="text_foreword">[{{ goods.headline }}]</span>
                            {{ goods.name }}
                        </p>
                        <p v-if="isShowSellRate" class="text_sale">
                            {{ goods.saleRate }}%
                        </p>
                        <p v-if="!isHideAllPrice" class="text_price">
                            <strong>{{ MMFilters.formatNumber(goods.baseDiscountedPrice) }}</strong>
                            <del v-if="isShowPrice && goods.saleRate > 0"><span>{{ MMFilters.formatNumber(goods.price) }}</span></del>
                        </p>
                    </figcaption>
                </figure>
            </MMLink>            
        </template>
        <template v-else>
            <MMLink
                :to="goods.isOnlyAdult && needCertificateAge 
                    ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${goods.id}`, is_need_adult_certification :'Y' }} 
                    : { name:'GoodsDetail', params: { id: goods.id }}"
            >
                <p class="text_rank">
                    <template v-if="hasRankRange">
                        <span v-if="goods.changeType === 'U'" class="text_rank-up"><i class="ico_rank-up" title="상승" />{{ goods.changeValue }}</span>
                        <span v-else-if="goods.changeType === 'D'" class="text_rank-down"><i class="ico_rank-down" title="하락" />{{ goods.changeValue }}</span>
                        <i v-else-if="goods.changeType === 'N'" class="ico_rank-new" title="신규" />
                        <i v-else class="ico_rank-unchanged" title="변동없음" />
                    </template>
                    <template v-else>
                        <i class="ico_rank-unchanged" title="변동없음" />
                    </template>
                </p>
                <figure>
                    <div class="mm_image-scale">
                        <i v-lazyload="{ src: goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                    </div>                      
                    <p v-if="goods.isOnlyAdult && needCertificateAge" class="text_adult">
                        <b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult" />
                    </p>           
                    <p
                        v-if="isShowIcon && goods.icon" 
                        class="text_tag" 
                        :style="{ 'background-color': goods.icon.backgroundColor, color: goods.icon.textColor }"
                    >
                        {{ goods.icon.label }}
                    </p>
                    <figcaption>
                        <p v-if="isShowBrandName" class="text_brand">
                            {{ goods.brandName }}
                        </p>
                        <p class="text_product">
                            <span v-if="goods.headline !== undefined && goods.headline !== null" class="text_foreword">[{{ goods.headline }}]</span>
                            {{ goods.name }}
                        </p>
                        <p v-if="isShowSellRate && goods.saleRate > 0" class="text_sale">
                            {{ goods.saleRate }}%
                        </p>
                        <!--가격-->
                        <p v-if="!isHideAllPrice" class="text_price">
                            <strong>{{ MMFilters.formatNumber(goods.baseDiscountedPrice) }}</strong>
                            <del v-if="isShowPrice && goods.saleRate > 0"><span>{{ MMFilters.formatNumber(goods.price) }}</span></del>
                        </p>
                        <!--// 가격-->
                        <!--품절임박 태그-->
                        <div v-if="isShowNearlySoldout && goods.stock && goods.stock < 6" class="mm_tag-list">
                            <b class="mm_tag T=square T=product-status">품절임박</b>
                        </div>
                        <!--// 품절임박 태그-->
                        <!--좋아요 수-->
                        <p v-if="isShowWishCount && goods.wishCount !== undefined" class="text_like">
                            <template v-if="useWishCountRound">
                                <i class="ico_like" />{{ goods.wishCount > 1000 ? '999+' : MMFilters.formatNumber(goods.wishCount) }}
                            </template>
                            <template v-else>
                                <i class="ico_like-fill" />{{ MMFilters.formatNumber(goods.wishCount) }}
                            </template>
                        </p>
                        <!--// 좋아요 수-->
                    </figcaption>
                </figure>
            </MMLink>
        </template>
        <button
            v-if="useLikedButton"
            type="button" 
            :class="['mm_switch btn_like', {'S=switch-on' : isLiked }]"
            data-switch
            @click="toggleLiked(isLiked, goods)"
        >
            <i class="ico_like" /><b class="mm_ir-blind">찜한 아이템에 추가하기</b>
        </button>
    </div>
</template>

<script setup lang='ts' inherit-attrs="false">
import { defineComponent, toRefs, useAttrs } from 'vue';
import { RankingGoods } from '$/@type/ranking';
import { useLikedGoods, useWishedGoods } from '$/composables/shoppingComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const attrs = useAttrs();
const props = withDefaults(defineProps<{
    goods: RankingGoods;
    isShowPrice?: boolean;
    isShowSellRate?: boolean;
    useLikedButton?: boolean;
    hasRankRange?: boolean;
    isHideAllPrice?: boolean;
    isShowBrandName?: boolean;
    useBuyIcon?: boolean;
    isShowWishCount?: boolean;
    useWishCountRound?: boolean;
    isShowNearlySoldout?: boolean;
    isShowIcon?: boolean;
}>(), {
    isShowPrice: true,
    isShowSellRate: true,
    useLikedButton: false,    
    hasRankRange: false,
    isHideAllPrice: false,
    isShowBrandName: true,
    useBuyIcon: false,
    isShowWishCount: false,
    useWishCountRound: true,
    isShowNearlySoldout: true,
    isShowIcon: true
});


const { goods } = toRefs(props);
const { setWishedGoodsId } = useWishedGoods();
const { 
    router,
    route,
    isUser,
    needCertificateAge,
    mmon
} = usePageContext();

const { 
    isLiked,
    removeLiked
} = useLikedGoods(goods.value.id);

const pathCertificate = isUser.value ? 'AdultCertification' : 'Login';

async  function toggleLiked(isLiked: boolean, goods: RankingGoods) {
    if (isUser.value === false) {
        return mmon.bom.confirm('로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?', (isOn: boolean) => {
            if (isOn) {
                router.push({
                    name: 'Login',
                    query: {
                        redirect_to_after: route.path                                
                    }
                })
            }
        })               
    }

    // 좋아요 안한 상태라면 좋아요 폴더 모달 open
    if (!isLiked) {
        setWishedGoodsId(goods.id);
        window.location.hash = '#WISHED_FOLDER';           
    } 
            
    try {
        removeLiked();
    } catch (e) {
        console.log(e);
    }
}
</script>

