<template>
    <!-- 본문 내용 -->
    <div class="mm_page-content-body">
        <div class="m_cs-info">
            <h3 class="mm_heading">
                <b>간편결제 (카카오페이)</b>
            </h3>
            <div class="m_cs-info-easypay">
                <!-- 타이틀 -->
                <div class="m...easypay-head">
                    <h4><i class="ico_cs-kakaopay" /><b>카카오페이 간편결제</b></h4>
                    <p>카카오톡 안에서 개인카드(신용/체크)를 등록하여 결제 시 간단하게 비밀번호만으로 결제할 수 있는 모바일 결제 서비스입니다.</p>
                </div>
                <!--// 타이틀 -->

                <!-- PC -->
                <section>
                    <h5><b>온라인(PC)</b><small>카카오톡에 탑재되어 별도의 어플을 설치할 필요가 없습니다.</small></h5>
                    <ol>
                        <li><strong>결제 수단 선택</strong> - 주문하기 결제 수단을 ‘간편결제 &#62; 카카오페이’ 선택 &#62; [결제하기] 클릭</li>
                        <li><strong>휴대폰 번호/생년월일 입력</strong> - 휴대폰 번호/생년월일 입력 후 [결제 요청] 클릭</li>
                        <li><strong>카톡 메시지 확인</strong> - [결제하기] 클릭하면 카카오페이로 이동</li>
                        <li><strong>카카오페이 카드 등록 및 선택</strong> - 카드 등록 및 선택 후 [결제하기] 클릭</li>
                        <li><strong>카카오페이 비밀번호 또는 지문 인증</strong> - 카카오페이 비밀번호 또는 지문 입력</li>
                        <li><strong>카드 200만원 이상 결제 시 ARS 인증</strong> - ARS 인증 요청 클릭 후 고객 인증(200만원 미만 결제 시 인증 페이지 미노출)</li>
                        <li><strong>결제 인증 완료</strong> - ARS 인증 요청 클릭 후 고객 인증(200만원 미만 결제 시 인증 페이지 미노출)</li>
                        <li><strong>결제 완료</strong></li>
                    </ol>
                </section>
                <!--// PC -->

                <!-- 모바일 -->
                <section>
                    <h5><b>모바일</b></h5>
                    <ol>
                        <li><strong>결제 수단 선택</strong> - 주문하기 결제 수단을 ‘간편결제 &#62; 카카오페이’ 선택 &#62; [결제하기] 클릭</li>
                        <li><strong>카카오페이 카드 등록 및 선택</strong> - 카드 등록 및 선택 후 [결제하기] 클릭</li>
                        <li><strong>카카오페이 비밀번호 또는 지문 인증</strong> - 카카오페이 비밀번호 또는 지문 입력</li>
                        <li><strong>카드 200만원 이상 결제 시 ARS 인증</strong> - ARS 인증 요청 클릭 후 고객 인증(200만원 미만 결제 시 인증 페이지 미노출)</li>
                        <li><strong>결제 인증 완료</strong> - [확인] 버튼 클릭</li>
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

usePageTitleSetting('간편결제 (카카오페이)', ['이용안내', '고객센터']);
</script>
