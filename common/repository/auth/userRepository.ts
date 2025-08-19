import {
    UserInfo,
    UserResponse,
    SocialUserResponse,
    SocialUserProfile,
    SocialUserProfileResponse,
} from "$/@type/auth/user";
import { JsonMapper } from "$/dataMapper/jsonMapper";
import { BackendMapper } from "$/dataMapper/backendMapper";
import { typeCastBoolean, typeCastNumber } from "$/filters";
import BaseRepository from "$/repository/baseRepository";
import { useUserState } from '$/composables/auth/userComposable';
import { useAuthStore } from "$/store/auth";

class UserRepository extends BaseRepository {
    /**
     * ID/PW를 이용한 로그인 처리
     * @param {string} id : 로그인 ID
     * @param {string} password  : 패스워드
     * @returns promise(UserInfo)
     */
    async getUsers(id: string, password: string): Promise<UserInfo> {
        const response = await this.dataSource.execute<UserResponse>(
            'AUTH_LOGIN',
            {},
            {
                login_id: id,
                password: password,
            }
        );

        const user: UserInfo = {
            token: response.token,
            refreshToken: response.refresh_token,
            expiredAt: response.expiry_at,
            user: {
                loginId: response.user.login_id,
                name: response.user.name,
                loginType: "shop",
                grade: {
                    id: typeCastNumber(response.user.grade.id),
                    name: response.user.grade.name,
                    imageUrl: response.user.grade.image_url,
                },
            },
            isVerifyAge: typeCastBoolean(response.is_verify_age),
            isAwaked: typeCastBoolean(response.is_awaked),
            isNeedPasswordUpdate: typeCastBoolean(response.is_need_update_password),
            isCertificated: typeCastBoolean(response.is_certificated),
            publishedAwakeCouponId: response.published_awake_coupon_id,
            publishedComebackCouponId: response.published_comeback_coupon_id,
        }
        return user;
    }

    /**
     * 회원정보 재조회
     * @returns
     */
    async refreshUser(): Promise<UserInfo> {
        const response = await this.dataSource.execute<UserResponse>(
            'AUTH_REFRESH_USER',
            {},
            {}
        );
        
        const { user: beforeUser } = useUserState();

        const user: UserInfo = {
            token: response.token,
            refreshToken: response.refresh_token,
            expiredAt: response.expiry_at,
            user: {
                loginId: response.user.login_id,
                name: response.user.name,
                loginType: beforeUser.value ? beforeUser.value.loginType : 'shop',
                grade: {
                    id: typeCastNumber(response.user.grade.id),
                    name: response.user.grade.name,
                    imageUrl: response.user.grade.image_url,
                },
            },
            isVerifyAge: typeCastBoolean(response.is_verify_age),
            isAwaked: typeCastBoolean(response.is_awaked),
            isNeedPasswordUpdate: typeCastBoolean(response.is_need_update_password),
            isCertificated: typeCastBoolean(response.is_certificated),
            publishedAwakeCouponId: response.published_awake_coupon_id,
            publishedComebackCouponId: response.published_comeback_coupon_id,
        }
        return user;        
    }

    /**
     * 소셜회원 로그인 처리
     * @param {string}socialType  : 소셜구분값
     * @param {string}accessToken : 엑세스 토큰
     * @returns
     */
    async getSocialUser(
        socialType: string,
        accessToken: string
    ): Promise<UserInfo> {
        const response = await this.dataSource.execute<SocialUserResponse>(
            'THIRD_PARTY_LOGIN',
            {},
            {
                platform_type: socialType,
                access_token: accessToken,
            }
        );

        const user: UserInfo = {
            token: response.token,
            refreshToken: response.refresh_token,
            expiredAt: response.expiry_at,
            user: {
                loginId: response.user.login_id,
                name: response.user.name,
                loginType: socialType,
                grade: {
                    id: typeCastNumber(response.user.grade.id),
                    name: response.user.grade.name,
                    imageUrl: response.user.grade.image_url,
                },
            },
            isVerifyAge: typeCastBoolean(response.is_verify_age),
            isAwaked: typeCastBoolean(response.is_awaked),
            isCertificated: typeCastBoolean(response.is_certificated),
            isNeedPasswordUpdate: false,
            publishedAwakeCouponId: response.published_awake_coupon_id,
            publishedComebackCouponId: response.published_comeback_coupon_id,
        }

        return user;
    }

    /**
     * 생체인증을 이용한 로그인 처리
     * @param {string} token : app에 저장된 암호화된 값
     * @param {string} uuid  : 디바이스 uuid 값
     * @returns promise(UserInfo)
     */
    async getBiometricUsers(token: string, uuid: string): Promise<UserInfo> {
        const response = await this.dataSource.execute<{
            token: string;
            user: {
                login_id: string;
                name: string;
                grade: {
                    id: number;
                    name: string;
                    image_url: string;
                };
            };
            login_type: string;
            is_verify_age: boolean;
            is_awaked: boolean;
            is_need_update_password: boolean;
            is_certificated: boolean;
            published_awake_coupon_id: number;
            published_comeback_coupon_id: number;
        }>(
            'APP_BIOMETRIC_LOGIN',
            {},
            {
                token: token,
                uuid: uuid,
            }
        );
        const user: UserInfo = {
            token: response.token,
            user: {
                loginId: response.user.login_id,
                name: response.user.name,
                loginType: response.login_type,
                grade: {
                    id: typeCastNumber(response.user.grade.id),
                    name: response.user.grade.name,
                    imageUrl: response.user.grade.image_url,
                },
            },
            isVerifyAge: typeCastBoolean(response.is_verify_age),
            isAwaked: typeCastBoolean(response.is_awaked),
            isNeedPasswordUpdate: typeCastBoolean(response.is_need_update_password),
            isCertificated: typeCastBoolean(response.is_certificated),
            publishedAwakeCouponId: response.published_awake_coupon_id,
            publishedComebackCouponId: response.published_comeback_coupon_id,
        }
        return user;
    }

    /**
     * 소셜회원 프로필 정보 조회
     * @param {string} socialType: 소셜타입
     * @param {string} accessToken
     */
    async getSocialUserProfile(
        socialType: string,
        accessToken: string
    ): Promise<SocialUserProfile> {
        const response =
            await this.dataSource.execute<SocialUserProfileResponse>(
                'THIRD_PARTY_PROFILE',
                {},
                {
                    platform_type: socialType,
                    access_token: accessToken,
                }
            );

        const socialProfile: SocialUserProfile = {
            platform: socialType,
            accessToken: accessToken,
            birthdate: response.birthdate,
            email: response.email,
            gender:
                response.gender === "M" || response.gender === "W"
                    ? response.gender
                    : "E",
            name: response.name,
            phoneNumber: response.phone_number,
        };
        return socialProfile;
    }

    /**
     * 소셜로그인 토큰생성
     * @param platForm : 소셜 타입
     */
    async thirdPartyGenerateToken(
        platForm: string
    ): Promise<{ enterUrl: string; token: string }> {
        const response = await this.dataSource.execute<{
            enter_url: string;
            token: string;
        }>(
            'THIRD_PARTY_TOKEN',
            {
                platform: platForm,
            },
            {}
        );

        return {
            enterUrl: response.enter_url,
            token: response.token,
        };
    }

    /**
     * 소셜로그인 토큰발급 프로세스 완료 여부 확인
     * @param platform
     * @param token
     * @returns
     */
    async thirdPartyIsTokenGenerateCompleted(
        platform: string,
        token: string
    ): Promise<boolean> {
        const { is_process_finished } = await this.dataSource.execute<{
            is_process_finished: boolean;
        }>(
            'THIRD_PARTY_IS_TOKEN_PROCESS_COMPLETED',
            {
                platform: platform,
                token: token,
            },
            {}
        );

        return typeCastBoolean(is_process_finished);
    }

    /**
     * 토큰으로 소셜회원 프로필 조회
     * @param platForm : 플랫폼 타입
     * @param token : 토큰 타입
     * @returns
     */
    async thirdPartyTokenProfile(
        platForm: string,
        token: string
    ): Promise<{
        success: boolean;
        errorMessage: string;
        profile: SocialUserProfile;
        isRegisteredUser: boolean;
    }> {
        const response = await this.dataSource.execute<{
            success: boolean;
            error_message: string;
            profile: {
                is_registered_user: boolean;
                email: string;
                name: string;
            };
        }>(
            'THIRD_PARTY_TOKEN_RESULT',
            {
                platform: platForm,
                token: token,
            },
            {}
        );

        return {
            success: response.success,
            errorMessage: response.error_message,
            isRegisteredUser:
                response.success === false
                    ? false
                    : response.profile.is_registered_user,
            profile:
                response.success === false
                    ? null
                    : {
                          platform: platForm,
                          email: response.profile.email,
                          name: response.profile.name,
                          accessToken: token,
                          gender: "E",
                          phoneNumber: "",
                          birthdate: "",
                      },
        };
    }

    /**
     * 회원 로그아웃 처리
     */
    async logout(): Promise<void> {
        await this.dataSource.execute<void>('AUTH_LOGOUT', {}, {});
    }

    /**
     * 비밀번호 변경 (변경 권유)
     * @param {string} nowPassword : 현재비밀번호
     * @param {string} newPassword : 새로운 비밀번호
     * @param {boolean} isAfterMonth : 1개월후 변경 여부
     */
    async passwordChange(
        nowPassword: string,
        newPassword: string,
        isAfterMonth: boolean
    ) {
        await this.dataSource.execute<void>(
            'AUTH_PASSWORD_ADVICE_CHANGE',
            {},
            {
                now_password: nowPassword,
                new_password: newPassword,
                after_month: isAfterMonth,
            }
        );
    }

    /**
     * 소셜회원 연동
     * @param {string} platformType: 플랫폼 타입
     * @param {string} token : 소셜토큰
     */
    async connectSocialUser(platformType: string, token: string) {
        await this.dataSource.execute(
            'THIRD_PARTY_USER_CONNECT',
            {
                platform_type: platformType,
                token: token,
            },
            {}
        );
    }

    /**
     * 소셜회원 연동해제
     * @param {string} platformType : 플랫폼 타입
     */
    async disConnectSocialUser(platformType: string) {
        await this.dataSource.execute(
            'THIRD_PARTY_USER_DISCONNECT',
            {
                platform_type: platformType,
            },
            {}
        );
    }

    /**
     * 회원 라이브 커머스 방송용 엑세스 토큰 생성
     * @returns 
     */
    async generateLiveCommerceToken() {
        const response = await this.dataSource.execute<{
            access_token: string
        }>(
            'GENERATE_LIVE_COMMERCE_TOKEN',
            {},
            {}
        );

        return response.access_token
        
    }

    /**
     * 토큰 갱신처리 
     */
    async refreshToken(originToken: string, refreshToken: string): Promise<{
        token: string,
        expiredAt: string
    }> {

        const response = await this.dataSource.execute<{
            token: string,
            expiry_at: string
        }>(
            'AUTH_REFRESH_TOKEN',
            {},
            {
                token: originToken,
                refresh_token: refreshToken
            }
        )

        return {
            token: response.token,
            expiredAt: response.expiry_at
        }
    }
}

const userRepository = new UserRepository(
    new BackendMapper()
    // new JsonMapper
);

export { userRepository };
