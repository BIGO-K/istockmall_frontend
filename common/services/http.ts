import axios from 'axios'
import Skript from '@owneul/skript/dist/Skript'
import { HTTP_STATUS_CODE } from '$/constants'
import { env } from '$/functions'
import { cacheAdapterEnhancer } from 'axios-extensions'
import { useAuthStore } from '$/store/auth'
import { storeToRefs } from 'pinia'
import { useAffiliate } from '$/composables/globalConfigComposable'

const skript = new Skript()
window.process = { ...window.process, env: { LOGGER_LEVEL: "warn" } };
const http = axios.create({
    adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
        enabledByDefault: false
    })
})

/**
 * axios request 인터셉트
 * 인증토큰 헤더 처리
 */
 http.interceptors.request.use(async(config) => {    
    const userStore = useAuthStore(); 
    // DATA 
    const { uuid } = storeToRefs(userStore);
    const { affiliateCode } = useAffiliate();

    const accessToken: string|null = await userStore.getAccessToken();

    if (config.headers && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    // uuid 임시
    if (config.headers && uuid.value) {
        config.headers['uid-token'] = uuid.value;
    }  

    // 백엔드에서 header 의 user agent로 디바이스 판단하여 분기
    // 모바일 디바이스 pc 모드 등에서 main 미노출 이슈가 있어 location.host 로 분기할 수 있도록 header 에 값 추가
    config.headers['user-device-type'] = (env('MM_APP_PC_HOST') || env('MM_APP_HOST')).includes(location.host) ? 'pc' : 'mobile'

    // ep 적용    
    if (config.headers && affiliateCode.value) {
        config.headers['affiliate-code'] = affiliateCode.value;
    }
    return config
}, null)



/**
 * axios response 인터셉트
 * 인증오류시 사용자 컨텍스트 초기화
 */
 http.interceptors.response.use(null, (error) => {
    // accessToken 값을 가지고 갔는데 AuthenticationException 오류가 나면 로컬 토큰 리셋처리
    if (
        error.config?.headers?.Authorization &&
        error.response?.status == HTTP_STATUS_CODE.UNAUTHORIZED &&
        error.response?.headers &&
        error.response?.headers['cause-exception'] == 'AuthenticationException'
    ) {
        const userStore = useAuthStore(); 
        userStore.clearUserContext();
    }

    return Promise.reject(error)
})

/**
 * 경로 생성 헬퍼함수
 * @param rawPath 생짜 경로 (ex: '/games/:game/players/:player')
 * @param replaces 대체할 값 (ex: { game: 'lol', player: '소환사명' })
 * @returns
 */
function makePath(
    rawPath: string,
    replaces?: string | number | { [key: string]: any } | Array<any>,
) {
    let replacedPath = rawPath
    const hasQueryParamInRawPath = rawPath.indexOf('?') > -1

    if (typeof replaces === 'string' || typeof replaces === 'number') {
        replacedPath = rawPath.replace(/:[^/]*/, replaces.toString())
    } else if (Array.isArray(replaces)) {
        replaces.forEach((param) => {
            replacedPath = replacedPath.replace(/:[^/]*/, param)
        })
    } else if (replaces !== null && typeof replaces === 'object') {
        const remainParams: { [key: string]: string } = {}

        // 파라미터 객체 순환
        for (const paramName in replaces) {
            if (Object.hasOwnProperty.call(replaces, paramName)) {
                const paramValue = replaces[paramName]
                const regex = new RegExp(':' + paramName + '')

                if (regex.test(replacedPath)) {
                    // 치환
                    replacedPath = replacedPath.replace(regex, paramValue)
                } else {
                    // 치환값 없으면 잔여파라미터 저장
                    remainParams[paramName] = paramValue
                }
            }
        }

        // 잔여파라미터 처리
        const queryParams = Object.assign(
            hasQueryParamInRawPath ? skript.getQueryParams(replacedPath) : {},
            remainParams,
        )

        replacedPath = replacedPath.split('?')[0] + skript.querify(queryParams)
    } else if (replaces === null || replaces === undefined) {
        // null or undefined
    } else {
        // unknown type
        console.error(typeof replaces, rawPath, replaces)
    }

    return replacedPath
}

export { http, makePath }
