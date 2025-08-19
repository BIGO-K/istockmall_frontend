<template>
    <iframe :src="liveLink" />    
</template>


<script setup lang="ts">
import { AuthUser } from '$/@type/auth/user';
import { computed, ComputedRef, inject, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { userRepository } from '$/repository/auth/userRepository';

const route = useRoute()
const router = useRouter();
const liveLink = ref<string>('');

function handlerLiveMessageEvent(e: MessageEvent) {
    if (e.origin !== 'https://player.sauceflex.com') {
        return 
    }
    const eventData = JSON.parse(e.data);
    const eventKey = eventData.key;

    switch (eventKey) {
    case 'sauceflexMoveExit' :
        router.replace(history.state.back || '/')
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
                redirect_to_after: `live-commerce/${route.params.roomId }`
            }
        }
    )
}

const user = inject('user') as ComputedRef<AuthUser>
const isUser = computed(() => user?.value !== undefined && user?.value !== null)

const accessLiveToken = ref('');
const basePlayerUrl = 'https://player.sauceflex.com/broadcast/'

onBeforeMount(async() => {
    liveLink.value = basePlayerUrl + route.params.roomId 
    if (isUser.value) {
        accessLiveToken.value = await userRepository.generateLiveCommerceToken();
        liveLink.value = liveLink.value + `?accessToken=${accessLiveToken.value}`
    }
});

onMounted(() => {
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