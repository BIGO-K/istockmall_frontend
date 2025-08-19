import { CreditCardInstallMents, InstallMentInfo, PaymentForm } from "$/@type/order/order";
import { orderRepository } from "$/repository/order/orderRepository";
import { ComputedRef, Ref, computed, ref } from "vue";

export function useInstallMent(isInterestDisabled: ComputedRef<boolean>, paymentForm: Ref<PaymentForm>) {

    /** 무이자 할부 정보 */
    const interests = ref<CreditCardInstallMents[]>([]);
    const installMentBase = computed(() => {
        return [
            { value: 0, label: '일시불', isInterestFree: false, isPartialInterestFree: false, disabled: false },
            { value: 2, label: '2개월', isInterestFree: false, isPartialInterestFree: false , disabled: isInterestDisabled.value },
            { value: 3, label: '3개월', isInterestFree: false, isPartialInterestFree: false , disabled: isInterestDisabled.value },
            { value: 4, label: '4개월', isInterestFree: false, isPartialInterestFree: false , disabled: isInterestDisabled.value },
            { value: 5, label: '5개월', isInterestFree: false, isPartialInterestFree: false , disabled: isInterestDisabled.value },
            { value: 6, label: '6개월', isInterestFree: false, isPartialInterestFree: false , disabled: isInterestDisabled.value },
            { value: 7, label: '7개월', isInterestFree: false, isPartialInterestFree: false , disabled: isInterestDisabled.value },
            { value: 8, label: '8개월', isInterestFree: false, isPartialInterestFree: false , disabled: isInterestDisabled.value },
            { value: 9, label: '9개월', isInterestFree: false, isPartialInterestFree: false , disabled: isInterestDisabled.value},
            { value: 10, label: '10개월', isInterestFree: false, isPartialInterestFree: false, disabled: isInterestDisabled.value },
            { value: 11, label: '11개월', isInterestFree: false, isPartialInterestFree: false, disabled: isInterestDisabled.value },
            { value: 12, label: '12개월', isInterestFree: false, isPartialInterestFree: false, disabled: isInterestDisabled.value },
        ];
    })


    const installMents = computed<InstallMentInfo[]>(() => {
        if (paymentForm.value.cardCode == 0 || paymentForm.value.cardCode == null ) {
            return [
                { value: 0, label: '일시불', isInterestFree: false, isPartialInterestFree: false, disabled: false }
            ];
        }
        
        const cardInterest = interests.value.find((interest) => {
            return interest.cardCode == paymentForm.value.cardCode
        });
    
    
        if (!cardInterest) {
            return installMentBase.value
        }
    
        return installMentBase.value.map((base) => {
            const interestFree = cardInterest.interestFreeMonths.includes(base.value);
            const isPartialInterestFree = cardInterest.partialInterestFreeMonths.includes(base.value);
            return {
                value: base.value,
                isInterestFree: interestFree,
                isPartialInterestFree: isPartialInterestFree,
                label: base.label + (interestFree || isPartialInterestFree ? ( interestFree ? '(무이자)' : '(부분무이자)') : ''),
                disabled: base.disabled
            }
        })
    })

    async function getInterests() {
        try {
            interests.value = await orderRepository.cardInterest();
        } catch(e) {
            console.error(e);
        }
    }
    
    return {
        getInterests,
        installMents
    }
}