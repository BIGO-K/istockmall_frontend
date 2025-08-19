import { DuplicateSocialUser, RegistUser, SocialRegistUser, RegistEvent, RegistEventResponse} from "$/@type/auth/user";
import { Policy } from "$/@type/policy";
import { BackendMapper } from "$/dataMapper/backendMapper";
import { JsonMapper } from "$/dataMapper/jsonMapper";
import BaseRepository from "$/repository/baseRepository";
import { useRegisterStore } from '$/store/register';
import { typeCastNumber } from "$/filters";

/**
 * 회원 가입 관련 레파지토리
 */
class RegistRepository extends BaseRepository
{   
    /**
     * 회원가입처리
     * @param {RegistUser} registUser: 등록할 회원정보
     */
    async regist(registUser: RegistUser):Promise<RegistEvent[]> {
        const registerStore = useRegisterStore()
        const response = await this.dataSource.execute<RegistEventResponse>(
            'AUTH_USER_REGIST',
            {},
            {
                login_id: registUser.id,                
                name: registUser.name,
                password: registUser.password,
                phone_number: registUser.phoneNumber,
                is_receive_sms: registUser.isReceiveMarketingSms,
                is_receive_email: registUser.isReceiveMarketingMail,
                gender: registUser.gender,
                birthdate: registUser.birthdate,
                identity_token: registUser.identityProfileToken,
                policies: registUser.policies.map((policy) => {
                    return {
                        id: policy.id,
                        code: policy.code,
                        is_agree: policy.isAgree
                    }
                })
            }
        );   

        const registEvents = response.regist_events.map(registEvent => {
            return {
                type: registEvent.type,
                name: registEvent.name || '',
                amount_type: registEvent.amount_type || '',
                amount: typeCastNumber(registEvent.amount),
                point: typeCastNumber(registEvent.point),
            }
        });

        registerStore.completeRegister(registEvents, registUser.id);
        return registEvents;
    }

    /**
     * 아이디 중복체크 
     * @param {string} id : 아이디
     * @returns {boolean} 중복 존재여부
     */
    async idDuplicateCheck(id: string): Promise<boolean> {
        const response = await this.dataSource.execute<{
                is_exist: boolean
            }>(
            'AUTH_ID_DUPLICATE_CHECK',
            {},
            {
                login_id: id,                
            }
        );

        return response.is_exist;
    }

    /**
     * 약관 정보 조회
     * @returns Policy[] 
     */
    async getPolicies(): Promise<Policy[]> {
        const response = await this.dataSource.execute<{
            policies: {
                id: number,
                contents: string,
                code: string,
                is_required: boolean,
                label: string
            }[]
        }> (
            'REGIST_POLICIES',
            {},
            {}           
        ) 

        return response.policies.map((policy) => {
            return {
                id : policy.id,
                code: policy.code,
                content: policy.contents,
                label: policy.label,
                isRequired: policy.is_required                
            }
        })
    }    

    /**
     * 소셜회원 가입 처리 
     * @param registUser 
     * @param platform 
     */
    async socialUserRegist(socialUser: SocialRegistUser):Promise<RegistEvent[]> {
        const registerStore = useRegisterStore()
        const response = await this.dataSource.execute<RegistEventResponse>(
            'THIRD_PARTY_REGIST_USER',
            {},
            {
                platform: socialUser.platform,
                email: socialUser.email,
                name: socialUser.name,
                phone_number: socialUser.phoneNumber,
                is_receive_sms: socialUser.isReceiveMarketingSms,
                is_receive_email: socialUser.isReceiveMarketingMail,
                gender: socialUser.gender,
                birthdate: socialUser.birthdate,
                access_token: socialUser.token,
                policies: socialUser.policies.map((policy) => {
                    return {
                        id: policy.id,
                        code: policy.code,
                        is_agree: policy.isAgree
                    }
                })
            }
        );  
        
        const registEvents = response.regist_events.map(registEvent => {
            return {
                type: registEvent.type,
                name: registEvent.name || '',
                amount_type: registEvent.amount_type || '',
                amount: typeCastNumber(registEvent.amount),
                point: typeCastNumber(registEvent.point),
            }
        });

        registerStore.completeRegister(registEvents, socialUser.email);
        return registEvents;
    }

    /**
     * 소셜회원 중복체크 
     * @param { string} email : 이메일
     * @returns 
    */
    async socialUserDuplicateCheck(email: string): Promise<DuplicateSocialUser[]> {
        const response = await this.dataSource.execute<{
            duplicate_users: {
                platform_type: string,
                masking_id: string
            }[]
        }>(
            'THIRD_PARTY_USER_DUPLICATE_CHECK',
            {},
            {
                email: email
            }
        );

        return response.duplicate_users.map((duplicateUser) => {
            return {
                platform: duplicateUser.platform_type,
                maskingId: duplicateUser.masking_id
            }
        })


    }

    /**
     * 일반회원가입 중복 체크
     * @param {string} token : 본인인증 토큰 값
     * @returns {boolean} 중복 존재여부
     */
    async userDuplicateCheck(token: string): Promise<boolean> {
        const response = await this.dataSource.execute<{
                is_duplicate_user: boolean
            }>(
                'AUTH_TOKEN_DUPLICATE_CHECK',
            {},
            {
                identity_token: token,                
            }
        );

        return response.is_duplicate_user;
    }
}


const registRepository = new RegistRepository(
    new BackendMapper
)   

export { registRepository }