<template>
    <h4 class="mm_strapline">
        <b>받기 가능한 쿠폰<strong>{{ downloadAbleCouponIds.length }}</strong><sub>장</sub></b>
    </h4>
    <!-- 쿠폰 목록 -->
    <ul class="m...coupon-list">
        <li v-for="coupon in couponList" :key="coupon.id">
            <p class="text_coupon">
                {{ coupon.name }}
            </p>
            <p class="text_period">
                {{ coupon.expirationDateMessage }}
            </p>
            <p v-if="!isDownloadableDevice(coupon.usableDeviceLabels)" class="text_condition">
                <i class="ico_note" />{{ downloadableDeviceLabel(coupon.usableDeviceLabels) }}
            </p>
            <button
                v-if="coupon.isDownloaded"
                type="button"
                class="mm_btn T=sm T=line T=primary btn_download"
                @click="downLoadCoupons([coupon.id])"
            >
                <b>쿠폰받기</b>
            </button>
            <!-- <b v-else class="mm_btn T=sm T=light btn_download">발급완료</b> -->
        </li>
    </ul>
    <!--// 쿠폰 목록 -->

    <!-- 하단버튼 -->
    <div class="mm_foot">
        <div class="mm_btn_box">
            <button type="button" class="mm_btn T=primary" @click="downLoadCoupons(downloadAbleCouponIds)">
                <b>전체 쿠폰받기</b>
            </button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { goodsRepository } from '$/repository/goodsRepository'
import { DownLoadCoupon } from '$/@type/coupon'
import { computed, ref, toRefs } from 'vue';
import { mmon } from '$/helper/mmon'
import { defaultCatch } from '$/functions';
import { ModalCloseHandler } from '$/@type/Modal';


const props = defineProps<{
    goodsId: number,
    coupons: DownLoadCoupon[],
    closer: ModalCloseHandler<void>        
}>();

/** VARIABLE */
const couponList = ref<DownLoadCoupon[]>(props.coupons);
const downloadAbleCouponIds = computed(() => {
    const couponIds: number[] = []
    couponList.value.filter(function (coupon) {
        if (coupon.isDownloaded) {
            couponIds.push(coupon.id)
        }
    })
    return couponIds;
})
/** FUNCTION */

/**
 * 다운로드 가능한 디바이스 라벨 목록 반환
 * @param {string[]} deviceLabels
 */
function downloadableDeviceLabel(deviceLabels: string[]) {
    const devicesLabel = deviceLabels
        .filter((deviceLabel) => {
            return deviceLabel !== 'PC'
        })
        .join(', ')

    return `${devicesLabel}에서만 쿠폰 다운로드 가능`;
}

/**
 * 다운로드 가능한 디바이스 여부
*/
function isDownloadableDevice(deviceLabels: string[]) {
    return deviceLabels.length === 3 || deviceLabels.includes('PC');
}

/**
 * 쿠폰 다운로드 처리
 * @param {number[]} couponIds: 쿠폰 ID
 */
async function downLoadCoupons(couponIds: number[]) {
    if (couponIds.length < 1) {
        return mmon.bom.alert('다운받을 쿠폰이 없습니다.');
    }

    mmon.loading.show()
    try {
        await goodsRepository.couponDownLoad(couponIds)
        await getCoupons();
        mmon.bom.alert('쿠폰이 발급되었습니다.')
    } catch (error) {
        defaultCatch(error)
    } finally {
        mmon.loading.hide()
    }
}
/**
 * 다운로드 쿠폰 재조회  
*/
async function getCoupons() {
    mmon.loading.show()
    try {
        couponList.value = await goodsRepository.couponList(props.goodsId)
    } catch (error) {
        defaultCatch(error)
    } finally {
        mmon.loading.hide()
    }
}
/** VUE LIFE CYCLE */

</script>
