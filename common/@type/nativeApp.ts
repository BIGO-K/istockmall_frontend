
/**
 * 디바이스 푸시 알림
 */
interface PushInfo {
    isReceivePush: boolean;
    isReceiveNightPush: boolean;
}

interface PushInfoResponse {
    is_receive_push: boolean;
    is_receive_night_push: boolean;
}

/**
 * 앱 버전, 앱 업데이트링크
 */
interface AppInfo {
    recentAppVersion: string;
    appUpdateLink: string;
}

interface AppInfoResponse {
    recent_app_version: string;
    app_update_link: string;
}

export type {
    PushInfo,
    PushInfoResponse,
    AppInfo,
    AppInfoResponse,
}