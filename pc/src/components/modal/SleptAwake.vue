<template>
    <div v-if="user" class="mm_scroller">
        <h3><b>{{ user.name }}님의 계정</b><br> <b class="mm_text-variable">휴면이 해제되었습니다</b></h3>
        <div v-if="couponInfo !== null" class="m...quiescent-notice">
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
                        중복할인 쿠폰
                    </p>
                </div>
            </div>
            <p>회원님의 개인 정보는 ‘개인정보보호법’에 따라<br> 안전하게 분리/보관되고 있었습니다</p>
            <strong>다시 찾아주신 고객님께<br> <b>감사선물을 드립니다</b></strong>
        </div>
        <div v-else class="m...quiescent-notice">
            <p>회원님의 개인 정보는 ‘개인정보보호법’에 따라 안전하게 분리/보관되고 있었습니다</p>
            <strong>다시 찾아주신 고객님, <b>환영합니다!</b></strong>
        </div>
        <!-- 하단버튼 -->
        <div class="mm_foot">
            <div class="mm_btn_box">
                <MMLink 
                    class="mm_btn T=dark btn_link" 
                    :to="{ name: 'MypageBenefit', params: { tabType: 'coupon' } }"
                >
                    <b>받은선물 확인하기</b><i class="ico_link" />
                </MMLink>
            </div>
        </div>
        <!--// 하단버튼 -->
    </div>
</template>

<script setup lang='ts'>
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { RegistedCoupon } from "$/@type/member/coupon";

/** PROPS **/
defineProps<{
    couponInfo?: RegistedCoupon|null,
}>();

const { user } = usePageContext();

</script>