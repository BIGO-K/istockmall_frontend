<template>
    <div
        class="mm_form-textarea" 
        :class="[
            { 'S=on' : modelValue.length > 0 },
            { 'S=byte': maxByte > 0 }
        ]"
    >
        <button
            type="button"
            class="btn_text-clear"
            @click="modelDataReset"
        >
            <i class="ico_form-clear" /><b class="mm_ir-blind">지우기</b>
        </button>
        <label>
            <textarea 
                ref="targetElement"
                v-bind="{ ...attrs }"
                :value="modelValue"
                class="textfield" 
                autocomplete="off"
                @input="syncModelValue($event)" 
                @keyup="resize($event.target as HTMLInputElement)"
            />
            <i class="bg_text" />
            <span
                class="text_placeholder"
                v-html="placeHolderText"
            />
        </label>
        <b
            v-if="maxByte > 0"
            class="text_byte"
        ><strong>{{ modelValue.length }}</strong>/{{ maxByte }}</b>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, computed, ref, toRefs } from 'vue'

interface ResizeInfo {
    isUse: boolean,
    min?: number,
    max?: number,
}

export default defineComponent({
    inheritAttrs: false,
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        placeHolderText : {
            type: String,
            default : '플레이스 홀더'
        },
        resize: {
            type: Object as PropType<ResizeInfo>,
        },
        maxByte: {
            type: Number,
            default: 0,
        }
    },
    setup(props, { attrs, emit }) {
        const { modelValue } = toRefs(props);
        const resizeMin: number = props.resize?.min || 2;
        const resizeMax: number = props.resize?.max || 999;
        const targetElement = ref<HTMLInputElement>();
        
        // 입력값 라인 수
        const textLineNumber = computed(() => {
            let lineNumber = props.modelValue.split('\n').length;
            
            lineNumber = resizeMin > lineNumber ? resizeMin : lineNumber;
            lineNumber = resizeMax < lineNumber ? resizeMax : lineNumber;

            return lineNumber;
        })

        onMounted(() => {
            if (props.resize?.isUse) {
                resize(targetElement.value);
            }
        });

        /**
         * 텍스트에리어 리사이즈
         * 
         * @param  {HTMLInputElement|undefined} element
         * @returns void
         */
        function resize(element : HTMLInputElement | undefined) : void {
            if (!props.resize?.isUse || !element) {
                return;
            }

            const inputStyle = getComputedStyle(element);
            const verticalPadding = parseFloat(inputStyle.paddingTop) + parseFloat(inputStyle.paddingBottom);   // top, bottom padding 값
            const lineHeight = parseFloat(inputStyle.lineHeight);  // 줄간격

            element.style['height'] = verticalPadding + (lineHeight * textLineNumber.value) + 'px';
        }

        // 모델 데이터 초기화 처리 
        function modelDataReset() {   
            emit('update:modelValue', '');
            if (targetElement.value) {
                targetElement.value.value = '';
            }
        }

        function syncModelValue(event: Event) {
            const inputElement = event.target as HTMLInputElement;
            if (props.maxByte > 0 && inputElement.value.length >= props.maxByte) {
                inputElement.value = inputElement.value.slice(0, props.maxByte);
            }

            emit('update:modelValue', inputElement.value);
        }

        return {
            modelValue,
            attrs,
            targetElement,
            resize,
            modelDataReset,
            syncModelValue,
        }
    },
})
</script>
