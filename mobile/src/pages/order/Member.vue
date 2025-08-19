<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>주문/결제</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-order">
                            <!-- 받는분 정보 -->
                            <div :class="['mm_dropdown T=order', DROPDOWN_STYLE.DELIVERY_INFO.CLASS ]" data-dropdown>
                                <button 
                                    type="button" 
                                    class="btn_dropdown"
                                    :title="DROPDOWN_STYLE.DELIVERY_INFO.TITLE"                                        
                                    @click="() => { DROPDOWN.DELIVERY_INFO = !DROPDOWN.DELIVERY_INFO }"
                                >
                                    <b>받는분 정보</b>
                                    <b class="text_contraction">{{ selectedShippingAddress?.shippingName }}</b>
                                    <i class="ico_dropdown" />
                                </button>
                                <div class="mm_dropdown-item" :style="DROPDOWN_STYLE.DELIVERY_INFO.STYLE">
                                    <div class="mm_dropdown-item-inner">
                                        <div class="mm_inner">
                                            <h6 class="mm_text-label">
                                                <b>이메일 주소</b>
                                            </h6>
                                            <MMInput 
                                                v-model="ordererForm.email"
                                                :placeholder="'이메일 주소를 입력하세요(필수입력)'"
                                                maxlength="50"
                                            />     
                                            <h6 class="mm_text-label">
                                                <b>배송지 정보</b>
                                            </h6>
                                            <!-- (D) 등록된 배송지 정보가 있을 경우 아래와 같이 노출합니다 -->
                                            <div v-if="receiveAddresses.length > 0" class="mm_address-list T=scroller">
                                                <div class="mm_scroller T=x">
                                                    <ul>
                                                        <li v-for="receiveAddress in receiveAddresses" :key="`${receiveAddress.id}_${receiveAddress.name}`">
                                                            <input 
                                                                v-model="selectedShippingAddress" 
                                                                type="radio" 
                                                                name="radio-address"                                                    
                                                                :title="receiveAddress.name" 
                                                                :checked="selectedShippingAddress !== null && selectedShippingAddress.id === receiveAddress.id" 
                                                                data-radio
                                                                @change="changeReceiveAddress(receiveAddress)"                                                                     
                                                            >
                                                            <div class="mm_address-item">
                                                                <i class="ico_form-radio T=circle" />
                                                                <dl>
                                                                    <dt>
                                                                        <b>{{ receiveAddress.shippingName }}</b>
                                                                        <b v-if="receiveAddress.isRecent" class="mm_tag T=gray">최근배송지</b>
                                                                    </dt>
                                                                    <dd>{{ receiveAddress.name }} / {{ MMFilters.formatTel(receiveAddress.tel) }}</dd>
                                                                    <dd>
                                                                        {{ receiveAddress.zipCode }}<br>
                                                                        {{ receiveAddress.baseAddress }}<br>
                                                                        {{ receiveAddress.detailAddress }}
                                                                    </dd>
                                                                </dl>
                                                            </div>
                                                            <button type="button" class="btn_remove" @click="removeReceiveAddress(receiveAddress.id)">
                                                                <b>삭제</b>
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <a class="mm_address-item" href="#ADDRESS_CREATE">
                                                                <i class="ico_plus" /><b>배송지를 등록하세요</b>
                                                            </a> 
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <a v-else class="mm_address-item" href="#ADDRESS_CREATE">
                                                <i class="ico_plus" /><b>배송지를 등록하세요</b>
                                            </a> 
                                            <MMSelect v-model="ordererForm.shippingMessage">
                                                <option value="">
                                                    배송메모를 선택하세요
                                                </option>
                                                <option v-for="message in shippingMessages" :key="message" :value="message">
                                                    {{ message }}
                                                </option>
                                                <option data-option="{ 'syncer': '.mm_syncer-delivery-note'}">
                                                    직접입력
                                                </option>
                                            </MMSelect>
                                            <div :class="['mm_syncer-delivery-note', { 'S=option-use' : ordererForm.shippingMessage === '직접입력' }]">
                                                <MMInput 
                                                    v-model="shippingDirectMessage"
                                                    :use-trim="false"
                                                    :placeholder="'배송 메모를 입력하세요(20자 이내)'"
                                                    maxlength="20"
                                                />     
                                            </div>
                                            <!-- 해외배송 개인통관고유부호 -->
                                            <template v-if="isOverseasShippingContains">
                                                <section v-if="ordererInfo?.personalClearanceCode === '' || ordererInfo?.personalClearanceCode === null || editAblePersonalClearanceCode" class="m_popup-order-unipass">
                                                    <h6 class="mm_text-label">
                                                        <b>해외배송 개인통관고유부호</b>
                                                    </h6>
                                                    <MMInput 
                                                        v-model="ordererForm.personalClearanceCode"
                                                        :placeholder="'P로 시작하는 정보를 입력하세요'"
                                                        maxlength="13"
                                                        @input="validatePersonalClearanceCode($event)"
                                                    />     
                                                    <label class="mm_form-check">
                                                        <input v-model="ordererForm.isRememberPersonalClearanceCode" type="checkbox" data-check>
                                                        <b class="mm_block">
                                                            <i class="ico_form-check" />
                                                            <span class="text_label">다음 주문 시에도 계속 사용</span>
                                                        </b>
                                                    </label>
                                                    <div class="mm_note">
                                                        <ul>
                                                            <li>상품을 받는 분의 명의로 통관이 진행되므로 <strong class="mm_text-secondary">{{ !selectedShippingAddress ? '받는분' : `${selectedShippingAddress.name} 님` }}</strong>의 개인통관고유부호를 입력해주세요.</li>
                                                            <li>해외배송 상품은 관세청 통관을 위해 수취인의 고유식별정보를 판매자에게 제공합니다.</li>
                                                            <li>개인통관고유부호는 통관 시 주민등록번호 대신 사용 가능한 번호로, 관세청 사이트에서 발급 받으실 수 있습니다.</li>
                                                        </ul>
                                                    </div>
                                                    <a class="btn_unipass" href="https://unipass.customs.go.kr/csp/persIndexRectOnslCrtf.do?qryIssTp=1&is_out_intent=Y" target="_blank"><b>개인통관고유부호 발급/확인 바로가기</b><i class="ico_link T=sm" /></a>
                                                    <div class="mm_check_box">
                                                        <div class="mm_check-list">
                                                            <ul>
                                                                <li>
                                                                    <div class="mm_flex">
                                                                        <label class="mm_form-check">
                                                                            <input v-model="isAgreeOfCollectPersonalClearanceCode" type="checkbox" data-check="{ '_group': 'agree_check-unipass' }">
                                                                            <b class="mm_block">
                                                                                <i class="ico_form-check" />
                                                                                <span class="text_label"><strong class="mm_text-variable">(필수)</strong>해외배송 상품의 수입신고를 위한 개인통관고유부호 수집에 동의</span>
                                                                            </b>
                                                                        </label>
                                                                        <a class="btn_detail" href="#POLICY_UNIPASS"><b>자세히</b></a>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div class="mm_flex">
                                                                        <label class="mm_form-check">
                                                                            <input v-model="isAgreeOfProvidePersonalClearanceCode" type="checkbox" data-check="{ '_group': 'agree_check-unipass' }">
                                                                            <b class="mm_block">
                                                                                <i class="ico_form-check" />
                                                                                <span class="text_label"><strong class="mm_text-variable">(필수)</strong>해외배송 상품의 수입신고를 위한 개인통관고유부호 판매자 제동 동의</span>
                                                                            </b>
                                                                        </label>
                                                                        <a class="btn_detail" href="#POLICY_UNIPASS"><b>자세히</b></a>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </section>	
                                                <section v-else class="m_popup-order-unipass">
                                                    <h6 class="mm_text-label">
                                                        <b>해외배송 개인통관고유부호</b>
                                                    </h6>
                                                    <div class="mm_form-text">
                                                        <label>
                                                            <span class="textfield text_readonly">{{ ordererForm.personalClearanceCode }}</span>
                                                            <i class="bg_text" />
                                                        </label>
                                                    </div>
                                                    <button type="button" class="mm_btn T=xs T=line btn_modify" @click="() => { editAblePersonalClearanceCode = !editAblePersonalClearanceCode }">
                                                        <b>수정하기</b>
                                                    </button>
                                                    <div class="mm_check_box">
                                                        <div class="mm_check-list">
                                                            <ul>
                                                                <li>
                                                                    <div class="mm_flex">
                                                                        <label class="mm_form-check">
                                                                            <input v-model="isAgreeOfProvidePersonalClearanceCode" type="checkbox" data-check="{ '_group': 'agree_check-unipass' }">
                                                                            <b class="mm_block">
                                                                                <i class="ico_form-check" />
                                                                                <span class="text_label"><strong class="mm_text-variable">(필수)</strong>해외배송 상품의 수입신고를 위한 개인통관고유부호 판매자 제동 동의</span>
                                                                            </b>
                                                                        </label>
                                                                        <a class="btn_detail" href="#POLICY_UNIPASS"><b>자세히</b></a>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </section>												
                                            </template>
                                            <!--// 해외배송 개인통관고유부호 -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--// 받는분 정보 -->
                            <hr class="mm_line">
                            <!-- 상품 정보 -->
                            <div :class="['mm_dropdown T=order', DROPDOWN_STYLE.GOODS_INFO.CLASS]" data-dropdown>
                                <button 
                                    type="button" 
                                    class="btn_dropdown"
                                    :title="DROPDOWN_STYLE.GOODS_INFO.TITLE"                                        
                                    @click="() => { DROPDOWN.GOODS_INFO = !DROPDOWN.GOODS_INFO }"
                                >
                                    <b>상품 정보</b>
                                    <b class="text_contraction">
                                        <span class="text_count"><strong>{{ orderPacks.length }}</strong><sub>건</sub></span>
                                        <span class="text_price"><strong>{{ MMFilters.formatNumber(priceSummary.forPaymentPrice - priceSummary.shippingPrice) }}</strong></span>
                                    </b>
                                    <i class="ico_dropdown" />
                                </button>
                                <div class="mm_dropdown-item" :style="DROPDOWN_STYLE.GOODS_INFO.STYLE">
                                    <div class="mm_dropdown-item-inner">
                                        <div class="mm_order-item">
                                            <label class="mm_form-check">
                                                <input v-model="isAppliedMaxDiscount" type="checkbox" data-check checked @change="handleAppliedMaxDiscount">
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
                                                        <span v-if="(!selectedShippingAddress?.isExtraArea || pack.extraShippingPrice === 0) && pack.chargedShippingPrice === 0">무료배송</span>
                                                        <span v-else class="text_price"><strong>{{ MMFilters.formatNumber(selectedShippingAddress?.isExtraArea ? (pack.chargedShippingPrice + pack.extraShippingPrice) : pack.chargedShippingPrice) }}</strong></span>
                                                    </p>
                                                </div>
                                                <div class="mm_product-list T=sm">
                                                    <ul>
                                                        <li v-for="orderGoods, groupIndex in pack.groupOrders" :key="orderGoods.goodsId">
                                                            <p class="text_seller">
                                                                <i class="ico_shop" />{{ orderGoods.sellerName }}
                                                            </p>
                                                            <div class="mm_product-item">
                                                                <a>
                                                                    <figure>
                                                                        <i v-lazyload="{ src: orderGoods.goodsThumbnailUrl }" class="mm_bg-cover image_product" />
                                                                        <figcaption>
                                                                            <p class="text_brand">{{ orderGoods.brandName }}</p>
                                                                            <p class="text_product">{{ orderGoods.goodsName }}</p>
                                                                            <p class="text_price">
                                                                                <strong>{{ MMFilters.formatNumber(orderPacksAppliedCouponWithImmediatelySale[index].group[groupIndex].appliedAllDiscountPrice) }}</strong>
                                                                                <span v-if="orderGoods.appliableImmediatelySale" class="text_price-sale">즉시할인 적용가</span>
                                                                            </p>
                                                                            <p class="text_option">{{ orderGoods.optionName.replace('/', '') }} / {{ orderGoods.items.length }}개</p>
                                                                        </figcaption>
                                                                    </figure>
                                                                </a>
                                                                <div class="mm_product-item-footer">
                                                                    <div class="mm_product...footer-indent">
                                                                        <p v-if="orderPacksAppliedCouponWithImmediatelySale[index].group[groupIndex].couponCount > 0">
                                                                            쿠폰 적용: {{ orderPacksAppliedCouponWithImmediatelySale[index].group[groupIndex].couponCount }}개
                                                                        </p>                                                                        
                                                                        <a v-if="orderGoods.usableCouponRegists.length > 0" class="mm_btn T=sm T=primary" href="#ORDER_COUPON_APPLY"><b>쿠폰적용</b></a>
                                                                    </div>                                                                    
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--// 상품 정보 -->
                            <hr class="mm_line">
                            <!-- 사은품 정보 -->
                            <template v-if="giveawayGroups.length > 0">
                                <div :class="['mm_dropdown T=order m_popup-order-gift', DROPDOWN_STYLE.GIVEAWAY_INFO.CLASS]" data-dropdown>
                                    <button 
                                        type="button" 
                                        class="btn_dropdown"
                                        :title="DROPDOWN_STYLE.GIVEAWAY_INFO.TITLE"                                        
                                        @click="() => { DROPDOWN.GIVEAWAY_INFO = !DROPDOWN.GIVEAWAY_INFO }"
                                    >
                                        <b>사은품 정보</b>
                                        <i class="ico_dropdown" />
                                    </button>
                                    <div class="mm_dropdown-item" :style="DROPDOWN_STYLE.GIVEAWAY_INFO.STYLE">
                                        <div class="mm_dropdown-item-inner">
                                            <div class="mm_inner">
                                                <section v-for="giveawayGroup, index in giveawayGroups" :key="giveawayGroup.goodsId">
                                                    <h4 v-if="index === 0" class="mm_strapline">
                                                        <b>사은품 선택</b>
                                                    </h4>
                                                    <h4 v-else class="mm_strapline">
                                                        <b>사은품 선택<span>(선택{{ index + 1 }})</span></b>
                                                    </h4>
                                                    <ul class="mm_gift-list">
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
                                                                    <i v-lazyload="{ src: giveaway.imageUrl }" class="mm_bg-cover image_gift" />
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
                                                                <div class="mm_btn_box">
                                                                    <div class="mm_rside">
                                                                        <a class="btn_gift-info" href="#GIVE_AWAY_TARGET" @click="setGiveawayId(giveaway.id)">
                                                                            <b>지급대상확인</b><i class="ico_link T=xs" />
                                                                        </a>
                                                                    </div>
                                                                </div>
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
                                                </section>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--// 사은품 정보 -->
                                <hr class="mm_line">
                            </template>
								
                            <!-- 적립금 사용 -->
                            <div :class="['mm_dropdown T=order m_popup-order-point', DROPDOWN_STYLE.POINT_INFO.CLASS]" data-dropdown>
                                <button  
                                    type="button" 
                                    class="btn_dropdown"
                                    :title="DROPDOWN_STYLE.POINT_INFO.TITLE"                                        
                                    @click="() => { DROPDOWN.POINT_INFO = !DROPDOWN.POINT_INFO }"
                                >
                                    <b>적립금 사용</b>
                                    <b class="text_contraction"><span class="text_point"><strong>{{ MMFilters.formatNumber(paymentForm.usingPoint) }}</strong><sub>원</sub></span></b>
                                    <i class="ico_dropdown" />
                                </button>
                                <div class="mm_dropdown-item" :style="DROPDOWN_STYLE.POINT_INFO.STYLE">
                                    <div class="mm_dropdown-item-inner">
                                        <div class="mm_inner">
                                            <div class="mm_form_mix-linked">
                                                <MMInput
                                                    v-model="tempUsingPoint"
                                                    :data-type="'number'"
                                                    :form-class="'mm_form-text T=short'"   
                                                    :placeholder="'사용할 적립금'"                                             
                                                    @on-clear="() => {
                                                        tempUsingPoint = 0;
                                                        paymentForm.usingPoint = 0
                                                    }"                                         
                                                    @change="validatePoint"
                                                />
                                                <label class="mm_form-check">
                                                    <input type="checkbox" data-check @change="togglePointUsing($event)">
                                                    <b class="mm_block">
                                                        <i class="ico_form-check" />
                                                        <span class="text_label">모두 사용</span>
                                                    </b>
                                                </label>
                                            </div>
                                            <p class="text_point">
                                                보유 적립금 
                                                <strong>{{ MMFilters.formatNumber(ordererInfo?.pointBalance || 0) }}</strong>
                                                <sub>원</sub>
                                            </p>
                                            <div class="mm_note">
                                                <ul>
                                                    <li>적립금 사용 시 상품 구매금액 비율로 계산되어 각 상품에 사용 적립금이 자동 적용 됩니다.</li>
                                                    <li><strong>최소 {{ MMFilters.formatNumber(pointRule.minUsableBalance) }}원 이상 보유 시 사용 가능</strong>합니다.</li>
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--// 적립금 사용 -->
                            <hr class="mm_line">
                            <!-- 최종 결제금액 -->
                            <div :class="['mm_dropdown T=order', DROPDOWN_STYLE.PAYMENT_INFO.CLASS]" data-dropdown>
                                <button 
                                    type="button" 
                                    class="btn_dropdown"
                                    :title="DROPDOWN_STYLE.PAYMENT_INFO.TITLE"                                        
                                    @click="() => { DROPDOWN.PAYMENT_INFO = !DROPDOWN.PAYMENT_INFO }"
                                >
                                    <b>최종 결제금액</b>
                                    <b class="text_contraction"><span class="mm_text-variable text_price"><strong>{{ MMFilters.formatNumber(priceSummary.forPaymentPrice - paymentForm.usingPoint ) }}</strong></span></b>
                                    <i class="ico_dropdown" />
                                </button>
                                <div class="mm_dropdown-item" :style="DROPDOWN_STYLE.PAYMENT_INFO.STYLE">
                                    <div class="mm_dropdown-item-inner">
                                        <div class="mm_inner">
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
                                                                    - <strong>{{ MMFilters.formatNumber(paymentForm.usingPoint, '0') }}</strong>
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--// 최종 결제금액 -->
                            <hr class="mm_line">
                            <!-- 결제수단 선택 -->
                            <div v-if="!isPointSameForPaymentPrice" :class="['mm_dropdown T=order m_popup-order-payment', DROPDOWN_STYLE.PAYMENT_METHOD_INFO.CLASS]" data-dropdown>
                                <button 
                                    type="button" 
                                    class="btn_dropdown"
                                    :title="DROPDOWN_STYLE.PAYMENT_METHOD_INFO.TITLE"                                        
                                    @click="() => { DROPDOWN.PAYMENT_METHOD_INFO = !DROPDOWN.PAYMENT_METHOD_INFO }"
                                >
                                    <b>결제수단 선택</b>
                                    <b class="text_contraction">{{ selectedPayMethodLabel }}</b>
                                    <i class="ico_dropdown" />
                                </button>
                                <div class="mm_dropdown-item" :style="DROPDOWN_STYLE.PAYMENT_METHOD_INFO.STYLE">
                                    <div class="mm_dropdown-item-inner">
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
                                                        :additional-is-first="false"
                                                        :items="myRegistCardPays"
                                                        :slider-data="{ onIntersecting: myPaymentVirtualIdHandler, _isLoop: false }"
                                                        :use-pagination="myRegistCardPays.length > 0"
                                                        :use-control="false"
                                                        :use-manage-item="true"
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
                                                            <li :class="['mm_slider-item', { 'S=on': myRegistCardPays.length == 0 }]">
                                                                <a
                                                                    class="btn_register"
                                                                    href="#"
                                                                    target="_blank"
                                                                    title="새 창 열림"
                                                                    @click.prevent="registMyPay(true)"
                                                                ><i class="ico_add" /><b v-html="myRegistCardPays.length > 0 ? '카드 추가 등록' : '카드 등록 한번으로<br> 간편하게 결제해보세요'" /></a>
                                                            </li>
                                                        </template>
                                                        <template #sliderCommonContent>
                                                            <MMSelect
                                                                v-if="myPaymentCreditCardInstallMentShow"
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
                                                    <Slider 
                                                        v-if="isMyPayAccountSliderReady"
                                                        :use-control="false"
                                                        :use-manage-item="true"
                                                        :additional-is-first="false"
                                                        :use-pagination="myRegistBankPays.length > 0"
                                                        :items="myRegistBankPays"
                                                        :slider-data="{ onIntersecting: myPaymentBankTransferVirtualIdHandler, _isLoop: false }"
                                                    >
                                                        <template #item="{ item }">
                                                            <figure>
                                                                <i class="image_logo">
                                                                    <img
                                                                        v-lazyload="{ src: item.imageUrl }"
                                                                        src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                                                        :alt="item.name"
                                                                    >
                                                                </i>
                                                                <figcaption>
                                                                    <p class="text_title">
                                                                        계좌번호
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
                                                            <li :class="['mm_slider-item', { 'S=on': myRegistBankPays.length == 0 }]">
                                                                <a class="btn_register" href="#" target="_blank" title="새 창 열림" @click.prevent="registMyPay(false)">
                                                                    <i class="ico_add" />
                                                                    <b v-if="myRegistBankPays.length > 0">계좌 추가 등록</b>
                                                                    <b v-else>계좌 등록 한번으로<br>
                                                                        간편하게 결제해보세요
                                                                    </b>
                                                                </a>
                                                            </li>
                                                        </template>
                                                    </Slider>
                                                </div>
                                            </li>
                                            <!--// 간편결제 -->

                                            <!-- 다른 결제수단 -->
                                            <li>
                                                <MMRadio
                                                    v-model="payType"
                                                    name="pay-select"
                                                    :value="'myPayOthers'"
                                                >
                                                    <b class="mm_block">
                                                        <i class="ico_form-radio" />
                                                        <span class="text_label">다른 결제수단 선택</span>
                                                    </b>
                                                </MMRadio>
                                                <div :class="['mm_syncer-payment-method', { 'S=radio-use': payType === 'myPayOthers' }]">
                                                    <BasePayment
                                                        v-if="latestPaymentLoaded"
                                                        :payment-form="paymentForm"
                                                        :refund-account="refundAccount"
                                                        :pay-methods="payMethods"
                                                        :install-ments="installMents"
                                                        :need-payment-update="payType === 'myPayOthers'"
                                                        @update-payment="updateOrderPaymentForm"
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
                                            />
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <!--// 결제수단 선택 -->
                            <hr class="mm_line">
                            <!-- 약관동의 안내 -->
                            <div class="mm_inner m_popup-order-agree">
                                <div class="m...agree-inner">
                                    <h6><b>주문상품정보 및 서비스 이용약관에 동의</b></h6>
                                    <ul>
                                        <li><p>구매조건 확인 및 결제 진행 동의</p></li>
                                        <li>
                                            <p>개인정보 제 3자 제공 동의</p>
                                            <button type="button" onclick="this.classList.toggle('S=switch-on')" class="btn_more" data-switch>
                                                <b>자세히</b>
                                            </button>
                                            <table>
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
                                                        <td>이름, ID, 휴대폰번호, 이메일 주소,전 화번호, 상품 구매정보, 상품 수취인정보(성명, 주소, 전화번호)</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">
                                                            <b>보유 및<br>이용기간</b>
                                                        </th>
                                                        <td>이용목적 달성 시까지 보관</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </li>
                                    </ul>
                                </div>
                                <p>위 주문 내용을 확인하였으며, 결제에 동의합니다.</p>
                            </div>
                            <!--// 약관동의 안내 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>

            <!-- 하단고정버튼 -->
            <div class="mm_btn_box T=fixed">
                <button type="button" class="btn_order" @click="paymentStartProcess">
                    <b><strong>{{ MMFilters.formatNumber(priceSummary.forPaymentPrice - paymentForm.usingPoint ) }}</strong>원 결제하기</b>
                </button>				
            </div>		
        </template>		
    </MMPopup>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import MMPopup from '@/components/layout/Popup.vue';
import BasePayment from '@/pages/order/BasePayment.vue';
import MMSelect from '@/components/input/Select.vue';
import { 
    AppliedSalePacks,
    GiveawayGroup, 
    GroupOrders,
    MyPaymentCard, 
    MyPaymentBank, 
    MyPayMethod, 
    OrdererInfo, 
    OrderPrePareForm, 
    OrderPreParePack, 
    Pack, 
    PaymentForm, 
    PayMethod, 
    ShippingAddress, 
    OrderSheetAppliedCouponRegist
} from '$/@type/order/order';
import { orderRepository } from '$/repository/order/orderRepository';
import { shippingRepository } from '$/repository/order/shippingRepository';
import { RefundAccount } from '$/@type/member/refundAccount';
import { PointRules } from '$/@type/member/point';
import { refundAccountRepository } from '$/repository/member/refundAccountRepository';
import { defaultCatch, handlePopupOpenWithUrlCallback, pluck  } from '$/functions';
import { useGiveawayTargetModal, useOrderCoupon } from '$/composables/orderComposable';
import { makeValidator, getTargetValue } from '$/validator';
import { useRefundAccountEdit } from '$/composables/mypage/refundAccountComposable';
import { Slider } from '@/assets/publish/src/script/ui/sliders';
import { useCalculateDiscountAmount } from '$/composables/order/useCalculateDiscoutAmount';
import { useInstallMent } from '$/composables/order/useInstallMent';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

/** 비동기로드 컴포넌트 */
const MMSlider = defineAsyncComponent(() => import('@/components/Slider.vue'));
const MMRadio = defineAsyncComponent(() => import('@/components/input/Radio.vue'));
/** 주문번호  */
const props = defineProps<{ id: string}>();
/** 페이지내 기본 사용되는 항목 */
const {
    user,
    router,
    mmon,
    usePageTitleSetting,
    globalConfigs
} = usePageContext();
usePageTitleSetting('주문/결제');
/** 자체페이 사용여부 */
const useMyPay = ref(globalConfigs.value.paidFeatures.myPay);

/** 배송지 관련 변수 */
const shippingDirectMessage = ref('');
const selectedShippingAddress = ref<ShippingAddress|null>(null);
/** 개인통관 고유부호  */
const editAblePersonalClearanceCode = ref(false);
/** 개인통관 고유부호 보정처리  */
function validatePersonalClearanceCode(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^a-z|0-9|A-Z]/g, '');            
}

/** 사은품 관련 처리  */
const giveawayForm = ref<{
    goodsId: number,
    giveawayId: number|null
}[]>([]);

const selectedGiveawayIds = computed(()=> { 
    return giveawayForm.value.map((giveaway)=> {
        return giveaway.giveawayId
    });
})
const giveawayGroups = ref<GiveawayGroup[]>([]);
		
/** [START]페이지내 드롭다운 관련  */
const DROPDOWN = ref({
    DELIVERY_INFO: true,
    GOODS_INFO: true,
    POINT_INFO: true,
    PAYMENT_INFO: true,
    PAYMENT_METHOD_INFO: true,
    GIVEAWAY_INFO: true,
});
const BASE_DROPDOWN_STYLE = {
    CLASS: 'S=on',
    STYLE: {
        height: 'auto'
    },
    TITLE: '펼처두기'
};        
const EMPTY_DROPDOWN_STYLE = {
    CLASS: '',
    STYLE: {},
    TITLE: '펼처두기'
};      

const DROPDOWN_STYLE = ref({
    DELIVERY_INFO: computed(() => {
        return DROPDOWN.value.DELIVERY_INFO ? BASE_DROPDOWN_STYLE : EMPTY_DROPDOWN_STYLE;
    }),
    GOODS_INFO: computed(() => {
        return DROPDOWN.value.GOODS_INFO ? BASE_DROPDOWN_STYLE : EMPTY_DROPDOWN_STYLE;
    }),
    GIVEAWAY_INFO: computed(() => {
        return DROPDOWN.value.GIVEAWAY_INFO ? BASE_DROPDOWN_STYLE : EMPTY_DROPDOWN_STYLE;
    }),
    POINT_INFO: computed(() => {
        return DROPDOWN.value.POINT_INFO ? BASE_DROPDOWN_STYLE : EMPTY_DROPDOWN_STYLE;
    }),
    PAYMENT_INFO: computed(() => {
        return DROPDOWN.value.PAYMENT_INFO ? BASE_DROPDOWN_STYLE : EMPTY_DROPDOWN_STYLE;
    }),
    PAYMENT_METHOD_INFO: computed(() => {
        return DROPDOWN.value.PAYMENT_METHOD_INFO ? BASE_DROPDOWN_STYLE : EMPTY_DROPDOWN_STYLE;
    })
});
/** //[END] 페이지내 드롭다운 관련*/

/** [START] 적립금 관련 */
const pointRule = ref<PointRules>(globalConfigs.value.point.rules);
const tempUsingPoint = ref(0);
/** 최대 사용가능한 적립금 금액 */
const maxPointUsableAmount = computed(() => {
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
        maxUsableAmount = (priceSummary.value.forPaymentPrice - priceSummary.value.shippingPrice) > pointRule.value.maxUsableAmount 
            ? pointRule.value.maxUsableAmount
            : priceSummary.value.forPaymentPrice - priceSummary.value.shippingPrice;			
    } else if (pointRule.value.maxUsableAmountType.toUpperCase() === 'RATE') {
        maxUsableAmount = Math.round((priceSummary.value.forPaymentPrice - priceSummary.value.shippingPrice)  * (pointRule.value.maxUsableAmount / 100));
    }

    return ordererInfo.value.pointBalance > maxUsableAmount ? maxUsableAmount : ordererInfo.value.pointBalance;
});
/** 적립금 사용 토글 함수  */
function togglePointUsing(event: Event) {
    if ((event.target as HTMLInputElement).checked === false) {
        return;
    }

    if (
        ordererInfo.value !== undefined
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
/** 적립금 금액 검증 */
function validatePoint() {   			
    tempUsingPoint.value = Number(tempUsingPoint.value);
    if (tempUsingPoint.value < 100) {             
        return mmon.bom.alert('적립금은 100원 이상 사용 가능합니다.', () => {
            paymentForm.value.usingPoint = 0;
            tempUsingPoint.value = 0;
        });
    }

    if (ordererInfo.value !== undefined
        && (ordererInfo.value.pointBalance < 1 || ordererInfo.value.pointBalance < pointRule.value.minUsableBalance)
        && pointRule.value.minUsableBalance > 0
    ) {
        return mmon.bom.alert(`최소 ${pointRule.value.minUsableBalance}원이상 보유하여야 적립금 사용이 가능합니다`, () => {
            tempUsingPoint.value = 0;
            paymentForm.value.usingPoint = 0;
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
/** //[END] 적립금 관련 */

/** [START] 주문서 관련 기본 DATA */
/** 주문서 ITEM 정보  */
const orderPacks = ref<Pack[]>([]);  
/** 주문자 정보  */
const ordererInfo = ref<OrdererInfo>();
/** 배송지 리스트  */
const receiveAddresses = ref<ShippingAddress[]>([]);
/** 환불계좌 */
const refundAccount = ref<RefundAccount>();
/** 해외배송 포함 여부 */
const isOverseasShippingContains = ref(false);

/** //[END] 주문서 관련 기본 DATA */
/** 배송지 정보 조회 */
async function fetchAddress() {
    receiveAddresses.value = await shippingRepository.getReceiveAddresses();
    if (receiveAddresses.value.length > 0 ) {
        selectedShippingAddress.value = receiveAddresses.value.find((address) => {
            return address.isRecent;
        }) || receiveAddresses.value[0] 
        selectedShippingAddress.value.isExtraArea = await shippingRepository.isExtraAreaCheck(selectedShippingAddress.value.zipCode, selectedShippingAddress.value.baseAddress);
    }
}
/** 배송지 변경시 도서산간 여부 체크  */
async function changeReceiveAddress(receiveAddress: ShippingAddress) {
    selectedShippingAddress.value = receiveAddress
    selectedShippingAddress.value.isExtraArea = await shippingRepository.isExtraAreaCheck(receiveAddress.zipCode, receiveAddress.baseAddress);
}
/** 배송지 삭제 */
function removeReceiveAddress(id: number) {
    mmon.bom.confirm('배송지를 삭제하시겠습니까? ', async (flag: boolean) => {
        if (flag) {
            mmon.loading.show();
            try {
                if (selectedShippingAddress.value !== null && selectedShippingAddress.value.id === id) {
                    selectedShippingAddress.value = null;
                }
                await shippingRepository.removeAddress(id);
                await fetchAddress();
            } catch(error) {
                defaultCatch(error)
            } finally {
                mmon.loading.hide();
            }
        }
    })
}

/** [START] 지불정보  */
/** 지불수단  */
const payType = ref<'myPayCard'|'myPayBank'|'myPayOthers'>(); // 결제 타입
/** 결제가능한 수단  */
const payMethods = ref<PayMethod[]>([]);
/** 자체 페이 수단  */
const myPayMethods = ref<MyPayMethod[]>([]);
/** 선택된 결제 수단 라벨  */
const selectedPayMethodLabel = computed(() => {
    if (useMyPay.value) {
        const myPayMethod = myPayMethods.value.find((method) => {
            return method.code === paymentForm.value.payMethod
        });

        if (myPayMethod !== undefined) {
            return myPayMethod.label
        }
    }

    return payMethods.value.find((method) => {
        return method.code === paymentForm.value.payMethod
    })?.label || '신용/체크카드';			
});
/** 실결제 금액 === 포인트 사용금액  */
const isPointSameForPaymentPrice = computed(() => {
    return priceSummary.value.forPaymentPrice === paymentForm.value.usingPoint;
});
/** //[END]지불정보  */

/** 주문서 내에서 사용되는 FORM */
const ordererForm = ref<{
    email: string,
    personalClearanceCode: string,
    shippingMessage: string,
    isRememberPersonalClearanceCode: boolean,			
}>({
    email: '',
    personalClearanceCode: '',
    shippingMessage: '',
    isRememberPersonalClearanceCode: false,
});
const paymentForm = ref<PaymentForm>(
    {
        isDirectPay: true,
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
const isDirectPayForCreditCard = ref(true);
const isMyPayAccountSliderReady = ref(false);
const isAppliedMaxDiscount = ref(true);
const orderPacksAppliedCouponWithImmediatelySale = ref<AppliedSalePacks[]>([]);
const latestPaymentLoaded = ref(false);
const priceSummary = computed(() => {
    const total = orderPacksAppliedCouponWithImmediatelySale.value.map((appliedSale) => {
        return {
            goodsPrice: appliedSale.items.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.goodsSellPrice;
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
        return acc + cur.chargedShippingPrice +  (selectedShippingAddress.value?.isExtraArea ? cur.extraShippingPrice : 0);
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
/** //주문서 내에서 사용되는 FORM */
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

/** 최대할인 적용 버튼 이벤트  */
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
    
/** 환불계좌 정보 패치 */
async function fetchRefundAccount() {
    refundAccount.value = await refundAccountRepository.get();
    // 환불계좌 수정 기능
    const { setModalRefundAccount } = useRefundAccountEdit();
    if (refundAccount.value !== undefined) {                
        setModalRefundAccount(refundAccount.value);
    } else {
        setModalRefundAccount(undefined);
    }
}

const isAgreeOfCollectPersonalClearanceCode = ref(false);
const isAgreeOfProvidePersonalClearanceCode = ref(false);	
const shippingMessages = [
    '부재 시 경비실에 맡겨주세요',
    '빠른 배송 부탁드립니다',
    '부재 시 핸드폰으로 연락 바랍니다',
    '배송 전 연락 바랍니다'
];    		
        
const { setGiveawayId } = useGiveawayTargetModal();
const itemSets = computed(() => orderPacks.value.flatMap(pack => pack.groupOrders));
const orderItems = computed(() => itemSets.value.flatMap(set => set.items));
        
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
/**	최대할인 적용 함수 */
const maxAppliedCouponPrice = ref<number>(0);
function appliedMaxDiscountedPrice() {
    orderPacks.value.forEach(function(pack) {            
        pack.groupOrders.forEach(function (groupOrder) {
            groupOrder.items.forEach((item) => {
                item.registCouponId = (maximumDiscountAppliedCouponRegist.value[item.uuid]?.registId || 0)
            });                    
        })
    });   
    maxAppliedCouponPrice.value = priceSummary.value.appliedCouponAmount;
}

const cashReceiptApplyKey = computed(() => {
    if (paymentForm.value.cashReceiptApplyType == 3) {
        return '';
    }
    return paymentForm.value.cashReceiptApplyType == 1 ? paymentForm.value.cashReceiptApplyPhone  : paymentForm.value.cashReceiptApplyBusinessNumber;
})

/** 결제 프로세스 시작 **/
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
                goods_applied_all_discounted_price: packGoods.goodsBaseDiscountedPrice  - packGoods.nightSaleAmount - packGoods.appliedCouponAmount - packGoods.immediatelySaleAmount
            }
        });
                
        return {
            charged_shipping_price: pack.chargedShippingPrice,
            extra_shipping_price: selectedShippingAddress.value?.isExtraArea ? pack.extraShippingPrice : 0,
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
        receive_address: selectedShippingAddress.value === null ? null :{
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
            using_point: paymentForm.value.usingPoint,
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
        'receive_address.id.required': ':param(을/를) 설정해주세요.',
        'orderer_info.personal_clearance_code.requiredIf': ':param(을/를) 입력해주세요.',
        'orderer_info.personal_clearance_code.validCode': ':param(을/를) 확인해주세요.',
        'isAgreeOfCollectPersonalClearanceCode.isAgree':':param(을/를) 동의해주세요.',
        'isAgreeOfProvidePersonalClearanceCode.isAgree':':param(을/를) 동의해주세요.',
        'receive_address.id': ':param(을/를) 설정해주세요.',
        'orderer_info.personalClearanceCode.requiredIf': ':param(을/를) 입력해주세요.',
        'my_pay_virtual_id.requiredIf' : `간편결제 - ${isDirectPayForCreditCard.value ? '카드' : '계좌'}를 선택해주세요.`,
        'giveaways.*.giveaway_id.required' : ':param(을/를) 선택해주세요.',
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
    });
			
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
        mmon.loading.show();
        try {

            await handlePopupOpenWithUrlCallback(
                'order-action', 
                async() => {
                    const { payingUrl } = await orderRepository.preparePay(props.id, resultForm);    
                    return payingUrl;
                },
                '',
                false
            );
					
        } catch (e) {            
            defaultCatch(e);
        } finally {
            mmon.loading.hide();
            router.replace({
                name: 'OrderResult',
                params : { 
                    id: props.id
                },
                replace : true
            });		
					
        }
    } catch (e) {                
        console.log(e); 
        defaultCatch(e);
    }
}

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

function updateOrderPaymentForm(childOrderPaymentForm: PaymentForm) {
    const legacyPoint = paymentForm.value.usingPoint;
    paymentForm.value = { ...childOrderPaymentForm };
    paymentForm.value.usingPoint = legacyPoint;
}


/** 간편결제 관련  */
const myRegistCardPays = ref<MyPaymentCard[]>([])
const myRegistBankPays = ref<MyPaymentBank[]>([])
const myPaymentCreditCardInstallMentShow = ref(true);

async function managementMyPay(isCard: boolean) {
    const { isPopupClose } = await handlePopupOpenWithUrlCallback(
        'order-action',
        async () => {
            const { linkType, linkUrl } = await orderRepository.prepareManageMent(isCard)
            return linkUrl
        },
        '',
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
            '',
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
    try { 
        if (isForCard) {
            myRegistCardPays.value = await orderRepository.getMyPayCard()
            if (myRegistCardPays.value.length < 1) {
                myPaymentCreditCardInstallMentShow.value = false;
            }
        } else {
            myRegistBankPays.value = await orderRepository.getMyPayBank()
        }
    } catch(e) {
        console.log(e);
    }
}

const myPayMethod = computed(() => {            
    return myPayMethods.value.find((myPay) => {
        return myPay.engLabel === (isDirectPayForCreditCard.value ? 'my_pay_credit_card' : 'my_pay_account_transfer')
    });
})

/** 간편 결제 타입 핸들링 */
function handleMyPayType(isForCard: boolean) {
    isDirectPayForCreditCard.value = isForCard;
    if (isForCard === false) {
        isMyPayAccountSliderReady.value = true;
    }

    if (myPayMethod.value === undefined) {
        return;
    }

    paymentForm.value.payMethod = myPayMethod.value.code;
    paymentForm.value.payMethodEngLabel = myPayMethod.value.engLabel;
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
/** VUE LIFE CYCLE */
onMounted(async() => {
    try {
        const [{ orderInfo, packs, needPersonalClearanceCode, giveawayGroups: giveawayGroup }] = await Promise.all(
            [
                orderRepository.orderBasicData(props.id),
                fetchAddress()
            ]
        );

        orderPacks.value = packs;
        ordererInfo.value = orderInfo;
        giveawayGroups.value = giveawayGroup;
        isOverseasShippingContains.value = needPersonalClearanceCode;

        const { setAppliedSale, setOrderPack } = useOrderCoupon()			
			
        window.addEventListener('hashchange', async(event) => {
            const before = event.oldURL.split('#')[1] ?? '';
            const after = event.newURL.split('#')[1] ?? '';
            const { setAppliedSale, setOrderPack, setUsedCoupon, appliedCouponRegist } = useOrderCoupon();
                
            if (after === 'ORDER_COUPON_APPLY') {                    
                setAppliedSale(orderPacksAppliedCouponWithImmediatelySale.value);
                setOrderPack(orderPacks.value);
                setUsedCoupon(maximumDiscountAppliedCouponRegist.value);
            } 

            if (before === 'ORDER_COUPON_APPLY') {          
                if (maxAppliedCouponPrice.value > 0 ) {
                    isAppliedMaxDiscount.value = maxAppliedCouponPrice.value === priceSummary.value.appliedCouponAmount; 
                }          
            }

            if (before === 'ADDRESS_CREATE' && after === '') {
                await fetchAddress();
            }

            if (before === 'REFUND_ACCOUNT') {
                await fetchRefundAccount();
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
                        
                        return useCalculateDiscountAmount(beforeCouponPrice, appliedCoupon.coupon);
                    }

                    return 0;                                                        
                });
                return {
                    brandId: item.brandId,
                    goodsId: item.goodsId,   
                    optionId: item.optionId,
                    optionExtraAmount: item.optionExtraAmount,
                    nightSaleId: item.nightSaleId,
                    goodsListPrice: item.goodsListPrice,
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
                    })
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
										- (currentValue.nightSaleAmount + currentValue.appliedCouponAmount.value + currentValue.immediatelySaleAmount.value)
									);
                            }, 0);
                        }),
                    }
                })
            }
        });

        setAppliedSale(orderPacksAppliedCouponWithImmediatelySale.value);
        setOrderPack(orderPacks.value);

        giveawayForm.value = giveawayGroups.value.map((giveAwayGroup) => {
            return {
                goodsId: giveAwayGroup.goodsId,
                giveawayId: null
            }
        });

        const [availablePayMethods] = await Promise.all([
            orderRepository.getUserPayMethods(), 
            getInterests(),
            fetchRefundAccount()]
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

        if (ordererInfo.value) {
            ordererForm.value = {   
                personalClearanceCode: ordererInfo.value.personalClearanceCode,
                email: ordererInfo.value.email,
                shippingMessage : ordererInfo.value.latestShippingMessage === null ? '' : ordererInfo.value.latestShippingMessage,
                isRememberPersonalClearanceCode: (ordererInfo.value.personalClearanceCode !== null && ordererInfo.value.personalClearanceCode !== ''),
            }

            const latestPaymentMethod = ordererInfo.value.latestPaymentMethodCode === null ? payMethods.value[0].code : ordererInfo.value.latestPaymentMethodCode;                

            paymentForm.value = {
                isDirectPay: myPayMethods.value.length > 0 && myPayMethods.value.find((method) => {
                    return method.code === latestPaymentMethod
                }) !== undefined,
                payMethod : latestPaymentMethod === 80 ? payMethods.value[0].code : latestPaymentMethod,
                depositorName : ordererInfo.value.latestPaymentDepositorName,
                payMethodEngLabel: '',                     
                cardCode: ordererInfo.value.latestPaymentCardCode,
                installMentMonth: 0,                    
                bankCode:  ordererInfo.value.latestPaymentBankCode,
                cashReceiptApplyPhone: ordererInfo.value.latestCashReceiptApplyType === 1 
                    ? ordererInfo.value.latestCashReceiptApplyKey 
                    : '', 
                cashReceiptApplyBusinessNumber: ordererInfo.value.latestCashReceiptApplyType === 2 
                    ? ordererInfo.value.latestCashReceiptApplyKey 
                    : '',
                cashReceiptApplyType: ordererInfo.value.latestCashReceiptApplyType === null ? 3 : ordererInfo.value.latestCashReceiptApplyType,
                usingPoint: 0,
                myPayVirtualId: null
            }
                
                
            if (!pluck(myPayMethods.value, 'code').includes(paymentForm.value.payMethod)) {
                payType.value = 'myPayOthers'
            }

            editAblePersonalClearanceCode.value = ordererInfo.value.personalClearanceCode === null || ordererInfo.value.personalClearanceCode === '';
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

            if (isDirectPayForCreditCard.value === false) {
                isMyPayAccountSliderReady.value = true;
            }

            if (isDirectPayForCreditCard.value) {
                paymentForm.value.myPayVirtualId = myRegistCardPays.value.length < 1 ? null : myRegistCardPays.value[0].virtualId;
            }

            paymentForm.value.myPayVirtualId = myRegistBankPays.value.length < 1 ? null : myRegistBankPays.value[0].virtualId;
        }
        latestPaymentLoaded.value = true;            
        appliedMaxDiscountedPrice();
    } catch(error) {
        const errorMessage = error.response?.data?.message || '주문세션이 만료 되었습니다.';
        mmon.bom.alert(errorMessage, () => {
            router.go(-1);
        });

    }
})
</script>