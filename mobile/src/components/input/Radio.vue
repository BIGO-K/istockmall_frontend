<template>
    <label class="mm_form-radio">
        <input
            v-bind="{ ...attrs }" 
            type="radio"
            :checked="modelValue == attrs.value || attrs.checked == true"
            data-radio 
            @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        >
        <slot />   
    </label>
</template>

<script setup lang="ts"> 
import { defineComponent, onMounted, useAttrs } from 'vue';
defineProps({
    modelValue: {
        type: [String, Number, Boolean],
        default: '',
    },        
});
const attrs = useAttrs();
const emit = defineEmits(['update:modelValue']);

onMounted(() => {
    if (attrs.checked) {
        emit('update:modelValue', attrs.value)
    }
});

</script>
<script lang="ts">
export default defineComponent({
    inheritAttrs: false
})
</script>