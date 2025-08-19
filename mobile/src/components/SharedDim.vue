<template>
    <div class="mm_sns">
        <div class="mm_sns-dim" />
        <div class="mm_sns-list" :style="{ top: `${positionTop}px` }">
            <ul>
                <li>
                    <button type="button" class="btn_sns-url" @click="copyPath">
                        <b>URL</b>
                    </button>
                </li>
                <li>
                    <a class="btn_sns-kakaotalk" href="#" target="_blank" title="새 창 열림" @click.prevent="kakaoShare">
                        <i class="ico_sns-kakao" /><b class="mm_ir-blind">카카오톡 공유</b>
                    </a>
                </li>
            </ul>
            <button
                type="button"
                class="btn_sns-close"
                @click="
                    () => {
                        close()
                        $emit('close')
                    }
                "
            >
                <i class="ico_sns-close" />
                <b class="mm_ir-blind">공유 모달 닫기</b>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mmon } from '$/helper/mmon'
import { usePageContext } from '$/composables/pageHandler/contextComposable'
import { useSnsShared } from '$/composables/shoppingComposable'
import { env } from '$/functions'

defineEmits(['close']);
const { route, globalConfigs } = usePageContext();
const { positionTop, close, sharedImageUrl, sharedTitle, sharedContent } = useSnsShared()

/** VARIABLE */
const shopName = ref(globalConfigs.value.shop.name);
const { Kakao } = window

kakaoInitialize();
function kakaoInitialize() {
    try {
        if (Kakao.isInitialized()) {
            return
        }
        Kakao.init(env('MM_API_KAKAO_JAVASCRIPT_KEY'))
    } catch(e) {
        console.error(e);
    }
}


/** FUNCTION */
function copyPath() {
    mmon.copy(location.href)
}

function kakaoShare() {        
    try {
        kakaoInitialize();
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: sharedTitle.value,
                description: `${sharedContent.value} #${shopName.value}`,
                imageUrl: sharedImageUrl.value,
                link: {
                    mobileWebUrl: env('MM_APP_URL') + route.fullPath,
                    webUrl: env('MM_APP_PC_URL') + route.fullPath,
                },
            },
        })
    } catch(e) {
        console.error(e);
        mmon.bom.alert('카카오톡 어플 실행에 실패 하였습니다.\n 재시도 부탁드립니다.');
    }
    
}


</script>