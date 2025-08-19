import { MainBanner } from "$/@type/mainBanner"
import { storeToRefs } from "pinia";
import { useGlobalConfigStore } from "$/store/globalConfig";
import { computed, onMounted, ref } from "vue"
import { mainBannerRepository } from "$/repository/mainBannerRepository";
import { useClosePopup } from '$/composables/popupComposable'
import { useMaintenanceState } from '$/composables/pageHandler/contextComposable'
import { useMainBannerStore } from "$/store/mainBanner";
import { TopBanner, WingBanner } from "$/@type/exhibit";
import { exhibitRepository } from "$/repository/exhibitRepository";

export function useMainBanner() {
    /** STORE **/
    const globalConfigStore = useGlobalConfigStore();
    const { 
        globalConfigs,
    } = storeToRefs(globalConfigStore);
    const { isUnderMaintenance } = useMaintenanceState()
    /** //STORE **/

    /** VARIABLE **/
    const mainPopupInfo = ref<{
        show: boolean,
        type: string,
        version: string,
        banners: MainBanner[],
    }>({
        show: false,
        type: '',
        version: '',
        banners: [],
    })
    const { isShowPopup } = useClosePopup()

    /** //VARIABLE **/

    /** FUNC **/
    onMounted(async() => {
        if (isUnderMaintenance.value) {
            return;
        }
        mainPopupInfo.value.show = isShowPopup('IS_MAIN_POPUP_HIDE') !== true;
        if (mainPopupInfo.value.show === true) {
            mainPopupInfo.value.type = globalConfigs.value.design.pcMainPopupType
            mainPopupInfo.value.version = globalConfigs.value.design.pcMainPopupVersion
            mainPopupInfo.value.banners = await mainBannerRepository.getMainPopup()
        }
    })

    /** //FUNC **/

    return {
        mainPopupInfo
    }
}

/**
 * 탑배너
 */
export function useTopBanner() {
    /** VARIABLE **/
    const topBanner = ref<TopBanner|null>(null);
    /** //VARIABLE **/
    const getBanner = async() => {
        try {
            topBanner.value = await exhibitRepository.getTopBanner();
        } catch (e) {
            console.log(e);
        }
    }
    
    return {
        topBanner,
        getBanner,
    }
}

export function useTopBannerHide() {
    /** STORE **/
    const store = useMainBannerStore();
    const { isHideTopBanner } = storeToRefs(store);
    /** //STORE **/

    return {
        hide: store.hideTopBanner,
        isHide: computed<boolean>(() => isHideTopBanner.value ),
    }
}

/**
 * 윙배너
 */
export function useWingBanner() {
    /** STORE **/  
    const { setPopupContext, isShowPopup } = useClosePopup() 
    /** //STORE **/
    /** VARIABLE **/
    const isHideWingBanner = computed<boolean>(() => isShowPopup('IS_WING_BANNER_HIDE'))
    const wingBanners = ref<WingBanner[]>([]);
    const extendedBanner = ref<WingBanner|null>();
    /** //VARIABLE **/
    /** FUNCTION **/
    function setExtendedBanner (targetBanner: WingBanner) {
        extendedBanner.value = targetBanner;
    }
    function hide() {
        setPopupContext('IS_WING_BANNER_HIDE', true)
    }
    /** // FUNCTION **/
    /** //STORE **/
    (async () => {
        try {
            wingBanners.value = await exhibitRepository.getWingBanners();
            extendedBanner.value = wingBanners.value[0];
        } catch (e) {
            console.log(e);
        }
    })()

    return {
        wingBanners,
        extendedBanner,
        isHide: isHideWingBanner,
        hide,
        setExtendedBanner,
    }
}