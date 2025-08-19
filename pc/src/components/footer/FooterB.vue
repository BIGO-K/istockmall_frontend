<template>
    <div id="mm_footer" class="mm_footer T=fb">
        <!-- 푸터 - 메뉴 -->
        <!-- <div class="mm_footer-menu"> -->
        <div class="mm_inner">
            <div class="mm_lside">
                <!-- 푸터 - 정보 -->
                <section class="mm_footer-info">
                    <h5><b>고객센터</b></h5>
                    <p><strong>{{ shopInfo?.cs?.tel }}</strong>{{ shopInfo?.cs?.weekday }} {{ shopInfo?.cs?.time }}</p>
                    <dl v-if="shopInfo?.cs?.kakaoWeekday || shopInfo?.cs?.kakaoTime">
                        <dt>카카오톡 문의</dt>
                        <dd v-if="shopInfo?.cs?.kakaoWeekday">
                            {{ shopInfo?.cs?.kakaoWeekday }}
                        </dd>
                        <dd v-if="shopInfo?.cs?.kakaoTime">
                            {{ shopInfo?.cs?.kakaoTime }}
                        </dd>
                    </dl>
                    <dl>
                        <dt>1:1 문의</dt>
                        <dd>고객센터 운영시간에 순차적으로 답변드리겠습니다.</dd>
                    </dl>
                    <dl>
                        <dt>이메일 문의</dt>
                        <dd><a :href="`mailto:${shopInfo?.cs?.email}`"><b>{{ shopInfo?.cs?.email }}</b></a></dd>
                    </dl>
                </section>
                <!--// 푸터 - 정보 -->
            </div>
            <div class="mm_rside">
                <!-- 푸터 - 메뉴 -->
                <ul class="mm_flex mm_footer-menu">
                    <li>
                        <a
                            :href="shopInfo?.homepageUrl"
                            target="_blank"
                            data-href="{ '_type': 'link' }"
                        ><b>회사소개</b></a>
                    </li>
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
                    <!-- <li><a :href="`https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${shopInfo?.name}&apv_perm_no=`" target="_blank" data-href="{ '_type': 'link' }"><b>사업자정보확인</b></a></li>
                        <li><a href="#" data-href="{ '_type': 'link' }"><b>구매안전서비스 가입사실확인</b></a></li> -->
                </ul>
                <!--// 푸터 - 메뉴 -->

                <!-- 푸터 - 주소 -->
                <address>
                    <p>
                        <b class="text_company">
                            법인명: (주)엠몬스타</b><b>사업자등록번호: {{ shopInfo?.businessNumber }}
                            <a 
                                class="btn_footer-info"
                                :href="shopInfo?.businessServiceInfoUrl"
                                target="_blank"
                                title="새 창 열림"
                            >
                                <b>사업자 정보확인</b>
                            </a>
                        </b>
                    </p>
                    <p><b>통신판매업 신고번호: {{ shopInfo?.sellAccount }}</b><b>개인정보관리자: {{ shopInfo?.privacyManager }}</b></p>
                    <p><b>주소: {{ shopInfo?.baseAddress }} {{ shopInfo?.detailAddress }}</b><b>대표: {{ shopInfo?.ceo }}</b></p>
                    <p>
                        <b>제휴 및 입점문의: 
                            <MMLink :to="{ name: 'PartnershipInquiryCreate'}" class="btn_footer-partner" title="새 창 열림">
                                <b>제휴 및 입점 문의하기</b>
                            </MMLink>
                        </b>
                    </p>
                    <p><b>팩스: {{ shopInfo?.cs?.faxNumber }}</b></p>
                </address>
                <!--// 푸터 - 주소 -->

                <!-- 푸터 - SNS -->
                <ul class="mm_footer-sns">
                    <li>
                        <a :href="shopInfo?.snsLink?.instagram ? shopInfo.snsLink.instagram : 'javascript:void(0)'">
                            <i class="ico_sns-instagram" /><b class="mm_ir-blind">인스타그램</b>
                        </a>
                    </li>
        
                    <li>
                        <a :href="shopInfo?.snsLink?.facebook ? shopInfo?.snsLink.facebook : 'javascript:void(0)'">
                            <i class="ico_sns-facebook" /><b class="mm_ir-blind">페이스북</b>
                        </a>
                    </li>
                    <li>
                        <a :href="shopInfo?.snsLink?.naverBlog ? shopInfo.snsLink.naverBlog : 'javascript:void(0)'">
                            <i class="ico_sns-blog" /><b class="mm_ir-blind">네이버 블로그</b>
                        </a>
                    </li>
                    <li>
                        <a :href="shopInfo?.snsLink?.youtube ? shopInfo.snsLink.youtube : 'javascript:void(0)'">
                            <i class="ico_sns-youtube" /><b class="mm_ir-blind">유튜브</b>
                        </a>
                    </li>
                </ul>
                <!--// 푸터 - SNS -->
            </div>
        </div>
        <p class="text_copyright">
            &#169; {{ shopInfo?.copyrightText }}
        </p>
    </div>
    <!--// 푸터 - 메뉴 -->
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
    --footer_height_base: 363px;
}
</style>