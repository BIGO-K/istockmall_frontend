<template>
  <label class="mm_form-radio">
    <input
      v-bind="{ ...attrs }" 
      type="radio"
      :checked="modelValue == attrs.value || attrs.checked"
      data-radio 
      @change="$emit('update:modelValue', $event.target.value)"
    >
    <slot />   
  </label>
</template>

<script>
import { onMounted, watch, watchEffect } from 'vue'
export default {
    inheritAttrs: false,
    props: {
        modelValue: {
            type: [String, Number, Boolean],
            default: '',
        },        
    },
    setup(props, { attrs, emit }) {
        onMounted(() => {
            if (attrs.checked) {
                emit('update:modelValue', attrs.value)
            }
        });
        
        return {
            attrs,
        }
    },
}
</script>