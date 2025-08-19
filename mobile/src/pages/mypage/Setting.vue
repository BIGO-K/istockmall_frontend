<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>설정</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_myset">
                            <template v-if="isUser">
                                <!-- 로그인정보 -->
                                <div class="m_myset-login">
                                    <p>{{ user?.loginId }}</p>
                                    <button type="button" class="mm_btn T=sm T=line" @click="logout">
                                        <b>로그아웃</b>
                                    </button>
                                </div>
                                <!--// 로그인정보 -->

                                <!-- 간편 로그인 연동관리 -->
                                <section v-if="connectedSocials?.isUsableConnect && hasUsableSocial" class="m_myset-sns">
                                    <h3 class="mm_strapline">
                                        <b>간편 로그인 연동관리</b>
                                    </h3>
                                    <ul class="m_my-sns">
                                        <li v-if="usableSocials.naver">
                                            <i class="ico_sns-naver" /><span>네이버</span>
                                            <button v-if="connectedSocials?.isNaverConnected" type="button" class="mm_btn T=sm T=lighter" @click="disConnectSocial('naver')">
                                                <b>연동해제</b>
                                            </button>
                                            <a v-else class="mm_btn T=sm T=line T=primary" href="#" target="_blank" title="새 창 열림" @click.prevent="connectSocial('naver')"><b>연동하기</b></a>
                                        </li>
                                        <li v-if="usableSocials.kakaotalk">
                                            <i class="ico_sns-kakao" /><span>카카오</span>
                                            <button v-if="connectedSocials?.isKakaoConnected" type="button" class="mm_btn T=sm T=lighter" @click="disConnectSocial('kakao')">
                                                <b>연동해제</b>
                                            </button>
                                            <a v-else class="mm_btn T=sm T=line T=primary" href="#" target="_blank" title="새 창 열림" @click.prevent="connectSocial('kakao')"><b>연동하기</b></a>
                                        </li>
                                        <li v-if="usableSocials.apple">
                                            <i class="ico_sns-apple" /><span>애플</span>
                                            <button v-if="connectedSocials?.isAppleConnected" type="button" class="mm_btn T=sm T=lighter" @click="disConnectSocial('apple')">
                                                <b>연동해제</b>
                                            </button>
                                            <a v-else class="mm_btn T=sm T=line T=primary" href="#" target="_blank" title="새 창 열림" @click.prevent="connectSocial('apple')"><b>연동하기</b></a>
                                        </li>
                                    </ul>
                                </section>
                                <!--// 간편 로그인 연동관리 -->
                            </template>
                            <template v-else>
                                <div class="m_myset-login">
                                    <p>로그인해 주세요</p>
                                    <MMLink :to="{ name: 'Login' }" class="mm_btn T=sm T=line T=primary">
                                        <b>로그인</b>
                                    </MMLink>
                                </div>
                            </template>
                            
                            <!-- 앱 전용 -->
                            <div class="m_myset-app">
                                <MMCheck 
                                    v-model="hasBioMetricLogin" 
                                    :is-t-switch="true"
                                    label="생체인증 로그인"
                                    @data-changed="toggleUsingBiometric"
                                />
                                <!-- 푸시 -->
                                <div class="mm_check-list">
                                    <ul>
                                        <li>
                                            <MMCheck 
                                                v-model="isReceivePush" 
                                                :is-t-switch="true"
                                                label="광고성(PUSH) 알림 수신"
                                                @data-changed="togglePushReceive"
                                            />
                                            <p>본 설정은 해당 기기에서만 유효하며, 수신 거절 시 정보성 알림도 발송되지 않습니다</p>
                                        </li>
                                        <li>
                                            <MMCheck 
                                                v-model="isReceiveNightPush" 
                                                :is-t-switch="true"
                                                label="야간 광고성(PUSH) 알림 수신"
                                                @data-changed="togglePushReceive"
                                            />
                                            <p>야간(오후9시 ~ 익일 오전8시)에도 알림 수신을 허용합니다</p>
                                        </li>
                                    </ul>
                                </div>
                                <!--// 푸시 -->

                                <!-- 버전 정보 -->
                                <section>
                                    <h3 class="mm_strapline">
                                        <b>버전 정보</b>
                                    </h3>
                                    <dl class="mm_flex">
                                        <dt>설치된 버전</dt>
                                        <dd>{{ currentAppVersion }}</dd>
                                    </dl>
                                    <dl class="mm_flex">
                                        <dt>최신 버전</dt>
                                        <dd>
                                            {{ appInfo?.recentAppVersion }}
                                            <a 
                                                v-if="appNeedUpdate && appUpdateLink" 
                                                class="mm_btn T=2xs T=line T=variable" 
                                                :href="appUpdateLink"
                                                target="_blank"
                                                title="새 창 열림"
                                            >
                                                <b>업데이트</b>
                                            </a>
                                        </dd>
                                    </dl>
                                </section>
                            <!--// 버전 정보 -->
                            </div>
                        <!--// 앱 전용 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                    <!-- 푸터 -->
                    <MMFooter />
                <!--// 푸터 -->
                </div>
            </div>
        </template>
    </MMSub>
</template>



<script setup lang='ts'>
import MMFooter from '@/components/Footer.vue';
import MMSub from '@/components/layout/Sub.vue'
import MMCheck from '@/components/input/Check.vue';
import { useRouter } from 'vue-router';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useConnectSocial, useLogout, useUserState } from '$/composables/auth/userComposable';
import { useUserAgent } from '$/composables/commonComposable';
import { useSetting } from '$/composables/appBridgeComposable';
import { computed, onBeforeMount, ref } from 'vue';
import { AppInfo } from '$/@type/nativeApp';
import { nativeAppRepository } from '$/repository/nativeAppRepository';

usePageTitleSetting('설정', ['마이페이지']);

/** VARIABLE */
const { user, isUser } = useUserState();
const { 
    usableSocials, 
    hasUsableSocial, 
    connectedSocials,
    disConnectSocial,
    connectSocial
} = useConnectSocial();

const { 
    currentAppVersion    
} = useUserAgent();

const { 
    hasBioMetricLogin,
    isReceivePush,
    isReceiveNightPush,
    toggleUsingBiometric,
    togglePushReceive,
    syncFirebaseToken,
    appUpdateLink
} = useSetting();

const router = useRouter();
const appInfo = ref<AppInfo|undefined>(undefined);

const appNeedUpdate = computed(() => {
    if (!appInfo.value) {
        return false
    }
    const recentAppVersion = appInfo.value?.recentAppVersion.replace(/\./gi, '').replace(/v/gi, '');
    const installedVersion = currentAppVersion.value.replace(/\./gi, '').replace(/v/gi, '')
    if (recentAppVersion > installedVersion) {
        return true;
    }

    return false;
})
/** FUNCTION */
/**
 * 로그아웃
 */
async function logout() {
    await router.push({ name: "Main" });
    Promise.all([
        useLogout(),
        syncFirebaseToken(),
    ])
}

/** VUE LIFE CYCLE */
onBeforeMount(async() => {
    try {
        appInfo.value = await nativeAppRepository.getAppInfo();
        
    } catch(e) {

    }
})
</script>
