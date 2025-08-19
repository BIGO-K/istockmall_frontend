
import { ref } from 'vue';
import { defineStore } from 'pinia'
import { RecentSearchRecord, RemoveCartItems } from '$/@type/front';
import { BaseGoods } from '$/@type/goods';

const key = 'shopping'
const recentViewGoodsLimit = 50

export const useShoppingStore = defineStore(key, () => {
    const recentViewGoodsRecords = ref<BaseGoods[]>([]);
    const recentSearchRecords = ref<RecentSearchRecord[]>([]);
    const cartGoodsCount = ref<number>(0);    
    const forRemoveCartIdsInOrder = ref<RemoveCartItems[]>([]);

    /**
     * 최근본 상품 데이터 교체 처리  
     * @param records
    */
    function replaceRecentViewGoodsRecord(records: BaseGoods[]) {
        recentViewGoodsRecords.value = records.slice(0, recentViewGoodsLimit);
    }

    function addRecentViewGoodsRecord(record: BaseGoods) {
        const legacyRecord = recentViewGoodsRecords.value.find((storeRecord: BaseGoods) => storeRecord.id === record.id)
        if (legacyRecord) {
            recentViewGoodsRecords.value = recentViewGoodsRecords.value
                .filter((recent: BaseGoods) => record.id !== recent.id);
        } 

        recentViewGoodsRecords.value = ([record].concat(recentViewGoodsRecords.value)).slice(0, recentViewGoodsLimit)

        return {
            isNewRecord: legacyRecord === undefined,
        }
    }

    function clearRecentViewGoodsRecords() {
        recentViewGoodsRecords.value = [];
    }

    function addRecentSearchRecord(keyword: string) {
        const legacyRecord = recentSearchRecords.value.find((record: RecentSearchRecord) => record.keyword == keyword)

        if (legacyRecord) {
            recentSearchRecords.value = recentSearchRecords.value
            .filter((record: RecentSearchRecord) => record.keyword != keyword)
            .concat({
                keyword,
                searchCount: legacyRecord.searchCount + 1,
                recentSearchedAt: new Date(),
            })
        } else {
            recentSearchRecords.value = recentSearchRecords.value.concat({
                keyword,
                searchCount: 1,
                recentSearchedAt: new Date(),
            })
        }
    }

    function removeRecentSearchRecord(keyword: string) {
        recentSearchRecords.value = recentSearchRecords.value
            .filter((record: RecentSearchRecord) => record.keyword != keyword)
    }

    function clearRecentSearchRecords() {
        recentSearchRecords.value = [];
    }

    function changeCartCount(count: number) {
        cartGoodsCount.value = count;
    }

    function addRemoveCartIdsInOrder(removeCartItems: RemoveCartItems) {
        forRemoveCartIdsInOrder.value = forRemoveCartIdsInOrder.value.concat(removeCartItems);
    }

    function changeRemoveCartIdsInOrder(orderId: string) {
        forRemoveCartIdsInOrder.value = forRemoveCartIdsInOrder.value.filter((cartIdsInOrder) => {
            return cartIdsInOrder.orderId !== orderId
        })
    }

    return {
        recentViewGoodsRecords,
        recentSearchRecords,
        cartGoodsCount,
        forRemoveCartIdsInOrder,
        // func
        addRecentViewGoodsRecord,
        replaceRecentViewGoodsRecord,
        clearRecentViewGoodsRecords,
        addRecentSearchRecord,
        removeRecentSearchRecord,
        clearRecentSearchRecords,
        changeCartCount,
        addRemoveCartIdsInOrder,
        changeRemoveCartIdsInOrder
    }
}, {
    persistedState: {
        storage: localStorage,
    },
})