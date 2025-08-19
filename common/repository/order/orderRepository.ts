import { BackendMapper } from "$/dataMapper/backendMapper";
import BaseRepository from "$/repository/baseRepository";
import {
  CreditCardInstallMents,
  GiveawayGroup,
  GroupOrders,
  GroupPack,
  MyPaymentCard,
  MyPaymentBank,
  MyPayMethod,
  OrdererInfo,
  OrdererInfoResponse,
  OrderPrePareForm,
  OrderResult,
  Pack,
  PackResponse,
  PayMethod,
  PayMethodResponse,
  ShippingAddressResponse,
} from "$/@type/order/order";
import { useShoppingStore } from "$/store/shopping";
import { useOrderStore } from "$/store/order/order";
import { uuid } from "$/functions";

class OrderRepository extends BaseRepository {      
  usablePayMethods: PayMethod[] = [];
  /**
   * 주문서 생성 함수(구매하기 시점)
   * @param selectedOption
   * @returns
   */

  async tempOrderMake(
    addOrder: { option_id: number; ea: number; cartId?: number }[]
  ): Promise<string> {
    const orderStore = useOrderStore();
    orderStore.setPrepareOrderOptions(addOrder);
    const response = await this.dataSource.execute<{ order_id: string }>(
      'ORDER_START',
      {},
      {
        goods_options: addOrder,
      }
    );

    const cartIds = addOrder
      .filter((orderData) => {
        return orderData.cartId !== undefined;
      })
      .map((orderData) => {
        return orderData.cartId;
      });

    if (cartIds.length > 0) {
      const shoppingStore = useShoppingStore();
      shoppingStore.addRemoveCartIdsInOrder({
        orderId: response.order_id,
        cartIds: cartIds,
      })
    }
    return response.order_id;
  }

  /**
   * 주문 데이터 조회 (주문서 페이지 진입시점)
   * @param orderId
   * @returns
   */
  async orderBasicData(
    orderId: string
  ): Promise<{
    orderInfo: OrdererInfo;
    packs: Pack[];
    needPersonalClearanceCode: boolean;
    giveawayGroups: GiveawayGroup[];
  }> {
    const response = await this.dataSource.execute<{
      orderer_information: OrdererInfoResponse;
      packs: PackResponse[];
      need_personal_clearance_code: boolean;
      giveaway_groups: {
        giveaways: {
          id: number;
          name: string;
          condition_label: string;
          image_url: string;
          image_alt: string;
        }[];
        goods_id: number;
      }[];
    }>(
      "ORDER_BASIC_DATA",
      {
        order_id: orderId,
      },
      {}
    );

    const ordererInformation: OrdererInfo =
      response.orderer_information === null
        ? null
        : {
            email:
              response.orderer_information.email === null
                ? ""
                : response.orderer_information.email,
            phone: response.orderer_information.phone,
            latestCashReceiptApplyKey:
              response.orderer_information.latest_cash_receipt_apply_key,
            latestCashReceiptApplyType:
              response.orderer_information.latest_cash_receipt_apply_type,
            personalClearanceCode:
              response.orderer_information.personal_clearance_code === null
                ? ""
                : response.orderer_information.personal_clearance_code,
            pointBalance: response.orderer_information.point_balance,
            latestPaymentBankCode:
              response.orderer_information.latest_payment_bank_code,
            latestPaymentCardCode:
              response.orderer_information.latest_payment_card_code,
            latestShippingMessage:
              response.orderer_information.latest_shipping_message,
            latestPaymentDepositorName:
              response.orderer_information.latest_payment_depositor_name === null
                ? ""
                : response.orderer_information.latest_payment_depositor_name,
            latestPaymentMethodCode:
              response.orderer_information.latest_payment_method_code,
          };

    let packItemsSequence = 0;
    const packs: Pack[] = response.packs.map(function (pack) {
      const orderGoods = pack.items.map(function (item) {
        const packItem = {
          uuid: uuid(),
          sequence: packItemsSequence++,
          appliableImmediatelySale: item.appliable_immediately_sale === null
              ? null
              : {
                  id: item.appliable_immediately_sale.id,
                  title: item.appliable_immediately_sale.title,
                  dcAmount: item.appliable_immediately_sale.discount_amount,
                  dcType: item.appliable_immediately_sale.discount_type,
                  maximumDiscountAmount:
                    item.appliable_immediately_sale.maximum_discount_amount,
                },
          brandId: item.brand_id,
          brandName: item.brand_name,
          goodsId: item.goods_id,
          goodsName: item.goods_name,
          goodsListPrice: item.goods_list_price,
          goodsSellPrice: item.goods_sell_price,
          goodsBaseDiscountedPrice: item.goods_base_discounted_price,
          goodsHeadline: item.goods_headline,
          goodsType: item.goods_type,
          goodsThumbnailUrl: item.goods_thumbnail_url,
          nightSaleId: item.night_sale_id,
          nightSaleAmount: item.night_sale_amount,
          optionExtraAmount: item.option_extra_amount,
          optionId: item.option_id,
          optionName: item.option_name,
          sellerId: item.seller_id,
          sellerName: item.seller_name,
          registCouponId: null,
          appliedCouponAmount: 0,
          tempCouponId: null,
          tempCouponAmount: 0,
          immediatelySaleId:
            item.appliable_immediately_sale === null
              ? null
              : item.appliable_immediately_sale.id,
          immediatelySaleAmount: null,
          usableCouponRegists: item.usable_coupon_regists.map((usableCoupon) => {
            return {
              registId: usableCoupon.regist_id,
              coupon: {
                id: usableCoupon.coupon.id,
                title: usableCoupon.coupon.title,
                dcAmount: usableCoupon.coupon.discount_amount,
                dcType: usableCoupon.coupon.discount_type,
                expireAt: usableCoupon.coupon.expire_at,
                maximumDiscountAmount: usableCoupon.coupon.maximum_discount_amount,
              },
            };
          }),
        };
        return packItem;
      });

      //  그룹핑 ...
      const packItems: GroupOrders[] = Object.values(
        orderRepository.groupingPackItemsByOptionId(orderGoods, "optionId")
      );

      return {
        shippingRuleTitle: pack.shipping_rule_title,
        shippingType: pack.shipping_type,
        shippingPricePaymentType: pack.shipping_price_payment_type,
        shippingPricePolicy: pack.shipping_price_policy,
        shippingRuleId: pack.shipping_rule_id,
        shippingPrice: pack.shipping_price,
        extraShippingPrice: pack.extra_shipping_price,
        chargedShippingPrice: pack.charged_shipping_price,
        conditionAmount: pack.condition_amount,
        conditionalFreeFrom: pack.conditional_free_from,
        orderGoods,
        groupOrders: packItems,
      };
    });

    return {
      orderInfo: ordererInformation,
      packs: packs,
      needPersonalClearanceCode: response.need_personal_clearance_code,
      giveawayGroups: response.giveaway_groups.map((giveawayGroup) => {
        return {
          goodsId: giveawayGroup.goods_id,
          giveaway: giveawayGroup.giveaways.map((giveaway) => {
            return {
              selectAble: true,
              id: giveaway.id,
              label: giveaway.condition_label,
              name: giveaway.name,
              imageUrl: giveaway.image_url,
              imageAlt: giveaway.image_alt,
            };
          }),
        };
      }),
    };
  }
  /**
   * 결제수단 조회
   * @returns
   */
  async getPayMethods(): Promise<PayMethod[]> {    
    if (this.usablePayMethods.length < 1) {
      await this.setUsablePayMethods();
    }
    
    return this.usablePayMethods;
  }

  async getUserPayMethods(): Promise<{
    payMethods: PayMethod[],
    myPayMethods: MyPayMethod[]
  }> {
    const response = await this.dataSource.execute<{
        pay_methods: PayMethodResponse[],
        my_pay_methods: {
            code: number,
            eng_label:string
        }[]
      }>('ORDER_UTIL_PAYMENT_METHODS', {}, {});

      return {
        payMethods: response.pay_methods.map(function (method) {
            return {
              code: method.code,
              engLabel: method.eng_label,
              label: method.label,
              childMethods: method.child_methods.map(function (childMethod) {
                return {
                  code: childMethod.code,
                  label: childMethod.label,
                };
              }),
            };
          }),
          myPayMethods: response.my_pay_methods.map((myPayMethod) => {
            return {
                code: myPayMethod.code,
                engLabel: myPayMethod.eng_label,
                label: myPayMethod.eng_label === 'my_pay_credit_card' ? '간편 카드결제' : '간편 계좌결제'
            }
          })
      }

  }

  /**
   * 결제수단 조회
   * @returns
   */
  async fetchUsablePayMethods(): Promise<PayMethod[]> {
    const response = await this.dataSource.execute<{
      pay_methods: PayMethodResponse[];
    }>('ORDER_UTIL_PAYMENT_METHODS', {}, {});

    return response.pay_methods.map(function (method) {
      return {
        code: method.code,
        engLabel: method.eng_label,
        label: method.label,
        childMethods: method.child_methods.map(function (childMethod) {
          return {
            code: childMethod.code,
            label: childMethod.label,
          };
        }),
      };
    });
  }

  /**
   * 결제수단 설정
   */
  async setUsablePayMethods() {
    const usableMethods = await this.fetchUsablePayMethods();
    this.usablePayMethods = usableMethods;
  }

  /**
   * 결제창 호출
   * @param orderId
   * @param orderData
   * @returns
   */
  async preparePay(
    orderId: string,
    orderData: OrderPrePareForm
  ): Promise<{ payingUrl: string }> {
    const response = await this.dataSource.execute<{ paying_url: string }>(
      'ORDER_PREPARE_PAY',
      {
        order_id: orderId,
      },
      {
        orderer_info: orderData.orderer_info,
        receive_address: orderData.receive_address,
        payment_info: orderData.payment_info,
        packs: orderData.packs,
        refund_account: orderData.refund_account,
        giveaways: orderData.giveaways.filter((giveaway) => {
          return giveaway.giveaway_id != 0 && giveaway.giveaway_id !== null;
        }),
        my_pay_virtual_id: orderData.my_pay_virtual_id,
      }
    );

    return {
      payingUrl: response.paying_url,
    };
  }

  /**
   * 결제결과 조회
   * @param orderId
   * @returns
   */
  async result(orderId: string): Promise<OrderResult> {
    const response = await this.dataSource.execute<{
      packs: {
        shipping_price: number;
        items: {
            seller_name: string;
            brand_name: string;
            goods_id: number;
            goods_name: string;
            option_id: number;
            goods_thumbnail_url: string;
            option_name: string;
            option_extra_amount: number;
            goods_list_price: number;
            goods_sell_price: number;
            goods_base_discounted_price: number;
            night_sale_amount: number;
            coupon_amount: number;
            immediately_sale_amount: number;
            used_point_amount: number;
        }[];
      }[];
      receive_address: ShippingAddressResponse & {
        phone: string;
        message: string;
      };
      payment_info: {
        label: string;
        eng_label: string;
        card_label: string;
        card_masking_number: string;
        approve_at: string;
        bank_label: string;
        bank_account_number: string;
        bank_input_expire_date: string;
        buy_point: number;
        bank_depositor_name: string;
      };
      giveaways: {
        id: number;
        name: string;
        condition_label: string;
        image_url: string;
        image_alt: string;
      }[];
    }>(
      'ORDER_RESULT',
      {
        order_id: orderId,
      },
      {}
    );

    const packs = response.packs.map(function (pack) {
      const packItems = pack.items.map(function (item) {
        return {
          sellerName: item.seller_name,
          brandName: item.brand_name,
          goodsId: item.goods_id,
          goodsName: item.goods_name,
          goodsThumbnailUrl: item.goods_thumbnail_url,
          optionName: item.option_name,
          optionId: item.option_id,
          optionExtraAmount: item.option_extra_amount,
          goodsListPrice: item.goods_list_price,
          goodsSellPrice: item.goods_sell_price,
          goodsBaseDiscountedPrice: item.goods_base_discounted_price,
          nightSaleAmount: item.night_sale_amount,
          registCouponAmount: item.coupon_amount,
          immediatelySaleAmount: item.immediately_sale_amount,
          usedPointAmount: item.used_point_amount,
        };
      });

      const groupItems: GroupPack[] = Object.values(
        orderRepository.groupingPackItemsByOptionId(packItems, "optionId")
      );
      return {
        shippingPrice: pack.shipping_price,
        items: packItems,
        groupItems: groupItems,
      };
    });

    return {
      packs: packs,
      receiveAddress: {
        id: 0,
        shippingName: response.receive_address.shipping_name,
        name: response.receive_address.name,
        tel: response.receive_address.phone,
        zipCode: response.receive_address.zip_code,
        baseAddress: response.receive_address.base_address,
        detailAddress: response.receive_address.detail_address,
        message: response.receive_address.message,
      },
      paymentInfo: {
        label: response.payment_info.label,
        engLabel: response.payment_info.eng_label,
        cardLabel: response.payment_info.card_label,
        cardMaskingNumber: response.payment_info.card_masking_number,
        approveAt: response.payment_info.approve_at,
        bankLabel: response.payment_info.bank_label,
        bankAccountNumber: response.payment_info.bank_account_number,
        bankInputExpireDate: response.payment_info.bank_input_expire_date,
        buyPoint: response.payment_info.buy_point,
        bankDepositorName: response.payment_info.bank_depositor_name,
      },
      giveaways: response.giveaways.map((giveaway) => {
        return {
          id: giveaway.id,
          name: giveaway.name,
          conditionLabel: giveaway.condition_label,
          imageUrl: giveaway.image_url,
        };
      }),
    };
  }

  /**
   * propertyKeyName 로 그룹핑 처리
   * @param objectArray : 객체 배열
   * @param propertyKeyName: 그룹핑 처리할 키
   * @returns
   */
  groupingPackItemsByOptionId(objectArray, propertyKeyName: string) {
    return objectArray.reduce(function (acc, currentValue) {
      const key = currentValue[propertyKeyName];
      const test = Object.assign({ items: [] }, currentValue);
      if (!acc[key]) {
        acc[key] = test;
      }
      acc[key].items.push(currentValue);
      return acc;
    }, {});
  }

  /**
   * 카드 무이자 할부 정보 조회
   * @returns
   */
  async cardInterest(): Promise<CreditCardInstallMents[]> {
    const response = await this.dataSource.execute<{
      interests: {
        card_code: number;
        interest_free_months: number[];
        partial_interest_free_months: number[];
      }[];
    }>('ORDER_UTIL_CARD_INSTALLMENTS', {}, {});

    return response.interests.map((interest) => {
      return {
        cardCode: interest.card_code,
        interestFreeMonths: interest.interest_free_months,
        partialInterestFreeMonths: interest.partial_interest_free_months,
      };
    });
  }

  /**
   * 간편결제 등록죈 결제 계좌이체 수단 조회
   * @returns
   */
   async getMyPayBank(): Promise<MyPaymentBank[]> {
    const response = await this.dataSource.execute<{
      registed_pays: {
        display_name: string;
        image_url: string;
        masked_code: string;
        method: number;
        nick_name: string;
        virtual_id: string;
        bank_code: number;
      }[];
    }>(
      'ORDER_UTIL_MY_PAY_METHODS',
      {},
      {
        for_credit_card: false
      }
    );

    return response.registed_pays.map((registedPay) => {
      return {
        method: registedPay.method,
        name: registedPay.display_name,
        imageUrl: registedPay.image_url,
        maskingCode: registedPay.masked_code,
        split4DigitsMaskingCode: registedPay.masked_code
          .replace(
            /(^[0-9,*]{4})([0-9,*]{4})([0-9,*]{4})([0-9,*]{4})/,
            "$1-$2-$3-$4"
          )
          .split("-"),
        nickName: registedPay.nick_name,
        virtualId: registedPay.virtual_id,
        bankCode: registedPay.bank_code
      };
    });
  }

  /**
   * 간편결제 등록죈 결제  카드 수단 조회
   * @returns { Array<MyPaymentCard> } : 등록된 카드수단 배열 반환
   */
   async getMyPayCard(): Promise<MyPaymentCard[]> {
    const response = await this.dataSource.execute<{
      registed_pays: {
        display_name: string;
        image_url: string;
        masked_code: string;
        method: number;
        nick_name: string;
        virtual_id: string;
        card_code: number;
      }[];
    }>(
      'ORDER_UTIL_MY_PAY_METHODS',
      {},
      {
        for_credit_card: true,
      }
    );

    return response.registed_pays.map((registedPay) => {
      return {
        method: registedPay.method,
        name: registedPay.display_name,
        imageUrl: registedPay.image_url,
        maskingCode: registedPay.masked_code,
        split4DigitsMaskingCode: registedPay.masked_code
          .replace(
            /(^[0-9,*]{4})([0-9,*]{4})([0-9,*]{4})([0-9,*]{4})/,
            "$1-$2-$3-$4"
          )
          .split("-"),
        nickName: registedPay.nick_name,
        virtualId: registedPay.virtual_id,
        cardCode: registedPay.card_code
      };
    });
  }

  /**
   * 간편결제 토큰 발급 처리 / 최초1회 발급된 경우는 해당 프로세스 스킵
   * @param {boolean} isForCard : 카드 true, 계좌 false
   * @returns
   */
  async getTokenWithEnterUrl(isForCard: boolean): Promise<{
    isRegisted: boolean;
    enterUrl: string;
  }> {
    const response = await this.dataSource.execute(
      'ORDER_UTIL_MY_PAY_PREPARE_TOKEN',
      {},
      {
        for_credit_card: isForCard,
      }
    );

    return {
      isRegisted: response.is_registed,
      enterUrl: response.enter_url,
    };
  }
  /**
   * 간편결제 등록 전처리
   * @param {boolean} isForCard : 카드 true, 계좌 false
   * @returns {linkType: string, linkUrl: string} : 응답객체
   */
  async prepareRegist(isForCard: boolean): Promise<{
    linkType: string;
    linkUrl: string;
  }> {
    const response = await this.dataSource.execute<{
      prepared: {
        type: string;
        url: string;
      };
    }>(
      'ORDER_UTIL_MY_PAY_PREPARE_REIGST',
      {},
      {
        for_credit_card: isForCard,
      }
    );

    return {
      linkType: response.prepared.type,
      linkUrl: response.prepared.url,
    };
  }

  /**
   * 간편결제 관리 페이지 호출 전처리
   * @param {boolean} isForCard : 카드 true, 계좌 false
   * @returns
   */
  async prepareManageMent(isForCard: boolean): Promise<{
    linkType: string;
    linkUrl: string;
  }> {
    const response = await this.dataSource.execute<{
      prepared: {
        type: string;
        url: string;
      };
    }>(
      'ORDER_UTIL_MY_PAY_MANAGEMENT',
      {},
      {
        for_credit_card: isForCard,
      }
    );

    return {
      linkType: response.prepared.type,
      linkUrl: response.prepared.url,
    };
  }
}

const orderRepository = new OrderRepository(new BackendMapper());

export { orderRepository };
