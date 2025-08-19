<template>
    <div
        ref="container"
        class="mm_page-content"
    >
        <canvas
            ref="canvasDom"
            :width="width"
            :height="height"
            style="position: absolute; top: 0px; left: 0px;"
        />
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="m_join">
            <div class="m_join-head">
                <h3 class="mm_title">
                    <b>회원가입</b>
                </h3>
                <!-- 회원가입 스텝 -->
                <div class="m_join-head-step">
                    <!-- (D) 현재 페이지에 해당되는 li 요소에 'T=step-on' 클래스와 '현재 진행 중인 단계' 타이틀을 추가합니다 -->
                    <ol class="mm_flex T=equal">
                        <li><span><small>STEP</small>1</span><strong>본인인증</strong></li>
                        <li><span><small>STEP</small>2</span><strong>회원정보 및 약관동의</strong></li>
                        <li
                            class="T=step-on"
                            title="현재 진행 중인 단계"
                        >
                            <span><small>STEP</small>3</span><strong>가입완료</strong>
                        </li>
                    </ol>
                </div>
                <!--// 회원가입 스텝 -->
            </div>
            <p class="text_complete">
                <strong>가입완료!</strong><span>로그인 후</span> 다양한 상품과 혜택을 만나보세요
            </p>
            <!-- 하단버튼 -->
            <div class="mm_foot">
                <div class="mm_btn_box T=equal">
                    <MMLink
                        class="mm_btn T=line T=primary"
                        :to="{ name: 'Main'}"
                    >
                        <b>메인으로 가기</b>
                    </MMLink>
                    <MMLink
                        class="mm_btn T=primary"
                        :to="{ name: 'Login'}"
                    >
                        <b>로그인</b>
                    </MMLink>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useRegistCompleteEvent } from '$/composables/auth/userComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useMemberRegisted } from '$/composables/marketingComposable'
import { useModal } from '$/composables/pageHandler/modalComposable';
import JoinCompleteCoupon from '@/components/modal/JoinCompleteCoupon.vue'
import JoinCompletePoint from '@/components/modal/JoinCompletePoint.vue'
import { useRegistCompleteEventCoupon } from '$/composables/auth/registComposable';

usePageTitleSetting('가입완료', ['회원가입']);

/** VARIABLE */
const container = ref<HTMLElement>();
const canvasDom = ref<HTMLCanvasElement>();
const width = ref(0);
const height = ref(0);

const { registEventsInfo, couponEvent, pointEvent, registCompleteId } = useRegistCompleteEventCoupon()

// 회원가입 완료 쿠폰 or 적립금이 있는 경우 
if (registEventsInfo.value.length > 0) {
    if (couponEvent.value !== undefined) {
        useModal().open(JoinCompleteCoupon, {
            title: '회원가입 완료 쿠폰',
            name: 'joinCompleteCoupon',
            props: {
                couponEvent: couponEvent.value
            }
        })
    }

    if (pointEvent.value !== undefined) {
        useModal().open(JoinCompletePoint, {
            title: '회원가입 완료 적립금',
            name: 'joinCompletePoint',
            props: {
                pointEvent: pointEvent.value
            }
        })
    }
}
    
/** VUE LIFE CYCLE */
onMounted(async() => {
    width.value = container.value?.offsetWidth || 0;
    height.value = container.value?.offsetHeight || 0;
    if (canvasDom.value !== undefined) {
        const { drawFlake } = useRegistCompleteEvent(canvasDom.value, width.value, height.value)
        drawFlake();
    }

    // 마케팅
    
    useMemberRegisted({
        loginId: registCompleteId.value || '',        
        account: 'base',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
    })
})

</script>

