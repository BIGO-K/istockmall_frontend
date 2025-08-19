import { RouteRecordRaw } from 'vue-router';
import { usePasswordConfirmToken } from '$/composables/auth/confirmComposable';

// 마이페이지  라우트
export const userPageRoutes: RouteRecordRaw[] = [
    {
        name: 'Mypage',
        path: '/mypage',
        redirect: { name: 'MypageMain' },
        component: () => import('@/pages/mypage/Index.vue'),
        children: [
            {
                name: 'MypageMain',
                path: '',
                component: () => import('@/pages/mypage/Main.vue'),
            },
            {
                name: 'MypageGradeBenefit',
                path: 'grade-benefit',
                component: () => import('@/pages/mypage/GradeBenefit.vue')
            },
            {
                name: 'MypageWish',
                path: 'wish',
                component: () => import('@/pages/mypage/wish/Index.vue'),
                redirect: { name: 'MypageWishGoods' },
                children: [
                    {
                        name: 'MypageWishGoods',
                        path: 'goods',
                        component: () => import('@/pages/mypage/wish/Goods.vue')
                    },
                    {
                        name: 'MypageWishBrands',
                        path: 'brand',
                        component: () => import('@/pages/mypage/wish/Brand.vue')
                    }
                ]
            },
            {
                name: 'MypageRecentView',
                path: 'recent-view',
                component: () => import('@/pages/mypage/recentView/Index.vue'),
            },
            {
                name: 'MypageReview',
                path: 'review',
                component: () => import('@/pages/mypage/review/Index.vue'),
                redirect: { name: 'MypageReviewWritable' },
                children: [
                    {
                        name: 'MypageReviewWritable',
                        path: 'writable',
                        component: () => import('@/pages/mypage/review/Writable.vue'),
                    },
                    {
                        name: 'MypageReviewWritten',
                        path: 'written',
                        component: () => import('@/pages/mypage/review/Written.vue')
                    }
                ]
            },
            {
                name: 'MypageInquiry',
                path: 'inquiry',
                component: () => import('@/pages/mypage/inquiry/Index.vue'),
                redirect: { name: 'MypageInquiryQna'},
                children: [
                    {
                        name: 'MypageInquiryQna',
                        path: 'qna',
                        component: () => import('@/pages/mypage/inquiry/qna/Index.vue'),
                        redirect: { name: 'MypageInquiryQnaList'},
                        children: [
                            {
                                name: 'MypageInquiryQnaList',
                                path: '',
                                component: () => import('@/pages/mypage/inquiry/qna/List.vue'),
                                props: (route) => ({ page: route.query.page ? Number(route.query.page) : 1 }),
                            },
                            {
                                name: 'MypageInquiryQnaCreate',
                                path: 'create',
                                component: () => import('@/pages/mypage/inquiry/qna/Create.vue')
                            },
                        ]
                    },
                    {
                        name: 'MypageInquirySellerQnaList',
                        path: 'seller-qna',
                        component: () => import('@/pages/mypage/inquiry/sellerQna/List.vue'),
                        props: (route) => ({ page: route.query.page ? Number(route.query.page) : 1 }),
                    }
                ]
            },
            {
                name: 'MypageMemberInfo',
                path: 'member-info',
                component: () => import('@/pages/mypage/memberInfo/Index.vue'),
                redirect: { name: 'MypageMemberInfoEdit' },
                children: [
                    {
                        name: 'MypageMemberInfoEdit',
                        path: 'edit',
                        component: () => import('@/pages/mypage/memberInfo/Edit.vue'),
                    },
                    {
                        name: 'MypageWithdraw',
                        path: 'withdraw',
                        component: () => import('@/pages/mypage/memberInfo/Withdraw.vue'),
                    },
                    {
                        name: 'MypageMemberInfoRefundAccount',
                        path: 'refund-account',
                        component: () => import('@/pages/mypage/memberInfo/RefundAccount.vue'),
                    }
                ],
            },
            {
                name: 'MypageBenefit',
                path: 'benefit',
                component: () => import('@/pages/mypage/benefit/Index.vue'),
                redirect: { name: 'MypageBenefitCoupon' },
                children: [
                    {
                        name: 'MypageBenefitCoupon',
                        path: 'coupon',
                        component: () => import('@/pages/mypage/benefit/Coupon.vue'),
                    },
                    {
                        name: 'MypageBenefitPoint',
                        path: 'point',
                        component: () => import('@/pages/mypage/benefit/Point.vue'),
                    }
                ]
            },
            {
                name: 'MypageClaim',
                path: 'claim',
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
                ]
            },
            {
                name: 'MypageRaffleEntry',
                path: 'raffle',
                component: () => import('@/pages/mypage/raffle/List.vue'),
            },
            {
                name: 'MypageOrder',
                path: 'order',
                component: () => import('@/pages/mypage/order/Index.vue'),
                redirect: { name: 'MypageOrderList' },
                children: [
                    {
                        name: 'MypageOrderList',
                        path: '',
                        component: () => import('@/pages/mypage/order/List.vue')
                    },
                    {
                        name: 'MypageOrderDetail',
                        path: 'detail/:id',
                        component: () => import('@/pages/mypage/order/Detail.vue'),
                        meta: {
                            usePathKey: true,
                            layout: '',
                            type : '',
                        }
                    },
                    {
                        name: 'MypageOrderCancelIndex',
                        path: 'cancel',
                        component: () => import('@/pages/mypage/order/cancel/Index.vue'),
                        redirect: { name: 'MypageOrderCancelList' },
                        children: [
                            {
                                name: 'MypageOrderCancelList',
                                path: '',
                                component: () => import('@/pages/mypage/order/cancel/List.vue')
                            },
                            {
                                name: 'MypageOrderCancel',
                                path: ':order_id/:item_id',
                                component: () => import('@/pages/mypage/order/cancel/Cancel.vue'),
                                props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
                            },
                            {
                                name: 'MypageOrderCancelComplete',
                                path: ':order_id/complete/:cancel_ids(.*)*',
                                component: () => import('@/pages/mypage/order/cancel/CancelComplete.vue'),
                                props: (route) => ({ orderId: route.params.order_id, cancelIds: route.params.cancel_ids || [] }),
                            }
                        ]
                    },
                    {
                        name: 'MypageOrderReturnIndex',
                        path: 'return',
                        component: () => import('@/pages/mypage/order/return/Index.vue'),
                        redirect: { name: 'MypageOrderReturnList' },
                        children: [
                            {
                                name: 'MypageOrderReturnList',
                                path: '',
                                component: () => import('@/pages/mypage/order/return/List.vue')
                            },
                            {
                                name: 'MypageOrderReturn',
                                path: ':order_id/:item_id',
                                component: () => import('@/pages/mypage/order/return/Return.vue'),
                                props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
                            },
                            {
                                name: 'MypageOrderReturnComplete',
                                path: ':order_id/complete/:return_ids(.*)*',
                                component: () => import('@/pages/mypage/order/return/ReturnComplete.vue'),
                                props: (route) => ({ orderId: route.params.order_id, returnIds: route.params.return_ids || [] }),
                            },
                        ]
                    },
                    {
                        name: 'MypageOrderExchangeIndex',
                        path: 'exchange',
                        component: () => import('@/pages/mypage/order/exchange/Index.vue'),
                        redirect: { name: 'MypageOrderExchangeList' },
                        children: [
                            {
                                name: 'MypageOrderExchangeList',
                                path: '',
                                component: () => import('@/pages/mypage/order/exchange/List.vue')
                            },
                            {
                                name: 'MypageOrderExchange',
                                path: ':order_id/:item_id',
                                component: () => import('@/pages/mypage/order/exchange/Exchange.vue'),
                                props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
                            },
                            {
                                name: 'MypageOrderExchangeComplete',
                                path: ':order_id/complete/:exchange_id',
                                component: () => import('@/pages/mypage/order/exchange/ExchangeComplete.vue'),
                                props: (route) => ({ orderId: route.params.order_id, exchangeId: route.params.exchange_id }),
                            },
                            {
                                name: 'MypageOrderExchangeToReturn',
                                path: 'to-return/:exchange_id',
                                component: () => import('@/pages/mypage/order/exchange/ToReturn.vue'),
                                props: (route) => ({ exchangeId: route.params.exchange_id }),
                            },
                            {
                                name: 'MypageOrderExchangeToReturnComplete',
                                path: 'to-return-complete/:exchange_id/:return_id',
                                component: () => import('@/pages/mypage/order/exchange/ToReturnComplete.vue'),
                                props: (route) => ({ exchangeId: route.params.exchange_id, returnId: route.params.return_id }),
                            }
                        ]
                    }
                ],
                meta: {                    
                    layout: '',
                    type : '',
                    isUserOrderManagePage: true
                }
            }
        ],
        meta: {
            authRequired: true,
            layout: '',
            type : '',
        }
    }   
]
