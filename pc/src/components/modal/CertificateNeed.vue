<template>
    <div class="m_modal-certify">
        <p class="text_certify">
            서비스 이용을 위해<br> <strong class="mm_text-variable">본인인증</strong>이 필요합니다
        </p>
        <div class="mm_foot">
            <div class="mm_btn_box">
                <a 
                    class="mm_btn T=primary" 
                    href="#" 
                    title="새 창 열림"
                    @click.prevent="identityVerificationOpen"
                >
                    <b>휴대폰 인증하기</b>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useIdentityVerification } from '$/composables/auth/certificateComposable';
import { certificateRepository } from '$/repository/auth/certificateRepository';
import { useRefreshUser } from '$/composables/auth/userComposable';
import { ModalCloseHandler } from '$/@type/Modal';
import { defaultCatch } from '$/functions';
/** VARIABLE */
const props = defineProps<{
    closer: ModalCloseHandler<void>
}>();

/** FUNCTION */
async function identityVerificationOpen() {
    try {
        const { identityProfile } = await useIdentityVerification('width=643px, height=593px, resizble=no, scrollbars=yes', false);

        // 인증 처리 
        await certificateRepository.certificateConfirmUser(identityProfile.token);
        await useRefreshUser();
        props.closer();
        
    } catch (e) {
        return defaultCatch(e);
    }
}

/** VUE LIFE CYCLE */

</script>