import { ref } from 'vue';
import { defineStore } from 'pinia'
import { LikedGoods } from '$/@type/shopping';
import { unique } from '$/functions';

const key = 'like'

export const useLikeStore = defineStore(key, () => {
    /**
     * 좋아요한 상품 ID 리스트
    */
    const likedGoodsIds = ref<number[]>([]);
    
    /**
     * 좋아요 상품 추가
     * @param goodsIds 상품 ID 배열
    */
    function addLikedGoodsMulti(goodsIds: number[]): void {
        
        const addForNotDuplicateIds = goodsIds.filter(id => !likedGoodsIds.value.includes(id));
        
        if (addForNotDuplicateIds.length < 1) {
            return;
        }
        likedGoodsIds.value = likedGoodsIds.value.concat(addForNotDuplicateIds);
    }
    
    /**
     * 좋아요 정보 추가
     * @param goods : 상품정보
    */
    function addLikedGoodsFromGoodsRelation(goods: LikedGoods[]) {
        const forAddLikedGoods = goods.filter((goods) => goods.liked)
            .map((goods) => goods.goodsId);

        likedGoodsIds.value = unique(forAddLikedGoods).concat(likedGoodsIds.value);
    }

    /**
     * 좋아요 다중 삭제 
     * @param goodsIds : 상품 ID 배열 
    */
    function removeMultiLikedGoods(goodsIds: number[]): void {
        likedGoodsIds.value = likedGoodsIds.value.filter(id => !goodsIds.includes(id));
    }

    return {
        likedGoodsIds,
        addLikedGoodsMulti,
        removeMultiLikedGoods,
        addLikedGoodsFromGoodsRelation,
    }
}, {
    persistedState: {
        storage: sessionStorage,
    },
})