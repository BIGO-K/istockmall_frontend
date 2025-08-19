<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="mm_inner m_order">
            <h3 class="mm_title">
                <b>주문/결제</b>
            </h3>
            <!-- 받는분 정보 -->
            <section class="mm_order-form m_order-receive">
                <h4 class="mm_strapline T=line">
                    <b>받는분 정보</b>
                </h4>
                <table>
                    <tbody>
                        <tr>
                            <th scope="row">
                                <b>이메일 주소</b>
                            </th>
                            <td>
                                <MMInput 
                                    v-model="ordererForm.email"
                                    :form-class="'mm_form-text T=short'"
                                    :placeholder="'이메일 주소를 입력하세요(필수입력)'"
                                    maxlength="50"
                                />                                
                            </td>
                        </tr>
                        <tr class="mm_address-list">
                            <th scope="row">
                                <b>배송지 정보<span class="text_amount">{{ receiveAddressList.length }}개</span></b>
                            </th>
                            <td>
                                <MMSlider
                                    ref="receiveAddressSlider"
                                    :items="receiveAddressList"
                                    :use-control="receiveAddressList.length > 2"
                                >
                                    <template #additionalItem>
                                        <li class="mm_slider-item">
                                            <a
                                                class="btn_address-add"
                                                href="#"
                                                @click.prevent="addReceiveAddressModalOpen"
                                            ><i class="ico_address-add" /><b>배송지를 등록하세요</b></a>
                                        </li>                                        
                                    </template>
                                    <template #item="{ item: receiveAddress }">
                                        <input 
                                            v-model="selectedShippingAddress" 
                                            type="radio"                                                    
                                            name="radio-address" 
                                            :title="receiveAddress.shippingName" 
                                            :checked="selectedShippingAddress.id === receiveAddress.id" 
                                            data-radio
                                            @change="changeReceiveAddress(receiveAddress)"
                                        >
                                        <div class="mm_address-item">
                                            <i class="ico_form-radio T=circle" />
                                            <dl>
                                                <dt>
                                                    <span>{{ receiveAddress.shippingName }}</span><b
                                                        v-if="receiveAddress.isRecent"
                                                        class="text_tag"
                                                    >최근배송지</b>
                                                </dt>
                                                <dd>{{ receiveAddress.name }} / {{ receiveAddress.tel }}</dd>
                                                <dd>{{ receiveAddress.zipCode }} {{ receiveAddress.baseAddress }} {{ receiveAddress.detailAddress }}</dd>
                                            </dl>
                                        </div>
                                        <button
                                            type="button"
                                            class="btn_remove"
                                            @click="removeReceiveAddress(receiveAddress.id)"
                                        >
                                            <b>삭제</b>
                                        </button>                                              
                                    </template>
                                </MMSlider>
                            </td>
                        </tr>
                        <tr class="m_order-receive-memo">
                            <th scope="row">
                                <b>배송 메모</b>
                            </th>
                            <td>
                                <div class="mm_radio-list T=chain">
                                    <ul>
                                        <li>
                                            <label class="mm_form-radio">
                                                <input
                                                    v-model="ordererForm.shippingMessage"
                                                    type="radio"
                                                    name="shipping_message"
                                                    data-radio
                                                    :checked="ordererForm.shippingMessage === ''"
                                                    @change="() => { ordererForm.shippingMessage = '' }"
                                                >
                                                <b class="mm_block">
                                                    <i class="ico_form-radio" />
                                                    <span class="text_label">선택 안함</span>
                                                </b>
                                            </label>
                                        </li>
                                        <li v-for="message in shippingMessages" :key="message">
                                            <label class="mm_form-radio">
                                                <input
                                                    v-model="ordererForm.shippingMessage"
                                                    type="radio"
                                                    name="shipping_message"
                                                    data-radio
                                                    :checked="ordererForm.shippingMessage === message"
                                                    @change="() => { ordererForm.shippingMessage = message }"
                                                >
                                                <b class="mm_block">
                                                    <i class="ico_form-radio" />
                                                    <span class="text_label">{{ message }}</span>
                                                </b>
                                            </label>
                                        </li>
                                        <li>
                                            <div class="mm_form_mix-linked">
                                                <label class="mm_form-radio">
                                                    <input
                                                        v-model="ordererForm.shippingMessage"
                                                        type="radio"
                                                        name="shipping_message"
                                                        value="직접 입력"
                                                        data-radio
                                                    >
                                                    <b class="mm_block">
                                                        <i class="ico_form-radio" />
                                                        <span class="text_label">직접 입력</span>
                                                    </b>
                                                </label>
                                                <MMInput 
                                                    v-model="shippingDirectMessage"
                                                    :form-class="'mm_form-text T=short'"
                                                    :use-trim="false"
                                                    :placeholder="'배송 메모를 입력하세요(20자 이내)'"
                                                    :disabled="ordererForm.shippingMessage !== '직접 입력'"
                                                    maxlength="20"
                                                /> 
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        <template v-if="isOverseasShippingContains">
                            <tr
                                v-if="ordererInfo?.personalClearanceCode === '' || ordererInfo?.personalClearanceCode === null || editAblePersonalClearanceCode"
                                class="m_order-receive-unipass"
                            >
                                <th scope="row">
                                    <b>해외배송<br> 개인통관고유부호</b>
                                </th>
                                <td>                                   
                                    <MMInput 
                                        v-model="ordererForm.personalClearanceCode"
                                        :form-class="'mm_form-text T=short'"
                                        :placeholder="'P로 시작하는 13자리 번호를 입력하세요'"
                                        maxlength="13"
                                        @input="validatePersonalClearanceCode($event)"
                                    />                                
                                    <label class="mm_form-check">
                                        <input
                                            v-model="ordererForm.isRememberPersonalClearanceCode"
                                            type="checkbox"
                                            data-check
                                        >
                                        <b class="mm_block">
                                            <i class="ico_form-check" />
                                            <span class="text_label">다음 주문 시에도 계속 사용(편리한 배송을 위해 보관됩니다)</span>
                                        </b>
                                    </label>
                                    <div class="mm_note">
                                        <ul>
                                            <li>상품을 받는 분의 명의로 통관이 진행되므로 <span class="mm_text-secondary">{{ selectedShippingAddress.name === '' ? '받는분' : `${selectedShippingAddress.name} 님` }}</span>의 개인통관고유부호를 입력해주세요.</li>
                                            <li>해외배송 상품은 관세청 통관을 위해 수취인의 고유식별정보를 판매자에게 제공합니다.</li>
                                            <li>개인통관고유부호는 통관 시 주민등록번호 대신 사용 가능한 번호로, 관세청 사이트에서 발급 받으실 수 있습니다.</li>
                                        </ul>
                                        <a
                                            class="btn_unipass"
                                            href="https://unipass.customs.go.kr/csp/persIndexRectOnslCrtf.do?qryIssTp=1"
                                            target="_blank"
                                            title="새 창 열림"
                                        >
                                            <b>개인통관고유부호 발급/확인 바로가기</b>
                                            <i class="ico_link" />
                                        </a>
                                    </div>
                                    <div class="mm_check-list">                                        
                                        <ul>
                                            <li>
                                                <label class="mm_form-check">
                                                    <input
                                                        v-model="isAgreeOfCollectPersonalClearanceCode"
                                                        type="checkbox"
                                                        data-check
                                                    >
                                                    <b class="mm_block">
                                                        <i class="ico_form-check" />
                                                        <span class="text_label">해외배송 상품의 수입신고를 위한 개인통관고유부호 수집에 동의</span>
                                                    </b>
                                                </label>
                                                <button
                                                    onclick="this.classList.toggle('S=switch-on')"
                                                    type="button"
                                                    class="mm_switch btn_popover"
                                                    data-switch="{ '_defaultTitle': '자세히보기', '_title': '접어놓기' }"
                                                    title="자세히보기"
                                                >
                                                    <i class="ico_popover-help" />
                                                </button>
                                                <div class="mm_popover">
                                                    <h6><b>개인통관고유부호 수집 동의</b></h6>
                                                    <p>고유부호는 수입 통관 업무 처리를 위해 수집하며, 서비스 이용 기간동안 보관합니다.</p>
                                                    <button
                                                        type="button"
                                                        class="btn_close"
                                                        onclick="this.parentElement.previousElementSibling.click();"
                                                    >
                                                        <i class="ico_close" /><b class="mm_ir-blind">닫기</b>
                                                    </button>
                                                </div>
                                            </li>
                                            <li>
                                                <label class="mm_form-check">
                                                    <input
                                                        v-model="isAgreeOfProvidePersonalClearanceCode"
                                                        type="checkbox"
                                                        data-check
                                                    >
                                                    <b class="mm_block">
                                                        <i class="ico_form-check" />
                                                        <span class="text_label">해외배송 상품의 수입신고를 위한 개인통관고유부호의 판매자 제공에 동의</span>
                                                    </b>
                                                </label>
                                                <button
                                                    type="button"
                                                    onclick="this.classList.toggle('S=switch-on')"
                                                    class="mm_switch btn_popover"
                                                    data-switch="{ '_defaultTitle': '자세히보기', '_title': '접어놓기' }"
                                                    title="자세히보기"
                                                >
                                                    <i class="ico_popover-help" />
                                                </button>
                                                <div class="mm_popover">
                                                    <h6><b>개인통관고유부호 판매자 제공 동의</b></h6>
                                                    <p>수입 통관 업무 처리를 위해 본 상품 판매자에게 개인통관 고유부호를 제공하며, 해당 업무 처리 후 파기합니다.</p>
                                                    <button
                                                        type="button"
                                                        class="btn_close"
                                                        onclick="this.parentElement.previousElementSibling.click();"
                                                    >
                                                        <i class="ico_close" /><b class="mm_ir-blind">닫기</b>
                                                    </button>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>       
                            <tr
                                v-else
                                class="m_order-receive-unipass"
                            >
                                <th scope="row">
                                    <b>해외배송<br> 개인통관고유부호</b>
                                </th>
                                <td>
                                    <div class="mm_form-text T=short">
                                        <label>
                                            <span class="textfield text_readonly">{{ ordererForm.personalClearanceCode }}</span>
                                            <i class="bg_text" />
                                        </label>
                                    </div>
                                    
                                    <button
                                        type="button"
                                        class="mm_btn T=sm T=line btn_modify"
                                        @click="() => { editAblePersonalClearanceCode = !editAblePersonalClearanceCode }"
                                    >
                                        <b>수정하기</b><i class="ico_link T=xs" />
                                    </button>
                                    <div class="mm_check-list">
                                        <ul>
                                            <li>
                                                <label class="mm_form-check">
                                                    <input
                                                        v-model="isAgreeOfProvidePersonalClearanceCode"
                                                        type="checkbox"
                                                        data-check
                                                    >
                                                    <b class="mm_block">
                                                        <i class="ico_form-check" />
                                                        <span class="text_label">해외배송 상품의 수입신고를 위한 개인통관고유부호의 판매자 제공에 동의</span>
                                                    </b>
                                                </label>
                                                <button
                                                    type="button"
                                                    onclick="this.classList.toggle('S=switch-on')"
                                                    class="mm_switch btn_popover"
                                                    data-switch="{ '_defaultTitle': '자세히보기', '_title': '접어놓기' }"
                                                    title="자세히보기"
                                                >
                                                    <i class="ico_popover-help" />
                                                </button>
                                                <div class="mm_popover">
                                                    <h6><b>개인통관고유부호 판매자 제공 동의</b></h6>
                                                    <p>수입 통관 업무 처리를 위해 본 상품 판매자에게 개인통관 고유부호를 제공하며, 해당 업무 처리 후 파기합니다.</p>
                                                    <button
                                                        type="button"
                                                        class="btn_close"
                                                        onclick="this.parentElement.previousElementSibling.click();"
                                                    >
                                                        <i class="ico_close" /><b class="mm_ir-blind">닫기</b>
                                                    </button>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>                     
                        </template>
                    </tbody>
                </table>
            </section>
            <!--// 받는분 정보 -->

            <!-- 상품 정보 -->
            <section>
                <h4 class="mm_strapline T=line">
                    <b>상품 정보</b>
                </h4>
                <div class="mm_order-item">
                    <label class="mm_form-check">
                        <input
                            v-model="isAppliedMaxDiscount"
                            type="checkbox"
                            data-check
                            @change="handleAppliedMaxDiscount"
                        >
                        <b class="mm_block">
                            <i class="ico_form-check" />
                            <span class="text_label">최대할인 적용</span>
                        </b>
                    </label>
                    <div
                        v-for="pack, index in orderPacks" 
                        :key="index"
                        class="mm_order-item-seller"
                    >
                        <div class="mm_order...seller-head">
                            <p class="text_ship">
                                <i class="ico_ship" />
                                <span v-if="(!selectedShippingAddress.isExtraArea || pack.extraShippingPrice === 0) && pack.chargedShippingPrice === 0">무료배송</span>
                                <span
                                    v-else
                                    class="text_price"
                                ><strong>{{ MMFilters.formatNumber(selectedShippingAddress.isExtraArea ? (pack.chargedShippingPrice + pack.extraShippingPrice) : pack.chargedShippingPrice) }}</strong></span>
                            </p>
                        </div>
                        <ul>
                            <li v-for="orderGoods, groupIndex in pack.groupOrders" :key="orderGoods.goodsId">
                                <div class="mm_flex">
                                    <div class="mm_product-item T=single">
                                        <MMLink :to="{ name: 'GoodsDetail', params: { id: orderGoods.goodsId }}">
                                            <figure>
                                                <div class="mm_image-scale">
                                                    <i
                                                        v-lazyload="{ src : orderGoods.goodsThumbnailUrl }"
                                                        class="mm_bg-cover image_product"
                                                    />
                                                </div>
                                                <figcaption>
                                                    <p class="text_brand">
                                                        {{ orderGoods.brandName }}
                                                    </p>
                                                    <p class="text_product">
                                                        <span
                                                            v-if="orderGoods.goodsHeadline !== null"
                                                            class="text_foreword"
                                                        >[{{ orderGoods.goodsHeadline }}]</span>
                                                        {{ orderGoods.goodsName }}
                                                    </p>
                                                    <p class="text_option">
                                                        {{ orderGoods.optionName.replace('/', '') }} / {{ orderGoods.items.length }}개
                                                    </p>
                                                </figcaption>
                                            </figure>
                                        </MMLink>
                                    </div>
                                    <p class="text_seller">
                                        <i class="ico_shop" />{{ orderGoods.sellerName }}
                                    </p>
                                    <p class="text_price">
                                        <span
                                            v-if="orderGoods.appliableImmediatelySale"
                                            class="text_price-sale"
                                        >즉시할인 적용가</span>
                                        <strong>{{ MMFilters.formatNumber(orderPacksAppliedCouponWithImmediatelySale[index].group[groupIndex].appliedAllDiscountPrice) }}</strong> 
                                    </p>
                                    <dl><dt>쿠폰 적용</dt><dd>{{ orderPacksAppliedCouponWithImmediatelySale[index].group[groupIndex].couponCount }}개</dd></dl>
                                    <div class="mm_btn_box">
                                        <div class="mm_block">
                                            <!-- (D) 쿠폰이 적용된 상태일 경우 mm_btn 요소에 "T=line T=primary" 클래스를 추가합니다. -->
                                            <button
                                                v-if="orderGoods.usableCouponRegists.length < 1"
                                                type="button"
                                                class="mm_btn T=sm"
                                                disabled
                                            >
                                                <b>쿠폰적용</b>
                                            </button>
                                            <a
                                                v-else 
                                                :class="['mm_btn T=sm', {'T=line T=primary' : orderGoods.couponCount > 0}]"
                                                href="#" 
                                                @click.prevent="couponModalOpen()"
                                            >
                                                <b>쿠폰적용</b>
                                            </a>                                                                                                
                                        </div>
                                    </div>
                                </div>
                            </li>     
                        </ul>
                    </div>
                </div>
            </section>
            <!--// 상품 정보 -->

            <!-- 사은품 정보 -->
            <div
                v-if="giveawayGroups.length > 0"
                class="m_order-gift"
            >
                <section class="mm_order-form">
                    <h4 class="mm_strapline T=line">
                        <b>사은품 정보</b>
                    </h4>
                    <table>
                        <tbody>
                            <tr v-for="giveawayGroup, index in giveawayGroups" :key="index">
                                <th scope="row">
                                    <b>사은품 선택</b><small>(선택{{ index + 1 }})</small>
                                </th>
                                <td>
                                    <div class="mm_gift-list">
                                        <ul>
                                            <li v-for="giveaway in giveawayGroup.giveaway" :key="giveaway.id">
                                                <input 
                                                    v-model="giveawayForm[index]" 
                                                    type="radio" 
                                                    :disabled="!giveaway.selectAble" 
                                                    :value="{ goodsId: giveawayGroup.goodsId, giveawayId: giveaway.id }"
                                                    :name="`gift_${index}`" 
                                                    data-radio 
                                                    @change="validateGiveaway(giveaway.id, giveawayGroup.goodsId)"
                                                >
                                                <div class="mm_gift-item"> 
                                                    <i class="ico_form-radio T=circle" />
                                                    <figure>
                                                        <i
                                                            v-lazyload="{ src: giveaway.imageUrl }"
                                                            class="mm_bg-cover image_gift"
                                                        />
                                                        <figcaption>
                                                            <template v-if="giveaway.selectAble">
                                                                <p class="text_name">
                                                                    {{ giveaway.name }}
                                                                </p>
                                                                <p class="text_condition">
                                                                    {{ giveaway.label }}
                                                                </p>
                                                            </template>
                                                            <template v-else>
                                                                <p class="text_note">
                                                                    이미 지급받으신 사은품입니다
                                                                </p>
                                                            </template>
                                                        </figcaption>
                                                    </figure>                                                    
                                                    <a
                                                        class="btn_gift-info"
                                                        href="#"
                                                        @click.prevent="giveAwayModalOpen(giveaway.id)"
                                                    ><b>지급대상확인</b><i class="ico_link T=sm" /></a>
                                                </div>
                                            </li>
                                            <li>
                                                <input
                                                    type="radio"
                                                    :name="`gift_${index}`"
                                                    data-radio
                                                    @change="resetSelectedGiveaway(giveawayForm[index])"
                                                >
                                                <div class="mm_gift-item">
                                                    <i class="ico_form-radio T=circle" />
                                                    <p><strong>선택안함</strong>구매상품만 받을게요</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
            <!--// 사은품 정보 -->

            <!-- 결제 정보 -->
            <div class="m_order-payment">
                <div>
                    <!-- 적립금 사용 -->
                    <section class="mm_order-form">
                        <h4 class="mm_strapline T=line">
                            <b>적립금 사용</b>
                        </h4>
                        <table>
                            <tbody>
                                <tr>
                                    <th scope="row">
                                        <b>적립금</b>
                                    </th>
                                    <td>
                                        <div class="mm_form_mix-linked">
                                            <MMInput
                                                v-model="tempUsingPoint"
                                                :data-type="'number'"
                                                :form-class="'mm_form-text T=short'"        
                                                :placeholder="'사용할 적립금'"                                                                                         
                                                @on-clear="() => {
                                                    tempUsingPoint = 0;
                                                    paymentForm.usingPoint = 0;
                                                }"
                                                @change="validatePoint"
                                            />
                                            <label class="mm_form-check">
                                                <input
                                                    type="checkbox"
                                                    data-check
                                                    @change="togglePointUsing($event)"
                                                >
                                                <b class="mm_block">
                                                    <i class="ico_form-check" />
                                                    <span class="text_label">모두 사용</span>
                                                </b>
                                            </label>
                                        </div>
                                        <p class="text_point">
                                            보유 적립금
                                            <b>
                                                <strong>{{ MMFilters.formatNumber(ordererInfo?.pointBalance || 0) }}</strong>
                                                <sub>원</sub>
                                            </b>
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="mm_note">
                            <ul>
                                <li>적립금 사용 시 상품 구매금액 비율로 계산되어 각 상품에 사용 적립금이 자동 적용 됩니다.</li>
                                <li><strong>{{ MMFilters.formatNumber(pointRule.minUsableBalance) }}원 이상 보유 시 사용 가능</strong>합니다.</li>
                                <li v-if="pointRule.maxUsableAmount > 0">
                                    <strong v-if="pointRule.maxUsableAmountType.toUpperCase() === 'KRW'">
                                        최대 {{ MMFilters.formatNumber(pointRule.maxUsableAmount) }}원까지 사용 가능
                                    </strong>
                                    <strong v-else>
                                        최종 결제금액 대비 최대 {{ MMFilters.formatNumber(pointRule.maxUsableAmount) }}%까지 사용 가능
                                    </strong>
                                    합니다.(배송비 제외)
                                </li>
                            </ul>
                        </div>
                    </section>
                    <!--// 적립금 사용 -->

                    <!-- 결제수단 선택 -->
                    <section 
                        v-if="!isPointSameForPaymentPrice"
                        class="m_order-payment-method"
                    >
                        <h4 class="mm_strapline T=line">
                            <b>결제수단 선택</b>
                        </h4>
                        <ul v-if="useMyPay">
                            <!-- 간편결제 -->
                            <li>
                                <MMRadio 
                                    v-model="payType"
                                    name="pay-select"
                                    :value="'myPayCard'"
                                    @click="handleMyPayType(true)"
                                >
                                    <b class="mm_block">
                                        <i class="ico_form-radio" />
                                        <span class="text_label">간편 카드결제</span>
                                    </b>
                                </MMRadio>
                                <div :class="['mm_syncer-pay-card', { 'S=radio-use': payType === 'myPayCard' }]">
                                    <MMSlider
                                        :items="myRegistCardPays"
                                        :slider-data="{
                                            onIntersecting: myPaymentVirtualIdHandler,
                                            _isLoop: false
                                        }"
                                        :use-manage-item="true"
                                        :use-control="myRegistCardPays.length > 0"
                                        :use-pagination="myRegistCardPays.length > 0"
                                        :additional-is-first="false"
                                    >
                                        <template #item="{ item }">
                                            <figure>
                                                <i class="image_logo"><img
                                                    v-lazyload="{ src: item.imageUrl }"
                                                    :data-lazyload="`{'_src': ${item.imageUrl}}`"
                                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                                    :alt="item.name"
                                                ></i>
                                                <figcaption>
                                                    <p class="text_title">
                                                        카드번호
                                                    </p>
                                                    <p class="text_num">
                                                        <span v-for="maskCode in item.split4DigitsMaskingCode" :key="maskCode">{{ maskCode }}</span>
                                                    </p>
                                                </figcaption>
                                            </figure>
                                            <button type="button" class="btn_remove" @click="managementMyPay(true)">
                                                <i class="ico_remove" /><b class="mm_ir-blind">삭제</b>
                                            </button>
                                        </template>
                                        <template #additionalItem>
                                            <li class="mm_slider-item">
                                                <a
                                                    class="btn_register"
                                                    href="#"
                                                    target="_blank"
                                                    title="새 창 열림"
                                                    @click.prevent="registMyPay(true)"
                                                ><i class="ico_add" /><b v-html="myRegistCardPays.length < 1 ? '카드 등록 한번으로<br>간편하게 결제해보세요' : '카드 추가 등록'" /></a>
                                            </li>
                                        </template>
                                        <template #sliderCommonContent>
                                            <MMSelect
                                                v-show="myPaymentCreditCardInstallMentShow"
                                                v-model="paymentForm.installMentMonth"
                                            >
                                                <option
                                                    v-for="installMent in installMents"
                                                    :key="installMent.value"
                                                    :disabled="installMent.disabled"
                                                    :value="installMent.value"
                                                >
                                                    {{ installMent.label }}
                                                </option>
                                            </MMSelect>
                                        </template>
                                    </MMSlider>
                                </div>
                            </li>
                            <li>
                                <MMRadio
                                    v-model="payType"
                                    name="pay-select"
                                    :value="'myPayBank'"
                                    @click="handleMyPayType(false)"
                                >
                                    <b class="mm_block">
                                        <i class="ico_form-radio" />
                                        <span class="text_label">간편 계좌결제</span>
                                    </b>
                                </MMRadio>
                                <div :class="['mm_syncer-pay-account', { 'S=radio-use': payType === 'myPayBank' }]">
                                    <MMSlider 
                                        :items="myRegistBankPays"
                                        :slider-data="{
                                            onIntersecting: myPaymentBankTransferVirtualIdHandler,
                                            _isLoop: false
                                        }"
                                        :use-manage-item="true"
                                        :use-control="myRegistBankPays.length > 0"
                                        :use-pagination="myRegistBankPays.length > 0"
                                        :additional-is-first="false"
                                    >
                                        <template #item="{ item }">
                                            <figure>
                                                <i class="image_logo"><img
                                                    v-lazyload="{ src: item.imageUrl }"
                                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                                    :alt="item.name"
                                                ></i>
                                                <figcaption>
                                                    <p class="text_title">
                                                        계좌번호
                                                    </p>
                                                    <p class="text_num">
                                                        <span v-for="maskCode in item.split4DigitsMaskingCode" :key="maskCode">{{ maskCode }}</span>
                                                    </p>
                                                </figcaption>
                                            </figure>
                                            <button type="button" class="btn_remove" @click="managementMyPay(false)">
                                                <i class="ico_remove" /><b class="mm_ir-blind">삭제</b>
                                            </button>
                                        </template>
                                        <template #additionalItem>
                                            <li class="mm_slider-item">
                                                <a
                                                    class="btn_register" 
                                                    href="#"
                                                    target="_blank"
                                                    title="새 창 열림"
                                                    @click.prevent="registMyPay(false)"
                                                >
                                                    <i class="ico_add" />
                                                    <b v-if="myRegistBankPays.length > 0">계좌 추가 등록</b>
                                                    <b v-else>계좌 등록 한번으로<br>
                                                        간편하게 결제해보세요</b>
                                                </a>
                                            </li>
                                        </template>
                                    </MMSlider>
                                </div>
                            </li>
                            <!--// 간편결제 -->

                            <!-- 다른 결제수단 -->
                            <li>
                                <MMRadio
                                    v-if="useMyPay"
                                    v-model="payType"
                                    name="pay-select"
                                    :value="'myPayOthers'"
                                >
                                    <b class="mm_block">
                                        <i class="ico_form-radio" />
                                        <span class="text_label">다른 결제수단 선택</span>
                                    </b>
                                </MMRadio>
                                <div :class="['mm_syncer-payment-other', { 'S=radio-use': payType === 'myPayOthers' }]">
                                    <BasePayment
                                        v-if="latestPaymentLoaded"
                                        :payment-form="paymentForm"
                                        :refund-account="refundAccount"
                                        :pay-methods="payMethods"
                                        :install-ments="installMents"
                                        :need-payment-update="payType === 'myPayOthers'"
                                        @update-payment="updateOrderPaymentForm"
                                        @fetch-refund-account="fetchRefundAccount"
                                    />
                                </div>
                            </li>
                            <!--// 다른 결제수단 -->
                        </ul>
                        <template v-else>
                            <BasePayment
                                v-if="latestPaymentLoaded"
                                :payment-form="paymentForm"
                                :refund-account="refundAccount"
                                :pay-methods="payMethods"
                                :install-ments="installMents"
                                @update-payment="updateOrderPaymentForm"
                                @fetch-refund-account="fetchRefundAccount"
                            />
                        </template>
                    </section>
                    <!--// 결제수단 선택 -->
                </div>
                <!-- 최종 결제금액 -->
                <section>
                    <h4 class="mm_strapline T=line">
                        <b>최종 결제금액</b>
                    </h4>
                    <div class="mm_cost">
                        <table>
                            <tbody>
                                <tr>
                                    <th scope="row">
                                        <b>총 상품금액</b>
                                    </th>                                    
                                    <td>
                                        <p class="text_price">
                                            <strong>{{ MMFilters.formatNumber(priceSummary.totalGoodsPrice) }}</strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">
                                        <b>배송비</b>
                                    </th>
                                    <td>
                                        <p class="text_price">
                                            + <strong>{{ MMFilters.formatNumber(priceSummary.shippingPrice) }}</strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr v-if="priceSummary.memberDiscountedPrice > 0">
                                    <th scope="row">
                                        <b>회원할인</b>
                                    </th>
                                    <td>
                                        <p class="text_price">
                                            - <strong>{{ MMFilters.formatNumber(priceSummary.memberDiscountedPrice) }}</strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr v-if="priceSummary.nightSaleAmount > 0">
                                    <th scope="row">
                                        <b>심야할인</b>
                                    </th>
                                    <td>
                                        <p class="text_price">
                                            - <strong>{{ MMFilters.formatNumber(priceSummary.nightSaleAmount) }}</strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr v-if="priceSummary.appliedCouponAmount > 0">
                                    <th scope="row">
                                        <b>쿠폰할인</b>
                                    </th>
                                    <td>
                                        <p class="text_price">
                                            - <strong>{{ MMFilters.formatNumber(priceSummary.appliedCouponAmount) }}</strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr v-if="priceSummary.immediatelySaleAmount > 0">
                                    <th scope="row">
                                        <b>즉시할인</b>
                                    </th>
                                    <td>
                                        <p class="text_price">
                                            - <strong>{{ MMFilters.formatNumber(priceSummary.immediatelySaleAmount) }}</strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr v-if="paymentForm.usingPoint > 0">
                                    <th scope="row">
                                        <b>적립금 사용</b>
                                    </th>
                                    <td>
                                        <p class="text_point">
                                            - 
                                            <strong>{{ MMFilters.formatNumber(paymentForm.usingPoint, '0') }}</strong>
                                            <sub>원</sub>
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
                                            <strong>{{ MMFilters.formatNumber(priceSummary.forPaymentPrice - paymentForm.usingPoint ) }}</strong>
                                        </p>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <!-- 약관 동의 -->
                    <div class="m_order-payment-agree">
                        <dl>
                            <dt>주문상품정보 및 서비스 이용약관에 동의</dt>
                            <dd>
                                <ul>
                                    <li><b>구매조건 확인 및 결제 진행 동의</b></li>
                                    <li><b>만 14세 이상 동의</b></li>
                                    <li>
                                        <b>개인정보 제 3자 제공 동의</b>
                                        <button
                                            type="button"
                                            onclick="this.parentElement.classList.toggle('S=switch-on')"
                                            class="mm_switch btn_detail"
                                            data-switch="{ '_isParent': true }"
                                        >
                                            <b>자세히</b>
                                        </button>
                                        <!-- 개인정보 제 3자 제공 동의 -->
                                        <table>
                                            <colgroup>
                                                <col style="width:107px;">
                                                <col>
                                            </colgroup>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">
                                                        <b>제공 받는 자</b>
                                                    </th>
                                                    <td v-if="orderPacks.length > 0 ">
                                                        {{ orderPacks[0].orderGoods[0].sellerName }}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>목적</b>
                                                    </th>
                                                    <td>판매자와 구매자의 거래의 원활한 진행, 본인의사의확인, 고객 상담 및 불만처리, 상품과 경품 배송을 위한 배송지 확인 등</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>항목</b>
                                                    </th>
                                                    <td>구매자 이름, 전화번호, ID, 휴대폰번호, 이메일주소, 상품 구매정보, 상품 수취인 정보(이름, 주소, 전화번호)</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        <b>보유 및 이용기간</b>
                                                    </th>
                                                    <td>배송완료 후 한달</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <!--// 개인정보 제 3자 제공 동의 -->
                                    </li>
                                </ul>
                            </dd>
                        </dl>
                        <p>위 주문 내용을 확인하였으며, 결제에 동의합니다.</p>
                    </div>
                    <!--// 약관 동의 -->
                    <div class="mm_foot">
                        <div class="mm_btn_box">
                            <div class="mm_block">
                                <button
                                    type="button"
                                    class="mm_btn T=lg T=primary"
                                    @click="paymentStartProcess"
                                >
                                    <b>결제하기</b>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <!--// 최종 결제금액 -->
            </div>
            <!--// 결제 정보  -->
        </div>        
    </div>      
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent } from 'vue';
import { shippingRepository } from '$/repository/order/shippingRepository';
import { 
    ShippingAddress, 
    OrdererInfo, 
    Pack,         
    PayMethod, 
    GroupOrders, 
    OrderPrePareForm, 
    OrderPreParePack,     
    AppliedSalePacks, 
    GiveawayGroup, 
    PaymentForm, 
    MyPayMethod, 
    MyPaymentCard, 
    MyPaymentBank, 
    OrderSheetAppliedCouponRegist
} from '$/@type/order/order';
import { orderRepository } from '$/repository/order/orderRepository';
import { PointRules } from '$/@type/member/point';
import { RefundAccount } from '$/@type/member/refundAccount';
import { refundAccountRepository } from '$/repository/member/refundAccountRepository';
import { defaultCatch, handlePopupOpenWithUrlCallback, pluck } from '$/functions';
import { mmon } from '$/helper/mmon';
import { makeValidator, getTargetValue } from '$/validator';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { Slider } from '@/assets/publish/src/script/ui/sliders';
import GiveawayDetail from '@/components/modal/order/GiveawayDetail.vue'
import Coupon from '@/components/modal/order/Coupon.vue'
import Address from '@/components/modal/order/Address.vue'; 
import { shoppingRepository } from '$/repository/shoppingRepository';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { usePopupWindow } from '$/composables/pageHandler/usePopupWindow';
import { useCalculateDiscountAmount } from '$/composables/order/useCalculateDiscoutAmount';
import { useInstallMent } from '$/composables/order/useInstallMent';

const MMSelect = defineAsyncComponent(() => import("@/components/input/Select.vue"));
const MMRadio = defineAsyncComponent(() => import("@/components/input/Radio.vue"));
const MMSlider = defineAsyncComponent(() => import("@/components/Slider.vue"));
const BasePayment = defineAsyncComponent(() => import('@/pages/order/BasePayment.vue'));

const editAblePersonalClearanceCode = ref(false);
const { route, router, user } = usePageContext();    
const payType = ref<'myPayCard'|'myPayBank'|'myPayOthers'>(); // 결제 타입
const { globalConfigs } = useGlobalConfigs();        
/** 적립금 사용 관련 정책금액 계산 */
const pointRule = ref<PointRules>(globalConfigs.value.point.rules);
const useMyPay = ref(globalConfigs.value.paidFeatures.myPay); // 간편결제 이용여부

/**
 * 주문관련 정보 변수
*/
const orderId = route.params.id.toString();
const receiveAddressSlider = ref();
const receiveAddressList = ref<ShippingAddress[]>([]);        
const ordererInfo = ref<OrdererInfo>();
const orderPacks = ref<Pack[]>([]);                
const isAppliedMaxDiscount = ref(true);
const payMethods = ref<PayMethod[]>([]);
const myPayMethods = ref<MyPayMethod[]>([]);
const refundAccount = ref<RefundAccount>();
const orderPacksAppliedCouponWithImmediatelySale = ref<AppliedSalePacks[]>([]);
const latestPaymentLoaded = ref(false);
// 사은품 정보 
const giveawayGroups = ref<GiveawayGroup[]>([]);
// 최초 할인 적용여부
const isFirstMaxApplied = ref(false);
const isAgreeOfCollectPersonalClearanceCode = ref(false);
const isAgreeOfProvidePersonalClearanceCode = ref(false);
const shippingMessages = [            
    '부재 시 경비실에 맡겨주세요',
    '빠른 배송 부탁드립니다',
    '부재 시 핸드폰으로 연락 바랍니다',
    '배송 전 연락 바랍니다'
];
const shippingDirectMessage = ref('');
// 해외배송 상품 존재 여부
const isOverseasShippingContains = ref(false);
/**
* 결제시 보내야할 데이터 구조 
*/
const ordererForm = ref<{
    personalClearanceCode: string,        
    email: string,
    shippingMessage: string,
    isRememberPersonalClearanceCode: boolean,
}>({
    personalClearanceCode: '',
    email: '',
    shippingMessage: '',
    isRememberPersonalClearanceCode: false,
});

const isDirectPayForCreditCard = ref(true); // 간편 카드결제 선택 여부
const paymentForm = ref<PaymentForm>(
    {
        isDirectPay: false,
        payMethod: 0,
        payMethodEngLabel: '',
        cardCode: 0,
        installMentMonth: 0,
        bankCode: 0,                                
        cashReceiptApplyType: 3,
        cashReceiptApplyPhone: '',
        cashReceiptApplyBusinessNumber: '',
        depositorName: '',                
        usingPoint: 0,
        myPayVirtualId: null
    }
);           

const giveawayForm = ref<{
    goodsId: number,
    giveawayId: number|null
}[]>([]);

const selectedGiveawayIds = computed(()=> { 
    return giveawayForm.value.map((giveaway)=> {
        return giveaway.giveawayId
    });
})

const selectedShippingAddress = ref<ShippingAddress>({
    id: 0,
    shippingName: '',
    name: '',
    tel: '',
    zipCode: '',
    baseAddress: '',
    detailAddress: '',
    isRecent: false,
    isExtraArea: false
});

const tempUsingPoint = ref<number>(0);

// 최대 사용 금액 
const maxPointUsableAmount = computed<number>(() => {

    if (ordererInfo.value === undefined) {
        return 0;
    }

    if (ordererInfo.value.pointBalance < 1 || ordererInfo.value.pointBalance < pointRule.value.minUsableBalance) {
        return 0;
    }

    const paymentPriceExceptDeliveryPrice = priceSummary.value.forPaymentPrice - priceSummary.value.shippingPrice;
    
    if (pointRule.value.maxUsableAmount < 1 || pointRule.value.maxUsableAmount === null) {
        return ordererInfo.value.pointBalance > paymentPriceExceptDeliveryPrice 
            ? paymentPriceExceptDeliveryPrice
            : ordererInfo.value.pointBalance
    }               

    let maxUsableAmount = 0;
    
    if (pointRule.value.maxUsableAmountType.toUpperCase() === 'KRW') {
        maxUsableAmount = paymentPriceExceptDeliveryPrice > pointRule.value.maxUsableAmount 
            ? pointRule.value.maxUsableAmount
            : paymentPriceExceptDeliveryPrice;
    } else if (pointRule.value.maxUsableAmountType.toUpperCase() === 'RATE') {
        maxUsableAmount = Math.round((paymentPriceExceptDeliveryPrice)  * (pointRule.value.maxUsableAmount / 100));
    }

    return ordererInfo.value.pointBalance > maxUsableAmount ? maxUsableAmount : ordererInfo.value.pointBalance;
})

/**
    * 배송지 모달 오픈
    */
function addReceiveAddressModalOpen() {
    useModal().open(Address,{
        title: '신규 배송지 등록',
        name: 'Address',
        onClose: async() => {
            await fetchAddress();
        }
    }) 
}
/**
    * 배송지 정보 조회
    */
async function fetchAddress() {
    try {
        receiveAddressList.value = await shippingRepository.getReceiveAddresses();
    } catch(e) {
        console.log(e)
    }
}

/**
    * 배송지 삭제 처리 
    */
function removeReceiveAddress(id: number) {
    mmon.bom.confirm('배송지를 삭제하시겠습니까? ', async (flag: boolean) => {
        if (flag) {
            mmon.loading.show();
            try {
                if (selectedShippingAddress.value.id === id) {
                    selectedShippingAddress.value = {
                        id: 0,
                        shippingName: '',
                        name: '',
                        tel: '',
                        zipCode: '',
                        baseAddress: '',
                        detailAddress: '',
                        isRecent: false,
                        isExtraArea: false
                    };
                }
                await shippingRepository.removeAddress(id);
                await fetchAddress();

                // 슬라이더 스타일 초기화
                const sliderEl = receiveAddressSlider.value?.sliderElement as HTMLElement
                const sliderListEl = sliderEl?.getElementsByClassName('mm_slider-list')[0] as HTMLElement
                if (sliderListEl == null) {
                    return
                }
                sliderListEl.style.transform = 'translateX(0px)'
                selectedShippingAddress.value.id = receiveAddressList.value[0].id
            } catch(error) {
                defaultCatch(error)
            } finally {
                mmon.loading.hide();
            }
        }
    })
}

/**
    * 쿠폰 모달 오픈
*/
function couponModalOpen() {
    useModal().open(Coupon, {
        title: '쿠폰 적용',
        name: 'Coupon',
        itemClass: 'm_modal-order-coupon',
        props: {
            orderPacks: orderPacks.value,
            appliedCouponRegist: appliedCouponRegist.value
        },
        onClose: (newApply?: OrderSheetAppliedCouponRegist) => {     
            if (!newApply) {
                return;
            }

            if (isInterestDisabled.value) {
                paymentForm.value.installMentMonth = 0;    
            }

            appliedCouponRegist.value = newApply;            
            if (maxAppliedCouponPrice.value > 0 ) {
                isAppliedMaxDiscount.value = maxAppliedCouponPrice.value === priceSummary.value.appliedCouponAmount; 
            }
        }
    })          
                
}
/**
* 최대할인 적용 함수
*/

const itemSets = computed(() => orderPacks.value.flatMap(pack => pack.groupOrders));
const orderItems = computed(() => itemSets.value.flatMap(set => set.items));
const appliedCouponRegist = ref<OrderSheetAppliedCouponRegist>({})

const maximumDiscountAppliedCouponRegist = computed<OrderSheetAppliedCouponRegist>(() => {
    const apply: OrderSheetAppliedCouponRegist = {}

    const appliedValues = orderItems.value.flatMap(orderItem => {
        return orderItem.usableCouponRegists.map(couponRegist => {
            const beforeCouponPrice = orderItem.goodsBaseDiscountedPrice
                + orderItem.optionExtraAmount
                - orderItem.nightSaleAmount

            const afterCouponPrice = beforeCouponPrice - useCalculateDiscountAmount(beforeCouponPrice, couponRegist.coupon)

            return {
                uuid: orderItem.uuid,
                discountedAmount: beforeCouponPrice - afterCouponPrice,
                couponRegist
            }
        })
    })

    const appliedOrderItemUuids: string[] = []
    const appliedCouponRegistIds: number[] = []
    appliedValues.sort((before, after) => after.discountedAmount - before.discountedAmount)

    appliedValues.forEach(appliedValue => {
        if (
            appliedOrderItemUuids.includes(appliedValue.uuid)
            || appliedCouponRegistIds.includes(appliedValue.couponRegist.registId)
        ) {
            return
        }

        appliedOrderItemUuids.push(appliedValue.uuid)
        appliedCouponRegistIds.push(appliedValue.couponRegist.registId)
        apply[appliedValue.uuid] = appliedValue.couponRegist
    })

    return apply;
})

const maxAppliedCouponPrice = ref<number>(0);

function appliedMaxDiscountedPrice() {
    orderPacks.value.forEach(function(pack) {
        // 1차 -> 심야 -> 쿠폰 -> 즉시 
        pack.groupOrders.forEach(function (groupOrder) {
            groupOrder.items.forEach((item) => {
                item.registCouponId = (maximumDiscountAppliedCouponRegist.value[item.uuid]?.registId || 0)
            });                    
        })
    });   
    
    appliedCouponRegist.value = { ...maximumDiscountAppliedCouponRegist.value }
    maxAppliedCouponPrice.value = priceSummary.value.appliedCouponAmount
}


/**
    * 최대할인 적용 버튼 이벤트 
    */
function handleAppliedMaxDiscount() {
    if (isAppliedMaxDiscount.value) {
        appliedMaxDiscountedPrice();
    } else {
        orderPacks.value.forEach((pack) => {
            pack.groupOrders.forEach((groupOrder) => {
                groupOrder.items.forEach((orderItem) => {
                    orderItem.registCouponId = 0;
                })
            })
        })
    }
}

/**
    * 환불계좌 정보 패치
    */
async function fetchRefundAccount() {
    try {
        refundAccount.value = await refundAccountRepository.get();          
    } catch(e) {
        console.log(e)
    }
}

const cashReceiptApplyKey = computed(() => {
    if (paymentForm.value.cashReceiptApplyType == 3) {
        return '';
    }
    return paymentForm.value.cashReceiptApplyType == 1 ? paymentForm.value.cashReceiptApplyPhone  : paymentForm.value.cashReceiptApplyBusinessNumber;
})
/**
    * 결제 프로세스 시작
    */
async function paymentStartProcess() {
    const packItems: OrderPreParePack[] = orderPacksAppliedCouponWithImmediatelySale.value.map((pack) => {
        const items = pack.items.map((packGoods) => {
            return {
                brand_id: packGoods.brandId,
                goods_id: packGoods.goodsId,   
                goods_base_discounted_price: packGoods.goodsBaseDiscountedPrice,
                option_id: packGoods.optionId,
                option_extra_amount: packGoods.optionExtraAmount,
                night_sale_id: packGoods.nightSaleId,
                night_sale_amount: packGoods.nightSaleAmount,
                regist_coupon_id: packGoods.registCouponId == 0 ? null : packGoods.registCouponId,
                regist_coupon_amount: packGoods.appliedCouponAmount,
                immediately_sale_id: packGoods.immediatelySaleId,
                immediately_sale_amount: packGoods.immediatelySaleAmount,                        
                goods_applied_all_discounted_price: packGoods.goodsBaseDiscountedPrice  - packGoods.nightSaleAmount - packGoods.appliedCouponAmount - packGoods.immediatelySaleAmount + packGoods.optionExtraAmount
            }
        });
        
        return {
            charged_shipping_price: pack.chargedShippingPrice,
            extra_shipping_price: selectedShippingAddress.value.isExtraArea ? pack.extraShippingPrice : 0,
            shipping_rule_id: pack.shippingRuleId,
            items
        }
    })
    
    const interestInfo = installMents.value.find((interest) => {
        return interest.value == paymentForm.value.installMentMonth
    });

    const resultForm: OrderPrePareForm = {
        orderer_info: { 
            email: ordererForm.value.email,
            personal_clearance_code: ordererForm.value.personalClearanceCode,
            is_remember_personal_clearance_code: ordererForm.value.isRememberPersonalClearanceCode,
            name: user.value.name,
            phone: ordererInfo.value?.phone || ''
        },
        receive_address: {
            id: selectedShippingAddress.value.id,
            name: selectedShippingAddress.value.name,
            shipping_name: selectedShippingAddress.value.name,
            phone: selectedShippingAddress.value.tel,
            zip_code: selectedShippingAddress.value.zipCode,
            base_address: selectedShippingAddress.value.baseAddress,
            detail_address: selectedShippingAddress.value.detailAddress,
            is_extra_area: selectedShippingAddress.value.isExtraArea ?? false,
            message: ordererForm.value.shippingMessage.replace(/ /g,'') === '직접입력' ? shippingDirectMessage.value : ordererForm.value.shippingMessage
        },
        payment_info: {
            method: isPointSameForPaymentPrice.value ? 60 : paymentForm.value.payMethod,
            card_code: paymentForm.value.cardCode ? paymentForm.value.cardCode : undefined,
            interest_month: paymentForm.value.installMentMonth,
            is_interest_free: interestInfo?.isInterestFree || false,
            is_partial_interest: interestInfo?.isPartialInterestFree || false,
            bank_code: paymentForm.value.bankCode ? paymentForm.value.bankCode : undefined,
            depositor_name: paymentForm.value.depositorName,
            cash_receipt_apply_type: paymentForm.value.cashReceiptApplyType === 0 ? 3 : paymentForm.value.cashReceiptApplyType,
            cash_receipt_apply_key: cashReceiptApplyKey.value,
            using_point: Number(paymentForm.value.usingPoint),
            for_payment_price: priceSummary.value.forPaymentPrice - paymentForm.value.usingPoint
        },
        packs: packItems,    
        refund_account: refundAccount.value === undefined ? null : {
            owner_name: refundAccount.value?.ownerName || '',
            bank_code: refundAccount.value?.bankCode || '',
            account_number: refundAccount.value?.accountNumber || ''
        },
        giveaways: giveawayForm.value.map((giveaway)=> {
            return {
                goods_id: giveaway.goodsId,
                giveaway_id: giveaway.giveawayId
            }
        }),
        my_pay_virtual_id: paymentForm.value.myPayVirtualId
    }          
    const validator = makeValidator(
        Object.assign({
            isOverseasShippingContains: isOverseasShippingContains.value,
            isAgreeOfCollectPersonalClearanceCode: editAblePersonalClearanceCode.value === false ? true : isAgreeOfCollectPersonalClearanceCode.value,
            isAgreeOfProvidePersonalClearanceCode: isAgreeOfProvidePersonalClearanceCode.value,
            paymentMethodEngLabel: isPointSameForPaymentPrice.value ? 'point' : paymentForm.value.payMethodEngLabel,
            cashReceiptPhone : paymentForm.value.cashReceiptApplyPhone,
            cashReceiptBusinessNumber : paymentForm.value.cashReceiptApplyBusinessNumber
        }, resultForm)
    );

    validator.setRules({
        'orderer_info.email(이메일)': ['required', 'validEmail'],     
        'receive_address.id(배송지)' : ['required'],
        'receive_address.name(배송지)' : ['required'],
        'orderer_info.personal_clearance_code(개인통관 고유부호)': ['requiredIf:isOverseasShippingContains', 'validCode'],                
        'isAgreeOfCollectPersonalClearanceCode(개인통관고유부호 수집에 동의)': ['isAgree'],
        'isAgreeOfProvidePersonalClearanceCode(개인통관고유부호 판매자 제공에 동의)': ['isAgree'],
        'giveaways.*.giveaway_id(사은품)' : ['required'],
        'payment_info.method(결제수단)': ['required'],
        'my_pay_virtual_id(간편결제)': ['requiredIf:paymentMethodEngLabel,my_pay_credit_card,my_pay_account_transfer'],
        'payment_info.card_code(결제 카드)': ['requiredIf:paymentMethodEngLabel,credit_card'],
        'payment_info.bank_code(은행)': ['requiredIf:paymentMethodEngLabel,virtual_account'],
        'payment_info.depositor_name(입금자명)': ['requiredIf:paymentMethodEngLabel,virtual_account'],
        'payment_info.cash_receipt_apply_type(현금영수증 발급 신청 종류)': ['requiredIf:paymentMethodEngLabel,virtual_account', 'in:1,2,3'],
        'cashReceiptPhone(현금영수증-휴대폰 번호)': ['validReceiptPhone'],                
        'cashReceiptBusinessNumber(현금영수증-사업자 등록번호)': ['validReceiptBusinessNumber'],                
        'refund_account.owner_name(환불 계좌)': ['requiredIf:paymentMethodEngLabel,virtual_account,escrow'],
        'refund_account.bank_code(환불 계좌)': ['requiredIf:paymentMethodEngLabel,virtual_account,escrow'],
        'refund_account.account_number(환불 계좌)': ['requiredIf:paymentMethodEngLabel,virtual_account,escrow'],
    });
    validator.setMessages({
        'orderer_info.email.required' : ':param(을/를) 입력해주세요.',
        'orderer_info.personal_clearance_code.requiredIf': ':param(을/를) 입력해주세요.',
        'orderer_info.personal_clearance_code.validCode': ':param(을/를) 확인해주세요.',
        'isAgreeOfCollectPersonalClearanceCode.isAgree':':param(을/를) 동의해주세요.',
        'isAgreeOfProvidePersonalClearanceCode.isAgree':':param(을/를) 동의해주세요.',
        'receive_address.id': ':param(을/를) 설정해주세요.',
        'receive_address.name': ':param(을/를) 설정해주세요.',
        'orderer_info.personalClearanceCode.requiredIf': ':param(을/를) 입력해주세요.',
        'giveaways.*.giveaway_id.required' : ':param(을/를) 선택해주세요.',                
        'my_pay_virtual_id.requiredIf' : `간편결제 - ${isDirectPayForCreditCard.value ? '카드' : '계좌'}를 선택해주세요.`,                
        'payment_info.card_code.requiredIf': ':param(을/를) 선택해주세요.',
        'payment_info.bank_code.requiredIf': ':param(을/를) 선택해주세요.',
        'payment_info.depositor_name.requiredIf': ':param(을/를) 입력해주세요.',
        'payment_info.cash_receipt_apply_type.requiredIf': ':param(을/를) 선택해주세요.',
        'payment_info.cash_receipt_apply_type.in':  ':param(을/를) 선택해주세요.',      
        'cashReceiptPhone.validReceiptPhone': '올바른 휴대폰 번호를 입력해주세요',
        'cashReceiptBusinessNumber.validReceiptBusinessNumber': '올바른 사업자 번호를 입력해주세요.',
        'refund_account.owner_name.requiredIf': ':param(을/를) 등록 해주세요.',
        'refund_account.bank_code.requiredIf': ':param(을/를) 등록 해주세요.',
        'refund_account.account_number.requiredIf': ':param(을/를) 등록 해주세요.',

    })

    validator.registTester('isAgree', (paramName: string, extraValues: string[], data: { [key: string]: string }) => {
        if (isOverseasShippingContains.value === false) {
            return true;
        }

        return getTargetValue(data, paramName) === true;
    });

    validator.registTester('validCode', (paramName: string, extraValues: string[], data: { [key: string]: string }) => {
        if (isOverseasShippingContains.value === false) {
            return true;
        }

        return /^[Pp][0-9]{12}$/g.test(getTargetValue(data, paramName));
    });

    validator.registTester('validReceiptPhone', (paramName: string, extraValues: string[], data: { [key: string]: string }) => {     
        if (getTargetValue(data, 'payment_info.cash_receipt_apply_type') == 1 && getTargetValue(data, 'paymentMethodEngLabel') === 'virtual_account') {
            const tel = getTargetValue(data, paramName);
            return tel !== null && /^010[0-9]{4}[0-9]{4}$/g.test(tel);
        }
        return true;
    });

    validator.registTester('validReceiptBusinessNumber', (paramName: string, extraValues: string[], data: { [key: string]: string }) => {     
        if (getTargetValue(data, 'payment_info.cash_receipt_apply_type') == 2 && getTargetValue(data, 'paymentMethodEngLabel') === 'virtual_account') {
            const businessNumber = getTargetValue(data, paramName);
            return businessNumber !== null && businessNumber.length >= 10
        }
        return true;
    });


    try {
        await validator.run();      
        try {
            mmon.loading.show();
            const { payingUrl } = await orderRepository.preparePay(orderId, resultForm);    
            const { open } = usePopupWindow(payingUrl, {
                width: 300,
                height: 450,
                scrollbars: false,
                resizable: false,
                target: 'paying-start'
            })

            await open();

        } catch (e) {
            defaultCatch(e);
        } finally {
            mmon.loading.hide();
            router.replace({
                name: 'OrderResult',
                params : { 
                    id: orderId
                },
                replace : true
            });
        }
    } catch (e) {
        console.log(e); 
        defaultCatch(e);
    }
}

onMounted(async () => {
    try {
        // 주문서 정보 검색 
        const [{ orderInfo, packs, needPersonalClearanceCode, giveawayGroups: giveawayGroup }] = await Promise.all(
            [
                orderRepository.orderBasicData(orderId), 
                fetchAddress()
            ]
        );

        if (receiveAddressList.value.length > 0) {
            selectedShippingAddress.value = receiveAddressList.value.find((address) => {
                return address.isRecent;
            }) || receiveAddressList.value[0] 

            selectedShippingAddress.value.isExtraArea = await shippingRepository.isExtraAreaCheck(selectedShippingAddress.value.zipCode, selectedShippingAddress.value.baseAddress);
        }
        
        ordererInfo.value = orderInfo;
        isOverseasShippingContains.value = needPersonalClearanceCode;
        orderPacks.value = packs;
        giveawayGroups.value = giveawayGroup;           
        
        giveawayForm.value = giveawayGroups.value.map((giveAwayGroup) => {
            return {
                goodsId: giveAwayGroup.goodsId,
                giveawayId: null
            }
        });

        orderPacksAppliedCouponWithImmediatelySale.value = orderPacks.value.map((pack) => {
            const items = pack.orderGoods.map((item) => {
                const appliedCouponAmountPrice = computed<number>(() => {
                    if (item.registCouponId == 0 || item.registCouponId == null || item.registCouponId == undefined ) {
                        return 0;
                    }
                    const appliedCoupon = item.usableCouponRegists.find((usable) => {
                        return usable.registId == item.registCouponId;
                    });

                    if (appliedCoupon) {
                        const beforeCouponPrice = item.goodsBaseDiscountedPrice
                            + item.optionExtraAmount
                            - item.nightSaleAmount;                        
                        
                        return useCalculateDiscountAmount(beforeCouponPrice, appliedCoupon.coupon)
                        /// return couponDiscountedPrice(appliedCoupon, item.goodsBaseDiscountedPrice + item.optionExtraAmount - item.nightSaleAmount);
                    }

                    return 0;
                });
                
                return {
                    brandId: item.brandId,
                    goodsId: item.goodsId,   
                    optionId: item.optionId,
                    optionExtraAmount: item.optionExtraAmount,
                    nightSaleId: item.nightSaleId,
                    goodsSellPrice: item.goodsSellPrice,
                    goodsBaseDiscountedPrice: item.goodsBaseDiscountedPrice,
                    nightSaleAmount: item.nightSaleAmount,
                    immediatelySaleId: item.immediatelySaleId,
                    appliedCouponAmount : appliedCouponAmountPrice,						
                    registCouponId: computed<number>(() => {
                        return item.registCouponId
                    }),
                    immediatelySaleAmount: computed<number>(() => {
                        let immediatelySale = 0;
                        const baseDiscounted = item.goodsBaseDiscountedPrice - item.nightSaleAmount - appliedCouponAmountPrice.value
                        if (item.appliableImmediatelySale) {
                            immediatelySale = useCalculateDiscountAmount(baseDiscounted, item.appliableImmediatelySale)                            
                        }
                        return immediatelySale;                      
                    }),
                }
            })
            const group: GroupOrders[] = Object.values(orderRepository.groupingPackItemsByOptionId(items, 'optionId'));

            return {
                chargedShippingPrice: pack.chargedShippingPrice,
                extraShippingPrice: pack.extraShippingPrice,
                shippingRuleId: pack.shippingRuleId,
                items: items,
                group: group.map((groupItem) => {
                    return {
                        couponCount: computed<number>(() => {
                            return groupItem.items.reduce((accumulator, currentValue) => {
                                return accumulator + (currentValue.appliedCouponAmount.value > 0 ? 1 : 0)
                            }, 0);
                        }),
                        appliedAllDiscountPrice: computed<number>(() => {
                            return groupItem.items.reduce((accumulator, currentValue) => {
                                return accumulator + 
                                (
                                    currentValue.goodsBaseDiscountedPrice 
                                    + currentValue.optionExtraAmount
                                    - (currentValue.nightSaleAmount + currentValue.appliedCouponAmount.value + currentValue.immediatelySaleAmount.value)
                                );
                            }, 0);
                        }),
                    }
                })
            }
        });

        const [availablePayMethods] = await Promise.all(
            [
                orderRepository.getUserPayMethods(),
                getInterests(),
                fetchRefundAccount(),
            ]
        );

        
        payMethods.value = availablePayMethods.payMethods;
        myPayMethods.value = availablePayMethods.myPayMethods;

        // (유료기능) 간편결제 사용시 결제 수단은 간편 카드결제로 기본 선택됨.
        if (useMyPay.value) {
            payType.value = 'myPayCard'
            await Promise.all([
                getMyRegistPays(true),
                getMyRegistPays(false)
            ])
        } else {
            // 그 외는 다른 결제수단 기본 선택됨.
            payType.value = 'myPayOthers'
        }

        const latestPaymentMethod = orderInfo.latestPaymentMethodCode === null ? payMethods.value[0].code : orderInfo.latestPaymentMethodCode;                
        paymentForm.value = {
            isDirectPay: myPayMethods.value.length > 0 && myPayMethods.value.find((method) => {
                return method.code === latestPaymentMethod
            }) !== undefined,
            payMethod : latestPaymentMethod === 80 ? payMethods.value[0].code : latestPaymentMethod,
            depositorName : orderInfo.latestPaymentDepositorName,
            bankCode:  orderInfo.latestPaymentBankCode,
            cardCode: orderInfo.latestPaymentCardCode,
            installMentMonth: 0,
            cashReceiptApplyPhone: orderInfo.latestCashReceiptApplyType === 1 ? orderInfo.latestCashReceiptApplyKey : '', 
            cashReceiptApplyBusinessNumber: orderInfo.latestCashReceiptApplyType === 2 ? orderInfo.latestCashReceiptApplyKey : '',
            cashReceiptApplyType: orderInfo.latestCashReceiptApplyType === null ? 3 : orderInfo.latestCashReceiptApplyType,
            payMethodEngLabel: '',
            usingPoint: 0,
            myPayVirtualId: null
        }
        
        if (!pluck(myPayMethods.value, 'code').includes(paymentForm.value.payMethod)) {
            payType.value = 'myPayOthers'
        }

        ordererForm.value = {   
            personalClearanceCode: orderInfo.personalClearanceCode,
            email: orderInfo.email,
            shippingMessage : orderInfo.latestShippingMessage === null ? '' : orderInfo.latestShippingMessage,
            isRememberPersonalClearanceCode: (orderInfo.personalClearanceCode !== null && orderInfo.personalClearanceCode !== ''),
        }
        
        editAblePersonalClearanceCode.value = orderInfo.personalClearanceCode === null || orderInfo.personalClearanceCode === '';
        if (orderInfo.latestShippingMessage !== null && !shippingMessages.includes(orderInfo.latestShippingMessage)) {
            ordererForm.value.shippingMessage = '직접 입력';
            shippingDirectMessage.value = orderInfo.latestShippingMessage;
        }

        paymentForm.value.payMethodEngLabel = paymentForm.value.isDirectPay ?
            myPayMethods.value.find((method) =>  {
                return method.code === paymentForm.value.payMethod
            })?.engLabel || '' 
            :
            payMethods.value.find((method) => {
                return method.code === paymentForm.value.payMethod
            })?.engLabel || '';

        if (paymentForm.value.isDirectPay) {
            isDirectPayForCreditCard.value = paymentForm.value.payMethodEngLabel === 'my_pay_credit_card' ? true: false;

            if (isDirectPayForCreditCard.value) {
                paymentForm.value.myPayVirtualId = myRegistCardPays.value.length < 1 ? null : myRegistCardPays.value[0].virtualId;
            }

            paymentForm.value.myPayVirtualId = myRegistBankPays.value.length < 1 ? null : myRegistBankPays.value[0].virtualId;
        }
    }
    catch (e) {
        const errorMessage = e.response?.data?.message || '주문세션이 만료 되었습니다.';
        mmon.bom.alert(errorMessage, () => {
            router.go(-1);
        })
        console.log(e);
    }

    latestPaymentLoaded.value = true;
    appliedMaxDiscountedPrice();
    isFirstMaxApplied.value = true;
});

const priceSummary = computed(() => {
    const total = orderPacksAppliedCouponWithImmediatelySale.value.map((appliedSale) => {
        return {
            goodsPrice: appliedSale.items.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.goodsSellPrice + currentValue.optionExtraAmount;
            }, 0),
            memberDiscountedPrice: appliedSale.items.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.goodsSellPrice - currentValue.goodsBaseDiscountedPrice);
            }, 0),
            nightSaleAmount: appliedSale.items.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.nightSaleAmount;
            }, 0),
            appliedCouponAmount: appliedSale.items.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.appliedCouponAmount;
            }, 0),
            immediatelySaleAmount: appliedSale.items.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.immediatelySaleAmount;
            }, 0),
        }
    });

    const totalGoodsPrice = total.reduce((acc, cur) => {
        return acc + cur.goodsPrice
    }, 0);
    const memberDiscountedPrice = total.reduce((acc, cur) => {
        return acc + cur.memberDiscountedPrice
    }, 0);
    const shippingPrice = orderPacksAppliedCouponWithImmediatelySale.value.reduce((acc, cur) => {
        return acc + cur.chargedShippingPrice +  (selectedShippingAddress.value.isExtraArea ? cur.extraShippingPrice : 0);
    }, 0);
    const nightSaleAmount = total.reduce((acc, cur) => {
        return acc + cur.nightSaleAmount
    }, 0);
    const appliedCouponAmount = total.reduce((acc, cur) => {
        return acc + cur.appliedCouponAmount
    }, 0);
    const immediatelySaleAmount = total.reduce((acc, cur) => {
        return acc + cur.immediatelySaleAmount
    }, 0);

    return {
        totalGoodsPrice,
        memberDiscountedPrice,
        shippingPrice,
        nightSaleAmount,
        appliedCouponAmount,
        immediatelySaleAmount,
        forPaymentPrice: totalGoodsPrice - memberDiscountedPrice + shippingPrice - nightSaleAmount - appliedCouponAmount - immediatelySaleAmount
    }
})

/** 무이자 관련 처리 */
const creditCardPayMethods = computed(() => payMethods.value.find(method => method.engLabel === 'credit_card')?.childMethods || []);
const isInterestDisabled = computed(() => {
    if (!paymentForm.value.cardCode) {
        return true
    }

    if (creditCardPayMethods.value.find((child) => child.code == paymentForm.value.cardCode)?.label === '현대카드') {
        return (priceSummary.value.forPaymentPrice - paymentForm.value.usingPoint) <= 10000
    }

    return (priceSummary.value.forPaymentPrice - paymentForm.value.usingPoint) <= 50000
});

const { installMents, getInterests } = useInstallMent(isInterestDisabled, paymentForm);

/** 배송지 변경시 도서산간 여부 체크  */
async function changeReceiveAddress(receiveAddress: ShippingAddress) {
    selectedShippingAddress.value = receiveAddress
    selectedShippingAddress.value.isExtraArea = await shippingRepository.isExtraAreaCheck(receiveAddress.zipCode, receiveAddress.baseAddress);
}

/**
    * 적립금 관련 처리 
    * @param event 
    */
function togglePointUsing(event: Event) {
    if ((event.target as HTMLInputElement).checked === false) {
        return;
    }
    
    if (ordererInfo.value !== undefined
        && (ordererInfo.value.pointBalance < 1 || ordererInfo.value.pointBalance < pointRule.value.minUsableBalance)
        && pointRule.value.minUsableBalance > 0
    ) {
        paymentForm.value.usingPoint = 0;
        tempUsingPoint.value = 0;
        return mmon.bom.alert(`최소 ${pointRule.value.minUsableBalance}원이상 보유하여야 적립금 사용이 가능합니다`);
    }

    paymentForm.value.usingPoint = 0;
    tempUsingPoint.value = maxPointUsableAmount.value;
    paymentForm.value.usingPoint = maxPointUsableAmount.value
}

const isPointSameForPaymentPrice = computed(() => {
    return priceSummary.value.forPaymentPrice === paymentForm.value.usingPoint;
})

/**
    * 적립금 검증처리. 
    */
function validatePoint() {
    tempUsingPoint.value = Number(tempUsingPoint.value.toString());
    if (tempUsingPoint.value < 100) {
        paymentForm.value.usingPoint = 0;
        tempUsingPoint.value = 0;
        return mmon.bom.alert('적립금은 100원 이상 사용 가능합니다.');
    }

    if (ordererInfo.value !== undefined
        && (ordererInfo.value.pointBalance < 1 || ordererInfo.value.pointBalance < pointRule.value.minUsableBalance)
        && pointRule.value.minUsableBalance > 0
    ) {
        return mmon.bom.alert(`최소 ${pointRule.value.minUsableBalance}원이상 보유하여야 적립금 사용이 가능합니다`, () => {
            paymentForm.value.usingPoint = 0;
            tempUsingPoint.value = 0;
        });
    }

    if (tempUsingPoint.value > maxPointUsableAmount.value) {
        paymentForm.value.usingPoint = 0;    
        return mmon.bom.alert(`최대 ${maxPointUsableAmount.value}원까지만 사용이 가능합니다.`, () => {
            tempUsingPoint.value = maxPointUsableAmount.value;
            paymentForm.value.usingPoint = maxPointUsableAmount.value;
        })
    }
    
    paymentForm.value.usingPoint = tempUsingPoint.value;
    setTimeout(() => {
        tempUsingPoint.value = Number(tempUsingPoint.value);
    }, 100)
}

function validatePersonalClearanceCode(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^a-z|0-9|A-Z]/g, '');            
}

/**
    * 사은품 관련 처리 
    * @param giveawayForm 
    */
function resetSelectedGiveaway(giveawayForm: {goodsId: number, giveawayId: number|null}) {
    if (giveawayForm.giveawayId === null) {
        giveawayForm.giveawayId = 0;
        return;
    }
    giveawayGroups.value.filter((giveawayGroup)=> {
        giveawayGroup.giveaway.filter((giveAway) => {                    
            if (giveAway.id === giveawayForm.giveawayId) {
                return giveAway.selectAble = true;
            }                    
        })
    });

    giveawayForm.giveawayId = 0;
}

function validateGiveaway(giveawayId: number, goodsId: number) {
    giveawayGroups.value.forEach((giveawayGroup)=> {
        giveawayGroup.giveaway.forEach((giveAway) => {                    
            if (giveAway.id === giveawayId && giveawayGroup.goodsId !== goodsId) {
                return giveAway.selectAble = false;
            }                   
            if (giveawayId === 0 && giveawayGroup.goodsId === goodsId) {
                return giveAway.selectAble = !selectedGiveawayIds.value.includes(giveAway.id);
            }                   
            if (giveAway.id !== giveawayId && giveawayGroup.goodsId !== goodsId && giveAway.selectAble === false) {
                
                giveAway.selectAble = !selectedGiveawayIds.value.includes(giveAway.id);
            }
        })
    })
}

/**
    * 간편결제 관련 
    */

const myRegistCardPays = ref<MyPaymentCard[]>([]) // 등록된 간편결제카드 정보
const myRegistBankPays = ref<MyPaymentBank[]>([]) // 등록된 간편결제계좌 정보
const myPaymentCreditCardInstallMentShow = ref(true); // 간편결제에서 공통으로 보여줄 정보 노출 여부(ex, 간편카드 결제시 할부개월 목록)

async function managementMyPay(isCard: boolean) {
    const { isPopupClose } = await handlePopupOpenWithUrlCallback(
        'order-action',
        async () => {
            const { linkType, linkUrl } = await orderRepository.prepareManageMent(isCard)
            return linkUrl
        },
        'width=600px, height=800px, resizable=no, scrollbars=no',
        false,
    )

    if (isPopupClose) {
        getMyRegistPays(isCard);
    }
}

async function registMyPay(isCard: boolean) {
    try {
        const { isRegisted, enterUrl } = await orderRepository.getTokenWithEnterUrl(isCard);
        const { isPopupClose } = await handlePopupOpenWithUrlCallback(
            'order-action',
            async () => {
                if (isRegisted) {
                    const { linkType, linkUrl } = await orderRepository.prepareRegist(isCard)
                    return linkUrl;
                }
                return enterUrl
            },
            'width=600px, height=800px, resizable=no, scrollbars=no',
            false,
        )

        // // 팝업 닫혔을때 결제수단 새로고침 처리
        if (isPopupClose) {
            getMyRegistPays(isCard);
        }
    } catch(e) {
        defaultCatch(e);
    }           
}

async function getMyRegistPays(isForCard: boolean) {
    if (isForCard) {
        myRegistCardPays.value = await orderRepository.getMyPayCard();
        if (myRegistCardPays.value.length < 1) {
            myPaymentCreditCardInstallMentShow.value = false;
        }
    } else {
        myRegistBankPays.value = await orderRepository.getMyPayBank()
    }
}

/**
    * 간편 결제 타입 핸들링
    */
function handleMyPayType(isForCard: boolean) {
    isDirectPayForCreditCard.value = isForCard;

    const myPayMethod = myPayMethods.value.find((myPay) => {
        return myPay.engLabel === (isForCard ? 'my_pay_credit_card' : 'my_pay_account_transfer')
    });

    if (myPayMethod === undefined) {
        return;
    }
    paymentForm.value.payMethod = myPayMethod.code;
    paymentForm.value.payMethodEngLabel = myPayMethod.engLabel;
}


function myPaymentVirtualIdHandler(slider: {
    ui: Slider
}) {

    if (slider.ui.index === myRegistCardPays.value.length) {
        myPaymentCreditCardInstallMentShow.value = false;
        return paymentForm.value.myPayVirtualId = null;
    }

    if (myRegistCardPays.value[slider.ui.index].virtualId) {
        paymentForm.value.myPayVirtualId = myRegistCardPays.value[slider.ui.index].virtualId;
        paymentForm.value.cardCode = myRegistCardPays.value[slider.ui.index].cardCode;
        paymentForm.value.installMentMonth = 0;
    }

    myPaymentCreditCardInstallMentShow.value = true;
}

function myPaymentBankTransferVirtualIdHandler(slider: {
    ui: Slider
}) {
    if (slider.ui.index === myRegistBankPays.value.length) {
        return paymentForm.value.myPayVirtualId = null;
    }

    if (myRegistBankPays.value[slider.ui.index].virtualId) {
        paymentForm.value.myPayVirtualId = myRegistBankPays.value[slider.ui.index].virtualId;     
    }
}

const myPayMethod = computed(() => {            
    if (isDirectPayForCreditCard.value) {
        return myPayMethods.value.find((method) => {
            return method.engLabel === 'my_pay_credit_card'
        }) || {
            code: -999,
            engLabel: 'empty',
        };
    }

    return myPayMethods.value.find((method) => {
        return method.engLabel === 'my_pay_account_transfer'
    }) || {
        code: -999,
        engLabel: 'empty',
    };
})

const creditCards = computed(() => {
    return payMethods.value.find((payMethod) => {
        return payMethod.engLabel === 'credit_card';
    })?.childMethods || []
});

const banks = computed(() => {
    return payMethods.value.find((payMethod) => {
        return payMethod.engLabel === 'virtual_account';
    })?.childMethods || []
})

/**
    * 간편결제 수단 선택시 핸들링 하는 함수
    */
function directPaySelectHandler() {
    paymentForm.value.payMethod = myPayMethod.value.code;
    paymentForm.value.payMethodEngLabel = myPayMethod.value.engLabel;            
}

function updateOrderPaymentForm(childOrderPaymentForm: PaymentForm) {
    const legacyPoint = paymentForm.value.usingPoint;
    paymentForm.value = { ...childOrderPaymentForm };
    paymentForm.value.usingPoint = legacyPoint;
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
</script>