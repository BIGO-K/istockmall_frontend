<template>
    <div class="mm_page-content">
        <div class="m_sign-adult">
            <div class="m_sign-title">
                <h3 class="mm_title">
                    <b>성인인증</b>
                </h3>
                <strong class="text_adult"><i class="ico_adult T=sm" /><b>성인 본인인증이 필요합니다</b></strong>
            </div>
            <div class="m_sign-adult-law">
                <p>
                    본 상품은 청소년 유해매체물로서 [정보통신망 이용촉진 및 정보보호 등에 관한 법률] 및 [청소년보호법]에 따라 만 19세 미만의 청소년이
                    이용할 수 없습니다.
                </p>
                <p>
                    개정된 청소년 관련 법령 및 여성가족부 정책에 따라 <strong>1년에 한 번 성인인증</strong> 하도록 변경되었습니다. 오늘 성인인증
                    하시면 1년간 별도의 인증 없이 서비스를 이용하실 수 있습니다.
                </p>
            </div>

            <!-- 하단버튼 -->
            <div class="mm_foot">
                <div class="mm_btn_box T=equal">
                    <a class="mm_btn T=line" href="#" @click.prevent="$router.go(-1)"><b>다음에 인증하기</b></a>
                    <a class="mm_btn T=primary" href="#" @click.prevent="certificate"><b>휴대폰 본인인증</b></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { certificateRepository } from '$/repository/auth/certificateRepository'
import { withPopup } from '$/functions'
import { useRouter, useRoute } from 'vue-router'
import { mmon } from '$/helper/mmon'
import { useRefreshUser } from '$/composables/auth/userComposable';
import { useIdentityVerification } from '$/composables/auth/certificateComposable';


/** VARIABLE */
const router = useRouter()
const route = useRoute()

/** FUNCTION */
/**
 * 본인인증 처리
*/
async function certificate() {
    try {
        const { identityProfile } = await useIdentityVerification('width=643px, height=593px, resizble=no, scrollbars=yes');
        // 인증처리
        await certificateRepository.adultCertificate(identityProfile.token);
        await useRefreshUser();
        router.replace(`${route.query.redirect_to_after || '/'}`)
    } catch (error) {
        return mmon.bom.alert('본인 인증에 실패 하였습니다.')
    }
}

/** VUE LIFE CYCLE */

</script>
