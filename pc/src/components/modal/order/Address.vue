<template>
    <div class="m_modal-address">
        <h6 class="mm_text-label">
            <b>배송지명</b>
        </h6>
        <MMInput
            v-model="receiveAddress.shippingName"             
            maxlength="5"
            :place-holder-text="'배송지명을 입력하세요(필수입력)'"
        />                
        <h6 class="mm_text-label">
            <b>받는 사람</b>
        </h6>
        <MMInput
            v-model="receiveAddress.name"                      
            maxlength="10"
            :place-holder-text="'받는 사람을 입력하세요(필수입력)'"
        />                
        <h6 class="mm_text-label">
            <b>휴대폰 번호</b>
        </h6>
        <MMInput
            v-model="receiveAddress.tel"             
            :data-type="'number'"           
            maxlength="11"
            :place-holder-text="'휴대폰 번호를 입력하세요(필수입력, 숫자만 입력)'"
        />
        <div class="mm_form_mix-address">
            <h6 class="mm_text-label">
                <b>주소</b>
            </h6>
            <div class="mm_form_mix-linked">
                <div class="mm_form-text">
                    <button
                        type="button"
                        class="btn_text-clear"
                    >
                        <i class="ico_form-clear" /><b class="mm_ir-blind">지우기</b>
                    </button>
                    <label>
                        <input
                            v-model="receiveAddress.zipCode"
                            type="text"
                            class="textfield"
                            data-text
                            readonly
                        ><i class="bg_text" />
                        <span class="mm_ir-blind text_placeholder">우편번호</span>
                    </label>
                </div>
                <a
                    class="mm_btn T=dark"
                    href="#"
                    @click.prevent="postCodeModalOpen"
                >
                    <b>우편번호 찾기</b>
                </a>
            </div>
            <div class="mm_form-text">
                <button
                    type="button"
                    class="btn_text-clear"
                >
                    <i class="ico_form-clear" /><b class="mm_ir-blind">지우기</b>
                </button>
                <label>
                    <input
                        v-model="receiveAddress.baseAddress"
                        type="text"
                        class="textfield"
                        data-text
                        readonly
                    ><i class="bg_text" />
                    <span class="mm_ir-blind text_placeholder">검색주소</span>
                </label>
            </div>
            <MMInput
                v-model="receiveAddress.detailAddress"             
                :use-trim="false"
                :place-holder-text="'상세 주소를 입력하세요(필수입력)'"
            />
        </div>
        <div class="mm_foot">
            <div class="mm_btn_box">
                <button
                    type="button"
                    class="mm_btn T=primary"
                    @click="registAddress"
                >
                    <b>등록하기</b>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import PostCode from '@/components/modal/PostCodeFind.vue';
import { ShippingAddressForm } from '$/@type/shipping';
import { shippingRepository } from '$/repository/order/shippingRepository';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { makeValidator } from '$/validator';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { ModalCloseHandler } from '$/@type/Modal';


const props = defineProps<{
    closer: ModalCloseHandler<void>,
}>();

/** VARIABLE */
const receiveAddress = ref<ShippingAddressForm>({
    zipCode: '',
    shippingName: '',
    name: '',
    tel: '',
    baseAddress: '',
    detailAddress: ''
});

function postCodeModalOpen() {
    useModal().open(PostCode, {
        title: '우편번호 찾기',
        name: 'PostCode',
        onClose: (address: { 
            zipCode: string, 
            road: string
        }) => {
            receiveAddress.value.zipCode = address.zipCode;
            receiveAddress.value.baseAddress = address.road;
        }
    })
}

async function registAddress() {
    const validator = makeValidator(receiveAddress.value);            
    validator.setRules({            
        'shippingName(배송지명)': ['required'],
        'name(받는사람)': ['required'],
        'tel(휴대폰 번호)': ['required', 'phoneNumber'],
        'zipCode(우편번호)' : ['required'],
        'baseAddress(기본 주소)': ['required'],
        'detailAddress(상세 주소)': ['required']
    });

    try {
        await validator.run();
        await shippingRepository.registAddress(receiveAddress.value);
        mmon.bom.alert('주소가 등록 되었습니다.', () => {
            props.closer();
        });
    } catch (e) {
        defaultCatch(e);
    }
}
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>
