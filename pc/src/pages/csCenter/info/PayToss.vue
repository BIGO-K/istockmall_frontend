<template>
    <!-- 본문 내용 -->
    <div class="mm_page-content-body">
        <div class="m_cs-info">
            <h3 class="mm_heading">
                <b>간편결제 (토스페이)</b>
            </h3>
            <div class="m_cs-info-easypay">
                <!-- 타이틀 -->
                <div class="m...easypay-head">
                    <h4><i class="ico_cs-toss" /><b>토스페이 간편결제</b></h4>
                    <p>토스페이는 간편하게 지문 또는 비밀번호만으로 결제할 수 있는 빠르고 편리한 간편 결제 서비스입니다.</p>
                </div>
                <!--// 타이틀 -->

                <!-- 모바일 -->
                <section>
                    <h5><b>모바일</b></h5>
                    <ol>
                        <li><strong>결제수단 선택</strong></li>
                        <li><strong>결제방법 선택</strong> - 앱 없이 결제 시 [휴대폰 번호/생년월일] 입력</li>
                        <li><strong>금액 확인 및 결제하기</strong></li>
                        <li><strong>토스 비밀번호 입력 또는 생체 인증</strong></li>
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
usePageTitleSetting('간편결제 (토스)', ['이용안내', '고객센터']);
</script>