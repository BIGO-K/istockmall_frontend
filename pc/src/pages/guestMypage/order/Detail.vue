<template>
    <div class="mm_page-content-body">
        <h3 class="mm_heading">
            <b>주문 상세</b>
        </h3>
        <div class="m_my-order-detail">
            <h4 class="m...detail-title">
                <b>{{ MMFilters.formatDate(order.orderedAt, "YYYY.MM.DD") }}</b><strong>주문번호: {{ order.orderId }}</strong>
            </h4>
            <!-- 주문자 정보 -->
            <section class="mm_order-info">
                <h5 class="mm_strapline T=line">
                    <b>주문자 정보</b>
                </h5>
                <table>
                    <tbody>
                        <tr>
                            <th scope="row">
                                <b>주문자 이름</b>
                            </th>
                            <td>{{ order.ordererInfo.name }}</td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <b>휴대폰 번호</b>
                            </th>
                            <td>{{ order.ordererInfo.tel }}</td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <b>이메일</b>
                            </th>
                            <td>{{ order.ordererInfo.email }}</td>
                        </tr>
                        <tr v-if="order.ordererInfo.personalClearanceCode">
                            <th scope="row">
                                <b>개인통관고유부호</b>
                            </th>
                            <td>{{ order.ordererInfo.personalClearanceCode }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <!--// 주문자 정보 -->

            <!-- 배송 정보 -->
            <section class="mm_order-info">
                <h5 class="mm_strapline T=line">
                    <b>배송 정보</b>
                </h5>
                <table>
                    <tbody>
                        <tr>
                            <th scope="row">
                                <b>받는 사람</b>
                            </th>
                            <td>{{ order.shippingAddress.name }}</td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <b>휴대폰 번호</b>
                            </th>
                            <td>{{ order.shippingAddress.tel }}</td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <b>주소</b>
                            </th>
                            <td>
                                <span class="text_postcode">{{ order.shippingAddress.zipCode }}</span>
                                <b>{{ order.shippingAddress.baseAddress }} {{ order.shippingAddress.detailAddress }}</b>
                                <!-- (D) '입금 대기, 결제 완료' 주문일 경우 '주소변경' 버튼을 노출합니다. -->
                                <a
                                    v-if="order.shippingAddressChangeable"
                                    class="mm_btn T=xs T=line T=dark btn_address-change"
                                    href="#"
                                    @click.prevent="addressModalOpen()"
                                ><b>주소변경</b><i class="ico_link T=xs" /></a>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <b>배송메모</b>
                            </th>
                            <td>{{ order.shippingAddress.message }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <!--// 배송 정보 -->

            <!-- 구매 상품 -->
            <div class="m...detail-product">
                <h5 class="mm_strapline T=line">
                    <b>구매 상품</b>
                </h5>
                <template v-for="pack in order.packs" :key="pack.shippingRuleId">
                    <div v-for="seller in pack.sellers" :key="seller.id" class="mm_order-item-seller">
                        <div class="mm_order...seller-head">
                            <h5><i class="ico_shop" /><b>{{ seller.name }}</b></h5>
                        </div>
                        <ul>
                            <li
                                v-for="orderItem in seller.orderItems"
                                :key="orderItem.id"
                            >
                                <div class="mm_flex">
                                    <p class="text_status">
                                        {{ orderItem.orderStatusLabel }}
                                        <template v-if="orderItem.refundStatusLabel">
                                            <br><b class="mm_tag T=bg">{{ orderItem.refundStatusLabel }}</b>
                                        </template>
                                    </p>
                                    <MMSimpleGoods
                                        :goods="orderItem.goods"
                                        class="T=single"
                                    />
                                    <!-- (D) 회원 일 경우에 사용 적립금 관련 내용이 노출됩니다 -->
                                    <div class="mm...order-price">
                                        <p class="text_price">
                                            <strong>{{ MMFilters.formatNumber(orderItem.paidPrice) }}</strong>
                                        </p>
                                    </div>
                                    <div class="mm_btn_box">
                                        <div class="mm_block">
                                            <MMLink
                                                v-if="orderItem.cancelable" 
                                                class="mm_btn T=sm T=line T=light" 
                                                :to="{ name: 'GuestMyPageCancel', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                            >
                                                <b>주문취소</b>
                                            </MMLink>
                                            <button
                                                v-if="orderItem.receiptConfirmable"
                                                type="button"
                                                class="mm_btn T=sm"
                                                @click="confirmReceipt(orderItem.id)"
                                            >
                                                <b>수취확인</b>
                                            </button>
                                            <a 
                                                v-if="orderItem.purchaseConfirmable" 
                                                class="mm_btn T=sm T=line T=variable" 
                                                href="#" 
                                                @click.prevent="openPurchaseConfirmModal(orderItem, seller.name)"
                                            >
                                                <b>구매확정</b>
                                            </a>
                                            <MMLink 
                                                v-if="orderItem.exchangeable" 
                                                class="mm_btn T=sm T=line T=light" 
                                                :to="{ name: 'GuestMyPageExchange', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                            >
                                                <b>교환신청</b>
                                            </MMLink>
                                            <MMLink 
                                                v-if="orderItem.returnable"
                                                class="mm_btn T=sm T=line T=light" 
                                                :to="{ name: 'GuestMyPageReturn', params: { order_id: order.orderId, item_id: orderItem.id } }"
                                            >
                                                <b>반품신청</b>
                                            </MMLink>
                                            <a 
                                                v-if="orderItem.deliveryTrackable && !orderItem.returnDeliveryTrackingUrl" 
                                                class="btn_tracking"
                                                :href="orderItem.deliveryTrackingUrl" 
                                                target="_blank"
                                                title="새 창 열림"
                                            >   
                                                <b>배송조회</b><i class="ico_link T=circle" />
                                            </a>
                                            <button 
                                                v-if="orderItem.returnCancelable" 
                                                type="button"
                                                class="mm_btn T=sm T=line T=light" 
                                                @click="cancelReturn(orderItem.returnId, orderItem.returnTargetId)"
                                            >
                                                <b>반품철회</b>
                                            </button>
                                            <button 
                                                v-if="orderItem.exchangeCancelable && orderItem.exchangeId && orderItem.exchangeTargetId" 
                                                type="button" 
                                                class="mm_btn T=sm T=line T=light" 
                                                @click="cancelExchange(orderItem.exchangeId, orderItem.exchangeTargetId)"
                                            >
                                                <b>교환철회</b>
                                            </button>
                                            <MMLink 
                                                v-if="orderItem.toReturnSwitchable && orderItem.exchangeId"
                                                class="mm_btn T=sm T=line T=light"
                                                :to="{ name: 'GuestMyPageExchangeToReturn', params: { exchange_id: orderItem.exchangeId } }"
                                            >
                                                <b>반품전환</b>
                                            </MMLink>
                                            <a
                                                v-if="orderItem.returnDeliveryTrackable"
                                                class="btn_tracking"
                                                :href="orderItem.returnDeliveryTrackingUrl"
                                            ><b>반송조회</b><i class="ico_link T=circle" /></a>
                                        </div>
                                    </div>
                                </div>
                                <p
                                    v-if="orderItem.exchangedOptionName"
                                    class="text_changed"
                                >
                                    <span>변경한 옵션</span>
                                    <strong>{{ orderItem.exchangedOptionName.replace('/', ' ') }} / 1개</strong>
                                </p>
                            </li>
                        </ul>
                    </div>
                </template>
                <!-- (D) 교환 확정 후 신규 생성된 주문일 경우 노출합니다. -->
                <div
                    v-if="order.originalOrderId"
                    class="m...detail-product-origin"
                >
                    <MMLink 
                        class="btn_order-origin"
                        :to="{ name: 'GuestMyPageOrderDetail', params: { id: order.originalOrderId } }"
                    >
                        <i class="ico_order-origin" /><b>원 주문 상세보기</b>
                    </MMLink>
                </div>
            </div>
            <!--// 구매 상품 -->

            <div
                v-if="order.giveaways && order.giveaways.length > 0"
                class="m...detail-gift"
            >
                <h5 class="mm_strapline T=line">
                    <b>사은품 정보</b>
                </h5>
                <div class="mm_gift-list">
                    <ul>
                        <li
                            v-for="giveaway in order.giveaways"
                            :key="giveaway.id"
                        >
                            <div class="mm_gift-item">
                                <figure>
                                    <i
                                        v-lazyload="{ src: giveaway.imageUrl }"
                                        class="mm_bg-cover image_gift"
                                    />
                                    <figcaption>
                                        <p class="text_name">
                                            {{ giveaway.name }}
                                        </p>
                                        <p class="text_condition">
                                            {{ giveaway.conditionLabel }}
                                        </p>
                                    </figcaption>
                                </figure>
                                <a 
                                    class="btn_gift-info" 
                                    href="#" 
                                    @click.prevent="giveAwayModalOpen(giveaway.id)"
                                >
                                    <b>지급대상확인</b><i class="ico_link T=sm" />
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 결제 내역 -->
            <div
                v-if="!order.originalOrderId"
                class="m...detail-payment"
            >
                <!-- 결제 정보 -->
                <section class="mm_order-info">
                    <h5 class="mm_strapline T=line">
                        <b>결제 정보</b>
                    </h5>
                    <table>
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <b>결제수단</b>
                                </th>
                                <td>{{ order.paymentInfo.label }}</td>
                            </tr>
                            <!--카드결제-->
                            <template v-if="order.paymentInfo.card">
                                <tr>
                                    <th scope="row">
                                        <b>카드사</b>
                                    </th>
                                    <td>{{ order.paymentInfo.card.label }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>카드번호</b>
                                    </th>
                                    <td>{{ order.paymentInfo.card.maskingNumber }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>결제승인일</b>
                                    </th>
                                    <td>{{ MMFilters.formatDate(order.paymentInfo.card.approvedAt, "YYYY.MM.DD") }}</td>
                                </tr>
                            </template>
                            <!--무통장입금 / 에스크로결제-->
                            <template v-if="order.paymentInfo.bankAccount">
                                <tr>
                                    <th scope="row">
                                        <b>예금주</b>
                                    </th>
                                    <td>{{ bankOwnerName }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>은행명</b>
                                    </th>
                                    <td>{{ order.paymentInfo.bankAccount.bankName }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>계좌번호</b>
                                    </th>
                                    <td>{{ order.paymentInfo.bankAccount.accountNumber }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>입금기한</b>
                                    </th>
                                    <td>{{ MMFilters.formatDate(order.paymentInfo.bankAccount.inputExpireAt, "YYYY.MM.DD") }}</td>
                                </tr>
                            </template>
                            <!-- 휴대폰 결제 -->
                            <tr v-if="order.paymentInfo.mobileApproveAt">
                                <th scope="row">
                                    <b>결제 승인일</b>
                                </th>
                                <td>{{ MMFilters.formatDate(order.paymentInfo.mobileApproveAt, "YYYY.MM.DD HH:mm:ss") }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <a
                        v-if="order.receiptViewable"
                        class="mm_btn T=sm T=line T=lighter btn_receipt"
                        href="#"
                        @click.prevent="openReceiptModal"
                    ><b>영수증 보기</b></a>
                </section>
                <!--// 결제 정보 -->

                <!-- 최종 결제금액 -->
                <section v-if="!order.originalOrderId">
                    <h5 class="mm_strapline T=line">
                        <b>최종 결제금액</b>
                    </h5>
                    <div class="mm_cost">
                        <table>
                            <tbody>
                                <tr>
                                    <th scope="row">
                                        <b>총 상품금액</b>
                                    </th>
                                    <td>
                                        <p class="text_price">
                                            <strong>{{ MMFilters.formatNumber(order.paymentSummary.totalGoodsPrice) }}</strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>배송비</b>
                                    </th>
                                    <td>
                                        <p class="text_price">
                                            + <strong>{{ MMFilters.formatNumber(order.paymentSummary.totalShippingPrice) }}</strong>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th scope="row">
                                        <b>최종 결제금액</b>
                                    </th>
                                    <td>
                                        <p class="text_price mm_text-variable">
                                            <strong>{{ MMFilters.formatNumber(order.paymentSummary.totalPrice) }}</strong>
                                        </p>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </section>
                <!--// 최종 결제금액 -->
            </div>
            <!--// 결제 내역 -->
            <!-- 주문 정보 내역 -->
            <div
                v-if="claimIds.length > 0"
                class="mm_tab"
                data-tab
            >
                <!-- 탭메뉴 -->
                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
                <div class="mm_tab_menu">
                    <Slider
                        :items="claimIds"
                        :use-control="true"
                    >
                        <template #item="{ item } : { item : { id: string; claimIdType: 'cancelIds'|'returnIds'|'exchangeIds'}}">
                            <a 
                                class="btn_tab"
                                href="#"
                                :class="tabOnClaimId === item.id ? 'S=tab-on' : ''" 
                                @click.prevent="viewClaimDetail(item.id, item.claimIdType)"
                            >
                                <b v-if="item.claimIdType === 'cancelIds'">취소 주문번호</b>
                                <b v-else-if="item.claimIdType === 'returnIds'">반품 주문번호</b>
                                <b v-else-if="item.claimIdType === 'exchangeIds'">교환 주문번호</b>
                                <strong>{{ item.id }}</strong>
                            </a>                                        
                        </template>
                    </Slider>
                </div>
                <!--// 탭메뉴 -->
                <MMCancelDetail
                    v-for="cancelId in viewedClaimIds.cancelIds"
                    :key="cancelId"
                    :cancel-id="cancelId"
                    :pay-method-label="order.paymentInfo.label"
                    :class="tabOnClaimId === cancelId ? 'S=tab-on' : ''"
                />
                <MMReturnDetail 
                    v-for="returnId in viewedClaimIds.returnIds"
                    :key="returnId" 
                    :return-id="returnId"
                    :pay-method-label="order.paymentInfo.label"
                    :delivery-companies="deliveryCompanies"
                    :tab-on="tabOnClaimId == returnId"
                />
                <MMExchangeDetail 
                    v-for="exchangeId in viewedClaimIds.exchangeIds"
                    :key="exchangeId" 
                    :exchange-id="exchangeId"
                    :pay-method-label="order.paymentInfo.label"
                    :delivery-companies="deliveryCompanies"
                    :class="tabOnClaimId === exchangeId ? 'S=tab-on' : ''"
                />
            </div>
            <!--// 주문 정보 내역 -->
        </div>
    </div>
</template>


<script lang="ts">
// modules & helpers
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
// types & repos
import { DeliveryCompany } from '$/@type/configs';
import { MyOrderDetail } from '$/@type/myOrder/detail';
import { OrderItem } from '$/@type/myOrder/item';
import { orderDetailRepository } from '$/repository/myOrder/detailRepository';
import { myOrderRepository } from '$/repository/myOrder/orderRepository';
import { exchangeRepository } from '$/repository/myOrder/exchangeRepository';
import { returnRepository } from '$/repository/myOrder/returnRepository';
import { globalConfigsRepository } from '$/repository/globalConfigsRepository';
// components
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import MMCancelDetail from '@/pages/guestMypage/order/detail/Cancel.vue';
import MMReturnDetail from '@/pages/guestMypage/order/detail/Return.vue';
import MMExchangeDetail from '@/pages/guestMypage/order/detail/Exchange.vue';
import Slider from '@/components/Slider.vue';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';
import PurchaseConfirm from '@/components/modal/member/PurchaseConfirm.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import AddressModal from '@/components/modal/myOrder/GuestAddress.vue';
import GiveawayDetail from '@/components/modal/order/GiveawayDetail.vue'
import { shoppingRepository } from '$/repository/shoppingRepository';
import ReceiptModal from '@/components/modal/myOrder/Receipt.vue'
import { ShippingAddress } from '$/@type/order/order';

export default defineComponent({
    components: {
        MMSimpleGoods,
        MMCancelDetail,
        MMReturnDetail,
        MMExchangeDetail,
        Slider,
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const orderDetail = await orderDetailRepository.get(String(to.params.id || ''));
            next((vm) => {
                vm.order = orderDetail;
            })
        } catch (e) {
            next();
        }
    },
    setup() {
        const route = useRoute();
        usePageTitleSetting('주문 상세', ['주문 관리', '마이페이지']);
        const deliveryCompanies = ref<DeliveryCompany[]>([]);
        const { globalConfigs } = useGlobalConfigs();
        const bankOwnerName = ref<string>(globalConfigs.value.shop.bankOwnerName);
        // 주문상세 초기화
        const order = ref<MyOrderDetail>({
            cancelIds: [],
            returnIds: [],
            exchangeIds: [],
            orderId: String(route.params.order_id || ''),
            orderedAt: '',
            packs: [],
            shippingAddressChangeable: false,
            receiptViewable: false,
            ordererInfo: {
                name: '',
                tel: '',
                email: '',
                personalClearanceCode: '',
            },
            shippingAddress: {
                name: '',
                tel: '',
                zipCode: '',
                baseAddress: '',
                detailAddress: '',
                message: '',
            },
            paymentInfo: {
                label: '',
                buyPoint: 0,
                exceptBuyPoint: 0,
            },
            paymentSummary: {
                totalGoodsPrice: 0,
                totalShippingPrice: 0,
                discounts: {
                    member: 0,
                    nightSale: 0,
                    immediatelySale: 0,
                },
                usedCouponAmount: 0,
                usedPoints: 0,
                totalPrice: 0,
            },
        });
        const tabOnClaimId = ref<string>('');
        const claimIds = computed<{
            id: string
            claimIdType: "cancelIds"|"returnIds"|"exchangeIds"
        }[]>(() => {
            const orderClaimIds:{
                id: string
                claimIdType: "cancelIds"|"returnIds"|"exchangeIds"
            }[] = [];

            order.value.cancelIds.forEach(cancelId => {
                orderClaimIds.push({
                    id: cancelId,
                    claimIdType: "cancelIds"
                });
            });

            order.value.returnIds.forEach(returnId => {
                orderClaimIds.push({
                    id: returnId,
                    claimIdType: "returnIds"
                });
            });

            order.value.exchangeIds.forEach(exchangeId => {
                orderClaimIds.push({
                    id: exchangeId,
                    claimIdType: "exchangeIds"
                });
            });

            return orderClaimIds;
        });
        const viewedClaimIds = ref<{
            cancelIds: string[]
            returnIds: string[]
            exchangeIds: string[]
        }>({
            cancelIds: [],
            returnIds: [],
            exchangeIds: [],
        });


        onMounted(async () => {
            mmon.loading.show();
            await fetchOrderDetail();
            if (order.value.returnIds.length > 0 || order.value.exchangeIds.length > 0) {
                await fetchDeliveryCompanies();
            }
            mmon.loading.hide();            
        })

        /**
         * 주문 상세 조회
         */
        async function fetchOrderDetail() {
            try {
                order.value = await orderDetailRepository.get(String(route.params.id));
                if (order.value.cancelIds.length > 0) {
                    viewClaimDetail(order.value.cancelIds[0], 'cancelIds');
                    tabOnClaimId.value = order.value.cancelIds[0];
                } else if (order.value.returnIds.length > 0) {
                    viewClaimDetail(order.value.returnIds[0], 'returnIds');
                    tabOnClaimId.value = order.value.returnIds[0];
                } else if (order.value.exchangeIds.length > 0) {
                    viewClaimDetail(order.value.exchangeIds[0], 'exchangeIds');
                    tabOnClaimId.value = order.value.exchangeIds[0];
                }
            } catch (e) {
                defaultCatch(e)
            }
        }

        /**
         * 택배사리스트 조회
         */
        async function fetchDeliveryCompanies() {
            try {
                deliveryCompanies.value = await globalConfigsRepository.getDeliveryCompanies();
            } catch (e) {
                defaultCatch(e)
            }
        }

        /**
         * 구매 확정 모달 OPEN
         * @param orderItem 주문상품
         * @param sellerName 셀러명
         */
        function openPurchaseConfirmModal(orderItem: OrderItem, sellerName: string) {
            useModal().open(PurchaseConfirm, {
                title: '구매 확정',
                name: 'PurchaseConfirm',
                props: {
                    orderItem: orderItem,
                    sellerName: sellerName,
                },
                onClose: () => {
                    fetchOrderDetail();
                }
            })    
        }

        /**
         * 영수증 모달 OPEN
         */
        async function openReceiptModal() {
            const receipt = await myOrderRepository.getReceipt(order.value.orderId);

            useModal().open(ReceiptModal, {
                title:  `${receipt.all.payMethodName} 영수증`,
                name: 'ReceiptModal',
                itemClass: 'm_modal-receipt',
                props: {
                    receipt,
                    ordererName : order.value.ordererInfo.name,
                    orderId: order.value.orderId,
                    goodsName: order.value.packs[0]?.sellers[0]?.orderItems[0]?.goods?.name || ''
                }
            })
        }

        /**
         * 수취 확인 처리
         * @param orderItemId 주문상품 ID
         */
        function confirmReceipt(orderItemId: number) {
            mmon.bom.confirm('수취 확인 시 배송 완료 처리되며 되돌릴 수 없습니다. 수취 확인을 하시겠습니까?', async (isConfirm: boolean) => {
                if (!isConfirm) {
                    return;
                }

                try {
                    await myOrderRepository.confirmReceipt(orderItemId);
                    await fetchOrderDetail();
                } catch (e) {
                    defaultCatch(e)
                }
            })
        }

        /**
         * 반품 철회
         * @param returnId 반품주문 ID
         * @param returnTargetId 반품주문내 주문상품 식별값
         */
        function cancelReturn(returnId: string, returnTargetId: number) {
            mmon.bom.confirm('반품 신청을 철회하시겠습니까?', async (isConfirm: boolean) => {
                if (!isConfirm) {
                    return;
                }

                try {
                    clearClaimDetail(returnId, 'returnIds');
                    await returnRepository.cancelReturn(returnId, returnTargetId);
                    await fetchOrderDetail();
                } catch (e) {
                    defaultCatch(e)
                }
            })
        }

        /**
         * 교환 철회
         * @param exchangeId 교환주문ID
         * @param exchangeTargetId 교환주문내 주문상품 식별값
         */
        function cancelExchange(exchangeId: string, exchangeTargetId: number) {
            mmon.bom.confirm('교환 신청을 철회하시겠습니까?', async (isConfirm: boolean) => {
                if (!isConfirm) {
                    return;
                }

                try {
                    clearClaimDetail(exchangeId, 'exchangeIds');
                    await exchangeRepository.cancelExchange(exchangeId, exchangeTargetId);
                    await fetchOrderDetail();
                } catch (e) {
                    defaultCatch(e)
                }
            });
        }
        
        /**
         * 취소/반품/교환 상세 탭 보기
         * @param claimId 
         * @param claimType 
         */
        function viewClaimDetail(claimId: string, claimIdPropertyName: 'cancelIds'|'returnIds'|'exchangeIds') {
            tabOnClaimId.value = claimId;

            if (!viewedClaimIds.value[claimIdPropertyName].includes(claimId)) {
                viewedClaimIds.value[claimIdPropertyName].push(claimId);
            }
        }
        
        /**
         * 취소/반품/교환 상세 조회결과 clear
         * @param claimId 
         * @param claimIdPropertyName 
         */
        function clearClaimDetail(claimId: string, claimIdPropertyName: 'cancelIds'|'returnIds'|'exchangeIds') {
            viewedClaimIds.value[claimIdPropertyName] = viewedClaimIds.value[claimIdPropertyName].filter((originalClaimId) => originalClaimId != claimId);
        }

        function giveAwayModalOpen(giveAwayId: number) {
            useModal().open(GiveawayDetail, {
                title: '사은품 지급 대상',
                name: 'GiveAwayDetail',
                props: async() => {
                    const [ giveAway, giveAwayGoodsPaginator ] = await Promise.all([
                        shoppingRepository.getGiveawayDetail(giveAwayId),
                        shoppingRepository.getGiveawayOnGoods(
                            giveAwayId, 
                            1, 
                            5
                        )
                    ])

                    return {
                        giveAway,
                        giveAwayGoodsPaginator
                    }
                }
            })
        }

        function addressModalOpen() {
            useModal().open(AddressModal, {
                title: '배송지 변경',
                name: 'GuestAddress',
                onClose: async(shippingAddress: Omit<ShippingAddress, "id"|"shippingName">) => {
                    try {
                        await myOrderRepository.updateDeliveryAddressInfo(order.value.orderId, shippingAddress);
                        order.value.shippingAddress = {
                            name: shippingAddress.name,
                            tel: shippingAddress.tel,
                            zipCode: shippingAddress.zipCode,
                            baseAddress: shippingAddress.baseAddress,
                            detailAddress: shippingAddress.detailAddress,
                            message: order.value.shippingAddress.message,
                        }
                    } catch (e) {
                        defaultCatch(e)
                    }
                }
            })
        }
        
        return {
            // modal            
            openPurchaseConfirmModal,            
            giveAwayModalOpen,
            openReceiptModal,
            addressModalOpen,
            // data & functions
            order,
            deliveryCompanies,
            claimIds,
            viewedClaimIds,
            tabOnClaimId,
            fetchOrderDetail,
            confirmReceipt,
            cancelReturn,
            cancelExchange,
            viewClaimDetail,
            bankOwnerName            
        }
    },
})
</script>
