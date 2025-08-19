import moment from 'moment'
import { env } from '$/functions';
import { AlertOptions } from '$/@type/front';
import gsap from 'gsap';
import { useErrorStore } from '$/store/error';
import { uuid } from '$/functions';


/**
 * 커스텀 알럿 처리용 
 * @param {string} message : 보여줄 메세지
 * @param {Function} callback  : 확인버튼 처리 후 수행될 콜백 함수
 * @param {AlertOptions} options  : 넘겨줄 옵션 데이터
 */
function alert(message : string, callback?: (...args) => void, options? : AlertOptions ) {
    const errorStore = useErrorStore();
    errorStore.applyAlert({
        type : 'alert',
        uuid: uuid(),
        message : message,
        callback,
        options
    })
}
  
/**
 * 커스텀 컨펌 처리용 
 * @param {string} message : 보여줄 메세지
 * @param {Function} callback  : 확인버튼 처리 후 수행될 콜백 함수
 * @param {AlertOptions} options  : 넘겨줄 옵션 데이터
 *{
 * 알럿에 사용되는 옵션항목
 * title : 상단에 노출될 제목
 * closeButtonLabel : 확인 버튼 타이틀
 * cancelButtonLabel : 취소 버튼 타이틀 
 * forms : 프롬프트에 사용될 폼 정보가 담긴 객체
 }
**/
function confirm(message : string, callback?: (...args) => void, options? : AlertOptions) {
    const errorStore = useErrorStore();
    errorStore.applyAlert({
        type : 'confirm',
        uuid: uuid(),
        message,
        callback,
        options
    })
}
   
/**
 * 커스텀 프롬프트 처리용 
 * @param {string} message : 보여줄 메세지
 * @param {Function} callback  : 확인버튼 처리 후 수행될 콜백 함수
 * @param {AlertOptions} options  : 넘겨줄 옵션 데이터 
**/
function prompt(message : string, callback?: (...args) => void, options? : AlertOptions) { 
    const errorStore = useErrorStore();
    errorStore.applyAlert({
        type : 'prompt',
        uuid: uuid(),
        message,
        callback,
        options
    })
}


/**
 * 웹 쿠키 설정 
 * @param key : 키
 * @param value :  설정할 값
 * @param day  : 유지기간
 * @param isMidnight : 자정(0시) 기준으로 설정 여부
 * @param expireAt : 만료일시
 */
function setDocumentCookie(key: string, value: string|boolean, day?: number, isMidnight?: boolean, expireAt?: string) {

    if (!key) {
        return;
    }

    let expireDay = '';
    const cookieValue = value ? value : true;

    if (day) {
        let formatting = isMidnight ?  moment().add(1 , 'days').startOf("day").utc() :  moment().add(day , 'days').utc();
        expireDay = `expires=${formatting};`;
    }

    if (expireAt) {
        let parsedDate = moment(expireAt).utc();
        expireDay = parsedDate.isValid() ? `expires=${parsedDate};` : '';
    }

    const domain = env('MM_APP_HOST') ?? 'localhost';
    document.cookie = `${key}=${cookieValue}; ${expireDay} path=/; domain=${domain}`;    
}

/**
 * 웹 쿠키 조회 
 * @param key 키 
 * @returns 
 */
function getDocumentCookie(key: string) {
    if (!key) {
        return;
    }
    let findValue = null;
    const cookies = document.cookie.split(';');

    cookies.forEach(function (__cookie) {
        var cookie = __cookie.trim().split('=');
            if (cookie[0] === key) {
                findValue = cookie[1];
                return false;
            }
    })
    
    return decodeURIComponent(findValue);
}

/**
 * 쿠키 삭제 
 * @param key  : 키
 */
function removeCookie(key : string) {
    if (!key) {
        return;
    }

    setDocumentCookie(key, null, -1);
}

async function copyText(text: string) {
    // text area method
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    await new Promise<void>((res, rej) => {
        document.execCommand('copy');
        textArea.remove();
        res();
    });
    return mmon.bom.alert('주소가 복사되었습니다\n 원하는 곳에 붙여넣기(Ctrl+V)해주세요.');
}

function loadingShow() {
    const errorStore = useErrorStore();
    errorStore.toggleLoadingBar(true);
}

function loadingHide() {
    const errorStore = useErrorStore();
    errorStore.toggleLoadingBar(false);
}

/**
 * 스크롤러 탐색
 * @param element 스크롤 찾을 element
 * @param isClosest element의 하위요소가 아닌 상위요소로 스크롤 찾기 
 * @returns 
 */
function findScroller(element?: Element, isClosest?:boolean):Element|Window {
    if (!element || element.tagName === 'HTML' || element.tagName === 'BODY') {
        return document.querySelector('.mm_page > .mm_scroller') || window;
    } 
    
    if (element.classList.contains('mm_scroller')) {
        return element
    } 
    
    return (isClosest ? element.closest('.mm_scroller') : element.querySelector('.mm_scroller')) || window
}

/**
 * 타겟 element의 스크롤 내 위치를 리턴
 * @param element 스크롤 내 위치 탐색할 element
 * @returns 
 */
function getPositionInScroller(targetElement: Element): {top: number; left: number} {
    const scroller = findScroller(targetElement, true);
    const targetRect = targetElement.getBoundingClientRect();
    const scrollerRect = (scroller instanceof Window) ? { top: 0, left: 0 } : scroller.getBoundingClientRect();
    const scrollerOffset = (scroller instanceof Window) ? { top: scroller.scrollY, left: scrollX } : { top: scroller.scrollTop, left: scroller.scrollLeft };

    return {
        top: scrollerOffset.top + targetRect.top - scrollerRect.top,
        left: scrollerOffset.left + targetRect.left - scrollerRect.left,
    }
}

/**
 * 스크롤 모션
 * @param targetElement 
 * @param option 
 */
function scrollTo(
    targetElement:Element, 
    option: { 
        margin: number; 
        scroller?:Element|Window|HTMLElement; 
        direction?: 'vertical'|'horizontal'; 
        time?: number 
    }
): void {
    // 스크롤러 초기화
    option.scroller = option.scroller || findScroller();

    // 스크롤 내 타겟 element 위치
    const elementPosition = getPositionInScroller(targetElement);

    //gsap 스크롤 옵션
    const scrollOption: gsap.TweenVars = {
        duration: option.time || mmon.time.fast, 
        ease: 'sine.out',
    };
    scrollOption[(option.direction === 'horizontal') ? 'scrollLeft' : 'scrollTop'] = option.direction === 'horizontal' 
        ? (elementPosition.left - option.margin) 
        : (elementPosition.top - option.margin);
        
    gsap.to(option.scroller instanceof Window ? document.documentElement : option.scroller, scrollOption);
}

export const mmon = {
    bom : {
        alert,
        confirm,
        prompt
    }, 
    cookie : {
        set : setDocumentCookie,
        get : getDocumentCookie,
        remove : removeCookie
    },
    copy: copyText,
    time : {
        base: 0.4,
        fast: 0.2,
        faster: 0.1,
        slow: 0.7,
        slower: 1,
    },
    loading: {
        show : loadingShow,
        hide: loadingHide
    },
    scroll: {
        find: findScroller,
        position: getPositionInScroller,
        to: scrollTo,        
    }
}