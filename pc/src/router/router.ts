import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 선택 사항입니다.
    transition?: string
    authRequired?: boolean
    historyStatePosition?: number,
    guestAuthRequired?: boolean,
    usePathKey?: boolean,
    isUserOrderManagePage?: boolean;
    isTopBannerHide?: boolean;
    // 모든 경로에서 선언해야합니다.
    layout: string,
    type?: string,    
  }
}