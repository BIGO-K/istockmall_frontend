<template>
    <label :class="['mm_form-check', isTSwitch ? 'T=switch' : '']">
        <input 
            ref="checkInput"
            v-bind="{ ...attrs }" 
            type="checkbox"
            data-check
            @change="sync"
        >
        <b class="mm_block">
            <i class="ico_form-check" />
            <span class="text_label" :class="isBlindLabel ? 'mm_ir-blind' : ''">
                <strong v-if="isOptional" class="mm_text-variable">(선택)</strong>
                {{ label }}
            </span>
        </b>
    </label>
</template>
<script setup lang="ts">
    
import { useAttrs, toRefs, ref, watchEffect, defineComponent } from 'vue';

const attrs = useAttrs();   
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean|Array<any>): void,
    (e: 'dataChanged'): void,
}>();

const props = defineProps({
    modelValue: {
        type: [Boolean, Array],
        default: false,
    },
    label: {
        type: String,
        default: '선택',
    },
    isOptional: {
        type: Boolean,
        default: false
    },
    isBlindLabel: {
        type: Boolean,
        default: false
    },
    isTSwitch: {
        type: Boolean,
        default: false
    }
});

const { modelValue, label, isOptional, isBlindLabel } = toRefs(props);

const checkInput = ref<HTMLInputElement|null>();

// props.modelValue 값 적용 
watchEffect(() => {
    if (checkInput.value == null) {
        return;
    }
    
    const checkInputElement = checkInput.value

    checkInputElement.checked = (
        Array.isArray(modelValue.value) 
        && modelValue.value.filter((item) => String(item) == checkInputElement.value)?.length > 0
    ) || modelValue.value == true;
})

// check input 값 modelValue에 적영
function sync(e: Event) {
    const target = e.target as HTMLInputElement;    
    if (typeof modelValue.value == 'boolean') {
        emit('update:modelValue', target.checked);        
        return emit('dataChanged');
    }

    if (Array.isArray(modelValue.value)) {
        const checkedList = target.checked 
            ? modelValue.value.concat([target.value]) 
            : modelValue.value.filter(item => String(item) != String(target.value));
        emit('update:modelValue', checkedList);
        emit('dataChanged');
    }
}
</script> 

<script lang="ts">
export default defineComponent({
    inheritAttrs: false
})
</script>