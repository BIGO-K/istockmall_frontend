<template>
    <!-- 내가 보유한 쿠폰 (TabType: Coupon) -->
    <div class="m_mybenefit">
        <div class="m_mybenefit-head T=coupon">
            <h3><b>사용 가능한 쿠폰</b><strong class="mm_text-variable">{{ MMFilters.formatNumber(benefitAggregates.couponCount) }}<sub>장</sub></strong></h3>
            <div class="mm_btn_box">
                <div class="mm_inline">
                    <MMLink
                        class="mm_btn T=sm T=line"
                        :to="{ name: 'MypageGradeBenefit' }"
                    >
                        <b>나의 등급 쿠폰 확인하기</b><i class="ico_link T=sm" />
                    </MMLink>
                </div>
            </div>
            <a 
                href="#"
                class="mm_btn T=xs T=lighter"
                @click="registCoupon"
            ><i class="ico_add" /><b>쿠폰 등록하기</b></a>
        </div>
        <!-- 쿠폰목록 -->
        <p v-if="couponRegists.total < 1" class="mm_text-none">
            <i class="ico_text-none" />보유 쿠폰이 없습니다
        </p>
        <div v-else class="m_mybenefit-coupon">
            <ul>
                <li v-for="couponRegist in couponRegists.data" :key="couponRegist.id">
                    <p :class="['text_status', { 'T=disabled': !couponRegist.isUsable }]">
                        {{ couponRegist.isUsable ? '사용가능' : '사용 불가' }}
                    </p>
                    <div class="mm_coupon T=2xl">
                        <div class="mm_coupon-inner">
                            <p v-if="couponRegist.coupon.dcType === 'rate'" class="text_percent">
                                <strong>{{ couponRegist.coupon.dcAmount }}</strong><sub>%</sub>
                            </p>
                            <p v-else class="text_price">
                                <strong>{{ MMFilters.formatNumber(couponRegist.coupon.dcAmount) }}</strong>
                            </p>
                            <p class="text_coupon">
                                {{ couponRegist.coupon.title }}
                            </p>
                            <p class="text_condition">
                                {{ couponRegist.coupon.applyRangeDescription }}
                            </p>
                            <p class="text_quantity">
                                <span>{{ couponRegist.coupon.isUnlimited ? '무제한 발급' : '1장' }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="m_mybenefit-coupon-using">
                        <MMLink :to="{ name: 'CouponConditions', params: { couponId: couponRegist.coupon.id } }">
                            <b>사용 조건</b><i class="ico_link" />
                        </MMLink>
                        <p class="text_period">
                            {{ getUntilExpireLabel(couponRegist.expireAt) }}
                        </p>
                        <p class="text_date">
                            발급일자: {{ MMFilters.formatDate(couponRegist.useStartAt, 'YYYY.MM.DD HH:mm') }}
                        </p>
                        <p class="text_date">
                            취득일자: {{ MMFilters.formatDate(couponRegist.registedAt, 'YYYY.MM.DD HH:mm') }}
                        </p>
                    </div>
                </li>
            </ul>
        </div>
        <!--// 쿠폰목록 -->

        <!-- 페이지네이션 -->
        <MMPaginator
            v-if="couponRegists.total > couponRegists.perPage"
            :page-block-type="'group'"
            :page-block-count="couponRegists.perPage"
            :current-page="couponRegists.currentPage"
            :items-per-page="couponRegists.perPage"
            :total-count="couponRegists.total"
            @move-page-to="fetch"
        />
        <!--// 페이지네이션 -->

        <!-- 유의사항 -->
        <div class="mm_note">
            <div v-dropdown class="mm_dropdown">
                <button type="button" class="btn_dropdown" title="펼쳐놓기">
                    <i class="ico_info" /><b>쿠폰 유의사항</b><i class="ico_dropdown T=box" />
                </button>
                <div class="mm_dropdown-item">
                    <div class="mm_dropdown-item-inner">
                        <ul>
                            <li>쿠폰은 회원에 한해 적용되며, 한 품목당 한장의 쿠폰만 사용할 수 있습니다.</li>
                            <li>쿠폰 사용 후 잔액은 환불이 불가하며, 자동 소멸됩니다.</li>
                            <li>쿠폰에 따라 유효기간/최소 사용금액과 같은 사용 조건이 상이합니다.</li>
                            <li>쿠폰에 따라 금액, 브랜드, 상품, 디바이스별로 사용이 제한될 수 있습니다.</li>
                            <li>유효기간이 만료된 쿠폰은 사용할 수 없습니다.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!--// 유의사항 -->
    </div>
    <!--// 내가 보유한 쿠폰 (TabType: Coupon) -->
</template>

<script setup lang="ts">
import { dropdown as vDropdown } from '$/directives';
import { defaultCatch } from '$/functions';
import { Paginator } from '$/@type';
import { mmon } from '$/helper/mmon';
import moment from 'moment';
import { makeValidator } from '$/validator';
import MMPaginator from '@/components/Paginator.vue';
import { CouponRegist } from '$/@type/member/coupon';
import { couponRepository } from '$/repository/member/couponRepository';
import { onMounted, ref } from 'vue';
import { memberAggregateRepository } from '$/repository/member/aggregateRepository';
import { BenefitAggregates } from '$/@type/member/aggregates';
import { makePath } from '$/services/http';
import { typeCastNumber } from '$/filters';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const {
    route,
    router,
    usePageTitleSetting,
} = usePageContext();
usePageTitleSetting('보유 쿠폰', ['혜택관리', '마이페이지']);

// 발급받은 쿠폰 내역
const couponRegists = ref<Paginator<CouponRegist>>({
    total: 0,
    currentPage: 1,
    perPage: 20,
    data: []
});
// 회원 혜택 집계(포인트, 쿠폰) 정보
const benefitAggregates = ref<BenefitAggregates>({
    point: 0,
    couponCount: 0,
});

/**
 * 회원 혜택 집계 데이터 조회
 */
async function fetchBenefitAggregate() {
    try {
        benefitAggregates.value = await memberAggregateRepository.getBenefitInfo();
    } catch (e) {
        console.log(e);
    } 
}

/**
 * 쿠폰 만료까지 남은 일/시/분 계산
 * @param {string} expireAt
 * @return {string}
 */
function getUntilExpireLabel(expireAt: string): string {
    const momented = moment(expireAt);
    const diff = momented.diff(moment())
    const diffInUnits = {
        s: Math.round(diff / 1000),
        m: Math.round(diff / 1000 / 60),
        h: Math.round(diff / 1000 / 60 / 60),
        d: Math.round(diff / 1000 / 60 / 60 / 24)
    }

    if (diffInUnits.s < 0) {
        return '-'
    } else if (diffInUnits.s < 60) {
        return `${diffInUnits.s}초`
    } else if (diffInUnits.m < 60) {
        return `${diffInUnits.m}분`
    } else if (diffInUnits.h < 24) {
        return `${diffInUnits.h}시간`
    } else {
        return `${diffInUnits.d}일`
    }
}

/**
 * 쿠폰 발급 내역 조회
 * @param {number} page
    */
async function fetch(page = 1) {
    try {
        mmon.loading.show();

        router.replace(makePath(route.path, {
            page
        }))
        couponRegists.value = await couponRepository.getCoupons(page);
    } catch (e) {
        defaultCatch(e);
    }
    mmon.loading.hide();
}

/**
 * 쿠폰 인증번호 등록
 */
function registCoupon() {
    mmon.bom.prompt(
        '쿠폰 인증번호를 입력해주세요\n(8자리~최대 12자리)',
        async (flag: boolean, formData: { coupon_code: string }) => {
            if (!flag) {
                return
            }
            mmon.loading.show();
            try {
                const validator = makeValidator({
                    coupon_code: formData.coupon_code,
                })
                    .setRules({
                        'coupon_code(쿠폰 인증번호)': ['required', 'betweenLength:8,12']
                    })
                    .setMessages({
                        'coupon_code.required': ':param(을/를) 입력해주세요.'
                    });
                await validator.run();
                await couponRepository.registCoupon(formData.coupon_code);
                mmon.bom.alert('쿠폰이 발급되었습니다.', async () => {
                    await fetch(1);
                    await fetchBenefitAggregate();
                });
            } catch (e) {
                defaultCatch(e);
            }
            mmon.loading.hide();
        },
        {
            title: '쿠폰 등록',
            forms: [
                {
                    type : 'text',
                    name: 'coupon_code',
                    placeholder: '쿠폰 인증번호를 입력하세요',
                    maxLength: 12,
                }
            ]
        }
    );
}

onMounted(async () => {
    Promise.all([
        fetch(typeCastNumber(route.query.page, 1)),
        fetchBenefitAggregate()
    ])
})
</script>