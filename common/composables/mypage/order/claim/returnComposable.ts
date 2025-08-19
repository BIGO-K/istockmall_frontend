import { RefundInfo, RetrieveMethod, ReturnForm } from "$/@type/myOrder";
import { ReturnReason } from "$/@type/myOrder/claimReason";
import { ReturnableOrder } from "$/@type/myOrder/order";
import { defaultCatch } from "$/functions";
import { computed, onBeforeUnmount, ref } from "vue";
import { useForm } from '$/composables/pageHandler/formComposable';
import { typeCastNumber } from "$/filters";
import { returnRepository } from "$/repository/myOrder/returnRepository";
import { mmon } from "$/helper/mmon";
import { globalConfigsRepository } from "$/repository/globalConfigsRepository";
import { DeliveryCompany } from "$/@type/configs";
import { orderDetailRepository } from "$/repository/myOrder/detailRepository";
import { useOrderItemSet } from "$/composables/mypage/order/myOrderComposable";

/**
 * 주문 반품
 * @param orderId 주문번호 
 * @param orderItemId 주문상품번호 
 * @returns 
 */
export function useReturnOrder(orderId: string, orderItemId: number) {
    /** STORE **/
    
    /** //STORE **/
    
    /** VARIABLE **/
    // 반품가능 주문
    const returnableOrder = ref<ReturnableOrder>({
        orderId: '',
        orderedAt: '',
        packs: [],
        paymentMethodLabel: '',
        shippingAddress: {
            name: '',
            tel: '',
            zipCode: '',
            baseAddress: '',
            detailAddress: '',
        }
    });
    // (선택가능)회수방법
    const retrieveMethods = ref<RetrieveMethod[]>([]);
    // 반품사유 리스트
    const returnReasons = ref<ReturnReason[]>([]); 
    // 택배사 리스트
    const deliveryCompanies = ref<DeliveryCompany[]>([]);
    // 상세사유 필요여부
    const reasonDetailRequired = computed<boolean>(() => {
        return returnReasons.value.find(reason => returnForm.value.returnReason == reason.code)?.requireDetail || false
    });
    // 주문자회수 여부
    const isRetrievedByOrderer = computed<boolean>(() => {
        return retrieveMethods.value.find(method => returnForm.value.retrieveMethod == method.code)?.isRetrieveByOrderer === true;
    });

    // 유효성검사
    const reasonValidationRule = ref<{ [key: string] : string[]}>({
        'returnReason(주문 반품 사유)': [ 'required' ],
        'returnReasonDetail(주문 반품 사유)': [],
    })

    const retrieveValidationRule = ref<{ [key: string] : string[]}>({
        // 반품송장정보
        'retrievedShippingInfo.deliveryCompany(택배사)': [ 'requiredIf:isSelfRetrieve,1' ],
        'retrievedShippingInfo.invoiceNumber(송장번호)': [ 'requiredIf:isSelfRetrieve,1', ],
        // 반품수거지 정보
        'retrieveAddress.name(반품 수거지 주문자)': [ 'requiredIf:isSelfRetrieve,0', 'maxLength:50' ],
        'retrieveAddress.tel(반품 수거지 연락처)': [ 'requiredIf:isSelfRetrieve,0', 'number', 'maxLength:12'],
        'retrieveAddress.zipCode(반품 수거지 우편번호)': [ 'requiredIf:isSelfRetrieve,0' ],
        'retrieveAddress.baseAddress(반품 수거지 주소)': [ 'requiredIf:isSelfRetrieve,0'],
        'retrieveAddress.detailAddress(반품 수거지 상세주소)': [ 'requiredIf:isSelfRetrieve,0', 'maxLength:100'],
    })

    const returnValidationRule = computed<{ [key: string] : string[]}>(() => {
        return Object.assign(
            {
                'orderItemIds(주문 반품하실 상품)': [ 'required' ]
            }, 
            reasonValidationRule.value,
            retrieveValidationRule.value,
            {
                // 환불계좌 정보
                'refundAccount.ownerName(환불계좌)': [ 'required' ],
                'refundAccount.bankCode(환불계좌)': [ 'required' ],
                'refundAccount.accountNumber(환불계좌)': [ 'required' ],
            }
        )
    })

    // 반품 FORM
    const { form: returnForm } = useForm<ReturnForm & {
        isSelfRetrieve: '1'|'0'
    }>(
        {
            orderItemIds: [],
            returnReason: '',
            returnReasonDetail: '',
            retrieveMethod: '',
            retrievedShippingInfo: {
                deliveryCompany: '',
                invoiceNumber: ''
            },
            retrieveAddress: {
                name: '',
                tel: '',
                zipCode: '',
                baseAddress: '',
                detailAddress: '',
            },
            refundAccount: {
                ownerName: '',
                accountNumber: '',
                bankCode: '',
            },
            isSelfRetrieve: '0',
        }, 
        {
            rules: {},
            messages: {
                'orderItemIds.required': ':param(을/를) 선택해주세요.',
                'returnReason.in': ':param(이/가) 올바르지 않습니다.',
                'returnReason.required': ':param(을/를) 선택해주세요.',
                'returnReasonDetail.requiredIf': ':param(을/를) 입력해주세요.',
                'retrievedShippingInfo.deliveryCompany.requiredIf': ':param(을/를) 선택해주세요.',
                'retrievedShippingInfo.invoiceNumber.requiredIf': ':param(을/를) 입력해주세요.',
                'retrieveAddress.name.requiredIf': ':param(은/는) 필수값입니다.',
                'retrieveAddress.tel.requiredIf': ':param(은/는) 필수값입니다.',
                'retrieveAddress.zipCode.requiredIf': ':param(은/는) 필수값입니다.',
                'retrieveAddress.baseAddress.requiredIf': ':param(은/는) 필수값입니다.',
                'retrieveAddress.detailAddress.requiredIf': ':param(은/는) 필수값입니다.',
                'refundAccount.ownerName.required': ':param(을/를) 등록해주세요.',
                'refundAccount.bankCode.required': ':param(을/를) 등록해주세요.',
                'refundAccount.accountNumber.required': ':param(을/를) 등록해주세요.',
            },
        }
    );

    //환불금액정보
    const defaultRefundInfo = {
        totalPaidPrice: 0,
        refundPrice: 0,
        refundPoint: 0,
        calculateDetails: []
    }
    const refundInfo = ref<RefundInfo>({
        ...defaultRefundInfo
    });

    // 반품주문번호 리스트
    const returnIds = ref<string[]>([]);
    /** //VARIABLE **/
    
    /** FUNCTION **/
    /**
     * 환불정보 조회
     * @returns 
     */
    async function fetchRefundInfo() {
        if (
            !returnForm.value.returnReason 
            || returnForm.value.orderItemIds.length < 1 
            || !returnForm.value.retrieveMethod
        ) {
            refundInfo.value = {
                ...defaultRefundInfo
            };
            return;
        }
        try {
            refundInfo.value = await returnRepository.getRefundInfo(
                orderId, 
                returnForm.value.orderItemIds, 
                typeCastNumber(returnForm.value.returnReason), 
                typeCastNumber(returnForm.value.retrieveMethod), 
                {
                    zipCode: returnForm.value.retrieveAddress.zipCode,
                    baseAddress: returnForm.value.retrieveAddress.baseAddress,
                    detailAddress: returnForm.value.retrieveAddress.detailAddress,
                }
            );
        } catch (e) {
            defaultCatch(e);
        }
    }

    /**
     * 반품 신청
     */
    async function applyReturn() {
        try {
            returnIds.value = await returnRepository.applyReturn(orderId, returnForm.value);
        } catch (e) {
            defaultCatch(e)
        }
    }

    /** //FUNCTION **/
    (async () => {
        mmon.loading.show();
        try {
            const [ returnable, reason, deliveryCompanyList ] = await Promise.all([
                returnRepository.getReturnable(orderId, orderItemId),
                returnRepository.getReturnReasons(),
                globalConfigsRepository.getDeliveryCompanies(),
            ])
            returnableOrder.value = returnable.order;
            retrieveMethods.value = returnable.availableRetrieveMethods;
            returnReasons.value = reason;
            deliveryCompanies.value = deliveryCompanyList;
        } catch (e) {
            defaultCatch(e);
        } finally {
            mmon.loading.hide();
        }

        // 반품사유 default 선택처리
        returnForm.value.returnReason = returnReasons.value[0]?.code || '';

        // validation rule update
        reasonValidationRule.value['returnReason(주문 반품 사유)'] = [ 
            'required', 
            `in:${returnReasons.value.map(reason => reason.code).join(',')}` 
        ];
        reasonValidationRule.value['returnReasonDetail(주문 반품 사유)'] = [ 
            `requiredIf:returnReason,${returnReasons.value.filter(reason => reason.requireDetail).map(reason => reason.code).join(',')}` 
        ]
        retrieveValidationRule.value['retrievedShippingInfo.deliveryCompany(택배사)'] = [ 
            'requiredIf:isSelfRetrieve,1', `in:${deliveryCompanies.value.map(company => company.code).join(',')}` 
        ]

    })()
    
    return {
        returnableOrder,
        retrieveMethods,
        returnReasons,
        returnForm,
        deliveryCompanies,
        reasonDetailRequired,
        isRetrievedByOrderer,
        reasonValidationRule,
        retrieveValidationRule,
        returnValidationRule,
        refundInfo,
        returnIds,
        fetchRefundInfo,
        applyReturn,
    }
}

/**
 * 반품완료 주문
 * @returns 
 */
export function useReturnedOrder(returnIds: string[]) {
    /** VARIABLE **/
    const returnedOrderPacks = ref<ReturnableOrder['packs']>([]);
    const { groupByOrderItemSet } = useOrderItemSet();
    /** //VARIABLE **/

    /** FUNCTION **/
    (async () => {
        if (returnIds.length < 1) {
            return;
        }

        try {
            returnIds.forEach(async (returnId) => {
                const { pack } = await orderDetailRepository.getReturnDetail(returnId);
                const returnedPack = Object.assign({}, pack, {
                    orderItemSets: groupByOrderItemSet(pack.orderItems) 
                })
                returnedOrderPacks.value = returnedOrderPacks.value.concat([returnedPack]);
            })
        } catch (e) {
            console.log(e);
        }
    })();
    
    /** //FUNCTION **/
    
    return {
        returnedOrderPacks
    }
}