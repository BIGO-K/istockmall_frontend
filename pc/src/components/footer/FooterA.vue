<template>
    <div id="mm_footer" class="mm_footer T=fa">
        <!-- 푸터 - 메뉴 -->
        <div class="mm_footer-menu">
            <div class="mm_inner">
                <div class="mm_lside">
                    <ul class="mm_flex">
                        <li>
                            <MMLink :to="{ name: 'Policy', params: { policyType: 'privacy'}}">
                                <strong>개인정보처리방침</strong>
                            </MMLink>
                        </li>
                        <li>
                            <MMLink :to="{ name: 'Policy', params: { policyType: 'agreement'}}">
                                <b>이용약관</b>
                            </MMLink>
                        </li>                  
                        <li>
                            <a
                                :href="shopInfo?.businessServiceInfoUrl"
                                title="새 창 열림"
                                target="_blank"
                            >
                                <b>사업자정보확인</b>
                            </a>
                        </li>
                        <li>
                            <a
                                :href="shopInfo?.paymentServiceInfoUrl"
                                target="_blank"
                                title="새 창 열림"
                            >
                                <b>구매안전서비스 가입사실확인</b>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="mm_rside">
                    <ul class="mm_flex">
                        <li>
                            <MMLink :to="{ name: 'Company' }">
                                <b>회사소개</b>
                            </MMLink>
                        </li>
                        <li>
                            <MMLink :to="{ name: 'CsCenter' }">
                                <b>고객센터</b>
                            </MMLink>
                        </li>
                        <li>
                            <MMLink :to="{ name: 'CsCenterNotice' }">
                                <b>공지사항</b>
                            </MMLink>
                        </li>
                        <li>
                            <MMLink :to="{ name: 'PartnershipInquiryCreate'}">
                                <b>제휴 입점문의</b>
                            </MMLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--// 푸터 - 메뉴 -->

        <!-- 푸터 - 정보 -->
        <div class="mm_footer-info">
            <div class="mm_inner">
                <section>
                    <h6><b class="mm_ir-blind">{{ shopInfo?.name }}</b></h6>
                    <div class="mm_footer-info-company">
                        <address>
                            <strong class="text_company">주식회사 스탁컴퍼니</strong>
                            대표: {{ shopInfo?.ceo }}<br>
                            {{ shopInfo?.baseAddress }}<br>{{ shopInfo?.detailAddress }}<br>
                            통신판매업 신고번호: {{ shopInfo?.sellAccount }}<br>
                            사업자등록번호: {{ shopInfo?.businessNumber }}
                            <a
                                class="btn_footer-info"
                                :href="shopInfo?.businessServiceInfoUrl"
                                target="_blank"
                                title="새 창 열림"
                            >
                                <b>사업자 정보확인</b><i class="ico_link" />
                            </a><br>
                            개인정보관리자:  {{ shopInfo?.privacyManager }}
                        </address>
                        <dl>
                            <dt>고객센터</dt>
                            <dd>
                                대표전화: {{ shopInfo?.cs?.tel }}<br>
                                운영시간: {{ shopInfo?.cs?.time }}<br>
                                점심시간: {{ shopInfo?.cs?.lunchTime }}<br>
                                {{ shopInfo?.cs?.offday }}<br>
                                팩스번호: {{ shopInfo?.cs?.faxNumber }} <br>
                                이메일: <a :href="`mailto:${shopInfo?.cs?.email}`"><b>{{ shopInfo?.cs?.email }}</b></a>
                            </dd>
                        </dl>
                        <dl>
                            <dt>안전거래 서비스</dt>
                            <dd>
                                고객님은 안전거래를 위해 현금등으로 결제 시 저희 쇼핑몰에 가입한 <strong>NHN KCP 구매안전서비스</strong>를 이용 하실 수 있습니다<br>
                                <a
                                    class="btn_footer-info"
                                    :href="shopInfo?.paymentServiceInfoUrl"
                                    target="_blank"
                                    title="새 창 열림"
                                >
                                    <b>서비스가입 사실 확인</b><i class="ico_link" />
                                </a><br>
                            </dd>
                        </dl>
                    </div>
                    <div class="mm_footer-info-award">
                        <ul>
                            <li><i><img v-lazyload="{ src: '/image/content/footer_escrow_kcp.png' }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="NHN KCP 구매안전(에스크로) 서비스"></i></li>
                            <li><i><img v-lazyload="{ src: '/image/content/footer_ftc.png' }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="공정거래위원회인증 표준약관사용"></i></li>
                            <li><i><img v-lazyload="{ src: '/image/content/footer_ssl.png' }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="SSL결제보안 인증사이트"></i></li>
                            <li><i><img v-lazyload="{ src: '/image/content/footer_nts.png' }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="국세청 현금영수증가맹점"></i></li>
                            <li><i><img v-lazyload="{ src: '/image/content/footer_goods_quality.png' }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="100% 정품인증"></i></li>
                            <li><i><img v-lazyload="{ src: '/image/content/footer_service.png' }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt="서비스 혁신 대상 수상"></i></li>
                        </ul>
                    </div>
                    <dl class="mm_footer-info-family">
                        <dt>Family Site</dt>
                        <dd>
                            <ul>
                                <li><a href="https://mcginn.co.kr" target="_blank"><i v-lazyload="{ src: '/image/content/footer_family_mcginn.png' }" class="mm_bg-contain image_logo" title="McGINN" /><b>여성 컨템포러리 브랜드</b></a></li>
                                <li><a href="https://topgirl.co.kr" target="_blank"><i v-lazyload="{ src: '/image/content/footer_family_topgirl.png' }" class="mm_bg-contain image_logo" title="TOPGIRL" /><b>여성 섹시 베이직 브랜드</b></a></li>
                                <li><a href="https://camaldolikorea.co.kr/" target="_blank"><i v-lazyload="{ src: '/image/content/footer_family_camaldoli.png' }" class="mm_bg-contain image_logo T=logo-camaldoli" title="CAMALDOLI" /><b>이탈리아 천연레시피 뷰티브랜드</b></a></li>
                            </ul>
                        </dd>
                    </dl>
                </section>
            </div>
            <p class="text_copyright">
                &#169; {{ shopInfo?.copyrightText }}
            </p>
        </div>
    <!--// 푸터 - 정보 -->
    </div>
</template>


<script setup lang='ts'>
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
/** VARIABLE */
const { globalConfigs } = useGlobalConfigs();
/** FUNCTION */

const shopInfo = globalConfigs.value.shop;
/** VUE LIFE CYCLE */

</script>
<style>
    :root {
        --footer_height_base: 316px;
    }
</style>
