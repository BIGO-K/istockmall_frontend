import { Directive, DirectiveBinding } from 'vue';
import postcss from 'postcss' 
import postcssNested from 'postcss-nested' 

interface LazyloadBinding {
    src: string; 
    oldValue?: string; 
    isRatio?: boolean;
    isForce?: boolean;
    errorCallback?: Function;
    useErrorImage?: boolean;
    isError?: boolean;
}

export const lazyload: Directive<Element, LazyloadBinding> = {    
    
    beforeMount(element, binding) {
        imageLazyLoad(element, binding);
    },
    mounted(element, binding) {
        const isUseErrorImage = !(binding.value?.useErrorImage === false)
        if (isUseErrorImage && binding.value?.isError) {
            element.parentElement?.classList.add('mm_image-none');
        }
    },
    updated(element, binding) {
        const imageUrl = binding.value?.src || binding.value;
        const legacyImageUrl = binding.oldValue?.src || binding.oldValue;
        if (imageUrl !== legacyImageUrl) {
            imageLazyLoad(element, binding);
        }         
    },
}

export function imageLazyLoad(element: Element, binding: DirectiveBinding<LazyloadBinding>) {
    const targetElement: HTMLImageElement = <HTMLImageElement>element;    
    const imageUrl = binding.value?.src || binding.value;
    const isRatio = binding.value?.isRatio || false ;
    const isForce = binding.value?.isForce || false ;
    // observer 설정
    const config = {
        root: null,        
        rootMargin:'0px 0px 0px 0px'
    }
    
    // lazyload 클래스명 리스트
    const classList = {
        loading: 'S=loading',
        loaded: 'S=loaded',        
        error: 'S=error',
    }
    // 에러이미지 (mm_image-none 클래스) 사용여부
    const isUseErrorImage = !(binding.value?.useErrorImage === false)

    if (imageUrl === '' || typeof(imageUrl) !== 'string') {
        // 에러 콜백이 있는 경우에만 실행
        if (binding.value?.errorCallback && typeof(binding.value?.errorCallback) === 'function') {
            binding.value?.errorCallback();
        }
       
        // 이미지 없는경우 부모에 mm_image-none 클래스 처리                     
        if (isUseErrorImage && binding.value) {
            binding.value.isError = true; // 타겟 element의 parent 로드 전이므로 mounted에서 처리
        }
        targetElement.classList.add(classList.error, 'ico_none', 'ico_image')
        targetElement.classList.remove(classList.loading)
        return;
    }
    
    // observer 선언
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // 교차중이 아닐경우 종료
            if (!entry.isIntersecting && !isForce) {
                return;
            }
            
            try {
                /* 이미지 로드 시작 */
                if (!isForce) {
                    targetElement.setAttribute('v-lazyload', '');
                }
                targetElement.classList.add(classList.loading)
                // 이미지 객체 생성
                const image = new Image();
                image.src = imageUrl;

                // 이미지 로드 성공 이벤트
                image.onload = () => {
                    // 이미지 노출 처리
                    if (targetElement.tagName == 'IMG') {
                        targetElement.src = imageUrl;
                    } else {
                        targetElement.style.backgroundImage = `url("${imageUrl}")`;
                    }

                    if (isRatio === true) {
                        const ratio = image.naturalWidth / image.naturalHeight;
                        let ratioClassName = 'S=image-square';
                        if (ratio > 1) {
                            ratioClassName = (ratio > 8) ? 'S=image-landscape-4x' : (ratio > 4) ? 'S=image-landscape-3x' : (ratio > 2) ? 'S=image-landscape-2x' : 'S=image-landscape';
                        } else if (ratio < 1) {
                            ratioClassName = (ratio < 0.25) ? 'S=image-portrait-3x' : (ratio < 0.5) ? 'S=image-portrait-2x' : 'S=image-portrait';
                        }
                        targetElement.classList.add(ratioClassName);
                    }
                    
                    // 타겟 엘리먼트 클래스 변경                    
                    targetElement.classList.add(classList.loaded)
                    targetElement.classList.remove(classList.loading, classList.error, 'ico_none', 'ico_image')
                }

                image.onerror = () => {
                    // 에러 콜백이 있는 경우에만 실행
                    if (binding.value?.errorCallback && typeof(binding.value?.errorCallback) === 'function') {
                        binding.value?.errorCallback(binding.value.src);
                    }
                    

                    // 타겟 엘리먼트 클래스 변경           
                    // 이미지 없는경우 처리 부모에 클래스 처리                     
                    if (isUseErrorImage) {
                        element.parentElement?.classList.add('mm_image-none');
                    }
                    targetElement.classList.add(classList.error, 'ico_none', 'ico_image')
                    targetElement.classList.remove(classList.loading)
                }
                
                /* 이미지 로드 종료 (observer 주시 해제) */
                observer.unobserve(targetElement);
            } catch (error) {
                console.error(error)
            }
        })
    }, config)
    
    // observer 연결
    observer.observe(targetElement);    
}

/**
 * 에디터 내용 중 이미지가 들어가는 경우, lazy-load를 처리해야할때, 사용 
 */
export const editorWithImageTag: Directive<Element, {
    useErrorImage?: boolean,
    isForce?: boolean
}> = {
    mounted(element, binding) {
        const config = {
            root: null,
            threshold: [0, 1]
        }
        
        const tabElementObserverEvent = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {       
                if (entry.isIntersecting) {
                    const imageTagList = entry.target.querySelectorAll('img');
                    imageTagList.forEach(function (element) {   
                        const imageUrl = element.src;
                        element.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
                        element.setAttribute('data-src' , imageUrl);
                        const directiveBinding: DirectiveBinding<LazyloadBinding> = {
                            instance: null,
                            value: { src: imageUrl, useErrorImage: binding.value?.useErrorImage, isForce: binding.value?.isForce },
                            oldValue: null,
                            modifiers: {} as Record<string, boolean>,
                            dir: {},
                        }               
                        imageLazyLoad(element, directiveBinding);                            
                    })    
                    return tabElementObserverEvent.unobserve(element);
                }                        
            });
        }, config);

        tabElementObserverEvent.observe(element);
    }
}

/**
 * 에디터 내용 중 
 */
export const editor: Directive<Element> = {
    async mounted(element) {
        let externalScriptLoadedCount = 0;
        let linkTagLoadedCount = 0;
        const externalScriptTagList = element.querySelectorAll('script[src]');
        const internalScriptTagList = element.querySelectorAll('script:not([src])');
        const linkTagList = element.querySelectorAll('link');
        const styleTagList = element.querySelectorAll('style');

        // style 적용
        styleTagList.forEach(async (style) => {
            const newStyle = document.createElement('style');
            newStyle.textContent = await postcss([postcssNested]).process('.mm_editor{' + style.textContent + '}').css;
            element.removeChild(style)
            element.appendChild(newStyle)
        });
        
        // link 적용
        linkTagList.forEach(element => {
            let linkTag = document.createElement('link');
            linkTag.setAttribute('rel', element.getAttribute('rel') || '');
            linkTag.setAttribute('href', element.getAttribute('href') || '');
            document.body.appendChild(linkTag)
            linkTag.onload = () => linkTagLoadedCount++;
        })

        // 외부 js 적용
        externalScriptTagList.forEach(element => {
            let scriptTag = document.createElement('script');
            scriptTag.setAttribute('src', element.getAttribute('src') || '')
            document.head.appendChild(scriptTag);
            scriptTag.onload = () => externalScriptLoadedCount++;
        });

        // 외부 js 로드여부 확인 후 내부 js 실행
        let tryCount = 0
        const loadScriptInnterval = setInterval(() => {
            tryCount++
            if (tryCount > 10) {
                clearInterval(loadScriptInnterval)
                return
            }

            if (externalScriptLoadedCount  == externalScriptTagList.length && linkTagLoadedCount == linkTagList.length) {
                internalScriptTagList.forEach(element => {
                    let scriptTag = document.createElement('script');
                    scriptTag.innerHTML = element.innerHTML;
                    document.body.appendChild(scriptTag);
                })
                clearInterval(loadScriptInnterval)
                return
            }
        }, 100)
    }
}

/**
 * 드롭다운
 */
export const dropdown: Directive<Element, { isOn?: boolean; closeOther?: boolean, closeIf?: boolean, groupName?: string } | undefined> = {
    mounted(element, binding) {
        const target: Element = element;
        const dropdownBtn: HTMLButtonElement|null = target.querySelector('.btn_dropdown');
        const groupName: string = binding.value?.groupName || '';
        if (groupName) {
            target.classList.add(groupName);
        }

        if (binding.value?.isOn) {
            toggleDropdown(target, 'open'); // 드롭다운 열기
        }

        dropdownBtn?.addEventListener('click', async () => {
            // 기존에 열린 드롭다운 접기
            if (binding.value?.closeOther !== false) {
                document.querySelectorAll('.S\\:on' + (groupName ? `,.${groupName}` : '')).forEach((onElement: Element) => {
                    if (onElement.isSameNode(target)) {
                        return;
                    }
                    toggleDropdown(onElement, 'close'); // 드롭다운 닫기
                });
            }
            toggleDropdown(target); // 드롭다운 toggle
        });
    },
    // dropdown directive 영역 클릭하는 경우 이외에 드롭다운이 닫혀야 하는 경우
    updated(element, binding) {
        if (binding.value?.closeIf) {
            toggleDropdown(element, 'close');
        }
    }
}
const dropdownStyle:{
    onClass: string
    onTitle: string
    offTitle: string
} = {
    onClass: 'S=on',
    onTitle: '접어놓기',
    offTitle: '펼쳐보기',
}
/**
 * 드롭다운 토글
 * flag 지정하지 않은 경우 닫힘 > 열림, 열림 > 닫힘으로 변경
 */
export function toggleDropdown(targetElement: Element, flag?:'open'|'close') {
    const target: Element = targetElement;
    const dropdownItem: HTMLElement|null = target.querySelector('.mm_dropdown-item');
    const dropdownBtn: HTMLButtonElement|null = target.querySelector('.btn_dropdown');

    // 드롭다운 타겟 element 없는경우 종료
    if (!dropdownItem || !dropdownBtn) {
        return;
    }

    // flag 있는경우
    if (flag == 'close') {
        target.classList.remove(dropdownStyle.onClass)
        dropdownItem.style['height'] = ''
        dropdownBtn.title = dropdownStyle.offTitle;
        return;
    } else if (flag == 'open') {
        target.classList.add(dropdownStyle.onClass)
        dropdownItem.style['height'] = 'auto'
        dropdownBtn.title = dropdownStyle.onTitle;
        return;
    }

    // flag 없는경우
    const onToggle: boolean = target.classList.toggle(dropdownStyle.onClass);
    dropdownItem.style['height'] = onToggle ? 'auto' : '';
    dropdownBtn.title = onToggle ? dropdownStyle.onTitle : dropdownStyle.offTitle;
}

export const snsShareOpen: Directive<Element, {}> = {

    mounted(element: HTMLElement, binding) {
        const page = document.querySelector('.mm_page');
        const snsElement = element.parentElement.querySelector('.mm_sns');
        const snsList = snsElement.querySelector('.mm_sns-list');

        element.addEventListener('click', () => {
            const shareButtonTop = element.getBoundingClientRect().top;
            const margin = (shareButtonTop >= window.innerHeight / 2) ? -105 : 105

            // { 'top': mm.number.unit(this.getBoundingClientRect().top + _margin) }
            snsList.setAttribute('style', `top: ${shareButtonTop + margin}px`);
            page.append(snsElement);
        }, { once: true });

        document.querySelector('.btn_sns-close').addEventListener('click', () => {
            element.after(snsElement);
            snsList.setAttribute('style', `top: ''`);
        }, { once: true });
    }
}

/** */
export const stickyRankingGnb: Directive<HTMLElement> = {
    mounted(element: HTMLElement & {scrollEventHandler?: () => void }) {
        const gnbHeight:number = parseFloat(getComputedStyle(element.getElementsByTagName('ul')[0]).height);
        const header:HTMLElement|null = document.querySelector('.mm_header');

        // element.style['height'] = getComputedStyle(element.getElementsByTagName('ul')[0]).height;

        const gnb: HTMLElement = element as HTMLElement
        const classList = {
            sticky: 'S=sticky-on',
        }

        element.scrollEventHandler = () => {
            const offsetTop = element.getBoundingClientRect().top || 0
            const headerOffsetTop = header?.getBoundingClientRect().top || 0
            if (gnb.classList.contains(classList.sticky)) {
                element.querySelector('.m_ranking-gnb-inner')?.setAttribute('left', `${element.getBoundingClientRect().left}px`)
            }
            if (offsetTop - gnbHeight - headerOffsetTop < 0) {
                gnb.classList.add(classList.sticky);
                // if (rankingCategoryElement && binding.value.type === 'B') {
                //     rankingCategoryElement.classList.add(classList.sticky)
                // }
            } else {
                gnb.classList.remove(classList.sticky);
                // if (rankingCategoryElement && binding.value.type === 'B') {
                //     rankingCategoryElement.classList.remove(classList.sticky)
                // }
            }
        }

        // sticky처리
        window.addEventListener('scroll', element.scrollEventHandler);
    },
    unmounted(element: HTMLElement & {scrollEventHandler?: () => void }) {
        if (element.scrollEventHandler) {
            window.removeEventListener('scroll', element.scrollEventHandler);
        }
    }
}

export const stickyRankingCategory: Directive<HTMLElement> = {
    mounted(element: HTMLElement & {scrollEventHandler?: () => void }) {
        const header:HTMLElement|null = document.querySelector('.mm_header');
        const classList = {
            sticky: 'S=sticky-on',
        }

        element.scrollEventHandler = () => {
            const offsetTop = element.getBoundingClientRect().top || 0
            const headerOffsetTop = header?.getBoundingClientRect().top || 0
            const headerOffsetHeight = header?.offsetHeight || 0

            if (offsetTop - headerOffsetHeight - headerOffsetTop < 0) {
                element.classList.add(classList.sticky);
            } else {
                element.classList.remove(classList.sticky);
            }
        }

        // sticky처리
        window.addEventListener('scroll', element.scrollEventHandler);
    },
    unmounted(element: HTMLElement & {scrollEventHandler?: () => void }) {
        if (element.scrollEventHandler) {
            window.removeEventListener('scroll', element.scrollEventHandler);
        }
    }
}