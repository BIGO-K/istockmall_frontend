<template>
    <div class="m_modal-live-media">
        <iframe :src="roomUrl" />
    </div>
</template>
<script setup lang='ts'>
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { ModalCloseHandler } from '$/@type/Modal';

defineProps<{
    roomUrl: string,
    closer: ModalCloseHandler<void>
}>();


const router = useRouter();

/** VARIABLE */

/** FUNCTION */
function handlerLiveMessageEvent(e: MessageEvent) {
    if (e.origin !== 'https://player.sauceflex.com') {
        return 
    }
    const eventData = JSON.parse(e.data);
    const eventKey = eventData.key;

    switch (eventKey) {
    case 'sauceflexMoveExit' :
        history.back();
        break;
    case 'sauceflexMoveLogin' : 
        goToLoginPage();
        break;
    case 'sauceflexMoveBanner' :
        location.href = eventData.params.linkUrl;
        break;
    case 'sauceflexMoveProduct' :
        location.href = eventData.params.linkUrl;
        break;
    case 'sauceflexOnShare' :
        // TODO 공유하기 레이어 구성 필요 
        break;
    default :
        break;
    }
}

function goToLoginPage() {
    router.push(
        {
            name : 'Login',
            query: {
                redirect_to_after: `live-commerce`
            }
        }
    )
}

/** VUE LIFE CYCLE */
onMounted(async() => {
    window.addEventListener(
        'message',
        handlerLiveMessageEvent,
        false
    );
})

onBeforeUnmount(() => {
    window.removeEventListener(
        'message',
        handlerLiveMessageEvent,
        false
    );
})

</script>