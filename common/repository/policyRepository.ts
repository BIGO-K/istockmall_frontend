import { DisplayPolicy, PrevPolicy } from "$/@type/policy";
import { BackendMapper } from "$/dataMapper/backendMapper";
import BaseRepository from "$/repository/baseRepository";

class PolicyRepository extends BaseRepository {

    /**
     * 현재 노출중 & 이전 약관 항목 리스트 조회
     */
    async getNowDisplayAndPrevPolices(policyType: string): Promise<{
        prevPolicies: PrevPolicy[],
        nowPolicy: DisplayPolicy
    }> {
        const response = await this.dataSource.execute<{
            prev_policies: {
                id: number,
                title: string
            }[],
            now_policy: {
                id: number,
                title: string,
                contents: string,
                display_date: string,
            }
        }> (
            'POLICY_NOW_DISPLAY_END_PREV_LIST',
            {
                policy_type: policyType
            },
            {}
        )

        return {
            prevPolicies: response.prev_policies.map((prev) => {
                return {
                    id: prev.id,
                    title: prev.title
                }
            }),
            nowPolicy: response.now_policy === null ? null : {
                id: response.now_policy.id,
                title: response.now_policy.title,
                contents: response.now_policy.contents,
                displayDate: response.now_policy.display_date,
            }
        }
    }

    /**
     * 약관 상세 조회
     * @param {string} type: 약관 타입
     * @param {number} id : 약관 id
     */
    async getDetail(type: string, id: number): Promise<string> {
        const response = await this.dataSource.execute<{
            contents: string
        }>(
            'POLICY_DETAIL',
            {
                policy_type: type,
                id: id
            },
            {}
        );

        return response.contents;
    }

    /**
     * 업체리스트 조회 
     */
    async getCompanyList(): Promise<{
        name: string,
        ceo: string,
    }[]> {
        const { middle_users } = await this.dataSource.execute<{
            middle_users: {
                name: string,
                ceo_name: string,
            }[]
        }>(
            'POLICY_COMPANY_LIST',
            {},
            {}
        );

        return middle_users.map((company) => {
            return {
                name: company.name,
                ceo: company.ceo_name
            }
        });
    }
}


const policyRepository = new PolicyRepository(
    new BackendMapper
);

export { policyRepository }
