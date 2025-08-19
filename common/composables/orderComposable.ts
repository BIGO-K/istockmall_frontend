import { AppliedSalePacks, OrderSheetAppliedCouponRegist, Pack } from "$/@type/order/order";
import { mmon } from "$/helper/mmon";
import { orderRepository } from "$/repository/order/orderRepository";
import { computed, ref } from 'vue';
import { useUserState } from './auth/userComposable';
import { useRouter } from 'vue-router';
import { defaultCatch } from "$/functions";
import { storeToRefs } from 'pinia';
import { useOrderStore } from '$/store/order/order';
import { useShoppingStore } from "$/store/shopping";
import { shoppingRepository } from "$/repository/shoppingRepository";

const appliedSalePacks = ref<AppliedSalePacks[]>([]);
const orderPacks = ref<Pack[]>([]);
const appliedCouponRegist = ref<OrderSheetAppliedCouponRegist>({});

export function useOrderCoupon() {

    function setAppliedSale(salePacks: AppliedSalePacks[]) {
        appliedSalePacks.value = [];
        appliedSalePacks.value = salePacks;
    }

    function setOrderPack(packs: Pack[]) {
        orderPacks.value = [];
        orderPacks.value = packs;
    }

    function setUsedCoupon(usedCoupon: OrderSheetAppliedCouponRegist) {
        appliedCouponRegist.value = usedCoupon;
    }

    return {
        appliedCouponRegist,
        appliedSalePacks,
        orderPacks,
        setOrderPack,
        setAppliedSale,
        setUsedCoupon
    }
}

const giveawayId = ref<number>(0);
export function useGiveawayTargetModal() {
    const setGiveawayId = (id: number) => {
        giveawayId.value = id;
    }
    
    return {
        giveawayId,
        setGiveawayId,
    }
}

export function useStartOrder() {
    /** STORE **/
    const orderStore = useOrderStore();
    const {
        forOrderOptions
    } = storeToRefs(orderStore)
    /** //STORE **/

    /** VARIABLE **/
    const router = useRouter();
    const { isUser, user, onlyVisitor, clearUserContext } = useUserState();
    /** //VARIABLE **/

    /** FUNC **/
    async function moveToOrderPage() {
        if (!isUser.value) {
            await clearUserContext();
        }

        try {            
            if (forOrderOptions.value.length < 1) {
                return mmon.bom.alert('주문정보가 없습니다.\n 메인으로 이동됩니다', () => {
                    router.replace({
                        name: 'Main'                        
                    })
                });
            }

            const tempOrderId = await orderRepository.tempOrderMake(forOrderOptions.value);
            
            router.replace({
                name: isUser.value ? 'OrderIndex' : 'GuestOrderIndex',
                params : { 
                    id: tempOrderId
                }
            })

        } catch(error) {
            defaultCatch(error)
        } finally {
            mmon.loading.hide();
        }
    }

    /**
     * 
    */
    async function prepareOrder(selectedOptions: { option_id: number, ea: number}[]) {
        if (!isUser.value || user.value === null) {
            return mmon.bom.confirm('로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까', (flag: boolean) => {
                if (flag) {
                    orderStore.setPrepareOrderOptions(selectedOptions);
                    router.push({
                        name: 'Login',
                        query: {
                            redirect_to_after: 'order'
                        }
                    })
                }
            });
        }

        if (user.value.isCertificated === false) {
           return;
        }

        try {
            const tempOrderId = await orderRepository.tempOrderMake(selectedOptions);
            router.push({
                name: 'OrderIndex',
                params : { 
                    id: tempOrderId
                }
            })
        } catch (e) {
            console.log(e);
        }
    }
    /** //FUNC **/

    return {
        moveToOrderPage,
        prepareOrder
    }
}

export function useTempOrder() {
    const orderStore = useOrderStore();   
    const tempOrderOptions = computed(() => orderStore.forOrderOptions);

    /** STORE **/

    /** //STORE **/

    /** VARIABLE **/

    /** //VARIABLE **/

    /** FUNC **/
    function setTempOrder(selectedOptions: { option_id: number, ea: number}[]) {
        orderStore.setPrepareOrderOptions(selectedOptions);
    }
    /** //FUNC **/

    return {
        tempOrderOptions,
        setTempOrder
    }
}

export function useOrderFinish(orderId: string, isOrderSuccess: boolean) {
    /** STORE **/
    const shoppingStore = useShoppingStore();
    /** //STORE **/

    /** VARIABLE **/
    const forRemoveCartIds = computed(() => {
        return shoppingStore.forRemoveCartIdsInOrder.find((removeItem) => {
            return removeItem.orderId === orderId
        })?.cartIds || []
    })

    /** //VARIABLE **/

    /** FUNC **/

    /** //FUNC **/    
    if (isOrderSuccess && forRemoveCartIds.value.length > 0) {
        (async() => {
            try {
                await shoppingRepository.removeCartItems(forRemoveCartIds.value);
                await shoppingRepository.cartCountSync();              
            } catch(e) {
                console.log(e);
            }

        })();        
    }
    

    return {

    }
}
