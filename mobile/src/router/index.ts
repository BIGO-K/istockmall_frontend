import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { env, isMobile } from '$/functions'
import NotFoundError from '$/errors/NotFoundError'
import { orderManagementRoutes, myPageRoutes } from '@/router/userPage'
import { csCenterRoutes } from '@/router/csCenter'
import { guestMyPageOrderRoutes } from '@/router/guestUserPage'
import { useUserState } from '$/composables/auth/userComposable'
import { useIdFindResult, usePasswordFindChange } from '$/composables/auth/findComposable'
import { useErrorState, useMaintenanceState } from '$/composables/pageHandler/contextComposable'
import { mmon } from '$/helper/mmon';

const isIos = isMobile('ios') || isMobile('app_ios')
const basePath: string | undefined = typeof import.meta.env.MM_APP_BASE_PATH == 'boolean' ? undefined : import.meta.env.MM_APP_BASE_PATH
const baseRoute: RouteRecordRaw[] = [
    {
        name: 'ClaimOffer',
        path: '/print/claim-offer',
        component: () => import('@/pages/main/Index.vue'),
        beforeEnter: () => {
            window.location.href = env('MM_CLAIM_OFFER_URL')
        },
    },    
    {
        name: 'LiveCommerceShowRoom',
        path: '/live-commerce/:roomId',
        props: true,
        meta: {
            layouts: ['L=popup'],
            isHideToolbar: true,
            type: 'popup',
            transition: 'slideInUp',
        },
        component: () => import('@/pages/live/Detail.vue'),
    },
    {
        name: 'EmptyPopup',
        path: '/external',
        meta: {
            layouts: ['L=external'],
            type: 'popup',
            transition: '',
        },
        component: () => import('@/pages/bridges/External.vue'),
    },
    {
        name: 'MainIndex',
        path: '/',
        component: () => import('@/components/layout/Main.vue'),
        redirect: { name: 'Main' },
        children: [
            {
                name: 'Main',
                path: '',
                component: () => import('@/pages/main/Index.vue'),
            },
            {
                name: 'LiveCommerce',
                path: '/live-commerce',
                component: () => import('@/pages/live/Index.vue'),                
            },
            {
                name: 'Best',
                path: '/best',
                component: () => import('@/pages/main/Best.vue'),
            },
            {
                name: 'CodyShot',
                path: '/cody-shot',
                component: () => import('@/pages/main/CodyShot.vue'),
            },
            {
                name: 'SpecialEvent',
                path: '/special-event',
                component: () => import('@/pages/main/SpecialEvent.vue'),
            },
            {
                name: 'Showcase',
                path: '/showcase/:sortId?',
                component: () => import('@/pages/showcase/Index.vue'),
                meta: {
                    layouts: ['L=main'],
                    type: 'main',
                    scrollSelfHandling: true,
                }
            },
            {
                name: 'JointPurchase',
                path: '/joint-purchase/:sort?',
                component: () => import('@/pages/jointPurchase/list/Index.vue'),
                meta: {
                    layouts: ['L=main'],
                    type: 'main',
                    scrollSelfHandling: true,
                }
            },
            {
                name: 'Ranking',
                path: '/ranking',
                component: () => import('@/pages/ranking/Index.vue'),
                redirect: { name: 'RankingMain' },
                meta: {
                    layouts: ['L=main'],
                    transition: '',
                    isRankingChild: true,
                    type: 'main',
                    isHideToolbar: true,
                },
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
                name: 'Raffle',
                path: '/raffle',
                component: () => import('@/pages/main/Raffle.vue'),
            },
            {
                name: 'RaffleEnd',
                path: '/raffle/end',
                component: () => import('@/pages/raffle/End.vue'),
            },
            {
                name: 'SpotTheme',
                path: '/spot-theme/:id(\\d+)',
                component: () => import('@/pages/main/SpotTheme.vue'),
            },
            {
                name: 'ExhibitCategoryIndex',
                path: '/exhibit/category/:id',
                component: () => import('@/pages/exhibit/Category.vue'),
            },
        ],
        meta: {
            layouts: ['L=main'],
            type: 'main',
            transition: '',
        },
    },
    {
        name: 'CodyShotDetail',
        path: '/cody-shot/detail/:id(\\d+)',
        meta: {
            layouts: [],
            isHideToolbar: false,
            type: 'sub',
            transition: 'slide-right',
        },
        component: () => import('@/pages/codyShot/Detail.vue'),
    },
    {
        name: 'SpecialEventDetail',
        path: '/special-event/detail/:id(\\d+)',
        meta: {
            layouts: [],
            isHideToolbar: false,
            type: 'sub',
            transition: 'slide-right',
        },
        component: () => import('@/pages/specialEvent/Detail.vue'),
    },
    {
        name: 'ExperienceGroup',
        path: '/experience-group',
        meta: {
            layouts: [],
            type: 'sub',
            transition: 'slide-right',
        },
        component: () => import('@/pages/specialEvent/experienceGroup/Index.vue'),
    },
    {
        name: 'ExperienceGroupDetail',
        path: '/experience-group/detail/:id(\\d+)',
        meta: {
            layouts: ['L=popup'],
            type: 'popup',
            transition: 'slide-up',
        },
        component: () => import('@/pages/specialEvent/experienceGroup/Detail.vue'),
    },
    {
        name: 'ExperienceGroupCreate',
        path: '/experience-group/create',
        meta: {
            layouts: ['L=popup'],
            type: 'popup',
            transition: 'slide-up',
        },
        component: () => import('@/pages/specialEvent/experienceGroup/Create.vue'),
    },
    {
        name: 'Sidebar',
        path: '/sidebar',
        meta: {
            layouts: ['L=popup', 'L=side', 'L=lowbtn'],
            type: 'side',
            isHideToolbar: true,
            transition: 'slide-left',
        },
        component: () => import('@/pages/sidebar/Index.vue'),        
    },
    {
        name: 'Login',
        path: '/login',
        meta: {
            type: 'popup',
            layouts: ['L=popup', 'L=sign'],
            transition: 'slide-up',
            isHideToolbar: true,
            onlyEmptyUser: true,
        },
        component: () => import('@/pages/login/Index.vue'),
    },
    {
        name: 'AdultCertification',
        path: '/adult/certification',
        meta: {
            type: 'popup',
            layouts: ['L=popup', 'L=sign'],
            transition: 'slide-up',
            isHideToolbar: true,
        },
        component: () => import('@/pages/AdultCertification.vue'),
    },
    {
        name: 'PasswordChangeAdvice',
        path: '/password-change-advice',
        meta: {
            type: 'popup',
            layouts: ['L=popup', 'L=sign'],
            transition: 'slide-up',
            isHideToolbar: true,
        },
        component: () => import('@/pages/login/PasswordChangeAdvice.vue'),
    },
    {
        name: 'Setting',
        path: '/setting',
        meta: {
            layouts: [],
            type: 'sub',
            transition: 'slide-right',
            isHideToolbar: false,
            authRequired: false,
        },
        component: () => import('@/pages/mypage/Setting.vue'),
    },
    {
        name: 'Cart',
        path: '/cart',
        meta: {
            isHideToolbar: true,
            layouts: ['L=lowbtn'],
            type: 'sub',
            transition: 'slide-right',
        },
        component: () => import('@/pages/cart/Index.vue'),
    },
    {
        name: 'RecentViewGoods',
        path: '/recent-view-goods',
        meta: {
            layouts: ['L=popup'],
            type: 'popup',
            transition: 'slide-up',
        },
        component: () => import('@/pages/RecentViewGoods.vue'),
    },
    {
        name: 'PlanningDetail',
        path: '/planning/:id(\\d+)',
        component: () => import('@/pages/planning/Detail.vue'),
        meta: {
            layouts: [],
            type: 'sub',
            transition: 'slide-right',
            scrollSelfHandling: true,
        },
    },
    {
        name: 'GoodsDetail',
        path: '/goods/detail/:id(\\d+)',
        meta: {
            layouts: ['L=lowbtn'],
            isHideToolbar: true,
            type: 'sub',
            transition: '',
            needGoodsZoomImage: true,
            useRecentGoodsButton: true,
            usePathKey: true,
            useRsideHome: true,
        },
        component: () => import('@/pages/goods/Detail.vue'),
    },
    {
        name: 'RaffleDetail',
        path: '/raffle/detail/:id(\\d+)',
        meta: {
            layouts: ['L=lowbtn'],
            isHideToolbar: true,
            type: 'sub',
            transition: '',
            useRecentGoodsButton: true,
            needGoodsZoomImage: true,
            usePathKey: true,
        },
        component: () => import('@/pages/raffle/Detail.vue'),
    },
    {
        name: 'GoodsBrandIndex',
        path: '/goods/brand/:id(\\d+)',
        meta: {
            usePathKey: true,
            layouts: [],
            isHideToolbar: false,
            type: 'sub',
            transition: 'slide-right',
            scrollSelfHandling: true,
        },
        component: () => import('@/pages/goods/brand/Index.vue'),
    },
    {
        name: 'GoodsSellerIndex',
        path: '/goods/seller/:id(\\d+)',
        meta: {
            usePathKey: true,
            layouts: [],
            type: 'sub',
            transition: 'slide-right',
            scrollSelfHandling: true,
        },
        component: () => import('@/pages/goods/seller/Index.vue'),
    },
    {
        name: 'GoodsCategoryIndex',
        path: '/goods/category/:id',
        props: true,
        meta: {
            layouts: [],
            isHideToolbar: false,
            type: 'sub',
            transition: 'slide-right',
            scrollSelfHandling: true,
        },
        component: () => import('@/pages/goods/category/Index.vue'),
    },
    {
        name: 'Search',
        path: '/search-ready',
        meta: {
            layouts: ['L=popup', 'L=search'],
            usePathKey: true,
            isHideToolbar: true,
            type: 'popup',
            transition: 'slide-up',
        },
        component: () => import('@/pages/search/Ready.vue'),
    },
    {
        name: 'SearchResult',
        path: '/search',
        meta: {
            layouts: ['L=popup', 'L=search'],
            usePathKey: true,
            isHideToolbar: true,
            type: 'popup',
            transition: 'slide-up',
            scrollSelfHandling: true,
        },
        component: () => import('@/pages/search/Result.vue'),
    },
    {
        name: 'Join',
        path: '/join',
        redirect: {
            name: 'JoinCertification',
        },
        children: [
            {
                name: 'JoinCertification',
                path: 'certification',
                component: () => import('@/pages/join/Certification.vue'),
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
        ],
        meta: {
            layouts: ['L=popup', 'L=sign'],
            type: 'popup',
            transition: 'slide-up',
            isHideToolbar: true,
            onlyEmptyUser: true,
        },
        component: () => import('@/pages/join/Index.vue'),
    },
    {
        name: 'Find',
        path: '/find',
        component: () => import('@/pages/find/tab/Index.vue'),
        redirect: { name: 'FindId' },
        children: [
            {
                name: 'FindId',
                path: 'id',
                component: () => import('@/pages/find/tab/Id.vue'),
            },
            {
                name: 'FindPassword',
                path: 'password',
                component: () => import('@/pages/find/tab/Password.vue'),
            },
        ],
        meta: {
            type: 'popup',
            layouts: ['L=popup', 'L=sign'],
            transition: 'slide-up',
            isHideToolbar: true,
        },
    },
    {
        name: 'FindIdResult',
        path: '/find/id/result',
        component: () => import('@/pages/find/IdResult.vue'),
        beforeEnter: (to, from, next) =>  {
            const { findResultExists } = useIdFindResult();
            if (!findResultExists.value) {
                return next({
                    name: 'FindId'
                })
            }
            return next();
        },
        meta: {
            type: 'popup',
            layouts: ['L=popup', 'L=sign'],
            transition: 'slide-up',
            isHideToolbar: true,
        },
    },
    {
        name: 'FindPasswordChange',
        path: '/find/password/change',
        component: () => import('@/pages/find/PasswordChange.vue'),
        beforeEnter: (to, from, next) =>  {
            const { findResultExists } = usePasswordFindChange();
            if (!findResultExists.value) {
                return next({
                    name: 'FindPassword'
                })
            }
            return next();
        },
        meta: {
            type: 'popup',
            layouts: ['L=popup', 'L=sign'],
            transition: 'slide-up',
            isHideToolbar: true,
        },
    },
    {
        name: 'GoodsCategory',
        path: '/goods/category',
        meta: {
            type: 'sub',
            layouts: [],
            transition: 'slide-right',
        },
        component: () => import('@/pages/goods/category/Index.vue'),
    },
    {
        name: 'NotFound',
        path: '/:path(.*)',
        meta: {
            layouts: [],
            isShowGlobalHeader: false,
            type: 'error',
        },
        props: {
            error: new NotFoundError('페이지를 찾을 수 없습니다'),
        },
        component: () => import('@/pages/ErrorView.vue'),
    },
    {
        name: 'OrderIndex',
        path: '/order/:id',
        props: true,
        meta: {
            layouts: ['L=popup', 'L=lowbtn'],
            isHideToolbar: true,
            type: 'popup',
            transition: 'slide-up',
        },
        component: () => import('@/pages/order/Member.vue'),
    },
    {
        name: 'OrderResult',
        path: '/order/:id/result',
        props: true,
        meta: {
            layouts: ['L=popup'],
            isHideToolbar: true,
            type: 'popup',
            transition: 'slide-up',
        },
        component: () => import('@/pages/order/Result.vue'),
    },
    {
        name: 'GuestOrderIndex',
        path: '/guest/order/:id',
        meta: {
            layouts: ['L=popup', 'L=lowbtn'],
            isHideToolbar: true,
            type: 'popup',
            transition: 'slide-up',
        },
        component: () => import('@/pages/order/Guest.vue'),
    },
    {
        name: 'ShowcaseDetail',
        path: '/showcase/detail/:id(\\d+)',
        meta: {
            layouts: [],
            transition: 'slide-right',
            type: 'sub',
            usePathKey: true,
        },
        component: () => import('@/pages/showcase/Detail.vue'),
    },
    {
        name: 'JointPurchaseDetail',
        path: '/joint-purchase/detail/:id(\\d+)',
        meta: {
            layouts: ['L=lowbtn'],
            transition: '',
            type: 'sub',            
            isHideToolbar: true,
        },
        component: () => import('@/pages/jointPurchase/Detail.vue'),
    },
    {
        name: 'PolicyDetail',
        path: '/policies/:policyType',
        props: true,
        meta: {
            layouts: ['L=popup'],
            isHideToolbar: true,
            type: 'popup',
            transition: 'slide-up',
        },
        component: () => import('@/pages/policy/Index.vue'),
    },
    // 쿠폰 사용조건 안내 팝업
    {
        name: 'CouponConditions',
        path: '/coupon/conditions/:couponId(\\d+)',
        component: () => import('@/pages/mypage/benefit/Conditions.vue'),
        props: true,
        meta: {
            type: 'popup',
            layouts: ['L=popup'],
            transition: 'slide-up',
            isHideToolbar: false,
        },
    },
    {
        name: 'CertificationNeed',
        path: '/need-certificate',
        component: () => import('@/pages/common/CertificateNeed.vue'),
        props: true,
        meta: {
            type: 'popup',
            layouts: ['L=popup'],
            transition: 'slide-up',
            isHideToolbar: false,
        },
    },
    {
        name: 'Company',
        path: '/company',
        component: () => import('@/pages/Company.vue'),
        meta: {
            layouts: [],
            transition: '',
            type: 'sub',
        },
    },
    {
        name: 'Maintenance',
        path: '/maintenance',
        component: () => import('@/pages/UnderMaintenance.vue'),
        meta: {
            layouts: [],
            isShowGlobalHeader: false,
            type: 'error',
        },
    }
]

let loadingBarTimer: NodeJS.Timeout|null;

const router = createRouter({
    history: createWebHistory(basePath),
    routes: baseRoute.concat(myPageRoutes).concat(csCenterRoutes).concat(orderManagementRoutes).concat(guestMyPageOrderRoutes),
    scrollBehavior(to, from, savedPosition) {
        if (to.name == from.name) {
            return
        }
    },
})

router.onError((err) => {
    // mmon.loading.hide();
    const { applyError } = useErrorState(); 
    console.error('router', err)
    applyError(err);
})


router.beforeEach((to, from, next) => {
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

    // [START 트랜지션 애니메이션 처리] leaveTransition 기본 값 설정
    // 진출 트렌지션 효과 적용 (진입 트렌지션 효과 > RouteRecordRaw에 정의)
    if (!from.meta.isBackPressed && !from.meta.isForward && isIos) {
        // ios 제스쳐 뒤로가기시 트렌지션 적용 x
        to.meta.transition = ''
        to.meta.hideTransition = true
    }
    else if (from.meta.type != 'main' &&
        (from.meta.isBackPressed || (from.meta.historyStatePosition && from.meta.historyStatePosition > window.history.state.position))
    ) {
        if (from.meta.type == 'sub') {
            to.meta.transition = `slide-right-reverse`
        } else if (from.meta.type == 'popup') {
            to.meta.transition = `slide-up-reverse`
        } else {
            to.meta.transition = `${from.meta.transition || 'slide-left'}-reverse`
        }
    }

    // 새로고침 || error || 트렌지션값 없는 경우 적용 x
    if (from.name === undefined || !to.meta.transition || from.meta.type == 'error') {
        to.meta.transition = ''
        to.meta.hideTransition = true
    }

    // [END 트랜지션 애니메이션 처리]

    //로그인이 필요한 경우    
    if (to.meta.authRequired && !isUser.value) {        
        return next('/login?redirect_to_after=' + to.path)
    }

    // 비회원 인증 필요한 경우 
    if (to.meta.guestAuthRequired && !isGuestUser.value) {
        return next('/login')
    }

    // 로그인된 회원이 접근하면 안되는 경우 (TODO : 경로관련 설정 필요 )
    if (to.meta.onlyEmptyUser && isUser.value) {
        if(to.query.redirect_to_after) {
            return next(`${to.query.redirect_to_after}`);
        }
        return next(from.path)
    }
    return next()
})

router.afterEach((to, from) => {
    const { hasApplicationError, clearError } = useErrorState(); 
    if (hasApplicationError.value) {
        clearError();
    }
    
    // if (loadingBarTimer) {
    //     clearTimeout(loadingBarTimer);        
    // } 
    // mmon.loading.hide();   
    // 브라우저 자체 이동시 진출 트랜지션 처리를 위한 값
    to.meta.historyStatePosition = window.history.state.position
})

export default router