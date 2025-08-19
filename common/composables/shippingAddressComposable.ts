import { ref } from 'vue';

const findZipCode = ref('');
const findRoadAddress = ref('');

/**
 * 주소검색 
 * @returns 
 */
export function useAddressFind() {
    const setAddress = (zipdCode: string, roadAddress: string) => {
        findZipCode.value = zipdCode;
        findRoadAddress.value = roadAddress;
    }

    function resetAddress() {
        findZipCode.value = '';
        findRoadAddress.value = '';
    }
    
    return {
        findZipCode,
        findRoadAddress,
        setAddress,
        resetAddress
    }
}