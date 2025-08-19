import { Block, BlockContext } from "$/@type/block";
import { Banner } from "$/@type/block/item";
import { BlockItemPaginator, GoodsGroup } from "$/@type/block/partition";
import { useBlockContextStore } from "$/store/blockContext";
import { computed, Ref, ref, watch } from "vue";
import { pluck, shuffle } from '$/functions';
import { useUserState } from "$/composables/auth/userComposable";
import { shoppingRepository } from "$/repository/shoppingRepository";
import { usePageContext } from "$/composables/pageHandler/contextComposable";

/**
 * 블록 배너팝업 데이터
 */
const bannersPopupData: {
    bannerList: Ref<Banner[]>
    blockName: Ref<string>
    popupTitle: Ref<string>
} = {
    bannerList: ref<Banner[]>([]),
    blockName: ref<string>(''),
    popupTitle: ref<string>(''),
}
/**
 * 블록 배너팝업기능
 * @returns 
 */
export function useBannersPopup() {
    const { router, route } = usePageContext();
    const setBannersPopup = (blockMuiCode: string, title: string, banners: Banner[]) => {
        bannersPopupData.bannerList.value = banners;
        bannersPopupData.blockName.value = blockMuiCode;
        bannersPopupData.popupTitle.value = title;
    }

    const clearBannersPopup = () => {
        bannersPopupData.bannerList.value = [];
        bannersPopupData.blockName.value = '';
        bannersPopupData.popupTitle.value = '';
    }

    (() => {
        if (bannersPopupData.bannerList.value.length < 1 && route.hash === '#BLOCK_BANNER_LIST') {
            return router.replace( {hash: undefined });
        }
    })();

    return {
        clearBannersPopup,
        setBannersPopup,
        bannersPopupData
    }
}

/**
 * 블록아이템 페이지네이터 상태저장 기능
 * @param paginator 블록아이템 페이지네이터
 * @param blockName 블록명
 * @returns 
 */
export function useBlockPaginationContext(contextCode: string) {
    
    /** STORE */
    const { paginatorList, pageNumber } = useBlockContext(contextCode);
    /** //STORE */

    /** FUNCTION */
    /**
     * 페이지네이터 상태 저장
     * @returns 
     */
    function savePaginatorContext(page: number, newList: BlockContext['paginatorList']) {
        try {
            paginatorList.value = newList || [];
            pageNumber.value = page > 0 ? page : 1;
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 페이지네이터 상태 적용
     * @returns 
     */
    function applyPaginatorContext<T extends BlockItemPaginator>(paginator: T) {
        try {
            if (!paginator || (paginatorList.value?.length || 0) < 1) {
                return;
            }
    
            if (paginator.hasOwnProperty('banners')) {
                paginator.banners = paginatorList.value as BlockItemPaginator['banners']
                paginator.currentPage = pageNumber.value || 1;
            } else if (paginator.hasOwnProperty('goodsList')) {
                paginator.goodsList = paginatorList.value as BlockItemPaginator['goodsList']
                paginator.currentPage = pageNumber.value;
            } else if (paginator.hasOwnProperty('jointPurchaseList')) {
                paginator.jointPurchaseList = paginatorList.value as BlockItemPaginator['jointPurchaseList']
                paginator.currentPage = pageNumber.value;
            } else if (paginator.hasOwnProperty('raffleList')) {
                paginator.raffleList = paginatorList.value as BlockItemPaginator['raffleList']
                paginator.currentPage = pageNumber.value;
            }
        } catch (e) {
            console.log(e);
        }
    }
    /** //FUNCTION */

    return {
        applyPaginatorContext,
        savePaginatorContext,
    }
}

/**
 * 블록 컨텍스트
 * @param contextCode 블록 컨텍스트 식별 CODE
 * @returns 
 */
export function useBlockContext(contextCode: string) {
    /** STORE **/
    const { getContext, setContext } = useBlockContextStore();
    /** //STORE **/

    /** VARIABLE **/
    // 블록 CONTEXT
    const blockContext = ref<BlockContext>(getContext(contextCode));
    
    // 블룩 CONTEXT > 캐러셀 INDEX
    const carouselIndex = computed<number>({
        get() {
            return blockContext.value.carouselIndex || 0;
        },
        set(newIndex: number) {
            blockContext.value.carouselIndex = newIndex;
        }
    })
    // 블룩 CONTEXT > 슬라이더 SCROLL INDEX
    const sliderScrollPosition = computed<number>({
        get() {
            return blockContext.value.sliderScrollPosition || 0;
        },
        set(newPosition: number) {
            blockContext.value.sliderScrollPosition = newPosition;
        }
    })
    // 블룩 CONTEXT > 슬라이더 INDEX
    const sliderIndex = computed<number>({
        get() {
            return blockContext.value.sliderIndex || 0;
        },
        set(newIndex: number) {
            blockContext.value.sliderIndex = newIndex;
        }
    })
    // 블룩 CONTEXT > 슬라이더 INDEX
    const isShowMore = computed<boolean>({
        get() {
            return blockContext.value.isShowMore || false;
        },
        set(isShow: boolean) {
            blockContext.value.isShowMore = isShow;
        }
    })
    // 블룩 CONTEXT > 슬라이더 SCROLL INDEX
    const tabId = computed<number>({
        get() {
            return blockContext.value.tabId || 0;
        },
        set(newTabId: number) {
            blockContext.value.tabId = newTabId;
        }
    })
    // 블룩 CONTEXT > 상품순서
    const goodsOrder = computed<number[]>({
        get() {
            return blockContext.value.goodsOrder || [];
        },
        set(newOrder: number[]) {
            blockContext.value.goodsOrder = newOrder;
        }
    })
    // 블룩 CONTEXT > 페이지네이터 리스트
    const paginatorList = computed<BlockContext['paginatorList']>({
        get() {
            return blockContext.value.paginatorList || [];
        },
        set(newList: BlockContext['paginatorList']) {
            blockContext.value.paginatorList = newList;
        }
    })
    // 블룩 CONTEXT > 페이지 넘버
    const pageNumber = computed<BlockContext['pageNumber']>({
        get() {
            return (blockContext.value.pageNumber || 0) > 0 ? blockContext.value.pageNumber : 1;
        },
        set(newPageNumber: BlockContext['pageNumber']) {
            blockContext.value.pageNumber = newPageNumber;
        }
    })
    /** //VARIABLE **/

    /** FUNCTION **/
    /**
     * 블록 컨텍스트 SET
     * @param newContext 
     */
    function setBlockContext(newContext: Omit<BlockContext, 'code'>) {
        setContext(Object.assign({ code: contextCode }, newContext));
    }
    /** //FUNCTION **/

    watch(blockContext, (to) => {
        if (contextCode === '' || Object.keys(to).length < 1) {
            return;
        }
        setContext({
            ...blockContext.value
        }); 
    }, {
        deep: true
    });

    return {
        carouselIndex,
        sliderIndex,
        sliderScrollPosition,
        isShowMore,
        goodsOrder,
        tabId,
        paginatorList,
        pageNumber,
        setBlockContext,
    }
}

export function useMoreButton<T extends BlockItemPaginator>(
    contextCode: string, 
    option?: { 
        target?: T|null, 
        defaultTitle?: string, 
        moreTitle?: string
    }
) {
    /** STORE **/
    const { isShowMore } = useBlockContext(contextCode);
    /** //STORE **/

    /** VARIABLE **/
    // 버튼 TITLE
    const defaultTitle = option?.defaultTitle || '접기'
    const moreTitle = option?.moreTitle || '더보기'
    const buttonTitle = computed<string>(() => {
        return isShowMore.value ? defaultTitle : moreTitle
    })
    // 버튼 노출여부
    const showButton = computed<boolean>(() => {
        if (!option?.target) {
            return true;
        }
        let listCount = 0;
        const perPage = option?.target.perPage || 0;
        if ('banners' in option.target && option.target.banners) {
            listCount = option.target.banners.length;
        } else if ('goodsList' in option.target && option.target.goodsList) {
            listCount = option.target.goodsList.length
        } else if ('jointPurchaseList' in option.target && option.target.jointPurchaseList) {
            listCount = option.target.jointPurchaseList.length
        } else if ('raffleList' in option.target && option.target.raffleList) {
            listCount = option.target.raffleList.length
        }
        
        return listCount > perPage;
    })
    /** //VARIABLE **/

    /** FUNCTION **/
    function toggle() {
        isShowMore.value = !isShowMore.value;
    }
    /** //FUNCTION **/

    return {
        isShowMore,
        buttonTitle,
        showButton,
        toggle,
    }
}

export function useRefreshButtonWithRef(contextCode: string, target: Ref<GoodsGroup|null>) {
    /** STORE **/
    const { goodsOrder } = useBlockContext(contextCode);
    /** //STORE **/

    /** VARIABLE **/
    const showButton = computed<boolean>(() => (target.value?.goodsList || []).length > (target.value?.perPage || 0));
    /** //VARIABLE **/

    /** FUNCTION **/
    function shuffleList() {
        if (target.value == null) {
            return;
        }

        target.value.goodsList = shuffle(target.value.goodsList, [], false)
        goodsOrder.value = pluck(target.value.goodsList, 'id');
    }
    /** //FUNCTION **/

    (() => {
        if (target.value == null) {
            return;
        }

        // 기존순서로 sort
        target.value.goodsList = shuffle(target.value.goodsList, goodsOrder.value, true);
    })();

    watch(target, (to) => {
        if (!to) {
            return;
        }
        goodsOrder.value = pluck(to.goodsList, 'id');
    }, {
        immediate: true
    })

    return {
        showButton,
        shuffleList,
    }
}

export function useRefreshButton(contextCode: string, target: GoodsGroup|null) {
    /** STORE **/
    const { goodsOrder } = useBlockContext(contextCode);
    /** //STORE **/
    
    /** VARIABLE **/
    const showButton = computed<boolean>(() => (target?.goodsList || []).length > (target?.perPage || 0));
    const displayingList = computed<GoodsGroup['goodsList']>(() => {
        return (target?.goodsList || []).slice(0, target?.perPage);
    })
    /** //VARIABLE **/

    /** FUNCTION **/
     function shuffleList() {
        if (!target) {
            return;
        }

        target.goodsList = shuffle(target.goodsList, [], false)
        goodsOrder.value = pluck(target.goodsList, 'id');
    }
    /** //FUNCTION **/
    (() => {
        if (!target) {
            return;
        }
        // 기존순서로 sort
        target.goodsList = shuffle(target.goodsList, goodsOrder.value, true);
    })();

    return {
        displayingList,
        showButton,
        shuffleList,
    }
}

export function useBlockLikedGoods(goodsIdList: number[]) {
    /** STORE **/
    const { isUser } = useUserState();
    /** //STORE **/
    
    /** FUNCTION **/
    async function applyLikedGoods(goodsIds: number[]) {
        try {
            await shoppingRepository.getRelationLikedGoods(goodsIds, false);
        } catch (e) {
            // console.log(e)
        }
    }
    /** //FUNCTION **/

    (() => {
        if (!isUser.value || goodsIdList.length < 1) {
            return;
        }
        applyLikedGoods(goodsIdList);
    })();
    
    return {
        applyLikedGoods
    }
}

export function useTabBlock(block: Block, isRandom = false) {
    /** STORE **/
    const { tabId: selectedTabId } = useBlockContext(`${block.id}_${block.name}`);
    /** //STORE **/

    /** VARIABLE */
    const activeTab = computed(() => {
        return selectedTabId.value ? block.tabs?.find((tab) => tab.id == selectedTabId.value) : null;
    });
    const currentTabIndex = ref<number>(0);

    const activeGoodsList = computed(() => activeTab.value ? (activeTab.value.goodsGroup?.goodsList || []) : []);
    const activeBannerList = computed(() => activeTab.value ? (activeTab.value.bannerPartition?.banners || []) : []);
    const goodsPerPage = computed<number>(() => activeTab.value ? (activeTab.value.goodsGroup?.perPage || 0) : 0)
    const bannerPerPage = computed<number>(() => activeTab.value ? (activeTab.value.bannerPartition?.perPage || 0) : 0)

    /** // VARIABLE */

    /** FUNCTION */
    function changeTab(tabId: number) {
        selectedTabId.value = tabId
        currentTabIndex.value = (block.tabs || []).findIndex(tab => tab.id === tabId) || 0;
    }
    /** // FUNCTION */

    (() => {
        if (selectedTabId.value || !block.tabs?.length) {
            return;
        }
        
        const initIndex = isRandom ? Math.floor(Math.random() * block.tabs.length) : 0;
        selectedTabId.value = block.tabs[initIndex].id;
        currentTabIndex.value = initIndex;
    })();

    return {
        selectedTabId,
        currentTabIndex,
        activeGoodsList,
        activeBannerList,
        goodsPerPage,
        bannerPerPage,
        activeTab,
        changeTab
    }
    
}