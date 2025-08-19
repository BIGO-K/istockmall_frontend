import { useGlobalConfigStore } from "$/store/globalConfig";
import { storeToRefs } from "pinia";

/**
 * 페이지 타이틀 설정
 * @param title 
 * @param menuTitle 
 * @returns 
 */
export function usePageTitleSetting(
    title?: string,
    menuTitle?: string[],
) {
     /** STORE **/
     const globalConfigStore = useGlobalConfigStore();
     const { 
         globalConfigs,
     } = storeToRefs(globalConfigStore);
     /** //STORE **/

    const titleElement: HTMLTitleElement | null = document.querySelector("title");

    if (!titleElement) {
        return ;   
    }

    if (!title) {
        return titleElement.innerText = `${globalConfigs.value?.seo?.title || ''}`;
    }
    
    const menuTitleText = (menuTitle !== undefined) ? ` < ${menuTitle.join(' < ')}` : '';
    return titleElement.innerText = `${title} ${menuTitleText} - ${globalConfigs.value?.seo.title}`
}