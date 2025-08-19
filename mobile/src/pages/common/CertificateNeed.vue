<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>본인인증</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-certify">
                            <h2 class="mm_title">
                                <b>서비스 이용을 위해<br> <strong class="mm_text-variable">본인인증</strong>이 필요합니다</b>
                            </h2>
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <a class="mm_btn T=lg T=primary" href="#" target="_blank" title="새 창 열림" @click.prevent="identityVerificationOpen"><b>휴대폰 인증</b></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import MMPopup from '@/components/layout/Popup.vue';
import { useIdentityVerification } from '$/composables/auth/certificateComposable';
import { mmon } from '$/helper/mmon';
import { certificateRepository } from '$/repository/auth/certificateRepository';
import { defaultCatch } from '$/functions';
import { orderRepository } from '$/repository/order/orderRepository';
import { useRouter } from 'vue-router';
import { useRefreshUser } from '$/composables/auth/userComposable';
import { useTempOrder } from '$/composables/orderComposable';

const router = useRouter();
const { tempOrderOptions } = useTempOrder();

/**
 * 본인인증
 */
async function identityVerificationOpen() {
    try {
        const { identityProfile } = await useIdentityVerification();
        // 인증 처리 
        await certificateRepository.certificateConfirmUser(identityProfile.token);
        await useRefreshUser();
        await userOrderStart();
                
    } catch (e) {
        return defaultCatch(e);
    }
}

/**
 * 주문시작
 */
async function userOrderStart() {
    mmon.loading.show(); 
    try {
        if (tempOrderOptions.value.length < 1) {
            return router.back();
        }

        const tempOrderId = await orderRepository.tempOrderMake(tempOrderOptions.value);
        router.replace({
            name: 'OrderIndex',
            params : { 
                id: tempOrderId
            }
        })
    } catch(error) {
        defaultCatch(error)
    } finally {
        mmon.loading.hide();
    }
}
</script>


