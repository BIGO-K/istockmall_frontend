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
                            <!-- 주문자 정보 -->
                            <div :class="['mm_dropdown T=order', DROPDOWN_STYLE.ORDERER_INFO.CLASS ]" data-dropdown>
                                <button 
                                    type="button" 
                                    class="btn_dropdown"
                                    :title="DROPDOWN_STYLE.ORDERER_INFO.TITLE"                                        
                                    @click="() => { DROPDOWN.ORDERER_INFO = !DROPDOWN.ORDERER_INFO }"
                                >
                                    <b>주문자 정보</b>
                                    <b class="text_contraction">{{ ordererForm.name }}</b>
                                    <i class="ico_dropdown" />
                                </button>
                                <div class="mm_dropdown-item" :style="DROPDOWN_STYLE.ORDERER_INFO.SYTLE">
                                    <div class="mm_dropdown-item-inner">
                                        <div class="mm_inner">
                                            <h6 class="mm_text-label">
                                                <b>주문자명</b>
                                            </h6>
                                            <MMInput
                                                v-model="ordererForm.name"             
                                                maxlength="10"
                                                :place-holder-text="'주문자 이름을 입력하세요(필수입력)'"
                                            />  
                                            <h6 class="mm_text-label">
                                                <b>휴대폰 번호</b>
                                            </h6>
                                            <MMInput
                                                v-model="ordererForm.phone"             
                                                maxlength="12"
                                                :data-type="'number'"
                                                :place-holder-text="'휴대폰 번호를 입력하세요(필수/숫자만 입력)'"
                                            />
                                            <h6 class="mm_text-label">
                                                <b>이메일 주소</b>
                                            </h6>
                                            <MMInput
                                                v-model="ordererForm.email"             
                                                maxlength="50"
                                                :place-holder-text="'이메일 주소를 입력하세요(필수입력)'"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--// 주문자 정보 -->
                            <hr class="mm_line">
                            <!-- 배송지 정보 -->
                            <div :class="['mm_dropdown T=order m_popup-order-receive', DROPDOWN_STYLE.DELIVERY_INFO.CLASS]" data-dropdown>
                                <button  
                                    type="button" 
                                    class="btn_dropdown"
                                    :title="DROPDOWN_STYLE.DELIVERY_INFO.TITLE"                                        
                                    @click="() => { DROPDOWN.DELIVERY_INFO = !DROPDOWN.DELIVERY_INFO }"
                                >
                                    <b>배송지 정보</b>
                                    <b class="text_contraction">{{ receiverForm.name }}</b>
                                    <i class="ico_dropdown" />
                                </button>
                                <div class="mm_dropdown-item" :style="DROPDOWN_STYLE.DELIVERY_INFO.SYTLE">
                                    <div class="mm_dropdown-item-inner">
                                        <label class="mm_form-check">
                                            <input type="checkbox" data-check @change="copyOrderInfo">
                                            <b class="mm_block">
                                                <i class="ico_form-check" />
                                                <span class="text_label">주문자 정보와 동일</span>
                                            </b>
                                        </label>
                                        <div class="mm_inner">
                                            <h6 class="mm_text-label">
                                                <b>받는 사람</b>
                                            </h6>
                                            <MMInput
                                                v-model="receiverForm.name"             
                                                maxlength="10"
                                                :place-holder-text="'받는 사람을 입력하세요(필수입력)'"
                                            />    
                                            <h6 class="mm_text-label">
                                                <b>휴대폰 번호</b>
                                            </h6>
                                            <MMInput
                                                v-model="receiverForm.phone"             
                                                :data-type="'number'"
                                                maxlength="12"
                                                :place-holder-text="'휴대폰 번호를 입력하세요(필수, 숫자만 입력)'"
                                            />
                                            <div class="mm_form_mix-address">
                                                <h6 class="mm_strapline">
                                                    <b>주소</b>
                                                </h6>
                                                <div class="mm_form_mix-linked">
                                                    <div class="mm_form-text">
                                                        <button type="button" class="btn_text-clear">
                                                            <i class="ico_form-clear" /><b class="mm_ir-blind">지우기</b>
                                                        </button>
                                                        <label>
                                                            <input v-model="receiverForm.zipCode" type="text" class="textfield" data-text readonly><i class="bg_text" />
                                                            <span class="text_placeholder mm_ir-blind">우편번호</span>
                                                        </label>
                                                    </div>
                                                    <a href="#ADDRESS_FIND" class="mm_btn T=dark"><b>우편번호 찾기</b></a>
                                                </div>
                                                <div class="mm_form-text">
                                                    <button type="button" class="btn_text-clear">
                                                        <i class="ico_form-clear" /><b class="mm_ir-blind">지우기</b>
                                                    </button>
                                                    <label>
                                                        <input v-model="receiverForm.baseAddress" type="text" class="textfield" data-text readonly><i class="bg_text" />
                                                        <span class="text_placeholder mm_ir-blind">검색주소</span>
                                                    </label>
                                                </div>
                                                <MMInput
                                                    v-model="receiverForm.detailAddress"             
                                                    :use-trim="false"
                                                    :place-holder-text="'상세 주소를 입력하세요(필수입력)'"
                                                />
                                            </div>
                                            <h6 class="mm_strapline">
                                                <b>배송메모</b>
                                            </h6>
                                            <MMSelect v-model="receiverForm.message">
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
                                            <div :class="['mm_syncer-delivery-note', { 'S=option-use' : receiverForm.message === '직접입력' }]">
                                                <MMInput 
                                                    v-model="shippingDirectMessage"
                                                    :use-trim="false"
                                                    :placeholder="'배송 메모를 입력하세요(20자 이내)'"
                                                    maxlength="20"
                                                />    
                                            </div>
                                            <!-- 해외배송 개인통관고유부호 -->
                                            <section v-if="isContainsOverSeaGoods" class="m_popup-order-unipass">
                                                <h6 class="mm_text-label">
                                                    <b>해외배송 개인통관고유부호</b>
                                                </h6>
                                                <MMInput 
                                                    v-model="ordererForm.personalClearanceCode"
                                                    :placeholder="'P로 시작하는 정보를 입력하세요'"
                                                    maxlength="13"
                                                />      
                                                <div class="mm_note">
                                                    <ul>
                                                        <li>상품을 받는 분의 명의로 통관이 진행되므로 <strong class="mm_text-secondary">수취인</strong>의 개인통관고유부호를 입력해주세요.</li>
                                                        <li>해외배송 상품은 관세청 통관을 위해 수취인의 고유식별정보를 판매자에게 제공합니다.</li>
                                                        <li>개인통관고유부호는 통관 시 주민등록번호 대신 사용 가능한 번호로, 관세청 사이트에서 발급 받으실 수 있습니다.</li>
                                                    </ul>
                                                </div>
                                                <a class="btn_unipass" href="https://unipass.customs.go.kr/csp/persIndexRectOnslCrtf.do?qryIssTp=1" target="_blank"><b>개인통관고유부호 발급/확인 바로가기</b><i class="ico_link T=sm" /></a>
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
                                            <!--// 해외배송 개인통관고유부호 -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--// 배송지 정보 -->
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
                                        <span class="text_price"><strong>{{ MMFilters.formatNumber(priceSummary.goodsPrice) }}</strong></span></b>
                                    <i class="ico_dropdown" />
                                </button>
                                <div class="mm_dropdown-item" :style="DROPDOWN_STYLE.GOODS_INFO.SYTLE">
                                    <div class="mm_dropdown-item-inner">
                                        <div class="mm_order-item">
                                            <div 
                                                v-for="pack in orderPacks"
                                                :key="pack.shippingRuleId"
                                                class="mm_order-item-seller"
                                            >
                                                <div class="mm_order...seller-head">
                                                    <p class="text_ship">
                                                        <i class="ico_ship" />
                                                        <span v-if="(!receiverForm.isExtraArea || pack.extraShippingPrice === 0) && pack.chargedShippingPrice === 0">무료배송</span>
                                                        <span v-else class="text_price"><strong>{{ MMFilters.formatNumber(receiverForm.isExtraArea ? (pack.chargedShippingPrice + pack.extraShippingPrice) : pack.chargedShippingPrice) }}</strong></span>
                                                    </p>
                                                </div>
                                                <div class="mm_product-list T=sm">
                                                    <ul>
                                                        <li v-for="item in pack.groupOrders" :key="item.goodsId">
                                                            <p class="text_seller">
                                                                <i class="ico_shop" />{{ item.sellerName }}
                                                            </p>
                                                            <div class="mm_product-item">
                                                                <a>
                                                                    <figure>
                                                                        <i v-lazyload="{ src: item.goodsThumbnailUrl }" class="mm_bg-cover image_product" />
                                                                        <figcaption>
                                                                            <p class="text_brand">{{ item.brandName }}</p>
                                                                            <p class="text_product">{{ item.goodsName }}</p>
                                                                            <p class="text_price"><strong>{{ MMFilters.formatNumber(item.packGoodsSellPrice) }}</strong></p>
                                                                            <p class="text_option">{{ item.optionName.replace('/', '') }}/{{ item.items.length }}개</p>
                                                                        </figcaption>
                                                                    </figure>
                                                                </a>
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
                            <!-- 최종 결제금액 -->
                            <div :class="['mm_dropdown T=order', DROPDOWN_STYLE.PAYMENT_INFO.CLASS]" data-dropdown>
                                <button 
                                    type="button" 
                                    class="btn_dropdown"
                                    :title="DROPDOWN_STYLE.PAYMENT_INFO.TITLE"                                        
                                    @click="() => { DROPDOWN.PAYMENT_INFO = !DROPDOWN.PAYMENT_INFO }"
                                >
                                    <b>최종 결제금액</b>
                                    <b class="text_contraction"><span class="mm_text-variable text_price"><strong>{{ MMFilters.formatNumber(priceSummary.goodsPrice + priceSummary.shippingPrice) }}</strong></span></b>
                                    <i class="ico_dropdown" />
                                </button>
                                <div class="mm_dropdown-item" :style="DROPDOWN_STYLE.PAYMENT_INFO.SYTLE">
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
                                                                    <strong>{{ MMFilters.formatNumber(priceSummary.goodsPrice) }}</strong>
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
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th scope="row">
                                                                <b>최종 결제금액</b>
                                                            </th>
                                                            <td>
                                                                <p class="text_price mm_text-variable">
                                                                    <strong>{{ MMFilters.formatNumber(priceSummary.goodsPrice + priceSummary.shippingPrice) }}</strong>
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
                            <div :class="['mm_dropdown T=order m_popup-order-payment', DROPDOWN_STYLE.PAYMENT_METHOD_INFO.CLASS]" data-dropdown>
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
                                <div class="mm_dropdown-item" :style="DROPDOWN_STYLE.PAYMENT_METHOD_INFO.SYTLE">
                                    <div class="mm_dropdown-item-inner">
                                        <!-- 결제수단 목록 -->
                                        <div class="m...payment-method">
                                            <ul>
                                                <li v-for="payMethod in payMethods" :key="payMethod.code">
                                                    <label
                                                        :class="[
                                                            'mm_form-radio',
                                                            payMethod.engLabel === paymentForm.payMethodEngLabel ? payMethodClass : ''
                                                        ]"
                                                    >
                                                        <input
                                                            v-model="paymentForm.payMethod" 
                                                            type="radio"
                                                            :value="payMethod.code"
                                                            :checked="paymentForm.payMethodEngLabel === payMethod.engLabel"
                                                            data-radio="{ 'syncer': '.mm_syncer-method-card' }"
                                                            @change="() => { paymentForm.payMethodEngLabel = payMethod.engLabel }"
                                                        >
                                                        <b class="mm_block">
                                                            <i :class="`ico_${payMethod.engLabel.replace('_', '-')}`" />
                                                            <span class="text_label">{{ payMethod.label }}</span>
                                                        </b>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                        <!--// 결제수단 목록 -->

                                        <!-- 신용/체크카드 -->
                                        <div :class="['mm_syncer-method-card', { 'S=radio-use' : paymentForm.payMethodEngLabel === 'credit_card' }]">
                                            <MMSelect v-model="paymentForm.cardCode">
                                                <option value="0">
                                                    카드를 선택하세요
                                                </option>
                                                <option v-for="creditCard in creditCards" :key="creditCard.code" :value="creditCard.code">
                                                    {{ creditCard.label }}
                                                </option>
                                            </MMSelect>            
                                            <MMSelect v-model="paymentForm.installMentMonth">
                                                <option
                                                    v-for="installMent, installmentIndex in installMents"
                                                    :key="installmentIndex"
                                                    :disabled="installMent.disabled"
                                                    :value="installMent.value"
                                                >
                                                    {{ installMent.label }}
                                                </option>                                              
                                            </MMSelect>                                
                                            <a class="btn_card-info" href="#CARD_BENEFIT"><b>무이자할부 안내</b><i class="ico_link" /></a>
                                        </div>
                                        <!--// 신용/체크카드 -->

                                        <!-- 무통장 입금 -->
                                        <div :class="['mm_syncer-method-deposit', { 'S=radio-use' : paymentForm.payMethodEngLabel === 'virtual_account' }]">
                                            <div class="mm_inner">
                                                <MMSelect v-model="paymentForm.bankCode">
                                                    <option>은행을 선택하세요</option>
                                                    <option v-for="bank in banks" :key="bank.code" :value="bank.code">
                                                        {{ bank.label }}
                                                    </option>
                                                </MMSelect>
                                                <MMInput                                                     
                                                    v-model="paymentForm.depositorName"
                                                    :placeholder="'입금자명을 입력하세요'"
                                                />
                                                <p>입금기한: <strong class="mm_text-secondary">{{ bankDepositExpireDate }}까지</strong></p>
                                            </div>
                                            <section class="m...payment-receipt">
                                                <h6 class="mm_strapline">
                                                    <b>현금영수증 발급신청</b>
                                                </h6>
                                                <ul class="mm_flex T=equal">
                                                    <li>
                                                        <label class="mm_form-radio">
                                                            <input v-model="paymentForm.cashReceiptApplyType" type="radio" value="1" name="cach_receipt" data-radio="{ 'syncer': '.mm_syncer-receipt-income'}" checked>
                                                            <b class="mm_block">
                                                                <span class="text_label">소득공제용</span>
                                                            </b>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label class="mm_form-radio">
                                                            <input v-model="paymentForm.cashReceiptApplyType" type="radio" value="2" name="cach_receipt" data-radio="{ 'syncer': '.mm_syncer-receipt-expense'}">
                                                            <b class="mm_block">
                                                                <span class="text_label">지출증빙용</span>
                                                            </b>
                                                        </label>
                                                    </li>
                                                    <li>
                                                        <label class="mm_form-radio">
                                                            <input v-model="paymentForm.cashReceiptApplyType" type="radio" value="3" name="cach_receipt" data-radio>
                                                            <b class="mm_block">
                                                                <span class="text_label">신청안함</span>
                                                            </b>
                                                        </label>
                                                    </li>
                                                </ul>
                                                <div :class="['mm_syncer-receipt-income', { 'S=radio-use' : paymentForm.cashReceiptApplyType == 1 }]">
                                                    <MMInput
                                                        v-model="paymentForm.cashReceiptApplyPhone"
                                                        :data-type="'number'"
                                                        maxlength="11"
                                                        :placeholder="'휴대폰 번호(숫자만 입력하세요)'"
                                                    />
                                                </div>
                                                <div :class="['mm_syncer-receipt-expense', { 'S=radio-use' : paymentForm.cashReceiptApplyType == 2 }]">
                                                    <MMInput
                                                        v-model="paymentForm.cashReceiptApplyBusinessNumber"
                                                        maxlength="10"
                                                        :placeholder="'사업자 등록번호(숫자만 입력하세요)'"
                                                    />
                                                </div>
                                            </section>
                                            <section>
                                                <h6 class="mm_strapline">
                                                    <b>환불 계좌 입력</b>
                                                </h6>
                                                <MMInput 
                                                    v-model="refundAccount.ownerName"
                                                    :place-holder-text="'예금주명을 입력하세요'"
                                                    maxlength="10"
                                                    type="text"
                                                />
                                                <MMSelect v-model="refundAccount.bankCode">
                                                    <option value="">
                                                        은행을 선택하세요
                                                    </option>
                                                    <option
                                                        v-for="bank in banks"
                                                        :key="bank.code" 
                                                        :value="bank.code"
                                                    >
                                                        {{ bank.label }}
                                                    </option>
                                                </MMSelect>
                                                <MMInput 
                                                    v-model="refundAccount.accountNumber"
                                                    :place-holder-text="'계좌를 입력하세요'"
                                                    maxlength="50"
                                                    :data-type="'number'"
                                                />
                                            </section>
                                        </div>
                                        <!--// 무통장 입금 -->

                                        <!-- 에스크로 -->
                                        <div :class="['mm_syncer-method-escrow', { 'S=radio-use' : paymentForm.payMethodEngLabel === 'escrow' }]">
                                            <div class="mm_note">
                                                <ul>
                                                    <li>에스크로 결제 건은 부분 취소가 불가능하고, 전체 취소만 가능합니다.</li>
                                                </ul>
                                            </div>
                                            <hr class="mm_line">
                                            <section>
                                                <h6 class="mm_strapline">
                                                    <b>환불 계좌 입력</b>
                                                </h6>
                                                <MMInput 
                                                    v-model="refundAccount.ownerName"
                                                    :place-holder-text="'예금주명을 입력하세요'"
                                                    maxlength="10"
                                                    type="text"
                                                />
                                                <MMSelect v-model="refundAccount.bankCode">
                                                    <option value="">
                                                        은행을 선택하세요
                                                    </option>
                                                    <option
                                                        v-for="bank in banks"
                                                        :key="bank.code" 
                                                        :value="bank.code"
                                                    >
                                                        {{ bank.label }}
                                                    </option>
                                                </MMSelect>
                                                <MMInput 
                                                    v-model="refundAccount.accountNumber"
                                                    :place-holder-text="'계좌를 입력하세요'"
                                                    maxlength="50"
                                                    :data-type="'number'"
                                                />
                                            </section>
                                        </div>
                                        <!--// 에스크로 -->
                                        <!-- 네이버 페이 -->
                                        <div :class="['mm_syncer-method-naverpay', { 'S=radio-use' : paymentForm.payMethodEngLabel === 'naverpay' }]">
                                            <div class="mm_note">
                                                <ul>
                                                    <li>네이버페이는 네이버ID로 신용카드 또는 은행계좌 정보를 등록하여 결제할 수 있는 간편결제 서비스입니다.</li>
                                                    <li>주문 변경 시 카드사 혜택 및 할부 적용 여부는 해당 카드사 정책에 따라 변경될 수 있습니다.</li>
                                                    <li>지원 가능 결제수단: 네이버페이 결제창 내 노출되는 모든 카드/계좌</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <!-- 페이코 -->
                                        <div :class="['mm_syncer-method-payco', { 'S=radio-use' : paymentForm.payMethodEngLabel === 'payco' }]">
                                            <div class="mm_note">
                                                <ul>
                                                    <li>페이코는 온/오프라인 쇼핑은 물론 송금, 멤버십 적립까지 가능한 통합 서비스입니다.</li>
                                                    <li>휴대폰과 카드 명의자가 동일해야 결제 가능하며 결제금액 제한은 없습니다.(지원카드 : 모든 국내 신용/체크 카드)</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <!--// 페이코 -->
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
                    <b><strong>{{ MMFilters.formatNumber(priceSummary.goodsPrice + priceSummary.shippingPrice) }}</strong>원 결제하기</b>
                </button>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, defineAsyncComponent, onBeforeUnmount } from 'vue';
import MMPopup from '@/components/layout/Popup.vue';
import { useRoute, useRouter } from 'vue-router';
import { OrderPrePareForm, Pack, PayMethod, PaymentForm } from '$/@type/order/order';
import moment from 'moment';
import { RefundAccount } from '$/@type/member/refundAccount';
import { orderRepository } from '$/repository/order/orderRepository';
import { defaultCatch, handlePopupOpenWithUrlCallback } from '$/functions';
import { getTargetValue, makeValidator } from '$/validator';
import { useAddressFind } from '$/composables/shippingAddressComposable';
import { mmon } from '$/helper/mmon';
import { shippingRepository } from '$/repository/order/shippingRepository';
import { useInstallMent } from '$/composables/order/useInstallMent';

const MMSelect = defineAsyncComponent(() => import("@/components/input/Select.vue"));

/**
 * 드롭다운 관련 
*/
const DROPDOWN = ref({
    ORDERER_INFO: true,
    DELIVERY_INFO: true,
    GOODS_INFO: true,            
    PAYMENT_INFO: true,
    PAYMENT_METHOD_INFO: true
});

const BASE_DROPDOWN_STYLE = {
    CLASS: 'S=on',
    SYTLE: {
        height: 'auto'
    },
    TITLE: '펼처두기'
};        
const EMPTY_DROPDOWN_STYLE = {
    CLASS: '',
    SYTLE: {},
    TITLE: '펼처두기'
};      

const DROPDOWN_STYLE = ref({
    DELIVERY_INFO: computed(() => {
        return DROPDOWN.value.DELIVERY_INFO ? BASE_DROPDOWN_STYLE : EMPTY_DROPDOWN_STYLE;
    }),
    GOODS_INFO: computed(() => {
        return DROPDOWN.value.GOODS_INFO ? BASE_DROPDOWN_STYLE : EMPTY_DROPDOWN_STYLE;
    }),
    ORDERER_INFO: computed(() => {
        return DROPDOWN.value.ORDERER_INFO ? BASE_DROPDOWN_STYLE : EMPTY_DROPDOWN_STYLE;
    }),
    PAYMENT_INFO: computed(() => {
        return DROPDOWN.value.PAYMENT_INFO ? BASE_DROPDOWN_STYLE : EMPTY_DROPDOWN_STYLE;
    }),
    PAYMENT_METHOD_INFO: computed(() => {
        return DROPDOWN.value.PAYMENT_METHOD_INFO ? BASE_DROPDOWN_STYLE : EMPTY_DROPDOWN_STYLE;
    })
})

const payMethodClass = computed(() => {
    if (paymentForm.value.payMethodEngLabel === 'toss') {
        return 'T=payment-toss'
    }
    if (paymentForm.value.payMethodEngLabel === 'naverpay') {
        return 'T=payment-naverpay'
    }
    if (paymentForm.value.payMethodEngLabel === 'kakaopay') {
        return 'T=payment-kakaopay'
    }
    if (paymentForm.value.payMethodEngLabel === 'payco') {
        return 'T=payment-payco'
    }

    return ''
})

const route = useRoute();
const router = useRouter();
const orderId = route.params.id.toString();
const orderPacks = ref<Pack[]>([]);    
const isContainsOverSeaGoods = ref(false);
const payMethods = ref<PayMethod[]>([]);
const selectedPayMethodLabel = computed(() => {
    return payMethods.value.find((method) => {
        return method.code === paymentForm.value.payMethod
    })?.label || '신용/체크카드';			
});
const bankDepositExpireDate = moment().add(1, 'day').format('YYYY.MM.DD 23:59:59');
const isAgreeOfCollectPersonalClearanceCode = ref(false);
const isAgreeOfProvidePersonalClearanceCode = ref(false);	
const shippingMessages = [
    '부재 시 경비실에 맡겨주세요',
    '빠른 배송 부탁드립니다',
    '부재 시 핸드폰으로 연락 바랍니다',
    '배송 전 연락 바랍니다'
];    
const shippingDirectMessage = ref('');

const { 
    findZipCode, 
    findRoadAddress, 
    resetAddress 
} = useAddressFind();

/**
 * 주문자 정보FORM
 */
const ordererForm = ref<{
    name: string,
    phone: string,
    email: string,
    personalClearanceCode: string
}>({
    name: '',
    phone: '',
    email: '',
    personalClearanceCode: ''
});

/**
 * 배송지 정보 FORM
 */
const receiverForm = ref<{
    name: string,
    phone: string,
    zipCode: string,
    baseAddress: string,
    detailAddress: string,
    isExtraArea: boolean,
    message: string
}>({
    name: '',
    phone:'',
    zipCode: '',
    baseAddress: '',
    detailAddress: '',
    isExtraArea: false,
    message: ''
});

/**  지불정보 FORM */
const paymentForm = ref<PaymentForm>({
    isDirectPay: false,
    payMethod: 0,
    payMethodEngLabel: 'credit_card',
    cardCode: 0,
    installMentMonth: 0,
    bankCode: 0,                                
    cashReceiptApplyType: 3,
    cashReceiptApplyPhone: '',
    cashReceiptApplyBusinessNumber: '',
    depositorName: '',                
    usingPoint: 0,
    myPayVirtualId: null
});
/**
 * 환불 계좌 정보
 */
const refundAccount = ref<RefundAccount>({
    ownerName: '',
    bankCode: '',
    bankName: '',
    accountNumber: ''
});  

const creditCards = computed(() => {
    return payMethods.value.find((payMethod) => {
        return payMethod.engLabel === 'credit_card';
    })?.childMethods || []
});

const banks = computed(() => {
    return payMethods.value.find((payMethod) => {
        return payMethod.engLabel === 'virtual_account';
    })?.childMethods || []
});

const priceSummary = ref<{
    goodsPrice: number,
    shippingPrice: number
}>({
    goodsPrice: 0,
    shippingPrice: 0
});

async function totalPrice() {
    const goodsPrices = orderPacks.value.map((packs) => {            
        return {
            goodsPrice: packs.orderGoods.reduce((acc, cur)=> {
                return acc + cur.goodsSellPrice
            }, 0),
        }
    });

    return {
        goodsPrice: goodsPrices.reduce((acc, cur)=> {
            return acc + cur.goodsPrice
        }, 0),
        shippingPrice: computed(() => {
            return orderPacks.value.reduce((acc, cur) => {
                if (receiverForm.value.isExtraArea) {
                    return acc + cur.chargedShippingPrice + cur.extraShippingPrice
                } 
                return acc + cur.chargedShippingPrice                        
            }, 0)
        })
    }
}


/**
 * 배송지 변경시 도서산간 여부 체크
 */
async function changeReceiveAddress() {
    receiverForm.value.isExtraArea = await shippingRepository.isExtraAreaCheck(receiverForm.value.zipCode, receiverForm.value.baseAddress);            
}

/** 카드별 무이자 할부 정보  */
const isInterestDisabled = computed(() => {
    if (!paymentForm.value.cardCode) {
        return true
    }

    if (creditCards.value.find((child) => child.code == paymentForm.value.cardCode)?.label === '현대카드') {
        return (priceSummary.value.goodsPrice + priceSummary.value.shippingPrice) <= 10000
    }

    return (priceSummary.value.goodsPrice + priceSummary.value.shippingPrice) <= 50000
});
const { installMents, getInterests } = useInstallMent(isInterestDisabled, paymentForm);

const cashReceiptApplyKey = computed(() => {
    if (paymentForm.value.cashReceiptApplyType == 3) {
        return '';
    }
    return paymentForm.value.cashReceiptApplyType == 1 ? paymentForm.value.cashReceiptApplyPhone  : paymentForm.value.cashReceiptApplyBusinessNumber;
})

async function paymentStartProcess() {       
    const interestInfo = installMents.value.find((interest) => {
        return interest.value == paymentForm.value.installMentMonth
    });
                
    const resultForm: OrderPrePareForm = {
        orderer_info: { 
            email: ordererForm.value.email,                    
            personal_clearance_code: ordererForm.value.personalClearanceCode,
            is_remember_personal_clearance_code: false,
            name: ordererForm.value.name,
            phone: ordererForm.value.phone
        },
        receive_address: {
            id: null,
            name: receiverForm.value.name,
            shipping_name: '',
            phone: receiverForm.value.phone,
            zip_code: receiverForm.value.zipCode,
            base_address: receiverForm.value.baseAddress,
            detail_address: receiverForm.value.detailAddress,
            is_extra_area: receiverForm.value.isExtraArea,
            message: receiverForm.value.message.replace(/ /g,'') === '직접입력' ? shippingDirectMessage.value : receiverForm.value.message
        },
        payment_info: {
            method: paymentForm.value.payMethod,
            card_code: paymentForm.value.cardCode ? paymentForm.value.cardCode : undefined,
            interest_month: paymentForm.value.installMentMonth,
            is_interest_free: interestInfo?.isInterestFree || false,
            is_partial_interest: interestInfo?.isPartialInterestFree || false,
            bank_code: paymentForm.value.bankCode ? paymentForm.value.bankCode : undefined,
            depositor_name: paymentForm.value.depositorName,
            cash_receipt_apply_type: paymentForm.value.cashReceiptApplyType === 0 ? 3 : paymentForm.value.cashReceiptApplyType,
            cash_receipt_apply_key: cashReceiptApplyKey.value,
            using_point: paymentForm.value.usingPoint,
            for_payment_price: priceSummary.value.goodsPrice + priceSummary.value.shippingPrice
        },
        packs: orderPacks.value.map((pack) => {
            const items = pack.orderGoods.map((packGoods) => {
                return {
                    brand_id: packGoods.brandId,
                    goods_id: packGoods.goodsId,   
                    goods_base_discounted_price: packGoods.goodsSellPrice,
                    option_id: packGoods.optionId,
                    option_extra_amount: packGoods.optionExtraAmount,
                    night_sale_id: null,
                    night_sale_amount: 0,
                    regist_coupon_id: null,
                    regist_coupon_amount: 0,
                    immediately_sale_id: null,
                    immediately_sale_amount: 0,                        
                    goods_applied_all_discounted_price: packGoods.goodsSellPrice
                }
            });
                    
            return {
                charged_shipping_price: pack.chargedShippingPrice,
                extra_shipping_price: receiverForm.value.isExtraArea ? pack.extraShippingPrice : 0,
                shipping_rule_id: pack.shippingRuleId,
                items
            }   
        }),    
        giveaways: [],
        refund_account: (paymentForm.value.payMethodEngLabel == 'virtual_account'  || paymentForm.value.payMethodEngLabel == 'escrow') 
            ? {
                owner_name: refundAccount.value.ownerName,
                bank_code: refundAccount.value.bankCode,
                account_number: refundAccount.value.accountNumber
            }                     
            : null
    }

    const validator = makeValidator(
        Object.assign({
            isOverseasShippingContains: isContainsOverSeaGoods.value,
            paymentMethodEngLabel: paymentForm.value.payMethodEngLabel,
            isAgreeOfCollectPersonalClearanceCode: isAgreeOfCollectPersonalClearanceCode.value,
            isAgreeOfProvidePersonalClearanceCode: isAgreeOfProvidePersonalClearanceCode.value,
            cashReceiptPhone : paymentForm.value.cashReceiptApplyPhone,
            cashReceiptBusinessNumber : paymentForm.value.cashReceiptApplyBusinessNumber

        }, resultForm)
    );

    validator.setRules({
        'orderer_info.name(주문자명)': ['required'],
        'orderer_info.phone(주문자 휴대폰번호)': ['required','phoneNumber'],
        'orderer_info.email(이메일)': ['required', 'validEmail'],     
        'orderer_info.personal_clearance_code(개인통관 고유부호)': ['requiredIf:isOverseasShippingContains', 'validCode'],
        'isAgreeOfCollectPersonalClearanceCode(개인통관고유부호 수집에 동의)': ['isAgree'],
        'isAgreeOfProvidePersonalClearanceCode(개인통관고유부호 판매자 제공에 동의)': ['isAgree'],
        'receive_address.name(받는분)': ['required'],
        'receive_address.phone(휴대폰 번호)': ['required', 'phoneNumber'],
        'receive_address.zip_code(우편번호)' : ['required'],
        'receive_address.base_address(주소)' : ['required'],
        'receive_address.detail_address(상세주소)': ['required'],
        'payment_info.method(결제수단)': ['required'],
        'payment_info.card_code(결제 카드)': ['requiredIf:paymentMethodEngLabel,credit_card'],
        'payment_info.bank_code(은행)': ['requiredIf:paymentMethodEngLabel,virtual_account'], 
        'payment_info.depositor_name(입금자명)': ['requiredIf:paymentMethodEngLabel,virtual_account'],  
        'payment_info.cash_receipt_apply_type(현금영수증 발급 신청 종류)': ['requiredIf:paymentMethodEngLabel,virtual_account', 'in:1,2,3'],       
        'cashReceiptPhone(현금영수증-휴대폰 번호)': ['existReceiptPhone', 'validReceiptPhone'],                
        'cashReceiptBusinessNumber(현금영수증-사업자 등록번호)': ['existReceiptBusinessNumber', 'validReceiptBusinessNumber'],                             
        'refund_account.owner_name(환불은행 - 예금주명)': ['requiredIf:paymentMethodEngLabel,virtual_account,escrow'],
        'refund_account.bank_code(환불은행 - 은행)': ['requiredIf:paymentMethodEngLabel,virtual_account,escrow'],
        'refund_account.account_number(환불은행 - 계좌번호)': ['requiredIf:paymentMethodEngLabel,virtual_account,escrow'],
    })

    validator.setMessages({
        'orderer_info.name.required' : ':param(을/를) 입력해주세요.',
        'orderer_info.email.required' : ':param(을/를) 입력해주세요.',
        'orderer_info.phone.required' : ':param(을/를) 입력해주세요.',
        'orderer_info.personal_clearance_code.requiredIf': ':param(을/를) 입력해주세요.',
        'orderer_info.personal_clearance_code.validCode': ':param(을/를) 확인해주세요.',
        'isAgreeOfCollectPersonalClearanceCode.isAgree':':param(을/를) 동의해주세요.',
        'isAgreeOfProvidePersonalClearanceCode.isAgree':':param(을/를) 동의해주세요.',
        'payment_info.card_code.requiredIf': ':param(을/를) 선택해주세요.',
        'payment_info.bank_code.requiredIf': ':param(을/를) 선택해주세요.',
        'payment_info.depositor_name.requiredIf': ':param(을/를) 입력해주세요.',
        'cashReceiptPhone.existReceiptPhone': ':param(을/를) 입력해주세요',
        'cashReceiptBusinessNumber.existReceiptBusinessNumber': ':param(을/를) 입력해주세요.',
        'cashReceiptPhone.validReceiptPhone': '올바른 휴대폰 번호를 입력해주세요',
        'cashReceiptBusinessNumber.validReceiptBusinessNumber': '올바른 사업자 번호를 입력해주세요.',
        'payment_info.cash_receipt_apply_type.requiredIf': ':param(을/를) 선택해주세요.',
        'payment_info.cash_receipt_apply_type.in':  ':param(을/를) 선택해주세요.',
        'refund_account.owner_name.requiredIf': ':param(을/를) 입력 해주세요.',
        'refund_account.bank_code.requiredIf': ':param(을/를) 선택 해주세요.',
        'refund_account.account_number.requiredIf': ':param(을/를) 등록 해주세요.',
    })

    validator.registTester('isAgree', (paramName: string, extraValues: string[], data: { [key: string]: string }) => {
        if (isContainsOverSeaGoods.value === false) {
            return true;
        }

        return getTargetValue(data, paramName) === true;
    });

    validator.registTester('validCode', (paramName: string, extraValues: string[], data: { [key: string]: string }) => {
        if (isContainsOverSeaGoods.value === false) {
            return true;
        }

        return /^[Pp][0-9]{12}$/g.test(getTargetValue(data, paramName));
    });

    validator.registTester('existReceiptPhone', (paramName: string, extraValues: string[], data: { [key: string]: string }) => {     
        if (getTargetValue(data, 'payment_info.cash_receipt_apply_type') == 1 && getTargetValue(data, 'paymentMethodEngLabel') === 'virtual_account') {
            const tel = getTargetValue(data, paramName);
            return tel !== null && tel !== '';
        }
        return true;
    });

    validator.registTester('existReceiptBusinessNumber', (paramName: string, extraValues: string[], data: { [key: string]: string }) => {     
        if (getTargetValue(data, 'payment_info.cash_receipt_apply_type') == 2 && getTargetValue(data, 'paymentMethodEngLabel') === 'virtual_account') {
            const businessNumber = getTargetValue(data, paramName);
            return businessNumber !== null && businessNumber !== '';
        }
        return true;
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
                    const { payingUrl } = await orderRepository.preparePay(orderId, resultForm);    
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
                    id: orderId
                },
                replace : true
            });		
        }
    } catch (e) {                            
        defaultCatch(e);
    }
}

function copyOrderInfo() {
    receiverForm.value.name = ordererForm.value.name;
    receiverForm.value.phone = ordererForm.value.phone;
}

onMounted(async ()=> {
    const { packs, needPersonalClearanceCode } = await orderRepository.orderBasicData(orderId);
    isContainsOverSeaGoods.value = needPersonalClearanceCode;
    orderPacks.value = packs.map((pack) => {
        const groupOrders = pack.groupOrders.map((groupOrder) => {
            return {
                ...groupOrder,
                packGoodsSellPrice: groupOrder.items.reduce((acc, cur) => {
                    return acc+ cur.goodsSellPrice
                }, 0)
            }
        })
                
        return {
            chargedShippingPrice: pack.chargedShippingPrice,
            conditionAmount: pack.conditionAmount,
            conditionalFreeFrom: pack.conditionalFreeFrom,
            extraShippingPrice: pack.extraShippingPrice,
            shippingPrice: pack.shippingPrice,
            shippingPricePolicy: pack.shippingPricePolicy,
            shippingRuleId: pack.shippingRuleId,
            orderGoods: pack.orderGoods,
            groupOrders
        }
    });            

    const [availablePayMethods] = await Promise.all(
        [
            orderRepository.getPayMethods(), 
            getInterests(),
        ]
    );
            
    payMethods.value = availablePayMethods;
    priceSummary.value = await totalPrice();
    paymentForm.value.payMethod = payMethods.value[0].code;

    window.addEventListener('hashchange', async(event) => {
        const before = event.oldURL.split('#')[1] ?? '';
        const after = event.newURL.split('#')[1] ?? '';
        if (before === 'ADDRESS_FIND') {
            receiverForm.value.zipCode = findZipCode.value;
            receiverForm.value.baseAddress = findRoadAddress.value;
            await changeReceiveAddress();
        }
    });
});

onBeforeUnmount(() => {
    resetAddress();
});
</script>


