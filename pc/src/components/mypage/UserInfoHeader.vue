<template>
    <!-- 회원정보 -->
    <!--
    (D) 'm_my-member' 영역에 회원 등급에 맞는 'T=등급' 클래스를 추가합니다.
    등급 : level5, level4, level3, level2, level1
-->
    <section :class="`m_my-member T=level${user?.grade?.id || 1}`">
        <h4 class="m_my-member-title">
            <i
                v-lazyload="user?.grade?.imageUrl"
                class="mm_bg-contain image_grade"
            />
            <b>{{ user?.name }}님은 <strong>{{ user?.grade?.name }}</strong>입니다</b>
        </h4>
        <MMLink
            class="mm_btn T=xs T=line T=dark btn_detail"
            :to="{ name: 'MypageGradeBenefit' }"
        >
            <b>혜택 자세히 보기</b><i class="ico_link T=sm" />
        </MMLink>
        <div class="mm_rside">
            <div class="m_my-member-info">
                <MMLink :to="{ name: 'MypageBenefitCoupon' }">
                    <dl class="mm_flex">
                        <dt>보유 쿠폰<i class="ico_link T=xs" /></dt>
                        <dd class="mm_flex-equal">
                            <strong>{{ MMFilters.formatNumber(benefitAggregates.couponCount) }}</strong>
                            <sub>장</sub>
                        </dd>
                    </dl>
                </MMLink>
                <MMLink :to="{ name: 'MypageBenefitPoint' }">
                    <dl class="mm_flex">
                        <dt>보유 적립금<i class="ico_link T=xs" /></dt>
                        <dd class="mm_flex-equal">
                            <strong>{{ MMFilters.formatNumber(benefitAggregates.point) }}</strong>
                            <sub>원</sub>
                        </dd>
                    </dl>
                </MMLink>
            </div>
            <a
                v-if="isUseMySize"
                class="btn_size"
                href="#"
                @click.prevent="openMySizeModal"
            >
                <i class="ico_size" />
                <b>My 사이즈</b>
            </a>
            <MMLink
                class="btn_setup"
                :to="{ name: 'MypageMemberInfoEdit' }"
            >
                <i class="ico_setup" /><b>정보관리</b>
            </MMLink>
        </div>
        <!-- 등급 조건 -->
        <keep-alive>
            <GradeUpCondition v-if="router.currentRoute.value.name == 'MypageGradeBenefit'" />
        </keep-alive> 
        <!--// 등급 조건 -->
    </section>
<!--// 회원정보 -->
</template>
<script setup lang='ts'>
import { ref, watchEffect, computed, watch } from 'vue';
import { BenefitAggregates } from '$/@type/member/aggregates';
import { memberAggregateRepository } from '$/repository/member/aggregateRepository';
import GradeUpCondition from '@/components/mypage/GradeupConditionHeader.vue';
import MySize from '@/components/modal/MySize.vue';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { usePersonalization } from '$/composables/goods/reviewComposable';

const {
    router,
    user,
    globalConfigs,
    route
} = usePageContext();

const needUpdate = computed(() => {
    return route.name === 'MypageOrderCancelComplete'
})

// 취소 완료후 포인트 복구 처리로 인하여, 혜택정보 재조회 
watch(needUpdate, async(to) => {
    if (to) {
        try {
            benefitAggregates.value = await memberAggregateRepository.getBenefitInfo();
        } catch (e) {
            console.log(e);
        } 
    }
})

const isUseMySize = computed(() => globalConfigs.value.paidFeatures.personalization);
// 회원 혜택 집계(포인트, 쿠폰) 정보
const benefitAggregates = ref<BenefitAggregates>({
    point: 0,
    couponCount: 0,
});

function openMySizeModal() {
    useModal().open(MySize, {
        name: 'MySize',
        title: 'My 사이즈',
        itemClass: 'm_modal-mysize',
        props: async() => {
            const { 
                getShoesSizes,
                getShoesCategories, 
                getFits, 
                getMySize 
            }= usePersonalization();

            const [shoes, shoesCategories, fits, mySize] = await Promise.all([
                getShoesSizes(),
                getShoesCategories(), 
                getFits(), 
                getMySize()
            ])

            return {
                shoesSizes: shoes,
                shoesCategories: shoesCategories,
                fitList: fits,
                mySizeInfo: mySize
            }
        }
    })
}

const befitAggregate = watchEffect(async() => {
    try {
        benefitAggregates.value = await memberAggregateRepository.getBenefitInfo();
    } catch (e) {
        console.log(e);
    } 
})


befitAggregate();
</script>