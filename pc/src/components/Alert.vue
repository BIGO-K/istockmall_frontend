<template>
    <div :class="['mm_bom-item', isActive ? 'S=on' : 'S=old']">
        <div class="mm_bom-item-dim" />
        <div class="mm_bom-item-inner">
            <i class="ico_bom-alert" />
            <div class="mm_bom...content">
                <h2><b>{{ title }}</b></h2>
                <p v-html="messageLineBreak" />
                <template v-if="type === 'prompt'">
                    <ul class="mm_bom...content-form">
                        <template v-for="form in forms" :key="form">
                            <li v-if="form.type == 'textarea'">
                                <div class="mm_form-textarea">
                                    <button
                                        type="button"
                                        class="btn_text-clear"
                                    >
                                        <i class="ico_form-clear" /><b class="mm_ir-blind">지우기</b>
                                    </button>
                                    <label>
                                        <textarea
                                            v-model="formData[form.name]"
                                            :name="form.name"
                                            class="textfield"
                                            data-text
                                        /><i class="bg_text" />
                                        <span class="text_placeholder">{{ form.placeholder || '' }}</span>
                                    </label>
                                </div>
                            </li>
                            <li v-else-if="form.type == 'select'">
                                <MMSelect
                                    v-model="formData[form.name]"
                                    class="T=short"
                                >
                                    <option
                                        v-for="(option, index) in form.options"
                                        :key="`${index}_${option.value}`" 
                                        :value="option.value"
                                    >
                                        {{ option.text }}
                                    </option>
                                </MMSelect>
                            </li>
                            <li v-else-if="form.type == 'password'">
                                <div class="mm_form-text">
                                    <button
                                        type="button"
                                        class="btn_text-pw"
                                    >
                                        <i class="ico_pw-hide" /><b class="mm_ir-blind">비밀번호 보기</b>
                                    </button>
                                    <button
                                        type="button"
                                        class="btn_text-clear"
                                    >
                                        <i class="ico_form-clear" /><b class="mm_ir-blind">지우기</b>
                                    </button>
                                    <label>
                                        <input
                                            v-model="formData[form.name]"
                                            type="password"
                                            class="textfield"
                                            data-text
                                        ><i class="bg_text" />
                                        <span class="text_placeholder">비밀번호 영문/특수문자/숫자 8~16자</span>
                                    </label>
                                </div>
                            </li>
                            <li v-else>
                                <MMInput
                                    v-bind="form || {}"
                                    v-model="formData[form.name]"
                                />
                            </li>
                        </template>
                    </ul>
                </template>
            </div>
            <div class="mm_bom...btn">
                <div class="mm_flex T=equal">
                    <button
                        v-if="type !== 'alert'"
                        type="button"
                        class="btn_no"
                        @click="cancel"
                    >
                        <b>{{ cancelButtonLabel }}</b>
                    </button>
                    <button
                        type="button"
                        class="btn_ok"
                        @click="close"
                    >
                        <b>{{ closeButtonLabel }}</b>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang='ts'>
import { useMonsAlert } from '$/composables/pageHandler/contextComposable';
import MMSelect from '@/components/input/Select.vue';
import { MonsAlert } from '$/@type/front';
import { onMounted } from 'vue';

const props = defineProps<{
    monsAlert: MonsAlert
}>()

const { 
    isActive,
    type, 
    title,
    forms,
    messageLineBreak, 
    closeButtonLabel, 
    cancelButtonLabel,
    formData,
    cancel,
    close,
} = useMonsAlert(props.monsAlert);

onMounted(() => {
    const okButton: HTMLElement|null = document.querySelector('.btn_ok');
    if (okButton === null) {
        return;
    }

    okButton.focus();
})
</script>
