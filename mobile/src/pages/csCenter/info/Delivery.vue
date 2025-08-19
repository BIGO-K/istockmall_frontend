<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>주문/반품 배송조회</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_tab m_popup-cs" data-tab>
                            <div class="mm_tab_menu">
                                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
                                <ul class="mm_flex T=equal">
                                    <li>
                                        <a
                                            :class="['btn_tab', { 'S=tab-on' : showOrder }]"
                                            :title="showOrder ? '선택됨' : ''" 
                                            @click="showOrder = true; showReturn = false; type = ''; check = '';"
                                        >
                                            <b>주문 배송조회</b>
                                        </a>
                                    </li>
                                    <li>
                                        <a 
                                            :class="['btn_tab', { 'S=tab-on' : showReturn }]"
                                            :title="showReturn ? '선택됨' : ''" 
                                            @click="showOrder = false; showReturn = true; type = ''; check = '';"
                                        >
                                            <b>반품 배송조회</b>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <!-- 주문 배송조회 -->
                            <div :class="['mm_tab-item', { 'S=tab-on' : showOrder }]">
                                <div class="mm_accordion">
                                    <ul>
                                        <li>
                                            <dl
                                                :class="['mm_dropdown', { 'S=on' : check === 'mobile' }]"
                                                @click="() => { 
                                                    type = 'mobile';
                                                    check = check === type ? '' : type 
                                                }"
                                            >
                                                <dt class="btn_dropdown" tabindex="0" :title="check === 'mobile' ? '접어보기' : '펼쳐보기' ">
                                                    <p><b>모바일</b></p><i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="check === 'mobile' ? { height: 'auto' } : {}">
                                                    <div class="mm_dropdown-item-inner">
                                                        <div class="m_popup-cs-step">
                                                            <ol>
                                                                <li>
                                                                    <span class="text_step">STEP 1</span>
                                                                    <figure>
                                                                        <figcaption>모바일 로그인 후 퀵메뉴의 <strong class="text_highlight">[<span>배송조회</span>]</strong> 버튼을 터치하세요.</figcaption>
                                                                        <i class="image_guide"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" data-lazyload="{ '_src': '../image/content/cs_info_order_mobile_1.jpg' }" alt=""></i>
                                                                    </figure>
                                                                </li>
                                                                <li>
                                                                    <span class="text_step">STEP 2</span>
                                                                    <figure>
                                                                        <figcaption>해당 주문의 <strong class="text_highlight">[<span>주문상세</span>]</strong> 버튼을 클릭하세요<br><strong class="text_highlight">[<span>배송조회</span>]</strong> 버튼을 클릭하시면 상품 위치 확인이 가능합니다.</figcaption>
                                                                        <i class="image_guide"><img v-lazyload="{ src: '/image/content/cs_info_order_mobile_2.jpg' }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""></i>
                                                                        <strong class="btn_cs-delivery"><b>배송조회</b><i class="ico_click" /></strong>
                                                                    </figure>
                                                                </li>
                                                            </ol>
                                                        </div>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                        <li>
                                            <dl 
                                                :class="['mm_dropdown', { 'S=on' : check === 'pc' }]"
                                                @click="() => { 
                                                    type = 'pc';
                                                    check = check === type ? '' : type 
                                                }"
                                            >
                                                <dt class="btn_dropdown" tabindex="0" :title="check === 'pc' ? '접어보기' : '펼쳐보기'">
                                                    <p><b>PC</b></p><i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="check === 'pc' ? { height: 'auto' } : {}">
                                                    <div class="mm_dropdown-item-inner">
                                                        <div class="m_popup-cs-step">
                                                            <figure>
                                                                <figcaption><strong class="mm_text-variable">'마이페이지 &#62; 주문 관리 &#62; 주문 리스트'</strong>에서 배송 출발된 주문의 <strong class="text_highlight">[<span>배송조회</span>]</strong> 버튼을 클릭하시면 상품의 위치를 확인할 수 있는 팝업창이 생성됩니다.</figcaption>
                                                                <i class="image_guide"><img v-lazyload="{ src: '/image/content/cs_info_order_pc.jpg' }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""></i>
                                                            </figure>
                                                        </div>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                    </ul>
                                </div>
                                <div class="mm_inner">
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <MMLink
                                                class="mm_btn T=primary"
                                                :to="{ name: 'MypageOrder'}"
                                            >
                                                <b>주문 배송조회 바로가기</b><i class="ico_link" />
                                            </MMLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--// 주문 배송조회 -->

                            <!-- 반품 배송조회 -->
                            <div :class="['mm_tab-item', { 'S=tab-on' : showReturn }]">
                                <div class="mm_accordion">
                                    <ul>
                                        <li>
                                            <dl
                                                :class="['mm_dropdown', { 'S=on' : check === 'mobile' }]"
                                                @click="() => { 
                                                    type = 'mobile';
                                                    check = check === type ? '' : type 
                                                }"
                                            >
                                                <dt class="btn_dropdown" tabindex="0" :title="check === 'mobile' ? '접어보기' : '펼쳐보기' ">
                                                    <p><b>모바일</b></p><i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="check === 'mobile' ? { height: 'auto' } : {}">
                                                    <div class="mm_dropdown-item-inner">
                                                        <div class="m_popup-cs-step">
                                                            <figure>
                                                                <figcaption><strong class="mm_text-variable">‘마이페이지 &#62; 주문관리 &#62; 반품 주문 리스트’</strong>에서 반품 상태인 주문의 <strong class="text_highlight">[<span>반송조회</span>]</strong> 버튼을 클릭하시면 상품 위치 확인 팝업창이 노출됩니다.</figcaption>
                                                                <i class="image_guide"><img v-lazyload="{ src: '/image/content/cs_info_return_mobile.jpg' }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""></i>
                                                                <strong class="btn_cs-delivery"><b>반송조회</b><i class="ico_click" /></strong>
                                                            </figure>
                                                        </div>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                        <li>
                                            <dl
                                                :class="['mm_dropdown', { 'S=on' : check === 'pc' }]"
                                                @click="() => { 
                                                    type = 'pc';
                                                    check = check === type ? '' : type 
                                                }"
                                            >
                                                <dt class="btn_dropdown" tabindex="0" :title="check === 'pc' ? '접어보기' : '펼쳐보기'">
                                                    <p><b>PC</b></p><i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="check === 'pc' ? { height: 'auto' } : {}">
                                                    <div class="mm_dropdown-item-inner">
                                                        <div class="m_popup-cs-step">
                                                            <figure>
                                                                <figcaption><strong class="mm_text-variable">‘마이페이지 &#62; 주문관리 &#62; 반품 주문 리스트’</strong>에서 반품 상태인 주문의 <strong class="text_highlight">[<span>반송조회</span>]</strong> 버튼을 클릭하시면 상품 위치 확인 팝업창이 노출됩니다.</figcaption>
                                                                <i class="image_guide"><img v-lazyload="{ src: '/image/content/cs_info_return_pc.jpg' }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""></i>
                                                            </figure>
                                                        </div>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </li>
                                    </ul>
                                </div>
                                <div class="mm_inner">
                                    <div class="mm_foot">
                                        <div class="mm_btn_box">
                                            <MMLink
                                                class="mm_btn T=primary"
                                                :to="{ name: 'MypageOrderReturn'}"
                                            >
                                                <b>반품 배송조회 바로가기</b><i class="ico_link" />
                                            </MMLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--// 반품 배송조회 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MMPopup from '@/components/layout/Popup.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('주문/반품 배송조회');

const showOrder     = ref(true);
const showReturn    = ref(false);
const type          = ref('');      // dropdown type (pc, mobile)
const check         = ref('');      // dropdown type check

</script>