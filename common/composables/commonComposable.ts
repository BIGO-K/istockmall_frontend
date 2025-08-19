import { computed } from 'vue';
import { storeToRefs } from "pinia";
import { isMobile } from '$/functions';
import { useUserAgentStore } from "$/store/userAgent";
import { useToNumber } from '@vueuse/core';
import { useRouteQuery } from "@vueuse/router";

export function useUserAgent() {
    /** STORE **/
    const userAgentStore = useUserAgentStore();   
    const {
        deviceInfo
    } = storeToRefs(userAgentStore)
    /** //STORE **/

    /** VARIABLE **/
    const isAppUser = isMobile('app')
	const isAndroidApp = isMobile('app_android')
	const isIosApp = isMobile('app_ios')
    const isMobileUser = isMobile('android') || isMobile('ios');
    
    const isAndroidUser = isMobile('android');
    const isIosUser = isMobile('ios');

    const isAppFirstUser = computed(() =>{
        return isAppUser && isMobile('app_first') ? !userAgentStore.hasUserAccessApp : false
    })
    const currentAppVersion = computed<string>(() => {
		const match = navigator.userAgent.match(/app_version_name:([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3})/i);
		return match !== null && match[1] ? `V${match[1]}` : 'V1.0.0'
	})    
    /** //VARIABLE **/

    /** FUNC **/

    /** //FUNC **/

    return {
        isAppFirstUser,
        isAppUser,
        isAndroidApp,
        isIosApp,
        isMobileUser,
        isAndroidUser,
        isIosUser,
        deviceInfo,
        currentAppVersion,
        setAccessApp: userAgentStore.setAccessApp
    }
}

/**
 *  라우트 쿼리  Type Casting 처리
 * @returns 
*/
export function useRouteQueryCast() {   
    function queryToBoolean(keyName: string, defaultValue:boolean) {
        const originQuery = useRouteQuery<string>(keyName, `${defaultValue}`);
        return originQuery.value === 'true' ? true: false
    }

    function queryToNumber(keyName: string, defaultValue:number) {
        const originQuery = useRouteQuery<string>(keyName, `${defaultValue}`);
        return useToNumber(originQuery.value).value
    }

    function queryToArray(keyName: string, defaultValue: string[]): string[] {
        const originQuery = useRouteQuery<string[]|string>(keyName, defaultValue);
        if (originQuery.value === '') {
            return defaultValue
        }
    
        if (!Array.isArray(originQuery.value)) {
            return [originQuery.value]
        }
    
        return originQuery.value;
    }

    function queryToNumberArray(keyName: string, defaultValue: string[]): number[] {
        const arrayQuery = queryToArray(keyName, defaultValue);
    
        return arrayQuery.map((query) => {
            return useToNumber(query).value;
        });
    }

    function queryToString(keyName: string, defaultValue: string) {
        return `${ useRouteQuery<string>(keyName, defaultValue).value }`;
    }

    /** //FUNC **/

    return {
        toNumberArray: queryToNumberArray,
        toNumber: queryToNumber,
        toBoolean: queryToBoolean,
        toString: queryToString,
        toArray: queryToArray
    }
}


/**
 * 객체 깊은복사 처리 
 * @param value 
 * @returns 
 */
export function useDeepClone<T>(value: T) {
    if (value === null || typeof value !== 'object') return value

    const copy = value.constructor()

    for (var attr in value) {
      if (value.hasOwnProperty(attr)) {
        copy[attr] = useDeepClone(value[attr])
      }
    }

    return copy
}