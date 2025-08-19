<template>
    <!-- 본문 내용 -->
    <div class="mm_page-content-body">
        <div class="m_cs-info">
            <h3 class="mm_heading">
                <b>간편결제 (네이버페이)</b>
            </h3>
            <div class="m_cs-info-easypay">
                <!-- 타이틀 -->
                <div class="m...easypay-head">
                    <h4><i class="ico_cs-naverpay" /><b>네이버 페이 간편결제</b></h4>
                    <div class="mm_note">
                        <ul>
                            <li>네이버페이는 네이버ID로 신용카드 또는 은행계좌 정보를 등록하여 결제할 수 있는 간편결제 서비스입니다.</li>
                            <li>주문 변경 시 카드사 혜택 및 할부 적용 여부는 해당 카드사 정책에 따라 변경될 수 있습니다.</li>
                            <li>지원 가능 결제수단: 네이버페이 결제창 내 노출되는 모든 카드/계좌</li>
                        </ul>
                    </div>
                </div>
                <!--// 타이틀 -->

                <!-- PC -->
                <section>
                    <h5><b>온라인(PC)</b></h5>
                    <ol>
                        <li><strong>네이버페이 결제 선택</strong></li>
                        <li><strong>네이버 ID 로그인</strong></li>
                        <li><strong>결제카드 등록 및 본인인증</strong></li>
                        <li><strong>결제 비밀번호 인증</strong></li>
                        <li><strong>등록 및 결제완료</strong></li>
                    </ol>
                </section>
                <!--// PC -->

                <!-- 모바일 -->
                <section>
                    <h5><b>모바일</b></h5>
                    <ol>
                        <li><strong>네이버페이 결제 선택</strong></li>
                        <li><strong>네이버 ID 로그인</strong></li>
                        <li><strong>사전 설정한 결제 비밀번호로 인증</strong></li>
                        <li><strong>등록 및 결제완료</strong></li>
                    </ol>
                </section>
                <!--// 모바일 -->
            </div>
        </div>
    </div>
    <!--// 본문 내용 -->
</template>

<script setup lang='ts'>
import { usePageTitleSetting } from '$/composables/seoComposable';
usePageTitleSetting('간편결제 (네이버페이)', ['이용안내', '고객센터']);
</script>
