<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>신규 배송지 등록</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-address">
                            <h6 class="mm_text-label">
                                <b>배송지명</b>
                            </h6>
                            <MMInput
                                v-model="shippingAddress.shippingName"             
                                maxlength="5"
                                :place-holder-text="'배송지명을 입력하세요(필수입력)'"
                            />     
                            <h6 class="mm_text-label">
                                <b>받는 사람</b>
                            </h6>
                            <MMInput
                                v-model="shippingAddress.name"             
                                maxlength="10"
                                :place-holder-text="'받는 사람을 입력하세요(필수입력)'"
                            />
                            <h6 class="mm_text-label">
                                <b>휴대폰 번호</b>
                            </h6>
                            <MMInput
                                v-model="shippingAddress.tel"    
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
                                        <button type="button" class="btn_text-clear">
                                            <i class="ico_form-clear" /><b class="mm_ir-blind">지우기</b>
                                        </button>
                                        <label>
                                            <input v-model="findZipCode" :data-test="findZipCode" type="text" class="textfield" data-text readonly><i class="bg_text" />
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
                                    v-model="shippingAddress.detailAddress"             
                                    :use-trim="false"
                                    :place-holder-text="'상세 주소를 입력하세요(필수입력)'"
                                />
                            </div>
                            <!-- 하단 버튼 -->
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=primary" @click="registShippingAddress">
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
import { ref } from 'vue';
import { ShippingAddressForm } from '$/@type/shipping';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { shippingRepository } from '$/repository/order/shippingRepository';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { useAddressFind } from '$/composables/shippingAddressComposable';
import { useRouter } from 'vue-router';
import { makeValidator } from '$/validator';

const router = useRouter();
const { findZipCode, findRoadAddress, setAddress } = useAddressFind();
setAddress('', '');

const shippingAddress = ref<ShippingAddressForm>({
    zipCode: '',
    shippingName: '',
    name: '',
    tel: '',
    baseAddress: '',
    detailAddress: ''
});

async function registShippingAddress() {
    shippingAddress.value.zipCode = findZipCode.value;
    shippingAddress.value.baseAddress = findRoadAddress.value;            
    const validator = makeValidator(shippingAddress.value);            
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
        await shippingRepository.registAddress(shippingAddress.value);
        mmon.bom.alert('주소가 등록 되었습니다.', function() {
            router.go(-1);
        });
    } catch (e) {
        defaultCatch(e);
    }
}
</script>
