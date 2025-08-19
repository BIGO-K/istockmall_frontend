import { ref, computed } from 'vue';
import { defineStore } from 'pinia'
import { BaseSearchWords, SearchPageContext } from '$/@type/front';
import { useNow } from '@vueuse/core';

const key = 'search'

export const useSearchStore = defineStore(key, () => {
    const basicKeywords = ref<BaseSearchWords[]>([]);
    const basicKeywordsRecentFetchTime = ref<Date|null>(null);
    const searchPageContext = ref<SearchPageContext|null>(null)


    const needRefreshBasicKeyword = computed(() => {
        if (basicKeywordsRecentFetchTime.value === null) {
            return true;
        }
        
        const diffTimes = Math.abs(basicKeywordsRecentFetchTime.value.getTime() - useNow().value.getTime());
        return Math.round((diffTimes / 1000) / 60) >= 9;
    })
    /**
     * 기본 검색어 설정
     * @param keywords 
    */
    function setBasicKeywords(keywords: BaseSearchWords[]) {
        basicKeywords.value = keywords;
        basicKeywordsRecentFetchTime.value = useNow().value
    }

    function applySearchPageContext(context: SearchPageContext) {
        searchPageContext.value = context;
    }

    return {
        needRefreshBasicKeyword,
        searchPageContext,
        basicKeywords,
        setBasicKeywords,
        applySearchPageContext
    }

}, {
    persistedState: {
        storage: sessionStorage,
    },
})