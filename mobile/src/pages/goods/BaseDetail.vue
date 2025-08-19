<template>
    <MMSub>
        <template #headerTitle>
            <h1 class="mm_ir-blind">
                <b>상품상세</b>
            </h1>
        </template>
        <template #contents>            
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div v-if="goodsBasicInfo" class="m_prodetail">
                            <!-- 상품상세 상단 -->
                            <div class="m_prodetail-head">
                                <slot name="headContents" />
                                <template v-if="!isRaffle">
                                    <!-- 품절임박 -->
                                    <!-- (D) 품절임박 상품 일 때만 노출합니다. -->
                                    <p v-if="!isSoldout && totalStock < 6" ref="stockClockElement" class="m_prodetail-head-stock">
                                        <i class="ico_clock" />
                                        <strong>품절임박</strong>서두르세요!<span>남은수량</span>
                                        <strong>{{ totalStock }}<sub>개</sub></strong>
                                    </p>
                                    <!--// 품절임박 -->
                                    <!-- 품절 -->
                                    <p v-if="isSoldout" class="m_prodetail-head-soldout">
                                        SOLD OUT
                                    </p>
                                    <!--// 품절 -->
                                    <!-- 상품정보 -->
                                    <div class="m_prodetail-head-product">
                                        <!-- 상품이미지 -->
                                        <Carousel
                                            :use-pagination="true"
                                            :items="goodsBasicInfo.goods.thumbnailUrls"
                                            :carousel-data="{
                                                _effect: 'cover',
                                                _autoDelay: 4,
                                                _isMoreSide: true,                                                
                                                _isErrorRemove: true
                                            }"
                                        >
                                            <template #item="{ item }">
                                                <i
                                                    v-lazyload="{ src : item, errorCallback: errorImageCallback }" 
                                                    :data-lazyload="`{ '_src' : '${item}'}`"
                                                    class="mm_bg-contain"
                                                />
                                            </template>
                                        </Carousel>
                                        <!-- 360도 뷰 -->
                                        <a v-if="goodsBasicInfo.goods.degree360ImageUrls.length > 0" class="btn_multiangle-view" href="#DEGREE_360_IMAGES"><i class="ico_multiangle" /><b class="mm_ir-blind">360도 뷰</b></a>
                                        <!--// 360도 뷰 -->
                                        <!--// 상품이미지 -->
                                        <div class="m...product-info">
                                            <p v-if="aggregateInfo && aggregateInfo.totalReviewCount > 0" class="text_star">
                                                <i class="ico_star-fill" title="별점" />
                                                <span>{{ aggregateInfo.reviewAverageStars }}</span>
                                                <button type="button" class="btn_review" @click="focusReviewTab">
                                                    <b>리뷰{{ aggregateInfo.totalReviewCount }}개 보기</b>
                                                </button>
                                            </p>
                                            <slot name="productInfoContents" />                                                                
                                        </div>
                                    </div>
                                </template>
                                <!--// 상품정보 -->
                                <div class="mm_inner">
                                    <!-- 할인정보 -->
                                    <div class="m_prodetail-head-benefit">
                                        <div v-if="!isRaffle && goodsPromotion.isDownloadAbleCoupon && isUser && !isJointPurchase" class="m...benefit-coupon">
                                            <p>{{ shopName }} 쇼핑몰 고객을 위한 혜택</p>
                                            <a                                                
                                                class="btn_coupon"
                                                href="#GOODS_DETAIL_DOWNLOADABLE_COUPON"
                                            >
                                                <b>쿠폰 받기<i class="ico_coupon-download" /></b>
                                            </a>
                                            <!-- (D) 쿠폰 다운이 완료된 경우에 노출합니다. -->
                                            <!-- <a class="btn_coupon T=coupon-complete"><b>쿠폰받기 완료<i class="ico_coupon-complete"></i></b></a> -->
                                        </div>
                                        <div :class="['mm_dropdown', priceAreaDropDownClass]" data-dropdown>
                                            <button
                                                type="button"
                                                class="btn_dropdown mm_flex"
                                                :title="priceAreaDropDownClass === 'S=on' ? '접어두기' : '펼처보기'"
                                                @click="
                                                    () => {
                                                        priceAreaDropDownClass =
                                                            priceAreaDropDownClass === 'S=on' ? '' : 'S=on';
                                                    }
                                                "
                                            >
                                                <b>{{ isJointPurchase ? '공동구매 할인가' : '최대 할인가' }}</b>
                                                <b class="text_price">
                                                    <strong>
                                                        {{ MMFilters.formatNumber(goodsPromotion.maxDiscountedPrice) }}
                                                    </strong>
                                                </b>
                                                <i class="ico_dropdown" />
                                            </button>
                                            <div
                                                class="mm_dropdown-item"
                                                :style="priceAreaDropDownClass == 'S=on' ? { height: 'auto' } : {}"
                                            >
                                                <div class="mm_dropdown-item-inner">
                                                    <div class="m...benefit-detail">
                                                        <h4><b>비회원</b></h4>
                                                        <dl>
                                                            <dt>판매가</dt>
                                                            <dd class="text_price">
                                                                <span> {{ MMFilters.formatNumber(goodsPromotion.sellPrice) }}</span>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                    <div class="m...benefit-detail">
                                                        <h4><b>회원혜택</b></h4>
                                                        <dl v-if="goodsPromotion.sellPrice - goodsPromotion.baseDiscountedPrice > 0">
                                                            <dt>상품쿠폰</dt>
                                                            <dd class="text_price">
                                                                <span>
                                                                    -
                                                                    {{
                                                                        MMFilters.formatNumber(
                                                                            goodsPromotion.sellPrice -
                                                                                goodsPromotion.baseDiscountedPrice
                                                                        )
                                                                    }}
                                                                </span>
                                                            </dd>
                                                        </dl>
                                                        <template v-if="!isJointPurchase">
                                                            <dl v-if="goodsPromotion.nightDiscountedPrice > 0">
                                                                <dt>심야할인</dt>
                                                                <dd class="text_price">
                                                                    <span>
                                                                        -
                                                                        {{
                                                                            MMFilters.formatNumber(
                                                                                goodsPromotion.nightDiscountedPrice
                                                                            )
                                                                        }}
                                                                    </span>
                                                                </dd>
                                                            </dl>
                                                            <dl v-if="goodsPromotion.couponDiscountedPrice > 0">
                                                                <dt>다운로드쿠폰</dt>
                                                                <dd class="text_price">
                                                                    <span> - {{ MMFilters.formatNumber(goodsPromotion.couponDiscountedPrice) }}</span>
                                                                </dd>
                                                            </dl>
                                                            <dl v-if="goodsPromotion.immediatelyDiscountedPrice > 0">
                                                                <dt>즉시할인</dt>
                                                                <dd class="text_price">
                                                                    <span>
                                                                        -
                                                                        {{
                                                                            MMFilters.formatNumber(
                                                                                goodsPromotion.immediatelyDiscountedPrice
                                                                            )
                                                                        }}
                                                                    </span>
                                                                </dd>
                                                            </dl>
                                                        </template>
                                                        <dl v-if="isJointPurchase && jointPurchase.saleRate > 0">
                                                            <dt>공동구매 쿠폰 할인</dt>
                                                            <dd class="text_price">
                                                                <span>
                                                                    -
                                                                    {{
                                                                        MMFilters.formatNumber(
                                                                            jointPurchase.discountedPrice
                                                                        )
                                                                    }}
                                                                </span>
                                                            </dd>
                                                        </dl>
                                                        <dl>
                                                            <dt>회원 혜택가</dt>
                                                            <dd class="text_price">
                                                                <span>
                                                                    {{
                                                                        MMFilters.formatNumber(
                                                                            isJointPurchase ? (goodsPromotion.baseDiscountedPrice - jointPurchase.discountedPrice) : goodsPromotion.maxDiscountedPrice
                                                                        )
                                                                    }}
                                                                </span>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                    <div class="mm_note">
                                                        <ul>
                                                            <li>현재 최대 할인가의 금액 기준은 할인 혜택이 적용된 금액이며 일부는 회원에게만 적용될 수 있습니다.</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!--// 할인정보 -->

                                    <!-- 배송정보 및 혜택 -->
                                    <div class="m_prodetail-head-info">
                                        <dl v-if="goodsPromotion.welcome">
                                            <dt>신규회원</dt>
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
                                                배송비
                                                {{ MMFilters.formatNumber(goodsBasicInfo.deliveryInfo.price) }}원
                                                {{ goodsBasicInfo.deliveryInfo.isPackageDelivery ? "" : "(개별 부과)" }}
                                            </dd>
                                            <dd v-if="goodsBasicInfo.deliveryInfo.isConditionalFreeDelivery">
                                                무료배송 조건 {{ MMFilters.formatNumber(goodsBasicInfo.deliveryInfo.conditionalFreePrice) }}원~
                                            </dd>
                                            <dd>
                                                도서산간지역
                                                {{ MMFilters.formatNumber(goodsBasicInfo.deliveryInfo.extraPrice) }}원
                                            </dd>
                                            <!-- (D) 주문제작 상품인 경우 노출합니다 -->
                                            <template v-if="goodsBasicInfo.goods.isCustomMade">
                                                <dd>
                                                    배송기간
                                                    {{ goodsBasicInfo.deliveryInfo.customMadeDeliveryDay }}일
                                                </dd>
                                                <dd>주문 제작 상품 교환/반품 불가합니다</dd>
                                            </template>
                                            <!-- (D) 해외배송 상품인 경우 노출합니다 -->
                                            <template v-if="goodsBasicInfo.goods.isOverSeaDelivery">
                                                <dd>해외배송 상품</dd>
                                                <dd>
                                                    배송기간
                                                    {{ goodsBasicInfo.deliveryInfo.overseaDeliveryMin }}
                                                    ~
                                                    {{ goodsBasicInfo.deliveryInfo.overseaDeliveryMax }}일
                                                </dd>
                                            </template>
                                        </dl>
                                        <!-- 배송 도착 확률(유료) -->
                                        <div
                                            v-if="
                                                isCommonGoodsDetail 
                                                    && goodsBasicInfo.deliveryInfo.arrivalProbabilityList.length > 0 
                                                    && goodsBasicInfo.deliveryInfo.arrivalProbability
                                            "
                                            class="m...info-ship"
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
                                            <div class="m...info-ship-tooltip">
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
                                            <p class="text_note">
                                                {{ goodsBasicInfo.deliveryInfo.exportableMessage }}
                                            </p>
                                        </div>
                                        <!-- //배송 도착 확률(유료) -->
                                        <dl v-if="installmentTitle !== ''">
                                            <dt>혜택</dt>
                                            <dd>
                                                <a href="#CARD_BENEFIT"><span>{{ installmentTitle }}</span><i class="ico_help-fill" /></a>
                                            </dd>
                                        </dl>
                                        <!-- (D) 예약판매 상품인 경우 입력한 예약판매 스케줄을 노출합니다. -->
                                        <dl v-if="goodsBasicInfo.goods.saleReserve !== undefined && goodsBasicInfo.goods.saleReserve !== null">
                                            <dt>예약배송</dt>
                                            <dd v-if="!isAfterDate(goodsBasicInfo.goods.saleReserve.sellEndAt)">
                                                <p><span>예약판매 기간</span>{{ goodsBasicInfo.goods.saleReserve.sellStartAt }} ~ {{ goodsBasicInfo.goods.saleReserve.sellEndAt }}</p>
                                            </dd>
                                            <dd><p><span>예약배송 기간</span>{{ goodsBasicInfo.goods.saleReserve.shipStartAt }} ~ {{ goodsBasicInfo.goods.saleReserve.shipEndAt }}</p></dd>
                                        </dl>
                                        <dl v-if="isRaffle && raffle" class="m...info-raffle">
                                            <dt>래플</dt>
                                            <dd>응모기간<br>{{ MMFilters.formatDate(raffle?.startAt, 'MM.DD(ddd) HH시 mm분', true) }} ~ {{ MMFilters.formatDate(raffle?.endAt, 'MM.DD(ddd) HH시 mm분', true) }}</dd>
                                            <dd>당첨자 발표일<br>{{ MMFilters.formatDate(raffle?.noticeAt, 'MM.DD(ddd) HH시 mm분', true) }}</dd>
                                            <dd>당첨자 구매기간<br>{{ MMFilters.formatDate(raffle?.buyStartAt, 'MM.DD(ddd) HH시 mm분', true) }} ~ {{ MMFilters.formatDate(raffle?.buyEndAt, 'MM.DD(ddd) HH시 mm분', true) }}</dd>
                                            <dd>당첨 예정자 수<br>{{ MMFilters.formatNumber(raffle?.limitWinner) }}명</dd>
                                        </dl>
                                        <dl v-if="isJointPurchase && jointPurchase" class="m...info-coopbuy">
                                            <dt>공동구매</dt>
                                            <dd>
                                                공동구매 기간
                                                <br>
                                                {{ MMFilters.formatDate(jointPurchase.startAt, 'YYYY.MM.DD HH시 mm분') }} ~ {{ MMFilters.formatDate(jointPurchase.endAt, 'YYYY.MM.DD HH시 mm분') }}
                                            </dd>
                                            <dd>
                                                목표인원
                                                <br>
                                                {{ MMFilters.formatNumber(jointPurchase.targetCount) }}명
                                            </dd>
                                            <dd>
                                                쿠폰사용 기간
                                                <br>
                                                {{ jointPurchase.couponExpirationDateMessage }}
                                            </dd>
                                        </dl>
                                        <a 
                                            v-if="goodsBasicInfo.giveaways.length > 0"
                                            class="btn_gift" 
                                            href="#GIVE_AWAY"
                                        >
                                            <span>GIFT</span><b>구매 고객을 위한 <strong>사은품을 확인해보세요</strong></b><i class="ico_link" />
                                        </a>
                                    </div>
                                    <!--// 배송정보 및 혜택 -->
                                    <MMLink 
                                        v-if="goodsBasicInfo.isUseSellerShop && isCommonGoodsDetail" 
                                        class="btn_seller" 
                                        :to="{ name: 'GoodsSellerIndex', params: { id : goodsBasicInfo.goods.sellerId }}"
                                    >
                                        <b>판매자의 다른 상품 더보기</b><i class="ico_link" />
                                    </MMLink>
                                </div>
                                <!-- 찜/공유하기 -->
                                <div class="m_prodetail-head-like">
                                    <div class="mm_flex T=equal">
                                        <button v-if="isShowLikeBtn" type="button" :class="['btn_like', { 'S=switch-on' : isLiked}]" data-switch @click="toggleWished">
                                            <i class="ico_like" />
                                            <b>
                                                찜
                                                <span>
                                                    {{ MMFilters.formatNumber(aggregateInfo.totalWishCount) }}
                                                </span>
                                            </b>
                                        </button>
                                        
                                        <button type="button" class="btn_sns-share" @click="shareDimOpen($event, goodsBasicInfo.goods.name, `#${goodsBasicInfo.goods.brandName}#${goodsBasicInfo.goods.name}`, goodsBasicInfo.goods.thumbnailUrl); isShowSharedSns = true;">
                                            <i class="ico_share" />
                                            <b>공유하기</b>
                                        </button>
                                    </div>
                                </div>
                                <!--// 찜/공유하기 -->

                                <!-- 추천 아이템: 세트상품리스트 -->
                                <slot name="packageGoods" />
                                <!--// 추천 아이템 -->
                            </div>
                            <!--// 상품상세 상단 -->

                            <!-- 공동구매 진행 단계 -->
                            <section v-if="isJointPurchase" class="m_prodetail-coopbuy-process">
                                <h3><strong>공동구매</strong><b>진행 단계</b></h3>
                                <ol>
                                    <li>
                                        <i class="ico_coopbuy-join" />
                                        <dl>
                                            <dt>참여</dt>
                                            <dd>'공동구매 참여' 버튼을 클릭합니다.</dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <i class="ico_coopbuy-goal" />
                                        <dl>
                                            <dt>달성</dt>
                                            <dd>설정된 목표 수를 달성하면</dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <i class="ico_coopbuy-coupon" />
                                        <dl>
                                            <dt>발급</dt>
                                            <dd>할인쿠폰이 자동으로 발급됩니다.</dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <i class="ico_coopbuy-buy" />
                                        <dl>
                                            <dt>구매</dt>
                                            <dd>공동구매가로 상품을 구매할 수<br> 있습니다.</dd>
                                        </dl>
                                    </li>
                                </ol>
                            </section>
                            <!--// 공동구매 진행 단계 -->
                            <div ref="tabContainer" :class="['m_prodetail-tab']">
                                <!-- 상품상세 탭 -->
                                <div :class="['mm_tab_menu', tabClass]">
                                    <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                                    <ul v-if="goodsInfoTabList.length > 1" class="mm_flex T=equal">
                                        <li v-for="(tab, index) in goodsInfoTabList" :key="index">
                                            <button                                                
                                                :class="[
                                                    'btn_tab',
                                                    {
                                                        'S=tab-on': goodsInfoTabIndex === index,
                                                    },
                                                ]"
                                                :title="goodsInfoTabIndex === index ? '선택됨' : ''"
                                                @click="tabChange(index)"                                                
                                            >
                                                <b>{{ tab.name }}</b>
                                                <small v-if="tab.useCount">{{ tab.contentCount }}</small>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <!--// 상품정보 탭 -->
                                <keep-alive>
                                    <component
                                        :is="currentTabComponent.component"
                                        v-scrollTabSticky="{
                                            handleBuyButton: handleBuyButtonSticky,
                                            handleTab: handleTabSticky,
                                        }"
                                        :goods-id="goodsId"
                                        v-bind="currentTabComponent.data"
                                        @information-set="informationSet"
                                    />
                                </keep-alive>                                
                                <!-- 상세정보 -->
                                <!--// 상세정보  -->
                            </div>
                            <div class="m_prodetail-foot">
                                <!-- 인기 상품 -->
                                <slot name="brandBestGoods" />
                                <!--// 인기 상품 -->
                                <!-- 추천 상품 -->
                                <slot name="categoryBestGoods" />
                                <!-- // 추천 상품 -->
                                <div class="mm_accordion m_prodetail-info">
                                    <ul>
                                        <li>
                                            <dl
                                                :class="['mm_dropdown', { 'S=on' : goodsAddInfoDropDownOn }]"
                                                data-dropdown
                                                @click="() => { goodsAddInfoDropDownOn = !goodsAddInfoDropDownOn }"
                                            >
                                                <dt class="btn_dropdown" tabindex="0" :title="goodsAddInfoDropDownOn ? '접어두기' : '펼쳐보기' ">
                                                    <p><b>일반 상품 정보</b></p><i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="goodsAddInfoDropDownOn ? { height : 'auto' } : {}">
                                                    <div class="mm_dropdown-item-inner">
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <b>상품번호</b>
                                                                    </th>
                                                                    <td>{{ goodsId }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <b>상품상태</b>
                                                                    </th>
                                                                    <td>{{ goodsDetailInformation?.useStateLabel }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <b>브랜드</b>
                                                                    </th>
                                                                    <td>{{ goodsBasicInfo.goods.brandName }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="row">
                                                                        <b>원산지</b>
                                                                    </th>
                                                                    <td>{{ goodsDetailInformation?.originLabel }}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                        <li>
                                            <dl :class="['mm_dropdown', { 'S=on' : mandatoryDropDownOn }]" data-dropdown @click="() => { mandatoryDropDownOn = !mandatoryDropDownOn }">
                                                <dt class="btn_dropdown" tabindex="0" :title="mandatoryDropDownOn ? '펼쳐보기' : '접어두기'">
                                                    <p><b>상품정보고시</b></p>
                                                    <i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="mandatoryDropDownOn ? { height : 'auto' } : {}">
                                                    <div class="mm_dropdown-item-inner">
                                                        <table>
                                                            <tbody>
                                                                <tr v-for="mandatory in goodsDetailInformation?.mandatory" :key="mandatory.title"> 
                                                                    <th scope="row">
                                                                        <b>{{ mandatory.title }}</b>
                                                                    </th>
                                                                    <td>{{ mandatory.content }}</td>
                                                                </tr>                                                                
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>
            <div
                v-if="goodsBasicInfo"
                ref="optionElement"
                :class="['m_product-option', { 'S=option-open': optionOpen }, { 'T=option-single' : isSingleOption}]"                
            >
                <button
                    type="button"
                    class="btn_option-close"
                    @click="
                        () => {
                            optionOpen = false;
                        }
                    "
                >
                    <i class="ico_toast" />
                    <b class="mm_ir-blind">옵션선택 닫기</b>
                </button>
                <MmOptions
                    v-if="!isSingleOption"
                    :options="goodsOptions"
                    :goods-price="buyGoodsPrice"
                    :selected-options="selectedOptions"
                    :is-partial-soldout="isPartialSoldout"
                    :use-restock-notify="goodsBasicInfo.isUseStockNotify"
                    @add:options="addSelectedOption"
                    @restock-modal-open="restockModalOpen"
                />
                <!--// 옵션 목록 -->
                <!-- 선택된 옵션 -->
                <MmOptionsSelected
                    :is-single-option="isSingleOption"
                    :selected-options="selectedOptions"
                    :goods-name="goodsBasicInfo.goods.name"
                    :is-joint-purchase="isJointPurchase"
                    @remove:options="removeSelectedOption"
                />
                <!--// 선택된 옵션 -->
                <div class="m_product-option-foot">
                    <div v-if="isJointPurchase" class="mm_note">
                        <ul>
                            <li>공동구매에 참여한 사용자에 한하여 해당 가격으로 구매 가능합니다.</li>
                            <li>공동구매 쿠폰은 상품당 한 번만 사용 가능합니다.</li>
                        </ul>
                    </div>
                    <dl>
                        <dt>총 상품 금액</dt>
                        <dd class="text_price">
                            <strong class="mm_text-variable">{{ MMFilters.formatNumber(totalGoodsPrice) }}</strong>
                        </dd>
                    </dl>
                    <div class="mm_btn_box">
                        <div class="mm_flex T=equal">
                            <button v-if="!isJointPurchase" type="button" class="mm_btn T=line T=dark" @click="addCart">
                                <b>장바구니</b>
                            </button>
                            <template v-if="isJointPurchase && jointPurchase">
                                <button 
                                    v-if="!jointPurchase.isEnd"
                                    type="button" 
                                    class="mm_btn T=primary"
                                    @click="applyJointPurchase"
                                >
                                    <b>공동구매 참여</b>
                                </button>
                                <button v-if="jointPurchase.isEnd && jointPurchase.targetAchieveRate >= 100" type="button" class="mm_btn T=primary" @click="buy">
                                    <b>공동구매가로 구매</b>
                                </button>
                            </template>
                            <template v-else>
                                <button type="button" class="mm_btn T=primary" @click="buy">
                                    <b>구매하기</b>
                                </button>
                            </template>
                        </div>
                    </div>                 
                </div>
            </div>
            <!--// 옵션선택 -->
            <!-- 하단고정버튼 -->
            <div class="mm_btn_box T=fixed">
                <div v-if="isRaffle && raffle" class="mm_flex T=equal">
                    <template v-if="raffle.isEnd">
                        <template v-if="raffle.isBuyEnd">
                            <b 
                                class="btn_product-raffle T=disabled"
                            >래플 종료</b>
                        </template>
                        <template v-else>
                            <template v-if="!raffle.isConfirmedWinner || !raffle.isAfterNotice">
                                <b
                                    class="btn_product-raffle"
                                    v-text="isNoticeLabel"
                                />
                            </template>
                            <template v-else>
                                <a
                                    v-if="raffle.isBeforeBuyStart" 
                                    class="btn_product-raffle" 
                                    href="#" 
                                    @click.prevent="winningResultHandler"
                                >
                                    <b>당첨 결과 확인하기</b>
                                </a>
                                <button 
                                    v-else-if="isRaffleBuyAble" 
                                    type="button" 
                                    class="btn_product-buy" 
                                    @click="() => { optionOpen = true; }"
                                >
                                    <b>구매하기</b>
                                </button>
                                <button 
                                    v-else 
                                    type="button" 
                                    class="btn_product-buy" 
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
                                class="btn_product-raffle T=disabled"
                            >응모완료</b>
                            <a
                                v-else-if="isAvailableDevice" 
                                class="btn_product-raffle" 
                                href="#RAFFLE_ENTRY"               
                                @click.prevent="applyRaffle"
                            >
                                <b>응모하기</b>
                            </a>
                            <b 
                                v-else
                                v-text="availableDeviceLabel"
                            />
                        </template>
                        <template v-else>
                            <b class="btn_product-raffle">진행 예정</b>                                    
                        </template>
                    </template>                    
                </div>
                <div v-else class="mm_flex">                   
                    <template v-if="!goodsPromotion.purchaseAble">
                        <button type="button" class="btn_product-buy" disabled>
                            <b>구매불가</b>
                        </button> 
                    </template>
                    <template v-else>
                        <template v-if="isJointPurchase && jointPurchase">
                            <!-- (D) 진행중인 공동구매 상품에서 노출합니다. -->
                            <button 
                                v-if="jointPurchase.isEnd && jointPurchase.targetAchieveRate >= 100" 
                                type="button"
                                class="btn_product-buy"
                                :disabled="!jointPurchase.isPurchasable"
                                @click="() => { optionOpen = true; }"
                            >
                                <b>공동구매가로 구매하기</b>
                            </button>
                            <button 
                                v-if="jointPurchase.isEnd && jointPurchase.targetAchieveRate < 100" 
                                type="button"
                                class="btn_product-buy"
                                disabled                                
                            >
                                <b>공동구매 미달성</b>
                            </button>
                            <button 
                                v-if="!jointPurchase.isEnd" 
                                type="button" 
                                class="btn_product-buy"
                                @click="() => { optionOpen = true; }"
                            >
                                <b>공동구매 참여</b>
                            </button>
                        </template>
                        <template v-else>
                            <button type="button" :class="['btn_like btn_product-like', { 'S=switch-on' : isLiked}]" data-switch @click="toggleWished">
                                <i class="ico_like" />
                                <b class="mm_ir-blind">찜한 아이템에 추가하기</b>
                            </button>
                            <button
                                v-if="!isSoldout"
                                type="button"
                                class="btn_product-buy"
                                @click="() => { optionOpen = true; }"
                            >
                                <b>구매하기</b>
                            </button>   
                            <button v-else-if="!goodsBasicInfo.isUseStockNotify" class="btn_product-buy" disabled>
                                <b>품절</b>
                            </button>
                            <button v-else class="btn_restock" @click="restockModalOpen">
                                <b>재입고 알림받기</b>
                            </button>
                        </template>
                    </template>          
                </div>                
            </div>
            <!-- 타임딜 -->
            <div v-if="isTimeDeal" ref="timeDealEl" :class="['m_prodetail-timedeal', { 'S=switch-on': timeDealOff }]">
                <button type="button" class="btn_timedeal" data-switch="{ '_isParent': true, 'onChange': 'timeDealBarMotion' }" @click="handleTimeDealBanner">
                    <i class="ico_clock" /><b class="mm_ir-blind">타임특가</b>
                </button>
                <div class="mm_flex">
                    <p class="text_time" v-html="timerHtml" />
                    <!-- (D) 남은수량의 값이 영역을 넘어가는 경우에는 '9999+'로 텍스트가 대체됩니다. -->
                    <p class="mm_flex-equal text_stock">
                        남은수량<strong>{{ MMFilters.formatNumber(totalStock) }}</strong>
                    </p>
                    <button type="button" class="btn_close" @click="handleTimeDealBanner">
                        <i class="ico_close" /><b class="mm_ir-blind">닫기</b>
                    </button>
                </div>
            </div>
            <!--// 타임딜 -->
            <!--// 하단고정버튼 -->
            <SharedDim v-if="isShowSharedSns" @close="isShowSharedSns = false" />
            <div v-show="false" class="goods_tit">
                <span class="goods_brand_name">{{ goodsBasicInfo.goods.brandName }}</span>
            </div>
        </template>
    </MMSub>
</template>

<script setup lang="ts">
import { mmon } from "$/helper/mmon";
import { ref, computed, onMounted, defineAsyncComponent, DirectiveBinding, toRefs, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { countdown, defaultCatch, isAfterDate, isMobile } from "$/functions";
import { goodsRepository } from "$/repository/goodsRepository";
import { shoppingRepository } from "$/repository/shoppingRepository";
import { orderRepository } from "$/repository/order/orderRepository";
import { wishRepository } from '$/repository/member/wishRepository';
import { SelectedOption } from "$/@type/front";
import { GoodsOptions, GoodsBasicInfo, GoodsPricePromotion, AggregateReviewAndQna, GoodsInformation, OptionalReviewStatistics, TimeDeal } from '$/@type/goods';
import { CartOptions } from "$/@type/shopping";
import { use360DegreeImage, useGiveaways, useZoomLoaderRemoval } from "$/composables/goods/detailComposable";
import { useGlobalConfigs } from "$/composables/globalConfigComposable";
import { useSnsShared, useWishedGoods, useLikedGoods } from '$/composables/shoppingComposable';
import { JointPurchaseDetail } from "$/@type/jointPurchase";
import { jointPurchaseRepository } from "$/repository/jointPurchaseRepository";
import { formatDate, padLeft } from "$/filters";
import { EpCoupon } from "$/@type/coupon";
import { RaffleDetail } from "$/@type/raffle";
import { certificateRepository } from "$/repository/auth/certificateRepository";
import { useIdentityVerification } from "$/composables/auth/certificateComposable";
import { useRaffleModal } from "$/composables/raffleComposable";
import { raffleRepository } from "$/repository/raffleRepository";
import gsap from 'gsap';
import moment from 'moment';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useAddToCart, useViewGoods } from '$/composables/marketingComposable';
import { useUserState, useRefreshUser } from '$/composables/auth/userComposable';
import { useModal } from "$/composables/pageHandler/modalComposable";
import { AVAILABLE_RAFFLE_DEVICE } from "$/constants";
import { useTempOrder } from '$/composables/orderComposable';
import MMSub from '@/components/layout/Sub.vue';
import { useClosePopup } from '$/composables/popupComposable';
import { dropdown as vDropdown } from '$/directives';
import MMFooter from '@/components/Footer.vue';
import SharedDim from '@/components/SharedDim.vue';

const MmOptions = defineAsyncComponent(() => import('@/pages/goods/Options.vue'));
const MmOptionsSelected = defineAsyncComponent(() => import('@/pages/goods/SelectedOptions.vue'));
const Carousel = defineAsyncComponent(() => import('@/components/Carousel.vue'));

const vScrollTabSticky = {
    mounted(element: HTMLElement, binding: DirectiveBinding) {
        const config = {
            root: null,
            threshold: 0,
            rootMargin: `0px 0px -${(document.documentElement.clientHeight) - 45 - 48}px`,
        };

        const tabElementObserverEvent = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    binding.value.handleBuyButton(false);
                    binding.value.handleTab(true);
                } else {
                    binding.value.handleTab(false);
                }

                if (entry.intersectionRatio === 0 && entry.boundingClientRect.y < 0) {
                    binding.value.handleTab(false);
                    binding.value.handleBuyButton(true);
                }
            });
        }, config);

        tabElementObserverEvent.observe(element);
    },
}

const props = withDefaults(defineProps<{
    goodsId: number
    goodsBasicInfo: GoodsBasicInfo
    goodsPromotion: GoodsPricePromotion
    goodsOptions: GoodsOptions[]      
    aggregateInfo?: AggregateReviewAndQna
    optionalReviewInfo?: OptionalReviewStatistics[]
    installmentTitle: string
    isSoldout: boolean
    totalStock: number
    isJointPurchase?: boolean
    jointPurchase?: JointPurchaseDetail
    isTimeDeal?: boolean
    isRaffle?: boolean
    raffle?: RaffleDetail
}>(), {
    goodsOptions: () => [],
    optionalReviewInfo: () => [],
    aggregateInfo: undefined,
    jointPurchase: undefined,
    isJointPurchase: false,
    isTimeDeal: false,
    isRaffle: false,
    raffle: undefined
})

const route = useRoute();
const router = useRouter();
const { globalConfigs } = useGlobalConfigs();
        
const epModalComponent = defineAsyncComponent(() => import('@/components/modal/goods/EpCoupon.vue'));
const restockComponent = defineAsyncComponent(() => import('@/components/modal/goods/Restock.vue'));
const { shareDimOpen } = useSnsShared();
const isShowSharedSns = ref(false);
const tabContainer = ref<null|HTMLElement>(null);
const isRaffleBuyAble = ref(false);
const raffleMaxOrderAbleCount = ref(0);
const winningResultModalComponent = defineAsyncComponent(() => import('@/components/modal/raffle/WinningResult.vue'));
const isNoticeLabel = ref('');
const isAvailableDevice = ref(false);
const availableDeviceLabel = ref('');
const isPartialSoldout = computed(() => {
    return soldoutOptions.value.length > 0
})
// 찜하기버튼 노출 여부(래플/공동구매 상세 페이지 미노출)
const isShowLikeBtn = computed(() => {
    return !isRaffle.value && !isJointPurchase.value
})

const optionElement = ref<HTMLElement|null>(null);
const stockClockElement = ref<HTMLElement|null>(null);
const soldoutOptions = ref<GoodsOptions[]>([]);
const { isShowPopup } = useClosePopup()
const { removeCloneImage } = useZoomLoaderRemoval();
/**
 * 순수 상품 데이터
 */
const selectedOptions = ref<SelectedOption[]>([]);
        
const {      
    goodsBasicInfo,       
    aggregateInfo,
    optionalReviewInfo, 
    goodsOptions,
    goodsPromotion,             
    installmentTitle, 
    isSoldout,             
    totalStock, 
    isJointPurchase, 
    jointPurchase,
    goodsId,
    isTimeDeal,
    isRaffle,
    raffle
} = toRefs(props);

usePageTitleSetting(goodsBasicInfo.value.goods.name);

const buyGoodsPrice = computed(() => {
    if (isUser.value === false) {
        return goodsPromotion.value.sellPrice
    }

    if (isJointPurchase.value && jointPurchase.value) {
        return goodsPromotion.value.baseDiscountedPrice - jointPurchase.value.discountedPrice
    }

    return goodsPromotion.value.maxDiscountedPrice + goodsPromotion.value.couponDiscountedPrice;
})

const goodsDetailInformation = ref<GoodsInformation>();        
const isSingleOption = ref(false);

// 같은 상품인경우 줌이미지 삭제 처리
watch(() => route.query, (current) => {
    if (current.same_p === 'Y') {
        removeCloneImage();
        const scroller = document.querySelector('.mm_scroller');
        if (scroller) {
            scroller.scrollTop = 0;
        }
    }
})
/**
 * 회원 연결된 데이터 항목
 */
        
// 회원 관련
const isLiked = ref(false);
const isWritableReview = ref(false);
const { user, isUser } = useUserState();

/**
 * 뷰 제어용 변수
 */
const priceAreaDropDownClass = ref('');
const optionOpen = ref(false);
const tabClass = ref('');
const goodsInfoTabIndex = ref(0);
const buyButtonSwitchOn = ref(false);
const buyButtonStickyClass = ref('');
const mandatoryDropDownOn = ref(false);
const goodsAddInfoDropDownOn = ref(false);
const timeDealOff = ref(false);
const timeDealEl = ref<HTMLElement|null>(null);
const timeDealInfo = ref<TimeDeal|null>(null);
const showProbabilityToolTip = ref(false);

/**
 * EP 쿠폰 
*/
const epCouponData = ref<EpCoupon>();
const currentRoute = route.name;
const goodsInfoTabList = computed(() => {
    if (currentRoute === 'GoodsDetail') {
        return  [
            {
                name: "상세정보",
                componentName: "Information",
                component: defineAsyncComponent(() => import("@/pages/goods/tab/Information.vue")),
                data: {},
                useCount: false,
                contentCount: 0,
                fetchData: () => {},
            },
            {
                name: '리뷰',
                componentName: "Review",
                component: defineAsyncComponent(() => import("@/pages/goods/tab/Review.vue")),
                data: {},
                useCount: true,
                contentCount: aggregateInfo.value !== undefined ? aggregateInfo.value.totalReviewCount : 0,
                fetchData: () => {
                    goodsInfoTabList.value[goodsInfoTabIndex.value].data = {
                        aggregateInfo: aggregateInfo.value,
                        optionalReviewInfo: optionalReviewInfo.value,
                        isWritableReview: isWritableReview.value
                    };
                },
            },
            {
                name: '상품 Q&A',
                componentName: "Qna",
                component: defineAsyncComponent(() => import("@/pages/goods/tab/Qna.vue")),
                data: {},
                useCount: true,
                contentCount: aggregateInfo.value !== undefined ? aggregateInfo.value.totalQnaCount : 0,
                fetchData: () => {                            
                    goodsInfoTabList.value[goodsInfoTabIndex.value].data = {
                        brandName: goodsBasicInfo.value?.goods.brandName || "",
                        brandTel: goodsBasicInfo.value?.returnDeliveryInfo.tel || "",
                        goods: {
                            name: goodsBasicInfo.value?.goods.name || "",
                            thumbnailUrl: goodsBasicInfo.value?.goods.thumbnailUrl || "",
                        },
                    };
                },
            },
            {
                name: "판매자 정보",
                componentName: "SellerInfo",
                load: false,
                component: defineAsyncComponent(() => import("@/pages/goods/tab/SellerInfo.vue")),
                data: {},
                useCount: false,
                contentCount: 0,
                fetchData: () => {
                    goodsInfoTabList.value[goodsInfoTabIndex.value].data = {
                        deliveryInfo: goodsBasicInfo.value?.deliveryInfo,
                        returnDeliveryInfo: goodsBasicInfo.value?.returnDeliveryInfo,
                        brandName: goodsBasicInfo.value?.goods.brandName || "",
                    };
                },
            },
        ]
    } else if (route.name === 'RaffleDetail') {
        return [
            {
                name: '상세정보',
                componentName: 'Information',
                component : defineAsyncComponent(() => import('@/pages/goods/tab/Information.vue')),
                oad: false,
                useCount: false,
                contentCount: 0,
                data : {},
                fetchData : () => {
                    goodsInfoTabList.value[goodsInfoTabIndex.value].data = {
                        brandName : goodsBasicInfo.value?.goods.brandName                 
                    }
                }
            },
            {
                name: '상품 Q&A',
                componentName: "Qna",
                component: defineAsyncComponent(() => import("@/pages/goods/tab/Qna.vue")),
                data: {},
                useCount: true,
                contentCount: aggregateInfo.value !== undefined ? aggregateInfo.value.totalQnaCount : 0,
                fetchData : () => {
                    goodsInfoTabList.value[goodsInfoTabIndex.value].data = {
                        brandName: goodsBasicInfo.value?.goods.brandName || '',
                        brandTel : goodsBasicInfo.value?.returnDeliveryInfo.tel || '',
                        goods: {
                            name: goodsBasicInfo.value?.goods.name || '',
                            thumbnailUrl : goodsBasicInfo.value?.goods.thumbnailUrl || '',
                        }
                    }
                }            
            },
            {
                name: '판매자 정보',
                componentName: 'SellerInfo',
                load: false,
                component : defineAsyncComponent(() => import('@/pages/goods/tab/SellerInfo.vue')),
                useCount: false,
                contentCount: 0,
                data: {},
                fetchData : () => {
                    goodsInfoTabList.value[goodsInfoTabIndex.value].data = {
                        deliveryInfo: goodsBasicInfo.value?.deliveryInfo,
                        returnDeliveryInfo : goodsBasicInfo.value?.returnDeliveryInfo,
                        brandName: goodsBasicInfo.value?.goods.brandName || '',
                    }
                }
            }
        ];
    } else {
        return [
            {
                name: "상세정보",
                componentName: "Information",
                component: defineAsyncComponent(() => import("@/pages/goods/tab/Information.vue")),
                data: {},
                load: false,
                useCount: false,
                contentCount: 0,
                fetchData: () => {},
            }
        ]
    }
});

/**
 * 컴포넌트 데이터 동기화 처리를 위한 computed
 */
const currentTabComponent = computed(() => {
    goodsInfoTabList.value[goodsInfoTabIndex.value].fetchData();
    return goodsInfoTabList.value[goodsInfoTabIndex.value];
});
/**
 * 전체 선택된 상품 금액
 */
const totalGoodsPrice = computed<number>(() => {
    let totalPrice = 0;
    selectedOptions.value.forEach((selected) => {
        totalPrice = totalPrice + selected.goodsPrice * selected.buyAmount;
    });

    return totalPrice;
});

/***************
 * 함수 정의 
 */
function handleTabSticky(isSticky: boolean) {
    const stickyClass = "S=tabmenu-sticky";
    const stickyEndClass = "S=tabmenu";
    tabClass.value = isSticky ? stickyClass : stickyEndClass;
}

/**
 * 하단 구매버튼 고정 핸들링 함수
 */
function handleBuyButtonSticky(isSticky: boolean) {
    if (isSticky) {
        buyButtonStickyClass.value = "S=buy-sticky";
    } else {
        buyButtonStickyClass.value = "";
        buyButtonSwitchOn.value = false;
    }
}

/**
 * 옵션 추가 처리
 */
function addSelectedOption(selectedOption: SelectedOption, isOptionsUseSelectBox: boolean) {
    if (isOptionsUseSelectBox && optionElement.value) {
        gsap.to(optionElement.value, { height: '75%', duration: 0.2})
    }
    selectedOptions.value.push(selectedOption);
}

/**
 * 선택된 옵션 삭체 처리
 */
function removeSelectedOption(optionCode: number) {
    selectedOptions.value = selectedOptions.value.filter(function (selectedOption) {
        return selectedOption.code !== optionCode;
    });

    if (selectedOptions.value.length === 0 && optionElement.value) {
        gsap.to(optionElement.value, { height: '' })
    }
}

/**
 * 장바구니 추가 함수
 */
async function addCart() {
    if (selectedOptions.value.length < 1) {
        return mmon.bom.alert("상품을 선택해주세요.");
    }
    mmon.loading.show();

    try {
        const addCartOptions: CartOptions[] = selectedOptions.value.map((selectedOption) => {
            return {
                option_id: selectedOption.code,
                ea: selectedOption.buyAmount,
            };
        });

        await shoppingRepository.addCart(addCartOptions);
        mmon.bom.confirm(
            "선택하신 상품을 장바구니에 담았습니다.\n장바구니로 이동하시겠습니까?",
            (isConfirm: boolean) => {
                if (isConfirm) {
                    router.push({
                        name: "Cart",
                    });
                }
            },
            {
                closeButtonLabel: "장바구니 가기",
                cancelButtonLabel: "쇼핑 계속하기",
            }
        );

        useAddToCart({
            account: 'base',
            isMobile: true,
            isTablet: false,
            isDesktop: false,
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

/**
 * 공동구매 참여
 */
async function applyJointPurchase() {
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
        return mmon.bom.alert('옵션을 선택해주세요.');
    }

    if (selectedOptions.value.length > 1) {
        return mmon.bom.alert('공동구매 상품은 1개만 구매할 수 있습니다.');
    }

    if (jointPurchase.value === null || selectedOptions.value[0].buyAmount > 1) {
        return mmon.bom.alert('공동구매 상품은 1개만 구매할 수 있습니다.');
    }

    if (!jointPurchase.value) {
        return;
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
async function buy() {
    if (selectedOptions.value.length < 1) {
        return mmon.bom.alert("상품을 선택해주세요.");
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
            
    if (
        isTimeDeal.value 
        && timeDealInfo.value !== null
        && timeDealInfo.value?.maxOrderAbleCount > 0
    ) {
        const sumBuyAmount = selectedOptions.value.reduce(
            (previousValue, currentValue) => previousValue + currentValue.buyAmount,
            0
        );

        if (sumBuyAmount > timeDealInfo.value?.maxOrderAbleCount  ) {
            return mmon.bom.alert(`타임딜 상품은 ${timeDealInfo.value?.maxOrderAbleCount}개만 구매할 수 있습니다.`);
        }
    }

    const orderData = selectedOptions.value.map(function (option) {
        return {
            option_id: option.code,
            ea: option.buyAmount,
        };
    });

    if (!isUser.value) {
        setTempOrder(orderData);
        return mmon.bom.confirm("로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?", (flag: boolean) => {
            if (flag) {
                router.push({
                    name: "Login",
                    query: {
                        redirect_to_after: "order",
                    },
                });
            }
        });
    }

    if(user?.value?.isCertificated === false) {
        setTempOrder(orderData);
        return router.push({
            name: "CertificationNeed",
            query: {
                redirect_to_after: "order",
            },
        });
    }
            
    mmon.loading.show();
    try {
        const tempOrderId = await orderRepository.tempOrderMake(orderData);
        router.push({
            name: "OrderIndex",
            params: {
                id: tempOrderId,
            },
        });
    } catch (e) {
        console.log(e);
    } finally {
        mmon.loading.hide();
    }
}
function tabChange(index: number) {
    goodsInfoTabIndex.value = index;
    goodsInfoTabList.value[goodsInfoTabIndex.value].load = true;
    if(tabContainer.value) {
        gsap.to(document.querySelector('.mm_scroller'), {
            "duration": 0.2,
            "ease": "sine.out",
            "scrollTop": (tabContainer.value as HTMLElement).offsetTop
        })
    }         
}

function focusReviewTab() {
    goodsInfoTabIndex.value = 1;
    goodsInfoTabList.value[goodsInfoTabIndex.value].load = true;
    if(tabContainer.value) {
        gsap.to(document.querySelector('.mm_scroller'), {
            "duration": 0.2,
            "ease": "sine.out",
            "scrollTop": (tabContainer.value as HTMLElement).offsetTop
        })
    }
}

function handleTimeDealBanner() {
    timeDealOff.value = !timeDealOff.value;
            
    if (timeDealEl.value === null) {
        return; 
    }

    const switchButton = timeDealEl.value.querySelector('.btn_timedeal');
    if (timeDealOff.value) {
        gsap.to(timeDealEl.value, { width: 46, duration: 0.2 });
        gsap.to(switchButton, { x: -7, duration: 0.2});
    } else {
        gsap.to(timeDealEl.value, { width: window.outerWidth - 28, duration: 0.2 });
        gsap.to(switchButton, { x: 0, duration: 0.2});
    }
}

const { setWishedGoodsId } = useWishedGoods();
const { setTempOrder } = useTempOrder();
/**
 * 찜하기 추가 
*/        
async function toggleWished() {
    if (isUser.value === false) {
        return mmon.bom.confirm('로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?', (isOn: boolean) => {
            if (isOn) {
                router.push({
                    name: 'Login',
                    query: {
                        redirect_to_after: route.path                                
                    }
                })               
            }
        })    
    }

    if (isLiked.value) {
        mmon.loading.show();
        try {
            await wishRepository.deleteWishGoods([goodsId.value]);        
            isLiked.value = false;
            if (aggregateInfo.value) {
                aggregateInfo.value.totalWishCount =  aggregateInfo.value.totalWishCount === 0 ? 0 : aggregateInfo.value.totalWishCount - 1;
            }
        } catch (error) {
            defaultCatch(error);
        } finally {
            mmon.loading.hide();
        }

        return;
    }
    setWishedGoodsId(goodsId.value);
    window.location.hash = '#WISHED_FOLDER';          
}

function informationSet(information: GoodsInformation) {
    goodsDetailInformation.value = information;
}

const { setImageUrls } = use360DegreeImage();
const { setGiveaways } = useGiveaways();
const shopName = ref(globalConfigs.value.shop.name);
const countDownTimer = ref<null|NodeJS.Timeout>(null);

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', hashChangeHandler);
    if (countDownTimer.value !== null) {
        clearInterval(countDownTimer.value);
    }
})

onMounted(async () => {
    mmon.loading.show();
    try {
        mmon.loading.hide();

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
                
        /**
         * 메인화면 밖 항목들
         */
        if (!isSoldout.value) {

            if (isCommonGoodsDetail.value) {
                (async () => {
                    epCouponData.value = await goodsRepository.getEpCoupon(goodsId.value);
                    if (epCouponData.value !== null && isShowPopup(`IS_NAVER_COUPON_HIDE_${goodsId.value}`) !== true) {
                        useModal().open(epModalComponent, {
                            title: `${ epCouponData.value?.siteLabel }`,
                            name: 'epCoupon',
                            itemClass: `m_modal-prod-coupon T=coupon-${epCouponData.value?.siteCode}`,
                            props: async() => {
                                return {
                                    goodsId: goodsId.value,
                                    epCoupon: epCouponData.value || {}
                                }
                            },
                        });
                    }
                })();
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

            if (isUser.value) {
                const { wished, writableReview } = await goodsRepository.me(goodsId.value);
                isLiked.value = wished;
                isWritableReview.value = writableReview;
            }
        }

        if (isTimeDeal.value) {
            timeDealInfo.value = await goodsRepository.getTimeDealInfo(goodsId.value);
            if (moment().diff(timeDealInfo.value.sellStartAt, 'seconds') < -60) {
                return mmon.bom.alert(`${formatDate(timeDealInfo.value.sellStartAt, 'MM.DD(ddd) HH시 mm분', true)}에 진행되는 타임딜 입니다.`, () => {
                    if (window.history.state.position === 0 && window.history.state.back == null && !location.hash) {
                        return router.replace("/");
                    }

                    router.go(-1);
                })
            }
            const hour = ref('');
            countDownTimer.value = countdown(`${timeDealInfo.value.sellEndAt}`, 's', (ms, diff) => {
                hour.value = String(diff.hour); 
                timerHtml.value = `<strong> ${padLeft(hour.value, 2, '0')}<span>:</span>${padLeft(`${diff.minute}`, 2, '0')}<span>:</span>${padLeft(`${diff.second}`, 2, '0')}</strong>`;
            }, true);
        }

        if (goodsBasicInfo.value !== undefined) {
            setImageUrls(goodsBasicInfo.value.goods.degree360ImageUrls);
            setGiveaways(goodsBasicInfo.value.giveaways);
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
        console.error(error);           
        return defaultCatch(error, {
            404: "존재하지 앖는 상품 입니다.",
            500: "상품 조회에 실패하였습니다.",
        });
    } finally {
        mmon.loading.hide();
        // zoom Image 제거
        removeCloneImage();
    }

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
        isNoticeLabel.value = moment().diff(raffle.value.noticeAt, 'seconds') > 0 ? `당첨자 추첨 진행중` : `${formatDate(raffle.value.noticeAt, 'MM.DD (ddd) HH:mm', true)} 당첨자 발표 예정`;

        // 디바이스 이용 가능 여부
        if (isMobile('app')) {
            isAvailableDevice.value = raffle.value.availableDeviceList.find(device => device === 'M_APP') ? true : false;
        } else {
            isAvailableDevice.value = raffle.value.availableDeviceList.find(device => device === 'M_WEB') ? true : false;
        }

        if (!isAvailableDevice.value) {
            const deviceList = raffle.value.availableDeviceList.filter(device => {
                const exceptDevice = isMobile('app') ? 'M_APP' : 'M_WEB';
                return device !== exceptDevice;
            }).sort();

            const firstDevice = deviceList[0];
            const secondDevice = deviceList[1];

            if (firstDevice !== undefined && secondDevice !== undefined) {
                return availableDeviceLabel.value = `${AVAILABLE_RAFFLE_DEVICE[firstDevice]}과 ${AVAILABLE_RAFFLE_DEVICE[secondDevice]}에서만 응모 가능`;
            }

            if (firstDevice !== undefined) {
                return availableDeviceLabel.value = `${AVAILABLE_RAFFLE_DEVICE[firstDevice]}에서만 응모 가능`;
            }

            return availableDeviceLabel.value = '';
        }
    }
    window.addEventListener('hashchange', hashChangeHandler);

    if (totalStock.value < 6 && stockClockElement.value) {
        const clockElement = stockClockElement.value.querySelector('.ico_clock');
        gsap.fromTo(clockElement, { rotate: -15 }, { rotate: 15, duration: 0.05, ease: 'linear.none', yoyo: true, yoyoEase: 'linear.none', repeat: 100 });
        gsap.to(clockElement, { scale: 1.4, duration: 0.4, delay: 0.5, ease: 'bounce.out', yoyo: true, repeat: 5, yoyoEase: 'back.in',
            onComplete: function () {

                gsap.to(stockClockElement.value, { autoAlpha: 0, height: 0, y: 0, duration: 0.4, delay: 2, ease: 'cubic.inOut' });

            },
        });
    }
});

function hashChangeHandler(event: HashChangeEvent) {
    const before = event.oldURL.split('#')[1] ?? '';
    // 응모한 경우 
    if (before === 'RAFFLE_ENTRY' && raffle.value) {
        if (isRaffleEntry.value && raffle.value.id === raffleId.value) {
            raffle.value.isEntry = true;
        }
    }

    if (before === 'WISHED_FOLDER' && aggregateInfo.value) {    
        const { isLiked: liked } = useLikedGoods(goodsId.value)
        if (liked.value) {
            isLiked.value = true;
            aggregateInfo.value.totalWishCount = aggregateInfo.value.totalWishCount + 1;
        }     
    }
}

const isCommonGoodsDetail = computed(() => {
    return route.name === 'GoodsDetail';
})

const timerHtml = ref('');
const { 
    raffleId,
    isRaffleEntry,
    setRaffleId,
} = useRaffleModal();

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

    if (raffle.value === undefined) {
        return;
    }

    if (user.value && user.value.isCertificated === true) {
        setRaffleId(raffle.value.id)
        location.href = '#RAFFLE_ENTRY';
        return;
    }

    mmon.bom.confirm('본인인증 완료 후 응모 가능합니다.\n본인인증을 진행하시겠습니까?',
        async (flag: boolean) => {
            if (!flag) return;

            try {
                const { identityProfile } = await useIdentityVerification();
                await certificateRepository.certificateConfirmUser(identityProfile.token);
                await useRefreshUser();
                if (raffle.value !== undefined) {
                    setRaffleId(raffle.value.id)
                    location.href = '#RAFFLE_ENTRY';
                }
            } catch (e) {
                defaultCatch(e);
            }
        }
    )            
}

/**
 * 당첨결과 보기 핸들러 함수 
 */
async function winningResultHandler() {
    if (!isUser.value) {
        return  mmon.bom.confirm('로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?',
            (flag: boolean) => {
                if (flag) {
                    router.push({
                        name: 'Login',
                        query: {
                            redirect_to_after: route.path
                        }
                    })
                }
            }
        );
    }
    
    if (!raffle.value) {
        return;
    }

    try {   
        const winningResult = await raffleRepository.winningResult(raffle.value.id);
        useModal().open(winningResultModalComponent, {
            title: '당첨 결과 확인',
            name: 'WinningResult',
            itemClass: 'm_modal-myraffle-result',
            props: {         
                raffle: Object.assign({}, raffle.value, {
                    goods: goodsBasicInfo.value.goods
                }),
                winningResult
            }
        });
    } catch (error) {
        defaultCatch(error);
    }
}

/**
 * 재입고 알림 모달 오픈 함수 
 */
function restockModalOpen() {
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
    useModal().open(restockComponent, {
        title: '재입고 알림 신청',
        name: 'Restock',
        itemClass: 'm_modal-restock',
        props: {         
            isSingleOption: isSingleOption.value,
            options: isPartialSoldout.value ? soldoutOptions.value : goodsOptions.value,
            goodsPrice: buyGoodsPrice.value,
            goodsId: goodsId.value,
        },
    });
}

/**
 * 캐러셀 이미지 에러 콜백
 */
function errorImageCallback(errorImageUrl: string) {
    if (!goodsBasicInfo.value) {
        return;
    }
    goodsBasicInfo.value.goods.thumbnailUrls = goodsBasicInfo.value.goods.thumbnailUrls.filter((imageUrl) => {
        return imageUrl !== errorImageUrl
    })
}
</script>

<style lang="scss">
.hide_auto {
    opacity: 0;
    transition: opacity 0.35s ease-in-out 0.1s;    
}
</style>