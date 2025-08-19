import { defineStore } from 'pinia'
import { ref, computed } from 'vue';
import { useUserAgent } from '$/composables/commonComposable';
import { LocationQuery } from 'vue-router';

// affiliate_code 목록
const affiliateCodesList : string[] = [
    'naver_Pep', // 네이버 EP
    'naver_Mep', // 네이버 M EP
    'naver_mn',
    'naver_gfa', // 네이버 GFA 성과형
    'naver_kw', // 네이버 검색
    'naver_mkw', // 네이버 검색 M
    'naver_Pbr', // 네이버 브랜드 검색 
    'naver_Mbr', // 네이버 브랜드 검색  M
    'naver_pc', // 네이버 PC
    'naver_mo', // 네이버 MO
    'naver_pa',
    'naver_ss', // 네이버 쇼핑몰
    'naver_cb', // 네이버 카페
    'naver_b1', // 네이버 쇼핑박스 
    'naver_b2', // 네이버 쇼핑박스 
    'naver_b3', // 네이버 쇼핑박스 
    'naver_b4', // 네이버 쇼핑박스 
    'naver_b5', // 네이버 쇼핑박스 
    'naver_m1', // 네이버 맨즈
    'naver_m2', // 네이버 맨즈
    'naver_m3', // 네이버 맨즈
    'naver_m4', // 네이버 맨즈
    'naver_m5', // 네이버 맨즈
    'naver_tAM', // 네이버 트랜드몰 A 몰명
    'naver_tA1', // 네이버 트랜드몰 A 형
    'naver_tA2', // 네이버 트랜드몰 A 형
    'naver_tA3', // 네이버 트랜드몰 A 형
    'naver_tA4', // 네이버 트랜드몰 A 형
    'naver_tA5', // 네이버 트랜드몰 A 형
    'naver_tA6', // 네이버 트랜드몰 A 형
    'naver_tA7', // 네이버 트랜드몰 A 형
    'naver_tA8', // 네이버 트랜드몰 A 형
    'naver_tBM', //네이버 트랜드몰 B형 몰형
    'naver_tB1', // 네이버 트랜드몰 B형 
    'naver_tB2', // 네이버 트랜드몰 B형 
    'naver_tB3', // 네이버 트랜드몰 B형 
    'daum_ep', // 다음      EP
    'daum_logo', // 다음 몰명
    'daum_cb',  // 다음 카페, 블로그
    'kakao_p1', // 카카오 쇼핑박스
    'kakao_p2', // 카카오 쇼핑박스
    'kakao_p3', // 카카오 쇼핑박스
    'kakao_p4', // 카카오 쇼핑박스
    'kakao_p5', // 카카오 쇼핑박스
    'kakao_m1', // 카카오 쇼핑박스 모바일 
    'kakao_m2', // 카카오 쇼핑박스 모바일 
    'kakao_m3', // 카카오 쇼핑박스 모바일 
    'kakao_m4', // 카카오 쇼핑박스 모바일 
    'kakao_m5', // 카카오 쇼핑박스 모바일 
    'kakao_kw', // 카카오 키워드
    'kakao_biz',  // 카카오 비즈보드
    'kakao_da',  // 카카오 디스플레이 
    'kakao_pf', // 카카오 플친 
    'kakao_ch', // 카카 채널
    'wmp_wd', // 위메프
    // 소셜
    'youtube',
    'facebook', 
    'instagra', 
    'mobion', // 모비온
    'doyouad', // endbdoem
    'gg_gdn', // GDN
    'targetgt', // 타겟팅게이츠
    'criteo', // 크리테오
    'daum_mo', // 다음 모바일 
    'daum_pc', // 다음 PC
    'sms', // SMS 발송
    'email', // EMAIL 발송
    'nate', // nate
    'zum',
    'google',
    'app_push', // APP PUSH
    'favorites', // 즐겨찾기    
];

// 변환할 affiliate_code 목록
const pcToMobileAffiliates: {[key: string]: string} = {    
    'naver_Mep': 'naver_Pep',
    'naver_mkw' : 'naver_kw',
    'naver_Mbr' : 'naver_Pbr',
    'daum_mo' : 'daum_pc',
    'naver_mo' : 'naver_pc',
}

const mobileToPcAffiliates: {[key: string]: string} = {    
    'naver_Pep': 'naver_Mep',
    'naver_kw' : 'naver_mkw',
    'naver_Pbr': 'naver_Mbr',
    'daum_pc' : 'daum_mo',
    'naver_pc' : 'naver_mo'
}



export const useAffiliateStore = defineStore('affiliate', () => {
    const { 
        isMobileUser, 
        isAndroidApp, 
        isIosApp, 
        isAppUser 
    } = useUserAgent();

    const defaultAffiliateCode = computed(() => {
        if (isMobileUser) {
            if (isAppUser) {
                return isAndroidApp ? 'app_a' : 'app_i'
            }
            return 'MOBILE'
        }
        return 'PC'
    })

    const affiliateCode = ref<string>(defaultAffiliateCode.value);
    function setAffiliateCode(code?: string, query?: LocationQuery) {
        if (query.NaPm && query.NaPm.includes('ct') && !code) {
            affiliateCode.value = `naver_Mbr`;
            return
        }

        if (!code || code === '') {
            return;
        }
        // affiliate 코드 확인
        if (!affiliateCodesList.includes(code)) {
            affiliateCode.value = defaultAffiliateCode.value;    
            return;
        }        

        // 매출 코드 포함된 경우 
        affiliateCode.value = code;
        // mobile 코드로 넘어왔을 경우 pc 코드로 변환        
        if (isMobileUser && mobileToPcAffiliates[code]) {
            return affiliateCode.value = mobileToPcAffiliates[code];
        } 
        // PC에 모바일 코드 넘어오는 경우 치환 
        if (!isMobileUser && pcToMobileAffiliates[code]) {
            affiliateCode.value = pcToMobileAffiliates[code]
        }
        // 네이버 쇼핑 광고 검색 관련 처리 추가 
        if (affiliateCode.value === 'naver_Pep' || affiliateCode.value === 'naver_Mep' && query) {
            if (query.nv_ad && query.nv_ad.includes('pla')) {
                affiliateCode.value = `naver_pa`;
            }
        }
    }


    return {
        affiliateCode,
        setAffiliateCode
    }

}, {
    persistedState: {
        storage: sessionStorage
    }
})