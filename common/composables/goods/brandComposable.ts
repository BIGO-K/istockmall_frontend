export function useBrandInitialsFilters() {
    const koreanBrandInitials = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', '123'];
	const engBrandInitials = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','123']

    function getKoreanInitial(str: string, noDouble?: boolean /* 된소리 순화 */) {
        noDouble = noDouble || false;
        var initials = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        var result = '';
        for(var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i) - 44032;
            var initial = str[i];
            if (code > -1 && code < 11172) {
                initial = initials[Math.floor(code / 588)];
            }

            if (noDouble === true) {
                if (initial == 'ㄲ') {
                    initial = 'ㄱ';
                } else if (initial == 'ㄸ') {
                    initial = 'ㄷ';
                } else if (initial == 'ㅃ') {
                    initial = 'ㅂ';
                } else if (initial == 'ㅆ') {
                    initial = 'ㅅ';
                } else if (initial == 'ㅉ') {
                    initial = 'ㅈ';
                }
            }

            result += initial;
        }

        return result;
    }

    return  {
        koreanBrandInitials,
        engBrandInitials,
        getKoreanInitial
    }
}
