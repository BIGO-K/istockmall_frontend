import { RouteRecordRaw } from 'vue-router';
const guestCommonMeta = {
    guestAuthRequired: true,
    layout: '',
    type : '',
};
// 마이페이지 비회원 주문관리 라우트
export const guestMyPageOrderRoutes: RouteRecordRaw[] = [{
    name: 'GuestMyPage',
    path: '/guest/order',		
    component: () => import('@/pages/guestMypage/Index.vue'),
    redirect: { name: 'GuestMyPageOrderList' },
    children: [
        {
            name: 'GuestMyPageOrderList',
            path: '',
            component: () => import('@/pages/guestMypage/order/List.vue')
        },
        {
            name: 'GuestMyPageOrderDetail',
            path: 'detail/:id',
            component: () => import('@/pages/guestMypage/order/Detail.vue'),
            meta: {
                usePathKey: true,
                guestAuthRequired: true,
                layout: '',
                type : '',
            }
        },
        {
            name: 'GuestMyPageCancelIndex',
            path: 'cancel',
            component: () => import('@/pages/mypage/order/cancel/Index.vue'),
            redirect: { name: 'GuestMyPageCancelList' },
            children: [
                {
                    name: 'GuestMyPageCancelList',
                    path: '',
                    component: () => import('@/pages/guestMypage/order/cancel/List.vue')
                },
                {
                    name: 'GuestMyPageCancel',
                    path: ':order_id/:item_id',
                    component: () => import('@/pages/guestMypage/order/cancel/Cancel.vue'),
                    props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
                },
                {
                    name: 'GuestMyPageCancelComplete',
                    path: ':order_id/complete/:cancel_ids(.*)*',
                    component: () => import('@/pages/mypage/order/cancel/CancelComplete.vue'),
                    props: (route) => ({ orderId: route.params.order_id, cancelIds: route.params.cancel_ids || [] }),
                }
            ]
        },
        {
            name: 'GuestMyPageReturnIndex',
            path: 'return',
            component: () => import('@/pages/mypage/order/return/Index.vue'),
            redirect: { name: 'GuestMyPageReturnList' },
            children: [
                {
                    name: 'GuestMyPageReturnList',
                    path: '',
                    component: () => import('@/pages/guestMypage/order/return/List.vue')
                },
                {
                    name: 'GuestMyPageReturn',
                    path: ':order_id/:item_id',
                    component: () => import('@/pages/guestMypage/order/return/Return.vue'),
                    props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
                },
                {
                    name: 'GuestMyPageReturnComplete',
                    path: ':order_id/complete/:return_ids(.*)*',
                    component: () => import('@/pages/mypage/order/return/ReturnComplete.vue'),
                    props: (route) => ({ orderId: route.params.order_id, returnIds: route.params.return_ids || [] }),
                },
            ]
        },
        {
            name: 'GuestMyPageExchangeIndex',
            path: 'exchange',
            component: () => import('@/pages/mypage/order/exchange/Index.vue'),
            redirect: { name: 'GuestMyPageExchangeList' },
            children: [
                {
                    name: 'GuestMyPageExchangeList',
                    path: '',
                    component: () => import('@/pages/guestMypage/order/exchange/List.vue')
                },
                {
                    name: 'GuestMyPageExchange',
                    path: ':order_id/:item_id',
                    component: () => import('@/pages/guestMypage/order/exchange/Exchange.vue'),
                    props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
                },
                {
                    name: 'GuestMyPageExchangeComplete',
                    path: ':order_id/complete/:exchange_id',
                    component: () => import('@/pages/mypage/order/exchange/ExchangeComplete.vue'),
                    props: (route) => ({ orderId: route.params.order_id, exchangeId: route.params.exchange_id }),
                },
                {
                    name: 'GuestMyPageExchangeToReturn',
                    path: 'to-return/:exchange_id',
                    component: () => import('@/pages/guestMypage/order/exchange/ToReturn.vue'),
                    props: (route) => ({ exchangeId: route.params.exchange_id }),
                },
                {
                    name: 'GuestMyPageExchangeToReturnComplete',
                    path: 'to-return-complete/:exchange_id/:return_id',
                    component: () => import('@/pages/mypage/order/exchange/ToReturnComplete.vue'),
                    props: (route) => ({ exchangeId: route.params.exchange_id, returnId: route.params.return_id }),
                }
            ]
        }
    ],
    meta: guestCommonMeta

}]
