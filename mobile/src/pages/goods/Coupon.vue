<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>쿠폰 다운받기</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-coupon">
                            <div class="m_popup-coupon-head">
                                <h3><b>받기 가능한 쿠폰</b><strong>{{ downloadAbleCouponIds.length }}<sub>장</sub></strong></h3>
                                <button type="button" class="mm_btn T=sm T=primary btn_download" @click="downLoadCoupons(downloadAbleCouponIds)">
                                    <b>전체 쿠폰받기</b>
                                </button>
                            </div>

                            <!-- 쿠폰 리스트 -->
                            <ul class="m_popup-coupon-list">
                                <li v-for="coupon in couponList" :key="coupon.id">
                                    <p class="text_coupon">
                                        {{ coupon.name }}
                                    </p>
                                    <p class="text_period">
                                        {{ coupon.expirationDateMessage }}
                                    </p>
                                    <p
                                        v-if="!isDownloadableDevice(coupon.usableDeviceLabels)"
                                        class="text_condition"
                                    >
                                        <i class="ico_info" />{{ downloadableDeviceLabel(coupon.usableDeviceLabels) }}
                                    </p>
                                    <button v-if="coupon.isDownloaded" type="button" class="mm_btn T=sm T=line T=primary btn_download" @click="downLoadCoupons([coupon.id])">
                                        <b>쿠폰받기</b>
                                    </button>
                                </li>
                            </ul>
                            <!--// 쿠폰 리스트 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { goodsRepository } from '$/repository/goodsRepository';
import { DownLoadCoupon } from '$/@type/coupon';
import { computed, ref, onMounted } from 'vue';
import { mmon } from '$/helper/mmon';
import { defaultCatch, isMobile } from '$/functions';
import { useRoute } from 'vue-router';

const route = useRoute();
const goodsId = Number(route.params.id.toString());
const couponList = ref<DownLoadCoupon[]>([]);

/**
 * 다운로드 가능한 쿠폰 계산처리
 */
const downloadAbleCouponIds = computed(()=> {
    const couponIds: number[] = [];
    couponList.value.filter(function (coupon) {
        if (coupon.isDownloaded) {
            couponIds.push(coupon.id);
        }
    })
    return couponIds;
})
/**
 * 쿠폰정보 조회
 */
async function fetchCouponList() {
    mmon.loading.show();
    try {
        couponList.value = await goodsRepository.couponList(goodsId);
    } catch (error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}

/**
 * 쿠폰 다운로드 처리 
 * @param {number[]} couponId: 쿠폰 ID 
 */
async function downLoadCoupons(couponIds: number[]) {
    if (couponIds.length < 1) {
        return mmon.bom.alert('다운받을 쿠폰이 없습니다.');
    }

    mmon.loading.show();
    try {
        await goodsRepository.couponDownLoad(couponIds);
        await fetchCouponList();
        mmon.bom.alert('쿠폰이 발급되었습니다.');
    } catch(error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}

/**
 * 다운로드 가능한 디바이스 라벨 목록 반환
 *
 * @param {string[]} deviceLabels
 */
function downloadableDeviceLabel(deviceLabels: string[]) {
    const devicesLabel = deviceLabels.filter(deviceLabel => {
        if (isMobile('app')) {
            return deviceLabel !== '모바일앱';
        } else {
            return deviceLabel !== '모바일웹';
        }
    })
        .sort()
        .join(', ');

    return `${devicesLabel}에서만 쿠폰 다운로드 가능`;
}

/**
 * 다운로드 가능한 디바이스 여부
 *
 */
function isDownloadableDevice(deviceLabels: string[]) {
    if (isMobile('app')) {
        return deviceLabels.length === 3 || deviceLabels.includes('모바일앱');
    } else {
        return deviceLabels.length === 3 || deviceLabels.includes('모바일웹');
    }
}

onMounted(async() => {
    await fetchCouponList();
});

</script>
