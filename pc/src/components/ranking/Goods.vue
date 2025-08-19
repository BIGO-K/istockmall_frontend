<template>
    <div :class="['mm_product-item', attrs.class ]">
        <template v-if="goods.isSoldout">
            <a>
                <p class="text_rank">
                    <template v-if="hasRankRange">
                        <span
                            v-if="goods.changeType === 'U'"
                            class="text_rank-up"
                        ><i
                            class="ico_rank-up"
                            title="상승"
                        />{{ goods.changeValue }}</span>
                        <span
                            v-else-if="goods.changeType === 'D'"
                            class="text_rank-down"
                        ><i
                            class="ico_rank-down"
                            title="하락"
                        />{{ goods.changeValue }}</span>
                        <i
                            v-else-if="goods.changeType === 'N'"
                            class="ico_rank-new"
                            title="신규"
                        />
                        <i
                            v-else
                            class="ico_rank-unchanged"
                            title="변동없음"
                        />
                    </template>
                    <template v-else>
                        <i
                            class="ico_rank-unchanged"
                            title="변동없음"
                        />
                    </template>
                </p>
                <figure>
                    <div class="mm_image-scale">
                        <i
                            v-lazyload="{ src: goods.thumbnailUrl }"
                            class="mm_bg-cover image_product"
                        />
                        <i
                            v-if="goods.mouseOverImageUrl"
                            v-lazyload="{ src: goods.mouseOverImageUrl }"
                            class="mm_bg-cover image_product"
                        />
                    </div>
                    <p class="text_soldout">SOLD OUT</p>
                    <figcaption>
                        <p v-if="isShowBrandName" class="text_brand">{{ goods.brandName }}</p>
                        <p class="text_product">
                            <span
                                v-if="goods.headline"
                                class="text_foreword"
                            >[{{ goods.headline }}]</span>
                            {{ goods.name }}
                        </p>
                        <p
                            v-if="isShowSellRate"
                            class="text_sale"
                        >{{ goods.saleRate }}%</p>
                        <p v-if="!isHideAllPrice" class="text_price">
                            <strong>{{ MMFilters.formatNumber(goods.baseDiscountedPrice) }}</strong>
                            <del v-if="isShowPrice && goods.saleRate > 0">{{ MMFilters.formatNumber(goods.price) }}</del>
                        </p>
                    </figcaption>
                </figure>
            </a>            
        </template>
        <template v-else>
            <MMLink
                :to="goods.isOnlyAdult && needCertificateAge 
                    ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${goods.id}`, is_need_adult_certification :'Y' }} 
                    : { name:'GoodsDetail', params: { id: goods.id }}"
            >
                <p class="text_rank">
                    <template v-if="hasRankRange">
                        <span
                            v-if="goods.changeType === 'U'"
                            class="text_rank-up"
                        ><i
                            class="ico_rank-up"
                            title="상승"
                        />{{ goods.changeValue }}</span>
                        <span
                            v-else-if="goods.changeType === 'D'"
                            class="text_rank-down"
                        ><i
                            class="ico_rank-down"
                            title="하락"
                        />{{ goods.changeValue }}</span>
                        <i
                            v-else-if="goods.changeType === 'N'"
                            class="ico_rank-new"
                            title="신규"
                        />
                        <i
                            v-else
                            class="ico_rank-unchanged"
                            title="변동없음"
                        />
                    </template>
                    <template v-else>
                        <i
                            class="ico_rank-unchanged"
                            title="변동없음"
                        />
                    </template>
                </p>
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
                        v-if="goods.isOnlyAdult && needCertificateAge"
                        class="text_adult"
                    >
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
                            <span
                                v-if="goods.headline"
                                class="text_foreword"
                            >[{{ goods.headline }}]</span>
                            {{ goods.name }}
                        </p>
                        <p
                            v-if="isShowSellRate && goods.saleRate > 0"
                            class="text_sale"
                        >
                            {{ goods.saleRate }}%
                        </p>
                        <p v-if="!isHideAllPrice" class="text_price">
                            <strong>{{ MMFilters.formatNumber(goods.baseDiscountedPrice) }}</strong>
                            <del v-if="isShowPrice && goods.saleRate > 0">{{ MMFilters.formatNumber(goods.price) }}</del>
                        </p>
                        <p v-if="isShowWishCount && goods.wishCount" class="text_like">
                            <i class="ico_like-fill" />
                            {{ goods.wishCount > 1000 && useWishCountRound ? '999+' : MMFilters.formatNumber(goods.wishCount) }}
                        </p>
                        <div v-if="isShowNearlySoldout && approachSoldout" class="mm_tag-list">
                            <b v-if="attrs.class === 'T=pb'" class="mm_tag T=product-status">품절임박</b>
                            <b v-else class="mm_tag T=soldout-nearly">품절 임박</b>
                        </div>
                    </figcaption>
                </figure>
            </MMLink> 
        </template>  
        <button
            v-if="useLikedButton"
            type="button" 
            :class="['mm_switch btn_like', {'S=switch-on' : isLiked }]"
            data-switch
            @click="toggleLiked()"
        >        
            <i class="ico_like" /><b class="mm_ir-blind">찜한 아이템에 추가하기</b>
        </button>  
    </div>
</template>

<script setup lang='ts' inherit-attrs="false">
import { computed, toRefs, useAttrs } from 'vue';
import { RankingGoods } from '$/@type/ranking';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useLikedGoods } from '$/composables/shoppingComposable';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { useGoodsWish } from '$/composables/goods/useGoodsWish';
import AddWished from '@/components/modal/goods/AddWished.vue';

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

const { getFolders } = useGoodsWish();
const { goods } = toRefs(props);
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
const approachSoldout = computed(() => {
    return goods.value.stock && goods.value.stock < 6 && !goods.value.isSoldout
})
// 상품 좋아요 여부 토글
async function toggleLiked() {
    if (isUser.value === false) {
        return mmon.bom.confirm('로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?', (isOn: boolean) => {
            if (!isOn) {
                return;
            }

            router.push({
                name: 'Login',
                query: {
                    redirect_to_after: route.fullPath                                
                }
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
        console.log(e);
    }
}
</script>