import BaseRepository from '$/repository/baseRepository';
import { JsonMapper } from '$/dataMapper/jsonMapper';
import { BackendMapper } from '$/dataMapper/backendMapper';
import { 
    IdFindResultInfoEmail, 
    IdFindResultInfoPhone, 
    IdFindResultsResponse,
    PasswordFindResultResponse,
    TokenableResponse,
    Tokenable,
} from '$/@type/auth/findResult'
import { formatDate } from '$/filters';

class FindRepository extends BaseRepository
{
    /**
     * 이메일로 아이디 찾기
     * 
     * @param  {string} name
     * @param  {string} email
     * @returns Promise
     */
    async findIdByEmail(name: string, email: string) : Promise<IdFindResultInfoEmail> {
        const { find_results, user_name, access_token, expire_at } = await this.dataSource.execute<IdFindResultsResponse>(
            'AUTH_FIND_ID',
            {},
            {
                name: name,
                find_type: 'email',
                email: email,
            }
        );

        return {
            idFindResults: (find_results || []).map((result) => {
                return {
                    maskingLoginId: result.masking_login_id,
                    registType: result.regist_type,
                }
            }),
            userName: user_name,
            token: access_token,
            findType: 'email',
            email: email,
            expireAt: formatDate(expire_at, 'YYYY-MM-DD HH:mm:ss')
        }
    }

    /**
     * 휴대폰으로 아이디 찾기
     * 
     * @param  {string} name
     * @param  {string} phone
     * @returns Promise
     */
    async findIdByPhone(name: string, phone: string) : Promise<IdFindResultInfoPhone> {
        const { find_results, user_name, access_token, expire_at } = await this.dataSource.execute<IdFindResultsResponse>(
            'AUTH_FIND_ID',
            {},
            {
                name: name,
                find_type: 'phone',
                phone: phone,
            }
        );

        return {
            idFindResults: (find_results || []).map((result) => {
                return {
                    maskingLoginId: result.masking_login_id,
                    registType: result.regist_type,
                }
            }),
            userName: user_name,
            token: access_token,
            findType: 'phone',
            phone: phone,
            expireAt: formatDate(expire_at, 'YYYY-MM-DD HH:mm:ss')
        }
    }
    
    /**
     * 마스킹 해제된 아이디 email로 전송
     * 
     * @param  {string} email
     * @param  {string} token
     * @returns Promise
     */
    async sendUnmaskedIdByEmail(email: string, token: string): Promise<void> {
        await this.dataSource.execute<void>(
            'AUTH_SEND_UNMASKED_ID_EMAIL',
            {},
            {
                email: email,
                access_token: token,
            }
        )
    }

    /**
     * 마스킹 해제된 아이디 휴대폰 번호로 전송
     * 
     * @param  {string} phone
     * @param  {string} token
     * @returns Promise
     */
    async sendUnmaskedIdByPhone(phone: string, token: string): Promise<void> {
        await this.dataSource.execute<void>(
            'AUTH_SEND_UNMASKED_ID_PHONE',
            {},
            {
                phone: phone,
                access_token: token,
            }
        );
    }

    /**
     * 비밀번호 찾기 인증번호 발송(이메일)
     * 
     * @param  {string} loginId
     * @param  {string} name
     * @param  {string} email
     * @returns Promise<number> 인증코드
     */
    async sendVerificationCodeByEmail(loginId: string, name: string, email: string): Promise<Tokenable> {
        const { access_token, expire_at } = await this.dataSource.execute<TokenableResponse>(
            'AUTH_SEND_VERIFICATION_CODE_EMAIL',
            {},
            {
                login_id: loginId,
                name: name,
                email: email,
            }
        );

        return {
            token: access_token,
            expireAt: formatDate(expire_at, 'YYYY-MM-DD HH:mm:ss'),
        }
    }
    
    /**
     * 비밀번호 찾기 인증번호 발송(SMS)
     * 
     * @param  {string} id
     * @param  {string} name
     * @param  {string} phoneNumber
     * @returns Promise<number> 인증코드
     */
    async sendVerificationCodeByPhone(loginId: string, name: string, phoneNumber: string): Promise<Tokenable> {
        const { access_token, expire_at } = await this.dataSource.execute<TokenableResponse>(
            'AUTH_SEND_VERIFICATION_CODE_PHONE',
            {},
            {
                login_id: loginId,
                name: name,
                phone: phoneNumber,
            }
        );

        return {
            token: access_token,
            expireAt: formatDate(expire_at, 'YYYY-MM-DD HH:mm:ss'),
        }
    }

    /**
     * 인증번호 확인
     * 
     * @param  {number} verificationCode
     * @param  {string} token
     * @returns Promise
     */
    async verifyCode(verificationCode: number, accessToken: string): Promise<void> {
        await this.dataSource.execute<void>(
            'AUTH_VERIFY_CODE',
            {},
            {
                verification_code: verificationCode,
                access_token: accessToken
            }
        );
    }

    /**
     * 이메일로 비밀번호 찾기
     * @param  {string} name
     * @param  {string} loginId
     * @param  {number} verificationCode
     * @param  {string} email
     * @returns Promise
     */
     async findPasswordByEmail(
        name: string, 
        loginId: string, 
        verificationCode: number, 
        email: string,
        accessToken: string,
    ): Promise<void> {
        await this.dataSource.execute<void>(
            'AUTH_FIND_PASSWORD',
            {},
            {
                name: name,
                login_id: loginId,
                find_type: 'email',
                email: email,
                verification_code: verificationCode,
                access_token: accessToken,
            }
        );
    }

    /**
     * 휴대폰 번호로 비밀번호 찾기
     * 
     * @param  {string} name
     * @param  {string} loginId
     * @param  {number} verificationCode
     * @param  {string} phoneNumber
     * @returns Promise
     */
     async findPasswordByPhone(
        name: string, 
        loginId: string, 
        verificationCode: number, 
        phoneNumber: string,
        accessToken: string
    ): Promise<void> {
        
        await this.dataSource.execute<PasswordFindResultResponse>(
            'AUTH_FIND_PASSWORD',
            {},
            {
                name: name,
                login_id: loginId,
                find_type: 'phone',
                phone: phoneNumber,
                verification_code: verificationCode,
                access_token: accessToken,
            }
        );
    }

    /**
     * 비밀번호 변경
     * 
     * @param  {string} password
     * @param  {string} token
     * @returns Promise
     */
    async changePassword(password: string, token: string): Promise<void> {
        await this.dataSource.execute<void>(
            'AUTH_CHANGE_PASSWORD',
            {},
            {
                password: password,
                access_token: token,
            }
        );
    }
}

const authFindRepository = new FindRepository(
    new BackendMapper
)

export { authFindRepository }