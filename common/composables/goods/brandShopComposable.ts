import { SimplePaginator } from "$/@type";
import { BrandShopInfo } from "$/@type/brand";
import { Goods } from "$/@type/goods";
import { useFilterForm } from "$/composables/goods/filterComposable";
import { defaultCatch } from "$/functions";
import { brandShopRepository } from "$/repository/goods/brandShopRepository";
import { wishRepository } from "$/repository/member/wishRepository";
import { shoppingRepository } from "$/repository/shoppingRepository";
import { computed, ref, watchEffect } from "vue";
import { useRoute } from 'vue-router';

export function useBrandShop(brandId: number) {
    /** STORE **/

    /** //STORE **/
    const { searchForm, filters } = useFilterForm();

    const route = useRoute();

    /** VARIABLE **/
    const isLoading = ref(true);    
    const totalCount = ref(0);
    const isWishBrand = ref(false);
    const brandInfo = ref<BrandShopInfo>();
    const curations = computed(() => {
        if (brandInfo.value === undefined) {
            return [];
        }
    
        if (brandInfo.value.curations.length < 1) {
            return [];
        }
    
        if (brandInfo.value.brandContents.length > 0) {
            return brandInfo.value.curations.slice(0,6);
        }
                
        return brandInfo.value.curations.slice(0,10);
    })

    const brandGoodsPaginator = ref<SimplePaginator<Goods>>({            
        currentPage: 1,
        perPage: 100,
        data: []
    })

    const brandImageUrl = computed(() => {
        return brandInfo.value?.topPcImageUrl? brandInfo.value.topPcImageUrl : null;
    });
    /** //VARIABLE **/

    /** FUNC **/
    async function getBrandShopGoods() {
        isLoading.value = true;
        try {
            const goodsPaginator = await brandShopRepository.brandShopGoods(brandId, searchForm.value);
            brandGoodsPaginator.value = goodsPaginator.paginator;            
            shoppingRepository.getRelationLikedGoods(goodsPaginator.goodsIds, false);
        } catch (e) {
            throw(e);
        } finally {
            isLoading.value = false;
        }
    }

    async function getBrandShopTotalGoodsCount() {
        try {
            const count = await brandShopRepository.filteredGoodsTotalCount(brandId, searchForm.value);
            totalCount.value = count;
        } catch(e) {
            throw(e);
        }
    }

    async function brandWish() {
        try {
            if (isWishBrand.value) {
                await wishRepository.deleteBrand(brandId);
                isWishBrand.value = false;
            } else {
                await wishRepository.addWishBrand(brandId);
                isWishBrand.value = true;
            }
                    
        } catch (e) {
            throw(e);
        } 
    }
    /** //FUNC **/

    const onReadyWatch = watchEffect(async () => {
        try {
            const [brand, likeRelations, brandShopFilters] = await Promise.all([
                brandShopRepository.brandInfo(brandId),
                wishRepository.getWishBrandRelation([brandId]),
                brandShopRepository.commonFilter(brandId),
            ])
            brandInfo.value = brand;    
            if (brand.isUseRecommendedGoods && !route.query.sorting) {  //추천순 설정일 경우
                searchForm.value.sorting = 'brand_recommend';
            } else {
                if (route.query.sorting === 'brand_recommend') {
                    searchForm.value.sorting = 'selling'
                }
            }
           
            await Promise.all([
                getBrandShopGoods(),
                getBrandShopTotalGoodsCount()
            ])
    
            isWishBrand.value = likeRelations.some(rel => rel.brandId == brandId && rel.liked);
            filters.value = brandShopFilters;
            if (brandInfo.value !== undefined && brandInfo.value.curations) {
                const goodsIds = brandInfo.value.curations.slice(0, 12).map((goods) => {
                    return goods.id
                });

                shoppingRepository.getRelationLikedGoods(goodsIds);
            }
        } catch(e) {
            defaultCatch(e);
        }
        
    })
    
    
        
    onReadyWatch();

    return {
        totalCount,
        curations,
        brandInfo,
        isLoading,
        searchForm,
        isWishBrand,
        brandImageUrl,
        filters,
        brandGoodsPaginator,
        getBrandShopTotalGoodsCount,
        getBrandShopGoods,
        brandWish        
    }
}