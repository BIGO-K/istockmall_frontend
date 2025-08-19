import { BaseGoods } from "$/@type/goods";
import { useFilterForm } from "$/composables/goods/filterComposable";
import { sellerShopRepository } from "$/repository/goods/sellerShopRepository";
import { ref, watchEffect } from 'vue';

export function useSellerShop(sellerId: number) {
    /** STORE **/

    /** //STORE **/

    /** VARIABLE **/
    const sellerName = ref('');
    const bestGoods = ref<BaseGoods[]>([]);
    const newGoods = ref<BaseGoods[]>([]);
    const { searchForm, filters } = useFilterForm();
    /** //VARIABLE **/

    /** FUNC **/

    /** //FUNC **/
    
    const initialize = watchEffect(async() => {
        const [{ name }, curations] = await Promise.all([
            sellerShopRepository.sellerInfo(sellerId),
            sellerShopRepository.getCurations(sellerId),
        ])

        sellerName.value = name;
        bestGoods.value = curations.bestGoods;
        newGoods.value = curations.newGoods
    });


    initialize();
    

    return {
        sellerName,
        bestGoods,
        newGoods,
        searchForm,
        filters
    }
}