<template>
    <div :class="['m_modal-prodetail-pcs', `T=pcs-${epCoupon.siteCode}`]">
        <h3>
            <i class="image_logo"><img
                v-lazyload="{ src: `/image/content/logo_${epCoupon.siteCode}.png` }" 
                src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                :alt="epCoupon.siteLabel"
            ></i><b>전용 쿠폰</b>
        </h3>
        <div class="m...pcs-coupon">
            <p
                v-if="epCoupon.discountedType === 'KRW'"
                class="text_price"
            >
                <strong>{{ MMFilters.formatNumber(epCoupon.discountedPrice) }}</strong>
            </p>
            <p
                v-else
                class="text_percent"
            >
                <strong>{{ MMFilters.formatNumber(epCoupon.discountedAmount) }}</strong><sub>%</sub>
            </p>
            <p class="text_coupon">
                중복할인쿠폰
            </p>
        </div>
        <p>발급 후 당일사용/일부 상품 브랜드 제외</p>
        <div class="mm_btn_box">
            <button
                type="button"
                class="mm_btn T=dark"
                @click="downLoadCoupon(epCoupon.id)"
            >
                <b>지금 다운받기</b><i class="ico_download" />
            </button>
        </div>
        <div class="m...pcs-today">
            <label class="mm_form-check">
                <input
                    v-model="isCloseToday"
                    type="checkbox"
                    data-check
                >
                <b class="mm_block">
                    <i class="ico_form-check" />
                    <span class="text_label">오늘은 그만 볼래요</span>
                </b>
            </label>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { EpCoupon } from '$/@type/coupon';
import { ref, watch } from 'vue';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { goodsRepository } from '$/repository/goodsRepository';
import { useRouter } from 'vue-router';
import { ModalCloseHandler } from '$/@type/Modal';
import { useClosePopup } from '$/composables/popupComposable'
/** VARIABLE */

const props = defineProps<{
    epCoupon: EpCoupon,
    goodsId: number,
    isUser: boolean,
    closer: ModalCloseHandler<void>    
}>();

const isCloseToday = ref(false);
const router = useRouter();
const { setPopupContext } = useClosePopup() 
        
/**
 * 쿠폰 다운로드 처리 
 * @param {number[]} couponIds: 쿠폰 ID 
 */
async function downLoadCoupon(couponIds: number) {
    if (!props.isUser) {
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


watch(isCloseToday, () => {
    if (isCloseToday.value) {
        setPopupContext(`IS_${props.epCoupon.siteCode}_${props.goodsId}`, true)
    }
})
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>


