<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>래플</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-raffle-entry">
                            <h6 class="mm_text-label">
                                <b>아이디</b>
                            </h6>
                            <div class="mm_form-text">
                                <label>
                                    <span class="textfield text_readonly" v-text="userInfo?.loginId" />
                                    <i class="bg_text" />
                                </label>
                            </div>
                            <h6 class="mm_text-label">
                                <b>이름</b>
                            </h6>
                            <div class="mm_form-text">
                                <label>
                                    <span class="textfield text_readonly" v-text="userInfo?.name" />
                                    <i class="bg_text" />
                                </label>
                            </div>
                            <h6 class="mm_text-label">
                                <b>휴대폰 번호</b>
                            </h6>
                            <div class="mm_form-text">
                                <label>
                                    <span class="textfield text_readonly" v-text="userInfo?.phone" />
                                    <i class="bg_text" />
                                </label>
                            </div>
                            <a 
                                class="mm_btn T=line T=dark"
                                href="#"
                                target="_blank"
                                title="새 창 열림"
                                @click.prevent="changePhoneNumber"
                            ><b>휴대폰 번호 변경</b></a>
                            <!-- 유의사항 -->
                            <div class="mm_note">
                                <ul>
                                    <li>휴대폰 번호 변경 시, 회원정보도 변경 됩니다.</li>
                                    <li>래플은 회원 아이디 기준으로 이벤트 당 1회 응모 가능합니다.</li>
                                    <li>래플은 선착순이 아닌 랜덤 추첨으로 진행됩니다.</li>
                                    <li><strong>마이페이지 &#62; 래플 응모 내역</strong>에서 당첨 여부 확인할 수 있습니다.</li>
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
                                    :value="true"
                                    data-check
                                >
                                <b class="mm_block">
                                    <i class="ico_form-check" />
                                    <span class="text_label">안내사항을 확인하였으며 이에 동의합니다.</span>
                                </b>
                            </label>
                            <!-- 하단버튼 -->
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=primary" @click="entry">
                                        <b>응모하기</b>
                                    </button>
                                </div>
                            </div>
                            <!--// 하단버튼 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { UserInfoForEntry } from '$/@type/raffle';
import { raffleRepository } from '$/repository/raffleRepository';
import { useRaffleModal } from '$/composables/raffleComposable';
import { historyBack } from '$/functions';
import { useIdentityVerification } from '$/composables/auth/certificateComposable';
import { useRefreshUser } from '$/composables/auth/userComposable';
import { certificateRepository } from '$/repository/auth/certificateRepository';
import ModalPopup from '@/components/layout/ModalPopup.vue'
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const { router } = usePageContext();
const { raffleId, setIsRaffleEntry } = useRaffleModal();
const userInfo = ref<UserInfoForEntry>({
    name: '',
    loginId: '',
    phone: '',
});
const isAgreed = ref<boolean>(false);


/** FUNCTION */
/**
 * 번호 변경
 * - 본인인증후 프로필 갱신
 */
async function changePhoneNumber() {
    try {
        const { identityProfile } = await useIdentityVerification();
        await certificateRepository.certificateConfirmUser(identityProfile.token)
        await useRefreshUser()
        userInfo.value.phone = identityProfile.phoneNumber
        userInfo.value.name = identityProfile.name
        mmon.bom.alert('휴대폰 번호가 변경되었습니다.')
    } catch (e) {
        defaultCatch(e);
    }
}

/**
 * 래플 응모 요청
 */
async function entry() {
    if (raffleId.value === null) {
        return;
    }
    if (!isAgreed.value) {
        return mmon.bom.alert('동의에 체크 하셔야 응모할 수 있습니다.');
    }

    try {
        await raffleRepository.entry(raffleId.value)
        await raffleRepository.getRaffleList(); // 캐싱된 래플조회결과 refresh

        mmon.bom.confirm(
            '래플 응모가 완료되었습니다.\n응모 내역을 확인하시겠습니까?',
            (flag: boolean) => {
                if (!flag) { 
                    // 응모 모달창 닫음
                    setIsRaffleEntry(true);
                    return router.go(-1);
                }
                router.go(-1);
            }
        );

    } catch (error) {
        defaultCatch(error);
    }
}
/** // FUNCTION */

/** VUE LIFE CYCLE */
onMounted(async() => {
    if (raffleId.value == null) {
        return historyBack(router);
    }

    try {
        // 유저의 개인 정보 및 응모 가능 여부 조회
        userInfo.value = await raffleRepository.userInfoForEntry(raffleId.value);
    } catch (error) {
        defaultCatch(error, undefined, () => {
            historyBack(router);
        });
    }
})
/** // VUE LIFE CYCLE */
</script>

