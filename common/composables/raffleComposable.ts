import { DeviceType, Raffle } from '$/@type/raffle';
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import moment from 'moment';
import { formatDate, padLeft } from '$/filters';
import { countdown, defaultCatch, isMobile } from '$/functions';
import { AVAILABLE_RAFFLE_DEVICE } from '$/constants';
import { storeToRefs } from 'pinia';
import { useRaffleModalStore } from '$/store/modalPopup/raffle';
import { useRefreshUser, useUserState } from '$/composables/auth/userComposable';
import { mmon } from '$/helper/mmon';
import { useRoute, useRouter } from 'vue-router';
import { useIdentityVerification } from '$/composables/auth/certificateComposable';
import { certificateRepository } from '$/repository/auth/certificateRepository';

/**
 * 래플 정보 제어
 */
export function useRaffleModal() {
    /** STORE **/
    const store = useRaffleModalStore();
    const { raffleId, isRaffleEntry } = storeToRefs(store);
    /** //STORE **/

    /** FUNCTION */
    function setRaffleId(id: number) {
        raffleId.value = id
        setIsRaffleEntry(false);
    }

    function setIsRaffleEntry(isEntry: boolean) {
        isRaffleEntry.value = isEntry;
    }
    /** // FUNCTION */

    return {
        raffleId: computed<number|null>(() => raffleId.value),
        isRaffleEntry: computed<boolean>(() => isRaffleEntry.value),
        setRaffleId,
        setIsRaffleEntry,
    }
}

/**
 * 래플 단일 정보 composable
 * @param raffle 래플
 * @param options 옵션(PC 여부, 타이머 사용여부)
 * @returns 
 */
export function useRaffleItem(
    raffle: Raffle|null, 
    options?: {
        isPc?: boolean, 
        useNoTimer?: boolean 
    }
) {
    /** VARIABLE */
    // 참여 상태 라벨 HTML
    const statusHtml = computed(() => {
        if (raffle == null) {
            return '';
        }
    
        if (raffle.isStart === false) {
            return `<span>Coming soon</span>`;
        }
    
        if (raffle.isEnd === false) {
            return `<span>${raffle.totalEntryCount}</span>명 참여중`;
        } else {
            return `<span>${raffle.totalEntryCount}</span>명 참여`;
        }
    });

    // 당첨자 안내 라벨
    const noticeLabel = computed(() => {
        if (raffle == null) {
            return '';
        }
        return moment().diff(raffle.noticeAt, 'seconds') > 0 
            ? `당첨자 추첨 진행중` 
            : `${formatDate(raffle.noticeAt, 'MM.DD (ddd) HH시 mm분', true)} 당첨자 발표 예정`;
    });

    
    const targetDevice: DeviceType = options?.isPc ? 'PC' : (isMobile('app') ? 'M_APP' : 'M_WEB') 
    // 디바이스 이용 가능 여부
    const isAvailableDevice = computed(() => {
        return (raffle?.availableDeviceList || []).find(device => device === targetDevice);
    });
    // 이용 가능 디바이스 안내 문구 라벨 반환
    const availableDeviceLabel = computed(() => {
        const deviceList = (raffle?.availableDeviceList || [])
            .filter(device => device !== targetDevice)
            .sort();

        const firstDevice = deviceList[0];
        const secondDevice = deviceList[1];

        if (firstDevice !== undefined && secondDevice !== undefined) {
            return options?.isPc ? '모바일에서만 응모 가능' : `${AVAILABLE_RAFFLE_DEVICE[firstDevice]}과 ${AVAILABLE_RAFFLE_DEVICE[secondDevice]}에서만 응모 가능`;
        }

        if (firstDevice !== undefined) {
            return `${AVAILABLE_RAFFLE_DEVICE[firstDevice]}에서만 응모 가능`;
        }

        return '';
    });
    
    // 래플 목표일
    const targetAt = computed(() => {
        if (raffle == null) {
            return '';
        }

        return raffle.isStart ? raffle.endAt: raffle.startAt;
    });

    const countDownFlag = ref(false);
    const countDownTimer = ref<null|NodeJS.Timeout>(null);
    const timerHtml = ref<string>('');
    /** // VARIABLE */

    /** FUNCTION */
    /** // FUNCTION */

    if (!options?.useNoTimer) {
        watch(countDownFlag, () => {
            if (raffle == null) {
                return;
            }
            // 종료되 래플
            if (raffle.isEnd) {
                timerHtml.value = `00<span>:</span>00<span>:</span>00`;
                return;
            }

            // 카운트 시작
            if (countDownTimer.value != null) {
                clearInterval(countDownTimer.value);
            }
            const targetAt = moment(raffle.isStart ? raffle.endAt: raffle.startAt).toString();
            countDownTimer.value = countdown(targetAt, 's', (ms, diff) => {
                timerHtml.value = `${padLeft(String(diff.hour), 2, '0')}
                            <span>:</span>${padLeft(String(diff.minute), 2, '0')}
                            <span>:</span>${padLeft(String(diff.second), 2, '0')}`;

                // 남은 시간이 0.5초 미만일 경우..
                if (ms > 500) {
                    return;
                }

                // 진행 예정 -> 진행중으로 정보 변경 및 타이머 재시작
                if (raffle.isStart === false) {
                    raffle.isStart = true;
                    countDownFlag.value = true;
                    return;
                }

                // 진행 종료 처리
                if (raffle.isEnd === false) {
                    raffle.isEnd = true;
                    timerHtml.value = `00<span>:</span>00<span>:</span>00`;
                    if (countDownTimer.value != null) {
                        clearInterval(countDownTimer.value);
                    }
                    return;
                }
            }, true);
        }, {
            immediate: true
        });
    }

    onUnmounted(() => {
        if (countDownTimer.value !== null) {
            clearInterval(countDownTimer.value);
        }
    })
    return {
        targetAt,
        statusHtml,
        noticeLabel,
        isAvailableDevice,
        availableDeviceLabel,
        timerHtml,
    }
}

/**
 * 래플 응모하기 modal popup
 * @param {null|number} raffleId 
 * @param {Function} onEntry 
 * @returns 
 */
export function useRaffleEntryModalPopup(
    raffleId: number|null, 
    onEntry?: () => void, 
    options?: {
        preventHashChange: boolean
    }
) {
    /** STORE **/
    const { 
        user,
        isUser,
    } = useUserState();
    
    const { 
        raffleId: modalRaffleId,
        isRaffleEntry,
        setRaffleId,
    } = useRaffleModal();
    /** //STORE **/

    /** VARIABLE **/
    const router = useRouter();
    const route = useRoute();
    /** //VARIABLE **/

    /** FUNCTION **/
    /**
     * 응모하기 모달
     * @returns 
     */
    function entryPopupOpen() {
        if (!raffleId) {
            return;
        }
        
        if (!isUser.value) {
            return mmon.bom.confirm('로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?',
                (flag: boolean) => {
                    if (flag) {
                        router.push({
                            name: 'Login',
                            query: {
                                redirect_to_after: route.path
                            }
                        })
                    }
                }
            );
        }

        if (user.value && !user.value.isCertificated) {
            return mmon.bom.confirm('본인인증 완료 후 응모 가능합니다.\n본인인증을 진행하시겠습니까?',
                async (flag: boolean) => {
                    if (!flag) return;

                    try {
                        const { identityProfile } = await useIdentityVerification('width=643px, height=593px, resizble=no, scrollbars=yes', false);
                        await certificateRepository.certificateConfirmUser(identityProfile.token);
                        await useRefreshUser();
                    } catch (e) {
                        defaultCatch(e);
                    }
                }
            )
        }
        setRaffleId(raffleId)
        location.href = '#RAFFLE_ENTRY';
    }

    /**
     * 해시변경 이벤트에 실행되는 이벤트
     * - 래플 응모완료 후 응모상태 변경
     * @param event 
     */
    function hashChangeHandler(event: HashChangeEvent) {
        if (typeof onEntry !== 'function') {
            return;
        }

        const before = event.oldURL.split('#')[1] ?? '';
        
        // 응모한 경우 
        if (before === 'RAFFLE_ENTRY') {
            if (isRaffleEntry.value && raffleId === modalRaffleId.value) {
                onEntry();
            }
        }
    }
    /** //FUNCTION **/

    onMounted(()=> {
        if (!options?.preventHashChange && raffleId && typeof onEntry === 'function') {
            window.addEventListener('hashchange', hashChangeHandler);
        }
    });
    
    onUnmounted(() => {
        if (!options?.preventHashChange && raffleId && typeof onEntry === 'function') {
            window.removeEventListener('hashchange', hashChangeHandler)
        }
    })
    return {
        entryPopupOpen,
    }
}