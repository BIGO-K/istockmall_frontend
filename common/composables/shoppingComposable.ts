import { computed, toRefs, ref, reactive } from 'vue';
import { shoppingRepository } from "$/repository/shoppingRepository";
import { useLikeStore } from "$/store/like";
import { storeToRefs } from 'pinia'
import { wishRepository } from "$/repository/member/wishRepository";
import { useAuthStore } from "$/store/auth";
import { useShoppingStore } from "$/store/shopping";
import { mmon } from "$/helper/mmon";
import { UserInfo } from "$/@type/auth/user";
import { CartOptions } from "$/@type/shopping";
import { BaseGoods } from '$/@type/goods';
import { RemoveCartItems } from '$/@type/front';
import { useSetting } from '$/composables/appBridgeComposable';
import { useUserAgent } from '$/composables/commonComposable';
import { unique } from '$/functions';

const forWishedGoodsId = ref<number>();

export function useWishedGoods() {
    function setWishedGoodsId(goodsId: number) {
        forWishedGoodsId.value = goodsId;
    }

    return {
        forWishedGoodsId,
        setWishedGoodsId,
    };
}
const forSizeChartSellerId = ref<number>();

export function useSellerSizeChart() {
    function setSellerId(sellerId: number) {
        forSizeChartSellerId.value = sellerId;
    }

    return {
        setSellerId,
        forSizeChartSellerId,
    };
}

/**
 *
 */

const shared = reactive({
    positionTop: 0,
    isShowSharedSns: false,
    sharedTitle: "",
    sharedContent: "",
    sharedImageUrl: "",
});

export function useSnsShared() {
    function shareDimOpen(
        event: MouseEvent,
        title: string,
        content: string,
        imageUrl?: string
    ) {
        try {
            const target = event.target as HTMLElement;
            const targetTopPosition = target.getBoundingClientRect().top;
            const margin =
                targetTopPosition >= window.innerHeight / 2 ? -105 : 105;
            // 전체 화면 1/2 기준으로 공유 버튼 위치에 따라 다르게 위치
            shared.positionTop = targetTopPosition + margin;
        } catch (e) {
            // 혹시라도 타켓이 없는 경우
            shared.positionTop = window.innerHeight / 2;
            console.log(e);
        } finally {
            shared.sharedTitle = title;
            shared.sharedContent = content;
            shared.sharedImageUrl = imageUrl ?? "";
            shared.isShowSharedSns = true;
        }
    }

    function close() {
        shared.isShowSharedSns = false;
    }

    return {
        shareDimOpen,
        ...toRefs(shared),
        close,
    };
}

const zoomImages = ref<string[]>([]);

export function useZoomImages() {
    function setImage(imageUrls: string[]) {
        zoomImages.value = imageUrls;
    }
    return {
        setImage,
        zoomImages,
    };
}
/**
 * 상품 좋아요 처리 
 * @param goodsIds : number|number[]
 * @returns { isLiked: ComputedRef<Boolean> , likedGoods: ComputedRef<number[]> }
*/
export function useLikedGoods(goodsIds: number|number[]) {
    /**
     * STORE
    */
    const likedStore = useLikeStore();
    
    //  DATA
    const forUseLikeGoodsId = Array.isArray(goodsIds) ? goodsIds : [goodsIds];
    const isLiked = computed(() => {
        return likedStore.likedGoodsIds.includes(forUseLikeGoodsId[0])
    });
    const likedGoodsIds = computed(() => likedStore.likedGoodsIds);
    
    /**
     * 삭제처리 
    */
    function removeLiked() {
        try {
            wishRepository.deleteWishGoods(forUseLikeGoodsId);
        } catch(e) {
            return e;
        }
    }

    /**
     * 추가 처리
    */
    function addLiked(folderId: number) {       
        try {
            wishRepository.addWishGoods(forUseLikeGoodsId[0], folderId);
        } catch(e) {
            return e;
        }
    }

    return {
        likedGoodsIds,
        isLiked,
        removeLiked,
        addLiked
    }
}

/**
 * UUID 생성함수 
 * @param isForceUpdate : 강제 업데이트 여부
*/
export function useGenerateUuid(isForceUpdate?: boolean) {
    /**
    * STORE
    */
    const userStore = useAuthStore(); 
    // DATA 
    const { uuid } = storeToRefs(userStore);
    // FUNCTION 

    (async() => {
        if (uuid.value && !isForceUpdate) {
            return;
        }                
        
        try {
            const uniqueId = await shoppingRepository.shopperUuid()
            userStore.setUuid(uniqueId);
        } catch (e) {
            console.log(e);
        }
    })();
}

/**
 * 최근 검색어 
 * @returns 
*/
export function useRecentKeywords() {
    /** STORE **/
    const store = useShoppingStore();    
    /** //STORE **/

    /** VARIABLE **/
    const searchRecords = computed(() => {
        if (store.recentSearchRecords.length < 1) {
            return []
        }

        return [...store.recentSearchRecords].reverse().slice(-10);
    })
    /** //VARIABLE **/

    /** FUNC **/
    function addRecord(keyword: string) {
        store.addRecentSearchRecord(keyword);
    }

    function removeRecentSearchRecord(keyword: string) {
        mmon.bom.confirm('최근 검색어를 삭제하시겠습니까?', (flag: boolean) => {
            if (flag) {
                store.removeRecentSearchRecord(keyword)
            }
        })        
    }

    function clearRecentSearchRecords() {
        mmon.bom.confirm('최근 검색어를 모두 삭제하시겠습니까?', (flag: boolean) => {
            if (flag) {
                store.clearRecentSearchRecords();
            }
        })
    }

    /** //FUNC **/

    return {
        recentSearchRecords: searchRecords,
        addRecord,
        removeRecentSearchRecord,
        clearRecentSearchRecords
    }
}


export function useRecentCart() {
    /** STORE **/
    const store = useShoppingStore();        
    /** //STORE **/

    /** VARIABLE **/
    const inCartGoodsCount = computed(() => store.cartGoodsCount)
    /** //VARIABLE **/

    /** FUNC **/

    /** //FUNC **/

    return {
        inCartGoodsCount
    }
}
/**
 * 최근본 상품 리턴
 */
export function useRecentViewGoods() {
    /** STORE **/
    const store = useShoppingStore();
    const { isMobileUser } = useUserAgent();
    /** //STORE **/

    /** VARIABLE **/
    const recentViewGoods = computed<BaseGoods[]>(() => {
        return store.recentViewGoodsRecords;
    })

    const mostRecentGoodsThumbnailUrl = computed(() => {
        if (!isMobileUser) {
            return recentViewGoods.value[0]?.thumbnailUrl ?? '';        
        }

        if (recentViewGoods.value.length < 2) {
            return ''
        }

        return recentViewGoods.value[1]?.thumbnailUrl ?? '';        
    })
    /** //VARIABLE **/

    /** FUNC **/

    /** //FUNC **/

    return {
        recentViewGoods,
        mostRecentGoodsThumbnailUrl
    }
}

export function useRecentShopping() {
    /** STORE **/
    const {
        recentViewGoods,
        mostRecentGoodsThumbnailUrl
    } = useRecentViewGoods();

    const {
        recentSearchRecords,
        addRecord,
        removeRecentSearchRecord,
        clearRecentSearchRecords
    } = useRecentKeywords();

    const { inCartGoodsCount } = useRecentCart();
    /** //STORE **/

    /** VARIABLE **/  

    /** //VARIABLE **/

    /** FUNC **/
    /** //FUNC **/

    return {
        recentSearchRecords,
        recentViewGoodsRecords: recentViewGoods,
        inCartGoodsCount,
        mostRecentGoodsThumbnailUrl,
        addRecentSearchRecord: addRecord,
        removeRecentSearchRecord,
        clearRecentSearchRecords,

    }
}


/**
 * 쇼핑 정보 갱신
 * @returns 
 */
export function useSyncShoppingData() {
    /** STORE **/
	const userAuthStore = useAuthStore();
    const shoppingStore = useShoppingStore();
    const { syncFirebaseToken } = useSetting();

    /** //STORE **/

    /** VARIABLE **/

    /** //VARIABLE **/

    /** FUNC **/
    /**
	 * 로그인전 쇼핑 데이터 동기화 처리 
	*/
	async function syncRecentShoppingData(userInfo: UserInfo, useIdRemember: boolean) {

		try {
			const [cartGoods] = await Promise.all([
				shoppingRepository.getCartList(),
			]);

			const legacyRecentViewGoods:BaseGoods[] = shoppingStore.recentViewGoodsRecords;
			const legacyCartOptions = ref<CartOptions[]>([]);

			const { cartList } = cartGoods;
			cartList.forEach((cart) => { 
				cart.items.forEach((items) => {
					legacyCartOptions.value.push(
						{
							option_id: items.optionId,
							ea: items.ea
						}
					)
				});
			});

			userAuthStore.applyUserContext(userInfo);

			if (legacyCartOptions.value.length > 0) {
				shoppingRepository.addCart(legacyCartOptions.value);
			}

			const currentUserRecentViewGoods:BaseGoods[] = await shoppingRepository.getRecentViewGoods();
			Promise.all(
				[
					shoppingRepository.cartCountSync(),
                    shoppingStore.replaceRecentViewGoodsRecord(unique(currentUserRecentViewGoods.concat(legacyRecentViewGoods))),
					userAuthStore.applySaveId(useIdRemember ? userInfo.user.loginId : ''),
                    syncFirebaseToken(),				
					userAuthStore.resetFailCount(),
                    userAuthStore.clearGuestUserContext(),		
				]
			);  
		} catch (e) {
			console.log(e);
			throw(e);
		}
	}
    /** //FUNC **/

    return {
        syncRecentShoppingData
    }
}

export function useOrderCartItems() {
    /** STORE **/
    const shoppingStore = useShoppingStore();
    const { forRemoveCartIdsInOrder } = storeToRefs(shoppingStore)
    /** //STORE **/

    /** VARIABLE **/
    

    /** //VARIABLE **/

    /** FUNC **/
    function addRecord(forRemoveCartItem : RemoveCartItems) {
        forRemoveCartIdsInOrder.value = forRemoveCartIdsInOrder.value.concat(forRemoveCartItem);
    }

    function removeRecord(orderId: string) {
        forRemoveCartIdsInOrder.value = forRemoveCartIdsInOrder.value.filter((removeItem) => {
            return removeItem.orderId !== orderId
        });
    }

    /** //FUNC **/

    return {
        addRecord
    }
}