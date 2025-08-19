import { SimplePaginator } from "$/@type";
import { Category } from "$/@type/category";
import { Goods } from "$/@type/goods";
import { useFilterForm } from "$/composables/goods/filterComposable";
import { categoryRepository } from "$/repository/category/categoryRepository";
import { computed, ref } from 'vue';

/**
 * 전체 카테고리 조회
 * @returns 
 */
export function useCategories() {
    /** STORE **/

    /** //STORE **/

    /** VARIABLE **/
    const categories = ref<Category[]>([]);
    
    /** //VARIABLE **/
    (async() => {
        try {
            categories.value = await categoryRepository.getAllCategoryList();            
        } catch(e) {            
            console.log(e);
        }
    })();

    /** FUNC **/    
    /** //FUNC **/

    return {
        categories,        
    }
}

export function useCategoryShop() {
    /** STORE **/

    /** //STORE **/
    const { categories } = useCategories();
    const { searchForm, filters } = useFilterForm();
    /** //VARIABLE **/

    /** FUNC **/
    /** //FUNC **/

    return {
        searchForm, 
        filters,        
        categories        
    }
}
