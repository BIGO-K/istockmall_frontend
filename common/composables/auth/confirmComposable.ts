import { usePasswordConfirmTokenStore } from "$/store/passwordConfirm";
import { computed } from "vue";

export function usePasswordConfirmToken() {
    /** STORE **/
    const store = usePasswordConfirmTokenStore();    
    /** //STORE **/

    /** VARIABLE **/
    const accessToken = computed<string>(() => store.token);
    const tokenExists = computed<boolean>(() => store.token !== '' && !store.expired);
    /** //VARIABLE **/

    /** FUNCTION **/

    /** //FUNCTION **/
    (() => {        
        if (store.expired) {
            store.$reset();
        }
    })();

    return {
        accessToken,
        tokenExists,
        setToken: store.setToken,
        clearToken: store.$reset,
    }
}