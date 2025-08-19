<template>
    <div class="m_mybenefit">
        <div class="m_mybenefit-head">
            <h3>
                <b>내가 보유한 {{ pointLabel.name }}</b>
                <strong class="mm_text-variable">
                    {{ MMFilters.formatNumber(pointHistories.totalPointBalance) }}<sub>{{ pointLabel.suffix }}</sub>
                </strong>
            </h3>
        </div>
        <!-- 기간조회 -->
        <div class="m_mybenefit-period">
            <div class="mm_btn_box">
                <div class="mm_inline">
                    <button
                        v-for="month in [1, 3, 6]"
                        :key="month"
                        type="button"
                        :class="['mm_btn T=sm T=line', searchPeriodMonth === month ? ' T=dark' : 'T=lightest']"
                        :title="searchPeriodMonth === month ? '선택됨' : ''"
                        @click="() => {
                            searchPeriodMonth = month;
                            fetch();
                        }"
                    >
                        <b>{{ month }}개월</b>
                    </button>
                </div>
            </div>
            <p>조회기간: {{ searchPeriodLabel }}</p>
        </div>
        <!--// 기간조회 -->

        <!-- 적립금 내역 없음 -->
        <p v-if="pointHistories.total < 1" class="mm_text-none">
            <i class="ico_text-none" />적립/사용 내역이 없습니다
        </p>
        <!-- 적립금내역 -->
        <div v-else class="m_mybenefit-point">
            <ul>
                <li v-for="(history, index) in pointHistories.data" :key="index">
                    <MMLink v-if="history.orderId" class="btn_order" :to="{ name: 'MypageOrderDetail', params: { id: history.orderId } }">
                        <template v-if="history.isEarned">
                            <h6 class="mm_strapline">
                                <b>{{ history.description }}</b>
                            </h6>
                            <p class="text_order">
                                주문번호: {{ history.orderId }}
                            </p>
                            <p>{{ pointLabel.name }} 지급일: {{ MMFilters.formatDate(history.createdAt, 'YYYY.MM.DD') }}</p>
                            <p v-if="history.expireAt">
                                유효일자: {{ MMFilters.formatDate(history.expireAt, 'YYYY.MM.DD') }}
                            </p>
                            <p class="text_point mm_text-variable">
                                + {{ MMFilters.formatNumber(history.pointAmount) }}
                            </p>
                        </template>
                        <template v-else>
                            <h6 class="mm_strapline">
                                <b>{{ history.description }}</b>
                            </h6>
                            <p>{{ pointLabel.name }} 차감일: {{ MMFilters.formatDate(history.createdAt, 'YYYY.MM.DD') }}</p>
                            <p class="text_point">
                                - {{ MMFilters.formatNumber(history.pointAmount) }}
                            </p>
                        </template>
                    </MMLink>
                    <a v-else href="javascript:void(0)">
                        <template v-if="history.isEarned">
                            <h6 class="mm_strapline">
                                <b>{{ history.description }}</b>
                            </h6>
                            <p>{{ pointLabel.name }} 지급일: {{ MMFilters.formatDate(history.createdAt, 'YYYY.MM.DD') }}</p>
                            <p v-if="history.expireAt">
                                유효일자: {{ MMFilters.formatDate(history.expireAt, 'YYYY.MM.DD') }}
                            </p>
                            <p class="text_point mm_text-variable">
                                + {{ MMFilters.formatNumber(history.pointAmount) }}
                            </p>
                        </template>
                        <template v-else>
                            <h6 class="mm_strapline">
                                <b>{{ history.description }}</b>
                            </h6>
                            <p>{{ pointLabel.name }} 차감일: {{ MMFilters.formatDate(history.createdAt, 'YYYY.MM.DD') }}</p>
                            <p class="text_point">
                                - {{ MMFilters.formatNumber(history.pointAmount) }}
                            </p>
                        </template>
                    </a>
                </li>
            </ul>
        </div>
        <!--// 적립금내역 -->

        <!-- 페이지네이션 -->
        <MMPaginator
            v-if="pointHistories.total > pointHistories.perPage"
            :page-block-type="'group'"
            :page-block-count="3"
            :current-page="pointHistories.currentPage"
            :items-per-page="pointHistories.perPage"
            :total-count="pointHistories.total"
            @move-page-to="fetch"
        />
        <!--// 페이지네이션 -->

        <!-- 유의사항 -->
        <div class="mm_note">
            <div v-dropdown class="mm_dropdown" data-dropdown>
                <button type="button" class="btn_dropdown" title="펼쳐놓기">
                    <i class="ico_info" /><b>{{ pointLabel.name }} 유의사항</b><i class="ico_dropdown T=box" />
                </button>
                <div class="mm_dropdown-item">
                    <div class="mm_dropdown-item-inner">
                        <ul>
                            <li>{{ MMFilters.applyZosa(`${pointLabel.name}(은/는)`) }} 주문하실 때 현금처럼 이용 가능하며 다른 결제 수단과 함께 사용하실 수 있습니다.</li>
                            <li>{{ MMFilters.applyZosa(`${pointLabel.name}(은/는)`) }} 현금으로 환불되지 않습니다.</li>
                            <li>
                                {{ MMFilters.applyZosa(`${pointLabel.name}(은/는)`) }} 
                                <strong>{{ MMFilters.formatNumber(pointUseRule.minUsableBalance) }}원 이상 보유 시 가능</strong>합니다. 단, 
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
                    </div>
                </div>
            </div>
        </div>
        <!--// 유의사항 -->
    </div>
</template>


<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { defaultCatch } from '$/functions';
import { dropdown as vDropdown } from '$/directives';
import { mmon } from '$/helper/mmon';
import moment, { Moment } from 'moment';
import MMPaginator from '@/components/Paginator.vue';
import { PointRules, PointHistoryPaginator, PointLabel } from '$/@type/member/point';
import { pointRepository } from '$/repository/member/pointRepository';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { makePath } from '$/services/http';
import { typeCastNumber } from '$/filters';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const {
    route,
    router,
    usePageTitleSetting,
} = usePageContext();
usePageTitleSetting('보유 적립금', ['혜택관리', '마이페이지']);

const { globalConfigs } = useGlobalConfigs();
// 적립금 라벨
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);
// 적립금 내역
const pointHistories = ref<PointHistoryPaginator>({
    totalPointBalance: 0,
    total: 0,
    currentPage: 1,
    perPage: 20,
    data: []
});

// 적립금 설정
const pointUseRule = ref<PointRules>(globalConfigs.value.point.rules);
// 검색기간
const searchPeriodMonth = ref<number>(typeCastNumber(route.query.period, 1));
const searchStartAt = computed<Moment>(() => {
    return moment().subtract(searchPeriodMonth.value, 'month');
});
// 검색기간 TEXT
const searchPeriodLabel = computed<string>(() => {
    return `${searchStartAt.value.format('YYYY.MM.DD')} ~ ${moment().format('YYYY.MM.DD')}`
});
        
/**
 * 적립금 내역 조회
 * @param {number} page
 */
async function fetch(page = 1) {
    try {
        mmon.loading.show();
        router.replace(makePath(route.path, {
            period: searchPeriodMonth.value,
            page,
        }))
        pointHistories.value = await pointRepository.getPointHistories(searchStartAt.value, moment(), page, 20);
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

onMounted(async () => {
    try {
        await fetch(typeCastNumber(`${route.query.page}`, 1));
    } catch(e) {
        console.error('fetch error')
    }
    
})
</script>