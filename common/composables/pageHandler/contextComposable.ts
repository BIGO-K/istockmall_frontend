import { useUserState } from "$/composables/auth/userComposable";
import { useGlobalConfigs } from "$/composables/globalConfigComposable";
import { usePageTitleSetting } from "$/composables/seoComposable";
import { mmon } from "$/helper/mmon";
import { useErrorStore } from "$/store/error";
import { useGlobalConfigStore } from "$/store/globalConfig";
import { storeToRefs } from 'pinia';
import { computed, onMounted, Ref, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MonsAlert } from '$/@type/front';
import { env } from "$/functions";
import moment from 'moment'
import { typeCastBoolean } from "$/filters";

/**
 * 페이지 컨텍스트 처리 
 * @returns 
*/
export function usePageContext() {
    const globalConfigStore =  useGlobalConfigStore();

    const { pageContexts } = storeToRefs(globalConfigStore);
    const { globalConfigs } = useGlobalConfigs();
    const { 
        user,
        isUser,
        isGuestUser,
        guestUser,
        needCertificateAge
    } = useUserState();

    const router = useRouter();
    const route = useRoute(); 
    
    const headerElement = ref<HTMLElement|null>(document.querySelector('.mm_header') as HTMLElement);
    const header:{
        element: Ref<HTMLElement|null>
        refresh: () => void
        rect: () => Omit<DOMRect, 'toJSON'>
        offset: () => { height: number }
    } = {
        element: headerElement,
        refresh: () => {
            headerElement.value = document.querySelector('.mm_header') as HTMLElement
        },
        rect: () => { 
            return headerElement.value?.getBoundingClientRect().toJSON() || {
                bottom: 0,
                height: 0,
                left: 0,
                right: 0,
                top: 0,
                width: 0,
                x: 0,
                y: 0
            } 
        },
        offset: () => {
            const headerElement = document.querySelector('.mm_header') as HTMLElement
            return {
                height: headerElement?.offsetHeight || 0,
            }
        }
    }


    const currentPageContextTop = computed(() => {
        if (pageContexts.value.length < 0) {
            return 0;
        }
        return pageContexts.value
            .find(pageContext => pageContext.key === location.pathname)?.scrollTop || 0;
    })
    
    /** FUNC **/
    function setPageContext(path: string, scrollTop: number) {
        globalConfigStore.applyPageContext({
            key: path,
            scrollTop: scrollTop
        });
    }

    function clearPageContext(path: string) {
        globalConfigStore.clearCurrentPageContext({
            key: path,
            scrollTop: 0
        })
    }

    function applyPosition() {
        window.scrollTo(0, currentPageContextTop.value);
    }

    return {
        mmon: mmon,
        user,
        isUser,
        needCertificateAge,
        isGuestUser,
        guestUser,
        router,
        route,
        setPageContext,
        currentPageContextTop,
        clearPageContext,
        usePageTitleSetting: usePageTitleSetting,
        applyPosition,
        globalConfigs,
        header
    }
}

export function useErrorState() {
    /** STORE **/
    const errorStore = useErrorStore();
    const {
        alertInfo,
        applicationError,
        needLoadingBar
    } = storeToRefs(errorStore)
    /** //STORE **/

    /** VARIABLE **/

    const hasMonsAlert = computed(() => {
        return alertInfo.value.length > 0
    })

    const hasApplicationError = computed(() => {
        return applicationError.value !== null
    })

    /** //VARIABLE **/

    /** FUNC **/

    return {
        monsAlerts: alertInfo,
        hasMonsAlert,
        needLoadingBar,
        hasApplicationError,
        applicationError,
        applyError: errorStore.applyError,
        clearError: errorStore.clearError,
    }
}

export function useMonsAlert(monsAlert: MonsAlert) {
    /** STORE */
    const errorStore = useErrorStore();
    // const {
    //     alertInfo,
    // } = storeToRefs(errorStore);

    const alertInfo = computed(() =>  monsAlert);

    const isActive = computed(() => {
        if (errorStore.alertInfo.length < 1) {
            return false;
        }

        return errorStore.alertInfo[errorStore.alertInfo.length -1].uuid === monsAlert.uuid;
        
    })

    const baseTitle = computed(() => {
        if (alertInfo.value === null) {
            return ''
        }
        if (alertInfo.value.type === 'alert') {
            return '알림'
        } else if (alertInfo.value.type === 'confirm') {
            return '확인'
        } else if (alertInfo.value.type === 'prompt') {
            return '입력'
        } 
    })


    const title = alertInfo.value.options?.title || baseTitle.value;
    const closeButtonLabel =  alertInfo.value.options?.closeButtonLabel || '확인';
    const cancelButtonLabel = alertInfo.value.options?.cancelButtonLabel || '취소';    
    const callbackFunction = typeof(alertInfo.value.callback) === 'function' ? alertInfo.value.callback : (flag, modelValue?) => {}

    const formData = ref<Record<string, any>>({});

    const messageLineBreak = computed(() => {
        // 메시지를 문자열로 감싸줘야지 111 와 같은 number 타입에 대한 처리가 가능하다.
        return `${alertInfo.value.message}`.split('\n').join('<br/>');
    })

    function close() {
        errorStore.closeAlert(alertInfo.value);

        if (alertInfo.value.type === 'prompt') {
            return callbackFunction(true, formData.value);
        }
        callbackFunction(true);
    }
    
    function cancel() {
        errorStore.closeAlert(alertInfo.value);
        callbackFunction(false);
    }

    onMounted(() => {
        alertInfo.value.options?.forms?.forEach((form) => {
            formData.value[form.name] = form.value || '';
        });        
    });

    return {
        type: alertInfo.value.type,
        forms: alertInfo.value.options?.forms || [],
        title,
        closeButtonLabel,
        cancelButtonLabel,
        messageLineBreak,
        formData,
        isActive,
        //func
        close,
        cancel,
        // closePrompt
    }

}

export function useMaintenanceState() {
    const startAt = env('MM_MAINTENANCE_START_AT');
    const endAt = env('MM_MAINTENANCE_END_AT');
    const startWithoutEndAt = typeCastBoolean(env('MM_MAINTENANCE_START_WITHOUT_END'), false)

    const isUnderMaintenance = computed(() => {
        if (!startAt) {
            return false;
        }
        
        return moment().isSameOrAfter(startAt)
            && (moment().isSameOrBefore(endAt) || startWithoutEndAt);
    })

    return {
        startAt,
        endAt,
        startWithoutEndAt,
        isUnderMaintenance,
    }
}