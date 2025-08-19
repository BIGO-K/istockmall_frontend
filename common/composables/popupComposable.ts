import { usePopupStore } from "$/store/popup"
import { storeToRefs } from 'pinia';
import moment from 'moment';

export function useClosePopup () {
    /** STORE **/
    const popupStore = usePopupStore();
    /** //STORE **/

    /** VARIABLE **/
    const { popupContexts } = storeToRefs(popupStore);
    /** //VARIABLE **/

    /** FUNC **/
    function setPopupContext(key: string, isTodayClose: boolean, closeDate?: string) {
        popupStore.applyPopupContext({
            key: key, 
            isTodayClose: isTodayClose,
            closeDate: closeDate ? closeDate : moment().format('YYYY-MM-DD')
        })
    }

    function isShowPopup(key: string) {
        if (popupContexts.value.length < 1) {
            return false;
        }

        const currentPopupDate = popupContexts.value.find(popupContext => popupContext.key === key)?.closeDate

        if (currentPopupDate !== undefined && currentPopupDate >= moment().format('YYYY-MM-DD')) {
            return true
        } else {
            popupContexts.value = popupContexts.value.filter(popupContext => popupContext.key != key)
            return false
        }
    }

    /** //FUNC **/

    return {
        setPopupContext,
        isShowPopup
    }
}