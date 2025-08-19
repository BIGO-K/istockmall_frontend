import { ShallowRef, Component } from "vue"

type ModalOpenOption<Props, ModalCloseContext> = {
    title?: string
    itemClass?: string
    name?: string
    props?: Props | (() => Promise<Props>)
    onClose?: ModalCloseHandler<ModalCloseContext>
}

type ModalLayer = {
    name: string
    title?: string
    itemClass?: string
    component: ShallowRef<Component>
    props: object,
    isActive: boolean;
    onClose?: ModalCloseHandler<string|object|undefined>
}


type ModalCloseHandler<ModalCloseContext> = (context: ModalCloseContext) => void