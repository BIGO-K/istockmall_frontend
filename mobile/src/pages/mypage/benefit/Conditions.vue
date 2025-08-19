<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>사용조건</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div v-if="coupon !== undefined" class="mm_page-content">
                        <!-- Type: Goods -->
                        <div v-if="coupon.applyRangeType === 'goods'" class="m_popup-mycoupon">
                            <table>
                                <colgroup>
                                    <col style="width:71px;">
                                    <col style="width:17.24137%;">
                                    <col style="width:20.11494%;">
                                    <col>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            <b>상품</b>
                                        </th>
                                        <th scope="col">
                                            <b>브랜드명</b>
                                        </th>
                                        <th scope="col">
                                            <b>상품명</b>
                                        </th>
                                        <th scope="col">
                                            <b>적용 제한사항</b>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in (rangeUsableList.data as CouponUsableGoods[])" :key="item.id">
                                        <td><i v-lazyload="item.thumbnailUrl" class="mm_bg-cover image_product" /></td>
                                        <td>{{ item.brandName }}</td>
                                        <td>
                                            <p class="text_product">
                                                {{ item.name }}
                                            </p>
                                        </td>
                                        <td>
                                            <p>최대 할인금액: <strong class="mm_text-variable">{{ MMFilters.formatNumber(coupon.maximumDiscountAmount) }}원</strong></p>
                                            <p>최저 금액조건: {{ MMFilters.formatNumber(coupon.minSellPrice) }}원</p>
                                            <p>사용가능 디바이스: {{ coupon.usableDeviceLabels.join(', ') }}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--// Type: Goods -->

                        <!-- Type: Brand -->
                        <div v-else-if="coupon?.applyRangeType === 'brand'" class="m_popup-mycoupon">
                            <table>
                                <colgroup>
                                    <col style="width:43.10344%;">
                                    <col>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            <b>브랜드명</b>
                                        </th>
                                        <th scope="col">
                                            <b>적용 제한사항</b>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in rangeUsableList.data" :key="item.id">
                                        <td><b>{{ item.name }}</b></td>
                                        <td>
                                            <p>최대 할인금액: <strong class="mm_text-variable">{{ MMFilters.formatNumber(coupon.maximumDiscountAmount) }}원</strong></p>
                                            <p>최저 금액조건: {{ MMFilters.formatNumber(coupon.minSellPrice) }}원</p>
                                            <p>사용가능 디바이스: {{ coupon.usableDeviceLabels.join(', ') }}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--// Type: Brand -->

                        <!-- Type: ...etc -->
                        <div v-else class="m_popup-mycoupon">
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            <b>적용 제한사항</b>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <td>
                                        <p>최대 할인금액: <strong class="mm_text-variable">{{ MMFilters.formatNumber(coupon.maximumDiscountAmount) }}원</strong></p>
                                        <p>최저 금액조건: {{ MMFilters.formatNumber(coupon.minSellPrice) }}원</p>
                                        <p>사용가능 디바이스: {{ coupon.usableDeviceLabels.join(', ') }}</p>
                                    </td>
                                </tbody>
                            </table>
                        </div>
                        <!--// Type: ...etc -->
                        <!-- 페이지네이션 -->
                        <MMPaginator
                            v-if="rangeUsableList.total > rangeUsableList.perPage"
                            :page-block-type="'group'"
                            :page-block-count="5"
                            :current-page="rangeUsableList.currentPage"
                            :items-per-page="rangeUsableList.perPage"
                            :total-count="rangeUsableList.total"
                            @movePageTo="fetch"
                        />
                        <!--// 페이지네이션 -->
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { defaultCatch } from '$/functions';
import { Paginator } from '$/@type';
import { CouponUsableBrands, CouponUsableGoods, RegistedCoupon } from '$/@type/member/coupon';
import { couponRepository } from '$/repository/member/couponRepository';
import { mmon } from '$/helper/mmon';
import NotFoundError from '$/errors/NotFoundError';
import MMPaginator from '@/components/Paginator.vue';
import MMPopup from '@/components/layout/Popup.vue';

const route = useRoute();
const couponId = ref<number>(Number(route.params.couponId));
const coupon = ref<RegistedCoupon>();
const rangeUsableList = ref<Paginator<CouponUsableBrands|CouponUsableGoods>>({
    total: 0,
    currentPage: 0,
    perPage: 20,
    data: []
});

/**
 * 쿠폰 사용 조건 패치 함수
 * @param {number} page
 */
async function fetch(page: number) {
    if (couponId.value === undefined || coupon.value === undefined) {
        return;
    }
    try {
        mmon.loading.show();
        if (coupon.value.applyRangeType === 'goods') {
            rangeUsableList.value = await couponRepository.getCouponUsableGoods(couponId.value, page)
        } else if (coupon.value.applyRangeType === 'brand') {
            rangeUsableList.value = await couponRepository.getCouponUsableBrands(couponId.value, page)
        } else {
            rangeUsableList.value = await couponRepository.getCouponUsableBrands(couponId.value, page)
        }
    } catch (error) {
        defaultCatch(error);
    }
    mmon.loading.hide();
}
        

onMounted(async () => {
    try {
        // 쿠폰 조회
        coupon.value = await couponRepository.getCoupon(couponId.value);
        if (coupon.value === undefined) {
            return NotFoundError;
        }
        // 쿠폰의 사용조건 목록 조회
        fetch(1);
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
});
</script>