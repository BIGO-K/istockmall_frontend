<template>
    <div ref="container" class="mm_page-content">
        <canvas ref="canvasDom" :width="width" :height="height" style="position: absolute; top: 0px; left: 0px;" />
        <div class="m_popup-join">
            <h3 class="m_popup-join-title">
                <b>STEP 4</b><strong>가입완료</strong><i class="image_line T=step4" />
            </h3>
            <p class="text_complete">
                <strong>회원가입 완료!</strong><span>로그인 후</span>다양한 상품과<br> 혜택을 만나보세요
            </p>
            <div class="mm_btn_box">
                <MMLink class="mm_btn T=lg T=primary" :to="{ name: 'Login', replace: true }">
                    <b>로그인</b>
                </MMLink>
                <MMLink class="mm_btn T=lg T=line T=primary" :to="{ name: 'Main', replace: true }">
                    <b>메인으로 가기</b>
                </MMLink>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRegistCompleteEvent } from '$/composables/auth/userComposable';
import { useMemberRegisted } from '$/composables/marketingComposable'
import { onMounted, ref } from 'vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import JoinCompleteCoupon from '@/components/modal/JoinCompleteCoupon.vue';
import JoinCompletePoint from '@/components/modal/JoinCompletePoint.vue';
import { useRegistCompleteEventCoupon } from '$/composables/auth/registComposable';

const container = ref<HTMLElement>();
const canvasDom = ref<HTMLCanvasElement>();
const width = ref(0);
const height = ref(0);

const { registEventsInfo, couponEvent, pointEvent, registCompleteId } = useRegistCompleteEventCoupon()

// 회원가입 완료 쿠폰 or 적립금이 있는 경우 
if (registEventsInfo.value.length > 0) {
    if (couponEvent.value !== undefined) {
        useModal().open(JoinCompleteCoupon, {
            name: 'JoinCompleteCoupon',
            itemClass: 'm_modal-join-benefit',
            props: {
                couponEvent: couponEvent.value
            }
        });
    }

    if (pointEvent.value !== undefined) {
        useModal().open(JoinCompletePoint, {
            name: 'JoinCompletePoint',
            itemClass: 'm_modal-join-benefit',
            props: {
                pointEvent: pointEvent.value
            }
        });
    }
}

onMounted(async() => {
    width.value = container.value?.offsetWidth || 0;
    height.value = container.value?.offsetHeight || 0;
    if (canvasDom.value !== undefined) {
        const { drawFlake } = useRegistCompleteEvent(canvasDom.value, width.value, height.value)
        drawFlake();
    }

    useMemberRegisted({
        loginId: registCompleteId.value || '',    
        account: 'base',
        isMobile: true,
        isTablet: false,
        isDesktop: false,
    })
})
</script>
