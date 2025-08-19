import { RouteMeta, RouteRecordRaw } from 'vue-router';

const guestOrderPopupRouteMeta: RouteMeta = {
    layouts: [ 'L=popup' ],
    type: 'popup',
    isHideToolbar: false,
    guestAuthRequired: true,
    transition: 'slide-up',    
}

export const guestMyPageOrderRoutes: RouteRecordRaw[] = [
    {
        name: 'GuestMyPageOrder',
        path: '/guest/order',					
        component: () => import('@/pages/guestMypage/order/Index.vue'),
        redirect: { name: 'GuestMyPageOrderListIndex' },
        children: [
            {
                name: 'GuestMyPageOrderListIndex',
                path: '',
                component: () => import("@/pages/guestMypage/order/list/Index.vue"),
                children: [
                    {
                        name: 'GuestMyPageOrderList',
                        path: '',
                        component: () => import("@/pages/guestMypage/order/list/Normal.vue"),
                    },
                    {
                        name: 'GuestMyPageOrderCancelList',
                        path: 'cancel',
                        component: () => import("@/pages/guestMypage/order/list/Cancel.vue"),
                    },
                    {
                        name: 'GuestMyPageOrderReturnList',
                        path: 'return',
                        component: () => import("@/pages/guestMypage/order/list/Return.vue"),
                    },
                    {
                        name: 'GuestMyPageOrderExchangeList',
                        path: 'exchange',
                        component: () => import("@/pages/guestMypage/order/list/Exchange.vue"),
                    }
                ]
            },
            {
                name: "GuestMyPageOrderDetail",
                path: "detail/:id",
                component: () => import("@/pages/guestMypage/order/Detail.vue"),
                meta: {
                    usePathKey: true,
                    layouts: [],
                    type : 'sub',
                    transition: 'slide-right'
                }
            },
        ],
        meta: {
            isHideToolbar: false,
            guestAuthRequired: true,
            layouts: [],
            type:'sub',
            transition: 'slide-right',
        }
    },
    {
        name: 'GuestMyPageOrderCancel',
        path: '/guest/order/cancel/:order_id/:item_id',
        component: () => import('@/pages/guestMypage/order/Cancel.vue'),
        props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
        meta: guestOrderPopupRouteMeta
    },
    {
        name: 'GuestMyPageOrderCancelComplete',
        path: '/guest/order/cancel/:order_id/complete/:cancel_ids(.*)*',
        component: () => import('@/pages/mypage/order/cancel/CancelComplete.vue'),
        props: (route) => ({ orderId: route.params.order_id, cancelIds: route.params.cancel_ids || [] }),
        meta: guestOrderPopupRouteMeta
    },
    {
        name: 'GuestMyPageOrderReturn',
        path: '/guest/order/return/:order_id/:item_id',
        component: () => import('@/pages/guestMypage/order/Return.vue'),
        props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
        meta: guestOrderPopupRouteMeta
    },
    {
        name: 'GuestMyPageOrderReturnComplete',
        path: '/guest/order/return/:order_id/complete/:return_ids(.*)*',
        component: () => import('@/pages/mypage/order/return/ReturnComplete.vue'),
        props: (route) => ({ orderId: route.params.order_id, returnIds: route.params.return_ids || [] }),
        meta: guestOrderPopupRouteMeta
    },
    {
        name: 'GuestMyPageOrderExchange',
        path: '/guest/order/exchange/:order_id/:item_id',
        component: () => import('@/pages/guestMypage/order/Exchange.vue'),
        props: (route) => ({ orderId: route.params.order_id, orderItemId: Number(route.params.item_id) }),
        meta: guestOrderPopupRouteMeta
    },
    {
        name: 'GuestMyPageOrderExchangeComplete',
        path: '/guest/order/exchange/:order_id/complete/:exchange_id',
        component: () => import('@/pages/mypage/order/exchange/ExchangeComplete.vue'),
        props: (route) => ({ orderId: route.params.order_id, exchangeId: route.params.exchange_id }),
        meta: guestOrderPopupRouteMeta
    },
    {
        name: 'GuestMyPageOrderExchangeToReturn',
        path: '/guest/order/exchange/to-return/:exchange_id',
        component: () => import('@/pages/guestMypage/order/ToReturn.vue'),
        props: (route) => ({ exchangeId: route.params.exchange_id }),
        meta: guestOrderPopupRouteMeta
    },
    {
        name: 'GuestMyPageOrderExchangeToReturnComplete',
        path: '/guest/order/exchange/to-return-complete/:exchange_id/:return_id',
        component: () => import('@/pages/mypage/order/exchange/ToReturnComplete.vue'),
        props: (route) => ({ exchangeId: route.params.exchange_id, returnId: route.params.return_id }),
        meta: guestOrderPopupRouteMeta
    },
];