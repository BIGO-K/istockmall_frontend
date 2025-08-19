import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

declare module 'pinia' {
    export interface DefineStoreOptionsBase<S extends StateTree, Store> {
        initialState?: any,
    }
}
const pinia = createPinia()
pinia
    .use((context) => {
        const initialState = { ...context.store.$state };
        context.store.$reset = () => {
            if (context.options.persistedState?.persist && context.options.persistedState.storage) {
                context.options.persistedState.storage.removeItem(context.store.$id);
            }
            context.store.$patch(context.options.initialState || initialState);
        }
    })
    .use(createPersistedStatePlugin())

export default pinia
