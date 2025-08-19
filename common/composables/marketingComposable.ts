import { MarketingPlatforms, MarketingSetting } from "$/@type/configs"
import { useGlobalConfigs } from "$/composables/globalConfigComposable"
import { 
    AddToCartActionResource, 
    ViewGoodsListActionResource, 
    PageViewActionResource, 
    ViewGoodsActionResource, 
    ViewCartActionResource, 
    OrderReceiptedActionResource, 
    MemberRegistedActionResource,
    ViewGoodsDetailActionResource
} from "$/composables/marketing"
import { ref, computed, watch, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import { isMobile, env } from '$/functions';
import { useRouter } from 'vue-router';

declare global {
    interface Window {
        dataLayer: Record<string, unknown>[]
        fbq: any
        criteo_q: any[]
        kakaoPixel: any
        ENP_VAR: {},
        DOYOUAD_DATA: {}        
    }
}
const needMarketingScript = env('MM_COLLECT_MARKETING') === 'Y' ? true : false;
const isMobileUser = isMobile('android') || isMobile('ios');

function idResolver(
    platform: MarketingPlatforms, 
    account: string,
    setting: MarketingSetting
) {
    return setting[platform]?.id
}

/**
 * GTM 활성화
 * @param window 대상 윈도우
 * @param id GTM 아이디
 */
function activateGoogleTag(id: string) {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    })

    const googleTagScript = window.document.createElement('script')
    googleTagScript.async = true
    googleTagScript.src = `https://www.googletagmanager.com/gtm.js?id=${id}`

    const googleTagNoscript = window.document.createElement('noscript')
    googleTagNoscript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `

    insertElement(googleTagScript, 'Google Tag Manager')

    insertElement(
        googleTagNoscript, 
        'Google Tag Manager(noscript)',
        'bodystart'
    )
}

function activateDoyouad() {
    const doyouadScript = window.document.createElement('script')
    doyouadScript.type = 'text/javascript'
    doyouadScript.innerHTML = `
        (function (w, d, s, n, t) {w.dyadData=w.dyadData||[];w.dyTag=function(){dyadData.push(arguments)};n = d.createElement(s);n.type = "text/javascript";n.defer = !0;n.src = "https://cdn.doyouad.com/js/tracker/istockmall.js?v=" + new Date().toISOString().slice(0, 10).replace(/-/g, "");t = d.getElementsByTagName(s)[0];t.parentNode.insertBefore(n, t);})(window, document, "script");
    `;

    insertElement(doyouadScript, 'DoYouAd Tracker ver.3.0')
}

/**
 * 카카오 픽셀 활성화
 * @param window 
 */
function activateKakaoPixel() {
    const pixelScript = window.document.createElement('script')
    pixelScript.src = '//t1.daumcdn.net/adfit/static/kp.js'

    insertElement(pixelScript, '카카오 픽셀')
}

/**
 * 네이버 활성화 
 */
function activateNaver() {
    const naverActiveCommonScript = window.document.createElement('script')
    naverActiveCommonScript.type = `text/javascript`;
    const naverScript = window.document.createElement('script')
    naverScript.src = '//wcs.naver.net/wcslog.js'
    insertElement(naverScript, '네이버 공통 스크립트', 'bodyend');  
    
    naverScript.onload = () => {
        naverActiveCommonScript.innerHTML = `
            if (!wcs_add) var wcs_add={};
            wcs_add["wa"] = "${setting.value.naver.id}";
            if (!_nasa) var _nasa={};
            if(window.wcs){
                wcs.inflow("istockmall.co.kr");
                wcs_do(_nasa);
            }
        `;
        insertElement(naverActiveCommonScript, '네이버 공통 스크립트', 'bodyend');
    }
   
}

/**
 * 페이스북 픽셀 활성화
 * @param window 
 * @param id 
 */
function activateFacebookPixel(id: string) {
    const pixelScript = window.document.createElement('script')
    pixelScript.innerHTML = `
    !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${id}');
            fbq('track', 'PageView');
    `
    insertElement(
        pixelScript,
        'Meta Pixel Code'
    )

    const pixelNoscript = window.document.createElement('noscript')
    pixelNoscript.innerHTML = `
        <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1"
        /></noscript>
    `

    insertElement(
        pixelNoscript, 
        'Meta Pixel Code(noscript)',
        'bodystart'
    )
}

/**
 * 크리테오 원태그 활성화
 * @param window 
 */
function activateCriteo() {
    const criteoScript = window.document.createElement('script')
    criteoScript.async = true
    criteoScript.src = '//dynamic.criteo.com/js/ld/ld.js?a=71284'

    insertElement(criteoScript, '크리테오 원태그')
}

/**
 * 모비온 활성화 
 */
function activateMobion() {
    const mobionScript = window.document.createElement('script')
    mobionScript.innerHTML = `    
    (function(a,g,e,n,t)
    {a.enp=a.enp||function(){(a.enp.q=a.enp.q||[]).push(arguments)};
    n=g.createElement(e);n.async=!0;n.defer=!0;
    n.src="https://cdn.megadata.co.kr/dist/prod/enp_tracker_self_hosted.min.js"
    ;t=g.getElementsByTagName(e)[0];t.parentNode.insertBefore(n,t)
    })(window,document,"script");
    enp('create', 'common', '${setting.value.mobion.id}', { device: '${isMobileUser ? "M" : "W"}' });
    enp('send', 'common', '${setting.value.mobion.id}');
    `
    insertElement(mobionScript,'Enliple Tracker Start','bodyend' )
    // Enliple Tracker Start
}

function activateCafe24() {
    const cafe24Script = window.document.createElement('script');
    cafe24Script.innerHTML = `
    var sTime = new Date().getTime();
	(function(i,s,o,g,r,a,m){i['cmcObject']=g;i['cmcUid']=r;a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//stockcom.cmclog.cafe24.com/weblog.js?v='+sTime,'${setting.value.cafe24.id}');
    `;

    insertElement(cafe24Script, 'CAFE24', 'bodyend')


    const cafe24WebLogScript = window.document.createElement('script');
    cafe24WebLogScript.innerHTML = `
    <!-- 리포트2.0 로그분석코드 시작 -->
        var sTime = new Date().getTime();
        (function(i,s,o,g,r,a,m){i['webObject']=g;i['webUid']=r;a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})
        (window,document,'script','//stockcom.weblog.cafe24.com/weblog.js?v='+sTime,'${setting.value.cafe24.id}');
        <!-- 리포트2.0  로그분석코드 완료 -->
    `;

    insertElement(cafe24WebLogScript, '', 'bodyend')
}

function activateAceCounter() {
    const aceCounterScript = window.document.createElement('script');
    aceCounterScript.innerHTML = `
    var _AceGID=(function(){var Inf=['gtp4.acecounter.com','8080','JB4T38708158143','AW','0','NaPm,Ncisy','ALL','0']; var _CI=(!_AceGID)?[]:_AceGID.val;var _N=0;var _T=new Image(0,0);if(_CI.join('.').indexOf(Inf[3])<0){ _T.src ="https://"+Inf[0]+'/?cookie'; _CI.push(Inf);  _N=_CI.length; } return {o: _N,val:_CI}; })();
	var _AceCounter=(function(){var G=_AceGID;var _sc=document.createElement('script');var _sm=document.getElementsByTagName('script')[0];if(G.o!=0){var _A=G.val[G.o-1];var _G=(_A[0]).substr(0,_A[0].indexOf('.'));var _C=(_A[7]!='0')?(_A[2]):_A[3];var _U=(_A[5]).replace(/\,/g,'_');_sc.src='https:'+'//cr.acecounter.com/Web/AceCounter_'+_C+'.js?gc='+_A[2]+'&py='+_A[4]+'&gd='+_G+'&gp='+_A[1]+'&up='+_U+'&rd='+(new Date().getTime());_sm.parentNode.insertBefore(_sc,_sm);return _sc.src;}})();
    `;

    insertElement(aceCounterScript, 'ACE Count Start 삭제 하지 마세요.', 'bodyend')
}

/**
 * 헤더 내 엘리먼트 삽입처리
 * @param window 
 * @param element 
 * @param comment 
 * @param position 
 */
function insertElement(
    element: HTMLElement|HTMLElement[],
    comment?: string,
    position: 'headend' | 'headstart' | 'bodyend' | 'bodystart' = 'headend'
) {
    const args: Array<Comment|HTMLElement> = [
        window.document.createComment(`${comment}`)
    ];

    (Array.isArray(element) ? element : [element]).forEach(el => args.push(el))

    args.push(
        window.document.createComment(`// ${comment}`)
    )

    if (position === 'headend') {
        window.document.head.append(...args)
    } else if (position === 'headstart') {
        const firstChild = window.document.head.children[0]
        args.forEach((arg) => {
            window.document.head.insertBefore(arg, firstChild)
        })
    } else if (position === 'bodyend') {
        window.document.body.append(...args)
    } else if (position === 'bodystart') {
        const firstChild = window.document.body.children[0]
        args.forEach((arg) => {
            window.document.body.insertBefore(arg, firstChild)
        })
    } 

    return args;
}

/**
 * PV 액션 처리
 * @param resource 
 */
function pageView(resource: PageViewActionResource) {
    // 카카오 픽셀
    if (window.kakaoPixel) {
        window.kakaoPixel(`${idResolver('kakaoPixel', resource.account, setting.value)}`).pageView()
    }

    // if (setting.value.naver.id) {
    //     if (window.wcs && window._nasa && window.wcs_do) { 
    //         window.wcs.inflow("istockmall.co.kr");
    //         window.wcs_do(window._nasa);
    //     }
    // }
}

export function useViewGoodsDetailInfo (resource: ViewGoodsDetailActionResource) {
    const activateScripts = [];  
    // /**
    //  * 카페 24
    //  */
    //   const cafe24DetailScript = document.createElement('script');
    //   activateScripts.push(cafe24DetailScript)
    //   cafe24DetailScript.innerHTML = `
    //       var sTime = new Date().getTime();
    //       product_no = '${resource.goodsId}';
    //       description_detail = '${resource.detailInformation}';
    //       mobile_description = '${resource.detailInformation}';
    //       (function(i,s,o,g,r,a,m){i['pdeObject']=g;i['pdeUid']=r;a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//stockcom.cmclog.cafe24.com/detail.js?v='+sTime,'stockcom');
    //   `;
    //   insertElement(cafe24DetailScript, '<!-- 상품 스크립트 CAFE24. -->', 'bodyend');

    return {
        
    }
}

/**
 * 상품조회 액션 처리
 * @param resource 
 */
export function useViewGoods(resource: ViewGoodsActionResource) {
    if (!needMarketingScript) {
        return;
    }

    const activateScripts = [];    
    const categoryLabel = resource.categoryFullPath.split('>');
    
    // GTM 이벤트
    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'view_goods',
            resource: {
                viewGoods: resource,
            },
        })
    }

    /**
     * 모비온 
    */
    if (setting.value.mobion?.id) {
        const mobionScript = document.createElement('script');
        mobionScript.innerHTML = `
             var ENP_VAR = {
                collect: {},
                conversion: { product: [] }
            };

            ENP_VAR.collect.productCode = '${resource.goodsId}';
            ENP_VAR.collect.productName = '${resource.goodsName}';
            ENP_VAR.collect.price = '${resource.listPrice}';
            ENP_VAR.collect.dcPrice = '${resource.discountedPrice}';
            ENP_VAR.collect.soldOut = '${resource.isSoldout ? 'Y' : 'N'}';
            ENP_VAR.collect.imageUrl = '${resource.imageUrls[0]}';      
            ENP_VAR.collect.secondImageUrl =  '${resource.imageUrls[0] || ''}';
            ENP_VAR.collect.topCategory = '${categoryLabel[0].trim() ?? ''}';
            ENP_VAR.collect.firstSubCategory = '${categoryLabel[0].trim() ?? ''}';
            ENP_VAR.collect.secondSubCategory = '${categoryLabel[1].trim() ?? ''}';
            ENP_VAR.collect.thirdSubCategory = '${categoryLabel[2].trim() ?? ''}';
            (function(a,g,e,n,t){a.enp=a.enp||function(){(a.enp.q=a.enp.q||[]).push(arguments)};n=g.createElement(e);n.async=!0;n.defer=!0;n.src="https://cdn.megadata.co.kr/dist/prod/enp_tracker_self_hosted.min.js";t=g.getElementsByTagName(e)[0];t.parentNode.insertBefore(n,t)})(window,document,"script");            
            /* 상품수집 */
            enp('create', 'collect', '${setting.value.mobion.id}', { device: "${isMobileUser ? 'M' : 'W'}" });
            /* 장바구니 버튼 타겟팅 (이용하지 않는 경우 삭제) */
            enp('create', 'cart', '${setting.value.mobion.id}', { device: "${isMobileUser ? 'M' : 'W'}", btnSelector: ".btn_cart"});
            /* 찜 버튼 타겟팅 (이용하지 않는 경우 삭제) */
            enp('create', 'wish', '${setting.value.mobion.id}', { device: "${isMobileUser ? 'M' : 'W'}", btnSelector: ".btn_like"}); 
        `
        activateScripts.push(insertElement(mobionScript, 'Enliple Tracker Start', 'bodyend'));
    }

    // cafe24
    if (setting.value.cafe24?.id) {
        const cafe24Script = document.createElement('script');        
        cafe24Script.innerHTML = `
            var sTime = new Date().getTime();
            product_no = '${resource.goodsId}';
            title = '${resource.goodsName}';
            product_code = '${resource.goodsId}';
            price = '${resource.listPrice}';
            price_pc = '${resource.sellPrice}';
            image_link_big = '${resource.imageUrls[0]}';
            category_name1 = '${categoryLabel[0].trim() ?? ''}';
            brand = '${resource.brandName || ''}';
            price_mobile = '${resource.sellPrice}';
            currency = 'KRW';

            (function(i,s,o,g,r,a,m){i['pdtObject']=g;i['pdtUid']=r;a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//stockcom.cmclog.cafe24.com/product.js?v='+sTime,'stockcom');
        `;
        activateScripts.push(insertElement(cafe24Script, '상품 스크립트 CAFE24.', 'bodyend'));
    }

    onBeforeUnmount(() => {
        if (activateScripts.length > 0) {
            activateScripts.forEach((el) => {
                if (Array.isArray(el)) {
                    el.forEach((tag) => tag.remove());
                } else {
                    el.remove();
                }
            })
        }        
    })
}

/**
 * 장바구니 담기 이벤트
 */
export function useAddToCart(resource: AddToCartActionResource) {
    if (!needMarketingScript) {
        return;
    }
    // GTM 이벤트
    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'add_to_cart',
            resource: {
                addToCart: resource,
            },
        })
    }

    // 카카오 픽셀
    if (window.kakaoPixel) {
        resource.cartItems.forEach(cartItem => {
            window.kakaoPixel(`${idResolver('kakaoPixel', resource.account, setting.value)}`).addToCart({
                id: cartItem.goodsId,
            })
        })
    }    
}

/**
 * 상품 목록 조회 액션 처리
 * @param resource 
 */
export function useViewGoodsList(resource: ViewGoodsListActionResource) {
    if (!needMarketingScript) {
        return;
    }
    // 카카오 픽셀(검색어 존재시만)
    if (resource.searchWord && window.kakaoPixel) {
        window.kakaoPixel(`${idResolver('kakaoPixel', resource.account, setting.value)}`).search({
            keyword: resource.searchWord,
        })
    }
}

/**
 * 장바구니 조회 액션 처리
 * @param resource 
 */
export function useViewCart(resource: ViewCartActionResource) {
    if (!needMarketingScript) {
        return;
    }
    const activateScripts = [];

    if (setting.value.mobion?.id) {
        window.ENP_VAR = {
            conversion: { 
                product: resource.cartItems.map(cartItem => {
                    return {
                        productCode: `${cartItem.goodsId}`,
                        productName: `${cartItem.goodsName}`,
                        price: `${cartItem.price}`,
                        dcPrice: `${cartItem.discountedPrice}`,
                        qty : `${cartItem.quantity}`
                    }
                }),
                totalPrice: `${resource.cartItems.reduce((p, c) => p + (c.price * c.quantity), 0)}`,  // 없는 경우 단일 상품의 정보를 이용해 계산
                totalQty: `${resource.cartItems.reduce((p, c) => p + c.quantity, 0)}`  // 없는 경우 단일 상품의 정보를 이용해 계산
            }               
        }

        const mobionScript = document.createElement('script');
        mobionScript.innerHTML = `
        (function(a,g,e,n,t){a.enp=a.enp||function(){(a.enp.q=a.enp.q||[]).push(arguments)};n=g.createElement(e);n.async=!0;n.defer=!0;n.src="https://cdn.megadata.co.kr/dist/prod/enp_tracker_self_hosted.min.js";t=g.getElementsByTagName(e)[0];t.parentNode.insertBefore(n,t)})(window,document,"script");
        `;

        activateScripts.push(insertElement(mobionScript, '장바구니 mobion.', 'bodyend'));
    }

    // 카카오 픽셀
    if (window.kakaoPixel) {
        window.kakaoPixel(`${idResolver('kakaoPixel', resource.account, setting.value)}`).viewCart()
    }

    if (setting.value.cafe24?.id) {
        const goodsIdsConcat  = resource.cartItems.map((items) => items.goodsId).join('^');
        const cafe24Script = document.createElement('script');
        cafe24Script.innerHTML = `
            var sTime = new Date().getTime();
            product_no = '${goodsIdsConcat}';
            product_code = '';
            (function(i,s,o,g,r,a,m){i['bkObject']=g;i['bkUid']=r;a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//stockcom.cmclog.cafe24.com/basket.js?v='+sTime,'stockcom');
        `;
        activateScripts.push(insertElement(cafe24Script, '장바구니 스크립트 CAFE24 삭제 하지 마세요.', 'bodyend'));
    }

    onUnmounted(() => {
        if (activateScripts.length > 0) {
            activateScripts.forEach((el) => {
                if (Array.isArray(el)) {
                    el.forEach((tag) => tag.remove());
                } else {
                    el.remove();
                }
            })
        }
    })

}

/**
 * 주문 완료 액션 처리
 * @param resource 
 */
export function useOrderReceipted(resource: OrderReceiptedActionResource) {
    if (!needMarketingScript) {
        return;
    }
    const activateScripts = [];
    // 카카오 픽셀
    if (window.kakaoPixel) {
        window.kakaoPixel(`${idResolver('kakaoPixel', resource.account, setting.value)}`).purchase({
            total_quantity: resource.orderedItems.reduce((p, c) => p + c.quantity, 0),
            total_price: resource.paymentPrice,
            currency: 'KRW',
            products: resource.orderedItems.map(orderedItem => {
                return {
                    id: orderedItem.goodsId,
                    name: orderedItem.goodsName,
                    price: orderedItem.price,
                }
            }),
        })
    }


    if (setting.value.mobion?.id) {
        if (!window.ENP_VAR) {
            window.ENP_VAR = {};
        }
        window.ENP_VAR = {
            conversion: { 
                product: resource.orderedItems.map(orderedItem => {
                    return {
                        productCode: `${orderedItem.goodsId}`,
                        productName: `${orderedItem.goodsName}`,
                        price: `${orderedItem.price}`,
                        dcPrice: `${orderedItem.paidPrice }`,
                        qty : `${orderedItem.quantity}`
                    }
                }),
                ordCode: `${resource.orderId}`,
                totalPrice: resource.paymentPrice,  // 없는 경우 단일 상품의 정보를 이용해 계산
                totalQty: `${resource.orderedItems.reduce((p, c) => p + c.quantity, 0)}`  // 없는 경우 단일 상품의 정보를 이용해 계산
            }   
        }

        const mobionScript = document.createElement('script');
        mobionScript.innerHTML = `
        (function(a,g,e,n,t){a.enp=a.enp||function(){(a.enp.q=a.enp.q||[]).push(arguments)};n=g.createElement(e);n.async=!0;n.defer=!0;n.src="https://cdn.megadata.co.kr/dist/prod/enp_tracker_self_hosted.min.js";t=g.getElementsByTagName(e)[0];t.parentNode.insertBefore(n,t)})(window,document,"script");
            enp('create', 'conversion', '${setting.value.mobion.id}', { device: '${isMobileUser ? "M" : "W"}' });
            enp('send', 'conversion', 'stockcom');
        `;        

        activateScripts.push(insertElement(mobionScript, 'Enliple Tracker', 'bodyend'));
    }

    if (setting.value.cafe24?.id) {
        const cafe24Script = document.createElement('script');
        cafe24Script.innerHTML = `
            var sTime = new Date().getTime()
            order_id = '${resource.orderId}'
            product_no = '${resource.orderedItems.map((item) => item.goodsId).join('^')}' 
            product_code = '';
            order_price = '${resource.paymentPrice}';
            order_product= '${resource.orderedItems.map((item) => item.goodsName).join('^')}}';
            order_cnt= '${resource.orderedItems.reduce((p, c) => p + c.quantity, 0)}';
            order_member= '';
            (function(i,s,o,g,r,a,m){i['ordObject']=g;i['ordUid']=r;a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//stockcom.cmclog.cafe24.com/sell.js?v='+sTime,'stockcom');
        `;

        activateScripts.push(insertElement(cafe24Script, 'CAFE24', "bodyend"));        
    }

    if (setting.value.naver?.id) {
        const naverCvsScript = window.document.createElement('script');
        naverCvsScript.innerHTML = `    
            if (!wcs_add) var wcs_add={};
            wcs_add["wa"] = "${setting.value.naver.id}";
            var _nasa={};            
            if (window.wcs) {                
                _nasa["cnv"] = wcs.cnv("1", '${resource.paymentPrice}');
                wcs_do(_nasa);
            }
        `;
        const naverScript = window.document.createElement('script');
        naverScript.src = '//wcs.naver.net/wcslog.js';
        activateScripts.push(insertElement(naverScript, '네이버 전환', 'headend'));

        naverScript.onload = () => {
            activateScripts.push(insertElement(naverCvsScript, '네이버 전환', 'headend'));
        }
    }

    onUnmounted(() => {
        if (activateScripts.length > 0) {
            activateScripts.forEach((el) => {
                if (Array.isArray(el)) {
                    el.forEach((tag) => tag.remove());
                } else {
                    el.remove();
                }
            })
        }
    })
}


export function useMemberRegisted(resource: MemberRegistedActionResource) {
    if (!needMarketingScript) {
        return;
    }
    const activateScripts = [];
    // 카카오 픽셀
    if (window.kakaoPixel) {
        window.kakaoPixel(`${idResolver('kakaoPixel', resource.account, setting.value)}`).completeRegistration()
    }

    if (setting.value.cafe24?.id) {
        const cafe24WebLogScript = window.document.createElement('script');
        cafe24WebLogScript.innerHTML = `
            var sTime = new Date().getTime();
            member_id = '${ resource.loginId}';
            member_sex = ''; 
            member_age = '';
            member_zone = '';  

            (function(i,s,o,g,r,a,m){i['webObject']=g;i['webUid']=r;a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})
            (window,document,'script','//stockcom.weblog.cafe24.com/weblog.js?v='+sTime,'stockcom');
        `;

        activateScripts.push(insertElement(cafe24WebLogScript, '리포트2.0 로그분석코드 시작', 'bodyend'))
    }

    if (setting.value.naver?.id) {
        const naverScript = window.document.createElement('script');
        naverScript.src = '//wcs.naver.net/wcslog.js';
        insertElement(naverScript, '네이버 전환', 'headend');

        const naverCvsScript = window.document.createElement('script');

        naverScript.onload = () => {
            naverCvsScript.innerHTML = `
                if (!wcs_add) var wcs_add={};
                wcs_add["wa"] = "${setting.value.naver.id}";
                var _nasa={};
                if (window.wcs) {
                    wcs.cnv("2", "1"); 
                    wcs_do(_nasa);
                }
            `;
            activateScripts.push(insertElement(naverCvsScript, '네이버 전환', 'headend'));
        }
    }

    onUnmounted(() => {
        if (activateScripts.length > 0) {
            activateScripts.forEach((el) => {
                if (Array.isArray(el)) {
                    el.forEach((tag) => tag.remove());
                } else {
                    el.remove();
                }
            })
        }
    });
}

const setting = ref<undefined | MarketingSetting>({
    kakaoPixel: {
        id: '1463847132807741383'
    },
    naver: {
        id: isMobileUser ? 's_462f3ff064db' : 's_2da22cb2fd7'
    },
    mobion:  {
        id: 'stockcom'
    },
    cafe24: {
        id: 'stockcom'
    },
    doyouad: {
        id: 'istockmall'
    },
    aceCoounter: {
        id: 'stockcom'
    },
    gtm: {
        id: 'GTM-KTB3D7W'
    }
})


export function useMarketingInitialize() {
    const { globalConfigs } = useGlobalConfigs()
    
    const router = useRouter();

    if (!needMarketingScript) {
        return
    }

    try {
        if (setting.value.kakaoPixel?.id) {
            activateKakaoPixel()
        }

        if (setting.value.mobion?.id) {
            activateMobion();
        }

        if (setting.value.aceCoounter?.id) {
            activateAceCounter();
        }
        
        if (setting.value.cafe24?.id) {
            activateCafe24();
        }            

        if (setting.value.gtm?.id) {
            activateGoogleTag(setting.value.gtm?.id);
        }

        /** FUNC **/
        if (setting.value.naver?.id) {
            activateNaver();
        }

        if (setting.value.doyouad?.id) {
            activateDoyouad();
        }

        router.afterEach((to, from) => {
            if (to.path === from.path) {
                return;
            }
            pageView({
                account: 'base',
                isMobile: true,
                isTablet: false,
                isDesktop: false,
                path: to.path,
                uri: location.href,
                title: document.querySelector('title')?.innerText || '',
            })
        })
    } catch(e) {
        console.error(e, 'MarketingERROR');
    }

    onMounted(() => {   
       
    })
}

/**
/**
 * PV 액션 처리
 * @param resource 
 */
export function usePageView(resource: PageViewActionResource) {
    if (!needMarketingScript) {
        return;
    }
    // 카카오 픽셀
    if (window.kakaoPixel) {
        window.kakaoPixel(`${idResolver('kakaoPixel', resource.account, setting.value)}`).pageView()
    }

    // 크리테오
    if (window.criteo_q) {
        window.criteo_q.push(
            { event: 'setAccount', account: idResolver('criteo', resource.account, setting.value) },
            { event: 'setSiteType', type: resource.isTablet ? 't' : resource.isMobile ? 'm' : 'd' },
            { event: 'viewPage' },
        )
    }
}


export function useMainView() {
    if (!needMarketingScript) {
        return;
    }
    const activateScripts = [];

    onBeforeUnmount(() => {
        if (activateScripts.length > 0) {
            activateScripts.forEach((el) => {
                if (Array.isArray(el)) {
                    el.forEach((tag) => tag.remove());
                } else {
                    el.remove();
                }
            })
        }
    })
}