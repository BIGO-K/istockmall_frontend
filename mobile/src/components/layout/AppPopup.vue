<template>
    <div v-if="isShow" class="m_main-app">
        <div class="m_main-app-dim" />
        <!-- 앱이용권한안내 -->
        <!-- (D) 해당하는 앱 전용화면 노출 시 'm_main-app-item' 요소에 'S=on' 클래스를 추가합니다 -->
        <div :class="['m_main-app-item', 'm_main-app-access', {'S=on': isAppAccess}]">
            <div class="mm_scroller">
                <h3><b>{{ shopName }}<br>접근 권한이 필요합니다</b></h3>
                <ul>
                    <li><i class="ico_phone T=bold" /><p>기기 및 앱 기록<small>앱 오류 확인 및 사용성 개선</small></p></li>
                    <li><i class="ico_call" /><p>전화(선택)<small>고객센터 전화연결</small></p></li>
                    <li><i class="ico_photo" /><p>저장공간·사진(선택)<small>포토 상품평 작성</small></p></li>
                </ul>
                <div class="mm_btn_box">
                    <button type="button" class="mm_btn T=lg T=primary" @click="closeAppAccessPopup">
                        <b>확인</b>
                    </button>
                </div>
            </div>
        </div>
        <!--// 앱이용권한안내 -->

        <!-- 푸시알림 -->
        <div :class="['m_main-app-item', 'm_main-app-push', {'S=on': isAppPush}]">
            <div class="mm_scroller">
                <h3><b>푸시 알림을<br>설정하시겠습니까?</b></h3>
                <ul>
                    <li><i class="ico_noti" /><p>쇼핑 정보를 알려드립니다.</p></li>
                    <li><i class="ico_phone T=bold" /><p>알림 수신 동의는 해당 기기에서만 설정됩니다.</p></li>
                    <li><i class="ico_setup" /><p>전체메뉴 &#62; 설정에서 변경이 가능합니다.</p></li>
                </ul>
                <div class="mm_btn_box">
                    <button type="button" class="mm_btn T=lg T=primary" @click="updateDevicePushInfo">
                        <b>알림 ON</b>
                    </button>
                    <button type="button" class="btn_cancel" @click="cancelDevicePushInfo">
                        <b>아니요. 괜찮습니다</b>
                    </button>
                </div>
            </div>
        </div>
        <!--// 푸시알림 -->
    </div>
</template>
<script setup lang="ts">
import { mmon } from "$/helper/mmon";
import { ref } from 'vue';
import { nativeAppRepository } from '$/repository/nativeAppRepository';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import moment from 'moment';
import { useUserAgent } from "$/composables/commonComposable";

const { globalConfigs } = useGlobalConfigs();
const { setAccessApp, deviceInfo } = useUserAgent();

const isAppAccess = ref<boolean>(true);  // 접근 권한 팝업
const isAppPush = ref<boolean>(false);   // 푸시 알림 설정 팝업
const isShow = ref<boolean>(true);   
const shopName = ref(globalConfigs.value.shop.name);
const receivingDate = moment().format('YYYY년 MM월 DD일 hh시');
        
function closeAppAccessPopup() {
    isAppAccess.value = false;
    isAppPush.value = true;
}

async function updateDevicePushInfo() {
    if (deviceInfo.value == null) {
        return;
    }
    // 푸시알림 수신 알림 설정
    try {
        await nativeAppRepository.updatePushNotificationAgree(deviceInfo.value.token, deviceInfo.value.os, true, true);

        return mmon.bom.alert(`1.전송자 : ${shopName.value}\n2.수신일시 : ${receivingDate}\n처리내용 : 알림 수신 처리 완료\n\n설정 메뉴에서 알림 설정 변경 가능합니다.`, () => {
            closeAppPopup();
        });
    } catch(error) {
        console.log(error);
    }
}

async function cancelDevicePushInfo() {
    if (deviceInfo.value == null) {
        return;
    }
    // 푸시알림 수신 거부로 설정
    try {
        await nativeAppRepository.updatePushNotificationAgree(deviceInfo.value.token, deviceInfo.value.os, false, false);

        return mmon.bom.alert(`1.전송자 : ${shopName.value}\n2.수신일시 : ${receivingDate}\n처리내용 : 알림 수신거부 처리 완료\n\n설정 메뉴에서 알림 설정 변경 가능합니다.`, () => {
            closeAppPopup();
        });
    } catch(error) {
        console.log(error);
    }
}

async function closeAppPopup() {
    isAppPush.value = false;
    isShow.value = false;
    setAccessApp();
}
</script>