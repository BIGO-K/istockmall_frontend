<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>비회원 주문조회</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 비회원 주문조회 -->
                        <div class="m_popup-sign">
                            <h5 class="mm_text-label">
                                <b>이름</b>
                            </h5>
                            <MMInput 
                                v-model="name"
                                :place-holder-text="'이름을 입력하세요'"
                                maxlength="10"
                                type="text"
                            />
                            <h5 class="mm_text-label">
                                <b>주문번호</b>
                            </h5>
                            <MMInput 
                                v-model="orderId"
                                :place-holder-text="'주문번호를 입력하세요'"
                                maxlength="30"
                                :data-type="'number'"
                                type="text"
                            />
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <button type="button" class="mm_btn T=lg T=primary" @click="guestOrderFind">
                                        <b>비회원 주문조회</b>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!--// 비회원 주문조회 -->

                        <!-- 고객센터 운영시간 -->
                        <div class="m_popup-sign-order">
                            <div class="m...order-inner">
                                <i class="ico_cs" />
                                <p><strong>{{ shopInfo?.cs.tel }}</strong>{{ shopInfo?.cs.time }}<br>점심시간: {{ shopInfo?.cs?.lunchTime }}</p>
                            </div>
                        </div>
                        <!--// 고객센터 운영시간 -->
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { ShopInfo } from '$/@type/configs';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useGuestLogin } from '$/composables/auth/userComposable';

usePageTitleSetting('비회원 주문조회');
const { globalConfigs } = useGlobalConfigs();
const shopInfo = ref<ShopInfo>(globalConfigs.value.shop);

const router = useRouter();
const name = ref<string>('');
const orderId = ref<string>('');

async function guestOrderFind() {
    if (name.value === "") {
        return mmon.bom.alert("이름을 입력해주세요.");
    }
    else if (!orderId.value) {
        return mmon.bom.alert("주문번호를 입력해주세요.");
    }

    mmon.loading.show();
    try {
        await useGuestLogin(name.value, orderId.value);
        router.replace({
            name: 'GuestMyPageOrderList',
        }) 
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}
</script>
