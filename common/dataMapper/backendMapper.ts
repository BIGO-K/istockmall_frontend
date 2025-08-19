import { default as BackendApi } from '$/services/backend'
import { DataSource } from '$/@type';

class BackendMapper implements DataSource
{
    /**
     * 백엔드 API 호출 응답 리턴
     * @param {string} callName 백엔드 API 이름 [apis[].name]
     * @param {object} params route, query 파라미터
     * @param {FormData|object} payload 본문
     * @returns
     */
    async execute<T> (
        callName: string,
        params: { [key: string]: any },
        payload: { [key: string]: any } | FormData): Promise<T>         
    {
        const response = await BackendApi.run(
            callName,
            params,
            payload
        );
        
        return response.data;
    }
}

export { BackendMapper }