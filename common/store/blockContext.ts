import { BlockContext } from "$/@type/block";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useBlockContextStore = defineStore('blockContext', () => {
    /** VARIABLE */
    const contexts = ref<BlockContext[]>([]);
    /** // VARIABLE */
    
    /** FUNCTION */
    /**
     * 블록 CONTEXT 저장
     * @param newContext
     */
    function setContext(newContext: BlockContext) {
        let originContext = {};
        contexts.value = contexts.value
            .filter(blockContext => {
                if (blockContext.code == newContext.code) {
                    originContext = blockContext;
                }
                return blockContext.code != newContext.code
            })
            .concat([Object.assign(originContext, newContext)])
    }

    /**
     * 블록 GETTER
     * @param name 블록명
     * @param id 블록 ID
     * @returns 
     */
    function getContext(code: string): BlockContext {
        return contexts.value.find(context => context.code == code) || { code: code };
    }
    /** // FUNCTION */

    return {
        contexts,
        setContext,
        getContext,
    }
}, {
    persistedState: {
        storage: sessionStorage
    }
})