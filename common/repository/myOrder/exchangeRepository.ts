import { Moment } from 'moment';
import BaseRepository from '$/repository/baseRepository';
import { BackendMapper } from '$/dataMapper/backendMapper';
import { JsonMapper } from '$/dataMapper/jsonMapper';
import { CLAIM_REASON_ICON_CLASS } from '$/constants';
import { 
    ChosenClaimReason, 
    ChosenClaimReasonResponse, 
    ExchangeReason, 
    ExchangeReasonResponse 
} from '$/@type/myOrder/claimReason';
import { 
    ExchangeOrderItem, 
    ExchangeableOrderItem, 
    ExchangeableOrderItemResponse,
    ExchangeToReturnableOrderItemResponse,
    ExchangeToReturnableOrderItem,
} from '$/@type/myOrder/item';
import {
    ExchangeOrderResponse,
    ExchangeOrder,
    ExchangeableOrder, 
    ExchangeToReturnableOrder,
    ExchangeableOrderResponse,
    ExchangeToReturnableOrderResponse
} from '$/@type/myOrder/order';
import { 
    AddressForm, 
    RefundInfo, 
    RefundInfoResponse, 
    RetrieveMethod, 
    RetrieveMethodResponse,
    ExchangeForm,
    ExchangePaymentForm,
    ExchangeToReturnForm,
    ExchangeOptionPair,
    ExchangeAdditionalPaymentPrice, 
    ExchangeAdditionalPaymentPriceResponse,
} from '$/@type/myOrder';
import { typeCastNumber } from '$/filters';
import { useOrderItemSet } from '$/composables/mypage/order/myOrderComposable';

class ExchangeRepository extends BaseRepository
{
    /**
     * 교환사유
     */
    reasons: ExchangeReason[] = [];

    /**
     * 교환주문 리스트 조회
     * @param  {Moment} startDate
     * @param  {Moment} endDate
     */
    async getList(startDate: Moment, endDate: Moment): Promise<ExchangeOrder[]> {
        const { exchange_orders } = await this.dataSource.execute<{
            exchange_orders: ExchangeOrderResponse[]
        }>(
            "ORDER_EXCHANGE_LIST",
            {
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD'),
            },
            {}
        );

        return exchange_orders.map(order => {
            // 포장단위
            const packs: ExchangeOrder['packs'] = order.packs.map(pack => {
                const sellers: ExchangeOrder['packs'][0]['sellers'] = pack.sellers.map(seller => {
                    const orderItems: ExchangeOrderItem[] = seller.order_items.map(orderItem => {
                        return {
                            id: orderItem.id,
                            exchangeTargetId: orderItem.exchange_target_id,
                            orderStatusLabel: orderItem.order_status_label,
                            paidPrice: orderItem.paid_price,
                            pointUsed: typeCastNumber(orderItem.point_used),
                            exchangedOptionName: orderItem.exchanged_option_name,
                            exchangeCancelable: orderItem.exchange_cancelable,
                            toReturnSwitchable: orderItem.to_return_switchable,
                            returnDeliveryTrackable: orderItem.return_delivery_trackable,
                            returnDeliveryTrackingUrl: orderItem.return_delivery_tracking_url,
                            goods: {
                                id: orderItem.goods.id,
                                name: orderItem.goods.name,
                                brandName: orderItem.goods.brand_name,
                                thumbnailUrl: orderItem.goods.thumbnail_url,
                                optionName: orderItem.goods.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                                optionId: orderItem.goods.option_id,
                                isSoldout: orderItem.goods.is_soldout,
                                ea: 1,
                            }
                        }
                    })
                    return {
                        id: seller.id,
                        name: seller.name,
                        tel: seller.tel,
                        orderItems: orderItems
                    }
                }) 

                return {
                    paidShippingPrice: pack.paid_shipping_price,
                    shippingRuleId: pack.shipping_rule_id,
                    sellers: sellers,
                }
            });
            
            // 주문 리스트
            return {
                orderId: order.order_id,
                exchangeId: order.exchange_id,
                orderedAt: order.ordered_at,
                packs: packs
            }
        });
    }

    /**
     * 주문및 선택한주문상품과 묶음교환가능 주문상품 조회
     * @param  {string} orderId
     * @param  {number} orderItemId
     * @returns Promise
     */
    async getExchangeable(orderId: string, orderItemId: number):Promise<{
        order: ExchangeableOrder
        availableRetrieveMethods: RetrieveMethod[]
    }> {
        const { exchangeable_order, available_retrieve_methods } = await this.dataSource.execute<{
            exchangeable_order: ExchangeableOrderResponse
            available_retrieve_methods: RetrieveMethodResponse[]
        }>(
            "ORDER_EXCHANGE_EXCHANGEABLE",
            {
                order_id: orderId,
                order_item_id: orderItemId
            },
            {}
        );
        
        const { groupByOrderItemSet } = useOrderItemSet()

        return {
            order: {
                orderId: exchangeable_order.order_id,
                orderedAt: exchangeable_order.ordered_at,
                paymentMethodLabel: exchangeable_order.payment_method_label,
                shippingAddress: {
                    name: exchangeable_order.shipping_address.name,
                    tel: exchangeable_order.shipping_address.tel,
                    zipCode: exchangeable_order.shipping_address.zip_code,
                    baseAddress: exchangeable_order.shipping_address.base_address,
                    detailAddress: exchangeable_order.shipping_address.detail_address,
                },
                packs: exchangeable_order.packs.map((pack) => {
                    const items:ExchangeableOrderItem[] = pack.order_items.map(item => {
                        return {
                            id: item.id,
                            orderStatusLabel: item.order_status_label,
                            orderStatusCode: item.order_status_code,
                            paidPrice: item.paid_price,
                            pointUsed: typeCastNumber(item.point_used),
                            usedCouponTitle: item.used_coupon_title,
                            goods: {
                                id: item.goods.id,
                                name: item.goods.name,
                                brandName: item.goods.brand_name,
                                thumbnailUrl: item.goods.thumbnail_url,
                                optionName: item.goods.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                                ea: 1,
                                isSoldout: item.goods.is_soldout,
                                optionId: item.goods.option_id,
                            },
                            exchangeableOptions: item.exchangeable_options.map(option => {
                                return {
                                    id: option.id,
                                    label1: option.label1,
                                    label2: option.label2,
                                    stock: option.stock
                                }
                            }),
                            exchangeOption: undefined,
                            sellerName: item.seller_name
                        }
                    });

                    return {
                        paidShippingPrice: pack.paid_shipping_price,
                        shippingRuleId: pack.shipping_rule_id,
                        orderItemSets: groupByOrderItemSet(items)
                    }
                })
            },
            availableRetrieveMethods: available_retrieve_methods.map(method => {
                return {
                    code: method.code,
                    label: method.label,
                    isRetrieveByOrderer: method.is_retrieve_by_orderer,
                    isAutoRetrieve: method.is_auto_retrieve,
                }
            })
        }
    }

    /**
     * 교환사유 조회 SETTER
     */
    async setReasons(): Promise<void> {
        const { exchange_reasons } = await this.dataSource.execute<{
            exchange_reasons: ExchangeReasonResponse[]
        }>(
            "CONF_EXCHANGE_REASONS",
            {},
            {}
        );
        
        this.reasons = exchange_reasons.map(reason => {
            return {
                code: reason.code,
                label: reason.label,
                engLabel: reason.eng_label,
                iconClassName: CLAIM_REASON_ICON_CLASS[reason.eng_label.toUpperCase()],
                requireDetail: reason.require_detail,
                censure: reason.censure,
                isSameOptionExchangeable: reason.censure === 'seller'
            }
        });
    }

    /**
     * 교환사유 조회 GETTER
     */
    async getReasons(): Promise<ExchangeReason[]> {
        if (this.reasons.length < 1) {
            await this.setReasons();
        }
        
        return this.reasons;
    }

    /**
     * @param  {string} orderId
     * @param  {ExchangeOptionPair[]} exchangeOptions
     * @param  {number} reasonCode
     * @param  {number} retrieveMethod
     * @param  {AddressForm} retrieveAddress
     * @param  {AddressForm} exchangeAddress
     * @returns Promise
     */
    async getAdditionalPaymentsInfo(
        orderId: string, 
        exchangeOptions: ExchangeOptionPair[], 
        reasonCode: number, 
        retrieveMethod:number, 
        retrieveAddress: AddressForm,
        exchangeAddress: AddressForm
    ): Promise<ExchangeAdditionalPaymentPrice> {
        const { additional_payments } = await this.dataSource.execute<{
            additional_payments: ExchangeAdditionalPaymentPriceResponse
        }>(
            "ORDER_EXCHANGE_ADDITIONAL_PAYMENTS",
            {
                order_id: orderId,
            },
            {
                exchange_options: exchangeOptions.map(exchangeOption => {
                    return {
                        order_item_id: exchangeOption.orderItemId,
                        option_id: exchangeOption.optionId,
                    }
                }),
                exchange_reason_code: reasonCode,
                retrieve_method: retrieveMethod,
                // 교환 수거지 정보
                retrieve_from: {
                    zip_code: retrieveAddress.zipCode,
                    base_address: retrieveAddress.baseAddress,
                    detail_address: retrieveAddress.detailAddress,
                },
                // 교환 배송지 정보
                exchange_to: {
                    zip_code: exchangeAddress.zipCode,
                    base_address: exchangeAddress.baseAddress,
                    detail_address: exchangeAddress.detailAddress,
                }
            }
        );

        return {
            totalPrice: additional_payments.total_price,
            calculateDetails: additional_payments.calculate_details.map(detail => {
                return {
                    label: detail.label,
                    amount: detail.amount,
                }
            })
        }
    }

    /**
     * 교환 신청
     * @param  {number} orderId
     * @param  {ExchangeForm} exchangeForm
     * @returns Promise
     */
    async applyExchange(orderId: string, exchangeForm: ExchangeForm): Promise<string>{
        const { exchange_id } = await this.dataSource.execute<{
            exchange_id: string,
        }>(
            "ORDER_EXCHANGE",
            {
                order_id: orderId,
            },
            {
                is_additional_payment_paid: exchangeForm.isAdditionalPaymentPaid,
                payment_token: exchangeForm.paymentToken,
                exchange_option_pair: exchangeForm.exchangeOptionPairs.map(pair => {
                    return {
                        order_item_id: pair.orderItemId,
                        option_id: pair.optionId,
                    }
                }),
                reason_code: exchangeForm.reason,
                reason_detail: exchangeForm.reasonDetail,
                retrieve_method_code: exchangeForm.retrieveMethod,
                // 교환 송장번호
                retrieve_invoice: {
                    delivery_company: exchangeForm.retrievedShippingInfo.deliveryCompanyCode || '',
                    invoice_number: exchangeForm.retrievedShippingInfo.invoiceNumber || '',
                },
                // 교환 수거지 정보
                retrieve_from: {
                    name: exchangeForm.retrieveAddress.name || '',
                    tel: exchangeForm.retrieveAddress.tel || '',
                    zip_code: exchangeForm.retrieveAddress.zipCode || '',
                    base_address: exchangeForm.retrieveAddress.baseAddress || '',
                    detail_address: exchangeForm.retrieveAddress.detailAddress || '',
                },
                // 교환 배송지 정보
                exchange_to: {
                    name: exchangeForm.exchangeAddress.name || '',
                    tel: exchangeForm.exchangeAddress.tel || '',
                    zip_code: exchangeForm.exchangeAddress.zipCode || '',
                    base_address: exchangeForm.exchangeAddress.baseAddress || '',
                    detail_address: exchangeForm.exchangeAddress.detailAddress || '',
                }
            }
        );

        return exchange_id
    }

    /**
     * 교환 추가결제창 url 조회
     * @param  {string} orderId
     * @param  {ExchangePaymentForm} paymentForm
     * @param  {ExchangeForm} exchangeForm
     * @returns string
     */
    async prepareAdditionalPay(
        orderId: string, 
        paymentForm: ExchangePaymentForm, 
        exchangeForm: ExchangeForm
    ): Promise<{ 
        payingUrl: string; 
        paymentToken: string 
    }> {
        const { paying_url, payment_token } =  await this.dataSource.execute<{ paying_url: string; payment_token: string }>(
            'ORDER_EXCHANGE_PREPARE_PAY',
            {
                order_id: orderId
            },
            {
                payment_info: {
                    card_code: paymentForm.cardCode,
                    interest_month: 0,
                    is_interest_free: false,
                    is_partial_interest_free: false,
                    payment_price: paymentForm.paymentPrice
                },
                exchange_form: {
                    exchange_option_pair: exchangeForm.exchangeOptionPairs.map(pair => {
                        return {
                            order_item_id: pair.orderItemId,
                            option_id: pair.optionId,
                        }
                    }),
                    reason_code: exchangeForm.reason,
                    reason_detail: exchangeForm.reasonDetail,
                    retrieve_method_code: exchangeForm.retrieveMethod,
                    // 교환 송장번호
                    retrieve_invoice: {
                        delivery_company: exchangeForm.retrievedShippingInfo.deliveryCompanyCode || '',
                        invoice_number: exchangeForm.retrievedShippingInfo.invoiceNumber || '',
                    },
                    // 교환 수거지 정보
                    retrieve_from: {
                        name: exchangeForm.retrieveAddress.name || '',
                        tel: exchangeForm.retrieveAddress.tel || '',
                        zip_code: exchangeForm.retrieveAddress.zipCode || '',
                        base_address: exchangeForm.retrieveAddress.baseAddress || '',
                        detail_address: exchangeForm.retrieveAddress.detailAddress || '',
                    },
                    // 교환 배송지 정보
                    exchange_to: {
                        name: exchangeForm.exchangeAddress.name || '',
                        tel: exchangeForm.exchangeAddress.tel || '',
                        zip_code: exchangeForm.exchangeAddress.zipCode || '',
                        base_address: exchangeForm.exchangeAddress.baseAddress || '',
                        detail_address: exchangeForm.exchangeAddress.detailAddress || '',
                    }
                }
            }
        );

        return {
            payingUrl: paying_url,
            paymentToken: payment_token,
        }
    }

    /**
     * 교환 추가결제 결과 조회
     * @param paymentToken 결제 토큰
     * @returns 
     */
    async getAdditionalPayResult(paymentToken: string): Promise<{isSuccess: boolean; errorMessage: string}> {
        const { is_success, error_message } = await this.dataSource.execute<{is_success: boolean; error_message: string}>(
            'ORDER_EXCHANGE_PAY_RESULT',
            {},
            {
                payment_token: paymentToken
            }
        );

        return {
            isSuccess: is_success,
            errorMessage: error_message,
        }
    }

    /**
     * 교환 철회 처리
     * @param  {string} exchangeId
     * @param  {number} exchangeTargetId
     * @returns Promise
     */
    async cancelExchange(exchangeId: string, exchangeTargetId: number): Promise<void>{
        await this.dataSource.execute<void>(
            "ORDER_EXCHANGE_CANCEL",
            {
                exchange_id: exchangeId,
                exchange_target_id: exchangeTargetId,
            },
            {}
        );
    }

    /**
     * 반품전환 가능 주문상품 조회
     * 
     * @param exchangeId
     */
    async getSwitchReturnable(exchangeId: string): Promise<{
        order: ExchangeToReturnableOrder
        chosenExchangeReason: ChosenClaimReason
    }> {
        const { switch_returnable_order, chosen_exchange_reason } = await this.dataSource.execute<{
            switch_returnable_order: ExchangeToReturnableOrderResponse
            chosen_exchange_reason: ChosenClaimReasonResponse
        }>(
            "ORDER_EXCHANGE_SWITCH_RETURNABLE",
            {
                exchange_id: exchangeId,
            },
            {}
        );

        const { groupByOrderItemSet } = useOrderItemSet();
        
        return {
            order: {
                orderId: switch_returnable_order.order_id,
                orderedAt: switch_returnable_order.ordered_at,
                paymentMethodLabel: switch_returnable_order.payment_method_label,
                shippingAddress: {
                    name: switch_returnable_order.shipping_address.name,
                    tel: switch_returnable_order.shipping_address.tel,
                    zipCode: switch_returnable_order.shipping_address.zip_code,
                    baseAddress: switch_returnable_order.shipping_address.base_address,
                    detailAddress: switch_returnable_order.shipping_address.detail_address,
                },
                packs: switch_returnable_order.packs.map((pack) => {
                    const items:ExchangeToReturnableOrderItem[] = pack.order_items.map(item => {
                        return {
                            id: item.id,
                            exchangeTargetId: item.exchange_target_id,
                            orderStatusLabel: item.order_status_label,
                            orderStatusCode: item.order_status_code,
                            paidPrice: item.paid_price,
                            pointUsed: typeCastNumber(item.point_used),
                            usedCouponTitle: item.used_coupon_title,
                            sellerName: item.seller_name,
                            goods: {
                                id: item.goods.id,
                                name: item.goods.name,
                                brandName: item.goods.brand_name,
                                thumbnailUrl: item.goods.thumbnail_url,
                                optionName: item.goods.option_name?.replace(/\/|(\@\^\@)/gi, ' '),
                                ea: 1,
                                isSoldout: item.goods.is_soldout,
                                optionId: item.goods.option_id,
                            }
                        }
                    });

                    return {
                        shippingRuleId: pack.shipping_rule_id,
                        paidShippingPrice: pack.paid_shipping_price,
                        orderItemSets: groupByOrderItemSet(items)
                    }
                })
            },
            chosenExchangeReason: {
                code: chosen_exchange_reason.code,
                label: chosen_exchange_reason.label,
                engLabel: chosen_exchange_reason.eng_label,
                detail: chosen_exchange_reason.detail
            }
        }
    }

    /**
     * 반품전환 > 환불금액 정보 조회
     * @param  {string} exchangeId
     * @param  {number[]} orderItemIds
     * @returns Promise
     */
    async getSwitchReturnRefundInfo(exchangeId: string, orderItemIds: number[]): Promise<RefundInfo> {
        const { refund_info } = await this.dataSource.execute<{
            refund_info: RefundInfoResponse
        }>(
            "ORDER_EXCHANGE_SWITCH_RETURN_REFUND_INFO",
            {
                exchange_id: exchangeId,
            },
            {
                exchange_target_ids: orderItemIds,
            }
        );

        return {
            totalPaidPrice: refund_info.total_paid_price,
            refundPrice: refund_info.refund_price,
            refundPoint: refund_info.refund_point,
            calculateDetails: refund_info.calculate_details.map(detail => {
                return {
                    label: detail.label,
                    amount: detail.amount,
                    isSubtracted: detail.is_substracted,
                }
            })
        }
    }

    /**
     * 반품전환 신청
     * @param  {string} exchangeId                     교환번호
     * @param  {ExchangeToReturnForm} returnForm    반품전환 form
     */
    async switchToReturn(exchangeId: string, returnForm: ExchangeToReturnForm): Promise<string> {
        const { return_id } = await this.dataSource.execute<{
            return_id: string
        }>(
            "ORDER_EXCHANGE_TO_RETURN",
            {
                exchange_id: exchangeId,
            },
            {
                exchange_target_ids: returnForm.exchangeTargetIds,
                //환불계좌 정보
                refund_account: {
                    owner_name: returnForm.refundAccount.ownerName,
                    bank_code: returnForm.refundAccount.bankCode,
                    account_number: returnForm.refundAccount.accountNumber,
                }
            }
        );

        return return_id;
    }

    /**
     * 교환 > 반품송장정보 수정
     * @param  {string} exchangeId
     * @param  {string} deliveryCompanyCode
     * @param  {string} invoiceNumber
     */
    async updateRetrieveInvoice(exchangeId: string, deliveryCompanyCode: string, invoiceNumber: string) {
        await this.dataSource.execute<void>(
            "ORDER_EXCHANGE_UPDATE_RETRIEVE_INVOICE",
            {
                exchange_id: exchangeId,
                delivery_company_code: deliveryCompanyCode,
                invoice_no: invoiceNumber
            },
            {}
        );
    }
}

const exchangeRepository = new ExchangeRepository(
    new BackendMapper
);

export {
    exchangeRepository
}