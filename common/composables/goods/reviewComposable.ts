import { ShoesSize } from "$/@type/configs";
import { MySize } from "$/@type/member/info";
import { useGlobalConfigs } from "$/composables/globalConfigComposable";
import { mySizeRepository } from "$/repository/member/mySizeRepository";
import { computed, ref } from "vue";

export function usePersonalization() {
    /** STORE **/   
    const { globalConfigs } = useGlobalConfigs();

    /** //STORE **/

    /** VARIABLE **/
    const hasPersonalization = computed(() => globalConfigs.value.paidFeatures.personalization);

    return {
        hasPersonalization,
        async getShoesSizes() {
            try {
                return await mySizeRepository.getShoesSizes();
            } catch (e) {
                return []
            }
        },
        async getShoesCategories() {
            try {
                return await mySizeRepository.getShoesCategories()
            } catch (e) {
                return []
            }
        },
        async getFits() {
            try {
                return await mySizeRepository.getFitList()
            } catch (e) {
                return []
            }
        },
        async getMySize() {
            try {
                return await mySizeRepository.getMySize();
            } catch (e) {
                return null
            }
        }
    }
}