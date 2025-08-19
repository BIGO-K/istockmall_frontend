import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, Ref, ref, watchEffect } from 'vue';
import { useLikeStore } from "$/store/like";
import { useAuthStore } from "$/store/auth";
import { useShoppingStore } from '$/store/shopping';
import { RegistedCoupon } from '$/@type/member/coupon';
import { LoginResult, UserInfo } from '$/@type/auth/user';
import { UsableSocialLogins } from "$/@type/configs";
import { defaultCatch, handlePopupOpenWithUrlCallback, ios } from "$/functions";
import { useGenerateUuid } from "$/composables/shoppingComposable";
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { certificateRepository } from "$/repository/auth/certificateRepository";
import { userRepository } from "$/repository/auth/userRepository";
import { registRepository } from "$/repository/auth/registRepository";
import { couponRepository } from "$/repository/member/couponRepository";
import { useSyncShoppingData } from '$/composables/shoppingComposable';
import { MemberConnectedSocials } from '$/@type/member/info';
import { memberInfoRepository } from '$/repository/member/infoRepository';
import { mmon } from '$/helper/mmon';
import { useUserAgent } from '$/composables/commonComposable';
import { HTTP_STATUS_CODE } from '$/constants';
import { guestUserRepository } from '$/repository/guestUserRepository';


interface Flake {
    alpha: number;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
    density: number;
    degree: number;
}

interface BaseFlake {
    flakes: Flake[],
    set : Function
}
/**
 * 회원로그아웃 처리 
*/
export async function useLogout(isWithDraw = false) {
	/** STORE **/
	const likeStore = useLikeStore();
	const authStore = useAuthStore();
	const shoppingStore = useShoppingStore();
	/** //STORE **/
	if (!isWithDraw) {
		await userRepository.logout();
	}

	const logoutWatcher = watchEffect(async() => {
		await Promise.all(
			[
				authStore.clearUserContext(), 
				shoppingStore.clearRecentViewGoodsRecords(),
				shoppingStore.changeCartCount(0),
				likeStore.$reset()
			]
		);
		// uuid 재할당
		await useGenerateUuid(true);
	})

	logoutWatcher();
	
}

export function useRegistCompleteEvent(canvasDom: HTMLCanvasElement, width: number, height: number) {
	const authStore = useAuthStore();

	const maxNum = Math.round(Math.max(width, height) / 15); // 최대갯수
	const loop = ref<number>(2); // 꽃가루 반복 횟수
	const flakeCount = ref<number>(maxNum);
	const colors = ['#61dca7', '#e6e6e6', '#48cc5a', '#ffc400', '#ff9294', '#ff80b3', '#ff7e5d', '#79de4f'];
	const alphas = [1, 0.5]; // 투명도
	const sizes = [12, 6]; // width/height 공통
	const angle = ref(0);
	const base : BaseFlake = {
		flakes: [], // 꽃가루 목록
		// 값 설정
		set: function (flake : Flake) {
			flake.x = Math.random() * width // x 좌표
			flake.y = 0; // y 좌표
			flake.width = sizes[Math.floor(Math.random() * sizes.length)]; // 너비
			flake.height = sizes[Math.floor(Math.random() * sizes.length)]; // 높이
			flake.color = colors[Math.floor(Math.random() * colors.length)]; // 색상
			flake.density = (Math.random() * maxNum) * 2 / maxNum; // 밀도
			flake.degree = (Math.random() * 360) * Math.PI / 180; // 각도
			flake.alpha = alphas[Math.floor(Math.random() * alphas.length)]; // 투명도

			// x축 잘림 방지 x값 조정
			if (flake.x > width - Math.max(flake.width, flake.height)) flake.x = flake.x - Math.max(flake.width, flake.height);
			if (flake.x < Math.max(flake.width, flake.height)) flake.x = flake.x + Math.max(flake.width, flake.height);
		}
	};
	const flakeData = (function () {
		for (let _i = 0; _i < maxNum; _i++) {
			base.flakes[_i] = {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				color : '',
				density: 0,
				degree : 0,
				alpha: 0
			};
			base.set(base.flakes[_i]);
			base.flakes[_i].y = Math.random() * height - height - 20; // y 좌표 - 처음 셋팅시에만 랜덤값
		}
		return base;
	})();
	const flakeAnimationId = ref<number>();

	function drawFlake() {
		if (flakeData.flakes.length == 0 && flakeAnimationId.value) {
			cancelAnimationFrame(flakeAnimationId.value);
			return;
		}

		if (canvasDom === undefined) {
			return;
		}
		const context = canvasDom.getContext('2d');

		if (context === null) {
			return;
		}
		context.clearRect(0, 0, canvasDom.width, canvasDom.height);
		for (var _i = 0; _i < flakeData.flakes.length; _i++) {
			const flake = flakeData.flakes[_i];
			context.fillStyle = flake.color;
			context.globalAlpha = flake.alpha;
			context.globalCompositeOperation = 'destination-over'; // 겹침시 새 꽃가루가 뒤로

			if (flake.degree === 0) {
				context.fillRect(flake.x, flake.y, flake.width, flake.height);
			}
			else {
				const halfWidth = (flake.width / 2);
				const halfHeight = (flake.height / 2);
				context.save(); // 캔버스 위치 저장
				context.translate(flake.x + halfWidth, flake.y + halfHeight); // 캔버스 중심좌표 꽃가루 중심으로 이동
				context.rotate(flake.degree);
				context.fillRect(-halfWidth, -halfHeight, flake.width, flake.height);
				context.restore(); // 캔버스 위치 복원
			}
		}
		updateFlake();
		flakeAnimationId.value = requestAnimationFrame(drawFlake);		
	}

	function updateFlake() {
		angle.value += 0.01;
		for (let _i = 0; _i < flakeData.flakes.length; _i++) {
			const flake = flakeData.flakes[_i];

			// 꽃가루 이동 스타일
			if (_i % 5 == 0) {
				// 좌우
				flake.x += Math.sin(angle.value + flake.density) * 1;
				flake.y += Math.cos(angle.value + flake.density) + 1 + flake.width / 7;
			}
			else {
				// 직선
				flake.y += flake.density + 1; // 밀도 + 이동속도
			}

			// 꽃가루 순환
			if (flake.y > height || flake.x > width || flake.x < -Math.max(flake.width, flake.height)) {
				if (flakeCount.value >= 0) {
					flakeCount.value--;
					if (flakeCount.value === 0) {
						loop.value--;
						if (loop.value >= 1) {
							flakeCount.value = maxNum;
						}
					}
					
					if (loop.value === 1) {
						flakeData.flakes.splice(_i, 1);
					}
				}
				flakeData.set(flake);
			}

			const spin = (flake.width != flake.height) ? 0.4 : 0.1; // 직사각형이 더 빠른회전 확률
			flake.degree += Number(Math.random().toFixed(2)) * spin;
		}
	}

	onBeforeUnmount(() => {
        authStore.clearIdentityProfile();
		authStore.clearThirdPartyProfile();
    })
	
	return { drawFlake }
}

/**
 * 회원 갱신처리  
*/
export async function useRefreshUser() {
	const authStore = useAuthStore();

	return new Promise<void>(async(resolve, reject) => {
		try {
			const userInfo = await userRepository.refreshUser();
			authStore.applyUserContext(userInfo);
			return resolve();
		} catch(e) {
			return reject(e);
		}
    });
}

/**
 * 회원 정보 조회
 */

export function useUserState () {
	/** STORE **/
	const userStore = useAuthStore(); 
	/** //STORE **/

	/** VARIABLE **/
	const { user, guestUser } = storeToRefs(userStore);
	const isUser = computed(() => user?.value !== undefined && user?.value !== null);
	const isGuestUser =  computed(() => guestUser?.value !== undefined && guestUser?.value !== null);
	const onlyVisitor = computed(() => !isUser.value && !isGuestUser.value)
	const needCertificateAge = computed(() => {
		if (!isUser.value) {
			return true
		}
		return user.value.isVerifyAge === false ? true: false
	});

	/** //VARIABLE **/

	/** FUNC **/
	function clearUserContext() {
		userStore.clearUserContext();
	}

	/** //FUNC **/
	return {
		user,
		isUser,
		needCertificateAge,
		guestUser,		
		isGuestUser,
		onlyVisitor,
		clearUserContext
	}
}

export function useAuthenticationProfile() {
	/** STORE **/
	const authStore = useAuthStore(); 
	/** //STORE **/

	/** VARIABLE **/

	const thirdPartyProfile = computed(() => authStore.thirdPartyProfile);

	const identityProfile = computed(() => authStore.identityProfile);

	
	onBeforeUnmount(() => {
		authStore.clearThirdPartyProfile();
	})

	return {
		thirdPartyProfile,
		identityProfile
	}
}

/**
 * 로그인 처리 
 * @returns 
*/
export function useLogin() {
	/** STORE **/
	const userAuthStore = useAuthStore();
	const { savedId, failCount, isAppFirstLogin, shopLoginId, recentSocialLoginType } = storeToRefs(userAuthStore);
	/** //STORE **/

	/** VARIABLE **/
	const { globalConfigs } = useGlobalConfigs();
	const { 		
		applyThirdPartyProfile, 
		increaseFailCount,
		applyDuplicateSocialUsers,
		setAppFirstLogin,
		setShopLoginId,
		setRecentSocialLoginType,
	} = userAuthStore;
	
	const { syncRecentShoppingData } = useSyncShoppingData();
	const needAdditionalCertificate = computed(() => {
		return failCount.value >= 5
	});

	const captchaImage = ref('');
	const captchaToken = ref('');
	const needTransferUserPasswordChange = ref(globalConfigs.value.shop.hasTransferMember);

	const { isAndroidUser } = useUserAgent();
	const usableSocials = computed(() => globalConfigs.value.paidFeatures.usableSocialLogins);
	const awakeCoupon = ref<RegistedCoupon|null>(null);
	/** //VARIABLE **/

	/** FUNC **/	
	async function shopUserLogin(loginForm: {
		loginId: string, 
		password: string, 
		useIdRemember: boolean,
		captchaCode: string
	}): Promise<LoginResult> {
		const { loginId, password, useIdRemember, captchaCode } = loginForm;
		try {
			if (needAdditionalCertificate.value) {
				await certificateRepository.captchaMatched(captchaToken.value, captchaCode);
			}
			const userInfo : UserInfo = await userRepository.getUsers(loginId, password);
			await syncRecentShoppingData(userInfo, useIdRemember);			

			if (userInfo.isAwaked && userInfo.publishedAwakeCouponId) {
				awakeCoupon.value = await couponRepository.getCoupon(userInfo.publishedAwakeCouponId); // 쿠폰 발급되었으면 쿠폰 정보 노출
			}
			
			return {
				isLoginComplete: true,
				verifiedAge : userInfo.isVerifyAge,
				isAwaked: userInfo.isAwaked,
				needPasswordUpdate: userInfo.isNeedPasswordUpdate,
				isDuplicate: false,
				isSocialNameEmpty: false,				
			}

		} catch (e) {
			if (failCount.value === 4) {
				await getCaptchaCode();
			}
			increaseFailCount();			
			throw(e);
		}
	}

	/**
	 * 소셜회원 로그인 처리 
	*/
	async function socialLogin(socialType: string): Promise<LoginResult> {
		if (!['kakao', 'naver', 'apple'].includes(socialType)) {
			throw({
				message: '사용할수 없는 소셜 로그인 입니다.'
			});
		}

		const accessToken = ref<string>('');
		try {
			const { isPopupClose } = await handlePopupOpenWithUrlCallback(			
				'thirdparty-login',
				async() => {
					const { token, enterUrl } = await userRepository.thirdPartyGenerateToken(socialType);
					accessToken.value = token;
					return enterUrl;
				},
				'width=643px, height=593px, resizble=no, scrollbars=yes',
				isAndroidUser ? true : false
			);
			
			const isPopupClosed = ref<boolean>(isPopupClose);
            await checkThirdPartyTokenGenerateStatus(socialType, accessToken.value, isPopupClosed)

			const socialUser = await userRepository.thirdPartyTokenProfile(socialType, accessToken.value);                
			if (socialUser.success === false) {
				throw(socialUser.errorMessage);
			}

			if (socialUser.isRegisteredUser) {
				const socialUserInfo = await userRepository.getSocialUser(socialType, accessToken.value);				
				await syncRecentShoppingData(socialUserInfo, false);
				return {
					isLoginComplete: true,
					verifiedAge : socialUserInfo.isVerifyAge,
					isAwaked: socialUserInfo.isAwaked,
					needPasswordUpdate: false,
					isDuplicate: false,
					isSocialNameEmpty: false,
				}
			}			
			// 소셜회원 이메일로 중복여부 검사 
			const duplicateUsers = await registRepository.socialUserDuplicateCheck(socialUser.profile.email);

			// 중복된 회원이 없는 경우 
			// 가입페이지로 이동해야 하기 때문에 프로필 정보 담아준다.
			if (duplicateUsers.length < 1) {
				await applyThirdPartyProfile(socialUser.profile);
			} else {
				applyDuplicateSocialUsers(duplicateUsers);
			}

			return {
				isLoginComplete: false,
				verifiedAge : false,
				isAwaked: false,
				needPasswordUpdate: false,
				isDuplicate: duplicateUsers.length > 0,
				isSocialNameEmpty: socialUser.profile.name === '',
			}
		} catch(e) {						
			throw(e);
		}
	}

	async function checkThirdPartyTokenGenerateStatus(platform: 'kakao' | 'apple' | 'naver', token: string, isPopupClosed: Ref<boolean>) {
		let isProcessCompleted = false
		return new Promise(async (resolve, reject) => {
			const checkTokenGenerateStatusInterval = setInterval(async () => {
				if (isPopupClosed.value) {
					clearInterval(checkTokenGenerateStatusInterval)
					resolve(isProcessCompleted)
				}
	
				try {
					const isCompleted = await userRepository.thirdPartyIsTokenGenerateCompleted(platform, token)
					if (isCompleted) {
						clearInterval(checkTokenGenerateStatusInterval)
						resolve(isProcessCompleted)
					}
				} catch (e) {
					clearInterval(checkTokenGenerateStatusInterval)
					reject(e)
				}
			}, 1000)
		})
	}
	
	/**
	 * 캡차 코드 조회
	*/
	async function getCaptchaCode() {
		const { captchaImageUrl, token } = await certificateRepository.captchaImage();
		captchaImage.value = captchaImageUrl;
		captchaToken.value = token;
	}

	/**
	 * 캡차 이미지 재조회 
	*/
	async function refreshCaptchaImage() {
		await getCaptchaCode();
	}	

	function loggingLoginSuccess() {
		setAppFirstLogin();
	}

	function saveBiometricPopupForInfo(loginId: string) {
		setShopLoginId(loginId);
	} 

	function saveRecentSocialLoginType(loginType: string) {
		setRecentSocialLoginType(loginType)
	}
	/** //FUNC **/

	/** LIFE CYCLE */
	onMounted(async() => {
		if (needAdditionalCertificate.value) {
			await getCaptchaCode();
		}
	})

	return {
		savedId,
		needAdditionalCertificate,
		usableSocials,
		captchaImage,
		awakeCoupon,
		isAppFirstLogin,
		needTransferUserPasswordChange,
		shopLoginId,
		recentSocialLoginType,
		shopUserLogin,
		socialLogin,
		refreshCaptchaImage,
		loggingLoginSuccess,
		saveBiometricPopupForInfo,
		saveRecentSocialLoginType,
	}
}

export function useGuestLogin(name: string, orderId: string) {
	/** STORE **/
	const authStore = useAuthStore();
	/** //STORE **/

	/** VARIABLE **/

	/** //VARIABLE **/

	/** FUNC **/
	return new Promise<void>(async(resolve, reject) => {
		try {
			if (authStore.user) {
				await useLogout();
			}
			
			const token = await guestUserRepository.guestToken(name, orderId)
			await authStore.applyGuestUserContext({
				accessToken: token,
				guestUser: {
					ordererName: name,
					orderId: orderId
				},
			})
			return resolve();
		} catch(e) {
			return reject(e);
		}
    });
}

/**
 * 소셜회원 중복 관련 컴포저블
 * @returns 
 */
export function useDuplicateSocialUser() {
	/** STORE **/
	const userAuthStore = useAuthStore();
	/** //STORE **/

	/** VARIABLE **/
	const duplicateSocialUsers = computed(() => {
		return userAuthStore.duplicateSocialUsers;
	})

	/** //VARIABLE **/

	/** FUNC **/

	/** //FUNC **/

	onBeforeUnmount(() => {
		userAuthStore.clearDuplicateSocialUsers();
	})

	return {
		duplicateSocialUsers
	}
}

/**
 * 소셜 연동 처리 
*/
export function useConnectSocial() {
	const authStore = useAuthStore();
	const { globalConfigs } = useGlobalConfigs()
	const { user, isUser } = useUserState();
	const { 
		isAndroidApp,
		isIosApp 
	} = useUserAgent();


	const usableSocials = ref<UsableSocialLogins>({
        naver: globalConfigs.value.paidFeatures.usableSocialLogins.naver,
        kakaotalk: globalConfigs.value.paidFeatures.usableSocialLogins.kakaotalk,
        payco: globalConfigs.value.paidFeatures.usableSocialLogins.payco,
        apple: globalConfigs.value.paidFeatures.usableSocialLogins.apple,
        facebook: globalConfigs.value.paidFeatures.usableSocialLogins.facebook
    });

	const hasUsableSocial = computed(() => {
		return Object.values(usableSocials.value).includes(true);
	})

	const connectedSocials = ref<MemberConnectedSocials|null>(null); 
	/** FUNC */
	function toggleConnectedSocial(platform: string, flag: boolean) {
		switch (platform) {
			case 'apple':
				connectedSocials.value.isAppleConnected = flag;
				break;
			case 'naver': 
				connectedSocials.value.isNaverConnected = flag;
				break;
			case 'kakao' :
				connectedSocials.value.isKakaoConnected = flag;
				break;
			case 'facebook' :
				connectedSocials.value.isFacebookConnected = flag;
				break;
			default:
				break;
		}
	}

	/// 소셜연동 해제 처리 
	async function disConnectSocial(platform: 'naver'|'kakao'|'apple'|'facebook') {
		if (user.value === null) {
			return;
		}

		mmon.loading.show();
		try {
			await userRepository.disConnectSocialUser(platform);
			toggleConnectedSocial(platform, false);
			authStore.user.loginType = user.value.loginType === platform ? 'shop' : user.value.loginType;
			mmon.bom.alert('연동 해제 되었습니다.');

		} catch(e) {
			defaultCatch(e);
		} finally {
			mmon.loading.hide();
		}
	}

	function getPlatformLabel(platform: 'naver'|'kakao'|'apple'|'facebook') {
		let platformName = '소셜';
		switch (platform) {
			case 'apple':
				platformName = '애플';
				break;
			case 'naver': 
				platformName = '네이버';
				break;
			case 'kakao' :
				platformName = '카카오';
				break;
			case 'facebook' :
				platformName = '페이스북';
				break;
			default:
				break;
		}

		return platformName;
	}

	async function nativeCallbackNaverLogin(accessToken: string, refreshToken: string) {
		try {
			const socialUser: UserInfo = await userRepository.getSocialUser('naver', accessToken);                
			return mmon.bom.alert('이미 연동된 네이버 계정입니다.\n 다른 네이버 계정을 이용해주세요.');
		} catch (error) {
			if (error.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {                        
				await userRepository.connectSocialUser('naver', accessToken);
				toggleConnectedSocial('naver', true);
				
			} else {
				mmon.bom.alert('네이버 계정 연동에 실패 하였습니다.');
			}
		}
	}
	
	async function connectSocial(platform: 'naver'|'kakao'|'apple'|'facebook') {
		if (isAndroidApp && platform === 'naver') {
			window['nativeCallbackNaverLogin'] = nativeCallbackNaverLogin;
			Android.naverLogin();
		} else if (isIosApp  && platform === 'naver') {
			window['nativeCallbackNaverLogin'] = nativeCallbackNaverLogin;
			ios.run('naverLogin');
		} else {
			mmon.loading.show();
			try {
				const socialUserAccessToken = ref('');
				const { isPopupClose } = await handlePopupOpenWithUrlCallback(                
					'thirdparty-login',
					async () => {
						const { token, enterUrl } = await userRepository.thirdPartyGenerateToken(platform);
						socialUserAccessToken.value = token;
						return enterUrl;
					},                
				);

				const isPopupClosed = ref<boolean>(isPopupClose);
				await checkThirdPartyTokenGenerateStatus(platform, socialUserAccessToken.value, isPopupClosed);            
				const socialUser = await userRepository.thirdPartyTokenProfile(platform, socialUserAccessToken.value);
				
				if (socialUser.isRegisteredUser) {
					
					return mmon.bom.alert(`이미 연동된 ${getPlatformLabel(platform)} 계정입니다.\n 다른 ${getPlatformLabel(platform)} 계정을 이용해주세요.`);
				}

				await userRepository.connectSocialUser(platform, socialUser.profile.accessToken);
				toggleConnectedSocial(platform, true);

			} catch(error) {
				mmon.bom.alert(`${getPlatformLabel(platform)} 계정 연동에 실패하였습니다.`);
			} finally {
				mmon.loading.hide();
			}
		}		
	}

	/**
	 * 서드파티 토큰 발급 완료 여부
	 * @param platform 
	 * @param token 
	 */
	async function checkThirdPartyTokenGenerateStatus(
		platform: 'kakao'|'apple'|'naver'|'facebook', 
		token: string, 
		isPopupClosed: Ref<boolean>
	): Promise<void> {
		return new Promise(async (resolve, reject) => {
			const checkTokenGenerateStatusInterval = setInterval(async () => {
				if (isPopupClosed.value) {
					clearInterval(checkTokenGenerateStatusInterval);
					resolve();
				}
				
				try {
					const isCompleted = await userRepository.thirdPartyIsTokenGenerateCompleted(platform, token);
					if (isCompleted) {
						clearInterval(checkTokenGenerateStatusInterval);
						resolve();
					}
				} catch (e) {
					clearInterval(checkTokenGenerateStatusInterval);
					reject(e);
				}
			}, 1000)
		})
	}

	/** LIFE CYCLE */
	onMounted(async() => {
		if (isUser.value) {
			try {
				connectedSocials.value = await memberInfoRepository.connectedSocials();
			} catch (e) {
				console.log(e)
			}	
		}		
	})

	return {
		usableSocials,
		hasUsableSocial,
		connectedSocials,		
		// func
		disConnectSocial,
		connectSocial
	}
}