<template v-if="couponEvent !==  undefined">     
    <h3><b>회원가입 완료<br> 쿠폰이 지급되었습니다!</b></h3>
    <div class="m...benefit-content">
        <p>{{ shopInfoName }}이 드리는 쿠폰으로<br> 즐거운 쇼핑하세요</p>
        <dl class="m...benefit-content-coupon">
            <dt>쿠폰</dt>
            <dd>
                <strong v-if="couponEvent?.amount_type === 'rate'">{{ couponEvent.amount }}%</strong>
                <strong v-else-if="couponEvent?.amount_type === 'krw'">{{ MMFilters.formatNumber(couponEvent.amount) }}</strong>
            </dd>
        </dl>
    </div>
    <div class="mm_foot">
        <div class="mm_btn_box">
            <MMLink :to="{ name: 'MypageBenefit', params: { tabType: 'coupon'}}" class="mm_btn T=primary btn_link">
                <b>쿠폰 확인하기</b><i class="ico_link" />
            </MMLink>
        </div>
    </div> 
</template>
<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { useRegistCompleteEventCoupon } from '$/composables/auth/registComposable';
import { RegistEvent } from '$/@type/auth/user';
import { ModalCloseHandler } from '$/@type/Modal';
/**
* VARIABLE
*/
const props = defineProps<{
    couponEvent: RegistEvent
    closer: ModalCloseHandler<void>
}>();

const {
    removeEventCoupon,
} = useRegistCompleteEventCoupon()

const { globalConfigs } = useGlobalConfigs();
const shopInfoName = globalConfigs.value.shop.name

/**
* VUE LIFE CYCLE
*/
onBeforeUnmount(() => {
    if (props.couponEvent !== undefined) {
        removeEventCoupon()
    }
})
</script>