import { GiveAway, ReviewModalInfo } from "$/@type/goods";
import { ref } from "vue";

/**
 * 360도 이미지 관련 제어 
 */
const degree360ImageUrls = ref<string[]>([]);

export function use360DegreeImage() {
    
    function setImageUrls(imageUrls: string[]) {
        degree360ImageUrls.value = imageUrls
    }

    return {
        degree360ImageUrls,
        setImageUrls
    }
}

/**
 * 사은품 정보 제어
 */
const giveaways = ref<GiveAway[]>([]);

export function useGiveaways() {

    function setGiveaways(giveawaysInfo: GiveAway[]) {
        giveaways.value = giveawaysInfo;
    }

    return {
        giveaways,
        setGiveaways,
    }
}

const qnaId = ref<number>(0);
const goodsId = ref<number>();
    
/**
 * 상품상세용 Q&A 정보 설정
 * @returns 
 */
export function useQnaDetail() {

    function setQnaId(id: number) {
        qnaId.value = id;
    }

    function setGoodsId(id: number) {
        goodsId.value = id;
    }

    return {
        qnaId,
        setQnaId,
        setGoodsId,
        goodsId
    }
}


/**
 * 상품상세 > 리뷰 상세용 정보 설정
 */
const reviewModalInfo = ref<ReviewModalInfo>({
    reviewId: 0,
    totalCount: 0,
    lastReviewId: 0,
    firstReviewId: 0,
});
export function useReviewModal() {
    function setReviewModalInfo(photoReviewInfo: ReviewModalInfo) {
        Object.assign(reviewModalInfo.value, photoReviewInfo);
    }

    return {
        setReviewModalInfo,
        reviewModalInfo
    }
}

/**
 * 줌로더
 */
export function useZoomLoaderRemoval() {
    /** VARIABLE **/
    const cloneImageInterval = ref<null|NodeJS.Timeout>(null);
    /** //VARIABLE **/

    /** FUNCTION **/
    function clearCloneImageInterval() {
        if (!cloneImageInterval.value) {
            return
        }
        clearInterval(cloneImageInterval.value);
        cloneImageInterval.value = null;
    }

    function removeCloneImage(options?: { scrollToTop: boolean }) {
        const cloneImage: HTMLElement|null = document.querySelector('.m_product-clone');
        if (!cloneImage || cloneImageInterval.value) {             
            return clearCloneImageInterval();     
        }
        
        let tickCount = 0;
        cloneImageInterval.value = setInterval(() => {
            if (tickCount > 20 
                || document.querySelector('.mm_carousel i.S\\=loaded') 
                || document.querySelector('.mm_carousel i.S\\=error') 
                || !document.querySelector('.mm_carousel i')
            ) {
                // 썸네일 로딩이 끝났거나 n회 이상 지연되는 경우
                cloneImage.classList.add('hide_auto');
                clearCloneImageInterval();
                setTimeout(() => {
                    cloneImage.remove();  
                }, 380);                            
            }
        
            tickCount++;
        }, 200);  
    }
    /** //FUNCTION **/

    return {
        removeCloneImage
    }
}