<template v-if="pointEvent !== undefined">
    <div class="mm_modal...content">
        <div class="mm_scroller">
            <div class="m_modal-join-benefit">
                <h3><b>회원가입 완료<br> 적립금이 지급되었습니다!</b></h3>
                <div class="m...benefit-content">
                    <p>{{ shopInfoName }}이 드리는 적립금으로 즐거운 쇼핑하세요</p>
                    <dl class="m...benefit-content-point">
                        <dt>적립금</dt>
                        <dd><strong>{{ MMFilters.formatNumber(pointEvent?.point) }}</strong></dd>
                    </dl>
                </div>
                <div class="mm_foot">
                    <div class="mm_btn_box">
                        <MMLink
                            class="mm_btn T=primary btn_link"
                            :to="{ name: 'MypageBenefitPoint'}"
                        >
                            <b>적립금 확인하기</b><i class="ico_link" />
                        </MMLink>
                    </div>
                </div>
            </div>
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
    pointEvent: RegistEvent
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
    if (props.pointEvent !== undefined) {
        removeEventCoupon()
    }
})

</script>
