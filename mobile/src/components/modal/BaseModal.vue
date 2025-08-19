<template>
    <div :class="['mm_modal-item', layer.itemClass, layer.isActive ? 'S=on' : 'S=old']">
        <div class="mm_modal-item-dim" />
        <div
            class="mm_modal-item-inner"
        >
            <div v-if="layer.title" class="mm_modal...head">
                <h2><b>{{ layer.title }}</b></h2>
                <button type="button" class="btn_modal-close" @click="close">
                    <b class="mm_ir-blind">모달 닫기</b><i class="ico_modal-close" />
                </button>
            </div>

            <div class="mm_modal...content">
                <button v-if="!layer.title" type="button" class="btn_modal-close" @click="close">
                    <b class="mm_ir-blind">모달 닫기</b><i class="ico_modal-close" />
                </button>
                <div class="mm_scroller">
                    <component 
                        :is="layer.component" 
                        v-bind="layer.props"
                        :closer="closer"
                    />
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { useModalStore } from '$/store/modal';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ModalLayer } from '$/@type/Modal';
/** VARIABLE **/
const router = useRouter();
const props = defineProps<{
    layer: ModalLayer
}>()

const layer = computed(() => {
    return props.layer
})

/** //VARIABLE **/
/** FUNC **/
async function closer<ModalCloseContext>(context?: ModalCloseContext) {
    if (layer.value.onClose) {
        
        layer.value.onClose(context || '');
    }
    close();
}

function close() {
    useModalStore().removeModal(layer.value.name);    
}
/** //FUNC **/

// 라우트 이동시 모달 닫힘 처리 
watch(() => router.currentRoute.value.path, () => {
    useModalStore().removeModal(layer.value.name);    
})
</script>
