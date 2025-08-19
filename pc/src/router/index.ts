import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { env } from '$/functions'
import NotFoundError from '$/errors/NotFoundError'
import { userPageRoutes } from '@/router/userPage'
import { guestMyPageOrderRoutes } from '@/router/guestUserPage'
import { mmon } from '$/helper/mmon';
import { useUserState } from '$/composables/auth/userComposable';
import { useIdFindResult, usePasswordFindChange } from '$/composables/auth/findComposable'
import { useErrorState, useMaintenanceState } from '$/composables/pageHandler/contextComposable'
import { usePcModeStore } from '$/store/pcMode'

const basePath: string | undefined = typeof import.meta.env.MM_APP_BASE_PATH == 'boolean' ? undefined : import.meta.env.MM_APP_BASE_PATH
const isBrowserNotSupport = /msie|edge|rv:11/i.test(navigator.userAgent)
const isMobileAccess = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)


const baseRoute: RouteRecordRaw[] = [
    {
        name: 'MobileRedirect',
        path: '/mobile-redirect',
        component: () => import('@/pages/bridges/External.vue'),
        beforeEnter: (to) => {
            const redirectUrl = to.query.redirect_url ?? '/';
            window.location.href = env('MM_APP_MOBILE_URL') + redirectUrl;
        },
    },
    {
        name: 'ClaimOffer',
        path: '/print/claim-offer',
        component: () => import('@/pages/Main.vue'),
        beforeEnter: () => {
            window.location.href = env('MM_CLAIM_OFFER_URL')
        },
    },
    {
        name: 'EmptyPopup',
        path: '/external',
        meta: {
            layout: 'L=external',
            type: 'popup',
            transition: '',
        },
        component: () => import('@/pages/bridges/External.vue'),
    },
    {
        name: 'Join',
        path: '/join',
        redirect: { name: 'JoinCertification' },
        component: () => import('@/pages/join/Index.vue'),
        children: [
            {
                name: 'JoinCertification',
                path: 'certification',
                component: () => import('@/pages/join/Certification.vue'),
            },
            {
                name: 'JoinInfo',
                path: 'info',
                component: () => import('@/pages/join/Info.vue'),
            },
            {
                name: 'JoinComplete',
                path: 'complete',
                component: () => import('@/pages/join/Complete.vue'),
            },
            {
                name: 'JoinSnsPolicy',
                path: 'sns-policy',
                component: () => import('@/pages/join/sns/Policy.vue'),
            },
            {
                name: 'SnsIdDuplicate',
                path: 'sns-duplicated',
                component: () => import('@/pages/join/sns/Duplicate.vue'),
            },
        ],
        meta: {
            layout: '',
            onlyEmptyUser: true,
            isTopBannerHide: true
        },
    },
    {
        name: 'Main',
        path: '/',
        component: () => import('@/pages/Main.vue'),
    },
    {
        name: 'LiveCommerce',
        path: '/live-commerce',
        component: () => import('@/pages/live/Index.vue'),
    },
    {
        name: 'Best',
        path: '/best',
        component: () => import('@/pages/Best.vue'),
    },
    {
        name: 'BrandMap',
        path: '/brand',
        component: () => import('@/pages/Brand.vue'),
    },
    {
        name: 'CodyShot',
        path: '/cody-shot',
        component: () => import('@/pages/codyShot/Index.vue'),
    },
    {
        name: 'CodyShotDetail',
        path: '/cody-shot/detail/:id(\\d+)',
        component: () => import('@/pages/codyShot/Detail.vue'),
    },
    {
        name: 'SpecialEvent',
        path: '/special-event',
        component: () => import('@/pages/specialEvent/Index.vue'),
    },
    {
        name: 'SpecialEventDetail',
        path: '/special-event/detail/:id(\\d+)',
        component: () => import('@/pages/specialEvent/Detail.vue'),
    },
    {
        name: 'ExperienceGroup',
        path: '/experience-group',
        component: () => import('@/pages/specialEvent/experienceGroup/Index.vue'),
    },
    {
        name: 'Raffle',
        path: '/raffle',
        component: () => import('@/pages/raffle/Index.vue'),
    },
    {
        name: 'RaffleEnd',
        path: '/raffle/end',
        component: () => import('@/pages/raffle/End.vue'),
    },
    {
        name: 'ExperienceReview/Detail',
        path: '/experience-review/detail/:id(\\d+)',
        component: () => import('@/pages/specialEvent/Detail.vue'),
    },
    {
        name: 'ExperienceGroupDetail',
        path: '/experience-group/detail/:id(\\d+)',
        component: () => import('@/pages/specialEvent/experienceGroup/Detail.vue'),
    },
    {
        name: 'SpotTheme',
        path: '/spot-theme/:id(\\d+)',
        meta: {
            layout: '',
            usePathKey: true,
        },
        component: () => import('@/pages/spotTheme/Index.vue'),
    },
    {
        name: 'Login',
        path: '/login',
        meta: {
            layout: '',
            type: '',
            isTopBannerHide: true,
            onlyEmptyUser: true,
        },               
        component: () => import('@/pages/login/Index.vue'),
    },
    {
        name: 'AdultCertification',
        path: '/adult/certification',
        component: () => import('@/pages/AdultCertification.vue'),
    },
    {
        name: 'PasswordChangeAdvice',
        path: '/password-change-advice',
        component: () => import('@/pages/login/PasswordChangeAdvice.vue'),
    },
    {
        name: 'RenewalPasswordChange',
        path: '/renewal/password-change',
        component: () => import('@/pages/renewal/PasswordChange.vue'),
    },
    {
        name: 'Find',
        path: '/find',
        component: () => import('@/pages/find/Index.vue'),
        redirect: { name: 'FindId' },
        children: [
            {
                name: 'FindId',
                path: 'id',
                component: () => import('@/pages/find/Id.vue'),
            },
            {
                name: 'FindIdResult',
                path: 'id/result',
                component: () => import('@/pages/find/IdResult.vue'),
                beforeEnter: (to, from, next) =>  {
                    const { findResultExists } = useIdFindResult();
                    if (!findResultExists.value) {
                        return next({
                            name: 'FindId'
                        })
                    }
                    return next();
                }
            },
            {
                name: 'FindPassword',
                path: 'password',
                component: () => import('@/pages/find/Password.vue'),
            },
            {
                name: 'FindPasswordChange',
                path: 'password/change',
                component: () => import('@/pages/find/PasswordChange.vue'),
                beforeEnter: (to, from, next) =>  {
                    const { findResultExists } = usePasswordFindChange();
                    if (!findResultExists.value) {
                        return next({
                            name: 'FindPassword'
                        })
                    }
                    return next();
                }
            },
        ],
        meta: {
            layout: '',
            type: '',
            isTopBannerHide: true
        },
    },
    {
        name: 'GoodsDetail',
        path: '/goods/detail/:id(\\d+)',
        meta: {
            usePathKey: true,
            layout: '',
        },
        component: () => import('@/pages/goods/Detail.vue'),
    },
    {
        name: 'RaffleDetail',
        path: '/raffle/detail/:id(\\d+)',
        meta: {
            usePathKey: true,
            layout: '',
        },
        component: () => import('@/pages/raffle/Detail.vue'),
    },
    {
        name: 'GoodsBrandIndex',
        path: '/goods/brand/:id(\\d+)',
        meta: {
            usePathKey: true,
            layout: '',
            type: '',
        },
        component: () => import('@/pages/goods/brand/Index.vue'),
    },
    {
        name: 'GoodsSellerIndex',
        path: '/goods/seller/:id(\\d+)',
        meta: {
            usePathKey: true,
            layout: '',
            type: '',
        },
        component: () => import('@/pages/goods/seller/Index.vue'),
    },
    {
        name: 'GoodsCategoryIndex',
        path: '/goods/category/:id',
        meta: {
            layout: '',
            type: '',
            usePathKey: true,
        },
        component: () => import('@/pages/goods/category/Index.vue'),
    },
    {
        name: 'ExhibitCategoryIndex',
        path: '/exhibit/category/:id',
        meta: {
            layout: '',
            type: '',
            usePathKey: true,
        },
        component: () => import('@/pages/exhibit/Category.vue'),
    },
    {
        name: 'Cart',
        path: '/cart',
        meta: {
            layout: '',
            type: '',
            isTopBannerHide: true
        },
        component: () => import('@/pages/cart/Index.vue'),
    },
    {
        name: 'NotFound',
        path: '/:path(.*)',
        meta: {
            isShowGlobalHeader: false,
            isShowFooter: false,
            isTopBannerHide: true,
            layout: 'L=error',
        },
        props: {
            error: new NotFoundError('페이지를 찾을 수 없습니다'),
        },
        component: () => import('@/pages/support/ErrorView.vue'),
    },
    {
        name: 'IeNotSupport',
        path: '/ie-error',
        meta: {
            layout: 'L=error',
            isShowGlobalHeader: false,
            isShowFooter: false,
        },
        component: () => import('@/pages/support/BrowserNotSupport.vue'),
    },
    {
        name: 'CsCenter',
        path: '/cs-center',
        component: () => import('@/pages/csCenter/Index.vue'),
        redirect: { name: 'CsCenterMain' },
        children: [
            {
                name: 'CsCenterMain',
                path: '',
                component: () => import('@/pages/csCenter/Main.vue'),
            },
            {
                name: 'CsCenterNotice',
                path: 'notice',
                component: () => import('@/pages/csCenter/notice/Index.vue'),
                redirect: { name: 'CsCenterNoticeIndex' },
                children: [
                    {
                        name: 'CsCenterNoticeIndex',
                        path: '',
                        component: () => import('@/pages/csCenter/notice/List.vue'),
                    },
                    {
                        name: 'CsCenterNoticeDetail',
                        path: ':id(\\d+)',
                        component: () => import('@/pages/csCenter/notice/Detail.vue'),
                    },
                ],
            },
            {
                name: 'CsCenterInfo',
                path: 'info',
                component: () => import('@/pages/csCenter/info/Index.vue'),
                redirect: { name: 'CsCenterInfoDelivery' },
                children: [
                    {
                        name: 'CsCenterInfoReward', // pro
                        path: 'reward',
                        component: () => import('@/pages/csCenter/info/Reward.vue'),
                    },
                    {
                        name: 'CsCenterInfoDelivery',
                        path: 'delivery',
                        component: () => import('@/pages/csCenter/info/Delivery.vue'),
                    },
                    {
                        name: 'CsCenterInfoReturn',
                        path: 'return',
                        component: () => import('@/pages/csCenter/info/Return.vue'),
                    },
                    {
                        name: 'CsCenterInfoCouponPoint',
                        path: 'coupon-point',
                        component: () => import('@/pages/csCenter/info/CouponPoint.vue'),
                    },
                    {
                        name: 'CsCenterInfoGradeBenefit',
                        path: 'grade-benefit',
                        component: () => import('@/pages/csCenter/info/GradeBenefit.vue'),
                    },
                    {
                        name: 'CsCenterInfoPayKakao', // 유료
                        path: 'pay-kakao',
                        component: () => import('@/pages/csCenter/info/PayKakao.vue'),
                    },
                    {
                        name: 'CsCenterInfoPayNaver', // 유료
                        path: 'pay-naver',
                        component: () => import('@/pages/csCenter/info/PayNaver.vue'),
                    },
                    {
                        name: 'CsCenterInfoPayPayco', // 유료
                        path: 'pay-payco',
                        component: () => import('@/pages/csCenter/info/PayPayco.vue'),
                    },
                    {
                        name: 'CsCenterInfoPayToss', // 유료
                        path: 'pay-toss',
                        component: () => import('@/pages/csCenter/info/PayToss.vue'),
                    },
                ],
            },
        ],
    },
    {
        name: 'PlanningDetail',
        path: '/planning/:id(\\d+)',
        meta: {
            usePathKey: true,
            layout: '',
        },
        component: () => import('@/pages/planning/Detail.vue'),
    },
    {
        name: 'OrderIndex',
        path: '/order/:id',
        meta: {
            layout: '',
            isTopBannerHide: true
        },
        component: () => import('@/pages/order/Member.vue'),
    },
    {
        name: 'GuestOrderIndex',
        path: '/guest/order/:id',
        meta: {
            layout: '',
            isTopBannerHide: true
        },
        component: () => import('@/pages/order/Guest.vue'),
    },
    {
        name: 'OrderResult',
        path: '/order/:id/result',
        meta: {
            layout: '',
            isTopBannerHide: true
        },
        component: () => import('@/pages/order/Result.vue'),
    },
    {
        name: 'SearchResult',
        path: '/search',
        meta: {
            layout: '',
            usePathKey: true,
        },
        component: () => import('@/pages/Search.vue'),
    },
    {
        name: 'Policy',
        path: '/policies/:policyType',
        props: true,
        component: () => import('@/pages/policy/Index.vue'),
    },
    {
        name: 'Showcase',
        path: '/showcase/:sortId?',
        component: () => import('@/pages/showcase/Index.vue'),
    },
    {
        name: 'ShowcaseDetail',
        path: '/showcase/detail/:id(\\d+)',
        meta: {
            usePathKey: true,
            layout: '',
        },
        component: () => import('@/pages/showcase/Detail.vue'),
    },
    {
        name: 'JointPurchase',
        path: '/joint-purchase',
        component: () => import('@/pages/jointPurchase/Index.vue'),
    },
    {
        name: 'JointPurchaseDetail',
        path: '/joint-purchase/detail/:id(\\d+)',
        component: () => import('@/pages/jointPurchase/Detail.vue'),
    },
    {
        name: 'PartnershipInquiryCreate',
        path: '/partnership',
        component: () => import('@/pages/partnership/Create.vue'),
    },
    {
        name: 'Ranking',
        path: '/ranking',
        redirect: { name: 'RankingMain' },
        component: () => import('@/pages/ranking/Index.vue'),
        children: [
            {
                name: 'RankingMain',
                path: '/ranking',
                component: () => import('@/pages/ranking/Main.vue'),
            },
            {
                name: 'RankingItem',
                path: '/ranking/item',
                component: () => import('@/pages/ranking/Item.vue'),
            },
            {
                name: 'RankingBrand',
                path: '/ranking/brand',
                component: () => import('@/pages/ranking/Brand.vue'),
            },
            {
                name: 'RankingView',
                path: '/ranking/view',
                component: () => import('@/pages/ranking/View.vue'),
            },
            {
                name: 'RankingLike',
                path: '/ranking/like',
                component: () => import('@/pages/ranking/Like.vue'),
            },
        ],
    },
    {
        name: 'Company',
        path: '/company',
        component: () => import('@/pages/Company.vue')
    },
    {
        name: 'Maintenance',
        path: '/maintenance',
        component: () => import('@/pages/UnderMaintenance.vue'),
        meta: {
            layout: 'L=error',
            isShowGlobalHeader: false,
            isShowFooter: false,
        },
    }
]
const router = createRouter({
    history: createWebHistory(basePath),
    routes: baseRoute.concat(userPageRoutes).concat(guestMyPageOrderRoutes),
    scrollBehavior(to, from, savedPosition) {
        if (to.name == from.name) {
            return
        }
    },
})

router.onError((err) => {
    const { applyError } = useErrorState(); 
    applyError(err);
})


let loadingBarTimer: NodeJS.Timeout|null;

router.beforeEach((to, from, next) => {
    const store = usePcModeStore();
    if (to.query.pc_mode === 'Y') {
        store.turnOnPcMode();
    }
    
    // 모바일 체크
    if (isMobileAccess && to.query.pc_mode !== 'Y' && !store.isPcModeOn) {
        if (to.path !== '/mobile-redirect') {
            return next({ 
                path: `/mobile-redirect`,
                query: {
                    redirect_url: to.fullPath
                }
            });     
        } else {
            return next();
        }
    }

    const { isUnderMaintenance } = useMaintenanceState()
    if (isUnderMaintenance.value) {
        return to.name !== 'Maintenance' ? next({ name: 'Maintenance'}) : next();
    } else if (to.name == 'Maintenance') {
        return next({ name: 'Main' });
    }
    
    const { isUser, isGuestUser } = useUserState();
    // 회원/비회원 라우트 분기
    if (to.meta.isUserOrderManagePage && !isUser.value && isGuestUser.value) {
        return next(to.fullPath.replace('mypage', 'guest'));
    }

    if (isBrowserNotSupport && to.path != '/ie-error') {
        return next('/ie-error')
    }
    to.meta.isShowFooter = to.meta.isShowFooter !== false
    to.meta.isShowGlobalHeader = to.meta.isShowGlobalHeader !== false
    to.meta.title = to.meta.title || env('MM_APP_NAME')

    if (to.meta.authRequired && !isUser.value) {
        return next('/login?redirect_to_after=' + to.path)
    }

    if (to.meta.guestAuthRequired && !isGuestUser.value) {
        return next('/login')
    }        
    // 로그인된 회원이 접근하면 안되는 경우 (TODO : 경로관련 설정 필요 )
    if (to.meta.onlyEmptyUser && isUser.value) {
        if(to.query.redirect_to_after) {
            return next(`${to.query.redirect_to_after}`);
        }
        return next({
            name: 'MypageBenefitCoupon'
        })
    }

    if (loadingBarTimer) {
        clearTimeout(loadingBarTimer);        
    }
    loadingBarTimer = setTimeout(() => {
        mmon.loading.show();
    }, 150);

    return next()
})

router.afterEach(() => {
    // error context 초기화
    const { hasApplicationError, clearError } = useErrorState(); 
    if (hasApplicationError.value) {
        clearError();
    }

    if (loadingBarTimer) {
        clearTimeout(loadingBarTimer);        
    } 
    mmon.loading.hide();    

    
})


export default router
