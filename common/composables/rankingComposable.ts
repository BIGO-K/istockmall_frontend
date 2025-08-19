import { Category } from "$/@type/category";
import { RankingBrand, RankingItem } from "$/@type/ranking";
import { LikedGoods } from "$/@type/shopping";
import { usePageContext } from "$/composables/pageHandler/contextComposable";
import { defaultCatch } from "$/functions";
import { mmon } from "$/helper/mmon";
import { rankingRepository } from "$/repository/rankingRepository";
import { shoppingRepository } from "$/repository/shoppingRepository";
import { makePath } from "$/services/http";
import { nextTick, ref } from "vue";

export function useItemRanking() {
    /** STORE **/
    const { route, router } = usePageContext();
    /** //STORE **/

    /** VARIABLE **/
    const selectedRankRange = ref(`${route.query.period || 'D'}`);
    const selectedCategoryCode = ref(`${route.query.category_code || ''}`);

    const rankingItem = ref<RankingItem|null>(null);
    const likedGoodsRelations = ref<LikedGoods[]>([]);
    const categoryRankingGoods = ref<{ [key: string]: {
        rankInfo: RankingItem,
        likedGoodsRelations: LikedGoods[]
    }}>({});
    /** //VARIABLE **/

    /** FUNCTION **/
    async function fetchRankingItem(rankRange: string, categoryCode: string) {
        selectedRankRange.value = rankRange;
        selectedCategoryCode.value = categoryCode;
        router.replace(makePath(route.path, {
            period: rankRange,
            category_code: categoryCode,
        }))
    
        mmon.loading.show();
        try {
            if (!categoryRankingGoods.value[categoryCode]) {
                const ranking = await rankingRepository.getRankingItem('goods-order', `${rankRange}`, `${categoryCode}`, 200);
                rankingItem.value =  ranking;
                likedGoodsRelations.value = await shoppingRepository.getRelationLikedGoods(ranking.goodsIds);
    
                categoryRankingGoods.value[categoryCode] = {
                    rankInfo: rankingItem.value,
                    likedGoodsRelations: likedGoodsRelations.value
                }
            } else {
                rankingItem.value = categoryRankingGoods.value[categoryCode].rankInfo;
                likedGoodsRelations.value = categoryRankingGoods.value[categoryCode].likedGoodsRelations;
            }
        } catch(e) {
            console.log(e);
            defaultCatch(e)
        } finally {
            mmon.loading.hide();
        }
    }
    async function fetchRankingItemByRange(rankRange: string) {
        categoryRankingGoods.value = {};
        selectedRankRange.value = rankRange;
        fetchRankingItem(rankRange, selectedCategoryCode.value);
    }
    /** //FUNCTION **/

    (async () => {
        try {
            await fetchRankingItem(selectedRankRange.value, selectedCategoryCode.value);
        } catch (e) {
            defaultCatch(e);
        }  
    })();

    return {
        selectedRankRange,
        selectedCategoryCode,
        rankingItem,
        fetchRankingItem,
        fetchRankingItemByRange
    }
}

export function useBrandRanking() {
    /** STORE **/
    const { route, router } = usePageContext();
    /** //STORE **/

    /** VARIABLE **/
    const rankingBrand = ref<RankingBrand|null>(null);
    const selectedRankRange = ref(`${route.query.period || 'D'}`);
    /** //VARIABLE **/

    /** FUNCTION **/
    async function fetchRankingBrand(rankRange: string) {
        selectedRankRange.value = rankRange;
        router.replace(makePath(route.path, {
            period: rankRange,
        }))
        try {
            const ranking = await rankingRepository.getRankingBrand(`${rankRange}`, 100);
            rankingBrand.value =  ranking;
        } catch(e) {
            console.log(e);
            defaultCatch(e)
        } 
    }
    /** //FUNCTION **/
    (async () => {
        try {
            await fetchRankingBrand(selectedRankRange.value);
        } catch (e) {
            defaultCatch(e);
        } 
    })();

    return {
        rankingBrand,
        selectedRankRange,
        fetchRankingBrand,
    }
}

export function useViewRanking() {
    /** STORE **/
    const { route, router } = usePageContext();
    /** //STORE **/

    /** VARIABLE **/
    const selectedRankRange = ref(`${route.query.period || 'D'}`);
    const selectedCategoryCode = ref(`${route.query.category_code || ''}`);

    const rankingItem = ref<RankingItem|null>(null);
    const likedGoodsRelations = ref<LikedGoods[]>([]);
    const categoryRankingGoods = ref<{ [key: string]: {
        rankInfo: RankingItem,
        likedGoodsRelations: LikedGoods[]
    }}>({});
    /** //VARIABLE **/

    /** FUNCTION **/
    async function fetchRankingView(rankRange:string, categoryCode: string) {
        selectedRankRange.value = rankRange;
        selectedCategoryCode.value = categoryCode;
        router.replace(makePath(route.path, {
            period: rankRange,
            category_code: categoryCode,
        }))

        mmon.loading.show();
        try {
            if (!categoryRankingGoods.value[categoryCode]) {
                const ranking = await rankingRepository.getRankingItem('goods-view', `${rankRange}`, `${categoryCode}`, 200);
                rankingItem.value =  ranking;
                likedGoodsRelations.value = await shoppingRepository.getRelationLikedGoods(ranking.goodsIds);
            
                categoryRankingGoods.value[categoryCode] = {
                    rankInfo: rankingItem.value,
                    likedGoodsRelations: likedGoodsRelations.value
                }
            } else {
                rankingItem.value = categoryRankingGoods.value[categoryCode].rankInfo;
                likedGoodsRelations.value = categoryRankingGoods.value[categoryCode].likedGoodsRelations;
            }
        } catch(e) {
            console.log(e);
            defaultCatch(e)
        } finally {
            mmon.loading.hide();
        }
    }

    async function fetchRankingItemByRange(rankRange: string) {
        categoryRankingGoods.value = {};
        selectedRankRange.value = rankRange;
        fetchRankingView(rankRange, selectedCategoryCode.value);
    }
    /** //FUNCTION **/

    (async () => {
        try {
            await fetchRankingView(selectedRankRange.value, selectedCategoryCode.value);
        } catch (e) {
            defaultCatch(e);
        }  
    })();

    return {
        selectedRankRange,
        selectedCategoryCode,
        rankingItem,
        fetchRankingView,
        fetchRankingItemByRange
    }
}

export function useLikeRanking() {
    /** STORE **/
    const { route, router } = usePageContext();
    /** //STORE **/

    /** VARIABLE **/
    const selectedRankRange = ref(`${route.query.period || 'D'}`);
    const selectedCategoryCode = ref(`${route.query.category_code || ''}`);

    const rankingLike = ref<RankingItem|null>(null);
    const likedGoodsRelations = ref<LikedGoods[]>([]);
    const categoryRankingGoods = ref<{ [key: string]: {
        rankInfo: RankingItem,
        likedGoodsRelations: LikedGoods[]
    }}>({});
    /** //VARIABLE **/

    /** FUNCTION **/
    async function fetchRankingLike(rankRange:string, categoryCode: string) {
        selectedRankRange.value = rankRange;
        selectedCategoryCode.value = categoryCode;
        router.replace(makePath(route.path, {
            period: rankRange,
            category_code: categoryCode,
        }))
        
        mmon.loading.show();
        try {
            if (!categoryRankingGoods.value[categoryCode]) {
                const ranking = await rankingRepository.getRankingItem('goods-wish', `${rankRange}`, `${categoryCode}`, 200);
                rankingLike.value =  ranking;
                likedGoodsRelations.value = await shoppingRepository.getRelationLikedGoods(ranking.goodsIds);  
            
                categoryRankingGoods.value[categoryCode] = {
                    rankInfo: rankingLike.value,
                    likedGoodsRelations: likedGoodsRelations.value
                }
            } else {
                rankingLike.value = categoryRankingGoods.value[categoryCode].rankInfo;
                likedGoodsRelations.value = categoryRankingGoods.value[categoryCode].likedGoodsRelations;
            }
        } catch(e) {
            console.log(e);
            defaultCatch(e)
        } finally {
            mmon.loading.hide();
        }
    }

    async function fetchRankingItemByRange(rankRange: string) {
        categoryRankingGoods.value = {};
        selectedRankRange.value = rankRange;
        fetchRankingLike(rankRange, selectedCategoryCode.value);
    }
    /** //FUNCTION **/

    (async () => {
        try {
            await fetchRankingLike(selectedRankRange.value, selectedCategoryCode.value);
        } catch (e) {
            defaultCatch(e);
        }  
    })();

    return {
        selectedRankRange,
        selectedCategoryCode,
        rankingLike,
        fetchRankingLike,
        fetchRankingItemByRange
    }
}

export function useItemRankingMobile(rankingType: 'goods-order'|'goods-view'|'goods-wish') {
    /** STORE **/
    const { route, router } = usePageContext();
    /** //STORE **/
    const periods = [
        {
            code: 'D',
            label: '일간',
        },
        {
            code: 'W',
            label: '주간',
        },
        {
            code: 'M',
            label: '월간',
        },
    ]
    const rankingItem = ref<RankingItem|null>(null);
    const selectedRankRange = ref(`${route.query.period || 'D'}`);
    const selectedCategoryCode = ref(`${route.query.category_code || ''}`);

    async function setCategory(categoryCode: string) {
        selectedCategoryCode.value = categoryCode;
        await fetchRankingItem(selectedRankRange.value, selectedCategoryCode.value);
        router.replace(makePath(route.path, {
            period: selectedRankRange.value,
            category_code: selectedCategoryCode.value,
        }));
    }

    async function setPeriod(period: string) {
        rankingItem.value = null
        selectedRankRange.value = period

        await fetchRankingItem(selectedRankRange.value, selectedCategoryCode.value);
        router.replace(makePath(route.path, {
            period: selectedRankRange.value,
            category_code: selectedCategoryCode.value,
        }))
    }

    async function fetchRankingItem(rankRange: string, categoryCode: string) {
        try {
            rankingItem.value = await rankingRepository.getRankingItem(rankingType, rankRange, categoryCode, 200);
            await shoppingRepository.getRelationLikedGoods(rankingItem.value.goodsIds)
        } catch(e) {
            console.log(e);
            defaultCatch(e)
        }
    }

    (async () => {
        try {
            await fetchRankingItem(selectedRankRange.value, selectedCategoryCode.value);
        } catch (e) {
            defaultCatch(e);
        }  
    })();

    return {
        periods,
        selectedRankRange,
        selectedCategoryCode,
        rankingItem,
        setCategory,
        setPeriod,
    }
}