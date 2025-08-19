// import { usePasswordConfirmToken } from '$/composables/auth/confirmComposable';
import { RouteMeta, RouteRecordRaw } from 'vue-router';

const myPageRouteCommonMeta: RouteMeta = {
    isHideToolbar: false,
    layouts: [],
    authRequired: true,
    type: 'sub',
    transition: 'slide-right',
}

const subMyPageRouteCommonMeta: RouteMeta = {
    isHideToolbar: false,
    layouts: ['L=popup'],
    authRequired: true,
    type: 'popup',
    transition: 'slide-up',
}

const myPageOrderRouteCommonMeta: RouteMeta = {
    isHideToolbar: false,
    layouts: [],
    authRequired: true,
    type: 'sub',
    transition: 'slide-right',
    isUserOrderManagePage: true
}

const myPageOrderPopupRouteMeta: RouteMeta = {
    layouts: [ 'L=popup' ],
    type: 'popup',
    transition: 'slide-up',
    isHideToolbar: false,
    authRequired: true,
    isUserOrderManagePage: true
}

const myPageRoutes: RouteRecordRaw[] = [
    {
        name: 'MypageMemberInfoEdit',
        path: '/mypage/member-info/edit',
        component: () => import('@/pages/mypage/memberInfo/Edit.vue'),
        meta: subMyPageRouteCommonMeta
    },
    {
        name: 'MypageWithdraw',
        path: '/mypage/member-info/withdraw',
        component: () => import('@/pages/mypage/memberInfo/Withdraw.vue'),
        meta: myPageRouteCommonMeta
    },
    {
        name: 'MypageMemberInfoRefundAccount',
        path: '/mypage/member-info/refund-account',
        component: () => import('@/pages/mypage/memberInfo/RefundAccount.vue'),
        meta: myPageRouteCommonMeta
    },
    {
        name: 'Mypage',
        path: '/mypage',
        component: () => import('@/pages/mypage/Main.vue'),
        meta: myPageRouteCommonMeta
    }, 
    {
        name: 'MypageGradeBenefit',
        path: '/mypage/grade-benefit',
        component: () => import('@/pages/mypage/GradeBenefit.vue'),
        meta: subMyPageRouteCommonMeta
    },   
    {
        name: 'MypageRecentView',
        path: '/mypage/recent-view',
        component: () => import('@/pages/mypage/recentView/Index.vue'),
        redirect: { name: 'MypageRecentViewGoods' },
        children: [
            {
                name: 'MypageRecentViewGoods',
                path: 'goods',
                component: () => import('@/pages/mypage/recentView/Goods.vue')
            },
            {
                name: 'MypageRecentViewPlanning',
                path: 'planning',
                component: () => import('@/pages/mypage/recentView/Planning.vue'),
            },
        ],
        meta: myPageRouteCommonMeta
    },
    {
        name: 'MypageWish',
        path: '/mypage/wish',
        component: () => import('@/pages/mypage/wish/Index.vue'),
        redirect: { name: 'MypageWishGoodsIndex' },
        children: [
            {
                name: 'MypageWishGoodsIndex',
                path: '',
                component: () => import('@/pages/mypage/wish/list/Index.vue'),
                redirect: { name: 'MypageWishGoods' },
                children: [
                    {
                        name: 'MypageWishGoods',
                        path: 'goods',
                        component: () => import('@/pages/mypage/wish/list/Goods.vue'),
                    },
                    {
                        name: 'MypageWishBrands',
                        path: 'brand',
                        component: () => import('@/pages/mypage/wish/list/Brand.vue')
                    }
                ]
            },
            {
                name: 'MypageWishGoodsFolder',
                path: 'goods/folder',
                component: () => import('@/pages/mypage/wish/folder/Index.vue'),
                redirect: { name: 'MypageWishGoodsFolderDetail' },
                children: []
            },
        ],
        meta: myPageRouteCommonMeta
    },
    {
        name: 'MypageWishGoodsFolderDetail',
        path: '/mypage/wish/goods/folder/:id(\\d+)',
        component: () => import('@/pages/mypage/wish/folder/Detail.vue'),
        meta: {
            type: 'popup',
            layouts: ['L=popup'],
            transition: 'slide-up',
        }
    },
    {
        name: 'MypageWishGoodsFolderMove',
        path: '/mypage/wish/goods/folder/:id(\\d+)/move',
        props: true,
        component: () => import('@/pages/mypage/wish/folder/Move.vue'),
        meta: {
            type: 'popup',
            layouts: ['L=popup'],
            transition: 'slide-up',
        }
    },
    {
        name: 'MypageReview',
        path: '/mypage/review',
        redirect: { name: 'MypageReviewList' },
        component: () => import('@/pages/mypage/review/Index.vue'),
        children: [
            {
                name: 'MypageReviewList',
                path: '',
                component: () => import('@/pages/mypage/review/list/Index.vue'),
                redirect: { name: 'MypageReviewWritable' },
                children: [
                    {
                        name: 'MypageReviewWritable',
                        path: 'writable',
                        component: () => import('@/pages/mypage/review/list/Writable.vue'),
                    },
                    {
                        name: 'MypageReviewWritten',
                        path: 'written',
                        component: () => import('@/pages/mypage/review/list/Written.vue'),
                    },
                ]
            },
        ],
        meta: myPageRouteCommonMeta
    },
    {
        name: 'MypageInquiry',
        path: '/mypage/inquiry',
        component: () => import('@/pages/mypage/inquiry/Index.vue'),
        redirect: { name: 'MypageInquiryQnaList' },
        children: [
            {
                name: 'MypageInquiryList',
                path: '',
                component: () => import('@/pages/mypage/inquiry/list/Index.vue'),
                redirect: { name: 'MypageInquiryQnaList' },
                children: [
                    {
                        name: 'MypageInquiryQnaList',
                        path: 'qna',
                        component: () => import('@/pages/mypage/inquiry/list/Qna.vue'),
                        props: (route) => ({ page: route.query.page ? Number(route.query.page) : 1 }),
                    },
                    {
                        name: 'MypageInquirySellerQnaList',
                        path: 'seller-qna',
                        component: () => import('@/pages/mypage/inquiry/list/SellerQna.vue'),
                        props: (route) => ({ page: route.query.page ? Number(route.query.page) : 1 }),
                    },
                ]
            },           
        ],
        meta: myPageRouteCommonMeta
    },
    {
        name: 'MypageInquiryQnaCreate',
        path: '/mypage/inquiry/qna/create',
        component: () => import('@/pages/mypage/inquiry/qna/Create.vue'),
        meta: subMyPageRouteCommonMeta
    },
    {
        name: 'MypageBenefit',
        path: '/mypage/benefit/:tabType',
        props: true,
        component: () => import('@/pages/mypage/benefit/Index.vue'),
        meta: myPageRouteCommonMeta
    },  
    {
        name: "MypageMySize",
        path: '/mypage/my-size',
        component: () => import('@/pages/mypage/MySize.vue'),
        meta: {
            layouts: [ 'L=popup', 'L=lowbtn' ],
            type: 'popup',
            transition: 'slide-up',
            isHideToolbar: false,
            authRequired: true,
            isUserOrderManagePage: true
        }
    },
    {
        name: 'MypageRaffleEntry',
        path: '/mypage/raffle',
        component: () => import('@/pages/mypage/raffle/List.vue'),
        meta: myPageRouteCommonMeta
    },
    {
        name: 'MypageClaim',
        path: '/mypage/claim',
        component: () => import('@/pages/mypage/claim/Index.vue'),
        redirect: { name: 'MypageClaimDeliveryDelay' },
        children: [
            {
                name: 'MypageClaimDeliveryDelay',
                path: 'delivery-delay',
                component: () => import('@/pages/mypage/claim/deliveryDelay/Index.vue'),
                redirect: { name: 'MypageClaimDeliveryDelayClaimable' },
                children: [
                    {
                        name: 'MypageClaimDeliveryDelayClaimable',
                        path: '',
                        component: () => import('@/pages/mypage/claim/deliveryDelay/Claimable.vue'),
                    },
                    {
                        name: 'MypageClaimDeliveryDelayResult',
                        path: 'result',
                        component: () => import('@/pages/mypage/claim/deliveryDelay/Result.vue'),
                    }
                ]
            },
            {
                name: 'MypageClaimSoldoutCancel',
                path: 'soldout-cancel',
                component: () => import('@/pages/mypage/claim/soldoutCancel/Index.vue'),
                redirect: { name: 'MypageClaimSoldoutCancelClaimable' },
                children: [
                    {
                        name: 'MypageClaimSoldoutCancelClaimable',
                        path: '',
                        component: () => import('@/pages/mypage/claim/soldoutCancel/Claimable.vue'),
                    },
                    {
                        name: 'MypageClaimSoldoutCancelResult',
                        path: 'result',
                        component: () => import('@/pages/mypage/claim/soldoutCancel/Result.vue'),
                    }
                ]
            },
        ],
        meta: myPageRouteCommonMeta
    },
]

const orderManagementRoutes: RouteRecordRaw[] = [
    {
        name: 'MypageOrder',
        path: '/mypage/order',
        component: () => import('@/pages/mypage/order/Index.vue'),
        redirect: { name: 'MypageOrderList' },
        children: [
            {
                name: 'MypageOrderListIndex',
                path: '',
                component: () => import('@/pages/mypage/order/list/Index.vue'),
                children: [
                    {
                        name: 'MypageOrderList',
                        path: '',
                        component: () => import('@/pages/mypage/order/list/Normal.vue'),
                    },
                    {
                        name: 'MypageOrderCancelList',
                        path: 'cancel',
                        component: () => import('@/pages/mypage/order/list/Cancel.vue'),
                    },
                    {
                        name: 'MypageOrderReturnList',
                        path: 'return',
                        component: () => import('@/pages/mypage/order/list/Return.vue'),
                    },
                    {
                        name: 'MypageOrderExchangeList',
                        path: 'exchange',
                        component: () => import('@/pages/mypage/order/list/Exchange.vue'),
                    }
                ]
            },            
            {
                name: 'MypageOrderDetail',
                path: 'detail/:id',
                component: () => import('@/pages/mypage/order/Detail.vue'),
                meta: {
                    usePathKey: true,
                    layouts: [],
                    type : 'sub',
                }
            },                       
        ],
        meta: myPageOrderRouteCommonMeta
    },
    {
        name: 'MypageOrderCancel',
        path: '/mypage/order/cancel/:order_id/:item_id',
        component: () => import('@/pages/mypage/order/cancel/Cancel.vue'),
        props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
        meta: myPageOrderPopupRouteMeta
    },
    {
        name: 'MypageOrderCancelComplete',
        path: '/mypage/order/cancel/:order_id/complete/:cancel_ids(.*)*',
        component: () => import('@/pages/mypage/order/cancel/CancelComplete.vue'),
        props: (route) => ({ orderId: route.params.order_id, cancelIds: route.params.cancel_ids || [] }),
        meta: myPageOrderPopupRouteMeta
    },
    {
        name: 'MypageOrderReturn',
        path: '/mypage/order/return/:order_id/:item_id',
        component: () => import('@/pages/mypage/order/return/Return.vue'),
        props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
        meta: myPageOrderPopupRouteMeta
    },
    {
        name: 'MypageOrderReturnComplete',
        path: '/mypage/order/return/:order_id/complete/:return_ids*',
        component: () => import('@/pages/mypage/order/return/ReturnComplete.vue'),
        props: (route) => ({ orderId: route.params.order_id, returnIds: route.params.return_ids || [] }),
        meta: myPageOrderPopupRouteMeta
    },
    {
        name: 'MypageOrderExchange',
        path: '/mypage/order/exchange/:order_id/:item_id',
        component: () => import('@/pages/mypage/order/exchange/Exchange.vue'),
        props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
        meta: myPageOrderPopupRouteMeta
    },
    {
        name: 'MypageOrderExchangeComplete',
        path: '/mypage/order/exchange/:order_id/complete/:exchange_id',
        component: () => import('@/pages/mypage/order/exchange/ExchangeComplete.vue'),
        props: (route) => ({ orderId: route.params.order_id, exchangeId: route.params.exchange_id }),
        meta: myPageOrderPopupRouteMeta
    },
    {
        name: 'MypageOrderExchangeToReturn',
        path: '/mypage/order/exchange/to-return/:exchange_id',
        component: () => import('@/pages/mypage/order/exchange/ToReturn.vue'),
        props: (route) => ({ exchangeId: route.params.exchange_id }),
        meta: myPageOrderPopupRouteMeta
    },
    {
        name: 'MypageOrderExchangeToReturnComplete',
        path: '/mypage/order/exchange/to-return-complete/:exchange_id/:return_id',
        component: () => import('@/pages/mypage/order/exchange/ToReturnComplete.vue'),
        props: (route) => ({ exchangeId: route.params.exchange_id, returnId: route.params.return_id }),
        meta: myPageOrderPopupRouteMeta
    }
]

export {
    myPageRoutes,
    orderManagementRoutes,
}

