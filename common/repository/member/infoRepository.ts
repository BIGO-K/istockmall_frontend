
import { BackendMapper } from '$/dataMapper/backendMapper';
import { formatDate, typeCastBoolean } from '$/filters';
import BaseRepository from '$/repository/baseRepository';
import { 
    MemberInfoResponse, 
    MemberInfo, 
    WithdrawReason, 
    WithdrawReasonListResponse, 
    MemberConnectedSocials 
} from '$/@type/member/info';
import { Tokenable, TokenableResponse } from '$/@type/auth/findResult';

/**
 * 회원정보 레파지토리
 */
class MemberInfoRepository extends BaseRepository {
    
    withdrawReason: WithdrawReason[] = [];

    /**
     * 비밀번호 재확인
     * 
     * @param  {string} password
     * @returns Promise<void>
     */
    async checkPassword(password: string): Promise<Tokenable> {
        const { access_token, expire_at} = await this.dataSource.execute<TokenableResponse>(
            'MEMBER_PREPARE_FOR_EDIT',
            {},
            {
                password: password,
            }
        );
        return {
            token: access_token,
            expireAt: formatDate(expire_at, 'YYYY-MM-DD HH:mm:ss'),
        }
    }

    /**
     * 소셜로그인 재확인
     * 
     * @param  {string} socialType
     * @param  {string} thirdPartyAccessToken
     * @returns Promise<void>
     */
    async reCertificateSocial(platformType:string, thirdPartyAccessToken: string): Promise<Tokenable> {
        const { access_token, expire_at } = await this.dataSource.execute<TokenableResponse>(
            'MEMBER_PREPARE_FOR_EDIT_SOCIAL',
            {},
            {
                platform_type: platformType,
                access_token: thirdPartyAccessToken,
            }
        );
        
        return {
            token: access_token,
            expireAt: formatDate(expire_at, 'YYYY-MM-DD HH:mm:ss'),
        }
    }

    /**
     * 현재 비밀번호 일치 여부 확인
     * 
     * @param  {string} password
     * @param  {string} accessToken
     * @returns Promise<boolean>
     */
    async checkCurrentPassword(password: string, accessToken: string): Promise<boolean> {
        const { is_match } = await this.dataSource.execute<{ is_match: boolean }>(
            'MEMBER_CHECK_CURRENT_PASSWORD',
            {},
            {
                current_password: password,
                access_token: accessToken,
            }
        );
        
        return is_match
    }

    /**
     * 회원정보 수정용 정보 조회
     * 
     * @returns Promise<User>
     */
    async getUserInfo(accessToken: string): Promise<MemberInfo> {
        const response = await this.dataSource.execute<MemberInfoResponse>(
            'MEMBER_EDIT_INFO',
            {
                access_token: accessToken
            },
            {},
        )
        
        const userInfo: MemberInfo = {
            loginId: response.login_id,
            name: response.name,
            email: response.email,
            phone: response.phone,
            birthday: response.birthday,
            isEmailReceive: typeCastBoolean(response.is_email_receive),
            isSmsReceive: typeCastBoolean(response.is_sms_receive),
            registType: response.regist_type
        }
        
        return userInfo;
    }
    
    /**
     * 회원정보 수정처리
     * 
     * @param  {User} userInfo
     * @returns Promise<void>
     */
    async update(userInfo: MemberInfo, accessToken: string): Promise<void> {
        await this.dataSource.execute<void>(
            'MEMBER_UPDATE_INFO',
            {},
            {
                name: userInfo.name,
                phone: userInfo.phone,
                email: userInfo.email,
                birthday: userInfo.birthday,
                is_email_receive: userInfo.isEmailReceive,
                is_sms_receive: userInfo.isSmsReceive,
                access_token: accessToken,
            }
        )
    }
    /**
     * 비밀번호 변경처리
     * 
     * @param  {string} newPassword
     * @param  {string} accessToken
     * @returns Promise<void>
     */
    async changePassword(newPassword: string, accessToken: string): Promise<void> {
        const response = await this.dataSource.execute<void>(
            'MEMBER_CHANGE_PASSWORD',
            {
            },
            {
                new_password: newPassword,
                access_token: accessToken,
            }
        );
    }

    /**
     * 이메일 중복 확인
     * 
     * @param  {string} email
     * @returns Promise
     */
    async checkDuplicateEmail(email: string): Promise<boolean> {
        const { is_duplicate_exists } = await this.dataSource.execute<{ is_duplicate_exists: true }>(
            'MEMBER_CHECK_DUPLICATE_EMAIL',
            {
                email: email,
            },
            {}
        );
        
        return is_duplicate_exists;
    }

    /**
     * 회원탈퇴 사유 GETTER
     */
    async getWithdrawReasons(): Promise<WithdrawReason[]> {
        if (this.withdrawReason.length < 1) {
            await this.setWithdrawReasons();
        }

        return this.withdrawReason;
    }

    /**
     * 회원탈퇴 사유 SETTER
     */
    private async setWithdrawReasons(): Promise<void> {
        const { withdraw_reasons } = await this.dataSource.execute<WithdrawReasonListResponse>(
            'MEMBER_WITHDRAW_REASONS',
            {},
            {}
        );

        this.withdrawReason = (withdraw_reasons || []).map((reason) => {
            return {
                code: reason.code,
                label: reason.label,
                detailReasonRequired: reason.detail_reason_required,
            }
        });
    }

    /**
     * 회원탈퇴 처리
     * 
     * @returns Promise
     */
    async withdraw(accessToken:string, reasonCode: number, reasonDetail?: string): Promise<void> {
        await this.dataSource.execute<void>(
            'MEMBER_WITHDRAW',
            {},
            {
                access_token: accessToken,
                reason_code: reasonCode,
                reason_detail: reasonDetail,
            }
        );
    }

    /**
     * 회원 연결된 소셜 정보 조회
     * @returns 
     */
    async connectedSocials(): Promise<MemberConnectedSocials> {
        const { connected_socials, is_usable_connect } = await this.dataSource.execute<{
            connected_socials: string[],
            is_usable_connect: boolean
        }> (
            'MEMBER_CONNECTED_SOCIALS',
            {},
            {}
        )       
        return {
            isAppleConnected : connected_socials.includes('apple'),
            isNaverConnected : connected_socials.includes('naver'),
            isFacebookConnected: connected_socials.includes('facebook'),
            isKakaoConnected : connected_socials.includes('kakao'),
            isPaycoConnected: connected_socials.includes('payco'),
            isUsableConnect: is_usable_connect
        }
    }
}

const memberInfoRepository = new MemberInfoRepository(
    new BackendMapper
)

export { memberInfoRepository }