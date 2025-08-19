<template>
    <!-- 푸터-메뉴 -->
    <div class="mm_footer-menu">
        <ul class="mm_flex T=equal">
            <li>
                <MMLink :to="{ name : 'Company'}">
                    <b>회사소개</b>
                </MMLink>
            </li>
            <li>
                <MMLink :to="{ name : 'CsCenter'}">
                    <b>고객센터</b>
                </MMLink>
            </li>
            <li>
                <MMLink :to="{ name : 'MypageInquiryQnaCreate'}">
                    <b>문의하기</b>
                </MMLink>
            </li>
            <li>
                <a :href="pcUrl" target="_blank" title="새 창 열림"><b>PC버전</b></a>
            </li>
        </ul>
    </div>
    <!--// 푸터-메뉴 -->
    <!-- 푸터-정보 -->
    <div class="mm_footer-info">
        <div class="mm_dropdown" :class="{ 'S=on' : dropDownOn }">
            <b>주식회사 스탁컴퍼니</b>
            <button 
                type="button" 
                class="btn_dropdown" 
                :title="dropDownOn ? '펼쳐보기' : '접어놓기'"
                @click="() => { dropDownOn = !dropDownOn }"
            >
                <b>사업자 정보</b><i class="ico_dropdown T=sm" />
            </button>
            <div class="mm_dropdown-item" :style="dropdownItemStyle">
                <div class="mm_dropdown-item-inner">
                    <address>
                        <p>대표: {{ shopInfo?.ceo }}</p>
                        <p>{{ shopInfo?.baseAddress }}{{ shopInfo?.detailAddress }}</p>
                        <p>
                            사업자등록번호: {{ shopInfo?.businessNumber }} 
                            <a :href="getOutIntentPath(shopInfo?.businessServiceInfoUrl)" target="_blank" title="새 창 열림"><b>사업자정보 확인</b></a>
                        </p>
                        <p>통신판매업 신고번호: {{ shopInfo?.sellAccount }}</p>
                        <p>개인정보관리자: {{ shopInfo?.privacyManager }}</p>
                        <p class="text_cs">
                            대표전화: <a :href="`tel:${shopInfo?.cs?.tel}`" title="전화연결"><b>{{ shopInfo?.cs?.tel }}</b></a>
                        </p>
                        <p>운영시간: {{ shopInfo?.cs?.time }}</p>
                        <p>점심시간: {{ shopInfo?.cs?.lunchTime }}</p>
                        <p>{{ shopInfo?.cs?.offday }}</p>
                        <p>팩스번호: {{ shopInfo?.cs?.faxNumber }}</p>
                        <p class="text_email">
                            이메일: <a :href="`mailto:${shopInfo?.cs?.email}`" title="새 창 열림"><b>{{ shopInfo?.cs?.email }}</b></a>
                        </p>
                    </address>
                </div>
            </div>
        </div>
        <ul class="mm_footer-info-terms">
            <li>
                <MMLink :to="{ name: 'PolicyDetail', params: { policyType: 'agreement'}}">
                    <b>서비스이용약관</b>
                </MMLink>
            </li>
            <li>
                <MMLink :to="{ name: 'PolicyDetail', params: { policyType: 'privacy'}}">
                    <strong>개인정보처리방침</strong>
                </MMLink>
            </li>
            <!-- <li><a href="#"><b>이용안내</b></a></li> -->
            <li><a :href="getOutIntentPath(shopInfo?.paymentServiceInfoUrl)" target="_blank" title="새 창 열림"><b>구매안전서비스 가입사실확인</b></a></li>
        </ul>
        <div class="mm_footer-info-family">
            <p>Family Site</p>
            <ul>
                <li><a href="https://mcginn.co.kr?is_out_intent=Y" target="_blank"><i v-lazyload="{ src: '/image/content/footer_family_mcginn.png' }" class="mm_bg-contain image_logo" title="McGINN" /><b class="mm_ir-blind">여성 컨템포러리 브랜드</b></a></li>
                <li><a href="https://topgirl.co.kr?is_out_intent=Y" target="_blank"><i v-lazyload="{ src: '/image/content/footer_family_topgirl.png' }" class="mm_bg-contain image_logo" title="TOPGIRL" /><b class="mm_ir-blind">여성 섹시 베이직 브랜드</b></a></li>
                <li><a href="https://camaldolikorea.co.kr?is_out_intent=Y" target="_blank"><i v-lazyload="{ src: '/image/content/footer_family_camaldoli.png' }" class="mm_bg-contain image_logo T=logo-cameldoli" title="CAMALDOLI" /><b class="mm_ir-blind">이탈리아 천연레시피 뷰티브랜드</b></a></li>
            </ul>
        </div>
        <p class="text_copyright">
            &#169;{{ shopInfo?.copyrightText }}
        </p>
    </div>
    <!--// 푸터-정보 -->
</template>

<script setup lang='ts'>
import { ShopInfo } from '$/@type/configs';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { getOutIntentPath } from '$/filters';
import { env } from '$/functions';
import { ref, computed } from 'vue';


const dropDownOn = ref(false);    // 드롭박스 아이템 노출 여부
// 드롭박스 아이템 style (computed)
const dropdownItemStyle = computed(() => {
    return dropDownOn.value ? { height: 'auto'} : {};
})
const pcUrl = env('MM_APP_PC_URL') + '?pc_mode=Y';
const { globalConfigs } = useGlobalConfigs();
const shopInfo = ref<ShopInfo>(globalConfigs.value.shop);

/** FUNCTION */

/** VUE LIFE CYCLE */
</script>