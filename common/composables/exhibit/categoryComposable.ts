import { exhibitRepository } from "$/repository/exhibitRepository";
import { useExhibitCategoryStore } from "$/store/exhibitCategory";
import { computed } from "vue"

export function useExhibitCategory(code: string) {
    const store = useExhibitCategoryStore();
    const isFetched = computed<boolean>(() => store.currentExhibitCategoryCode == code);
    const exhibitCategoryPageInfo = computed(() => store.exhibitCategoryPageInfo)
    const isPageExists = computed(() => exhibitCategoryPageInfo.value !== null)
    
    /**
     * 1뎁스 전시페이지 조회
     */
    async function fetchExhibitCategory() {
        if (isFetched.value) {
            return
        }

        const categoryPageInfo = await exhibitRepository.get1DepthCategory(code);
        store.setExhibitCategoryPageInfo(categoryPageInfo)
        store.setCurrentExhibitCategoryCode(code);
    }

    /**
     * 1뎁스 전시페이지 store 데이터 클리어
     */
    function clearExhibitCategory() {
        store.$reset();
    }
    
    return {
        exhibitCategoryPageInfo,
        isFetched,
        isPageExists,
        fetchExhibitCategory,
        clearExhibitCategory,
    }
}