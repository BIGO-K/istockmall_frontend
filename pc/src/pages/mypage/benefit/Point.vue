<template>
    <div class="mm_page-content-body">
        <div class="m_my-benefit">
            <h5 class="mm_heading">
                <b>혜택 관리</b>
            </h5>
            <!-- 탭메뉴 -->
            <div class="mm_tab_menu">
                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                <ul class="mm_flex T=equal">
                    <li>
                        <MMLink :to="{ name: 'MypageBenefitCoupon' }">
                            <b>보유 쿠폰</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink
                            class="S=tab-on"
                            :to="{ name: 'MypageBenefitPoint' }"
                        >
                            <b>보유 {{ pointLabel.name }}</b>
                        </MMLink>
                    </li>
                </ul>
            </div>
            <!--// 탭메뉴 -->
            <p class="text_quantity">
                내가 보유한 {{ pointLabel.name }}
                <strong>{{ MMFilters.formatNumber(pointHistories.totalPointBalance) }}</strong>
                <sub>{{ pointLabel.suffix }}</sub>
            </p>
            <div class="m_my-benefit-point">
                <!-- 기간 설정 -->
                <!-- (D) 현재 조회기간에 해당하는 mm_btn의 'T=light' 클래스가 'T=primary'로 교체되며, '선택됨' 타이틀을 추가합니다 -->
                <div class="m...point-period">
                    <div class="mm_btn_box">
                        <button 
                            v-for="month in [1,3,6]"
                            :key="month"
                            type="button" 
                            class="mm_btn T=xs T=line T=light"
                            :class="searchPeriodMonth === month ? ' T=primary' : 'T=light'"
                            :title="searchPeriodMonth === month ? '선택됨': ''"
                            @click="searchPeriodMonth = month; fetch(1)"
                        >
                            <b>{{ month }}개월</b>
                        </button>
                    </div>
                    <span class="text_period">조회기간: {{ searchPeriodLabel }}</span>
                </div>
                <!--// 기간 설정 -->

                <!-- 적립금 내역 -->
                <!-- (D) 지급 적립금인 경우 적립금 b태그에 mm_text-secondary 클래스를 추가합니다 -->
                <div class="m_my-table">
                    <table>
                        <colgroup>
                            <col style="width:494px;">
                            <col style="width:224px;">
                            <col>
                            <col>
                            <col>
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">
                                    <b>내역</b>
                                </th>
                                <th scope="col">
                                    <b>주문번호</b>
                                </th>
                                <th scope="col">
                                    <b>지급일/차감일</b>
                                </th>
                                <th scope="col">
                                    <b>유효일자</b>
                                </th>
                                <th scope="col">
                                    <b>{{ pointLabel.name }}</b>
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="pointHistories.total > 0">
                            <tr
                                v-for="history in pointHistories.data"
                                :key="history.description + history.createdAt"
                            >
                                <td><p>{{ history.description }}</p></td>
                                <td>
                                    <MMLink
                                        v-if="history.orderId"
                                        class="btn_order"
                                        :to="{ name: 'MypageOrderDetail', params: { id: history.orderId } }"
                                    >
                                        <b>{{ history.orderId }}</b><i class="ico_link T=sm" />
                                    </MMLink>
                                    <b v-else>-</b>
                                </td>
                                <td><b>{{ MMFilters.formatDate(history.createdAt, 'YYYY.MM.DD') }}</b></td>
                                <td><b>{{ history.expireAt ? MMFilters.formatDate(history.expireAt, 'YYYY.MM.DD') : '-' }}</b></td>
                                <td>
                                    <b
                                        v-if="history.isEarned"
                                        class="mm_text-variable"
                                    >+ {{ MMFilters.formatNumber(history.pointAmount) }}</b>
                                    <b v-else>- {{ MMFilters.formatNumber(history.pointAmount) }}</b>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="5">
                                    <p class="mm_text-none">
                                        <i class="ico_text-none" />적립/사용 내역이 없습니다
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--// 적립금 내역 -->
            </div>
            <!-- 페이지네이션 -->
            <MMPaginator
                v-if="pointHistories.total > pointHistories.perPage"
                :page-block-type="'group'"
                :page-block-count="10"
                :current-page="pointHistories.currentPage"
                :items-per-page="pointHistories.perPage"
                :total-count="pointHistories.total"
                @move-page-to="fetch"
            />
            <!--// 페이지네이션 -->

            <!-- 유의사항 -->
            <section class="mm_note">
                <h6 class="text_title">
                    <i class="ico_note" /><b>{{ pointLabel.name }} 유의사항</b>
                </h6>
                <ul>
                    <li>{{ MMFilters.applyZosa(`${pointLabel.name}(은/는)`) }} 주문하실 때 현금처럼 이용 가능하며 다른 결제 수단과 함께 사용하실 수 있습니다.</li>
                    <li>{{ MMFilters.applyZosa(`${pointLabel.name}(은/는)`) }} 현금으로 환불되지 않습니다.</li>
                    <li>
                        {{ MMFilters.applyZosa(`${pointLabel.name}(은/는)`) }}
                        <strong>{{ MMFilters.formatNumber(pointUseRule.minUsableBalance) }}원 이상 보유 시 가능</strong>
                        합니다. 단, 
                        <strong v-if="pointUseRule.maxUsableAmountType === 'rate'">최종결제금액 대비 최대 {{ pointUseRule.maxUsableAmount }}% 사용 가능</strong>
                        <strong v-else>최대 {{ MMFilters.formatNumber(pointUseRule.maxUsableAmount) }}원 사용 가능</strong>
                        합니다. (할인 적용 후 최종 구매가 기준)
                    </li>
                    <li>
                        {{ MMFilters.applyZosa(`${pointLabel.name}(은/는)`) }} 구매한 상품의 주문 상태가 
                        <strong>구매 확정 단계로 변경 시 지급</strong>
                        되며, 취소 / 반품 시 재적립이 가능합니다.
                    </li>
                    <li>{{ MMFilters.applyZosa(`${pointLabel.name}(은/는)`) }} 지급일 기준으로 <strong>{{ pointUseRule.usableMonth }}개월 후 소멸</strong>됩니다.</li>
                    <li>배송 완료 후 구매확정 상태로 자동 변경된 상품의 {{ MMFilters.applyZosa(`${pointLabel.name}(은/는)`) }} 익일 4시에 지급됩니다.</li>
                </ul>
            </section>
            <!--// 유의사항 -->
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { Moment } from 'moment';
import moment from 'moment';
import { defaultCatch } from '$/functions';
import { PointRules, PointHistoryPaginator, PointLabel } from '$/@type/member/point';
import { pointRepository } from '$/repository/member/pointRepository';
import MMPaginator from '@/components/Paginator.vue';
import { mmon } from '$/helper/mmon';
import { useRoute, useRouter } from 'vue-router';
import { makePath } from '$/services/http';
import { typeCastNumber } from '$/filters';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';

const route = useRoute()
const router= useRouter()
const { globalConfigs } = useGlobalConfigs();
usePageTitleSetting('보유 적립금', ['혜택 관리', '마이페이지']);

// 적립금 설정
const pointUseRule = ref<PointRules>(globalConfigs.value.point.rules);

// 적립금 라벨
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label)

// 적립금 내역
const pointHistories = ref<PointHistoryPaginator>({
    totalPointBalance: 0,
    total: 0,
    currentPage: 1,
    perPage: 20,
    data: []
});

// 검색기간
const searchPeriodMonth = ref<number>(typeCastNumber(route.query.period, 1));
const searchStartAt = computed<Moment>(() => {
    return moment().subtract(searchPeriodMonth.value, 'month');
});

// 검색기간 TEXT
const searchPeriodLabel = computed<string>(() => {
    return `${searchStartAt.value.format('YYYY.MM.DD')} ~ ${moment().format('YYYY.MM.DD')}`
})

onBeforeMount(async () => {
    fetch(typeCastNumber(route.query.page, 1));
});

// 적립금 내역 조회
async function fetch(page: number) {
    try {
        mmon.loading.show();
        router.replace(makePath(route.path, {
            period: searchPeriodMonth.value,
            page
        }))
        pointHistories.value = await pointRepository.getPointHistories(searchStartAt.value, moment(), page, 20);
    } catch (e) {
        defaultCatch(e)
    } finally {
        mmon.loading.hide();
    }
}
</script>