import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository';
class RenewalRepository extends BaseRepository {

    /**
     * 비밀번호 변경 (리뉴얼)
     *
     * @param {string} newPassword
     * @param {string} token
     * @param {string} accessToken
     */
    async passwordChange(
        newPassword: string,
        token: string,
        accessToken: string,
    ) {
        await this.dataSource.execute<void>(
            'RENEWAL_PASSWORD_CHANGE',
            {},
            {
                new_password: newPassword,
                token: token,
                access_token: accessToken,
            }
        )
    }

    /**
     * (리뉴얼) 회원 조회
     *
     * @param {string} id
     * @param {string} name
     * @param {string} phone
     * @param {string|null} email
     * @param {string|null} birthday
     */
    async findMemberAndGetAccessToken(
        id: string,
        name: string,
        phone: string,
        email?: string,
        birthday?: string,
    ): Promise<string> {
        const { access_token } = await this.dataSource.execute<{
            access_token
        }>(
            'RENEWAL_CHECK_EXIST_USER',
            {},
            {
                login_id: id,
                name: name,
                phone: phone,
                email: email,
                birthday: birthday,
            }
        )

        return access_token;
    }
}

const renewalRepository = new RenewalRepository(
    new BackendMapper
)

export {
    renewalRepository
}