<template>
    <!-- 푸터-메뉴 -->
    <ul class="mm_footer-menu">
        <li>
            <a :href="getOutIntentPath(shopInfo?.homepageUrl)" target="_blank"><b>회사소개</b></a>
        </li>
        <li>
            <MMLink :to="{ name: 'PolicyDetail', params: { policyType: 'privacy'}}">
                <strong>개인정보처리방침</strong>
            </MMLink>
        </li>
        <li>
            <MMLink :to="{ name: 'PolicyDetail', params: { policyType: 'agreement'}}">
                <b>이용약관</b>
            </MMLink>
        </li>
        <li>
            <a :href="getOutIntentPath(shopInfo?.businessServiceInfoUrl)" target="_blank" title="새 창 열림">
                <b>사업자정보 확인</b>
            </a>
        </li>
        <li>
            <a :href="getOutIntentPath(shopInfo?.paymentServiceInfoUrl)" target="_blank" title="새 창 열림">
                <b>구매안전서비스 가입사실확인</b>
            </a>
        </li>
    </ul>
    <!--// 푸터-메뉴 -->
    
    <!-- 푸터 - SNS -->
    <ul class="mm_footer-sns">
        <li>
            <a :href="shopInfo?.snsLink?.instagram ? shopInfo.snsLink.instagram : 'javascript:void(0)'">
                <i class="ico_sns-instagram" /><b class="mm_ir-blind">인스타그램</b>
            </a>
        </li>
        
        <li>
            <a :href="shopInfo?.snsLink?.facebook ? shopInfo.snsLink.facebook :'javascript:void(0)'">
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
    
    <!-- 푸터 - 정보 -->
    <section class="mm_footer-info">
        <h5><b>고객센터</b></h5>
        <p><strong><a :href="`tel:${shopInfo?.cs?.tel}`" title="전화연결">{{ shopInfo?.cs?.tel }}</a></strong></p>
        <p><b>{{ shopInfo?.cs?.weekday }}</b><b>{{ shopInfo?.cs?.time }}</b></p>
        <p v-if="shopInfo?.snsLink?.kakaoChannel || shopInfo?.cs?.kakaoFriendName">
            <b>
                카카오톡
                <a v-if="shopInfo?.snsLink?.kakaoChannel" :href="shopInfo?.snsLink.kakaoChannel" target="_blank">
                    @{{ shopInfo?.cs?.kakaoFriendName }}
                </a> 
                친구 추가하고 소식과 혜택을 받아보세요.
            </b>
        </p>
    </section>
    <!--// 푸터 - 정보 -->
    
    <!-- 푸터 - 주소 -->
    <address>
        <p><b class="text_company">법인명: {{ shopInfo?.name }}</b><b>대표: {{ shopInfo?.ceo }}</b></p>
        <p><b>개인정보관리자: {{ shopInfo?.privacyManager }}</b></p>
        <p>
            <b>
                사업자등록번호: {{ shopInfo?.businessNumber }}
                <a class="btn_footer-info" :href="getOutIntentPath(shopInfo?.businessServiceInfoUrl)" target="_blank" title="새 창 열림">
                    <strong>사업자정보 확인</strong>
                </a>
            </b>
        </p>
        <p><b>통신판매업 신고번호: {{ shopInfo?.sellAccount }}</b></p>
        <p><b>주소: {{ shopInfo?.baseAddress }}{{ shopInfo?.detailAddress }}</b></p>
        <p><b>팩스: {{ shopInfo?.cs?.faxNumber }}</b></p>
        <p>
            <b>
                이메일: 
                <a :href="`mailto:${shopInfo?.cs?.email}`" title="새 창 열림">
                    <b>{{ shopInfo?.cs?.email }}</b>
                </a>
            </b>
        </p>
    </address>
    <!--// 푸터 - 주소 -->
    
    <p class="text_copyright">
        &#169;{{ shopInfo?.copyrightText }}
    </p>
</template>

<script setup lang="ts">
import { ShopInfo } from '$/@type/configs';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { getOutIntentPath } from '$/filters';
import { ref } from 'vue'

const { globalConfigs } = useGlobalConfigs();
const shopInfo = ref<ShopInfo>(globalConfigs.value.shop);

</script>