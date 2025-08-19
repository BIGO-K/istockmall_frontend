import { CancelForm, RefundInfo } from "$/@type/myOrder";
import { CancelReason } from "$/@type/myOrder/claimReason";
import { CancelableOrder } from "$/@type/myOrder/order";
import { defaultCatch, isEqualArray, pluck } from "$/functions";
import { cancelRepository } from "$/repository/myOrder/cancelRepository";
import { computed, ref, watch } from "vue";
import { useForm } from '$/composables/pageHandler/formComposable';
import { typeCastBoolean, typeCastNumber } from "$/filters";
import { orderDetailRepository } from "$/repository/myOrder/detailRepository";
import { useOrderItemSet } from "$/composables/mypage/order/myOrderComposable";
import { useRouter } from "vue-router";

/**
 * 주문 취소
 * @param orderId 주문번호 
 * @param orderItemId 주문상품번호 
 * @returns 
 */
export function useCancelOrder(orderId: string) {
    
    /** STORE **/
    const router = useRouter();
    /** //STORE **/
    
    /** VARIABLE **/
    // 취소가능주문
    const cancelableOrder = ref<CancelableOrder>({
        orderId: orderId,
        orderedAt: '',
        paymentMethodLabel: '',
        isPaid: false,
        requireRefundAccount: false,
        packs: [],
    });
    
    // 취소사유
    const cancelReasons = ref<CancelReason[]>([]);
    // 취소상세 필요여부
    const reasonDetailRequired = computed<boolean>(() => {
        const selectedReason = cancelReasons.value
            .find((reason) => reason.code == cancelForm.value.reason)
        return typeCastBoolean(selectedReason?.requireDetail);
    })

    // 환불정보
    const refundInfo = ref<RefundInfo>({
        totalPaidPrice: 0,
        refundPrice: 0,
        refundPoint: 0,
        calculateDetails: []
    });
    // 총 환불금액
    const totalRefundAmount = computed(() => {
        // 환불금액 상세 합계
        const sumOfRefundCalculateDetail = refundInfo.value.calculateDetails.reduce((accumulator, current) => {
            return accumulator + (current.isSubtracted ? -Number(current.amount) : Number(current.amount))
        }, 0);
        return refundInfo.value.refundPrice - sumOfRefundCalculateDetail;
    })

    // 취소 FORM
    const { form: cancelForm } = useForm<CancelForm & {
        requireRefundAccount: boolean
    }>(
        {
            orderItemIds: [],
            reason: '',
            reasonDetail: '',
            refundAccount: {
                ownerName: '',
                accountNumber: '',
                bankCode: '',
                bankName: '',
            },
            requireRefundAccount: false,
        },
        {
            rules: {
                'orderItemIds(주문 취소하실 상품)': [ 'required' ],
                'reason(주문 취소 사유)':  [],
                'reasonDetail(주문 취소 사유)': [],
                // 환불계좌 정보
                'refundAccount.ownerName(환불계좌)': [ 'requiredIf:requireRefundAccount' ],
                'refundAccount.bankCode(환불계좌)': [ 'requiredIf:requireRefundAccount' ],
                'refundAccount.accountNumber(환불계좌)': [ 'requiredIf:requireRefundAccount' ],
            },
            messages: {
                'orderItemIds.required': ':param(을/를) 선택해주세요.',
                'reason.in': ':param(이/가) 올바르지 않습니다.',
                'reason.required': ':param(을/를) 선택해주세요.',
                'reasonDetail.requiredIf': ':param(을/를) 입력해주세요.',
                'refundAccount.ownerName.requiredIf': ':param(을/를) 등록해주세요.',
                'refundAccount.bankCode.requiredIf': ':param(을/를) 등록해주세요.',
                'refundAccount.accountNumber.requiredIf': ':param(을/를) 등록해주세요.',
            }
        }
    ); 
   
    const cancelIds = ref<string[]>([]);
    /** FUNCTION **/
    /**
     * 환불 정보 조회
     */
    async function fetchRefundInfo(orderItemIds: number[], cancelReasonCode: number) {
        if (!cancelReasonCode || orderItemIds.length < 1) {
            refundInfo.value = {
                totalPaidPrice: 0,
                refundPrice: 0,
                refundPoint: 0,
                calculateDetails: []
            };
            return;
        }

        try {
            refundInfo.value = await cancelRepository.getRefundInfo(orderId, orderItemIds, cancelReasonCode);
        } catch (e) {
            defaultCatch(e);
        }
    }

    /**
     * 취소 신청
     */
    async function applyCancel() {
        try {
            cancelIds.value = await cancelRepository.cancel(orderId, cancelForm.value);
        } catch (e) {
            throw(e);
            // defaultCatch(e);
        }
    }

    /** //FUNCTION **/
    (async () => {
        try {
            const [ cancelable, reasons ] = await Promise.all([
                cancelableOrder.value = await cancelRepository.getCancelables(orderId),
                cancelReasons.value = await cancelRepository.getCancelReasons(),
            ])
    
            cancelableOrder.value = cancelable;
            cancelReasons.value = reasons
        } catch (e) {
            defaultCatch(e, {
                404: '취소할 상품이 없습니다.'
            }, () => {
                router.go(-1);
            });
        }

        // 결제완료주문여부
        cancelForm.value.requireRefundAccount = cancelableOrder.value.requireRefundAccount;

        // 유효성검사 rule update
        if (!cancelForm.value.rules) {
            cancelForm.value.rules = {};
        }
        cancelForm.value.rules['reason(주문 취소 사유)'] = [ 'required', `in:${cancelReasons.value.map(reason => reason.code).join(',')}` ];
        cancelForm.value.rules['reasonDetail(주문 취소 사유)'] = [ 
            `requiredIf:reason,${cancelReasons.value.filter(reason => reason.requireDetail).map(reason => reason.code).join(',')}` 
        ];
        
        // 결제완료주문이 아닌경우 전체선택(부분취소 불가)
        if (!cancelableOrder.value.isPaid) {
            cancelForm.value.orderItemIds = pluck(cancelableOrder.value.packs, 'orderItemSets.items.id');
            return;
        }  

        // 환불정보 조회 watch (결제완료주문 아닌경우 실행하지 않음)
        watch([
            () => cancelForm.value.orderItemIds, 
            () => cancelForm.value.reason
        ], async ([orderItemIds, reason], [prefOrderItemIds, prevReason]) => {
            // 변경사항이 없으면 재조회하지 않고 종료
            if (isEqualArray(prefOrderItemIds.sort(), orderItemIds.sort()) && prevReason == reason) {
                return;
            }
            await fetchRefundInfo(cancelForm.value.orderItemIds, typeCastNumber(cancelForm.value.reason));
        })
    })()

    return {
        cancelableOrder,
        cancelReasons,
        reasonDetailRequired,
        cancelForm,
        refundInfo,
        totalRefundAmount,
        cancelIds,
        applyCancel,
    }
}

/**
 * 취소완료 주문
 * @returns 
 */
export function useCanceledOrder(cancelIds: string[]) {
    /** VARIABLE **/
    const canceledOrderPacks = ref<CancelableOrder['packs']>([]);
    const includeApplyStatus = ref<boolean>(false);
    const { groupByOrderItemSet } = useOrderItemSet();
    /** //VARIABLE **/

    (async () => {
        if (cancelIds.length < 1) {
            return;
        }
        
        try {
            cancelIds.forEach(async (cancelId) => {
                const { packs, isContainApplyStatus } = await orderDetailRepository.getCancelDetail(cancelId);
                includeApplyStatus.value = includeApplyStatus.value || isContainApplyStatus;
                const canceledPacks = packs.map(pack => {
                    return Object.assign({}, pack, {
                        orderItemSets: groupByOrderItemSet(pack.orderItems)
                    })
                })
                canceledOrderPacks.value = canceledOrderPacks.value.concat(canceledPacks)
            })
        } catch (e) {
            console.log(e)
        }
    })();

    return {
        canceledOrderPacks,
        includeApplyStatus,
    }
}