import { RouteMeta, RouteRecordRaw } from 'vue-router';


const csRouteCommonMeta: RouteMeta = {
    type: 'sub',
    layouts: [],
    transition: 'slide-right',
    isHideToolbar: false,
}

const csCenterRoutes: RouteRecordRaw[] = [
    {
        name: 'CsCenter',
        path: '/cs-center',
        component: () => import('@/pages/csCenter/Main.vue'),
        meta: csRouteCommonMeta        
    },
    {
        name: 'CsCenterFaq',
        path: '/cs-center/faq/:faqTypeId',
        component: () => import('@/pages/csCenter/faq/Index.vue'),
        meta: csRouteCommonMeta    
    },
    {
        name: 'CsCenterNoticeIndex',
        path: '/cs-center/notice',
        component: () => import('@/pages/csCenter/notice/Index.vue'),
        meta: csRouteCommonMeta
    },   
    {
        name: 'CsCenterInfo',
        path: '/cs-center/info',
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
        meta: {
            type: 'popup',
            layouts: ['L=popup'],
            transition: 'slide-up',
            isHideToolbar: false,
        },
    },
]

export {
    csCenterRoutes
}

