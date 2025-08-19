import { ref, watch } from 'vue';
import { useIntervalFn } from '@vueuse/core';
import { useUserAgent } from '$/composables/commonComposable';

type PopupWindowOptions = {
    target?: string
    width?: number
    height?: number
    left?: number
    top?: number
    resizable?: boolean
    scrollbars?: boolean
    location?: boolean
}

export const usePopupWindow = (
    url: string, 
    options?: PopupWindowOptions
) => {

    const { isMobileUser } = useUserAgent();

    if (!isMobileUser) {
        options.top = window.top.outerHeight / 2  + window.top.screenY - (options.height / 2);
        options.left = window.top.outerWidth / 2  + window.top.screenX - (options.width / 2);
    }

    const features = [
        options?.width != undefined ? `width=${options.width}` : '',
        options?.height != undefined ? `height=${options.height}` : '',
        options?.left != undefined ? `left=${options.left}` : '',
        options?.top != undefined ? `top=${options.top}` : '',
        `scrollbars=${options?.scrollbars ? 'yes' : 'no'}`,
        `resizable=${options?.resizable ? 'yes' : 'no'}`,
        `location=${options?.location ? 'yes' : 'no'}`,
    ].filter(v => v).join(',')

    const popupWindow = ref<Window | null>(null)
    const popupWindowClosed = ref(false)

    const popupWindowIntervalHandle = useIntervalFn(() => {
        if (popupWindow.value?.closed === true) {
            popupWindowClosed.value = true
        }
    }, 1000,
    {
        immediate: false,
    })
    
    return {
        open: () => {
            popupWindow.value = window.open(
                url,
                options?.target,
                features
            )
        
            if (!popupWindow.value) {
                return Promise.reject(new Error('팝업 차단 해제 후 다시 시도해주세요.'));
            }

            popupWindowIntervalHandle.resume()

            return new Promise<void>((resolve) => {
                watch(popupWindowClosed, closed => {
                    if (closed) {
                        resolve()
                    }
                })
            })
        },
    }
}