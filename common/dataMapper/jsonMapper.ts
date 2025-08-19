
import BadArgumentsError from "$/errors/BadArgumentsError";
import { DataSource } from "$/@type";
import jsonFilesLists from "$/dataMapper/jsonDataFileList";


class JsonMapper implements DataSource
{   
    /**
     * .JSON 데이터 응답 리턴 처리 
     * @param {string} callName 호출 API 이름 [apis[].name]
     * @param {object} params route, query 파라미터
     * @param {FormData|object} payload 본문
     * @returns
     */
    async execute<T> (
        callName: string, 
        params: { [key: string]: any; }, 
        payload: any): Promise<T> 
    {
        const jsonApiItem = jsonFilesLists.find((apiItem) => apiItem.name == callName);
        
        // 파일 없는 경우 
        // 리스트에 미존재하는 경우 처리 
        if (!jsonApiItem) {
            return Promise.reject(
                new BadArgumentsError(
                    '제공된 API를 찾을 수 없습니다',
                    'jsonApiName',
                    callName,
                ),
            )
        }

        return new Promise((reslove, reject) => {
            reslove(
                jsonApiItem.getFileData() as T
            )
        })
    }
}

export { JsonMapper }