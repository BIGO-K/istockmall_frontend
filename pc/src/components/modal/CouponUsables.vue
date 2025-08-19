<template>
    <div class="m_my-table">
        <table v-if="coupon.applyRangeType === 'goods'">
            <colgroup>
                <col style="width:100px;">
                <col style="width:144px;">
                <col style="width:144px;">
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
                <tr
                    v-for="goods in rangeUsableList.data as CouponUsableGoods[]"
                    :key="goods.id"
                >
                    <td>
                        <i
                            v-lazyload="goods.thumbnailUrl"
                            class="mm_bg-cover image_product"
                        />
                    </td>
                    <td><b>{{ goods.brandName }}</b></td>
                    <td>
                        <p class="text_product">
                            {{ goods.name }}
                        </p>
                    </td>
                    <td>
                        <p>최대 할인금액: <strong>{{ MMFilters.formatNumber(coupon.maximumDiscountAmount) }}원</strong></p>
                        <p>최저 금액조건: {{ MMFilters.formatNumber(coupon.minSellPrice) }}원</p>
                        <p>사용가능 디바이스: {{ (coupon.usableDeviceLabels || []).join(', ') }}</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table v-else-if="coupon.applyRangeType === 'brand'">
            <colgroup>
                <col style="width:244px;">
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
                <tr
                    v-for="brand in rangeUsableList.data"
                    :key="brand.id"
                >
                    <td><b>{{ brand.name }}</b></td>
                    <td>
                        <p>최대 할인금액: <strong>{{ MMFilters.formatNumber(coupon.maximumDiscountAmount) }}원</strong></p>
                        <p>최저 금액조건: {{ MMFilters.formatNumber(coupon.minSellPrice) }}원</p>
                        <p>사용가능 디바이스: {{ (coupon.usableDeviceLabels || []).join(', ') }}</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table v-else>
            <thead>
                <tr>
                    <th scope="col">
                        <b>적용 제한사항</b>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <p>최대 할인금액: <strong>{{ MMFilters.formatNumber(coupon.maximumDiscountAmount) }}원</strong></p>
                        <p>최저 금액조건: {{ MMFilters.formatNumber(coupon.minSellPrice) }}원</p>
                        <p>사용가능 디바이스: {{ (coupon.usableDeviceLabels || []).join(', ') }}</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- 페이지네이션 -->
    <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
    <MMPaginator
        :page-block-type="'group'"
        :page-block-count="10"
        :current-page="rangeUsableList.currentPage"
        :items-per-page="rangeUsableList.perPage"
        :total-count="rangeUsableList.total"                
        @move-page-to="movePage"
    />
    <!--// 페이지네이션 -->     
</template>

<script setup lang='ts'>
import { Paginator } from '$/@type';
import { CouponUsableBrands, CouponUsableGoods, RegistedCoupon } from '$/@type/member/coupon';
import { couponRepository } from '$/repository/member/couponRepository';
import { ModalCloseHandler } from '$/@type/Modal';
import { toRefs } from 'vue'
import MMPaginator from '@/components/Paginator.vue';

const props = defineProps<{
    couponPaginator: Paginator<CouponUsableBrands|CouponUsableGoods>,
    coupon: RegistedCoupon,
    closer: ModalCloseHandler<void>
}>();

const { couponPaginator: rangeUsableList} = toRefs(props);


/** VARIABLE */

/** FUNCTION */
async function fetch(page: number) {
    if (props.coupon.applyRangeType === 'goods') {
        rangeUsableList.value = await couponRepository.getCouponUsableGoods(props.coupon.id, page)
    } else {
        rangeUsableList.value = await couponRepository.getCouponUsableBrands(props.coupon.id, page)
    }
}

async function movePage(page: number) {
    fetch(page);
}
/** VUE LIFE CYCLE */

</script>

