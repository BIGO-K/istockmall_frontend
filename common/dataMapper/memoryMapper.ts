import { DataSource } from "$/@type";

class MemoryMapper implements DataSource
{

    /**
     * RAW 데이터 응답 리턴 처리 
     * @param {string} callName 호출 API 이름 [apis[].name]
     * @param {object} params route, query 파라미터
     * @param {FormData|object} payload 본문
     * @returns
     */
    execute<T> (
        callName: string, 
        params: { [key: string]: any; }, 
        payload: any
    ): Promise<T> 
    {
        return new Promise((resolve, reject) => {
            if (callName == 'GET_USERS') {
                resolve({
                    users: [],
                } as any);
            } else if (callName == 'CONF_BANK_CODES'){
                resolve({
                    bank_codes: [
                        {
                            code: '100',
                            label: '국민은행'
                        },
                        {
                            code: '101',
                            label: '기업은행'
                        },
                        /*
                        {
                            code: 'BK02',
                            label: '산업은행'
                        },
                        {
                            code: 'BK03',
                            label: '기업은행'
                        },
                        {
                            code: 'BK04',
                            label: '국민은행'
                        },
                        {
                            code: 'BK07',
                            label: '수협은행'
                        },
                        {
                            code: 'BK11',
                            label: '농협은행'
                        },
                        {
                            code: 'BK20',
                            label: '우리은행'
                        },
                        {
                            code: 'BK23',
                            label: 'SC제일은행'
                        },
                        {
                            code: 'BK27',
                            label: '한국씨티은행'
                        },
                        {
                            code: 'BK31',
                            label: '대구은행'
                        },
                        {
                            code: 'BK32',
                            label: '부산은행'
                        },
                        {
                            code: 'BK34',
                            label: '광주은행'
                        },
                        {
                            code: 'BK35',
                            label: '제주은행'
                        },
                        {
                            code: 'BK37',
                            label: '전북은행'
                        },
                        {
                            code: 'BK39',
                            label: '경남은행'
                        },
                        {
                            code: 'BK71',
                            label: 'KEB하나은행'
                        },
                        {
                            code: 'BK26',
                            label: '신한은행'
                        },
                        {
                            code: 'BK89',
                            label: '케이뱅크'
                        },
                        {
                            code: 'BK90',
                            label: '카카오뱅크'
                        },
                        */
                    ]
                } as any);
            } else {
                reject(new Error(''));
            }
        })
    }
}

export { MemoryMapper }