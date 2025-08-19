<template>
    <!-- 본문 내용 -->
    <div class="mm_page-content-body">
        <div class="m_cs-info">
            <h3 class="mm_heading">
                <b>간편결제 (페이코)</b>
            </h3>
            <div class="m_cs-info-easypay">
                <!-- 타이틀 -->
                <div class="m...easypay-head">
                    <h4><i class="ico_cs-payco" /><b>페이코 간편결제</b></h4>
                    <p>페이코는 NHN 페이코가 만든 안전한 간편결제 서비스입니다.</p>
                </div>
                <!--// 타이틀 -->

                <!-- PC -->
                <section>
                    <h5><b>온라인(PC)</b></h5>
                    <ol>
                        <li><strong>페이코 결제 선택</strong></li>
                        <li><strong>본인인증(휴대폰/아이핀) 및 회원가입</strong></li>
                        <li><strong>아이핀 회원가입 시 휴대폰 인증</strong> - 휴대폰 인증 가입 시 해당 단계 생략</li>
                        <li><strong>신용카드 정보 등록</strong></li>
                        <li><strong>결제 비밀번호 등록</strong></li>
                        <li><strong>등록 및 결제완료</strong></li>
                    </ol>
                </section>
                <!--// PC -->

                <!-- 모바일 -->
                <section>
                    <h5><b>모바일</b></h5>
                    <ol>
                        <li><strong>페이코 결제선택</strong></li>
                        <li><strong>로그인</strong></li>
                        <li><strong>할인 및 결제수단 선택</strong></li>
                        <li><strong>할인 및 결제수단 선택</strong></li>
                        <li><strong>결제 완료</strong></li>
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
usePageTitleSetting('간편결제 (페이코)', ['이용안내', '고객센터']);
</script>