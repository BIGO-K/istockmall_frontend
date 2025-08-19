import { computed, nextTick, ref } from 'vue';
import { defineStore } from 'pinia'
import { InitialSettings } from '$/@type/configs';
import { useLastChanged, useNow } from '@vueuse/core';
import { PageContext } from '$/@type/front';
import { globalConfigsRepository } from '$/repository/globalConfigsRepository';

export const useGlobalConfigStore = defineStore('globalConfigs', () => {
    /** VARIABLE */
    const globalConfigs = ref<InitialSettings>(defaultInitialSettings);
    const lastUpdatedAt = useLastChanged(globalConfigs);
    const needUpdateGlobalConfig = computed(() => {
        if (!lastUpdatedAt.value) {
            return true
        }
        const diffTimes = Math.abs(lastUpdatedAt.value - useNow().value.getTime());
        return Math.round((diffTimes / 1000) / 60) >= 5;        
    })
    const pageContexts = ref<PageContext[]>([]);
    const initCompleted = ref<boolean>(false);
    /** //VARIABLE **/
    
    /** FUNCTION **/
    function applyPageContext(currentPageContext: PageContext) {
        pageContexts.value = pageContexts.value
            .filter(pageContext => pageContext.key !== currentPageContext.key)
            .concat([currentPageContext]);
    }

    function clearCurrentPageContext(currentPageContext: PageContext) {
        pageContexts.value = pageContexts.value
            .filter(pageContext => pageContext.key !== currentPageContext.key);
    }

    (async() => {       
        await nextTick();
        if (initCompleted.value && !needUpdateGlobalConfig.value) {
            return;
        }

        try {
            globalConfigs.value = await globalConfigsRepository.getGlobalConfigs()       
            initCompleted.value = true;                     
        } catch (e) {
            initCompleted.value = false;            
        } 
    })();

    /** //FUNCTION **/

    return {
        lastUpdatedAt,
        globalConfigs,
        needUpdateGlobalConfig,
        pageContexts,
        initCompleted,
        applyPageContext,
        clearCurrentPageContext,
    }
}, 
{
    persistedState: {
        storage: sessionStorage,
    }
})

/**
 * global config default value
 */
const defaultInitialSettings: InitialSettings = {
    shop: {
        name: '',
        engName: '',
        nameInBusiness: '',
        businessNumber: '',
        sellAccount: '',
        ceo: '',
        phone: '',
        privacyManager: '',
        baseAddress: '',
        detailAddress: '',
        homepageUrl: '',
        paymentServiceInfoUrl: '',
        copyrightText: '',
        businessServiceInfoUrl: '',
        bankOwnerName: '',
        cs: {
            tel: '',
            email: '',
            time: '',
            weekday: '',
            lunchTime: '',
            offday: '',
            faxNumber: '',
            kakaoWeekday: '',
            kakaoTime: '',
            kakaoFriendName: '',
        },
        hasTransferMember: false,
        snsLink: {
            instagram: '',
            facebook: '',
            youtube: '',
            naverBlog: '',
            kakaoChannel: '',
        },
    },
    point: {
        label: {
            name: '',
            suffix: '',
        },
        rules: {
            minUsableBalance: 0,
            maxUsableAmountType: '',
            maxUsableAmount: 0,
            usableMonth: 12,
            photoReviewPoint: 0,
            textReviewPoint: 0,
        },
        gradeRules: [],
    },
    paidFeatures: {
        reward: false,
        rewardPolicies: {
            useDeliveryDelay: false,
            useSoldoutCancel: false,
            deliveryDelayRewardPolicies: [],
            soldoutCancelRewardPolicies: [],
            maximumRewardPrice: 0
        },
        personalization: false,
        reviewTemplate: false,
        ranking: false,
        timeDeal: false,
        codyShot: false,
        showcase: false,
        raffle: false,
        jointPurchase: false,
        specialEvent: false,
        experienceReview: false,
        socialLogin: false,
        usableSocialLogins: {
            kakaotalk: false,
            naver: false,
            apple: false,
            payco: false,
            facebook: false,
        },
        activesEasypays: {
            isNaverPayUse: false,
            isKakaoPayUse: false,
            isPaycoUse: false,
            isTossUse: false,
        },
        myPay: false,
    },
    gradeColors: [],
    seo: {
        title: '',
        description: '',
        keywords: [],
        siteVerificationKey: {
            naver: '',
        }
    },
    marketing: {
        'gtm': {
            id: '',
        },
        'kakaoPixel': {
            id: '',
        },
        'facebookPixel': {
            id: '',
        },
        'criteo': {
            id: '',
        },
    },
    gnb: {
        raffle: false,
        jointPurchase: false,
    },
    design: {
        headerType: 'A',
        footerType: 'A',
        toolbarType: 'A',
        mainColor: '#1f1f1f',
        subColor: '#f84f34',
        supportColor: '#4457a7',
        colorVersion: 'black',
        useHeaderColor: false,
        pcMainPopupType: 'normal',
        pcMainPopupVersion: 'A',
        mobileMainPopupType: 'normal',
        mobileMainPopupVersion: 'A',
        mobileTopBannerType: 'A',
        pcTopBannerType: 'A',
        pcWingBannerType: 'A',
        mobileRankingType: 'A',
        pcRankingType: 'A',

    },
}