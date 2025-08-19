interface ActionResource {
    /** 수집계정구분코드 */
    account: string

    /** 모바일 여부 */
    isMobile: boolean

    /** 태블릿 여부 */
    isTablet: boolean

    /** 데스크탑 여부 */
    isDesktop: boolean

    /** 회원 메일주소 */
    userMail?: string

    /** 회원 우편번호 */
    userZip?: string
}

interface OrderedItemResource {
    /** 상품코드 */
    goodsId: number

    /** 옵션코드 */
    optionId: number

    /** 상품명 */
    goodsName: string

    /** 옵션명 */
    optionName: string

    /** 수량 */
    quantity: number

    /** 단가 */
    price: number

    /** 지불단가 */
    paidPrice: number
}

export interface OrderReceiptedActionResource extends ActionResource {
    /** 최종결제가 */
    paymentPrice: number

    /** 주문번호 */
    orderId: string

    /** 주문항목 목록 */
    orderedItems: OrderedItemResource[]
}

export interface ViewCartActionResource extends ActionResource {
    /** 장바구니 아이템 목록 */
    cartItems: CartItemResource[]
}

export interface ViewGoodsListActionResource extends ActionResource {
    /** 검색어 */
    searchWord?: string

    /** 상품코드 배열 */
    goodsIds: number[]

    /** 대표 카테고리 코드 */
    categoryCode?: string

    /** 대표 카테고리명 */
    categoryName?: string

    /** 카테고리 전체 경로 */
    categoryFullPath?: string
}

/**
 * PV 액션 리소스
 */
export interface PageViewActionResource extends ActionResource {
    /** 경로 */
    path: string

    /** uri */
    uri: string 

    /** 페이지제목 */
    title: string
}

/**
 * 상품조회 액션 리소스
 */
export interface ViewGoodsActionResource extends ActionResource {
    /** 상품코드 */
    goodsId: number

    /** 상품명 */
    goodsName: string

    /** 정가 */
    listPrice: number

    /** 판매가 */
    sellPrice: number

    /** 할인적용가 */
    discountedPrice: number

    /** 이미지 경로 */
    imageUrls: string[]

    /** 품절여부 */
    isSoldout: boolean

    /** 카테고리코드 */
    categoryCode?: string

    /** 카테고리명 */
    categoryName?: string

    /** 카테고리 전체 경로 */
    categoryFullPath?: string

    /** 브랜드 명 */
    brandName?: string  
}

export interface ViewGoodsDetailActionResource extends ActionResource {
    /** 상품코드 */
    goodsId: number

    /** 상세설명 */
    detailInformation?: string
}

/**
 * 장바구니 레코드 리소스
 */
export interface CartItemResource {
    /** 상품코드 */
    goodsId: number

    /** 옵션코드 */
    optionId: number

    /** 상품명 */
    goodsName: string

    /** 옵션명 */
    optionName: string

    /** 수량 */
    quantity: number

    /** 단가 */
    price: number

    /** 할인적용가 */
    discountedPrice: number
}

/**
 * 장바구니 담기 액션 리소스
 */
export interface AddToCartActionResource extends ActionResource {
    /** 장바구니 아이템 목록 */
    cartItems: CartItemResource[]
}

/**
 * 회원가입 완료 액션 리소스
 */
export interface MemberRegistedActionResource extends ActionResource {
    /** 회원 가입 계쩡 */
    loginId?: string
}