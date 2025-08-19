import { handlePopupOpenWithUrlCallback } from "$/functions";
import { certificateRepository } from "$/repository/auth/certificateRepository";
import { IdentityProfile } from '$/@type/auth/user';
import { computed, ref } from "vue";
import { useDateFormat, useToNumber } from "@vueuse/core";
import { useAuthStore } from "$/store/auth";
/**
 * 본인인증 팝업 호출 처리 & 결과 조회 처리 
 * @returns { identityProfile , identityBirthYear }
 */
export async function useIdentityVerification(popupFeature?: string, needFlushProfile = true) {
    const authStore = useAuthStore();

    const identityProfile = ref<IdentityProfile>(null);
    const identityToken = ref('');
    const now = new Date().getFullYear();    
    try {
        await handlePopupOpenWithUrlCallback(        
            'identity-verification',
            async () => {
                const { token, enterUrl } =  await certificateRepository.getTokenWithEnterUrl(); 
                identityToken.value = token;
                return enterUrl;
            },
            popupFeature,
            false
        );
        identityProfile.value = await certificateRepository.getIdentityProfile(identityToken.value);

        if ((now - useToNumber(useDateFormat(identityProfile.value.birthDay, 'YYYY').value).value) < 14) {
            throw({
                message: '만14세 미만은 사용이 불가합니다.'
            });
        }

        if (needFlushProfile) {
            authStore.applyIdentityProfile(identityProfile.value);
        }       
        
        return {
            identityProfile : identityProfile.value,                
        }
    } catch(e) {
        authStore.clearIdentityProfile();
        throw({
            message: '본인 인증에 실패하였습니다.\n 다시 시도해 주세요.'
        });
    }
}
