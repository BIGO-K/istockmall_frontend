<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>배송지 관리</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_address-list">
                            <a class="mm_btn T=primary btn_register" href="#ADDRESS_CREATE"><b>신규 배송지 등록</b></a>
                            <!-- (D) 최근배송지인 'mm_address-item' 에 'S=on' 클래스를 추가합니다. -->
                            <ul>
                                <li v-for="address in addressList" :key="address.id">
                                    <a @click.prevent="selectAddress(address.id)">
                                        <div class="mm_address-item" :class="address.isRecent ? 'S=on' : ''">
                                            <i class="ico_form-radio T=circle"></i>
                                            <dl>
                                                <dt>
                                                    <b>{{ address.shippingName }}</b>
                                                    <b v-if="address.isRecent" class="mm_tag T=gray">최근배송지</b>
                                                </dt>
                                                <dd>{{ address.name }} / {{ address.tel }}</dd>
                                                <dd>{{ address.zipCode }}<br>{{ address.baseAddress}}<br>{{ address.detailAddress }}</dd>
                                            </dl>
                                        </div>
                                    </a>
                                    <button v-if="!address.isRecent" type="button" class="btn_remove" @click="removeAddress(address.id)"><b>삭제</b></button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { ShippingAddress } from '$/@type/order/order';
import { useShippingAddressEdit } from '$/composables/mypage/order/myOrderComposable';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { shippingRepository } from '$/repository/order/shippingRepository';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
// 배송지 리스트
const addressList = ref<ShippingAddress[]>([]);
// 배송지 변경 기능
const { newShippingAddress } = useShippingAddressEdit() 

onMounted(async () => {
    await fetchAddressList();
    window.addEventListener('hashchange', refreshList);
});

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', refreshList);
})

// 주소 선택 처리
function selectAddress(addressId: number) {
    newShippingAddress.value = addressList.value.find(address => addressId == address.id) || null;
    router.go(-1);
}

// 배송지 리스트 조회
async function fetchAddressList() {
    try {
        addressList.value = await shippingRepository.getReceiveAddresses();
    } catch (e) {
        defaultCatch(e)
    }
}

/**
 * 문의수정 팝업모달 닫힘 후 리스트 새로조회
 * @param event 해시변경event
 */
async function refreshList(event: HashChangeEvent) {
    const before = event.oldURL.split('#')[1] ?? '';
    const after = event.newURL.split('#')[1] ?? '';

    if (before == 'ADDRESS_CREATE' && after === 'ADDRESS_LIST') {
        await fetchAddressList();
    }
}

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
</script>
