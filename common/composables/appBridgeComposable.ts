import { LoginResult, UserInfo } from "$/@type/auth/user";
import { PushInfo } from "$/@type/nativeApp";
import { useUserAgent } from "$/composables/commonComposable";
import { useSyncShoppingData } from "$/composables/shoppingComposable";
import { HTTP_STATUS_CODE } from "$/constants";
import { defaultCatch, ios } from "$/functions";
import { mmon } from "$/helper/mmon";
import { registRepository } from "$/repository/auth/registRepository";
import { userRepository } from "$/repository/auth/userRepository";
import { nativeAppRepository } from "$/repository/nativeAppRepository";
import { useAuthStore } from "$/store/auth";
import { useUserAgentStore } from '$/store/userAgent';
import { storeToRefs } from 'pinia';
import { ref, onMounted, computed } from 'vue';

export function useFireBase() {
    /** STORE **/
    const store = useUserAgentStore();
    /** //STORE **/

    /** VARIABLE **/

    /** //VARIABLE **/

    /** FUNC **/
    // 네이티브앱에서 받은 token, os 값 저장 콜백 함수 
    async function storeFirebaseMessagingToken(uniqueId: string, token: string, os : 'I'|'A') {
        
        try {
            await nativeAppRepository.storeFirebaseMessagingToken(token, os);

            store.applyDeviceInfo({
                uuid: uniqueId,
                token: token,
                os: os
            })
        } catch(error) {
            defaultCatch(error);
            // console.log(error);
        }
    }

    /** //FUNC **/
    window['storeFirebaseMessagingToken'] = storeFirebaseMessagingToken; // 네이티브 앱 함수 호출
    
    return {

    }
}

export function useNativeNaverLogin() {
    /** STORE **/
    const authStore = useAuthStore();

    /** //STORE **/

    /** VARIABLE **/
    const { syncRecentShoppingData } = useSyncShoppingData();

    /** //VARIABLE **/

    /** FUNC **/
    async function naverLogin(accessToken: string, refreshToken: string): Promise<LoginResult> {
        try {
        // 소셜 회원이 존재하는 경우 (회원가입까지 된 경우 처리 )
            const socialUser = await userRepository.getSocialUser('naver', accessToken)
            await syncRecentShoppingData(socialUser, false);
            
            return {
                isLoginComplete: true,
                verifiedAge : socialUser.isVerifyAge,
                isAwaked: socialUser.isAwaked,
                needPasswordUpdate: false,
                isDuplicate: false,
                isSocialNameEmpty: false,
            }
        } catch (error) {
        // 회원정보 없음 + 서드파티 인증 프로필 있음 => 가입 페이지로 이동
            if (error.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
                const socialUserProfile = await userRepository.getSocialUserProfile('naver', accessToken)
                const duplicateUsers = await registRepository.socialUserDuplicateCheck(socialUserProfile.email)

                if (duplicateUsers.length < 1) {
                    await authStore.applyThirdPartyProfile(socialUserProfile);
                } else {
                    authStore.applyDuplicateSocialUsers(duplicateUsers);
                }

                return {
                    isLoginComplete: false,
                    verifiedAge : false,
                    isAwaked: false,
                    needPasswordUpdate: false,
                    isDuplicate: duplicateUsers.length > 0,
                    isSocialNameEmpty: socialUserProfile.name === '',
                }
            } else {
                throw({
                    message: '네이버 로그인에 실패 하였습니다.'
                });
            }
        }
    }
    return {
        naverLogin
    }    
}

export function useBiometricLogin() {

    const userAgentStore = useUserAgentStore();
    const {
        deviceInfo
    } = storeToRefs(userAgentStore);
    const {
        isIosApp,
        isAndroidApp
    } = useUserAgent();

    const { syncRecentShoppingData } = useSyncShoppingData();

    async function biometricLogin(token: string): Promise<LoginResult> {
        if (!token || token === '') {
            throw {
                message: '생체 인증 로그인에 실패 하였습니다. \n 다시 시도해주세요.'
            }
		}

        if (deviceInfo.value === null) {
            return;
        }
        mmon.loading.show();
        try {
			const biometricUserInfo: UserInfo = await userRepository.getBiometricUsers(token, deviceInfo.value.uuid);
			await syncRecentShoppingData(biometricUserInfo, false);

			return {
				isLoginComplete: true,
				verifiedAge : biometricUserInfo.isVerifyAge,
				isAwaked: biometricUserInfo.isAwaked,
				needPasswordUpdate: biometricUserInfo.isNeedPasswordUpdate,
				isDuplicate: false,
				isSocialNameEmpty: false,				
			}
		} catch(e) {                        
            throw(e);
		}
        finally {
            mmon.loading.hide();
        }
    }

    async function storeToken() {
        if (deviceInfo.value === null) {
            return;
        }
        try {
            const loginToken = await nativeAppRepository.createBiometricToken(deviceInfo.value.uuid);
    
            if (isIosApp) {
                ios.run('setBioMetricToken', loginToken);
            } else if (isAndroidApp) {
                Android.setBioMetricToken(loginToken);
            }
        } catch (error) {
            throw(error);
        } 
    }

    return {
        biometricLogin,
        storeToken
    }
}

export function useSetting() {
    /** STORE **/

    /** //STORE **/

    /** VARIABLE **/
    const {
        isAppUser,
        isAndroidApp,
        isIosApp,
        deviceInfo
    } = useUserAgent();

    const hasBioMetricLogin = ref<boolean>(false);
    const isReceivePush = ref<boolean>(false);
    const isReceiveNightPush = ref<boolean>(false);
    const appUpdateLink = computed(() => {
        if (isIosApp) {
            return 'itms-apps://itunes.apple.com/kr/app/apple-store/id6446163570';
        } 
        return `http://play.google.com/store/apps/details?id=kr.co.stockcompany.istockmall&is_out_intent=Y`
    });
    /** //VARIABLE **/

    /** FUNC **/

     /**
     *  생체인증 콜백함수
    */
     async function createBiometricToken(accessToken: string) {
        if (deviceInfo.value === null) {
            return;
        }

        try {
            const loginToken = await nativeAppRepository.createBiometricToken(deviceInfo.value.uuid);
            if (isIosApp) {
                ios.run('setBioMetricToken', loginToken);
            } else if (isAndroidApp) {
                Android.setBioMetricToken(loginToken);
            }

            if (loginToken !== '') {
                hasBioMetricLogin.value = true;
                mmon.bom.alert('생체인증 정보가 등록되었습니다.');
            }
        } catch (error) {
            mmon.bom.alert('생체인식 정보 등록에 실패 하였습니다.\n 다시 시도해주세요.');
        } finally {
            mmon.loading.hide();
        }
    }
    /**
     * 생체인증 로그인 동의 여부 토글
     */
    function toggleUsingBiometric() {
        if (hasBioMetricLogin.value === true) {
            if (isIosApp) {
                window['nativeCallbackBiometricLogin'] = createBiometricToken;
                ios.run('biometricLogin');
            } else if (isAndroidApp) {
                window['nativeCallbackBiometricLogin'] = createBiometricToken;
                Android.bioMetricLogin('');
            }
            hasBioMetricLogin.value = false;
        } else {
            if (isIosApp) {
                ios.run('removeBioMetricToken');
            } else if (isAndroidApp) {
                Android.removeBioMetricToken();
            }
        }
    }

    function iosBiometricExist(accessToken: string) {
        hasBioMetricLogin.value = accessToken !== '' ? true: false
    }

    /**
     * 디바이스 푸시 데이터 업데이트 
     */        
    async function togglePushReceive() {
        if (deviceInfo.value === null) {
            return;
        }

        try {
            await nativeAppRepository.updatePushNotificationAgree(
                deviceInfo.value.token, 
                deviceInfo.value.os, 
                isReceivePush.value,
                isReceiveNightPush.value
            );
        } catch(error) {
            console.log(error);
        }
    }

    async function syncFirebaseToken() {
        if (!isAppUser || deviceInfo.value === null) {
            return;
        }

        try {       
            await nativeAppRepository.updateFirebaseMessagingToken(
                deviceInfo.value.token, 
                deviceInfo.value.os
            );
        } catch(error) {
            console.log(error);
        }
    }

    /**
     * 디바이스 푸시 데이터 조회
     */
    async function fetchDevicePushInfo() {
        if (deviceInfo.value === null) {
            return;
        }
        try {
            const pushInfo: PushInfo = await nativeAppRepository.getFirebaseMessagingToken(
                deviceInfo.value.token,
                deviceInfo.value.os
            );
            isReceivePush.value = pushInfo.isReceivePush;
            isReceiveNightPush.value = pushInfo.isReceiveNightPush;
        } catch(error) {
            console.log(error);
        }
    }

    /** //FUNC **/

    /** LIFE CYCLE */
    onMounted(async() => {
        if (isAppUser) {
            await fetchDevicePushInfo();   
        }

        if (isIosApp) {
            window['nativeCallbackBiometricUse'] = iosBiometricExist;
            ios.run('isBioMetricUse');
        } else if (isAndroidApp) {
            if (Android.isBioMetricUse() && Android.getBioMetricToken() != '' ) {
                hasBioMetricLogin.value = true;
            } else {
                hasBioMetricLogin.value = false;
            }
        }
    })

    return {
        hasBioMetricLogin,
        isReceivePush,
        isReceiveNightPush,
        appUpdateLink,
        // func
        togglePushReceive,
        toggleUsingBiometric,
        syncFirebaseToken
    }
}