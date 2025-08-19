<template>
    <div class="m_modal-sign-inquiry">
        <h6 class="mm_text-label">
            <b>이름</b>
        </h6>
        <MMInput
            v-model="name" 
            :place-holder-text="'이름을 입력하세요'"
            maxlength="10"
            type="text"
            @keydown.enter="guestOrderFind"
        />
        <h6 class="mm_text-label">
            <b>주문번호</b>
        </h6>
        <MMInput
            v-model="orderId" 
            :place-holder-text="'주문번호를 입력하세요'"
            maxlength="30"
            :data-type="'number'"
            type="text"
            @keydown.enter="guestOrderFind"
        />
        <!-- 하단버튼 -->
        <div class="mm_foot">
            <div class="mm_btn_box">
                <button type="button" class="mm_btn T=primary" @click="guestOrderFind">
                    <b>비회원 주문조회</b>
                </button>
            </div>
        </div>
        <!--// 하단버튼 -->
        <div class="m...inquiry-cs">
            <strong>고객센터<i class="ico_cs" /></strong>
            <p>
                <strong>{{ globalConfigs.shop.cs.tel }}</strong><br>
                {{ globalConfigs.shop.cs.time }}<br>
                점심시간 {{ globalConfigs.shop.cs.lunchTime }}
            </p>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { mmon } from '$/helper/mmon'
import { ref } from 'vue';
import { defaultCatch } from '$/functions'
import { useGlobalConfigs } from '$/composables/globalConfigComposable'
import { useGuestLogin } from '$/composables/auth/userComposable';
import { ModalCloseHandler } from '$/@type/Modal';

/** VARIABLE */
const props = defineProps<{
    closer: ModalCloseHandler<void>
}>()

const { globalConfigs } = useGlobalConfigs();
const name = ref<string>('');
const orderId = ref<string>(''); 

/** FUNCTION */
async function guestOrderFind() {
    if (name.value === '') {
        return mmon.bom.alert('이름을 입력해주세요.')
    } else if (!orderId.value) {
        return mmon.bom.alert('주문번호를 입력해주세요.')
    }

    mmon.loading.show()
    try {
        await useGuestLogin(name.value, orderId.value);
        props.closer();
    } catch (e) {
        defaultCatch(e)
    } finally {
        mmon.loading.hide()
    }
}

/** VUE LIFE CYCLE */

</script>