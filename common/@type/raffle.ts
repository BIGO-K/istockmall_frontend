/** @format */

import { BaseGoods, BaseResponseGoods } from "$/@type/goods";

/**
 * 베이스 브랜드 인터페이스
 */
interface Raffle {
    id: number;
    availableDeviceList: Array<DeviceType>;
    startAt: string;
    endAt: string;
    noticeAt: string;
    buyStartAt: string;
    buyEndAt: string;
    totalEntryCount: number;
    goods: BaseGoods;
    isEntry: boolean;
    isConfirmedWinner: boolean;
    isStart: boolean;
    isEnd: boolean;
    isNotice: boolean;
    isBuyEnd: boolean;
    isBeforeBuyStart: boolean;
}

/**
 * 래플 합격자 정보
 */
interface RaffleWinner {
    name: string;
    loginId: string;
}

/**
 * 래플 응모시 필요한 사용자 정보
 */
interface UserInfoForEntry {
    name: string;
    loginId: string;
    phone: string;
}

/**
 * 래플 응모 결과
 */
interface EntryResult {
    isWinner: boolean;
    isEntry: boolean;
}

/**
 * API 응답 - 래플
 */
interface RaffleResponse {
    id: number;
    available_device_list: Array<DeviceType>; // 'M_APP', 'M_WEB', 'WEB'
    start_at: string;
    end_at: string;
    notice_at: string;
    buy_start_at: string;
    buy_end_at: string;
    total_entry_count: number;
    goods: BaseResponseGoods;
    is_entry: boolean;
    is_confirmed_winner: boolean;
}

/**
 * API 응답 - 래플 당첨자 정보
 */
interface RaffleWinnerResponse {
    name: string;
    login_id: string;
}

/**
 * API 응답 - 래플 응모시 필요한 사용자 정보
 */
interface UserInfoForEntryResponse {
    name: string;
    login_id: string;
    phone: string;
}

/**
 * API 응답 - 래플 응모 결과
 */
interface EntryResultResponse {
    is_winner: boolean;
    is_entry: boolean;
}

/**
 * 응모 가능 디바이스
 */
type DeviceType = "M_APP" | "M_WEB" | "PC";

/**
 * TODO 삭제 
 * 래플 페이지에서 사용하는 모달 종류
 */
type ModalType = "guid" | "entry" | "winners" | "winning-result";

interface RaffleDetail {
    id: number;
    goodsId: number;
    startAt: string;
    endAt: string;
    isAfterNotice: boolean;
    noticeAt: string;
    buyStartAt: string;
    buyEndAt: string;
    limitWinner: number;
    participantCount: number;
    isStart: boolean;
    isEnd: boolean;
    isBuyEnd: boolean;
    isBeforeBuyStart: boolean;
    isConfirmedWinner: boolean; // 당첨자 추첨 여부
    isEntry: boolean; // 래플 참여 여부    
    availableDeviceList: Array<DeviceType>;
}

export type {
    UserInfoForEntry,
    UserInfoForEntryResponse,
    EntryResult,
    EntryResultResponse,
    Raffle,
    DeviceType,
    ModalType,
    RaffleWinner,
    RaffleResponse,
    RaffleWinnerResponse,
    RaffleDetail,
};
