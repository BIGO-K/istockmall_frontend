import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 선택 사항입니다.
    transition?: string;
    leaveTransition?: string;
    authRequired?: boolean;
    guestAuthRequired?: boolean;
    historyStatePosition?: number;
    isHideToolbar?: boolean;
    isUserOrderManagePage?: boolean;
    useRecentGoodsButton?: boolean;
    useRsideHome?: boolean;
    hideTransition?: boolean;
    // 모든 경로에서 선언해야합니다.    
    layouts: string[];
    type: 'popup'|'sub'|'goods'|'main'|'side'|'error'
  }
}