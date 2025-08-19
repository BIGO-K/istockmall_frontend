<template>
    <div :class="[textClass, validClass]">
        <slot name="extraTopButton" />
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
            :style="buttonMarginStyleText"
            type="button"
            class="btn_text-clear"
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
                :inputmode="dataType === 'number' ? 'numeric' : 'text'"
                :autocomplete="type === 'password' ? 'new-password' : 'off'"
                @animationstart="handleAnimationStart"
                @input="modelDataSync($event)"        
                @focusin="scrollTo(($event.target as Element))"
                @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value.trim())" 
            >
            <i class="bg_text" />
            <span class="text_placeholder">{{ placeHolderText }}</span>
            <slot name="extraButton" />            
        </label>
        <p v-if="hasFormAlert" ref="customForm" :class="formValidClass">
            {{ formAlertMessage }}
        </p>                
    </div>
</template>

<script lang="ts">
import { mmon } from '$/helper/mmon';
import { computed, ref, toRefs, defineComponent } from 'vue';
export default defineComponent({
    inheritAttrs: false,
    props: {
        modelValue : { 
            type: [String, Number, Date],            
            default: ''
        },
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
        },
        autoFillOff: {
            type: Boolean,
            default: false
        },
    },
    emits: ['update:modelValue', 'onClear'],
    setup(props, { emit, attrs }) {
        const { modelValue, useTrim, dataType, formClass, placeHolderText, formValidInfo, autoFillOff } = toRefs(props);         
        const passwordShowClass = ref('ico_pw-hide');
        const autoFillOn = ref(false);
        const removeButton = ref<HTMLElement | null>(null);
        const customForm = ref<HTMLElement | null>(null);     

        const type = ref<string>('');
        type.value = `${attrs.type}` == 'undefined' ? 'text' : `${attrs.type}`;

        const buttonMarginStyleText = computed(() => {
            if (!removeButton.value || !customForm.value) {
                return '';
            }
            if (customForm.value?.offsetHeight > 0) {
                return  `margin-top:${-customForm.value?.offsetHeight / 2}px`;
            }

            return '';
        });        
        const hasFormAlert = computed(() => {
            return formValidInfo.value?.show || false;
        })

        // 패스워드 보이기/숨기기 토클 이벤트 
        function togglePasswordShowing() {
            passwordShowClass.value  = passwordShowClass.value == 'ico_pw-hide'  ? 'ico_pw-show' : 'ico_pw-hide';
            type.value = passwordShowClass.value == 'ico_pw-hide' ? 'password' : 'text';
        }

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
        
        const maxLength = computed<number>(() => Number(attrs.maxlength ?? 0));

        // 텍스트 클래스 계산
        const textClass = computed(() => {
            if (autoFillOn.value) {
                return formClass.value + ' S=text-on';
            }         
            return (modelValue.value == '' || modelValue.value == undefined) ? formClass.value : (formClass.value + ' S=text-on');        
        })

        function dataValidate(inputElement: HTMLInputElement) 
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

        const formAlertMessage = computed(() => {             
            return formValidInfo.value?.message.split('\n').join('<br/>') || ''; 
        })

        const isAutoFillAlready = ref(false);

        async function handleAnimationStart(event: AnimationEvent) {
            autoFillOn.value = false;

            if (isAutoFillAlready.value || autoFillOff.value) {
                await emit('update:modelValue', '');    
                return false;
            }

            if (event.animationName == 'autofill-on') {
                autoFillOn.value = true;
                isAutoFillAlready.value = true;
            } 
        }

        // 모델 데이터 초기화 처리 
        async function modalDataReset() {   
            await emit('update:modelValue', '');           
            emit('onClear');
        }

        // 모델 데이터 동기화 처리 (입력 이벤트 및 삭제 이벤트)
        async function modelDataSync(event: Event) { 
            const inputElement = event.target as HTMLInputElement;  
            let modelData = await dataValidate(inputElement);        
            emit('update:modelValue', modelData);        
        }

        function scrollTo(element: Element) {
            const header: HTMLElement|null = document.querySelector('.mm_header');
            const space = 50;
            const scrollMargin = header ? header.offsetHeight + space : space;

            mmon.scroll.to(element, {
                margin: scrollMargin,
                scroller: mmon.scroll.find(element, true)
            });
        }
        return {
            attrs,
            type,
            dataType,
            togglePasswordShowing,
            modelDataSync,
            modalDataReset,
            passwordShowClass,
            textClass,
            hasFormAlert,
            formAlertMessage,
            validClass,
            removeButton,
            customForm,            
            handleAnimationStart,
            formValidClass,     
            buttonMarginStyleText,
            scrollTo
        }
    }
})
</script>

