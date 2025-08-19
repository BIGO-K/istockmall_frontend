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
                        <MMLink
                            class="S=tab-on"
                            :to="{ name: 'MypageBenefitCoupon' }"
                        >
                            <b>보유 쿠폰</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink :to="{ name: 'MypageBenefitPoint' }">
                            <b>보유 적립금</b>
                        </MMLink>
                    </li>
                </ul>
            </div>
            <!--// 탭메뉴 -->
            <p class="text_quantity">
                사용 가능한 쿠폰<strong>{{ MMFilters.formatNumber(benefitAggregates.couponCount) }}</strong><sub>장</sub>
            </p>
            <div class="mm_btn_box">
                <MMLink
                    class="mm_btn T=sm T=line"
                    :to="{ name: 'MypageGradeBenefit' }"
                >
                    <b>나의 등급 쿠폰 확인하기</b><i class="ico_link T=sm" />
                </MMLink>
            </div>
            <div class="m_my-benefit-coupon">
                <!-- 쿠폰등록 -->
                <a 
                    href="#"
                    class="btn_register mm_btn T=light T=xs"
                    @click.prevent="registCoupon"
                >
                    <i class="ico_plus" /><b>쿠폰 등록하기</b>
                </a>
                <!--// 쿠폰등록 -->

                <!-- 쿠폰 내역 -->
                <div class="m_my-table">
                    <table>
                        <colgroup>
                            <col style="width:468px;">
                            <col style="width:106px;">
                            <col>
                            <col>
                            <col>
                            <col>
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">
                                    <b>쿠폰명</b>
                                </th>
                                <th scope="col">
                                    <b>남은 기간</b>
                                </th>
                                <th scope="col">
                                    <b>사용가능 수량</b>
                                </th>
                                <th scope="col">
                                    <b>발급일자</b>
                                </th>
                                <th scope="col">
                                    <b>취득일자</b>
                                </th>
                                <th scope="col">
                                    <b>사용 여부</b>
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="couponRegists.total > 0">
                            <tr
                                v-for="couponRegist in couponRegists.data"
                                :key="couponRegist.id"
                            >
                                <td>
                                    <div class="m...coupon-name">
                                        <div class="mm_coupon T=xs">
                                            <div class="mm_coupon-inner">
                                                <p
                                                    v-if="couponRegist.coupon.dcType === 'rate'"
                                                    class="text_percent"
                                                >
                                                    <strong>{{ couponRegist.coupon.dcAmount }}</strong><sub>%</sub>
                                                </p>
                                                <p
                                                    v-else
                                                    class="text_price"
                                                >
                                                    <strong>{{ MMFilters.formatNumber(couponRegist.coupon.dcAmount) }}</strong>
                                                </p>
                                                <p class="text_coupon">
                                                    {{ couponRegist.coupon.typeLabel }}
                                                </p>
                                            </div>
                                        </div>
                                        <dl>
                                            <dt>{{ couponRegist.coupon.title }}</dt>
                                            <dd>{{ couponRegist.coupon.applyRangeDescription }}</dd>
                                        </dl>
                                    </div>
                                </td>
                                <td><b>{{ getUntilExpireLabel(couponRegist.expireAt) }}</b></td>
                                <td><b>{{ couponRegist.coupon.isUnlimited ? '무제한 발급' : '1장' }}</b></td>
                                <td><b>{{ MMFilters.formatDate(couponRegist.useStartAt, 'YYYY.MM.DD HH:mm') }}</b></td>
                                <td><b>{{ MMFilters.formatDate(couponRegist.registedAt, 'YYYY.MM.DD HH:mm') }}</b></td>
                                <td>
                                    <b
                                        class="text_status"
                                        :class="couponRegist.isUsable ? 'T=status-use' : ''"
                                    >{{ couponRegist.isUsable ? '사용가능' : '사용 불가' }}</b>
                                    <div class="mm_btn_box">
                                        <a
                                            class="mm_btn T=xs T=line"
                                            href="#"
                                            @click.prevent="openUsablesModal(couponRegist.coupon)"
                                        >
                                            <b>사용 조건</b><i class="ico_link" />
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="6">
                                    <p class="mm_text-none">
                                        <i class="ico_text-none" />보유 쿠폰이 없습니다
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--// 쿠폰 내역 -->               
            </div>
            <!-- 페이지네이션 -->
            <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
            <MMPaginator
                v-if="couponRegists.total > couponRegists.perPage"
                :page-block-type="'group'"
                :page-block-count="10"
                :current-page="couponRegists.currentPage"
                :items-per-page="couponRegists.perPage"
                :total-count="couponRegists.total"
                @move-page-to="fetch"
            />
            <!--// 페이지네이션 -->

            <!-- 유의사항 -->
            <section class="mm_note">
                <h6 class="text_title">
                    <i class="ico_note" /><b>쿠폰 유의사항</b>
                </h6>
                <ul>
                    <li>쿠폰은 회원에 한해 적용되며, 한 품목당 한장의 쿠폰만 사용할 수 있습니다.</li>
                    <li>쿠폰 사용 후 잔액은 환불이 불가하며, 자동 소멸됩니다.</li>
                    <li>쿠폰에 따라 유효기간/최소 사용금액과 같은 사용 조건이 상이합니다.</li>
                    <li>쿠폰에 따라 금액, 브랜드, 상품, 디바이스별로 사용이 제한될 수 있습니다.</li>
                    <li>유효기간이 만료된 쿠폰은 사용할 수 없습니다.</li>
                </ul>
            </section>
            <!--// 유의사항 -->
        </div>
    </div>
</template>
<script setup lang="ts">
import { CouponRegist, RegistedCoupon } from '$/@type/member/coupon';
import { Paginator } from '$/@type';
import { couponRepository } from '$/repository/member/couponRepository';
import { onMounted, ref } from 'vue';
import moment from 'moment';
import MMPaginator from '@/components/Paginator.vue';
import { defaultCatch } from '$/functions';
import { makeValidator } from '$/validator';
import { mmon } from '$/helper/mmon';
import { BenefitAggregates } from '$/@type/member/aggregates';
import { memberAggregateRepository } from '$/repository/member/aggregateRepository';
import { useRoute, useRouter } from 'vue-router';
import { typeCastNumber } from '$/filters';
import { makePath } from '$/services/http';
import { usePageTitleSetting } from '$/composables/seoComposable';
import CouponUsables from '@/components/modal/CouponUsables.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';

const route = useRoute()
const router = useRouter()
usePageTitleSetting('보유 쿠폰', ['혜택 관리', '마이페이지']);        

// 회원 혜택 집계(포인트, 쿠폰) 정보
const benefitAggregates = ref<BenefitAggregates>({
    point: 0,
    couponCount: 0,
});

// 발급받은 쿠폰 내역
const couponRegists = ref<Paginator<CouponRegist>>({
    total: 0,
    currentPage: 0,
    perPage: 20,
    data: []
});

// 쿠폰인증번호
const publishCode = ref<string>('');

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

// 쿠폰 만료까지 남은 일/시/분 계산
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

// 쿠폰 발급 내역 조회
async function fetch(page: number) {
    try {
        mmon.loading.show();
        router.replace(makePath(route.path, {
            page
        }))
        couponRegists.value = await couponRepository.getCoupons(page);
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

// 사용가능 리스트 모달 open
function openUsablesModal(coupon: RegistedCoupon) {            
    useModal().open(CouponUsables, {
        title: '사용 조건',
        name: 'CouponUsables',
        itemClass: 'm_modal-my-coupon',
        props: async() => {
            return {
                couponPaginator : coupon.applyRangeType  === 'goods' 
                    ? await couponRepository.getCouponUsableGoods(coupon.id, 1)
                    : await couponRepository.getCouponUsableBrands(coupon.id, 1),
                coupon
            }                   
        }
    })
}

// 쿠폰 등록
async function registCoupon() {
    mmon.bom.prompt('쿠폰 인증 번호를 입력해주세요\n(8자리~최대12자리)', 
        async (flag: boolean, formData: { publishCode: string }) => {
            if (!flag) {
                return
            }
            
            const validator = makeValidator(formData)
                .setRules({
                    'publishCode(쿠폰 인증 번호)': ['required', 'betweenLength:8,12']
                })
                .setMessages({
                    'publishCode.required': ':param(을/를) 입력해주세요.'
                });

            try {
                mmon.loading.show();
                await validator.run();
                await couponRepository.registCoupon(formData.publishCode);
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
            title: '쿠폰등록',
            forms: [
                {
                    type : 'text',
                    name: 'publishCode',
                    value: '',
                    placeholder: '쿠폰번호를 입력하세요',
                    maxLength: 12
                }
            ]
        }
    )
}

onMounted(async () => {
    Promise.all([
        fetch(typeCastNumber(route.query.page, 1)),
        fetchBenefitAggregate()
    ])
});
</script>
