<template>
    <!-- 아이디/비밀번호 찾기 방식 -->
    <div class="mm_radio-list">
        <ul>
            <li>
                <MMRadio v-model="idFindForm.findType" name="find_type" value="email" @change="resetForm">
                    <b class="mm_block">
                        <i class="ico_email" />
                        <span class="text_label">이메일로 찾기</span>
                    </b>
                </MMRadio>
            </li>
            <li>
                <MMRadio v-model="idFindForm.findType" name="find_type" value="phone" @change="resetForm">
                    <b class="mm_block">
                        <i class="ico_email" />
                        <span class="text_label">휴대폰 번호로 찾기</span>
                    </b>
                </MMRadio>
            </li>
        </ul>
    </div>
    <!--// 아이디/비밀번호 찾기 방식 -->

    <!-- 이메일로 찾기 -->
    <div class="mm_syncer-sign-email" :class="{ 'S=radio-use' : idFindForm.findType === 'email' }">
        <h5 class="mm_text-label">
            <b>이름</b>
        </h5>
        <MMInput 
            v-model="idFindForm.name"
            :place-holder-text="'이름을 입력하세요'"
            :use-trim="false"
            max-length="50"
        />
        <h5 class="mm_text-label">
            <b>이메일</b>
        </h5>
        <MMInput 
            v-model="idFindForm.email"
            :place-holder-text="'이메일을 입력하세요'"
            max-length="50"
        />
    </div>
    <!--// 이메일로 찾기 -->

    <!-- 휴대폰 번호로 찾기 -->
    <div class="mm_syncer-sign-phone" :class="{ 'S=radio-use' : idFindForm.findType === 'phone' }">
        <h5 class="mm_text-label">
            <b>이름</b>
        </h5>
        <MMInput 
            v-model="idFindForm.name"
            :place-holder-text="'이름을 입력하세요'"
            :use-trim="false"
            max-length="50"
        />
        <h5 class="mm_text-label">
            <b>휴대폰 번호</b>
        </h5>
        <MMInput 
            v-model="idFindForm.phoneNumber"
            :place-holder-text="'휴대폰 번호를 입력하세요'"
            data-type="number"
            max-length="12"
        />
    </div>
    <!--// 휴대폰 번호로 찾기 -->

    <!-- 하단버튼 -->
    <div class="mm_foot">
        <div class="mm_btn_box">
            <button type="button" class="mm_btn T=primary" :disabled="!idFindable" @click="find">
                <b>아이디 찾기</b>
            </button>
        </div>
    </div>
    <!--// 하단버튼 -->

    <!-- 유의사항 -->
    <div class="m...find-popover">
        <h6><b>아이디/비밀번호를 찾지 못하셨나요?</b></h6>
        <button type="button" class="btn_help" :class="{ 'S=switch-on': isShowNote }" data-switch title="선택됨" @click="isShowNote = !isShowNote">
            <i class="ico_login-help" />
        </button>
        <div class="m...find-popover-item">
            <p>이메일과 휴대폰 번호로도 찾지 못하셨다면,<br> 아래 항목을 이메일로 보내주세요</p>
            <div>
                <p><strong>이름/연락처/생년월일 앞자리</strong></p>
                <p>예) 홍길동/01012345678/96(년생)</p>
            </div>
            <a
                class="btn_email"
                :href="`mailto:${shopInfo.cs.email}`"
                target="_blank"
                title="새 창 열림"
            >
                <b>{{ shopInfo.cs.email }}</b>
            </a>
            <p>고객센터 {{ shopInfo.cs.tel }}</p>
            <button type="button" class="btn_close" @click="isShowNote = false;">
                <i class="ico_popover-close" /><b class="mm_ir-blind">닫기</b>
            </button>
        </div>
    </div>
    <!--// 유의사항 -->
</template>
<script setup lang="ts">
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { computed, ref } from 'vue';
import MMRadio from '@/components/input/Radio.vue';
import { useIdFind } from '$/composables/auth/findComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const {
    router,
    usePageTitleSetting,
    globalConfigs
} = usePageContext();

usePageTitleSetting('아이디 찾기', ['로그인']);
const shopInfo = globalConfigs.value.shop;

const { 
    idFindForm,
    resetForm,
    findId,
} = useIdFind();
const isShowNote = ref<boolean>(false);
const idFindable = computed<boolean>(() => {
    const validEmail = /^.+@.+(.com|.net|.co.kr)$/.test(idFindForm.value.email);
    return idFindForm.value.name !== '' && (validEmail || idFindForm.value.phoneNumber !== '')
});

async function find() {
    try {
        mmon.loading.show();
        await idFindForm.value.validate();
        await findId();
        router.push({ 
            name: 'FindIdResult',
        });
    } catch (e) {
        defaultCatch(e)
    } finally {
        mmon.loading.hide();
    }
}
</script>