<template>
    <div :class="[textClass, validClass, attrs.class]">
        <button 
            v-if="attrs.type == 'password'"
            type="button" 
            class="btn_text-pw" 
            :style="buttonMarginStyleText" 
            @click="togglePasswordShowing"
        >
            <i :class="passwordShowClass" />
            <b class="mm_ir-blind">비밀번호 보기</b>
        </button>
        <button 
            ref="removeButton" 
            type="button" 
            class="btn_text-clear" 
            :style="buttonMarginStyleText"
            @click="modalDataReset"
        >
            <i class="ico_form-clear" />
            <b class="mm_ir-blind">지우기</b>
        </button>
        <label>
            <input
                v-bind="{ ...attrs }"
                class="textfield"
                :type="type"
                :value="modelValue"
                :autocomplete="type === 'password' ? 'new-password' : 'off'"
                @animationstart="handleAnimationStart"
                @input="modelDataSync($event)"
                @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value.trim())"
            >
            <i class="bg_text" />
            <span class="text_placeholder">{{ placeHolderText }}</span>            
        </label>
        <slot name="extraButton" />
        <p
            v-if="hasFormAlert"
            ref="customForm"
            :class="formValidClass"
        >
            {{ formAlertMessage }}
        </p>                
    </div> 
</template>

<script lang="ts">
import { computed, ref, toRefs, defineComponent } from 'vue';

export default defineComponent({
    inheritAttrs: false,
    props : {
        modelValue : { 
            type: [String, Number, Date],            
            default: ''
        },
        // validation용 데이터 타입 
        dataType : {
            type : String,
            default : 'text'
        },
        placeHolderText : {
            type : String,
            default : ''
        },
        useTrim : {
            type : Boolean,
            default : true
        },
        formClass : {
            type : String,
            default : 'mm_form-text'
        },
        formValidInfo : {
            type: Object,
            default : null,
        }
    },
    emits: ['update:modelValue', 'onClear'],
    setup(props,  { emit, attrs }) {  
        const removeButton = ref<HTMLElement | null>(null);
        const customForm = ref<HTMLElement | null>(null);     
        const { modelValue, useTrim, dataType, formClass, placeHolderText, formValidInfo } = toRefs(props);         
        

        const maxLength = computed<number>(() => Number(attrs.maxlength ?? 0));
        const passwordShowClass = ref('ico_pw-hide');
        const autoFillOn = ref(false);
        const type = ref('');      
        type.value = `${attrs.type}` == 'undefined' ? 'text' : `${attrs.type}`;
        
        const buttonMarginStyleText = computed(() => {
            if (!removeButton.value || !customForm.value) {
                return '';
            }
            if (customForm.value.offsetHeight > 0) {
                return  `margin-top:${-customForm.value?.offsetHeight / 2}px`;
            }

            return '';
        });        

        const formValidClass = computed(() => {
            if (!hasFormAlert.value) {
                return '';
            }
            if (formValidInfo.value.type === 'alert') {
                return 'text_alert';
            } else if (formValidInfo.value.type === 'valid') {
                return `text_valid S=valid-${formValidInfo.value.validStatus}`
            }

            return '';
        })

        const validClass = computed(() => {
            if (!hasFormAlert.value) {
                return '';
            }

            if (formValidInfo.value.type === 'alert') {
                return 'S=text-alert';
            } else if (formValidInfo.value.type === 'valid') {
                return `S=text-valid-${formValidInfo.value.validStatus}`
            }
            
            return '';
        })

        function handleAnimationStart(event: AnimationEvent) {
            autoFillOn.value = false;
            if (event.animationName == 'autofill-on') {
                autoFillOn.value = true;
            } 
        }

        // 패스워드 보이기/숨기기 토클 이벤트 
        function togglePasswordShowing() {
            passwordShowClass.value  = passwordShowClass.value == 'ico_pw-hide'  ? 'ico_pw-show' : 'ico_pw-hide';
            type.value = passwordShowClass.value == 'ico_pw-hide' ? 'password' : 'text';
        }
    
        // 텍스트 클래스 계산
        const textClass = computed(() => {            
            if (autoFillOn.value) {
                return formClass.value + ' S=on';
            } 
            return (modelValue.value == '' || modelValue.value == undefined) ? formClass.value : (formClass.value + ' S=on');
        })

        function dataValidate(inputElement:HTMLInputElement) 
        {   
            let modelValue = inputElement.value;
            return new Promise((resolve , reject) => {
                let modelData =  useTrim.value ? modelValue.replace(/ /g, '') : modelValue;
                switch (dataType.value) 
                {
                case 'text':
                    break;
                case 'id':                       
                    modelData = modelData.replace(/[^a-z|0-9|A-Z]/g, '');                           
                    break;
                case 'email':
                    modelData = modelData.replace(/[^a-z|0-9|A-Z|\!\#\$\%\&\'\*\+\-\/\=\?\^\_\`\.\{\|\}\~\@]/g, '');
                    break;
                case 'password':
                    modelData = modelData.replace(/[^a-z|0-9|A-Z|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g, '');
                    break;
                case 'phone' :
                    modelData = modelData.replace(/[^0-9]/g, '');
                    break;
                case 'number' :
                    modelData = modelData.replace(/[^0-9]/g, '');
                    break;
                default:
                    break;
                }

                if (maxLength.value > 0 && modelData.length >= maxLength.value) {
                    modelData = modelData.slice(0, maxLength.value);
                }
                
                // 타겟에 value 값을 변경해줘야 현재 보고있는 값도 변경처리 된다(공백제거나, 숫자형식등의 문제가 생기기 때문에 처리해줘야함.)
                inputElement.value = modelData;
                resolve(modelData);
            })
        }

        // 모델 데이터 초기화 처리 
        function modalDataReset() { 
            emit('update:modelValue', '');
            emit('onClear');
        }

        // 모델 데이터 동기화 처리 (입력 이벤트 및 삭제 이벤트)
        async function modelDataSync(event: Event) { 
            const inputElement = event.target as HTMLInputElement;
            let modelData = await dataValidate(inputElement);
            emit('update:modelValue', modelData);
        }

        const hasFormAlert = computed(() => {
            return formValidInfo.value?.show || false;
        })
        
        const formAlertMessage = computed(() => {             
            return formValidInfo.value?.message.split('\n').join('<br/>') || ''; 
        })

        return {
            attrs,
            type,
            togglePasswordShowing,
            modelDataSync,
            modalDataReset,
            passwordShowClass,
            textClass,
            placeHolderText,        
            hasFormAlert,
            formAlertMessage,
            validClass,
            removeButton,
            customForm,            
            handleAnimationStart,
            formValidClass,     
            buttonMarginStyleText,
        }
    },
});
</script>