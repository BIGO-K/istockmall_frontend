<template>
    <div :class="['mm_product-item T=pb', attrs.class ]">
        <template v-if="goods.isSoldout">
            <MMLink
                :to="goods.isOnlyAdult && needCertificateAge 
                    ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${goods.id}`, is_need_adult_certification :'Y' }} 
                    : { name:'GoodsDetail', params: { id: goods.id }}"
                @click="additionHandler"                
            >                            
                <p v-if="useRankTag" class="text_rank" />
                <figure>
                    <i v-lazyload="{ src: goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                    <p v-if="goods.isSoldout" class="text_soldout">
                        SOLD OUT
                    </p>
                    <p v-if="goods.isUseStockNotify" class="text_product-status">
                        재입고 예정
                    </p>    
                    <p v-if="goods.isOnlyAdult && needCertificateAge" class="text_adult">
                        <b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult" />
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
                            <del v-if="isShowPrice && goods.saleRate > 0"><span>{{ MMFilters.formatNumber(goods.price) }}</span></del>
                        </p>
                        <div v-if="useReactTag" class="mm_product-item-react">
                            <p class="text_star">
                                <i class="ico_star" /><span>{{ goods.reviewScoreAverage }}</span>
                            </p>
                            <p class="text_review">
                                <i class="ico_review" /><span>{{ goods.reviewCount }}</span>
                            </p>
                            <p class="text_like">
                                <i class="ico_like" /><span>{{ goods.wishCount ? goods.wishCount > 1000 ? '999+' : goods.wishCount : 0 }}</span>
                            </p>
                        </div>
                        <div v-if="goods.badges?.length || isForcedBadgeDisplay" class="mm_tag-list">
                            <b v-for="badge in goods.badges" :key="badge" class="mm_tag T=square T=dark">{{ badge }}</b>
                        </div>
                    </figcaption>
                </figure>
            </MMLink>            
        </template>
        <template v-else>
            <MMLink
                :to="goods.isOnlyAdult && needCertificateAge 
                    ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${goods.id}`, is_need_adult_certification :'Y' }} 
                    : { name:'GoodsDetail', params: { id: goods.id }}"   
                @click="additionHandler"                      
            >
                <p v-if="useRankTag" class="text_rank" />
                <figure>
                    <i v-lazyload="{ src: goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                    <p v-if="goods.isOnlyAdult && needCertificateAge" class="text_adult">
                        <b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult" />
                    </p>           
                    <p
                        v-if="goods.icon" 
                        class="text_tag" 
                        :style="{ 'background-color': goods.icon.backgroundColor, color: goods.icon.textColor }"
                    >
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
                            <del v-if="isShowPrice && goods.saleRate > 0"><span>{{ MMFilters.formatNumber(goods.price) }}</span></del>
                        </p>
                        <div v-if="useReactTag" class="mm_product-item-react">
                            <p class="text_star">
                                <i class="ico_star" /><span>{{ goods.reviewScoreAverage }}</span>
                            </p>
                            <p class="text_review">
                                <i class="ico_review" /><span>{{ goods.reviewCount }}</span>
                            </p>
                            <p class="text_like">
                                <i class="ico_like" /><span>{{ goods.wishCount ? goods.wishCount > 1000 ? '999+' : goods.wishCount : 0 }}</span>
                            </p>
                        </div>
                        <div class="mm_tag-list">
                            <b v-if="goods.stock && goods.stock < 6" class="mm_tag T=square T=soldout-nearly">품절임박</b>
                            <b v-for="badge in goods.badges" :key="badge" class="mm_tag T=square T=dark">{{ badge }}</b>
                            <b v-if="(goods.badges?.length || 0) < 1" class="mm_tag T=square T=dark" style="opacity: 0;">-</b>
                        </div>
                        <slot name="extra_goods_data" />
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

<script lang="ts">
import { defineComponent, toRefs, PropType } from 'vue';
import type { Goods } from '$/@type/goods';
import { useLikedGoods, useWishedGoods } from '$/composables/shoppingComposable';
import { searchRepository } from '$/repository/searchRepository';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

export default defineComponent({
    inheritAttrs: false,
    props: {
        goods: {
            type: Object as PropType<Goods>,
            required: true
        },
        isShowPrice: {
            type: Boolean,
            default: true
        },
        isShowSellRate: {
            type: Boolean,
            default: true
        },
        useLikedButton: {
            type: Boolean,
            default: false,
        },
        useReactTag: {
            type: Boolean,
            default: false,
        },
        useRankTag : {
            type : Boolean,
            default: false
        },
        isForcedBadgeDisplay : {
            type: Boolean,
            default: false
        },
        searchKeyword: {
            type: String,
            default: ''
        }
    },
    setup(props, { attrs }) {
        const { goods, isShowPrice, isShowSellRate, useLikedButton, useRankTag, isForcedBadgeDisplay, searchKeyword } = toRefs(props);
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

        async function toggleLiked() {
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
            if (isLiked.value === false) {
                setWishedGoodsId(goods.value.id);
                window.location.hash = '#WISHED_FOLDER';           
            } 
            
            try {
                removeLiked();
            } catch (e) {
                console.log(e);
            }
        }

        /**
         * 상품상세 링크 클릭시 추가적으로 수행해야할 이벤트
         */
        function additionHandler() {
            if (searchKeyword.value === '') {
                return;
            }

            searchRepository.sendFeedBack(searchKeyword.value, goods.value.id);
        }
        
        return {  
            useRankTag,
            pathCertificate,
            toggleLiked,
            goods,
            isLiked,
            isShowPrice,
            isShowSellRate,
            useLikedButton,
            attrs,
            needCertificateAge,
            isForcedBadgeDisplay,  
            additionHandler          
        }        
    },
})
</script>
