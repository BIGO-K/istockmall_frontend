<template>
    <h6 class="mm_text-label">
        <b>아이디</b>
    </h6>
    <div class="mm_form-text">
        <label>
            <span class="textfield text_readonly">{{ userInfo.loginId }}</span>
            <i class="bg_text" />
        </label>
    </div>
    <h6 class="mm_text-label">
        <b>이름</b>
    </h6>
    <div class="mm_form-text">
        <label>
            <span class="textfield text_readonly">{{ userInfo.name }}</span>
            <i class="bg_text" />
        </label>
    </div>
    <h6 class="mm_text-label">
        <b>휴대폰 번호</b>
    </h6>
    <div class="mm_form_mix-linked">
        <div class="mm_form-text">
            <label>
                <span class="textfield text_readonly">{{ userInfo.phone }}</span>
                <i class="bg_text" />
            </label>
        </div>
        <a
            class="mm_btn T=line T=dark"
            href="javascript:;"
            target="_blank"
            title="새 창 열림"
            @click.prevent="changePhoneNumber"
        ><b>휴대폰 번호 변경</b></a>
    </div>
    <!-- 유의사항 -->
    <div class="mm_note">
        <ul>
            <li>휴대폰 번호 변경 시, 회원정보도 변경 됩니다.</li>
            <li>래플은 회원 아이디 기준으로 이벤트 당 1회 응모 가능합니다.</li>
            <li>래플은 선착순이 아닌 랜덤 추첨으로 진행됩니다.</li>
            <li><strong>마이페이지 &gt; 래플 응모 내역</strong>에서 당첨 여부 확인할 수 있습니다.</li>
            <li>회원정보 기준으로 당첨자 본인만 구매 가능합니다.</li>
            <li>당첨자에 한하여 구매기간 이내 구매 가능하며 미구매 시 당첨이 취소됩니다.</li>
            <li>래플 상품은 취소, 반품, 교환이 불가능합니다.</li>
        </ul>
    </div>
    <!--// 유의사항 -->
    <label class="mm_form-check">
        <input
            v-model="isAgreed"
            type="checkbox"
            data-check=""
            :value="true"
        >
        <b class="mm_block">
            <i class="ico_form-check" />
            <span class="text_label">안내사항을 확인하였으며 이에 동의합니다.</span>
        </b>
    </label>
    <!-- 하단버튼 -->
    <div class="mm_foot">
        <div class="mm_btn_box">
            <button
                type="button"
                class="mm_btn T=primary"
                @click="entry"
            >
                <b>응모하기</b>
            </button>
        </div>
    </div>
    <!--// 하단버튼 -->
</template>


<script setup lang='ts'>
import { ref, toRefs } from 'vue';
import { mmon } from '$/helper/mmon';
import { certificateRepository } from '$/repository/auth/certificateRepository';
import { defaultCatch, withPopup } from '$/functions';
import { useRouter } from 'vue-router';
import { raffleRepository } from '$/repository/raffleRepository';
import { UserInfoForEntry } from '$/@type/raffle';
import { useRefreshUser } from '$/composables/auth/userComposable';
import { ModalCloseHandler } from '$/@type/Modal';

const props = defineProps<{
    raffleId: number,
    userInfo: UserInfoForEntry,
    closer: ModalCloseHandler<void|boolean>
}>();
/** VARIABLE */
const router = useRouter();
const { userInfo } = toRefs(props);
const isAgreed = ref<boolean>(false);

/** FUNCTION */
/**
 * 번호 변경
 * - 본인인증후 프로필 갱신
 */
async function changePhoneNumber() {
    if (userInfo.value === null) {
        return 
    }
            
    try {
        mmon.loading.show()
        const { token, enterUrl } = await certificateRepository.getTokenWithEnterUrl();
        await withPopup(
            enterUrl,
            'identity-verification',
            'width=643px, height=593px, resizble=no, scrollbars=yes'
        );

        const identityProfile = await certificateRepository.getIdentityProfile(token);
        await certificateRepository.certificateConfirmUser(identityProfile.token);
        await useRefreshUser();
        userInfo.value.phone = identityProfile.phoneNumber;
        userInfo.value.name = identityProfile.name
    } catch (e) {
        mmon.bom.alert('본인 인증이 완료 되지 않았습니다.');
    } finally {
        mmon.loading.hide();
    }

}

/**
 * 래플 응모 요청
**/
async function entry() {
    if (!isAgreed.value) {
        return mmon.bom.alert('동의에 체크 하셔야 응모할 수 있습니다.');
    }
    try {
        await raffleRepository.entry(props.raffleId);
        mmon.bom.confirm(
            '래플 응모가 완료되었습니다.\n응모 내역을 확인하시겠습니까?',
            (flag: boolean) => {
                props.closer(true);
                if (flag) {
                    return router.push({
                        name: 'MypageRaffleEntry',
                    })
                }
            }
        );
    } catch (error) {
        defaultCatch(error);
    }
}
/** VUE LIFE CYCLE */

</script>
