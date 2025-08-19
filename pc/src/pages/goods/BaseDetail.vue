<template>
    <div
        v-if="goodsBasicInfo && goodsPromotion"
        class="mm_page-content"
    >
        <!-- 본문 내용 -->
        <div class="m_prodetail">
            <!-- 상품상세 상단 -->
            <div class="m_prodetail-head">
                <div class="mm_inner">
                    <CategoryBreadcrumb 
                        :goods-info="goodsBasicInfo"
                    />
                    <div class="mm_lside">
                        <slot name="leftSideHeadContents" />
                        <!-- 품절 -->
                        <!-- (D) 품절된 상품일 경우 노출합니다. -->
                        <template v-if="!isRaffle">
                            <p
                                v-if="isSoldout"
                                class="m_prodetail-head-soldout"
                            >
                                SOLD OUT
                            </p>
                            <!--// 품절 -->
                            <!-- 품절임박 -->
                            <!-- (D) 품절임박 상품 일 때만 노출합니다. -->
                            <p
                                v-if="!isSoldout && totalStock < 6"
                                ref="stockClockElement"
                                class="m_prodetail-head-stock"
                            >
                                <i class="ico_clock" /><strong>품절임박</strong>서두르세요!<span>남은수량</span><strong>{{ totalStock }}<sub>개</sub></strong>
                            </p>
                            <!--// 품절임박 -->
                            <!-- 상품 이미지 -->
                            <div class="m_prodetail-thumbnail">
                                <i class="image_thumbnail"><img
                                    v-lazyload="{ src: selectedThumbnailImage }"
                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                    alt=""
                                ></i>
                                <div class="m_prodetail-thumbnail-list">
                                    <ul class="mm_flex T=equal">
                                        <li
                                            v-for="imageUrl in goodsBasicInfo.goods.thumbnailUrls"
                                            :key="imageUrl"
                                        >
                                            <button
                                                type="button" 
                                                :class="['btn_thumbnail', { 'S=thumbnail-on': selectedThumbnailImage === imageUrl }]"
                                                :title="selectedThumbnailImage === imageUrl ? '선택됨' : ''"
                                                @click="() => { selectedThumbnailImage = imageUrl }"
                                            >
                                                <i
                                                    v-lazyload="{ src: imageUrl }"
                                                    class="mm_bg-cover"
                                                />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                    
                                <!-- 360도 뷰(유료) -->
                                <template v-if="goodsBasicInfo.goods.degree360ImageUrls.length > 0">
                                    <button
                                        type="button"
                                        :disabled="degree360ViewOn"
                                        class="btn_multiangle-view"
                                        @click="degreeImageOpen"
                                    >
                                        <i class="ico_multiangle" /><b class="mm_ir-blind">360도 뷰</b>
                                    </button>
                                    <div
                                        :class="['m_prodetail-multiangle', { 'S=multiangle-on' : degree360ViewOn }]"
                                        @mousedown.prevent="view360MouseDown($event)"
                                    >
                                        <div :class="['m_prodetail-multiangle-note', { 'S=note-on' : degree360NoteOn }]">
                                            <i class="ico_multiangle-drag" /><p>좌우로 움직여<br> 자세히 보세요</p>
                                        </div>
                                        <div class="m_prodetail-multiangle-image">
                                            <i
                                                v-for="imageUrl, index in goodsBasicInfo.goods.degree360ImageUrls" 
                                                :key="imageUrl" 
                                                v-lazyload="{ src: imageUrl, isForce: true }"
                                                :class="['mm_bg-cover image_product', { 'S=on' : selectedImageIndex === index }]"
                                            />                                      
                                        </div>
                                        <button
                                            type="button"
                                            class="btn_close"
                                            @click="degreeImageClose"
                                        >
                                            <i class="ico_close" /><b class="mm_ir-blind">360도 뷰 닫기</b>
                                        </button>
                                    </div>
                                </template>
                                <!--// 360도 뷰(유료) -->
                            </div>
                            <div class="mm_btn_box">
                                <button
                                    type="button"
                                    class="mm_btn T=sm T=line T=light btn_copy"
                                    @click="copyPath"
                                >
                                    <i class="ico_copy" /><b>주소 복사하기</b>
                                </button>
                            </div>
                        </template>
                        <!--// 상품 이미지 -->
                    </div>
                    <div class="mm_rside">
                        <slot name="rightSideHeadContents" />                        
                        <!-- 할인 혜택 -->
                        <div class="m_prodetail-head-discount">
                            <dl v-if="!isRaffle && goodsPromotion.isDownloadAbleCoupon && isUser && !isJointPurchase">
                                <dt>{{ shopName }}쇼핑몰 고객을 위한 혜택</dt>
                                <dd>
                                    <a
                                        class="btn_coupon"
                                        href="#"
                                        @click.prevent="downloadCouponModalOpen"
                                    >
                                        <b>쿠폰 받기<i class="ico_download" /></b>
                                    </a>
                                </dd> 
                            </dl>
                            <div :class="['mm_dropdown', priceAreaAddClass]">
                                <button
                                    type="button"
                                    class="btn_dropdown"
                                    :title="priceAreaAddClass === 'S=on' ? '접어두기' : '펼처보기'" 
                                    @click="() => {
                                        priceAreaAddClass = priceAreaAddClass === '' ? 'S=on' : '';
                                    }"
                                >                                    
                                    <b>{{ isJointPurchase ? '공동구매 할인가' : '최대 할인가' }}</b>
                                    <b class="text_price"><strong>{{ MMFilters.formatNumber(isJointPurchase ? (goodsPromotion.baseDiscountedPrice - jointPurchase.discountedPrice) : goodsPromotion.maxDiscountedPrice) }}</strong></b><i class="ico_dropdown" />
                                </button>
                                <div
                                    class="mm_dropdown-item"
                                    :style="priceAreaAddClass == 'S=on' ? { height: 'auto' } : {}"
                                >
                                    <div class="mm_dropdown-item-inner">
                                        <section>
                                            <h5><b>비회원</b></h5>
                                            <dl>
                                                <dt>판매가</dt><dd class="text_price">
                                                    <strong>{{ MMFilters.formatNumber(goodsPromotion.sellPrice) }}</strong>
                                                </dd>
                                            </dl>
                                        </section>
                                        <section>
                                            <h5><b>회원혜택</b></h5>
                                            <dl v-if="goodsPromotion.sellPrice - goodsPromotion.baseDiscountedPrice > 0">
                                                <dt>상품쿠폰</dt><dd class="text_price">
                                                    <b>- {{ MMFilters.formatNumber(goodsPromotion.sellPrice - goodsPromotion.baseDiscountedPrice) }}</b>
                                                </dd>
                                            </dl>
                                            <template v-if="!isJointPurchase">
                                                <dl v-if="goodsPromotion.nightDiscountedPrice > 0">
                                                    <dt>심야할인</dt><dd class="text_price">
                                                        <b>- {{ MMFilters.formatNumber(goodsPromotion.nightDiscountedPrice) }}</b>
                                                    </dd>
                                                </dl>
                                                <dl v-if="goodsPromotion.couponDiscountedPrice > 0 && !isTimeDeal">
                                                    <dt>다운로드쿠폰</dt><dd class="text_price">
                                                        <b>- {{ MMFilters.formatNumber(goodsPromotion.couponDiscountedPrice) }}</b>
                                                    </dd>
                                                </dl>
                                                <dl v-if="goodsPromotion.immediatelyDiscountedPrice > 0">
                                                    <dt>즉시할인</dt><dd class="text_price">
                                                        <b>- {{ MMFilters.formatNumber(goodsPromotion.immediatelyDiscountedPrice) }}</b>
                                                    </dd>
                                                </dl>                                                
                                                <dl v-if="goodsPromotion.timeSaleDiscountedPrice > 0 && isTimeDeal">
                                                    <dt class="text_timesale">
                                                        타임특가 할인
                                                    </dt><dd class="text_price">
                                                        <b>- {{ MMFilters.formatNumber(goodsPromotion.timeSaleDiscountedPrice) }}</b>
                                                    </dd>
                                                </dl>
                                            </template>
                                            <template v-else>
                                                <dl v-if="jointPurchase && jointPurchase.saleRate > 0">
                                                    <dt>공동구매 할인</dt><dd class="text_price">
                                                        <b>- {{ MMFilters.formatNumber(jointPurchase.discountedPrice) }}</b>
                                                    </dd>
                                                </dl>
                                            </template>
                                            <dl>
                                                <dt>회원 혜택가</dt><dd class="text_price">
                                                    <strong>{{ MMFilters.formatNumber(isJointPurchase ? (goodsPromotion.baseDiscountedPrice - jointPurchase.discountedPrice) : goodsPromotion.maxDiscountedPrice) }}</strong>
                                                </dd>
                                            </dl>
                                        </section>
                                        <div class="mm_note">
                                            <ul>
                                                <li>현재 최대 할인가의 금액 기준은 할인 혜택이 적용된 금액이며 일부는 회원에게만 적용될 수 있습니다.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--// 할인 혜택 -->

                        <!-- 기타정보(배송정보, 혜택, 예약배송 등) -->
                        <div class="m_prodetail-head-info">
                            <dl v-if="goodsPromotion.welcome">
                                <dt>신규회원 혜택가</dt>
                                <dd>
                                    <p class="mm_text-secondary text_price">
                                        <strong>{{ MMFilters.formatNumber(goodsPromotion.welcome.discountedPrice) }}</strong>
                                    </p><small>신규가입 시 {{ goodsPromotion.welcome.saleAmountType === 'KRW' ? goodsPromotion.welcome.saleAmount : `${goodsPromotion.welcome.saleAmount}%` }} 쿠폰 즉시 지급</small>
                                </dd>
                            </dl>
                            <dl>
                                <dt>배송정보</dt>
                                <dd v-if="goodsBasicInfo.deliveryInfo.isFreeDelivery">
                                    무료배송
                                </dd>
                                <dd v-else>
                                    배송비 {{ MMFilters.formatNumber(goodsBasicInfo.deliveryInfo.price) }}원 {{ goodsBasicInfo.deliveryInfo.isPackageDelivery ? '' : '(개별 부과)' }}                                    
                                </dd>
                                <dd v-if="goodsBasicInfo.deliveryInfo.isConditionalFreeDelivery">
                                    무료배송 조건 {{ MMFilters.formatNumber(goodsBasicInfo.deliveryInfo.conditionalFreePrice) }}원~
                                </dd>
                                <dd>도서산간지역 {{ MMFilters.formatNumber(goodsBasicInfo.deliveryInfo.extraPrice) }}원</dd>
                                <!--배송확률-->
                                <dd
                                    v-if="
                                        isCommonGoodsDetail 
                                            && goodsBasicInfo.deliveryInfo.arrivalProbabilityList.length > 0 
                                            && goodsBasicInfo.deliveryInfo.arrivalProbability
                                    "
                                >
                                    <div
                                        class="m...info-arrive" 
                                        :class="{ 'S=switch-on': showProbabilityToolTip }"
                                    >
                                        <button 
                                            type="button" 
                                            class="btn_help" 
                                            data-switch="{ '_isParent': true }" 
                                            title="선택됨" 
                                            @click="showProbabilityToolTip = !showProbabilityToolTip"
                                        >
                                            <i class="ico_help-fill" />
                                        </button>
                                        <div
                                            class="m...info-arrive-tooltip" 
                                        >
                                            <p>최근 배송된 주문건 대상으로 평균 배송일을 예측했습니다. 실제 배송완료일은 예측치와 다를 수 있습니다.</p>
                                            <button type="button" class="btn_close" onclick="this.parentElement.previousElementSibling.click();">
                                                <i class="ico_close" /><b class="mm_ir-blind">닫기</b>
                                            </button>
                                        </div>
                                        <div v-dropdown class="mm_dropdown" data-dropdown>
                                            <button type="button" class="btn_dropdown" title="펼쳐보기">
                                                <i class="ico_ship" />
                                                <strong>
                                                    {{ MMFilters.formatDate(goodsBasicInfo.deliveryInfo.arrivalProbability.averageDate, 'MM월 DD일(ddd)', true) }}
                                                </strong>
                                                도착 확률
                                                <strong>{{ goodsBasicInfo.deliveryInfo.arrivalProbability.probability }}<sub>%</sub></strong>
                                                <i class="ico_dropdown" />
                                            </button>
                                            <div class="mm_dropdown-item">
                                                <div class="mm_dropdown-item-inner">
                                                    <p 
                                                        v-for="arrivalProbability in goodsBasicInfo.deliveryInfo.arrivalProbabilityList" 
                                                        :key="arrivalProbability.averageDate"
                                                    >
                                                        <span>{{ MMFilters.formatDate(arrivalProbability.averageDate, 'MM월 DD일(ddd)', true) }} 도착확률</span>
                                                        <strong>{{ arrivalProbability.probability }}</strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="goodsBasicInfo.deliveryInfo.exportableMessage" class="mm_note">
                                        <ul>
                                            <li>{{ goodsBasicInfo.deliveryInfo.exportableMessage }}</li>
                                        </ul>
                                    </div>
                                </dd>
                                <!--// 배송확률-->
                                <!-- (D) 주문제작 상품인 경우 노출합니다 -->
                                <template v-if="goodsBasicInfo.goods.isCustomMade">
                                    <dd>배송기간 {{ goodsBasicInfo.deliveryInfo.customMadeDeliveryDay }}일</dd> 
                                    <dd>주문 제작 상품 교환/반품 불가합니다</dd>
                                </template>
                                <!-- (D) 해외배송 상품인 경우 노출합니다 -->
                                <template v-if="goodsBasicInfo.goods.isOverSeaDelivery">
                                    <dd>해외배송 상품</dd>
                                    <dd>배송기간 {{ goodsBasicInfo.deliveryInfo.overseaDeliveryMin }} ~ {{ goodsBasicInfo.deliveryInfo.overseaDeliveryMax }}일</dd>
                                </template>                                
                            </dl>
                            <dl v-if="installmentTitle !== ''">
                                <dt>혜택</dt>
                                <dd>
                                    <a
                                        href="#" 
                                        @click.prevent="cardBenefitModalOpen()"
                                    >
                                        <span>{{ installmentTitle }}</span><i class="ico_help-fill" />
                                    </a>
                                </dd>
                            </dl>
                            <dl
                                v-if="isCommonGoodsDetail 
                                    && goodsBasicInfo.goods.saleReserve !== undefined 
                                    && goodsBasicInfo.goods.saleReserve !== null"
                            >
                                <dt>예약배송</dt>
                                <dd v-if="!isAfterDate(goodsBasicInfo.goods.saleReserve.sellEndAt)">
                                    예약판매 기간 :
                                    <b>{{ goodsBasicInfo.goods.saleReserve.sellStartAt }} ~ {{ goodsBasicInfo.goods.saleReserve.sellEndAt }}</b>
                                </dd>
                                <dd>
                                    예약배송 기간 :
                                    <b>{{ goodsBasicInfo.goods.saleReserve.shipStartAt }} ~ {{ goodsBasicInfo.goods.saleReserve.shipEndAt }}</b>
                                </dd>
                            </dl>
                            <dl
                                v-if="isRaffle && raffle"
                                class="m...info-raffle"
                            >
                                <dt>래플</dt>
                                <dd><span>래플 응모기간</span><strong>{{ MMFilters.formatDate(raffle?.startAt, 'YYYY.MM.DD(ddd) HH시 mm분', true) }} ~ {{ MMFilters.formatDate(raffle?.endAt, 'YYYY.MM.DD(ddd) HH시 mm분', true) }}</strong></dd>
                                <dd><span>당첨자 발표일</span><strong>{{ MMFilters.formatDate(raffle?.noticeAt, 'YYYY.MM.DD(ddd) HH시 mm분', true) }}</strong></dd>
                                <dd><span>당첨자 구매기간</span><strong>{{ MMFilters.formatDate(raffle?.buyStartAt, 'YYYY.MM.DD(ddd) HH시 mm분', true) }} ~ {{ MMFilters.formatDate(raffle?.buyEndAt, 'YYYY.MM.DD(ddd) HH시 mm분', true) }}</strong></dd>
                                <dd><span>당첨 예정자 수</span><strong>{{ MMFilters.formatNumber(raffle?.limitWinner) }}명</strong></dd>
                            </dl>
                            <dl
                                v-if="isJointPurchase && jointPurchase"
                                class="m...info-coopbuy"
                            >
                                <dt>공동구매</dt>
                                <dd><span>공동구매 기간</span><strong>{{ MMFilters.formatDate(jointPurchase.startAt, 'YYYY.MM.DD(ddd) HH시 mm분', true) }} ~ {{ MMFilters.formatDate(jointPurchase.endAt, 'YYYY.MM.DD(ddd) HH시 mm분', true) }}</strong></dd>
                                <dd><span>목표인원</span><strong>{{ MMFilters.formatNumber(jointPurchase.targetCount) }}명</strong></dd>
                                <dd><span>쿠폰사용 기간</span><strong>{{ jointPurchase.couponExpirationDateMessage }}</strong></dd>
                            </dl>
                            <!-- 사은품 -->
                            <a 
                                v-if="goodsBasicInfo.giveaways.length > 0"
                                class="btn_gift" 
                                href="#"
                                @click.prevent="giveAwayModalOpen()"
                            >
                                <span>GIFT</span><b>구매 고객을 위한 <strong>사은품을 확인해 보세요</strong></b><small>확인하기<i class="ico_link T=xs" /></small>
                            </a>
                            <!--// 사은품 -->
                        </div>
                        <!--// 기타정보(배송정보, 혜택, 예약배송 등) -->
                        <!-- 옵션선택 -->
                        <!-- 품절일때 미노출 처리!-->
                        <div
                            v-if="!isSoldout && goodsPromotion.purchaseAble && (isRaffle ? isRaffleBuyAble: true)"
                            class="m_prodetail-head-option m_product-option"
                        >
                            <!-- (D) 상품이 부분 품절인 경우에만 '.btn_restock' 버튼을 노출합니다 -->                            
                            <a v-if="goodsBasicInfo.isUseStockNotify && isPartialSoldout && isCommonGoodsDetail" class="mm_btn T=2xs T=line btn_restock" href="#" @click.prevent="restockModalOpen"><i class="ico_alarm" /><b>재입고 알림받기</b></a>
                            <MMOptions 
                                v-if="!isSingleOption"
                                :options="goodsOptions" 
                                :goods-price="buyGoodsPrice"
                                :selected-options="selectedOptions"                                 
                                @add:options="addSelectedOption"
                            />
                            <MMOptionsSelected 
                                :is-single-option="isSingleOption"
                                :selected-options="selectedOptions"
                                :is-joint-purchase="isJointPurchase"
                                @remove:options="removeSelectedOption"
                            />
                            <!-- 총 상품 금액 -->
                            <dl class="m_product-option-total">
                                <dt>총 상품 금액</dt>
                                <dd>
                                    <p class="text_price">
                                        <strong>{{ MMFilters.formatNumber(totalGoodsPrice) }}</strong>
                                    </p>
                                </dd>
                            </dl>
                            <!--// 총 상품 금액 -->
                        </div>
                        <!-- btn_like S=switch-on -->
                        <!--// 옵션선택 -->
                        <div class="mm_btn_box">
                            <template v-if="isRaffle && raffle">                                
                                <template v-if="raffle.isEnd">
                                    <template v-if="raffle.isBuyEnd">
                                        <b
                                            class="mm_btn T=lg T=disabled btn_product-raffle"
                                        >래플 종료</b>
                                    </template>
                                    <template v-else>
                                        <template v-if="!raffle.isConfirmedWinner || !raffle.isAfterNotice">
                                            <b
                                                class="mm_btn T=lg T=primary btn_product-raffle"
                                                v-text="isNoticeLabel"
                                            />
                                        </template>
                                        <template v-else>
                                            <a
                                                v-if="raffle.isBeforeBuyStart"
                                                class="mm_btn T=lg T=primary btn_product-raffle"
                                                href="#"
                                                @click.prevent="winningResultHandler"
                                            ><b>당첨 결과 확인하기</b></a>
                                            <button
                                                v-else-if="isRaffleBuyAble"
                                                type="button"
                                                class="mm_btn T=lg T=primary btn_product-raffle"
                                                @click="buy()"
                                            >
                                                <b>구매하기</b>
                                            </button>
                                            <button
                                                v-else
                                                type="button"
                                                class="mm_btn T=lg T=primary btn_product-raffle"
                                                disabled
                                            >
                                                <b>구매불가</b>
                                            </button> 
                                        </template>
                                    </template>
                                </template>
                                <template v-else>                                    
                                    <template v-if="raffle.isStart">
                                        <b
                                            v-if="raffle.isEntry"
                                            class="mm_btn T=lg T=disabled btn_product-raffle"
                                        >응모 완료</b>
                                        <button
                                            v-else-if="isAvailableDevice"
                                            type="button" 
                                            class="mm_btn T=lg T=primary btn_product-raffle"
                                            @click="applyRaffle"
                                        >
                                            <b>응모하기</b>
                                        </button>
                                        <b
                                            v-else
                                            class="mm_btn T=lg T=primary btn_product-raffle"
                                            v-text="availableDeviceLabel"
                                        />
                                    </template>
                                    <template v-else>
                                        <b class="mm_btn T=lg T=primary btn_product-raffle">진행 예정</b>                                    
                                    </template>
                                </template>
                            </template>
                            <template v-else>
                                <div class="mm_flex">
                                    <template v-if="isJointPurchase">
                                        <button
                                            v-if="!jointPurchase.isEnd"
                                            type="button"
                                            class="mm_btn T=lg T=primary"
                                            @click="applyJointPurchase()"
                                        >
                                            <b>공동구매 참여</b>
                                        </button>
                                        <button
                                            v-if="jointPurchase.isEnd && jointPurchase.targetAchieveRate >= 100"
                                            type="button"
                                            class="mm_btn T=lg T=primary"
                                            :disabled="!jointPurchase.isPurchasable"
                                            @click="buy()"
                                        >
                                            <b>공동구매가로 구매하기</b>
                                        </button>
                                        <button
                                            v-if="jointPurchase.isEnd && jointPurchase.targetAchieveRate < 100"
                                            type="button"
                                            class="mm_btn T=lg"
                                            disabled
                                        >
                                            <b>공동구매 미달성</b>
                                        </button>
                                    </template>                                
                                    <template v-else>
                                        <template v-if="!goodsPromotion.purchaseAble">
                                            <button
                                                type="button"
                                                class="mm_btn T=lg"
                                                disabled
                                            >
                                                <b>구매불가</b>
                                            </button> 
                                        </template>
                                        <template v-else>
                                            <button
                                                type="button" 
                                                :class="['btn_like', { 'S=switch-on': isWished }]" 
                                                data-switch
                                                @click="toggleWished(isWished)"
                                            >
                                                <i class="ico_like" /><b class="mm_ir-blind">찜한 아이템에 추가하기</b>
                                            </button>
                                            <template v-if="!isSoldout">
                                                <button
                                                    type="button"
                                                    class="mm_btn btn_cart T=lg T=line T=primary"
                                                    @click="addCart()"
                                                >
                                                    <b>장바구니</b>
                                                </button>
                                                <button
                                                    type="button"
                                                    class="mm_btn btn_buy T=lg T=primary"
                                                    @click="buy()"
                                                >
                                                    <b>구매하기</b>
                                                </button>
                                            </template>
                                            <template v-else>
                                                <button
                                                    type="button"
                                                    class="mm_btn T=lg"
                                                    disabled
                                                >
                                                    <b>품절</b>
                                                </button> 
                                                <a 
                                                    v-if="goodsBasicInfo.isUseStockNotify" 
                                                    class="mm_btn T=lg T=line T=primary btn_restock" 
                                                    href="#"
                                                    @click.prevent="restockModalOpen"
                                                >
                                                    <i class="ico_alarm" /><b>재입고 알림받기</b>
                                                </a>
                                            </template>
                                        </template>
                                    </template>
                                </div>
                            </template>
                        </div>
                        <MMLink
                            v-if="goodsBasicInfo.isUseSellerShop && isCommonGoodsDetail"
                            class="btn_seller"
                            :to="{ name: 'GoodsSellerIndex', params: { id : goodsBasicInfo.goods.sellerId }}"
                        >
                            <b>판매자의 다른 상품 더보기</b><i class="ico_link" />
                        </MMLink>
                    </div>
                </div>
            </div>

            <div
                ref="tabContainer"
                class="mm_inner"
            >       
                <slot name="jointPurchaseProcessInfo" />
                <!-- 추천 아이템: 세트상품리스트 -->
                <slot name="packageGoods" />
                <!--// 추천 아이템 -->
                <!-- 상품정보 탭 -->
                <GoodsInfoTab
                    :goods-basic-info="goodsBasicInfo"
                    :aggregate-info="aggregateInfo"
                    :optional-review-info="optionalReviewInfo"
                    :is-writable-review="isWritableReview"
                    :handle-buy-button="handleBuyButtonSticky"
                />
                <!--// 상품정보 탭 -->
                <!-- 상품상세 하단 -->
                <slot name="prodDetailFoot" />
            <!--/상품상세 하단 -->
            </div>

         

            <!-- 하단 옵션 선택 -->
            <!-- (D) 상품이 품절된 경우 하단 옵션선택 영역(.m_prodetail-buy)은 노출하지 않습니다 -->
            <div
                v-if="!isSoldout && goodsPromotion.purchaseAble && (isRaffle ? isRaffleBuyAble: true)"
                class="m_prodetail-buy m_product-option"
                :class="[buyButtonStickyClass, { 'S=switch-on' : buyButtonSwitchOn}]"
            >
                <div class="m_prodetail-buy-head">
                    <div class="mm_inner">
                        <button
                            type="button" 
                            class="mm_switch btn_option-toggle"
                            :title="buyButtonSwitchOn ? '펼쳐보기' : '접어놓기'" 
                            @click="() => { buyButtonSwitchOn = !buyButtonSwitchOn }"
                        >
                            <b>구매 옵션선택</b><i class="ico_toggle" />
                        </button>
                        <div class="mm_lside">
                            <div class="mm_product-item T=single T=sm">
                                <a>
                                    <figure>
                                        <div class="mm_image-scale"><i
                                            v-lazyload="{ src: goodsBasicInfo.goods.thumbnailUrl }"
                                            class="mm_bg-cover image_product"
                                        /></div>
                                        <figcaption>
                                            <p class="text_brand">{{ goodsBasicInfo.goods.brandName }}</p>
                                            <p class="text_product">{{ goodsBasicInfo.goods.name }}</p>
                                        </figcaption>
                                    </figure>
                                </a>
                            </div>
                        </div>
                        <div class="mm_rside">
                            <dl class="m_product-option-total">
                                <dt>총 상품 금액</dt>
                                <dd>
                                    <p class="text_price">
                                        <strong>{{ MMFilters.formatNumber(totalGoodsPrice) }}</strong>
                                    </p>
                                </dd>
                            </dl>
                            <div class="mm_btn_box">
                                <template v-if="isShowLikeBtn">
                                    <button 
                                        type="button" 
                                        :class="['mm_switch btn_like', { 'S=switch-on': isWished }]" 
                                        data-switch
                                        @click="toggleWished(isWished)"
                                    >
                                        <i class="ico_like" /><b class="mm_ir-blind">찜한 아이템에 추가하기</b>
                                    </button>
                                    <button
                                        type="button"
                                        class="mm_btn T=line T=primary"
                                        @click="addCart(true)"
                                    >
                                        <b>장바구니</b>
                                    </button>
                                    <button
                                        type="button"
                                        class="mm_btn T=primary"
                                        @click="buy(true)"
                                    >
                                        <b>구매하기</b>
                                    </button>
                                </template>
                                <template v-else-if="isJointPurchase && jointPurchase">
                                    <button
                                        v-if="!jointPurchase.isEnd"
                                        type="button"
                                        class="mm_btn T=lg T=primary"
                                        @click="applyJointPurchase(true)"
                                    >
                                        <b>공동구매 참여</b>
                                    </button>                                    
                                    <button
                                        v-if="jointPurchase.isEnd && jointPurchase.targetAchieveRate >= 100"
                                        type="button"
                                        class="mm_btn T=lg T=primary"
                                        :disabled="!jointPurchase.isPurchasable"
                                        @click="buy(true)"
                                    >
                                        <b>공동구매가로 구매하기</b>
                                    </button>
                                    <button
                                        v-if="jointPurchase.isEnd && jointPurchase.targetAchieveRate < 100"
                                        type="button"
                                        class="mm_btn T=lg"
                                        disabled
                                    >
                                        <b>공동구매 미달성</b>
                                    </button>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mm_inner m_prodetail-buy-option">
                    <div class="mm_lside">
                        <MMOptions  
                            v-if="!isSingleOption"
                            :options="goodsOptions" 
                            :goods-price="buyGoodsPrice"
                            :selected-options="selectedOptions" 
                            @add:options="addSelectedOption"
                        />
                        <!--// 옵션 목록 -->
                    </div>
                    <div class="mm_rside">
                        <MMOptionsSelected 
                            :is-single-option="isSingleOption"
                            :selected-options="selectedOptions"
                            :is-joint-purchase="isJointPurchase"
                            @remove:options="removeSelectedOption"
                        />
                        <!--// 선택된 옵션 목록 -->
                    </div>
                </div>
            </div>
            <!--// 하단 옵션 선택 -->
        </div>
        <!--// 본문 내용 -->

        <div v-show="false" class="goods_tit">
            <span class="goods_brand_name">{{ goodsBasicInfo.goods.brandName }}</span>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { mmon } from '$/helper/mmon';
import { goodsRepository } from '$/repository/goodsRepository';
import {  onMounted, ref, computed, toRefs } from 'vue';
import { AggregateReviewAndQna, GoodsBasicInfo, GoodsOptions, GoodsPricePromotion, OptionalReviewStatistics } from '$/@type/goods';
import { SelectedOption } from '$/@type/front';
import { defaultCatch, isAfterDate } from '$/functions';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { CartOptions } from '$/@type/shopping';
import { wishRepository } from '$/repository/member/wishRepository';
import { jointPurchaseRepository } from '$/repository/jointPurchaseRepository';
import { JointPurchaseDetail } from '$/@type/jointPurchase';
import { RaffleDetail, Raffle } from '$/@type/raffle';
import { formatDate } from '$/filters';
import { useIdentityVerification } from '$/composables/auth/certificateComposable';
import { certificateRepository } from '$/repository/auth/certificateRepository';
import { raffleRepository } from '$/repository/raffleRepository';
import moment from 'moment';
import { useViewGoods, useAddToCart } from '$/composables/marketingComposable';
import gsap from 'gsap';
import { useRefreshUser } from '$/composables/auth/userComposable';
import { useStartOrder } from '$/composables/orderComposable';
import { DownLoadCoupon } from '$/@type/coupon';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { useGoodsWish } from '$/composables/goods/useGoodsWish';
import { exhibitRepository } from '$/repository/exhibitRepository';
import Restock from '@/components/modal/goods/Restock.vue';
import Coupon from '@/components/modal/goods/Coupon.vue';
import GiveAway from '@/components/modal/goods/Giveaway.vue';
import AddWished from '@/components/modal/goods/AddWished.vue';
import WinningResult from '@/components/modal/raffle/WinningResult.vue';
import Entry from '@/components/modal/raffle/Entry.vue';
import CardBenefit from '@/components/modal/CardBenefit.vue';
import CertificateNeed from '@/components/modal/CertificateNeed.vue';
import MMOptions from '@/pages/goods/Options.vue';
import MMOptionsSelected from '@/pages/goods/SelectedOptions.vue';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { AVAILABLE_RAFFLE_DEVICE } from '$/constants';
import GoodsInfoTab from '@/pages/goods/tab/Index.vue';
import CategoryBreadcrumb from '@/pages/goods/CategoryBreadcrumb.vue';
import { dropdown as vDropdown } from '$/directives';

const props = withDefaults(defineProps<{
    goodsId: number,
    goodsBasicInfo: GoodsBasicInfo,
    goodsPromotion: GoodsPricePromotion,
    goodsOptions: GoodsOptions[],
    goodsMainThumbnailImage: string,
    installmentTitle: string,
    isSoldout: boolean,
    totalStock: number,
    isJointPurchase?: boolean,
    optionalReviewInfo?: OptionalReviewStatistics[],
    aggregateInfo?: AggregateReviewAndQna
    jointPurchase?: JointPurchaseDetail
    isTimeDeal?: boolean,
    maxOrderableCount?: number,
    isRaffle?: boolean,
    raffle?: RaffleDetail
}>(), {
    optionalReviewInfo: () => [],
    aggregateInfo: undefined,
    jointPurchase: undefined,
    isJointPurchase: false,
    isTimeDeal: false,
    isRaffle: false,
    maxOrderableCount: 0,
    raffle: undefined
});
const {
    globalConfigs,
    route,
    router,
    usePageTitleSetting,
    user,
    isUser
} = usePageContext();

/** VARIABLE */
const tabContainer = ref(null);        
const isRaffleBuyAble = ref(false);
const raffleMaxOrderAbleCount = ref(0);
const isNoticeLabel = ref('');
const isAvailableDevice = ref(false);
const availableDeviceLabel = ref('');
const stockClockElement = ref<HTMLElement|null>(null);
const isPartialSoldout = computed(() => {
    return soldoutOptions.value.length > 0
})
const soldoutOptions = ref<GoodsOptions[]>([]);
// 찜하기버튼 노출 여부(래플/공동구매 상세 페이지 미노출)
const isShowLikeBtn = computed(() => {
    return !props.isRaffle && !props.isJointPurchase
})
        
const {      
    goodsBasicInfo,                
    goodsOptions,
    goodsPromotion, 
    goodsMainThumbnailImage, 
    installmentTitle, 
    isSoldout,             
    totalStock, 
    isJointPurchase, 
    jointPurchase,
    goodsId,
    maxOrderableCount,
    raffle
} = toRefs(props);

const isRaffle = computed(() => props.isRaffle);
const isTimeDeal = computed(() => props.isTimeDeal);
const aggregateInfo = computed(() => props.aggregateInfo);
const optionalReviewInfo = computed(() => props.optionalReviewInfo);

usePageTitleSetting(goodsBasicInfo.value.goods.name);

const buyGoodsPrice = computed(() => {
    // if (isUser.value === false) {
    //     return goodsPromotion.value.sellPrice
    // }
    
    if (isJointPurchase.value && jointPurchase.value) {
        return goodsPromotion.value.baseDiscountedPrice - jointPurchase.value.discountedPrice
    }
    return goodsPromotion.value.maxDiscountedPrice + goodsPromotion.value.couponDiscountedPrice;
})
const isSingleOption = ref(false);        
const selectedOptions = ref<SelectedOption[]>([]);
/**
 * 뷰 제어용 변수 
 */
const priceAreaAddClass = ref('');
const selectedThumbnailImage = ref<string>(goodsMainThumbnailImage.value);
const buyButtonStickyClass = ref('');
const buyButtonSwitchOn = ref(false);
const degree360ViewOn = ref(false);
const isCommonGoodsDetail = route.name === 'GoodsDetail';
const showProbabilityToolTip = ref(false);
        
/**
 * 회원 연결된 데이터 항목 
*/
const isWished = ref(false);
const isWritableReview = ref(false);
        
const shopName = ref(globalConfigs.value.shop.name);
/** FUNCTION */

/** 재입고 모달 처리  */
function restockModalOpen() {
    if (!isUser.value) {
        return mmon.bom.confirm("로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?", (flag: boolean) => {
            if (flag) {
                router.push({
                    name: 'Login',
                    query: {
                        redirect_to_after: route.path,
                    },
                });
            }
        });
    }   
    useModal().open(Restock, {
        title: '재입고 알림 신청',
        itemClass: 'm_modal-restock',
        props: {
            isSingleOption: isSingleOption.value,
            goodsId: goodsBasicInfo.value.goods.id,
            options: isPartialSoldout.value ? soldoutOptions.value :goodsOptions.value,
            goodsPrice: buyGoodsPrice.value
        }
    })
           
}
/** 다운로드 쿠폰 모달 처리  */
async function downloadCouponModalOpen() {
    try {
        await getDownLoadCoupons();
        useModal().open(Coupon, {
            title: '쿠폰 다운받기',
            itemClass: 'm_modal-prodetail-coupon',
            props: {
                coupons: couponList.value,
                goodsId: goodsId.value
            },                    
        })
    } catch(error) {
        defaultCatch(error)
    }
}
/** 사은품 모달 처리  */
function giveAwayModalOpen() {
    useModal().open(GiveAway, {
        title: '사은품 정보',
        itemClass: 'm_modal-gift-info',
        props: {
            giveaways: goodsBasicInfo.value.giveaways
        }
    })
}
/** 무이자혜택 모달 처리  */
function cardBenefitModalOpen() {
    useModal().open(CardBenefit, {
        title: '카드사별 혜택',
        props: async() => {
            const cardBenefits = await exhibitRepository.cardBenefit()
            return {
                cardBenefits
            }
        }     
    })
}


function copyPath() {
    mmon.copy(location.href);
}

/**
 * 하단 구매버튼 고정 핸들링 함수
*/
function handleBuyButtonSticky(isSticky: boolean) {                     
    if (isSticky) {
        buyButtonStickyClass.value = 'S=buy-sticky';                
                
    } else {
        buyButtonStickyClass.value = '';
        buyButtonSwitchOn.value = false;
    }
}
/**
 * 옵션 추가 처리 
*/
function addSelectedOption(selectedOption: SelectedOption) {            
    selectedOptions.value.push(selectedOption);
}
/**
 * 선택된 옵션 삭체 처리
*/
function removeSelectedOption(optionCode: number) {
    selectedOptions.value = selectedOptions.value.filter(function (selectedOption) {
        return selectedOption.code !== optionCode
    })
}
/** 
 * 전체 선택된 상품 금액 
 */
const totalGoodsPrice = computed<number>(()=> {
    let totalPrice = 0;
    selectedOptions.value.forEach((selected) => {
        totalPrice = totalPrice + (selected.goodsPrice * selected.buyAmount);
    })
            
    return totalPrice;
})
/**
 * 장바구니 추가 함수 
 */
async function addCart(isOpenBottomOptionSticky?: boolean) {
    if (selectedOptions.value.length < 1) {
        return mmon.bom.alert('상품을 선택해주세요.', () => {
            if (isOpenBottomOptionSticky) {
                buyButtonSwitchOn.value = true;
            }
        });
    }
    mmon.loading.show();
    try {                
        const addCartOptions: CartOptions[] = selectedOptions.value.map((selectedOption) => {
            return {
                option_id: selectedOption.code,
                ea: selectedOption.buyAmount
            }    
        });
        await shoppingRepository.addCart(addCartOptions);
        mmon.bom.confirm(
            '선택하신 상품을 장바구니에 담았습니다.\n장바구니로 이동하시겠습니까?', 
            (isConfirm: boolean) => {
                if (isConfirm) {
                    router.push({
                        name: 'Cart',                        
                    })
                }
            },
            {
                closeButtonLabel: '장바구니 가기',
                cancelButtonLabel: '쇼핑 계속하기'                        
            }
        );

        useAddToCart({
            account: 'base',
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            userMail: user?.value?.loginId,
            cartItems: selectedOptions.value.map(selectedOption => {
                return {
                    goodsId: goodsId.value,
                    optionId: selectedOption.code,
                    goodsName: goodsBasicInfo.value.goods.name,
                    optionName: [selectedOption.optionName, selectedOption.subOptionName].filter(t => t).join(' '),
                    quantity: selectedOption.buyAmount,
                    price: selectedOption.goodsPrice + selectedOption.optionPrice,
                    discountedPrice: selectedOption.goodsPrice + selectedOption.optionPrice,
                }
            })
        })
    } catch (e) {
        defaultCatch(e);
        console.log(e);
    } finally {
        mmon.loading.hide();
    }
}    
/** 공동구매 참여 */
async function applyJointPurchase(isOpenBottomOptionSticky?: boolean) {
    if (!isUser.value) {
        return mmon.bom.confirm("로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?", (flag: boolean) => {
            if (flag) {
                router.push({
                    name: "Login",
                    query: {
                        redirect_to_after: route.path,
                    },
                });
            }
        });
    }
    if (selectedOptions.value.length < 1) {
        return mmon.bom.alert('상품을 선택해주세요.', () => {
            if (isOpenBottomOptionSticky) {
                buyButtonSwitchOn.value = true;
            }
        });                
    }
    if (selectedOptions.value.length > 1) {
        return mmon.bom.alert('공동구매 상품은 1개만 구매할 수 있습니다.');
    }
    if (jointPurchase.value === null || selectedOptions.value[0].buyAmount > 1) {
        return mmon.bom.alert('공동구매 상품은 1개만 구매할 수 있습니다.');
    }
    try {
        await jointPurchaseRepository.apply(jointPurchase.value.id, selectedOptions.value[0].code);
        mmon.bom.alert('성공적으로 공동구매 참여 완료하였습니다.');
    } catch(e) {
        defaultCatch(e);
    }
}
/**
 * 구매하기 시작함수 
 */
const { prepareOrder } = useStartOrder();
async function buy(isOpenBottomOptionSticky?: boolean) {          
    if (selectedOptions.value.length < 1) {                
        return mmon.bom.alert('상품을 선택해주세요.', () => {
            if (isOpenBottomOptionSticky) {
                buyButtonSwitchOn.value = true;
            }
        });
    }
    if (
        goodsBasicInfo.value !== undefined 
                && goodsBasicInfo.value.goods.saleReserve !== null
                && ( goodsBasicInfo.value.goods.saleReserve?.sellStartAt !== undefined && !isAfterDate(goodsBasicInfo.value.goods.saleReserve?.sellStartAt))
    ) {                
        return mmon.bom.alert('예약 판매 기간 내 구매가 가능한 상품입니다.');
    }
            
    if (isJointPurchase.value === true && (selectedOptions.value.length > 1 || selectedOptions.value[0].buyAmount > 1)) {
        return mmon.bom.alert('공동구매 상품은 1개만 구매할 수 있습니다.');
    }
    // 래플 최대 구매 가능 수량 체크 
    if (isRaffle.value && raffleMaxOrderAbleCount.value > 0) {
        const sumBuyAmount = selectedOptions.value.reduce(
            (previousValue, currentValue) => previousValue + currentValue.buyAmount,
            0
        );
        if (sumBuyAmount > raffleMaxOrderAbleCount.value) {
            return mmon.bom.alert(`1인당 구매제한 개수는 ${raffleMaxOrderAbleCount.value}개 입니다.`);
        }
    }
    // 타임딜 최대 구매 가능 수량 체크 
    if (
        isTimeDeal.value 
                && maxOrderableCount.value > 0
    ) {
        const sumBuyAmount = selectedOptions.value.reduce(
            (previousValue, currentValue) => previousValue + currentValue.buyAmount,
            0
        );
        if (sumBuyAmount > maxOrderableCount.value ) {
            return mmon.bom.alert(`타임딜 상품은 ${maxOrderableCount.value}개만 구매할 수 있습니다.`);
        }
    }
    const orderData = selectedOptions.value.map(function (option) {
        return {
            option_id: option.code,
            ea: option.buyAmount
        }
    });
    await prepareOrder(orderData);
   
    if(user.value && user.value.isCertificated === false) {
        useModal().open(CertificateNeed, {
            title: '본인인증',
            onClose: () => {
                buy();
            }
        })
    }
    // try {
    //     const tempOrderId = await orderRepository.tempOrderMake(orderData);
    //     router.push({
    //         name: 'OrderIndex',
    //         params : { 
    //             id: tempOrderId
    //         }
    //     })
    // } catch (e) {
    //     console.log(e);
    // }
}

const prevX = ref(0);
const dragCount = ref(0);
const selectedImageIndex = ref(0);
const degree360NoteOn = ref(false);
function view360MouseDown(event: MouseEvent) {
    prevX.value = event.clientX
    dragCount.value = 0;
    document.addEventListener('mousemove', view360MouseInlineHandler);
    document.addEventListener('mouseup', removeHandler);
}
function removeHandler() {
    document.removeEventListener('mousemove', view360MouseInlineHandler);
    document.removeEventListener('mouseup', removeHandler);
}
function view360MouseInlineHandler(event: MouseEvent) {
    const moveX = event.clientX - prevX.value;
    prevX.value = event.clientX;
    if (moveX > 0) {
        dragCount.value++;
    } else {
        dragCount.value--;
    } 
            
    if (goodsBasicInfo.value === undefined) {
        return;
    }
    if (Math.abs(dragCount.value) > 2 * ( 32/ goodsBasicInfo.value?.goods.degree360ImageUrls.length)) {
        dragCount.value = 0;
        selectedImageIndex.value = (moveX > 0) ? selectedImageIndex.value + 1 : selectedImageIndex.value - 1;
        if (selectedImageIndex.value >= goodsBasicInfo.value?.goods.degree360ImageUrls.length) {
            selectedImageIndex.value = 0;
        }
        if (selectedImageIndex.value < 0) {
            selectedImageIndex.value = goodsBasicInfo.value?.goods.degree360ImageUrls.length - 1;
        } 
    }
}
        
function degreeImageOpen() {
    selectedImageIndex.value = 0;
    degree360ViewOn.value = true;
    degree360NoteOn.value = true;
    // 1.5초 후 자동 사라짐 처리 
    setTimeout(() => {
        degree360NoteOn.value = false;
    }, 1500);
}
function degreeImageClose() {
    degree360ViewOn.value = false;            
}
/**
 * 래플 응모 이벤트
 */
function applyRaffle() {
    if (!isUser.value) {
        return mmon.bom.confirm("로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?", (flag: boolean) => {
            if (flag) {
                router.push({
                    name: "Login",
                    query: {
                        redirect_to_after: route.path,
                    },
                });
            }
        });
    }   
    if (user.value && !user.value.isCertificated) {
        return mmon.bom.confirm('본인인증 완료 후 응모 가능합니다.\n본인인증을 진행하시겠습니까?',
            async (flag: boolean) => {
                if (!flag) return;
                try {
                    const { identityProfile } = await useIdentityVerification('width=643px, height=593px, resizble=no, scrollbars=yes', false);
                    await certificateRepository.certificateConfirmUser(identityProfile.token);
                    await useRefreshUser();
                } catch (e) {
                    defaultCatch(e);
                }
            }
        )
    }

    useModal().open(Entry, {
        title: '응모하기',
        name: 'RaffleEntry',
        itemClass: 'm_modal-raffle-entry',
        props: async() => {                    
            const userInfo = await raffleRepository.userInfoForEntry(raffle.value.id);
            return {
                raffleId: raffle.value.id,
                userInfo
            }
        },
        onClose: () => {
            raffle.value.isEntry = true;
        }
    });
}      
async function winningResultHandler() {
    if (!isUser.value) {
        return mmon.bom.confirm("로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?", (flag: boolean) => {
            if (flag) {
                router.push({
                    name: 'Login',
                    query: {
                        redirect_to_after: route.path,
                    },
                });
            }
        });
    }
    
    if (!raffle.value) {
        return;
    }
    
    try {   
        const winningResult = await raffleRepository.winningResult(raffle.value.id);
        useModal().open(WinningResult, {
            title: '당첨 결과 확인',
            name: 'WinningResult',
            props: {         
                raffle: {
                    id: raffle.value.id,
                    buyStartAt: raffle.value.buyStartAt,
                    buyEndAt: raffle.value.buyEndAt,
                    goods: {
                        id : raffle.value.goodsId,
                        name: goodsBasicInfo.value.goods.name,
                        brandName: goodsBasicInfo.value.goods.brandName,
                        thumbnailUrl: goodsMainThumbnailImage.value
                    }
                },
                winningResult
            }
        });
    } catch (error) {
        defaultCatch(error);
    } 
}
const couponList = ref<DownLoadCoupon[]>([]);
const { getFolders } = useGoodsWish();
/** 다운로드 쿠폰 조회  */
async function getDownLoadCoupons() {
    mmon.loading.show()
    try {
        couponList.value = await goodsRepository.couponList(goodsId.value)
    } catch (error) {
        defaultCatch(error)
    } finally {
        mmon.loading.hide()
    }
}
/** 좋아요 처리  */        
async function toggleWished(isOn: boolean) {
    if (!isUser.value) {
        return mmon.bom.confirm("로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?", (flag: boolean) => {
            if (flag) {
                router.push({
                    name: "Login",
                    query: {
                        redirect_to_after: route.path,
                    },
                });
            }
        });
    }
                
    if (!isOn) {
        useModal().open(AddWished, {
            name: 'like',
            title: '폴더 선택하기',        
            props: async () => {
                return {
                    goodsId: goodsId.value,
                    folders: await getFolders()
                }
            },
            onClose: () => {
                isWished.value = true;
            }
        })
    } else {
        isWished.value = !isOn;
        await wishRepository.deleteWishGoods([goodsId.value]);
    }   
}
        
/** END FUNC */
/** VUE LIFE CYCLE */



onMounted(async() => {       
    window.scrollTo(0,0);
    try {
        if (isRaffle.value && raffle.value !== undefined) {
            if (isUser.value 
                && raffle.value.isEnd 
                && raffle.value.isEntry
                && raffle.value.isConfirmedWinner
            ) {
                const { isPurchaseAble, maxOrderAbleCount }= await raffleRepository.getUserBuyable(raffle.value.id)
                isRaffleBuyAble.value = isPurchaseAble
                raffleMaxOrderAbleCount.value = maxOrderAbleCount
            }
            // 발표시간 체크
            isNoticeLabel.value = moment().diff(raffle.value.noticeAt, 'seconds') > 0 ? `당첨자 추첨 진행중` : `${formatDate(raffle.value.noticeAt, 'MM.DD (ddd) HH시 mm분', true)} 당첨자 발표 예정`;
            // 디바이스 이용 가능 여부
            isAvailableDevice.value =  raffle.value.availableDeviceList.find(device => device === 'PC') ? true : false;
            if (!isAvailableDevice.value) {
                const deviceList = raffle.value.availableDeviceList.filter(
                    (device) => {
                        return device !== "PC";
                    }
                );
                // 이용 가능 디바이스가 한개일 경우
                if (deviceList.length === 1) {
                    return availableDeviceLabel.value = `${AVAILABLE_RAFFLE_DEVICE[deviceList[0]]}에서만 응모 가능`;
                }
                // 그 외
                return availableDeviceLabel.value =  `모바일에서만 응모 가능`;
            }
        }
        if (
            goodsOptions.value.length === 1 
            && goodsOptions.value[0].subOptions.length === 1 
            && !isSoldout.value
        ) {
            isSingleOption.value = true;
            const subOption = goodsOptions.value[0].subOptions[0];
            selectedOptions.value.push({
                code: subOption.id,
                optionName: goodsOptions.value[0].name,
                subOptionName: subOption.name,
                stock: subOption.stock,
                buyAmount : 1,
                optionPrice: 0,
                goodsPrice: buyGoodsPrice.value
            });
        }

        useViewGoods({
            account: 'base',
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            userMail: user?.value?.loginId,
            goodsId: goodsId.value,
            goodsName: goodsBasicInfo.value.goods.name,
            listPrice: goodsPromotion.value.price,
            sellPrice: goodsPromotion.value.sellPrice,
            discountedPrice: goodsPromotion.value.baseDiscountedPrice,
            imageUrls: goodsBasicInfo.value.goods.thumbnailUrls,
            categoryFullPath: goodsBasicInfo.value.goods.category.fullLabel,
            isSoldout: goodsBasicInfo.value.goods.isSoldout,
            categoryCode: goodsBasicInfo.value.goods.category.depth3Code,
            brandName: goodsBasicInfo.value.goods.brandName            
        });

    } catch (error) {
        return defaultCatch(error, {
            404: '존재하지 않는 상품 입니다.',
            500: '상품 조회에 실패하였습니다.'
        });
    } finally {
        mmon.loading.hide();
    }
    if (isUser.value && route.name === 'GoodsDetail') {
        const { wished, writableReview } = await goodsRepository.me(goodsId.value);
        isWished.value = wished;
        isWritableReview.value = writableReview;
    }
   
    if (!isSoldout.value) {
        soldoutOptions.value = goodsOptions.value.map((options) => {
            return {
                name: options.name,
                subOptions : options.subOptions.filter((subOption) => {
                    return subOption.stock < 1;
                }),
                isSelectAble: true
            }
        }).filter((options) => {
            return options.subOptions.length >= 1
        });
    }

    if (totalStock.value < 6 && stockClockElement.value) {
        const clockElement = stockClockElement.value.querySelector('.ico_clock');
        if (clockElement)  { 
            gsap.fromTo(clockElement, { rotate: -15 }, { rotate: 15, duration: 0.05, ease: 'linear.none', yoyo: true, yoyoEase: 'linear.none', repeat: 100 });
            gsap.to(clockElement, { scale: 1.4, duration: 0.4, delay: 0.5, ease: 'bounce.out', yoyo: true, repeat: 5, yoyoEase: 'back.in',
                onComplete: function () {
                    gsap.to(stockClockElement.value, { autoAlpha: 0, height: 0, y: 0, duration: 0.4, delay: 2, ease: 'cubic.inOut' });
                },
            });
        }
    }
});    
</script>
