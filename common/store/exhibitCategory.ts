import { ref } from 'vue';
import { defineStore } from 'pinia'
import { ExhibitCategory } from '$/@type/exhibit';

const key = 'exhibitCategory'

export const useExhibitCategoryStore = defineStore(key, () => {
    /** VARIABLE */
    const exhibitCategoryPageInfo = ref<ExhibitCategory|null>(null);
    const currentExhibitCategoryCode = ref<string>('');
    /** //VARIABLE **/

    /** FUNCTION **/
    function setExhibitCategoryPageInfo(categoryPageInfo: ExhibitCategory | null) {
        exhibitCategoryPageInfo.value = categoryPageInfo
    }
    function setCurrentExhibitCategoryCode(code: string) {
        currentExhibitCategoryCode.value = code;
    }
    /** //FUNCTION **/

    return {
        exhibitCategoryPageInfo,
        currentExhibitCategoryCode,
        setExhibitCategoryPageInfo,
        setCurrentExhibitCategoryCode,
    }
}, {
    persistedState: {
        persist: false,
    }
})