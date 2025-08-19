import { useGlobalConfigs } from "$/composables/globalConfigComposable";

export function useCalculateDiscountAmount( price: number, 
    discounter: {
        dcAmount: number,
        dcType: string & 'rate'  | 'KRW',
        maximumDiscountAmount: number
    }
): number {
    const { globalConfigs } = useGlobalConfigs();
    if (discounter.dcType === 'KRW') {
        if (discounter.maximumDiscountAmount !== 0) {
            return Math.min(discounter.maximumDiscountAmount, discounter.dcAmount)
        }

        return discounter.dcAmount
    }

    const goodsPriceUnit = globalConfigs.value.goodsPriceKrwUnit;
    const discountAmount = Math.floor((price * discounter.dcAmount / 100) / goodsPriceUnit) * goodsPriceUnit;
    
    if (discounter.maximumDiscountAmount !== 0) {
        return Math.min(discounter.maximumDiscountAmount, discountAmount)
    }

    return discountAmount
}