import { http, makePath } from './http'
import { env } from '$/functions'
import { AxiosPromise, Method } from 'axios'
import BadArgumentsError from '$/errors/BadArgumentsError'
import apiItems from '$/services/apiItems'

const BASE_URL = env('MM_BACKEND_BASE_URL')

export interface BackendApiItem {
  name: string
  method: Method
  endpoint: string
  headers?: { [key: string]: string },
  isOnlyNetwork?: boolean
}

/**
 * 백엔드 API 호출
 * @param {string} backendApiName 백엔드 API 이름 [apis[].name]
 * @param {object} params route, query 파라미터
 * @param {FormData|object} payload 본문
 * @returns
 */
function run(
  backendApiName: string,
  params: { [key: string]: any },
  payload: { [key: string]: any } | FormData,
): AxiosPromise<any> {
  const api = apiItems.find((apiItem) => apiItem.name == backendApiName)

  if (!api) {
    return Promise.reject(
      new BadArgumentsError(
        '제공된 API를 찾을 수 없습니다',
        'backendApiName',
        backendApiName,
      ),
    )
  }

  const faker = env('MM_FAKER_' + backendApiName)

  let endpoint = faker ? faker : makePath(BASE_URL + api.endpoint, params)

  const config = {
    headers: {
      ...(api.headers ? api.headers : {})
    },
  };

  const cacheConfig = {
    forceUpdate: history.state.forward === null || api.isOnlyNetwork,
    ...config,
    cache: true,
  }
  
  if (api.method.toUpperCase() == 'GET') {
    return http.get(endpoint, cacheConfig)
  } else if (api.method.toUpperCase() == 'POST') {
    return http.post(endpoint, payload)
  } else if (api.method.toUpperCase() == 'PUT') {
    return http.put(endpoint, payload, cacheConfig)
  } else if (api.method.toUpperCase() == 'PATCH') {
    return http.patch(endpoint, payload, cacheConfig)
  } else if (api.method.toUpperCase() == 'DELETE') {
    return http.delete(endpoint, cacheConfig);
  } else {
    return Promise.reject(
      new BadArgumentsError(
        '제공된 API METHOD를 찾을 수 없습니다',
        'api.method',
        api.method,
      ),
    )
  }
}

export default {
  run,
}
