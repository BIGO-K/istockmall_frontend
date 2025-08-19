<template>
    <div class="mm_form-select">
        <label>
            <select
                ref="selectElement" 
                :value="modelValue" 
                :disabled="isDisabled"
                autocomplete="off" 
                v-bind="$attrs"
                @change="select"
            >
                <slot />
            </select>
            <b class="text_selected">{{ selectedLabel }}</b>
            <i class="ico_form-select" />
        </label>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = withDefaults(defineProps<{
    modelValue: string|number|null
    isDisabled?: boolean
}>(), {
    modelValue: '',
    isDisabled: false,
});
const emit = defineEmits(['update:modelValue'])

/** VARIABLE */
const selectElement = ref<HTMLSelectElement>();
/**
 * 선택된 옵션라벨
 */
const selectedLabel = ref('');
const isDisabled = computed(() => {
    return props.isDisabled;
});

/** FUNCTION */
function select(event: Event) {
    const targetElement = event.target as HTMLInputElement
    emit('update:modelValue', targetElement.value)  // 선택값 부모 컴포넌트에 전달
}

/**
 * 선택된 옵션값 노출라벨 업데이트
 */
function updateSelectedLabel() {
    if (!selectElement.value) {
        return '';
    }

    // 옵션리스트가 아직 그려지지 않은 경우 지연실행
    if (selectElement.value.options.length < 2 ) {
        setTimeout(updateSelectedLabel, 100)
    }
            
    let matchFound = false;
    Array.from(selectElement.value.options).forEach(option => {
        if (option.value == props.modelValue) {
            selectedLabel.value = option.innerText;
            matchFound = true;
        }
    });
            
    if (matchFound) {
        return;
    } 
            
    selectedLabel.value = selectElement.value.selectedOptions[0]?.innerText 
        || selectElement.value.options[0]?.innerText
        || '';
}

/** VUE LIFE CYCLE */
watch([() => props.modelValue, selectElement], () => {
    // slot에 들어온 option 태그 리스트가 변경되기 전에 계산되지 않도록 
    // setTimeout 적용하여 라벨 업데이트
    updateSelectedLabel();
});
</script>