<template>
    <h3>
        <i class="image_logo">
            <img 
                v-lazyload="{ src: `/image/content/logo_${epCoupon.siteCode}.png` }"                     
                src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" 
                :alt="epCoupon.siteLabel"
            >
        </i>
        <b>전용</b>
    </h3>
    <div class="m...coupon-sale">
        <p v-if="epCoupon.discountedType === 'KRW'" class="text_price">
            <strong>{{ MMFilters.formatNumber(epCoupon.discountedPrice) }}</strong>
        </p>
        <p v-else class="text_percent">
            <strong>{{ MMFilters.formatNumber(epCoupon.discountedAmount) }}</strong><sub>%</sub>
        </p>
        <p>중복할인쿠폰</p>
    </div>
    <p>발급 후 당일사용/일부 상품 브랜드 제외</p>
    <div class="mm_btn_box">
        <button type="button" class="mm_btn T=dark" @click="downLoadCoupon(epCoupon.id)">
            <b>지금 다운받기</b><i class="ico_coupon-download" />
        </button>
        <button type="button" class="btn_today" @click="closeToday();">
            <b>오늘하루 그만보기</b><i class="ico_modal-close" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { EpCoupon } from '$/@type/coupon';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { goodsRepository } from '$/repository/goodsRepository';
import { ModalCloseHandler } from '$/@type/Modal';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useClosePopup } from '$/composables/popupComposable'

const props = defineProps<{
    goodsId: number
    epCoupon: EpCoupon
    closer: ModalCloseHandler<void>
}>();

const { goodsId } = toRefs(props);
const { router, isUser } = usePageContext();
const { setPopupContext } = useClosePopup() 

/**
 * 쿠폰 다운로드 처리 
 * @param {number[]} couponIds: 쿠폰 ID 
 */
async function downLoadCoupon(couponIds: number) {
    if (!isUser.value) {
        return mmon.bom.confirm('로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까', (flag: boolean) => {
            if (flag) {
                router.push({
                    name: 'Login',
                    query: {
                        redirect_to_after: router.currentRoute.value.path
                    }
                })
            }
        });
    }
    mmon.loading.show();
    try {
        await goodsRepository.couponDownLoad([couponIds]);
        mmon.bom.alert('쿠폰이 발급되었습니다.');
    } catch(error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}

/**
 * 1일동안 열지 않기 처리
 */
function closeToday() {
    setPopupContext(`IS_NAVER_COUPON_HIDE_${goodsId.value}`, true)
    props.closer()  
}

</script>
