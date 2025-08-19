import Kalidator from '@owneul/kalidator';

/**
 * 글로벌 테스터 등록
 */
/**
 * @name: confirm:targetKey?
 * 
 * 데이터 내에 있는 targetKey의 값과 일치해야한다.
 * targetKey 값이 주어지지 않은 경우 `${__key}Confirm`의 값과 비교한다.
 */
Kalidator.registGlobalTester('confirm', (paramName: string, extraValues: string[], data: object) => {
    return data[paramName] === (data[extraValues[0]] || data[`${paramName}Confirm`]);
})
Kalidator.setGlobalMessage('confirm', ':param(이/가) 일치하지 않습니다.');


/**
 * @name: validEmail
 * 
 * 유효한 이메일인지 확인한다.
 */
Kalidator.registGlobalTester('validEmail', (paramName: string, extraValue: string[], data: { [key: string]: string | number | boolean | object }) => {
    const targetValue: string = Kalidator.getTargetValue(data, paramName) || '';
    const regExp = /.+@+([a-z+.])+(\.com$|\.co\.kr$|\.net$|\.kr$)/i
    return targetValue === '' || targetValue.match(regExp) !== null;
});
Kalidator.setGlobalMessage('validEmail', '정상적인 :param(을/를) 입력해주세요.');


Kalidator.registGlobalTester('phoneNumber', (paramName: string, extraValues: string[], data: { [key: string]: string }) => {
    const tel = Kalidator.getTargetValue(data, paramName);
    return tel !== null && /^010[0-9]{4}[0-9]{4}$/g.test(tel);
});

Kalidator.setGlobalMessage('phoneNumber', ':param(은/는) 올바른 휴대전화번호가 아닙니다.');



export function makeValidator(data: FormData | { [paramName: string]: any }): Kalidator {
    return new Kalidator(data);
}

export function getTargetValue(data: FormData | { [paramName: string]: any }, paramName: string) {
    return Kalidator.getTargetValue(data, paramName);    
}