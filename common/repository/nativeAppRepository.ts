/** @format */

import { BackendMapper } from "$/dataMapper/backendMapper";
import BaseRepository from "$/repository/baseRepository";
import {
  PushInfo,
  PushInfoResponse,
  AppInfo,
  AppInfoResponse,
} from "$/@type/nativeApp";

class NativeAppRepository extends BaseRepository {
  /**
   * 앱 토큰 저장
   * 앱 첫 진입시 실행
   * @param  {string} token   디바이스 고유토큰
   * @param  {string} os     디바이스 OS ('A': 안드로이드, 'I': ios)
   * @returns Promise
   */
  async storeFirebaseMessagingToken(token: string, os: string): Promise<void> {
    if (token === undefined || os === undefined) {
      return;
    }

    await this.dataSource.execute(
      'APP_STORE_FIREBASE_MESSAGING_TOKEN',
      {},
      {
        token: token,
        os: os,
      }
    );
  }

  /**
   * 앱 토큰 수정 처리
   * 로그인/로그아웃시 실행
   * @param  {string} token   디바이스 고유토큰
   * @param  {string} os     디바이스 OS ('A': 안드로이드, 'I': ios)
   * @returns Promise
   */
  async updateFirebaseMessagingToken(token: string, os: string): Promise<void> {
    if (token === undefined || os === undefined) {
      return;
    }

    await this.dataSource.execute(
      'APP_UPDATE_FIREBASE_MESSAGING_TOKEN',
      {},
      {
        token: token,
        os: os,
      }
    );
  }

  /**
   * 푸시,야간푸시 수신 동의 여부 조회
   * 앱 설정화면에서 실행
   * @param  {string} token   디바이스 고유토큰
   * @param  {string} os     디바이스 OS ('A': 안드로이드, 'I': ios)
   * @returns Promise<PushInfo>
   */
  async getFirebaseMessagingToken(
    token: string,
    os: string
  ): Promise<PushInfo> {
    if (token === undefined || os === undefined) {
      return;
    }

    const { is_receive_push, is_receive_night_push } =
      await this.dataSource.execute<PushInfoResponse>(
        'APP_IS_RECEIVE_PUSH',
        {
          token: token,
          os: os,
        },
        {}
      );

    return {
      isReceivePush: is_receive_push,
      isReceiveNightPush: is_receive_night_push,
    };
  }

  /**
   * 광고성 푸시 수신 동의 여부
   * @param  {string} token
   * @param  {string} os
   * @param  {boolean} isReceivePush      // push 알림 수신
   * @param  {boolean} isReceiveNightPush // 야간 push 알림 수신
   * @returns Promise
   */
  async updatePushNotificationAgree(
    token: string,
    os: string,
    isReceivePush: boolean,
    isReceiveNightPush: boolean
  ): Promise<void> {
    if (token === undefined || os === undefined) {
      return;
    }

    await this.dataSource.execute(
      'APP_UPDATE_PUSH_NOTIFICATION_AGREE',
      {},
      {
        token: token,
        os: os,
        is_notification_agree: isReceivePush,
        is_night_notification_agree: isReceiveNightPush,
      }
    );
  }

  /**
   * 최신앱버전, 앱 업데이트링크 조회
   *
   * @returns Promise<AppInfo>
   */
  async getAppInfo(): Promise<AppInfo> {
    const { recent_app_version, app_update_link } =
      await this.dataSource.execute<AppInfoResponse>("APP_INFO", {}, {});

    return {
      recentAppVersion: recent_app_version,
      appUpdateLink: app_update_link,
    };
  }

  /**
   * 생체인증 토큰 생성
   *
   * @param uuid
   * @returns Promise<string>
   */
  async createBiometricToken(uuid: string): Promise<string> {
    const { token } = await this.dataSource.execute<{ token: string }>(
      'APP_BIOMETRIC_CREATE',
      {},
      {
        uuid: uuid,
      }
    );

    return token;
  }
}

const nativeAppRepository = new NativeAppRepository(new BackendMapper);

export { nativeAppRepository };
