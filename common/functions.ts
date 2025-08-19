import { AxiosResponse } from "axios";
import { mmon } from "$/helper/mmon";
import Skript from "@owneul/skript/dist/Skript";
import { FORM_VALID_CONDITION_CLASS } from "$/constants";
import { Router } from "vue-router";
import moment from "moment";
import gsap from "gsap";
import { useModalPopup } from "$/composables/pageHandler/modalComposable";

const skript = new Skript();

/**
 * env 변수를 조회
 * @param key env 변수명
 * @param defaultValue env 값이 없을 때 사용할 기본값
 * @example
 * env('MM_APP_NAME', 'DEFAULT APP NAME!')
 * @returns env 변수값 또는 전달된 기본값
 */
export function env(key: string, defaultValue?: string): any {
    if (import.meta.env[key]) {
        return import.meta.env[key];
    }
    return defaultValue;
}

interface HttpCatcher {
    [key: number]: string | ((response: AxiosResponse) => void) | Promise<any>;
}

/**
 * 기본 오류 처리 함수
 *
 * @param err 오류
 * @param httpCatcher http 상태코드별 커스텀 핸들러
 * @param alertCallbacks Alert창 확인 후 콜백으로 실행될 콜백 함수
 * @returns
 */
export function defaultCatch(
    err: any,
    httpCatcher?: HttpCatcher,
    alertCallbacks?: Function
): Promise<void> {
    let errorMessage = "시스템 오류가 발생했습니다.";
    if (err.response) {
        errorMessage = err.response.data.message;
        if (httpCatcher) {
        const catcher = httpCatcher[err.response.status];
        if (typeof catcher === "string") {
            errorMessage = catcher;
        } else if (typeof catcher === "function") {
            return new Promise((resolve) => {
            catcher(err.response);
            resolve();
            });
        } else if (catcher instanceof Promise) {
            throw new Error("미구현");
        }
        }
    } else if (err.firstErrorMessage) {
        errorMessage = err.firstErrorMessage;
    } else if (err.message) {
        errorMessage = err.message;
    }

    return new Promise((resolve, reject) => {
        const callbackFunction =
        typeof alertCallbacks === "function" ? alertCallbacks : () => {};
        mmon.bom.alert(errorMessage, callbackFunction);
        resolve();
    });
}

/**
 * http 상태코드별 핸들러 랩핑용 헬퍼함수
 *
 * @param httpCatcher
 * @returns
 * @example
 * ```javascript
 * doProcess.catch(httpCatch({
 *    404: '주문 정보를 찾을 수 없습니다',
 *    401: function () {
 *        location.href = '/login';
 *    },
 *    429: '잠시 후에 다시 시도해주세요',
 * }))
 * ```
 */
export function httpCatch(httpCatcher: HttpCatcher) {
    function handler(err: any) {
        return defaultCatch(err, httpCatcher);
    }

    return handler;
}

/**
 * 팝업창 핸들링 프로미스
 *
 * @param url
 * @param target
 * @param features
 * @returns
 * @example
 * ```javascript
 * withPopup('/my-popup')
 *     .then(() => {
 *         console.log('popup closed!');
 *     });
 * ```
 */
export async function withPopup(
    url: string,
    target: string,
    features?: string
): Promise<void> {
    let popupWindow = null;
    await skript.wait(0.5);
    popupWindow = window.open(url, target, features);

    if (popupWindow === null) {
        return Promise.reject(new Error("팝업 차단 해제 후 사용 부탁드립니다."));
    }

    return new Promise((resolve) => {
        const checkPopupWindowInterval = setInterval(() => {
        if (!popupWindow || popupWindow.closed) {
            clearInterval(checkPopupWindowInterval);
            resolve();
        }
        }, 1000);
    });
}

/**
 * 내부 팝업 오픈후 외부로 이동할 팝업 핸들링 함수
 * @param { string } target
 * @param { Function } getActionUrl
 * @param { string }features
 * @returns
 */
export async function handlePopupOpenWithUrlCallback(
    target: string,
    getActionUrl: () => {},
    features?: string,
    isBlank?: boolean
): Promise<{
    isPopupClose: boolean;
}> {
    let popupWindow = null;
    await skript.wait(0.2);
    let popupStartUrl = isBlank ? "" : "/external";
    let popupOpen = false;
    popupWindow = window.open(popupStartUrl, target, features);

    setTimeout(() => {
        if (popupWindow === null) {
        popupWindow = window.open(popupStartUrl, target, features);
        }
    }, 300);

    try {
        const popupActionUrl = await getActionUrl();
        if (popupWindow !== null && popupOpen === false) {
            popupWindow.location.href = popupActionUrl;      
            popupOpen = true;
        }
        return new Promise((resolve) => {
        const checkPopupWindowInterval = setInterval(() => {
            if (popupWindow !== null && popupOpen === false) {
                popupWindow.location.href(popupActionUrl);      
                popupOpen = true;
            }

            if (!popupWindow || popupWindow.closed) {
            clearInterval(checkPopupWindowInterval);
            resolve({
                isPopupClose: true,
            });
            }
        }, 1000);
        });
    } catch (error) {
        // console.log(error);
        popupWindow.close();
    }
}

/**
 * 모바일 히스토리 뒤로가기
 *
 * @param router
 * @returns
 * @example
 */
export function historyBack(router: Router) {
    const { clearModalPopup } = useModalPopup()
    if (window.history.state.back == null && !location.hash) {
        clearModalPopup();
        router.push("/");
    } else {
        router.currentRoute.value.meta.isBackPressed = true;
        router.go(-1);
    }
}

/**
 * PASSWORD 검증처리
 * @param {string}password  : 비밀번호
 * @param {string}id : 아이디
 * @param {string}phoneNumber : 휴대폰 번호
 * @param {string}prevPassword : 이전 비밀번호
 * @returns {message:string, condition:string}
 */
export function validatePassword(
    password: string,
    id: string,
    phoneNumber: string,
    prevPassword?: string
): {
    message: string;
    condition: string;
} {
    // 공백 제한
    if (password.indexOf(" ") > -1) {
        return {
        message: "공백은 입력할 수 없습니다",
        condition: FORM_VALID_CONDITION_CLASS.INVALID,
        };
    }
    // 조합 확인
    let comboCount = 0;
    if (password.search(/[0-9]/g) > -1) {
        ++comboCount;
    }
    if (password.search(/[a-z]/g) > -1) {
        ++comboCount;
    }
    if (password.search(/[A-Z]/g) > -1) {
        ++comboCount;
    }
    if (
        password.search(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi) > -1
    ) {
        ++comboCount;
    }

    // 조합 2개 미만 => 사용불가
    if (comboCount < 2) {
        return {
        condition: FORM_VALID_CONDITION_CLASS.INVALID,
        message: "영문, 숫자, 특수문자 중 2가지 이상 조합해주세요.",
        };
    } else if (password.length < 8 || password.length > 16) {
        //길이 8 ~ 16자 제한 => 사용불가
        return {
        condition: FORM_VALID_CONDITION_CLASS.INVALID,
        message: "8자 이상 입력해주세요.",
        };
    }

    // 아이디와 동일 내용 제한 => 위험
    if (id !== "" && password.search(id) > -1) {
        return {
        message: "아이디와 동일 내용을 사용할 수 없어요.",
        condition: FORM_VALID_CONDITION_CLASS.INVALID,
        };
    }

    // 휴대폰 번호와 동일 내용 제한 =>  위험
    if (phoneNumber !== "" && password.search(phoneNumber) > -1) {
        return {
        message: "휴대폰 번호와 동일 내용을 사용할 수 없어요.",
        condition: FORM_VALID_CONDITION_CLASS.DANGER,
        };
    }

    // 이전 비밀번호와 동일 내용 제한 =>  위험
    if (prevPassword !== "" && prevPassword === password) {
        return {
        message: "이전 비밀번호와 동일 내용을 사용할 수 없어요.",
        condition: FORM_VALID_CONDITION_CLASS.DANGER,
        };
    }

    // 동일한 문자/숫자 4자 이상 사용 제한 (문자) => 위험
    if (
        /(\w)\1\1\1/.test(password) ||
        /([\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"])\1\1\1/.test(password)
    ) {
        return {
        message: "동일한 내용 4자리 이상은 사용할 수 없어요.",
        condition: FORM_VALID_CONDITION_CLASS.DANGER,
        };
    }

    // 연속된 문자 4자 이상 사용 제한 (asdf, ASDF, 1234 등)
    let consecutiveCount1 = 0;
    let consecutiveCount2 = 0;
    let consecutiveChar = [];

    for (let i = 0; i < password.length - 3; i++) {
        consecutiveChar[0] = password.charAt(i);
        consecutiveChar[1] = password.charAt(i + 1);
        consecutiveChar[2] = password.charAt(i + 2);
        consecutiveChar[3] = password.charAt(i + 3);

        // 순차 (abcd, 1234 등)
        if (
        consecutiveChar[0].charCodeAt(0) - consecutiveChar[1].charCodeAt(0) ==
            1 &&
        consecutiveChar[1].charCodeAt(0) - consecutiveChar[2].charCodeAt(0) ==
            1 &&
        consecutiveChar[2].charCodeAt(0) - consecutiveChar[3].charCodeAt(0) == 1
        ) {
        consecutiveCount1++;
        }

        // 역순차 (dcba, 4321 등)
        if (
        consecutiveChar[0].charCodeAt(0) - consecutiveChar[1].charCodeAt(0) ==
            -1 &&
        consecutiveChar[1].charCodeAt(0) - consecutiveChar[2].charCodeAt(0) ==
            -1 &&
        consecutiveChar[2].charCodeAt(0) - consecutiveChar[3].charCodeAt(0) == -1
        ) {
        consecutiveCount2++;
        }
    }

    if (consecutiveCount1 > 0 || consecutiveCount2 > 0) {
        return {
        message: "연속된 숫자 또는 키보드 텍스트 4자는 사용할 수 없어요.",
        condition: FORM_VALID_CONDITION_CLASS.INVALID,
        };
    }

    // 연속된 키보드 문자
    let keyboardsWord = [];
    //순차
    keyboardsWord[0] = "`1234567890-=";
    keyboardsWord[1] = "~!@#$%^&*()_+";
    keyboardsWord[2] = "qwertyuiop[]\\";
    keyboardsWord[3] = "asdfghjkl;'";
    keyboardsWord[4] = "zxcvbnm,./";
    keyboardsWord[5] = "QWERTYUIOP{}|";
    keyboardsWord[6] = 'ASDFGHJKL:"';
    keyboardsWord[7] = "ZXCVBNM<>?";
    //역순차
    keyboardsWord[8] = "=-0987654321`";
    keyboardsWord[9] = "+_)(*&^%$#@!~";
    keyboardsWord[10] = "\\][poiuytrewq";
    keyboardsWord[11] = "';lkjhgfdsa";
    keyboardsWord[12] = "/.,mnbvcxz";
    keyboardsWord[13] = "|}{POIUYTREWQ";
    keyboardsWord[14] = '":LKJHGFDSA"';
    keyboardsWord[15] = "?><MNBVCXZ";

    // 4자 이상 사용 제한
    for (let j = 0; j < keyboardsWord.length; j++) {
        for (let i = 0; i < keyboardsWord[j].length - 3; i++) {
        if (password.indexOf(keyboardsWord[j].substring(i, i + 4)) >= 0) {
            return {
            message: "연속된 숫자 또는 키보드 텍스트 4자는 사용할 수 없어요.",
            condition: FORM_VALID_CONDITION_CLASS.INVALID,
            };
        }
        }
    }

    // 조합글자(숫자, 텍스트, 특수문자) 9자 이상 입력 => 안전
    if (comboCount >= 3 && password.length >= 9) {
        return {
        condition: FORM_VALID_CONDITION_CLASS.VALID,
        message: "예측이 어려운 강력한 비밀번호입니다.",
        };
    }

    return {
        condition: FORM_VALID_CONDITION_CLASS.NORMAL,
        message: "사용하기 적절한 비밀번호입니다.",
    };
}

/**
 * 오브젝트 배열내의 특정 프로퍼티 값을 배열로 리턴
 * pluck(targetArray, "path.property1.property2")의 형태로 사용
 * @param targetArray
 * @param path
 * @returns
 */
export function pluck(
    targetArray: object[],
    path: string | string[]
): Array<any> {
    const paths = typeof path === "string" ? path.split(".") : path;

    if (targetArray.length < 1 || path.length < 1) {
        return targetArray;
    }

    const key = paths.shift();

    if (!targetArray[0].hasOwnProperty(key)) {
        return targetArray;
    }

    const plucked = targetArray.map((target) => target[key]).flat(1);

    if (paths.length) {
        return pluck(plucked, paths);
    } else {
        return plucked;
    }
}

/**
 * 오브젝트|오브젝트 배열내의 특정 프로퍼티 값을 배열로 리턴 (depth 상관 없이)
 * @param target 
 * @param path 
 * @returns 
 */
export function findNested(target: object|any[], path: string|string[]): any[] {
    const paths = typeof path === "string" ? path.split(".") : path;
    let foundList: any[] = [];
    const propertyName = paths.shift();

    for (let key in target) {
        if (key == propertyName) {
            foundList.push(target[key]);
        } else if (typeof target == 'object') {
            foundList = foundList.concat(findNested(target[key], propertyName));
        }
    }

    if (paths.length) {
        return findNested(foundList, paths);
    } else {
        return foundList;
    }
}

/**
 * 배열 비교
 * @param target
 * @param comparison
 * @returns
 */
export function isEqualArray<T>(target: T[], comparison: T[]): boolean {
    if (target === comparison) {
        return true;
    }

    if (target == null || comparison == null) {
        return false;
    }

    if (target.length !== comparison.length) {
        return false;
    }

    for (let i = 0; i < target.length; i++) {
        if (target[i] !== comparison[i]) {
        return false;
        }
    }

    return true;
}

/**
 * 기간일 보다 이후 인지 계산
 * @param baseDate
 * @param compareDate
 * @returns
 */
export function isAfterDate(compareDate: Date | String): boolean {
    return moment(moment().format("YYYY-MM-DD")).isSameOrAfter(compareDate);
}

/**
 * 기간일 보다 이전 인지 계산
 * @param baseDate
 * @param compareDate
 * @returns
 */
export function isBeforeDate(compareDate: Date | String): boolean {
    return moment(moment().format("YYYY-MM-DD")).isSameOrBefore(compareDate);
}

export function isMobile(type: string) {
    const deviceType = {
        iphone: "iphone",
        ipad: "ipad",
        ipod: "ipod",
        ios: "iphone|ipad|ipod",
        android: "android|app_android",
        blackberry: "blackberry|bb10|playbook",
        window: "iemobile|windows phone|windows mobile",
        opera: "opera mini",
        app: "app_ios|app_android",
        // 앱에 userAgent 코드 추가 필요
        app_ios: "app_ios",
        app_android: "app_android",
        app_kitkat: "android 4.4",
        app_first: "app_first", // 앱 최초실행
    };

    return new RegExp(deviceType[type], "i").test(navigator.userAgent);
}

export const ios = {
    // iOS 네이티브 함수 호출
    run: function () {
        window.webkit?.messageHandlers.ios.postMessage({
            function: arguments[0],
            arguments: Array.prototype.slice.call(arguments, 1),
        });
    },
};

/**
 * 상품 이미지 줌 로딩 처리
 *
 * @param event 상품 이미지 엘리먼트를 타겟으로 하는 이벤트
 */
export function goodsZoomLoader(event: Event) {
    const targetElement = event.currentTarget as HTMLElement;
    // 바로 타겟이 I 인경우 
    const isTargetImageElement = targetElement.classList.contains('image_product') && targetElement.nodeName === 'I'; 
    if (isTargetImageElement) {
        return goodsZoomLoad(targetElement.cloneNode() as HTMLElement, targetElement.closest('a'));
    }

    const goodsBoxElement = targetElement.closest(".mm_product-item, .mui_product-item")  
    if (!goodsBoxElement) {
        return
    }  
    const imageOriginElement = goodsBoxElement.querySelector(".image_product");

    if (!imageOriginElement) {
        return
    }

    const iElement = imageOriginElement.cloneNode() as HTMLElement
    return goodsZoomLoad(iElement, targetElement);
}

function goodsZoomLoad(iElement: HTMLElement, targetElement: HTMLElement) {
    if (iElement === null || targetElement === null) {
        return;
    }

    if (document.querySelector('.m_product-clone')) {
        return;
    }
    const wrapElement = document.createElement("div");
    wrapElement.classList.add("m_product-clone");
    iElement.setAttribute("class", "mm_bg-cover image_product S=loaded");
    iElement.setAttribute(
        "style",
        `${iElement.getAttribute("style")} width: 100%; padding-top: 100%; `
    );

    wrapElement.appendChild(iElement);
    wrapElement.setAttribute(
        "style",
        `position: fixed; background: rgba(#fff, 0.7); z-index:9999`
    );

    const appElement = document.getElementById("app") as HTMLElement;
    appElement.insertAdjacentElement("afterbegin", wrapElement);

    gsap.fromTo(
        wrapElement,
        (() => {
            const boundingClientRect = targetElement.getBoundingClientRect();
            return {
                top: boundingClientRect.top,
                left: boundingClientRect.left,
                width: targetElement.offsetWidth,
                height: targetElement.offsetHeight,
            };
        })(),        
        {
        top: 0,
        left: 0,
        paddingTop: 45,
        paddingRight: "2.66666%",
        width: "100%",
        height: "100%",
        duration: 0.2,
        ease: "cubic.inOut",
        // onComplete: mm.popup.open,
        // onCompleteParams: [__url, option]
        }
    );
}

/**
 * 랭킹상품 이미지 줌 로딩 처리
 *
 * @param event 상품 이미지 엘리먼트를 타겟으로 하는 이벤트
 */
export function rankGoodsZoomLoader(event: Event) {
    const targetElement = event.target as HTMLElement;
    const wrapElement = document.createElement("div");
    wrapElement.classList.add("m_product-clone");

    const iElement =
        targetElement.nodeName !== "I"
        ? (targetElement
            .closest("figure")
            .querySelector(".image_rank")
            .cloneNode() as HTMLElement)
        : (targetElement.cloneNode() as HTMLElement);
    iElement.setAttribute("class", "mui_bg-cover image_rank S=loaded");
    iElement.setAttribute(
        "style",
        `${iElement.getAttribute("style")} width: 100%; padding-top: 100%;`
    );

    wrapElement.appendChild(iElement);
    wrapElement.setAttribute(
        "style",
        `position: fixed; background: rgba(#fff, 0.7); z-index:9999`
    );

    const appElement = document.getElementById("app") as HTMLElement;
    appElement.insertAdjacentElement("afterbegin", wrapElement);

    gsap.fromTo(
        wrapElement,
        (function () {
        return {
            top: targetElement.getBoundingClientRect().top,
            left: targetElement.getBoundingClientRect().left,
            width: targetElement.offsetWidth,
            height: targetElement.offsetHeight,
        };
        })(),
        {
        top: 0,
        left: 0,
        paddingTop: 45,
        paddingRight: "2.66666%",
        width: "100%",
        height: "100%",
        duration: 0.2,
        ease: "cubic.inOut",
        onComplete: () => {
            // setTimeout(() => {
            //     wrapElement.parentElement?.removeChild(wrapElement)
            // }, 500);
        },
        // onComplete: mm.popup.open,
        // onCompleteParams: [__url, option]
        }
    );
}

/**
 * 배열 N개씩 묶기
 * @param targetArray
 * @param size
 * @returns
 */
export function chunk<T>(targetArray: T[], size: number): T[][] {
    if (targetArray.length < 1) {
        return [];
    }

    const result: T[][] = [];
    for (let i = 0; i < targetArray.length; i += size) {
        result.push(targetArray.slice(i, i + size));
    }

    return result;
}

/**
 * 카운트다운 헬퍼
 * @param {(Date | string)} targetDateTime 카운트다운 목표 시간
 * @param {string} intervalType 카운트다운 간격(ms/millisecond/s/second/m/minute)
 * @param {Function(number, any): void} countdownHandler 카운트다운 처리자
 * @param {boolean} executeOnInitialized 초기화시점에 handler를 1회 실행시킬지 여부
 * @returns {Promise<void>}
 */
export function countdown(
    targetDateTime: Date | string,
    intervalType: string,
    countdownHandler: (diffInMilliSecond: number, diffs: {
        hour: number,
        minute: number,
        second: number
    }) => void,
    executeOnInitialized: boolean = false
): null|NodeJS.Timer {

    let targetDate;

    if (typeof targetDateTime === 'string') {        
        targetDate = new Date(targetDateTime);
        
        if (targetDate.toString() === 'Invalid Date') {
            targetDate = new Date(moment(targetDateTime.trim()));        
        }
        
        if (isNaN(targetDate.getTime())) {
            // throw new Error("Date \uD0C0\uC785\uC73C\uB85C \uBCC0\uD658\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. (" + targetDateTime + ")");
              console.error(`Date \uD0C0\uC785\uC73C\uB85C \uBCC0\uD658\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. ("${targetDateTime}")`);
              return;           
        }
    }
    else {
        targetDate = targetDateTime;
    }

    const targetTime = targetDate.getTime();
    let intervalSecond = 1;
    switch (intervalType.toLowerCase()) {
        case 's':
        case 'second':
        case 'seconds':
            break;
        case 'ms':
        case 'millisecond':
        case 'milliseconds':
            intervalSecond = 0.001;
            break;
        case 'm':
        case 'minute':
        case 'minutes':
            intervalSecond = 60;
            break;
        case 'h':
        case 'hour':
        case 'hours':
            intervalSecond = 3600;
            break;
        default:
            break;
    }
    if (executeOnInitialized === true) {
        const diffInMs = targetTime - Date.now();
        if (diffInMs < 0) {
                countdownHandler(diffInMs, {
                hour: 0,
                minute: 0,
                second: 0,
            });
            return null
        }
        countdownHandler(diffInMs, {
            hour: Math.floor(diffInMs / 1000 / 60 / 60),
            minute: Math.floor(diffInMs / 1000 / 60) % 60,
            second: Math.floor(diffInMs / 1000) % 60,
        });
    }

    const countDownInterval = setInterval(() => {
    const diffInMillisecond = targetTime - Date.now();
    if (diffInMillisecond < 0) {
        clearInterval(countDownInterval);
        return countdownHandler(diffInMillisecond, {
            hour: 0,
            minute: 0,
            second: 0,
        });
    }
    countdownHandler(diffInMillisecond, {
        hour: Math.floor(diffInMillisecond / 1000 / 60 / 60),
        minute: Math.floor(diffInMillisecond / 1000 / 60) % 60,
        second: Math.floor(diffInMillisecond / 1000) % 60,
    });
    }, intervalSecond * 1000)

    return countDownInterval;
}

/**
 * 가로 스크롤러
 * @param {(HTMLElement | null)} scroller 스크롤러
 * @param {(Element | null)} element 클릭한 element
 * @param {boolean} isSmooth gsap.to 스크롤이 부드럽지 않을 경우 false (ex: 랭킹 image_category)
 */
export function horizontalScrollMove(scroller: HTMLElement|null, element: Element|null, isSmooth: boolean = true) {
    const selected = element ? element.closest('a') || element.closest('button') : null;
    let left = 0;
    if (scroller && selected) {
        left = mmon.scroll.position(selected).left - (scroller.offsetWidth - selected.offsetWidth) / 2;

        if(isSmooth) {
            gsap.to(scroller, {
                scrollLeft: left,
                direction: 'horizontal', 
                duration: 0.15,
                ease: 'sine.out',
                smoothOrigin: true,
            });
        } else {
            scroller.scrollTo({ left: left, behavior: 'smooth' });
        }
    }
}

/**
 * 배열 순서 섞기
 * @param target 셔플 타겟 배열 (id 프로퍼티 존재하는 Object배열)
 * @param originalOrder 타겟 배열의 기존순서
 * @param shuffleByOrigin 기존 순서와 동일하게 셔플 여부
 * @returns 
 */
export function shuffle<T extends {id: number}>(
    target: T[], 
    originalOrder: number[], 
    shuffleByOrigin: boolean = false
): T[] {
    if (!target || target.length < 1) {
        return [];
    }

    // 순서 변경 여부
    let isOrderChanged = 1
    target.sort((second, first) => {
        // 기존 배열순서 없는경우 랜덤 셔플
        if (originalOrder.length < 1) {
            return Math.random() - 0.5
        }

        // 기존 순서와 동일하게 셔플
        if (shuffleByOrigin) {
            const firstIndex = originalOrder.findIndex((goodsId) => goodsId == first.id);
            const secondIndex = originalOrder.findIndex((goodsId) => goodsId == second.id);
            
            if (firstIndex === undefined || secondIndex === undefined) {
                return 0;
            }
            
            return secondIndex - firstIndex
        }

        isOrderChanged = -isOrderChanged;
        return isOrderChanged;
    })
    return target;
}

/**
 * 스크롤 이동
 * @param scroller 스크롤 엘리먼트 
 * @param position 스크롤 이동할 포지션
 * @param direction 스크롤 방향
 */
export function applyPosition(
    scroller: HTMLElement|null, 
    position: number, 
    direction: 'horizontal'|'vertical' = 'vertical'
) {
    let tryCount = 0
    const setScrollInterval = setInterval(() => {
        tryCount++
        if (!scroller) {
            return;
        }

        if (tryCount > 10) {
            clearInterval(setScrollInterval)
            return
        }

        if (direction == 'vertical') {
            scroller.scrollTop = position
        } else {
            scroller.scrollLeft = position;
        }
    }, 30)
}

/**
 * unique 배열
 * @param target 
 */
export function unique<T>(target: T[]): T[] {
    return target.filter((item, index) => target.indexOf(item) == index)
}

/**
 * 오브젝트 mergeDeep
 * @param target 
 * @param source 
 * @returns 
 */
export function mergeDeep<T extends object, S extends object>(target: T, source: S): T & S {
    for (let key of Object.keys(target)) {
        if (Array.isArray(target[key]) && Array.isArray(source[key]) ) {
            source[key] = unique(target[key].concat(source[key]));
            continue
        }

        if (target[key] instanceof Object && source[key] instanceof Object) {
            const merged = mergeDeep(target[key], source[key]);
            source[key] = merged;
        }
    }
    
    Object.assign(target || {}, source)
    return target as T & S
}


/**
 * 빈값 여부 검사
 * @param target 
 */
export function isEmpty(target: unknown): boolean {
    return !target 
        || (Array.isArray(target) && target.length <= 0) 
        || target === '' 
        || target === 0 
        || Object.keys(target).length === 0
}

export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}