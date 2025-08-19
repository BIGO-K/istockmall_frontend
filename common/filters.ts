import Skript from '@owneul/skript/dist/Skript'
import moment from 'moment'
import { LocationQueryValue } from 'vue-router';
import { isMobile } from './functions';

const skript = new Skript()

/**
 * origin 내의 search 문자열들을 wrapping 처리
 * @param origin 원본 문자열
 * @param search 대상 문자열
 * @param before 앞에 붙일 문자열
 * @param after 뒤에 붙일 문자열
 * @returns
 */
export function wrap(
    origin : string,
    search : string,
    before : string,
    after : string,
): string {
    return skript.str.wrap(origin, search, before, after)
}

/**
 * left pad 처리
 * @param originText  : 대상 문자열
 * @param length  : 보정할 최소길이
 * @param padString  : 패딩 문자
 * @returns {string}
 */
export function padLeft(
    originText : string,
    length : number,
    padString : string
): string {
    return skript.str.pad(originText, length, padString, 'left');
}

/**
 * 날짜 문자열 포맷팅
 * @param raw 날짜 문자열
 * @param format 포맷 문자열(YYYY.MM.DD 등)
 * @returns
 */
export function formatDate(raw : string, format : string, isLocaleKo?: boolean) {
    if (!raw) {
        return raw
    }   
    
    if (isLocaleKo) {
        moment.updateLocale('ko', {
            weekdays: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
            weekdaysShort: ['일','월','화','수','목','금','토'],
            meridiem: (e) => {
                if (e > 12) {
                    return '오후'
                }

                return '오전'
            }
        });        
    }
    
    const momented = moment(raw);       
    
    if (format) {
        // 미래임      
        return momented.format(format)
    }

    const diff = momented.diff(moment())
    if (diff > 0) {        

        return momented.format('YYYY.MM.DD HH:mm:ss')
    }

    const diffInUnits = {
        s: Math.round((-1 * diff) / 1000),
        m: Math.round((-1 * diff) / 1000 / 60),
        h: Math.round((-1 * diff) / 1000 / 60 / 60),
        d: Math.round((-1 * diff) / 1000 / 60 / 60 / 24)
    }

    if (diffInUnits.s < 60) {
        return `${diffInUnits.s}초 전`
    } else if (diffInUnits.m < 60) {
        return `${diffInUnits.m}분 전`
    } else if (diffInUnits.h < 24) {
        return `${diffInUnits.h}시간 전`
    } else {        
        return momented.format('YYYY.MM.DD HH:mm:ss')
    }
}

/**
 * 숫자 NUMBER FORMAT 처리
 * @param val 현지화된 숫자 형식('ko-KR')
 * @param defaultValue  현지화된 값이 없을때, 사용할 기본값 ex)'-', '0' 등.. 표시할값
 * @example
 * formatNumber('', '-')
 * @returns ','로 처리된 문자 또는 전달된 기본값 / 기본값이 없는 경우는 '0' 처리
 */

export function formatNumber(val : number|string|undefined|null, defaultValue? : string): string {
    if (val == undefined || val == null || val.toString() == '') {
        return defaultValue == ''
            ? '0'
            : defaultValue
    }    
    if (Number.isFinite(val)) {        
        return val.toLocaleString('ko-KR')
    } else {
        return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
}

/**
 * 텍스트 색상 클래스 처리
 * @param rgbColorCode DB에 저장된  RGB 색상 컬러
 * @example
 * textColorClass('000000')
 * @returns 텍스트 색상 클래스명
 */
export function textColorClass(rgbColorCode : string): string {
    return rgbColorCode == '000000'
        ? '__text_black__'
        : ''
}

/**
 * API에서 들어오는 값을 boolean 형태의 값으로 리턴해주기 위한 함수 
 * (1, 0, '1', '0', true, false ,'true', 'false')를 제외한 경우는 전부 기본값 리턴 
 * 기본값이 리턴되면 안되는 경우는 사용하면 안됨  
 * @param {string | number | boolean |null } val 변환 해야할 값 
 * @param {boolean} defaultValue : 기본값
 * @returns {boolean}
 */
export function typeCastBoolean(val : string|number|boolean|null|undefined, defaultValue: boolean = false): boolean {
    if (typeof(val) === 'boolean') {
        return val;
    } 

    if (typeof(`${val}`) !== 'string') {
        return false;
    }
    
    if (`${val}` === '1' || `${val}` === 'true') {
        return true;
    } else if (`${val}` === '0' || `${val}` === 'false') {
        return false
    }

    return defaultValue
}

/**
 * API에서 들어오는 값을 number 형태의 값으로 리턴해주기 위한 함수 
 * 올바르지 않은 값으 들어오는 경우, 기본값 설정을 하지 않으면 0으로 리턴되기 때문에 확인 후 사용 할 것!
 * @param {string | number | boolean | null | LocationQueryValue | LocationQueryValue[] } val 변환 해야할 값
 * @param {number} defaultValue : 기본값
 * @returns {number}
 */
export function typeCastNumber(val: string|number|null|undefined|LocationQueryValue|LocationQueryValue[], defaultValue: number = 0): number {
    if (typeof(val) === 'number') {
        return val;
    }

    const castingValue = Number(val);

    return isNaN(castingValue) ? defaultValue : castingValue;    
}

/**
 * 받침유무에 따라 달라지는 한국어 조사 적용하는 함수
 * @param  {string} targetString
 * @returns string
 */
export function applyZosa (targetString: string): string {
    if (targetString.startsWith('(') || targetString.startsWith('undefined')) {
        return ''
    }

    let result = targetString;
    const checkpoints = [
        '(은/는)',
        '(이/가)',
        '(을/를)',
        '(과/와)',
        '(아/야)',
        '(이여/여)',
        '(이랑/랑)',
        '(으로/로)',
        '(으로서/로서)',
        '(으로써/로써)',
        '(으로부터/로부터)',
    ];

    checkpoints.forEach(function (cp) {
        const fir = cp.split('/')[0].replace('(', '');
        const sec = cp.split('/')[1].replace(')', '');
        result = result.replace(new RegExp("\\(" + sec + "/" + fir + "\\)", 'g'), cp);
    });

    for (let index = 0; index < checkpoints.length; index++) {
        const checkpoint = checkpoints[index];
        if (targetString.indexOf(checkpoint) !== -1) {
            var code = targetString.charCodeAt(targetString.indexOf(checkpoint) - 1) - 44032;

            if (code >= 0 || code <= 11171) {
                result = result.replace(checkpoint, code % 28 !== 0
                    ? checkpoint.split('/')[0].replace('(', '')
                    : checkpoint.split('/')[1].replace(')', ''));
            }
        }
    }

    return result;
};

/**
 * 줄바꿈 문자 <br>태그로 치환
 * 
 * @param  {string} targetString
 * @returns string
 */
export function nlToBr(targetString: string): string {
    return (targetString || '').replace(/(\r\n|\n)/g, '<br>');
}

/**
 * 쿼리 파라미터 조회
 * @param query 
 * @returns 
 */
export function getQueryParams(query: string): { [name: string]: any } {
    return skript.getQueryParams(query);
}

export function formatTel(tel: string) {
    if (typeof(tel) !== 'string') {
        return;
    }
    return tel.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
}

/**
 * 외부링크 is_out_intent 적용
 * @param path 
 * @returns 
 */
export function getOutIntentPath(path: string|null|undefined): string {
    if (!path) {
        return '';
    }

    if (!isMobile('app_android')) {
        return path;
    }
    
    const hasQueryParamInPath = path.indexOf('?') > -1
    const queryParams = Object.assign(
        hasQueryParamInPath ? skript.getQueryParams(path) : {},
        { is_out_intent: 'Y' },
    )
    return path.split('?')[0] + skript.querify(queryParams)
}