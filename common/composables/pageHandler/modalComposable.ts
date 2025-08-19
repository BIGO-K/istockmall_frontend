import {  ModalOpenOption } from '$/@type/Modal';
import { useModalStore } from '$/store/modal';
import { useModalPopupStore } from '$/store/modalPopup';
import { storeToRefs } from 'pinia';
import { computed, shallowRef, Component } from 'vue';


export function useModalState() {
    /** STORE **/
    const store = useModalStore();    
    /** //STORE **/

    /** VARIABLE **/
    const isModalOn = computed(() => {
        return store.forOpenModals.find((layer) => layer.isActive) || false
    })

    const modalLayers = computed(() => {
        return store.forOpenModals;
    })
    /** //VARIABLE **/

    /** FUNC **/

    /** //FUNC **/

    return {
        isModalOn,
        modalLayers
    }
}

/**
 * @param { string } targetName : 모달 타켓명
 * @returns 
 */
export function useModal() {
    /** STORE **/
    const store = useModalStore();    

    /** //STORE **/

    /** VARIABLE **/

    /** //VARIABLE **/

    /** FUNC **/
    async function open<Props extends object, ModalCloseContext extends object | string | undefined>(
        component: Component,
        options?: ModalOpenOption<Props, ModalCloseContext>
    ) {
        if (typeof options?.props === 'function') {
            options.props = await options.props();
        }
        
        store.addModal({
            name: options?.name || (component.__name ?? ''),
            title: options?.title || '',
            itemClass: options?.itemClass,
            props: options?.props,
            component: shallowRef(component),
            isActive: true,
            onClose: options?.onClose,
        });
    }

    /** //FUNC **/

    return {
        open
    }
}

/**
 * 모바일용 모달팝업
 * @returns 
 */
export function useModalPopup() {
    /** STORE **/
    const store = useModalPopupStore();
    const { modalStacks } = storeToRefs(store);
    /** //STORE **/

    /** VARIABLE */
    const stacks = computed(() => modalStacks.value || []);
    const hasOpenedModalPopup = computed(() => stacks.value.length > 0);
    const reversedStacks = computed(() => stacks.value.slice().reverse());
    const lastOpened = computed(() => reversedStacks.value[0]);
    /** // VARIABLE */

    /** FUNCTION */
    function openModalPopup(componentName: string) {
        if (!componentName) {
            return;
        } 
        store.addModal(componentName);
    }

    function closeModalPopup(componentName: string) {
        if (!componentName) {
            return;
        } 
        store.removeModal(componentName);
    }

    function isOpened(componentName: string) {
        return stacks.value.some((opened: string) => opened == componentName);
    }
    /** // FUNCTION */

    return {
        modalPopupStacks: reversedStacks,
        hasOpenedModalPopup,
        lastOpened,
        openModalPopup,
        closeModalPopup, 
        isOpened,
        clearModalPopup: store.$reset
    }
}
