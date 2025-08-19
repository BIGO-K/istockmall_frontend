import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia'
import SecureLS from 'secure-ls'
import { AuthUser, IdentityProfile, SocialUserProfile, UserInfo, AuthToken } from '$/@type/auth/user';
import { userRepository } from '$/repository/auth/userRepository';

const secureLs = new SecureLS({ isCompression: true, })

interface GuestUser { 
    orderId: string
    ordererName: string
}

export const useAuthStore = defineStore('auth', () => {
    const tokenInfo = ref<AuthToken|null>(null);
    const accessToken = ref<string|null>(null);
    const guestUser = ref<GuestUser|null>(null);
    const user = ref<AuthUser|null>(null);
    const savedId = ref<string>('');
    const failCount = ref<number>(0);
    const uuid = ref<string|null>(null);
    const thirdPartyProfile = ref<SocialUserProfile>(null);
    const identityProfile = ref<IdentityProfile|null>(null);
    const isAppFirstLogin = ref<boolean>(true);
    const duplicateSocialUsers = ref<{ platform: string; maskingId: string}[]>([]);
    const shopLoginId = ref<string>('');
    const recentSocialLoginType = ref<string>('');
    /**
     * USER 설정
     * @param loginUser 
    */
    function applyUserContext(userInfo: UserInfo) {
        user.value =  {
            loginId: userInfo.user.loginId,
            name: userInfo.user.name,
            grade: {
                id: userInfo.user.grade.id,
                imageUrl: userInfo.user.grade.imageUrl,
                name: userInfo.user.grade.name,
            },
            isCertificated: userInfo.isCertificated,
            isVerifyAge: userInfo.isVerifyAge,
            loginType: userInfo.user.loginType,
            isAwaked: userInfo.isAwaked,
            isNeedPasswordUpdate: userInfo.isNeedPasswordUpdate
        };

        accessToken.value = userInfo.token;
        tokenInfo.value = {
            token: userInfo.token,
            refreshToken: userInfo.refreshToken,
            expiredAt: userInfo.expiredAt
        }
    }

    function applyGuestUserContext(guestUserProfile :{
        accessToken: string,
        guestUser: {
            ordererName: string,
            orderId: string
        }
    }) {
        accessToken.value = guestUserProfile.accessToken;
        guestUser.value = guestUserProfile.guestUser;
    }

    function clearGuestUserContext() {
        guestUser.value = null;
    }

    /**
     * 본인인증 프로필 설정
     * @param { IdentityProfile } profile : 본인인증 정보
    */
    function applyIdentityProfile(profile: IdentityProfile) {
        identityProfile.value = profile;
    }

    function clearIdentityProfile() {
        identityProfile.value = null;
    }

    /**
     * 소셜회원 정보 설정
     */
    function applyThirdPartyProfile(socialUserProfile: SocialUserProfile) {
        thirdPartyProfile.value = socialUserProfile;
    }

    function clearThirdPartyProfile() {
        thirdPartyProfile.value = null
    }

    /**
     * UUID 설정
     * @param {string} uniqueId : 고유한값
     */
    function setUuid(uniqueId: string) {        
        uuid.value = uniqueId;
    }

    /**
     * 로그인 실패 횟수 증가 처리  
    */
    function increaseFailCount() {
        ++failCount.value;
    }    
    /**
     * 로그인 실패 횟수 초기화 처리  
    */
    function resetFailCount() {
        failCount.value = 0;
    }

    function applySaveId(id: string) {
        savedId.value = id;
    }

    function clearUserContext() {
        accessToken.value = null;
        guestUser.value = null;
        user.value = null;
        thirdPartyProfile.value = null
    }

    function setAppFirstLogin() {
        isAppFirstLogin.value = false;
    }

    function applyDuplicateSocialUsers(duplicateUser: { platform: string, maskingId: string}[]) {
        duplicateSocialUsers.value = duplicateUser;
    }

    function clearDuplicateSocialUsers() {
        duplicateSocialUsers.value = [];
    }

    function setShopLoginId(loginId: string){
        shopLoginId.value = loginId
    }

    function setRecentSocialLoginType(type: string) {
        recentSocialLoginType.value = type
    }

    const isUpdatedToken = ref<boolean>(false);
    
    async function getAccessToken(): Promise<string|null> {
        if (!user.value) {
            return accessToken.value
        }
      
        if (tokenInfo.value) {
            const diffTimes = new Date(tokenInfo.value.expiredAt).getTime() - new Date().getTime();
            if (Math.round((diffTimes / 1000) / 60) < 10 && !isUpdatedToken.value) {
                await updateTokenInfo();
            }
            return tokenInfo.value.token;
        }

        if (!accessToken.value) {
            user.value = null
            return null
        }

        return accessToken.value

    }

    // 토근 갱신처리
    async function updateTokenInfo() {        
        isUpdatedToken.value = true;
        try {
            const { token, expiredAt } = await userRepository.refreshToken(tokenInfo.value.token, tokenInfo.value.refreshToken)
            tokenInfo.value.token = token;
            tokenInfo.value.expiredAt = expiredAt;
        } catch(e) {
            console.log(e);
        } finally {
            isUpdatedToken.value = false;
        }

        
    }


    return {       
        accessToken, 
        guestUser,
        user,
        savedId,
        failCount,
        tokenInfo,
        uuid,        
        thirdPartyProfile,
        identityProfile,
        isAppFirstLogin,
        duplicateSocialUsers,
        shopLoginId,
        recentSocialLoginType,
        // func
        setUuid,
        applyUserContext,
        applyGuestUserContext,
        clearGuestUserContext,
        clearUserContext,
        applyIdentityProfile,
        clearIdentityProfile,
        applyThirdPartyProfile,
        clearThirdPartyProfile,
        applySaveId,
        increaseFailCount,
        resetFailCount,
        setAppFirstLogin,
        applyDuplicateSocialUsers,
        clearDuplicateSocialUsers,
        setShopLoginId,
        setRecentSocialLoginType,
        getAccessToken        
    }
}, 
{
    persistedState: {
        storage: {
            getItem: (key) => secureLs.get(key),
            setItem: (key, value) => secureLs.set(key, value),
            removeItem: (key) => secureLs.remove(key),
        },
    }
})