<template>
    <div class="mm_address-list">
        <div class="mm_btn_box">
            <a
                class="mm_btn T=sm T=dark btn_address-add"
                href=""
                @click.prevent="addReceiveAddressModalOpen()"
            >
                <b>신규 배송지 등록</b><i class="ico_add" />
            </a>
        </div>
        <!-- 배송지 목록 -->
        <div class="mm_scroller">
            <ul>
                <li
                    v-for="address in addressList"
                    :key="address.id"
                >
                    <input
                        v-model="selectedAddressId"
                        type="radio"
                        name="shiping_address"
                        :title="address.shippingName"
                        data-radio
                        :value="address.id"
                    >
                    <div class="mm_address-item">
                        <i class="ico_form-radio T=circle" />
                        <dl>
                            <dt>
                                <span>{{ address.shippingName }}</span><b
                                    v-if="address.isRecent"
                                    class="text_tag"
                                >최근배송지</b>
                            </dt>
                            <dd>{{ address.name }} / {{ address.tel }}</dd>
                            <dd>{{ address.baseAddress }} {{ address.detailAddress }}</dd>
                        </dl>
                    </div>
                    <button
                        v-if="!address.isRecent"
                        type="button"
                        class="btn_remove"
                        @click="removeAddress(address.id)"
                    >
                        <b>삭제</b>
                    </button>
                </li>
            </ul>
        </div>
        <!--// 배송지 목록 -->
    </div>
    <div class="mm_foot">
        <div class="mm_btn_box">
            <button
                type="button"
                class="mm_btn T=primary"
                @click="selectAddress"
            >
                <b>선택하기</b>
            </button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import AddressCreate from '@/components/modal/order/Address.vue';
import { defaultCatch } from '$/functions';
import { ShippingAddress } from '$/@type/order/order';
import { shippingRepository } from '$/repository/order/shippingRepository';
import { mmon } from '$/helper/mmon';
import { ModalCloseHandler } from '$/@type/Modal';
import { useModal } from '$/composables/pageHandler/modalComposable';

const props = defineProps<{
    addressList: ShippingAddress[],
    closer: ModalCloseHandler<ShippingAddress>
}>();

/** VARIABLE */

// 배송지 리스트
const addressList = ref<ShippingAddress[]>(props.addressList);

// 선택된 배송지
const selectedAddressId = ref<number|undefined>(addressList.value.find(address => {
    return address.isRecent;
})?.id || undefined);

const selectedAddress = computed<ShippingAddress|undefined>(() => {
    return addressList.value.find(address => selectedAddressId.value == address.id);
});

// 배송지 선택 처리
function selectAddress() {
    if (!selectedAddress.value) {
        return mmon.bom.alert('배송지를 선택 해 주세요.');
    }

    props.closer(selectedAddress.value);
    // emit('updateAddress', selectedAddress.value);
    // emit('closeAddressListModal');
}
        
// 배송지 리스트 조회
async function fetch() {
    try {
        addressList.value = await shippingRepository.getReceiveAddresses();
    } catch (e) {
        defaultCatch(e)
    }
}
/** FUNCTION */

// 배송지 삭제
async function removeAddress(addressId: number) {
    mmon.bom.confirm('배송지를 삭제하시겠습니까?', async (isConfirm: boolean) => {
        if (!isConfirm) {
            return;
        }

        mmon.loading.show();
        try {
            await shippingRepository.removeAddress(addressId);
            addressList.value = await shippingRepository.getReceiveAddresses();
        } catch (e) {
            defaultCatch(e)
        } finally {
            mmon.loading.hide();
        }
    })
}

function addReceiveAddressModalOpen() {
    useModal().open(AddressCreate,{
        title: '신규 배송지 등록',
        name: 'Address',
        onClose: async() => {
            addressList.value = await shippingRepository.getReceiveAddresses();
        }
    }) 
}
/** VUE LIFE CYCLE */

</script>