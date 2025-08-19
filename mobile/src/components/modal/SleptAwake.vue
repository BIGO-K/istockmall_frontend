<template>
    <div v-if="couponInfo !== undefined" class="m_modal-login-quiescent">
        <h3><b>{{ userName }}님!<br> <strong class="mm_text-variable">계정휴면이 해제되었습니다</strong></b></h3>
        <p>회원님의 개인 정보는 ‘개인정보보호법’에 따라<br> 안전하게 분리, 보관되고 있었습니다</p>
        <div class="m...quiescent-coupon">
            <p>
                다시 찾아와주신 고객님께 드리는 감사선물<br> 
                <span v-if="couponInfo.dcType === 'rate'">{{ couponInfo.dcAmount }}% 중복할인 쿠폰</span>
                <span v-else>{{ MMFilters.formatNumber(couponInfo.dcAmount) }}원 중복할인 쿠폰</span>
            </p>
            <div class="mm_coupon T=lg">
                <div class="mm_coupon-inner">
                    <p 
                        v-if="couponInfo.dcType === 'rate'"
                        class="text_percent"
                    >
                        <strong>{{ couponInfo.dcAmount }}</strong><sub>%</sub>
                    </p>
                    <p 
                        v-else
                        class="text_price"
                    >
                        <strong>{{ MMFilters.formatNumber(couponInfo.dcAmount) }}</strong>
                    </p>
                    <p class="text_coupon">
                        중복 할인쿠폰
                    </p>
                </div>
            </div>
        </div>
        <div class="mm_btn_box">
            <div class="mm_inline">
                <button type="button" class="mm_btn T=primary" @click="$router.push({ name : 'MypageBenefit', params: { tabType: 'coupon' }})">
                    <b>받은선물 확인하기</b><i class="ico_link" />
                </button>
            </div>
        </div>
    </div>
    <div v-else class="m_modal-login-quiescent">
        <h3><b>{{ userName }}님의 계정<br> <strong class="mm_text-variable">휴면이 해제되었습니다</strong></b></h3>
        <p>회원님의 개인 정보는 ‘개인정보보호법’에 따라<br> 안전하게 분리, 보관되고 있었습니다</p>
        <div class="mm_btn_box">
            <div class="mm_inline">
                <button type="button" class="mm_btn T=line T=dark btn_link" @click="$router.push({ name : 'Main'})">
                    <b>쇼핑하러가기</b><i class="ico_link" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { couponRepository } from '$/repository/member/couponRepository';
import { RegistedCoupon } from '$/@type/member/coupon';
import { defaultCatch } from '$/functions';
import { useUserState } from '$/composables/auth/userComposable';
import { ModalCloseHandler } from '$/@type/Modal';

const props = withDefaults(defineProps<{
    couponId: number|null
    closer: ModalCloseHandler<void>
}>(), {
    couponId: null,
});

// 회원 관련
const { user } = useUserState();
const couponInfo = ref<RegistedCoupon>();
const userName = computed<string>(() => user.value?.name || '');

onMounted(async() => {
    try {
        if (props.couponId) {
            couponInfo.value = await couponRepository.getCoupon(props.couponId); // 쿠폰 발급되었으면 쿠폰 정보 노출
        }
    } catch (error) {
        defaultCatch(error);
    }
});
</script>
