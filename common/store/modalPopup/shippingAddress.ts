import { ShippingAddress } from "$/@type/order/order";
import { typeCastNumber } from "$/filters";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useShippingAddressModalStore = defineStore('shippingAddressModal', () => {
    const shippingAddress = ref<ShippingAddress>({
        id: 0,
        shippingName: '',
        name: '',
        tel: '',
        zipCode: '',
        baseAddress: '',
        detailAddress: '',
    });

    /**
     * store에 배송지 저장
     * @param newAddress 배송지
     */
    function setShippingAddress(newAddress: Partial<ShippingAddress>) {
        shippingAddress.value = {
            id: typeCastNumber(newAddress.id),
            shippingName: newAddress.shippingName || '',
            name: newAddress.name || '',
            tel: newAddress.tel || '',
            zipCode: newAddress.zipCode || '',
            baseAddress: newAddress.baseAddress || '',
            detailAddress: newAddress.detailAddress || '',
        }
    }
    
    return {
        shippingAddress,
        setShippingAddress
    }
})