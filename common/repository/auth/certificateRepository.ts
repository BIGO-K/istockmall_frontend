import { IdentityProfile } from '$/@type/auth/user';
import { JsonMapper } from '$/dataMapper/jsonMapper'
import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository';

/**
 * CertificateRepository Class
 */
class CertificateRepository extends BaseRepository
{
    /**
     * 토큰 및 본인인증 URL 조회      
     * @returns 
     */
    async getTokenWithEnterUrl() : Promise<
        {
            token : string,
            enterUrl : string
        }>         
    {
        const {token, enter_url } = await this.dataSource.execute<
        {
            token: string;
            enter_url: string;
        }>(
            'IDENTITY_VERIFICATION_GENERATE_TOKEN', 
            {}, 
            {}
        );
        return {
            token,
            enterUrl : enter_url
        }
    }

    /**
     * 
     * @returns 
     */
    async getIdentityProfile(token : string) : Promise<IdentityProfile>
    {
        const { birth_date, gender, name, phone_number } = await this.dataSource.execute<{
            birth_date: Date;
            gender: string;
            name: string;
            phone_number: string
        }>(
            'IDENTITY_VERIFICATION_RESULT',
            { token },
            {}
        );
        const profile : IdentityProfile = {
            birthDay: birth_date,
            gender: gender,
            name: name,
            phoneNumber: phone_number,
            token: token
        };

        return profile;
    }

    /**
     * 성인인증 처리
     * @param token : 본인인증에 사용된 토큰
     */
    async adultCertificate(token: string) {
        await this.dataSource.execute(
            'MEMBER_ADULT_VERIFICATIONS',
            {},
            {
                token: token
            }
        );
    }

    /**
     * 소셜회원 본인 인증 처리 
     * @param token 
     */
    async certificateConfirmUser(token: string) {
        await this.dataSource.execute(
            'AUTH_IDENTITY_VERIFICATION_CONFIRM',
            {},
            {
                token: token
            }
        )
    }

    /**
     * 캡차 이미지 조회
     * @returns { captchaImageUrl: string, token: string}
     */

    async captchaImage(): Promise<{
        captchaImageUrl: string,
        token: string
    }> {
        const response = await this.dataSource.execute<{
            captcha_image_url: string,
            token: string

        }>(
            'AUTH_CAPTCHA_IMAGE',
            {},
            {}
        );

        return {
            captchaImageUrl: response.captcha_image_url,
            token: response.token
        }
    }

    /**
     * 캡차 검증처리 
     * @param {string} token : 캡차이미지 조회시 발급된 토큰값
     * @param {string} code : 캡차코드값
     */
    async captchaMatched(token: string, code: string) {
        await this.dataSource.execute(
            'AUTH_CAPTCHA_CERTIFICATE',
            {},
            {
                token: token,
                captcha_code: code
            }
        )
    }
}

const certificateRepository = new CertificateRepository(
    new BackendMapper
)

export { certificateRepository }