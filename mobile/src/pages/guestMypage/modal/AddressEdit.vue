<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>배송지 변경</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-address">
                            <h6 class="mm_text-label">
                                <b>받는 사람</b>
                            </h6>
                            <MMInput
                                v-model="newReceiverName"
                                maxlength="10"
                                :place-holder-text="'받는 사람을 입력하세요(필수입력)'"
                            />
                            <h6 class="mm_text-label">
                                <b>휴대폰 번호</b>
                            </h6>
                            <MMInput
                                v-model="newReceiverTel"
                                data-type="number"
                                maxlength="11"
                                :place-holder-text="'휴대폰 번호를 입력하세요(필수입력, 숫자만 입력)'"
                            />
                            <div class="mm_form_mix-address">
                                <h6 class="mm_text-label">
                                    <b>주소</b>
                                </h6>
                                <div class="mm_form_mix-linked">
                                    <div class="mm_form-text">
                                        <button type="button" class="btn_text-clear">
                                            <i class="ico_form-clear" /><b class="mm_ir-blind">지우기</b>
                                        </button>
                                        <label>
                                            <input v-model="findZipCode" type="text" class="textfield" data-text readonly><i class="bg_text" />
                                            <span class="text_placeholder mm_ir-blind">우편번호</span>
                                        </label>
                                    </div>
                                    <a class="mm_btn T=dark" href="#ADDRESS_FIND"><b>우편번호 찾기</b></a>
                                </div>
                                <div class="mm_form-text">
                                    <button type="button" class="btn_text-clear">
                                        <i class="ico_form-clear" /><b class="mm_ir-blind">지우기</b>
                                    </button>
                                    <label>
                                        <input v-model="findRoadAddress" type="text" class="textfield" data-text readonly><i class="bg_text" />
                                        <span class="text_placeholder mm_ir-blind">검색주소</span>
                                    </label>
                                </div>
                                <MMInput
                                    v-model="newDetailAddress"
                                    :use-trim="false"
                                    :place-holder-text="'상세 주소를 입력하세요(필수입력)'"
                                />
                            </div>
                            <!-- 하단 버튼 -->
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=primary" @click="updateAddress">
                                        <b>등록하기</b>
                                    </button>
                                </div>
                            </div>
                            <!--// 하단 버튼 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { defaultCatch } from '$/functions';
import { guestAddressEditModal } from '$/composables/mypage/order/myOrderComposable';
import { useAddressFind } from '$/composables/shippingAddressComposable';
import router from '@/router';
import { makeValidator } from '$/validator';
import { onBeforeUnmount, ref } from 'vue';
const { guestAddress } = guestAddressEditModal();
const { 
    findZipCode, 
    findRoadAddress, 
    resetAddress 
} = useAddressFind();


const newReceiverName = ref<string>('');
const newReceiverTel = ref<string>('');
const newDetailAddress = ref<string>('');


onBeforeUnmount(() => {
    resetAddress();
});
async function updateAddress() {
    const validator = makeValidator({
        name: newReceiverName.value,
        zipCode: findZipCode.value,
        tel: newReceiverTel.value,
        baseAddress: findRoadAddress.value,
        detailAddress: newDetailAddress.value
    });            
    validator.setRules({            
        'name(받는사람)': ['required'],
        'tel(휴대폰 번호)': ['required'],
        'zipCode(우편번호)' : ['required'],
        'baseAddress(기본 주소)': ['required'],
        'detailAddress(상세 주소)': ['required']
    });
    try {
        await validator.run();
        guestAddress.value = {
            name: newReceiverName.value,
            zipCode: findZipCode.value,
            tel: newReceiverTel.value,
            baseAddress: findRoadAddress.value,
            detailAddress: newDetailAddress.value
        }
        resetAddress();
        router.go(-1)
    } catch (e) {
        defaultCatch(e);
    }
}
</script>