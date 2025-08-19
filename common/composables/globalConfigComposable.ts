import { BankCode, GradeReviewPointSetting, InitialSettings, Point } from '$/@type/configs';
import { useUserState } from '$/composables/auth/userComposable';
import { globalConfigsRepository } from '$/repository/globalConfigsRepository';
import { useGlobalConfigStore } from '$/store/globalConfig';
import { computed, ref, watch } from 'vue';
import { isMobile } from '$/functions';
import { typeCastNumber } from '$/filters';
import { useAffiliateStore } from '$/store/affiliate';
import { useStyleTag } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useUserAgent } from '$/composables/commonComposable';

export function useGlobalConfigs() {
    /** STORE **/
    const store = useGlobalConfigStore();    
    const { 
        globalConfigs,
        needUpdateGlobalConfig,
        initCompleted
    } = storeToRefs(store);
    /** //STORE **/

    /** VARIABLE **/
    const config = computed<InitialSettings>(() => globalConfigs.value);    
    /** //VARIABLE **/    
    
    return {
        globalConfigs: config,
        globalConfigInitCompleted: initCompleted,
        needUpdateGlobalConfig,
    }
}

export function useInitialize() {
    /** VARIABLE */
    const { 
        globalConfigs,
        globalConfigInitCompleted,
        needUpdateGlobalConfig, 
    } = useGlobalConfigs();
    /** FUNCTION **/
    /**
     * seo, style 세팅
     */
    function initSeoAndStyle() {
        // 등급컬러        
        const gradColorStyles = globalConfigs.value.gradeColors.map((grade) => {
            return `--color_level${grade.seq}: ${grade.color}`
        });
        const colorVariable = globalConfigs.value.design.colorVersion === 'color' ? '--color_variable: var(--color_main)' : '--color_variable: var(--color_sub)'; 
        const headerColor = globalConfigs.value.design.useHeaderColor ? '--color_header: var(--color_main)' : '--color_header: #fff'
        if (globalConfigs.value.design.colorVersion === 'color') {
            document.documentElement.classList.add('L=color');
        }

        const { isMobileUser } = useUserAgent();

        const rootStyleTagContent = computed(() => {
            if (isMobileUser) {
                 return `:root {
                    ${gradColorStyles.join(';')};
                    --color_main: ${globalConfigs.value.design.mainColor};
                    --color_sub: ${globalConfigs.value.design.subColor};
                    ${colorVariable};
                    --color_support: ${globalConfigs.value.design.supportColor};
                    --color_text_base: #010101;
                    
                    --prod_ratio_base: 1;
                    /** 높이 */
                    --header_height_main: ${globalConfigs.value.design.headerType === 'A' ? '56px' : '50px'};                    
                    --header_height_base: 45px;
                    --gnb_height_base: 47px;
                    ${headerColor};               
                    
                }
                `
            }

            return `:root {
                ${gradColorStyles.join(';')};
                --color_main: ${globalConfigs.value.design.mainColor};
                --color_sub: ${globalConfigs.value.design.subColor};
                ${colorVariable};
                --color_support: ${globalConfigs.value.design.supportColor};
                --prod_ratio_base: 1;
                ${headerColor};               
            }
            `
        })


        // useStyleTag(
        //     `:root {
        //         ${gradColorStyles.join(';')};
        //         --color_main: ${globalConfigs.value.design.mainColor};
        //         --color_sub: ${globalConfigs.value.design.subColor};
        //         ${colorVariable};
        //         --color_support: ${globalConfigs.value.design.supportColor};
        //         --prod_ratio_base: 1;
        //         ${headerColor};
        //         ${isMobile('ios') || isMobile('android') ? (globalConfigs.value.design.headerType === 'A') ? '--header_height_main: 56px' : '--header_height_main: 50px' : ''}
        //     }
        //     `
        // )
        useStyleTag(rootStyleTagContent.value);

        
        // seo meta tag
        const titleElement: HTMLTitleElement | null = document.querySelector('title')
        const descriptionElement: HTMLMetaElement | null = document.querySelector('meta[name=description]')
        const seoTitleElement: HTMLMetaElement | null = document.querySelector('meta[property=og\\:title]')
        const seoDescElement: HTMLMetaElement | null = document.querySelector('meta[property=og\\:description]')
        const seoUrlElement: HTMLMetaElement | null = document.querySelector('meta[property=og\\:url]')
        const seoSiteNameElement: HTMLMetaElement | null = document.querySelector('meta[property=og\\:site_name]')
        const seoNaverSiteVerificationElement: HTMLMetaElement | null = document.querySelector('meta[name=naver-site-verification]')

        if (titleElement) {
            titleElement.innerText = globalConfigs.value.seo.title;
        }

        if (seoTitleElement) {
            seoTitleElement.content = globalConfigs.value.seo.title;
        }

        if (descriptionElement) {
            descriptionElement.content = globalConfigs.value.seo.description;
        }

        if (seoDescElement) {
            seoDescElement.content = globalConfigs.value.seo.description;
        }

        if (seoUrlElement) {
            seoUrlElement.content = location.host || '';
        }
        if (seoSiteNameElement) {
            seoSiteNameElement.content = globalConfigs.value.shop.name;
        }
        
        if (seoNaverSiteVerificationElement) {
            seoNaverSiteVerificationElement.content = globalConfigs.value.seo.siteVerificationKey.naver
        }
    }
    /** //FUNCTION **/
 
    watch(globalConfigs, (to, from) => {
        if (to !== from) {
            initSeoAndStyle();
        }
    });

    (() => {
        if (globalConfigInitCompleted.value && !needUpdateGlobalConfig.value) {
            initSeoAndStyle();
        }
    })()
}


export function useGnbMenu() {
    /** STORE **/
    const { globalConfigs } = useGlobalConfigs();
    /** //STORE **/

    /** VARIABLE **/
    const { 
        codyShot: isUseCodyShot, 
        showcase: isUseShowcase, 
        specialEvent: isUseSpecialEvent,
        ranking:  isUseRanking
    } = globalConfigs.value.paidFeatures
    const { raffle: isUseRaffle, jointPurchase: isUseJointPurchase, spotThemes: spotThemes } = globalConfigs.value.gnb
    /** //VARIABLE **/

    /** FUNC **/

    /** //FUNC **/

    return {
        isUseCodyShot,
        isUseShowcase,
        isUseSpecialEvent,
        isUseRanking,
        isUseRaffle,
        isUseJointPurchase,
        spotThemes,
    }
}

/**
 * GLOBAL CONFIG > 은행코드
 */
export function useBankCodes() {
    /** VARIABLE **/
    const bankCodes = ref<BankCode[]>([]);
    /** //VARIABLE **/
    
    (async () => {
        if (bankCodes.value.length > 0) {
            return
        }
        
        try {
            bankCodes.value = await globalConfigsRepository.getBankCodes();
        } catch (e) {
            console.log(e);
        }
    })();

    return {
        bankCodes
    }
}

/**
 * 내등급 포인트 설정
 */
export function useMyPointRule() {
    /** STORE **/
    const { globalConfigs } = useGlobalConfigs();
    const { user } = useUserState();
    /** //STORE **/
    
    /** VARIABLE */
    const defaultRule = {
        photoReviewPoint: typeCastNumber(globalConfigs.value.point.rules.photoReviewPoint),
        textReviewPoint: typeCastNumber(globalConfigs.value.point.rules.textReviewPoint),
        gradeId: 0,
        gradeName: '',
        useGradeRule: false,
    }
    const myPointRule = computed<GradeReviewPointSetting>(() => {
        const matchingRule = globalConfigs.value.point.gradeRules
            .find((rule) => rule.gradeId == user.value?.grade.id && rule.useGradeRule);
        return matchingRule || defaultRule
    })
    /** // VARIABLE */
   
    return {
        myPointRule
    }
}

export function useAffiliate() {
    /** STORE **/
    const affiliateStore = useAffiliateStore();
    /** //STORE **/

    /** VARIABLE **/
    const affiliateCode = computed(() => affiliateStore.affiliateCode);

    /** //VARIABLE **/

    /** FUNC **/

    /** //FUNC **/

    return {
        affiliateCode,
        setAffiliate: affiliateStore.setAffiliateCode        
    }
}
